

import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import FloatingTools from './components/FloatingTools';
import MediaStudiesPage from './components/MediaStudiesPage';
import FilmStudiesPage from './components/FilmStudiesPage';
import AiTutorPage from './components/AiTutorPage';
import NewsPage from './components/NewsPage';
import NotesPanel from './components/NotesPanel';
import JournalPage from './components/JournalPage';
import GlobalSearch from './components/GlobalSearch';
import SettingsPanel from './components/SettingsPanel';
import SetupPage from './components/SetupPage';
// FIX: Use named import for TimerSetupModal to resolve module loading error.
import { TimerSetupModal } from './components/TimerSetupModal';
import FullscreenTimer from './components/FullscreenTimer';
import MinimizedTimer from './components/MinimizedTimer';
import { NotesPanelState, PinnedItem, TimetableEntry, AppLink, JournalEntry, FontFamily, SearchResult, TimerState, VisibleTabs, PandaState } from './types';
import { theoristData } from './data/theoristsData';
import { cspsData } from './data/cspsData';


export type LoggedInView = 'dashboard' | 'media-studies' | 'film-studies' | 'ai-tutor' | 'news' | 'journal';
export type Theme = 'light' | 'dark' | 'night';

// Helper for loading from localStorage
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge logic is only for non-array objects to preserve defaults for new properties.
        if (
          typeof defaultValue === 'object' && !Array.isArray(defaultValue) && defaultValue !== null &&
          typeof parsed === 'object' && !Array.isArray(parsed) && parsed !== null
        ) {
          return { ...defaultValue, ...parsed };
        }
        return parsed; // Correctly returns arrays, strings, etc.
      } catch (e) {
        // This fallback handles the case where old data was stored as a raw string.
        if (typeof defaultValue === 'string') {
          return saved as unknown as T;
        }
        // For other parsing errors, log them.
        console.error(`Failed to parse JSON for key "${key}"`, e);
      }
    }
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage`, error);
  }
  return defaultValue;
};


// A simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const AnimatedBackground: React.FC = () => (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-beige-100 dark:bg-stone-900">
        <div className="absolute w-[50vmax] h-[50vmax] rounded-full blur-3xl animate-breathe-1" style={{ top: '5vh', left: '10vw' }}></div>
        <div className="absolute w-[45vmax] h-[45vmax] rounded-full blur-3xl animate-breathe-2" style={{ top: '30vh', left: '70vw' }}></div>
        <div className="absolute w-[60vmax] h-[60vmax] rounded-full blur-3xl animate-breathe-3" style={{ top: '55vh', left: '25vw' }}></div>
    </div>
);


const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'setup' | 'main'>('landing');
  const [view, setView] = useState<LoggedInView>('dashboard');
  const [theme, setTheme] = useState<Theme>(() => loadFromLocalStorage('theme', 'light'));
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => loadFromLocalStorage('fontFamily', 'lexend'));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const followerRef = useRef<HTMLDivElement>(null);
  
  const [notesPanelState, setNotesPanelState] = useState<NotesPanelState>(() => loadFromLocalStorage('notesPanelState', {
      isOpen: false,
      position: { x: window.innerWidth - 520, y: 100 },
      size: { width: 500, height: 400 },
      tabs: [{ id: '1', title: 'General Notes', content: '' }],
      activeTabId: '1',
  }));

  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>(() => loadFromLocalStorage('pinnedItems', []));
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>(() => loadFromLocalStorage('timetableEntries', []));
  const [appLinks, setAppLinks] = useState<AppLink[]>(() => loadFromLocalStorage('appLinks', []));
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => loadFromLocalStorage('journalEntries', []));
  const [visibleTabs, setVisibleTabs] = useState<VisibleTabs>(() => loadFromLocalStorage('visibleTabs', { 'media-studies': true, 'film-studies': true }));
  const [studiedSubjects, setStudiedSubjects] = useState<string[]>(() => loadFromLocalStorage('studiedSubjects', []));


  const [isTimerSetupOpen, setIsTimerSetupOpen] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>(() => loadFromLocalStorage('timerState', {
      status: 'inactive',
      duration: 0,
      remaining: 0,
      view: 'hidden',
      position: { x: window.innerWidth - 180, y: window.innerHeight - 80 },
  }));

  const [pandaState, setPandaState] = useState<PandaState>(() => loadFromLocalStorage('pandaState', {
      streak: 0,
      lastFed: null,
      isHappy: true,
  }));


  const debouncedNotesPanelState = useDebounce(notesPanelState, 500);
  const debouncedPinnedItems = useDebounce(pinnedItems, 500);
  const debouncedTimetableEntries = useDebounce(timetableEntries, 500);
  const debouncedAppLinks = useDebounce(appLinks, 500);
  const debouncedJournalEntries = useDebounce(journalEntries, 500);
  const debouncedTimerState = useDebounce(timerState, 1000);
  const debouncedVisibleTabs = useDebounce(visibleTabs, 500);
  const debouncedStudiedSubjects = useDebounce(studiedSubjects, 500);
  const debouncedPandaState = useDebounce(pandaState, 500);


  useEffect(() => {
    try {
      localStorage.setItem('theme', JSON.stringify(theme));
      const root = document.documentElement;
      root.classList.remove('dark', 'night');
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'night') {
        root.classList.add('dark', 'night');
      }
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);

  // Mouse follower effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (followerRef.current) {
            followerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Panda streak logic
  useEffect(() => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (pandaState.lastFed !== today && pandaState.lastFed !== yesterday) {
          if(pandaState.streak > 0) { // Only set to sad if they had a streak to lose
              setPandaState(prev => ({ ...prev, streak: 0, isHappy: false }));
          }
      } else {
           setPandaState(prev => ({ ...prev, isHappy: true }));
      }
  }, []); // Run only on initial app load

  useEffect(() => {
    try {
        localStorage.setItem('fontFamily', JSON.stringify(fontFamily));
        const body = document.body;
        // List of all possible font classes
        const fontClasses: string[] = [
            'font-lora', 
            'font-merriweather', 
            'font-playfair-display', 
            'font-inter', 
            'font-lato', 
            'font-lexend',
            'font-inconsolata'
        ];
        body.classList.remove(...fontClasses);
        body.classList.add(`font-${fontFamily}`);
    } catch (error) {
        console.error("Failed to save/apply font", error);
    }
  }, [fontFamily]);
  
  useEffect(() => {
    try {
        localStorage.setItem('notesPanelState', JSON.stringify(debouncedNotesPanelState));
        localStorage.setItem('pinnedItems', JSON.stringify(debouncedPinnedItems));
        localStorage.setItem('timetableEntries', JSON.stringify(debouncedTimetableEntries));
        localStorage.setItem('appLinks', JSON.stringify(debouncedAppLinks));
        localStorage.setItem('journalEntries', JSON.stringify(debouncedJournalEntries));
        localStorage.setItem('visibleTabs', JSON.stringify(debouncedVisibleTabs));
        localStorage.setItem('studiedSubjects', JSON.stringify(debouncedStudiedSubjects));
        localStorage.setItem('pandaState', JSON.stringify(debouncedPandaState));
        if (debouncedTimerState.status !== 'inactive') {
            localStorage.setItem('timerState', JSON.stringify(debouncedTimerState));
        } else {
            localStorage.removeItem('timerState');
        }
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [debouncedNotesPanelState, debouncedPinnedItems, debouncedTimetableEntries, debouncedAppLinks, debouncedJournalEntries, debouncedTimerState, debouncedVisibleTabs, debouncedStudiedSubjects, debouncedPandaState]);

  // Keyboard shortcut for global search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (timerState.status !== 'running' || timerState.remaining <= 0) {
        if (timerState.status === 'running' && timerState.remaining <= 0) {
             setTimerState(prev => ({ ...prev, status: 'inactive' }));
             // Future: Add a sound effect here
        }
        return;
    }

    const interval = setInterval(() => {
        setTimerState(prev => ({ ...prev, remaining: prev.remaining > 0 ? prev.remaining - 1 : 0 }));
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.status, timerState.remaining]);

  const handleTogglePin = (item: PinnedItem) => {
    setPinnedItems(prev => {
        const isPinned = prev.some(p => p.id === item.id);
        return isPinned ? prev.filter(p => p.id !== item.id) : [...prev, item];
    });
  };

  const handleAddTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    setTimetableEntries(prev => [...prev, { ...entry, id: Date.now().toString() }]);
  };

  const handleAddMultipleTimetableEntries = (entries: Omit<TimetableEntry, 'id'>[]) => {
    const newEntries = entries.map((entry, index) => ({ ...entry, id: `${Date.now()}-${index}`}));
    setTimetableEntries(prev => [...prev, ...newEntries]);
  };

  const handleRemoveTimetableEntry = (id: string) => {
    setTimetableEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleAddAppLink = (link: Omit<AppLink, 'id'>) => {
    setAppLinks(prev => [...prev, { ...link, id: Date.now().toString() }]);
  };

  const handleRemoveAppLink = (id: string) => {
    setAppLinks(prev => prev.filter(l => l.id !== id));
  };

  const handleAddJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    setJournalEntries(prev => [{ ...entry, id: Date.now().toString() }, ...prev]);
  };
  
  const handleUpdateJournalEntry = (updatedEntry: JournalEntry) => {
    setJournalEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };
  
  const handleRemoveJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleFeedPanda = () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (pandaState.lastFed === today) return;

      setPandaState(prev => {
          const newStreak = prev.lastFed === yesterday ? prev.streak + 1 : 1;
          return {
              streak: newStreak,
              lastFed: today,
              isHappy: true
          };
      });
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setIsSearchOpen(false);
    switch (result.type) {
      case 'theorist':
      case 'csp':
        setView('media-studies');
        break;
      case 'journal':
        setView('journal');
        break;
      case 'note':
        setNotesPanelState(prev => ({
          ...prev,
          isOpen: true,
          activeTabId: result.item.id,
        }));
        break;
    }
  };

  const handleToggleNotesPanel = () => {
    setNotesPanelState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };
  
  const handleSetupComplete = (settings: { visibleTabs: VisibleTabs; subjects: string[] }) => {
    setVisibleTabs(settings.visibleTabs);
    setStudiedSubjects(settings.subjects);
    localStorage.setItem('setupCompleted', 'true');
    setAppState('main');
  };

  const handleEnter = () => {
    if (localStorage.getItem('setupCompleted')) {
        setAppState('main');
    } else {
        setAppState('setup');
    }
  };
  
  // Timer handlers
  const handleStartTimer = (durationInSeconds: number) => {
    setTimerState({
        status: 'running',
        duration: durationInSeconds,
        remaining: durationInSeconds,
        view: 'fullscreen',
        position: { x: window.innerWidth - 180, y: window.innerHeight - 80 }
    });
    setIsTimerSetupOpen(false);
  };

  const handleExitTimer = () => {
    setTimerState(prev => ({
        ...prev,
        status: 'inactive',
        duration: 0,
        remaining: 0,
        view: 'hidden',
    }));
  };

  const handleMinimizeTimer = () => {
    setTimerState(prev => ({ ...prev, view: 'minimized' }));
  };

  const handleMaximizeTimer = () => {
    setTimerState(prev => ({ ...prev, view: 'fullscreen' }));
  };

  const renderContent = () => {
    switch (appState) {
        case 'landing':
            return <HomePage onEnter={handleEnter} />;
        case 'setup':
            return <SetupPage onComplete={handleSetupComplete} />;
        case 'main':
            return (
                <>
                    <Navbar view={view} setView={setView} onOpenSearch={() => setIsSearchOpen(true)} visibleTabs={visibleTabs} />
                    <main className="pt-20">
                        <div key={view}>
                            {view === 'dashboard' && (
                            <Dashboard
                                pinnedItems={pinnedItems}
                                onTogglePin={handleTogglePin}
                                timetableEntries={timetableEntries}
                                onAddTimetableEntry={handleAddTimetableEntry}
                                onAddMultipleTimetableEntries={handleAddMultipleTimetableEntries}
                                onRemoveTimetableEntry={handleRemoveTimetableEntry}
                                appLinks={appLinks}
                                onAddAppLink={handleAddAppLink}
                                onRemoveAppLink={handleRemoveAppLink}
                                setView={setView}
                                theme={theme}
                                setTheme={setTheme}
                                studiedSubjects={studiedSubjects}
                                onSetupTimer={() => setIsTimerSetupOpen(true)}
                                pandaState={pandaState}
                                onFeedPanda={handleFeedPanda}
                            />
                            )}
                            {view === 'media-studies' && (
                            <MediaStudiesPage
                                pinnedItems={pinnedItems}
                                onTogglePin={handleTogglePin}
                            />
                            )}
                            {view === 'film-studies' && <FilmStudiesPage setView={setView} />}
                            {view === 'ai-tutor' && <AiTutorPage />}
                            {view === 'news' && <NewsPage />}
                            {view === 'journal' && (
                            <JournalPage 
                                entries={journalEntries}
                                onAdd={handleAddJournalEntry}
                                onUpdate={handleUpdateJournalEntry}
                                onRemove={handleRemoveJournalEntry}
                            />
                            )}
                        </div>
                    </main>
                    <FloatingTools 
                        onOpenSettings={() => setIsSettingsPanelOpen(true)}
                        onToggleNotes={handleToggleNotesPanel}
                    />
                    <NotesPanel 
                        state={notesPanelState} 
                        setState={setNotesPanelState} 
                    />
                    <SettingsPanel 
                        isOpen={isSettingsPanelOpen} 
                        onClose={() => setIsSettingsPanelOpen(false)} 
                        theme={theme} 
                        setTheme={setTheme}
                        fontFamily={fontFamily}
                        setFontFamily={setFontFamily}
                        visibleTabs={visibleTabs}
                        setVisibleTabs={setVisibleTabs}
                    />
                    <GlobalSearch 
                        isOpen={isSearchOpen}
                        onClose={() => setIsSearchOpen(false)}
                        theorists={theoristData}
                        csps={cspsData}
                        journalEntries={journalEntries}
                        notes={notesPanelState.tabs}
                        onResultClick={handleSearchResultClick}
                    />
                    <TimerSetupModal 
                        isOpen={isTimerSetupOpen}
                        onClose={() => setIsTimerSetupOpen(false)}
                        onStart={handleStartTimer}
                    />
                    {timerState.view === 'fullscreen' && (
                        <FullscreenTimer 
                            remainingSeconds={timerState.remaining}
                            duration={timerState.duration}
                            onMinimize={handleMinimizeTimer}
                            onExit={handleExitTimer}
                        />
                    )}
                    {timerState.view === 'minimized' && (
                        <MinimizedTimer
                            remainingSeconds={timerState.remaining}
                            position={timerState.position}
                            onPositionChange={(pos) => setTimerState(prev => ({...prev, position: pos}))}
                            onMaximize={handleMaximizeTimer}
                            onExit={handleExitTimer}
                        />
                    )}
                </>
            );
        default:
            return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-transparent animate-fade-in">
      <div ref={followerRef} className="cursor-follower"></div>
      <AnimatedBackground />
      {renderContent()}
    </div>
  );
};

export default App;