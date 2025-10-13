

import React from 'react';

// NOTE: This component has been repurposed into a dismissible welcome banner for the dashboard.
interface InitialWelcomeModalProps {
    onClose: () => void;
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


const InitialWelcomeModal: React.FC<InitialWelcomeModalProps> = ({ onClose }) => (
    <div className="bg-glass-100 dark:bg-black/50 backdrop-blur-4xl rounded-lg shadow-lg w-full p-6 sm:p-8 mb-6 border border-glass-border dark:border-glass-border-dark animate-fade-in-up">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100">Welcome to Your Dashboard!</h2>
                <p className="text-base text-stone-600 dark:text-stone-300">Here's a quick guide to what you can do:</p>
            </div>
            <button
                onClick={onClose}
                className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-beige-100 btn-ripple rounded-full p-1 -mt-2 -mr-2"
                aria-label="Dismiss welcome guide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FeatureSection title="Dashboard Customization" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}>
                Your personal hub. Pin key terms, manage your revision timetable, and customize your layout with widgets.
            </FeatureSection>
             <FeatureSection title="Media Studies Hub" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}>
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
    </div>
);

export default InitialWelcomeModal;