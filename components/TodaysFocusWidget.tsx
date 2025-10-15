import React, { useState, FormEvent, useEffect } from 'react';
import { FocusItem } from '../types';

interface TodaysFocusWidgetProps {
  items: FocusItem[];
  setItems: (items: FocusItem[]) => void;
  onAllTasksCompleted: () => void;
}

const TodaysFocusWidget: React.FC<TodaysFocusWidgetProps> = ({ items, setItems, onAllTasksCompleted }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const allCompleted = items.length > 0 && items.every(item => item.completed);
    if (allCompleted) {
      onAllTasksCompleted();
    }
  }, [items, onAllTasksCompleted]);

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && items.length < 5) {
      const newItem: FocusItem = {
        id: Date.now().toString(),
        text: inputValue,
        completed: false,
      };
      setItems([...items, newItem]);
      setInputValue('');
    }
  };

  const handleToggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };
  
  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  }

  return (
    <div className="h-full flex flex-col p-1">
      <div className="flex-grow overflow-y-auto space-y-2 pr-2">
        {items.length > 0 ? items.map(item => (
          <div key={item.id} className="group flex items-center justify-between bg-beige-100 dark:bg-stone-700/50 p-2 rounded-md">
            <div className="flex items-center space-x-2 flex-grow min-w-0">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleItem(item.id)}
                className="h-4 w-4 rounded border-gray-300 text-brand-brown-600 focus:ring-brand-brown-500"
              />
              <span className={`flex-grow truncate text-sm ${item.completed ? 'line-through text-stone-500 dark:text-stone-400' : 'text-stone-800 dark:text-beige-100'}`}>
                {item.text}
              </span>
            </div>
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="ml-2 text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            >
              &#x2715;
            </button>
          </div>
        )) : (
            <div className="h-full flex items-center justify-center text-center text-stone-500 dark:text-stone-400">
                <p className="text-sm">Set up to 5 goals for today.</p>
            </div>
        )}
      </div>
      <form onSubmit={handleAddItem} className="flex-shrink-0 pt-2 mt-2 border-t border-beige-200 dark:border-stone-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new goal..."
            disabled={items.length >= 5}
            className="flex-grow w-full text-sm p-1.5 border border-beige-300 rounded-md bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600 disabled:opacity-50"
          />
          <button type="submit" disabled={!inputValue.trim() || items.length >= 5} className="bg-brand-brown-700 text-white px-3 rounded-md text-sm font-bold hover:bg-brand-brown-800 transition-colors disabled:bg-stone-400">+</button>
        </div>
      </form>
    </div>
  );
};

export default TodaysFocusWidget;