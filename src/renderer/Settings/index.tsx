import React, { useEffect, useState } from 'react';

interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  productId?: string;
  vendorId?: string;
}

const SerialPortConfig: React.FC = () => {
  const [path, setPath] = useState<string>('');
  const [baudRate, setBaudRate] = useState<number>(9600);
  const [dataBits, setDataBits] = useState<number>(8);
  const [parity, setParity] = useState<string>('none');
  const [stopBits, setStopBits] = useState<number>(1);
  const [ports, setPorts] = useState<SerialPortInfo[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.send('list-serial-ports');

    const handleSerialPortsList = (_event: any, ports: unknown) => {
      console.log('SER; ', _event, ports);
      setPorts(ports as SerialPortInfo[]);
    };

    const removeListener = window.electron.ipcRenderer.on(
      'serial-ports-list',
      handleSerialPortsList,
    );

    return () => {
      removeListener();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const config = {
      path,
      baudRate,
      dataBits,
      parity,
      stopBits,
      autoOpen: true,
    };
    console.log('Serial Port Configuration:', config);
    window.electron.ipcRenderer.send('save-serial-config', config);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Serial Port Configuration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Port Name</label>
          <select
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="w-full mt-2 p-2 border rounded-md"
            required
          >
            <option value="" disabled>
              Select a port
            </option>
            {ports?.map((port) => (
              <option key={port.path} value={port.path}>
                {port.path} {port.manufacturer ? `(${port.manufacturer})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Baud Rate</label>
          <select
            value={baudRate}
            onChange={(e) => setBaudRate(parseInt(e.target.value))}
            className="w-full mt-2 p-2 border rounded-md"
            required
          >
            <option value={9600}>9600</option>
            <option value={19200}>19200</option>
            <option value={38400}>38400</option>
            <option value={57600}>57600</option>
            <option value={115200}>115200</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Data Bits</label>
          <select
            value={dataBits}
            onChange={(e) => setDataBits(parseInt(e.target.value))}
            className="w-full mt-2 p-2 border rounded-md"
            required
          >
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Parity</label>
          <select
            value={parity}
            onChange={(e) => setParity(e.target.value)}
            className="w-full mt-2 p-2 border rounded-md"
            required
          >
            <option value="none">None</option>
            <option value="even">Even</option>
            <option value="odd">Odd</option>
            <option value="mark">Mark</option>
            <option value="space">Space</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Stop Bits</label>
          <select
            value={stopBits}
            onChange={(e) => setStopBits(parseInt(e.target.value))}
            className="w-full mt-2 p-2 border rounded-md"
            required
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};

export default SerialPortConfig;
