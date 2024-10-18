import React from 'react';
import { CardType } from '../types';
import Card from '../Card';

interface LeftTableProps {
  cards: CardType[];
  onCardSelect: (card: CardType) => void;
  onDragStart: (card: CardType) => void;
}

const LeftTable: React.FC<LeftTableProps> = ({
  cards,
  onCardSelect,
  onDragStart,
}) => {
  return (
    <div className="p-4 space-y-4">
      {cards.map((card) => (
        <Card
          card={card}
          key={card.sensor_name + Math.random()} // Temporary solution to avoid an ugly warning
          onCardSelect={onCardSelect}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
};

export default LeftTable;
