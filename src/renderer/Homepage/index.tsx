import React, { useState } from 'react';
import { CardType } from '../types';
import LeftTable from '../Lefttable';
import RightTable from '../Righttable';
import DragPreview from '../Dragpreview';
import useDragPosition from '../../main/useDragPosition';
import { initialCards } from '../../main/cards';
import logo from '../../../assets/icons/js-logo.png';

const HomePage: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>(initialCards);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [draggingCard, setDraggingCard] = useState<CardType | null>(null);
  const [isOverRightColumn, setIsOverRightColumn] = useState(false);
  const dragPosition = useDragPosition();

  const handleCardSelect = (card: CardType) => {
    if (!selectedCards.find((c) => c.name === card.name)) {
      setSelectedCards((prevSelectedCards) => [...prevSelectedCards, card]);
      setCards((prevCards) =>
        prevCards.filter((c) => c.name !== card.name),
      );
      setDraggingCard(null);
      window.sendSerial('X' + card.serial_prefix);
    }
  };

  const handleCardRemove = (card: CardType) => {
    setSelectedCards((prevSelectedCards) =>
      prevSelectedCards.filter((c) => c.name !== card.name),
    );
    setCards((prevCards) => [...prevCards, card]);
    window.sendSerial('Y' + card.serial_prefix);
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
    <div className="flex flex-col h-screen relative">
      <div
        className="absolute inset-0 bg-no-repeat bg-center opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundSize: '20%',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/3 overflow-y-auto h-full">
          <LeftTable
            cards={cards}
            onCardSelect={handleCardSelect}
            onDragStart={handleDragStart}
          />
        </div>
        <div
          className="w-2/3 relative overflow-y-auto h-full"
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
      </div>
      {draggingCard && (
        <DragPreview card={draggingCard} position={dragPosition} />
      )}
    </div>
  );
};

export default HomePage;
