import React, { useState } from 'react';
import { CSP, PinnedItem } from '../types';

interface CspDetailCardProps {
    csp: CSP;
    pinnedItems: PinnedItem[];
    onTogglePin: (item: PinnedItem) => void;
}

const CspDetailCard: React.FC<CspDetailCardProps> = ({ csp, pinnedItems, onTogglePin }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const isPinned = pinnedItems.some(p => p.id === csp.id);

    const handlePinClick = () => {
        onTogglePin({
            id: csp.id,
            title: csp.title,
            type: 'csp',
            category: csp.category,
        });
    };

    return (
        <div className="group bg-glass-300 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-lg border border-glass-border dark:border-glass-border-dark flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.03] glass-reflective hover-ripple-effect">
            <div className={`relative h-48 w-full flex items-center justify-center p-4 text-white overflow-hidden`}>
                <div className="absolute inset-0 csp-animated-bg"></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center">
                    <h3 className="text-3xl font-sans font-black uppercase leading-tight tracking-wider shadow-black [text-shadow:1px_1px_3px_var(--tw-shadow-color)] transition-all duration-300 group-hover:tracking-widest">{csp.title}</h3>
                    <p className="text-sm text-beige-200 font-sans font-bold tracking-wider mt-1">({csp.year})</p>
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
                <p className="text-sm text-stone-700 dark:text-stone-300">{csp.synopsis}</p>
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
            
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[3000px]' : 'max-h-0'}`}>
                <div className="px-4 pb-4 space-y-4">
                    <div>
                        <h4 className="font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider text-xs mb-2">Key Facts</h4>
                        <ul className="text-sm space-y-1 text-stone-600 dark:text-stone-300">
                            {Object.entries(csp.keyFacts).map(([key, value]) => (
                                <li key={key}>
                                    <strong className="capitalize">{key.replace('_', ' ')}:</strong> {value}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {csp.applicableTheorists && csp.applicableTheorists.length > 0 && (
                        <div>
                            <h4 className="font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider text-xs mb-2">Applicable Theories</h4>
                            <div className="flex flex-wrap gap-2">
                                {csp.applicableTheorists.map(theorist => (
                                    <span key={theorist} className="text-xs bg-stone-500/20 text-stone-800 dark:text-beige-100 px-2 py-1 rounded-full">
                                        {theorist}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {csp.revisionNotes && csp.revisionNotes.length > 0 && (
                         <div>
                            <h4 className="font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider text-xs mb-2">Revision Notes</h4>
                            <ul className="text-sm space-y-2 text-stone-600 dark:text-stone-300 list-disc list-inside">
                                {csp.revisionNotes.map((note, index) => <li key={index}>{note}</li>)}
                            </ul>
                        </div>
                    )}

                    {csp.youtubeVideoIds && csp.youtubeVideoIds.length > 0 && (
                        <div className="pt-4 mt-4 border-t border-glass-border dark:border-glass-border-dark">
                            <h5 className="font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider text-xs mb-2 text-center">Watch The Video Guides</h5>
                            <div className="space-y-4">
                                {csp.youtubeVideoIds.map((videoId, index) => (
                                    <div key={index} className="max-w-sm mx-auto rounded-lg overflow-hidden shadow-md">
                                        <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full"
                                                src={`https://www.youtube.com/embed/${videoId}`}
                                                title={`${csp.title} - Guide ${index + 1}`}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CspDetailCard;