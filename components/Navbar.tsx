
import React, { useState, useEffect } from 'react';
import { LoggedInView } from '../App';
import ReleaseScheduleModal from './ReleaseScheduleModal';

interface NavbarProps {
  view: LoggedInView;
  setView: (view: LoggedInView) => void;
  onOpenSearch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ view, setView, onOpenSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);

  const NavLink: React.FC<{
    targetView: LoggedInView;
    children: React.ReactNode;
    isMobile?: boolean;
  }> = ({ targetView, children, isMobile = false }) => (
    <button
      onClick={() => {
        setView(targetView);
        setIsMenuOpen(false);
      }}
      className={`transition-all duration-300 transform hover:-translate-y-1 ${
        isMobile
          ? 'w-full text-center py-3 text-lg'
          : 'px-4 py-2 rounded-lg text-sm font-bold'
      } ${
        view === targetView
          ? isMobile
            ? 'bg-brand-brown-700/20 text-brand-brown-700 dark:text-amber-400'
            : 'bg-brand-brown-700 text-white shadow-md'
          : 'text-stone-500 dark:text-stone-400 hover:bg-beige-200 hover:text-stone-800 dark:hover:bg-stone-700 dark:hover:text-beige-100'
      }`}
    >
      {children}
    </button>
  );
  
  // Countdown logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
      const calculateTargetDate = () => {
          const now = new Date();
          const target = new Date();
          
          const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
          const dayOffset = daysUntilSaturday === 0 ? 7 : daysUntilSaturday;

          target.setDate(now.getDate() + dayOffset);
          target.setHours(21, 0, 0, 0);
          
          return target;
      };

      const targetDate = calculateTargetDate();

      const timer = setInterval(() => {
          const difference = targetDate.getTime() - new Date().getTime();

          if (difference > 0) {
              setTimeLeft({
                  days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                  hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                  minutes: Math.floor((difference / 1000 / 60) % 60),
                  seconds: Math.floor((difference / 1000) % 60)
              });
          } else {
              setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
              clearInterval(timer);
          }
      }, 1000);

      return () => clearInterval(timer);
  }, []);
  
  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <>
    <header 
      id="navbar"
      className="fixed top-0 left-0 right-0 z-20 bg-beige-50/80 backdrop-blur-md border-b border-beige-200 dark:bg-stone-900/80 dark:border-stone-800/80 animate-fade-in"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4 md:space-x-12">
            <button onClick={() => setView('dashboard')} className="flex items-center space-x-3 cursor-pointer group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-brown-700 group-hover:animate-spin-fast" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.158-.103.352-.103.51 0l.93 1.253a1 1 0 001.64 0l.93-1.253c.158-.103.352-.103.51 0L15 9.582a1 1 0 000 1.64l-2.07 1.753c-.158.103-.352.103-.51 0L10 11.333l-2.43 1.642c-.158.103-.352.103-.51 0L5 9.582a1 1 0 000-1.64l2.07-1.753.93-1.253z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z" clipRule="evenodd" />
                </svg>
              <div className="flex items-center space-x-3">
                <div className="font-lora text-xl font-black tracking-wider uppercase leading-tight dark:text-beige-100">
                  <div>PROJECT</div>
                  <div>FILMIA</div>
                </div>
                <span className="hidden lg:block text-xs text-stone-500 dark:text-stone-400 tracking-tight normal-case pt-1">all you need for media & film studies</span>
              </div>
            </button>
              <nav className="hidden md:flex items-center space-x-8">
                <NavLink targetView="dashboard">Dashboard</NavLink>
                <NavLink targetView="media-studies">Media Studies</NavLink>
                <NavLink targetView="film-studies">Film Studies</NavLink>
                <NavLink targetView="news">News</NavLink>
                <NavLink targetView="journal">Journal</NavLink>
                <NavLink targetView="ai-tutor">AI Tutor</NavLink>
              </nav>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            <button
                onClick={() => setIsReleaseModalOpen(true)}
                className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-beige-200 bg-brand-brown-800/80 px-3 py-1.5 rounded-lg transition-transform transform hover:-translate-y-0.5"
            >
                <span className="font-bold">Full Release:</span>
                <div className="flex space-x-1.5">
                    <span><span className="font-mono font-bold">{formatTime(timeLeft.days)}</span>d</span>
                    <span><span className="font-mono font-bold">{formatTime(timeLeft.hours)}</span>h</span>
                    <span><span className="font-mono font-bold">{formatTime(timeLeft.minutes)}</span>m</span>
                    <span><span className="font-mono font-bold">{formatTime(timeLeft.seconds)}</span>s</span>
                </div>
            </button>
            <button 
                onClick={onOpenSearch}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold text-stone-600 dark:text-stone-300 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden lg:block">Search...</span>
                <kbd className="hidden lg:inline-flex items-center px-2 py-1 rounded border border-stone-300 dark:border-stone-600 text-xs font-sans">⌘K</kbd>
            </button>
             <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-stone-500 dark:text-stone-400 hover:bg-beige-200 dark:hover:bg-stone-700"
                aria-label="Open menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-beige-50/95 dark:bg-stone-900/95 backdrop-blur-md shadow-lg animate-slide-down">
            <nav className="flex flex-col">
                <NavLink targetView="dashboard" isMobile>Dashboard</NavLink>
                <NavLink targetView="media-studies" isMobile>Media Studies</NavLink>
                <NavLink targetView="film-studies" isMobile>Film Studies</NavLink>
                <NavLink targetView="news" isMobile>News</NavLink>
                <NavLink targetView="journal" isMobile>Journal</NavLink>
                <NavLink targetView="ai-tutor" isMobile>AI Tutor</NavLink>
            </nav>
        </div>
      )}
    </header>
    {isReleaseModalOpen && <ReleaseScheduleModal onClose={() => setIsReleaseModalOpen(false)} />}
    </>
  );
};

export default Navbar;
