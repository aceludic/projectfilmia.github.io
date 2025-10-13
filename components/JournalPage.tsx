import React, { useState } from 'react';
import { JournalEntry } from '../types';

interface JournalPageProps {
    entries: JournalEntry[];
    onAdd: (entry: Omit<JournalEntry, 'id'>) => void;
    onUpdate: (entry: JournalEntry) => void;
    onRemove: (id: string) => void;
}

const StarRating: React.FC<{ rating: number; setRating?: (rating: number) => void; isInteractive?: boolean }> = ({ rating, setRating, isInteractive = false }) => (
    <div className={`flex items-center space-x-1 ${isInteractive ? 'cursor-pointer' : ''}`}>
        {[1, 2, 3, 4, 5].map(star => (
            <svg
                key={star}
                onClick={() => isInteractive && setRating && setRating(star)}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${rating >= star ? 'text-amber-400' : 'text-stone-400 dark:text-stone-500'} ${isInteractive ? 'hover:text-amber-300 transition-colors' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const JournalModal: React.FC<{ entry: JournalEntry | null; onSave: (entry: Omit<JournalEntry, 'id'> | JournalEntry) => void; onClose: () => void; }> = ({ entry, onSave, onClose }) => {
    const [title, setTitle] = useState(entry?.title || '');
    const [type, setType] = useState<JournalEntry['type']>(entry?.type || 'Film');
    const [rating, setRating] = useState(entry?.rating || 0);
    const [review, setReview] = useState(entry?.review || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newEntryData = {
            title,
            type,
            rating,
            review,
            date: entry?.date || new Date().toISOString(),
        };

        if (entry) {
            onSave({ ...newEntryData, id: entry.id });
        } else {
            onSave(newEntryData);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-glass-200 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-scale-in border border-glass-border dark:border-glass-border-dark" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-4">{entry ? 'Edit Entry' : 'New Journal Entry'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Title (e.g., Blade Runner 2049)" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border border-glass-border dark:border-glass-border-dark rounded-md bg-glass-300 text-stone-800 dark:text-beige-100" />
                    <select value={type} onChange={e => setType(e.target.value as JournalEntry['type'])} className="w-full p-2 border border-glass-border dark:border-glass-border-dark rounded-md bg-glass-300 text-stone-800 dark:text-beige-100">
                        <option className="bg-beige-100 dark:bg-stone-800">Film</option>
                        <option className="bg-beige-100 dark:bg-stone-800">TV Show</option>
                        <option className="bg-beige-100 dark:bg-stone-800">Game</option>
                        <option className="bg-beige-100 dark:bg-stone-800">Book</option>
                    </select>
                    <div className="flex items-center space-x-2">
                        <label className="text-stone-700 dark:text-beige-200">Rating:</label>
                        <StarRating rating={rating} setRating={setRating} isInteractive />
                    </div>
                    <textarea placeholder="Your thoughts and review..." value={review} onChange={e => setReview(e.target.value)} rows={5} className="w-full p-2 border border-glass-border dark:border-glass-border-dark rounded-md bg-glass-300 text-stone-800 dark:text-beige-100"></textarea>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-glass-100 text-stone-800 dark:text-white rounded-md font-bold btn-ripple">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-brown-700 text-white rounded-md font-bold btn-ripple">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const JournalPage: React.FC<JournalPageProps> = ({ entries, onAdd, onUpdate, onRemove }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

    const handleSave = (entry: Omit<JournalEntry, 'id'> | JournalEntry) => {
        if ('id' in entry) {
            onUpdate(entry);
        } else {
            onAdd(entry);
        }
        setIsModalOpen(false);
        setEditingEntry(null);
    };

    const handleEdit = (entry: JournalEntry) => {
        setEditingEntry(entry);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this journal entry?')) {
            onRemove(id);
        }
    };
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isModalOpen && <JournalModal entry={editingEntry} onSave={handleSave} onClose={() => { setIsModalOpen(false); setEditingEntry(null); }} />}
            <div className="flex justify-between items-center mb-12">
                <div className="text-center flex-grow">
                    <h1 className="text-4xl font-black uppercase text-stone-800 dark:text-white text-glow">Media Journal</h1>
                    <p className="mt-2 text-lg text-stone-600 dark:text-stone-400">Your personal log of films, shows, and games.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-brand-brown-700 text-white rounded-md font-bold transition-all duration-300 transform hover:-translate-y-1 text-sm btn-ripple">
                    + New Entry
                </button>
            </div>

            {entries.length === 0 ? (
                <div className="text-center py-20 animate-fade-in">
                    <div className="max-w-lg mx-auto bg-glass-300 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-lg border border-glass-border dark:border-glass-border-dark p-12 glass-reflective">
                         <div className="text-6xl mb-4">🖋️</div>
                         <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100">Your Journal Awaits</h2>
                         <p className="text-stone-600 dark:text-stone-300 mt-2">
                             Log your thoughts on the latest film you've watched, show you've binged, or game you've played. Click 'New Entry' to begin your story.
                         </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entries.map((entry, index) => (
                        <div key={entry.id} className="bg-glass-300 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-lg border border-glass-border dark:border-glass-border-dark p-5 flex flex-col animate-fade-in-up transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.03] hover-ripple-effect" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <span className="text-xs font-bold uppercase tracking-wider bg-stone-500/10 text-stone-700 dark:text-stone-300 px-2 py-1 rounded">{entry.type}</span>
                                    <h3 className="text-xl font-bold text-stone-800 dark:text-beige-100 mt-2">{entry.title}</h3>
                                    <p className="text-xs text-stone-500 dark:text-stone-400">{new Date(entry.date).toLocaleDateString()}</p>
                                </div>
                                <StarRating rating={entry.rating} />
                            </div>
                            <p className="text-sm text-stone-700 dark:text-stone-300 my-4 flex-grow whitespace-pre-wrap">{entry.review || 'No review written.'}</p>
                            <div className="flex justify-end space-x-2 border-t border-glass-border dark:border-glass-border-dark pt-3 mt-auto">
                                <button onClick={() => handleEdit(entry)} className="text-xs font-bold text-stone-600 dark:text-stone-300 hover:underline">Edit</button>
                                <button
                                  onClick={() => handleDelete(entry.id)}
                                  className="text-xs font-bold text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JournalPage;