import React, { useEffect, useState } from 'react';

const SerialStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    window.electron.ipcRenderer.send('check-serial-connection');

    const removeListener = window.electron.ipcRenderer.on(
      'serial-status',
      (_event, status: unknown) => {
        setIsConnected(status as boolean);
      },
    );

    return () => {
      removeListener();
    };
  }, []);

  return (
    <div className='flex flex-row'>
      <h2>Serial Device Status</h2>
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
