import React, { useState } from 'react';
import AiTutorChat from './AiTutorChat';
import EssayPlanner from './EssayPlanner';
import AiResources from './AiResources';

type AiTutorMode = 'tutor' | 'planner' | 'resources';

const AiTutorPage: React.FC = () => {
    const [mode, setMode] = useState<AiTutorMode>('tutor');

    const ModeButton: React.FC<{ targetMode: AiTutorMode, children: React.ReactNode }> = ({ targetMode, children }) => (
        <button
            onClick={() => setMode(targetMode)}
            className={`px-6 py-3 rounded-md font-bold transition-all duration-300 transform hover:-translate-y-1 text-base ${
                mode === targetMode 
                ? 'bg-brand-brown-700 text-white shadow-lg' 
                : 'bg-beige-200 dark:bg-stone-700 text-stone-700 dark:text-beige-200 hover:bg-beige-300 dark:hover:bg-stone-600'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 animate-fade-in-up">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black uppercase">AI Tutor Hub</h1>
                <p className="mt-2 text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">Your personal assistant for Media & Film Studies.</p>
            </div>

            <div className="flex justify-center items-center space-x-4 mb-12">
                <ModeButton targetMode="tutor">AI Tutor</ModeButton>
                <ModeButton targetMode="planner">Essay Planner</ModeButton>
                <ModeButton targetMode="resources">AI Resources</ModeButton>
            </div>

            <div key={mode}>
                {mode === 'tutor' && <AiTutorChat />}
                {mode === 'planner' && <EssayPlanner />}
                {mode === 'resources' && <AiResources />}
            </div>

            <div className="mt-16 text-center">
                 <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">A Note on Using AI</h2>
                 <div className="max-w-xl mx-auto text-sm text-stone-600 dark:text-stone-300 bg-amber-100 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-300 dark:border-amber-500/30">
                     <p>AI should be used as a powerful tool to <strong className="text-amber-800 dark:text-amber-300">aid revision</strong>, not replace critical thinking. Use it to clarify concepts, generate ideas, and test your knowledge, but always develop your own understanding and analysis.</p>
                 </div>
            </div>
        </div>
    );
};

export default AiTutorPage;