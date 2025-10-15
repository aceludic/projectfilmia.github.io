import React, { useState, useMemo, Fragment, useEffect } from 'react';
import { FilmConceptCategory, FilmPaper, Film, FilmConcept, CustomFlashcardDeck } from '../types';
import FilmMindMap from './FilmMindMap';
import QuizMode from './QuizMode';
import CustomDecksManager from './CustomDecksManager';

interface FilmRevisionZoneProps {
    concepts: FilmConceptCategory[];
    films: FilmPaper[];
    logStudySession: (durationInSeconds: number) => void;
    unlockAchievement: (id: string) => void;
    customDecks: CustomFlashcardDeck[];
    onAddDeck: (deck: Omit<CustomFlashcardDeck, 'id'>) => void;
    onUpdateDeck: (deck: CustomFlashcardDeck) => void;
    onDeleteDeck: (deckId: string) => void;
    onAddNote: (title: string, content: string) => void;
}

type RevisionType = 'films' | 'concepts' | 'custom';
type RevisionMode = 'flashcards' | 'mindmap' | 'quiz';
type RevisionItem = Film | FilmConcept;

// --- Flashcard Components ---

const ConceptFlashcard: React.FC<{ concept: FilmConcept }> = ({ concept }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="w-full max-w-2xl h-96 rounded-lg shadow-lg cursor-pointer" onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: '1000px' }}>
            <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                {/* Front */}
                <div className="absolute w-full h-full bg-white dark:bg-stone-800 rounded-lg flex items-center justify-center p-6 text-center border border-gray-200 dark:border-stone-700" style={{ backfaceVisibility: 'hidden' }}>
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-beige-100">{concept.title}</h2>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-4">(Click to flip)</p>
                    </div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-gray-50 dark:bg-stone-700 rounded-lg p-6 overflow-y-auto border border-gray-200 dark:border-stone-600" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="text-sm text-stone-700 dark:text-stone-300 space-y-3">
                        <h5 className="font-bold uppercase tracking-wider">Overview</h5>
                        <p>{concept.overview}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FilmFlashcard: React.FC<{ film: Film }> = ({ film }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    
    const FormattedNote: React.FC<{ note: string }> = ({ note }) => {
        const isListItem = /^\s*-/.test(note);
        let content = note.replace(/^\s*-\s*/, '').trim();
        const parts = content.split(/(\*\*.*?\*\*)/g).filter(part => part);
        return (
            <li className={`flex text-xs ${isListItem ? 'ml-4' : 'mt-2 list-none'}`}>
                {isListItem && <span className="mr-2 text-brand-brown-700 dark:text-amber-400">•</span>}
                <div>{parts.map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i} className="text-stone-800 dark:text-beige-100">{part.slice(2, -2)}</strong> : part)}</div>
            </li>
        );
    };

    return (
        <div className="w-full max-w-2xl h-96 rounded-lg shadow-lg cursor-pointer" onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: '1000px' }}>
            <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                {/* Front */}
                <div className="absolute w-full h-full bg-white dark:bg-stone-800 rounded-lg flex items-center justify-center p-6 text-center border border-gray-200 dark:border-stone-700" style={{ backfaceVisibility: 'hidden' }}>
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-beige-100">{film.title}</h2>
                        <p className="text-lg text-stone-600 dark:text-stone-300 mt-1">{film.director} ({film.year})</p>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-4">(Click to flip for notes)</p>
                    </div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-gray-50 dark:bg-stone-700 rounded-lg p-6 overflow-y-auto border border-gray-200 dark:border-stone-600 text-stone-700 dark:text-stone-300" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <ul className="space-y-1">{film.revisionNotes?.map((note, index) => <FormattedNote key={index} note={note} />)}</ul>
                </div>
            </div>
        </div>
    );
};

// --- Main Revision Zone Component ---

const FilmRevisionZone: React.FC<FilmRevisionZoneProps> = (props) => {
    const { concepts, films, logStudySession, unlockAchievement, customDecks, onAddDeck, onUpdateDeck, onDeleteDeck, onAddNote } = props;
    const [revisionType, setRevisionType] = useState<RevisionType>('films');
    const [revisionMode, setRevisionMode] = useState<RevisionMode>('flashcards');

    const [selectedFilmPaper, setSelectedFilmPaper] = useState('all');
    const [selectedFilmCategory, setSelectedFilmCategory] = useState('all');
    const [selectedConceptCategory, setSelectedConceptCategory] = useState('all');
    const [selectedItemForQuiz, setSelectedItemForQuiz] = useState('all');
    
    const [currentIndex, setCurrentIndex] = useState(0);

    const filmCategories = useMemo(() => {
        if (selectedFilmPaper === 'all') return films.flatMap(p => p.categories);
        return films.find(p => p.id === selectedFilmPaper)?.categories || [];
    }, [selectedFilmPaper, films]);

    const itemsForCategory = useMemo<RevisionItem[]>(() => {
        if (revisionType === 'films') {
            if (selectedFilmCategory !== 'all') {
                return filmCategories.find(c => c.id === selectedFilmCategory)?.films || [];
            }
            return filmCategories.flatMap(c => c.films);
        } else if (revisionType === 'concepts') {
            if (selectedConceptCategory !== 'all') {
                return concepts.find(c => c.id === selectedConceptCategory)?.concepts || [];
            }
            return concepts.flatMap(c => c.concepts);
        }
        return [];
    }, [revisionType, selectedFilmCategory, selectedConceptCategory, concepts, filmCategories]);

    useEffect(() => {
        setCurrentIndex(0);
        setSelectedItemForQuiz('all');
    }, [revisionType, selectedFilmPaper, selectedFilmCategory, selectedConceptCategory]);
    
    const handleNext = () => setCurrentIndex(prev => (prev + 1) % itemsForCategory.length);
    const handlePrev = () => setCurrentIndex(prev => (prev - 1 + itemsForCategory.length) % itemsForCategory.length);

    const ModeButton: React.FC<{ mode: RevisionMode, children: React.ReactNode }> = ({ mode, children }) => (
        <button onClick={() => setRevisionMode(mode)} className={`px-4 py-2 rounded-md font-bold transition-all duration-300 text-sm ${revisionMode === mode ? 'bg-brand-brown-700 text-white' : 'bg-white/50 text-stone-700 hover:bg-white/80 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600'}`}>
          {children}
        </button>
    );
    
    const currentItem = itemsForCategory[currentIndex];
    
    const categoryTitle = useMemo(() => {
        if (revisionType === 'custom') return 'My Custom Decks';
        if (revisionType === 'films') {
            if (selectedFilmCategory !== 'all') {
                return filmCategories.find(c => c.id === selectedFilmCategory)?.title || 'Selected Category';
            }
            if (selectedFilmPaper !== 'all') {
                return films.find(p => p.id === selectedFilmPaper)?.title || 'Selected Paper';
            }
            return 'All Set Films';
        } else {
             if (selectedConceptCategory !== 'all') {
                return concepts.find(c => c.id === selectedConceptCategory)?.title || 'Selected Category';
            }
            return 'All Key Concepts';
        }
    }, [revisionType, selectedFilmPaper, selectedFilmCategory, selectedConceptCategory, filmCategories, films, concepts]);

    const quizSubjectTitle = useMemo(() => {
        if (selectedItemForQuiz !== 'all') {
            const item = itemsForCategory.find(i => i.id === selectedItemForQuiz);
            return item ? item.title : categoryTitle;
        }
        return categoryTitle;
    }, [selectedItemForQuiz, itemsForCategory, categoryTitle]);

    const renderContent = () => {
        if (revisionType === 'custom') {
            return <CustomDecksManager decks={customDecks} onAdd={onAddDeck} onUpdate={onUpdateDeck} onDelete={onDeleteDeck} />;
        }
        if (revisionMode === 'quiz') {
            return <QuizMode key={quizSubjectTitle} subjectTitle={quizSubjectTitle} logStudySession={logStudySession} unlockAchievement={unlockAchievement} onAddNote={onAddNote} />;
        }
        if (itemsForCategory.length > 0 && currentItem) {
            return (
                <div className="flex flex-col items-center space-y-6">
                    {revisionMode === 'flashcards' ? (
                        'director' in currentItem ? <FilmFlashcard film={currentItem} /> : <ConceptFlashcard concept={currentItem} />
                    ) : (
                        'director' in currentItem ? <FilmMindMap film={currentItem} /> : <div className="text-center p-8">Mind maps for concepts are coming soon!</div>
                    )}

                    <div className="flex items-center space-x-4">
                        <button onClick={handlePrev} className="px-4 py-2 bg-white/50 text-stone-700 hover:bg-white/80 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600 rounded-md font-bold">&lt; Prev</button>
                        <span className="text-stone-600 dark:text-stone-300 font-semibold">{currentIndex + 1} / {itemsForCategory.length}</span>
                        <button onClick={handleNext} className="px-4 py-2 bg-white/50 text-stone-700 hover:bg-white/80 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600 rounded-md font-bold">Next &gt;</button>
                    </div>
                </div>
            );
        }
        return <p className="text-center text-stone-500 dark:text-stone-400 py-12">No items found for this selection. Please select another category.</p>;
    };

    return (
        <div className="animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold uppercase tracking-wider">Revision Zone</h2>
                <p className="mt-2 text-md text-stone-500 dark:text-stone-400">Test your knowledge with interactive tools.</p>
            </div>

            <div className="liquid-glass p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center space-x-2 bg-glass-300 dark:bg-stone-900/50 p-1 rounded-lg">
                       <button onClick={() => setRevisionType('films')} className={`px-3 py-1 text-sm rounded-md font-semibold ${revisionType === 'films' ? 'bg-brand-brown-700/80 text-white' : ''}`}>Set Films</button>
                       <button onClick={() => setRevisionType('concepts')} className={`px-3 py-1 text-sm rounded-md font-semibold ${revisionType === 'concepts' ? 'bg-brand-brown-700/80 text-white' : ''}`}>Key Concepts</button>
                       <button onClick={() => setRevisionType('custom')} className={`px-3 py-1 text-sm rounded-md font-semibold ${revisionType === 'custom' ? 'bg-brand-brown-700/80 text-white' : ''}`}>Custom Decks</button>
                    </div>
                </div>
                {revisionType !== 'custom' && (
                    <div className="flex items-center space-x-2 bg-glass-300 dark:bg-stone-900/50 p-1 rounded-lg">
                        <ModeButton mode="flashcards">Flashcards</ModeButton>
                        <ModeButton mode="mindmap">Mind Map</ModeButton>
                        <ModeButton mode="quiz">Quiz</ModeButton>
                    </div>
                )}
            </div>
            
            {revisionType !== 'custom' && (
                <div className="liquid-glass p-4 mb-8 flex flex-col sm:flex-row items-center justify-center flex-wrap gap-4 rounded-lg">
                    {revisionType === 'films' && (
                        <Fragment>
                            <select value={selectedFilmPaper} onChange={e => {setSelectedFilmPaper(e.target.value); setSelectedFilmCategory('all');}} className="w-full sm:w-auto px-3 py-2 border border-glass-border rounded-md bg-glass-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600">
                                <option value="all">All Papers</option>
                                {films.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                            <select value={selectedFilmCategory} onChange={e => setSelectedFilmCategory(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-glass-border rounded-md bg-glass-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600">
                                <option value="all">All Categories</option>
                                {filmCategories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                        </Fragment>
                    )}
                    {revisionType === 'concepts' && (
                        <select value={selectedConceptCategory} onChange={e => setSelectedConceptCategory(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-glass-border rounded-md bg-glass-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600">
                            <option value="all">All Concepts</option>
                            {concepts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    )}
                     {revisionMode === 'quiz' && itemsForCategory.length > 0 && (
                        <select 
                            value={selectedItemForQuiz} 
                            onChange={e => setSelectedItemForQuiz(e.target.value)} 
                            className="w-full sm:w-auto px-3 py-2 border border-glass-border rounded-md bg-glass-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600"
                        >
                            <option value="all">Quiz for: {categoryTitle}</option>
                            {itemsForCategory.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
                        </select>
                    )}
                </div>
            )}
            
            {renderContent()}
        </div>
    );
};

export default FilmRevisionZone;