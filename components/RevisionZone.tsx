import React, { useState, useMemo, useEffect } from 'react';
import { TheoristCategory, CSPCategory, Theorist, CSP, CustomFlashcardDeck, NoteTab } from '../types';
import MindMap from './MindMap';
import QuizMode from './QuizMode';
import CustomDecksManager from './CustomDecksManager';
import TheoristComparison from './TheoristComparison';

interface RevisionZoneProps {
    theorists: TheoristCategory[];
    csps: CSPCategory[];
    logStudySession: (durationInSeconds: number) => void;
    unlockAchievement: (id: string) => void;
    customDecks: CustomFlashcardDeck[];
    onAddDeck: (deck: Omit<CustomFlashcardDeck, 'id'>) => void;
    onUpdateDeck: (deck: CustomFlashcardDeck) => void;
    onDeleteDeck: (deckId: string) => void;
    onAddNote: (title: string, content: string) => void;
}

type RevisionSubject = 'theorists' | 'csps' | 'custom';
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
                <div className="absolute w-full h-full bg-white dark:bg-stone-800 rounded-lg flex items-center justify-center p-6 text-center border border-gray-200 dark:border-stone-700" style={{ backfaceVisibility: 'hidden' }}>
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-beige-100">{item.title}</h2>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-4">(Click to flip)</p>
                    </div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-gray-50 dark:bg-stone-700 rounded-lg p-4 overflow-y-auto border border-gray-200 dark:border-stone-600" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
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

const RevisionZone: React.FC<RevisionZoneProps> = (props) => {
    const { theorists, csps, logStudySession, unlockAchievement, customDecks, onAddDeck, onUpdateDeck, onDeleteDeck, onAddNote } = props;
    const [revisionSubject, setRevisionSubject] = useState<RevisionSubject>('theorists');
    const [revisionMode, setRevisionMode] = useState<RevisionMode>('flashcards');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedItemForQuiz, setSelectedItemForQuiz] = useState<string>('all');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revisionTool, setRevisionTool] = useState<'revise' | 'compare'>('revise');


    const itemsForCategory = useMemo(() => {
        if (revisionSubject === 'theorists') {
            return (selectedCategory === 'all')
                ? theorists.flatMap(cat => cat.theorists)
                : theorists.find(cat => cat.id === selectedCategory)?.theorists || [];
        } else if (revisionSubject === 'csps') {
            return (selectedCategory === 'all')
                ? csps.flatMap(cat => cat.csps)
                : csps.find(cat => cat.id === selectedCategory)?.csps || [];
        }
        return [];
    }, [revisionSubject, selectedCategory, theorists, csps]);

    useEffect(() => {
        setCurrentIndex(0);
        setSelectedItemForQuiz('all');
    }, [revisionSubject, selectedCategory]);
    
    const handleNext = () => setCurrentIndex(prev => (prev + 1) % itemsForCategory.length);
    const handlePrev = () => setCurrentIndex(prev => (prev - 1 + itemsForCategory.length) % itemsForCategory.length);

    const ModeButton: React.FC<{ mode: RevisionMode, children: React.ReactNode }> = ({ mode, children }) => (
        <button
          onClick={() => setRevisionMode(mode)}
          className={`px-4 py-2 rounded-md font-bold transition-all duration-300 text-sm ${
            revisionMode === mode ? 'bg-brand-brown-700 text-white' : 'bg-white/50 text-stone-700 hover:bg-white/80 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600'
          }`}
        >
          {children}
        </button>
    );
    
    const currentItem = itemsForCategory[currentIndex];

    const categoryTitle = useMemo(() => {
        if (revisionSubject === 'custom') return 'My Custom Decks';
        if (selectedCategory === 'all') return `All ${revisionSubject === 'theorists' ? 'Theorists' : 'CSPs'}`;
        const source = revisionSubject === 'theorists' ? theorists : csps;
        return source.find(cat => cat.id === selectedCategory)?.title || 'Selected Category';
    }, [selectedCategory, revisionSubject, theorists, csps]);

    const quizSubjectTitle = useMemo(() => {
        if (selectedItemForQuiz !== 'all') {
            const item = itemsForCategory.find(i => i.id === selectedItemForQuiz);
            return item ? item.title : categoryTitle;
        }
        return categoryTitle;
    }, [selectedItemForQuiz, itemsForCategory, categoryTitle]);

    const renderContent = () => {
        if (revisionTool === 'compare') {
            return <TheoristComparison theorists={theorists} onAddNote={onAddNote} />;
        }
        if (revisionSubject === 'custom') {
            return <CustomDecksManager decks={customDecks} onAdd={onAddDeck} onUpdate={onUpdateDeck} onDelete={onDeleteDeck} />;
        }
        if (revisionMode === 'quiz') {
            return <QuizMode key={quizSubjectTitle} subjectTitle={quizSubjectTitle} logStudySession={logStudySession} unlockAchievement={unlockAchievement} onAddNote={onAddNote} />;
        }
        if (itemsForCategory.length > 0 && currentItem) {
            return (
                <div className="flex flex-col items-center space-y-6">
                    {revisionMode === 'flashcards' && <Flashcard item={currentItem} />}
                    {revisionMode === 'mindmap' && 'whatItSays' in currentItem && <MindMap theorist={currentItem} />}
                    {revisionMode === 'mindmap' && !('whatItSays' in currentItem) && <div className="text-center p-8">Mind maps for CSPs are coming soon!</div>}
                    
                    <div className="flex items-center space-x-4">
                        <button onClick={handlePrev} className="px-4 py-2 bg-white/50 text-stone-700 hover:bg-white/80 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600 rounded-md font-bold">&lt; Prev</button>
                        <span className="text-stone-600 dark:text-stone-300 font-semibold">{currentIndex + 1} / {itemsForCategory.length}</span>
                        <button onClick={handleNext} className="px-4 py-2 bg-white/50 text-stone-700 hover:bg-white/80 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600 rounded-md font-bold">Next &gt;</button>
                    </div>
                </div>
            );
        }
        return <p className="text-center text-stone-500 dark:text-stone-400">No items found in this category.</p>;
    };

    return (
        <div className="animate-fade-in-up">
             <div className="flex justify-center items-center space-x-2 mb-8 liquid-glass p-2 rounded-lg max-w-xs mx-auto">
                <button onClick={() => setRevisionTool('revise')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${revisionTool === 'revise' ? 'bg-brand-brown-700 text-white' : 'text-stone-700 dark:text-stone-300'}`}>Revise</button>
                <button onClick={() => setRevisionTool('compare')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${revisionTool === 'compare' ? 'bg-brand-brown-700 text-white' : 'text-stone-700 dark:text-stone-300'}`}>Compare</button>
            </div>

            {revisionTool === 'revise' && (
                <>
                <div className="liquid-glass p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center space-x-2 bg-glass-300 dark:bg-stone-900/50 p-1 rounded-lg">
                        <button onClick={() => { setRevisionSubject('theorists'); setSelectedCategory('all'); }} className={`px-3 py-1 text-sm rounded-md font-semibold ${revisionSubject === 'theorists' ? 'bg-brand-brown-700/80 text-white' : ''}`}>Theorists</button>
                        <button onClick={() => { setRevisionSubject('csps'); setSelectedCategory('all'); }} className={`px-3 py-1 text-sm rounded-md font-semibold ${revisionSubject === 'csps' ? 'bg-brand-brown-700/80 text-white' : ''}`}>CSPs</button>
                        <button onClick={() => { setRevisionSubject('custom'); }} className={`px-3 py-1 text-sm rounded-md font-semibold ${revisionSubject === 'custom' ? 'bg-brand-brown-700/80 text-white' : ''}`}>Custom Decks</button>
                        </div>
                        {revisionSubject !== 'custom' && (
                            <select 
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                className="w-full sm:w-auto px-3 py-2 border border-glass-border rounded-md shadow-sm focus:outline-none focus:ring-brand-brown-700 focus:border-brand-brown-700 sm:text-sm bg-glass-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600"
                            >
                                <option value="all">All Categories</option>
                                {(revisionSubject === 'theorists' ? theorists : csps).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    {revisionSubject !== 'custom' && (
                        <div className="flex items-center space-x-2 bg-glass-300 dark:bg-stone-900/50 p-1 rounded-lg">
                            <ModeButton mode="flashcards">Flashcards</ModeButton>
                            <ModeButton mode="mindmap">Mind Map</ModeButton>
                            <ModeButton mode="quiz">Quiz</ModeButton>
                        </div>
                    )}
                </div>
                
                {revisionMode === 'quiz' && revisionSubject !== 'custom' && itemsForCategory.length > 0 && (
                    <div className="liquid-glass p-4 mb-8 flex items-center justify-center gap-4 rounded-lg">
                        <label htmlFor="quiz-item-select" className="text-sm font-bold">Quiz Topic:</label>
                        <select 
                            id="quiz-item-select"
                            value={selectedItemForQuiz}
                            onChange={e => setSelectedItemForQuiz(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-glass-border rounded-md bg-glass-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600"
                        >
                            <option value="all">All in {categoryTitle}</option>
                            {itemsForCategory.map(item => (
                                <option key={item.id} value={item.id}>{item.title}</option>
                            ))}
                        </select>
                    </div>
                )}
                </>
            )}
            
            {renderContent()}
        </div>
    );
};

export default RevisionZone;