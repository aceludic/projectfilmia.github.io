import React, { useState } from 'react';

const CalendarWidget: React.FC = () => {
    const [date, setDate] = useState(new Date());

    const year = date.getFullYear();
    const month = date.getMonth();

    const monthName = date.toLocaleDateString('en-US', { month: 'long' });
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
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
                    return (
                        <div
                            key={day}
                            className={`flex items-center justify-center p-1 rounded-full aspect-square ${
                                isToday ? 'bg-brand-brown-700 text-white font-bold' : 'text-stone-700 dark:text-stone-300'
                            }`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarWidget;
