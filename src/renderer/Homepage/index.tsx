import React, { useState } from 'react';
import { CardType } from '../types';
import LeftTable from '../Lefttable';
import RightTable from '../Righttable';
import DragPreview from '../Dragpreview';
import useDragPosition from '../../main/useDragPosition';
import { initialCards } from '../../main/cards';

const HomePage: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>(initialCards);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [draggingCard, setDraggingCard] = useState<CardType | null>(null);
  const [isOverRightColumn, setIsOverRightColumn] = useState(false);
  const dragPosition = useDragPosition();

  const handleCardSelect = (card: CardType) => {
    if (!selectedCards.find((c) => c.sensor_name === card.sensor_name)) {
      setSelectedCards((prevSelectedCards) => [...prevSelectedCards, card]);
      setCards((prevCards) =>
        prevCards.filter((c) => c.sensor_name !== card.sensor_name),
      );
      setDraggingCard(null);
    }
  };

  const handleCardRemove = (card: CardType) => {
    setSelectedCards((prevSelectedCards) =>
      prevSelectedCards.filter((c) => c.sensor_name !== card.sensor_name),
    );
    setCards((prevCards) => [...prevCards, card]);
  };

  const handleDragStart = (card: CardType) => {
    setDraggingCard(card);
  };

  const handleDragOverRight = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isOverRightColumn) {
      setIsOverRightColumn(true);
    }
  };

  const handleDragLeaveRight = () => {
    setIsOverRightColumn(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const card = JSON.parse(e.dataTransfer.getData('card')) as CardType;
    handleCardSelect(card);
    setIsOverRightColumn(false);
  };

  return (
    <div className="flex h-screen relative">
      <div className="w-1/3 overflow-y-auto">
        <LeftTable
          cards={cards}
          onCardSelect={handleCardSelect}
          onDragStart={handleDragStart}
        />
      </div>
      <div
        className="w-2/3 relative"
        onDrop={handleDrop}
        onDragOver={handleDragOverRight}
        onDragLeave={handleDragLeaveRight}
      >
        <RightTable
          selectedCards={selectedCards}
          onCardRemove={handleCardRemove}
        />
        {isOverRightColumn && (
          <div
            className="absolute left-0 right-0"
            style={{
              top: `${selectedCards.length * 10}rem`,
              height: '10rem',
              padding: '1rem',
              margin: '1rem 0',
            }}
          >
            <div className="w-full h-full bg-black bg-opacity-25 rounded"></div>
          </div>
        )}
      </div>
      {draggingCard && (
        <DragPreview card={draggingCard} position={dragPosition} />
      )}
    </div>
  );
};

export default HomePage;
