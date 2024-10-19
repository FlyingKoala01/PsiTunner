import { createRoot } from 'react-dom/client';
import App from './App';
import { ApplicationConfigIface } from './preload';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

export var ApplicationConfig: ApplicationConfigIface = {
  current_serial_device: null,
  available_serial_devices: [],
  last_measures: {},
  last_output_params: {},
};

export function sendSerial(message:string) {
  window.electron.ipcRenderer.sendMessage('sendSerial', message);
}

export function connect(device:string) {
  window.electron.ipcRenderer.sendMessage('connectTo', device);
}

window.electron.ipcRenderer.on('serial-ports-list', (list) => {
  //console.log('Available devices list:', list);
  if (list instanceof Array)
    ApplicationConfig.available_serial_devices = list;
});

window.electron.ipcRenderer.on('serial-status', (path) => {
  //console.log('Available devices list:', list);
  if (path===null || typeof path === 'string')
    ApplicationConfig.current_serial_device = path;
});

window.electron.ipcRenderer.on('serial-data', (data) => {
  if (!(data instanceof Uint8Array) || data.length == 0) return;
  let first_char = String.fromCharCode(data[0]);

  if (first_char === 'Z') {
    console.log(data.toString(), new TextDecoder().decode(data));
  }
  else if (first_char !== 'M') {
    ApplicationConfig.last_measures[first_char] = new TextDecoder().decode(data).substring(1);
  }
});

window.electron.ipcRenderer.on('send-serial-error', (command) => {
  alert('Command was not sent successfully: ' + command);
});

console.log('Ready!');
