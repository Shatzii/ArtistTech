import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs/promises';
import path from 'path';

// MIDI Controller Support Engine with hardware integration
// Supports professional MIDI controllers, hardware surfaces, and advanced expression

interface MIDIDevice {
  id: string;
  name: string;
  manufacturer: string;
  type: 'controller' | 'keyboard' | 'drum_pad' | 'fader_bank' | 'transport';
  inputs: number;
  outputs: number;
  connected: boolean;
  lastActivity: Date;
  capabilities: MIDICapability[];
  presets: MIDIPreset[];
}

interface MIDICapability {
  type: 'note' | 'cc' | 'pitchbend' | 'aftertouch' | 'program_change' | 'sysex';
  channel?: number;
  range?: { min: number; max: number };
  resolution?: number;
}

interface MIDIPreset {
  id: string;
  name: string;
  deviceId: string;
  mappings: MIDIMapping[];
  scenes: MIDIScene[];
  bankSelect?: number;
  programChange?: number;
}

interface MIDIMapping {
  id: string;
  midiCC: number;
  midiChannel: number;
  targetType: 'mixer' | 'effect' | 'transport' | 'ai_engine' | 'custom';
  targetParameter: string;
  valueMapping: ValueMapping;
  feedbackEnabled: boolean;
  feedbackColor?: string;
}

interface ValueMapping {
  inputMin: number;
  inputMax: number;
  outputMin: number;
  outputMax: number;
  curve: 'linear' | 'logarithmic' | 'exponential' | 'custom';
  steps?: number;
}

interface MIDIScene {
  id: string;
  name: string;
  mappings: MIDIMapping[];
  parameters: Record<string, any>;
  aiEngineStates: Record<string, any>;
}

interface MIDIMessage {
  type: 'note_on' | 'note_off' | 'cc' | 'pitchbend' | 'aftertouch' | 'program_change' | 'sysex';
  channel: number;
  note?: number;
  velocity?: number;
  controller?: number;
  value: number;
  timestamp: number;
  deviceId: string;
}

interface HardwareProfile {
  manufacturer: string;
  model: string;
  controls: HardwareControl[];
  displays: HardwareDisplay[];
  feedback: FeedbackCapability[];
  presets: MIDIPreset[];
}

interface HardwareControl {
  id: string;
  type: 'fader' | 'knob' | 'button' | 'pad' | 'encoder' | 'jog_wheel';
  position: { x: number; y: number };
  size: { width: number; height: number };
  midiCC: number;
  midiChannel: number;
  hasLED: boolean;
  hasTouchSensitivity: boolean;
  motorized?: boolean;
}

interface HardwareDisplay {
  type: 'lcd' | 'oled' | 'led_ring' | 'led_strip';
  resolution?: { width: number; height: number };
  color: boolean;
  characters?: number;
  position: { x: number; y: number };
}

interface FeedbackCapability {
  type: 'led' | 'motor_fader' | 'display' | 'vibration';
  colors?: string[];
  brightness?: boolean;
  animation?: boolean;
}

export class MIDIControllerEngine {
  private midiWSS?: WebSocketServer;
  private connectedDevices: Map<string, MIDIDevice> = new Map();
  private activePresets: Map<string, MIDIPreset> = new Map();
  private hardwareProfiles: Map<string, HardwareProfile> = new Map();
  private messageMappings: Map<string, MIDIMapping> = new Map();
  private feedbackQueue: Map<string, any[]> = new Map();
  private recordingMode: boolean = false;
  private recordedMessages: MIDIMessage[] = [];

  constructor() {
    this.initializeEngine();
  }

  private async initializeEngine() {
    await this.loadHardwareProfiles();
    this.setupMIDIServer();
    this.initializeDefaultMappings();
    this.startMIDIScanning();
    
    console.log('MIDI Controller Engine initialized');
  }

  private async loadHardwareProfiles() {
    // Load support for popular MIDI controllers
    const profiles = [
      this.createAkaiMPKProfile(),
      this.createNovationLaunchpadProfile(),
      this.createArturiaKeylabProfile(),
      this.createNativeInstrumentsMaschineProfile(),
      this.createBehringerX32Profile(),
      this.createAllenHeathQUProfile(),
      this.createPioneerDDJProfile(),
      this.createAbilityPushProfile()
    ];

    for (const profile of profiles) {
      this.hardwareProfiles.set(`${profile.manufacturer}_${profile.model}`, profile);
    }

    console.log(`Loaded ${profiles.length} hardware controller profiles`);
  }

  private createAkaiMPKProfile(): HardwareProfile {
    return {
      manufacturer: 'Akai',
      model: 'MPK_Mini_MK3',
      controls: [
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `pad_${i + 1}`,
          type: 'pad' as const,
          position: { x: 50 + (i % 4) * 40, y: 100 + Math.floor(i / 4) * 40 },
          size: { width: 35, height: 35 },
          midiCC: 0,
          midiChannel: 10, // Drum channel
          hasLED: true,
          hasTouchSensitivity: true
        })),
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `knob_${i + 1}`,
          type: 'knob' as const,
          position: { x: 50 + i * 40, y: 50 },
          size: { width: 30, height: 30 },
          midiCC: 70 + i,
          midiChannel: 1,
          hasLED: false,
          hasTouchSensitivity: false
        }))
      ],
      displays: [],
      feedback: [
        { type: 'led', colors: ['red', 'green', 'blue'], brightness: true, animation: false }
      ],
      presets: []
    };
  }

  private createNovationLaunchpadProfile(): HardwareProfile {
    return {
      manufacturer: 'Novation',
      model: 'Launchpad_Pro_MK3',
      controls: [
        ...Array.from({ length: 64 }, (_, i) => ({
          id: `pad_${i + 1}`,
          type: 'pad' as const,
          position: { x: 50 + (i % 8) * 40, y: 50 + Math.floor(i / 8) * 40 },
          size: { width: 35, height: 35 },
          midiCC: 0,
          midiChannel: 1,
          hasLED: true,
          hasTouchSensitivity: true
        })),
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `side_button_${i + 1}`,
          type: 'button' as const,
          position: { x: 400, y: 50 + i * 40 },
          size: { width: 30, height: 30 },
          midiCC: 89 + i,
          midiChannel: 1,
          hasLED: true,
          hasTouchSensitivity: false
        }))
      ],
      displays: [],
      feedback: [
        { type: 'led', colors: ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white'], brightness: true, animation: true }
      ],
      presets: []
    };
  }

  private createArturiaKeylabProfile(): HardwareProfile {
    return {
      manufacturer: 'Arturia',
      model: 'Keylab_Essential_88',
      controls: [
        ...Array.from({ length: 9 }, (_, i) => ({
          id: `fader_${i + 1}`,
          type: 'fader' as const,
          position: { x: 50 + i * 60, y: 100 },
          size: { width: 30, height: 100 },
          midiCC: 73 + i,
          midiChannel: 1,
          hasLED: false,
          hasTouchSensitivity: true,
          motorized: false
        })),
        ...Array.from({ length: 9 }, (_, i) => ({
          id: `encoder_${i + 1}`,
          type: 'encoder' as const,
          position: { x: 50 + i * 60, y: 50 },
          size: { width: 40, height: 40 },
          midiCC: 74 + i,
          midiChannel: 1,
          hasLED: true,
          hasTouchSensitivity: false
        }))
      ],
      displays: [
        { type: 'lcd', resolution: { width: 128, height: 64 }, color: false, position: { x: 250, y: 20 } }
      ],
      feedback: [
        { type: 'led', colors: ['white'], brightness: true },
        { type: 'display', colors: ['white'] }
      ],
      presets: []
    };
  }

  private createNativeInstrumentsMaschineProfile(): HardwareProfile {
    return {
      manufacturer: 'Native Instruments',
      model: 'Maschine_MK3',
      controls: [
        ...Array.from({ length: 16 }, (_, i) => ({
          id: `pad_${i + 1}`,
          type: 'pad' as const,
          position: { x: 50 + (i % 4) * 50, y: 150 + Math.floor(i / 4) * 50 },
          size: { width: 45, height: 45 },
          midiCC: 0,
          midiChannel: 10,
          hasLED: true,
          hasTouchSensitivity: true
        })),
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `encoder_${i + 1}`,
          type: 'encoder' as const,
          position: { x: 50 + i * 40, y: 80 },
          size: { width: 35, height: 35 },
          midiCC: 16 + i,
          midiChannel: 1,
          hasLED: true,
          hasTouchSensitivity: true
        }))
      ],
      displays: [
        { type: 'oled', resolution: { width: 480, height: 272 }, color: true, position: { x: 150, y: 30 } },
        ...Array.from({ length: 8 }, (_, i) => ({
          type: 'oled' as const,
          resolution: { width: 58, height: 58 },
          color: true,
          position: { x: 50 + i * 40, y: 50 }
        }))
      ],
      feedback: [
        { type: 'led', colors: ['red', 'green', 'blue', 'white'], brightness: true, animation: true },
        { type: 'display', colors: ['full_color'] }
      ],
      presets: []
    };
  }

  private createBehringerX32Profile(): HardwareProfile {
    return {
      manufacturer: 'Behringer',
      model: 'X32_Producer',
      controls: [
        ...Array.from({ length: 16 }, (_, i) => ({
          id: `channel_fader_${i + 1}`,
          type: 'fader' as const,
          position: { x: 50 + i * 45, y: 300 },
          size: { width: 25, height: 120 },
          midiCC: 70 + i,
          midiChannel: 1,
          hasLED: false,
          hasTouchSensitivity: true,
          motorized: true
        })),
        ...Array.from({ length: 16 }, (_, i) => ({
          id: `channel_encoder_${i + 1}`,
          type: 'encoder' as const,
          position: { x: 50 + i * 45, y: 200 },
          size: { width: 30, height: 30 },
          midiCC: 16 + i,
          midiChannel: 1,
          hasLED: true,
          hasTouchSensitivity: false
        }))
      ],
      displays: [
        { type: 'lcd', resolution: { width: 800, height: 480 }, color: true, position: { x: 200, y: 50 } }
      ],
      feedback: [
        { type: 'motor_fader' },
        { type: 'led', colors: ['red', 'green', 'blue'], brightness: true },
        { type: 'display', colors: ['full_color'] }
      ],
      presets: []
    };
  }

  private createAllenHeathQUProfile(): HardwareProfile {
    return {
      manufacturer: 'Allen & Heath',
      model: 'QU_32',
      controls: [
        ...Array.from({ length: 24 }, (_, i) => ({
          id: `input_fader_${i + 1}`,
          type: 'fader' as const,
          position: { x: 50 + i * 30, y: 350 },
          size: { width: 25, height: 100 },
          midiCC: 70 + i,
          midiChannel: 1,
          hasLED: false,
          hasTouchSensitivity: false,
          motorized: false
        }))
      ],
      displays: [
        { type: 'lcd', resolution: { width: 800, height: 480 }, color: true, position: { x: 300, y: 100 } }
      ],
      feedback: [
        { type: 'led', colors: ['red', 'green'], brightness: true },
        { type: 'display', colors: ['full_color'] }
      ],
      presets: []
    };
  }

  private createPioneerDDJProfile(): HardwareProfile {
    return {
      manufacturer: 'Pioneer',
      model: 'DDJ_FLX4',
      controls: [
        // Left deck controls
        {
          id: 'left_jog_wheel',
          type: 'jog_wheel',
          position: { x: 100, y: 150 },
          size: { width: 80, height: 80 },
          midiCC: 1,
          midiChannel: 1,
          hasLED: true,
          hasTouchSensitivity: true
        },
        // Right deck controls
        {
          id: 'right_jog_wheel',
          type: 'jog_wheel',
          position: { x: 400, y: 150 },
          size: { width: 80, height: 80 },
          midiCC: 1,
          midiChannel: 2,
          hasLED: true,
          hasTouchSensitivity: true
        },
        // Crossfader
        {
          id: 'crossfader',
          type: 'fader',
          position: { x: 250, y: 300 },
          size: { width: 80, height: 20 },
          midiCC: 8,
          midiChannel: 1,
          hasLED: false,
          hasTouchSensitivity: false
        }
      ],
      displays: [],
      feedback: [
        { type: 'led', colors: ['red', 'green', 'blue'], brightness: true, animation: true }
      ],
      presets: []
    };
  }

  private createAbilityPushProfile(): HardwareProfile {
    return {
      manufacturer: 'Ableton',
      model: 'Push_3',
      controls: [
        ...Array.from({ length: 64 }, (_, i) => ({
          id: `pad_${i + 1}`,
          type: 'pad' as const,
          position: { x: 100 + (i % 8) * 45, y: 200 + Math.floor(i / 8) * 45 },
          size: { width: 40, height: 40 },
          midiCC: 36 + i,
          midiChannel: 1,
          hasLED: true,
          hasTouchSensitivity: true
        })),
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `encoder_${i + 1}`,
          type: 'encoder' as const,
          position: { x: 100 + i * 45, y: 100 },
          size: { width: 35, height: 35 },
          midiCC: 14 + i,
          midiChannel: 1,
          hasLED: true,
          hasTouchSensitivity: true
        }))
      ],
      displays: [
        { type: 'lcd', resolution: { width: 960, height: 160 }, color: true, position: { x: 200, y: 50 } }
      ],
      feedback: [
        { type: 'led', colors: ['red', 'green', 'blue', 'white'], brightness: true, animation: true },
        { type: 'display', colors: ['full_color'] }
      ],
      presets: []
    };
  }

  private setupMIDIServer() {
    this.midiWSS = new WebSocketServer({ port: 8085, path: '/midi-ws' });
    
    this.midiWSS.on('connection', (ws) => {
      console.log('MIDI controller client connected');
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMIDIMessage(ws, message);
        } catch (error) {
          console.error('MIDI message error:', error);
        }
      });

      // Send available devices on connection
      ws.send(JSON.stringify({
        type: 'available_devices',
        devices: Array.from(this.connectedDevices.values())
      }));
    });

    console.log('MIDI controller server started on port 8085');
  }

  private initializeDefaultMappings() {
    // Create default mappings for common DAW functions
    const defaultMappings = [
      this.createMixerMapping(),
      this.createTransportMapping(),
      this.createAIEngineMapping(),
      this.createEffectsMapping()
    ];

    defaultMappings.forEach(mapping => {
      this.messageMappings.set(mapping.id, mapping);
    });
  }

  private createMixerMapping(): MIDIMapping {
    return {
      id: 'default_volume',
      midiCC: 7,
      midiChannel: 1,
      targetType: 'mixer',
      targetParameter: 'master_volume',
      valueMapping: {
        inputMin: 0,
        inputMax: 127,
        outputMin: 0,
        outputMax: 1,
        curve: 'logarithmic'
      },
      feedbackEnabled: true,
      feedbackColor: 'blue'
    };
  }

  private createTransportMapping(): MIDIMapping {
    return {
      id: 'transport_play',
      midiCC: 118,
      midiChannel: 1,
      targetType: 'transport',
      targetParameter: 'play_pause',
      valueMapping: {
        inputMin: 0,
        inputMax: 127,
        outputMin: 0,
        outputMax: 1,
        curve: 'linear',
        steps: 2
      },
      feedbackEnabled: true,
      feedbackColor: 'green'
    };
  }

  private createAIEngineMapping(): MIDIMapping {
    return {
      id: 'ai_video_style',
      midiCC: 16,
      midiChannel: 1,
      targetType: 'ai_engine',
      targetParameter: 'video_generation_style',
      valueMapping: {
        inputMin: 0,
        inputMax: 127,
        outputMin: 0,
        outputMax: 3,
        curve: 'linear',
        steps: 4
      },
      feedbackEnabled: true,
      feedbackColor: 'purple'
    };
  }

  private createEffectsMapping(): MIDIMapping {
    return {
      id: 'reverb_wet',
      midiCC: 91,
      midiChannel: 1,
      targetType: 'effect',
      targetParameter: 'reverb_wet_level',
      valueMapping: {
        inputMin: 0,
        inputMax: 127,
        outputMin: 0,
        outputMax: 1,
        curve: 'linear'
      },
      feedbackEnabled: true,
      feedbackColor: 'cyan'
    };
  }

  private startMIDIScanning() {
    // Simulate MIDI device detection
    setInterval(() => {
      this.scanForMIDIDevices();
    }, 5000);
  }

  private async scanForMIDIDevices() {
    // Simulate device discovery
    const mockDevices = [
      {
        id: 'akai_mpk_mini_001',
        name: 'Akai MPK Mini MK3',
        manufacturer: 'Akai',
        type: 'controller' as const,
        inputs: 1,
        outputs: 1,
        connected: Math.random() > 0.3,
        lastActivity: new Date(),
        capabilities: [
          { type: 'note' as const, channel: 1, range: { min: 36, max: 51 } },
          { type: 'cc' as const, channel: 1, range: { min: 0, max: 127 } }
        ],
        presets: []
      }
    ];

    for (const deviceData of mockDevices) {
      if (!this.connectedDevices.has(deviceData.id) && deviceData.connected) {
        this.connectedDevices.set(deviceData.id, deviceData);
        this.onDeviceConnected(deviceData);
      } else if (this.connectedDevices.has(deviceData.id) && !deviceData.connected) {
        this.connectedDevices.delete(deviceData.id);
        this.onDeviceDisconnected(deviceData.id);
      }
    }
  }

  private onDeviceConnected(device: MIDIDevice) {
    console.log(`MIDI device connected: ${device.name}`);
    
    // Load appropriate hardware profile
    const profileKey = `${device.manufacturer}_${device.name.replace(/\s+/g, '_')}`;
    const profile = this.hardwareProfiles.get(profileKey);
    
    if (profile) {
      console.log(`Loaded hardware profile for ${device.name}`);
      this.loadDevicePresets(device.id, profile.presets);
    }

    // Notify connected clients
    this.broadcastToMIDIClients({
      type: 'device_connected',
      device
    });
  }

  private onDeviceDisconnected(deviceId: string) {
    console.log(`MIDI device disconnected: ${deviceId}`);
    
    // Notify connected clients
    this.broadcastToMIDIClients({
      type: 'device_disconnected',
      deviceId
    });
  }

  private loadDevicePresets(deviceId: string, presets: MIDIPreset[]) {
    for (const preset of presets) {
      this.activePresets.set(`${deviceId}_${preset.id}`, preset);
    }
  }

  private handleMIDIMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'midi_input':
        this.processMIDIInput(message.data);
        break;
      case 'create_mapping':
        this.createCustomMapping(message.mapping);
        break;
      case 'load_preset':
        this.loadPreset(message.deviceId, message.presetId);
        break;
      case 'save_preset':
        this.savePreset(message.preset);
        break;
      case 'start_learning':
        this.startMIDILearning(message.targetParameter);
        break;
      case 'stop_learning':
        this.stopMIDILearning();
        break;
      case 'request_feedback':
        this.sendFeedbackToDevice(message.deviceId, message.feedback);
        break;
    }
  }

  private processMIDIInput(midiMessage: MIDIMessage) {
    // Record message if in recording mode
    if (this.recordingMode) {
      this.recordedMessages.push(midiMessage);
    }

    // Find mapping for this MIDI message
    const mapping = this.findMappingForMessage(midiMessage);
    
    if (mapping) {
      // Apply value transformation
      const transformedValue = this.transformValue(midiMessage.value, mapping.valueMapping);
      
      // Route to appropriate target
      this.routeToTarget(mapping, transformedValue);
      
      // Send feedback if enabled
      if (mapping.feedbackEnabled) {
        this.sendFeedbackToDevice(midiMessage.deviceId, {
          type: 'led',
          color: mapping.feedbackColor,
          value: transformedValue
        });
      }
    }

    // Broadcast to connected clients
    this.broadcastToMIDIClients({
      type: 'midi_message',
      message: midiMessage,
      mapping: mapping?.id
    });
  }

  private findMappingForMessage(message: MIDIMessage): MIDIMapping | undefined {
    return Array.from(this.messageMappings.values()).find(mapping => 
      mapping.midiCC === (message.controller || message.note) &&
      mapping.midiChannel === message.channel
    );
  }

  private transformValue(inputValue: number, mapping: ValueMapping): number {
    const normalized = (inputValue - mapping.inputMin) / (mapping.inputMax - mapping.inputMin);
    
    let curved: number;
    switch (mapping.curve) {
      case 'logarithmic':
        curved = Math.log(1 + normalized * 9) / Math.log(10);
        break;
      case 'exponential':
        curved = Math.pow(normalized, 2);
        break;
      default:
        curved = normalized;
    }
    
    if (mapping.steps) {
      curved = Math.floor(curved * mapping.steps) / mapping.steps;
    }
    
    return mapping.outputMin + curved * (mapping.outputMax - mapping.outputMin);
  }

  private routeToTarget(mapping: MIDIMapping, value: number) {
    switch (mapping.targetType) {
      case 'mixer':
        this.handleMixerControl(mapping.targetParameter, value);
        break;
      case 'transport':
        this.handleTransportControl(mapping.targetParameter, value);
        break;
      case 'ai_engine':
        this.handleAIEngineControl(mapping.targetParameter, value);
        break;
      case 'effect':
        this.handleEffectControl(mapping.targetParameter, value);
        break;
      case 'custom':
        this.handleCustomControl(mapping.targetParameter, value);
        break;
    }
  }

  private handleMixerControl(parameter: string, value: number) {
    // Route to audio engine
    console.log(`Mixer control: ${parameter} = ${value}`);
    
    // In production, this would integrate with the neural audio engine
    this.broadcastToMIDIClients({
      type: 'mixer_update',
      parameter,
      value
    });
  }

  private handleTransportControl(parameter: string, value: number) {
    console.log(`Transport control: ${parameter} = ${value}`);
    
    switch (parameter) {
      case 'play_pause':
        const action = value > 0.5 ? 'play' : 'pause';
        this.broadcastToMIDIClients({
          type: 'transport_command',
          action
        });
        break;
      case 'stop':
        this.broadcastToMIDIClients({
          type: 'transport_command',
          action: 'stop'
        });
        break;
      case 'record':
        const recording = value > 0.5;
        this.setRecordingMode(recording);
        break;
    }
  }

  private handleAIEngineControl(parameter: string, value: number) {
    console.log(`AI Engine control: ${parameter} = ${value}`);
    
    switch (parameter) {
      case 'video_generation_style':
        const styles = ['cinematic', 'realistic', 'artistic', 'documentary'];
        const styleIndex = Math.floor(value * (styles.length - 1));
        this.broadcastToMIDIClients({
          type: 'ai_parameter_update',
          engine: 'video',
          parameter: 'style',
          value: styles[styleIndex]
        });
        break;
      case 'audio_generation_intensity':
        this.broadcastToMIDIClients({
          type: 'ai_parameter_update',
          engine: 'audio',
          parameter: 'intensity',
          value
        });
        break;
    }
  }

  private handleEffectControl(parameter: string, value: number) {
    console.log(`Effect control: ${parameter} = ${value}`);
    
    this.broadcastToMIDIClients({
      type: 'effect_update',
      parameter,
      value
    });
  }

  private handleCustomControl(parameter: string, value: number) {
    console.log(`Custom control: ${parameter} = ${value}`);
    
    this.broadcastToMIDIClients({
      type: 'custom_parameter',
      parameter,
      value
    });
  }

  private createCustomMapping(mappingData: any): MIDIMapping {
    const mapping: MIDIMapping = {
      id: `custom_${Date.now()}`,
      ...mappingData
    };
    
    this.messageMappings.set(mapping.id, mapping);
    
    console.log(`Created custom MIDI mapping: ${mapping.id}`);
    return mapping;
  }

  private loadPreset(deviceId: string, presetId: string) {
    const preset = this.activePresets.get(`${deviceId}_${presetId}`);
    
    if (preset) {
      // Clear existing mappings for this device
      const deviceMappings = Array.from(this.messageMappings.entries())
        .filter(([_, mapping]) => mapping.id.startsWith(deviceId));
      
      deviceMappings.forEach(([id, _]) => {
        this.messageMappings.delete(id);
      });
      
      // Load preset mappings
      preset.mappings.forEach(mapping => {
        this.messageMappings.set(mapping.id, mapping);
      });
      
      console.log(`Loaded preset ${preset.name} for device ${deviceId}`);
      
      this.broadcastToMIDIClients({
        type: 'preset_loaded',
        deviceId,
        preset
      });
    }
  }

  private savePreset(preset: MIDIPreset) {
    this.activePresets.set(`${preset.deviceId}_${preset.id}`, preset);
    
    console.log(`Saved preset ${preset.name}`);
    
    this.broadcastToMIDIClients({
      type: 'preset_saved',
      preset
    });
  }

  private startMIDILearning(targetParameter: string) {
    console.log(`Starting MIDI learn for parameter: ${targetParameter}`);
    
    this.broadcastToMIDIClients({
      type: 'midi_learn_started',
      targetParameter
    });
  }

  private stopMIDILearning() {
    console.log('Stopping MIDI learn');
    
    this.broadcastToMIDIClients({
      type: 'midi_learn_stopped'
    });
  }

  private sendFeedbackToDevice(deviceId: string, feedback: any) {
    const device = this.connectedDevices.get(deviceId);
    if (!device) return;
    
    // Queue feedback for device
    if (!this.feedbackQueue.has(deviceId)) {
      this.feedbackQueue.set(deviceId, []);
    }
    
    this.feedbackQueue.get(deviceId)!.push(feedback);
    
    // Process feedback queue
    this.processFeedbackQueue(deviceId);
  }

  private processFeedbackQueue(deviceId: string) {
    const queue = this.feedbackQueue.get(deviceId);
    if (!queue || queue.length === 0) return;
    
    const feedback = queue.shift()!;
    
    // Send feedback to device
    this.broadcastToMIDIClients({
      type: 'device_feedback',
      deviceId,
      feedback
    });
  }

  private setRecordingMode(recording: boolean) {
    this.recordingMode = recording;
    
    if (recording) {
      this.recordedMessages = [];
      console.log('Started MIDI recording');
    } else {
      console.log(`Stopped MIDI recording. Recorded ${this.recordedMessages.length} messages`);
    }
    
    this.broadcastToMIDIClients({
      type: 'recording_state',
      recording,
      messageCount: this.recordedMessages.length
    });
  }

  private broadcastToMIDIClients(message: any) {
    if (this.midiWSS) {
      this.midiWSS.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  // Public API methods
  async getConnectedDevices(): Promise<MIDIDevice[]> {
    return Array.from(this.connectedDevices.values());
  }

  async getAvailableProfiles(): Promise<string[]> {
    return Array.from(this.hardwareProfiles.keys());
  }

  async exportMappings(deviceId?: string): Promise<any> {
    const mappings = Array.from(this.messageMappings.entries());
    
    if (deviceId) {
      return mappings.filter(([id, _]) => id.startsWith(deviceId));
    }
    
    return mappings;
  }

  async importMappings(mappings: [string, MIDIMapping][]): Promise<void> {
    mappings.forEach(([id, mapping]) => {
      this.messageMappings.set(id, mapping);
    });
    
    console.log(`Imported ${mappings.length} MIDI mappings`);
  }

  getEngineStatus() {
    return {
      connectedDevices: this.connectedDevices.size,
      activeMappings: this.messageMappings.size,
      activePresets: this.activePresets.size,
      supportedProfiles: this.hardwareProfiles.size,
      recordingMode: this.recordingMode,
      recordedMessages: this.recordedMessages.length,
      capabilities: [
        'Professional MIDI Controller Support',
        'Hardware-Specific Profiles',
        'Real-time MIDI Mapping',
        'Visual Feedback & Motor Faders',
        'AI Engine Integration',
        'Custom Preset Management',
        'MIDI Learn Functionality',
        'Multi-Device Synchronization'
      ]
    };
  }
}

export const midiControllerEngine = new MIDIControllerEngine();