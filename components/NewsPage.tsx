import React, { useState, useMemo } from 'react';
import ProjectMedia from './ProjectMedia';
import { mediaStories } from '../data/newsData';
import { ProjectMediaItem } from '../types';

const groupStoriesByDate = (stories: ProjectMediaItem[]) => {
    const groups: { [key: string]: ProjectMediaItem[] } = {};
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) => 
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
    
    // Sort stories by date descending before grouping
    const sortedStories = [...stories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    sortedStories.forEach(story => {
        if (!story.date) return;
        const storyDate = new Date(story.date);
        let key = '';

        if (isSameDay(storyDate, today)) {
            key = 'Today';
        } else if (isSameDay(storyDate, yesterday)) {
            key = 'Yesterday';
        } else {
            key = storyDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(story);
    });
    return groups;
};

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

    const groupedStories = useMemo(() => groupStoriesByDate(filteredStories), [filteredStories]);
    
    const sortedGroupKeys = useMemo(() => {
        return Object.keys(groupedStories).sort((a, b) => {
            if (a === 'Today') return -1;
            if (b === 'Today') return 1;
            if (a === 'Yesterday') return -1;
            if (b === 'Yesterday') return 1;
            return new Date(b).getTime() - new Date(a).getTime();
        });
    }, [groupedStories]);


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black uppercase text-glow">Project Filmia News</h1>
                <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">Keeping you up to date with popular media stories.</p>
            </div>

            <div className="flex justify-center flex-wrap gap-2 mb-12">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:-translate-y-0.5 btn-ripple ${
                            selectedCategory === category
                                ? 'bg-brand-brown-700 text-white shadow-md'
                                : 'bg-glass-300 text-stone-700 hover:bg-glass-100 dark:text-beige-200'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="max-w-3xl mx-auto text-sm text-stone-600 dark:text-stone-300 bg-glass-200 dark:bg-black/20 backdrop-blur-xl p-4 rounded-lg border border-glass-border dark:border-glass-border-dark mb-12 flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-stone-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p>
                    <strong>Disclaimer:</strong> Project Filmia doesn't write these news stories or claim credit. It's a gateway to news, not a news publication. All content is linked directly to its original source.
                </p>
            </div>
            
             <div className="space-y-12">
                {sortedGroupKeys.map(groupKey => (
                    <section key={groupKey}>
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-4 pb-2 border-b-2 border-brand-brown-700/50">
                            {groupKey}
                        </h2>
                        <ProjectMedia stories={groupedStories[groupKey]} />
                    </section>
                ))}
            </div>
        </div>
    );
};

export default NewsPage;