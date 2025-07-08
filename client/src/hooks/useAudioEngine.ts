import { useState, useEffect, useRef, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  bpm?: number;
  key?: string;
  waveform?: number[];
}

interface AudioEngineState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  bpm: number;
  tracks: AudioTrack[];
  activeTrack: AudioTrack | null;
  isLoading: boolean;
}

interface UseAudioEngineReturn extends AudioEngineState {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setBPM: (bpm: number) => void;
  loadTrack: (track: AudioTrack) => Promise<void>;
  uploadAudio: (file: File) => Promise<AudioTrack>;
  analyzeAudio: (trackId: string) => Promise<any>;
}

export function useAudioEngine(): UseAudioEngineReturn {
  const [state, setState] = useState<AudioEngineState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 75,
    bpm: 120,
    tracks: [],
    activeTrack: null,
    isLoading: false
  });

  const audioContextRef = useRef<AudioContext>();
  const audioBufferRef = useRef<AudioBuffer>();
  const sourceNodeRef = useRef<AudioBufferSourceNode>();
  const gainNodeRef = useRef<GainNode>();
  const analyserRef = useRef<AnalyserNode>();
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        gainNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        console.log('Audio engine initialized');
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update current time during playback
  useEffect(() => {
    let animationFrame: number;
    
    if (state.isPlaying && audioContextRef.current) {
      const updateTime = () => {
        const currentTime = audioContextRef.current!.currentTime - startTimeRef.current + pauseTimeRef.current;
        setState(prev => ({ ...prev, currentTime }));
        animationFrame = requestAnimationFrame(updateTime);
      };
      updateTime();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [state.isPlaying]);

  const loadTrack = useCallback(async (track: AudioTrack) => {
    if (!audioContextRef.current) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(track.url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      audioBufferRef.current = audioBuffer;
      setState(prev => ({
        ...prev,
        activeTrack: track,
        duration: audioBuffer.duration,
        currentTime: 0,
        isLoading: false,
        isPlaying: false
      }));

      pauseTimeRef.current = 0;
    } catch (error) {
      console.error('Failed to load track:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const play = useCallback(() => {
    if (!audioContextRef.current || !audioBufferRef.current || !gainNodeRef.current) return;

    // Stop current playback if any
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }

    // Create new source node
    sourceNodeRef.current = audioContextRef.current.createBufferSource();
    sourceNodeRef.current.buffer = audioBufferRef.current;
    sourceNodeRef.current.connect(gainNodeRef.current);

    // Start playback from current position
    startTimeRef.current = audioContextRef.current.currentTime - pauseTimeRef.current;
    sourceNodeRef.current.start(0, pauseTimeRef.current);

    setState(prev => ({ ...prev, isPlaying: true }));

    // Handle track end
    sourceNodeRef.current.onended = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };
  }, []);

  const pause = useCallback(() => {
    if (sourceNodeRef.current && audioContextRef.current) {
      sourceNodeRef.current.stop();
      pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const stop = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }
    pauseTimeRef.current = 0;
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0
    }));
  }, []);

  const seekTo = useCallback((time: number) => {
    pauseTimeRef.current = Math.max(0, Math.min(time, state.duration));
    
    if (state.isPlaying) {
      pause();
      setTimeout(play, 10); // Small delay to ensure clean restart
    }
    
    setState(prev => ({ ...prev, currentTime: pauseTimeRef.current }));
  }, [state.duration, state.isPlaying, pause, play]);

  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      const normalizedVolume = Math.max(0, Math.min(100, volume)) / 100;
      gainNodeRef.current.gain.value = normalizedVolume;
      setState(prev => ({ ...prev, volume }));
    }
  }, []);

  const setBPM = useCallback((bpm: number) => {
    setState(prev => ({ ...prev, bpm }));
  }, []);

  const uploadAudio = useCallback(async (file: File): Promise<AudioTrack> => {
    const formData = new FormData();
    formData.append('audio', file);

    const response = await apiRequest('POST', '/api/audio/upload', formData);
    const audioFile = await response.json();

    const newTrack: AudioTrack = {
      id: audioFile.id,
      name: audioFile.filename,
      url: `/uploads/${audioFile.filename}`,
      duration: audioFile.duration || 0,
      bpm: audioFile.bpm,
      key: audioFile.key
    };

    setState(prev => ({
      ...prev,
      tracks: [...prev.tracks, newTrack]
    }));

    return newTrack;
  }, []);

  const analyzeAudio = useCallback(async (trackId: string) => {
    try {
      const response = await apiRequest('POST', '/api/audio/analyze', { trackId });
      return await response.json();
    } catch (error) {
      console.error('Audio analysis failed:', error);
      throw error;
    }
  }, []);

  return {
    ...state,
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    setBPM,
    loadTrack,
    uploadAudio,
    analyzeAudio
  };
}