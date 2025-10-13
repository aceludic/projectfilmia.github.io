

import React, { useRef, useCallback, useState, ChangeEvent, useEffect } from 'react';
import { NotesPanelState, NoteTab } from '../types';

interface NotesPanelProps {
  state: NotesPanelState;
  setState: React.Dispatch<React.SetStateAction<NotesPanelState>>;
}

const MIN_WIDTH = 320;
const MIN_HEIGHT = 250;

const useWindowSize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    useEffect(() => {
        const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
};

const NotesPanel: React.FC<NotesPanelProps> = ({ state, setState }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [renamingTabId, setRenamingTabId] = useState<string | null>(null);
  const [windowWidth] = useWindowSize();
  const isMobile = windowWidth < 768;

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="tab"]')) {
          return;
      }
      if (!panelRef.current) return;
      
      e.preventDefault();
      const startPos = { x: e.clientX, y: e.clientY };
      const startPanelPos = state.position;

      const onMouseMove = (moveE: MouseEvent) => {
          const dx = moveE.clientX - startPos.x;
          const dy = moveE.clientY - startPos.y;
          setState(prev => ({
              ...prev,
              position: { x: startPanelPos.x + dx, y: startPanelPos.y + dy }
          }));
      };

      const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
  }, [isMobile, state.position, setState]);

  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      e.preventDefault();
      e.stopPropagation();
      const startPos = { x: e.clientX, y: e.clientY };
      const startSize = state.size;

      const onMouseMove = (moveE: MouseEvent) => {
          const dx = moveE.clientX - startPos.x;
          const dy = moveE.clientY - startPos.y;
          setState(prev => ({
              ...prev,
              size: {
                  width: Math.max(MIN_WIDTH, startSize.width + dx),
                  height: Math.max(MIN_HEIGHT, startSize.height + dy)
              }
          }));
      };

      const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
  }, [isMobile, state.size, setState]);

  const handleTabClick = (tabId: string) => {
      if (renamingTabId !== tabId) {
          setState(prev => ({ ...prev, activeTabId: tabId }));
      }
  };

  const handleAddTab = () => {
      const newTabId = Date.now().toString();
      const newTab: NoteTab = { id: newTabId, title: `Note ${state.tabs.length + 1}`, content: '' };
      setState(prev => ({
          ...prev,
          tabs: [...prev.tabs, newTab],
          activeTabId: newTabId
      }));
  };

  const handleDeleteTab = (e: React.MouseEvent, tabIdToDelete: string) => {
      e.stopPropagation();
      if (state.tabs.length <= 1) return; 

      const newTabs = state.tabs.filter(t => t.id !== tabIdToDelete);
      let newActiveTabId = state.activeTabId;

      if (state.activeTabId === tabIdToDelete) {
          const deletedTabIndex = state.tabs.findIndex(t => t.id === tabIdToDelete);
          newActiveTabId = newTabs[deletedTabIndex - 1]?.id || newTabs[0]?.id || null;
      }

      setState(prev => ({
          ...prev,
          tabs: newTabs,
          activeTabId: newActiveTabId
      }));
  };

  const handleNoteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!state.activeTabId) return;
    const newContent = e.target.value;
    setState(prev => ({
        ...prev,
        tabs: prev.tabs.map(tab =>
            tab.id === prev.activeTabId ? { ...tab, content: newContent } : tab
        )
    }));
  };

  const handleRename = (tabId: string, newTitle: string) => {
      setState(prev => ({
          ...prev,
          tabs: prev.tabs.map(tab =>
              tab.id === tabId ? { ...tab, title: newTitle.trim() || `Note` } : tab
          )
      }));
      setRenamingTabId(null);
  };
  
  const activeNote = state.tabs.find(t => t.id === state.activeTabId);

  if (!state.isOpen) return null;

  const panelStyle = isMobile 
    ? {} 
    : {
        top: `${state.position.y}px`,
        left: `${state.position.x}px`,
        width: `${state.size.width}px`,
        height: `${state.size.height}px`,
      };
  
  const panelClasses = `bg-glass-200 dark:bg-black/20 backdrop-blur-2xl shadow-2xl flex flex-col border border-glass-border dark:border-glass-border-dark animate-fade-in-up z-40 ${
    isMobile ? 'fixed bottom-0 left-0 w-full h-[70vh] rounded-t-2xl' : 'fixed rounded-2xl'
  }`;

  return (
    <div ref={panelRef} className={panelClasses} style={panelStyle}>
        <div 
          ref={dragHandleRef}
          onMouseDown={handleDragStart}
          className={`flex-shrink-0 flex items-center justify-between pl-2 pr-1 border-b border-glass-border dark:border-glass-border-dark h-12 ${!isMobile ? 'cursor-move' : ''}`}
        >
            <div className="flex-grow flex items-end h-full overflow-x-auto">
               {state.tabs.map(tab => (
                    <div
                        key={tab.id}
                        role="tab"
                        onClick={() => handleTabClick(tab.id)}
                        onDoubleClick={() => !isMobile && setRenamingTabId(tab.id)}
                        className={`flex-shrink-0 flex items-center h-full max-w-[150px] px-3 text-sm font-medium rounded-t-lg cursor-pointer border-b-2 transition-colors ${
                            state.activeTabId === tab.id
                                ? 'border-brand-brown-700 text-brand-brown-700 dark:text-amber-400 bg-glass-100'
                                : 'border-transparent text-stone-600 dark:text-stone-300 hover:bg-glass-300'
                        }`}
                        title={tab.title}
                    >
                        {renamingTabId === tab.id && !isMobile ? (
                            <input
                                type="text"
                                defaultValue={tab.title}
                                autoFocus
                                onFocus={(e) => e.target.select()}
                                onBlur={(e) => handleRename(tab.id, e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleRename(tab.id, (e.target as HTMLInputElement).value) }}
                                className="bg-transparent focus:outline-none w-full text-sm"
                            />
                        ) : (
                            <span className="truncate">{tab.title}</span>
                        )}
                        <button
                            onClick={(e) => handleDeleteTab(e, tab.id)}
                            className="ml-2 text-stone-400 hover:text-red-500 text-xs opacity-50 hover:opacity-100 transition-opacity"
                            style={{ display: state.tabs.length > 1 ? 'inline' : 'none' }}
                            aria-label={`Delete note ${tab.title}`}
                        >
                            &#x2715;
                        </button>
                    </div>
                ))}
                <button
                    onClick={handleAddTab}
                    className="ml-1 mb-px px-2 py-1 text-stone-600 dark:text-stone-300 hover:bg-glass-300 rounded-md text-lg leading-none"
                    aria-label="Add new note"
                >+</button>
            </div>
            <button onClick={() => setState(prev => ({...prev, isOpen: false}))} className="ml-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white flex-shrink-0 p-2 rounded-full hover:bg-glass-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div className="flex flex-col flex-grow min-h-0">
            <textarea
                key={activeNote?.id}
                value={activeNote?.content || ''}
                onChange={handleNoteChange}
                placeholder="Jot down your thoughts here..."
                className="flex-grow w-full p-4 bg-transparent resize-none focus:outline-none text-stone-800 dark:text-beige-200 placeholder-stone-500 dark:placeholder-stone-400"
                aria-label="Notes content"
            />
            <div className="flex-shrink-0 px-4 py-2 border-t border-glass-border dark:border-glass-border-dark">
                <div className="flex items-start space-x-2 text-xs text-stone-600 dark:text-stone-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p>Notes aren't permanent. Removing cookies from your web browser will remove them so move them to a trusted cloud notes app.</p>
                </div>
            </div>
        </div>

        {!isMobile && (
            <div 
                onMouseDown={handleResizeStart}
                className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end p-px"
                title="Resize"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-stone-500 dark:text-stone-400 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 20L20 12M16 20h4v-4" />
                </svg>
            </div>
        )}
    </div>
  );
};

export default NotesPanel;