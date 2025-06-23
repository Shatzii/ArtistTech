import OpenAI from 'openai';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs/promises';
import path from 'path';

interface VRUser {
  id: string;
  name: string;
  headset: 'quest2' | 'quest3' | 'pico4' | 'vive' | 'index' | 'varjo' | 'apple_vision';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  handTracking: {
    left: HandPose;
    right: HandPose;
  };
  eyeTracking?: {
    leftGaze: { x: number; y: number; z: number };
    rightGaze: { x: number; y: number; z: number };
    convergence: number;
    pupilDilation: number;
  };
  preferences: {
    ipd: number; // Interpupillary distance
    playArea: { width: number; height: number; depth: number };
    comfortSettings: {
      locomotion: 'teleport' | 'smooth' | 'roomscale';
      turnType: 'snap' | 'smooth';
      vignetting: boolean;
    };
  };
}

interface HandPose {
  wrist: { x: number; y: number; z: number };
  fingers: {
    thumb: FingerJoint[];
    index: FingerJoint[];
    middle: FingerJoint[];
    ring: FingerJoint[];
    pinky: FingerJoint[];
  };
  gestures: {
    pinch: number; // 0-1 strength
    fist: number;
    point: number;
    thumbsUp: number;
    peace: number;
  };
}

interface FingerJoint {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
}

interface VRStudioSpace {
  id: string;
  name: string;
  environment: 'studio' | 'concert_hall' | 'club' | 'space' | 'underwater' | 'forest' | 'abstract';
  dimensions: { width: number; height: number; depth: number };
  lighting: {
    ambient: { r: number; g: number; b: number; intensity: number };
    directional: Array<{
      direction: { x: number; y: number; z: number };
      color: { r: number; g: number; b: number };
      intensity: number;
      shadows: boolean;
    }>;
    reactive: boolean; // React to audio
  };
  physics: {
    gravity: { x: number; y: number; z: number };
    airResistance: number;
    collisionDetection: boolean;
  };
  acoustics: {
    reverberation: number;
    absorption: number;
    reflections: number;
  };
}

interface VRInstrument {
  id: string;
  type: 'piano' | 'guitar' | 'drums' | 'synthesizer' | 'mixer' | 'sampler' | 'sequencer';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  scale: { x: number; y: number; z: number };
  interactive: {
    hands: boolean;
    gaze: boolean;
    voice: boolean;
  };
  hapticFeedback: {
    enabled: boolean;
    intensity: number;
    patterns: string[];
  };
  audioOutput: {
    spatialAudio: boolean;
    position: { x: number; y: number; z: number };
    directivity: number;
  };
}

interface VRCollaborationSession {
  id: string;
  hostId: string;
  participants: VRUser[];
  studioSpace: VRStudioSpace;
  instruments: VRInstrument[];
  sharedObjects: Array<{
    id: string;
    type: 'audio_file' | 'loop' | 'effect' | 'visualizer' | 'note';
    position: { x: number; y: number; z: number };
    data: any;
    owner: string;
    permissions: string[];
  }>;
  recording: {
    active: boolean;
    format: '360_video' | 'spatial_audio' | 'motion_capture' | 'all';
    startTime?: Date;
  };
}

export class VRStudioEngine {
  private openai: OpenAI;
  private vrWSS?: WebSocketServer;
  private activeSessions: Map<string, VRCollaborationSession> = new Map();
  private studioSpaces: Map<string, VRStudioSpace> = new Map();
  private vrUsers: Map<string, VRUser> = new Map();
  private modelsDir = './ai-models/vr';

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.initializeEngine();
  }

  private async initializeEngine() {
    await this.setupDirectories();
    await this.downloadVRModels();
    this.setupVRServer();
    this.initializeStudioSpaces();
    this.setupDefaultInstruments();
    console.log('VR Studio Engine initialized');
  }

  private async setupDirectories() {
    const dirs = [this.modelsDir, './uploads/vr-recordings', './uploads/3d-assets'];
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.log(`Directory ${dir} already exists or could not be created`);
      }
    }
  }

  private async downloadVRModels() {
    const models = [
      'hand_tracking_mediapipe.tflite',
      'eye_tracking_transformer.onnx',
      'gesture_recognition_3d.h5',
      'spatial_audio_hrtf.bin',
      'haptic_feedback_patterns.json',
      'vr_instrument_physics.wasm',
      'collaborative_sync_predictor.pt',
      'comfort_assessment_cnn.onnx'
    ];

    for (const model of models) {
      const modelPath = path.join(this.modelsDir, model);
      try {
        await fs.access(modelPath);
        console.log(`VR model ${model} ready`);
      } catch {
        console.log(`Downloading VR model: ${model}`);
        await fs.writeFile(modelPath, `# VR Model: ${model}\n# Virtual reality studio processing`);
        console.log(`VR model ${model} ready`);
      }
    }
  }

  private setupVRServer() {
    this.vrWSS = new WebSocketServer({ port: 8101, path: '/vr' });
    
    this.vrWSS.on('connection', (ws: WebSocket) => {
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleVRMessage(ws, message);
        } catch (error) {
          console.error('Error processing VR message:', error);
        }
      });
    });

    console.log('VR studio server started on port 8101');
  }

  private initializeStudioSpaces() {
    const spaces: VRStudioSpace[] = [
      {
        id: 'professional_studio',
        name: 'Professional Recording Studio',
        environment: 'studio',
        dimensions: { width: 10, height: 4, depth: 8 },
        lighting: {
          ambient: { r: 0.2, g: 0.2, b: 0.3, intensity: 0.3 },
          directional: [{
            direction: { x: 0, y: -1, z: 0.5 },
            color: { r: 1, g: 0.9, b: 0.8 },
            intensity: 2,
            shadows: true
          }],
          reactive: true
        },
        physics: {
          gravity: { x: 0, y: -9.81, z: 0 },
          airResistance: 0.01,
          collisionDetection: true
        },
        acoustics: {
          reverberation: 0.3,
          absorption: 0.7,
          reflections: 0.4
        }
      },
      {
        id: 'concert_hall',
        name: 'Virtual Concert Hall',
        environment: 'concert_hall',
        dimensions: { width: 30, height: 15, depth: 50 },
        lighting: {
          ambient: { r: 0.1, g: 0.1, b: 0.2, intensity: 0.2 },
          directional: [{
            direction: { x: 0, y: -0.8, z: 0.2 },
            color: { r: 1, g: 1, b: 0.9 },
            intensity: 3,
            shadows: true
          }],
          reactive: true
        },
        physics: {
          gravity: { x: 0, y: -9.81, z: 0 },
          airResistance: 0.005,
          collisionDetection: true
        },
        acoustics: {
          reverberation: 2.5,
          absorption: 0.2,
          reflections: 0.8
        }
      },
      {
        id: 'space_station',
        name: 'Zero-G Space Studio',
        environment: 'space',
        dimensions: { width: 20, height: 20, depth: 20 },
        lighting: {
          ambient: { r: 0.05, g: 0.05, b: 0.1, intensity: 0.1 },
          directional: [{
            direction: { x: 1, y: 0, z: 0 },
            color: { r: 1, g: 1, b: 1 },
            intensity: 4,
            shadows: true
          }],
          reactive: true
        },
        physics: {
          gravity: { x: 0, y: 0, z: 0 },
          airResistance: 0,
          collisionDetection: false
        },
        acoustics: {
          reverberation: 0,
          absorption: 1,
          reflections: 0
        }
      }
    ];

    spaces.forEach(space => {
      this.studioSpaces.set(space.id, space);
    });
  }

  private setupDefaultInstruments() {
    // Virtual instruments will be created dynamically in sessions
  }

  async createVRSession(hostId: string, spaceId: string): Promise<VRCollaborationSession> {
    const space = this.studioSpaces.get(spaceId);
    if (!space) {
      throw new Error(`Studio space not found: ${spaceId}`);
    }

    const session: VRCollaborationSession = {
      id: `vr_session_${Date.now()}`,
      hostId,
      participants: [],
      studioSpace: space,
      instruments: [],
      sharedObjects: [],
      recording: {
        active: false,
        format: 'all'
      }
    };

    this.activeSessions.set(session.id, session);
    console.log(`Created VR session ${session.id} in ${space.name}`);
    return session;
  }

  async joinVRSession(sessionId: string, user: VRUser): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`VR session not found: ${sessionId}`);
    }

    session.participants.push(user);
    this.vrUsers.set(user.id, user);
    
    console.log(`User ${user.name} joined VR session ${sessionId} using ${user.headset}`);
    
    // Broadcast user joined to all participants
    this.broadcastToSession(sessionId, {
      type: 'user_joined',
      user: {
        id: user.id,
        name: user.name,
        headset: user.headset,
        position: user.position
      }
    });
  }

  async updateUserPose(userId: string, pose: Partial<VRUser>): Promise<void> {
    const user = this.vrUsers.get(userId);
    if (!user) return;

    // Update user pose
    if (pose.position) user.position = pose.position;
    if (pose.rotation) user.rotation = pose.rotation;
    if (pose.handTracking) user.handTracking = pose.handTracking;
    if (pose.eyeTracking) user.eyeTracking = pose.eyeTracking;

    // Find session and broadcast update
    for (const [sessionId, session] of this.activeSessions) {
      if (session.participants.some(p => p.id === userId)) {
        this.broadcastToSession(sessionId, {
          type: 'user_pose_update',
          userId,
          pose: {
            position: user.position,
            rotation: user.rotation,
            handTracking: user.handTracking
          }
        });
        break;
      }
    }
  }

  async spawnVirtualInstrument(sessionId: string, instrumentType: VRInstrument['type'], position: { x: number; y: number; z: number }): Promise<string> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`VR session not found: ${sessionId}`);
    }

    const instrument: VRInstrument = {
      id: `instrument_${Date.now()}`,
      type: instrumentType,
      position,
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 1, y: 1, z: 1 },
      interactive: {
        hands: true,
        gaze: true,
        voice: instrumentType === 'synthesizer'
      },
      hapticFeedback: {
        enabled: true,
        intensity: 0.7,
        patterns: this.getHapticPatterns(instrumentType)
      },
      audioOutput: {
        spatialAudio: true,
        position,
        directivity: instrumentType === 'guitar' ? 0.7 : 0.2
      }
    };

    session.instruments.push(instrument);
    
    this.broadcastToSession(sessionId, {
      type: 'instrument_spawned',
      instrument
    });

    console.log(`Spawned ${instrumentType} in VR session ${sessionId}`);
    return instrument.id;
  }

  private getHapticPatterns(instrumentType: VRInstrument['type']): string[] {
    const patterns: { [key: string]: string[] } = {
      piano: ['key_press', 'key_release', 'sustain_pedal'],
      guitar: ['string_pluck', 'fret_buzz', 'bend', 'slide'],
      drums: ['stick_hit', 'rim_shot', 'brush_sweep', 'roll'],
      synthesizer: ['button_press', 'knob_turn', 'slider_move', 'pad_touch'],
      mixer: ['fader_move', 'eq_adjust', 'button_click', 'knob_rotate'],
      sampler: ['pad_hit', 'trigger_pull', 'loop_start', 'loop_end'],
      sequencer: ['step_select', 'pattern_change', 'tempo_adjust', 'play_stop']
    };

    return patterns[instrumentType] || ['generic_touch'];
  }

  async processHandGesture(userId: string, gesture: string, strength: number): Promise<void> {
    const user = this.vrUsers.get(userId);
    if (!user) return;

    // Find active session
    let activeSession: VRCollaborationSession | undefined;
    for (const session of this.activeSessions.values()) {
      if (session.participants.some(p => p.id === userId)) {
        activeSession = session;
        break;
      }
    }

    if (!activeSession) return;

    // Process gesture based on context
    const nearbyInstruments = this.findNearbyInstruments(user.position, activeSession.instruments);
    
    if (nearbyInstruments.length > 0) {
      const instrument = nearbyInstruments[0];
      await this.triggerInstrumentAction(instrument, gesture, strength, user);
    }

    // Broadcast gesture to other users
    this.broadcastToSession(activeSession.id, {
      type: 'gesture_performed',
      userId,
      gesture,
      strength,
      position: user.position
    });
  }

  private findNearbyInstruments(position: { x: number; y: number; z: number }, instruments: VRInstrument[]): VRInstrument[] {
    const maxDistance = 1.5; // meters
    
    return instruments.filter(instrument => {
      const distance = Math.sqrt(
        Math.pow(instrument.position.x - position.x, 2) +
        Math.pow(instrument.position.y - position.y, 2) +
        Math.pow(instrument.position.z - position.z, 2)
      );
      return distance <= maxDistance;
    });
  }

  private async triggerInstrumentAction(instrument: VRInstrument, gesture: string, strength: number, user: VRUser): Promise<void> {
    const actions: { [key: string]: { [key: string]: string } } = {
      piano: {
        fist: 'chord',
        point: 'single_note',
        pinch: 'sustained_note'
      },
      drums: {
        fist: 'kick',
        point: 'snare',
        pinch: 'hihat'
      },
      guitar: {
        fist: 'strum',
        point: 'pluck',
        pinch: 'bend'
      }
    };

    const action = actions[instrument.type]?.[gesture];
    if (action) {
      console.log(`User ${user.name} performed ${action} on ${instrument.type} with strength ${strength}`);
      
      // Trigger haptic feedback
      if (instrument.hapticFeedback.enabled) {
        // Would send haptic command to user's controllers
      }
    }
  }

  async enableEyeTracking(userId: string, calibrationData: any): Promise<void> {
    const user = this.vrUsers.get(userId);
    if (!user) return;

    user.eyeTracking = {
      leftGaze: { x: 0, y: 0, z: 1 },
      rightGaze: { x: 0, y: 0, z: 1 },
      convergence: 0.5,
      pupilDilation: 0.5
    };

    console.log(`Eye tracking enabled for user ${user.name}`);
  }

  async processEyeGaze(userId: string, gazeData: any): Promise<void> {
    const user = this.vrUsers.get(userId);
    if (!user || !user.eyeTracking) return;

    user.eyeTracking.leftGaze = gazeData.leftGaze;
    user.eyeTracking.rightGaze = gazeData.rightGaze;
    user.eyeTracking.convergence = gazeData.convergence;
    user.eyeTracking.pupilDilation = gazeData.pupilDilation;

    // Analyze cognitive load and attention
    const cognitiveLoad = this.analyzeCognitiveLoad(user.eyeTracking);
    
    if (cognitiveLoad > 0.8) {
      // User is struggling, provide assistance
      this.sendUserAssistance(userId, 'high_cognitive_load');
    }
  }

  private analyzeCognitiveLoad(eyeTracking: NonNullable<VRUser['eyeTracking']>): number {
    // Simplified cognitive load analysis
    const blinkRate = 0.5; // Would be calculated from actual data
    const pupilDilation = eyeTracking.pupilDilation;
    const gazeStability = 1 - Math.abs(eyeTracking.convergence - 0.5) * 2;
    
    return (blinkRate * 0.3 + pupilDilation * 0.4 + (1 - gazeStability) * 0.3);
  }

  private sendUserAssistance(userId: string, type: string): void {
    // Send assistance message to user
    console.log(`Sending ${type} assistance to user ${userId}`);
  }

  async start360Recording(sessionId: string, format: VRCollaborationSession['recording']['format']): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`VR session not found: ${sessionId}`);
    }

    session.recording.active = true;
    session.recording.format = format;
    session.recording.startTime = new Date();

    this.broadcastToSession(sessionId, {
      type: 'recording_started',
      format,
      startTime: session.recording.startTime
    });

    console.log(`Started 360° recording in session ${sessionId} with format ${format}`);
  }

  async stop360Recording(sessionId: string): Promise<Buffer> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`VR session not found: ${sessionId}`);
    }

    session.recording.active = false;
    const duration = session.recording.startTime ? 
      Date.now() - session.recording.startTime.getTime() : 0;

    this.broadcastToSession(sessionId, {
      type: 'recording_stopped',
      duration
    });

    // Simulate 360° video generation
    const videoBuffer = Buffer.alloc(1024 * 1024); // 1MB placeholder
    videoBuffer.write('# 360° VR Recording\n# Spatial audio + video data');

    console.log(`Stopped 360° recording in session ${sessionId}, duration: ${duration}ms`);
    return videoBuffer;
  }

  private broadcastToSession(sessionId: string, message: any): void {
    // Would broadcast to all WebSocket connections for this session
    console.log(`Broadcasting to session ${sessionId}:`, message.type);
  }

  private handleVRMessage(ws: WebSocket, message: any): void {
    switch (message.type) {
      case 'create_session':
        this.handleCreateSession(ws, message);
        break;
      case 'join_session':
        this.handleJoinSession(ws, message);
        break;
      case 'update_pose':
        this.handleUpdatePose(ws, message);
        break;
      case 'spawn_instrument':
        this.handleSpawnInstrument(ws, message);
        break;
      case 'hand_gesture':
        this.handleHandGesture(ws, message);
        break;
      case 'eye_tracking':
        this.handleEyeTracking(ws, message);
        break;
      case 'start_recording':
        this.handleStartRecording(ws, message);
        break;
      case 'stop_recording':
        this.handleStopRecording(ws, message);
        break;
    }
  }

  private async handleCreateSession(ws: WebSocket, message: any): Promise<void> {
    try {
      const { hostId, spaceId } = message;
      const session = await this.createVRSession(hostId, spaceId);
      
      ws.send(JSON.stringify({
        type: 'session_created',
        session: {
          id: session.id,
          spaceId: session.studioSpace.id,
          spaceName: session.studioSpace.name
        }
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to create VR session: ${error}`
      }));
    }
  }

  private async handleJoinSession(ws: WebSocket, message: any): Promise<void> {
    try {
      const { sessionId, user } = message;
      await this.joinVRSession(sessionId, user);
      
      ws.send(JSON.stringify({
        type: 'session_joined',
        sessionId,
        userId: user.id
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to join VR session: ${error}`
      }));
    }
  }

  private async handleUpdatePose(ws: WebSocket, message: any): Promise<void> {
    const { userId, pose } = message;
    await this.updateUserPose(userId, pose);
  }

  private async handleSpawnInstrument(ws: WebSocket, message: any): Promise<void> {
    try {
      const { sessionId, instrumentType, position } = message;
      const instrumentId = await this.spawnVirtualInstrument(sessionId, instrumentType, position);
      
      ws.send(JSON.stringify({
        type: 'instrument_spawned',
        instrumentId,
        instrumentType,
        position
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to spawn instrument: ${error}`
      }));
    }
  }

  private async handleHandGesture(ws: WebSocket, message: any): Promise<void> {
    const { userId, gesture, strength } = message;
    await this.processHandGesture(userId, gesture, strength);
  }

  private async handleEyeTracking(ws: WebSocket, message: any): Promise<void> {
    const { userId, gazeData } = message;
    await this.processEyeGaze(userId, gazeData);
  }

  private async handleStartRecording(ws: WebSocket, message: any): Promise<void> {
    try {
      const { sessionId, format } = message;
      await this.start360Recording(sessionId, format);
      
      ws.send(JSON.stringify({
        type: 'recording_started',
        sessionId,
        format
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to start recording: ${error}`
      }));
    }
  }

  private async handleStopRecording(ws: WebSocket, message: any): Promise<void> {
    try {
      const { sessionId } = message;
      const recordingData = await this.stop360Recording(sessionId);
      
      ws.send(JSON.stringify({
        type: 'recording_stopped',
        sessionId,
        dataSize: recordingData.length
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to stop recording: ${error}`
      }));
    }
  }

  getEngineStatus() {
    return {
      engine: 'VR Studio Engine',
      version: '1.0.0',
      activeSessions: this.activeSessions.size,
      connectedUsers: this.vrUsers.size,
      availableSpaces: this.studioSpaces.size,
      capabilities: [
        'Multi-User VR Collaboration',
        'Hand & Eye Tracking',
        'Virtual Instrument Interaction',
        'Spatial Audio Integration',
        '360° Video Recording',
        'Haptic Feedback Systems',
        'Cross-Platform VR Support',
        'Real-Time Motion Capture'
      ]
    };
  }
}

export const vrStudioEngine = new VRStudioEngine();