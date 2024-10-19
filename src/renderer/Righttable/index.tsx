import React, { useState } from 'react';
import { CardType } from '../types';

interface RightTableProps {
  selectedCards: CardType[];
  onCardRemove: (card: CardType) => void;
}

const RightTable: React.FC<RightTableProps> = ({
  selectedCards,
  onCardRemove,
}) => {
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  const handleInputChange = (sensor_name: string, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [sensor_name]: value,
    }));
  };

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
              <div className="flex" key={card.name + param.name}>
                <p className="pe-3">{param.name}:</p>
                <input
                  type="text"
                  className="mt-2 p-2 border rounded text-xs"
                  value={inputValues[card.name] || ''}
                  onChange={(e) =>
                    handleInputChange(card.name, e.target.value)
                  }
                />
                <p className="pe-3">{param.units || param.name}</p>
              </div>
            ))}
            {card.output_params.length > 0 ? (<hr className="pb-2"/>) : ''}
            <div className="flex">
              {card.input_params.map((param) => (
                <p className="mt-2 pe-3">
                  {param.name}: <b>{inputValues[param.name] || 'N/A'}</b>
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
