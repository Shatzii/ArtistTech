import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';

interface VoiceCommand {
  id: string;
  pattern: RegExp;
  action: string;
  category: string;
  parameters?: string[];
  response: string;
}

interface VoiceSession {
  id: string;
  userId: string;
  isListening: boolean;
  lastCommand: Date;
  confidence: number;
  language: string;
}

export class VoiceControlEngine {
  private voiceWSS?: WebSocketServer;
  private sessions: Map<string, VoiceSession> = new Map();
  private commands: Map<string, VoiceCommand> = new Map();
  private activeConnections: Map<string, WebSocket> = new Map();

  constructor() {
    this.initializeEngine();
  }

  private async initializeEngine() {
    this.setupVoiceServer();
    await this.loadVoiceCommands();
    this.initializeNLPProcessing();
    console.log("Voice Control Engine initialized");
  }

  private setupVoiceServer() {
    this.voiceWSS = new WebSocketServer({ port: 8189, path: '/voice' });
    
    console.log("Voice control WebSocket server started on port 8189");
    
    this.voiceWSS.on('connection', (ws: WebSocket) => {
      const sessionId = this.generateSessionId();
      this.activeConnections.set(sessionId, ws);

      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleVoiceMessage(ws, sessionId, message);
        } catch (error) {
          console.error('Voice WebSocket error:', error);
        }
      });

      ws.on('close', () => {
        this.activeConnections.delete(sessionId);
        this.sessions.delete(sessionId);
      });

      // Send initial voice commands list
      ws.send(JSON.stringify({
        type: 'voice_commands',
        commands: this.getCommandsList()
      }));
    });


  }

  private async loadVoiceCommands() {
    const voiceCommands: VoiceCommand[] = [
      // Playback Controls
      {
        id: 'play',
        pattern: /^(play|start|begin|resume)/i,
        action: 'playback_play',
        category: 'transport',
        response: 'Starting playback'
      },
      {
        id: 'pause',
        pattern: /^(pause|stop|halt)/i,
        action: 'playback_pause',
        category: 'transport',
        response: 'Pausing playback'
      },
      {
        id: 'record',
        pattern: /^(record|rec|capture)/i,
        action: 'playback_record',
        category: 'transport',
        response: 'Starting recording'
      },
      
      // Volume Controls
      {
        id: 'volume_up',
        pattern: /^(volume up|louder|increase volume|turn up)/i,
        action: 'mixer_volume_increase',
        category: 'mixer',
        response: 'Increasing volume'
      },
      {
        id: 'volume_down',
        pattern: /^(volume down|quieter|decrease volume|turn down)/i,
        action: 'mixer_volume_decrease',
        category: 'mixer',
        response: 'Decreasing volume'
      },
      {
        id: 'mute',
        pattern: /^(mute|silence)/i,
        action: 'mixer_mute',
        category: 'mixer',
        response: 'Muting audio'
      },

      // BPM Controls
      {
        id: 'bpm_increase',
        pattern: /^(speed up|faster|increase tempo|bpm up)/i,
        action: 'transport_bpm_increase',
        category: 'transport',
        response: 'Increasing BPM'
      },
      {
        id: 'bpm_decrease',
        pattern: /^(slow down|slower|decrease tempo|bpm down)/i,
        action: 'transport_bpm_decrease',
        category: 'transport',
        response: 'Decreasing BPM'
      },
      {
        id: 'set_bpm',
        pattern: /^(set bpm to|change tempo to|bpm) (\d+)/i,
        action: 'transport_set_bpm',
        category: 'transport',
        parameters: ['bpm'],
        response: 'Setting BPM to {bpm}'
      },

      // Instrument Selection
      {
        id: 'select_piano',
        pattern: /^(select piano|piano|grand piano)/i,
        action: 'instrument_select',
        category: 'instruments',
        parameters: ['piano'],
        response: 'Selecting piano'
      },
      {
        id: 'select_drums',
        pattern: /^(select drums|drums|drum kit)/i,
        action: 'instrument_select',
        category: 'instruments',
        parameters: ['drums'],
        response: 'Selecting drums'
      },
      {
        id: 'select_bass',
        pattern: /^(select bass|bass|bass guitar)/i,
        action: 'instrument_select',
        category: 'instruments',
        parameters: ['bass'],
        response: 'Selecting bass'
      },
      {
        id: 'select_synth',
        pattern: /^(select synth|synthesizer|synth)/i,
        action: 'instrument_select',
        category: 'instruments',
        parameters: ['synthesizer'],
        response: 'Selecting synthesizer'
      },

      // Effects Controls
      {
        id: 'add_reverb',
        pattern: /^(add reverb|enable reverb|reverb on)/i,
        action: 'effects_enable',
        category: 'effects',
        parameters: ['reverb'],
        response: 'Adding reverb effect'
      },
      {
        id: 'remove_reverb',
        pattern: /^(remove reverb|disable reverb|reverb off)/i,
        action: 'effects_disable',
        category: 'effects',
        parameters: ['reverb'],
        response: 'Removing reverb effect'
      },
      {
        id: 'add_delay',
        pattern: /^(add delay|enable delay|delay on)/i,
        action: 'effects_enable',
        category: 'effects',
        parameters: ['delay'],
        response: 'Adding delay effect'
      },

      // Project Management
      {
        id: 'save_project',
        pattern: /^(save project|save|save work)/i,
        action: 'project_save',
        category: 'project',
        response: 'Saving project'
      },
      {
        id: 'load_project',
        pattern: /^(load project|open project)/i,
        action: 'project_load',
        category: 'project',
        response: 'Loading project'
      },
      {
        id: 'new_project',
        pattern: /^(new project|create project|start new)/i,
        action: 'project_new',
        category: 'project',
        response: 'Creating new project'
      },

      // Studio Navigation
      {
        id: 'open_mixer',
        pattern: /^(open mixer|go to mixer|show mixer)/i,
        action: 'studio_navigate',
        category: 'navigation',
        parameters: ['mixer'],
        response: 'Opening mixer'
      },
      {
        id: 'open_instruments',
        pattern: /^(open instruments|show instruments|instruments)/i,
        action: 'studio_navigate',
        category: 'navigation',
        parameters: ['instruments'],
        response: 'Opening instruments panel'
      },
      {
        id: 'open_effects',
        pattern: /^(open effects|show effects|effects)/i,
        action: 'studio_navigate',
        category: 'navigation',
        parameters: ['effects'],
        response: 'Opening effects panel'
      },

      // AI Assistant Commands
      {
        id: 'ai_suggest_chord',
        pattern: /^(suggest chord|chord suggestion|what chord)/i,
        action: 'ai_suggest',
        category: 'ai',
        parameters: ['chord'],
        response: 'Getting chord suggestions from AI'
      },
      {
        id: 'ai_suggest_melody',
        pattern: /^(suggest melody|melody suggestion|create melody)/i,
        action: 'ai_suggest',
        category: 'ai',
        parameters: ['melody'],
        response: 'Getting melody suggestions from AI'
      },
      {
        id: 'ai_analyze_track',
        pattern: /^(analyze track|analyze this|what do you think)/i,
        action: 'ai_analyze',
        category: 'ai',
        response: 'Analyzing track with AI'
      },

      // Advanced Commands
      {
        id: 'loop_section',
        pattern: /^(loop this|create loop|loop section)/i,
        action: 'transport_loop',
        category: 'transport',
        response: 'Creating loop section'
      },
      {
        id: 'export_track',
        pattern: /^(export track|export project|export audio)/i,
        action: 'project_export',
        category: 'project',
        response: 'Exporting track'
      },
      {
        id: 'metronome_on',
        pattern: /^(metronome on|enable metronome|click track)/i,
        action: 'transport_metronome_on',
        category: 'transport',
        response: 'Enabling metronome'
      },
      {
        id: 'metronome_off',
        pattern: /^(metronome off|disable metronome|no click)/i,
        action: 'transport_metronome_off',
        category: 'transport',
        response: 'Disabling metronome'
      }
    ];

    voiceCommands.forEach(command => {
      this.commands.set(command.id, command);
    });
  }

  private initializeNLPProcessing() {
    // Initialize natural language processing patterns
    console.log("NLP processing initialized for voice commands");
  }

  private handleVoiceMessage(ws: WebSocket, sessionId: string, message: any) {
    const { type, data } = message;

    switch (type) {
      case 'start_listening':
        this.startVoiceSession(sessionId, data.userId);
        break;
      case 'stop_listening':
        this.stopVoiceSession(sessionId);
        break;
      case 'voice_command':
        this.processVoiceCommand(ws, sessionId, data.transcript, data.confidence);
        break;
      case 'get_commands':
        this.sendCommandsList(ws);
        break;
      default:
        console.log('Unknown voice message type:', type);
    }
  }

  private startVoiceSession(sessionId: string, userId: string) {
    const session: VoiceSession = {
      id: sessionId,
      userId,
      isListening: true,
      lastCommand: new Date(),
      confidence: 0,
      language: 'en-US'
    };

    this.sessions.set(sessionId, session);
    console.log(`Voice session started for user ${userId}`);
  }

  private stopVoiceSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isListening = false;
      console.log(`Voice session stopped for user ${session.userId}`);
    }
  }

  private processVoiceCommand(ws: WebSocket, sessionId: string, transcript: string, confidence: number) {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isListening) {
      return;
    }

    // Update session
    session.lastCommand = new Date();
    session.confidence = confidence;

    // Process command
    const matchedCommand = this.matchVoiceCommand(transcript);
    if (matchedCommand) {
      const response = this.executeVoiceCommand(matchedCommand, transcript);
      
      ws.send(JSON.stringify({
        type: 'command_executed',
        command: matchedCommand.id,
        transcript,
        confidence,
        response: response.message,
        success: response.success
      }));
    } else {
      ws.send(JSON.stringify({
        type: 'command_not_recognized',
        transcript,
        confidence,
        suggestions: this.getSimilarCommands(transcript)
      }));
    }
  }

  private matchVoiceCommand(transcript: string): VoiceCommand | null {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    for (const command of this.commands.values()) {
      if (command.pattern.test(normalizedTranscript)) {
        return command;
      }
    }
    
    return null;
  }

  private executeVoiceCommand(command: VoiceCommand, transcript: string): { success: boolean; message: string } {
    try {
      // Extract parameters if needed
      let parameters: any = {};
      if (command.parameters) {
        const match = command.pattern.exec(transcript.toLowerCase());
        if (match && command.parameters.length > 0) {
          command.parameters.forEach((param, index) => {
            parameters[param] = match[index + 2]; // Skip full match and first group
          });
        }
      }

      // Execute the command action
      const result = this.executeAction(command.action, parameters);
      
      // Format response message
      let responseMessage = command.response;
      if (command.parameters) {
        command.parameters.forEach(param => {
          if (parameters[param]) {
            responseMessage = responseMessage.replace(`{${param}}`, parameters[param]);
          }
        });
      }

      return {
        success: result.success,
        message: responseMessage
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to execute command: ${error}`
      };
    }
  }

  private executeAction(action: string, parameters: any): { success: boolean; data?: any } {
    // This would typically interface with the studio systems
    // For now, we'll simulate the actions
    console.log(`Executing voice action: ${action}`, parameters);
    
    switch (action) {
      case 'playback_play':
      case 'playback_pause':
      case 'playback_record':
        return { success: true };
      
      case 'mixer_volume_increase':
      case 'mixer_volume_decrease':
      case 'mixer_mute':
        return { success: true };
      
      case 'transport_bpm_increase':
      case 'transport_bpm_decrease':
      case 'transport_set_bpm':
        return { success: true };
      
      case 'instrument_select':
        return { success: true, data: { instrument: parameters.instrument || parameters[0] } };
      
      case 'effects_enable':
      case 'effects_disable':
        return { success: true, data: { effect: parameters.effect || parameters[0] } };
      
      case 'project_save':
      case 'project_load':
      case 'project_new':
      case 'project_export':
        return { success: true };
      
      case 'studio_navigate':
        return { success: true, data: { panel: parameters.panel || parameters[0] } };
      
      case 'ai_suggest':
      case 'ai_analyze':
        return { success: true };
      
      case 'transport_loop':
      case 'transport_metronome_on':
      case 'transport_metronome_off':
        return { success: true };
      
      default:
        return { success: false };
    }
  }

  private getSimilarCommands(transcript: string): string[] {
    const normalizedTranscript = transcript.toLowerCase();
    const suggestions: string[] = [];
    
    // Simple similarity check based on word matching
    for (const command of this.commands.values()) {
      const commandText = command.pattern.source.toLowerCase();
      if (this.calculateSimilarity(normalizedTranscript, commandText) > 0.3) {
        suggestions.push(command.id);
      }
    }
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  private sendCommandsList(ws: WebSocket) {
    const commandsList = this.getCommandsList();
    ws.send(JSON.stringify({
      type: 'commands_list',
      commands: commandsList
    }));
  }

  private getCommandsList() {
    const categorizedCommands: { [key: string]: any[] } = {};
    
    for (const command of this.commands.values()) {
      if (!categorizedCommands[command.category]) {
        categorizedCommands[command.category] = [];
      }
      
      categorizedCommands[command.category].push({
        id: command.id,
        example: this.getExamplePhrase(command.pattern),
        action: command.action,
        response: command.response
      });
    }
    
    return categorizedCommands;
  }

  private getExamplePhrase(pattern: RegExp): string {
    // Extract example phrases from regex patterns
    const source = pattern.source;
    const match = source.match(/\^?\(?([^|)]+)/);
    return match ? match[1].replace(/[()^$]/g, '') : 'command';
  }

  private generateSessionId(): string {
    return `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // API Endpoints
  public async getVoiceCommands() {
    return Array.from(this.commands.values()).map(cmd => ({
      id: cmd.id,
      category: cmd.category,
      example: this.getExamplePhrase(cmd.pattern),
      response: cmd.response
    }));
  }

  public async getActiveSessions() {
    return Array.from(this.sessions.values()).map(session => ({
      id: session.id,
      userId: session.userId,
      isListening: session.isListening,
      lastCommand: session.lastCommand,
      confidence: session.confidence
    }));
  }
}

// Initialize the voice control engine
const voiceControlEngine = new VoiceControlEngine();
export default voiceControlEngine;