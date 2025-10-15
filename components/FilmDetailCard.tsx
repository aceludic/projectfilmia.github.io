import React, { useState } from 'react';
import { Film, CSP } from '../types';
import AiFeatureButtons from './AiFeatureButtons';

interface FilmDetailCardProps {
    film: Film;
    onLaunchSceneAnalysis: (item: Film | CSP) => void;
    onAiInteraction: (type: 'summary' | 'spark') => void;
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


const FilmDetailCard: React.FC<FilmDetailCardProps> = ({ film, onLaunchSceneAnalysis, onAiInteraction }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="group bg-glass-300 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-lg border border-glass-border dark:border-glass-border-dark flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.03] glass-reflective hover-ripple-effect">
            <div className="relative h-40 w-full overflow-hidden">
                <img src={film.imageUrl} alt={`Poster for ${film.title}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-bold text-white leading-tight shadow-black [text-shadow:1px_1px_3px_var(--tw-shadow-color)]">{film.title}</h3>
                    <p className="text-sm text-beige-200 font-bold tracking-wider mt-1">{film.director} ({film.year})</p>
                </div>
            </div>
            
            <div className="p-4 flex-grow">
                <p className="text-sm text-stone-700 dark:text-stone-300">{film.synopsis}</p>
            </div>

            <div className="p-4 border-t border-glass-border dark:border-glass-border-dark">
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
                    <div className="border-b border-glass-border dark:border-glass-border-dark pb-4">
                        <AiFeatureButtons item={film} onAiInteraction={onAiInteraction} />
                    </div>
                     <div>
                        <button 
                            onClick={() => onLaunchSceneAnalysis(film)}
                            className="w-full mt-2 bg-indigo-500/20 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 p-2 rounded-md text-sm font-bold hover:bg-indigo-500/30 dark:hover:bg-indigo-500/30 transition-colors"
                        >
                            Interactive Scene Analysis (Soon)
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