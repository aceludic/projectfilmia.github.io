import React from 'react';
import { PandaState } from '../types';

interface PandaWidgetProps {
  state: PandaState;
  onFeed: () => void;
}

const FED_PANDA_URL = 'https://i.postimg.cc/qvDq3yNQ/Gemini-Generated-Image-px0xkhpx0xkhpx0x-removebg-preview.png';
const HUNGRY_PANDA_URL = 'https://i.postimg.cc/tRFzNCtG/Chat-GPT-Image-Oct-13-2025-11-44-53-AM-removebg-preview.png';

const PandaWidget: React.FC<PandaWidgetProps> = ({ state, onFeed }) => {
  const today = new Date().toISOString().split('T')[0];
  const hasFedToday = state.lastFed === today;

  const getMessage = () => {
    if (hasFedToday) {
      if (state.streak > 1) {
        return `Awesome! See you tomorrow for day ${state.streak + 1}!`;
      }
      return "Great start! Come back tomorrow to build your streak.";
    }
    if (!state.isHappy && state.streak === 0) { // Streak was lost
      return "Oh no! You lost your streak. Let's start a new one!";
    }
    return "Your panda is hungry! Feed it to keep your streak.";
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-2">
      <div className="relative mb-2">
        <img
          key={hasFedToday ? 'fed' : 'hungry'}
          src={hasFedToday ? FED_PANDA_URL : HUNGRY_PANDA_URL}
          alt={hasFedToday ? 'A happy, fed panda' : 'A hungry panda'}
          className="h-24 w-24 object-contain animate-fade-in"
        />
        <div className="absolute -top-1 -right-2 bg-amber-400 text-stone-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md border-2 border-beige-100 dark:border-stone-800">
          🔥{state.streak}
        </div>
      </div>
      <p className="text-xs text-stone-600 dark:text-stone-300 font-semibold h-8">
        {getMessage()}
      </p>
      <button
        onClick={onFeed}
        disabled={hasFedToday}
        className="mt-2 w-full bg-brand-brown-700 text-white p-2 rounded-md text-sm font-bold hover:bg-brand-brown-800 transition-colors disabled:bg-stone-500/50 dark:disabled:bg-stone-600 disabled:cursor-not-allowed"
      >
        {hasFedToday ? 'All Fed For Today!' : 'Feed Panda'}
      </button>
    </div>
  );
};

export default PandaWidget;