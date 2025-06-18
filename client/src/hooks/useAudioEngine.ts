import { useState, useRef, useCallback, useEffect } from "react";

export interface AudioEngineType {
  isPlaying: boolean;
  currentTime: number;
  bpm: number;
  isRecording: boolean;
  masterVolume: number;
  initialize: () => Promise<void>;
  cleanup: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  rewind: () => void;
  fastForward: () => void;
  record: () => void;
  setMasterVolume: (volume: number) => void;
  setBPM: (bpm: number) => void;
  loadAudioFile: (fileId: number) => Promise<AudioBuffer | null>;
}

export function useAudioEngine(): AudioEngineType {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [bpm, setBPMState] = useState(120);
  const [isRecording, setIsRecording] = useState(false);
  const [masterVolume, setMasterVolumeState] = useState(1);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainNodeRef = useRef<GainNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  const initialize = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create master gain node
        masterGainNodeRef.current = audioContextRef.current.createGain();
        masterGainNodeRef.current.connect(audioContextRef.current.destination);
        masterGainNodeRef.current.gain.value = masterVolume;
      }

      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    } catch (error) {
      console.error("Failed to initialize audio engine:", error);
    }
  }, [masterVolume]);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    
    audioContextRef.current = null;
    masterGainNodeRef.current = null;
  }, []);

  const updateCurrentTime = useCallback(() => {
    if (isPlaying && audioContextRef.current) {
      const elapsed = audioContextRef.current.currentTime - startTimeRef.current + pauseTimeRef.current;
      setCurrentTime(elapsed);
      animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
    }
  }, [isPlaying]);

  const play = useCallback(async () => {
    await initialize();
    
    if (audioContextRef.current) {
      if (isPlaying) return;
      
      startTimeRef.current = audioContextRef.current.currentTime;
      setIsPlaying(true);
      updateCurrentTime();
    }
  }, [initialize, isPlaying, updateCurrentTime]);

  const pause = useCallback(() => {
    if (!isPlaying) return;
    
    setIsPlaying(false);
    pauseTimeRef.current = currentTime;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isPlaying, currentTime]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    pauseTimeRef.current = 0;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const rewind = useCallback(() => {
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    pauseTimeRef.current = newTime;
  }, [currentTime]);

  const fastForward = useCallback(() => {
    const newTime = currentTime + 10;
    setCurrentTime(newTime);
    pauseTimeRef.current = newTime;
  }, [currentTime]);

  const record = useCallback(() => {
    setIsRecording(!isRecording);
    // TODO: Implement recording functionality
  }, [isRecording]);

  const setMasterVolume = useCallback((volume: number) => {
    setMasterVolumeState(volume);
    
    if (masterGainNodeRef.current) {
      masterGainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current?.currentTime || 0);
    }
  }, []);

  const setBPM = useCallback((newBpm: number) => {
    setBPMState(newBpm);
  }, []);

  const loadAudioFile = useCallback(async (fileId: number): Promise<AudioBuffer | null> => {
    if (!audioContextRef.current) {
      await initialize();
    }

    try {
      const response = await fetch(`/api/audio-files/${fileId}/stream`);
      const arrayBuffer = await response.arrayBuffer();
      
      if (audioContextRef.current) {
        return await audioContextRef.current.decodeAudioData(arrayBuffer);
      }
    } catch (error) {
      console.error("Failed to load audio file:", error);
    }
    
    return null;
  }, [initialize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isPlaying,
    currentTime,
    bpm,
    isRecording,
    masterVolume,
    initialize,
    cleanup,
    play,
    pause,
    stop,
    rewind,
    fastForward,
    record,
    setMasterVolume,
    setBPM,
    loadAudioFile,
  };
}
