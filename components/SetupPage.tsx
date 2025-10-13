
import React, { useState } from 'react';
import { VisibleTabs } from '../types';

interface SetupPageProps {
  onComplete: (settings: { visibleTabs: VisibleTabs; subjects: string[] }) => void;
}

const VIDEO_URL = "https://videos.pexels.com/video-files/853825/853825-hd.mp4";

const SetupPage: React.FC<SetupPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<string[]>([]);

  const toggleSelection = (item: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    setState(prev => prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]);
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      const visibleTabs: VisibleTabs = {
        'media-studies': !hiddenTabs.includes('media-studies'),
        'film-studies': !hiddenTabs.includes('film-studies'),
      };
      onComplete({ visibleTabs, subjects });
    }
  };

  const CheckboxButton: React.FC<{ label: string; value: string; selected: boolean; onClick: () => void }> = ({ label, value, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
        selected
          ? 'border-brand-brown-700 bg-brand-brown-700/10'
          : 'border-beige-300 bg-glass-300 hover:border-brand-brown-700/50'
      }`}
    >
      <div className={`w-5 h-5 rounded-sm border-2 flex-shrink-0 flex items-center justify-center ${selected ? 'bg-brand-brown-700 border-brand-brown-700' : 'border-stone-400'}`}>
        {selected && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className="font-semibold text-stone-800 dark:text-beige-100">{label}</span>
    </button>
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden text-stone-800 dark:text-beige-100">
      <video
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-10"
      />
      
      <div className="relative z-10 w-full max-w-xl mx-auto p-4">
        <div className="bg-glass-200 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-glass-border dark:border-glass-border-dark overflow-hidden">
          <div key={step} className="animate-fade-in-up">
            {step === 1 && (
              <>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-beige-100 mb-2">Welcome to Project Filmia</h1>
                <p className="text-stone-600 dark:text-stone-300 mb-6">Let's personalize your experience. First, what are you studying?</p>
                <div className="space-y-3">
                    <CheckboxButton label="Media Studies" value="media" selected={subjects.includes('media')} onClick={() => toggleSelection('media', subjects, setSubjects)} />
                    <CheckboxButton label="Film Studies" value="film" selected={subjects.includes('film')} onClick={() => toggleSelection('film', subjects, setSubjects)} />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-beige-100 mb-2">Customize Your View</h1>
                <p className="text-stone-600 dark:text-stone-300 mb-6">Select any sections you'd like to hide from the main navigation.</p>
                <div className="space-y-3">
                    <CheckboxButton label="Hide Media Studies" value="media-studies" selected={hiddenTabs.includes('media-studies')} onClick={() => toggleSelection('media-studies', hiddenTabs, setHiddenTabs)} />
                    <CheckboxButton label="Hide Film Studies" value="film-studies" selected={hiddenTabs.includes('film-studies')} onClick={() => toggleSelection('film-studies', hiddenTabs, setHiddenTabs)} />
                </div>
                <div className="mt-4 p-3 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs rounded-lg border border-amber-500/20">
                    <strong>We highly recommend</strong> keeping both tabs visible, even if you don't study both subjects. The content often overlaps and can help solidify your overall knowledge.
                </div>
              </>
            )}
             {step === 3 && (
              <div className="text-center">
                <h1 className="text-3xl font-bold text-stone-800 dark:text-beige-100 mb-2">You're All Set!</h1>
                <p className="text-stone-600 dark:text-stone-300 mb-6">Your preferences are saved. You can always change these later in the settings menu.</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-brand-brown-700 text-white font-bold rounded-lg hover:bg-brand-brown-600 transition-all transform hover:scale-105"
            >
              {step === 3 ? "Let's Go!" : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;