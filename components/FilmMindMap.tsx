import React from 'react';
import { Film } from '../types';

interface MindMapProps {
  film: Film;
}

const Node: React.FC<{ children: React.ReactNode; className?: string; level: 'central' | 'primary' | 'secondary' | 'tertiary' }> = ({ children, className, level }) => {
    const levelStyles = {
        central: 'bg-brand-brown-700 text-white text-xl font-black px-6 py-4 rounded-lg shadow-lg',
        primary: 'bg-beige-200 dark:bg-stone-700 text-sm font-bold px-4 py-2 rounded-md shadow',
        secondary: 'bg-beige-50 dark:bg-stone-800 text-sm p-3 rounded-md shadow-sm border border-beige-200 dark:border-stone-700/80',
        tertiary: 'text-xs pl-4 border-l-2 border-beige-300 dark:border-stone-600',
    };
    return <div className={`text-left ${levelStyles[level]} ${className}`}>{children}</div>;
};

const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="flex flex-col items-start space-y-3 w-full">
        <Node level="primary">{title}</Node>
        {children}
    </div>
);

const FilmMindMap: React.FC<MindMapProps> = ({ film }) => {
  const parsedNotes = React.useMemo(() => {
    const sections: { title: string, points: string[] }[] = [];
    if (!film.revisionNotes) return sections;
    
    let currentSection: { title: string, points: string[] } | null = null;

    film.revisionNotes.forEach(note => {
        const titleMatch = note.match(/^\s*\*\*(.*?)\*\*/);
        if (titleMatch) {
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = { title: titleMatch[1], points: [] };
        } else if (currentSection) {
            const point = note.replace(/^\s*-\s*/, '').trim();
            if (point) {
                 currentSection.points.push(point);
            }
        }
    });

    if (currentSection) {
        sections.push(currentSection);
    }
    return sections;
  }, [film.revisionNotes]);

  return (
    <div className="w-full max-w-4xl p-6 bg-beige-100/50 dark:bg-stone-800/50 rounded-lg border border-beige-200 dark:border-stone-700/80">
        <div className="flex flex-col items-center space-y-8">
            <Node level="central" className="text-center">{film.title}</Node>
            
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                     <Section title="Synopsis">
                        <Node level="secondary">{film.synopsis}</Node>
                    </Section>
                    <Section title="Key Facts">
                        <Node level="secondary">
                            <ul className="space-y-1">
                                {Object.entries(film.keyFacts).map(([key, value]) => (
                                    <li key={key}>
                                        <strong className="capitalize text-brand-brown-700 dark:text-amber-400">{key.replace('_', ' ')}:</strong> {value}
                                    </li>
                                ))}
                            </ul>
                        </Node>
                    </Section>
                </div>
                <div className="space-y-6">
                    {parsedNotes.map(section => (
                        <Section key={section.title} title={section.title}>
                            <Node level="secondary">
                                <ul className="space-y-2">
                                    {section.points.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </Node>
                        </Section>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default FilmMindMap;