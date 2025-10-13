import React, { useState, useEffect, useMemo } from 'react';
import DashboardSection from './DashboardSection';
import SocialIntegrations from './SocialIntegrations';
import RecentPosts from './RecentPosts';
import CustomizationToolbar from './CustomizationToolbar';
import PinnedItemsWidget from './PinnedItemsWidget';
import TimeWidget from './TimeWidget';
import RevisionTimetableWidget from './RevisionTimetableWidget';
import CalendarWidget from './CalendarWidget';
import AppLinksWidget from './AppLinksWidget';
import NewsLinkWidget from './NewsLinkWidget';
import InitialWelcomeModal from './InitialWelcomeModal';
import TimerWidget from './TimerWidget';
import PandaWidget from './PandaWidget';
import { SocialAccount, Post, LayoutItem, PinnedItem, TimetableEntry, AppLink, PandaState } from '../types';
import { LoggedInView, Theme } from '../App';

interface DashboardProps {
    pinnedItems: PinnedItem[];
    onTogglePin: (item: PinnedItem) => void;
    timetableEntries: TimetableEntry[];
    onAddTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
    onAddMultipleTimetableEntries: (entries: Omit<TimetableEntry, 'id'>[]) => void;
    onRemoveTimetableEntry: (id: string) => void;
    appLinks: AppLink[];
    onAddAppLink: (link: Omit<AppLink, 'id'>) => void;
    onRemoveAppLink: (id: string) => void;
    setView: (view: LoggedInView) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    onSetupTimer: () => void;
    studiedSubjects: string[];
    pandaState: PandaState;
    onFeedPanda: () => void;
    isCustomizing: boolean;
    setIsCustomizing: (isCustomizing: boolean) => void;
}

const GRID_COLS = 12;
const CELL_HEIGHT = 50;

// Reorganized layout for a more structured, cube-like grid with more vertical space
const defaultLayout: LayoutItem[] = [
    // Row 1
    { i: 'panda', x: 0, y: 0, w: 4, h: 6 },     // Panda Companion
    { i: 'time', x: 4, y: 0, w: 4, h: 6 },      // Clock (taller for symmetry)
    { i: 'apps', x: 8, y: 0, w: 4, h: 6 },      // My Links (taller)
    // Row 2
    { i: 'timetable', x: 0, y: 6, w: 6, h: 12 }, // Timetable (much taller)
    { i: 'timer', x: 6, y: 6, w: 6, h: 12 },     // Study Timer (much taller)
    // Row 3
    { i: 'pins', x: 0, y: 18, w: 6, h: 12 },     // Pinned Items (much taller)
    { i: 'calendar', x: 6, y: 18, w: 6, h: 12 }, // Calendar (much taller)
    // Row 4
    { i: 'social', x: 0, y: 30, w: 4, h: 12 },   // Social Hub (much taller)
    { i: 'feed', x: 4, y: 30, w: 8, h: 12 },     // Live Feed (much taller)
    // Row 5
    { i: 'news', x: 0, y: 42, w: 12, h: 4 },    // News (slightly taller)
];


const useWindowSize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    useEffect(() => {
        const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
};

const ThemeButton: React.FC<{ value: Theme; currentTheme: Theme; onClick: (theme: Theme) => void; children: React.ReactNode; }> = ({ value, currentTheme, onClick, children }) => {
    const isActive = value === currentTheme;
    return (
        <button
            onClick={() => onClick(value)}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 transform hover:-translate-y-0.5 btn-ripple ${
                isActive
                    ? 'bg-brand-brown-700 text-white shadow-md'
                    : 'bg-glass-300 text-stone-700 dark:text-stone-300 hover:bg-glass-100'
            }`}
        >
            {children}
        </button>
    );
};


const Dashboard: React.FC<DashboardProps> = (props) => {
    const { 
        pinnedItems, onTogglePin, 
        timetableEntries, onAddTimetableEntry, onAddMultipleTimetableEntries, onRemoveTimetableEntry,
        appLinks, onAddAppLink, onRemoveAppLink,
        setView,
        theme,
        setTheme,
        onSetupTimer,
        studiedSubjects,
        pandaState, onFeedPanda,
        isCustomizing, setIsCustomizing
    } = props;
    
    const [windowWidth] = useWindowSize();
    const isMobile = windowWidth < 768;

    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [showInitialWelcome, setShowInitialWelcome] = useState(false);
    
    const [layout, setLayout] = useState<LayoutItem[]>(() => {
        try {
            const savedLayout = localStorage.getItem('dashboard-layout');
            return savedLayout ? JSON.parse(savedLayout) : defaultLayout;
        } catch (error) {
            console.error("Failed to load layout from localStorage", error);
            return defaultLayout;
        }
    });

    const subtitle = useMemo(() => {
        if (!studiedSubjects || studiedSubjects.length === 0) {
            return 'Your personalized media and film studies hub.'; // Fallback
        }
    
        const hasMedia = studiedSubjects.includes('media');
        const hasFilm = studiedSubjects.includes('film');
    
        if (hasMedia && hasFilm) {
            return 'Your personalized hub for Media and Film Studies.';
        } else if (hasMedia) {
            return 'Your personalized hub for Media Studies.';
        } else if (hasFilm) {
            return 'Your personalized hub for Film Studies.';
        }
    
        return 'Your personalized media and film studies hub.'; // Final fallback
    }, [studiedSubjects]);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenDashboardWelcome');
        if (!hasSeenWelcome) {
            const timer = setTimeout(() => setShowInitialWelcome(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);
    
    const handleCloseWelcome = () => {
        setShowInitialWelcome(false);
        localStorage.setItem('hasSeenDashboardWelcome', 'true');
    };

    useEffect(() => {
        try {
            localStorage.setItem('dashboard-layout', JSON.stringify(layout));
        } catch (error) {
            console.error("Failed to save layout to localStorage", error);
        }
    }, [layout]);

    useEffect(() => {
        try {
            const savedAccounts = localStorage.getItem('social-accounts');
            if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
        } catch (error) {
            console.error("Failed to load social accounts from localStorage", error);
        }
    }, []);

    const handleAddAccount = (url: string) => {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.replace('www.', '');
            const platform = hostname.split('.')[0];
            const username = urlObj.pathname.split('/')[1] || platform;
            const newAccount: SocialAccount = { url, username, platform };

            if (!accounts.find(acc => acc.url === url)) {
                const updatedAccounts = [...accounts, newAccount];
                setAccounts(updatedAccounts);
                localStorage.setItem('social-accounts', JSON.stringify(updatedAccounts));
            }
        } catch (error) {
            console.error("Invalid URL:", error);
        }
    };
    
    const handleRemoveAccount = (url: string) => {
        const updatedAccounts = accounts.filter(acc => acc.url !== url);
        setAccounts(updatedAccounts);
        localStorage.setItem('social-accounts', JSON.stringify(updatedAccounts));
    };

    const handleResetLayout = () => {
        setLayout(defaultLayout);
    };

    const handleRemoveWidget = (widgetId: string) => {
        setLayout(prev => prev.filter(item => item.i !== widgetId));
    };

    const handleAddWidget = (widgetId: string) => {
        const widgetToAdd = defaultLayout.find(item => item.i === widgetId);
        if (!widgetToAdd || layout.some(item => item.i === widgetId)) return;

        const newY = layout.length > 0 ? Math.max(0, ...layout.map(l => l.y + l.h)) : 0;

        const newLayoutItem = {
            ...widgetToAdd,
            x: 0,
            y: newY,
            w: Math.min(widgetToAdd.w, GRID_COLS),
        };

        setLayout(prev => [...prev, newLayoutItem]);
    };

    const sections: { [key: string]: { title: string; description?: string; component: React.ReactNode } } = {
        timer: { title: 'Study Timer', component: <TimerWidget onSetup={onSetupTimer} /> },
        social: { title: 'Social Hub', component: <SocialIntegrations accounts={accounts} onAddAccount={handleAddAccount} onRemoveAccount={handleRemoveAccount} /> },
        feed: { title: 'Live Feed', component: <RecentPosts /> },
        pins: { title: 'Pinned Items', component: <PinnedItemsWidget items={pinnedItems} onUnpin={onTogglePin} setView={setView} /> },
        time: { title: 'Clock', component: <TimeWidget /> },
        timetable: { title: 'Revision Timetable', component: <RevisionTimetableWidget entries={timetableEntries} onAdd={onAddTimetableEntry} onRemove={onRemoveTimetableEntry} onAddMultiple={onAddMultipleTimetableEntries} /> },
        calendar: { title: 'Calendar', component: <CalendarWidget entries={timetableEntries} /> },
        apps: { title: 'My Links', component: <AppLinksWidget links={appLinks} onAdd={onAddAppLink} onRemove={onRemoveAppLink} /> },
        news: { title: 'News', component: <NewsLinkWidget setView={setView} /> },
        panda: { title: 'Panda Companion', component: <PandaWidget state={pandaState} onFeed={onFeedPanda} /> },
    };

    const currentWidgetIds = layout.map(item => item.i);
    const availableWidgets = defaultLayout
        .filter(item => !currentWidgetIds.includes(item.i))
        .map(item => ({ id: item.i, title: sections[item.i]?.title || item.i }));

    const totalHeight = layout.length > 0 ? Math.max(...layout.map(l => l.y + l.h)) * CELL_HEIGHT : 0;
    
    const sortedLayout = useMemo(() => {
        return isMobile ? [...layout].sort((a, b) => a.y - b.y || a.x - b.x) : layout;
    }, [layout, isMobile]);


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 animate-glow rounded-3xl">
            <div className="flex justify-between items-start mb-6">
                <div className="text-center flex-grow">
                    <h1 id="dashboard-title" className="text-4xl font-black uppercase text-glow">Dashboard</h1>
                    <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">{subtitle}</p>
                    <div className="mt-4 flex justify-center items-center space-x-2">
                        <ThemeButton value="light" currentTheme={theme} onClick={setTheme}>Light</ThemeButton>
                        <ThemeButton value="dark" currentTheme={theme} onClick={setTheme}>Dark</ThemeButton>
                        <ThemeButton value="night" currentTheme={theme} onClick={setTheme}>Night</ThemeButton>
                    </div>
                </div>
                <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
                    {isCustomizing && (
                        <button 
                        onClick={handleResetLayout}
                        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-bold hover:bg-red-700 transition-colors transform hover:-translate-y-1 animate-fade-in btn-ripple"
                        >
                        Reset Layout
                        </button>
                    )}
                    <button
                        id="customize-button"
                        onClick={() => setIsCustomizing(!isCustomizing)}
                        className={`px-4 py-2 rounded-md font-bold transition-all duration-300 transform hover:-translate-y-1 text-sm btn-ripple ${
                            isCustomizing ? 'bg-green-600 text-white shadow-md animate-glow' : 'bg-brand-brown-700 text-white'
                        }`}
                    >
                        {isCustomizing ? 'Done' : 'Customize'}
                    </button>
                </div>
            </div>
            
            <div className="text-center p-3 mb-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600/50 rounded-lg text-sm text-yellow-800 dark:text-yellow-300 animate-fade-in" role="alert">
                <p><strong>Please note:</strong> We're aware of an issue with page visibility and are working on a fix. We're also addressing some slowness that may affect loading times. Thank you for your patience!</p>
            </div>

            {showInitialWelcome && <InitialWelcomeModal onClose={handleCloseWelcome} />}


            <div 
                className={`transition-all duration-300 ${isMobile ? 'space-y-4' : 'relative'}`}
                style={{ height: isMobile ? 'auto' : `${totalHeight}px` }}
            >
                {sortedLayout.map(item => {
                    const section = sections[item.i];
                    if (!section) return null;
                    return (
                        <DashboardSection
                            key={item.i}
                            title={section.title}
                            description={section.description}
                            layoutItem={item}
                            isCustomizing={isCustomizing}
                            onLayoutChange={setLayout}
                            onRemoveWidget={handleRemoveWidget}
                            gridCols={GRID_COLS}
                            cellHeight={CELL_HEIGHT}
                        >
                            {section.component}
                        </DashboardSection>
                    );
                })}
            </div>
            {isCustomizing && !isMobile && (
                <CustomizationToolbar 
                    onAddWidget={handleAddWidget}
                    availableWidgets={availableWidgets}
                />
            )}
        </div>
    );
};

export default Dashboard;