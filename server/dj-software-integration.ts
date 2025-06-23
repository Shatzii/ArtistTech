import { WebSocketServer, WebSocket } from 'ws'
import { EventEmitter } from 'events'

interface DJSoftwareConfig {
  software: 'serato' | 'traktor' | 'mpc-beats' | 'virtual-dj'
  version: string
  midiMapping: MidiMapping
  features: SoftwareFeatures
}

interface MidiMapping {
  controller: string
  mappings: {
    [control: string]: {
      channel: number
      cc: number
      type: 'knob' | 'fader' | 'button' | 'jog'
      range: [number, number]
    }
  }
}

interface SoftwareFeatures {
  stemSeparation: boolean
  keyDetection: boolean
  bpmAnalysis: boolean
  looping: boolean
  hotCues: boolean
  effects: string[]
  samplerSlots: number
}

interface TrackMetadata {
  id: string
  title: string
  artist: string
  bpm: number
  key: string
  duration: number
  waveformData?: Float32Array
  cuePoints: number[]
  beatGrid: number[]
}

export class DJSoftwareIntegration extends EventEmitter {
  private wsServer?: WebSocketServer
  private connectedSoftware: Map<string, WebSocket> = new Map()
  private trackLibrary: Map<string, TrackMetadata> = new Map()
  private activeDecks: Map<string, TrackMetadata> = new Map()
  private midiControllers: Map<string, any> = new Map()

  // Software configurations
  private softwareConfigs: Map<string, DJSoftwareConfig> = new Map()

  constructor() {
    super()
    this.initializeSoftwareConfigs()
  }

  private initializeSoftwareConfigs() {
    // Serato DJ Pro Configuration
    this.softwareConfigs.set('serato', {
      software: 'serato',
      version: '3.1.0',
      midiMapping: {
        controller: 'serato-dj-controller',
        mappings: {
          'deck1_play': { channel: 0, cc: 1, type: 'button', range: [0, 127] },
          'deck1_cue': { channel: 0, cc: 2, type: 'button', range: [0, 127] },
          'deck1_jog': { channel: 0, cc: 3, type: 'jog', range: [-64, 63] },
          'deck1_pitch': { channel: 0, cc: 4, type: 'fader', range: [0, 127] },
          'deck1_volume': { channel: 0, cc: 5, type: 'fader', range: [0, 127] },
          'deck1_eq_high': { channel: 0, cc: 6, type: 'knob', range: [0, 127] },
          'deck1_eq_mid': { channel: 0, cc: 7, type: 'knob', range: [0, 127] },
          'deck1_eq_low': { channel: 0, cc: 8, type: 'knob', range: [0, 127] },
          'crossfader': { channel: 0, cc: 9, type: 'fader', range: [0, 127] }
        }
      },
      features: {
        stemSeparation: true,
        keyDetection: true,
        bpmAnalysis: true,
        looping: true,
        hotCues: true,
        effects: ['reverb', 'delay', 'filter', 'echo', 'flanger', 'gate'],
        samplerSlots: 16
      }
    })

    // Traktor Pro 3 Configuration
    this.softwareConfigs.set('traktor', {
      software: 'traktor',
      version: '3.11.0',
      midiMapping: {
        controller: 'traktor-kontrol',
        mappings: {
          'deck_a_play': { channel: 0, cc: 16, type: 'button', range: [0, 127] },
          'deck_a_cue': { channel: 0, cc: 17, type: 'button', range: [0, 127] },
          'deck_a_sync': { channel: 0, cc: 18, type: 'button', range: [0, 127] },
          'deck_a_jog_wheel': { channel: 0, cc: 19, type: 'jog', range: [-64, 63] },
          'deck_a_tempo': { channel: 0, cc: 20, type: 'fader', range: [0, 127] },
          'deck_a_volume': { channel: 0, cc: 21, type: 'fader', range: [0, 127] },
          'deck_a_filter': { channel: 0, cc: 22, type: 'knob', range: [0, 127] },
          'deck_a_eq_hi': { channel: 0, cc: 23, type: 'knob', range: [0, 127] },
          'deck_a_eq_mid': { channel: 0, cc: 24, type: 'knob', range: [0, 127] },
          'deck_a_eq_low': { channel: 0, cc: 25, type: 'knob', range: [0, 127] },
          'crossfader': { channel: 0, cc: 26, type: 'fader', range: [0, 127] }
        }
      },
      features: {
        stemSeparation: true,
        keyDetection: true,
        bpmAnalysis: true,
        looping: true,
        hotCues: true,
        effects: ['reverb', 'delay', 'filter', 'gater', 'delay_t3', 'reverb_t3', 'filter_lfo'],
        samplerSlots: 32
      }
    })

    // MPC Beats Configuration
    this.softwareConfigs.set('mpc-beats', {
      software: 'mpc-beats',
      version: '2.12.0',
      midiMapping: {
        controller: 'akai-mpc',
        mappings: {
          'pad_1': { channel: 9, cc: 36, type: 'button', range: [0, 127] },
          'pad_2': { channel: 9, cc: 37, type: 'button', range: [0, 127] },
          'pad_3': { channel: 9, cc: 38, type: 'button', range: [0, 127] },
          'pad_4': { channel: 9, cc: 39, type: 'button', range: [0, 127] },
          'pad_5': { channel: 9, cc: 40, type: 'button', range: [0, 127] },
          'pad_6': { channel: 9, cc: 41, type: 'button', range: [0, 127] },
          'pad_7': { channel: 9, cc: 42, type: 'button', range: [0, 127] },
          'pad_8': { channel: 9, cc: 43, type: 'button', range: [0, 127] },
          'pad_9': { channel: 9, cc: 44, type: 'button', range: [0, 127] },
          'pad_10': { channel: 9, cc: 45, type: 'button', range: [0, 127] },
          'pad_11': { channel: 9, cc: 46, type: 'button', range: [0, 127] },
          'pad_12': { channel: 9, cc: 47, type: 'button', range: [0, 127] },
          'pad_13': { channel: 9, cc: 48, type: 'button', range: [0, 127] },
          'pad_14': { channel: 9, cc: 49, type: 'button', range: [0, 127] },
          'pad_15': { channel: 9, cc: 50, type: 'button', range: [0, 127] },
          'pad_16': { channel: 9, cc: 51, type: 'button', range: [0, 127] },
          'q_link_1': { channel: 0, cc: 1, type: 'knob', range: [0, 127] },
          'q_link_2': { channel: 0, cc: 2, type: 'knob', range: [0, 127] },
          'q_link_3': { channel: 0, cc: 3, type: 'knob', range: [0, 127] },
          'q_link_4': { channel: 0, cc: 4, type: 'knob', range: [0, 127] }
        }
      },
      features: {
        stemSeparation: false,
        keyDetection: true,
        bpmAnalysis: true,
        looping: true,
        hotCues: false,
        effects: ['reverb', 'delay', 'chorus', 'phaser', 'filter', 'distortion'],
        samplerSlots: 16
      }
    })

    // Virtual DJ Configuration
    this.softwareConfigs.set('virtual-dj', {
      software: 'virtual-dj',
      version: '2024',
      midiMapping: {
        controller: 'virtual-dj-controller',
        mappings: {
          'deck1_play': { channel: 0, cc: 1, type: 'button', range: [0, 127] },
          'deck1_cue': { channel: 0, cc: 2, type: 'button', range: [0, 127] },
          'deck1_sync': { channel: 0, cc: 3, type: 'button', range: [0, 127] },
          'deck1_scratch': { channel: 0, cc: 4, type: 'jog', range: [-64, 63] },
          'deck1_pitch': { channel: 0, cc: 5, type: 'fader', range: [0, 127] },
          'deck1_volume': { channel: 0, cc: 6, type: 'fader', range: [0, 127] },
          'deck1_gain': { channel: 0, cc: 7, type: 'knob', range: [0, 127] },
          'deck1_eq_high': { channel: 0, cc: 8, type: 'knob', range: [0, 127] },
          'deck1_eq_mid': { channel: 0, cc: 9, type: 'knob', range: [0, 127] },
          'deck1_eq_low': { channel: 0, cc: 10, type: 'knob', range: [0, 127] },
          'crossfader': { channel: 0, cc: 11, type: 'fader', range: [0, 127] }
        }
      },
      features: {
        stemSeparation: true,
        keyDetection: true,
        bpmAnalysis: true,
        looping: true,
        hotCues: true,
        effects: ['reverb', 'delay', 'filter', 'echo', 'flanger', 'beatgrid', 'scratch'],
        samplerSlots: 12
      }
    })
  }

  async initialize() {
    // Initialize WebSocket server for software communication
    this.wsServer = new WebSocketServer({ port: 8095 })
    
    this.wsServer.on('connection', (ws, req) => {
      const softwareId = req.url?.split('/')?.[1] || 'unknown'
      
      console.log(`DJ Software connected: ${softwareId}`)
      this.connectedSoftware.set(softwareId, ws)

      ws.on('message', (data) => {
        this.handleSoftwareMessage(softwareId, JSON.parse(data.toString()))
      })

      ws.on('close', () => {
        console.log(`DJ Software disconnected: ${softwareId}`)
        this.connectedSoftware.delete(softwareId)
      })

      // Send software configuration
      const config = this.softwareConfigs.get(softwareId)
      if (config) {
        ws.send(JSON.stringify({
          type: 'config',
          config: config
        }))
      }
    })

    console.log('DJ Software Integration server started on port 8095')
    this.emit('initialized')
  }

  private handleSoftwareMessage(softwareId: string, message: any) {
    switch (message.type) {
      case 'track_loaded':
        this.handleTrackLoaded(softwareId, message.data)
        break
      case 'deck_state':
        this.handleDeckState(softwareId, message.data)
        break
      case 'midi_input':
        this.handleMidiInput(softwareId, message.data)
        break
      case 'effect_changed':
        this.handleEffectChanged(softwareId, message.data)
        break
      case 'cue_point':
        this.handleCuePoint(softwareId, message.data)
        break
      case 'sync_request':
        this.handleSyncRequest(softwareId, message.data)
        break
    }
  }

  private handleTrackLoaded(softwareId: string, data: any) {
    const track: TrackMetadata = {
      id: data.id,
      title: data.title,
      artist: data.artist,
      bpm: data.bpm,
      key: data.key,
      duration: data.duration,
      waveformData: data.waveformData ? new Float32Array(data.waveformData) : undefined,
      cuePoints: data.cuePoints || [],
      beatGrid: data.beatGrid || []
    }

    this.trackLibrary.set(track.id, track)
    this.activeDecks.set(`${softwareId}_${data.deckId}`, track)

    // Broadcast to other connected software
    this.broadcastToSoftware('track_sync', {
      softwareId,
      deckId: data.deckId,
      track: track
    }, softwareId)

    console.log(`Track loaded in ${softwareId}: ${track.title} by ${track.artist}`)
  }

  private handleDeckState(softwareId: string, data: any) {
    const deckState = {
      deckId: data.deckId,
      isPlaying: data.isPlaying,
      position: data.position,
      bpm: data.bpm,
      pitch: data.pitch,
      volume: data.volume,
      eq: data.eq,
      effects: data.effects
    }

    // Sync with other software if sync is enabled
    if (data.syncEnabled) {
      this.broadcastToSoftware('deck_sync', {
        softwareId,
        state: deckState
      }, softwareId)
    }

    this.emit('deck_state_changed', { softwareId, state: deckState })
  }

  private handleMidiInput(softwareId: string, data: any) {
    const { channel, cc, value, type } = data
    
    // Process MIDI input based on software configuration
    const config = this.softwareConfigs.get(softwareId)
    if (config) {
      const mapping = Object.entries(config.midiMapping.mappings).find(
        ([_, map]) => map.channel === channel && map.cc === cc
      )

      if (mapping) {
        const [controlName, controlMap] = mapping
        const normalizedValue = this.normalizeMidiValue(value, controlMap.range, controlMap.type)

        // Apply control action
        this.applyControl(softwareId, controlName, normalizedValue, controlMap.type)
      }
    }
  }

  private handleEffectChanged(softwareId: string, data: any) {
    const effectState = {
      deckId: data.deckId,
      effectType: data.effectType,
      enabled: data.enabled,
      parameters: data.parameters
    }

    // Sync effects across software if compatible
    this.broadcastToSoftware('effect_sync', {
      softwareId,
      effect: effectState
    }, softwareId)

    this.emit('effect_changed', { softwareId, effect: effectState })
  }

  private handleCuePoint(softwareId: string, data: any) {
    const cuePoint = {
      deckId: data.deckId,
      cueNumber: data.cueNumber,
      position: data.position,
      action: data.action // 'set', 'trigger', 'delete'
    }

    // Update track metadata
    const track = this.activeDecks.get(`${softwareId}_${data.deckId}`)
    if (track) {
      if (data.action === 'set') {
        track.cuePoints[data.cueNumber] = data.position
      } else if (data.action === 'delete') {
        delete track.cuePoints[data.cueNumber]
      }
    }

    this.emit('cue_point_changed', { softwareId, cuePoint })
  }

  private handleSyncRequest(softwareId: string, data: any) {
    const masterDeck = data.masterDeck
    const slaveDeck = data.slaveDeck
    
    // Implement beat sync logic
    const masterTrack = this.activeDecks.get(`${softwareId}_${masterDeck}`)
    if (masterTrack) {
      this.broadcastToSoftware('sync_to_master', {
        masterBpm: masterTrack.bpm,
        masterPosition: data.masterPosition,
        targetDeck: slaveDeck
      })
    }
  }

  private normalizeMidiValue(value: number, range: [number, number], type: string): number {
    const [min, max] = range
    
    switch (type) {
      case 'jog':
        // Jog wheels use signed values
        return value > 64 ? value - 128 : value
      case 'button':
        return value > 0 ? 1 : 0
      default:
        // Normalize to 0-1 range
        return (value - min) / (max - min)
    }
  }

  private applyControl(softwareId: string, controlName: string, value: number, type: string) {
    // Apply control based on software and control type
    const config = this.softwareConfigs.get(softwareId)
    if (!config) return

    const controlAction = {
      software: softwareId,
      control: controlName,
      value: value,
      type: type,
      timestamp: Date.now()
    }

    // Send control action to software
    const ws = this.connectedSoftware.get(softwareId)
    if (ws) {
      ws.send(JSON.stringify({
        type: 'control_action',
        action: controlAction
      }))
    }

    this.emit('control_action', controlAction)
  }

  private broadcastToSoftware(messageType: string, data: any, excludeSoftware?: string) {
    const message = JSON.stringify({
      type: messageType,
      data: data,
      timestamp: Date.now()
    })

    for (const [softwareId, ws] of this.connectedSoftware) {
      if (softwareId !== excludeSoftware && ws.readyState === WebSocket.OPEN) {
        ws.send(message)
      }
    }
  }

  // Public API methods
  async loadTrackToSoftware(softwareId: string, deckId: string, trackId: string) {
    const track = this.trackLibrary.get(trackId)
    const ws = this.connectedSoftware.get(softwareId)
    
    if (track && ws) {
      ws.send(JSON.stringify({
        type: 'load_track',
        deckId: deckId,
        track: track
      }))
      return true
    }
    return false
  }

  async controlDeck(softwareId: string, deckId: string, action: string, value?: any) {
    const ws = this.connectedSoftware.get(softwareId)
    
    if (ws) {
      ws.send(JSON.stringify({
        type: 'deck_control',
        deckId: deckId,
        action: action,
        value: value
      }))
      return true
    }
    return false
  }

  async syncDecks(masterSoftware: string, masterDeck: string, slaveSoftware: string, slaveDeck: string) {
    const masterWs = this.connectedSoftware.get(masterSoftware)
    const slaveWs = this.connectedSoftware.get(slaveSoftware)
    
    if (masterWs && slaveWs) {
      const syncMessage = {
        type: 'sync_decks',
        master: { software: masterSoftware, deck: masterDeck },
        slave: { software: slaveSoftware, deck: slaveDeck }
      }
      
      masterWs.send(JSON.stringify(syncMessage))
      slaveWs.send(JSON.stringify(syncMessage))
      return true
    }
    return false
  }

  getConnectedSoftware(): string[] {
    return Array.from(this.connectedSoftware.keys())
  }

  getSoftwareConfig(softwareId: string): DJSoftwareConfig | undefined {
    return this.softwareConfigs.get(softwareId)
  }

  getActiveDecks(): Map<string, TrackMetadata> {
    return this.activeDecks
  }

  getTrackLibrary(): Map<string, TrackMetadata> {
    return this.trackLibrary
  }
}

export const djSoftwareIntegration = new DJSoftwareIntegration()