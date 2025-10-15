import React, { useState, useMemo, useEffect } from 'react';
import { TimetableEntry } from '../types';
import SmartPlannerModal from './SmartPlannerModal';

interface RevisionTimetableWidgetProps {
    entries: TimetableEntry[];
    onAdd: (entry: Omit<TimetableEntry, 'id'>) => void;
    onAddMultiple: (entries: Omit<TimetableEntry, 'id'>[]) => void;
    onRemove: (id: string) => void;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const prepWorkEntries: Omit<TimetableEntry, 'id'>[] = [
    { day: 'Tuesday', time: '08:30', subject: 'Prep Work Due' },
];

const RevisionTimetableWidget: React.FC<RevisionTimetableWidgetProps> = ({ entries, onAdd, onRemove, onAddMultiple }) => {
    const [day, setDay] = useState('Monday');
    const [time, setTime] = useState('');
    const [subject, setSubject] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [isSmartPlannerModalOpen, setIsSmartPlannerModalOpen] = useState(false);

    useEffect(() => {
        const hasSeenSuggestion = localStorage.getItem('hasSeenTimetableSuggestion');
        if (!hasSeenSuggestion) {
            setShowSuggestion(true);
        }
    }, []);

    const handleAcceptSuggestion = () => {
        onAddMultiple(prepWorkEntries);
        setShowSuggestion(false);
        localStorage.setItem('hasSeenTimetableSuggestion', 'true');
    };

    const handleDeclineSuggestion = () => {
        setShowSuggestion(false);
        localStorage.setItem('hasSeenTimetableSuggestion', 'true');
    };

    const groupedEntries = useMemo(() => {
        const groups: { [key: string]: TimetableEntry[] } = {};
        daysOfWeek.forEach(d => groups[d] = []);
        entries.forEach(entry => {
            if (groups[entry.day]) {
                groups[entry.day].push(entry);
            }
        });
        // Sort entries by time within each day
        Object.keys(groups).forEach(day => {
            groups[day].sort((a, b) => a.time.localeCompare(b.time));
        });
        return groups;
    }, [entries]);

    return (
        <div className="h-full flex flex-col">
            {isSmartPlannerModalOpen && <SmartPlannerModal onClose={() => setIsSmartPlannerModalOpen(false)} onAddEntries={onAddMultiple} />}
            <div className="flex-grow overflow-y-auto pr-2">
                {showSuggestion && entries.length === 0 && (
                    <div className="bg-green-100/50 dark:bg-green-900/20 p-3 rounded-lg mb-4 border border-green-200 dark:border-green-500/30 animate-fade-in-up">
                        <div className="flex items-start justify-between">
                            <div>
                                <h5 className="font-bold text-sm text-green-800 dark:text-green-300">Suggested Reminder</h5>
                                <p className="text-xs text-green-700 dark:text-green-400 mt-1">Want to add a reminder that 'Prep Work' is due on Tuesday at 8:30 AM?</p>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                                <button onClick={handleAcceptSuggestion} className="p-1.5 rounded-full bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </button>
                                <button onClick={handleDeclineSuggestion} className="p-1.5 rounded-full bg-red-200 text-red-800 hover:bg-red-300 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {daysOfWeek.map(d => (
                    groupedEntries[d].length > 0 && (
                        <div key={d} className="mb-3">
                            <h5 className="font-bold text-sm uppercase text-stone-500 dark:text-stone-400 tracking-wider mb-1.5">{d}</h5>
                            <div className="space-y-1">
                                {groupedEntries[d].map(entry => (
                                    <div key={entry.id} className="group flex items-center justify-between text-sm bg-beige-100 dark:bg-stone-700/50 p-2 rounded-md">
                                        <div>
                                            <span className="font-bold text-stone-700 dark:text-beige-200">{entry.time}</span>
                                            <span className="text-stone-600 dark:text-stone-300"> - {entry.subject}</span>
                                        </div>
                                        <button onClick={() => onRemove(entry.id)} className="text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            &#x2715;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
                 {entries.length === 0 && !showForm && !showSuggestion && (
                     <p className="text-center text-sm text-stone-500 dark:text-stone-400 pt-16">Your timetable is empty. Add a revision session to get started.</p>
                 )}
            </div>
            <div className="flex-shrink-0 pt-2 mt-2 border-t border-beige-200 dark:border-stone-700 space-y-2">
                 <button onClick={() => setIsSmartPlannerModalOpen(true)} className="w-full bg-indigo-500/20 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 p-2 rounded-md text-sm font-bold hover:bg-indigo-500/30 dark:hover:bg-indigo-500/30 transition-colors">
                    ✨ Use AI Smart Planner
                </button>
                {showForm ? (
                    <form onSubmit={(e) => { e.preventDefault(); if (time && subject) { onAdd({ day, time, subject }); setTime(''); setSubject(''); setShowForm(false); } }} className="space-y-2 animate-fade-in-up">
                        <div className="grid grid-cols-2 gap-2">
                            <select value={day} onChange={e => setDay(e.target.value)} className="w-full text-sm p-1.5 border border-beige-300 rounded-md focus:ring-brand-brown-700 focus:border-brand-brown-700 bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600">
                                {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full text-sm p-1.5 border border-beige-300 rounded-md focus:ring-brand-brown-700 focus:border-brand-brown-700 bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600" />
                        </div>
                        <input type="text" placeholder="Subject or Topic" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full text-sm p-1.5 border border-beige-300 rounded-md focus:ring-brand-brown-700 focus:border-brand-brown-700 bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600" />
                        <div className="flex items-center space-x-2">
                             <button type="submit" className="w-full bg-brand-brown-700 text-white p-2 rounded-md text-sm font-bold hover:bg-brand-brown-800 transition-colors">Add Entry</button>
                             <button type="button" onClick={() => setShowForm(false)} className="w-full bg-stone-200 dark:bg-stone-600 text-stone-700 dark:text-beige-200 p-2 rounded-md text-sm font-bold hover:bg-stone-300 dark:hover:bg-stone-500 transition-colors">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <button onClick={() => setShowForm(true)} className="w-full bg-brand-brown-700/20 text-brand-brown-800 dark:bg-amber-500/20 dark:text-amber-300 p-2 rounded-md text-sm font-bold hover:bg-brand-brown-700/30 dark:hover:bg-amber-500/30 transition-colors">
                        + Add Session
                    </button>
                )}
            </div>
        </div>
    );
};

export default RevisionTimetableWidget;