import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";

// Define the structure for a chat message
interface Message {
    role: 'user' | 'model';
    text: string;
}

const AiTutorChat: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Initialize the AI chat session
    useEffect(() => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are an expert AQA A-Level Media and Film Studies tutor. Your tone should be encouraging, helpful, and slightly academic. Keep your answers concise but informative. Break down complex topics into easy-to-understand points.',
                },
            });
            setChat(chatSession);
            setHistory([{ role: 'model', text: 'Hello! I am your AI Tutor for Media and Film Studies. How can I help you revise today?' }]);
        } catch (e) {
            console.error("Failed to initialize AI Chat:", e);
            setError("Sorry, I couldn't connect to the AI tutor. Please check your connection or API setup.");
        }
    }, []);

    // Effect to scroll to the latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, loading]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading || !chat) return;

        const userMessage: Message = { role: 'user', text: input };
        setHistory(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const result = await chat.sendMessage({ message: userMessage.text });
            const modelMessage: Message = { role: 'model', text: result.text };
            setHistory(prev => [...prev, modelMessage]);
        } catch (e) {
            console.error("Gemini API Error:", e);
            const errorMessage: Message = { role: 'model', text: "I'm sorry, I encountered an error and couldn't process your request. Please try again." };
            setHistory(prev => [...prev, errorMessage]);
            setError("There was an issue communicating with the AI.");
        } finally {
            setLoading(false);
        }
    };
    
    // Renders a single message bubble
    const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
        const isUser = message.role === 'user';
        const bubbleClasses = isUser
            ? 'bg-beige-200 dark:bg-stone-700 self-end'
            : 'bg-white dark:bg-stone-800 self-start';
        const formattedText = message.text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));

        return (
            <div className={`w-fit max-w-lg rounded-xl px-4 py-3 shadow-sm ${bubbleClasses}`}>
                <p className="text-stone-800 dark:text-beige-100 whitespace-pre-wrap">{formattedText}</p>
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto bg-beige-100 dark:bg-stone-800/50 rounded-lg shadow-xl border border-beige-200 dark:border-stone-700 flex flex-col h-[70vh] animate-fade-in">
            {/* Chat History */}
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                    {history.map((msg, index) => (
                        <MessageBubble key={index} message={msg} />
                    ))}
                    {loading && (
                        <div className="self-start flex items-center space-x-2">
                             <div className="bg-white dark:bg-stone-800 rounded-xl px-4 py-3 shadow-sm flex items-center space-x-2">
                                <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    )}
                     {error && (
                        <div className="self-center text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-beige-200 dark:border-stone-700">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about media studies..."
                        disabled={loading || !chat}
                        className="flex-grow w-full px-4 py-2 border border-beige-300 rounded-full shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-brown-700 focus:border-transparent sm:text-sm bg-white dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600 disabled:opacity-50"
                        aria-label="Chat input"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim() || !chat}
                        className="bg-brand-brown-700 text-white rounded-full p-3 shadow-lg hover:bg-brand-brown-800 focus:outline-none focus:ring-2 focus:ring-brand-brown-700 focus:ring-offset-2 transition-transform transform hover:scale-110 disabled:bg-stone-400 disabled:cursor-not-allowed disabled:scale-100"
                        aria-label="Send message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AiTutorChat;
