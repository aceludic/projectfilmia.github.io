import React, { useState, useMemo, useEffect } from 'react';
import { filmConceptsData, filmPapersData, filmResourcesData } from '../data/filmStudiesData';
import { FilmConceptCategory, FilmPaper, ResourceItem } from '../types';
import FilmConceptCard from './FilmConceptCard';
import FilmDetailCard from './FilmDetailCard';
import ResourceCard from './ResourceCard';
import FilmRevisionZone from './FilmRevisionZone';
import { LoggedInView } from '../App';

type FilmView = 'concepts' | 'films' | 'resources' | 'revise';

interface FilmStudiesPageProps {
  setView: (view: LoggedInView) => void;
}

const DisclaimerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 backdrop-blur-md z-50 flex items-start justify-center pt-28 p-4 animate-fade-in">
        <div className="bg-glass-200 dark:bg-black/20 backdrop-blur-2xl rounded-lg shadow-2xl max-w-lg w-full p-8 text-center animate-fade-in-up border border-glass-border dark:border-glass-border-dark">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-4">WJEC/Eduqas A-Level Focus</h2>
            <p className="text-base text-stone-600 dark:text-stone-300 mb-8">
                Please note: The content in this section is specifically tailored for the WJEC/Eduqas A-Level Film Studies specification and may not be suitable for other exam boards.
            </p>
            <button
                onClick={onClose}
                className="bg-brand-brown-700 text-white px-8 py-3 rounded-md text-base font-bold hover:bg-brand-brown-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown-700"
            >
                OK
            </button>
        </div>
    </div>
);


const FilmStudiesPage: React.FC<FilmStudiesPageProps> = ({ setView }) => {
  const [activeView, setActiveView] = useState<FilmView>('concepts');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = sessionStorage.getItem('hasSeenFilmStudiesDisclaimer');
    if (!hasSeenDisclaimer) {
        setShowDisclaimer(true);
    } else {
        setContentVisible(true);
    }
  }, []);

  const handleDisclaimerClose = () => {
    sessionStorage.setItem('hasSeenFilmStudiesDisclaimer', 'true');
    setShowDisclaimer(false);
    setContentVisible(true);
  };

  const filteredConcepts = useMemo(() => {
    if (!searchTerm) return filmConceptsData;
    const lowercasedFilter = searchTerm.toLowerCase();
    return filmConceptsData.map(category => {
      const filtered = category.concepts.filter(concept =>
        concept.title.toLowerCase().includes(lowercasedFilter) ||
        concept.overview.toLowerCase().includes(lowercasedFilter) ||
        concept.notes.some(note => note.toLowerCase().includes(lowercasedFilter))
      );
      return { ...category, concepts: filtered };
    }).filter(category => category.concepts.length > 0);
  }, [searchTerm]);

  const filteredFilms = useMemo(() => {
    if (!searchTerm) return filmPapersData;
    const lowercasedFilter = searchTerm.toLowerCase();
    return filmPapersData.map(paper => ({
      ...paper,
      categories: paper.categories.map(category => ({
        ...category,
        films: category.films.filter(film =>
          film.title.toLowerCase().includes(lowercasedFilter) ||
          film.director.toLowerCase().includes(lowercasedFilter) ||
          film.synopsis.toLowerCase().includes(lowercasedFilter)
        )
      })).filter(category => category.films.length > 0)
    })).filter(paper => paper.categories.length > 0);
  }, [searchTerm]);

  const renderContent = () => {
    switch (activeView) {
      case 'concepts':
        return (
          <div className="space-y-8">
            {filteredConcepts.map((category: FilmConceptCategory, index) => (
              <div key={category.id} className="animate-slide-and-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 border-b-2 border-brand-brown-700 pb-2">{category.title}</h2>
                <div className="space-y-4">
                  {category.concepts.map(concept => (
                    <FilmConceptCard key={concept.id} concept={concept} />
                  ))}
                </div>
              </div>
            ))}
            {filteredConcepts.length === 0 && <p className="text-center text-stone-500 dark:text-stone-400">No concepts match your search.</p>}
          </div>
        );
      case 'films':
        return (
          <div className="space-y-12">
            {filteredFilms.map((paper: FilmPaper) => (
                <div key={paper.id}>
                    <h2 className="text-3xl font-bold text-center mb-6">{paper.title}</h2>
                    {paper.categories.map((category, index) => (
                      <div key={category.id} className="mb-8 animate-slide-and-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <h3 className="text-2xl font-bold uppercase tracking-wider mb-4 border-b-2 border-brand-brown-700 pb-2">{category.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
                          {category.films.map(film => (
                            <FilmDetailCard key={film.id} film={film} />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
            ))}
            {filteredFilms.length === 0 && <p className="text-center text-stone-500 dark:text-stone-400">No set films match your search.</p>}
          </div>
        );
      case 'resources':
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filmResourcesData.map((resource, index) => <div key={resource.id} className="animate-slide-and-fade-in" style={{ animationDelay: `${index * 100}ms` }}><ResourceCard resource={resource} /></div>)}
            </div>
        );
      case 'revise':
        return <FilmRevisionZone concepts={filmConceptsData} films={filmPapersData} />;
      default:
        return null;
    }
  };

  const NavButton: React.FC<{ view: FilmView; children: React.ReactNode }> = ({ view, children }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`px-4 py-2 rounded-md font-bold transition-all duration-300 transform hover:-translate-y-1 ${
        activeView === view ? 'bg-brand-brown-700 text-white shadow-md' : 'bg-transparent text-stone-700 hover:bg-glass-300 dark:text-beige-200 dark:hover:bg-glass-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showDisclaimer && <DisclaimerModal onClose={handleDisclaimerClose} />}
        <div className={`transition-opacity duration-500 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black uppercase text-glow">Film Studies Hub</h1>
                <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">Deep dive into film form, set texts, and critical debates.</p>
            </div>
            
            <div role="alert" className="max-w-3xl mx-auto bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-r-lg mb-8 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-300 animate-fade-in">
                <p className="font-bold">Work in Progress</p>
                <p className="text-sm">Content is being added and updated daily. Information that seems lacking now will be added soon. Thanks for your patience!</p>
            </div>

            <div className="sticky top-20 bg-glass-200 dark:bg-black/20 backdrop-blur-2xl z-30 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-glass-border dark:border-glass-border-dark rounded-xl">
                <div className="flex items-center space-x-2">
                    <NavButton view="concepts">Key Concepts</NavButton>
                    <NavButton view="films">Set Films</NavButton>
                    <NavButton view="resources">Resources</NavButton>
                    <NavButton view="revise">Revise</NavButton>
                </div>
                {(activeView === 'concepts' || activeView === 'films') && (
                  <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 border border-glass-border dark:border-glass-border-dark rounded-md focus:ring-brand-brown-700 focus:border-brand-brown-700 bg-glass-300 text-stone-800 dark:text-beige-100 placeholder-stone-500 dark:placeholder-stone-400"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                  </div>
                )}
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    </div>
  );
};

export default FilmStudiesPage;