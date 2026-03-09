import React, { useState, useCallback, useRef, useEffect } from 'react';
import Track from './Track';
// import TransportControls from './TransportControls';
// import BpmControl from './BpmControl';
// import StatusIndicator from './StatusIndicator';
// import SoundLoader from './SoundLoader';

export default function DrumMachine() {
  const tracks = [
    { id: 'bass', name: 'BASS', sound: '/sounds/bass.mp3', color: '#3e3939' },
    { id: 'snare', name: 'SNARE', sound: '/sounds/snare.mp3', color: '#605c54' },
    { id: 'ride', name: 'RIDE', sound: '/sounds/ride.mp3', color: '#3b554d' },
    { id: 'tom', name: 'TOM', sound: '/sounds/tom1.mp3', color: '#403d6b' },
    { id: 'crash', name: 'CRASH', sound: '/sounds/crash.mp3', color: '#643838' },
  ];

  const NUM_STEPS = 8;

  const [steps, setSteps] = useState(tracks.map(() => Array(NUM_STEPS).fill(false)));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [sounds, setSounds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedTracks, setLoadedTracks] = useState([]);

  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const handleSoundsLoaded = (loadedSounds, loadedTrackIds) => {
    setSounds(loadedSounds);
    setLoadedTracks(loadedTrackIds);
    setIsLoading(false);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const playSound = useCallback(
    (trackId) => {
      const buffer = sounds[trackId];
      if (!buffer) return;

      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      try {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.7;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start();
      } catch (error) {
        console.error('Error', error);
      }
    },
    [sounds, getAudioContext],
  );

  const playStep = useCallback(
    (stepIndex) => {
      tracks.forEach((track, trackIndex) => {
        if (steps[trackIndex][stepIndex]) {
          playSound(track.id);
        }
      });
    },
    [steps, playSound, tracks],
  );

  const nextStep = useCallback(() => {
    if (!isPlaying) return;
    playStep(currentStep);
    setCurrentStep((prev) => (prev + 1) % NUM_STEPS);
  }, [isPlaying, currentStep, playStep]);

  useEffect(() => {
    if (isPlaying && !isLoading && !error && Object.keys(sounds).length > 0) {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const intervalMs = 60000 / bpm / 2; // для 8-х нот
      intervalRef.current = setInterval(() => nextStep(), intervalMs);
      setCurrentStep(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, bpm, nextStep, getAudioContext, isLoading, error, sounds]);

  const toggleStep = (trackIndex, stepIndex) => {
    setSteps((prev) => {
      const newSteps = [...prev];
      newSteps[trackIndex] = [...newSteps[trackIndex]];
      newSteps[trackIndex][stepIndex] = !newSteps[trackIndex][stepIndex];
      return newSteps;
    });
  };

  const handlePlay = () => setIsPlaying(true);
  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };
  const handleClear = () => {
    setSteps(tracks.map(() => Array(NUM_STEPS).fill(false)));
  };

  const testSound = (trackId) => playSound(trackId);

  return (
    <div className="drum-machine">
      <SoundLoader>
        tracks={tracks}
        getAudioContext={getAudioContext}
        onSoundsLoaded={handleSoundsLoaded}
        onError={handleError}
      </SoundLoader>

      <StatusIndicator>
        isLoading={isLoading}
        error={error}
        sounds={sounds}
        loadedTracks={loadedTracks}
        bpm={bpm}
        numSteps={NUM_STEPS}
      </StatusIndicator>

      <div className="controls-panel">
        <TransportControls>
          isPlaying={isPlaying}
          isLoading={isLoading}
          hasError={!!error}
          hasSounds={Object.keys(sounds).length > 0}
          onPlay={handlePlay}
          onStop={handleStop}
          onClear={handleClear}
        </TransportControls>

        <BpmControl>
          bpm={bpm}
          onChange={setBpm}
          disabled={isLoading}
        </BpmControl>
      </div>

      <div className="step-sequencer">
        {tracks.map((track, index) => (
          <Track>
            key={track.id}
            track={track}
            steps={steps[index]}
            isPlaying={isPlaying}
            currentStep={currentStep}
            trackIndex={index}
            onToggleStep={toggleStep}
            onTestSound={() => testSound(track.id)}
            disabled={isLoading || !!error || !sounds[track.id]}
            isSoundLoaded={!!sounds[track.id]}
          </Track>
        ))}
      </div>
    </div>
  );
}
