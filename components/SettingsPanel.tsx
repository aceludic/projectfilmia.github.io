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
  onStartTour: () => void;
  onLogout: () => void;
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


const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, theme, setTheme, fontFamily, setFontFamily, visibleTabs, setVisibleTabs, onStartTour, onLogout }) => {
    if (!isOpen) return null;

    const fontOptions: { value: FontFamily; label: string }[] = [
        { value: 'lora', label: 'Lora (Serif - Default)' },
        { value: 'merriweather', label: 'Merriweather (Serif)' },
        { value: 'playfair-display', label: 'Playfair Display (Serif)' },
        { value: 'inter', label: 'Inter (Sans-serif)' },
        { value: 'lato', label: 'Lato (Sans-serif)' },
        { value: 'lexend', label: 'Lexend (Dyslexic Friendly)' },
        { value: 'inconsolata', label: 'Inconsolata (Monospace)' },
      ];

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
                className="w-full max-w-md h-auto max-h-[85vh] liquid-glass rounded-2xl flex flex-col animate-scale-in"
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
                    <SettingsSection title="Account">
                        <button onClick={onLogout} className="w-full text-center px-4 py-2 bg-red-600/20 text-red-700 dark:text-red-300 rounded-md font-bold hover:bg-red-600/30 transition-colors">
                            Log Out
                        </button>
                    </SettingsSection>
                    
                    <SettingsSection title="Appearance" description="Customize the look and feel of the app.">
                        <div className="bg-glass-300 dark:bg-white/5 p-3 rounded-md space-y-4">
                            <div>
                                <label className="text-sm font-medium text-stone-800 dark:text-beige-200 block mb-3">
                                    Theme
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <ThemeButton value="light">Light</ThemeButton>
                                    <ThemeButton value="dark">Dark</ThemeButton>
                                    <ThemeButton value="night">Night</ThemeButton>
                                    <ThemeButton value="synthwave">Synthwave</ThemeButton>
                                    <ThemeButton value="noir">Noir</ThemeButton>
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
                        <div className="bg-glass-300 dark:bg-white/5 p-3 rounded-md space-y-3">
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
                            <ToggleSwitch 
                                label="Show Social Hub Tab"
                                checked={visibleTabs['social-hub']}
                                onChange={(checked) => setVisibleTabs({ ...visibleTabs, 'social-hub': checked })}
                           />
                        </div>
                    </SettingsSection>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;