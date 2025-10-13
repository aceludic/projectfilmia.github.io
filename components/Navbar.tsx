import React, { useState, useEffect } from 'react';
import { LoggedInView } from '../App';
import ReleaseScheduleModal from './ReleaseScheduleModal';
import { VisibleTabs } from '../types';

interface NavbarProps {
  view: LoggedInView;
  setView: (view: LoggedInView) => void;
  onOpenSearch: () => void;
  visibleTabs: VisibleTabs;
}

const Navbar: React.FC<NavbarProps> = ({ view, setView, onOpenSearch, visibleTabs }) => {
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
      className={`btn-ripple transition-all duration-300 transform hover:-translate-y-1 ${
        isMobile
          ? 'w-full text-center py-3 text-lg'
          : 'px-4 py-2 rounded-lg text-sm font-bold'
      } ${
        view === targetView
          ? isMobile
            ? 'bg-glass-100 text-stone-900 dark:text-white'
            : 'bg-glass-100 text-stone-900 dark:text-white shadow-md'
          : 'text-stone-700 dark:text-stone-300 hover:bg-glass-300 hover:text-stone-800 dark:hover:text-white'
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
      className="fixed top-0 left-0 right-0 z-20 bg-glass-100 backdrop-blur-4xl border-b border-glass-border dark:border-glass-border-dark animate-fade-in"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4 md:space-x-12">
            <button onClick={() => setView('dashboard')} className="flex items-center space-x-3 cursor-pointer group">
                <img src="https://i.postimg.cc/TY3MzSP9/Gemini-Generated-Image-vcf7cgvcf7cgvcf7-Photoroom.png" alt="Project Filmia Logo" className="h-8 w-8 group-hover:animate-spin-fast" />
                <div className="flex flex-col items-start leading-tight">
                    <div className="font-playfair-display text-xl font-bold text-stone-800 dark:text-beige-100">
                        Project Filmia
                    </div>
                    <div className="hidden lg:block">
                        <span className="text-xs text-stone-600 dark:text-stone-400 tracking-tight normal-case block leading-tight">
                            your creative hub
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-500 tracking-tight normal-case block leading-tight">
                            (made by ethan)
                        </span>
                    </div>
                </div>
            </button>
              <nav className="hidden md:flex items-center space-x-8">
                <NavLink targetView="dashboard">Dashboard</NavLink>
                {visibleTabs['media-studies'] && <NavLink targetView="media-studies">Media Studies</NavLink>}
                {visibleTabs['film-studies'] && <NavLink targetView="film-studies">Film Studies</NavLink>}
                <NavLink targetView="news">News</NavLink>
                <NavLink targetView="journal">Journal</NavLink>
                <NavLink targetView="ai-tutor">AI Tutor</NavLink>
              </nav>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            <button
                onClick={() => setIsReleaseModalOpen(true)}
                className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-black dark:text-beige-200 bg-black/20 px-3 py-1.5 rounded-lg transition-transform transform hover:-translate-y-0.5 btn-ripple"
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
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold text-stone-800 dark:text-stone-200 bg-glass-300 hover:bg-glass-100 transition-colors btn-ripple"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden lg:block">Search...</span>
                <kbd className="hidden lg:inline-flex items-center px-2 py-1 rounded border border-stone-400 dark:border-stone-600 text-xs font-sans">⌘K</kbd>
            </button>
             <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-stone-700 dark:text-stone-300 hover:bg-glass-300 btn-ripple"
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
        <div className="md:hidden absolute top-20 left-0 right-0 bg-glass-100 backdrop-blur-3xl shadow-lg animate-slide-down">
            <nav className="flex flex-col">
                <NavLink targetView="dashboard" isMobile>Dashboard</NavLink>
                {visibleTabs['media-studies'] && <NavLink targetView="media-studies" isMobile>Media Studies</NavLink>}
                {visibleTabs['film-studies'] && <NavLink targetView="film-studies" isMobile>Film Studies</NavLink>}
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