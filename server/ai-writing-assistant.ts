import OpenAI from "openai";
import { WebSocketServer, WebSocket } from "ws";

interface WritingProject {
  id: string;
  title: string;
  genre: 'novel' | 'screenplay' | 'poetry' | 'journalism' | 'technical' | 'academic';
  content: string;
  wordCount: number;
  targetWordCount?: number;
  characters: Character[];
  plotOutline: PlotPoint[];
  status: 'draft' | 'revision' | 'final';
}

interface Character {
  id: string;
  name: string;
  description: string;
  personality: string[];
  relationships: { [characterId: string]: string };
  voiceProfile: VoiceProfile;
}

interface VoiceProfile {
  tone: string;
  vocabulary: 'simple' | 'moderate' | 'complex';
  speechPatterns: string[];
  catchphrases: string[];
  emotionalRange: string[];
}

interface PlotPoint {
  id: string;
  chapter: number;
  event: string;
  characters: string[];
  importance: 'major' | 'minor' | 'subplot';
  resolved: boolean;
}

interface WritingSuggestion {
  type: 'grammar' | 'style' | 'plot' | 'character' | 'dialogue' | 'pacing';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
  confidence: number;
  position: { start: number; end: number };
}

export class AIWritingAssistant {
  private openai: OpenAI;
  private writingWSS?: WebSocketServer;
  private activeProjects: Map<string, WritingProject> = new Map();

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.initializeAssistant();
  }

  private async initializeAssistant() {
    this.setupWritingServer();
    console.log("AI Writing Assistant initialized");
  }

  private setupWritingServer() {
    this.writingWSS = new WebSocketServer({ port: 8089 });
    
    this.writingWSS.on('connection', (ws: WebSocket) => {
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleWritingMessage(ws, message);
        } catch (error) {
          console.error("Error processing writing message:", error);
        }
      });
    });

    console.log("AI writing server started on port 8089");
  }

  async analyzeText(text: string, genre: string): Promise<WritingSuggestion[]> {
    // Placeholder for text analysis
    return [
      {
        type: 'style',
        severity: 'low',
        message: 'Consider varying sentence length',
        suggestion: 'Mix short and long sentences for better flow',
        confidence: 0.8,
        position: { start: 0, end: 50 }
      }
    ];
  }

  async generateContent(prompt: string, genre: string, style: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: `You are a professional ${genre} writer. Write in ${style} style.` },
          { role: "user", content: prompt }
        ]
      });

      return response.choices[0].message.content || "Generated content placeholder";
    } catch (error) {
      return "Content generation placeholder";
    }
  }

  private handleWritingMessage(ws: WebSocket, message: any) {
    // Placeholder message handling
    ws.send(JSON.stringify({ type: 'placeholder', data: 'Writing assistant placeholder' }));
  }

  getAssistantStatus() {
    return {
      engine: 'AI Writing Assistant',
      status: 'placeholder',
      activeProjects: this.activeProjects.size,
      serverPort: 8089
    };
  }
}

export const aiWritingAssistant = new AIWritingAssistant();