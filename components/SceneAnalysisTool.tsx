import React, { useState, useMemo } from 'react';
import { CSP, Film } from '../types';
import { ai } from '../utils/gemini';

interface SceneAnalysisToolProps {
  item: CSP | Film | null;
  onAddNote: (title: string, content: string) => void;
}

const getAnalysisConfig = (item: CSP | Film) => {
    const defaultConfig = {
        sectionTitle: "The Scene",
        placeholderText: "Click below to generate a key scene from the film to analyze.",
        generateButtonText: "Generate Scene",
        prompt: `Describe a single, iconic, and highly analyzable key scene from the film "${item.title}" (${'director' in item ? item.director : ''}, ${item.year}). The description should be vivid and detailed, focusing on the specific visual and auditory elements. Be about 150-200 words long. Do not analyze the scene, just describe it objectively.`
    };

    if (!('category' in item)) { // It's a Film
        return defaultConfig;
    }

    const category = item.category;

    switch (category) {
        case 'Print Advertisement':
            return {
                sectionTitle: "The Advertisement",
                placeholderText: "Click below to get a description of the ad to analyze.",
                generateButtonText: "Describe Ad",
                prompt: `Describe the visual composition and key elements of the print advertisement for "${item.title}" (${item.year}). The description should be vivid and detailed, focusing on the layout, imagery, text, and overall design. Be about 150-200 words long. Do not analyze the ad, just describe it objectively.`
            };
        case 'Newspaper':
        case 'Magazine':
            return {
                sectionTitle: "The Front Cover",
                placeholderText: "Click below to get a description of a typical cover to analyze.",
                generateButtonText: "Describe Cover",
                prompt: `Describe a typical front cover of the publication "${item.title}". The description should be vivid and detailed, focusing on the masthead, main image, headlines, and overall layout. Be about 150-200 words long. Do not analyze the cover, just describe it objectively.`
            };
        case 'Mobile Game':
        case 'Video Game':
             return {
                sectionTitle: "The Gameplay Sequence",
                placeholderText: "Click below to generate a gameplay sequence to analyze.",
                generateButtonText: "Generate Sequence",
                prompt: `Describe a typical or iconic gameplay sequence from the video game "${item.title}" (${item.year}). The description should be vivid and detailed, focusing on the player's objective, the environment, character actions, and the user interface. Be about 150-200 words long. Do not analyze the gameplay, just describe it objectively.`
            };
        case 'Radio Drama':
            return {
                sectionTitle: "The Audio Scene",
                placeholderText: "Click below to generate a key audio scene to analyze.",
                generateButtonText: "Generate Scene",
                prompt: `Describe a key scene from the radio drama "${item.title}" (${item.year}). The description should be vivid and detailed, focusing on the dialogue, sound effects, music, and overall auditory atmosphere. Be about 150-200 words long. Do not analyze the scene, just describe it objectively.`
            };
        case 'Online Media Case Study':
             return {
                sectionTitle: "The Case Study Aspect",
                placeholderText: "Click below to generate a key aspect of this case study to analyze.",
                generateButtonText: "Generate Aspect",
                prompt: `Describe a key aspect of the online case study for "${item.title}". This could be a specific social media post, a marketing strategy, or a key event. The description should be vivid and detailed. Be about 150-200 words long. Do not analyze it, just describe it objectively.`
            };
        default: // for Film, TV Drama, Music Video etc.
            return defaultConfig;
    }
};

interface AnalysisInputProps {
    label: string;
    icon: string;
    value: string;
    onChange: (value: string) => void;
}

const AnalysisInput: React.FC<AnalysisInputProps> = ({ label, icon, value, onChange }) => (
    <div>
      <label className="flex items-center space-x-2 text-sm font-bold text-stone-700 dark:text-beige-200 mb-1">
        <span>{icon}</span>
        <span className="capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder={`Analyze the ${label.toLowerCase().replace(/([A-Z])/g, ' $1').trim()}...`}
        className="w-full p-2 border border-glass-border dark:border-glass-border-dark rounded-md bg-glass-300 text-stone-800 dark:text-beige-100 text-sm focus:ring-2 focus:ring-brand-brown-700 focus:border-transparent"
      />
    </div>
  );


const SceneAnalysisTool: React.FC<SceneAnalysisToolProps> = ({ item, onAddNote }) => {
  const [sceneDescription, setSceneDescription] = useState('');
  const [analysis, setAnalysis] = useState({
    miseEnScene: '',
    cinematography: '',
    editing: '',
    sound: '',
  });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState({ scene: false, feedback: false });
  const [isSaved, setIsSaved] = useState(false);

  const config = useMemo(() => item ? getAnalysisConfig(item) : null, [item]);

  const handleAnalysisChange = (field: keyof typeof analysis, value: string) => {
    setAnalysis(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateScene = async () => {
    if (!config) return;
    setLoading({ ...loading, scene: true });
    setSceneDescription('');
    setFeedback('');
    setIsSaved(false);

    try {
      const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: config.prompt });
      setSceneDescription(result.text);
    } catch (error) {
      console.error(error);
      setSceneDescription('Error generating description. Please try again.');
    } finally {
      setLoading({ ...loading, scene: false });
    }
  };

  const handleGetFeedback = async () => {
    if (!item || !sceneDescription || Object.values(analysis).every(a => a === '')) return;
    setLoading({ ...loading, feedback: true });
    setFeedback('');
    setIsSaved(false);

    const prompt = `
      You are an expert A-Level Media and Film Studies examiner providing feedback on a student's analysis.
      The media text is "${item.title}".
      The specific part being analyzed is: "${sceneDescription}"
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
  
  const handleSaveToNotes = () => {
    if (!item || !feedback) return;

    const noteTitle = `Analysis: ${item.title}`;
    const noteContent = `
# Analysis for ${item.title}

## ${config?.sectionTitle || 'Scene Description'}
${sceneDescription}

---

## My Analysis
**Mise-en-scène:**
${analysis.miseEnScene || 'N/A'}

**Cinematography:**
${analysis.cinematography || 'N/A'}

**Editing:**
${analysis.editing || 'N/A'}

**Sound:**
${analysis.sound || 'N/A'}

---

## AI Feedback
${feedback.replace(/\*\*(.*?)\*\*/g, '### $1')}
    `;
    onAddNote(noteTitle, noteContent.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!item || !config) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-4xl font-black uppercase text-glow">Error</h1>
        <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">No film or CSP was selected. Please go back and try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black uppercase text-glow">Interactive Analysis</h1>
        <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">For: <span className="font-bold">{item.title}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Scene & Feedback */}
        <div className="space-y-6">
          <div className="liquid-glass p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 text-stone-800 dark:text-beige-100">{config.sectionTitle}</h2>
            {!sceneDescription && !loading.scene && (
              <div className="text-center py-12">
                <p className="mb-4 text-stone-600 dark:text-stone-300">{config.placeholderText}</p>
                <button onClick={handleGenerateScene} className="px-6 py-2 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple">{config.generateButtonText}</button>
              </div>
            )}
            {loading.scene && <p className="text-stone-600 dark:text-stone-300">Generating description...</p>}
            {sceneDescription && <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">{sceneDescription}</p>}
          </div>

          <div className="liquid-glass p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4 text-stone-800 dark:text-beige-100">Or Find Your Own</h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">
                Click the button below to open YouTube in a new tab. You can then search for any clip you'd like to analyze.
              </p>
              <a 
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block text-center px-6 py-3 bg-red-600 text-white font-bold rounded-lg btn-ripple transition-colors hover:bg-red-700"
              >
                  Open YouTube
              </a>
          </div>

          <div className="liquid-glass p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-stone-800 dark:text-beige-100">AI Feedback</h2>
                {feedback && (
                     <button onClick={handleSaveToNotes} className="px-3 py-1 bg-green-500/20 text-green-800 dark:text-green-300 text-xs font-bold rounded-md transition-colors hover:bg-green-500/30">
                        {isSaved ? 'Saved!' : 'Save to Notes'}
                    </button>
                )}
            </div>
            {loading.feedback && <p className="text-stone-600 dark:text-stone-300">Generating feedback...</p>}
            {feedback && <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: feedback.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />}
            {!feedback && !loading.feedback && <p className="text-sm text-stone-500">Your feedback from Phoebe will appear here after you submit your analysis.</p>}
          </div>
        </div>

        {/* Right Column: User Analysis */}
        <div className="liquid-glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 text-stone-800 dark:text-beige-100">Your Analysis</h2>
          <div className="space-y-4">
            <AnalysisInput label="miseEnScene" icon="🎭" value={analysis.miseEnScene} onChange={(val) => handleAnalysisChange('miseEnScene', val)} />
            <AnalysisInput label="cinematography" icon="🎥" value={analysis.cinematography} onChange={(val) => handleAnalysisChange('cinematography', val)} />
            <AnalysisInput label="editing" icon="✂️" value={analysis.editing} onChange={(val) => handleAnalysisChange('editing', val)} />
            <AnalysisInput label="sound" icon="🔊" value={analysis.sound} onChange={(val) => handleAnalysisChange('sound', val)} />
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