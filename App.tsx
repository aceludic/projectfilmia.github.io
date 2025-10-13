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
import WelcomeTour from './components/WelcomeTour';
// FIX: Use named import for TimerSetupModal to resolve module loading error.
import { TimerSetupModal } from './components/TimerSetupModal';
import FullscreenTimer from './components/FullscreenTimer';
import MinimizedTimer from './components/MinimizedTimer';
import { NotesPanelState, PinnedItem, TimetableEntry, AppLink, JournalEntry, FontFamily, SearchResult, TimerState, VisibleTabs, PandaState, NavbarLayout } from './types';
import { theoristData } from './data/theoristsData';
import { cspsData } from './data/cspsData';


export type LoggedInView = 'dashboard' | 'media-studies' | 'film-studies' | 'ai-tutor' | 'news' | 'journal';
export type Theme = 'light' | 'dark' | 'night';

const tourSteps = [
    {
        targetId: 'dashboard-title',
        title: 'Welcome to Your Dashboard!',
        content: 'This is your central hub. Everything you need is organized into these widgets.',
        placement: 'bottom',
    },
    {
        targetId: 'customize-button',
        title: 'Make It Your Own',
        content: 'Click here to enter customization mode. You can then move, resize, and remove widgets to fit your workflow.',
        placement: 'left',
        before: (setCustomizing: (val: boolean) => void) => setCustomizing(false),
        after: (setCustomizing: (val: boolean) => void) => setCustomizing(false),
    },
    {
        targetId: 'customize-button',
        title: 'Editing Widgets',
        content: 'Once in customize mode, widgets will have a pulsing border. You can drag them from the title bar or resize them from the bottom-right corner.',
        placement: 'left',
        before: (setCustomizing: (val: boolean) => void) => setCustomizing(true),
    },
    {
        targetId: 'add-widget-button',
        title: 'Add & Remove Widgets',
        content: 'Use the toolbar at the bottom to add widgets you\'ve removed. You can remove a widget by clicking the \'X\' that appears in customize mode.',
        placement: 'top',
        before: (setCustomizing: (val: boolean) => void) => setCustomizing(true),
        after: (setCustomizing: (val: boolean) => void) => setCustomizing(false),
    },
    {
        targetId: 'widget-pins',
        title: 'Quick Access Pins',
        content: 'When you\'re browsing Media or Film Studies, you can pin important theorists or CSPs. They\'ll show up here for easy access.',
        placement: 'right',
    },
    {
        targetId: 'floating-tools',
        title: 'Handy Tools',
        content: 'Quickly open your notes or access the settings panel from anywhere in the app using these floating buttons.',
        placement: 'left',
    },
];

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

// Robust loader for NotesPanel state to prevent issues with corrupted data
const loadNotesPanelState = (): NotesPanelState => {
    const defaultState: NotesPanelState = {
        isOpen: false,
        position: { x: window.innerWidth - 520, y: 100 },
        size: { width: 500, height: 400 },
        tabs: [{ id: '1', title: 'General Notes', content: '' }],
        activeTabId: '1',
    };

    try {
        const saved = localStorage.getItem('notesPanelState');
        if (!saved) return defaultState;
        
        const parsed = JSON.parse(saved);
        const validatedState = { ...defaultState, ...parsed };

        if (!Array.isArray(validatedState.tabs) || validatedState.tabs.length === 0) {
            validatedState.tabs = defaultState.tabs;
        }

        if (!validatedState.tabs.some(tab => tab.id === validatedState.activeTabId)) {
            validatedState.activeTabId = validatedState.tabs[0]?.id || null;
        }

        return validatedState;
    } catch (error) {
        console.error("Failed to load or validate notesPanelState from localStorage", error);
        return defaultState;
    }
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

const TourPromptModal: React.FC<{ onStart: () => void; onDecline: () => void }> = ({ onStart, onDecline }) => (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onDecline}>
        <div className="bg-glass-200 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-scale-in border border-glass-border dark:border-glass-border-dark" onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-2">Welcome!</h2>
            <p className="text-stone-600 dark:text-stone-300 mb-6">
                Would you like a quick, interactive tour of the dashboard features? You can also start it later from the settings menu.
            </p>
            <div className="flex justify-center space-x-4">
                <button onClick={onDecline} className="px-6 py-2 bg-glass-300 text-stone-800 dark:text-white rounded-md font-bold btn-ripple">No, thanks</button>
                <button onClick={onStart} className="px-6 py-2 bg-brand-brown-700 text-white rounded-md font-bold btn-ripple">Start Tour</button>
            </div>
        </div>
    </div>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'setup' | 'main'>('landing');
  const [view, setView] = useState<LoggedInView>('dashboard');
  const [theme, setTheme] = useState<Theme>(() => loadFromLocalStorage('theme', 'light'));
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => loadFromLocalStorage('fontFamily', 'lexend'));
  const [navbarLayout, setNavbarLayout] = useState<NavbarLayout>(() => loadFromLocalStorage('navbarLayout', 'horizontal'));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [isTourPromptVisible, setIsTourPromptVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  const [notesPanelState, setNotesPanelState] = useState<NotesPanelState>(loadNotesPanelState);

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

  const cursorFollowerRef = useRef<HTMLDivElement>(null);

  const debouncedNotesPanelState = useDebounce(notesPanelState, 500);
  const debouncedPinnedItems = useDebounce(pinnedItems, 500);
  const debouncedTimetableEntries = useDebounce(timetableEntries, 500);
  const debouncedAppLinks = useDebounce(appLinks, 500);
  const debouncedJournalEntries = useDebounce(journalEntries, 500);
  const debouncedTimerState = useDebounce(timerState, 1000);
  const debouncedVisibleTabs = useDebounce(visibleTabs, 500);
  const debouncedStudiedSubjects = useDebounce(studiedSubjects, 500);
  const debouncedPandaState = useDebounce(pandaState, 500);
  const debouncedNavbarLayout = useDebounce(navbarLayout, 500);


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
        localStorage.setItem('navbarLayout', JSON.stringify(debouncedNavbarLayout));
        if (debouncedTimerState.status !== 'inactive') {
            localStorage.setItem('timerState', JSON.stringify(debouncedTimerState));
        } else {
            localStorage.removeItem('timerState');
        }
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [debouncedNotesPanelState, debouncedPinnedItems, debouncedTimetableEntries, debouncedAppLinks, debouncedJournalEntries, debouncedTimerState, debouncedVisibleTabs, debouncedStudiedSubjects, debouncedPandaState, debouncedNavbarLayout]);

    // Re-added cursor follower effect with performance optimization
    useEffect(() => {
        if (!cursorFollowerRef.current) return;

        const follower = cursorFollowerRef.current;
        let animationFrameId: number;

        const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                // Set top/left to move the element's origin, and let CSS transform handle centering
                follower.style.left = `${clientX}px`;
                follower.style.top = `${clientY}px`;
            });
        };

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Glowing blob canvas background effect
    useEffect(() => {
        const canvas = document.getElementById('background-canvas') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationFrameId: number;

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        
        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        class Circle {
            x: number;
            y: number;
            radius: number;
            dx: number;
            dy: number;
            hue: number;
            opacity: number;
            
            constructor(x: number, y: number, radius: number, dx: number, dy: number, hue: number, opacity: number) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.dx = dx;
                this.dy = dy;
                this.hue = hue;
                this.opacity = opacity;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.01, this.x, this.y, this.radius);
                const color = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
                const transparentColor = `hsla(${this.hue}, 80%, 70%, 0)`;
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, transparentColor);
                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fill();
            }

            update() {
                if (this.x + this.radius > width || this.x - this.radius < 0) {
                    this.dx = -this.dx;
                }
                if (this.y + this.radius > height || this.y - this.radius < 0) {
                    this.dy = -this.dy;
                }
                this.x += this.dx;
                this.y += this.dy;
                this.hue = (this.hue + 1.0) % 360; // Animate hue faster
                this.draw();
            }
        }

        let circles: Circle[] = [];
        const init = () => {
            circles = [];
            const baseHues = [random(10, 50), random(180, 220), random(280, 320)]; // Warm, Cool, Purple/Pink
            
            for (let i = 0; i < 3; i++) {
                const radius = random(width / 3, width / 1.5);
                const x = random(radius, width - radius);
                const y = random(radius, height - radius);
                const dx = random(-0.8, 0.8); // Faster movement
                const dy = random(-0.8, 0.8); // Faster movement
                circles.push(new Circle(x, y, radius, dx, dy, baseHues[i], 0.9)); // Increased opacity
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            circles.forEach(circle => circle.update());
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);


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

    const hasCompletedTour = localStorage.getItem('hasCompletedTour');
    if (!hasCompletedTour) {
      setIsTourPromptVisible(true);
    }
  };

  const handleEnter = () => {
    const setupCompleted = localStorage.getItem('setupCompleted');
    if (setupCompleted) {
      setAppState('main');
    } else {
      setAppState('setup');
    }
  };
  
  const handleStartTour = () => {
    setIsTourActive(true);
  };
  
  const handleTourEnd = () => {
    setIsTourActive(false);
    localStorage.setItem('hasCompletedTour', 'true');
  };
  
  const handleStartTourFromPrompt = () => {
      setIsTourPromptVisible(false);
      handleStartTour();
  };

  const handleDeclineTour = () => {
      setIsTourPromptVisible(false);
      localStorage.setItem('hasCompletedTour', 'true');
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
                    {isTourPromptVisible && <TourPromptModal onStart={handleStartTourFromPrompt} onDecline={handleDeclineTour} />}
                    {isTourActive && (
                        <WelcomeTour
                            steps={tourSteps}
                            onTourEnd={handleTourEnd}
                            setCustomizing={setIsCustomizing}
                        />
                    )}
                    <Navbar 
                        view={view} 
                        setView={setView} 
                        onOpenSearch={() => setIsSearchOpen(true)} 
                        visibleTabs={visibleTabs}
                        layout={navbarLayout}
                    />
                    <main className={`transition-all duration-300 ${navbarLayout === 'vertical' ? 'pt-4 md:pl-28' : 'pt-20'}`}>
                        <div key={view} className="animate-merge-in">
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
                                isCustomizing={isCustomizing}
                                setIsCustomizing={setIsCustomizing}
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
                        navbarLayout={navbarLayout}
                        setNavbarLayout={setNavbarLayout}
                        onStartTour={handleStartTour}
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
    <div className="relative min-h-screen">
        {/* Background Layers */}
        <div className="fixed inset-0 bg-beige-100 dark:bg-stone-900 -z-20 transition-colors duration-300" />
        <canvas id="background-canvas" className="blur-4xl transform scale-110" />
        <div className="vignette-overlay" />

        {/* Content is in the normal flow (z-index auto), on top of background */}
        <div className="relative z-[1]">
            <div ref={cursorFollowerRef} className="cursor-follower hidden md:block" />
            <div className="animate-fade-in">
                {renderContent()}
            </div>
        </div>

        {/* Foreground Overlay */}
        <div className="film-grain-overlay" />
    </div>
  );
};

export default App;