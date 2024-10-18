import { clear } from 'console';
import React, { useEffect, useState } from 'react';

const SerialStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [deviceList, setDeviceList] = useState<Array<string>>([]);
  const [chosenDevice, setChosenDevice] = useState<string>('');

  useEffect(() => {
    let i = setInterval(() => {
      setDeviceList(window.ApplicationConfig.available_serial_devices);
      setIsConnected(chosenDevice != '' && window.ApplicationConfig.current_serial_device == chosenDevice)
    }, 500);
    return () => clearInterval(i);
  })

  function clickedDevice(event:any) {
    let device:string = event?.target.value;
    setChosenDevice(device);
    setIsConnected(false);
    window.connect(device);
    console.log('aaa');
  }

  return (
    <div className='flex flex-row'>
      <h2>Device</h2>
      <select onChange={clickedDevice}>
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
