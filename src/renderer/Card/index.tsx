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
          backgroundColor: card.color || '#FFFFFF',
          opacity: '0.1',
        }}
        className="absolute inset-0 rounded-lg"
      ></div>
      <div className="relative z-10">
        <h3 className="font-bold">{card.name}</h3>
        {card.description && <p>{card.description}</p>}
        <p className="text-sm ">{card.output_params.length > 0 ? 'Input' : 'Output'}</p>
        <p className="text-sm"><em>{card.input_params.map((param) => param.name).join(',')}</em></p>
      </div>
    </div>
  );
};

export default Card;
