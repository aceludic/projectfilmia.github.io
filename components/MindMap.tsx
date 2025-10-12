import React from 'react';
import { Theorist, Term } from '../types';

interface MindMapProps {
  theorist: Theorist;
}

const Node: React.FC<{ children: React.ReactNode; className?: string; level: 'central' | 'primary' | 'secondary' }> = ({ children, className, level }) => {
    const levelStyles = {
        central: 'bg-brand-brown-700 text-white text-xl font-black px-6 py-4 rounded-lg shadow-lg',
        primary: 'bg-beige-200 dark:bg-stone-700 text-sm font-bold px-4 py-2 rounded-md shadow',
        secondary: 'bg-beige-50 dark:bg-stone-800 text-sm p-3 rounded-md shadow-sm border border-beige-200 dark:border-stone-700/80',
    };
    return <div className={`text-center ${levelStyles[level]} ${className}`}>{children}</div>;
};

const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="flex flex-col items-center space-y-3 w-full">
        <Node level="primary">{title}</Node>
        {children}
    </div>
);

const TermList: React.FC<{ terms: Term[] }> = ({ terms }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
        {terms.map((term, index) => (
            <Node level="secondary" key={index}>
                <p><strong className="text-brand-brown-700 dark:text-amber-400">{term.term}:</strong> {term.definition}</p>
            </Node>
        ))}
    </div>
);

const MindMap: React.FC<MindMapProps> = ({ theorist }) => {
  return (
    <div className="w-full max-w-4xl p-6 bg-beige-100/50 dark:bg-stone-800/50 rounded-lg border border-beige-200 dark:border-stone-700/80">
        <div className="flex flex-col items-center space-y-8">
            {/* Central Node */}
            <Node level="central">{theorist.title}</Node>
            
            {/* Main Content Sections */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column */}
                <div className="space-y-8">
                    <Section title="What it says">
                        <Node level="secondary">{theorist.whatItSays}</Node>
                    </Section>

                    <Section title="Example">
                        <Node level="secondary"><em className="italic">{theorist.example}</em></Node>
                    </Section>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <Section title="Key Terms">
                        <TermList terms={theorist.keyTerms} />
                    </Section>
                    
                    {theorist.additionalTerms && theorist.additionalTerms.length > 0 && (
                        <Section title="Additional Terms">
                            <TermList terms={theorist.additionalTerms} />
                        </Section>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default MindMap;