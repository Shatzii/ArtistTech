import { useState, useCallback, useRef } from 'react';
import { apiRequest } from "@/lib/queryClient";

interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  bpm?: number;
  key?: string;
  waveform?: number[];
  buffer?: AudioBuffer;
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
  isRecording: boolean;
  masterEffects: {
    reverb: number;
    delay: number;
    compressor: number;
    limiter: number;
  };
}

interface UseAudioEngineReturn extends AudioEngineState {
  play: () => void;
  pause: () => void;
  stop: () => void;
  record: () => void;
  stopRecording: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setBPM: (bpm: number) => void;
  setMasterEffect: (effect: string, value: number) => void;
  loadTrack: (track: AudioTrack) => Promise<void>;
  uploadAudio: (file: File) => Promise<AudioTrack>;
  analyzeAudio: (trackId: string) => Promise<any>;
  mixTracks: (tracks: AudioTrack[], effects: any) => Promise<AudioBuffer>;
  exportProject: (format: 'wav' | 'mp3') => Promise<Blob>;
  getSpectrum: () => Uint8Array;
  getWaveform: (trackId: string) => Promise<number[]>;
}

export function useAudioEngine(): UseAudioEngineReturn {
  const [state, setState] = useState<AudioEngineState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    bpm: 120,
    tracks: [],
    activeTrack: null,
    isLoading: false,
    isRecording: false,
    masterEffects: {
      reverb: 0,
      delay: 0,
      compressor: 0,
      limiter: 0
    }
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const effectsRef = useRef<{
    reverb: ConvolverNode;
    delay: DelayNode;
    compressor: DynamicsCompressorNode;
    limiter: DynamicsCompressorNode;
  } | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      gainRef.current = audioContextRef.current.createGain();
      
      // Initialize effects
      effectsRef.current = {
        reverb: audioContextRef.current.createConvolver(),
        delay: audioContextRef.current.createDelay(1.0),
        compressor: audioContextRef.current.createDynamicsCompressor(),
        limiter: audioContextRef.current.createDynamicsCompressor()
      };
    }
  }, []);

  const play = useCallback(() => {
    initializeAudioContext();
    setState(prev => ({ ...prev, isPlaying: true }));
  }, [initializeAudioContext]);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
  }, []);

  const seekTo = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
    setState(prev => ({ ...prev, volume }));
  }, []);

  const setBPM = useCallback((bpm: number) => {
    setState(prev => ({ ...prev, bpm }));
  }, []);

  const loadTrack = useCallback(async (track: AudioTrack) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      initializeAudioContext();
      const response = await fetch(track.url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
      
      const updatedTrack = { ...track, buffer: audioBuffer, duration: audioBuffer.duration };
      setState(prev => ({ 
        ...prev, 
        activeTrack: updatedTrack, 
        duration: audioBuffer.duration,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error loading track:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [initializeAudioContext]);

  const uploadAudio = useCallback(async (file: File): Promise<AudioTrack> => {
    const formData = new FormData();
    formData.append('audio', file);
    
    const response = await apiRequest('POST', '/api/audio/upload', formData);
    const data = await response.json();
    
    const newTrack: AudioTrack = {
      id: data.id,
      name: file.name,
      url: data.url,
      duration: data.duration,
      bpm: data.bpm,
      key: data.key
    };
    
    setState(prev => ({ 
      ...prev, 
      tracks: [...prev.tracks, newTrack] 
    }));
    
    return newTrack;
  }, []);

  const getSpectrum = useCallback((): Uint8Array => {
    if (!analyserRef.current) return new Uint8Array(0);
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    return dataArray;
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