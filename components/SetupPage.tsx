import React, { useState, useEffect, FormEvent } from 'react';
import { VisibleTabs } from '../types';
import { Modality } from "@google/genai";
import { ai } from '../utils/gemini';

interface SetupPageProps {
  onComplete: (settings: { name: string; visibleTabs: VisibleTabs; subjects: string[] }) => void;
}

const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

// Audio Decoding Functions
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // FIX: Corrected typo from Int116Array to Int16Array.
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const HighlightedText: React.FC<{ text: string, isSpeaking: boolean }> = ({ text, isSpeaking }) => {
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(part => part);
    return (
      <div className="relative">
        <p className="text-2xl md:text-3xl font-medium text-center text-stone-700 dark:text-beige-200 leading-relaxed">
            {parts.map((part, i) =>
                part.startsWith('**') && part.endsWith('**')
                    ? <span key={i} className="font-bold text-brand-brown-700 dark:text-amber-400 text-glow">{part.slice(2, -2)}</span>
                    : part
            )}
        </p>
        {isSpeaking && (
           <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-1 text-xs text-stone-500 dark:text-stone-400">
                <span className="italic">Phoebe is speaking</span>
                <div className="w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
           </div>
        )}
      </div>
    );
};

const LoadingStep: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="text-5xl mb-6">👋</div>
        <div className="flex items-center space-x-2 text-stone-600 dark:text-stone-300">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg font-medium">Just a moment...</span>
        </div>
    </div>
);


const SetupPage: React.FC<SetupPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [nameInput, setNameInput] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [revisionStyle, setRevisionStyle] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isPhoebeSpeaking, setIsPhoebeSpeaking] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const getSteps = (name: string) => [
      {
          text: "Hey there! I'm **Phoebe**, your personal AI guide. I'll be helping you on your media & film journey. First, what should I call you?"
      },
      {
          text: `It's great to meet you, **${name || 'friend'}**! To get things just right for you, could you tell me which subjects you're taking?`
      },
      {
          text: "Perfect. How do you like to revise? This will help me set up your dashboard."
      },
      {
          text: `Got it! Just so you know, you can talk to me anytime. If you're ever stuck on **concepts**, **theorists**, or just want to **plan an essay**, click on **'Phoebe (Tutor)'** in the navigation bar. I'm here to help!`
      },
      {
          text: "Awesome! We're all set. I'll get your personalized dashboard ready for you now."
      }
  ];
  
  const steps = getSteps(nameInput);

  const prepareAudio = async (text: string): Promise<AudioBufferSourceNode | null> => {
    if (isMuted) return null;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say it in a friendly and welcoming tone: ${text.replace(/\*\*/g, '')}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputAudioContext,
                24000,
                1,
            );
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            return source;
        }
        return null;
    } catch (error) {
        console.error("TTS Error:", error);
        return null;
    }
  };
  
  const goToStep = async (nextStepIndex: number) => {
    setIsTransitioning(true);

    // Use a temporary variable for the name if it's the step that needs it
    const nameForStep = nextStepIndex === 1 ? nameInput : (nameInput || 'friend');
    const text = getSteps(nameForStep)[nextStepIndex].text;
    
    const audioSource = await prepareAudio(text);

    setStep(nextStepIndex);
    setIsTransitioning(false);

    if (audioSource) {
        setIsPhoebeSpeaking(true);
        audioSource.onended = () => setIsPhoebeSpeaking(false);
        audioSource.start();
    }
  };
  
  // Initial load
  useEffect(() => {
    // A brief delay to allow the beautiful background to render first
    setTimeout(() => {
        goToStep(0);
    }, 500);
  }, []);

  const handleNameSubmit = (e: FormEvent) => {
      e.preventDefault();
      if(nameInput.trim() && !isTransitioning) {
        goToStep(1);
      }
  }
  
  const handleSubjectSelect = (subject: string) => {
    const newSubjects = subjects.includes(subject) 
      ? subjects.filter(s => s !== subject)
      : [...subjects, subject];
    setSubjects(newSubjects);
  };
  
  const handleSubjectsSubmit = () => {
      if (!isTransitioning) {
          goToStep(2);
      }
  };
  
  const handleRevisionStyleSubmit = (style: string) => {
      if (!isTransitioning) {
          setRevisionStyle(style);
          goToStep(3);
      }
  };

  const handleFinish = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Show the "Getting ready..." message and then complete
    setStep(steps.length); // An index beyond the last step for our loading message
    
    setTimeout(() => {
        onComplete({ 
            name: nameInput,
            subjects, 
            visibleTabs: {
                'media-studies': subjects.includes('media'),
                'film-studies': subjects.includes('film'),
            }
        });
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-glass-200 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 md:p-8 border border-glass-border dark:border-glass-border-dark flex flex-col min-h-[60vh]">
          <div className="flex-shrink-0 flex justify-end items-center mb-4">
             <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-full hover:bg-glass-100 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                {isMuted ? 'UNMUTE 🔊' : 'MUTE 🔇'}
             </button>
          </div>
          
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            {isTransitioning ? <LoadingStep /> : (
                <div key={step} className="animate-fade-in">
                    {step < steps.length ? (
                        <>
                            <div className="text-5xl mb-6">👋</div>
                            <HighlightedText text={steps[step].text} isSpeaking={isPhoebeSpeaking} />
                        </>
                    ) : (
                         <div className="text-center text-lg font-semibold animate-fade-in flex items-center justify-center space-x-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Getting things ready...</span>
                         </div>
                    )}
                </div>
            )}
          </div>

          <div className="flex-shrink-0 pt-6 mt-6 border-t border-glass-border">
            {!isTransitioning && (
                <div className="h-28">
                    {step === 0 && (
                        <form onSubmit={handleNameSubmit} className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
                            <input 
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="Enter your name..."
                                className="w-full sm:w-64 px-4 py-3 border border-glass-border dark:border-glass-border-dark rounded-lg bg-glass-300 text-stone-800 dark:text-beige-100 placeholder-stone-500 dark:placeholder-stone-400 focus:ring-2 focus:ring-brand-brown-700 focus:border-transparent text-lg text-center sm:text-left"
                                autoFocus
                            />
                            <button type="submit" disabled={!nameInput.trim()} className="px-8 py-3 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple text-lg disabled:bg-stone-400">Next</button>
                        </form>
                    )}
                     {step === 1 && (
                      <div className="space-y-4 animate-fade-in-up">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => handleSubjectSelect('media')} className={`w-full p-4 text-lg font-bold rounded-lg border-2 transition-colors ${subjects.includes('media') ? 'border-brand-brown-700 bg-brand-brown-700/10' : 'border-transparent bg-glass-300'}`}>Media Studies</button>
                            <button onClick={() => handleSubjectSelect('film')} className={`w-full p-4 text-lg font-bold rounded-lg border-2 transition-colors ${subjects.includes('film') ? 'border-brand-brown-700 bg-brand-brown-700/10' : 'border-transparent bg-glass-300'}`}>Film Studies</button>
                        </div>
                        <button onClick={handleSubjectsSubmit} disabled={subjects.length === 0} className="w-full px-6 py-3 bg-brand-brown-700 text-white font-bold rounded-lg disabled:bg-stone-400 btn-ripple text-lg">Next</button>
                      </div>
                    )}
                     {step === 2 && (
                      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
                            <button onClick={() => handleRevisionStyleSubmit('visual')} className={`w-full p-4 text-lg font-bold rounded-lg border-2 transition-colors border-transparent bg-glass-300`}>🎨 Visual</button>
                            <button onClick={() => handleRevisionStyleSubmit('text')} className={`w-full p-4 text-lg font-bold rounded-lg border-2 transition-colors border-transparent bg-glass-300`}>📚 Text-based</button>
                            <button onClick={() => handleRevisionStyleSubmit('mixed')} className={`w-full p-4 text-lg font-bold rounded-lg border-2 transition-colors border-transparent bg-glass-300`}>⚖️ A Mix of Both</button>
                      </div>
                    )}
                    {step === 3 && (
                        <div className="flex justify-center animate-fade-in-up">
                            <button onClick={() => goToStep(4)} className="px-8 py-3 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple text-lg">Let's Go!</button>
                        </div>
                    )}
                    {step === 4 && (
                        <div className="flex justify-center animate-fade-in-up">
                            <button onClick={handleFinish} className="px-8 py-3 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple text-lg">Finish Setup</button>
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;