import React, { useState, useMemo } from 'react';
import { TheoristCategory, CSPCategory, Theorist } from '../types';
import MindMap from './MindMap';

interface RevisionZoneProps {
    theorists: TheoristCategory[];
    csps: CSPCategory[];
}

const Flashcard: React.FC<{ theorist: Theorist }> = ({ theorist }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div 
            className="w-full max-w-xl h-80 rounded-lg shadow-lg cursor-pointer transition-transform duration-500"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ perspective: '1000px' }}
        >
            <div 
                className="relative w-full h-full transition-transform duration-500"
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                {/* Front */}
                <div className="absolute w-full h-full bg-beige-50 dark:bg-stone-800 rounded-lg flex items-center justify-center p-6 text-center border border-beige-200 dark:border-stone-700" style={{ backfaceVisibility: 'hidden' }}>
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-beige-100">{theorist.title}</h2>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-4">(Click to flip)</p>
                    </div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-beige-100 dark:bg-stone-700 rounded-lg p-4 overflow-y-auto border border-beige-200 dark:border-stone-600" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="text-xs text-stone-700 dark:text-stone-300 space-y-2">
                         <div>
                            <h5 className="font-bold uppercase tracking-wider mb-1">What it says</h5>
                            <p>{theorist.whatItSays}</p>
                        </div>
                        <div>
                            <h5 className="font-bold uppercase tracking-wider mb-1">Key Terms</h5>
                            <ul className="list-disc list-inside space-y-1">
                                {theorist.keyTerms.map((t, i) => (
                                    <li key={i}><span className="font-bold">{t.term}:</span> {t.definition}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RevisionZone: React.FC<RevisionZoneProps> = ({ theorists, csps }) => {
    const [revisionMode, setRevisionMode] = useState<'flashcards' | 'mindmap'>('flashcards');
    const [selectedCategory, setSelectedCategory] = useState<string>(theorists[0]?.id || 'all');
    const [currentIndex, setCurrentIndex] = useState(0);

    const deck = useMemo(() => {
        if (selectedCategory === 'all') {
            return theorists.flatMap(cat => cat.theorists);
        }
        return theorists.find(cat => cat.id === selectedCategory)?.theorists || [];
    }, [selectedCategory, theorists]);
    
    const handleNext = () => {
        setCurrentIndex(prev => (prev + 1) % deck.length);
    };

    const handlePrev = () => {
        setCurrentIndex(prev => (prev - 1 + deck.length) % deck.length);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setCurrentIndex(0);
    }

    const ModeButton: React.FC<{ mode: 'flashcards' | 'mindmap', children: React.ReactNode }> = ({ mode, children }) => (
        <button
          onClick={() => setRevisionMode(mode)}
          className={`px-4 py-2 rounded-md font-bold transition-all duration-300 text-sm ${
            revisionMode === mode ? 'bg-brand-brown-700 text-white' : 'bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600'
          }`}
        >
          {children}
        </button>
      );
    
    return (
        <div className="animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold uppercase tracking-wider">Revision Zone</h2>
                <p className="mt-2 text-md text-stone-500 dark:text-stone-400">Test your knowledge with interactive tools.</p>
            </div>

            <div className="bg-beige-50 dark:bg-stone-800/50 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-beige-200 dark:border-stone-700">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <label htmlFor="category-select" className="font-bold text-stone-700 dark:text-beige-100 text-sm">Theorist Category:</label>
                    <select 
                        id="category-select" 
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="w-full sm:w-auto px-3 py-2 border border-beige-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-brown-700 focus:border-brand-brown-700 sm:text-sm bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600"
                    >
                        <option value="all">All Theorists</option>
                        {theorists.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2 bg-beige-100 dark:bg-stone-700/50 p-1 rounded-lg">
                    <ModeButton mode="flashcards">Flashcards</ModeButton>
                    <ModeButton mode="mindmap">Mind Map</ModeButton>
                </div>
            </div>
            
            {deck.length > 0 ? (
                 <div className="flex flex-col items-center space-y-6">
                    {revisionMode === 'flashcards' && <Flashcard theorist={deck[currentIndex]} />}
                    {revisionMode === 'mindmap' && <MindMap theorist={deck[currentIndex]} />}

                    <div className="flex items-center space-x-4">
                        <button onClick={handlePrev} className="px-4 py-2 bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600 rounded-md font-bold">&lt; Prev</button>
                        <span className="text-stone-600 dark:text-stone-300 font-semibold">{currentIndex + 1} / {deck.length}</span>
                        <button onClick={handleNext} className="px-4 py-2 bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600 rounded-md font-bold">Next &gt;</button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-stone-500 dark:text-stone-400">No theorists found in this category.</p>
            )}
        </div>
    );
};

export default RevisionZone;