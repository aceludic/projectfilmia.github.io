import React, { useState } from 'react';
import { SocialAccount } from '../types';

interface SocialIntegrationsProps {
    accounts: SocialAccount[];
    onAddAccount: (url: string) => void;
    onRemoveAccount: (url: string) => void;
}

const SocialIntegrations: React.FC<SocialIntegrationsProps> = ({ accounts, onAddAccount, onRemoveAccount }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddClick = () => {
    if (inputValue.trim()) {
        onAddAccount(inputValue);
        setInputValue('');
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
        <p className="text-sm text-stone-500 dark:text-stone-400">Add your favorite creators, artists, or websites to your feed.</p>
        <div className="flex space-x-2">
            <input 
                type="text" 
                placeholder="Enter a social media or website URL"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddClick()}
                className="flex-grow w-full px-3 py-2 border border-beige-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-brand-brown-700 focus:border-brand-brown-700 sm:text-sm bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600"
            />
            <button 
                onClick={handleAddClick}
                className="bg-brand-brown-700 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-brand-brown-800 transition-colors"
            >
                Add
            </button>
        </div>
        <div className="pt-4 flex-grow overflow-y-auto">
            <h3 className="text-md font-bold text-stone-700 dark:text-beige-200 mb-2">Following</h3>
            {accounts.length > 0 ? (
                <div className="space-y-2">
                    {accounts.map(account => (
                        <div key={account.url} className="flex items-center justify-between bg-beige-100 dark:bg-stone-700/50 p-2 rounded-md animate-fade-in">
                            <a href={account.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline dark:text-beige-200">
                                @{account.username} ({account.platform})
                            </a>
                            <button 
                                onClick={() => onRemoveAccount(account.url)}
                                className="text-xs text-red-500 hover:text-red-700 font-bold"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-stone-500 dark:text-stone-400 text-center pt-8">No sources added yet.</p>
            )}
        </div>
    </div>
  );
};

export default SocialIntegrations;