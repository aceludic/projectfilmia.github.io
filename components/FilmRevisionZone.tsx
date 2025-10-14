import React, { useState, useMemo, Fragment } from 'react';
import { FilmConceptCategory, FilmPaper, Film, FilmConcept } from '../types';
import FilmMindMap from './FilmMindMap';

interface FilmRevisionZoneProps {
    concepts: FilmConceptCategory[];
    films: FilmPaper[];
}

type RevisionType = 'films' | 'concepts';
type RevisionMode = 'flashcards' | 'mindmap';
type RevisionItem = Film | FilmConcept;

// --- Flashcard Components ---

const ConceptFlashcard: React.FC<{ concept: FilmConcept }> = ({ concept }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="w-full max-w-2xl h-96 rounded-lg shadow-lg cursor-pointer" onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: '1000px' }}>
            <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                {/* Front */}
                <div className="absolute w-full h-full bg-beige-50 dark:bg-stone-800 rounded-lg flex items-center justify-center p-6 text-center border border-beige-200 dark:border-stone-700" style={{ backfaceVisibility: 'hidden' }}>
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-beige-100">{concept.title}</h2>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-4">(Click to flip)</p>
                    </div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-beige-100 dark:bg-stone-700 rounded-lg p-6 overflow-y-auto border border-beige-200 dark:border-stone-600" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
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
                <div className="absolute w-full h-full bg-beige-50 dark:bg-stone-800 rounded-lg flex items-center justify-center p-6 text-center border border-beige-200 dark:border-stone-700" style={{ backfaceVisibility: 'hidden' }}>
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-beige-100">{film.title}</h2>
                        <p className="text-lg text-stone-600 dark:text-stone-300 mt-1">{film.director} ({film.year})</p>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-4">(Click to flip for notes)</p>
                    </div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-beige-100 dark:bg-stone-700 rounded-lg p-6 overflow-y-auto border border-beige-200 dark:border-stone-600 text-stone-700 dark:text-stone-300" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <ul className="space-y-1">{film.revisionNotes?.map((note, index) => <FormattedNote key={index} note={note} />)}</ul>
                </div>
            </div>
        </div>
    );
};

// --- Main Revision Zone Component ---

const FilmRevisionZone: React.FC<FilmRevisionZoneProps> = ({ concepts, films }) => {
    const [revisionType, setRevisionType] = useState<RevisionType>('films');
    const [revisionMode, setRevisionMode] = useState<RevisionMode>('flashcards');

    const [selectedFilmPaper, setSelectedFilmPaper] = useState('all');
    const [selectedFilmCategory, setSelectedFilmCategory] = useState('all');
    const [selectedConceptCategory, setSelectedConceptCategory] = useState('all');
    
    const [currentIndex, setCurrentIndex] = useState(0);

    const filmCategories = useMemo(() => {
        if (selectedFilmPaper === 'all') return films.flatMap(p => p.categories);
        return films.find(p => p.id === selectedFilmPaper)?.categories || [];
    }, [selectedFilmPaper, films]);

    const deck = useMemo<RevisionItem[]>(() => {
        setCurrentIndex(0);
        if (revisionType === 'films') {
            if (selectedFilmCategory !== 'all') {
                return filmCategories.find(c => c.id === selectedFilmCategory)?.films || [];
            }
            if (selectedFilmPaper !== 'all') {
                return films.find(p => p.id === selectedFilmPaper)?.categories.flatMap(c => c.films) || [];
            }
            return films.flatMap(p => p.categories.flatMap(c => c.films));
        } else { // concepts
            if (selectedConceptCategory !== 'all') {
                return concepts.find(c => c.id === selectedConceptCategory)?.concepts || [];
            }
            return concepts.flatMap(c => c.concepts);
        }
    }, [revisionType, selectedFilmPaper, selectedFilmCategory, selectedConceptCategory, films, concepts, filmCategories]);
    
    const handleNext = () => setCurrentIndex(prev => (prev + 1) % deck.length);
    const handlePrev = () => setCurrentIndex(prev => (prev - 1 + deck.length) % deck.length);

    const ModeButton: React.FC<{ mode: RevisionMode, children: React.ReactNode }> = ({ mode, children }) => (
        <button onClick={() => setRevisionMode(mode)} className={`px-4 py-2 rounded-md font-bold transition-all duration-300 text-sm ${revisionMode === mode ? 'bg-brand-brown-700 text-white' : 'bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600'}`}>
          {children}
        </button>
    );
    
    const currentItem = deck[currentIndex];

    return (
        <div className="animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold uppercase tracking-wider">Revision Zone</h2>
                <p className="mt-2 text-md text-stone-500 dark:text-stone-400">Test your knowledge with interactive tools.</p>
            </div>

            <div className="bg-beige-50 dark:bg-stone-800/50 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-beige-200 dark:border-stone-700">
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <label className="font-bold text-stone-700 dark:text-beige-100 text-sm flex-shrink-0">Revise:</label>
                    <div className="flex items-center space-x-2 bg-beige-100 dark:bg-stone-700/50 p-1 rounded-lg">
                       <button onClick={() => setRevisionType('films')} className={`px-3 py-1 text-sm rounded-md font-semibold ${revisionType === 'films' ? 'bg-brand-brown-700/80 text-white' : ''}`}>Set Films</button>
                       <button onClick={() => setRevisionType('concepts')} className={`px-3 py-1 text-sm rounded-md font-semibold ${revisionType === 'concepts' ? 'bg-brand-brown-700/80 text-white' : ''}`}>Key Concepts</button>
                    </div>
                </div>
                <div className="flex items-center space-x-2 bg-beige-100 dark:bg-stone-700/50 p-1 rounded-lg">
                    <ModeButton mode="flashcards">Flashcards</ModeButton>
                    <ModeButton mode="mindmap">Mind Map</ModeButton>
                </div>
            </div>
            
            <div className="bg-beige-50 dark:bg-stone-800/50 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 border border-beige-200 dark:border-stone-700">
                {revisionType === 'films' && (
                    <Fragment>
                        <select value={selectedFilmPaper} onChange={e => {setSelectedFilmPaper(e.target.value); setSelectedFilmCategory('all');}} className="w-full sm:w-auto px-3 py-2 border border-beige-300 rounded-md bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600">
                            <option value="all">All Papers</option>
                            {films.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                        <select value={selectedFilmCategory} onChange={e => setSelectedFilmCategory(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-beige-300 rounded-md bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600">
                            <option value="all">All Categories</option>
                            {filmCategories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </Fragment>
                )}
                {revisionType === 'concepts' && (
                    <select value={selectedConceptCategory} onChange={e => setSelectedConceptCategory(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-beige-300 rounded-md bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600">
                        <option value="all">All Concepts</option>
                        {concepts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                )}
            </div>
            
            {deck.length > 0 && currentItem ? (
                 <div className="flex flex-col items-center space-y-6">
                    {revisionMode === 'flashcards' ? (
                        'director' in currentItem ? <FilmFlashcard film={currentItem} /> : <ConceptFlashcard concept={currentItem} />
                    ) : (
                        'director' in currentItem ? <FilmMindMap film={currentItem} /> : <div>Mind Map for concepts coming soon!</div>
                    )}

                    <div className="flex items-center space-x-4">
                        <button onClick={handlePrev} className="px-4 py-2 bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600 rounded-md font-bold">&lt; Prev</button>
                        <span className="text-stone-600 dark:text-stone-300 font-semibold">{currentIndex + 1} / {deck.length}</span>
                        <button onClick={handleNext} className="px-4 py-2 bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600 rounded-md font-bold">Next &gt;</button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-stone-500 dark:text-stone-400 py-12">No items found for this selection. Please select another category.</p>
            )}
        </div>
    );
};

export default FilmRevisionZone;