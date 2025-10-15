import React from 'react';
import { LoggedInView } from '../App';
import { timelineData } from '../data/timelineData';

interface TimelinePageProps {
  setView: (view: LoggedInView) => void;
}

const TimelineItem: React.FC<{ year: number; title: string; description: string; isLeft: boolean }> = ({ year, title, description, isLeft }) => (
  <div className={`flex ${isLeft ? 'flex-row-reverse' : 'flex-row'} items-center w-full my-4`}>
    <div className="w-1/2">
      <div className={`p-4 bg-glass-300 dark:bg-black/20 rounded-lg shadow-md ${isLeft ? 'mr-8 text-right' : 'ml-8'}`}>
        <h3 className="text-lg font-bold text-stone-800 dark:text-beige-100">{title}</h3>
        <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">{description}</p>
      </div>
    </div>
    <div className="relative w-12 h-12 bg-brand-brown-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
      {year}
    </div>
    <div className="w-1/2"></div>
  </div>
);

const TimelinePage: React.FC<TimelinePageProps> = ({ setView }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black uppercase text-glow">Interactive Film & Media Timeline</h1>
        <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">Key moments that shaped the industry.</p>
      </div>
      
      <div className="relative">
        {/* The central line */}
        <div className="absolute top-0 bottom-0 w-1 bg-stone-300 dark:bg-stone-700 left-1/2 transform -translate-x-1/2"></div>
        
        <div className="flex flex-col items-center">
            {timelineData.map((event, index) => (
            <TimelineItem 
                key={event.id}
                year={event.year}
                title={event.title}
                description={event.description}
                isLeft={index % 2 === 0}
            />
            ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-glass-300 text-stone-800 dark:text-white rounded-md font-bold btn-ripple"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default TimelinePage;
