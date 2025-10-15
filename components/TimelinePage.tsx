import React, { useState } from 'react';
import { timelineData } from '../data/timelineData';
import { LoggedInView } from '../App';

interface TimelinePageProps {
  setView: (view: LoggedInView) => void;
}

const TimelinePage: React.FC<TimelinePageProps> = ({ setView }) => {
    const [selectedEvent, setSelectedEvent] = useState<(typeof timelineData)[0] | null>(null);

    const minYear = Math.floor(Math.min(...timelineData.map(e => e.year)) / 10) * 10;
    const maxYear = Math.ceil(Math.max(...timelineData.map(e => e.year)) / 10) * 10;
    const yearSpan = maxYear - minYear;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black uppercase text-glow">A History of Film & Media</h1>
                <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">An interactive timeline of key movements and milestones.</p>
            </div>
            
            <div className="w-full overflow-x-auto pb-8">
                <div className="relative w-max px-20 py-16" style={{ width: `${yearSpan * 15}px`}}>
                    {/* Timeline Axis */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-300 dark:bg-stone-700"></div>

                    {/* Decade Markers */}
                    {Array.from({ length: (yearSpan / 10) + 1 }).map((_, i) => {
                        const year = minYear + (i * 10);
                        const left = `${((year - minYear) / yearSpan) * 100}%`;
                        return (
                            <div key={year} className="absolute top-1/2 -translate-y-1/2" style={{ left }}>
                                <div className="w-0.5 h-4 bg-stone-400 dark:bg-stone-600 -translate-y-2"></div>
                                <span className="absolute top-full mt-2 text-xs font-bold text-stone-500 -translate-x-1/2">{year}</span>
                            </div>
                        );
                    })}

                    {/* Event Nodes */}
                    {timelineData.map((event, index) => {
                        const left = `${((event.year - minYear) / yearSpan) * 100}%`;
                        const isAbove = index % 2 === 0;
                        return (
                            <div
                                key={event.id}
                                className="absolute top-1/2 cursor-pointer group"
                                style={{ left, transform: `translate(-50%, ${isAbove ? '-100%' : '0%'})` }}
                                onClick={() => setSelectedEvent(event)}
                            >
                                <div className={`relative flex flex-col items-center ${isAbove ? 'pb-4' : 'pt-4'}`}>
                                    {/* Stem */}
                                    <div className="w-0.5 h-8 bg-stone-300 dark:bg-stone-600"></div>
                                    {/* Dot */}
                                    <div className="w-4 h-4 rounded-full bg-beige-100 dark:bg-stone-800 border-2 border-brand-brown-700 group-hover:bg-brand-brown-700 transition-colors"></div>
                                    {/* Label */}
                                    <div className={`absolute whitespace-nowrap px-2 py-1 text-xs font-bold rounded-md bg-glass-300 dark:bg-stone-900/50 shadow-md ${isAbove ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
                                        {event.title}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedEvent && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-glass-200 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-scale-in border border-glass-border" onClick={e => e.stopPropagation()}>
                        <span className="text-sm font-bold bg-brand-brown-700/20 text-brand-brown-800 dark:bg-amber-500/20 dark:text-amber-300 px-2 py-1 rounded">{selectedEvent.year}</span>
                        <h3 className="text-xl font-bold text-stone-800 dark:text-beige-100 mt-2">{selectedEvent.title}</h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">{selectedEvent.description}</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button onClick={() => setSelectedEvent(null)} className="px-4 py-2 bg-glass-100 rounded-md font-bold btn-ripple">Close</button>
                            {selectedEvent.link && (
                                <button onClick={() => setView(selectedEvent.link as LoggedInView)} className="px-4 py-2 bg-brand-brown-700 text-white rounded-md font-bold btn-ripple">Learn More</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimelinePage;