
import React, { useState, useEffect } from 'react';
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
import { NotesPanelState, PinnedItem, TimetableEntry, AppLink, JournalEntry, FontFamily, SearchResult } from './types';
import { theoristData } from './data/theoristsData';
import { cspsData } from './data/cspsData';


export type LoggedInView = 'dashboard' | 'media-studies' | 'film-studies' | 'ai-tutor' | 'news' | 'journal';
export type Theme = 'light' | 'dark' | 'night';

// Helper for loading from localStorage
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
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

const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'main'>('landing');
  const [view, setView] = useState<LoggedInView>('dashboard');
  const [theme, setTheme] = useState<Theme>(() => loadFromLocalStorage('theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => loadFromLocalStorage('fontFamily', 'lora'));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  
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


  const debouncedNotesPanelState = useDebounce(notesPanelState, 500);
  const debouncedPinnedItems = useDebounce(pinnedItems, 500);
  const debouncedTimetableEntries = useDebounce(timetableEntries, 500);
  const debouncedAppLinks = useDebounce(appLinks, 500);
  const debouncedJournalEntries = useDebounce(journalEntries, 500);


  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
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

  useEffect(() => {
    try {
        localStorage.setItem('fontFamily', fontFamily);
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
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [debouncedNotesPanelState, debouncedPinnedItems, debouncedTimetableEntries, debouncedAppLinks, debouncedJournalEntries]);

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

  // Early access warning banner logic
  useEffect(() => {
    const hasSeenBanner = sessionStorage.getItem('hasSeenWarningBanner');
    if (!hasSeenBanner) {
        setShowWarningBanner(true);
    }
  }, []);

  const handleCloseWarningBanner = () => {
      setShowWarningBanner(false);
      sessionStorage.setItem('hasSeenWarningBanner', 'true');
  };

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

  const handleEnter = () => {
    setAppState('main');
  };

  if (appState === 'landing') {
    return <HomePage onEnter={handleEnter} />;
  }
  
  return (
    <div className="min-h-screen bg-beige-100 dark:bg-stone-900 animate-fade-in">
      <Navbar view={view} setView={setView} onOpenSearch={() => setIsSearchOpen(true)} />
      {showWarningBanner && (
        <div role="alert" className="bg-red-100 border-b-2 border-red-200 text-red-800 px-4 py-3 dark:bg-red-900/30 dark:border-red-500/50 dark:text-red-300 relative text-center text-sm animate-slide-down">
          <span>The website will have issues and are being worked on daily, feel free to report them (in the <b>settings menu</b>).</span>
          <button onClick={handleCloseWarningBanner} className="absolute top-1/2 right-3 -translate-y-1/2 p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50" aria-label="Close warning banner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
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
    </div>
  );
};

export default App;
