import React, { useState, useEffect } from 'react';

const TimeWidget: React.FC = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString([], { weekday: 'long' });
    const fullDate = date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-5xl font-black text-stone-800 dark:text-beige-100 leading-none">{time}</h1>
            <p className="mt-2 text-md font-bold text-stone-600 dark:text-stone-300">{day}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">{fullDate}</p>
        </div>
    );
};

export default TimeWidget;
