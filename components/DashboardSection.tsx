
import React, { useRef, useCallback, useEffect, useState, memo } from 'react';
import { LayoutItem } from '../types';

interface DashboardSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  layoutItem: LayoutItem;
  isCustomizing: boolean;
  onLayoutChange: React.Dispatch<React.SetStateAction<LayoutItem[]>>;
  onRemoveWidget: (widgetId: string) => void;
  gridCols: number;
  cellHeight: number;
}

const useWindowSize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    useEffect(() => {
        const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
};

const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  description,
  children,
  layoutItem,
  isCustomizing,
  onLayoutChange,
  onRemoveWidget,
  gridCols,
  cellHeight,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [windowWidth] = useWindowSize();
  const isMobile = windowWidth < 768;

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !isCustomizing || !sectionRef.current) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const { x: startGridX, y: startGridY } = layoutItem;
    const parentRect = sectionRef.current.parentElement!.getBoundingClientRect();
    const colWidth = parentRect.width / gridCols;

    const onMouseMove = (moveE: MouseEvent) => {
        const dx = moveE.clientX - startX;
        const dy = moveE.clientY - startY;

        const newGridX = Math.round(startGridX + dx / colWidth);
        const newGridY = Math.round(startGridY + dy / cellHeight);

        const clampedX = Math.max(0, Math.min(newGridX, gridCols - layoutItem.w));
        const clampedY = Math.max(0, newGridY);

        onLayoutChange(prev =>
            prev.map(item =>
                item.i === layoutItem.i ? { ...item, x: clampedX, y: clampedY } : item
            )
        );
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [isMobile, isCustomizing, layoutItem, onLayoutChange, gridCols, cellHeight]);

  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !isCustomizing) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const { w: startGridW, h: startGridH } = layoutItem;
    const parentRect = sectionRef.current!.parentElement!.getBoundingClientRect();
    const colWidth = parentRect.width / gridCols;

    const onMouseMove = (moveE: MouseEvent) => {
        const dx = moveE.clientX - startX;
        const dy = moveE.clientY - startY;
        
        const newGridW = Math.round(startGridW + dx / colWidth);
        const newGridH = Math.round(startGridH + dy / cellHeight);
        
        const clampedW = Math.max(2, Math.min(newGridW, gridCols - layoutItem.x));
        const clampedH = Math.max(3, newGridH);

        onLayoutChange(prev =>
            prev.map(item =>
                item.i === layoutItem.i ? { ...item, w: clampedW, h: clampedH } : item
            )
        );
    };
    
    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [isMobile, isCustomizing, layoutItem, onLayoutChange, gridCols, cellHeight]);

  const width = `${(layoutItem.w / gridCols) * 100}%`;
  const height = `${layoutItem.h * cellHeight}px`;
  const x = `${(layoutItem.x / gridCols) * 100}%`;
  const y = `${layoutItem.y * cellHeight}px`;

  const sectionStyle = isMobile ? { minHeight: '350px' } : { left: x, top: y, width, height };
  const sectionClasses = `liquid-glass rounded-2xl transition-all duration-300 ease-in-out ${
    isMobile ? 'relative w-full' : 'absolute'
  } ${
    isCustomizing && !isMobile ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-900/50 animate-pulse' : ''
  }`;

  return (
    <div
      ref={sectionRef}
      id={`widget-${layoutItem.i}`}
      className={sectionClasses}
      style={sectionStyle}
    >
        <div className="flex flex-col h-full">
            <div 
                onMouseDown={handleDragStart}
                className={`relative p-4 border-b border-glass-border dark:border-glass-border-dark flex-shrink-0 ${isCustomizing && !isMobile ? 'cursor-move' : ''}`}
            >
                <h2 className="text-xl font-bold text-stone-800 dark:text-beige-100 pr-8">{title}</h2>
                {description && <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{description}</p>}
                {isCustomizing && !isMobile && (
                    <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => onRemoveWidget(layoutItem.i)}
                        className="absolute top-3 right-3 p-1.5 rounded-full text-stone-700 dark:text-stone-300 hover:bg-red-400/50 hover:text-white dark:hover:bg-red-500/50 transition-colors btn-ripple"
                        aria-label={`Remove ${title} widget`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="p-4 flex-grow overflow-auto">
                {children}
            </div>
        </div>
        {isCustomizing && !isMobile && (
            <div
                onMouseDown={handleResizeStart}
                className="absolute bottom-0 right-0 w-6 h-6 bg-amber-400 rounded-tl-lg cursor-se-resize flex items-end justify-end p-1"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 8V4h4m12 0h-4v4m0 8v4h4M4 16h4v4" />
                </svg>
            </div>
        )}
    </div>
  );
};

export default memo(DashboardSection);