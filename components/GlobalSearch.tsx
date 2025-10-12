
import React, { useState, useEffect, useMemo } from 'react';
import { TheoristCategory, CSPCategory, JournalEntry, NoteTab, SearchResult } from '../types';

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
    theorists: TheoristCategory[];
    csps: CSPCategory[];
    journalEntries: JournalEntry[];
    notes: NoteTab[];
    onResultClick: (result: SearchResult) => void;
}

const ResultItem: React.FC<{ result: SearchResult; onClick: () => void }> = ({ result, onClick }) => {
    let icon, title, subtitle;

    switch (result.type) {
        case 'theorist':
            icon = '🎓';
            title = result.item.title;
            subtitle = `Theorist - ${result.category}`;
            break;
        case 'csp':
            icon = '🎬';
            title = result.item.title;
            subtitle = `CSP - ${result.category}`;
            break;
        case 'journal':
            icon = '📔';
            title = result.item.title;
            subtitle = `Journal Entry - ${result.item.type}`;
            break;
        case 'note':
            icon = '📝';
            title = result.item.title;
            subtitle = `Note`;
            break;
    }

    return (
        <button 
            onClick={onClick}
            className="w-full text-left p-3 flex items-center space-x-3 rounded-md hover:bg-beige-200 dark:hover:bg-stone-700 transition-colors"
        >
            <div className="text-xl">{icon}</div>
            <div>
                <p className="font-bold text-stone-800 dark:text-beige-100">{title}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">{subtitle}</p>
            </div>
        </button>
    );
};


const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, theorists, csps, journalEntries, notes, onResultClick }) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isOpen) {
            // Delay clearing search term to avoid UI flicker while closing
            setTimeout(() => setSearchTerm(''), 300);
        }
    }, [isOpen]);
    
    // Add escape key listener to close modal
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const searchResults = useMemo<SearchResult[]>(() => {
        if (!searchTerm.trim()) return [];
        const query = searchTerm.toLowerCase();
        const results: SearchResult[] = [];

        // Search theorists
        theorists.forEach(category => {
            category.theorists.forEach(theorist => {
                const content = `${theorist.title} ${theorist.whatItSays} ${theorist.keyTerms.map(t => `${t.term} ${t.definition}`).join(' ')}`.toLowerCase();
                if (content.includes(query)) {
                    results.push({ type: 'theorist', item: theorist, category: category.title });
                }
            });
        });

        // Search CSPs
        csps.forEach(category => {
            category.csps.forEach(csp => {
                const content = `${csp.title} ${csp.synopsis} ${Object.values(csp.keyFacts).join(' ')}`.toLowerCase();
                if (content.includes(query)) {
                    results.push({ type: 'csp', item: csp, category: category.title });
                }
            });
        });

        // Search journal entries
        journalEntries.forEach(entry => {
            const content = `${entry.title} ${entry.review}`.toLowerCase();
            if (content.includes(query)) {
                results.push({ type: 'journal', item: entry });
            }
        });
        
        // Search notes
        notes.forEach(note => {
            const content = `${note.title} ${note.content}`.toLowerCase();
            if (content.includes(query)) {
                results.push({ type: 'note', item: note });
            }
        });

        return results;

    }, [searchTerm, theorists, csps, journalEntries, notes]);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex justify-center p-4 pt-[15vh] animate-fade-in" onClick={onClose}>
            <div 
                className="w-full max-w-2xl h-auto max-h-[70vh] bg-beige-50 dark:bg-stone-800 rounded-lg shadow-2xl flex flex-col animate-fade-in-up border border-beige-200 dark:border-stone-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-4 border-b border-beige-200 dark:border-stone-700 flex items-center space-x-3">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search theorists, CSPs, journal entries, notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        className="w-full bg-transparent focus:outline-none text-lg text-stone-800 dark:text-beige-100 placeholder-stone-400"
                    />
                </div>
                <div className="flex-grow overflow-y-auto p-2">
                    {searchTerm.trim() && searchResults.length === 0 && (
                        <div className="text-center p-8 text-stone-500 dark:text-stone-400">
                            <p>No results found for "{searchTerm}"</p>
                        </div>
                    )}
                     {!searchTerm.trim() && (
                        <div className="text-center p-8 text-stone-500 dark:text-stone-400">
                            <p>Type to start searching across the app.</p>
                        </div>
                    )}
                    {searchResults.length > 0 && (
                        <div className="space-y-1">
                            {searchResults.map((result, index) => (
                                <ResultItem key={`${result.type}-${result.item.id}-${index}`} result={result} onClick={() => onResultClick(result)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
