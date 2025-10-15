import React from 'react';
import { StudyLogEntry } from '../types';

interface StudyTimeWidgetProps {
  studyLog: StudyLogEntry[];
  onSetup: () => void;
}

const formatTotalTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const StudyTimeWidget: React.FC<StudyTimeWidgetProps> = ({ studyLog, onSetup }) => {
    const totalStudySeconds = React.useMemo(() => studyLog.reduce((acc, entry) => acc + entry.duration, 0), [studyLog]);
    
    const weeklyData = React.useMemo(() => {
        const data: { day: string; hours: number }[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1);
            
            const entry = studyLog.find(log => log.date === dateString);
            const hours = entry ? entry.duration / 3600 : 0;
            data.push({ day: dayOfWeek, hours });
        }
        return data;
    }, [studyLog]);

    const maxHours = Math.max(1, ...weeklyData.map(d => d.hours));

    return (
        <div className="h-full flex flex-col p-2">
            <div className="text-center">
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-bold">Total Time Studied</p>
                <p className="text-3xl font-black text-stone-800 dark:text-beige-100">{formatTotalTime(totalStudySeconds)}</p>
            </div>

            <div className="flex-grow flex items-end justify-between space-x-1 px-2 pt-2">
                {weeklyData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full h-20 flex items-end">
                            <div 
                                className="w-full bg-brand-brown-700/50 dark:bg-amber-400/50 rounded-t-sm"
                                style={{ height: `${(data.hours / maxHours) * 100}%`}}
                                title={`${data.hours.toFixed(1)} hours`}
                            ></div>
                        </div>
                        <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-1">{data.day}</p>
                    </div>
                ))}
            </div>

            <button
                onClick={onSetup}
                className="mt-2 w-full bg-brand-brown-700 text-white p-2 rounded-md text-sm font-bold hover:bg-brand-brown-800 transition-colors"
            >
                Start New Session
            </button>
        </div>
    );
};

export default StudyTimeWidget;
