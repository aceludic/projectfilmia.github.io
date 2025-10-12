import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const EssayPlanner: React.FC = () => {
    const [essayTopic, setEssayTopic] = useState('');
    const [generatedPlan, setGeneratedPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGeneratePlan = async () => {
        if (!essayTopic.trim()) {
            setError('Please enter an essay topic.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedPlan('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = "You are an expert A-Level Media & Film Studies tutor. Your task is to create a structured essay plan. The plan must include: 1. An introduction with a clear thesis statement. 2. Three to four distinct paragraphs, each with a clear point, suggested evidence (referencing relevant theorists and Close Study Products), and analysis. 3. A concluding summary. Format the output using markdown, with headings for each section and bullet points for key ideas.";
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Create a detailed essay plan for the following A-Level Media Studies topic: "${essayTopic}"`,
                config: {
                    systemInstruction,
                },
            });

            setGeneratedPlan(response.text);

        } catch (err) {
            console.error("Essay Planner Error:", err);
            setError("Sorry, I couldn't generate a plan. Please check your connection or API key and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="bg-beige-50 dark:bg-stone-800 rounded-lg shadow-xl border border-beige-200 dark:border-stone-700 p-6">
                <div className="space-y-4">
                    <label htmlFor="essay-topic" className="block text-lg font-bold text-stone-800 dark:text-beige-100">
                        Essay Question or Topic
                    </label>
                    <textarea
                        id="essay-topic"
                        rows={4}
                        placeholder="e.g., 'To what extent is the representation of gender in music videos stereotypical?'"
                        value={essayTopic}
                        onChange={(e) => setEssayTopic(e.target.value)}
                        className="w-full px-3 py-2 border border-beige-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-brand-brown-700 focus:border-brand-brown-700 sm:text-sm bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600 disabled:opacity-50"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGeneratePlan}
                        disabled={isLoading || !essayTopic.trim()}
                        className="w-full bg-brand-brown-700 text-white px-6 py-3 rounded-md text-base font-bold hover:bg-brand-brown-800 transition-colors disabled:bg-stone-400 dark:disabled:bg-stone-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                Generating Plan...
                            </>
                        ) : 'Generate Plan'}
                    </button>
                </div>

                {error && <p className="text-sm text-red-600 dark:text-red-400 mt-4">{error}</p>}
                
                {generatedPlan && (
                    <div className="mt-8 pt-6 border-t border-beige-200 dark:border-stone-700">
                        <h3 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-4">Your Essay Plan:</h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none bg-beige-100 dark:bg-stone-700/50 p-4 rounded-md whitespace-pre-wrap">
                            {generatedPlan}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EssayPlanner;
