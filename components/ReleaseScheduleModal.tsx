

import React from 'react';

interface ReleaseScheduleModalProps {
  onClose: () => void;
}

const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-stone-700 dark:text-stone-300">{children}</span>
    </li>
);

const ReleaseScheduleModal: React.FC<ReleaseScheduleModalProps> = ({ onClose }) => {
  const features = [
    "Full phone & tablet support",
    "Film studies section",
    "Media terminology section",
    "Note to long-form video to enhance learning",
    "Continued updating news",
    "Additional themes & fonts",
    "Social hub's live feed",
    "Study mode (heavy focus, just notes & revision)",
    "Adaptable revision timetable, to suit your needs",
    "& more..."
  ];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-glass-200 dark:bg-black/20 backdrop-blur-2xl rounded-lg shadow-2xl max-w-md w-full p-6 animate-scale-in border border-glass-border dark:border-glass-border-dark" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100">Things to Come</h2>
                 <button onClick={onClose} className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-beige-100 btn-ripple rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">Here's a sneak peek at what's planned for the full release and beyond:</p>

            <ul className="space-y-3 text-sm">
                {features.map((feature, index) => (
                    <FeatureItem key={index}>{feature}</FeatureItem>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default ReleaseScheduleModal;