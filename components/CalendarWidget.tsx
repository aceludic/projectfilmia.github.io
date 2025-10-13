

import React, { useState, useMemo } from 'react';
import { TimetableEntry } from '../types';

interface CalendarWidgetProps {
    entries: TimetableEntry[];
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ entries }) => {
    const [date, setDate] = useState(new Date());
    const [hoveredDay, setHoveredDay] = useState<number | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
    const [entriesForHoveredDay, setEntriesForHoveredDay] = useState<TimetableEntry[]>([]);

    const year = date.getFullYear();
    const month = date.getMonth();

    const entriesByDayOfWeek = useMemo(() => {
        const groups: { [key: string]: TimetableEntry[] } = {};
        entries.forEach(entry => {
            if (!groups[entry.day]) {
                groups[entry.day] = [];
            }
            groups[entry.day].push(entry);
        });
        Object.values(groups).forEach(dayEntries => dayEntries.sort((a, b) => a.time.localeCompare(b.time)));
        return groups;
    }, [entries]);

    const getEntriesForDate = (day: number) => {
        const currentDate = new Date(year, month, day);
        const dayOfWeekString = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        return entriesByDayOfWeek[dayOfWeekString] || [];
    };

    const handleMouseEnter = (day: number, event: React.MouseEvent<HTMLDivElement>) => {
        const dayEntries = getEntriesForDate(day);
        if (dayEntries.length > 0) {
            setHoveredDay(day);
            setEntriesForHoveredDay(dayEntries);
            // Use mouse event client coordinates for reliable positioning
            setTooltipPosition({ top: event.clientY, left: event.clientX });
        }
    };

    const handleMouseLeave = () => {
        setHoveredDay(null);
        setTooltipPosition(null);
        setEntriesForHoveredDay([]);
    };

    const monthName = date.toLocaleDateString('en-US', { month: 'long' });
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const blanks = Array(firstDayOfMonth).fill(null);
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    const changeMonth = (offset: number) => {
        setDate(currentDate => {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    return (
        <div className="h-full flex flex-col p-2">
            <div className="flex items-center justify-between mb-2">
                <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-beige-200 dark:hover:bg-stone-700">&lt;</button>
                <h5 className="text-sm font-bold text-center text-stone-700 dark:text-beige-100">{monthName} {year}</h5>
                <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-beige-200 dark:hover:bg-stone-700">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-stone-500 dark:text-stone-400">
                {days.map((day, i) => <div key={i}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 flex-grow text-center text-sm mt-1">
                {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                {monthDays.map(day => {
                    const isToday = isCurrentMonth && day === today.getDate();
                    const hasEntries = getEntriesForDate(day).length > 0;
                    return (
                        <div
                            key={day}
                            onMouseEnter={(e) => handleMouseEnter(day, e)}
                            onMouseLeave={handleMouseLeave}
                            className={`relative flex flex-col items-center justify-center p-1 rounded-full aspect-square transition-colors duration-200 ${
                                isToday ? 'bg-brand-brown-700 text-white font-bold' : 'text-stone-700 dark:text-stone-300'
                            } ${hasEntries ? 'cursor-pointer' : ''}`}
                        >
                            <span>{day}</span>
                            {hasEntries && (
                                <div className="absolute bottom-1 w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                            )}
                        </div>
                    );
                })}
            </div>
             {hoveredDay && tooltipPosition && entriesForHoveredDay.length > 0 && (
                <div
                    className="fixed z-50 w-48 p-2 bg-stone-800 text-white rounded-lg shadow-xl animate-fade-in-up border border-stone-700"
                    style={{
                        top: `${tooltipPosition.top}px`,
                        left: `${tooltipPosition.left}px`,
                        transform: 'translate(-50%, calc(-100% - 10px))',
                        pointerEvents: 'none'
                    }}
                >
                    <h4 className="font-bold text-xs border-b border-stone-600 pb-1 mb-1">
                        {new Date(year, month, hoveredDay).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h4>
                    <ul className="space-y-1">
                        {entriesForHoveredDay.map(entry => (
                            <li key={entry.id} className="text-xs">
                                <span className="font-bold">{entry.time}</span> - {entry.subject}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CalendarWidget;
