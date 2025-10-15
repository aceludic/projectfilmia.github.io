
import React, { useState } from 'react';
import { ResourceItem } from '../types';

interface ResourceCardProps {
    resource: ResourceItem;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
    const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

    return (
        <div className="bg-beige-50 dark:bg-stone-800 rounded-lg shadow-lg border border-beige-200 dark:border-stone-700 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${resource.youtubeVideoId}`}
                    title={resource.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-stone-800 dark:text-beige-100">{resource.title}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 flex-grow">{resource.overview}</p>
                <div className="mt-4 pt-4 border-t border-beige-200 dark:border-stone-700">
                    {feedback ? (
                        <p className="text-sm text-center text-stone-500 dark:text-stone-400 font-semibold">Thank you for your feedback!</p>
                    ) : (
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">Was this helpful?</p>
                            <div className="flex space-x-2">
                                <button onClick={() => setFeedback('yes')} className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/80 transition-all transform hover:scale-110">Yes</button>
                                <button onClick={() => setFeedback('no')} className="text-xs font-bold bg-red-100 text-red-800 px-3 py-1 rounded-full hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80 transition-all transform hover:scale-110">No</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;