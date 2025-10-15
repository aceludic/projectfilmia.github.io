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
import JournalPage from './components/JournalPage';
import GlobalSearch from './components/GlobalSearch';
import SettingsPanel from './components/SettingsPanel';
import SetupPage from './components/SetupPage';
import WelcomeTour from './components/WelcomeTour';
import { TimerSetupModal } from './components/TimerSetupModal';
import FullscreenTimer from './components/FullscreenTimer';
import MinimizedTimer from './components/MinimizedTimer';
import SceneAnalysisTool from './components/SceneAnalysisTool';
import TimelinePage from './components/TimelinePage';
import { NotesPanelState, PinnedItem, TimetableEntry, AppLink, JournalEntry, FontFamily, SearchResult, TimerState, VisibleTabs, PandaState, NavbarLayout, CSP, Film, FocusItem, DailySpark, StudyLogEntry, AiInteractionCounts, User, UserData, SocialAccount } from './types';
import { theoristData } from './data/theoristsData';
import { cspsData } from './data/cspsData';
import { getAllUsers, getUser, saveUser, defaultUserData } from './utils/auth';

export type LoggedInView = 'dashboard' | 'media-studies' | 'film-studies' | 'ai-tutor' | 'news' | 'journal' | 'scene-analysis' | 'timeline';
export type Theme = 'light' | 'dark' | 'night' | 'synthwave' | 'noir';

const tourSteps = [
    // ... (tour steps remain the same)
];

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
  const [appStatus, setAppStatus] = useState<'loading' | 'auth' | 'setup' | 'main'>('loading');
  const [view, setView] = useState<LoggedInView>('dashboard');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [isTourPromptVisible, setIsTourPromptVisible] = useState(false);
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
  const debouncedTimerState = useDebounce(timerState, 1000);

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
    // Save user data whenever it changes
    if (currentUser && debouncedUserData) {
      const updatedUser = { ...currentUser, data: debouncedUserData };
      saveUser(updatedUser);
    }
  }, [currentUser, debouncedUserData]);
  
  useEffect(() => {
    // Show tour prompt only when transitioning to main app for the first time
    if (appStatus === 'main' && userData && !userData.hasCompletedTour) {
        setIsTourPromptVisible(true);
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
      setIsTourPromptVisible(true);
    }
  };

  // --- THEME & FONT MANAGEMENT ---

  useEffect(() => {
    if (!userData) return;
    const { theme } = userData;
    const root = document.documentElement;
    root.classList.remove('dark', 'night', 'synthwave', 'noir');
    if (theme === 'dark' || theme === 'night' || theme === 'synthwave' || theme === 'noir') {
        root.classList.add('dark');
    }
    if (theme === 'night' || theme === 'synthwave' || theme === 'noir') {
        root.classList.add(theme);
    }
  }, [userData?.theme]);

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

  // --- BACKGROUND EFFECT ---
  useEffect(() => {
    // (Background effect logic remains the same)
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
  const setNavbarLayout = getHandler('navbarLayout');
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

  const handleAiInteraction = (type: 'summary' | 'spark') => {
    setUserData(prev => {
      if (!prev) return null;
      const newCounts = { ...prev.aiInteractionCounts };
      if (type === 'summary') newCounts.summaryCount++;
      if (type === 'spark') newCounts.sparkCount++;
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
  const handleStartTourFromPrompt = () => {
      setIsTourPromptVisible(false);
      handleStartTour();
  };
  const handleDeclineTour = () => {
      setIsTourPromptVisible(false);
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
            return <HomePage currentUser={currentUser} onLoginSuccess={handleLoginSuccess} onEnterApp={handleEnterApp} onLogout={handleLogout} />;
        case 'setup':
            return <SetupPage onComplete={handleSetupComplete} />;
        case 'main':
            if (!userData) return <div className="min-h-screen w-full flex items-center justify-center"><p>Loading user data...</p></div>;
            return (
                <>
                    {isTourPromptVisible && <TourPromptModal onStart={handleStartTourFromPrompt} onDecline={handleDeclineTour} />}
                    {isTourActive && <WelcomeTour steps={tourSteps} onTourEnd={handleTourEnd} setCustomizing={setIsCustomizing} />}
                    <Navbar view={view} setView={setView} onOpenSearch={() => setIsSearchOpen(true)} visibleTabs={userData.visibleTabs} layout={userData.navbarLayout} />
                    <main className={`transition-all duration-300 ${userData.navbarLayout === 'vertical' ? 'pt-4 md:pl-28' : 'pt-20'}`}>
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
                            {view === 'media-studies' && <MediaStudiesPage pinnedItems={userData.pinnedItems} onTogglePin={handleTogglePin} onLaunchSceneAnalysis={handleLaunchSceneAnalysis} onAiInteraction={handleAiInteraction} logStudySession={logStudySession} unlockAchievement={unlockAchievement} />}
                            {view === 'film-studies' && <FilmStudiesPage setView={setView} onLaunchSceneAnalysis={handleLaunchSceneAnalysis} onAiInteraction={handleAiInteraction} logStudySession={logStudySession} unlockAchievement={unlockAchievement} />}
                            {view === 'ai-tutor' && <AiTutorPage />}
                            {view === 'news' && <NewsPage />}
                            {view === 'journal' && <JournalPage entries={userData.journalEntries} onAdd={handleAddJournalEntry} onUpdate={handleUpdateJournalEntry} onRemove={handleRemoveJournalEntry} />}
                            {view === 'scene-analysis' && <SceneAnalysisTool item={sceneAnalysisItem} />}
                            {view === 'timeline' && <TimelinePage setView={setView} />}
                        </div>
                    </main>
                    <FloatingTools onOpenSettings={() => setIsSettingsPanelOpen(true)} onToggleNotes={() => setNotesPanelState({ ...userData.notesPanelState, isOpen: !userData.notesPanelState.isOpen })} />
                    <NotesPanel state={userData.notesPanelState} setState={setNotesPanelState} />
                    <SettingsPanel isOpen={isSettingsPanelOpen} onClose={() => setIsSettingsPanelOpen(false)} theme={userData.theme} setTheme={setTheme} fontFamily={userData.fontFamily} setFontFamily={setFontFamily} visibleTabs={userData.visibleTabs} setVisibleTabs={setVisibleTabs} navbarLayout={userData.navbarLayout} setNavbarLayout={setNavbarLayout} onStartTour={handleStartTour} onLogout={handleLogout} />
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
        <div className="fixed inset-0 bg-beige-100 dark:bg-stone-900 z-[-3]" />
        <canvas id="background-canvas" className="blur-4xl transform scale-110" />
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