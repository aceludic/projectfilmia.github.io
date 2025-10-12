import React, { useState, useEffect } from 'react';
import { LoggedInView } from '../App';

interface FilmStudiesPageProps {
  setView: (view: LoggedInView) => void;
}

const FilmStudiesPage: React.FC<FilmStudiesPageProps> = ({ setView }) => {
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    if (countdown <= 0) {
      setView('dashboard');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, setView]);

  return (
    <div className="relative h-[calc(100vh-5rem)] w-full flex items-center justify-center overflow-hidden bg-beige-200 dark:bg-stone-800">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        <div className="absolute top-1/2 left-1/2 w-1 h-1">
            <div className="absolute w-[50vmax] h-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-beige-300 dark:border-stone-700 animate-ripple" style={{ animationDelay: '0s' }}></div>
            <div className="absolute w-[50vmax] h-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-beige-300/80 dark:border-stone-700/80 animate-ripple" style={{ animationDelay: '1s' }}></div>
            <div className="absolute w-[50vmax] h-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-beige-300/60 dark:border-stone-700/60 animate-ripple" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
     
      <div className="relative z-20 text-center p-4 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-stone-800 dark:text-beige-100">
          Coming Soon
        </h1>
        <p className="mt-4 text-lg md:text-xl text-stone-600 dark:text-stone-300">
          The Film Studies section is under construction. Exciting things are on the way!
        </p>
        <p className="mt-8 text-md text-stone-500 dark:text-stone-400">
            Redirecting to Dashboard in {countdown}...
        </p>
      </div>
    </div>
  );
};

export default FilmStudiesPage;