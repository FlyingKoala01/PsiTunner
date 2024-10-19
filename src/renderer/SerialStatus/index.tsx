import { clear } from 'console';
import React, { useEffect, useState } from 'react';

const SerialStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionChange, setConnectionChange] = useState<boolean>(false);
  const [deviceList, setDeviceList] = useState<Array<string>>([]);
  const [chosenDevice, setChosenDevice] = useState<string | null>(null);

  useEffect(() => {
    let i = setInterval(() => {
      if (chosenDevice === null && window.ApplicationConfig.current_serial_device) {
        setChosenDevice(window.ApplicationConfig.current_serial_device);
      }
      setDeviceList(window.ApplicationConfig.available_serial_devices);
      if (window.ApplicationConfig.current_serial_device == chosenDevice) {
        setConnectionChange(false);
      }
      setIsConnected(!!window.ApplicationConfig.current_serial_device && !connectionChange);
    }, 200);
    return () => clearInterval(i);
  })

  function clickedDevice(event:any) {
    let device:string = event?.target.value;
    setChosenDevice(device);
    setConnectionChange(true);
    setIsConnected(false);
    window.connect(device);
  }

  return (
    <div className='flex flex-row'>
      <h2>Device</h2>
      <select onChange={clickedDevice} value={chosenDevice || ''}>
      <option value=""></option>
        {deviceList.map((device) => (
          <option key={device} value={device}>
            {device}
          </option>
        ))}
      </select>
      <div className='flex items-center'>
        <div
          style={{
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            backgroundColor: isConnected ? 'green' : 'red',
            marginLeft: '5px',
          }}
        ></div>
      </div>
    </div>
  );
};

export default SerialStatus;
