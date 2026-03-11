import { useEffect, useState } from 'react';

export default function SoundLoader({ tracks, getAudioContext, onSoundsLoaded, onError }) {
  const [loadingStatus, setLoadingStatus] = useState({});

  useEffect(() => {
    const loadSounds = async () => {
      const ctx = getAudioContext();
      const loadedSounds = {};
      const loadedTrackIds = [];

      for (const track of tracks) {
        try {
          setLoadingStatus((prev) => ({ ...prev, [track.id]: 'loading' }));          

          const response = await fetch(track.sound);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
          }

          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

          loadedSounds[track.id] = audioBuffer;
          loadedTrackIds.push(track.id);
          setLoadingStatus((prev) => ({ ...prev, [track.id]: 'loaded' }));          
        } catch (error) {
          console.error(`Error Loading ${track.name}:`, error);
          setLoadingStatus((prev) => ({ ...prev, [track.id]: 'error' }));
          onError(`Failed to load sound for ${track.name}. Check file: ${track.sound}`);
        }
      }

      onSoundsLoaded(loadedSounds, loadedTrackIds);
    };

    loadSounds();

    return () => {
      const ctx = getAudioContext();
      if (ctx && ctx.state !== 'closed') {
        ctx.close();
      }
    };
  }, [tracks, getAudioContext, onSoundsLoaded, onError]);

  return null;
}
