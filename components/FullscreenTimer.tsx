import React, { useState, useEffect } from 'react';

interface FullscreenTimerProps {
  remainingSeconds: number;
  duration: number;
  onMinimize: () => void;
  onExit: (timeSpent: number) => void;
}

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const FullscreenTimer: React.FC<FullscreenTimerProps> = ({ remainingSeconds, duration, onMinimize, onExit }) => {
    const [prepCountdown, setPrepCountdown] = useState(3);

    useEffect(() => {
        if (prepCountdown > 0) {
            const timer = setTimeout(() => setPrepCountdown(prepCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [prepCountdown]);

    const progress = duration > 0 ? ((duration - remainingSeconds) / duration) * 100 : 0;

    if (prepCountdown > 0) {
        return (
            <div className="fixed inset-0 bg-red-500 z-[100] flex items-center justify-center animate-pulse">
                <span className="text-9xl font-black text-white">{prepCountdown}</span>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-stone-900 z-[100] flex flex-col items-center justify-center p-4 animate-fade-in">
             <div className="absolute top-0 left-0 h-2 bg-brand-brown-600 transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }}></div>

            <div className="text-center">
                <h1 className="text-7xl md:text-9xl font-black font-mono text-white tracking-widest">
                    {formatTime(remainingSeconds)}
                </h1>
                {remainingSeconds === 0 && (
                    <p className="mt-4 text-2xl font-bold text-amber-400 animate-pulse">Time's Up!</p>
                )}
            </div>
            <div className="absolute bottom-8 flex items-center space-x-4">
                <button
                    onClick={onMinimize}
                    className="px-6 py-3 bg-white/10 text-white rounded-md font-bold backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                    Minimize
                </button>
                <button
                    onClick={() => onExit(duration - remainingSeconds)}
                    className="px-6 py-3 bg-red-600/80 text-white rounded-md font-bold backdrop-blur-sm hover:bg-red-500 transition-colors"
                >
                    Exit Session
                </button>
            </div>
        </div>
    );
};

export default FullscreenTimer;