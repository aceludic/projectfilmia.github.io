import React, { useState } from 'react';
import { Theorist, CSP, Film, FilmConcept } from '../types';
import { ai } from '../utils/gemini';

type Item = Theorist | CSP | Film | FilmConcept;

interface AiFeatureButtonsProps {
    item: Item;
    onAiInteraction: (type: 'summary' | 'spark') => void;
}

const AiResponseModal: React.FC<{ title: string; content: string; onClose: () => void }> = ({ title, content, onClose }) => (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
            className="w-full max-w-lg bg-glass-200 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-glass-border dark:border-glass-border-dark animate-scale-in"
            onClick={(e) => e.stopPropagation()}
        >
            <h3 className="text-lg font-bold text-stone-800 dark:text-beige-100 mb-4">{title}</h3>
            <div className="max-h-[60vh] overflow-y-auto text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                {content}
            </div>
            <button onClick={onClose} className="mt-4 w-full text-sm font-bold bg-glass-300 p-2 rounded-md hover:bg-glass-100">Close</button>
        </div>
    </div>
);

const AiFeatureButtons: React.FC<AiFeatureButtonsProps> = ({ item, onAiInteraction }) => {
    const [loading, setLoading] = useState<'summary' | 'spark' | null>(null);
    const [response, setResponse] = useState<{ title: string; content: string } | null>(null);

    const generateContent = (content: Item) => {
        if ('whatItSays' in content) return `Title: ${content.title}. Content: ${content.whatItSays}. Key Terms: ${content.keyTerms.map(t => `${t.term}: ${t.definition}`).join(', ')}.`;
        if ('synopsis' in content) return `Title: ${content.title}. Synopsis: ${content.synopsis}. Key Facts: ${Object.entries(content.keyFacts).map(([k,v]) => `${k}: ${v}`).join(', ')}`;
        if ('overview' in content) return `Title: ${content.title}. Overview: ${content.overview}. Notes: ${content.notes.join(' ')}`;
        return '';
    };

    const handleSummarize = async () => {
        setLoading('summary');
        onAiInteraction('summary');
        setResponse(null);
        const itemContent = generateContent(item);
        const prompt = `Based on the following content about "${item.title}", provide a summary. Structure your response with two markdown headings: "### Key Takeaways" (as 3-4 bullet points) and "### Explain Like I'm 5" (as a simple analogy or explanation).\n\nContent: ${itemContent}`;

        try {
            const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setResponse({ title: `Summary for ${item.title}`, content: result.text });
        } catch (e) {
            setResponse({ title: 'Error', content: 'Could not generate summary.'});
        } finally {
            setLoading(null);
        }
    };

    const handleChallenge = async () => {
        setLoading('spark');
        onAiInteraction('spark');
        setResponse(null);
        const itemContent = generateContent(item);
        const prompt = `Based on this content about "${item.title}", generate a single, challenging, open-ended question that would require a student to apply these concepts critically. Just return the question, no extra text.\n\nContent: ${itemContent}`;
        
        try {
            const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setResponse({ title: 'Revision Spark ✨', content: result.text });
        } catch (e) {
            setResponse({ title: 'Error', content: 'Could not generate question.'});
        } finally {
            setLoading(null);
        }
    };


    return (
        <>
            {response && <AiResponseModal title={response.title} content={response.content} onClose={() => setResponse(null)} />}
            <div className="flex flex-col sm:flex-row gap-2">
                <button 
                    onClick={handleSummarize} 
                    disabled={!!loading}
                    className="flex-1 text-xs font-bold p-2 rounded-md bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-500/30 transition-colors disabled:opacity-50"
                >
                    {loading === 'summary' ? 'Summarizing...' : '🧠 Summarize with AI'}
                </button>
                <button 
                    onClick={handleChallenge} 
                    disabled={!!loading}
                    className="flex-1 text-xs font-bold p-2 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 hover:bg-amber-500/30 transition-colors disabled:opacity-50"
                >
                   {loading === 'spark' ? 'Thinking...' : '✨ Challenge Me'}
                </button>
            </div>
        </>
    );
};

export default AiFeatureButtons;