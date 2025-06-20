import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Brain, 
  Music, 
  BookOpen, 
  Target,
  Lightbulb,
  TrendingUp,
  Heart,
  Mic,
  Volume2,
  Settings,
  User,
  Sparkles,
  ChevronRight,
  Play
} from "lucide-react";

interface AIDeanMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category: 'general' | 'theory' | 'performance' | 'collaboration' | 'emotional';
  actionable?: boolean;
  actions?: AISuggestion[];
}

interface AISuggestion {
  id: string;
  type: 'exercise' | 'lesson' | 'practice' | 'collaboration' | 'resource';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  action: () => void;
}

interface StudentProfile {
  id: string;
  name: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  instruments: string[];
  learning_goals: string[];
  recent_progress: ProgressMetric[];
  emotional_state: 'motivated' | 'struggling' | 'confident' | 'frustrated';
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
}

interface ProgressMetric {
  skill: string;
  score: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  last_updated: Date;
}

export default function AIMusicDean() {
  const [messages, setMessages] = useState<AIDeanMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  const [activeMode, setActiveMode] = useState<'chat' | 'analysis' | 'guidance'>('chat');
  const [isThinking, setIsThinking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sample student data
  useEffect(() => {
    initializeAIDean();
    setupVoiceRecognition();
  }, []);

  const initializeAIDean = () => {
    // Sample student profile
    const studentProfile: StudentProfile = {
      id: 'student1',
      name: 'Alex Johnson',
      skill_level: 'intermediate',
      instruments: ['piano', 'guitar'],
      learning_goals: ['Improve chord progressions', 'Learn jazz theory', 'Compose original songs'],
      recent_progress: [
        { skill: 'Piano Technique', score: 75, trend: 'improving', last_updated: new Date() },
        { skill: 'Music Theory', score: 60, trend: 'stable', last_updated: new Date() },
        { skill: 'Rhythm', score: 85, trend: 'improving', last_updated: new Date() }
      ],
      emotional_state: 'motivated',
      learning_style: 'visual'
    };

    setCurrentStudent(studentProfile);

    // Welcome message
    const welcomeMessage: AIDeanMessage = {
      id: 'welcome',
      type: 'ai',
      content: `Hello ${studentProfile.name}! I'm your AI Music Dean. I'm here to help you with music theory, performance techniques, emotional support, and collaborative learning. I can see you're working on chord progressions and jazz theory - excellent goals! How can I assist you today?`,
      timestamp: new Date(),
      category: 'general',
      actionable: true,
      actions: [
        {
          id: 'theory-lesson',
          type: 'lesson',
          title: 'Jazz Chord Progressions',
          description: 'Learn ii-V-I progressions with interactive examples',
          difficulty: 'intermediate',
          estimatedTime: 15,
          action: () => suggestLesson('jazz-chords')
        },
        {
          id: 'practice-session',
          type: 'practice',
          title: 'Piano Technique Practice',
          description: 'Guided practice session for finger independence',
          difficulty: 'intermediate',
          estimatedTime: 20,
          action: () => startPracticeSession('piano-technique')
        }
      ]
    };

    setMessages([welcomeMessage]);
  };

  const setupVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIDeanMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      category: 'general'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsThinking(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, currentStudent);
      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, student: StudentProfile | null): AIDeanMessage => {
    const input = userInput.toLowerCase();
    
    // Analyze user input and generate contextual response
    let response = '';
    let category: AIDeanMessage['category'] = 'general';
    let actions: AISuggestion[] = [];

    if (input.includes('theory') || input.includes('chord') || input.includes('scale')) {
      category = 'theory';
      response = `Great question about music theory! Based on your current level and goals, I'd recommend starting with jazz chord extensions. You're already comfortable with basic triads, so let's explore 7th chords and their inversions. This will directly support your goal of improving chord progressions.`;
      
      actions = [
        {
          id: 'chord-ext',
          type: 'lesson',
          title: 'Chord Extensions Workshop',
          description: 'Interactive lesson on 7th, 9th, and 11th chords',
          difficulty: 'intermediate',
          estimatedTime: 25,
          action: () => suggestLesson('chord-extensions')
        },
        {
          id: 'practice-chords',
          type: 'exercise',
          title: 'Chord Progression Practice',
          description: 'Practice common jazz progressions with your new chord knowledge',
          difficulty: 'intermediate',
          estimatedTime: 15,
          action: () => startExercise('chord-progressions')
        }
      ];
    } else if (input.includes('frustrated') || input.includes('difficult') || input.includes('stuck')) {
      category = 'emotional';
      response = `I can hear that you're feeling challenged right now, and that's completely normal in your musical journey! Remember, every professional musician has faced these moments. Let's break down what you're working on into smaller, manageable steps. What specific aspect is giving you the most trouble?`;
      
      actions = [
        {
          id: 'breathing',
          type: 'exercise',
          title: 'Mindful Music Practice',
          description: 'Breathing exercises and mental preparation for practice',
          difficulty: 'beginner',
          estimatedTime: 10,
          action: () => startMindfulnessSession()
        },
        {
          id: 'simple-wins',
          type: 'practice',
          title: 'Quick Confidence Builder',
          description: 'Practice something you already know well to rebuild confidence',
          difficulty: 'beginner',
          estimatedTime: 10,
          action: () => suggestConfidenceBuilder()
        }
      ];
    } else if (input.includes('collaborate') || input.includes('play with') || input.includes('band')) {
      category = 'collaboration';
      response = `Collaboration is such an important part of musical growth! I can help you find practice partners or suggest collaborative exercises. Based on your skills, you'd work well with other intermediate players. Would you like me to match you with someone working on similar goals?`;
      
      actions = [
        {
          id: 'find-partner',
          type: 'collaboration',
          title: 'Find Practice Partner',
          description: 'Match with another student for collaborative practice',
          difficulty: 'intermediate',
          estimatedTime: 30,
          action: () => findCollaborationPartner()
        }
      ];
    } else if (input.includes('practice') || input.includes('exercise')) {
      category = 'performance';
      response = `Excellent! Regular practice is key to improvement. Looking at your progress, your rhythm skills are really developing well (+85%), and your piano technique is improving steadily. Let's focus on your music theory, which could use some attention. I'll suggest some targeted exercises.`;
      
      actions = [
        {
          id: 'interval-training',
          type: 'exercise',
          title: 'Interval Recognition',
          description: 'Ear training exercises to improve your theory understanding',
          difficulty: 'intermediate',
          estimatedTime: 15,
          action: () => startEarTraining()
        }
      ];
    } else {
      response = `I'm here to help with anything music-related! Whether you need help with theory, technique, practice strategies, or even just someone to talk through musical challenges with. What would you like to explore today?`;
    }

    return {
      id: `ai_${Date.now()}`,
      type: 'ai',
      content: response,
      timestamp: new Date(),
      category,
      actionable: actions.length > 0,
      actions
    };
  };

  const suggestLesson = (lessonType: string) => {
    console.log(`Starting lesson: ${lessonType}`);
    // In production, this would navigate to the lesson or open lesson content
  };

  const startPracticeSession = (sessionType: string) => {
    console.log(`Starting practice session: ${sessionType}`);
    // In production, this would open practice tools
  };

  const startExercise = (exerciseType: string) => {
    console.log(`Starting exercise: ${exerciseType}`);
    // In production, this would launch interactive exercises
  };

  const startMindfulnessSession = () => {
    console.log('Starting mindfulness session');
    // In production, this would open guided meditation/breathing exercises
  };

  const suggestConfidenceBuilder = () => {
    console.log('Starting confidence building exercise');
    // In production, this would suggest easy pieces they know
  };

  const findCollaborationPartner = () => {
    console.log('Finding collaboration partner');
    // In production, this would use matching algorithm
  };

  const startEarTraining = () => {
    console.log('Starting ear training');
    // In production, this would open ear training tools
  };

  const StudentAnalysis = () => (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-orange-400 mb-4">STUDENT ANALYSIS</div>
      
      {currentStudent && (
        <div className="space-y-4">
          {/* Student Overview */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center">
                <User size={16} className="mr-2" />
                {currentStudent.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Skill Level:</span>
                <Badge variant="secondary">{currentStudent.skill_level}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Instruments:</span>
                <span className="text-white">{currentStudent.instruments.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Learning Style:</span>
                <span className="text-white">{currentStudent.learning_style}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Emotional State:</span>
                <Badge 
                  variant={currentStudent.emotional_state === 'motivated' ? 'default' : 'secondary'}
                  className={currentStudent.emotional_state === 'motivated' ? 'bg-green-600' : ''}
                >
                  {currentStudent.emotional_state}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Progress Metrics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center">
                <TrendingUp size={16} className="mr-2" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentStudent.recent_progress.map(metric => (
                <div key={metric.skill} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{metric.skill}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white">{metric.score}%</span>
                      <Badge 
                        variant="secondary"
                        className={
                          metric.trend === 'improving' ? 'bg-green-600 text-white' :
                          metric.trend === 'declining' ? 'bg-red-600 text-white' :
                          'bg-gray-600 text-white'
                        }
                      >
                        {metric.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-orange-400 h-2 rounded-full"
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Learning Goals */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center">
                <Target size={16} className="mr-2" />
                Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentStudent.learning_goals.map((goal, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <ChevronRight size={12} className="text-orange-400 mr-2" />
                    <span className="text-gray-300">{goal}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const AIGuidance = () => (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-orange-400 mb-4">AI GUIDANCE SYSTEM</div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="h-16 flex flex-col items-center justify-center"
          onClick={() => suggestLesson('theory-fundamentals')}
        >
          <BookOpen size={16} className="mb-1" />
          <span className="text-xs">Theory Lesson</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="h-16 flex flex-col items-center justify-center"
          onClick={() => startPracticeSession('technique')}
        >
          <Music size={16} className="mb-1" />
          <span className="text-xs">Practice Session</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="h-16 flex flex-col items-center justify-center"
          onClick={() => startEarTraining()}
        >
          <Volume2 size={16} className="mb-1" />
          <span className="text-xs">Ear Training</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="h-16 flex flex-col items-center justify-center"
          onClick={() => findCollaborationPartner()}
        >
          <Heart size={16} className="mb-1" />
          <span className="text-xs">Find Partner</span>
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center">
            <Lightbulb size={16} className="mr-2" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-gray-300">
            Based on your recent progress and goals:
          </div>
          
          <div className="space-y-2">
            <div className="bg-gray-900 rounded p-2">
              <div className="text-xs font-medium text-white mb-1">
                Focus on Jazz Theory
              </div>
              <div className="text-xs text-gray-400">
                Your rhythm is strong, now's a great time to dive deeper into jazz chord progressions
              </div>
              <Button variant="ghost" size="sm" className="mt-2 h-6 text-xs">
                Start Now
              </Button>
            </div>
            
            <div className="bg-gray-900 rounded p-2">
              <div className="text-xs font-medium text-white mb-1">
                Practice with Others
              </div>
              <div className="text-xs text-gray-400">
                Your skills are perfect for collaborative playing - find a practice partner
              </div>
              <Button variant="ghost" size="sm" className="mt-2 h-6 text-xs">
                Find Partner
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="h-full bg-gray-900 border-gray-700 flex flex-col">
      <CardHeader className="pb-3 border-b border-gray-700">
        <CardTitle className="text-orange-400 flex items-center">
          <Brain size={20} className="mr-2" />
          AI Music Dean
        </CardTitle>
        <div className="text-xs text-gray-400">
          Your intelligent music teacher, collaborator & counselor
        </div>
      </CardHeader>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'chat' | 'analysis' | 'guidance')} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 mx-4 mt-2">
            <TabsTrigger value="chat" className="text-xs">
              <MessageCircle size={14} className="mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">
              <TrendingUp size={14} className="mr-1" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="guidance" className="text-xs">
              <Sparkles size={14} className="mr-1" />
              Guidance
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="chat" className="h-full m-0 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-800 text-gray-100'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        
                        {message.actions && message.actions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.actions.map(action => (
                              <Button
                                key={action.id}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs bg-gray-700 hover:bg-gray-600"
                                onClick={action.action}
                              >
                                <Play size={12} className="mr-2" />
                                {action.title} ({action.estimatedTime}min)
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isThinking && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
                          <span className="text-sm">AI Dean is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about music, theory, practice, or how you're feeling..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <Button
                    onClick={startVoiceInput}
                    variant="outline"
                    size="sm"
                    className={isListening ? 'bg-red-600' : ''}
                  >
                    <Mic size={16} />
                  </Button>
                  <Button onClick={sendMessage} className="bg-orange-600 hover:bg-orange-700">
                    Send
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <StudentAnalysis />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="guidance" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <AIGuidance />
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Card>
  );
}