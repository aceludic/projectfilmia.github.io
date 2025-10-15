import React, { useState, useEffect, useRef } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const islandRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const updateTime = () => {
        setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsExpanded(false);
    }, 10000); // 10 seconds
  };

  useEffect(() => {
    // Also collapse if mouse moves far away from the island
    const handleMouseMove = (e: MouseEvent) => {
        if (islandRef.current && isExpanded) {
            const rect = islandRef.current.getBoundingClientRect();
            const proximity = 100; // pixels
            if (
                e.clientX < rect.left - proximity ||
                e.clientX > rect.right + proximity ||
                e.clientY < rect.top - proximity ||
                e.clientY > rect.bottom + proximity
            ) {
                if (!timeoutRef.current) {
                    handleMouseLeave();
                }
            }
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isExpanded]);

  const NavLink: React.FC<{ targetView: LoggedInView; children: React.ReactNode; isMobile?: boolean; }> = ({ targetView, children, isMobile = false }) => (
    <button
      onClick={() => {
        setView(targetView);
        if (isMobile) setIsMenuOpen(false);
      }}
      className={`btn-ripple transition-all duration-300 w-full rounded-lg text-sm font-bold text-center ${
        isMobile
          ? 'py-3 text-lg'
          : 'px-2.5 py-2'
      } ${
        view === targetView
          ? 'bg-glass-100 text-stone-900 dark:text-white shadow-md'
          : 'text-stone-700 dark:text-stone-300 hover:bg-glass-300 hover:text-stone-800 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  const MobileMenu: React.FC = () => (
    <>
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full bg-glass-100 backdrop-blur-md btn-ripple" aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-glass-100 backdrop-blur-3xl z-40 pt-20 animate-fade-in">
          <nav className="flex flex-col p-4 space-y-2">
            <NavLink targetView="dashboard" isMobile>Dashboard</NavLink>
            {visibleTabs['media-studies'] && <NavLink targetView="media-studies" isMobile>Media Studies</NavLink>}
            {visibleTabs['film-studies'] && <NavLink targetView="film-studies" isMobile>Film Studies</NavLink>}
            <NavLink targetView="news" isMobile>News</NavLink>
            <NavLink targetView="ai-tutor" isMobile>Phoebe</NavLink>
            {visibleTabs['social-hub'] && <NavLink targetView="social-hub" isMobile>Social Hub</NavLink>}
          </nav>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile navigation */}
      <MobileMenu />

      {/* Dynamic Island for Desktop */}
      <div 
        id="navbar" 
        className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-40 items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={islandRef}
      >
        <div
          className={`liquid-glass flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isExpanded
              ? 'gap-1 px-3 h-16 rounded-3xl'
              : 'w-80 h-9 rounded-full animate-pulse'
          }`}
        >
          {/* Collapsed Content */}
           <div className={`absolute flex items-center justify-between w-full px-4 transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100 delay-300'}`}>
                <span className="font-mono text-sm font-bold text-stone-700 dark:text-stone-200">{currentTime}</span>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-700 dark:text-stone-200">Project Filmia</span>
                    <div className="w-px h-4 bg-stone-400 dark:bg-stone-500"></div>
                    <span className="font-bold text-sm tracking-widest text-stone-700 dark:text-stone-200 uppercase">Menu</span>
                </div>
            </div>

          {/* Expanded Content */}
          <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100 delay-200' : 'opacity-0'}`}>
            <div className={`flex items-center gap-1 ${isExpanded ? '' : 'pointer-events-none'}`}>
              <button onClick={() => setView('dashboard')} className="flex-shrink-0 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-brand-brown-700 rounded-lg">
                <img src="https://i.postimg.cc/c43zLgFy/Gemini-Generated-Image-vcf7cgvcf7cgvcf7-Photoroom.png" alt="Project Filmia Logo" className="h-10 w-10" />
              </button>
              
              <div className="w-px h-8 bg-glass-border dark:bg-glass-border-dark"></div>

              <nav className="flex items-center gap-1">
                <NavLink targetView="dashboard">Dashboard</NavLink>
                {visibleTabs['media-studies'] && <NavLink targetView="media-studies">Media</NavLink>}
                {visibleTabs['film-studies'] && <NavLink targetView="film-studies">Film</NavLink>}
                <NavLink targetView="news">News</NavLink>
                <NavLink targetView="ai-tutor">Phoebe</NavLink>
                {visibleTabs['social-hub'] && <NavLink targetView="social-hub">Social Hub</NavLink>}
              </nav>

              <div className="w-px h-8 bg-glass-border dark:bg-glass-border-dark"></div>
              
              <button
                onClick={onOpenSearch}
                className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold text-stone-800 dark:text-stone-200 bg-glass-300 hover:bg-glass-100 transition-colors btn-ripple"
                aria-label="Search"
                title="Search (⌘K)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isReleaseModalOpen && <ReleaseScheduleModal onClose={() => setIsReleaseModalOpen(false)} />}
    </>
  );
};

export default Navbar;