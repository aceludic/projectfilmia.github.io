import React, { useState } from 'react';
import { Film, CSP, PinnedItem } from '../types';
import AiFeatureButtons from './AiFeatureButtons';

interface FilmDetailCardProps {
    film: Film;
    categoryTitle: string;
    pinnedItems: PinnedItem[];
    onTogglePin: (item: PinnedItem) => void;
    onLaunchSceneAnalysis: (item: Film | CSP) => void;
    onAiInteraction: (type: 'summary' | 'spark' | 'synoptic') => void;
    onAddNote: (title: string, content: string) => void;
}

// Helper component to format each line of the revision notes
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
                        ? <strong key={i} className="text-stone-800 dark:text-beige-100">{part.slice(2, -2)}</strong> 
                        : part
                )}
            </div>
        </li>
    );
};


const FilmDetailCard: React.FC<FilmDetailCardProps> = ({ film, categoryTitle, pinnedItems, onTogglePin, onLaunchSceneAnalysis, onAiInteraction, onAddNote }) => {
    const [isOpen, setIsOpen] = useState(false);

    const isPinned = pinnedItems.some(p => p.id === film.id);

    const handlePinClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onTogglePin({
            id: film.id,
            title: film.title,
            type: 'film',
            category: categoryTitle,
        });
    };
    
    return (
        <div className="group liquid-glass rounded-2xl flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.03]">
            <div className="relative h-40 w-full overflow-hidden">
                <img src={film.imageUrl} alt={`Poster for ${film.title}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-bold text-white leading-tight shadow-black [text-shadow:1px_1px_3px_var(--tw-shadow-color)]">{film.title}</h3>
                    <p className="text-sm text-beige-200 font-bold tracking-wider mt-1">{film.director} ({film.year})</p>
                </div>
                <button 
                    onClick={handlePinClick}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-20 btn-ripple"
                    aria-label={isPinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
                    title={isPinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isPinned ? 0 : 2}>
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-2.667 5.404-5.968.867a1 1 0 00-.554 1.705l4.323 4.212-.973 5.942a1 1 0 001.45 1.054L10 18.232l5.333 2.804a1 1 0 001.45-1.054l-1.023-5.942 4.373-4.212a1 1 0 00-.554-1.705l-5.968-.867-2.667-5.404z" />
                    </svg>
                </button>
            </div>
            
            <div className="p-4 flex-grow">
                <p className="text-sm text-stone-700 dark:text-stone-300">{film.synopsis}</p>
            </div>

            <div className="p-4 border-t border-white/20 dark:border-white/10">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full text-left text-sm font-bold text-stone-800 dark:text-beige-200 flex justify-between items-center btn-ripple"
                    aria-expanded={isOpen}
                >
                    <span>{isOpen ? 'Hide Details' : 'Show Details'}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[4000px]' : 'max-h-0'}`}>
                <div className="px-4 pb-4 space-y-4">
                    <div className="border-b border-white/20 dark:border-white/10 pb-4">
                        <AiFeatureButtons item={film} onAiInteraction={onAiInteraction} onAddNote={onAddNote} />
                    </div>
                     <div>
                        <button 
                            onClick={() => onLaunchSceneAnalysis(film)}
                            className="w-full mt-2 bg-indigo-500/20 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 p-2 rounded-md text-sm font-bold hover:bg-indigo-500/30 dark:hover:bg-indigo-500/30 transition-colors"
                        >
                            Interactive Scene Analysis
                        </button>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider text-xs mb-2">Key Facts</h4>
                        <ul className="text-sm space-y-1 text-stone-600 dark:text-stone-300">
                            {Object.entries(film.keyFacts).map(([key, value]) => (
                                <li key={key}>
                                    <strong className="capitalize">{key.replace('_', ' ')}:</strong> {value}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {film.revisionNotes && film.revisionNotes.length > 0 && (
                         <div>
                            <h4 className="font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider text-xs mt-4 mb-2">Revision Notes</h4>
                            <ul className="space-y-1">
                                {film.revisionNotes.map((note, index) => <FormattedNote key={index} note={note} />)}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilmDetailCard;