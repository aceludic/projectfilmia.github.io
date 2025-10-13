
import React, { useState } from 'react';

interface TimerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (durationInSeconds: number) => void;
}

const PRESETS = [
    { label: 'Pomodoro (25m)', minutes: 25 },
    { label: 'Deep Work (50m)', minutes: 50 },
    { label: 'Full Paper (2h)', minutes: 120 },
];

// FIX: Changed to a named export to resolve module loading error in App.tsx.
export const TimerSetupModal: React.FC<TimerSetupModalProps> = ({ isOpen, onClose, onStart }) => {
  const [minutes, setMinutes] = useState<string>('25');

  if (!isOpen) return null;

  const handleStart = () => {
    const duration = parseInt(minutes, 10);
    if (duration > 0) {
      onStart(duration * 60);
    }
  };
  
  const handlePresetClick = (presetMinutes: number) => {
    setMinutes(presetMinutes.toString());
    onStart(presetMinutes * 60);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-beige-50 dark:bg-stone-800 rounded-lg shadow-2xl max-w-sm w-full p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-4">Set Study Timer</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="timer-minutes" className="block text-sm font-bold text-stone-700 dark:text-beige-200 mb-1">Duration (in minutes)</label>
                    <input
                        id="timer-minutes"
                        type="number"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        placeholder="e.g., 25"
                        min="1"
                        className="w-full p-2 border border-beige-300 rounded-md bg-white dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600 focus:ring-2 focus:ring-brand-brown-700 focus:border-transparent"
                    />
                </div>
                <div>
                    <p className="text-sm font-bold text-stone-700 dark:text-beige-200 mb-2">Or choose a preset:</p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        {PRESETS.map(preset => (
                            <button key={preset.label} onClick={() => handlePresetClick(preset.minutes)} className="flex-1 px-3 py-2 text-sm font-bold rounded-md bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600 transition-colors">
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-200 dark:bg-stone-600 text-stone-700 dark:text-beige-200 rounded-md font-bold">Cancel</button>
                    <button type="button" onClick={handleStart} className="px-4 py-2 bg-brand-brown-700 text-white rounded-md font-bold">Start Timer</button>
                </div>
            </div>
        </div>
    );
};
