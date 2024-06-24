import { useEffect, useState } from 'react';

const useDragPosition = () => {
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      setDragPosition({ x: e.pageX, y: e.pageY });
    };

    window.addEventListener('dragover', handleDragOver);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
    };
  }, []);

  return dragPosition;
};

export default useDragPosition;
