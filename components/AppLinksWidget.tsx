import React, { useState } from 'react';
import { AppLink } from '../types';

interface AppLinksWidgetProps {
    links: AppLink[];
    onAdd: (link: Omit<AppLink, 'id'>) => void;
    onRemove: (id: string) => void;
}

const AppLinksWidget: React.FC<AppLinksWidgetProps> = ({ links, onAdd, onRemove }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Basic validation: ensure it's a plausible URL
            new URL(url.startsWith('http') ? url : `https://${url}`);
            onAdd({ name, url });
            setName('');
            setUrl('');
            setShowForm(false);
        } catch (error) {
            alert('Please enter a valid URL (e.g., google.com)');
        }
    };

    const getFaviconUrl = (linkUrl: string) => {
        try {
            const urlObj = new URL(linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`);
            return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
        } catch {
            return ''; // Return empty string for invalid URLs
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-grow overflow-y-auto">
                <div className="grid grid-cols-3 gap-3">
                    {links.map(link => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex flex-col items-center justify-center text-center p-2 bg-beige-100 dark:bg-stone-700/50 rounded-md aspect-square hover:bg-beige-200 dark:hover:bg-stone-700 transition-colors"
                        >
                            <img src={getFaviconUrl(link.url)} alt="" className="w-8 h-8 rounded-md mb-1" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            <p className="text-xs font-semibold text-stone-700 dark:text-beige-200 truncate w-full">{link.name}</p>
                            <button onClick={(e) => { e.preventDefault(); onRemove(link.id); }} className="absolute top-0 right-0 p-0.5 rounded-full bg-stone-300 dark:bg-stone-600 text-stone-600 dark:text-stone-300 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all scale-75">
                                 &#x2715;
                            </button>
                        </a>
                    ))}
                    <button 
                        onClick={() => setShowForm(!showForm)} 
                        className="flex flex-col items-center justify-center p-2 bg-beige-100/50 dark:bg-stone-700/30 border-2 border-dashed border-beige-300 dark:border-stone-600 rounded-md aspect-square hover:bg-beige-200 dark:hover:bg-stone-700 transition-colors text-stone-500 dark:text-stone-400"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                       </svg>
                        <span className="text-xs mt-1">Add Link</span>
                    </button>
                </div>
            </div>
            {showForm && (
                <form onSubmit={handleAdd} className="flex-shrink-0 pt-2 mt-2 border-t border-beige-200 dark:border-stone-700 animate-fade-in-up space-y-2">
                    <input type="text" placeholder="Name (e.g., YouTube)" value={name} onChange={e => setName(e.target.value)} required className="w-full text-xs p-1.5 border border-beige-300 rounded-md bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600" />
                    <input type="text" placeholder="URL (e.g., youtube.com)" value={url} onChange={e => setUrl(e.target.value)} required className="w-full text-xs p-1.5 border border-beige-300 rounded-md bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600" />
                    <button type="submit" className="w-full bg-brand-brown-700 text-white p-1.5 rounded-md text-xs font-bold hover:bg-brand-brown-800">Add</button>
                </form>
            )}
        </div>
    );
};

export default AppLinksWidget;
