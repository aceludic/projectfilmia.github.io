import React, { useState } from 'react';
import { CSP, Film } from '../types';
import { ai } from '../utils/gemini';

interface SceneAnalysisToolProps {
  item: CSP | Film | null;
}

const SceneAnalysisTool: React.FC<SceneAnalysisToolProps> = ({ item }) => {
  const [sceneDescription, setSceneDescription] = useState('');
  const [analysis, setAnalysis] = useState({
    miseEnScene: '',
    cinematography: '',
    editing: '',
    sound: '',
  });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState({ scene: false, feedback: false });

  const handleGenerateScene = async () => {
    if (!item) return;
    setLoading({ ...loading, scene: true });
    setSceneDescription('');
    setFeedback('');

    const prompt = `Describe a single, iconic, and highly analyzable key scene from the film "${item.title}" (${'director' in item ? item.director : ''}, ${item.year}). The description should be vivid and detailed, focusing on the specific visual and auditory elements. Be about 150-200 words long. Do not analyze the scene, just describe it objectively.`;

    try {
      const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      setSceneDescription(result.text);
    } catch (error) {
      console.error(error);
      setSceneDescription('Error generating scene description. Please try again.');
    } finally {
      setLoading({ ...loading, scene: false });
    }
  };

  const handleGetFeedback = async () => {
    if (!item || !sceneDescription || Object.values(analysis).every(a => a === '')) return;
    setLoading({ ...loading, feedback: true });
    setFeedback('');

    const prompt = `
      You are an expert A-Level Media and Film Studies examiner providing feedback on a student's analysis.
      The film is "${item.title}".
      The scene being analyzed is: "${sceneDescription}"
      Here is the student's analysis:
      - Mise-en-scène: "${analysis.miseEnScene}"
      - Cinematography: "${analysis.cinematography}"
      - Editing: "${analysis.editing}"
      - Sound: "${analysis.sound}"

      Provide constructive, specific feedback in an encouraging tone. Structure your feedback with the following markdown headings: **What's Good**, **Areas for Improvement**, and **Next Steps**.
    `;

    try {
      const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      setFeedback(result.text);
    } catch (error) {
      console.error(error);
      setFeedback('Error generating feedback. Please try again.');
    } finally {
      setLoading({ ...loading, feedback: false });
    }
  };

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-4xl font-black uppercase text-glow">Error</h1>
        <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">No film or CSP was selected. Please go back and try again.</p>
      </div>
    );
  }

  const AnalysisInput: React.FC<{ label: keyof typeof analysis; icon: string }> = ({ label, icon }) => (
    <div>
      <label className="flex items-center space-x-2 text-sm font-bold text-stone-700 dark:text-beige-200 mb-1">
        <span>{icon}</span>
        <span className="capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</span>
      </label>
      <textarea
        value={analysis[label]}
        onChange={(e) => setAnalysis(prev => ({ ...prev, [label]: e.target.value }))}
        rows={5}
        placeholder={`Analyze the ${label.toLowerCase()} in this scene...`}
        className="w-full p-2 border border-glass-border dark:border-glass-border-dark rounded-md bg-glass-300 text-stone-800 dark:text-beige-100 text-sm"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black uppercase text-glow">Interactive Scene Analysis</h1>
        <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">For: <span className="font-bold">{item.title}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Scene & Feedback */}
        <div className="space-y-6">
          <div className="bg-glass-200 dark:bg-black/20 p-6 rounded-2xl border border-glass-border">
            <h2 className="text-xl font-bold mb-4">The Scene</h2>
            {!sceneDescription && !loading.scene && (
              <div className="text-center py-12">
                <p className="mb-4">Click below to generate a key scene from the film to analyze.</p>
                <button onClick={handleGenerateScene} className="px-6 py-2 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple">Generate Scene</button>
              </div>
            )}
            {loading.scene && <p>Generating scene...</p>}
            {sceneDescription && <p className="text-sm leading-relaxed">{sceneDescription}</p>}
          </div>
          <div className="bg-glass-200 dark:bg-black/20 p-6 rounded-2xl border border-glass-border">
            <h2 className="text-xl font-bold mb-4">AI Feedback</h2>
            {loading.feedback && <p>Generating feedback...</p>}
            {feedback && <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: feedback.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />}
            {!feedback && !loading.feedback && <p className="text-sm text-stone-500">Your feedback from Phoebe will appear here after you submit your analysis.</p>}
          </div>
        </div>

        {/* Right Column: User Analysis */}
        <div className="bg-glass-200 dark:bg-black/20 p-6 rounded-2xl border border-glass-border">
          <h2 className="text-xl font-bold mb-4">Your Analysis</h2>
          <div className="space-y-4">
            <AnalysisInput label="miseEnScene" icon="🎭" />
            <AnalysisInput label="cinematography" icon="🎥" />
            <AnalysisInput label="editing" icon="✂️" />
            <AnalysisInput label="sound" icon="🔊" />
            <button onClick={handleGetFeedback} disabled={loading.feedback || !sceneDescription} className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg btn-ripple disabled:bg-stone-400">
              {loading.feedback ? 'Getting Feedback...' : 'Get AI Feedback'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneAnalysisTool;