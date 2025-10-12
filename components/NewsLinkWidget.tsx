import React from 'react';
import { LoggedInView } from '../App';

interface NewsLinkWidgetProps {
    setView: (view: LoggedInView) => void;
}

const NewsLinkWidget: React.FC<NewsLinkWidgetProps> = ({ setView }) => {
    return (
        <div className="h-full flex items-center justify-between p-4 bg-beige-100 dark:bg-stone-700/50 rounded-md">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-brand-brown-700 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-1-4h.01" />
                    </svg>
                </div>
                <div>
                    <h5 className="font-bold text-stone-800 dark:text-beige-100">Latest Media Stories</h5>
                    <p className="text-sm text-stone-600 dark:text-stone-300">Stay up to date with Project Filmia News.</p>
                </div>
            </div>
            <button 
                onClick={() => setView('news')}
                className="flex-shrink-0 ml-4 bg-brand-brown-700 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-brand-brown-800 transition-colors transform hover:-translate-y-0.5"
            >
                View All
            </button>
        </div>
    );
};

export default NewsLinkWidget;
