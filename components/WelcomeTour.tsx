import React, { useState, useLayoutEffect, useRef } from 'react';

interface TourStep {
    targetId: string;
    title: string;
    content: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    before?: (setCustomizing: (val: boolean) => void) => void;
    after?: (setCustomizing: (val: boolean) => void) => void;
}

interface WelcomeTourProps {
    steps: readonly TourStep[];
    onTourEnd: () => void;
    setCustomizing: (val: boolean) => void;
}

const WelcomeTour: React.FC<WelcomeTourProps> = ({ steps, onTourEnd, setCustomizing }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({ opacity: 0, pointerEvents: 'none' });
    const [tooltipState, setTooltipState] = useState<{
        style: React.CSSProperties;
        arrowStyle: React.CSSProperties;
        arrowClasses: string;
    }>({
        style: { opacity: 0, pointerEvents: 'none' },
        arrowStyle: {},
        arrowClasses: '',
    });
    const tooltipRef = useRef<HTMLDivElement>(null);

    const currentStep = steps[currentStepIndex];

    useLayoutEffect(() => {
        const calculatePositions = () => {
            const targetElement = document.getElementById(currentStep.targetId);
            const tooltipElement = tooltipRef.current;

            if (!targetElement || !tooltipElement) {
                setHighlightStyle({ opacity: 0, pointerEvents: 'none' });
                setTooltipState(prev => ({ ...prev, style: { ...prev.style, opacity: 0, pointerEvents: 'none' } }));
                return;
            }

            const targetRect = targetElement.getBoundingClientRect();
            const tooltipRect = tooltipElement.getBoundingClientRect();
            const HIGHLIGHT_PADDING = 4;

            // 1. Set the spotlight highlight style
            setHighlightStyle({
                top: `${targetRect.top - HIGHLIGHT_PADDING}px`,
                left: `${targetRect.left - HIGHLIGHT_PADDING}px`,
                width: `${targetRect.width + HIGHLIGHT_PADDING * 2}px`,
                height: `${targetRect.height + HIGHLIGHT_PADDING * 2}px`,
                borderRadius: '6px',
                boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.6)',
                transition: 'all 0.3s ease-in-out',
                pointerEvents: 'auto'
            });

            // 2. Calculate tooltip position with auto-flipping
            let placement = currentStep.placement || 'bottom';
            const OFFSET = 12;
            const VIEWPORT_MARGIN = 16;
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;
            
            let idealTop = 0, idealLeft = 0;
            const getCenteredLeft = () => targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
            const getCenteredTop = () => targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;

            const positionForPlacement = (p: typeof placement) => {
                switch (p) {
                    case 'top': return { top: targetRect.top - tooltipRect.height - OFFSET, left: getCenteredLeft() };
                    case 'bottom': return { top: targetRect.bottom + OFFSET, left: getCenteredLeft() };
                    case 'left': return { top: getCenteredTop(), left: targetRect.left - tooltipRect.width - OFFSET };
                    case 'right': return { top: getCenteredTop(), left: targetRect.right + OFFSET };
                }
            }
            
            const initialPos = positionForPlacement(placement);
            idealTop = initialPos.top;
            idealLeft = initialPos.left;

            // Auto-flipping logic
            if (placement === 'top' && idealTop < VIEWPORT_MARGIN) {
                placement = 'bottom';
            } else if (placement === 'bottom' && (idealTop + tooltipRect.height) > (viewportHeight - VIEWPORT_MARGIN)) {
                placement = 'top';
            } else if (placement === 'left' && idealLeft < VIEWPORT_MARGIN) {
                placement = 'right';
            } else if (placement === 'right' && (idealLeft + tooltipRect.width) > (viewportWidth - VIEWPORT_MARGIN)) {
                placement = 'left';
            }
            
            // Recalculate position if placement was flipped
            const flippedPos = positionForPlacement(placement);
            idealTop = flippedPos.top;
            idealLeft = flippedPos.left;

            // Final clamping for edge cases
            const finalLeft = Math.max(VIEWPORT_MARGIN, Math.min(idealLeft, viewportWidth - tooltipRect.width - VIEWPORT_MARGIN));
            const finalTop = Math.max(VIEWPORT_MARGIN, Math.min(idealTop, viewportHeight - tooltipRect.height - VIEWPORT_MARGIN));

            // 3. Calculate arrow position based on the final, potentially flipped, placement
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const targetCenterY = targetRect.top + targetRect.height / 2;
            let arrowTop = targetCenterY - finalTop;
            let arrowLeft = targetCenterX - finalLeft;
            let arrowClasses = '';

            const ARROW_SIZE = 8;
            const ARROW_MARGIN = 16;

            switch (placement) {
                case 'top':
                    arrowClasses = 'border-t-beige-50 dark:border-t-stone-800';
                    arrowTop = tooltipRect.height - ARROW_SIZE;
                    arrowLeft = Math.max(ARROW_MARGIN, Math.min(arrowLeft, tooltipRect.width - ARROW_MARGIN));
                    break;
                case 'bottom':
                    arrowClasses = 'border-b-beige-50 dark:border-b-stone-800';
                    arrowTop = -ARROW_SIZE;
                    arrowLeft = Math.max(ARROW_MARGIN, Math.min(arrowLeft, tooltipRect.width - ARROW_MARGIN));
                    break;
                case 'left':
                    arrowClasses = 'border-l-beige-50 dark:border-l-stone-800';
                    arrowLeft = tooltipRect.width - ARROW_SIZE;
                    arrowTop = Math.max(ARROW_MARGIN, Math.min(arrowTop, tooltipRect.height - ARROW_MARGIN));
                    break;
                case 'right':
                    arrowClasses = 'border-r-beige-50 dark:border-r-stone-800';
                    arrowLeft = -ARROW_SIZE;
                    arrowTop = Math.max(ARROW_MARGIN, Math.min(arrowTop, tooltipRect.height - ARROW_MARGIN));
                    break;
            }

            setTooltipState({
                style: { top: `${finalTop}px`, left: `${finalLeft}px`, opacity: 1, pointerEvents: 'auto' },
                arrowStyle: { top: `${arrowTop}px`, left: `${arrowLeft}px`, transform: 'translate(-50%, -50%)' },
                arrowClasses,
            });
        };
        
        if (currentStep.before) currentStep.before(setCustomizing);
        
        const timer = setTimeout(calculatePositions, 50);
        window.addEventListener('resize', calculatePositions);
        
        return () => {
            if (currentStep.after) currentStep.after(setCustomizing);
            window.removeEventListener('resize', calculatePositions);
            clearTimeout(timer);
        };
    }, [currentStepIndex, steps, setCustomizing, currentStep]);
    
    const goToNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setTooltipState(prev => ({ ...prev, style: { ...prev.style, opacity: 0, pointerEvents: 'none' }}));
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            onTourEnd();
        }
    };

    const goToPrev = () => {
        if (currentStepIndex > 0) {
            setTooltipState(prev => ({ ...prev, style: { ...prev.style, opacity: 0, pointerEvents: 'none' }}));
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[100]">
            <div style={highlightStyle} />
            <div
                ref={tooltipRef}
                className="absolute w-[calc(100vw-32px)] max-w-sm sm:w-72 bg-beige-50 dark:bg-stone-800 rounded-lg shadow-2xl p-4 border border-beige-200 dark:border-stone-700 transition-opacity duration-300"
                style={tooltipState.style}
            >
                <div 
                    className={`absolute w-0 h-0 border-8 border-transparent ${tooltipState.arrowClasses}`}
                    style={tooltipState.arrowStyle}
                />
                <h4 className="font-bold text-lg text-stone-800 dark:text-beige-100">{currentStep.title}</h4>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-2">{currentStep.content}</p>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-stone-500">{currentStepIndex + 1} / {steps.length}</span>
                    <div className="flex items-center space-x-2">
                        {currentStepIndex > 0 && (
                            <button onClick={goToPrev} className="text-sm font-bold text-stone-600 dark:text-stone-300 hover:underline">Prev</button>
                        )}
                        <button 
                            onClick={goToNext}
                            className="bg-brand-brown-700 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-brand-brown-800 transition-colors"
                        >
                            {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
                 <button onClick={onTourEnd} className="absolute top-2 right-2 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-beige-100">
                     &#x2715;
                 </button>
            </div>
        </div>
    );
};

export default WelcomeTour;