import React, { useState } from 'react';
import { Theme } from '../App';
import { FontFamily, VisibleTabs } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  visibleTabs: VisibleTabs;
  setVisibleTabs: (tabs: VisibleTabs) => void;
}

const SettingsSection: React.FC<{ title: string; description?: string; children: React.ReactNode; isDanger?: boolean }> = ({ title, description, children, isDanger = false }) => (
    <div className={`p-4 ${isDanger ? '' : 'border-b border-glass-border dark:border-glass-border-dark'}`}>
      <h4 className={`text-lg font-bold ${isDanger ? 'text-red-500 dark:text-red-400' : 'text-stone-800 dark:text-beige-100'}`}>{title}</h4>
      {description && <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{description}</p>}
      <div className="mt-4 space-y-4">
        {children}
      </div>
    </div>
  );
  
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string; }> = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium text-stone-800 dark:text-beige-200">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-brand-brown-700' : 'bg-stone-500/30 dark:bg-black/20'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
        </div>
    </label>
);


const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, theme, setTheme, fontFamily, setFontFamily, visibleTabs, setVisibleTabs }) => {
    const [feedback, setFeedback] = useState<Record<string, string | null>>({});

    const fontOptions: { value: FontFamily; label: string }[] = [
        { value: 'lora', label: 'Lora (Serif - Default)' },
        { value: 'merriweather', label: 'Merriweather (Serif)' },
        { value: 'playfair-display', label: 'Playfair Display (Serif)' },
        { value: 'inter', label: 'Inter (Sans-serif)' },
        { value: 'lato', label: 'Lato (Sans-serif)' },
        { value: 'lexend', label: 'Lexend (Dyslexic Friendly)' },
        { value: 'inconsolata', label: 'Inconsolata (Monospace)' },
      ];

    const handleResetModals = () => {
        try {
            sessionStorage.removeItem('hasSeenMediaStudiesDisclaimer');
            localStorage.removeItem('hasSeenDashboardWelcome');
            localStorage.removeItem('setupCompleted');
            setFeedback({...feedback, modals: 'Welcome pop-ups & setup will now show again.' });
        } catch (error) {
            console.error("Could not reset modals", error);
            setFeedback({...feedback, modals: 'Could not reset pop-ups.' });
        }
    };
    
    const handleResetLayout = () => {
        try {
            localStorage.removeItem('dashboard-layout');
            setFeedback({...feedback, layout: 'Layout will reset on next page load.' });
        } catch (error) {
            console.error("Could not reset layout in localStorage", error);
            setFeedback({...feedback, layout: 'Could not reset layout.' });
        }
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to clear ALL local data? This will remove your notes, journal entries, social accounts, and dashboard layout. This action cannot be undone.')) {
            try {
                localStorage.clear();
                window.location.reload();
            } catch (error) {
                console.error("Could not clear localStorage", error);
                alert("An error occurred while trying to clear data.");
            }
        }
    };

    if (!isOpen) return null;

    const ThemeButton: React.FC<{ value: Theme, children: string }> = ({ value, children }) => {
        const isActive = theme === value;
        return (
            <button
                onClick={() => setTheme(value)}
                className={`flex-1 px-3 py-2 text-sm font-bold rounded-md transition-all btn-ripple ${isActive ? 'bg-brand-brown-700 text-white shadow-md' : 'bg-glass-300 text-stone-800 dark:text-beige-200 hover:bg-glass-100'}`}
            >
                {children}
            </button>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-fade-in flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="w-full max-w-md h-auto max-h-[85vh] bg-glass-200 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl flex flex-col animate-scale-in border border-glass-border dark:border-glass-border-dark glass-reflective"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-glass-border dark:border-glass-border-dark">
                    <h3 className="text-lg font-bold text-stone-800 dark:text-beige-100">Settings</h3>
                    <button onClick={onClose} className="text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white btn-ripple rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto">
                    <SettingsSection title="Appearance" description="Customize the look and feel of the app.">
                        <div className="bg-glass-300 dark:bg-black/10 p-3 rounded-md space-y-4">
                            <div>
                                <label className="text-sm font-medium text-stone-800 dark:text-beige-200 block mb-3">
                                    Theme
                                </label>
                                <div className="flex items-center space-x-2">
                                    <ThemeButton value="light">Light</ThemeButton>
                                    <ThemeButton value="dark">Dark</ThemeButton>
                                    <ThemeButton value="night">Night</ThemeButton>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="font-select" className="text-sm font-medium text-stone-800 dark:text-beige-200 block mb-2">
                                    Font Family
                                </label>
                                <select
                                    id="font-select"
                                    value={fontFamily}
                                    onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                                    className="w-full px-3 py-2 border border-glass-border dark:border-glass-border-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-brown-700 focus:border-brand-brown-700 sm:text-sm bg-glass-300 text-stone-800 dark:text-beige-100"
                                >
                                    {fontOptions.map(option => (
                                        <option key={option.value} value={option.value} className="bg-beige-100 dark:bg-stone-800">{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </SettingsSection>

                    <SettingsSection title="Navigation" description="Show or hide main navigation tabs.">
                        <div className="bg-glass-300 dark:bg-black/10 p-3 rounded-md space-y-3">
                           <ToggleSwitch 
                                label="Show Media Studies Tab"
                                checked={visibleTabs['media-studies']}
                                onChange={(checked) => setVisibleTabs({ ...visibleTabs, 'media-studies': checked })}
                           />
                           <ToggleSwitch 
                                label="Show Film Studies Tab"
                                checked={visibleTabs['film-studies']}
                                onChange={(checked) => setVisibleTabs({ ...visibleTabs, 'film-studies': checked })}
                           />
                        </div>
                    </SettingsSection>
                    
                    <SettingsSection title="Support & Feedback">
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSctftbiSZdIgzk3YXlsMaEOh1Q1sI70nQ5DiKbK2I3Qd19uHw/viewform?usp=header"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full px-4 py-3 bg-glass-300 dark:bg-black/10 rounded-md hover:bg-glass-100 transition-colors btn-ripple"
                        >
                            <span className="font-bold text-sm text-stone-800 dark:text-beige-100">Report an Issue</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-600 dark:text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </SettingsSection>

                    <SettingsSection title="Data Management" description="Manage data stored in your browser.">
                         <div className="flex flex-col items-start space-y-2">
                             <button onClick={handleResetModals} className="text-sm text-brand-brown-700 dark:text-amber-500 hover:underline">
                                 Reset Welcome & Setup Screens
                             </button>
                             {feedback.modals && <p className="text-xs text-stone-500 dark:text-stone-400">{feedback.modals}</p>}
                         </div>
                         <div className="flex flex-col items-start space-y-2">
                             <button onClick={handleResetLayout} className="text-sm text-brand-brown-700 dark:text-amber-500 hover:underline">
                                 Reset Dashboard Layout
                             </button>
                              {feedback.layout && <p className="text-xs text-stone-500 dark:text-stone-400">{feedback.layout}</p>}
                         </div>
                    </SettingsSection>
                    
                    <SettingsSection title="Danger Zone" isDanger={true}>
                        <div className="bg-red-500/10 p-3 rounded-md border border-red-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h5 className="text-sm font-bold text-red-700 dark:text-red-400">Clear All Local Data</h5>
                                    <p className="text-xs text-red-600 dark:text-red-400/80 mt-1">This will permanently delete all your notes, linked accounts, and dashboard layout.</p>
                                </div>
                                <button
                                    onClick={handleClearData}
                                    className="ml-4 px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors btn-ripple"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </SettingsSection>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;