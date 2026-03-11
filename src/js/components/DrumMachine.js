import { useState, useCallback, useRef, useEffect, memo } from 'react';
import Track from './Track';
import TransportControls from './TransportControls';
import BpmControl from './BpmControl';
import SoundLoader from './SoundLoader';

const DrumMachine = () => {
  const tracks = [
    { id: 'bass', name: 'BASS', sound: '../public/sounds/bass.mp3', color: '#3e3939' },
    { id: 'snare', name: 'SNARE', sound: '../public/sounds/snare.mp3', color: '#605c54' },
    { id: 'ride', name: 'RIDE', sound: '../public/sounds/ride.mp3', color: '#3b554d' },
    { id: 'tom', name: 'TOM', sound: '../public/sounds/tom1.mp3', color: '#403d6b' },
    // { id: 'crash', name: 'CRASH', sound: '../public/sounds/crash.mp3', color: '#643838' },
  ];
  
  const NUM_STEPS = 8;

  const [steps, setSteps] = useState(
    tracks.map(() => Array(NUM_STEPS).fill(false))
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [sounds, setSounds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedTracks, setLoadedTracks] = useState([]);

  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
  const currentStepRef = useRef(0);
  const isPlayingRef = useRef(false);
  const bpmRef = useRef(120);
  const stepsRef = useRef(steps);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const handleSoundsLoaded = (loadedSounds, loadedTrackIds) => {
    setSounds(loadedSounds || {});
    setLoadedTracks(loadedTrackIds || []);
    setIsLoading(false);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
    setLoadedTracks([]);
  };

  const playSound = useCallback((trackId) => {
    const buffer = sounds?.[trackId];
    if (!buffer) return;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

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
  }, [sounds, getAudioContext]);

  const playStep = useCallback((stepIndex) => {
    const currentSteps = stepsRef.current;
    
    tracks.forEach((track, trackIndex) => {
      if (currentSteps?.[trackIndex]?.[stepIndex]) {
        playSound(track.id);
      }
    });
  }, [playSound, tracks]);

  const sequencerTick = useCallback(() => {
    if (!isPlayingRef.current) return;
    
    const step = currentStepRef.current;
    playStep(step);
    
    const nextStepIndex = (step + 1) % NUM_STEPS;
    currentStepRef.current = nextStepIndex;
    setCurrentStep(nextStepIndex);
  }, [playStep, NUM_STEPS]);

  useEffect(() => {
    if (isPlaying && !isLoading && !error && Object.keys(sounds).length > 0) {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      if (intervalRef.current) clearInterval(intervalRef.current);
      
      const intervalMs = (60000 / bpm) / 2;
      intervalRef.current = setInterval(sequencerTick, intervalMs);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, bpm, isLoading, error, sounds, getAudioContext, sequencerTick]);

  const toggleStep = useCallback((trackIndex, stepIndex) => {
    setSteps(prevSteps => {
      const newSteps = prevSteps.map(track => [...track]);
      newSteps[trackIndex][stepIndex] = !newSteps[trackIndex][stepIndex];
      return newSteps;
    });
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    currentStepRef.current = 0;
  }, []);

  const handleClear = useCallback(() => {
    setSteps(tracks.map(() => Array(NUM_STEPS).fill(false)));
  }, [tracks]);

  const testSound = useCallback((trackId) => {
    playSound(trackId);
  }, [playSound]);

  const trackElements = tracks.map((track, index) => (
    <Track
      key={track.id}
      track={track}
      steps={steps[index] || []}
      isPlaying={isPlaying}
      currentStep={currentStep}
      trackIndex={index}
      onToggleStep={toggleStep}
      onTestSound={() => testSound(track.id)}
      disabled={isLoading || !!error || !sounds?.[track.id]}
      isSoundLoaded={!!sounds?.[track.id]}
    />
  ));

  return (
    <div className="drum-machine">

      <SoundLoader 
        tracks={tracks}
        getAudioContext={getAudioContext}
        onSoundsLoaded={handleSoundsLoaded}
        onError={handleError}
      />

      <div className="controls-panel">
        <TransportControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          hasError={!!error}
          hasSounds={Object.keys(sounds).length > 0}
          onPlay={handlePlay}
          onStop={handleStop}
          onClear={handleClear}
        />

        <BpmControl
          bpm={bpm}
          onChange={setBpm}
          disabled={isLoading}
        />
      </div>

      <div className="step-sequencer">
        {trackElements}
      </div>
    </div>
  );
};

export default DrumMachine;