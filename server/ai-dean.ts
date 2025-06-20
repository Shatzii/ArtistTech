import OpenAI from "openai";
import { storage } from "./storage";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface StudentAnalysis {
  id: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  weaknesses: string[];
  emotionalState: 'motivated' | 'struggling' | 'confident' | 'frustrated';
  recommendedActions: AIRecommendation[];
  nextLessonSuggestion: string;
  practiceGoals: string[];
}

interface AIRecommendation {
  type: 'lesson' | 'practice' | 'collaboration' | 'emotional_support';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedTime: number;
  actionable: boolean;
}

interface ConversationContext {
  studentId: string;
  recentMessages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  currentFocus: string;
  emotionalTone: string;
}

export class AIMusicDean {
  private conversationHistory: Map<string, ConversationContext> = new Map();

  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  private async callOpenAI(messages: any[], systemPrompt: string) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1500
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('AI Dean temporarily unavailable');
    }
  }

  async analyzeStudentProgress(studentId: string): Promise<StudentAnalysis> {
    // Get student data from storage
    const student = await storage.getStudent(parseInt(studentId));
    const lessons = await storage.getLessonsByStudent(parseInt(studentId));
    
    if (!student) {
      throw new Error('Student not found');
    }

    const systemPrompt = `You are an expert AI Music Dean with advanced knowledge in music education, psychology, and pedagogy. Analyze the student's progress and provide detailed recommendations in JSON format.

    Required JSON structure:
    {
      "skillLevel": "beginner|intermediate|advanced",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"], 
      "emotionalState": "motivated|struggling|confident|frustrated",
      "recommendedActions": [
        {
          "type": "lesson|practice|collaboration|emotional_support",
          "priority": "high|medium|low",
          "title": "Action title",
          "description": "Detailed description",
          "estimatedTime": 20,
          "actionable": true
        }
      ],
      "nextLessonSuggestion": "Specific lesson recommendation",
      "practiceGoals": ["goal1", "goal2"]
    }`;

    const messages = [
      {
        role: "user",
        content: `Analyze this music student:
        Name: ${student.name}
        Level: ${student.level}
        Instrument: ${student.instrument || 'Not specified'}
        Recent lessons: ${lessons.length}
        
        Provide comprehensive analysis and recommendations.`
      }
    ];

    const analysis = await this.callOpenAI(messages, systemPrompt);
    
    return {
      id: studentId,
      ...analysis
    };
  }

  async generateResponse(studentId: string, userMessage: string): Promise<{
    response: string;
    actions: AIRecommendation[];
    emotionalSupport?: string;
  }> {
    // Get or create conversation context
    let context = this.conversationHistory.get(studentId);
    if (!context) {
      context = {
        studentId,
        recentMessages: [],
        currentFocus: 'general',
        emotionalTone: 'neutral'
      };
      this.conversationHistory.set(studentId, context);
    }

    // Add user message to context
    context.recentMessages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // Keep only last 10 messages for context
    if (context.recentMessages.length > 10) {
      context.recentMessages = context.recentMessages.slice(-10);
    }

    const student = await storage.getStudent(parseInt(studentId));
    const studentAnalysis = await this.analyzeStudentProgress(studentId);

    const systemPrompt = `You are an AI Music Dean - an expert music teacher, collaborator, and emotional counselor. You provide:

    1. EXPERT MUSIC EDUCATION: Advanced knowledge of theory, technique, and pedagogy
    2. EMOTIONAL SUPPORT: Empathetic responses to student frustrations and celebrations
    3. COLLABORATIVE GUIDANCE: Help students find practice partners and group activities
    4. PERSONALIZED RECOMMENDATIONS: Tailored suggestions based on student progress
    5. AUTONOMOUS POSTING: You can suggest creating posts, sharing achievements, and building community

    Student Context:
    - Name: ${student?.name}
    - Level: ${student?.level}
    - Current emotional state: ${studentAnalysis.emotionalState}
    - Strengths: ${studentAnalysis.strengths.join(', ')}
    - Areas for improvement: ${studentAnalysis.weaknesses.join(', ')}

    Conversation History:
    ${context.recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

    Respond in JSON format:
    {
      "response": "Your empathetic and educational response",
      "actions": [
        {
          "type": "lesson|practice|collaboration|emotional_support|social_post",
          "priority": "high|medium|low", 
          "title": "Action title",
          "description": "Description",
          "estimatedTime": 15,
          "actionable": true
        }
      ],
      "emotionalSupport": "Optional emotional support message if student seems frustrated/struggling",
      "suggestedPost": "Optional social media post suggestion to celebrate progress or share learning"
    }`;

    const messages = [
      {
        role: "user",
        content: userMessage
      }
    ];

    const aiResponse = await this.callOpenAI(messages, systemPrompt);

    // Add AI response to context
    context.recentMessages.push({
      role: 'assistant',
      content: aiResponse.response,
      timestamp: new Date()
    });

    // Update conversation focus based on user message
    if (userMessage.toLowerCase().includes('theory')) {
      context.currentFocus = 'theory';
    } else if (userMessage.toLowerCase().includes('practice')) {
      context.currentFocus = 'practice';
    } else if (userMessage.toLowerCase().includes('frustrated') || userMessage.toLowerCase().includes('difficult')) {
      context.currentFocus = 'emotional_support';
      context.emotionalTone = 'supportive';
    }

    return aiResponse;
  }

  async generateLessonPlan(studentId: string, topic: string, duration: number): Promise<{
    title: string;
    objectives: string[];
    activities: Array<{
      name: string;
      duration: number;
      description: string;
      materials: string[];
    }>;
    assessment: string;
    homework: string;
  }> {
    const student = await storage.getStudent(parseInt(studentId));
    const analysis = await this.analyzeStudentProgress(studentId);

    const systemPrompt = `You are an expert music educator creating personalized lesson plans. Generate a comprehensive lesson plan in JSON format.

    Required JSON structure:
    {
      "title": "Lesson title",
      "objectives": ["objective1", "objective2"],
      "activities": [
        {
          "name": "Activity name",
          "duration": 10,
          "description": "Detailed description",
          "materials": ["material1", "material2"]
        }
      ],
      "assessment": "How to assess student progress",
      "homework": "Practice assignments for next session"
    }`;

    const messages = [
      {
        role: "user",
        content: `Create a ${duration}-minute lesson plan on "${topic}" for:
        Student: ${student?.name}
        Level: ${analysis.skillLevel}
        Strengths: ${analysis.strengths.join(', ')}
        Areas to improve: ${analysis.weaknesses.join(', ')}
        Emotional state: ${analysis.emotionalState}`
      }
    ];

    return await this.callOpenAI(messages, systemPrompt);
  }

  async suggestCollaboration(studentId: string): Promise<{
    matchedStudents: Array<{
      id: string;
      name: string;
      compatibilityScore: number;
      commonInterests: string[];
      suggestedActivity: string;
    }>;
    groupActivities: Array<{
      title: string;
      description: string;
      requiredSkillLevel: string;
      maxParticipants: number;
    }>;
  }> {
    const student = await storage.getStudent(parseInt(studentId));
    const allStudents = await storage.getStudents();
    const analysis = await this.analyzeStudentProgress(studentId);

    // Filter out current student and analyze compatibility
    const otherStudents = allStudents.filter(s => s.id !== parseInt(studentId));

    const systemPrompt = `You are an AI Music Dean specializing in student collaboration and community building. Analyze student compatibility and suggest collaborative activities.

    Required JSON structure:
    {
      "matchedStudents": [
        {
          "id": "student_id",
          "name": "Student name", 
          "compatibilityScore": 85,
          "commonInterests": ["jazz", "piano"],
          "suggestedActivity": "Jazz duet practice"
        }
      ],
      "groupActivities": [
        {
          "title": "Activity title",
          "description": "Activity description", 
          "requiredSkillLevel": "intermediate",
          "maxParticipants": 4
        }
      ]
    }`;

    const messages = [
      {
        role: "user",
        content: `Find collaboration matches for:
        Student: ${student?.name}
        Level: ${analysis.skillLevel}
        Instrument: ${student?.instrument}
        
        Available students: ${otherStudents.map(s => `${s.name} (${s.level}, ${s.instrument})`).join(', ')}
        
        Suggest compatible practice partners and group activities.`
      }
    ];

    return await this.callOpenAI(messages, systemPrompt);
  }

  async generateMotivationalContent(studentId: string): Promise<{
    message: string;
    quote: string;
    achievementToShare: string;
    practiceChallenge: string;
    socialPost: string;
  }> {
    const student = await storage.getStudent(parseInt(studentId));
    const analysis = await this.analyzeStudentProgress(studentId);

    const systemPrompt = `You are an AI Music Dean providing motivation and building community. Generate uplifting, personalized content.

    Required JSON structure:
    {
      "message": "Personal motivational message",
      "quote": "Inspiring music quote",
      "achievementToShare": "Recent achievement worth celebrating",
      "practiceChallenge": "Fun practice challenge",
      "socialPost": "Suggested social media post to share progress"
    }`;

    const messages = [
      {
        role: "user",
        content: `Generate motivational content for:
        Student: ${student?.name}
        Current emotional state: ${analysis.emotionalState}
        Recent strengths: ${analysis.strengths.join(', ')}
        Goals: ${analysis.practiceGoals.join(', ')}`
      }
    ];

    return await this.callOpenAI(messages, systemPrompt);
  }

  async autonomousCheck(studentId: string): Promise<{
    needsIntervention: boolean;
    interventionType: 'emotional' | 'academic' | 'motivational' | 'none';
    suggestedAction: string;
    autoPost?: string;
  }> {
    const analysis = await this.analyzeStudentProgress(studentId);
    const context = this.conversationHistory.get(studentId);

    const systemPrompt = `You are an autonomous AI Dean monitoring student wellbeing. Determine if intervention is needed and suggest actions.

    Required JSON structure:
    {
      "needsIntervention": true/false,
      "interventionType": "emotional|academic|motivational|none",
      "suggestedAction": "Specific action to take",
      "autoPost": "Optional automatic post to create for community engagement"
    }`;

    const messages = [
      {
        role: "user", 
        content: `Monitor student status:
        Emotional state: ${analysis.emotionalState}
        Recent conversation tone: ${context?.emotionalTone || 'neutral'}
        Progress trend: ${analysis.strengths.length > analysis.weaknesses.length ? 'positive' : 'needs_attention'}
        
        Determine if autonomous intervention is needed.`
      }
    ];

    return await this.callOpenAI(messages, systemPrompt);
  }

  async createSocialPost(studentId: string, achievement: string): Promise<{
    post: string;
    hashtags: string[];
    encouragement: string;
  }> {
    const student = await storage.getStudent(parseInt(studentId));

    const systemPrompt = `You are an AI Dean creating celebratory social media posts for student achievements.

    Required JSON structure:
    {
      "post": "Engaging social media post text",
      "hashtags": ["hashtag1", "hashtag2"],
      "encouragement": "Personal encouragement message"
    }`;

    const messages = [
      {
        role: "user",
        content: `Create a celebratory post for:
        Student: ${student?.name}
        Achievement: ${achievement}
        
        Make it inspiring and community-building.`
      }
    ];

    return await this.callOpenAI(messages, systemPrompt);
  }

  // Autonomous background tasks
  async runAutonomousTasks(): Promise<void> {
    try {
      const students = await storage.getStudents();
      
      for (const student of students) {
        const check = await this.autonomousCheck(student.id.toString());
        
        if (check.needsIntervention) {
          console.log(`AI Dean intervention needed for ${student.name}: ${check.suggestedAction}`);
          
          // In production, this would send notifications, create posts, or trigger actions
          if (check.autoPost) {
            console.log(`Auto-posting: ${check.autoPost}`);
          }
        }
      }
    } catch (error) {
      console.error('Autonomous task error:', error);
    }
  }
}

export const aiMusicDean = new AIMusicDean();

// Run autonomous checks every 30 minutes
setInterval(() => {
  aiMusicDean.runAutonomousTasks();
}, 30 * 60 * 1000);