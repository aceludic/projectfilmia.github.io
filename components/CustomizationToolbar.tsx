import React, { useState, useRef, useEffect } from 'react';

interface CustomizationToolbarProps {
  onAddWidget: (widgetId: string) => void;
  availableWidgets: { id: string; title: string; }[];
}

const CustomizationToolbar: React.FC<CustomizationToolbarProps> = ({ onAddWidget, availableWidgets }) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 mb-4 bg-stone-800 text-white p-2 rounded-lg shadow-2xl flex items-center space-x-2 animate-fade-in-up z-50">
      <p className="text-sm font-bold pl-2 pr-2">Customize Mode</p>
      
      <div className="relative" ref={menuRef} id="add-widget-button">
        <button 
          onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
          disabled={availableWidgets.length === 0}
          className="px-3 py-1 bg-green-600 text-white rounded-md text-xs font-bold hover:bg-green-700 transition-colors disabled:bg-stone-500 disabled:cursor-not-allowed"
        >
          + Add Widget
        </button>
        {isAddMenuOpen && (
          <div className="absolute bottom-full mb-2 w-48 bg-stone-700 rounded-md shadow-lg overflow-hidden ring-1 ring-black/5 animate-fade-in-up">
            {availableWidgets.length > 0 ? (
              availableWidgets.map(widget => (
                <button 
                  key={widget.id} 
                  onClick={() => { onAddWidget(widget.id); setIsAddMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-beige-200 hover:bg-stone-600 transition-colors"
                >
                  {widget.title}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-stone-400">All widgets are on the dashboard.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizationToolbar;