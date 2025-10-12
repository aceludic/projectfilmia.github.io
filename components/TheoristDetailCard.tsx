import React, { useState } from 'react';
import { Theorist, Term, PinnedItem } from '../types';

interface TheoristDetailCardProps {
    theorist: Theorist;
    categoryTitle: string;
    pinnedItems: PinnedItem[];
    onTogglePin: (item: PinnedItem) => void;
}

const TermList: React.FC<{ terms: Term[] }> = ({ terms }) => (
    <ul className="list-disc list-inside space-y-2">
        {terms.map((t, i) => (
            <li key={i}>
                <span className="font-bold">{t.term}:</span> {t.definition}
            </li>
        ))}
    </ul>
);

const TheoristDetailCard: React.FC<TheoristDetailCardProps> = ({ theorist, categoryTitle, pinnedItems, onTogglePin }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const isPinned = pinnedItems.some(p => p.id === theorist.id);

    const handlePinClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onTogglePin({
            id: theorist.id,
            title: theorist.title,
            type: 'theorist',
            category: categoryTitle,
        });
    };

    return (
        <div className="bg-beige-100/50 dark:bg-stone-800/50 rounded-lg border border-beige-200 dark:border-stone-700/80 transition-all duration-300 overflow-hidden">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-beige-200/50 dark:hover:bg-stone-700/50 transition-colors duration-200 cursor-pointer"
                aria-expanded={isOpen}
            >
                <h4 className="text-lg font-bold text-stone-800 dark:text-beige-100">{theorist.title}</h4>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={handlePinClick}
                        className="p-2 rounded-full hover:bg-beige-300 dark:hover:bg-stone-700 transition-colors"
                        aria-label={isPinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
                        title={isPinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-600 dark:text-stone-300" viewBox="0 0 20 20" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isPinned ? 0 : 2}>
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-2.667 5.404-5.968.867a1 1 0 00-.554 1.705l4.323 4.212-.973 5.942a1 1 0 001.45 1.054L10 18.232l5.333 2.804a1 1 0 001.45-1.054l-1.023-5.942 4.373-4.212a1 1 0 00-.554-1.705l-5.968-.867-2.667-5.404z" />
                        </svg>
                    </button>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 text-stone-500 dark:text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            <div className={`transition-all duration-500 ease-out ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
                <div className="p-4 border-t border-beige-200 dark:border-stone-700/80">
                    <div className="space-y-4 text-stone-700 dark:text-stone-300 text-sm">
                        <div>
                            <h5 className="font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider text-xs mb-1">What it says</h5>
                            <p>{theorist.whatItSays}</p>
                        </div>
                        <div>
                            <h5 className="font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider text-xs mb-2">Key Terms</h5>
                            <TermList terms={theorist.keyTerms} />
                        </div>
                        {theorist.additionalTerms && theorist.additionalTerms.length > 0 && (
                            <div>
                                <h5 className="font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider text-xs mb-2">Additional Terms</h5>
                                <TermList terms={theorist.additionalTerms} />
                            </div>
                        )}
                        <div>
                            <h5 className="font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider text-xs mb-1">Example</h5>
                            <p className="italic bg-beige-200/50 dark:bg-stone-700/50 p-2 rounded-md">{theorist.example}</p>
                        </div>

                        {theorist.youtubeVideoId && (
                            <div className="pt-4 mt-4 border-t border-beige-200 dark:border-stone-700/80">
                                <h5 className="font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider text-xs mb-2 text-center">Watch The Video</h5>
                                <div className="max-w-sm mx-auto rounded-lg overflow-hidden shadow-md">
                                    <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${theorist.youtubeVideoId}`}
                                            title={theorist.title}
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

export default TheoristDetailCard;