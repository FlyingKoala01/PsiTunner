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

  return (
    <div className="p-4 border-l">
      {selectedCards.map((card) => (
        <div className="p-4 border h-36 my-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="font-bold">{card.sensor_name}</h3>
            <p>{card.sensor_type}</p>
            {card.description && <p>{card.description}</p>}
            {card.type === 'input' ? (
              <input
                type="text"
                className="mt-2 p-2 border rounded"
                value={inputValues[card.sensor_name] || ''}
                onChange={(e) =>
                  handleInputChange(card.sensor_name, e.target.value)
                }
              />
            ) : (
              <p className="mt-2">
                Value: {inputValues[card.sensor_name] || 'N/A'}
              </p>
            )}
          </div>
          <button
            className="ml-4 p-2 bg-red-500 text-white rounded"
            onClick={() => onCardRemove(card)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default RightTable;
