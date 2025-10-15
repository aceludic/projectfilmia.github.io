import React, { useRef, useCallback } from 'react';

interface MinimizedTimerProps {
  remainingSeconds: number;
  duration: number;
  position: { x: number, y: number };
  onPositionChange: (pos: { x: number, y: number }) => void;
  onMaximize: () => void;
  onExit: (timeSpent: number) => void;
}

const formatTime = (seconds: number) => {
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};


const MinimizedTimer: React.FC<MinimizedTimerProps> = ({ remainingSeconds, duration, position, onPositionChange, onMaximize, onExit }) => {
  const timerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!timerRef.current) return;
    e.preventDefault();
    
    const startPos = { x: e.clientX, y: e.clientY };
    const startPanelPos = position;

    const onMouseMove = (moveE: MouseEvent) => {
        const dx = moveE.clientX - startPos.x;
        const dy = moveE.clientY - startPos.y;
        
        const newX = Math.max(0, Math.min(window.innerWidth - timerRef.current!.offsetWidth, startPanelPos.x + dx));
        const newY = Math.max(0, Math.min(window.innerHeight - timerRef.current!.offsetHeight, startPanelPos.y + dy));

        onPositionChange({ x: newX, y: newY });
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [position, onPositionChange]);
    
  return (
    <div
      ref={timerRef}
      className="fixed z-50 bg-stone-800 text-white rounded-lg shadow-2xl flex items-center space-x-3 p-2 border border-stone-700 animate-fade-in-up"
      style={{ top: `${position.y}px`, left: `${position.x}px`, cursor: 'move' }}
      onMouseDown={handleDragStart}
    >
      <div 
        className="font-mono font-bold text-lg px-2"
        title="Drag to move"
      >
        {remainingSeconds > 3599 ? `>1h` : formatTime(remainingSeconds)}
      </div>
      <button onClick={onMaximize} className="p-1.5 rounded-full hover:bg-stone-700 cursor-pointer" title="Maximize">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4-4l-5 5M4 16v4m0 0h4m-4-4l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
      </button>
       <button onClick={() => onExit(duration - remainingSeconds)} className="p-1.5 rounded-full hover:bg-red-900/50 cursor-pointer" title="Exit Timer">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export default MinimizedTimer;