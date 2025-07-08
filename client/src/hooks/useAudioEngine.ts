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
    volume: 75,
    bpm: 120,
    tracks: [],
    activeTrack: null,
    isLoading: false,
    isRecording: false,
    masterEffects: {
      reverb: 0,
      delay: 0,
      compressor: 0,
      limiter: 0,
    }
  });

  const audioContextRef = useRef<AudioContext>();
  const audioBufferRef = useRef<AudioBuffer>();
  const sourceNodeRef = useRef<AudioBufferSourceNode>();
  const gainNodeRef = useRef<GainNode>();
  const analyserNodeRef = useRef<AnalyserNode>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const recordedChunksRef = useRef<Blob[]>([]);
  const effectsChainRef = useRef<{
    reverb: ConvolverNode;
    delay: DelayNode;
    compressor: DynamicsCompressorNode;
    limiter: DynamicsCompressorNode;
  }>();
  const animationFrameRef = useRef<number>();

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create audio nodes
        gainNodeRef.current = audioContextRef.current.createGain();
        analyserNodeRef.current = audioContextRef.current.createAnalyser();
        
        // Create effects chain
        const reverb = audioContextRef.current.createConvolver();
        const delay = audioContextRef.current.createDelay();
        const compressor = audioContextRef.current.createDynamicsCompressor();
        const limiter = audioContextRef.current.createDynamicsCompressor();
        
        effectsChainRef.current = { reverb, delay, compressor, limiter };
        
        // Connect nodes
        gainNodeRef.current.connect(analyserNodeRef.current);
        analyserNodeRef.current.connect(audioContextRef.current.destination);
        
        // Configure analyser
        analyserNodeRef.current.fftSize = 2048;
        analyserNodeRef.current.smoothingTimeConstant = 0.8;
        
        // Start time tracking
        const updateTime = () => {
          if (state.isPlaying && audioContextRef.current) {
            setState(prev => ({
              ...prev,
              currentTime: audioContextRef.current!.currentTime
            }));
          }
          animationFrameRef.current = requestAnimationFrame(updateTime);
        };
        updateTime();
        
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    };
    
    initAudio();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play function
  const play = useCallback(() => {
    if (!audioContextRef.current || !audioBufferRef.current) return;
    
    try {
      // Resume audio context if suspended
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Create new source node
      sourceNodeRef.current = audioContextRef.current.createBufferSource();
      sourceNodeRef.current.buffer = audioBufferRef.current;
      sourceNodeRef.current.connect(gainNodeRef.current!);
      
      // Start playback
      sourceNodeRef.current.start();
      
      setState(prev => ({ ...prev, isPlaying: true }));
      
      // Handle playback end
      sourceNodeRef.current.onended = () => {
        setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      };
      
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, []);

  // Pause function
  const pause = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = undefined;
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  // Stop function
  const stop = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = undefined;
    }
    setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
  }, []);

  // Record function
  const record = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.start();
      setState(prev => ({ ...prev, isRecording: true }));
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, []);

  // Stop recording function
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      setState(prev => ({ ...prev, isRecording: false }));
      
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([blob], 'recording.webm', { type: 'audio/webm' });
        
        try {
          const newTrack = await uploadAudio(audioFile);
          setState(prev => ({ ...prev, tracks: [...prev.tracks, newTrack] }));
        } catch (error) {
          console.error('Error uploading recorded audio:', error);
        }
      };
    }
  }, [state.isRecording]);

  // Seek function
  const seekTo = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
    // Implement actual seeking logic if needed
  }, []);

  // Set volume function
  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100;
    }
    setState(prev => ({ ...prev, volume }));
  }, []);

  // Set BPM function
  const setBPM = useCallback((bpm: number) => {
    setState(prev => ({ ...prev, bpm }));
  }, []);

  // Set master effect function
  const setMasterEffect = useCallback((effect: string, value: number) => {
    setState(prev => ({
      ...prev,
      masterEffects: {
        ...prev.masterEffects,
        [effect]: value
      }
    }));
    
    // Apply effect to audio chain
    if (effectsChainRef.current) {
      switch (effect) {
        case 'reverb':
          // Configure reverb
          break;
        case 'delay':
          effectsChainRef.current.delay.delayTime.value = value / 1000;
          break;
        case 'compressor':
          effectsChainRef.current.compressor.threshold.value = -24 + (value * 0.24);
          break;
        case 'limiter':
          effectsChainRef.current.limiter.threshold.value = -6 + (value * 0.06);
          break;
      }
    }
  }, []);

  // Load track function
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
        activeTrack: { ...track, buffer: audioBuffer },
        duration: audioBuffer.duration,
        isLoading: false
      }));
      
    } catch (error) {
      console.error('Error loading track:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Upload audio function
  const uploadAudio = useCallback(async (file: File): Promise<AudioTrack> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const formData = new FormData();
      formData.append('audio', file);
      
      const response = await apiRequest('POST', '/api/upload-audio', formData);
      const data = await response.json();
      
      const newTrack: AudioTrack = {
        id: data.id,
        name: data.name || file.name,
        url: data.url,
        duration: data.duration || 0,
        bpm: data.bpm,
        key: data.key,
        waveform: data.waveform
      };
      
      setState(prev => ({ 
        ...prev, 
        tracks: [...prev.tracks, newTrack],
        isLoading: false 
      }));
      
      return newTrack;
      
    } catch (error) {
      console.error('Error uploading audio:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  // Analyze audio function
  const analyzeAudio = useCallback(async (trackId: string) => {
    try {
      const response = await apiRequest('POST', '/api/analyze-audio', { trackId });
      return await response.json();
    } catch (error) {
      console.error('Error analyzing audio:', error);
      throw error;
    }
  }, []);

  // Mix tracks function
  const mixTracks = useCallback(async (tracks: AudioTrack[], effects: any): Promise<AudioBuffer> => {
    if (!audioContextRef.current) throw new Error('Audio context not initialized');
    
    const context = audioContextRef.current;
    const offlineContext = new OfflineAudioContext(2, 44100 * 60, 44100); // 1 minute max
    
    // Load and mix all tracks
    const promises = tracks.map(async (track) => {
      if (!track.buffer) return;
      
      const source = offlineContext.createBufferSource();
      source.buffer = track.buffer;
      
      const gainNode = offlineContext.createGain();
      gainNode.gain.value = 0.5; // Adjust based on track settings
      
      source.connect(gainNode);
      gainNode.connect(offlineContext.destination);
      
      source.start();
    });
    
    await Promise.all(promises);
    return await offlineContext.startRendering();
  }, []);

  // Export project function
  const exportProject = useCallback(async (format: 'wav' | 'mp3'): Promise<Blob> => {
    if (!audioContextRef.current || !audioBufferRef.current) {
      throw new Error('No audio to export');
    }
    
    // Convert AudioBuffer to Blob
    const length = audioBufferRef.current.length;
    const channels = audioBufferRef.current.numberOfChannels;
    const sampleRate = audioBufferRef.current.sampleRate;
    
    const buffer = new ArrayBuffer(length * channels * 2);
    const view = new DataView(buffer);
    
    let offset = 0;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < channels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBufferRef.current.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    const blob = new Blob([buffer], { type: format === 'wav' ? 'audio/wav' : 'audio/mp3' });
    return blob;
  }, []);

  // Get spectrum function
  const getSpectrum = useCallback((): Uint8Array => {
    if (!analyserNodeRef.current) return new Uint8Array(0);
    
    const bufferLength = analyserNodeRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserNodeRef.current.getByteFrequencyData(dataArray);
    
    return dataArray;
  }, []);

  // Get waveform function
  const getWaveform = useCallback(async (trackId: string): Promise<number[]> => {
    try {
      const response = await apiRequest('GET', `/api/waveform/${trackId}`);
      const data = await response.json();
      return data.waveform || [];
    } catch (error) {
      console.error('Error getting waveform:', error);
      return [];
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