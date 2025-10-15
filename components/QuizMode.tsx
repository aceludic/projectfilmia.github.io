import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { ai } from '../utils/gemini';

interface QuizModeProps {
    subjectTitle: string;
    logStudySession: (durationInSeconds: number) => void;
    unlockAchievement: (id: string) => void;
    onAddNote: (title: string, content: string) => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ subjectTitle, logStudySession, unlockAchievement, onAddNote }) => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [quizKey, setQuizKey] = useState(0); // Key to trigger quiz regeneration

    useEffect(() => {
        const generateQuiz = async () => {
            setLoading(true);
            setError(null);
            try {
                const prompt = `Generate a 5-question multiple-choice quiz about "${subjectTitle}". The questions should be A-Level standard for Media or Film Studies. Return the response as a valid JSON array of objects. Each object must have the following structure: { "question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": "string" }. Ensure the correctAnswer is one of the strings present in the options array. Do not include any text, markdown, or explanations outside of the JSON array.`;
                
                const result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: 'application/json' }
                });

                // The API should return JSON, but we parse it to be safe.
                const jsonText = result.text.replace(/```json|```/g, '').trim();
                const parsedQuestions = JSON.parse(jsonText);

                if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
                    setQuestions(parsedQuestions);
                } else {
                    throw new Error("Invalid quiz format received from AI.");
                }

            } catch (e) {
                console.error("Failed to generate quiz:", e);
                setError("Sorry, I couldn't generate a quiz for this topic. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        generateQuiz();
    }, [subjectTitle, quizKey]); // Re-run when subject or key changes

    const handleAnswerSelect = (option: string) => {
        if (isAnswered) return;
        setSelectedAnswer(option);
        setIsAnswered(true);
        if (option === questions[currentQuestionIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        const isLastQuestion = currentQuestionIndex === questions.length - 1;
        if (isLastQuestion) {
            logStudySession(600); // Log 10 minutes for completing a quiz
            unlockAchievement('quiz_novice');
            // Check final score including the current question's answer
            const finalScore = score + (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0);
            if (finalScore === questions.length) {
                unlockAchievement('perfect_score');
            }
        }
        setIsAnswered(false);
        setSelectedAnswer(null);
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const handleRestart = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setScore(0);
        setError(null);
        setQuizKey(prev => prev + 1); // Trigger a new quiz generation
    };

    const handleSaveResults = () => {
        const title = `Quiz Results: ${subjectTitle}`;
        const content = `I scored ${score} out of ${questions.length} on the quiz for ${subjectTitle}.`;
        onAddNote(title, content);
    };
    
    if (loading) return <div className="text-center p-12">Generating your quiz...</div>;
    if (error) return <div className="text-center p-12 text-red-500">{error}</div>;

    const currentQuestion = questions[currentQuestionIndex];
    const isFinished = currentQuestionIndex >= questions.length;

    if (isFinished) {
        return (
            <div className="text-center p-8 bg-glass-300 dark:bg-black/20 rounded-lg">
                <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                <p className="text-lg mt-2">Your score: <span className="font-bold text-brand-brown-700 dark:text-amber-400">{score} / {questions.length}</span></p>
                <div className="mt-6 flex justify-center items-center gap-4">
                    <button onClick={handleSaveResults} className="px-4 py-2 bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 font-bold rounded-lg btn-ripple text-sm">Save Results to Notes</button>
                    <button onClick={handleRestart} className="px-6 py-2 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple">Try a New Quiz</button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl p-6 bg-glass-300 dark:bg-black/20 rounded-lg border border-glass-border dark:border-glass-border-dark">
            <p className="text-sm text-stone-500 dark:text-stone-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <h3 className="text-lg font-bold mt-2 mb-4">{currentQuestion.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => {
                    const isCorrect = option === currentQuestion.correctAnswer;
                    const isSelected = option === selectedAnswer;
                    let buttonClass = 'bg-glass-100 hover:bg-glass-100/50 dark:bg-stone-900/20 dark:hover:bg-stone-900/40';
                    if (isAnswered) {
                        if (isCorrect) {
                            buttonClass = 'bg-green-500/50 text-white';
                        } else if (isSelected) {
                            buttonClass = 'bg-red-500/50 text-white';
                        }
                    }

                    return (
                        <button 
                            key={index} 
                            onClick={() => handleAnswerSelect(option)}
                            disabled={isAnswered}
                            className={`p-3 rounded-md text-left transition-colors disabled:cursor-not-allowed ${buttonClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {isAnswered && (
                <div className="text-right mt-4">
                    <button onClick={handleNextQuestion} className="px-6 py-2 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple">
                        {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizMode;