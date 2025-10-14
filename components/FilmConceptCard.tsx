import React, { useState } from 'react';
import { FilmConcept, Term } from '../types';

interface FilmConceptCardProps {
    concept: FilmConcept;
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


const FilmConceptCard: React.FC<FilmConceptCardProps> = ({ concept }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-glass-300 dark:bg-black/20 backdrop-blur-2xl rounded-2xl border border-glass-border dark:border-glass-border-dark transition-all duration-300 overflow-hidden glass-reflective">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-glass-100 transition-colors duration-200 cursor-pointer"
                aria-expanded={isOpen}
            >
                <h4 className="text-lg font-bold text-stone-800 dark:text-beige-100">{concept.title}</h4>
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
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[4000px]' : 'max-h-0'}`}>
                <div className="p-4 border-t border-glass-border dark:border-glass-border-dark">
                    <div className="space-y-4 text-stone-700 dark:text-stone-300 text-sm">
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

                        {concept.youtubeVideoId && (
                            <div className="pt-4 mt-4 border-t border-glass-border dark:border-glass-border-dark">
                                <h5 className="font-bold uppercase text-stone-600 dark:text-stone-400 tracking-wider text-xs mb-2 text-center">Watch The Video</h5>
                                <div className="max-w-sm mx-auto rounded-lg overflow-hidden shadow-md">
                                    <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${concept.youtubeVideoId}`}
                                            title={concept.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilmConceptCard;