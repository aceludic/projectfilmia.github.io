
import React, { useState, useEffect } from 'react';
import { AppLink } from '../types';

interface AppLinksWidgetProps {
    links: AppLink[];
    onAdd: (link: Omit<AppLink, 'id'>) => void;
    onRemove: (id: string) => void;
}

const spotifySuggestion: Omit<AppLink, 'id'> = {
    name: 'lofi beats',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DWXe9gFZP0gtP?si=fa983c36db924292'
};


const AppLinksWidget: React.FC<AppLinksWidgetProps> = ({ links, onAdd, onRemove }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showSuggestion, setShowSuggestion] = useState(false);

    useEffect(() => {
        const hasSeenSuggestion = localStorage.getItem('hasSeenAppLinkSuggestion');
        if (!hasSeenSuggestion) {
            setShowSuggestion(true);
        }
    }, []);

    const handleAcceptSuggestion = () => {
        onAdd(spotifySuggestion);
        setShowSuggestion(false);
        localStorage.setItem('hasSeenAppLinkSuggestion', 'true');
    };

    const handleDeclineSuggestion = () => {
        setShowSuggestion(false);
        localStorage.setItem('hasSeenAppLinkSuggestion', 'true');
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        try {
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
            return '';
        }
    };

    return (
        <div className="h-full flex flex-col">
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 px-1">
                Pin your favorite Spotify playlists, YouTube channels, and useful websites for quick access.
            </p>
            <div className="flex-grow overflow-y-auto pr-2">
                 {showSuggestion && links.length === 0 && (
                    <div className="bg-green-100/50 dark:bg-green-900/20 p-3 rounded-lg mb-4 border border-green-200 dark:border-green-500/30 animate-fade-in-up">
                        <div className="flex items-start justify-between">
                            <div>
                                <h5 className="font-bold text-sm text-green-800 dark:text-green-300">Suggested Link</h5>
                                <p className="text-xs text-green-700 dark:text-green-400 mt-1">Want to add a 'lofi beats' Spotify playlist to get started?</p>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                                <button onClick={handleAcceptSuggestion} className="p-1.5 rounded-full bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </button>
                                <button onClick={handleDeclineSuggestion} className="p-1.5 rounded-full bg-red-200 text-red-800 hover:bg-red-300 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {links.length > 0 ? (
                    <div className="flex flex-col space-y-2">
                        {links.map(link => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group w-full flex items-center justify-between text-left bg-beige-100 dark:bg-stone-700/50 p-2.5 rounded-md hover:bg-beige-200 dark:hover:bg-stone-700 transition-colors"
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <img src={getFaviconUrl(link.url)} alt="" className="w-6 h-6 rounded-md flex-shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-stone-800 dark:text-beige-100 truncate">{link.name}</p>
                                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{link.url.replace(/^(https?:\/\/)?(www\.)?/, '')}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => { e.preventDefault(); onRemove(link.id); }} 
                                    className="ml-2 p-1 rounded-full text-stone-400 dark:text-stone-500 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all z-10"
                                    title="Remove link"
                                >
                                    &#x2715;
                                </button>
                            </a>
                        ))}
                    </div>
                ) : !showSuggestion && (
                    <p className="text-center text-sm text-stone-500 dark:text-stone-400 pt-8">No links added yet.</p>
                )}
            </div>
            <div className="flex-shrink-0 pt-2 mt-2 border-t border-beige-200 dark:border-stone-700">
                {showForm ? (
                    <form onSubmit={handleAdd} className="animate-fade-in-up space-y-2">
                        <input type="text" placeholder="Name (e.g., YouTube)" value={name} onChange={e => setName(e.target.value)} required className="w-full text-sm p-1.5 border border-beige-300 rounded-md bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600" />
                        <input type="text" placeholder="URL (e.g., youtube.com)" value={url} onChange={e => setUrl(e.target.value)} required className="w-full text-sm p-1.5 border border-beige-300 rounded-md bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600" />
                        <div className="flex items-center space-x-2">
                            <button type="submit" className="w-full bg-brand-brown-700 text-white p-2 rounded-md text-sm font-bold hover:bg-brand-brown-800 transition-colors">Add Link</button>
                            <button type="button" onClick={() => setShowForm(false)} className="w-full bg-stone-200 dark:bg-stone-600 text-stone-700 dark:text-beige-200 p-2 rounded-md text-sm font-bold hover:bg-stone-300 dark:hover:bg-stone-500 transition-colors">Cancel</button>
                        </div>
                    </form>
                ) : (
                     <button onClick={() => setShowForm(true)} className="w-full bg-brand-brown-700/20 text-brand-brown-800 dark:bg-amber-500/20 dark:text-amber-300 p-2 rounded-md text-sm font-bold hover:bg-brand-brown-700/30 dark:hover:bg-amber-500/30 transition-colors">
                        + Add New Link
                    </button>
                )}
            </div>
        </div>
    );
};

export default AppLinksWidget;