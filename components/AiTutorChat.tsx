import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Chat, Modality } from "@google/genai";
import { ai } from '../utils/gemini';

// Define the structure for a chat message
interface Message {
    role: 'user' | 'model';
    text: string;
}

const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

// Audio Decoding Functions
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const AiTutorChat: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Initialize the AI chat session
    useEffect(() => {
        try {
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are an expert AQA A-Level Media and Film Studies tutor named Phoebe. You are the user's personal guide. Your tone should be encouraging, helpful, and slightly academic. Keep your answers concise but informative. Break down complex topics into easy-to-understand points.",
                },
            });
            setChat(chatSession);
            setHistory([{ role: 'model', text: 'Hello! Phoebe here, your personal AI Tutor for Media and Film Studies. How can I help you revise today?' }]);
        } catch (e) {
            console.error("Failed to initialize AI Chat:", e);
            setError("Sorry, I couldn't connect to the AI tutor. Please check your connection or API setup.");
        }
    }, []);

    // Effect to scroll to the latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, loading]);

    const speakText = async (text: string, messageIndex: number) => {
        if (isMuted) return;

        setSpeakingMessageIndex(messageIndex);
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: text.replace(/\*\*/g, '') }] }], // Remove markdown for cleaner speech
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' },
                        },
                    },
                },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const audioBuffer = await decodeAudioData(
                    decode(base64Audio),
                    outputAudioContext,
                    24000,
                    1,
                );
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContext.destination);
                source.onended = () => setSpeakingMessageIndex(null);
                source.start();
            } else {
                 setSpeakingMessageIndex(null);
            }
        } catch (error) {
            console.error("TTS Error:", error);
            setSpeakingMessageIndex(null);
        }
    };


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
            
            setHistory(prev => {
                const newHistory = [...prev, modelMessage];
                const modelMessageIndex = newHistory.length - 1;
                
                if (!isMuted) {
                    speakText(modelMessage.text, modelMessageIndex);
                }
                
                return newHistory;
            });

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
    const MessageBubble: React.FC<{ message: Message; isSpeaking: boolean }> = ({ message, isSpeaking }) => {
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
                 {isSpeaking && (
                    <div className="flex items-center space-x-1 text-xs text-stone-500 dark:text-stone-400 mt-2">
                        <span className="italic">speaking</span>
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto bg-glass-200 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl border border-glass-border dark:border-glass-border-dark flex flex-col h-[70vh] animate-fade-in glass-reflective">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-glass-border dark:border-glass-border-dark flex justify-between items-center">
                <h3 className="text-lg font-bold text-stone-800 dark:text-beige-100">AI Tutor Chat</h3>
                <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    title={isMuted ? 'Unmute' : 'Mute'}
                    className="p-2 rounded-full hover:bg-glass-100 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300"
                >
                    {isMuted ? 'UNMUTE 🔊' : 'MUTE 🔇'}
                </button>
            </div>
            
            {/* Chat History */}
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                    {history.map((msg, index) => (
                        <MessageBubble key={index} message={msg} isSpeaking={speakingMessageIndex === index && msg.role === 'model'} />
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
            <div className="p-4 border-t border-glass-border dark:border-glass-border-dark">
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