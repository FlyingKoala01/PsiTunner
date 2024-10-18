import { ElectronHandler } from '../main/preload';

declare global {
  interface Window {
    electron: ElectronHandler;
    ApplicationConfig: ApplicationConfigIface;
    connect:Function;
  }
}

export interface ApplicationConfigIface {
  current_serial_device: string | null;
  available_serial_devices: string[];
}

export {};
