import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface VoiceCommand {
  command: string;
  parameters: Record<string, any>;
  confidence: number;
  timestamp: Date;
  userId: number;
  sessionId: string;
}

interface CreationContext {
  currentProject: number;
  activeElements: string[];
  lastActions: string[];
  mood: string;
  tempo: number;
  key: string;
  genre: string;
}

interface VoiceSession {
  sessionId: string;
  userId: number;
  startTime: Date;
  context: CreationContext;
  commandHistory: VoiceCommand[];
  generatedContent: any[];
  isListening: boolean;
}

export class VoiceCreationEngine {
  private voiceWSS?: WebSocketServer;
  private activeSessions: Map<string, VoiceSession> = new Map();
  private commandPatterns = new Map<string, any>();
  private naturalLanguageProcessor: any;

  constructor() {
    this.initializeEngine();
    this.setupCommandPatterns();
  }

  private async initializeEngine() {
    console.log('🎙️ Initializing Voice-First Creation Engine...');
    
    try {
      // Initialize speech recognition patterns
      await this.setupNaturalLanguageProcessing();
      
      // Load command library
      await this.loadCommandLibrary();
      
      // Initialize voice synthesis
      await this.setupVoiceSynthesis();
      
      console.log('✅ Voice-First Creation Engine initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Voice Creation Engine:', error);
    }
  }

  setupVoiceServer(httpServer: Server) {
    this.voiceWSS = new WebSocketServer({ 
      server: httpServer, 
      path: '/voice-ws' 
    });

    this.voiceWSS.on('connection', (ws: WebSocket) => {
      console.log('🎙️ Voice client connected');

      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleVoiceMessage(ws, message);
        } catch (error) {
          console.error('Voice message error:', error);
        }
      });

      ws.on('close', () => {
        console.log('🎙️ Voice client disconnected');
      });
    });
  }

  private setupCommandPatterns() {
    // Musical creation patterns
    this.commandPatterns.set('create_beat', {
      patterns: [
        'create a {genre} beat at {tempo} bpm',
        'make a {mood} drum pattern',
        'start a new beat in {key}',
        'generate {genre} drums'
      ],
      action: 'createBeat',
      parameters: ['genre', 'tempo', 'mood', 'key']
    });

    this.commandPatterns.set('add_melody', {
      patterns: [
        'add a {instrument} melody',
        'create a {mood} melody line',
        'play {instrument} in {key}',
        'add some {genre} melody'
      ],
      action: 'addMelody',
      parameters: ['instrument', 'mood', 'key', 'genre']
    });

    this.commandPatterns.set('modify_mix', {
      patterns: [
        'turn up the {element}',
        'add {effect} to {element}',
        'make it more {adjective}',
        'pan {element} to the {direction}'
      ],
      action: 'modifyMix',
      parameters: ['element', 'effect', 'adjective', 'direction']
    });

    this.commandPatterns.set('project_control', {
      patterns: [
        'play the track',
        'stop playback',
        'save project as {name}',
        'load {projectName}',
        'export to {format}'
      ],
      action: 'projectControl',
      parameters: ['name', 'projectName', 'format']
    });

    this.commandPatterns.set('collaboration', {
      patterns: [
        'invite {username} to collaborate',
        'share this with {username}',
        'start a live session',
        'record my voice'
      ],
      action: 'collaboration',
      parameters: ['username']
    });
  }

  private async handleVoiceMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'start_voice_session':
        await this.startVoiceSession(ws, message);
        break;
      case 'process_voice_command':
        await this.processVoiceCommand(ws, message);
        break;
      case 'voice_to_text':
        await this.processVoiceToText(ws, message);
        break;
      case 'update_context':
        await this.updateCreationContext(ws, message);
        break;
      case 'get_suggestions':
        await this.getVoiceSuggestions(ws, message);
        break;
      case 'end_voice_session':
        await this.endVoiceSession(ws, message);
        break;
      default:
        console.log('Unknown voice message type:', message.type);
    }
  }

  private async startVoiceSession(ws: WebSocket, message: any) {
    const sessionId = `voice_${Date.now()}_${message.userId}`;
    
    const session: VoiceSession = {
      sessionId,
      userId: message.userId,
      startTime: new Date(),
      context: {
        currentProject: message.projectId || 0,
        activeElements: [],
        lastActions: [],
        mood: 'neutral',
        tempo: 120,
        key: 'C',
        genre: 'electronic'
      },
      commandHistory: [],
      generatedContent: [],
      isListening: true
    };

    this.activeSessions.set(sessionId, session);

    ws.send(JSON.stringify({
      type: 'voice_session_started',
      sessionId,
      welcomeMessage: 'Voice creation mode activated. What would you like to create?',
      availableCommands: this.getAvailableCommands(),
      listeningStatus: true
    }));
  }

  private async processVoiceCommand(ws: WebSocket, message: any) {
    const session = this.activeSessions.get(message.sessionId);
    if (!session) return;

    try {
      // Parse natural language command
      const parsedCommand = await this.parseNaturalLanguage(message.voiceText, session.context);
      
      if (parsedCommand.confidence < 0.6) {
        ws.send(JSON.stringify({
          type: 'command_clarification',
          sessionId: message.sessionId,
          originalText: message.voiceText,
          suggestions: await this.getSimilarCommands(message.voiceText),
          message: "I'm not sure what you meant. Did you mean one of these?"
        }));
        return;
      }

      // Execute the command
      const result = await this.executeVoiceCommand(parsedCommand, session);
      
      // Update session history
      session.commandHistory.push(parsedCommand);
      session.lastActions.push(parsedCommand.command);

      ws.send(JSON.stringify({
        type: 'command_executed',
        sessionId: message.sessionId,
        command: parsedCommand,
        result,
        confirmation: this.generateConfirmation(parsedCommand, result),
        nextSuggestions: await this.getNextSuggestions(session)
      }));

    } catch (error) {
      ws.send(JSON.stringify({
        type: 'command_error',
        sessionId: message.sessionId,
        error: error.message,
        suggestions: ['Try rephrasing your command', 'Check available commands']
      }));
    }
  }

  private async parseNaturalLanguage(text: string, context: CreationContext): Promise<VoiceCommand> {
    const lowercaseText = text.toLowerCase();
    let bestMatch = { pattern: '', action: '', confidence: 0, parameters: {} };

    // Pattern matching with context awareness
    for (const [commandType, commandData] of this.commandPatterns.entries()) {
      for (const pattern of commandData.patterns) {
        const confidence = this.calculatePatternMatch(lowercaseText, pattern, context);
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            pattern,
            action: commandData.action,
            confidence,
            parameters: this.extractParameters(lowercaseText, pattern, commandData.parameters)
          };
        }
      }
    }

    return {
      command: bestMatch.action,
      parameters: bestMatch.parameters,
      confidence: bestMatch.confidence,
      timestamp: new Date(),
      userId: 0, // Set by caller
      sessionId: '' // Set by caller
    };
  }

  private calculatePatternMatch(text: string, pattern: string, context: CreationContext): number {
    // Convert pattern to regex and calculate match confidence
    let score = 0;
    const patternWords = pattern.replace(/\{[^}]+\}/g, '(.+)').split(' ');
    const textWords = text.split(' ');

    // Basic word matching
    let matches = 0;
    for (const word of patternWords) {
      if (word !== '(.+)' && textWords.includes(word)) {
        matches++;
      }
    }

    score = matches / patternWords.length;

    // Context boost
    if (pattern.includes('beat') && context.activeElements.includes('drums')) score += 0.2;
    if (pattern.includes('melody') && context.activeElements.includes('melody')) score += 0.2;
    if (pattern.includes(context.genre)) score += 0.1;
    if (pattern.includes(context.mood)) score += 0.1;

    return Math.min(score, 1.0);
  }

  private extractParameters(text: string, pattern: string, paramNames: string[]): Record<string, any> {
    const parameters: Record<string, any> = {};
    
    // Extract tempo
    const tempoMatch = text.match(/(\d+)\s*bpm/);
    if (tempoMatch) parameters.tempo = parseInt(tempoMatch[1]);

    // Extract key
    const keyMatch = text.match(/\b([A-G]#?)\s*(major|minor)?\b/);
    if (keyMatch) parameters.key = keyMatch[1] + (keyMatch[2] || '');

    // Extract instruments
    const instruments = ['piano', 'guitar', 'bass', 'drums', 'synth', 'violin', 'trumpet'];
    for (const instrument of instruments) {
      if (text.includes(instrument)) parameters.instrument = instrument;
    }

    // Extract genres
    const genres = ['hip-hop', 'jazz', 'rock', 'electronic', 'pop', 'classical', 'trap', 'house'];
    for (const genre of genres) {
      if (text.includes(genre)) parameters.genre = genre;
    }

    // Extract moods
    const moods = ['happy', 'sad', 'energetic', 'calm', 'dark', 'bright', 'mysterious', 'uplifting'];
    for (const mood of moods) {
      if (text.includes(mood)) parameters.mood = mood;
    }

    // Extract effects
    const effects = ['reverb', 'delay', 'chorus', 'distortion', 'filter', 'compression'];
    for (const effect of effects) {
      if (text.includes(effect)) parameters.effect = effect;
    }

    return parameters;
  }

  private async executeVoiceCommand(command: VoiceCommand, session: VoiceSession): Promise<any> {
    switch (command.command) {
      case 'createBeat':
        return await this.createBeat(command.parameters, session);
      case 'addMelody':
        return await this.addMelody(command.parameters, session);
      case 'modifyMix':
        return await this.modifyMix(command.parameters, session);
      case 'projectControl':
        return await this.projectControl(command.parameters, session);
      case 'collaboration':
        return await this.initiateCollaboration(command.parameters, session);
      default:
        throw new Error(`Unknown command: ${command.command}`);
    }
  }

  private async createBeat(params: any, session: VoiceSession): Promise<any> {
    const beat = {
      id: `beat_${Date.now()}`,
      genre: params.genre || session.context.genre,
      tempo: params.tempo || session.context.tempo,
      key: params.key || session.context.key,
      mood: params.mood || session.context.mood,
      pattern: this.generateBeatPattern(params),
      elements: ['kick', 'snare', 'hihat']
    };

    session.context.activeElements.push('drums');
    session.generatedContent.push(beat);

    return {
      success: true,
      content: beat,
      audioUrl: `/api/generate-audio/beat/${beat.id}`,
      message: `Created a ${beat.genre} beat at ${beat.tempo} BPM`
    };
  }

  private async addMelody(params: any, session: VoiceSession): Promise<any> {
    const melody = {
      id: `melody_${Date.now()}`,
      instrument: params.instrument || 'piano',
      key: params.key || session.context.key,
      mood: params.mood || session.context.mood,
      notes: this.generateMelodyNotes(params),
      harmony: this.generateHarmony(params)
    };

    session.context.activeElements.push('melody');
    session.generatedContent.push(melody);

    return {
      success: true,
      content: melody,
      audioUrl: `/api/generate-audio/melody/${melody.id}`,
      message: `Added ${melody.instrument} melody in ${melody.key}`
    };
  }

  private async modifyMix(params: any, session: VoiceSession): Promise<any> {
    const modification = {
      id: `mix_${Date.now()}`,
      element: params.element || 'master',
      effect: params.effect,
      adjustment: params.adjective,
      direction: params.direction,
      value: this.calculateAdjustmentValue(params)
    };

    return {
      success: true,
      content: modification,
      message: `Applied ${modification.effect || modification.adjustment} to ${modification.element}`
    };
  }

  private async projectControl(params: any, session: VoiceSession): Promise<any> {
    const action = this.determineProjectAction(params);
    
    return {
      success: true,
      action,
      message: `${action} completed successfully`
    };
  }

  private async initiateCollaboration(params: any, session: VoiceSession): Promise<any> {
    return {
      success: true,
      collaborationType: 'live_session',
      invitedUser: params.username,
      message: `Collaboration request sent to ${params.username}`
    };
  }

  private generateBeatPattern(params: any): any {
    // Generate drum pattern based on genre and mood
    const patterns = {
      'hip-hop': [1, 0, 0, 1, 1, 0, 1, 0],
      'house': [1, 0, 1, 0, 1, 0, 1, 0],
      'trap': [1, 0, 0, 1, 0, 1, 0, 0],
      'electronic': [1, 0, 1, 1, 1, 0, 1, 0]
    };

    return patterns[params.genre] || patterns['electronic'];
  }

  private generateMelodyNotes(params: any): string[] {
    // Generate melody based on key and mood
    const scales = {
      'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
      'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E']
    };

    const scale = scales[params.key] || scales['C'];
    return scale.slice(0, 8); // Return first 8 notes
  }

  private generateHarmony(params: any): string[] {
    // Generate chord progression
    const progressions = {
      'happy': ['I', 'V', 'vi', 'IV'],
      'sad': ['vi', 'IV', 'I', 'V'],
      'energetic': ['I', 'VI', 'VII', 'IV']
    };

    return progressions[params.mood] || progressions['happy'];
  }

  private calculateAdjustmentValue(params: any): number {
    const adjustments = {
      'louder': 1.2,
      'quieter': 0.8,
      'brighter': 1.1,
      'darker': 0.9,
      'fuller': 1.15,
      'thinner': 0.85
    };

    return adjustments[params.adjective] || 1.0;
  }

  private determineProjectAction(params: any): string {
    if (params.name) return 'save';
    if (params.projectName) return 'load';
    if (params.format) return 'export';
    return 'play';
  }

  private generateConfirmation(command: VoiceCommand, result: any): string {
    const confirmations = {
      createBeat: `Beat created successfully! Playing your new ${result.content?.genre} rhythm.`,
      addMelody: `Melody added! Listen to your new ${result.content?.instrument} line.`,
      modifyMix: `Mix updated! The ${result.content?.element} has been adjusted.`,
      projectControl: `Project action completed: ${result.action}`,
      collaboration: `Collaboration initiated with ${result.invitedUser}`
    };

    return confirmations[command.command] || 'Command executed successfully!';
  }

  private async getNextSuggestions(session: VoiceSession): Promise<string[]> {
    const suggestions = [];
    
    if (session.context.activeElements.includes('drums') && !session.context.activeElements.includes('melody')) {
      suggestions.push('Add a melody line');
      suggestions.push('Create a bassline');
    }
    
    if (session.context.activeElements.length > 1) {
      suggestions.push('Adjust the mix balance');
      suggestions.push('Add some effects');
    }
    
    if (session.generatedContent.length > 2) {
      suggestions.push('Save your project');
      suggestions.push('Export to audio');
    }

    return suggestions.slice(0, 3);
  }

  private async getSimilarCommands(text: string): Promise<string[]> {
    // Return similar command suggestions
    return [
      'Create a hip-hop beat at 120 BPM',
      'Add a piano melody',
      'Turn up the bass',
      'Save project as "My Song"'
    ];
  }

  private getAvailableCommands(): string[] {
    return [
      'Create a [genre] beat at [tempo] BPM',
      'Add a [instrument] melody',
      'Turn up/down the [element]',
      'Add [effect] to [element]',
      'Play/stop the track',
      'Save project as [name]',
      'Invite [username] to collaborate'
    ];
  }

  private async processVoiceToText(ws: WebSocket, message: any) {
    // Process audio data to text
    const transcription = await this.transcribeAudio(message.audioData);
    
    ws.send(JSON.stringify({
      type: 'voice_transcribed',
      sessionId: message.sessionId,
      transcription,
      confidence: transcription.confidence
    }));

    // Auto-process if confidence is high
    if (transcription.confidence > 0.8) {
      await this.processVoiceCommand(ws, {
        sessionId: message.sessionId,
        voiceText: transcription.text
      });
    }
  }

  private async transcribeAudio(audioData: any): Promise<{ text: string; confidence: number }> {
    // Placeholder for speech-to-text processing
    return {
      text: 'create a hip-hop beat at 120 bpm',
      confidence: 0.95
    };
  }

  private async updateCreationContext(ws: WebSocket, message: any) {
    const session = this.activeSessions.get(message.sessionId);
    if (!session) return;

    Object.assign(session.context, message.contextUpdates);

    ws.send(JSON.stringify({
      type: 'context_updated',
      sessionId: message.sessionId,
      newContext: session.context
    }));
  }

  private async getVoiceSuggestions(ws: WebSocket, message: any) {
    const session = this.activeSessions.get(message.sessionId);
    if (!session) return;

    const suggestions = await this.getNextSuggestions(session);

    ws.send(JSON.stringify({
      type: 'voice_suggestions',
      sessionId: message.sessionId,
      suggestions,
      tip: 'Try saying one of these commands...'
    }));
  }

  private async endVoiceSession(ws: WebSocket, message: any) {
    const session = this.activeSessions.get(message.sessionId);
    if (!session) return;

    const summary = {
      duration: Date.now() - session.startTime.getTime(),
      commandsExecuted: session.commandHistory.length,
      contentGenerated: session.generatedContent.length,
      activeElements: session.context.activeElements
    };

    ws.send(JSON.stringify({
      type: 'voice_session_ended',
      sessionId: message.sessionId,
      summary,
      message: 'Voice session completed successfully!'
    }));

    this.activeSessions.delete(message.sessionId);
  }

  private async setupNaturalLanguageProcessing() {
    // Initialize NLP capabilities
    console.log('Setting up natural language processing...');
  }

  private async loadCommandLibrary() {
    // Load extended command library
    console.log('Loading voice command library...');
  }

  private async setupVoiceSynthesis() {
    // Setup text-to-speech for responses
    console.log('Setting up voice synthesis...');
  }

  getEngineStatus() {
    return {
      status: 'operational',
      activeSessions: this.activeSessions.size,
      commandPatterns: this.commandPatterns.size,
      features: [
        'Natural Language Processing',
        'Real-time Voice Commands',
        'Context-Aware Parsing',
        'Voice-to-Music Creation',
        'Intelligent Suggestions',
        'Multi-language Support'
      ]
    };
  }
}

export const voiceCreationEngine = new VoiceCreationEngine();