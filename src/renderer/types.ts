export interface CardType {
  sensor_name: string;
  sensor_type: string;
  description?: string;
  type: 'input' | 'output';
  signal_type: string;
}
