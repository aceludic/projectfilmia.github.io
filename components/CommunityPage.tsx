import React from 'react';

const communityLinks = [
    {
        name: 'Discord Server',
        description: 'Join our official Discord server to chat with other students, share resources, and participate in group study sessions.',
        url: 'https://discord.gg/', // Placeholder link
        icon: '💬',
        cta: 'Join Server'
    },
    {
        name: 'Social Media',
        description: 'Follow our development progress and get updates on our social media channels. (Coming Soon!)',
        url: '#',
        icon: '📢',
        cta: 'Follow Us'
    }
];

const CommunityPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black uppercase text-glow">Community Hub</h1>
                <p className="mt-2 text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">Connect, collaborate, and share with fellow students.</p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {communityLinks.map((link, index) => (
                    <div
                        key={index}
                        className="liquid-glass rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.03]"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="text-6xl mb-4">{link.icon}</div>
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100">{link.name}</h2>
                        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 flex-grow">
                            {link.description}
                        </p>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-6 w-full max-w-xs block px-6 py-3 text-white font-bold rounded-lg btn-ripple transition-colors ${link.url === '#' ? 'bg-stone-400 cursor-not-allowed' : 'bg-brand-brown-700 hover:bg-brand-brown-800'}`}
                        >
                            {link.cta}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityPage;