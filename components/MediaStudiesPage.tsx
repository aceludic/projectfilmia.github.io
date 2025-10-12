import React, { useState, useMemo, useEffect } from 'react';
import { theoristData } from '../data/theoristsData';
import { cspsData } from '../data/cspsData';
import { ResourceItem, TheoristCategory, CSPCategory, PinnedItem } from '../types';
import TheoristDetailCard from './TheoristDetailCard';
import CspDetailCard from './CspDetailCard';
import ResourceCard from './ResourceCard';
import RevisionZone from './RevisionZone';

type MediaView = 'theorists' | 'csps' | 'resources' | 'revise';

interface MediaStudiesPageProps {
  pinnedItems: PinnedItem[];
  onTogglePin: (item: PinnedItem) => void;
}

const DisclaimerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 backdrop-blur-md z-[100] flex items-start justify-center pt-28 p-4 animate-fade-in">
        <div className="bg-beige-50 dark:bg-stone-800 rounded-lg shadow-2xl max-w-lg w-full p-8 text-center animate-fade-in-up border border-beige-200 dark:border-stone-700">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-4">AQA A-Level Focus</h2>
            <p className="text-base text-stone-600 dark:text-stone-300 mb-8">
                Please note: The content in this section is specifically tailored for the AQA A-Level Media Studies specification and may not be suitable for other exam boards.
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


const resourcesData: ResourceItem[] = [
    { id: '1', title: 'How to Analyse a Film Opening', overview: 'A quick guide to the key things to look for when analysing the opening sequence of a film, from cinematography to sound.', youtubeVideoId: 'Hrp2azKjGUI' },
    { id: '2', title: 'Understanding Media Representation', overview: 'Explore how different social groups are represented in media texts and the impact this has on audiences.', youtubeVideoId: 'fOecpti7Qf8' },
    { id: '3', title: 'The Power of Editing', overview: 'Learn the fundamental principles of film editing and how it shapes narrative, pace, and meaning.', youtubeVideoId: 'BLphGQwlR2U' },
    { id: '4', title: 'How to Read Mise-en-scène', overview: 'A guide to analyzing the visual composition of a scene, including setting, lighting, costume, and figure expression.', youtubeVideoId: 'ueSh66xktkk' },
    { id: '5', title: 'Beyond the Spec/Reading', overview: 'Expand your media knowledge with this playlist of supplementary material and advanced concepts.', youtubeVideoId: '3HG8Q9ucr4k' },
];

const MediaStudiesPage: React.FC<MediaStudiesPageProps> = ({ pinnedItems, onTogglePin }) => {
  const [activeView, setActiveView] = useState<MediaView>('theorists');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = sessionStorage.getItem('hasSeenMediaStudiesDisclaimer');
    if (!hasSeenDisclaimer) {
        setShowDisclaimer(true);
    } else {
        setContentVisible(true);
    }
  }, []);

  const handleDisclaimerClose = () => {
    sessionStorage.setItem('hasSeenMediaStudiesDisclaimer', 'true');
    setShowDisclaimer(false);
    setContentVisible(true);
  };


  const filteredTheorists = useMemo(() => {
    if (!searchTerm) return theoristData;
    const lowercasedFilter = searchTerm.toLowerCase();
    return theoristData.map(category => {
      const filtered = category.theorists.filter(theorist =>
        theorist.title.toLowerCase().includes(lowercasedFilter) ||
        theorist.whatItSays.toLowerCase().includes(lowercasedFilter) ||
        theorist.keyTerms.some(t => t.term.toLowerCase().includes(lowercasedFilter) || t.definition.toLowerCase().includes(lowercasedFilter))
      );
      return { ...category, theorists: filtered };
    }).filter(category => category.theorists.length > 0);
  }, [searchTerm]);

  const filteredCsps = useMemo(() => {
    if (!searchTerm) return cspsData;
    const lowercasedFilter = searchTerm.toLowerCase();
    return cspsData.map(category => {
      const filtered = category.csps.filter(csp =>
        csp.title.toLowerCase().includes(lowercasedFilter) ||
        csp.synopsis.toLowerCase().includes(lowercasedFilter)
      );
      return { ...category, csps: filtered };
    }).filter(category => category.csps.length > 0);
  }, [searchTerm]);

  const renderContent = () => {
    switch (activeView) {
      case 'theorists':
        return (
          <div className="space-y-8">
            {filteredTheorists.map((category: TheoristCategory, index) => (
              <div key={category.id} className="animate-slide-and-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 border-b-2 border-brand-brown-700 pb-2">{category.title}</h2>
                <div className="space-y-4">
                  {category.theorists.map(theorist => (
                    <TheoristDetailCard 
                      key={theorist.id} 
                      theorist={theorist} 
                      categoryTitle={category.title}
                      pinnedItems={pinnedItems}
                      onTogglePin={onTogglePin}
                    />
                  ))}
                </div>
              </div>
            ))}
            {filteredTheorists.length === 0 && <p className="text-center text-stone-500 dark:text-stone-400">No theorists match your search.</p>}
          </div>
        );
      case 'csps':
        return (
          <div className="space-y-8">
            {filteredCsps.map((category: CSPCategory, index) => (
              <div key={category.id} className="animate-slide-and-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 border-b-2 border-brand-brown-700 pb-2">{category.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
                  {category.csps.map(csp => (
                    <CspDetailCard 
                      key={csp.id} 
                      csp={csp} 
                      pinnedItems={pinnedItems}
                      onTogglePin={onTogglePin}
                    />
                  ))}
                </div>
              </div>
            ))}
            {filteredCsps.length === 0 && <p className="text-center text-stone-500 dark:text-stone-400">No close study products match your search.</p>}
          </div>
        );
      case 'resources':
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resourcesData.map((resource, index) => <div key={resource.id} className="animate-slide-and-fade-in" style={{ animationDelay: `${index * 100}ms` }}><ResourceCard resource={resource} /></div>)}
            </div>
        );
      case 'revise':
        return <RevisionZone theorists={theoristData} csps={cspsData} />;
      default:
        return null;
    }
  };

  const NavButton: React.FC<{ view: MediaView; children: React.ReactNode }> = ({ view, children }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`px-4 py-2 rounded-md font-bold transition-all duration-300 transform hover:-translate-y-1 ${
        activeView === view ? 'bg-brand-brown-700 text-white shadow-md' : 'bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        {showDisclaimer && <DisclaimerModal onClose={handleDisclaimerClose} />}
        <div className={`transition-opacity duration-500 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-center mb-12 animate-fade-in-up">
                <h1 className="text-4xl font-black uppercase">Media & Film Studies Hub</h1>
                <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">Explore key theories, case studies, and resources.</p>
            </div>

            <div className="sticky top-20 bg-beige-100/80 dark:bg-stone-900/80 backdrop-blur-md z-30 py-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-beige-200 dark:border-stone-700">
                <div className="flex items-center space-x-2">
                    <NavButton view="theorists">Theorists</NavButton>
                    <NavButton view="csps">CSPs</NavButton>
                    <NavButton view="resources">Resources</NavButton>
                    <NavButton view="revise">Revise</NavButton>
                </div>
                {(activeView === 'theorists' || activeView === 'csps') && (
                  <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 border border-beige-300 rounded-md focus:ring-brand-brown-700 focus:border-brand-brown-700 bg-beige-50 dark:bg-stone-800 dark:border-stone-600 dark:text-beige-100 dark:placeholder-stone-400"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default MediaStudiesPage;