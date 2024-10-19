import React, { useState, useEffect } from 'react';
import { CardType } from '../types';
import { parse } from 'path';

interface RightTableProps {
  selectedCards: CardType[];
  onCardRemove: (card: CardType) => void;
}

const RightTable: React.FC<RightTableProps> = ({
  selectedCards,
  onCardRemove,
}) => {
  const [inputValues, setInputValues] = useState<{ [key: string] : { [key: string]: string} }>({});
  const [outputValues, setOutputValues] = useState<{ [key: string] : { [key: string]: string} }>({});

  const handleOutputChange = (card: CardType, param_name: string, value: string) => {
    setOutputValues((prevValues) => ({
      ...prevValues,
      [card.name]: {
        ...prevValues[card.name],
        [param_name]: value.toString(),
      }
    }));
    let outputParams = card.output_params.map((param) => {
      let param_value = parseFloat(outputValues?.[card.name]?.[param.name]);
      if (param.name == param_name) param_value = parseFloat(value);
      if (param.value_type == 'bool' || param.value_type == 'uint16_t') {
        return Math.round(param_value);
      }
      else { // Float
        return param_value.toFixed(param.precision_decimals);
      }
    }).join(',');
    window.ApplicationConfig.last_output_params[card.serial_prefix] = outputParams;
    window.sendSerial(card.serial_prefix + outputParams);
  };

  useEffect(() => {
    let i = setInterval(() => {
      selectedCards.forEach( (card) => {
        let last_measures = window.ApplicationConfig.last_measures[card.serial_prefix];

        if (typeof last_measures === 'string') {
          let split_measures = last_measures.split(',');
          let parsed_values : {[key: string]: string} = {};

          for (let i = 0; i<card.input_params.length; i++) {
            if (split_measures.length <= i) break;
            let value = split_measures[i];

            if (card.input_params[i].value_type == 'bool') {
              value = value=='1' ? 'True' : 'False';
            }

            parsed_values[card.input_params[i].name] = value;
          }

          setInputValues((prevValues) => ({
            ...prevValues,
            [card.name]: parsed_values,
          }));
        }
      });
    }, 200);
    return () => {clearInterval(i)};
  })

  const hexToRgb = (hex:string) => {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const hexToRgba = (hex:string) => {
    const rgbColor = hexToRgb(hex);
    if (rgbColor)
      return `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1)`;
    else
      return 'rgba(255, 255, 255, 0.1);';
  };

  return (
    <div className="p-4 border-l">
      {selectedCards.map((card) => (
        <div key={card.name + '_right'} className="p-4 border h-40 my-4 w-full rounded-lg shadow"
        style={{
          backgroundColor: hexToRgba(card.color || '#FFFFFF'),
        }}>
          <div>
            <div className="flex align-middle">
              <h3 className="font-bold text-2xl">{card.name}</h3>
              <p className="text-sm ps-2 italic" style={{'marginTop': '0.5rem'}}>{card.output_params.length > 0 ? 'Input' : 'Output'}</p>
              <button
                className="ml-4 p-1 my-2 bg-red-500 text-white rounded text-xs"
                onClick={() => onCardRemove(card)}
              >
                Remove
              </button>
            </div>
            {card.description && <p>{card.description}</p>}
            <hr className="pb-2"/>
            {card.output_params.map((param) => (
              <div className="flex mb-2" key={card.name + '_out_' + param.name}>
                <p className="pe-3">{param.name}:</p>
                <input
                  type="text"
                  className="border rounded text-xs"
                  value={outputValues?.[card.name]?.[param.name] || ''}
                  onChange={(e) =>
                    handleOutputChange(card, param.name, e.target.value)
                  }
                />
                <p className="ps-3">{param.units || param.name}</p>
              </div>
            ))}
            {card.output_params.length > 0 ? (<hr className="pb-2"/>) : ''}
            <div className="flex">
              {card.input_params.map((param) => (
                <p className="mt-2 pe-3" key={card.name + '_in_' + param.name}>
                  {param.name}: <b>{inputValues?.[card.name]?.[param.name] || 'N/A'}</b>
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RightTable;
