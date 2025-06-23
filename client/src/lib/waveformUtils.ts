// Advanced waveform visualization and beat detection utilities

export interface WaveformData {
  peaks: Float32Array;
  length: number;
  sampleRate: number;
  duration: number;
}

export interface BeatData {
  beats: number[];
  tempo: number;
  confidence: number;
  timeSignature: { numerator: number; denominator: number };
}

export class WaveformAnalyzer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private beatDetector: BeatDetector;
  
  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.beatDetector = new BeatDetector(this.audioContext.sampleRate);
  }

  async processAudioFile(file: File): Promise<WaveformData> {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    const peaks = this.extractPeaks(audioBuffer);
    
    return {
      peaks,
      length: peaks.length,
      sampleRate: audioBuffer.sampleRate,
      duration: audioBuffer.duration
    };
  }

  private extractPeaks(audioBuffer: AudioBuffer, samplesPerPixel: number = 512): Float32Array {
    const length = Math.floor(audioBuffer.length / samplesPerPixel);
    const peaks = new Float32Array(length);
    const channelData = audioBuffer.getChannelData(0); // Use first channel
    
    for (let i = 0; i < length; i++) {
      const start = i * samplesPerPixel;
      const end = start + samplesPerPixel;
      let peak = 0;
      
      for (let j = start; j < end && j < channelData.length; j++) {
        const sample = Math.abs(channelData[j]);
        if (sample > peak) {
          peak = sample;
        }
      }
      
      peaks[i] = peak;
    }
    
    return peaks;
  }

  getFrequencyData(): Uint8Array {
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  getTimeDomainData(): Uint8Array {
    const timeDomainData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(timeDomainData);
    return timeDomainData;
  }

  connectSource(source: AudioNode): void {
    source.connect(this.analyser);
  }

  detectBeats(audioBuffer: AudioBuffer): BeatData {
    return this.beatDetector.analyze(audioBuffer);
  }
}

export class BeatDetector {
  private sampleRate: number;
  private windowSize: number = 1024;
  private hopSize: number = 512;
  
  constructor(sampleRate: number) {
    this.sampleRate = sampleRate;
  }

  analyze(audioBuffer: AudioBuffer): BeatData {
    const channelData = audioBuffer.getChannelData(0);
    const onsetTimes = this.detectOnsets(channelData);
    const tempo = this.estimateTempo(onsetTimes);
    const beats = this.extractBeats(onsetTimes, tempo);
    
    return {
      beats,
      tempo,
      confidence: this.calculateConfidence(beats, tempo),
      timeSignature: { numerator: 4, denominator: 4 } // Default to 4/4
    };
  }

  private detectOnsets(channelData: Float32Array): number[] {
    const onsets: number[] = [];
    const spectralFlux: number[] = [];
    
    // Calculate spectral flux for onset detection
    for (let i = 0; i < channelData.length - this.windowSize; i += this.hopSize) {
      const window = channelData.slice(i, i + this.windowSize);
      const spectrum = this.fft(window);
      
      if (spectralFlux.length > 0) {
        const flux = this.calculateSpectralFlux(spectrum, spectralFlux[spectralFlux.length - 1]);
        spectralFlux.push(flux);
        
        // Simple peak picking for onset detection
        if (flux > 0.1 && spectralFlux.length > 2) {
          const prevFlux = spectralFlux[spectralFlux.length - 2];
          const prevPrevFlux = spectralFlux[spectralFlux.length - 3];
          
          if (flux > prevFlux && prevFlux > prevPrevFlux) {
            const timeInSeconds = (i / this.sampleRate);
            onsets.push(timeInSeconds);
          }
        }
      } else {
        spectralFlux.push(0);
      }
    }
    
    return onsets;
  }

  private fft(signal: Float32Array): Float32Array {
    // Simplified FFT implementation for demonstration
    // In production, use a proper FFT library like dsp.js or ml-matrix
    const result = new Float32Array(signal.length);
    
    for (let k = 0; k < signal.length; k++) {
      let real = 0;
      let imag = 0;
      
      for (let n = 0; n < signal.length; n++) {
        const angle = -2 * Math.PI * k * n / signal.length;
        real += signal[n] * Math.cos(angle);
        imag += signal[n] * Math.sin(angle);
      }
      
      result[k] = Math.sqrt(real * real + imag * imag);
    }
    
    return result;
  }

  private calculateSpectralFlux(currentSpectrum: Float32Array, previousSpectrum: number): number {
    let flux = 0;
    
    for (let i = 0; i < currentSpectrum.length; i++) {
      const diff = currentSpectrum[i] - (previousSpectrum || 0);
      if (diff > 0) {
        flux += diff;
      }
    }
    
    return flux / currentSpectrum.length;
  }

  private estimateTempo(onsets: number[]): number {
    if (onsets.length < 4) return 120; // Default BPM
    
    const intervals: number[] = [];
    
    // Calculate inter-onset intervals
    for (let i = 1; i < onsets.length; i++) {
      intervals.push(onsets[i] - onsets[i - 1]);
    }
    
    // Find most common interval (simplified approach)
    const histogram: { [key: string]: number } = {};
    
    intervals.forEach(interval => {
      const rounded = Math.round(interval * 100) / 100; // Round to 2 decimal places
      histogram[rounded] = (histogram[rounded] || 0) + 1;
    });
    
    let mostCommonInterval = 0.5; // Default to 120 BPM
    let maxCount = 0;
    
    Object.entries(histogram).forEach(([interval, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonInterval = parseFloat(interval);
      }
    });
    
    // Convert interval to BPM
    const bpm = 60 / mostCommonInterval;
    
    // Clamp to reasonable range
    return Math.max(60, Math.min(200, bpm));
  }

  private extractBeats(onsets: number[], tempo: number): number[] {
    const beatInterval = 60 / tempo;
    const beats: number[] = [];
    
    if (onsets.length === 0) return beats;
    
    let currentBeat = onsets[0];
    beats.push(currentBeat);
    
    // Generate regular beats based on tempo
    while (currentBeat < onsets[onsets.length - 1]) {
      currentBeat += beatInterval;
      beats.push(currentBeat);
    }
    
    return beats;
  }

  private calculateConfidence(beats: number[], tempo: number): number {
    // Simple confidence calculation based on regularity
    if (beats.length < 4) return 0.5;
    
    const intervals = [];
    for (let i = 1; i < beats.length; i++) {
      intervals.push(beats[i] - beats[i - 1]);
    }
    
    const expectedInterval = 60 / tempo;
    const variance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - expectedInterval, 2);
    }, 0) / intervals.length;
    
    // Lower variance = higher confidence
    return Math.max(0, Math.min(1, 1 - (variance * 10)));
  }
}

export class WaveformRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private waveformData: WaveformData | null = null;
  private beatData: BeatData | null = null;
  private currentTime: number = 0;
  private isPlaying: boolean = false;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.setupCanvas();
  }

  private setupCanvas(): void {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  setWaveformData(data: WaveformData): void {
    this.waveformData = data;
    this.render();
  }

  setBeatData(data: BeatData): void {
    this.beatData = data;
    this.render();
  }

  setCurrentTime(time: number): void {
    this.currentTime = time;
    if (this.isPlaying) {
      this.render();
    }
  }

  setPlaying(playing: boolean): void {
    this.isPlaying = playing;
    this.render();
  }

  render(): void {
    if (!this.waveformData) return;
    
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw background
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw waveform
    this.drawWaveform();
    
    // Draw beat markers
    if (this.beatData) {
      this.drawBeatMarkers();
    }
    
    // Draw playhead
    this.drawPlayhead();
    
    // Draw frequency visualization if playing
    if (this.isPlaying) {
      this.drawFrequencyBars();
    }
  }

  private drawWaveform(): void {
    if (!this.waveformData) return;
    
    const { peaks } = this.waveformData;
    const barWidth = this.width / peaks.length;
    const centerY = this.height / 2;
    
    this.ctx.fillStyle = '#ff6b35';
    
    for (let i = 0; i < peaks.length; i++) {
      const x = i * barWidth;
      const barHeight = peaks[i] * centerY * 0.8;
      
      // Draw positive peak
      this.ctx.fillRect(x, centerY - barHeight, barWidth * 0.8, barHeight);
      
      // Draw negative peak (mirror)
      this.ctx.fillRect(x, centerY, barWidth * 0.8, barHeight);
    }
  }

  private drawBeatMarkers(): void {
    if (!this.beatData || !this.waveformData) return;
    
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 2;
    
    this.beatData.beats.forEach(beatTime => {
      const x = (beatTime / this.waveformData!.duration) * this.width;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    });
  }

  private drawPlayhead(): void {
    if (!this.waveformData) return;
    
    const x = (this.currentTime / this.waveformData.duration) * this.width;
    
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x, 0);
    this.ctx.lineTo(x, this.height);
    this.ctx.stroke();
  }

  private drawFrequencyBars(): void {
    // This would integrate with the audio analyser for real-time frequency data
    // For now, draw animated bars to simulate frequency response
    const barCount = 32;
    const barWidth = this.width / barCount;
    
    this.ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
    
    for (let i = 0; i < barCount; i++) {
      const height = Math.random() * this.height * 0.3;
      const x = i * barWidth;
      const y = this.height - height;
      
      this.ctx.fillRect(x, y, barWidth * 0.8, height);
    }
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.render();
  }
}

// Export utility functions
export const generateWaveformData = (audioBuffer: AudioBuffer, startTime: number = 0, duration?: number): WaveformData => {
  const actualDuration = duration || audioBuffer.duration;
  const sampleRate = audioBuffer.sampleRate;
  const startSample = Math.floor(startTime * sampleRate);
  const endSample = Math.floor((startTime + actualDuration) * sampleRate);
  
  const channelData = audioBuffer.getChannelData(0);
  const slicedData = channelData.slice(startSample, endSample);
  
  const samplesPerPixel = Math.floor(slicedData.length / 800);
  const peaks = new Float32Array(800);
  
  for (let i = 0; i < 800; i++) {
    const start = i * samplesPerPixel;
    const end = start + samplesPerPixel;
    let max = 0;
    
    for (let j = start; j < end && j < slicedData.length; j++) {
      max = Math.max(max, Math.abs(slicedData[j]));
    }
    
    peaks[i] = max;
  }
  
  return {
    peaks,
    length: peaks.length,
    sampleRate: sampleRate,
    duration: actualDuration
  };
};

export const drawWaveform = (canvas: HTMLCanvasElement, waveformData: WaveformData, options: {
  showPlayhead?: boolean
  playheadPosition?: number
  color?: string
  backgroundColor?: string
}) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const { width, height } = canvas;
  const { peaks } = waveformData;
  const { showPlayhead = false, playheadPosition = 0, color = '#f97316', backgroundColor = 'transparent' } = options;
  
  ctx.clearRect(0, 0, width, height);
  
  if (backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  
  const barWidth = width / peaks.length;
  const centerY = height / 2;
  
  for (let i = 0; i < peaks.length; i++) {
    const x = i * barWidth;
    const barHeight = peaks[i] * centerY;
    
    ctx.moveTo(x, centerY - barHeight);
    ctx.lineTo(x, centerY + barHeight);
  }
  
  ctx.stroke();
  
  if (showPlayhead && playheadPosition >= 0) {
    const playheadX = (playheadPosition / waveformData.duration) * width;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
  }
};

export const createWaveformFromAudioBuffer = (audioBuffer: AudioBuffer): WaveformData => {
  return generateWaveformData(audioBuffer);
};

export const detectBeatsFromBuffer = (audioBuffer: AudioBuffer): BeatData => {
  const detector = new BeatDetector(audioBuffer.sampleRate);
  return detector.analyze(audioBuffer);
};
  };
};

export const detectBeatsFromBuffer = (audioBuffer: AudioBuffer): BeatData => {
  const detector = new BeatDetector(audioBuffer.sampleRate);
  return detector.analyze(audioBuffer);
};