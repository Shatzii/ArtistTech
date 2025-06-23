import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';

// Professional DAW Engine with Multi-track Recording and VST Support
interface AudioTrack {
  id: string;
  name: string;
  type: 'audio' | 'midi' | 'instrument' | 'bus';
  armed: boolean;
  muted: boolean;
  solo: boolean;
  volume: number;
  pan: number;
  input: string;
  output: string;
  effects: EffectChain[];
  automation: AutomationData[];
  clips: AudioClip[];
  color: string;
}

interface AudioClip {
  id: string;
  trackId: string;
  startTime: number;
  duration: number;
  offset: number;
  gain: number;
  fadeIn: number;
  fadeOut: number;
  audioData?: Float32Array;
  midiData?: MIDIEvent[];
  reversed: boolean;
  timeStretch: number;
  pitchShift: number;
}

interface MIDIEvent {
  time: number;
  type: 'note_on' | 'note_off' | 'cc' | 'pitch_bend' | 'program_change';
  channel: number;
  note?: number;
  velocity?: number;
  controller?: number;
  value?: number;
}

interface EffectChain {
  id: string;
  name: string;
  type: 'eq' | 'compressor' | 'reverb' | 'delay' | 'distortion' | 'filter' | 'vst';
  enabled: boolean;
  parameters: Record<string, number>;
  preset?: string;
}

interface AutomationData {
  parameter: string;
  points: Array<{ time: number; value: number; curve: 'linear' | 'exponential' | 'logarithmic' }>;
}

interface ProjectSettings {
  sampleRate: number;
  bufferSize: number;
  bpm: number;
  timeSignature: { numerator: number; denominator: number };
  masterVolume: number;
  masterEffects: EffectChain[];
  quantization: number;
  metronome: boolean;
  recordMode: 'overdub' | 'replace' | 'merge';
}

interface VSTPlugin {
  id: string;
  name: string;
  vendor: string;
  version: string;
  type: 'instrument' | 'effect';
  parameters: Record<string, any>;
  presets: string[];
  latency: number;
}

export class ProfessionalDAWEngine extends EventEmitter {
  private dawWSS?: WebSocketServer;
  private connectedClients: Map<string, WebSocket> = new Map();
  private tracks: Map<string, AudioTrack> = new Map();
  private vstPlugins: Map<string, VSTPlugin> = new Map();
  private projectSettings: ProjectSettings;
  private isRecording = false;
  private isPlaying = false;
  private currentPosition = 0;
  private loopStart = 0;
  private loopEnd = 0;
  private loopEnabled = false;
  private audioContext?: AudioContext;
  private masterGainNode?: GainNode;
  private recordingBuffers: Map<string, Float32Array[]> = new Map();

  constructor() {
    super();
    this.projectSettings = {
      sampleRate: 44100,
      bufferSize: 512,
      bpm: 120,
      timeSignature: { numerator: 4, denominator: 4 },
      masterVolume: 0.8,
      masterEffects: [],
      quantization: 16, // 16th notes
      metronome: false,
      recordMode: 'overdub'
    };
    this.initializeEngine();
  }

  private async initializeEngine() {
    this.setupDAWServer();
    await this.initializeAudioContext();
    this.loadVSTPlugins();
    this.setupDefaultTracks();
    console.log('Professional DAW Engine initialized');
  }

  private setupDAWServer() {
    this.dawWSS = new WebSocketServer({ port: 8096 });
    
    this.dawWSS.on('connection', (ws, req) => {
      const clientId = `daw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.connectedClients.set(clientId, ws);
      
      ws.on('message', (data) => {
        this.handleDAWMessage(clientId, JSON.parse(data.toString()));
      });
      
      ws.on('close', () => {
        this.connectedClients.delete(clientId);
      });
      
      // Send initial project state
      ws.send(JSON.stringify({
        type: 'project_state',
        tracks: Array.from(this.tracks.values()),
        settings: this.projectSettings,
        position: this.currentPosition,
        isPlaying: this.isPlaying,
        isRecording: this.isRecording
      }));
    });
    
    console.log('Professional DAW server started on port 8096');
  }

  private async initializeAudioContext() {
    this.audioContext = new (globalThis.AudioContext || (globalThis as any).webkitAudioContext)();
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
    this.masterGainNode.gain.value = this.projectSettings.masterVolume;
  }

  private loadVSTPlugins() {
    // Load available VST plugins (simulated)
    const defaultVSTs: VSTPlugin[] = [
      {
        id: 'serum',
        name: 'Serum',
        vendor: 'Xfer Records',
        version: '1.3.6',
        type: 'instrument',
        parameters: {},
        presets: ['Init', 'Bass Wobble', 'Lead Pluck', 'Pad Warm'],
        latency: 0
      },
      {
        id: 'fabfilter_pro_q3',
        name: 'Pro-Q 3',
        vendor: 'FabFilter',
        version: '3.21',
        type: 'effect',
        parameters: {},
        presets: ['Natural', 'Vocal', 'Master', 'Transparent'],
        latency: 0
      },
      {
        id: 'massive',
        name: 'Massive',
        vendor: 'Native Instruments',
        version: '1.5.8',
        type: 'instrument',
        parameters: {},
        presets: ['Init', 'Sub Bass', 'Lead Sync', 'Pad Evolving'],
        latency: 0
      }
    ];

    defaultVSTs.forEach(vst => {
      this.vstPlugins.set(vst.id, vst);
    });
  }

  private setupDefaultTracks() {
    // Create default tracks
    this.createTrack('Master Bus', 'bus');
    this.createTrack('Audio 1', 'audio');
    this.createTrack('Audio 2', 'audio');
    this.createTrack('MIDI 1', 'midi');
    this.createTrack('MIDI 2', 'midi');
  }

  private handleDAWMessage(clientId: string, message: any) {
    switch (message.type) {
      case 'create_track':
        this.createTrack(message.name, message.trackType);
        break;
      
      case 'delete_track':
        this.deleteTrack(message.trackId);
        break;
      
      case 'record_track':
        this.recordTrack(message.trackId, message.audioData);
        break;
      
      case 'play_project':
        this.playProject();
        break;
      
      case 'stop_project':
        this.stopProject();
        break;
      
      case 'set_bpm':
        this.setBPM(message.bpm);
        break;
      
      case 'add_effect':
        this.addEffect(message.trackId, message.effectType);
        break;
      
      case 'load_vst':
        this.loadVST(message.trackId, message.vstId);
        break;
      
      case 'quantize_audio':
        this.quantizeAudio(message.clipId);
        break;
      
      case 'time_stretch':
        this.timeStretchClip(message.clipId, message.ratio);
        break;
      
      case 'add_automation':
        this.addAutomation(message.trackId, message.parameter, message.points);
        break;
    }
  }

  createTrack(name: string, type: AudioTrack['type']): string {
    const trackId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const track: AudioTrack = {
      id: trackId,
      name,
      type,
      armed: false,
      muted: false,
      solo: false,
      volume: 0.8,
      pan: 0,
      input: type === 'audio' ? 'input_1' : 'none',
      output: 'master',
      effects: [],
      automation: [],
      clips: [],
      color: this.generateTrackColor()
    };

    this.tracks.set(trackId, track);
    
    this.broadcastToClients({
      type: 'track_created',
      track
    });

    return trackId;
  }

  private generateTrackColor(): string {
    const colors = ['#ff6b35', '#f7931e', '#ffd23e', '#06d6a0', '#118ab2', '#073b4c', '#8338ec', '#fb8500'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  deleteTrack(trackId: string): void {
    if (this.tracks.has(trackId)) {
      this.tracks.delete(trackId);
      
      this.broadcastToClients({
        type: 'track_deleted',
        trackId
      });
    }
  }

  async recordTrack(trackId: string, audioData: Float32Array): Promise<void> {
    const track = this.tracks.get(trackId);
    if (!track || !track.armed) return;

    const clipId = `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Process audio data with effects
    const processedAudio = await this.applyEffectsChain(audioData, track.effects);
    
    const clip: AudioClip = {
      id: clipId,
      trackId,
      startTime: this.currentPosition,
      duration: audioData.length / this.projectSettings.sampleRate,
      offset: 0,
      gain: 1.0,
      fadeIn: 0,
      fadeOut: 0,
      audioData: processedAudio,
      reversed: false,
      timeStretch: 1.0,
      pitchShift: 0
    };

    track.clips.push(clip);
    
    this.broadcastToClients({
      type: 'clip_recorded',
      trackId,
      clip
    });
  }

  private async applyEffectsChain(audioData: Float32Array, effects: EffectChain[]): Promise<Float32Array> {
    let processedData = new Float32Array(audioData);
    
    for (const effect of effects) {
      if (!effect.enabled) continue;
      
      switch (effect.type) {
        case 'eq':
          processedData = this.applyEQ(processedData, effect.parameters);
          break;
        case 'compressor':
          processedData = this.applyCompressor(processedData, effect.parameters);
          break;
        case 'reverb':
          processedData = await this.applyReverb(processedData, effect.parameters);
          break;
        case 'delay':
          processedData = this.applyDelay(processedData, effect.parameters);
          break;
        case 'distortion':
          processedData = this.applyDistortion(processedData, effect.parameters);
          break;
      }
    }
    
    return processedData;
  }

  private applyEQ(audioData: Float32Array, params: Record<string, number>): Float32Array {
    // Professional EQ with multiple bands
    const lowGain = params.lowGain || 0;
    const midGain = params.midGain || 0;
    const highGain = params.highGain || 0;
    const lowFreq = params.lowFreq || 200;
    const highFreq = params.highFreq || 2000;
    
    const processed = new Float32Array(audioData.length);
    
    for (let i = 0; i < audioData.length; i++) {
      // Simplified 3-band EQ
      let sample = audioData[i];
      
      // Low band
      if (lowGain !== 0) {
        sample *= (1 + lowGain / 10);
      }
      
      // High band  
      if (highGain !== 0) {
        sample *= (1 + highGain / 10);
      }
      
      processed[i] = Math.max(-1, Math.min(1, sample));
    }
    
    return processed;
  }

  private applyCompressor(audioData: Float32Array, params: Record<string, number>): Float32Array {
    const threshold = params.threshold || -20;
    const ratio = params.ratio || 4;
    const attack = params.attack || 0.003;
    const release = params.release || 0.1;
    const makeupGain = params.makeupGain || 0;
    
    const processed = new Float32Array(audioData.length);
    let envelope = 0;
    
    for (let i = 0; i < audioData.length; i++) {
      const input = audioData[i];
      const inputLevel = Math.abs(input);
      const inputLevelDb = 20 * Math.log10(inputLevel + 1e-10);
      
      // Update envelope
      const targetEnvelope = inputLevelDb > threshold ? inputLevelDb : 0;
      if (targetEnvelope > envelope) {
        envelope += (targetEnvelope - envelope) * attack;
      } else {
        envelope += (targetEnvelope - envelope) * release;
      }
      
      // Calculate gain reduction
      const gainReduction = envelope > threshold ? 
        (envelope - threshold) * (1 - 1/ratio) : 0;
      
      const outputGain = Math.pow(10, (-gainReduction + makeupGain) / 20);
      processed[i] = input * outputGain;
    }
    
    return processed;
  }

  private async applyReverb(audioData: Float32Array, params: Record<string, number>): Promise<Float32Array> {
    const roomSize = params.roomSize || 0.5;
    const damping = params.damping || 0.5;
    const wetLevel = params.wetLevel || 0.3;
    
    // Simplified convolution reverb
    const delayTimes = [0.03, 0.05, 0.07, 0.09, 0.11, 0.13];
    const processed = new Float32Array(audioData);
    
    delayTimes.forEach((delayTime, index) => {
      const delaySamples = Math.floor(delayTime * this.projectSettings.sampleRate * roomSize);
      const gain = (1 - damping) * wetLevel / delayTimes.length;
      
      for (let i = delaySamples; i < audioData.length; i++) {
        processed[i] += audioData[i - delaySamples] * gain;
      }
    });
    
    return processed;
  }

  private applyDelay(audioData: Float32Array, params: Record<string, number>): Float32Array {
    const delayTime = params.delayTime || 0.25; // seconds
    const feedback = params.feedback || 0.3;
    const wetLevel = params.wetLevel || 0.3;
    
    const delaySamples = Math.floor(delayTime * this.projectSettings.sampleRate);
    const processed = new Float32Array(audioData);
    const delayBuffer = new Float32Array(delaySamples);
    let writeIndex = 0;
    
    for (let i = 0; i < audioData.length; i++) {
      const delayed = delayBuffer[writeIndex];
      delayBuffer[writeIndex] = audioData[i] + delayed * feedback;
      processed[i] = audioData[i] + delayed * wetLevel;
      
      writeIndex = (writeIndex + 1) % delaySamples;
    }
    
    return processed;
  }

  private applyDistortion(audioData: Float32Array, params: Record<string, number>): Float32Array {
    const drive = params.drive || 2;
    const tone = params.tone || 0.5;
    
    const processed = new Float32Array(audioData.length);
    
    for (let i = 0; i < audioData.length; i++) {
      let sample = audioData[i] * drive;
      
      // Soft clipping
      if (sample > 1) sample = 1 - Math.exp(-(sample - 1));
      else if (sample < -1) sample = -1 + Math.exp(sample + 1);
      
      // Tone control (simplified high-frequency rolloff)
      if (i > 0) {
        sample = sample * tone + processed[i-1] * (1 - tone);
      }
      
      processed[i] = sample;
    }
    
    return processed;
  }

  playProject(): void {
    this.isPlaying = true;
    this.startPlayback();
    
    this.broadcastToClients({
      type: 'playback_started',
      position: this.currentPosition
    });
  }

  stopProject(): void {
    this.isPlaying = false;
    this.isRecording = false;
    
    this.broadcastToClients({
      type: 'playback_stopped',
      position: this.currentPosition
    });
  }

  private startPlayback(): void {
    const playbackInterval = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(playbackInterval);
        return;
      }
      
      // Advance playhead
      this.currentPosition += 0.01; // 10ms increments
      
      // Handle looping
      if (this.loopEnabled && this.currentPosition >= this.loopEnd) {
        this.currentPosition = this.loopStart;
      }
      
      // Mix and play audio
      this.mixAndPlayAudio();
      
      // Broadcast position update
      this.broadcastToClients({
        type: 'position_update',
        position: this.currentPosition
      });
    }, 10);
  }

  private mixAndPlayAudio(): void {
    // Real-time audio mixing of all tracks
    const bufferSize = this.projectSettings.bufferSize;
    const mixBuffer = new Float32Array(bufferSize);
    
    this.tracks.forEach(track => {
      if (track.muted || track.type === 'bus') return;
      
      const trackBuffer = this.renderTrackAudio(track, bufferSize);
      
      for (let i = 0; i < bufferSize; i++) {
        mixBuffer[i] += trackBuffer[i] * track.volume;
      }
    });
    
    // Apply master effects
    // this.applyMasterEffects(mixBuffer);
    
    // Output to audio context (simplified)
    if (this.audioContext && this.masterGainNode) {
      const audioBuffer = this.audioContext.createBuffer(1, bufferSize, this.projectSettings.sampleRate);
      audioBuffer.getChannelData(0).set(mixBuffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.masterGainNode);
      source.start();
    }
  }

  private renderTrackAudio(track: AudioTrack, bufferSize: number): Float32Array {
    const buffer = new Float32Array(bufferSize);
    const sampleRate = this.projectSettings.sampleRate;
    const startTime = this.currentPosition;
    const endTime = startTime + (bufferSize / sampleRate);
    
    // Find clips that overlap with current time window
    track.clips.forEach(clip => {
      const clipStart = clip.startTime;
      const clipEnd = clip.startTime + clip.duration;
      
      if (clipEnd > startTime && clipStart < endTime) {
        // Calculate overlap region
        const overlapStart = Math.max(startTime, clipStart);
        const overlapEnd = Math.min(endTime, clipEnd);
        
        if (clip.audioData) {
          this.renderAudioClip(clip, buffer, overlapStart, overlapEnd, startTime, sampleRate);
        }
      }
    });
    
    return buffer;
  }

  private renderAudioClip(
    clip: AudioClip, 
    buffer: Float32Array, 
    overlapStart: number, 
    overlapEnd: number, 
    bufferStart: number, 
    sampleRate: number
  ): void {
    if (!clip.audioData) return;
    
    const bufferStartSample = Math.floor((overlapStart - bufferStart) * sampleRate);
    const bufferEndSample = Math.floor((overlapEnd - bufferStart) * sampleRate);
    const clipStartSample = Math.floor((overlapStart - clip.startTime) * sampleRate);
    
    for (let i = bufferStartSample; i < bufferEndSample && i < buffer.length; i++) {
      const clipSample = clipStartSample + (i - bufferStartSample);
      
      if (clipSample >= 0 && clipSample < clip.audioData.length) {
        let sample = clip.audioData[clipSample];
        
        // Apply clip gain
        sample *= clip.gain;
        
        // Apply time stretching (simplified)
        if (clip.timeStretch !== 1.0) {
          const stretchedIndex = Math.floor(clipSample / clip.timeStretch);
          if (stretchedIndex < clip.audioData.length) {
            sample = clip.audioData[stretchedIndex];
          }
        }
        
        // Apply pitch shifting (simplified)
        if (clip.pitchShift !== 0) {
          const pitchRatio = Math.pow(2, clip.pitchShift / 12);
          const pitchIndex = Math.floor(clipSample * pitchRatio);
          if (pitchIndex < clip.audioData.length) {
            sample = clip.audioData[pitchIndex];
          }
        }
        
        buffer[i] += sample;
      }
    }
  }

  setBPM(bpm: number): void {
    this.projectSettings.bpm = bpm;
    
    this.broadcastToClients({
      type: 'bpm_changed',
      bpm
    });
  }

  addEffect(trackId: string, effectType: EffectChain['type']): void {
    const track = this.tracks.get(trackId);
    if (!track) return;
    
    const effectId = `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const effect: EffectChain = {
      id: effectId,
      name: effectType.charAt(0).toUpperCase() + effectType.slice(1),
      type: effectType,
      enabled: true,
      parameters: this.getDefaultEffectParameters(effectType)
    };
    
    track.effects.push(effect);
    
    this.broadcastToClients({
      type: 'effect_added',
      trackId,
      effect
    });
  }

  private getDefaultEffectParameters(effectType: EffectChain['type']): Record<string, number> {
    switch (effectType) {
      case 'eq':
        return { lowGain: 0, midGain: 0, highGain: 0, lowFreq: 200, highFreq: 2000 };
      case 'compressor':
        return { threshold: -20, ratio: 4, attack: 0.003, release: 0.1, makeupGain: 0 };
      case 'reverb':
        return { roomSize: 0.5, damping: 0.5, wetLevel: 0.3 };
      case 'delay':
        return { delayTime: 0.25, feedback: 0.3, wetLevel: 0.3 };
      case 'distortion':
        return { drive: 2, tone: 0.5 };
      default:
        return {};
    }
  }

  loadVST(trackId: string, vstId: string): void {
    const track = this.tracks.get(trackId);
    const vst = this.vstPlugins.get(vstId);
    
    if (!track || !vst) return;
    
    const effectId = `vst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const vstEffect: EffectChain = {
      id: effectId,
      name: vst.name,
      type: 'vst',
      enabled: true,
      parameters: { ...vst.parameters }
    };
    
    track.effects.push(vstEffect);
    
    this.broadcastToClients({
      type: 'vst_loaded',
      trackId,
      vst: vstEffect
    });
  }

  quantizeAudio(clipId: string): void {
    // Find clip across all tracks
    let targetClip: AudioClip | undefined;
    let targetTrack: AudioTrack | undefined;
    
    for (const track of this.tracks.values()) {
      const clip = track.clips.find(c => c.id === clipId);
      if (clip) {
        targetClip = clip;
        targetTrack = track;
        break;
      }
    }
    
    if (!targetClip || !targetClip.audioData) return;
    
    // Perform quantization
    const quantizedAudio = this.performAudioQuantization(targetClip.audioData);
    targetClip.audioData = quantizedAudio;
    
    this.broadcastToClients({
      type: 'audio_quantized',
      clipId,
      trackId: targetTrack!.id
    });
  }

  private performAudioQuantization(audioData: Float32Array): Float32Array {
    // Beat detection and quantization
    const beats = this.detectBeats(audioData);
    const quantizedData = new Float32Array(audioData);
    
    const quantizeGrid = this.projectSettings.quantization; // 16th notes
    const samplesPerBeat = (60 / this.projectSettings.bpm) * this.projectSettings.sampleRate;
    const quantizeStep = samplesPerBeat / (quantizeGrid / 4);
    
    beats.forEach(beatTime => {
      const beatSample = Math.floor(beatTime * this.projectSettings.sampleRate);
      const nearestGrid = Math.round(beatSample / quantizeStep) * quantizeStep;
      const shift = nearestGrid - beatSample;
      
      // Shift audio to align with grid (simplified)
      if (Math.abs(shift) < quantizeStep / 4) {
        this.shiftAudioRegion(quantizedData, beatSample, shift);
      }
    });
    
    return quantizedData;
  }

  private detectBeats(audioData: Float32Array): number[] {
    // Simplified beat detection
    const beats: number[] = [];
    const windowSize = 1024;
    const hopSize = 512;
    
    for (let i = 0; i < audioData.length - windowSize; i += hopSize) {
      const window = audioData.slice(i, i + windowSize);
      const energy = window.reduce((sum, sample) => sum + sample * sample, 0);
      
      // Simple onset detection
      if (i > hopSize) {
        const prevWindow = audioData.slice(i - hopSize, i - hopSize + windowSize);
        const prevEnergy = prevWindow.reduce((sum, sample) => sum + sample * sample, 0);
        
        if (energy > prevEnergy * 1.5) {
          beats.push(i / this.projectSettings.sampleRate);
        }
      }
    }
    
    return beats;
  }

  private shiftAudioRegion(audioData: Float32Array, startSample: number, shiftSamples: number): void {
    // Time-shift audio region (simplified)
    const regionSize = 2048; // samples to shift
    const endSample = Math.min(startSample + regionSize, audioData.length);
    
    if (shiftSamples > 0) {
      // Shift right
      for (let i = endSample - 1; i >= startSample + shiftSamples; i--) {
        audioData[i] = audioData[i - shiftSamples];
      }
    } else {
      // Shift left
      for (let i = startSample; i < endSample + shiftSamples; i++) {
        audioData[i] = audioData[i - shiftSamples];
      }
    }
  }

  timeStretchClip(clipId: string, ratio: number): void {
    // Find and time-stretch clip
    for (const track of this.tracks.values()) {
      const clip = track.clips.find(c => c.id === clipId);
      if (clip && clip.audioData) {
        clip.timeStretch = ratio;
        clip.duration = clip.duration / ratio;
        
        this.broadcastToClients({
          type: 'clip_time_stretched',
          clipId,
          ratio,
          newDuration: clip.duration
        });
        break;
      }
    }
  }

  addAutomation(trackId: string, parameter: string, points: AutomationData['points']): void {
    const track = this.tracks.get(trackId);
    if (!track) return;
    
    const existingAutomation = track.automation.find(a => a.parameter === parameter);
    
    if (existingAutomation) {
      existingAutomation.points = points;
    } else {
      track.automation.push({ parameter, points });
    }
    
    this.broadcastToClients({
      type: 'automation_added',
      trackId,
      parameter,
      points
    });
  }

  private broadcastToClients(message: any): void {
    const messageStr = JSON.stringify(message);
    this.connectedClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  getEngineStatus() {
    return {
      connected_clients: this.connectedClients.size,
      total_tracks: this.tracks.size,
      is_playing: this.isPlaying,
      is_recording: this.isRecording,
      current_position: this.currentPosition,
      bpm: this.projectSettings.bpm,
      available_vsts: Array.from(this.vstPlugins.values()),
      features_active: [
        'multi_track_recording',
        'vst_support',
        'audio_quantization',
        'time_stretching',
        'automation',
        'real_time_effects'
      ]
    };
  }
}

export const professionalDAWEngine = new ProfessionalDAWEngine();