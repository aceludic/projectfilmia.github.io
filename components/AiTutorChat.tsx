import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";

const Message: React.FC<{ role: 'user' | 'model', content: string }> = ({ role, content }) => {
    const isUser = role === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
        <div className={`max-w-prose px-4 py-3 rounded-lg shadow-sm ${isUser ? 'bg-brand-brown-700 text-white' : 'bg-beige-200 dark:bg-stone-700'}`}>
           <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    );
};

const LoadingBubble: React.FC = () => (
    <div className="flex justify-start mb-4 animate-fade-in">
        <div className="max-w-prose px-4 py-3 rounded-lg shadow-sm bg-beige-200 dark:bg-stone-700">
            <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-stone-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-stone-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-stone-500 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);

const AiTutorChat: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a helpful media and film studies tutor. Answer questions concisely and clearly for a high-school level student. Use markdown for formatting like bolding key terms or using lists when appropriate.',
        },
      });
      setChat(chatSession);
    } catch (error) {
        console.error("Failed to initialize AI Tutor:", error);
        setMessages([{ role: 'model', content: "Sorry, the AI Tutor could not be initialized. Please check your connection or API key setup."}]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages, isLoadingAi]);

  const handleAiQuery = async () => {
    if (!aiQuery.trim() || !chat || isLoadingAi) return;

    const currentQuery = aiQuery;
    setMessages(prev => [...prev, { role: 'user', content: currentQuery }]);
    setAiQuery('');
    setIsLoadingAi(true);

    try {
      const response = await chat.sendMessage({ message: currentQuery });
      setMessages(prev => [...prev, { role: 'model', content: response.text }]);
    } catch (error) {
      console.error("AI Tutor Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I couldn't process that request. Please try again." }]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="bg-beige-50 dark:bg-stone-800 rounded-lg shadow-xl border border-beige-200 dark:border-stone-700 p-6 flex flex-col h-[60vh]">
            <div className="flex-grow overflow-y-auto pr-4 -mr-4 mb-4">
                {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-stone-500 dark:text-stone-400">Ask the AI tutor a question to start the chat.</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <Message key={index} role={msg.role} content={msg.content} />
                ))}
                {isLoadingAi && <LoadingBubble />}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="mt-auto pt-4 border-t border-beige-200 dark:border-stone-700">
                <div className="flex flex-col space-y-4">
                    <textarea
                        id="ai-query"
                        rows={3}
                        placeholder="Ask a question... (e.g., Explain Stuart Hall's Reception Theory)"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAiQuery())}
                        className="w-full px-3 py-2 border border-beige-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-brand-brown-700 focus:border-brand-brown-700 sm:text-sm bg-beige-100 dark:bg-stone-700 text-stone-800 dark:text-beige-100 dark:border-stone-600 disabled:opacity-50"
                        disabled={isLoadingAi || !chat}
                    />
                    <button 
                        onClick={handleAiQuery}
                        disabled={isLoadingAi || !aiQuery.trim() || !chat}
                        className="w-full bg-brand-brown-700 text-white px-6 py-3 rounded-md text-base font-bold hover:bg-brand-brown-800 transition-colors disabled:bg-stone-400 dark:disabled:bg-stone-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoadingAi ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                Thinking...
                            </>
                        ) : 'Ask Tutor'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AiTutorChat;