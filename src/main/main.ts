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

const sendConnectionStatus = () => {
  if (port && port.isOpen) {
    mainWindow?.webContents.send('serial-status', port.path);
  } else {
    mainWindow?.webContents.send('serial-status', null);
  }
};

const filter_paths = (paths : Array<string>) => {
  let result : Array<string> = [];
  paths.forEach(path => {
    if (path.startsWith('/dev/ttyACM') || path.startsWith('/dev/ttyACM') || path.startsWith('COM'))
    result.push(path);
  });
  return result;
}

const sendSerialStatus = () => {
  try {
    SerialPort.list().then( ports => {
      let paths = filter_paths(ports.map(port => port.path));
      //console.log('Available serial ports:', paths);
      mainWindow?.webContents.send('serial-ports-list', paths);
    });
  } catch (error) {
    console.error('Error listing serial ports:', error);
    mainWindow?.webContents.send('serial-ports-list', []);
  }
}

const connectToPath = (path:string) => {
  if (port && port.isOpen) {
    port.close();
  }

  if (!path) return true;

  port = new SerialPort({
    path: path,
    baudRate: 115200
  });

  port.on('error', (err: Error) => {
    console.error('SerialPort error:', err);
  });

  let data_buffer = new Uint8Array(1024);
  let current_next_pos = 0;
  
  port.on('data', (data: Buffer) => {
    // Ensure the new data will fit in the buffer
    let new_data = new Uint8Array(data);
    
    if (current_next_pos + new_data.length <= data_buffer.length) {
      data_buffer.set(new_data, current_next_pos); // Copy new data into the buffer
      current_next_pos += new_data.length;
  
      let last_newline_pos;
      while ((last_newline_pos = data_buffer.slice(0, current_next_pos).indexOf(10, 0)) !== -1) { // 10 is newline '\n'
        let final_data = data_buffer.slice(0, last_newline_pos); // Take data up to '\n'
  
        // Check if the previous character is '\r' and remove it
        if (final_data[final_data.length - 1] === 13) { // 13 is carriage return '\r'
          final_data = final_data.slice(0, final_data.length - 1);
        }

        mainWindow?.webContents.send('serial-data', final_data);
  
        // Move the remaining data in the buffer to the start
        let remaining_data = data_buffer.slice(last_newline_pos + 1, current_next_pos);

        data_buffer.set(remaining_data, 0);
        current_next_pos = remaining_data.length; // Update position for remaining data
      }
    } else {
      console.error('Buffer overflow');
    }
  });  
  
  return true;
}

const loadConfig = () => {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } else {
    return {};
  }
};

const saveConfig = (config:object) => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('Saved config.');
};

ipcMain.on('connectTo', (event, path) => {
  let config = loadConfig();
  if(connectToPath(path)) {
    config.path = path;
    saveConfig(config);
  }
});

ipcMain.on('sendSerial', (event, command) => {
  if (port && port.isOpen) {
    port.write(new TextEncoder().encode(command + '\n'));
  }
  else {
    mainWindow?.webContents.send('send-serial-error', command);
  }
});

const initializeSerialPort = () => {
  const config = loadConfig();
  if (config.path) {
    connectToPath(config.path);
  } else {
    mainWindow?.webContents.send('serial-status', null);
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
  setInterval(sendSerialStatus, 3000);
  setInterval(sendConnectionStatus, 2000);

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
