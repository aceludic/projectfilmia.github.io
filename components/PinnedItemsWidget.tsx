import React from 'react';
import { PinnedItem } from '../types';
import { LoggedInView } from '../App';

interface PinnedItemsWidgetProps {
    items: PinnedItem[];
    onUnpin: (item: PinnedItem) => void;
    setView: (view: LoggedInView) => void;
}

const ItemIcon: React.FC<{ type: PinnedItem['type'] }> = ({ type }) => {
    let icon, text, colors;

    switch (type) {
        case 'theorist':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" /></svg>;
            text = 'Theorist';
            colors = 'bg-indigo-200 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
            break;
        case 'csp':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
            text = 'CSP';
            colors = 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';
            break;
        case 'film':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>;
            text = 'Film';
            colors = 'bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300';
            break;
        case 'film-concept':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 2.45a.5.5 0 00-.707 0l-.547.547a.5.5 0 000 .707l.547.547a.5.5 0 00.707 0l.547-.547a.5.5 0 000-.707l-.547-.547zM10 13a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm3.5-2a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" /></svg>;
            text = 'Concept';
            colors = 'bg-sky-200 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300';
            break;
        default:
            return null;
    }

    return <div className={`flex items-center space-x-1.5 text-xs font-bold px-2 py-0.5 rounded-full ${colors}`}>{icon}<span>{text}</span></div>;
};

const PinnedItemsWidget: React.FC<PinnedItemsWidgetProps> = ({ items, onUnpin, setView }) => {
    
    const handleItemClick = (item: PinnedItem) => {
        if (item.type === 'theorist' || item.type === 'csp') {
            setView('media-studies');
        } else if (item.type === 'film' || item.type === 'film-concept') {
            setView('film-studies');
        }
    };

    return (
        <div className="h-full overflow-y-auto">
            {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 dark:text-stone-400 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-2.667 5.404-5.968.867a1 1 0 00-.554 1.705l4.323 4.212-.973 5.942a1 1 0 001.45 1.054L10 18.232l5.333 2.804a1 1 0 001.45-1.054l-1.023-5.942 4.373-4.212a1 1 0 00-.554-1.705l-5.968-.867-2.667-5.404z" />
                    </svg>
                    <p className="font-semibold">No Pinned Items</p>
                    <p className="text-sm mt-1">Click the star icon on a theorist, film, or concept to add it here for quick access.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => handleItemClick(item)}
                            className="group w-full flex items-center justify-between text-left bg-white/50 dark:bg-stone-800/30 p-2.5 rounded-md animate-fade-in hover:bg-white/80 dark:hover:bg-stone-700/50 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-stone-800 dark:text-beige-100 truncate">{item.title}</p>
                                <div className="mt-1.5">
                                    <ItemIcon type={item.type} />
                                </div>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); onUnpin(item); }}
                                className="ml-2 p-1 rounded-full text-stone-400 dark:text-stone-500 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all z-10"
                                title="Unpin item"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PinnedItemsWidget;