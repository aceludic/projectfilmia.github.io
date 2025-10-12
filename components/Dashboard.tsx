import React, { useState, useEffect } from 'react';
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
import { SocialAccount, Post, LayoutItem, PinnedItem, TimetableEntry, AppLink } from '../types';
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
}

const GRID_COLS = 12;
const CELL_HEIGHT = 50;

const defaultLayout: LayoutItem[] = [
    { i: 'time', x: 0, y: 0, w: 2, h: 4 },
    { i: 'apps', x: 2, y: 0, w: 2, h: 4 },
    { i: 'pins', x: 0, y: 4, w: 4, h: 10 },
    { i: 'timetable', x: 4, y: 0, w: 8, h: 8 },
    { i: 'calendar', x: 4, y: 8, w: 8, h: 6 },
    { i: 'social', x: 0, y: 14, w: 4, h: 8 },
    { i: 'feed', x: 4, y: 14, w: 8, h: 8 },
    { i: 'news', x: 0, y: 22, w: 12, h: 3 },
];


const Dashboard: React.FC<DashboardProps> = (props) => {
    const { 
        pinnedItems, onTogglePin, 
        timetableEntries, onAddTimetableEntry, onAddMultipleTimetableEntries, onRemoveTimetableEntry,
        appLinks, onAddAppLink, onRemoveAppLink,
        setView,
        theme,
        setTheme,
    } = props;

    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [isCustomizing, setIsCustomizing] = useState(false);
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

    useEffect(() => {
        const hasCompletedTour = localStorage.getItem('hasCompletedTour');
        if (!hasCompletedTour) {
            setShowInitialWelcome(true);
        }
    }, []);
    
    const handleCloseWelcome = () => {
        setShowInitialWelcome(false);
        localStorage.setItem('hasCompletedTour', 'true');
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
        social: { title: 'Social Hub', component: <SocialIntegrations accounts={accounts} onAddAccount={handleAddAccount} onRemoveAccount={handleRemoveAccount} /> },
        feed: { title: 'Live Feed', component: <RecentPosts /> },
        pins: { title: 'Pinned Items', component: <PinnedItemsWidget items={pinnedItems} onUnpin={onTogglePin} setView={setView} /> },
        time: { title: 'Clock', component: <TimeWidget /> },
        timetable: { title: 'Revision Timetable', component: <RevisionTimetableWidget entries={timetableEntries} onAdd={onAddTimetableEntry} onRemove={onRemoveTimetableEntry} onAddMultiple={onAddMultipleTimetableEntries} /> },
        calendar: { title: 'Calendar', component: <CalendarWidget /> },
        apps: { title: 'My Links', component: <AppLinksWidget links={appLinks} onAdd={onAddAppLink} onRemove={onRemoveAppLink} /> },
        news: { title: 'News', component: <NewsLinkWidget setView={setView} /> },
    };

    const currentWidgetIds = layout.map(item => item.i);
    const availableWidgets = defaultLayout
        .filter(item => !currentWidgetIds.includes(item.i))
        .map(item => ({ id: item.i, title: sections[item.i]?.title || item.i }));

    const totalHeight = layout.length > 0 ? Math.max(...layout.map(l => l.y + l.h)) * CELL_HEIGHT : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 animate-fade-in-up">
            {showInitialWelcome && <InitialWelcomeModal onClose={handleCloseWelcome} theme={theme} setTheme={setTheme} />}
            <div className="flex justify-between items-center mb-12">
                <div className="text-center flex-grow">
                    <h1 className="text-4xl font-black uppercase">Dashboard</h1>
                    <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">Your personalized media and film studies hub.</p>
                </div>
                <div className="flex items-center space-x-2">
                    {isCustomizing && (
                        <button 
                        onClick={handleResetLayout}
                        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-bold hover:bg-red-700 transition-colors transform hover:-translate-y-1 animate-fade-in"
                        >
                        Reset Layout
                        </button>
                    )}
                    <button
                        id="customize-button"
                        onClick={() => setIsCustomizing(!isCustomizing)}
                        className={`px-4 py-2 rounded-md font-bold transition-all duration-300 transform hover:-translate-y-1 text-sm ${
                            isCustomizing ? 'bg-green-600 text-white shadow-md' : 'bg-brand-brown-700 text-white'
                        }`}
                    >
                        {isCustomizing ? 'Done' : 'Customize'}
                    </button>
                </div>
            </div>

            <div 
                className="relative" 
                style={{ height: `${totalHeight}px` }}
            >
                {layout.map(item => {
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
            {isCustomizing && (
                <CustomizationToolbar 
                    onAddWidget={handleAddWidget}
                    availableWidgets={availableWidgets}
                />
            )}
        </div>
    );
};

export default Dashboard;