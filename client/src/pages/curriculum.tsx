import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  GraduationCap, 
  Music, 
  Clock, 
  Star, 
  Trophy,
  Play,
  CheckCircle,
  Lock,
  Unlock
} from "lucide-react";

interface MusicTheoryTopic {
  id: number;
  title: string;
  description: string;
  grade: 'Elementary' | 'Middle' | 'High';
  semester: number;
  week: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // minutes
  prerequisites: number[];
  objectives: string[];
  completed: boolean;
  score?: number;
  voiceCommands: string[];
}

export default function Curriculum() {
  const [selectedGrade, setSelectedGrade] = useState<'Elementary' | 'Middle' | 'High'>('Elementary');
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [curriculum, setCurriculum] = useState<MusicTheoryTopic[]>([]);

  useEffect(() => {
    // Comprehensive Music Theory Curriculum
    setCurriculum([
      // ELEMENTARY LEVEL (Ages 6-11)
      {
        id: 1,
        title: "Musical Alphabet & Note Names",
        description: "Learn the seven letter names of music (A, B, C, D, E, F, G) and their positions on keyboard and staff",
        grade: 'Elementary',
        semester: 1,
        week: 1,
        difficulty: 'Beginner',
        duration: 30,
        prerequisites: [],
        objectives: [
          "Identify all seven letter names in music",
          "Find notes on piano keyboard",
          "Understand repeating pattern of musical alphabet"
        ],
        completed: true,
        score: 95,
        voiceCommands: ["play note A", "show keyboard", "next note", "repeat alphabet"]
      },
      {
        id: 2,
        title: "High and Low Sounds",
        description: "Distinguish between high pitch and low pitch sounds, understand pitch direction",
        grade: 'Elementary',
        semester: 1,
        week: 2,
        difficulty: 'Beginner',
        duration: 25,
        prerequisites: [1],
        objectives: [
          "Identify high vs low pitches by ear",
          "Use body movement to show pitch direction",
          "Relate pitch to keyboard position"
        ],
        completed: true,
        score: 88,
        voiceCommands: ["play high note", "play low note", "show pitch direction", "compare sounds"]
      },
      {
        id: 3,
        title: "Steady Beat & Rhythm Patterns",
        description: "Feel and maintain steady beat, clap simple rhythm patterns",
        grade: 'Elementary',
        semester: 1,
        week: 3,
        difficulty: 'Beginner',
        duration: 35,
        prerequisites: [],
        objectives: [
          "Clap along with steady beat",
          "Distinguish between beat and rhythm",
          "Perform simple rhythm patterns"
        ],
        completed: false,
        voiceCommands: ["start metronome", "clap with beat", "play rhythm", "count beats"]
      },
      {
        id: 4,
        title: "Fast and Slow Tempo",
        description: "Understand tempo changes, experience different speeds of music",
        grade: 'Elementary',
        semester: 1,
        week: 4,
        difficulty: 'Beginner',
        duration: 30,
        prerequisites: [3],
        objectives: [
          "Identify fast vs slow music",
          "Move body to match tempo",
          "Use voice commands to change tempo"
        ],
        completed: false,
        voiceCommands: ["play faster", "play slower", "change tempo", "walk to beat"]
      },
      {
        id: 5,
        title: "Loud and Soft Dynamics",
        description: "Experience forte (loud) and piano (soft), control volume in music",
        grade: 'Elementary',
        semester: 1,
        week: 5,
        difficulty: 'Beginner',
        duration: 25,
        prerequisites: [],
        objectives: [
          "Sing/play loudly and softly on command",
          "Identify dynamic changes in music",
          "Use Italian terms forte and piano"
        ],
        completed: false,
        voiceCommands: ["play louder", "play softer", "forte", "piano"]
      },
      {
        id: 6,
        title: "Introduction to Staff",
        description: "Learn about the five-line staff, treble clef symbol, line and space notes",
        grade: 'Elementary',
        semester: 2,
        week: 1,
        difficulty: 'Beginner',
        duration: 40,
        prerequisites: [1, 2],
        objectives: [
          "Count five lines and four spaces of staff",
          "Recognize treble clef symbol",
          "Place notes on lines and spaces"
        ],
        completed: false,
        voiceCommands: ["show staff", "count lines", "place note", "treble clef"]
      },

      // MIDDLE SCHOOL LEVEL (Ages 12-14)
      {
        id: 20,
        title: "Major Scales Construction",
        description: "Build major scales using whole and half step patterns (W-W-H-W-W-W-H)",
        grade: 'Middle',
        semester: 1,
        week: 1,
        difficulty: 'Intermediate',
        duration: 45,
        prerequisites: [6],
        objectives: [
          "Understand whole and half step intervals",
          "Build any major scale using pattern",
          "Identify key signatures for major scales"
        ],
        completed: false,
        voiceCommands: ["build scale", "show pattern", "play whole step", "play half step"]
      },
      {
        id: 21,
        title: "Key Signatures & Circle of Fifths",
        description: "Learn all major key signatures and their relationship in the circle of fifths",
        grade: 'Middle',
        semester: 1,
        week: 3,
        difficulty: 'Intermediate',
        duration: 50,
        prerequisites: [20],
        objectives: [
          "Memorize all 15 major key signatures",
          "Navigate circle of fifths pattern",
          "Identify keys from key signatures"
        ],
        completed: false,
        voiceCommands: ["show circle", "next key", "name signature", "play scale"]
      },
      {
        id: 22,
        title: "Intervals: Perfect, Major, Minor",
        description: "Identify and construct all interval types within an octave",
        grade: 'Middle',
        semester: 1,
        week: 5,
        difficulty: 'Intermediate',
        duration: 55,
        prerequisites: [20],
        objectives: [
          "Identify intervals by sight and sound",
          "Construct intervals from any note",
          "Understand interval quality (perfect, major, minor)"
        ],
        completed: false,
        voiceCommands: ["play interval", "identify sound", "build fifth", "perfect fourth"]
      },
      {
        id: 23,
        title: "Basic Triads: Major, Minor, Diminished",
        description: "Build and identify three-note chords and their qualities",
        grade: 'Middle',
        semester: 2,
        week: 1,
        difficulty: 'Intermediate',
        duration: 50,
        prerequisites: [22],
        objectives: [
          "Build major, minor, diminished triads",
          "Identify chord qualities by ear",
          "Understand 1-3-5 chord construction"
        ],
        completed: false,
        voiceCommands: ["play chord", "build triad", "major chord", "minor chord"]
      },
      {
        id: 24,
        title: "Time Signatures & Meter",
        description: "Understand 2/4, 3/4, 4/4, and compound meters like 6/8",
        grade: 'Middle',
        semester: 2,
        week: 3,
        difficulty: 'Intermediate',
        duration: 45,
        prerequisites: [3],
        objectives: [
          "Count and conduct in different meters",
          "Recognize time signatures by listening",
          "Understand strong and weak beats"
        ],
        completed: false,
        voiceCommands: ["count in four", "conduct three", "show meter", "strong beat"]
      },

      // HIGH SCHOOL LEVEL (Ages 15-18)
      {
        id: 40,
        title: "Advanced Harmony: Seventh Chords",
        description: "Study dominant 7th, major 7th, minor 7th, and half-diminished chords",
        grade: 'High',
        semester: 1,
        week: 1,
        difficulty: 'Advanced',
        duration: 60,
        prerequisites: [23],
        objectives: [
          "Build all types of seventh chords",
          "Understand chord function in progressions",
          "Voice leading principles"
        ],
        completed: false,
        voiceCommands: ["dominant seven", "major seven", "voice leading", "chord progression"]
      },
      {
        id: 41,
        title: "Roman Numeral Analysis",
        description: "Analyze chord progressions using Roman numeral system",
        grade: 'High',
        semester: 1,
        week: 3,
        difficulty: 'Advanced',
        duration: 55,
        prerequisites: [40],
        objectives: [
          "Use Roman numerals for chord analysis",
          "Identify common progressions (I-V-vi-IV)",
          "Understand functional harmony"
        ],
        completed: false,
        voiceCommands: ["analyze progression", "one five six four", "tonic function", "dominant"]
      },
      {
        id: 42,
        title: "Secondary Dominants",
        description: "Study chromatic harmony and secondary dominant relationships",
        grade: 'High',
        semester: 1,
        week: 6,
        difficulty: 'Advanced',
        duration: 65,
        prerequisites: [41],
        objectives: [
          "Identify V/V, V/vi, V/ii relationships",
          "Compose using secondary dominants",
          "Understand tonicization vs modulation"
        ],
        completed: false,
        voiceCommands: ["five of five", "secondary dominant", "tonicize", "chromatic harmony"]
      },
      {
        id: 43,
        title: "Modulation Techniques",
        description: "Learn common chord, chromatic, and enharmonic modulations",
        grade: 'High',
        semester: 2,
        week: 1,
        difficulty: 'Advanced',
        duration: 70,
        prerequisites: [42],
        objectives: [
          "Execute smooth modulations between keys",
          "Identify modulation types in repertoire",
          "Compose modulatory passages"
        ],
        completed: false,
        voiceCommands: ["modulate to", "common chord", "pivot chord", "new key"]
      },
      {
        id: 44,
        title: "Non-Chord Tones & Dissonance",
        description: "Study passing tones, neighbor tones, suspensions, and anticipations",
        grade: 'High',
        semester: 2,
        week: 4,
        difficulty: 'Advanced',
        duration: 60,
        prerequisites: [41],
        objectives: [
          "Identify all types of non-chord tones",
          "Understand consonance and dissonance",
          "Apply NCTs in composition"
        ],
        completed: false,
        voiceCommands: ["passing tone", "suspension", "neighbor tone", "anticipation"]
      }
    ]);
  }, []);

  const getTopicsForGrade = () => {
    return curriculum.filter(topic => topic.grade === selectedGrade);
  };

  const getGradeProgress = (grade: 'Elementary' | 'Middle' | 'High') => {
    const gradeTopics = curriculum.filter(topic => topic.grade === grade);
    const completed = gradeTopics.filter(topic => topic.completed).length;
    return gradeTopics.length > 0 ? (completed / gradeTopics.length) * 100 : 0;
  };

  const isTopicUnlocked = (topic: MusicTheoryTopic) => {
    return topic.prerequisites.every(prereqId => 
      curriculum.find(t => t.id === prereqId)?.completed || false
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const gradeData = [
    { 
      grade: 'Elementary' as const, 
      description: 'Ages 6-11 • Basic Music Concepts',
      totalTopics: curriculum.filter(t => t.grade === 'Elementary').length,
      focus: 'Fundamentals, Rhythm, Pitch Recognition'
    },
    { 
      grade: 'Middle' as const, 
      description: 'Ages 12-14 • Music Theory Foundation',
      totalTopics: curriculum.filter(t => t.grade === 'Middle').length,
      focus: 'Scales, Chords, Key Signatures'
    },
    { 
      grade: 'High' as const, 
      description: 'Ages 15-18 • Advanced Theory',
      totalTopics: curriculum.filter(t => t.grade === 'High').length,
      focus: 'Harmony, Analysis, Composition'
    }
  ];

  const selectedTopicData = selectedTopic ? curriculum.find(t => t.id === selectedTopic) : null;

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GraduationCap className="text-blue-400" size={28} />
            <div>
              <h1 className="text-xl font-bold">Music Theory Curriculum</h1>
              <p className="text-sm text-gray-400">Comprehensive K-12 Music Education Program</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Total Progress: {Math.round((curriculum.filter(t => t.completed).length / curriculum.length) * 100)}%
            </div>
            <Progress 
              value={(curriculum.filter(t => t.completed).length / curriculum.length) * 100} 
              className="w-32"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Grade Selection */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4">
          <h2 className="text-lg font-semibold mb-4">Grade Levels</h2>
          
          <div className="space-y-4">
            {gradeData.map((level) => (
              <Card 
                key={level.grade}
                className={`cursor-pointer transition-all ${
                  selectedGrade === level.grade 
                    ? 'bg-blue-600/20 border-blue-500' 
                    : 'bg-gray-900 border-gray-700 hover:bg-gray-750'
                }`}
                onClick={() => setSelectedGrade(level.grade)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    {level.grade} School
                    <Badge variant="secondary" className="text-xs">
                      {level.totalTopics} topics
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-400 mb-3">{level.description}</div>
                  <div className="text-xs text-gray-500 mb-2">Focus: {level.focus}</div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{Math.round(getGradeProgress(level.grade))}%</span>
                    </div>
                    <Progress value={getGradeProgress(level.grade)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <Card className="bg-gray-900 border-gray-700 mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Learning Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Completed Topics:</span>
                <span className="text-green-400">{curriculum.filter(t => t.completed).length}</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress:</span>
                <span className="text-yellow-400">
                  {curriculum.filter(t => !t.completed && isTopicUnlocked(t)).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Locked:</span>
                <span className="text-gray-400">
                  {curriculum.filter(t => !isTopicUnlocked(t)).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Topic List */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{selectedGrade} School Topics</h2>
            <div className="text-sm text-gray-400">
              {getTopicsForGrade().filter(t => t.completed).length} of {getTopicsForGrade().length} completed
            </div>
          </div>

          <ScrollArea className="h-full">
            <div className="space-y-3">
              {getTopicsForGrade().map((topic) => {
                const isUnlocked = isTopicUnlocked(topic);
                
                return (
                  <Card
                    key={topic.id}
                    className={`cursor-pointer transition-all ${
                      selectedTopic === topic.id
                        ? 'bg-blue-600/20 border-blue-500'
                        : topic.completed
                        ? 'bg-green-600/20 border-green-500'
                        : isUnlocked
                        ? 'bg-gray-800 border-gray-600 hover:bg-gray-750'
                        : 'bg-gray-900 border-gray-700 opacity-60'
                    }`}
                    onClick={() => isUnlocked && setSelectedTopic(topic.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {topic.completed ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : isUnlocked ? (
                            <Unlock size={16} className="text-blue-400" />
                          ) : (
                            <Lock size={16} className="text-gray-500" />
                          )}
                          <span>{topic.title}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getDifficultyColor(topic.difficulty)}>
                            {topic.difficulty}
                          </Badge>
                          {topic.completed && topic.score && (
                            <Badge variant="secondary">
                              {topic.score}%
                            </Badge>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="text-xs text-gray-400 mb-2">
                        Semester {topic.semester} • Week {topic.week} • {topic.duration} minutes
                      </div>
                      <div className="text-sm text-gray-300">{topic.description}</div>
                      
                      {/* Prerequisites */}
                      {topic.prerequisites.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          Prerequisites: {topic.prerequisites.map(id => 
                            curriculum.find(t => t.id === id)?.title
                          ).join(', ')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Topic Details */}
        {selectedTopicData && (
          <div className="w-96 bg-gray-800 border-l border-gray-700 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedTopicData.title}</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <Badge className={getDifficultyColor(selectedTopicData.difficulty)}>
                    {selectedTopicData.difficulty}
                  </Badge>
                  <Badge variant="secondary">
                    {selectedTopicData.duration} min
                  </Badge>
                  {selectedTopicData.completed && (
                    <Badge className="bg-green-500 text-white">
                      <Trophy size={12} className="mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-400">{selectedTopicData.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Learning Objectives</h4>
                <ul className="space-y-1">
                  {selectedTopicData.objectives.map((objective, index) => (
                    <li key={index} className="text-sm text-gray-400 flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Voice Commands</h4>
                <div className="grid grid-cols-2 gap-1">
                  {selectedTopicData.voiceCommands.map((cmd, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-center">
                      "{cmd}"
                    </Badge>
                  ))}
                </div>
              </div>

              {isTopicUnlocked(selectedTopicData) && (
                <div className="space-y-2">
                  <Button 
                    className="w-full"
                    disabled={selectedTopicData.completed}
                  >
                    <Play size={16} className="mr-2" />
                    {selectedTopicData.completed ? 'Review Lesson' : 'Start Lesson'}
                  </Button>
                  
                  {!selectedTopicData.completed && (
                    <Button variant="outline" className="w-full">
                      <BookOpen size={16} className="mr-2" />
                      Practice Exercises
                    </Button>
                  )}
                </div>
              )}

              {selectedTopicData.completed && selectedTopicData.score && (
                <Card className="bg-green-600/20 border-green-500">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Final Score</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-green-400">
                          {selectedTopicData.score}%
                        </span>
                        <Star className="text-yellow-400 fill-current" size={16} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}