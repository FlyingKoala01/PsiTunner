export interface CardType {
  name: string;
  kind?: string;
  description?: string;
  color?: string;
  serial_prefix: string;
  output_params: Array<ParamType>;
  input_params: Array<ParamType>;
}

export interface ParamType {
  name: string;
  value_type: string;
  range_min: number;
  range_max: number;
  precision_decimals: number;
  units?: string;
}
