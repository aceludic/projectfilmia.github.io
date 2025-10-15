import React, { useState } from 'react';
import { FilmConcept, PinnedItem } from '../types';
import AiFeatureButtons from './AiFeatureButtons';

interface FilmConceptCardProps {
    concept: FilmConcept;
    categoryTitle: string;
    pinnedItems: PinnedItem[];
    onTogglePin: (item: PinnedItem) => void;
    onAiInteraction: (type: 'summary' | 'spark' | 'synoptic') => void;
    onAddNote: (title: string, content: string) => void;
}

// Helper component to format each line of the notes
const FormattedNote: React.FC<{ note: string }> = ({ note }) => {
    // Check for list item syntax (e.g., "   - Item")
    const isListItem = /^\s*-/.test(note);
    // Remove the list marker and trim whitespace
    let content = note.replace(/^\s*-\s*/, '').trim();

    // Split the content by the bold syntax (**...**) to isolate bold parts
    const parts = content.split(/(\*\*.*?\*\*)/g).filter(part => part);

    return (
        <li className={`flex text-sm text-stone-600 dark:text-stone-300 ${isListItem ? 'ml-4' : 'mt-3 list-none'}`}>
            {isListItem && <span className="mr-2 text-brand-brown-700 dark:text-amber-400">•</span>}
            <div>
                {parts.map((part, i) => 
                    part.startsWith('**') && part.endsWith('**') 
                        ? <strong key={i} className="block mt-1 text-stone-800 dark:text-beige-100">{part.slice(2, -2)}</strong> 
                        : part
                )}
            </div>
        </li>
    );
};


const FilmConceptCard: React.FC<FilmConceptCardProps> = ({ concept, categoryTitle, pinnedItems, onTogglePin, onAiInteraction, onAddNote }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const isPinned = pinnedItems.some(p => p.id === concept.id);

    const handlePinClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onTogglePin({
            id: concept.id,
            title: concept.title,
            type: 'film-concept',
            category: categoryTitle,
        });
    };

    return (
        <div className="liquid-glass rounded-2xl transition-all duration-300 overflow-hidden">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                aria-expanded={isOpen}
            >
                <h4 className="text-lg font-bold text-stone-800 dark:text-beige-100">{concept.title}</h4>
                 <div className="flex items-center space-x-2">
                    <button 
                        onClick={handlePinClick}
                        className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors btn-ripple"
                        aria-label={isPinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
                        title={isPinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-700 dark:text-stone-200" viewBox="0 0 20 20" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isPinned ? 0 : 2}>
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-2.667 5.404-5.968.867a1 1 0 00-.554 1.705l4.323 4.212-.973 5.942a1 1 0 001.45 1.054L10 18.232l5.333 2.804a1 1 0 001.45-1.054l-1.023-5.942 4.373-4.212a1 1 0 00-.554-1.705l-5.968-.867-2.667-5.404z" />
                        </svg>
                    </button>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 text-stone-600 dark:text-stone-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[4000px]' : 'max-h-0'}`}>
                <div className="p-4 border-t border-white/20 dark:border-white/10">
                    <AiFeatureButtons item={concept} onAiInteraction={onAiInteraction} onAddNote={onAddNote} />
                    <div className="space-y-4 text-stone-700 dark:text-stone-300 text-sm mt-4">
                        <div>
                            <h5 className="font-bold uppercase text-stone-600 dark:text-stone-400 tracking-wider text-xs mb-1">Overview</h5>
                            <p>{concept.overview}</p>
                        </div>
                        <div>
                            <h5 className="font-bold uppercase text-stone-600 dark:text-stone-400 tracking-wider text-xs mb-2">Key Techniques & Concepts</h5>
                            <ul className="space-y-1">
                                {concept.notes.map((note, index) => <FormattedNote key={index} note={note} />)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilmConceptCard;