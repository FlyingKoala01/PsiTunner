import React, { useEffect } from 'react';
import { CardType } from '../types';
import { signalTypeColors } from '../../main/colorMapping';

interface DragPreviewProps {
  card: CardType;
  position: { x: number; y: number };
}

const DragPreview: React.FC<DragPreviewProps> = ({ card, position }) => {
  useEffect(() => {
    console.log('POSITION: ', position);
  }, [position]);

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        opacity: 0.7,
        zIndex: 1000,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="p-4 border rounded-lg shadow cursor-pointer relative">
        <div className="relative z-10">
          <h3 className="font-bold">{card.sensor_name}</h3>
          <p>{card.sensor_type}</p>
          {card.description && <p>{card.description}</p>}
          <p className="text-sm text-gray-500">
            {card.type === 'input' ? 'Input' : 'Output'}
          </p>
          {card.type === 'input' && (
            <p className="text-sm text-white">{card.signal_type}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DragPreview;
