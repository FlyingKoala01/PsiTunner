import { CardType } from '../renderer/types';

export const initialCards: CardType[] = [
  {
    sensor_name: 'Cam',
    sensor_type: '58X',
    signal_type: 'Digital Frequency',
    type: 'input',
  },
  {
    sensor_name: 'Crank',
    sensor_type: '58X',
    signal_type: 'Digital Frequency',
    type: 'input',
  },
  {
    sensor_name: 'MAF',
    sensor_type: 'HotWire',
    signal_type: 'Digital Frequency',
    type: 'input',
  },
  {
    sensor_name: 'Map',
    sensor_type: 'Transducer',
    signal_type: 'Analog',
    type: 'input',
  },
  {
    sensor_name: 'Oil Press.',
    sensor_type: 'Transducer',
    signal_type: 'Analog',
    type: 'input',
  },
  {
    sensor_name: 'TPS 1',
    sensor_type: 'Potentiometer (pull-up)',
    signal_type: 'Analog',
    type: 'input',
  },
  {
    sensor_name: 'TPS 1',
    sensor_type: 'Potentiometer (pull-down)',
    signal_type: 'Analog',
    type: 'input',
  },
  {
    sensor_name: 'APP 1',
    sensor_type: 'Potentiometer (pull-down)',
    signal_type: 'Analog',
    type: 'input',
  },
  {
    sensor_name: 'APP 2',
    sensor_type: 'Potentiometer (pull-down)',
    signal_type: 'Analog',
    type: 'input',
  },
  {
    sensor_name: 'Oxygen Sensor',
    sensor_type: 'Narrow-band',
    signal_type: 'Analog',
    type: 'input',
  },
  {
    sensor_name: 'IAT',
    sensor_type: 'Negative Coefficient Thermistor',
    signal_type: 'Resistance',
    type: 'input',
  },
  {
    sensor_name: 'ECT',
    sensor_type: 'Negative Coefficient Thermistor',
    signal_type: 'Resistance',
    type: 'input',
  },
  {
    sensor_name: 'VSS',
    sensor_type: 'Variable Reluctor (AC Sine Wave)',
    signal_type: 'Frequency?/Voltage',
    type: 'input',
  },
  {
    sensor_name: 'Alternator Field',
    sensor_type: '--',
    signal_type: 'Boolean',
    type: 'input',
  },
  {
    sensor_name: 'Fuel Pump Trigger',
    sensor_type: 'High-side driver',
    signal_type: 'Digital',
    type: 'output',
  },
  {
    sensor_name: 'Coils',
    sensor_type: 'High-side driver',
    signal_type: 'Digital',
    type: 'output',
  },
  {
    sensor_name: 'Injectors',
    sensor_type: 'Low-side driver',
    signal_type: 'Digital',
    type: 'output',
  },
  {
    sensor_name: 'Speedometer',
    sensor_type: 'Square-wave',
    signal_type: 'Digital Frequency',
    type: 'output',
  },
  {
    sensor_name: 'Tachometer',
    sensor_type: 'Square-wave',
    signal_type: 'Digital Frequency',
    type: 'output',
  },
  {
    sensor_name: 'Alternator Excite (L)',
    sensor_type: 'Current Limited High',
    signal_type: 'Digital',
    type: 'output',
  },
  {
    sensor_name: 'Fans',
    sensor_type: 'Low-side',
    signal_type: 'Digital',
    type: 'output',
  },
  {
    sensor_name: 'GM Lan +',
    sensor_type: 'CAN BUS (High-Speed GMLAN)',
    signal_type: 'Module',
    type: 'output',
  },
  {
    sensor_name: 'GM Lan -',
    sensor_type: 'CAN BUS (High-Speed GMLAN)',
    signal_type: 'Module',
    type: 'output',
  },
  {
    sensor_name: 'VVT',
    sensor_type: 'High-side driver',
    signal_type: 'Analog?',
    type: 'output',
  },
];
