import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Pause, 
  SkipForward,
  Star,
  Clock,
  Target,
  Music,
  Trophy,
  Users,
  Calendar,
  CheckCircle,
  Lock,
  Unlock,
  GraduationCap,
  Award,
  TrendingUp,
  Volume2,
  Headphones
} from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instrument: string;
  objectives: string[];
  completed: boolean;
  locked: boolean;
  score?: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  grade: string;
  totalLessons: number;
  completedLessons: number;
  lessons: Lesson[];
  unlocked: boolean;
}

export default function Curriculum() {
  const [selectedGrade, setSelectedGrade] = useState('elementary');
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [studentProgress, setStudentProgress] = useState({
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
    streakDays: 0
  });

  const grades = ['elementary', 'middle', 'high'];
  
  const curriculumData: Record<string, Module[]> = {
    elementary: [
      {
        id: 1,
        title: "Music Fundamentals",
        description: "Basic music theory, note reading, and rhythm",
        grade: "K-2",
        totalLessons: 8,
        completedLessons: 5,
        unlocked: true,
        lessons: [
          {
            id: 1,
            title: "What is Music?",
            description: "Introduction to sound, music, and musical instruments",
            duration: 20,
            difficulty: 'beginner',
            instrument: 'general',
            objectives: ["Identify different sounds", "Recognize musical vs non-musical sounds"],
            completed: true,
            locked: false,
            score: 95
          },
          {
            id: 2,
            title: "High and Low Sounds",
            description: "Understanding pitch and tone",
            duration: 25,
            difficulty: 'beginner',
            instrument: 'general',
            objectives: ["Distinguish high and low pitches", "Sing simple melodies"],
            completed: true,
            locked: false,
            score: 88
          },
          {
            id: 3,
            title: "Fast and Slow Music",
            description: "Introduction to tempo and rhythm",
            duration: 30,
            difficulty: 'beginner',
            instrument: 'general',
            objectives: ["Clap to different tempos", "Move to music rhythms"],
            completed: true,
            locked: false,
            score: 92
          },
          {
            id: 4,
            title: "Musical Instruments",
            description: "Identifying different instrument families",
            duration: 35,
            difficulty: 'beginner',
            instrument: 'general',
            objectives: ["Name instrument families", "Recognize instrument sounds"],
            completed: true,
            locked: false,
            score: 90
          },
          {
            id: 5,
            title: "Simple Songs",
            description: "Learning basic children's songs",
            duration: 30,
            difficulty: 'beginner',
            instrument: 'voice',
            objectives: ["Sing simple melodies", "Remember song lyrics"],
            completed: true,
            locked: false,
            score: 85
          },
          {
            id: 6,
            title: "Music Notation Basics",
            description: "Introduction to musical symbols",
            duration: 40,
            difficulty: 'beginner',
            instrument: 'general',
            objectives: ["Recognize basic note shapes", "Understand staff lines"],
            completed: false,
            locked: false
          },
          {
            id: 7,
            title: "Rhythm Patterns",
            description: "Clapping and playing simple rhythms",
            duration: 35,
            difficulty: 'beginner',
            instrument: 'percussion',
            objectives: ["Clap quarter notes", "Play simple patterns"],
            completed: false,
            locked: false
          },
          {
            id: 8,
            title: "Musical Expression",
            description: "Loud, soft, and emotional music",
            duration: 30,
            difficulty: 'beginner',
            instrument: 'general',
            objectives: ["Express emotions through music", "Control volume"],
            completed: false,
            locked: true
          }
        ]
      },
      {
        id: 2,
        title: "Keyboard Basics",
        description: "Introduction to piano and keyboard skills",
        grade: "3-5",
        totalLessons: 10,
        completedLessons: 2,
        unlocked: true,
        lessons: [
          {
            id: 9,
            title: "Piano Posture",
            description: "Proper sitting position and hand placement",
            duration: 25,
            difficulty: 'beginner',
            instrument: 'piano',
            objectives: ["Sit correctly at piano", "Position hands properly"],
            completed: true,
            locked: false,
            score: 93
          },
          {
            id: 10,
            title: "Finding Middle C",
            description: "Locating and playing middle C",
            duration: 30,
            difficulty: 'beginner',
            instrument: 'piano',
            objectives: ["Find middle C", "Play with correct finger"],
            completed: true,
            locked: false,
            score: 87
          }
        ]
      }
    ],
    middle: [
      {
        id: 3,
        title: "Advanced Theory",
        description: "Scales, chords, and harmonic analysis",
        grade: "6-8",
        totalLessons: 12,
        completedLessons: 0,
        unlocked: true,
        lessons: []
      }
    ],
    high: [
      {
        id: 4,
        title: "Music Composition",
        description: "Creating original musical works",
        grade: "9-12",
        totalLessons: 15,
        completedLessons: 0,
        unlocked: false,
        lessons: []
      }
    ]
  };

  useEffect(() => {
    // Calculate overall progress
    const allModules = Object.values(curriculumData).flat();
    const total = allModules.reduce((sum, module) => sum + module.totalLessons, 0);
    const completed = allModules.reduce((sum, module) => sum + module.completedLessons, 0);
    
    // Calculate average score from completed lessons
    const completedLessons = allModules
      .flatMap(module => module.lessons)
      .filter(lesson => lesson.completed && lesson.score);
    
    const avgScore = completedLessons.length > 0 
      ? completedLessons.reduce((sum, lesson) => sum + (lesson.score || 0), 0) / completedLessons.length
      : 0;

    setStudentProgress({
      totalLessons: total,
      completedLessons: completed,
      averageScore: Math.round(avgScore),
      streakDays: 7 // Mock streak
    });
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getModuleProgress = (module: Module) => {
    return module.totalLessons > 0 ? (module.completedLessons / module.totalLessons) * 100 : 0;
  };

  const startLesson = (lessonId: number) => {
    setCurrentLesson(lessonId);
    // Navigate to lesson page
    window.location.href = '/lesson';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <GraduationCap className="text-blue-400" size={32} />
              <div>
                <h1 className="text-2xl font-bold">Music Curriculum</h1>
                <p className="text-gray-400">K-12 Structured Music Education Program</p>
              </div>
            </div>
            
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Back to Home
            </Button>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Progress</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {studentProgress.completedLessons}/{studentProgress.totalLessons}
                    </p>
                  </div>
                  <Trophy className="text-blue-400" size={24} />
                </div>
                <Progress 
                  value={(studentProgress.completedLessons / studentProgress.totalLessons) * 100} 
                  className="mt-2 h-2" 
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Average Score</p>
                    <p className="text-2xl font-bold text-green-400">{studentProgress.averageScore}%</p>
                  </div>
                  <Star className="text-green-400" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Learning Streak</p>
                    <p className="text-2xl font-bold text-orange-400">{studentProgress.streakDays} days</p>
                  </div>
                  <TrendingUp className="text-orange-400" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Next Milestone</p>
                    <p className="text-sm font-medium text-purple-400">Grade 3 Certificate</p>
                  </div>
                  <Award className="text-purple-400" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs value={selectedGrade} onValueChange={setSelectedGrade} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="elementary" className="text-white">
              Elementary (K-5)
            </TabsTrigger>
            <TabsTrigger value="middle" className="text-white">
              Middle School (6-8)
            </TabsTrigger>
            <TabsTrigger value="high" className="text-white">
              High School (9-12)
            </TabsTrigger>
          </TabsList>

          {grades.map((grade) => (
            <TabsContent key={grade} value={grade} className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Modules List */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BookOpen className="mr-2 text-blue-400" size={20} />
                    Course Modules
                  </h3>
                  <div className="space-y-3">
                    {curriculumData[grade]?.map((module) => (
                      <Card
                        key={module.id}
                        className={`bg-gray-800 border-gray-700 cursor-pointer transition-all ${
                          selectedModule === module.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-750'
                        } ${!module.unlocked ? 'opacity-50' : ''}`}
                        onClick={() => module.unlocked && setSelectedModule(module.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              {module.unlocked ? (
                                <Unlock className="text-green-400 mr-2" size={16} />
                              ) : (
                                <Lock className="text-gray-400 mr-2" size={16} />
                              )}
                              <h4 className="font-medium">{module.title}</h4>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {module.grade}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{module.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Progress</span>
                              <span>{module.completedLessons}/{module.totalLessons} lessons</span>
                            </div>
                            <Progress value={getModuleProgress(module)} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Lessons Detail */}
                <div className="lg:col-span-2">
                  {selectedModule ? (
                    <div>
                      {(() => {
                        const module = curriculumData[grade]?.find(m => m.id === selectedModule);
                        if (!module) return null;

                        return (
                          <div>
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h3 className="text-xl font-semibold">{module.title}</h3>
                                <p className="text-gray-400">{module.description}</p>
                              </div>
                              <Badge variant="outline">
                                {module.completedLessons}/{module.totalLessons} Complete
                              </Badge>
                            </div>

                            <ScrollArea className="h-96">
                              <div className="space-y-3 pr-4">
                                {module.lessons.map((lesson, index) => (
                                  <Card
                                    key={lesson.id}
                                    className={`bg-gray-800 border-gray-700 ${
                                      lesson.locked ? 'opacity-50' : 'hover:bg-gray-750'
                                    }`}
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center mb-2">
                                            <span className="text-sm text-gray-400 mr-3">
                                              Lesson {index + 1}
                                            </span>
                                            {lesson.completed ? (
                                              <CheckCircle className="text-green-400 mr-2" size={16} />
                                            ) : lesson.locked ? (
                                              <Lock className="text-gray-400 mr-2" size={16} />
                                            ) : (
                                              <Clock className="text-blue-400 mr-2" size={16} />
                                            )}
                                            <h4 className="font-medium">{lesson.title}</h4>
                                          </div>
                                          
                                          <p className="text-sm text-gray-400 mb-3">
                                            {lesson.description}
                                          </p>

                                          <div className="flex items-center space-x-4 mb-3">
                                            <div className="flex items-center text-xs text-gray-400">
                                              <Clock size={12} className="mr-1" />
                                              {lesson.duration} min
                                            </div>
                                            <div className="flex items-center text-xs text-gray-400">
                                              <Music size={12} className="mr-1" />
                                              {lesson.instrument}
                                            </div>
                                            <Badge 
                                              variant="outline" 
                                              className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}
                                            >
                                              {lesson.difficulty}
                                            </Badge>
                                          </div>

                                          {lesson.objectives && (
                                            <div className="mb-3">
                                              <p className="text-xs text-gray-400 mb-1">Learning Objectives:</p>
                                              <ul className="text-xs text-gray-300 space-y-1">
                                                {lesson.objectives.map((objective, idx) => (
                                                  <li key={idx} className="flex items-center">
                                                    <Target size={8} className="mr-2 text-blue-400" />
                                                    {objective}
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}

                                          {lesson.completed && lesson.score && (
                                            <div className="flex items-center mb-3">
                                              <Star className="text-yellow-400 mr-1" size={14} />
                                              <span className="text-sm text-yellow-400">
                                                Score: {lesson.score}%
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        <div className="ml-4">
                                          {lesson.locked ? (
                                            <Button variant="outline" size="sm" disabled>
                                              <Lock size={14} className="mr-2" />
                                              Locked
                                            </Button>
                                          ) : lesson.completed ? (
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => startLesson(lesson.id)}
                                            >
                                              <Play size={14} className="mr-2" />
                                              Review
                                            </Button>
                                          ) : (
                                            <Button 
                                              size="sm"
                                              onClick={() => startLesson(lesson.id)}
                                              className="bg-blue-600 hover:bg-blue-700"
                                            >
                                              <Play size={14} className="mr-2" />
                                              Start
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-96 text-gray-400">
                      <div className="text-center">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Select a module to view lessons</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}