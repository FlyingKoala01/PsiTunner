export interface CardType {
  sensor_name: string;
  sensor_type: string;
  description?: string;
  type: 'input' | 'output';
  signal_type: string;
}

export interface IpcRenderer {
  sendMessage(channel: string, ...args: unknown[]): void;
  on(channel: string, func: (...args: unknown[]) => void): () => void;
  once(channel: string, func: (...args: unknown[]) => void): void;
}

export interface ElectronHandler {
  ipcRenderer: IpcRenderer;
}

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}
