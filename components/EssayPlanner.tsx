
import React, { useState, FormEvent } from 'react';
import { GoogleGenAI } from "@google/genai";

// FIX: Initialize GoogleGenAI client once at the module level for efficiency and to align with best practices.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// A component to format the AI's plan text, converting simple markdown to HTML.
const FormattedPlan: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/(\*\*.*?\*\*|\* .*)/g).filter(part => part); // Split by bold and list items

    return (
        <p className="whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="block mt-3 mb-1 text-stone-800 dark:text-beige-100">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('* ')) {
                     return <span key={index} className="block ml-4 relative before:content-['•'] before:absolute before:-left-4 before:text-brand-brown-700">{part.slice(2)}</span>;
                }
                return <span key={index}>{part}</span>;
            })}
        </p>
    );
};


const EssayPlanner: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [points, setPoints] = useState('');
    const [plan, setPlan] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGeneratePlan = async (e: FormEvent) => {
        e.preventDefault();
        if (!question.trim()) {
            setError('Please enter an essay question.');
            return;
        }

        setLoading(true);
        setError(null);
        setPlan('');
        setCopied(false);

        const prompt = `
            You are an expert AQA A-Level Media and Film Studies essay planner. 
            Your task is to create a detailed essay plan based on the provided question and key points.
            The tone should be academic, clear, and helpful.

            Essay Question: "${question}"

            Key Points/Theorists to Include (if any): "${points}"

            Please structure the output as follows:
            **Introduction**
            * Hook and context.
            * Thesis statement.
            * Outline of main points.

            **Main Body Paragraph 1**
            * Topic Sentence: 
            * Evidence/Example: 
            * Analysis (linking back to the question): 

            **Main Body Paragraph 2**
            * Topic Sentence: 
            * Evidence/Example: 
            * Analysis (linking back to the question): 

            **Main Body Paragraph 3**
            * Topic Sentence: 
            * Evidence/Example: 
            * Analysis (linking back to the question): 

            **Conclusion**
            * Summarize key arguments.
            * Restate thesis in a new way.
            * Final concluding thought.
        `;

        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setPlan(result.text);
        } catch (e) {
            console.error("Gemini API Error:", e);
            setError("Sorry, I couldn't generate the plan. There might be an issue with the AI service. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!plan) return;
        navigator.clipboard.writeText(plan);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-beige-50 dark:bg-stone-800/80 rounded-lg shadow-xl border border-beige-200 dark:border-stone-700 p-6">
                    <h3 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-4">Create Your Essay Plan</h3>
                    <form onSubmit={handleGeneratePlan} className="space-y-4">
                        <div>
                            <label htmlFor="essay-question" className="block text-sm font-bold text-stone-700 dark:text-beige-200 mb-1">Essay Question</label>
                            <textarea
                                id="essay-question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="e.g., To what extent is genre theory useful when analysing music videos?"
                                rows={3}
                                className="w-full p-2 border border-beige-300 rounded-md bg-white dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600 focus:ring-2 focus:ring-brand-brown-700 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="key-points" className="block text-sm font-bold text-stone-700 dark:text-beige-200 mb-1">Key Points / Theorists (Optional)</label>
                            <textarea
                                id="key-points"
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                                placeholder="e.g., Steve Neale's theory of repetition and difference, sub-genres, conventions of pop music videos..."
                                rows={4}
                                className="w-full p-2 border border-beige-300 rounded-md bg-white dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600 focus:ring-2 focus:ring-brand-brown-700 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-brown-700 text-white px-6 py-3 rounded-md text-base font-bold hover:bg-brand-brown-800 transition-colors transform hover:-translate-y-1 disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Generating...
                                </>
                            ) : "Generate Plan"}
                        </button>
                    </form>
                </div>

                {/* Output Section */}
                <div className="bg-white dark:bg-stone-800 rounded-lg shadow-xl border border-beige-200 dark:border-stone-700 p-6 relative min-h-[300px] lg:min-h-0">
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-stone-500 dark:text-stone-400">
                             <div className="w-3 h-3 bg-brand-brown-700 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        </div>
                    )}
                    {error && (
                        <div className="flex flex-col items-center justify-center text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-md">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {!loading && !error && !plan && (
                        <div className="flex flex-col items-center justify-center text-center text-stone-500 dark:text-stone-400 h-full">
                             <div className="text-5xl mb-4">📝</div>
                            <h4 className="font-bold text-stone-700 dark:text-beige-100">Your plan will appear here</h4>
                            <p className="text-sm">Fill in the details on the left and click "Generate Plan" to begin.</p>
                        </div>
                    )}
                    {plan && (
                         <>
                            <button
                                onClick={handleCopy}
                                className="absolute top-4 right-4 bg-beige-200 hover:bg-beige-300 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-600 dark:text-beige-100 text-xs font-bold py-1 px-2 rounded-md transition-all"
                            >
                                {copied ? 'Copied!' : 'Copy Plan'}
                            </button>
                             <div className="text-sm text-stone-700 dark:text-stone-300 h-full max-h-[60vh] overflow-y-auto">
                                <FormattedPlan text={plan} />
                            </div>
                         </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EssayPlanner;
