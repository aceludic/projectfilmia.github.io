import React, { useState, FormEvent } from 'react';
import { CustomFlashcard, CustomFlashcardDeck } from '../types';

// --- Deck Editor Modal ---
interface DeckEditorModalProps {
    deck: Omit<CustomFlashcardDeck, 'id'> | CustomFlashcardDeck | null;
    onSave: (deck: Omit<CustomFlashcardDeck, 'id'> | CustomFlashcardDeck) => void;
    onClose: () => void;
}

const DeckEditorModal: React.FC<DeckEditorModalProps> = ({ deck, onSave, onClose }) => {
    const [title, setTitle] = useState(deck?.title || '');
    const [cards, setCards] = useState<CustomFlashcard[]>(deck?.cards && deck.cards.length > 0 ? deck.cards : [{ id: Date.now().toString(), front: '', back: '' }]);

    const handleCardChange = (index: number, field: 'front' | 'back', value: string) => {
        const newCards = [...cards];
        newCards[index] = { ...newCards[index], [field]: value };
        setCards(newCards);
    };

    const addCard = () => {
        setCards([...cards, { id: Date.now().toString(), front: '', back: '' }]);
    };

    const removeCard = (id: string) => {
        if (cards.length > 1) {
            setCards(cards.filter(card => card.id !== id));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const finalDeck = { ...deck, title, cards: cards.filter(c => c.front.trim() && c.back.trim()) };
        onSave(finalDeck as Omit<CustomFlashcardDeck, 'id'> | CustomFlashcardDeck);
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-glass-200 dark:bg-black/20 rounded-2xl shadow-2xl max-w-2xl w-full p-6 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-beige-100 mb-4">{deck && 'id' in deck ? 'Edit Deck' : 'Create New Deck'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow min-h-0">
                    <input type="text" placeholder="Deck Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 mb-4 border rounded-md bg-glass-300 dark:bg-stone-800" />
                    <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                        {cards.map((card, index) => (
                            <div key={card.id} className="p-3 bg-glass-100 dark:bg-stone-900/30 rounded-lg space-y-2 relative">
                                <textarea placeholder="Front" value={card.front} onChange={e => handleCardChange(index, 'front', e.target.value)} rows={2} className="w-full p-2 border rounded-md bg-glass-300 dark:bg-stone-800 text-sm" />
                                <textarea placeholder="Back" value={card.back} onChange={e => handleCardChange(index, 'back', e.target.value)} rows={2} className="w-full p-2 border rounded-md bg-glass-300 dark:bg-stone-800 text-sm" />
                                <button type="button" onClick={() => removeCard(card.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs" disabled={cards.length <= 1}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addCard} className="mt-4 text-sm font-bold w-full p-2 rounded-md bg-glass-300 hover:bg-glass-100">Add Card</button>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-glass-100 rounded-md font-bold">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-brown-700 text-white rounded-md font-bold">Save Deck</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Custom Flashcard Player ---
const CustomFlashcardPlayer: React.FC<{ deck: CustomFlashcardDeck; onExit: () => void }> = ({ deck, onExit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const currentCard = deck.cards[currentIndex];

    if (!currentCard) {
        return (
            <div className="text-center p-8">
                <p>This deck has no cards!</p>
                <button onClick={onExit} className="mt-4 px-4 py-2 bg-brand-brown-700 text-white font-bold rounded-lg">Back to Decks</button>
            </div>
        );
    }
    
    const handleNext = () => { setIsFlipped(false); setTimeout(() => setCurrentIndex(p => (p + 1) % deck.cards.length), 150); };
    const handlePrev = () => { setIsFlipped(false); setTimeout(() => setCurrentIndex(p => (p - 1 + deck.cards.length) % deck.cards.length), 150); };

    return (
        <div className="flex flex-col items-center space-y-6">
            <h3 className="text-xl font-bold">{deck.title}</h3>
            <div onClick={() => setIsFlipped(!isFlipped)} className="w-full max-w-xl h-80 rounded-lg shadow-lg cursor-pointer" style={{ perspective: '1000px' }}>
                <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                    <div className="absolute w-full h-full bg-beige-50 dark:bg-stone-800 rounded-lg flex items-center justify-center p-6 text-center" style={{ backfaceVisibility: 'hidden' }}>
                        <p className="text-xl">{currentCard.front}</p>
                    </div>
                    <div className="absolute w-full h-full bg-beige-100 dark:bg-stone-700 rounded-lg flex items-center justify-center p-6 text-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <p className="text-xl">{currentCard.back}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={handlePrev} className="px-4 py-2 bg-beige-200 dark:bg-stone-700 rounded-md font-bold">&lt; Prev</button>
                <span>{currentIndex + 1} / {deck.cards.length}</span>
                <button onClick={handleNext} className="px-4 py-2 bg-beige-200 dark:bg-stone-700 rounded-md font-bold">Next &gt;</button>
            </div>
            <button onClick={onExit} className="text-sm font-bold text-stone-600 dark:text-stone-300 hover:underline">Exit Study Mode</button>
        </div>
    );
};


// --- Main Component ---
interface CustomDecksManagerProps {
    decks: CustomFlashcardDeck[];
    onAdd: (deck: Omit<CustomFlashcardDeck, 'id'>) => void;
    onUpdate: (deck: CustomFlashcardDeck) => void;
    onDelete: (deckId: string) => void;
}

const CustomDecksManager: React.FC<CustomDecksManagerProps> = ({ decks, onAdd, onUpdate, onDelete }) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingDeck, setEditingDeck] = useState<CustomFlashcardDeck | null>(null);
    const [studyingDeck, setStudyingDeck] = useState<CustomFlashcardDeck | null>(null);

    const handleSave = (deckData: Omit<CustomFlashcardDeck, 'id'> | CustomFlashcardDeck) => {
        if ('id' in deckData && deckData.id) {
            onUpdate(deckData);
        } else {
            onAdd(deckData);
        }
        setIsEditorOpen(false);
        setEditingDeck(null);
    };

    const handleEdit = (deck: CustomFlashcardDeck) => {
        setEditingDeck(deck);
        setIsEditorOpen(true);
    };

    if (studyingDeck) {
        return <CustomFlashcardPlayer deck={studyingDeck} onExit={() => setStudyingDeck(null)} />;
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
             {isEditorOpen && <DeckEditorModal deck={editingDeck} onSave={handleSave} onClose={() => setIsEditorOpen(false)} />}
            <div className="space-y-4">
                {decks.length === 0 ? (
                    <p className="text-center text-stone-500 py-8">You haven't created any custom flashcard decks yet.</p>
                ) : (
                    decks.map(deck => (
                        <div key={deck.id} className="bg-glass-100 dark:bg-stone-900/30 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <h4 className="font-bold">{deck.title}</h4>
                                <p className="text-sm text-stone-500">{deck.cards.length} cards</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setStudyingDeck(deck)} className="px-3 py-1 text-sm font-bold bg-green-500/20 text-green-800 dark:text-green-300 rounded-md">Study</button>
                                <button onClick={() => handleEdit(deck)} className="px-3 py-1 text-sm font-bold bg-blue-500/20 text-blue-800 dark:text-blue-300 rounded-md">Edit</button>
                                <button onClick={() => onDelete(deck.id)} className="px-3 py-1 text-sm font-bold bg-red-500/20 text-red-800 dark:text-red-300 rounded-md">Delete</button>
                            </div>
                        </div>
                    ))
                )}
                <button onClick={() => { setEditingDeck(null); setIsEditorOpen(true); }} className="w-full p-3 font-bold text-brand-brown-700 dark:text-amber-400 bg-brand-brown-700/10 dark:bg-amber-500/10 rounded-lg border-2 border-dashed border-brand-brown-700/30 dark:border-amber-500/30 hover:bg-brand-brown-700/20 dark:hover:bg-amber-500/20">
                    + Create New Deck
                </button>
            </div>
        </div>
    );
};

export default CustomDecksManager;
