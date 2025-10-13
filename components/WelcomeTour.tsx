
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
    const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({ position: 'absolute', opacity: 0, pointerEvents: 'none' });
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

            // FIX: Ensure elements are rendered and have dimensions before calculating position.
            // This prevents incorrect positioning if the tour step triggers a re-render.
            if (!targetElement || !tooltipElement || !tooltipElement.offsetWidth || !tooltipElement.offsetHeight) {
                setHighlightStyle(prev => ({ ...prev, opacity: 0 }));
                setTooltipState(prev => ({ ...prev, style: { ...prev.style, opacity: 0 } }));
                return;
            }

            const targetRect = targetElement.getBoundingClientRect();
            const tooltipRect = tooltipElement.getBoundingClientRect();
            const HIGHLIGHT_PADDING = 4;
            const OFFSET = 12;
            const ARROW_SIZE = 8;
            const VIEWPORT_MARGIN = 16;
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;

            // 1. Set the spotlight highlight style
            setHighlightStyle({
                position: 'absolute',
                top: `${targetRect.top - HIGHLIGHT_PADDING}px`,
                left: `${targetRect.left - HIGHLIGHT_PADDING}px`,
                width: `${targetRect.width + HIGHLIGHT_PADDING * 2}px`,
                height: `${targetRect.height + HIGHLIGHT_PADDING * 2}px`,
                borderRadius: '6px',
                boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.6)',
                transition: 'all 0.3s ease-in-out',
                pointerEvents: 'auto'
            });

            // 2. Determine best placement with auto-flipping
            let placement = currentStep.placement || 'bottom';
            if (placement === 'bottom' && targetRect.bottom + tooltipRect.height > viewportHeight - VIEWPORT_MARGIN) placement = 'top';
            if (placement === 'top' && targetRect.top - tooltipRect.height < VIEWPORT_MARGIN) placement = 'bottom';
            if (placement === 'right' && targetRect.right + tooltipRect.width > viewportWidth - VIEWPORT_MARGIN) placement = 'left';
            if (placement === 'left' && targetRect.left - tooltipRect.width < VIEWPORT_MARGIN) placement = 'right';

            // 3. Calculate ideal position based on final placement
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const targetCenterY = targetRect.top + targetRect.height / 2;
            let idealTop = 0, idealLeft = 0;

            switch (placement) {
                case 'top':
                    idealTop = targetRect.top - tooltipRect.height - OFFSET;
                    idealLeft = targetCenterX - tooltipRect.width / 2;
                    break;
                case 'bottom':
                    idealTop = targetRect.bottom + OFFSET;
                    idealLeft = targetCenterX - tooltipRect.width / 2;
                    break;
                case 'left':
                    idealLeft = targetRect.left - tooltipRect.width - OFFSET;
                    idealTop = targetCenterY - tooltipRect.height / 2;
                    break;
                case 'right':
                    idealLeft = targetRect.right + OFFSET;
                    idealTop = targetCenterY - tooltipRect.height / 2;
                    break;
            }

            // 4. Clamp position to stay within the viewport (the critical part)
            const finalLeft = Math.max(VIEWPORT_MARGIN, Math.min(idealLeft, viewportWidth - tooltipRect.width - VIEWPORT_MARGIN));
            const finalTop = Math.max(VIEWPORT_MARGIN, Math.min(idealTop, viewportHeight - tooltipRect.height - VIEWPORT_MARGIN));
            
            // 5. Calculate arrow position based on the final, clamped position
            let arrowTop = 0, arrowLeft = 0, arrowClasses = '';

            switch (placement) {
                case 'top':
                    arrowClasses = 'border-t-beige-50 dark:border-t-stone-800';
                    arrowTop = tooltipRect.height - ARROW_SIZE / 2;
                    arrowLeft = targetCenterX - finalLeft;
                    break;
                case 'bottom':
                    arrowClasses = 'border-b-beige-50 dark:border-b-stone-800';
                    arrowTop = -ARROW_SIZE / 2;
                    arrowLeft = targetCenterX - finalLeft;
                    break;
                case 'left':
                    arrowClasses = 'border-l-beige-50 dark:border-l-stone-800';
                    arrowLeft = tooltipRect.width - ARROW_SIZE / 2;
                    arrowTop = targetCenterY - finalTop;
                    break;
                case 'right':
                    arrowClasses = 'border-r-beige-50 dark:border-r-stone-800';
                    arrowLeft = -ARROW_SIZE / 2;
                    arrowTop = targetCenterY - finalTop;
                    break;
            }

            setTooltipState({
                style: { top: `${finalTop}px`, left: `${finalLeft}px`, opacity: 1, pointerEvents: 'auto' },
                arrowStyle: { top: `${arrowTop}px`, left: `${arrowLeft}px`, transform: 'translate(-50%, -50%)' },
                arrowClasses,
            });
        };
        
        if (currentStep.before) currentStep.before(setCustomizing);
        
        // Use a microtask delay to ensure layout is stable
        Promise.resolve().then(calculatePositions);
        window.addEventListener('resize', calculatePositions);
        
        return () => {
            if (currentStep.after) currentStep.after(setCustomizing);
            window.removeEventListener('resize', calculatePositions);
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