import React, { useState, FormEvent } from 'react';
import { ai } from '../utils/gemini';

interface EssayMarkerProps {
    onAddNote: (title: string, content: string) => void;
}

const FormattedFeedback: React.FC<{ text: string }> = ({ text }) => {
    const sections = text.split(/(\*\*.*?\*\*)/g).filter(part => part.trim());

    return (
        <div className="space-y-4">
            {sections.map((section, index) => {
                if (section.startsWith('**') && section.endsWith('**')) {
                    return (
                        <h3 key={index} className="text-lg font-bold text-stone-800 dark:text-beige-100 border-b-2 border-brand-brown-700/50 pb-1">
                            {section.slice(2, -2)}
                        </h3>
                    );
                }
                // Handle bullet points
                const lines = section.trim().split('\n');
                return (
                    <ul key={index} className="list-disc list-inside space-y-2">
                        {lines.map((line, lineIndex) => (
                            <li key={lineIndex}>{line.replace(/^\*/, '').trim()}</li>
                        ))}
                    </ul>
                );
            })}
        </div>
    );
};

const EssayMarker: React.FC<EssayMarkerProps> = ({ onAddNote }) => {
    const [question, setQuestion] = useState('');
    const [essay, setEssay] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetFeedback = async (e: FormEvent) => {
        e.preventDefault();
        if (!question.trim() || !essay.trim()) {
            setError('Please provide both an essay question and your response.');
            return;
        }

        setLoading(true);
        setError(null);
        setFeedback('');

        const prompt = `
            You are an expert A-Level Film or Media Studies examiner. Your task is to mark the following student essay and provide detailed, constructive feedback.

            The essay question is: "${question}"

            The student's essay is:
            ---
            ${essay}
            ---

            Please structure your feedback with the following markdown headings:
            **Overall Grade and Justification:** [Provide a likely A-Level grade (e.g., A, B, C) and a brief justification for it.]
            **Strengths:** [Identify what the student did well, referencing specific A-Level Assessment Objectives like AO1 (Knowledge & Understanding) and AO2 (Analysis).]
            **Areas for Improvement:** [Provide specific, actionable advice on how the essay could be improved. Focus on areas like use of examples, application of theory, argument structure, and critical analysis.]
            **Next Steps:** [Suggest what the student should focus on next in their revision.]
        `;

        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-pro', // Using a more powerful model for detailed analysis
                contents: prompt,
            });
            setFeedback(result.text);
        } catch (e) {
            console.error("Gemini API Error:", e);
            setError("Sorry, I couldn't generate feedback. There might be an issue with the AI service. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNote = () => {
        if (!feedback) return;
        const noteTitle = `Essay Feedback: ${question.substring(0, 30)}...`;
        const noteContent = `## Essay Question\n${question}\n\n## My Essay\n${essay}\n\n---\n\n## AI Feedback\n${feedback}`;
        onAddNote(noteTitle, noteContent);
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="liquid-glass rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-4">Submit Your Essay</h3>
                    <form onSubmit={handleGetFeedback} className="space-y-4">
                        <div>
                            <label htmlFor="essay-question" className="block text-sm font-bold text-stone-700 dark:text-beige-200 mb-1">Essay Question</label>
                            <textarea
                                id="essay-question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Paste the full essay question here..."
                                rows={3}
                                className="w-full p-2 border border-glass-border rounded-md bg-glass-300 text-stone-800 dark:text-beige-100 text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="essay-content" className="block text-sm font-bold text-stone-700 dark:text-beige-200 mb-1">Your Essay</label>
                            <textarea
                                id="essay-content"
                                value={essay}
                                onChange={(e) => setEssay(e.target.value)}
                                placeholder="Paste your full essay response here..."
                                rows={15}
                                className="w-full p-2 border border-glass-border rounded-md bg-glass-300 text-stone-800 dark:text-beige-100 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-brown-700 text-white px-6 py-3 rounded-md text-base font-bold hover:bg-brand-brown-800 transition-colors disabled:bg-stone-400 flex items-center justify-center btn-ripple"
                        >
                            {loading ? 'Analyzing...' : 'Get Feedback'}
                        </button>
                    </form>
                </div>

                {/* Output Section */}
                <div className="liquid-glass rounded-2xl p-6 relative min-h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-stone-800 dark:text-beige-100">Examiner Feedback</h3>
                        {feedback && (
                            <button onClick={handleSaveNote} className="px-3 py-1 bg-green-500/20 text-green-800 dark:text-green-300 text-xs font-bold rounded-md transition-colors hover:bg-green-500/30">
                                Save Feedback to Notes
                            </button>
                        )}
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                        {loading && <p className="text-stone-600 dark:text-stone-300">Phoebe is reading your essay...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {feedback ? (
                            <FormattedFeedback text={feedback} />
                        ) : (
                            !loading && <p className="text-stone-500">Your feedback will appear here.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EssayMarker;