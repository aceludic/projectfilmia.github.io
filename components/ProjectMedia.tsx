import React from 'react';
import { ProjectMediaItem } from '../types';

interface ProjectMediaProps {
    stories: ProjectMediaItem[];
}

const CategoryPill: React.FC<{ category: ProjectMediaItem['category'] }> = ({ category }) => {
    const categoryColors = {
        Music: 'bg-pink-200 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
        Gaming: 'bg-purple-200 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        Politics: 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        Film: 'bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    };
    return (
        <span className={`absolute top-3 right-3 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${categoryColors[category]}`}>
            {category}
        </span>
    );
};

const ProjectMedia: React.FC<ProjectMediaProps> = ({ stories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stories.map((story, index) => (
          <a 
              key={story.id} 
              href={story.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group transition-transform duration-300 transform hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
          >
              <div className="bg-beige-50 dark:bg-stone-800/80 p-3 pb-4 rounded-lg shadow-lg h-full border border-beige-200 dark:border-stone-700/80">
                  <div className="relative">
                      <img 
                          src={story.imageUrl} 
                          alt={story.title} 
                          className="w-full h-48 object-cover rounded-md"
                      />
                      <CategoryPill category={story.category} />
                  </div>
                  <div className="mt-4 text-left">
                      <h4 className="text-base font-serif text-stone-800 dark:text-beige-100 leading-snug whitespace-pre-wrap">{story.title}</h4>
                  </div>
              </div>
          </a>
      ))}
    </div>
  );
};

export default ProjectMedia;