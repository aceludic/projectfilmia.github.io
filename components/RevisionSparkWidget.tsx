import React, { useState, useEffect } from 'react';
import { DailySpark } from '../types';
import { ai } from '../utils/gemini';

interface RevisionSparkWidgetProps {
  dailySpark: DailySpark | null;
  setDailySpark: (spark: DailySpark) => void;
  onGenerate: () => void;
}

const RevisionSparkWidget: React.FC<RevisionSparkWidgetProps> = ({ dailySpark, setDailySpark, onGenerate }) => {
  const [loading, setLoading] = useState(false);

  const generateNewSpark = async (isDailyCheck: boolean = false) => {
    setLoading(true);
    if (!isDailyCheck) {
      onGenerate();
    }
    try {
      const prompt = "Generate a single, challenging, open-ended question related to A-Level Media or Film Studies. The question should encourage critical thinking and application of concepts. Do not add any extra text, just the question.";
      const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      const newSpark = {
        date: new Date().toISOString().split('T')[0],
        question: result.text,
      };
      setDailySpark(newSpark);
    } catch (error) {
      console.error("Failed to generate new spark:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!dailySpark || dailySpark.date !== today) {
      generateNewSpark(true);
    }
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <div className="flex-grow flex items-center justify-center">
        {loading ? (
            <p>Generating a new question...</p>
        ) : (
            <p className="text-md font-semibold text-stone-800 dark:text-beige-100 italic">
            "{dailySpark?.question}"
            </p>
        )}
      </div>
      <button
        onClick={() => generateNewSpark(false)}
        disabled={loading}
        className="mt-4 w-full bg-brand-brown-700/20 text-brand-brown-800 dark:bg-amber-500/20 dark:text-amber-300 p-2 rounded-md text-sm font-bold hover:bg-brand-brown-700/30 dark:hover:bg-amber-500/30 transition-colors"
      >
        {loading ? 'Thinking...' : '⚡ Generate New Question'}
      </button>
    </div>
  );
};

export default RevisionSparkWidget;