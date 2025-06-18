export interface WaveformData {
  peaks: number[];
  duration: number;
  sampleRate: number;
}

export interface WaveformDrawOptions {
  showPlayhead?: boolean;
  playheadPosition?: number;
  color?: string;
  backgroundColor?: string;
  lineWidth?: number;
}

export function generateWaveformData(
  audioBuffer: AudioBuffer,
  startTime: number = 0,
  duration?: number
): WaveformData {
  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0);
  const totalDuration = audioBuffer.duration;
  
  const actualDuration = duration || (totalDuration - startTime);
  const startSample = Math.floor(startTime * sampleRate);
  const endSample = Math.min(
    channelData.length,
    Math.floor((startTime + actualDuration) * sampleRate)
  );
  
  const samplesPerPixel = Math.max(1, Math.floor((endSample - startSample) / 1000));
  const peaks: number[] = [];
  
  for (let i = startSample; i < endSample; i += samplesPerPixel) {
    let max = 0;
    const end = Math.min(i + samplesPerPixel, endSample);
    
    for (let j = i; j < end; j++) {
      const sample = Math.abs(channelData[j]);
      if (sample > max) max = sample;
    }
    
    peaks.push(max);
  }
  
  return {
    peaks,
    duration: actualDuration,
    sampleRate,
  };
}

export function drawWaveform(
  canvas: HTMLCanvasElement,
  waveformData: WaveformData,
  options: WaveformDrawOptions = {}
): void {
  const {
    showPlayhead = false,
    playheadPosition = 0,
    color = '#00D4FF',
    backgroundColor = 'transparent',
    lineWidth = 1,
  } = options;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const { width, height } = canvas;
  const { peaks } = waveformData;
  
  // Set canvas size to match display size
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  
  // Clear canvas
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  if (peaks.length === 0) return;
  
  // Draw waveform
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = 0.8;
  
  const barWidth = width / peaks.length;
  const centerY = height / 2;
  
  ctx.beginPath();
  
  for (let i = 0; i < peaks.length; i++) {
    const x = i * barWidth;
    const barHeight = peaks[i] * centerY;
    
    // Draw positive peak
    ctx.moveTo(x, centerY - barHeight);
    ctx.lineTo(x, centerY + barHeight);
  }
  
  ctx.stroke();
  
  // Draw playhead
  if (showPlayhead && waveformData.duration > 0) {
    const playheadX = (playheadPosition / waveformData.duration) * width;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
  }
}

export function getWaveformPeakAtPosition(
  waveformData: WaveformData,
  position: number
): number {
  if (waveformData.peaks.length === 0) return 0;
  
  const normalizedPosition = Math.max(0, Math.min(1, position));
  const index = Math.floor(normalizedPosition * (waveformData.peaks.length - 1));
  
  return waveformData.peaks[index] || 0;
}

export function analyzeAudioSpectrum(
  audioContext: AudioContext,
  audioBuffer: AudioBuffer,
  fftSize: number = 2048
): Float32Array {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(analyser);
  
  const frequencyData = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData(frequencyData);
  
  return frequencyData;
}

export function createSpectrumVisualization(
  canvas: HTMLCanvasElement,
  frequencyData: Float32Array,
  options: {
    barCount?: number;
    color?: string;
    gradient?: boolean;
  } = {}
): void {
  const {
    barCount = 64,
    color = '#00D4FF',
    gradient = true,
  } = options;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const { width, height } = canvas;
  const barWidth = width / barCount;
  
  // Clear canvas
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, width, height);
  
  // Create gradient if enabled
  let fillStyle = color;
  if (gradient) {
    const grad = ctx.createLinearGradient(0, height, 0, 0);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'transparent');
    fillStyle = grad;
  }
  
  ctx.fillStyle = fillStyle;
  
  // Draw spectrum bars
  for (let i = 0; i < barCount; i++) {
    const dataIndex = Math.floor(i * frequencyData.length / barCount);
    const magnitude = Math.max(0, (frequencyData[dataIndex] + 100) / 100); // Normalize -100dB to 0dB range
    const barHeight = magnitude * height;
    
    const x = i * barWidth;
    const y = height - barHeight;
    
    ctx.fillRect(x, y, barWidth - 1, barHeight);
  }
}
