import React, { useEffect } from 'react';
import { CardType } from '../types';
import { signalTypeColors } from '../../main/colorMapping';

interface CardProps {
  card: CardType;
  onCardSelect: (card: CardType) => void;
  onDragStart: (card: CardType) => void;
}

const Card: React.FC<CardProps> = ({ card, onCardSelect, onDragStart }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('card', JSON.stringify(card));
    onDragStart(card);
  };

  const handleDragEnd = () => {
    onDragStart(null as any); // set dragging card to null when drag ends
  };

  return (
    <div
      className="p-4 border rounded-lg shadow cursor-pointer relative text-black"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onCardSelect(card)}
    >
      <div
        style={{
          backgroundColor: signalTypeColors[card.signal_type] || '#FFFFFF',
          opacity: '0.1',
        }}
        className="absolute inset-0 rounded-lg"
      ></div>
      <div className="relative z-10">
        <h3 className="font-bold">{card.sensor_name}</h3>
        <p>{card.sensor_type}</p>
        {card.description && <p>{card.description}</p>}
        <p className="text-sm ">{card.type === 'input' ? 'Input' : 'Output'}</p>
        {card.type === 'input' && <p className="text-sm">{card.signal_type}</p>}
      </div>
    </div>
  );
};

export default Card;
