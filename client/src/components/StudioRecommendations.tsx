import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Music, 
  Video, 
  Headphones, 
  Mic, 
  Palette, 
  Users, 
  BarChart3,
  Gamepad2,
  Star,
  TrendingUp,
  Target,
  Clock,
  Zap,
  Award,
  Brain,
  Sparkles
} from 'lucide-react';
import { Link } from 'wouter';

interface UserProfile {
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  interests: string[];
  timeAvailable: number; // minutes per session
  goals: string[];
  currentProjects: string[];
  preferredGenres: string[];
}

interface StudioRecommendation {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  route: string;
  matchScore: number;
  reasoning: string[];
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  badges: string[];
  nextSteps: string[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  studios: string[];
  duration: number;
  skills: string[];
}

export default function StudioRecommendations() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    skillLevel: 'intermediate',
    interests: ['music', 'collaboration', 'monetization'],
    timeAvailable: 60,
    goals: ['increase earnings', 'improve skills', 'build network'],
    currentProjects: ['music video', 'podcast series'],
    preferredGenres: ['electronic', 'hip-hop']
  });

  const [recommendations, setRecommendations] = useState<StudioRecommendation[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const allStudios: Omit<StudioRecommendation, 'matchScore' | 'reasoning'>[] = [
    {
      id: 'music-studio',
      name: 'Music Studio Pro',
      description: 'Professional DAW with AI composition, unlimited tracks, VST support',
      icon: Music,
      color: 'from-purple-600 to-blue-600',
      route: '/music-studio',
      estimatedTime: 45,
      difficulty: 'intermediate',
      badges: ['PRO', 'AI'],
      nextSteps: ['Learn chord progressions', 'Experiment with AI composition', 'Collaborate with others']
    },
    {
      id: 'dj-studio',
      name: 'Ultimate DJ Studio',
      description: 'Real-time stem separation, harmonic mixing, crowd analytics',
      icon: Headphones,
      color: 'from-orange-600 to-red-600',
      route: '/dj-studio',
      estimatedTime: 30,
      difficulty: 'advanced',
      badges: ['LIVE', 'PRO'],
      nextSteps: ['Practice beatmatching', 'Learn harmonic mixing', 'Build your setlist']
    },
    {
      id: 'video-studio',
      name: 'Video Creator Pro',
      description: '8K editing, AI effects, cinematic tools surpassing Premiere Pro',
      icon: Video,
      color: 'from-green-600 to-emerald-600',
      route: '/video-studio',
      estimatedTime: 60,
      difficulty: 'intermediate',
      badges: ['AI', '8K'],
      nextSteps: ['Create music video', 'Learn color grading', 'Add AI effects']
    },
    {
      id: 'podcast-studio',
      name: 'Podcast Studio Pro',
      description: 'Live streaming, AI transcription, social clips automation',
      icon: Mic,
      color: 'from-cyan-600 to-blue-600',
      route: '/podcast-studio',
      estimatedTime: 40,
      difficulty: 'beginner',
      badges: ['NEW', 'AI'],
      nextSteps: ['Plan episode topics', 'Set up recording', 'Publish to platforms']
    },
    {
      id: 'visual-studio',
      name: 'Visual Arts Studio',
      description: 'AI background removal, neural style transfer, 16K upscaling',
      icon: Palette,
      color: 'from-pink-600 to-purple-600',
      route: '/visual-studio',
      estimatedTime: 35,
      difficulty: 'intermediate',
      badges: ['AI', '16K'],
      nextSteps: ['Create album artwork', 'Design social media content', 'Learn digital painting']
    },
    {
      id: 'collaborative-studio',
      name: 'Collaborative Studio',
      description: 'Real-time multi-user editing, voice chat, version control',
      icon: Users,
      color: 'from-yellow-600 to-orange-600',
      route: '/collaborative-studio',
      estimatedTime: 50,
      difficulty: 'intermediate',
      badges: ['COLLAB', 'REAL-TIME'],
      nextSteps: ['Find collaborators', 'Join active projects', 'Start group session']
    },
    {
      id: 'ai-career',
      name: 'AI Career Manager',
      description: 'Analytics automation, marketing AI, revenue optimization',
      icon: BarChart3,
      color: 'from-indigo-600 to-purple-600',
      route: '/ai-career-dashboard',
      estimatedTime: 25,
      difficulty: 'beginner',
      badges: ['AI', 'BUSINESS'],
      nextSteps: ['Analyze performance', 'Set revenue goals', 'Automate marketing']
    },
    {
      id: 'genre-remixer',
      name: 'Genre Remixer AI',
      description: 'Cross-genre collaboration, remix opportunities, AI analysis',
      icon: Gamepad2,
      color: 'from-teal-600 to-cyan-600',
      route: '/genre-remixer',
      estimatedTime: 30,
      difficulty: 'advanced',
      badges: ['AI', 'EXPERIMENTAL'],
      nextSteps: ['Explore genre fusion', 'Find remix partners', 'Analyze music patterns']
    }
  ];

  const learningPathsData: LearningPath[] = [
    {
      id: 'music-producer',
      title: 'Music Producer Mastery',
      description: 'Complete journey from beginner to professional music producer',
      studios: ['music-studio', 'ai-career', 'collaborative-studio'],
      duration: 120,
      skills: ['composition', 'mixing', 'collaboration', 'business']
    },
    {
      id: 'content-creator',
      title: 'Multi-Media Content Creator',
      description: 'Master video, audio, and visual content creation',
      studios: ['video-studio', 'podcast-studio', 'visual-studio'],
      duration: 90,
      skills: ['video editing', 'storytelling', 'design', 'branding']
    },
    {
      id: 'dj-performer',
      title: 'Professional DJ & Performer',
      description: 'From bedroom DJ to professional performer',
      studios: ['dj-studio', 'music-studio', 'ai-career'],
      duration: 75,
      skills: ['mixing', 'performance', 'crowd reading', 'marketing']
    }
  ];

  // AI-powered recommendation engine
  const generateRecommendations = (profile: UserProfile): StudioRecommendation[] => {
    const scoredStudios = allStudios.map(studio => {
      let score = 0;
      const reasoning: string[] = [];

      // Skill level matching
      if (studio.difficulty === profile.skillLevel) {
        score += 30;
        reasoning.push(`Perfect skill level match (${profile.skillLevel})`);
      } else if (
        (studio.difficulty === 'beginner' && profile.skillLevel === 'intermediate') ||
        (studio.difficulty === 'intermediate' && profile.skillLevel === 'advanced')
      ) {
        score += 20;
        reasoning.push('Good progression from current skill level');
      }

      // Interest matching
      profile.interests.forEach(interest => {
        if (studio.description.toLowerCase().includes(interest) || 
            studio.name.toLowerCase().includes(interest)) {
          score += 15;
          reasoning.push(`Matches your interest in ${interest}`);
        }
      });

      // Time availability
      if (studio.estimatedTime <= profile.timeAvailable) {
        score += 10;
        reasoning.push('Fits your available time');
      } else if (studio.estimatedTime <= profile.timeAvailable + 15) {
        score += 5;
        reasoning.push('Slightly longer but manageable');
      }

      // Goal alignment
      profile.goals.forEach(goal => {
        if (goal.includes('earnings') && studio.badges.includes('BUSINESS')) {
          score += 20;
          reasoning.push('Helps achieve earnings goals');
        }
        if (goal.includes('skills') && studio.badges.includes('AI')) {
          score += 15;
          reasoning.push('AI-powered learning accelerates skill development');
        }
        if (goal.includes('network') && studio.badges.includes('COLLAB')) {
          score += 20;
          reasoning.push('Expands your professional network');
        }
      });

      // Current project synergy
      profile.currentProjects.forEach(project => {
        if (project.includes('video') && studio.id === 'video-studio') {
          score += 25;
          reasoning.push('Perfect for your current video project');
        }
        if (project.includes('podcast') && studio.id === 'podcast-studio') {
          score += 25;
          reasoning.push('Essential for your podcast series');
        }
        if (project.includes('music') && (studio.id === 'music-studio' || studio.id === 'dj-studio')) {
          score += 20;
          reasoning.push('Supports your music projects');
        }
      });

      return {
        ...studio,
        matchScore: Math.min(100, score),
        reasoning
      };
    });

    return scoredStudios
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const newRecommendations = generateRecommendations(userProfile);
      setRecommendations(newRecommendations);
      setLearningPaths(learningPathsData);
      setIsLoading(false);
    }, 1000);
  }, [userProfile]);

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">AI is analyzing your profile and generating personalized recommendations...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personalized Studio Recommendations */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Brain className="mr-2 h-6 w-6 text-blue-400" />
            AI-Powered Studio Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((studio, index) => {
              const Icon = studio.icon;
              return (
                <Card key={studio.id} className="bg-gray-900 border-gray-600 hover:border-blue-500 transition-all group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${studio.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-sm">{studio.matchScore}%</span>
                      </div>
                    </div>

                    <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                      {studio.name}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {studio.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {studio.badges.map((badge) => (
                        <Badge key={badge} className="text-xs bg-blue-600">
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Match Score</span>
                        <span>{studio.matchScore}%</span>
                      </div>
                      <Progress value={studio.matchScore} className="h-1" />
                    </div>

                    <div className="text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" />
                        <span>~{studio.estimatedTime} min session</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span className="capitalize">{studio.difficulty} level</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-300 mb-1">Why recommended:</p>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {studio.reasoning.slice(0, 2).map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-blue-400 mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href={studio.route}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600">
                        <Zap className="w-4 h-4 mr-2" />
                        Start Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Sparkles className="mr-2 h-6 w-6 text-purple-400" />
            Recommended Learning Paths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningPaths.map((path) => (
              <Card key={path.id} className="bg-gray-900 border-gray-600 hover:border-purple-500 transition-all group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 text-purple-400" />
                    <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">
                      {path.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3">
                    {path.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{path.duration} minutes total</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <TrendingUp className="h-3 w-3" />
                      <span>{path.studios.length} studios included</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-300 mb-2">Skills you'll gain:</p>
                    <div className="flex flex-wrap gap-1">
                      {path.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs border-purple-500 text-purple-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Star className="w-4 h-4 mr-2" />
                    Start Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}