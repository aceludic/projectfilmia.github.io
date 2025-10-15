import React, { useState } from 'react';
import { ai } from '../utils/gemini';
import { TimetableEntry } from '../types';

interface SmartPlannerModalProps {
  onClose: () => void;
  onAddEntries: (entries: Omit<TimetableEntry, 'id'>[]) => void;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SmartPlannerModal: React.FC<SmartPlannerModalProps> = ({ onClose, onAddEntries }) => {
  const [hours, setHours] = useState('5');
  const [freeDays, setFreeDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday']);
  const [subjects, setSubjects] = useState<string[]>(['media', 'film']);
  const [priorities, setPriorities] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<Omit<TimetableEntry, 'id'>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDayToggle = (day: string) => {
    setFreeDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSubjectToggle = (subject: string) => {
    setSubjects(prev => prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setGeneratedPlan(null);

    const prompt = `
      Create a weekly study timetable for an A-Level student based on these parameters:
      - Total study hours per week: ${hours}
      - Available days: ${freeDays.join(', ')}
      - Subjects to cover: ${subjects.join(', ')}
      - Priority topics (if any): ${priorities || 'None'}

      Principles to follow:
      1. Distribute the hours as evenly as possible across the available days.
      2. Alternate between subjects to keep it fresh (a form of spaced repetition).
      3. Create sessions of 1-2 hours each.
      4. If priorities are mentioned, focus more sessions on those.
      5. Return the result ONLY as a valid JSON array of objects, where each object has this exact structure: { "day": "DayName", "time": "HH:MM", "subject": "Topic Name" }.
      Do not include any other text or markdown.
    `;

    try {
      const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
      });
      
      const jsonText = result.text.replace(/```json|```/g, '').trim();
      const plan = JSON.parse(jsonText);
      
      if (Array.isArray(plan)) {
        setGeneratedPlan(plan);
      } else {
        throw new Error('Invalid plan format received.');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to generate a plan. The AI might be busy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = () => {
    if (generatedPlan) {
      onAddEntries(generatedPlan);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-glass-200 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-scale-in border border-glass-border dark:border-glass-border-dark" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-4">AI Smart Planner</h2>
        
        {!generatedPlan ? (
            <div className="space-y-4">
            <div>
                <label className="font-bold">1. How many hours a week can you study?</label>
                <input type="number" value={hours} onChange={e => setHours(e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-glass-300 dark:bg-stone-800" />
            </div>
            <div>
                <label className="font-bold">2. Which days are you free?</label>
                <div className="flex flex-wrap gap-2 mt-1">
                {daysOfWeek.map(day => (
                    <button key={day} onClick={() => handleDayToggle(day)} className={`px-3 py-1 text-sm rounded-full ${freeDays.includes(day) ? 'bg-brand-brown-700 text-white' : 'bg-glass-300'}`}>{day}</button>
                ))}
                </div>
            </div>
            <div>
                <label className="font-bold">3. Which subjects?</label>
                <div className="flex gap-2 mt-1">
                    <button onClick={() => handleSubjectToggle('media')} className={`px-3 py-1 text-sm rounded-full ${subjects.includes('media') ? 'bg-brand-brown-700 text-white' : 'bg-glass-300'}`}>Media</button>
                    <button onClick={() => handleSubjectToggle('film')} className={`px-3 py-1 text-sm rounded-full ${subjects.includes('film') ? 'bg-brand-brown-700 text-white' : 'bg-glass-300'}`}>Film</button>
                </div>
            </div>
            <div>
                <label className="font-bold">4. Any priority topics? (Optional)</label>
                <input type="text" value={priorities} onChange={e => setPriorities(e.target.value)} placeholder="e.g., Postmodernism, German Expressionism" className="w-full mt-1 p-2 border rounded-md bg-glass-300 dark:bg-stone-800" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={handleGenerate} disabled={loading} className="w-full mt-4 px-6 py-2 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple disabled:bg-stone-400">
                {loading ? 'Generating...' : '✨ Generate My Plan'}
            </button>
            </div>
        ) : (
            <div>
                <h3 className="text-lg font-bold mb-2">Suggested Plan:</h3>
                <div className="max-h-64 overflow-y-auto space-y-2 bg-glass-300 p-3 rounded-md">
                    {generatedPlan.map((entry, i) => (
                        <div key={i} className="text-sm"><strong>{entry.day} at {entry.time}:</strong> {entry.subject}</div>
                    ))}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => setGeneratedPlan(null)} className="px-4 py-2 bg-glass-100 rounded-md font-bold btn-ripple">Regenerate</button>
                    <button onClick={handleAddPlan} className="px-4 py-2 bg-brand-brown-700 text-white rounded-md font-bold btn-ripple">Add to Timetable</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default SmartPlannerModal;