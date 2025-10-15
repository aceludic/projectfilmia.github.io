import React from 'react';
import { PandaState } from '../types';

interface PandaWidgetProps {
  state: PandaState;
}

const HAPPY_PANDA_URL = 'https://i.postimg.cc/qvDq3yNQ/Gemini-Generated-Image-px0xkhpx0xkhpx0x-removebg-preview.png';
const SAD_PANDA_URL = 'https://i.postimg.cc/tRFzNCtG/Chat-GPT-Image-Oct-13-2025-11-44-53-AM-removebg-preview.png';

const PandaWidget: React.FC<PandaWidgetProps> = ({ state }) => {
  const today = new Date().toISOString().split('T')[0];
  const hasStudiedToday = state.lastFed === today;

  const getMessage = () => {
    if (hasStudiedToday) {
      if (state.streak > 1) {
        return `Great work! You're on a ${state.streak}-day study streak!`;
      }
      return "Awesome, you've studied today! Come back tomorrow to build your streak.";
    }
    if (!state.isHappy && state.streak === 0) { // Streak was lost
      return "You lost your streak. Complete a study session to start a new one!";
    }
    return "Complete a study session today to maintain your streak!";
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-2">
      <div className="relative mb-2">
        <img
          key={state.isHappy ? 'happy' : 'sad'}
          src={state.isHappy ? HAPPY_PANDA_URL : SAD_PANDA_URL}
          alt={state.isHappy ? 'A happy panda' : 'A sad panda'}
          className="h-28 w-28 object-contain animate-fade-in"
        />
        <div className="absolute top-0 right-0 bg-amber-400 text-stone-800 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-md border-2 border-beige-100 dark:border-stone-800">
          🔥{state.streak}
        </div>
      </div>
      <p className="text-sm text-stone-600 dark:text-stone-300 font-semibold h-10 px-2">
        {getMessage()}
      </p>
    </div>
  );
};

export default PandaWidget;