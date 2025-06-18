import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Play, 
  Pause, 
  SkipForward,
  Star,
  Clock,
  Target,
  Music,
  Trophy
} from "lucide-react";

interface Exercise {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  instrument: string;
  instructions: string;
  voiceCommands: string[];
  completed: boolean;
  score?: number;
  timeSpent?: number;
}

interface ExercisePanelProps {
  currentExercise: number | null;
  onExerciseSelect: (id: number) => void;
}

export default function ExercisePanel({ currentExercise, onExerciseSelect }: ExercisePanelProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  // Sample exercises for piano lessons
  useEffect(() => {
    setExercises([
      {
        id: 1,
        title: "C Major Scale",
        description: "Learn to play the C major scale with proper fingering",
        difficulty: 'easy',
        instrument: 'piano',
        instructions: "Start with your right thumb on C. Play each note clearly and evenly.",
        voiceCommands: ["play scale", "stop", "slower", "faster", "repeat"],
        completed: false,
        score: 0,
        timeSpent: 0
      },
      {
        id: 2,
        title: "Finger Independence",
        description: "Practice moving fingers independently without lifting others",
        difficulty: 'medium',
        instrument: 'piano',
        instructions: "Place all fingers on C-D-E-F-G. Lift only one finger at a time.",
        voiceCommands: ["start exercise", "next finger", "hold position", "relax"],
        completed: false,
        score: 0,
        timeSpent: 0
      },
      {
        id: 3,
        title: "Simple Melody",
        description: "Play 'Twinkle, Twinkle, Little Star' with correct timing",
        difficulty: 'easy',
        instrument: 'piano',
        instructions: "Use fingers 1-3-5 for the melody. Count slowly: 1-2-3-4.",
        voiceCommands: ["play melody", "with metronome", "count aloud", "tempo up"],
        completed: true,
        score: 85,
        timeSpent: 12
      },
      {
        id: 4,
        title: "Hand Coordination",
        description: "Practice playing different rhythms with each hand",
        difficulty: 'hard',
        instrument: 'piano',
        instructions: "Left hand plays quarter notes, right hand plays eighth notes.",
        voiceCommands: ["start coordination", "left hand only", "right hand only", "both hands"],
        completed: false,
        score: 0,
        timeSpent: 0
      }
    ]);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying && currentExercise) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
        setProgress(prev => Math.min(prev + 1, 100));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentExercise]);

  const startExercise = (exerciseId: number) => {
    onExerciseSelect(exerciseId);
    setIsPlaying(true);
    setProgress(0);
    setTimeSpent(0);
  };

  const pauseExercise = () => {
    setIsPlaying(false);
  };

  const completeExercise = () => {
    if (currentExercise) {
      setExercises(prev => prev.map(ex => 
        ex.id === currentExercise 
          ? { ...ex, completed: true, score: Math.floor(Math.random() * 30) + 70, timeSpent }
          : ex
      ));
      setIsPlaying(false);
      setProgress(100);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    const stars = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < stars ? 'text-yellow-400 fill-current' : 'text-gray-600'}
      />
    ));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentExerciseData = exercises.find(ex => ex.id === currentExercise);

  return (
    <Card className="bg-gray-900 border-gray-700 mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="mr-2 text-green-400" size={16} />
            Practice Exercises
          </div>
          <Badge variant="secondary" className="text-xs">
            {exercises.filter(ex => ex.completed).length}/{exercises.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Exercise */}
        {currentExerciseData && (
          <div className="bg-blue-600 bg-opacity-20 border border-blue-500 rounded p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Music size={14} className="text-blue-400" />
                <span className="text-sm font-medium text-blue-400">
                  {currentExerciseData.title}
                </span>
              </div>
              <div className="flex space-x-1">
                {getDifficultyStars(currentExerciseData.difficulty)}
              </div>
            </div>

            <div className="text-xs text-gray-300">
              {currentExerciseData.instructions}
            </div>

            {/* Exercise Controls */}
            <div className="flex items-center space-x-2">
              {!isPlaying ? (
                <Button
                  onClick={() => setIsPlaying(true)}
                  size="sm"
                  className="flex-1"
                >
                  <Play size={14} className="mr-2" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={pauseExercise}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  <Pause size={14} className="mr-2" />
                  Pause
                </Button>
              )}
              
              <Button
                onClick={completeExercise}
                variant="outline"
                size="sm"
                disabled={!isPlaying}
              >
                <Target size={14} className="mr-1" />
                Complete
              </Button>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Progress</span>
                <span>{formatTime(timeSpent)}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Voice Commands for Current Exercise */}
            <div className="space-y-1">
              <div className="text-xs text-gray-400">Voice commands:</div>
              <div className="flex flex-wrap gap-1">
                {currentExerciseData.voiceCommands.map((cmd, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    "{cmd}"
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Exercise List */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400 font-medium">Available Exercises:</div>
          <ScrollArea className="h-40">
            <div className="space-y-2">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    exercise.id === currentExercise
                      ? 'border-blue-500 bg-blue-600 bg-opacity-20'
                      : exercise.completed
                      ? 'border-green-500 bg-green-600 bg-opacity-20'
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-750'
                  }`}
                  onClick={() => startExercise(exercise.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{exercise.title}</span>
                      {exercise.completed && (
                        <Trophy size={12} className="text-yellow-400" />
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {getDifficultyStars(exercise.difficulty)}
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 mb-2">
                    {exercise.description}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {exercise.completed && exercise.score && (
                        <div className="flex items-center">
                          <Target size={10} className="mr-1" />
                          {exercise.score}%
                        </div>
                      )}
                      {exercise.timeSpent > 0 && (
                        <div className="flex items-center">
                          <Clock size={10} className="mr-1" />
                          {formatTime(exercise.timeSpent * 60)}
                        </div>
                      )}
                    </div>
                    
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getDifficultyColor(exercise.difficulty)} text-white`}
                    >
                      {exercise.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Practice Tips */}
        <div className="bg-green-600 bg-opacity-20 border border-green-500 rounded p-2 text-xs text-green-400">
          <div className="font-medium mb-1">Practice Tips:</div>
          <div>• Start slow and focus on accuracy</div>
          <div>• Use voice commands to control tempo</div>
          <div>• Complete easier exercises first</div>
        </div>
      </CardContent>
    </Card>
  );
}