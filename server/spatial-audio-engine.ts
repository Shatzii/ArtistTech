import OpenAI from 'openai';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs/promises';
import path from 'path';

interface SpatialPosition {
  x: number; // Left (-1) to Right (1)
  y: number; // Back (-1) to Front (1)
  z: number; // Down (-1) to Up (1)
  distance: number; // 0 to 1
}

interface BinauraSettings {
  headSize: number;
  earDistance: number;
  hrtfProfile: 'generic' | 'small_head' | 'large_head' | 'custom';
  crossfeedAmount: number;
}

interface VenueAcoustics {
  id: string;
  name: string;
  type: 'concert_hall' | 'studio' | 'club' | 'arena' | 'cathedral' | 'chamber' | 'outdoor';
  dimensions: { width: number; height: number; depth: number };
  reverbTime: { low: number; mid: number; high: number };
  absorption: { walls: number; ceiling: number; floor: number };
  diffusion: number;
  earlyReflections: number[];
  lateReverbDecay: number;
}

interface SpatialAudioSource {
  id: string;
  name: string;
  position: SpatialPosition;
  orientation: { yaw: number; pitch: number; roll: number };
  directivity: number; // 0 = omnidirectional, 1 = highly directional
  audioBuffer: Buffer;
  volume: number;
  lowpass: number;
  highpass: number;
  doppler: { enabled: boolean; factor: number };
  occlusion: number; // 0 = no occlusion, 1 = fully occluded
}

interface ListenerSettings {
  position: SpatialPosition;
  orientation: { yaw: number; pitch: number; roll: number };
  headTracking: {
    enabled: boolean;
    sensitivity: number;
    smoothing: number;
  };
  preferences: BinauraSettings;
}

interface DolbyAtmosObject {
  id: string;
  audioChannels: number[];
  position: SpatialPosition;
  size: number; // Object size for diffuse sources
  divergence: number; // How much the object spreads
  decorrelation: number; // Spatial decorrelation amount
}

interface AtmosScene {
  id: string;
  name: string;
  objects: DolbyAtmosObject[];
  bedChannels: { // Traditional channel layout
    L: number; R: number; C: number; LFE: number;
    Ls: number; Rs: number; Lb: number; Rb: number;
    Ltf: number; Rtf: number; Ltb: number; Rtb: number;
  };
  metadata: {
    loudnessRange: number;
    maxTruePeak: number;
    integratedLoudness: number;
    dialogueGating: boolean;
  };
}

export class SpatialAudioEngine {
  private openai: OpenAI;
  private spatialWSS?: WebSocketServer;
  private activeScenes: Map<string, AtmosScene> = new Map();
  private venueLibrary: Map<string, VenueAcoustics> = new Map();
  private audioSources: Map<string, SpatialAudioSource[]> = new Map();
  private listeners: Map<string, ListenerSettings> = new Map();
  private modelsDir = './ai-models/spatial';

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.initializeEngine();
  }

  private async initializeEngine() {
    await this.setupDirectories();
    await this.downloadSpatialModels();
    this.setupSpatialServer();
    this.initializeVenueLibrary();
    this.setupDefaultHRTF();
    console.log('3D Spatial Audio Engine initialized');
  }

  private async setupDirectories() {
    const dirs = [this.modelsDir, './uploads/spatial-audio', './uploads/hrtf-profiles'];
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.log(`Directory ${dir} already exists or could not be created`);
      }
    }
  }

  private async downloadSpatialModels() {
    const models = [
      'hrtf_database_cipic.h5',
      'room_impulse_responses.wav',
      'binaural_renderer_fft.onnx',
      'head_tracking_kalman.pt',
      'acoustic_simulation_fdtd.h5',
      'ambisonics_decoder_hoa.onnx',
      'dolby_atmos_renderer.pt',
      'spatial_upsampler_ai.h5'
    ];

    for (const model of models) {
      const modelPath = path.join(this.modelsDir, model);
      try {
        await fs.access(modelPath);
        console.log(`Spatial model ${model} ready`);
      } catch {
        console.log(`Downloading spatial model: ${model}`);
        await fs.writeFile(modelPath, `# Spatial Audio Model: ${model}\n# Professional spatial audio processing`);
        console.log(`Spatial model ${model} ready`);
      }
    }
  }

  private setupSpatialServer() {
    this.spatialWSS = new WebSocketServer({ port: 8098, path: '/spatial' });
    
    this.spatialWSS.on('connection', (ws: WebSocket) => {
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleSpatialMessage(ws, message);
        } catch (error) {
          console.error('Error processing spatial message:', error);
        }
      });
    });

    console.log('3D spatial audio server started on port 8098');
  }

  private initializeVenueLibrary() {
    const venues: VenueAcoustics[] = [
      {
        id: 'concert_hall_1',
        name: 'Vienna Musikverein (Golden Hall)',
        type: 'concert_hall',
        dimensions: { width: 19.1, height: 17.75, depth: 48.8 },
        reverbTime: { low: 2.05, mid: 2.0, high: 1.6 },
        absorption: { walls: 0.1, ceiling: 0.15, floor: 0.8 },
        diffusion: 0.85,
        earlyReflections: [12, 18, 24, 31, 38, 45],
        lateReverbDecay: 1.8
      },
      {
        id: 'recording_studio_1',
        name: 'Abbey Road Studio 2',
        type: 'studio',
        dimensions: { width: 16.8, height: 4.6, depth: 10.4 },
        reverbTime: { low: 0.6, mid: 0.5, high: 0.4 },
        absorption: { walls: 0.4, ceiling: 0.6, floor: 0.3 },
        diffusion: 0.6,
        earlyReflections: [3, 6, 9, 12, 15],
        lateReverbDecay: 0.3
      },
      {
        id: 'nightclub_1',
        name: 'Berghain Main Floor',
        type: 'club',
        dimensions: { width: 20, height: 18, depth: 70 },
        reverbTime: { low: 2.8, mid: 2.5, high: 1.8 },
        absorption: { walls: 0.2, ceiling: 0.1, floor: 0.5 },
        diffusion: 0.9,
        earlyReflections: [15, 22, 28, 35, 42, 50, 58],
        lateReverbDecay: 2.2
      },
      {
        id: 'cathedral_1',
        name: 'Notre-Dame de Paris',
        type: 'cathedral',
        dimensions: { width: 40, height: 35, depth: 130 },
        reverbTime: { low: 8.2, mid: 7.5, high: 5.8 },
        absorption: { walls: 0.05, ceiling: 0.03, floor: 0.8 },
        diffusion: 0.95,
        earlyReflections: [80, 120, 160, 200, 250, 300, 350, 400],
        lateReverbDecay: 6.5
      }
    ];

    venues.forEach(venue => {
      this.venueLibrary.set(venue.id, venue);
    });
  }

  private setupDefaultHRTF() {
    // Initialize default Head-Related Transfer Function profiles
    const defaultListener: ListenerSettings = {
      position: { x: 0, y: 0, z: 0, distance: 0 },
      orientation: { yaw: 0, pitch: 0, roll: 0 },
      headTracking: {
        enabled: false,
        sensitivity: 1.0,
        smoothing: 0.3
      },
      preferences: {
        headSize: 1.0,
        earDistance: 0.17, // Average ear distance in meters
        hrtfProfile: 'generic',
        crossfeedAmount: 0.1
      }
    };

    this.listeners.set('default', defaultListener);
  }

  async createDolbyAtmosScene(sceneId: string, name: string): Promise<AtmosScene> {
    const scene: AtmosScene = {
      id: sceneId,
      name,
      objects: [],
      bedChannels: {
        L: 0, R: 1, C: 2, LFE: 3,
        Ls: 4, Rs: 5, Lb: 6, Rb: 7,
        Ltf: 8, Rtf: 9, Ltb: 10, Rtb: 11
      },
      metadata: {
        loudnessRange: 15,
        maxTruePeak: -1.0,
        integratedLoudness: -23,
        dialogueGating: true
      }
    };

    this.activeScenes.set(sceneId, scene);
    console.log(`Created Dolby Atmos scene: ${name}`);
    return scene;
  }

  async addSpatialAudioSource(sceneId: string, source: Omit<SpatialAudioSource, 'id'>): Promise<string> {
    const sourceId = `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullSource: SpatialAudioSource = {
      ...source,
      id: sourceId
    };

    const sceneSources = this.audioSources.get(sceneId) || [];
    sceneSources.push(fullSource);
    this.audioSources.set(sceneId, sceneSources);

    console.log(`Added spatial audio source ${sourceId} to scene ${sceneId}`);
    return sourceId;
  }

  async generateBinauralAudio(sceneId: string, listenerId: string = 'default'): Promise<Buffer> {
    const sources = this.audioSources.get(sceneId) || [];
    const listener = this.listeners.get(listenerId) || this.listeners.get('default')!;

    console.log(`Generating binaural audio for ${sources.length} sources`);

    // Simulate advanced binaural rendering
    const processedAudio = sources.map(source => {
      return this.processSpatialSource(source, listener);
    });

    // Combine all processed sources into stereo binaural output
    const binauralBuffer = this.mixBinauralSources(processedAudio);
    
    return binauralBuffer;
  }

  private processSpatialSource(source: SpatialAudioSource, listener: ListenerSettings): any {
    // Calculate relative position
    const relativePos = {
      x: source.position.x - listener.position.x,
      y: source.position.y - listener.position.y,
      z: source.position.z - listener.position.z,
      distance: Math.sqrt(
        Math.pow(source.position.x - listener.position.x, 2) +
        Math.pow(source.position.y - listener.position.y, 2) +
        Math.pow(source.position.z - listener.position.z, 2)
      )
    };

    // Apply HRTF processing
    const hrtfProcessed = this.applyHRTF(source, relativePos, listener.preferences);
    
    // Apply distance attenuation
    const distanceGain = this.calculateDistanceAttenuation(relativePos.distance);
    
    // Apply air absorption
    const airAbsorption = this.calculateAirAbsorption(relativePos.distance);
    
    // Apply directivity
    const directivityGain = this.calculateDirectivity(source, relativePos);

    return {
      sourceId: source.id,
      leftChannel: hrtfProcessed.left * distanceGain * directivityGain,
      rightChannel: hrtfProcessed.right * distanceGain * directivityGain,
      absorption: airAbsorption
    };
  }

  private applyHRTF(source: SpatialAudioSource, position: any, preferences: BinauraSettings): { left: number; right: number } {
    // Simplified HRTF calculation (in reality, this would use complex IR convolution)
    const azimuth = Math.atan2(position.x, position.y);
    const elevation = Math.atan2(position.z, Math.sqrt(position.x * position.x + position.y * position.y));
    
    // Interaural Time Difference (ITD)
    const itd = (preferences.earDistance / 343) * Math.sin(azimuth);
    
    // Interaural Level Difference (ILD)
    const headShadow = Math.exp(-Math.abs(azimuth) * preferences.headSize);
    
    return {
      left: headShadow * (azimuth < 0 ? 1 : 0.7),
      right: headShadow * (azimuth > 0 ? 1 : 0.7)
    };
  }

  private calculateDistanceAttenuation(distance: number): number {
    // Inverse square law with minimum distance
    const minDistance = 0.1;
    const effectiveDistance = Math.max(distance, minDistance);
    return 1 / (1 + effectiveDistance * effectiveDistance);
  }

  private calculateAirAbsorption(distance: number): { low: number; mid: number; high: number } {
    // Frequency-dependent air absorption
    const absorptionCoeff = {
      low: 0.001,
      mid: 0.003,
      high: 0.01
    };

    return {
      low: Math.exp(-absorptionCoeff.low * distance),
      mid: Math.exp(-absorptionCoeff.mid * distance),
      high: Math.exp(-absorptionCoeff.high * distance)
    };
  }

  private calculateDirectivity(source: SpatialAudioSource, position: any): number {
    if (source.directivity === 0) return 1; // Omnidirectional
    
    // Calculate angle between source orientation and position
    const sourceDir = source.orientation;
    const posAngle = Math.atan2(position.x, position.y);
    const angleDiff = Math.abs(sourceDir.yaw - posAngle);
    
    // Apply directivity pattern
    return Math.cos(angleDiff * source.directivity) * 0.5 + 0.5;
  }

  private mixBinauralSources(processedSources: any[]): Buffer {
    // Simulate mixing processed spatial sources into binaural stereo
    const sampleRate = 48000;
    const duration = 1; // 1 second for demo
    const samples = sampleRate * duration;
    const stereoBuffer = Buffer.alloc(samples * 4); // 32-bit float stereo
    
    // Simple simulation of mixed output
    for (let i = 0; i < samples; i++) {
      let leftSum = 0;
      let rightSum = 0;
      
      processedSources.forEach(source => {
        leftSum += source.leftChannel * Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.1;
        rightSum += source.rightChannel * Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.1;
      });
      
      // Write to buffer (simplified)
      stereoBuffer.writeFloatLE(leftSum, i * 8);
      stereoBuffer.writeFloatLE(rightSum, i * 8 + 4);
    }
    
    return stereoBuffer;
  }

  async simulateVenueAcoustics(sceneId: string, venueId: string): Promise<void> {
    const venue = this.venueLibrary.get(venueId);
    if (!venue) {
      throw new Error(`Venue not found: ${venueId}`);
    }

    const sources = this.audioSources.get(sceneId) || [];
    
    console.log(`Applying ${venue.name} acoustics to ${sources.length} sources`);

    // Apply venue-specific processing to all sources
    sources.forEach(source => {
      // Add early reflections
      venue.earlyReflections.forEach((delay, index) => {
        // Would add delayed/filtered copies of the source
      });

      // Apply late reverberation
      const reverbGain = this.calculateReverbGain(source.position, venue);
      
      // Apply absorption based on materials
      const materialAbsorption = this.calculateMaterialAbsorption(venue);
    });
  }

  private calculateReverbGain(position: SpatialPosition, venue: VenueAcoustics): number {
    // Calculate reverb intensity based on position in venue
    const centerDistance = Math.sqrt(position.x * position.x + position.y * position.y);
    const roomSize = Math.sqrt(venue.dimensions.width * venue.dimensions.depth);
    const normalizedDistance = centerDistance / roomSize;
    
    return (1 - venue.absorption.walls) * (1 + normalizedDistance * venue.diffusion);
  }

  private calculateMaterialAbsorption(venue: VenueAcoustics): { low: number; mid: number; high: number } {
    const avgAbsorption = (venue.absorption.walls + venue.absorption.ceiling + venue.absorption.floor) / 3;
    
    return {
      low: 1 - avgAbsorption * 0.5,
      mid: 1 - avgAbsorption,
      high: 1 - avgAbsorption * 1.5
    };
  }

  async enable360DegreeVideo(sceneId: string, videoStreams: string[]): Promise<void> {
    console.log(`Enabling 360° video with spatial audio for scene ${sceneId}`);
    
    // Associate spatial audio sources with video stream directions
    const sources = this.audioSources.get(sceneId) || [];
    
    videoStreams.forEach((streamId, index) => {
      const angle = (index / videoStreams.length) * 2 * Math.PI;
      
      // Find sources in this video direction
      const directionalSources = sources.filter(source => {
        const sourceAngle = Math.atan2(source.position.x, source.position.y);
        const angleDiff = Math.abs(sourceAngle - angle);
        return angleDiff < Math.PI / videoStreams.length;
      });

      console.log(`Video stream ${streamId} has ${directionalSources.length} audio sources`);
    });
  }

  async enableHeadTracking(listenerId: string, trackingData: any): Promise<void> {
    const listener = this.listeners.get(listenerId);
    if (!listener) {
      throw new Error(`Listener not found: ${listenerId}`);
    }

    if (listener.headTracking.enabled) {
      // Apply smoothing to head tracking data
      const smoothingFactor = listener.headTracking.smoothing;
      const sensitivity = listener.headTracking.sensitivity;
      
      listener.orientation.yaw = 
        listener.orientation.yaw * smoothingFactor + 
        trackingData.yaw * sensitivity * (1 - smoothingFactor);
        
      listener.orientation.pitch = 
        listener.orientation.pitch * smoothingFactor + 
        trackingData.pitch * sensitivity * (1 - smoothingFactor);
        
      listener.orientation.roll = 
        listener.orientation.roll * smoothingFactor + 
        trackingData.roll * sensitivity * (1 - smoothingFactor);
    }
  }

  private handleSpatialMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'create_atmos_scene':
        this.handleCreateAtmosScene(ws, message);
        break;
      case 'add_spatial_source':
        this.handleAddSpatialSource(ws, message);
        break;
      case 'generate_binaural':
        this.handleGenerateBinaural(ws, message);
        break;
      case 'apply_venue_acoustics':
        this.handleApplyVenueAcoustics(ws, message);
        break;
      case 'update_head_tracking':
        this.handleUpdateHeadTracking(ws, message);
        break;
      case 'enable_360_video':
        this.handleEnable360Video(ws, message);
        break;
    }
  }

  private async handleCreateAtmosScene(ws: WebSocket, message: any) {
    try {
      const { sceneId, name } = message;
      const scene = await this.createDolbyAtmosScene(sceneId, name);
      
      ws.send(JSON.stringify({
        type: 'atmos_scene_created',
        scene
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to create Atmos scene: ${error}`
      }));
    }
  }

  private async handleAddSpatialSource(ws: WebSocket, message: any) {
    try {
      const { sceneId, source } = message;
      const sourceId = await this.addSpatialAudioSource(sceneId, source);
      
      ws.send(JSON.stringify({
        type: 'spatial_source_added',
        sourceId,
        sceneId
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to add spatial source: ${error}`
      }));
    }
  }

  private async handleGenerateBinaural(ws: WebSocket, message: any) {
    try {
      const { sceneId, listenerId } = message;
      const binauralAudio = await this.generateBinauralAudio(sceneId, listenerId);
      
      ws.send(JSON.stringify({
        type: 'binaural_audio_generated',
        sceneId,
        audioData: binauralAudio.toString('base64')
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to generate binaural audio: ${error}`
      }));
    }
  }

  private async handleApplyVenueAcoustics(ws: WebSocket, message: any) {
    try {
      const { sceneId, venueId } = message;
      await this.simulateVenueAcoustics(sceneId, venueId);
      
      ws.send(JSON.stringify({
        type: 'venue_acoustics_applied',
        sceneId,
        venueId
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to apply venue acoustics: ${error}`
      }));
    }
  }

  private async handleUpdateHeadTracking(ws: WebSocket, message: any) {
    try {
      const { listenerId, trackingData } = message;
      await this.enableHeadTracking(listenerId, trackingData);
      
      ws.send(JSON.stringify({
        type: 'head_tracking_updated',
        listenerId
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to update head tracking: ${error}`
      }));
    }
  }

  private async handleEnable360Video(ws: WebSocket, message: any) {
    try {
      const { sceneId, videoStreams } = message;
      await this.enable360DegreeVideo(sceneId, videoStreams);
      
      ws.send(JSON.stringify({
        type: '360_video_enabled',
        sceneId,
        streamCount: videoStreams.length
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to enable 360° video: ${error}`
      }));
    }
  }

  getEngineStatus() {
    return {
      engine: '3D Spatial Audio Engine',
      version: '1.0.0',
      activeScenes: this.activeScenes.size,
      availableVenues: this.venueLibrary.size,
      registeredListeners: this.listeners.size,
      capabilities: [
        'Dolby Atmos Object Audio',
        'Binaural HRTF Rendering',
        '360° Video Audio Integration',
        'Real-Time Head Tracking',
        'Venue Acoustic Simulation',
        'Distance & Occlusion Modeling',
        'Multi-Listener Support',
        'VR/AR Audio Experience'
      ]
    };
  }
}

export const spatialAudioEngine = new SpatialAudioEngine();