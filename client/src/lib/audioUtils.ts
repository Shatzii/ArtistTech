export function detectBPM(audioBuffer: AudioBuffer): number {
  // Simple BPM detection algorithm
  // This is a basic implementation - production would use more sophisticated algorithms
  
  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0);
  const bufferSize = channelData.length;
  
  // Find peaks in the audio signal
  const peaks: number[] = [];
  const threshold = 0.1;
  
  for (let i = 1; i < bufferSize - 1; i++) {
    if (channelData[i] > threshold && 
        channelData[i] > channelData[i - 1] && 
        channelData[i] > channelData[i + 1]) {
      peaks.push(i / sampleRate);
    }
  }
  
  if (peaks.length < 2) return 120; // Default BPM
  
  // Calculate intervals between peaks
  const intervals: number[] = [];
  for (let i = 1; i < peaks.length; i++) {
    intervals.push(peaks[i] - peaks[i - 1]);
  }
  
  // Find most common interval (simplified)
  intervals.sort((a, b) => a - b);
  const medianInterval = intervals[Math.floor(intervals.length / 2)];
  
  // Convert to BPM
  const bpm = 60 / medianInterval;
  
  // Clamp to reasonable range
  return Math.max(60, Math.min(200, Math.round(bpm)));
}

export function createAudioEffectChain(audioContext: AudioContext): {
  input: AudioNode;
  output: AudioNode;
  reverb: ConvolverNode;
  delay: DelayNode;
  filter: BiquadFilterNode;
} {
  const input = audioContext.createGain();
  const output = audioContext.createGain();
  
  // Create reverb
  const reverb = audioContext.createConvolver();
  const reverbGain = audioContext.createGain();
  
  // Create delay
  const delay = audioContext.createDelay(1.0);
  const delayGain = audioContext.createGain(); 
  const feedback = audioContext.createGain();
  
  // Create filter
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 20000;
  
  // Connect effect chain
  input.connect(filter);
  filter.connect(delay);
  filter.connect(reverb);
  
  delay.connect(delayGain);
  delayGain.connect(feedback);
  feedback.connect(delay);
  delayGain.connect(output);
  
  reverb.connect(reverbGain);
  reverbGain.connect(output);
  
  filter.connect(output);
  
  return {
    input,
    output,
    reverb,
    delay,
    filter,
  };
}

export async function generateImpulseResponse(
  audioContext: AudioContext,
  duration: number,
  decay: number
): Promise<AudioBuffer> {
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * duration;
  const impulse = audioContext.createBuffer(2, length, sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const power = length - i;
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(power / length, decay);
    }
  }
  
  return impulse;
}

export function normalizeAudioLevel(buffer: Float32Array): Float32Array {
  let max = 0;
  for (let i = 0; i < buffer.length; i++) {
    const abs = Math.abs(buffer[i]);
    if (abs > max) max = abs;
  }
  
  if (max === 0) return buffer;
  
  const normalized = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    normalized[i] = buffer[i] / max;
  }
  
  return normalized;
}

export function crossfade(bufferA: Float32Array, bufferB: Float32Array, position: number): Float32Array {
  const length = Math.max(bufferA.length, bufferB.length);
  const result = new Float32Array(length);
  
  const gainA = Math.cos(position * Math.PI / 2);
  const gainB = Math.sin(position * Math.PI / 2);
  
  for (let i = 0; i < length; i++) {
    const sampleA = i < bufferA.length ? bufferA[i] : 0;
    const sampleB = i < bufferB.length ? bufferB[i] : 0;
    result[i] = (sampleA * gainA) + (sampleB * gainB);
  }
  
  return result;
}
