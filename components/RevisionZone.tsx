import React, { useState, useMemo } from 'react';
import { TheoristCategory, CSPCategory, Theorist, CSP } from '../types';
import MindMap from './MindMap';
import QuizMode from './QuizMode';

interface RevisionZoneProps {
    theorists: TheoristCategory[];
    csps: CSPCategory[];
    logStudySession: (durationInSeconds: number) => void;
    unlockAchievement: (id: string) => void;
}

type RevisionSubject = 'theorists' | 'csps';
type RevisionMode = 'flashcards' | 'mindmap' | 'quiz';

const Flashcard: React.FC<{ item: Theorist | CSP }> = ({ item }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const isTheorist = 'whatItSays' in item;

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
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-beige-100">{item.title}</h2>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-4">(Click to flip)</p>
                    </div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-beige-100 dark:bg-stone-700 rounded-lg p-4 overflow-y-auto border border-beige-200 dark:border-stone-600" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="text-xs text-stone-700 dark:text-stone-300 space-y-2">
                        {isTheorist ? (
                            <>
                                <div>
                                    <h5 className="font-bold uppercase tracking-wider mb-1">What it says</h5>
                                    <p>{(item as Theorist).whatItSays}</p>
                                </div>
                                <div>
                                    <h5 className="font-bold uppercase tracking-wider mb-1">Key Terms</h5>
                                    <ul className="list-disc list-inside space-y-1">
                                        {(item as Theorist).keyTerms.map((t, i) => (
                                            <li key={i}><span className="font-bold">{t.term}:</span> {t.definition}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                             <div>
                                <h5 className="font-bold uppercase tracking-wider mb-1">Synopsis</h5>
                                <p>{(item as CSP).synopsis}</p>
                                <h5 className="font-bold uppercase tracking-wider mt-2 mb-1">Key Facts</h5>
                                <ul className="list-disc list-inside space-y-1">
                                    {Object.entries((item as CSP).keyFacts).map(([key, value]) => (
                                        <li key={key}><strong className="capitalize">{key}:</strong> {value}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RevisionZone: React.FC<RevisionZoneProps> = ({ theorists, csps, logStudySession, unlockAchievement }) => {
    const [revisionSubject, setRevisionSubject] = useState<RevisionSubject>('theorists');
    const [revisionMode, setRevisionMode] = useState<RevisionMode>('flashcards');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentIndex, setCurrentIndex] = useState(0);

    const deck = useMemo(() => {
        let items: (Theorist | CSP)[] = [];
        if (revisionSubject === 'theorists') {
            items = (selectedCategory === 'all')
                ? theorists.flatMap(cat => cat.theorists)
                : theorists.find(cat => cat.id === selectedCategory)?.theorists || [];
        } else { // csps
            items = (selectedCategory === 'all')
                ? csps.flatMap(cat => cat.csps)
                : csps.find(cat => cat.id === selectedCategory)?.csps || [];
        }
        setCurrentIndex(0);
        return items;
    }, [revisionSubject, selectedCategory, theorists, csps]);
    
    const handleNext = () => setCurrentIndex(prev => (prev + 1) % deck.length);
    const handlePrev = () => setCurrentIndex(prev => (prev - 1 + deck.length) % deck.length);

    const ModeButton: React.FC<{ mode: RevisionMode, children: React.ReactNode }> = ({ mode, children }) => (
        <button
          onClick={() => setRevisionMode(mode)}
          className={`px-4 py-2 rounded-md font-bold transition-all duration-300 text-sm ${
            revisionMode === mode ? 'bg-brand-brown-700 text-white' : 'bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600'
          }`}
        >
          {children}
        </button>
    );
    
    const currentItem = deck[currentIndex];
    const categoryTitle = useMemo(() => {
        if (selectedCategory === 'all') return `All ${revisionSubject === 'theorists' ? 'Theorists' : 'CSPs'}`;
        const source = revisionSubject === 'theorists' ? theorists : csps;
        return source.find(cat => cat.id === selectedCategory)?.title || 'Selected Category';
    }, [selectedCategory, revisionSubject, theorists, csps]);

    return (
        <div className="animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold uppercase tracking-wider">Revision Zone</h2>
                <p className="mt-2 text-md text-stone-500 dark:text-stone-400">Test your knowledge with interactive tools.</p>
            </div>

            <div className="bg-beige-50 dark:bg-stone-800/50 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-beige-200 dark:border-stone-700">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center space-x-2 bg-beige-100 dark:bg-stone-700/50 p-1 rounded-lg">
                       <button onClick={() => { setRevisionSubject('theorists'); setSelectedCategory('all'); }} className={`px-3 py-1 text-sm rounded-md font-semibold ${revisionSubject === 'theorists' ? 'bg-brand-brown-700/80 text-white' : ''}`}>Theorists</button>
                       <button onClick={() => { setRevisionSubject('csps'); setSelectedCategory('all'); }} className={`px-3 py-1 text-sm rounded-md font-semibold ${revisionSubject === 'csps' ? 'bg-brand-brown-700/80 text-white' : ''}`}>CSPs</button>
                    </div>
                    <select 
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border border-beige-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-brown-700 focus:border-brand-brown-700 sm:text-sm bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600"
                    >
                        <option value="all">All Categories</option>
                        {(revisionSubject === 'theorists' ? theorists : csps).map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2 bg-beige-100 dark:bg-stone-700/50 p-1 rounded-lg">
                    <ModeButton mode="flashcards">Flashcards</ModeButton>
                    <ModeButton mode="mindmap">Mind Map</ModeButton>
                    <ModeButton mode="quiz">Quiz</ModeButton>
                </div>
            </div>
            
            {revisionMode === 'quiz' ? (
                <QuizMode key={categoryTitle} subjectTitle={categoryTitle} logStudySession={logStudySession} unlockAchievement={unlockAchievement} />
            ) : deck.length > 0 && currentItem ? (
                <div className="flex flex-col items-center space-y-6">
                    {revisionMode === 'flashcards' && <Flashcard item={currentItem} />}
                    {revisionMode === 'mindmap' && 'whatItSays' in currentItem && <MindMap theorist={currentItem} />}
                    {revisionMode === 'mindmap' && !('whatItSays' in currentItem) && <div className="text-center p-8">Mind maps for CSPs are coming soon!</div>}
                    
                    <div className="flex items-center space-x-4">
                        <button onClick={handlePrev} className="px-4 py-2 bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600 rounded-md font-bold">&lt; Prev</button>
                        <span className="text-stone-600 dark:text-stone-300 font-semibold">{currentIndex + 1} / {deck.length}</span>
                        <button onClick={handleNext} className="px-4 py-2 bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600 rounded-md font-bold">Next &gt;</button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-stone-500 dark:text-stone-400">No items found in this category.</p>
            )}
        </div>
    );
};

export default RevisionZone;