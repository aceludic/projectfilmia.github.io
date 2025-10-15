import React, { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import FloatingTools from './components/FloatingTools';
import MediaStudiesPage from './components/MediaStudiesPage';
import FilmStudiesPage from './components/FilmStudiesPage';
import AiTutorPage from './components/AiTutorPage';
import NewsPage from './components/NewsPage';
import NotesPanel from './components/NotesPanel';
import SocialHubPage from './components/SocialHubPage';
import GlobalSearch from './components/GlobalSearch';
import SettingsPanel from './components/SettingsPanel';
import SetupPage from './components/SetupPage';
import WelcomeTour from './components/WelcomeTour';
import { TimerSetupModal } from './components/TimerSetupModal';
import FullscreenTimer from './components/FullscreenTimer';
import MinimizedTimer from './components/MinimizedTimer';
import SceneAnalysisTool from './components/SceneAnalysisTool';
import TimelinePage from './components/TimelinePage';
import { NotesPanelState, PinnedItem, TimetableEntry, AppLink, JournalEntry, FontFamily, SearchResult, TimerState, VisibleTabs, PandaState, CSP, Film, FocusItem, DailySpark, StudyLogEntry, AiInteractionCounts, User, UserData, SocialAccount, CustomFlashcardDeck, NoteTab } from './types';
import { theoristData } from './data/theoristsData';
import { cspsData } from './data/cspsData';
import { getAllUsers, getUser, saveUser, defaultUserData } from './utils/auth';

export type LoggedInView = 'dashboard' | 'media-studies' | 'film-studies' | 'ai-tutor' | 'news' | 'social-hub' | 'scene-analysis' | 'timeline';
export type Theme = 'light' | 'dark' | 'night' | 'synthwave' | 'noir';

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

const WelcomeGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div className="liquid-glass rounded-2xl shadow-2xl max-w-3xl w-full p-6 md:p-8 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-stone-800 dark:text-beige-100 mb-4 text-center">Welcome to Project Filmia!</h2>
            <p className="text-center text-stone-600 dark:text-stone-300 mb-6">Your all-in-one hub for Media & Film Studies revision. Here's everything you can do:</p>
            <div className="overflow-y-auto pr-4 text-sm text-stone-700 dark:text-stone-300 space-y-4">
                
                <h3 className="font-bold text-lg text-stone-800 dark:text-beige-100 mt-2">✨ The Dashboard: Your Personal Hub</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Dynamic Island Navigation:</strong> Hover over the notch at the top to reveal the main menu. It includes the time and will auto-collapse when you're not using it.</li>
                    <li><strong>Customizable Widgets:</strong> Click 'Customize' to rearrange your dashboard. Widgets include: <strong>Today's Focus</strong> (daily to-do list), <strong>Study Progress</strong> (track your revision time), <strong>Pinned Items</strong>, <strong>Revision Spark</strong> (daily AI question), <strong>Study Streak</strong> (the Panda!), <strong>Achievements</strong>, a <strong>Clock</strong>, <strong>My Links</strong> (quick access to websites), a <strong>Revision Timetable</strong>, and the <strong>Social Hub</strong> (for following creators).</li>
                    <li><strong>Gamification:</strong> Stay motivated by building your <strong>Study Streak</strong> (complete a quiz or timer session to feed the panda) and unlocking <strong>Achievements</strong> for your hard work.</li>
                </ul>

                <h3 className="font-bold text-lg text-stone-800 dark:text-beige-100 mt-4">📚 Study Hubs: Media & Film</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Dedicated Sections:</strong> Dive into hubs for AQA Media Studies and WJEC/Eduqas Film Studies, with detailed notes on Theorists, CSPs, Set Films, and Key Concepts.</li>
                    <li><strong>Pinning (☆):</strong> Click the star icon on any study card to add it to your 'Pinned Items' widget on the dashboard for quick access.</li>
                    <li><strong>Powerful Revision Zone:</strong> Inside each hub, the 'Revise' tab contains:
                        <ul className="list-['-_'] list-inside ml-4 space-y-1 mt-1">
                            <li><strong>Flashcards & Mind Maps:</strong> For quick recall and visual learning.</li>
                            <li><strong>Quizzes:</strong> Generate quizzes for a whole topic or a specific film/theorist.</li>
                            <li><strong>Custom Flashcard Decks:</strong> Create, edit, and study your own personalized flashcards.</li>
                            <li><strong>Theorist Comparison:</strong> Get an AI-powered breakdown of how two theorists relate to each other.</li>
                        </ul>
                    </li>
                </ul>

                <h3 className="font-bold text-lg text-stone-800 dark:text-beige-100 mt-4">🤖 AI-Powered Tools (Phoebe)</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>AI Tutor Hub ('Phoebe'):</strong> Your central command for AI help. Chat with Phoebe for quick answers, plan essays with the 'Essay Planner', or get your practice essays marked with the 'AI Essay Marker'.</li>
                    <li><strong>Smart Study Tools:</strong> On any study page, use the buttons for 'AI Summaries', finding 'Synoptic Links' between topics, or launching the 'Interactive Analysis' tool for detailed feedback on scenes, ads, and more.</li>
                    <li><strong>"Save to Notes" Integration:</strong> Almost anywhere you get feedback or generate content with AI, you can click a button to save it directly to a new note for later.</li>
                </ul>

                <h3 className="font-bold text-lg text-stone-800 dark:text-beige-100 mt-4">🛠️ Personalization & Tools</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Floating Tools (Bottom Right):</strong> Access your multi-tab 'Notes Panel' and 'Settings' from anywhere on the site.</li>
                    <li><strong>Advanced Settings:</strong> Customize your experience with multiple themes (<strong>Light, Dark, Night, Synthwave, Noir</strong>) and fonts (including the dyslexic-friendly <strong>Lexend</strong>).</li>
                    <li><strong>Global Search:</strong> Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">⌘K</kbd> or <kbd>Ctrl+K</kbd> to search everything in the app.</li>
                    <li><strong>Study Timer:</strong> Start a focused revision session with the fullscreen or minimizable timer.</li>
                    <li><strong>Social Hub:</strong> Contains your personal 'Media Journal' and links to our upcoming 'Community' platforms.</li>
                </ul>

                <h3 className="font-bold text-lg text-stone-800 dark:text-beige-100 mt-4">👤 Your Account & The Experience</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Local & Private:</strong> For your privacy, all account data is stored locally on your device and browser. You can also use 'Continue as Guest' for a session-only experience.</li>
                    <li><strong>Aesthetic UI:</strong> Enjoy the 'Liquid Glass' design, the animated orb background, and the custom animated cursor for a unique and beautiful revision environment.</li>
                </ul>
            </div>
            <div className="mt-6 text-center flex-shrink-0">
                <button onClick={onClose} className="px-8 py-3 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple text-lg">Let's Get Started</button>
            </div>
        </div>
    </div>
);


const App: React.FC = () => {
  const [appStatus, setAppStatus] = useState<'loading' | 'auth' | 'setup' | 'main'>('loading');
  const [view, setView] = useState<LoggedInView>('dashboard');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [isWelcomeGuideVisible, setIsWelcomeGuideVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [sceneAnalysisItem, setSceneAnalysisItem] = useState<Film | CSP | null>(null);

  const [isTimerSetupOpen, setIsTimerSetupOpen] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>({
      status: 'inactive',
      duration: 0,
      remaining: 0,
      view: 'hidden',
      position: { x: window.innerWidth - 180, y: window.innerHeight - 80 },
  });
  
  const [isCursorIdle, setIsCursorIdle] = useState(false);
  const idleTimerRef = useRef<number | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const cursorContainerRef = useRef<HTMLDivElement>(null);

  const debouncedUserData = useDebounce(userData, 500);

  // --- AUTH & DATA MANAGEMENT ---

  useEffect(() => {
    // On initial load, check for a logged-in user. Always show auth/welcome screen first.
    const loggedInUsername = localStorage.getItem('currentUser');
    if (loggedInUsername) {
      const user = getUser(loggedInUsername);
      if (user) {
        setCurrentUser(user);
        setUserData(user.data);
      } else {
        localStorage.removeItem('currentUser');
      }
    }
    setAppStatus('auth');
  }, []);

  useEffect(() => {
    // Save user data whenever it changes, but NOT for guest users.
    if (currentUser && !currentUser.isGuest && debouncedUserData) {
      const updatedUser = { ...currentUser, data: debouncedUserData };
      saveUser(updatedUser);
    }
  }, [currentUser, debouncedUserData]);
  
  useEffect(() => {
    // Show welcome guide only when transitioning to main app for the first time
    if (appStatus === 'main' && userData && !userData.hasCompletedTour) {
        setIsWelcomeGuideVisible(true);
    }
  }, [appStatus, userData]);

  const handleLoginSuccess = (username: string) => {
    const user = getUser(username);
    if (user) {
      localStorage.setItem('currentUser', user.username);
      setCurrentUser(user);
      setUserData(user.data);
      if (user.data.setupCompleted) {
        setAppStatus('main');
      } else {
        setAppStatus('setup');
      }
    }
  };

  const handleContinueAsGuest = () => {
    const guestUser: User = {
        username: `guest_${Date.now()}`,
        password: '',
        isGuest: true,
        data: { ...defaultUserData, name: 'Guest' },
    };
    setCurrentUser(guestUser);
    setUserData(guestUser.data);
    setAppStatus('setup'); // Guests always go through setup
  };

  const handleEnterApp = () => {
    if (userData?.setupCompleted) {
        setAppStatus('main');
    } else if (currentUser) {
        setAppStatus('setup');
    } else {
        setAppStatus('auth');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setUserData(null);
    setAppStatus('auth');
  };

  const handleSetupComplete = (settings: { name: string; visibleTabs: VisibleTabs; subjects: string[] }) => {
    if (!userData) return;

    const completedUserData: UserData = {
      ...userData,
      name: settings.name,
      visibleTabs: settings.visibleTabs,
      studiedSubjects: settings.subjects,
      setupCompleted: true,
    };
    
    setUserData(completedUserData);
    setAppStatus('main');

    if (!completedUserData.hasCompletedTour) {
      setIsWelcomeGuideVisible(true);
    }
  };

  // --- THEME & FONT MANAGEMENT ---

  useEffect(() => {
    const root = document.documentElement;
    // Always clear old theme classes first
    root.classList.remove('dark', 'night', 'synthwave', 'noir');

    // Default to dark mode on the auth screen, otherwise use the user's preference.
    const isDarkTheme = userData ? (userData.theme !== 'light') : true;

    if (isDarkTheme) {
        root.classList.add('dark');
    }

    // Apply specific theme variants like 'night', 'synthwave', or 'noir' if applicable
    if (userData && userData.theme !== 'light' && userData.theme !== 'dark') {
        root.classList.add(userData.theme);
    }
  }, [appStatus, userData?.theme]);

  useEffect(() => {
    if (!userData) return;
    const { fontFamily } = userData;
    const body = document.body;
    const fontClasses: string[] = ['font-lora', 'font-merriweather', 'font-playfair-display', 'font-inter', 'font-lato', 'font-lexend', 'font-inconsolata'];
    body.classList.remove(...fontClasses);
    body.classList.add(`font-${fontFamily}`);
  }, [userData?.fontFamily]);


  // --- CURSOR EFFECT ---
  useEffect(() => {
    if (!cursorContainerRef.current || !dotRef.current || !followerRef.current) return;

    const dot = dotRef.current;
    const follower = followerRef.current;
    
    let dotX = 0, dotY = 0;
    
    let currentDotX = 0, currentDotY = 0;
    let currentFollowerX = 0, currentFollowerY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
      
      setIsCursorIdle(false);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => setIsCursorIdle(true), 2000);
    };

    const animateCursor = () => {
        currentDotX += (dotX - currentDotX) * 0.9;
        currentDotY += (dotY - currentDotY) * 0.9;
        
        currentFollowerX += (dotX - currentFollowerX) * 0.2;
        currentFollowerY += (dotY - currentFollowerY) * 0.2;
        
        if (dot) {
            dot.style.transform = `translate3d(${currentDotX - 4}px, ${currentDotY - 4}px, 0)`;
        }
        if (follower) {
            follower.style.transform = `translate3d(${currentFollowerX - 16}px, ${currentFollowerY - 16}px, 0)`;
        }

        requestAnimationFrame(animateCursor);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer')) {
            follower.classList.add('cursor-hover');
        }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer')) {
            follower.classList.remove('cursor-hover');
        }
    };

    const handleMouseDown = () => follower.classList.add('cursor-click');
    const handleMouseUp = () => follower.classList.remove('cursor-click');

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    animateCursor();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  // --- NEW LIQUID ORB BACKGROUND EFFECT ---
  useEffect(() => {
    const canvas = document.getElementById('background-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let frame = 0;

    const orb = {
        x: width / 2,
        y: height / 2,
        radius: Math.min(width, height) * 0.6,
        xOff: Math.random() * 1000,
        yOff: Math.random() * 1000,
    };

    const smallOrbs: any[] = [];
    for (let i = 0; i < 5; i++) {
        smallOrbs.push({
            angle: Math.random() * Math.PI * 2,
            orbitRadius: orb.radius * (0.4 + Math.random() * 0.5),
            speed: 0.001 + Math.random() * 0.002,
            size: Math.random() * 20 + 10,
        });
    }
    
    // A simple noise function
    function noise(x: number) {
        return Math.sin(x * 0.5) + Math.sin(x * 1.5) + Math.sin(x * 3.5);
    }

    function animate() {
        frame++;
        ctx!.clearRect(0, 0, width, height);
        
        // Move main orb gently
        orb.x = width / 2 + noise(frame * 0.0005 + orb.xOff) * (width * 0.1);
        orb.y = height / 2 + noise(frame * 0.0005 + orb.yOff) * (height * 0.1);

        // Main Orb
        const hue = (frame * 0.1) % 360;
        const mainGradient = ctx!.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        mainGradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 0.4)`);
        mainGradient.addColorStop(1, `hsla(${hue + 60}, 100%, 70%, 0)`);
        ctx!.fillStyle = mainGradient;
        ctx!.beginPath();
        ctx!.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx!.fill();
        
        // Small Orbs
        smallOrbs.forEach((sOrb, i) => {
            sOrb.angle += sOrb.speed;
            const x = orb.x + Math.cos(sOrb.angle) * sOrb.orbitRadius;
            const y = orb.y + Math.sin(sOrb.angle) * sOrb.orbitRadius;
            
            const smallHue = (hue + i * 40) % 360;
            const smallGradient = ctx!.createRadialGradient(x, y, 0, x, y, sOrb.size);
            smallGradient.addColorStop(0, `hsla(${smallHue}, 100%, 80%, 0.6)`);
            smallGradient.addColorStop(1, `hsla(${smallHue}, 100%, 80%, 0)`);
            
            ctx!.fillStyle = smallGradient;
            ctx!.beginPath();
            ctx!.arc(x, y, sOrb.size, 0, Math.PI * 2);
            ctx!.fill();
        });

        requestAnimationFrame(animate);
    }
    
    function onResize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        orb.radius = Math.min(width, height) * 0.6;
        smallOrbs.forEach(sOrb => sOrb.orbitRadius = orb.radius * (0.4 + Math.random() * 0.5));
    }

    window.addEventListener('resize', onResize);
    animate();

    return () => window.removeEventListener('resize', onResize);
  }, []);
  
   // --- KEYBOARD SHORTCUT ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- DATA HANDLERS (These now update the userData state object) ---

  const getHandler = <K extends keyof UserData>(key: K) => (value: UserData[K]) => {
    setUserData(prev => prev ? { ...prev, [key]: value } : null);
  };
  
  const setTheme = getHandler('theme');
  const setFontFamily = getHandler('fontFamily');
  const setNotesPanelState = getHandler('notesPanelState');
  const setVisibleTabs = getHandler('visibleTabs');
  const setFocusItems = getHandler('focusItems');
  const setDailySpark = getHandler('dailySpark');

  const handleTogglePin = (item: PinnedItem) => {
    setUserData(prev => {
      if (!prev) return null;
      const isPinned = prev.pinnedItems.some(p => p.id === item.id);
      const newPinnedItems = isPinned ? prev.pinnedItems.filter(p => p.id !== item.id) : [...prev.pinnedItems, item];
      return { ...prev, pinnedItems: newPinnedItems };
    });
  };

  const handleAddTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    setUserData(prev => prev ? { ...prev, timetableEntries: [...prev.timetableEntries, { ...entry, id: Date.now().toString() }] } : null);
  };

  const handleAddMultipleTimetableEntries = (entries: Omit<TimetableEntry, 'id'>[]) => {
    setUserData(prev => {
      if (!prev) return null;
      const newEntries = entries.map((entry, index) => ({ ...entry, id: `${Date.now()}-${index}`}));
      return { ...prev, timetableEntries: [...prev.timetableEntries, ...newEntries] };
    });
  };

  const handleRemoveTimetableEntry = (id: string) => {
    setUserData(prev => prev ? { ...prev, timetableEntries: prev.timetableEntries.filter(e => e.id !== id) } : null);
  };
  
  const handleAddAppLink = (link: Omit<AppLink, 'id'>) => {
     setUserData(prev => prev ? { ...prev, appLinks: [...prev.appLinks, { ...link, id: Date.now().toString() }] } : null);
  };

  const handleRemoveAppLink = (id: string) => {
    setUserData(prev => prev ? { ...prev, appLinks: prev.appLinks.filter(l => l.id !== id) } : null);
  };
  
    const handleAddSocialAccount = (url: string) => {
        setUserData(prev => {
            if (!prev) return null;
            try {
                const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
                const hostname = urlObj.hostname.replace('www.', '');
                const platform = hostname.split('.')[0] || 'website';
                const pathParts = urlObj.pathname.split('/').filter(p => p);
                const username = pathParts[0] || hostname;

                const newAccount: SocialAccount = {
                    url: urlObj.toString(),
                    username,
                    platform,
                };

                if (prev.socialAccounts.some(acc => acc.url === newAccount.url)) {
                    return prev;
                }

                return { ...prev, socialAccounts: [...prev.socialAccounts, newAccount] };
            } catch (e) {
                console.error("Invalid URL for social account", e);
                return prev;
            }
        });
    };

    const handleRemoveSocialAccount = (url: string) => {
        setUserData(prev => prev ? { ...prev, socialAccounts: prev.socialAccounts.filter(acc => acc.url !== url) } : null);
    };

  const handleAddJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
     setUserData(prev => prev ? { ...prev, journalEntries: [{ ...entry, id: Date.now().toString() }, ...prev.journalEntries] } : null);
  };
  
  const handleUpdateJournalEntry = (updatedEntry: JournalEntry) => {
    setUserData(prev => prev ? { ...prev, journalEntries: prev.journalEntries.map(e => e.id === updatedEntry.id ? updatedEntry : e) } : null);
  };
  
  const handleRemoveJournalEntry = (id: string) => {
    setUserData(prev => prev ? { ...prev, journalEntries: prev.journalEntries.filter(e => e.id !== id) } : null);
  };

  const handleAddNote = (title: string, content: string) => {
    setUserData(prev => {
        if (!prev) return null;
        const newTab: NoteTab = {
            id: Date.now().toString(),
            title,
            content,
        };
        return {
            ...prev,
            notesPanelState: {
                ...prev.notesPanelState,
                tabs: [...prev.notesPanelState.tabs, newTab],
                activeTabId: newTab.id,
                isOpen: true, // Automatically open the panel to show the new note
            }
        };
    });
};

  const handleAddDeck = (newDeck: Omit<CustomFlashcardDeck, 'id'>) => {
    const deckWithId = { ...newDeck, id: Date.now().toString() };
    setUserData(prev => prev ? { ...prev, customFlashcardDecks: [...prev.customFlashcardDecks, deckWithId] } : null);
  };

  const handleUpdateDeck = (updatedDeck: CustomFlashcardDeck) => {
    setUserData(prev => prev ? { ...prev, customFlashcardDecks: prev.customFlashcardDecks.map(d => d.id === updatedDeck.id ? updatedDeck : d) } : null);
  };

  const handleDeleteDeck = (deckId: string) => {
    setUserData(prev => prev ? { ...prev, customFlashcardDecks: prev.customFlashcardDecks.filter(d => d.id !== deckId) } : null);
  };


  const unlockAchievement = (id: string) => {
    setUserData(prev => {
      if (!prev || prev.unlockedAchievements.includes(id)) return prev;
      return { ...prev, unlockedAchievements: [...prev.unlockedAchievements, id] };
    });
  };

  const logStudySession = (durationInSeconds: number) => {
      if (durationInSeconds <= 0) return;
      setUserData(prev => {
        if (!prev) return null;
        const today = new Date().toISOString().split('T')[0];
        let newLog = [...prev.studyLog];

        if (prev.studyLog.length === 0) {
            unlockAchievement('first_steps');
        }
        const todayEntryIndex = prev.studyLog.findIndex(entry => entry.date === today);
        if (todayEntryIndex > -1) {
            newLog[todayEntryIndex] = { ...newLog[todayEntryIndex], duration: newLog[todayEntryIndex].duration + durationInSeconds };
        } else {
            newLog.push({ date: today, duration: durationInSeconds });
        }
        return { ...prev, studyLog: newLog };
      });
  };

  const handleAiInteraction = (type: 'summary' | 'spark' | 'synoptic') => {
    setUserData(prev => {
      if (!prev) return null;
      const newCounts = { ...prev.aiInteractionCounts };
      if (type === 'summary') newCounts.summaryCount++;
      if (type === 'spark') newCounts.sparkCount++;
      if (type === 'synoptic') newCounts.synopticCount++;
      return { ...prev, aiInteractionCounts: newCounts };
    });
  };
  
  // --- DERIVED STATE & TIMER LOGIC ---
  const derivedPandaState = useMemo<PandaState>(() => {
      if (!userData) return { streak: 0, lastFed: null, isHappy: true };
      const { studyLog } = userData;
      const sortedLog = [...studyLog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (sortedLog.length === 0) return { streak: 0, lastFed: null, isHappy: true };

      const todayStr = new Date().toISOString().split('T')[0];
      let streak = 0;
      if (sortedLog.length > 0) {
          let currentStreak = 0;
          let expectedDate = new Date();
          const hasStudiedToday = sortedLog.some(log => log.date === expectedDate.toISOString().split('T')[0]);
          if (hasStudiedToday) {
              currentStreak++;
              expectedDate.setDate(expectedDate.getDate() - 1);
          } else {
              expectedDate.setDate(expectedDate.getDate() - 1);
          }
          for (const entry of sortedLog) {
              const entryDate = new Date(entry.date + 'T12:00:00Z');
              if (entryDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
                  currentStreak++;
                  expectedDate.setDate(expectedDate.getDate() - 1);
              } else if (entryDate < expectedDate) {
                  break;
              }
          }
          streak = currentStreak;
      }
      const lastFed = sortedLog[0].date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isHappy = lastFed === todayStr || lastFed === yesterday.toISOString().split('T')[0];
      if (!isHappy && streak > 0) streak = 0;
      if (streak >= 7 && !userData.unlockedAchievements.includes('streak_7')) unlockAchievement('streak_7');
      return { streak, lastFed, isHappy };
  }, [userData?.studyLog]);
  
  useEffect(() => {
    if (!userData) return;
    const totalTime = userData.studyLog.reduce((acc, entry) => acc + entry.duration, 0);
    if (totalTime >= 3600 && !userData.unlockedAchievements.includes('time_master_1')) unlockAchievement('time_master_1');
    if (userData.aiInteractionCounts.summaryCount >= 5 && !userData.unlockedAchievements.includes('theorist_scholar')) unlockAchievement('theorist_scholar');
    if (userData.aiInteractionCounts.sparkCount >= 5 && !userData.unlockedAchievements.includes('spark_of_genius')) unlockAchievement('spark_of_genius');
  }, [userData?.studyLog, userData?.aiInteractionCounts, userData?.unlockedAchievements]);

  useEffect(() => {
    // (Timer logic remains the same)
  }, [timerState.status, timerState.remaining]);


  const handleStartTour = () => setIsTourActive(true);
  const handleTourEnd = () => {
    setIsTourActive(false);
    setUserData(prev => prev ? { ...prev, hasCompletedTour: true } : null);
  };
  const handleCloseWelcomeGuide = () => {
      setIsWelcomeGuideVisible(false);
      setUserData(prev => prev ? { ...prev, hasCompletedTour: true } : null);
  };

  const handleLaunchSceneAnalysis = (item: Film | CSP) => {
    setSceneAnalysisItem(item);
    setView('scene-analysis');
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

  const handleExitTimer = (timeSpentInSeconds: number) => {
    logStudySession(timeSpentInSeconds);
    setTimerState(prev => ({ ...prev, status: 'inactive', duration: 0, remaining: 0, view: 'hidden' }));
  };
  
  const renderContent = () => {
    switch (appStatus) {
        case 'loading':
            return <div className="min-h-screen w-full flex items-center justify-center"><p>Loading...</p></div>;
        case 'auth':
            return <HomePage currentUser={currentUser} onLoginSuccess={handleLoginSuccess} onContinueAsGuest={handleContinueAsGuest} onEnterApp={handleEnterApp} onLogout={handleLogout} />;
        case 'setup':
            return <SetupPage onComplete={handleSetupComplete} />;
        case 'main':
            if (!userData) return <div className="min-h-screen w-full flex items-center justify-center"><p>Loading user data...</p></div>;
            return (
                <>
                    {isWelcomeGuideVisible && <WelcomeGuideModal onClose={handleCloseWelcomeGuide} />}
                    {isTourActive && <WelcomeTour steps={[]} onTourEnd={handleTourEnd} setCustomizing={setIsCustomizing} />}
                    <Navbar view={view} setView={setView} onOpenSearch={() => setIsSearchOpen(true)} visibleTabs={userData.visibleTabs} />
                    <main className="transition-all duration-300 pt-28">
                        <div key={view} className="animate-merge-in">
                            {view === 'dashboard' && (
                            <Dashboard
                                userName={userData.name}
                                pinnedItems={userData.pinnedItems}
                                onTogglePin={handleTogglePin}
                                timetableEntries={userData.timetableEntries}
                                onAddTimetableEntry={handleAddTimetableEntry}
                                onAddMultipleTimetableEntries={handleAddMultipleTimetableEntries}
                                onRemoveTimetableEntry={handleRemoveTimetableEntry}
                                appLinks={userData.appLinks}
                                onAddAppLink={handleAddAppLink}
                                onRemoveAppLink={handleRemoveAppLink}
                                socialAccounts={userData.socialAccounts}
                                onAddSocialAccount={handleAddSocialAccount}
                                onRemoveSocialAccount={handleRemoveSocialAccount}
                                setView={setView}
                                theme={userData.theme}
                                setTheme={setTheme}
                                studiedSubjects={userData.studiedSubjects}
                                onSetupTimer={() => setIsTimerSetupOpen(true)}
                                pandaState={derivedPandaState}
                                isCustomizing={isCustomizing}
                                setIsCustomizing={setIsCustomizing}
                                studyLog={userData.studyLog}
                                focusItems={userData.focusItems}
                                setFocusItems={setFocusItems}
                                unlockedAchievements={userData.unlockedAchievements}
                                unlockAchievement={unlockAchievement}
                                dailySpark={userData.dailySpark}
                                setDailySpark={setDailySpark}
                                onAiInteraction={handleAiInteraction}
                            />
                            )}
                            {view === 'media-studies' && <MediaStudiesPage setView={setView} pinnedItems={userData.pinnedItems} onTogglePin={handleTogglePin} onLaunchSceneAnalysis={handleLaunchSceneAnalysis} onAiInteraction={handleAiInteraction} logStudySession={logStudySession} unlockAchievement={unlockAchievement} customDecks={userData.customFlashcardDecks} onAddDeck={handleAddDeck} onUpdateDeck={handleUpdateDeck} onDeleteDeck={handleDeleteDeck} onAddNote={handleAddNote} />}
                            {view === 'film-studies' && <FilmStudiesPage setView={setView} onLaunchSceneAnalysis={handleLaunchSceneAnalysis} onAiInteraction={handleAiInteraction} logStudySession={logStudySession} unlockAchievement={unlockAchievement} customDecks={userData.customFlashcardDecks} onAddDeck={handleAddDeck} onUpdateDeck={handleUpdateDeck} onDeleteDeck={handleDeleteDeck} onAddNote={handleAddNote} pinnedItems={userData.pinnedItems} onTogglePin={handleTogglePin} />}
                            {view === 'ai-tutor' && <AiTutorPage onAddNote={handleAddNote} />}
                            {view === 'news' && <NewsPage />}
                            {view === 'social-hub' && <SocialHubPage entries={userData.journalEntries} onAdd={handleAddJournalEntry} onUpdate={handleUpdateJournalEntry} onRemove={handleRemoveJournalEntry} />}
                            {view === 'scene-analysis' && <SceneAnalysisTool item={sceneAnalysisItem} onAddNote={handleAddNote} />}
                            {view === 'timeline' && <TimelinePage setView={setView} />}
                        </div>
                    </main>
                    <FloatingTools onOpenSettings={() => setIsSettingsPanelOpen(true)} onToggleNotes={() => setNotesPanelState({ ...userData.notesPanelState, isOpen: !userData.notesPanelState.isOpen })} />
                    <NotesPanel state={userData.notesPanelState} setState={setNotesPanelState} />
                    <SettingsPanel isOpen={isSettingsPanelOpen} onClose={() => setIsSettingsPanelOpen(false)} theme={userData.theme} setTheme={setTheme} fontFamily={userData.fontFamily} setFontFamily={setFontFamily} visibleTabs={userData.visibleTabs} setVisibleTabs={setVisibleTabs} onStartTour={handleStartTour} onLogout={handleLogout} />
                    <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} theorists={theoristData} csps={cspsData} journalEntries={userData.journalEntries} notes={userData.notesPanelState.tabs} onResultClick={() => {}} />
                    <TimerSetupModal isOpen={isTimerSetupOpen} onClose={() => setIsTimerSetupOpen(false)} onStart={handleStartTimer} />
                    {timerState.view === 'fullscreen' && <FullscreenTimer remainingSeconds={timerState.remaining} duration={timerState.duration} onMinimize={() => setTimerState(prev => ({ ...prev, view: 'minimized' }))} onExit={handleExitTimer} />}
                    {timerState.view === 'minimized' && <MinimizedTimer remainingSeconds={timerState.remaining} duration={timerState.duration} position={timerState.position} onPositionChange={(pos) => setTimerState(prev => ({...prev, position: pos}))} onMaximize={() => setTimerState(prev => ({ ...prev, view: 'fullscreen' }))} onExit={handleExitTimer} />}
                </>
            );
        default:
            return null;
    }
  };
  
  return (
    <div className="relative min-h-screen">
        <div className="fixed inset-0 bg-gray-50 dark:bg-stone-950 z-[-3]" />
        <canvas id="background-canvas" className="blur-4xl transform scale-110 opacity-70" />
        <div className="vignette-overlay" />
        
        <div className="relative z-[1]">
            <div ref={cursorContainerRef} className={`cursor hidden md:block ${isCursorIdle ? 'cursor-idle' : ''}`}>
                <div ref={dotRef} className="cursor-dot"></div>
                <div ref={followerRef} className="cursor-follower"></div>
            </div>
            <div className="animate-fade-in">
                {renderContent()}
            </div>
        </div>
        <div className="film-grain-overlay" />
    </div>
  );
};

export default App;
