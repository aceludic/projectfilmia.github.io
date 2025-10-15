import React from 'react';
import { achievementsData } from '../data/achievementsData';

interface AchievementsWidgetProps {
  unlockedIds: string[];
}

const AchievementsWidget: React.FC<AchievementsWidgetProps> = ({ unlockedIds }) => {
  return (
    <div className="h-full flex flex-col">
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 px-1">
        Unlock badges by completing revision tasks!
      </p>
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 text-center">
          {achievementsData.map(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className="group relative flex flex-col items-center p-2"
                title={`${ach.name}: ${ach.description}`}
              >
                <div className={`relative w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 ${isUnlocked ? 'bg-amber-400' : 'bg-stone-200 dark:bg-stone-700'}`}>
                  <span className={`text-3xl transition-transform duration-300 ${isUnlocked ? 'grayscale-0' : 'grayscale'}`}>{ach.icon}</span>
                  {!isUnlocked && <div className="absolute inset-0 bg-black/20 rounded-full"></div>}
                </div>
                <p className={`mt-2 text-xs font-semibold truncate w-full ${isUnlocked ? 'text-stone-800 dark:text-beige-100' : 'text-stone-400 dark:text-stone-500'}`}>{ach.name}</p>
                 <div className="absolute bottom-full mb-2 w-48 p-2 bg-stone-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <strong className="block">{ach.name}</strong>
                    {ach.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsWidget;