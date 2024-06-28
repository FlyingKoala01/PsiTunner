import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { SerialPort } from 'serialport';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let port: SerialPort | null = null;
const configPath = path.join(app.getPath('userData'), 'serialConfig.json');

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('submit-support-form', async (event, formData) => {
  const { title, description, evidence } = formData;

  /*
  let transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  let mailOptions = {
    from: 'your-email@gmail.com',
    to: 'support-email@example.com',
    subject: `Support Request: ${title}`,
    text: description,
    attachments: evidence
      ? [
          {
            filename: evidence.name,
            path: evidence.path,
          },
        ]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    event.reply('support-form-submission-response', { success: true });
  } catch (error) {
    event.reply('support-form-submission-response', { success: false });
  }
    */
});

ipcMain.on('save-serial-config', (event, config) => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  initializeSerialPort();
});

ipcMain.on('check-serial-connection', () => {
  if (port && port.isOpen) {
    mainWindow?.webContents.send('serial-status', true);
  } else {
    mainWindow?.webContents.send('serial-status', false);
  }
});

ipcMain.on('list-serial-ports', async (event) => {
  try {
    const ports = await SerialPort.list();
    console.log('Available serial ports:', ports); // Add this logging
    event.reply('serial-ports-list', ports);
  } catch (error) {
    console.error('Error listing serial ports:', error);
    event.reply('serial-ports-list', []);
  }
});

const initializeSerialPort = () => {
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    if (port) {
      port.close();
    }

    port = new SerialPort({
      path: config.path,
      baudRate: config.baudRate,
      dataBits: config.dataBits,
      parity: config.parity,
      stopBits: config.stopBits,
      autoOpen: true,
    });

    port.on('open', () => {
      mainWindow?.webContents.send('serial-status', true);
    });

    port.on('error', (err: Error) => {
      console.error('SerialPort error:', err);
      mainWindow?.webContents.send('serial-status', false);
    });

    port.on('close', () => {
      mainWindow?.webContents.send('serial-status', false);
    });
  } else {
    console.warn('Serial configuration file not found');
  }
};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.ico'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  initializeSerialPort();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
