
import React, { useState, useMemo } from 'react';
import ProjectMedia from './ProjectMedia';
import { mediaStories } from '../data/newsData';

const NewsPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = useMemo(() => {
        const allCategories = mediaStories.map(story => story.category);
        return ['All', ...Array.from(new Set(allCategories))];
    }, []);

    const filteredStories = useMemo(() => {
        if (selectedCategory === 'All') {
            return mediaStories;
        }
        return mediaStories.filter(story => story.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12 animate-fade-in-up">
                <h1 className="text-4xl font-black uppercase">Project Filmia News</h1>
                <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">Keeping you up to date with popular media stories.</p>
            </div>

            <div className="flex justify-center flex-wrap gap-2 mb-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:-translate-y-0.5 ${
                            selectedCategory === category
                                ? 'bg-brand-brown-700 text-white shadow-md'
                                : 'bg-beige-200 text-stone-700 hover:bg-beige-300 dark:bg-stone-700 dark:text-beige-200 dark:hover:bg-stone-600'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="max-w-3xl mx-auto text-sm text-stone-600 dark:text-stone-300 bg-beige-200 dark:bg-stone-800 p-4 rounded-lg border border-beige-300 dark:border-stone-700 mb-12 flex items-start space-x-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-stone-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p>
                    <strong>Disclaimer:</strong> Project Filmia doesn't write these news stories or claim credit. It's a gateway to news, not a news publication. All content is linked directly to its original source.
                </p>
            </div>
            
            <ProjectMedia stories={filteredStories} />
        </div>
    );
};

export default NewsPage;
