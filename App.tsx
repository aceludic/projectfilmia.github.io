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
  const [userName, setUserName] = useState<string | null>(() => loadFromLocalStorage('userName', null));
  const [theme, setTheme] = useState<Theme>(() => loadFromLocalStorage('theme', 'dark'));
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

  const [isCursorIdle, setIsCursorIdle] = useState(false);
  const idleTimerRef = useRef<number | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const cursorContainerRef = useRef<HTMLDivElement>(null);

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

  // New aesthetic cursor effect with idle fade
  useEffect(() => {
    const dot = dotRef.current;
    const follower = followerRef.current;
    if (!dot || !follower) return;

    let animationFrameId: number;
    const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const followerPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const speed = 0.15;

    const lerp = (start: number, end: number, amount: number) => {
      return (1 - amount) * start + amount * end;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      
      // Reset idle timer on move
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setIsCursorIdle(false);
      idleTimerRef.current = window.setTimeout(() => setIsCursorIdle(true), 5000);
    };
    
    // Set initial timer
    idleTimerRef.current = window.setTimeout(() => setIsCursorIdle(true), 5000);

    const handleClick = () => {
      follower.classList.add('cursor-click');
      follower.addEventListener('animationend', () => {
        follower.classList.remove('cursor-click');
      }, { once: true });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer')) {
            follower.classList.add('cursor-hover');
        }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer')) {
            follower.classList.remove('cursor-hover');
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    const animate = () => {
      followerPos.x = lerp(followerPos.x, mousePos.x, speed);
      followerPos.y = lerp(followerPos.y, mousePos.y, speed);

      dot.style.transform = `translate(${mousePos.x - 4}px, ${mousePos.y - 4}px)`;
      follower.style.transform = `translate(${followerPos.x - 16}px, ${followerPos.y - 16}px)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);


    // New Central Pulsating Orb Background Effect
    useEffect(() => {
        const canvas = document.getElementById('background-canvas') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationFrameId: number;
        let frame = 0;
        let currentHue = Math.random() * 360;
        let targetHue = currentHue;

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const hueInterval = setInterval(() => {
            targetHue = (targetHue + 60 + Math.random() * 60) % 360;
        }, 4500);

        const drawWaves = (ctx: CanvasRenderingContext2D, hue: number) => {
            const wave1 = { amp: height * 0.1, freq: 0.005, speed: 0.005 };
            const wave2 = { amp: height * 0.15, freq: 0.003, speed: -0.008 };
        
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
        
            const drawWave = (wave: typeof wave1, colorAlpha: number) => {
                ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${colorAlpha})`;
                ctx.beginPath();
                ctx.moveTo(0, height);
                for (let x = 0; x <= width; x++) {
                    const y = Math.sin(x * wave.freq + frame * wave.speed) * wave.amp + height * 0.7;
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(width, height);
                ctx.closePath();
                ctx.fill();
            };
        
            drawWave(wave1, 0.03);
            drawWave(wave2, 0.04);
        
            ctx.restore();
        };


        class Orb {
            isCentral: boolean;
            baseRadius: number;
            radius: number;
            orbitRadius: number;
            speed: number;
            color: { s: number; l: number; };
            angle: number;
            pulseAngle: number;
            pulseSpeed: number;
            pulseAmount: number;

            constructor(isCentral: boolean, baseRadius: number, orbitRadius: number, speed: number) {
                this.isCentral = isCentral;
                this.baseRadius = baseRadius;
                this.radius = baseRadius;
                this.orbitRadius = orbitRadius;
                this.speed = speed;
                this.color = { s: 90, l: 55 };
                this.angle = Math.random() * Math.PI * 2;
                this.pulseAngle = Math.random() * Math.PI * 2;
                this.pulseSpeed = 0.005 + Math.random() * 0.01;
                this.pulseAmount = this.baseRadius * 0.12;
            }

            update() {
                this.pulseAngle += this.pulseSpeed;
                this.radius = this.baseRadius + Math.sin(this.pulseAngle) * this.pulseAmount;
                if (!this.isCentral) {
                    this.angle += this.speed;
                }
            }

            draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, hue: number) {
                let x = centerX;
                let y = centerY;
                if (!this.isCentral) {
                    x = centerX + Math.cos(this.angle) * this.orbitRadius;
                    y = centerY + Math.sin(this.angle) * this.orbitRadius;
                }

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.radius);
                const colorString = `hsla(${hue}, ${this.color.s}%, ${this.color.l}%, 0.6)`;
                const transparentColor = `hsla(${hue}, ${this.color.s}%, ${this.color.l}%, 0)`;
                gradient.addColorStop(0, colorString);
                gradient.addColorStop(1, transparentColor);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let orbs: Orb[] = [];
        const init = () => {
            orbs = [];
            const centralRadius = Math.max(width, height) * 0.85;
            // Central Orb
            orbs.push(new Orb(true, centralRadius, 0, 0));
            // Orbiting Orbs
            orbs.push(new Orb(false, centralRadius / 20, centralRadius * 0.7, 0.002));
            orbs.push(new Orb(false, centralRadius / 25, centralRadius * 0.8, -0.0025));
            orbs.push(new Orb(false, centralRadius / 28, centralRadius * 0.85, 0.0015));
            orbs.push(new Orb(false, centralRadius / 30, centralRadius * 0.9, -0.001));
        };
        
        const lerpAngle = (a: number, b: number, t: number) => {
            const diff = b - a;
            let delta = diff;
            if (Math.abs(diff) > 180) {
                delta = diff > 0 ? diff - 360 : diff + 360;
            }
            return (a + delta * t + 360) % 360;
        };

        const animate = () => {
            if (!ctx) return;
            const centerX = width / 2;
            const centerY = height / 2;
            frame++;
            
            currentHue = lerpAngle(currentHue, targetHue, 0.01);
            const hue = currentHue;
            
            ctx.clearRect(0, 0, width, height);

            drawWaves(ctx, hue);
            
            orbs.forEach(orb => {
                orb.update();
                orb.draw(ctx, centerX, centerY, hue);
            });
            
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearInterval(hueInterval);
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
  
  const handleSetupComplete = (settings: { name: string; visibleTabs: VisibleTabs; subjects: string[] }) => {
    setUserName(settings.name);
    localStorage.setItem('userName', JSON.stringify(settings.name));
    
    setVisibleTabs(settings.visibleTabs);
    setStudiedSubjects(settings.subjects);
    
    localStorage.setItem('setupCompleted', 'true');
    setAppState('main');

    const hasCompletedTour = localStorage.getItem('hasCompletedTour');
    if (!hasCompletedTour) {
      setIsTourPromptVisible(true);
    }
  };

  const handleEnter = (skipSetup = false) => {
    const setupCompleted = localStorage.getItem('setupCompleted');
    if (setupCompleted || skipSetup) {
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
                                userName={userName}
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
        {/* Background Layers - These must come first to be in the background */}
        <div className="fixed inset-0 bg-beige-100 dark:bg-stone-900 z-[-3]" />
        <canvas id="background-canvas" className="blur-4xl transform scale-110" />
        <div className="vignette-overlay" />

        {/* Content is in the normal flow, on top of background */}
        <div className="relative z-[1]">
            <div ref={cursorContainerRef} className={`cursor hidden md:block ${isCursorIdle ? 'cursor-idle' : ''}`}>
                <div ref={dotRef} className="cursor-dot"></div>
                <div ref={followerRef} className="cursor-follower"></div>
            </div>
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