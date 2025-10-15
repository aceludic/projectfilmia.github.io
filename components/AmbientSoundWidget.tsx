import React from 'react';
import { AmbientSound, AmbientSoundState } from '../types';

interface AmbientSoundWidgetProps {
    ambientSound: AmbientSoundState;
    setAmbientSound: (state: AmbientSoundState | ((prevState: AmbientSoundState) => AmbientSoundState)) => void;
}

const soundTracks: AmbientSound[] = [
  { id: 'lofi', name: 'Lofi Beats', url: 'https://cdn.pixabay.com/audio/2023/05/01/audio_18c3b1a823.mp3', icon: '🎧' },
  { id: 'rain', name: 'Gentle Rain', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c9769747a3.mp3', icon: '🌧️' },
  { id: 'fireplace', name: 'Crackling Fire', url: 'https://cdn.pixabay.com/audio/2024/01/22/audio_34f8287515.mp3', icon: '🔥' },
];

const AmbientSoundWidget: React.FC<AmbientSoundWidgetProps> = ({ ambientSound, setAmbientSound }) => {
  const handlePlayPause = (track: AmbientSound) => {
    setAmbientSound(prev => {
      const isCurrentlyPlayingThisTrack = prev.isPlaying && prev.track?.id === track.id;
      return {
        ...prev,
        isPlaying: !isCurrentlyPlayingThisTrack,
        track: track,
      };
    });
  };

  return (
    <div className="h-full flex flex-col justify-center p-2 space-y-2">
      {soundTracks.map(track => (
         <button 
            key={track.id} 
            onClick={() => handlePlayPause(track)}
            className={`w-full flex items-center justify-between p-3 rounded-md text-sm transition-colors ${
              ambientSound.isPlaying && ambientSound.track?.id === track.id ? 'bg-brand-brown-700/20 text-brand-brown-800 dark:text-amber-300' : 'bg-glass-100/50 hover:bg-glass-100'
            }`}
          >
            <span className="font-bold">{track.icon} {track.name}</span>
            <span className="font-mono text-lg">{ambientSound.isPlaying && ambientSound.track?.id === track.id ? '❚❚' : '▶'}</span>
          </button>
      ))}
      <div className="pt-2">
        <label htmlFor="volume-slider" className="sr-only">Volume</label>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={ambientSound.volume}
          onChange={(e) => setAmbientSound(prev => ({...prev, volume: parseFloat(e.target.value)}))}
          className="w-full h-1 bg-glass-100 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default AmbientSoundWidget;