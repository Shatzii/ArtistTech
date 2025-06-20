import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

// Self-hosted AI for music education using open source models
// Uses Ollama, Llama, and other local language models

interface AIRequest {
  prompt: string;
  context?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AIResponse {
  response: string;
  confidence: number;
  processingTime: number;
}

export class SelfHostedMusicAI {
  private modelsDir = './ai-models/text';
  private isInitialized = false;
  private availableModels: string[] = [];

  constructor() {
    this.initializeModels();
  }

  private async initializeModels() {
    try {
      await fs.mkdir(this.modelsDir, { recursive: true });
      
      // Check for available models
      await this.checkAvailableModels();
      
      // Initialize Ollama if available
      await this.initializeOllama();
      
      this.isInitialized = true;
      console.log('Self-hosted AI initialized with models:', this.availableModels);
    } catch (error) {
      console.error('AI initialization failed:', error);
    }
  }

  private async checkAvailableModels() {
    // Check for locally available open source models
    const commonModels = [
      'llama2:7b',
      'llama2:13b', 
      'mistral:7b',
      'codellama:7b',
      'dolphin-mixtral:8x7b'
    ];

    for (const model of commonModels) {
      if (await this.isModelAvailable(model)) {
        this.availableModels.push(model);
      }
    }

    // If no models available, use fallback local processing
    if (this.availableModels.length === 0) {
      console.log('No Ollama models found, using pattern-based responses');
      this.availableModels.push('pattern-based');
    }
  }

  private async isModelAvailable(modelName: string): Promise<boolean> {
    return new Promise((resolve) => {
      const ollama = spawn('ollama', ['list'], { stdio: 'pipe' });
      let output = '';

      ollama.stdout?.on('data', (data) => {
        output += data.toString();
      });

      ollama.on('close', (code) => {
        resolve(code === 0 && output.includes(modelName.split(':')[0]));
      });

      ollama.on('error', () => {
        resolve(false);
      });
    });
  }

  private async initializeOllama() {
    // Check if Ollama is installed
    try {
      const ollama = spawn('ollama', ['--version'], { stdio: 'pipe' });
      await new Promise((resolve, reject) => {
        ollama.on('close', (code) => {
          if (code === 0) {
            console.log('Ollama detected and ready');
            resolve(code);
          } else {
            reject(new Error('Ollama not available'));
          }
        });
        ollama.on('error', reject);
      });
    } catch (error) {
      console.log('Ollama not available, using fallback AI');
    }
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      let response: string;

      if (this.availableModels.includes('pattern-based')) {
        response = await this.generatePatternBasedResponse(request.prompt);
      } else {
        response = await this.generateOllamaResponse(request);
      }

      const processingTime = Date.now() - startTime;

      return {
        response,
        confidence: 0.85,
        processingTime
      };
    } catch (error) {
      console.error('AI response generation failed:', error);
      
      // Fallback to pattern-based response
      const response = await this.generatePatternBasedResponse(request.prompt);
      const processingTime = Date.now() - startTime;

      return {
        response,
        confidence: 0.6,
        processingTime
      };
    }
  }

  private async generateOllamaResponse(request: AIRequest): Promise<string> {
    const model = this.availableModels[0]; // Use best available model

    return new Promise((resolve, reject) => {
      const ollama = spawn('ollama', ['run', model], { stdio: 'pipe' });
      
      let response = '';
      let error = '';

      ollama.stdout?.on('data', (data) => {
        response += data.toString();
      });

      ollama.stderr?.on('data', (data) => {
        error += data.toString();
      });

      ollama.stdin?.write(request.prompt + '\n');
      ollama.stdin?.end();

      ollama.on('close', (code) => {
        if (code === 0 && response.trim()) {
          resolve(response.trim());
        } else {
          reject(new Error(`Ollama error: ${error || 'No response'}`));
        }
      });

      ollama.on('error', reject);
    });
  }

  private async generatePatternBasedResponse(prompt: string): Promise<string> {
    const input = prompt.toLowerCase();

    // Music theory responses
    if (input.includes('chord') || input.includes('harmony')) {
      return this.getMusicTheoryResponse(input, 'chords');
    }
    
    if (input.includes('scale') || input.includes('mode')) {
      return this.getMusicTheoryResponse(input, 'scales');
    }
    
    if (input.includes('rhythm') || input.includes('beat')) {
      return this.getMusicTheoryResponse(input, 'rhythm');
    }

    // Emotional support
    if (input.includes('frustrated') || input.includes('difficult') || input.includes('stuck')) {
      return this.getEmotionalSupportResponse();
    }

    // Practice guidance
    if (input.includes('practice') || input.includes('exercise')) {
      return this.getPracticeGuidanceResponse();
    }

    // Collaboration
    if (input.includes('collaborate') || input.includes('play with') || input.includes('band')) {
      return this.getCollaborationResponse();
    }

    // General music education response
    return this.getGeneralMusicResponse();
  }

  private getMusicTheoryResponse(input: string, topic: 'chords' | 'scales' | 'rhythm'): string {
    const responses = {
      chords: [
        "Great question about chords! Let's start with the fundamentals. A chord is three or more notes played simultaneously. The most basic chords are triads - major, minor, diminished, and augmented. Would you like to explore a specific chord progression or type?",
        "Chord progressions are the backbone of music! The most common progression is I-V-vi-IV, which you hear in countless songs. In C major, that would be C-G-Am-F. This progression works because of the strong harmonic relationships between these chords.",
        "For jazz harmony, we often extend basic triads with 7ths, 9ths, 11ths, and 13ths. These extensions add color and sophistication to your sound. Start with major 7th and minor 7th chords - they're the foundation of jazz harmony."
      ],
      scales: [
        "Scales are the foundation of melody and improvisation! The major scale contains seven notes and follows the pattern: whole-whole-half-whole-whole-whole-half. Each mode of this scale (Ionian, Dorian, Phrygian, etc.) has its own unique character and application.",
        "For improvisation, start with the pentatonic scale - it's just five notes and works over many chord progressions. The minor pentatonic is particularly popular in blues and rock, while the major pentatonic has a brighter, more optimistic sound.",
        "Modal scales open up incredible melodic possibilities. Dorian mode has a slightly melancholy but hopeful quality, while Mixolydian is great for that bluesy, dominant sound. Try playing these modes to hear their unique characteristics."
      ],
      rhythm: [
        "Rhythm is the heartbeat of music! Start by feeling the pulse - tap your foot to a steady beat. Then layer in subdivisions: quarter notes, eighth notes, sixteenth notes. Use a metronome to develop rock-solid timing.",
        "Syncopation adds excitement to rhythm by emphasizing off-beats. Try playing accents on the 'and' of beats rather than on the strong beats. This creates that groove that makes people want to move!",
        "Different time signatures create different feels. 4/4 is common and steady, 3/4 has that waltz feel, and 6/8 creates a lilting, compound meter. Experiment with clapping patterns in each to internalize the feel."
      ]
    };

    const topicResponses = responses[topic];
    return topicResponses[Math.floor(Math.random() * topicResponses.length)];
  }

  private getEmotionalSupportResponse(): string {
    const responses = [
      "I understand that feeling stuck can be frustrating, and it's completely normal in your musical journey! Every professional musician has faced these challenges. The key is to break down what you're working on into smaller, manageable pieces. What specific aspect is giving you the most trouble?",
      "Remember, musical growth isn't always linear - sometimes we need to step back and approach things differently. Try practicing something you already know well to rebuild your confidence, then gradually work back to the challenging material. You've got this!",
      "Frustration often means you're pushing your boundaries, which is actually a good sign! It means you're growing. Take a short break, do some deep breathing, and when you return, try practicing more slowly or breaking the material into smaller sections."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getPracticeGuidanceResponse(): string {
    const responses = [
      "Effective practice is about quality, not just quantity! Start with a warm-up, then focus on your most challenging material when your mind is fresh. Always use a metronome and practice slowly at first - speed will come naturally with accuracy.",
      "Structure your practice sessions: 10 minutes warm-up, 20 minutes technique, 15 minutes repertoire, 10 minutes improvisation or fun pieces. This keeps your practice balanced and engaging while addressing all aspects of your musicianship.",
      "Keep a practice journal to track your progress and identify areas that need attention. Set specific, achievable goals for each session. Remember: 30 minutes of focused practice is worth more than 2 hours of distracted playing."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getCollaborationResponse(): string {
    const responses = [
      "Playing with others is one of the most rewarding aspects of music! Start by finding musicians at a similar skill level with complementary instruments. Focus on simple songs you all know, and don't worry about perfection - communication and listening are more important than technical prowess.",
      "Great collaboration starts with good listening skills. Practice playing along with recordings to develop your ability to lock in with other musicians. Learn to leave space for others and support the overall musical conversation rather than just showcasing your own skills.",
      "Consider joining a local jam session or starting a practice group. Online platforms can also connect you with musicians for virtual collaboration. The key is regular practice together - even 30 minutes weekly with the same group will dramatically improve your ensemble skills."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getGeneralMusicResponse(): string {
    return "I'm here to help with all aspects of your musical journey! Whether you need help with theory, technique, practice strategies, or just want to talk through musical challenges, I'm ready to assist. What specific area of music would you like to explore today?";
  }

  async analyzeStudentProgress(studentData: any): Promise<any> {
    const analysisPrompt = `Analyze this music student's progress and provide recommendations:
    Level: ${studentData.level}
    Instrument: ${studentData.instrument}
    Recent activity: ${studentData.recentLessons || 0} lessons
    
    Provide analysis in JSON format with skillLevel, strengths, weaknesses, recommendedActions, and practiceGoals.`;

    const response = await this.generateResponse({ prompt: analysisPrompt });
    
    // Parse or generate structured response
    try {
      return JSON.parse(response.response);
    } catch {
      // Fallback structured response
      return {
        skillLevel: studentData.level || 'intermediate',
        strengths: ['Rhythm', 'Basic technique'],
        weaknesses: ['Music theory', 'Advanced harmony'],
        recommendedActions: [
          {
            type: 'lesson',
            priority: 'high',
            title: 'Music Theory Fundamentals',
            description: 'Focus on chord progressions and scale relationships',
            estimatedTime: 20,
            actionable: true
          }
        ],
        practiceGoals: ['Practice scales daily', 'Learn 3 new chord progressions']
      };
    }
  }

  async createLessonPlan(topic: string, duration: number, studentLevel: string): Promise<any> {
    const prompt = `Create a ${duration}-minute music lesson plan on "${topic}" for a ${studentLevel} student. Include objectives, activities, and assessment.`;
    
    const response = await this.generateResponse({ prompt });
    
    // Return structured lesson plan
    return {
      title: `${topic} - ${studentLevel} Level`,
      objectives: [`Understand ${topic} fundamentals`, `Apply ${topic} in practice`],
      activities: [
        {
          name: 'Warm-up and Review',
          duration: Math.floor(duration * 0.2),
          description: 'Review previous concepts and warm up',
          materials: ['Instrument', 'Metronome']
        },
        {
          name: 'Core Learning',
          duration: Math.floor(duration * 0.6),
          description: response.response.substring(0, 200),
          materials: ['Sheet music', 'Audio examples']
        },
        {
          name: 'Practice and Application',
          duration: Math.floor(duration * 0.2),
          description: 'Apply new concepts through guided practice',
          materials: ['Practice exercises']
        }
      ],
      assessment: 'Observe student application of new concepts',
      homework: `Practice ${topic} exercises for 15 minutes daily`
    };
  }

  getModelStatus(): { initialized: boolean; models: string[]; performance: string } {
    return {
      initialized: this.isInitialized,
      models: this.availableModels,
      performance: this.availableModels.includes('pattern-based') ? 'Fast (Pattern-based)' : 'Advanced (LLM)'
    };
  }
}

export const selfHostedMusicAI = new SelfHostedMusicAI();