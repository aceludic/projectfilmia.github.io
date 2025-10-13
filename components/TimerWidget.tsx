import React from 'react';

interface TimerWidgetProps {
  onSetup: () => void;
}

const TimerWidget: React.FC<TimerWidgetProps> = ({ onSetup }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-glass-100 dark:bg-black/10 rounded-xl border border-glass-border/50 dark:border-glass-border-dark/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-stone-800 dark:text-beige-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-stone-800 dark:text-beige-100">Study Timer</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">Start a focused work session.</p>
            <button
                onClick={onSetup}
                className="w-full bg-brand-brown-700 text-white p-2 rounded-md text-sm font-bold hover:bg-brand-brown-800 transition-colors transform hover:-translate-y-0.5"
            >
                Start Session
            </button>
        </div>
    );
};

export default TimerWidget;