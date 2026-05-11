import React, { useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import usePlayerStore from '../store/usePlayerStore';

export default function AudioPlayer() {
  const { 
    isPlaying, 
    volume, 
    getCurrentTrack, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    setVolume,
    setProgress 
  } = usePlayerStore();
  
  const currentTrack = getCurrentTrack();
  const soundRef = useRef(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Manage Howl instance when track changes
  useEffect(() => {
    if (!currentTrack) return;

    if (soundRef.current) {
      soundRef.current.unload();
    }

    soundRef.current = new Howl({
      src: [currentTrack.audio],
      html5: true, // Force HTML5 Audio to allow streaming and avoid CORS issues
      volume: volume,
      onplay: () => {
        setDuration(soundRef.current.duration());
      },
      onend: () => {
        nextTrack();
      }
    });

    if (isPlaying) {
      soundRef.current.play();
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [currentTrack]);

  // Manage play/pause state
  useEffect(() => {
    if (soundRef.current) {
      if (isPlaying) {
        if (!soundRef.current.playing()) {
          soundRef.current.play();
        }
      } else {
        soundRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Manage volume
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  // Update progress bar
  useEffect(() => {
    let interval;
    if (isPlaying && soundRef.current) {
      interval = setInterval(() => {
        const seek = soundRef.current.seek();
        setLocalProgress(seek);
        setProgress(seek);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setProgress]);

  if (!currentTrack) return null;

  function formatTime(secs) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = Math.floor(secs - minutes * 60) || 0;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function handleSeek(e) {
    const newTime = parseFloat(e.target.value);
    setLocalProgress(newTime);
    if (soundRef.current) {
      soundRef.current.seek(newTime);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 glass px-6 py-4 flex flex-col md:flex-row items-center justify-between z-50 transition-all duration-300">
      
      {/* Track Info */}
      <div className="flex items-center space-x-4 w-full md:w-1/3 mb-4 md:mb-0">
        <img 
          src={currentTrack.image} 
          alt={currentTrack.name} 
          className="w-14 h-14 rounded-md object-cover shadow-lg"
        />
        <div className="overflow-hidden">
          <h3 className="text-white font-medium truncate">{currentTrack.name}</h3>
          <p className="text-gray-400 text-sm truncate">{currentTrack.artist_name}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center w-full md:w-1/3">
        <div className="flex items-center space-x-6 mb-2">
          <button onClick={prevTrack} className="text-gray-400 hover:text-white transition">
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-12 h-12 flex items-center justify-center bg-primary hover:bg-blue-600 rounded-full text-white transition transform hover:scale-105 shadow-lg"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button onClick={nextTrack} className="text-gray-400 hover:text-white transition">
            <SkipForward size={24} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center w-full max-w-md space-x-3 text-xs text-gray-400">
          <span>{formatTime(localProgress)}</span>
          <input 
            type="range" 
            min={0} 
            max={duration || currentTrack.duration || 100} 
            value={localProgress}
            onChange={handleSeek}
            className="flex-grow h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span>{formatTime(duration || currentTrack.duration || 0)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="hidden md:flex items-center justify-end w-1/3 space-x-3 text-gray-400">
        <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="hover:text-white transition">
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input 
          type="range" 
          min={0} 
          max={1} 
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  );
};


