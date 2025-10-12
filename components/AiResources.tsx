import React from 'react';

const resources = [
    {
        name: 'NotebookLM',
        description: 'An AI research and writing assistant. Excellent for uploading your own source material (like revision notes or essays) and having a conversation with your documents.',
        url: 'https://notebooklm.google.com/',
        icon: '📚'
    },
    {
        name: 'ChatGPT',
        description: 'A versatile large language model great for brainstorming, getting quick explanations, and practicing essay questions in a conversational format.',
        url: 'https://chat.openai.com/',
        icon: '💬'
    },
    {
        name: 'Gemini',
        description: 'Google\'s multimodal AI that can understand and process text, images, and other inputs. Useful for analyzing visual media or getting creative ideas.',
        url: 'https://gemini.google.com/',
        icon: '✨'
    },
];

const AiResources: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold uppercase tracking-wider">External AI Tools</h2>
                <p className="mt-2 text-md text-stone-500 dark:text-stone-400">Expand your toolkit with these powerful AI services.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                    <div key={index} className="bg-beige-50 dark:bg-stone-800 rounded-lg shadow-lg border border-beige-200 dark:border-stone-700 p-6 flex flex-col text-center transition-transform transform hover:-translate-y-2">
                        <div className="text-4xl mb-4">{resource.icon}</div>
                        <h3 className="text-lg font-bold text-stone-800 dark:text-beige-100">{resource.name}</h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 flex-grow">
                            {resource.description}
                        </p>
                        <a 
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 w-full bg-brand-brown-700/20 text-brand-brown-800 dark:bg-amber-500/20 dark:text-amber-300 p-2 rounded-md text-sm font-bold hover:bg-brand-brown-700/30 dark:hover:bg-amber-500/30 transition-colors"
                        >
                            Visit Site
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AiResources;