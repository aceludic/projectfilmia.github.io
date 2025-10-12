import React, { useState } from 'react';
import SettingsPanel from './SettingsPanel';
import { Theme } from '../App';
import { NotesPanelState, FontFamily } from '../types';

interface FloatingToolsProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setNotesPanelState: React.Dispatch<React.SetStateAction<NotesPanelState>>;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
}

const FloatingTools: React.FC<FloatingToolsProps> = ({ theme, setTheme, setNotesPanelState, fontFamily, setFontFamily }) => {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  return (
    <>
      <div 
        id="floating-tools"
        className="fixed bottom-8 right-8 z-50 flex flex-col items-center space-y-4"
      >
        <button
          onClick={() => setIsSettingsPanelOpen(true)}
          className="bg-stone-600 text-white rounded-full p-4 shadow-lg hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-beige-100 dark:focus:ring-offset-stone-900 transition-transform transform hover:scale-110"
          aria-label="Toggle Settings Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button
          onClick={() => setNotesPanelState(prev => ({ ...prev, isOpen: !prev.isOpen }))}
          className="bg-brand-brown-700 text-white rounded-full p-4 shadow-lg hover:bg-brand-brown-800 focus:outline-none focus:ring-2 focus:ring-brand-brown-700 focus:ring-offset-2 focus:ring-offset-beige-100 dark:focus:ring-offset-stone-900 transition-transform transform hover:scale-110"
          aria-label="Toggle Notes Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
      <SettingsPanel 
        isOpen={isSettingsPanelOpen} 
        onClose={() => setIsSettingsPanelOpen(false)} 
        theme={theme} 
        setTheme={setTheme}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
      />
    </>
  );
};

export default FloatingTools;