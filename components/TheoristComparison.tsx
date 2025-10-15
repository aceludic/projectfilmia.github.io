import React, { useState, FormEvent } from 'react';
import { TheoristCategory } from '../types';
import { ai } from '../utils/gemini';

interface TheoristComparisonProps {
    theorists: TheoristCategory[];
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
            {text.split('\n').map((line, index) => {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('### ')) {
                    return <h3 key={index} className="font-bold text-lg mt-4 mb-2">{trimmedLine.substring(4)}</h3>;
                }
                if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                     return <h4 key={index} className="font-semibold text-md mt-3 mb-1">{trimmedLine.slice(2, -2)}</h4>
                }
                if (trimmedLine.startsWith('* ')) {
                    return <li key={index} className="ml-4">{trimmedLine.substring(2)}</li>;
                }
                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};

const TheoristComparison: React.FC<TheoristComparisonProps> = ({ theorists }) => {
    const allTheorists = theorists.flatMap(cat => cat.theorists);
    const [theorist1, setTheorist1] = useState<string>(allTheorists[0]?.id || '');
    const [theorist2, setTheorist2] = useState<string>(allTheorists[1]?.id || '');
    const [comparison, setComparison] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCompare = async (e: FormEvent) => {
        e.preventDefault();
        if (!theorist1 || !theorist2 || theorist1 === theorist2) {
            setError('Please select two different theorists to compare.');
            return;
        }

        const t1 = allTheorists.find(t => t.id === theorist1);
        const t2 = allTheorists.find(t => t.id === theorist2);

        if (!t1 || !t2) {
            setError('Could not find the selected theorists.');
            return;
        }

        setLoading(true);
        setError(null);
        setComparison('');

        const prompt = `
            As an expert AQA A-Level Media Studies academic, provide a detailed comparison between two theorists: ${t1.title} and ${t2.title}.

            Here is a summary of their ideas:
            - ${t1.title}: ${t1.whatItSays}
            - ${t2.title}: ${t2.whatItSays}

            Please structure your response with the following markdown headings:
            ### Core Ideas
            **${t1.title}:** [Brief summary]
            **${t2.title}:** [Brief summary]
            
            ### Similarities
            * [Point 1]
            * [Point 2]

            ### Differences
            * [Point 1]
            * [Point 2]

            ### How They Might Critique Each Other
            **${t1.title} on ${t2.title}:** [A potential critique]
            **${t2.title} on ${t1.title}:** [A potential critique]
        `;

        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setComparison(result.text);
        } catch (err) {
            setError('Failed to generate comparison. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-glass-300 dark:bg-black/20 p-6 rounded-2xl border border-glass-border dark:border-glass-border-dark mb-6">
                <h3 className="text-xl font-bold mb-4 text-center">Compare Theorists</h3>
                <form onSubmit={handleCompare} className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <select value={theorist1} onChange={e => setTheorist1(e.target.value)} className="w-full md:w-auto px-3 py-2 border rounded-md bg-beige-100 dark:bg-stone-700 dark:border-stone-600">
                        {allTheorists.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                    <span className="font-bold">vs.</span>
                    <select value={theorist2} onChange={e => setTheorist2(e.target.value)} className="w-full md:w-auto px-3 py-2 border rounded-md bg-beige-100 dark:bg-stone-700 dark:border-stone-600">
                        {allTheorists.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                    <button type="submit" disabled={loading} className="w-full md:w-auto px-6 py-2 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple disabled:bg-stone-400">
                        {loading ? 'Comparing...' : 'Compare'}
                    </button>
                </form>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>

            <div className="bg-glass-200 dark:bg-black/20 p-6 rounded-2xl border border-glass-border dark:border-glass-border-dark min-h-[300px]">
                {loading && <div className="text-center p-12">Generating comparison...</div>}
                {!loading && !comparison && <div className="text-center p-12 text-stone-500">Select two theorists and click compare to see an AI-generated analysis.</div>}
                {comparison && <FormattedText text={comparison} />}
            </div>
        </div>
    );
};

export default TheoristComparison;