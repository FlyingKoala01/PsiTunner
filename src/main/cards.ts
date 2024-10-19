import { CardType } from '../renderer/types';

export const initialCards: CardType[] = [
  {
    name: 'CAM',
    serial_prefix: '0',
    color: '#FF00FF',
    output_params: [{
      name: 'RPM',
      value_type: 'uint16_t',
      range_min: 0,
      range_max: 1000,
      units: 'rpm',
      precision_decimals: 0
    }],
    input_params: [
      {
        name: 'RPM',
        value_type: 'uint16_t',
        range_min: 0,
        range_max: 1000,
        units: 'rpm',
        precision_decimals: 0,
      },
      {
        name: 'Frequency',
        value_type: 'float',
        range_min: 0,
        range_max: 1000,
        precision_decimals: 0,
        units: 'Hz',
      }
    ],
  },
  {
    name: 'Fuel pump',
    serial_prefix: 'F',
    color: '#00FFFF',
    output_params: [],
    input_params: [
      {
        name: 'Status',
        value_type: 'bool',
        range_min: 0,
        range_max: 1,
        precision_decimals: 0
      }
    ],
  },
];
