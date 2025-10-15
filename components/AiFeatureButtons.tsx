import React, { useState } from 'react';
import { Theorist, CSP, Film, FilmConcept } from '../types';
import { ai } from '../utils/gemini';

interface AiFeatureButtonsProps {
  item: Theorist | CSP | Film | FilmConcept;
  onAiInteraction: (type: 'summary' | 'synoptic') => void;
  onAddNote: (title: string, content: string) => void;
}

const AiResultModal: React.FC<{ title: string; content: string; onClose: () => void; onSave: () => void; }> = ({ title, content, onClose, onSave }) => (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div 
            className="w-full max-w-2xl h-auto max-h-[85vh] bg-glass-200 dark:bg-black/20 backdrop-blur-2xl rounded-2xl flex flex-col animate-scale-in border border-glass-border dark:border-glass-border-dark"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between p-4 border-b border-glass-border dark:border-glass-border-dark">
                <h3 className="text-lg font-bold text-stone-800 dark:text-beige-100">{title}</h3>
                <div className="flex items-center space-x-2">
                    <button onClick={onSave} className="px-3 py-1 bg-green-500/20 text-green-800 dark:text-green-300 text-xs font-bold rounded-md transition-colors hover:bg-green-500/30">
                        Save to Notes
                    </button>
                    <button onClick={onClose} className="text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white btn-ripple rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="overflow-y-auto p-6 text-stone-700 dark:text-stone-300">
                <p className="whitespace-pre-wrap">{content}</p>
            </div>
        </div>
    </div>
);


const AiFeatureButtons: React.FC<AiFeatureButtonsProps> = ({ item, onAiInteraction, onAddNote }) => {
    const [loading, setLoading] = useState<'summary' | 'synoptic' | null>(null);
    const [result, setResult] = useState<{ title: string; content: string } | null>(null);

    const generateContent = async (type: 'summary' | 'synoptic') => {
        setLoading(type);
        setResult(null);
        onAiInteraction(type);

        let prompt = '';
        if (type === 'summary') {
            prompt = `You are an expert A-Level Media/Film Studies tutor. Provide a concise, easy-to-understand summary of the key ideas related to "${item.title}". Focus on the most important takeaways for a student revising for an exam. The summary should be about 100-150 words.`;
        } else {
            prompt = `You are an expert A-Level Media/Film Studies tutor. Identify 3-4 key synoptic links between "${item.title}" and other relevant theorists, concepts, or media texts. For each link, provide a brief explanation of the connection. Structure your response with bullet points.`;
        }
        
        try {
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const title = type === 'summary' ? `AI Summary for ${item.title}` : `Synoptic Links for ${item.title}`;
            setResult({ title, content: response.text });
        } catch (error) {
            console.error(`AI ${type} error:`, error);
            setResult({ title: 'Error', content: `Sorry, I couldn't generate a response. Please try again.` });
        } finally {
            setLoading(null);
        }
    };

    const handleSaveNote = () => {
        if (!result) return;
        onAddNote(result.title, result.content);
        setResult(null); // Close modal after saving
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-2">
                <button 
                    onClick={() => generateContent('summary')}
                    disabled={!!loading}
                    className="flex-1 text-sm font-bold bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 p-2 rounded-md hover:bg-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading === 'summary' ? 'Summarizing...' : '✨ AI Summary'}
                </button>
                <button
                    onClick={() => generateContent('synoptic')}
                    disabled={!!loading}
                    className="flex-1 text-sm font-bold bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 p-2 rounded-md hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading === 'synoptic' ? 'Linking...' : '🔗 Find Synoptic Links'}
                </button>
            </div>
            {result && <AiResultModal title={result.title} content={result.content} onClose={() => setResult(null)} onSave={handleSaveNote} />}
        </>
    );
};

export default AiFeatureButtons;