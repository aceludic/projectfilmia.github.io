import React from 'react';
import { LoggedInView } from '../App';

interface NavbarProps {
  view: LoggedInView;
  setView: (view: LoggedInView) => void;
  onOpenSearch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ view, setView, onOpenSearch }) => {

  const NavLink: React.FC<{
    targetView: LoggedInView;
    children: React.ReactNode;
  }> = ({ targetView, children }) => (
    <button
      onClick={() => setView(targetView)}
      className={`px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 transform hover:-translate-y-1 ${
        view === targetView
          ? 'bg-brand-brown-700 text-white shadow-md'
          : 'text-stone-500 dark:text-stone-400 hover:bg-beige-200 hover:text-stone-800 dark:hover:bg-stone-700 dark:hover:text-beige-100'
      }`}
    >
      {children}
    </button>
  );

  return (
    <nav 
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-beige-50/80 backdrop-blur-md border-b border-beige-200 dark:bg-stone-800/80 dark:border-stone-700/80 animate-fade-in"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <button onClick={() => setView('dashboard')} className="flex items-center space-x-3 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-brown-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="12" y1="2" x2="12" y2="5" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="22" y1="12" x2="19" y2="12" />
                    <line x1="5" y1="12" x2="2" y2="12" />
                    <line x1="19.07" y1="4.93" x2="16.24" y2="7.76" />
                    <line x1="7.76" y1="16.24" x2="4.93" y2="19.07" />
                    <line x1="19.07" y1="19.07" x2="16.24" y2="16.24" />
                    <line x1="7.76" y1="7.76" x2="4.93" y2="4.93" />
                </svg>
              <div>
                <span className="block text-2xl font-black tracking-wider uppercase leading-none dark:text-beige-100">Project Filmia</span>
                <span className="block text-xs text-stone-500 dark:text-stone-400 tracking-tight normal-case mt-1">(all you need for media & film studies)</span>
              </div>
            </button>
              <div className="hidden md:flex items-center space-x-4">
                <NavLink targetView="dashboard">Dashboard</NavLink>
                <NavLink targetView="media-studies">Media Studies</NavLink>
                <NavLink targetView="film-studies">Film Studies</NavLink>
                <NavLink targetView="news">News</NavLink>
                <NavLink targetView="journal">Journal</NavLink>
                <NavLink targetView="ai-tutor">AI Tutor</NavLink>
              </div>
          </div>
          <div className="flex items-center">
            <button 
                onClick={onOpenSearch}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-semibold text-stone-500 dark:text-stone-400 bg-beige-200/50 dark:bg-stone-700/50 hover:bg-beige-200 dark:hover:bg-stone-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden lg:block">Search...</span>
                <kbd className="hidden lg:inline-flex items-center px-2 py-1 rounded border border-stone-300 dark:border-stone-600 text-xs font-sans">⌘K</kbd>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;