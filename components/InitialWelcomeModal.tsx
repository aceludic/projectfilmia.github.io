
import React from 'react';
import { Theme } from '../App';

interface InitialWelcomeModalProps {
    onClose: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const FeatureSection: React.FC<{ title: string; children: string; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="flex items-start space-x-4 text-left">
        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-brand-brown-700/10 text-brand-brown-700 mt-1">
            {icon}
        </div>
        <div>
            <h3 className="text-md font-bold text-stone-800 dark:text-beige-100">{title}</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{children}</p>
        </div>
    </div>
);


const InitialWelcomeModal: React.FC<InitialWelcomeModalProps> = ({ onClose, theme, setTheme }) => (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-beige-50 dark:bg-stone-800 rounded-lg shadow-2xl max-w-lg w-full p-8 animate-fade-in-up border border-beige-200 dark:border-stone-700">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-2 text-center">Welcome to Project Filmia!</h2>
            <p className="text-base text-stone-600 dark:text-stone-300 mb-8 text-center">
                Here's a quick guide to what you can do:
            </p>

            <div className="space-y-6 mb-8">
                <FeatureSection title="Dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}>
                    Your personal hub. Pin key terms, manage your revision timetable, and customize your layout with widgets.
                </FeatureSection>
                 <FeatureSection title="Media Studies" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}>
                    Explore key theorists and Close Study Products (CSPs) for AQA A-Level. Pin important items directly to your dashboard.
                </FeatureSection>
                 <FeatureSection title="AI Tutor" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}>
                    Ask questions and get instant help on any media or film studies topic from a helpful AI assistant.
                </FeatureSection>
                <FeatureSection title="Notes & Settings" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>
                    Use the floating buttons to take notes or customize your experience with different themes, fonts, and more.
                </FeatureSection>
                 <FeatureSection title="Accessibility Features" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}>
                    Enable Night Mode for a low-blue-light theme, or choose the dyslexic-friendly font in settings for enhanced readability.
                </FeatureSection>
            </div>
            
             <div className="bg-beige-100 dark:bg-stone-700/50 p-4 rounded-lg mb-8">
                <p className="text-sm font-bold text-center text-stone-700 dark:text-beige-100 mb-3">Choose your preferred theme:</p>
                <div className="flex justify-center space-x-2 sm:space-x-4">
                    <button
                        onClick={() => setTheme('light')}
                        className={`px-4 sm:px-6 py-2 rounded-md font-semibold text-sm transition-all ${
                            theme === 'light' 
                                ? 'bg-brand-brown-700 text-white ring-2 ring-offset-2 ring-brand-brown-700 ring-offset-beige-50 dark:ring-offset-stone-800' 
                                : 'bg-white text-stone-800 shadow-sm hover:bg-gray-100'
                        }`}
                    >
                        Light
                    </button>
                    <button
                        onClick={() => setTheme('dark')}
                        className={`px-4 sm:px-6 py-2 rounded-md font-semibold text-sm transition-all ${
                            (theme === 'dark' || theme === 'night')
                                ? 'bg-brand-brown-700 text-white ring-2 ring-offset-2 ring-brand-brown-700 ring-offset-beige-50 dark:ring-offset-stone-800' 
                                : 'bg-stone-700 text-white shadow-sm hover:bg-stone-600'
                        }`}
                    >
                        Dark
                    </button>
                </div>
            </div>

            <div className="text-center">
                 <button
                    onClick={onClose}
                    className="bg-brand-brown-700 text-white px-8 py-3 rounded-md text-base font-bold hover:bg-brand-brown-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown-700"
                >
                    Get Started
                </button>
            </div>
        </div>
    </div>
);

export default InitialWelcomeModal;
