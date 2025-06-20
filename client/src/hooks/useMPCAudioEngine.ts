import { useRef, useCallback, useEffect } from 'react';

interface AudioSample {
  id: string;
  name: string;
  buffer: AudioBuffer | null;
  url: string;
  category: string;
}

interface MPCAudioEngineReturn {
  playSample: (sampleId: string, velocity?: number) => void;
  loadSample: (sample: AudioSample) => Promise<void>;
  setMasterVolume: (volume: number) => void;
  isReady: boolean;
}

export function useMPCAudioEngine(): MPCAudioEngineReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const samplesRef = useRef<Map<string, AudioBuffer>>(new Map());
  const isInitializedRef = useRef(false);

  const initializeAudioContext = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain node
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.setValueAtTime(0.8, audioContextRef.current.currentTime);

      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      isInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }, []);

  const loadSample = useCallback(async (sample: AudioSample) => {
    if (!audioContextRef.current) {
      await initializeAudioContext();
    }

    try {
      // For demo purposes, create synthetic audio buffers
      // In production, you would fetch actual audio files
      const buffer = createSyntheticSample(sample.category, audioContextRef.current!);
      samplesRef.current.set(sample.id, buffer);
    } catch (error) {
      console.error(`Failed to load sample ${sample.id}:`, error);
    }
  }, [initializeAudioContext]);

  const playSample = useCallback((sampleId: string, velocity: number = 0.8) => {
    if (!audioContextRef.current || !masterGainRef.current) return;

    const buffer = samplesRef.current.get(sampleId);
    if (!buffer) return;

    try {
      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();

      source.buffer = buffer;
      gainNode.gain.setValueAtTime(velocity, audioContextRef.current.currentTime);

      source.connect(gainNode);
      gainNode.connect(masterGainRef.current);

      source.start();
    } catch (error) {
      console.error(`Failed to play sample ${sampleId}:`, error);
    }
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAudioContext();
  }, [initializeAudioContext]);

  return {
    playSample,
    loadSample,
    setMasterVolume,
    isReady: isInitializedRef.current
  };
}

// Create synthetic audio samples for different drum types
function createSyntheticSample(category: string, audioContext: AudioContext): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const duration = 0.5; // 500ms
  const length = sampleRate * duration;
  const buffer = audioContext.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  switch (category) {
    case 'kick':
      // Generate kick drum sound (low frequency sine wave with envelope)
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const frequency = 60 * Math.exp(-t * 8); // Pitch envelope
        const amplitude = Math.exp(-t * 6); // Volume envelope
        data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t);
      }
      break;

    case 'snare':
      // Generate snare drum sound (noise burst with envelope)
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1);
        const tone = Math.sin(2 * Math.PI * 200 * t);
        const amplitude = Math.exp(-t * 8);
        data[i] = amplitude * (noise * 0.7 + tone * 0.3) * 0.5;
      }
      break;

    case 'hihat':
      // Generate hi-hat sound (filtered noise)
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1);
        const amplitude = Math.exp(-t * 15); // Quick decay
        data[i] = amplitude * noise * 0.3;
      }
      break;

    case 'crash':
      // Generate crash cymbal sound (complex harmonics with long decay)
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const fundamental = Math.sin(2 * Math.PI * 400 * t);
        const harmonics = Math.sin(2 * Math.PI * 800 * t) * 0.5 + 
                         Math.sin(2 * Math.PI * 1200 * t) * 0.3;
        const amplitude = Math.exp(-t * 2); // Long decay
        data[i] = amplitude * (fundamental + harmonics) * 0.2;
      }
      break;

    case 'perc':
      // Generate percussion sound (short tone burst)
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const frequency = 300;
        const amplitude = Math.exp(-t * 10);
        data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * 0.4;
      }
      break;

    case 'fx':
      // Generate FX sound (sweep)
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const frequency = 100 + t * 1000; // Frequency sweep
        const amplitude = Math.exp(-t * 3);
        data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * 0.3;
      }
      break;

    default:
      // Default tone
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const amplitude = Math.exp(-t * 5);
        data[i] = amplitude * Math.sin(2 * Math.PI * 440 * t) * 0.3;
      }
  }

  return buffer;
}