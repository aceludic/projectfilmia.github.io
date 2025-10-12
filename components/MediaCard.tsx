import React from 'react';

interface MediaCardProps {
    title: string;
    category: string;
    imageUrl: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ title, category, imageUrl }) => (
    <div className="group relative overflow-hidden rounded-lg shadow-md bg-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-brown-700/20">
        <img src={imageUrl} alt={title} className="w-full h-40 object-cover group-hover:opacity-60 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
            <span className="text-xs font-bold uppercase tracking-wider bg-brand-brown-700 text-white px-2 py-1 rounded">{category}</span>
            <h3 className="text-md font-bold text-white mt-2 truncate">{title}</h3>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
        </div>
    </div>
);

export default MediaCard;