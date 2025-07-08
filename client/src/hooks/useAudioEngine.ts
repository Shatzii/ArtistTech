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

  const record = useCallback(async () => {
    try {
      initializeAudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setState(prev => ({ ...prev, isRecording: true }));
      // Recording implementation would go here
    } catch (error) {
      console.error('Recording failed:', error);
    }
  }, [initializeAudioContext]);

  const stopRecording = useCallback(() => {
    setState(prev => ({ ...prev, isRecording: false }));
  }, []);

  const setMasterEffect = useCallback((effect: string, value: number) => {
    if (effectsRef.current) {
      const effects = effectsRef.current as any;
      if (effects[effect]) {
        // Apply effect parameters based on type
        switch (effect) {
          case 'reverb':
            // Reverb implementation
            break;
          case 'delay':
            if (effects.delay instanceof DelayNode) {
              effects.delay.delayTime.value = value / 100;
            }
            break;
          case 'compressor':
            if (effects.compressor instanceof DynamicsCompressorNode) {
              effects.compressor.threshold.value = -24 + (value / 100) * 24;
              effects.compressor.ratio.value = 12;
            }
            break;
        }
      }
    }
    setState(prev => ({
      ...prev,
      masterEffects: { ...prev.masterEffects, [effect]: value }
    }));
  }, []);

  const mixTracks = useCallback(async (tracks: AudioTrack[], effects: any): Promise<AudioBuffer> => {
    initializeAudioContext();
    const context = audioContextRef.current!;
    
    // Create offline context for mixing
    const offlineContext = new OfflineAudioContext(2, 44100 * 10, 44100);
    
    // Mix tracks logic would go here
    const renderedBuffer = await offlineContext.startRendering();
    return renderedBuffer;
  }, [initializeAudioContext]);

  const exportProject = useCallback(async (format: 'wav' | 'mp3'): Promise<Blob> => {
    if (!state.activeTrack?.buffer) {
      throw new Error('No active track to export');
    }
    
    // Export logic - for now return a placeholder
    const buffer = state.activeTrack.buffer;
    const arrayBuffer = new ArrayBuffer(buffer.length * 4);
    const view = new Float32Array(arrayBuffer);
    
    // Copy audio data
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < channelData.length; i++) {
      view[i] = channelData[i];
    }
    
    return new Blob([arrayBuffer], { type: format === 'wav' ? 'audio/wav' : 'audio/mpeg' });
  }, [state.activeTrack]);

  const getWaveform = useCallback(async (trackId: string): Promise<number[]> => {
    const track = state.tracks.find(t => t.id === trackId);
    if (!track?.buffer) return [];
    
    const channelData = track.buffer.getChannelData(0);
    const samples = 1000; // Number of waveform points
    const blockSize = Math.floor(channelData.length / samples);
    const waveform = [];
    
    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[i * blockSize + j]);
      }
      waveform.push(sum / blockSize);
    }
    
    return waveform;
  }, [state.tracks]);

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
    record,
    stopRecording,
    seekTo,
    setVolume,
    setBPM,
    setMasterEffect,
    loadTrack,
    uploadAudio,
    analyzeAudio,
    mixTracks,
    exportProject,
    getSpectrum,
    getWaveform
  };
}