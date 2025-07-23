import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Music, Play, Pause, Square, Shuffle, RotateCcw, 
  Volume2, Headphones, Settings, Save, Upload, Download, 
  Zap, Sparkles, Crown, Star, TrendingUp, Users,
  Disc, Waves, AudioWaveform, Layers, ArrowRightLeft
} from "lucide-react";

export default function GenreRemixerStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("mixer");
  const [sourceGenre, setSourceGenre] = useState("hip-hop");
  const [targetGenre, setTargetGenre] = useState("electronic");
  const [remixIntensity, setRemixIntensity] = useState([75]);
  const [currentProject, setCurrentProject] = useState("Genre Fusion Project");
  const [remixProgress, setRemixProgress] = useState(0);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch genre analysis data
  const { data: genreData } = useQuery({
    queryKey: ["/api/genre-remixer/analysis"],
    enabled: true
  });

  const { data: remixProjects } = useQuery({
    queryKey: ["/api/genre-remixer/projects"],
    enabled: true
  });

  // AI-powered genre remixing mutation
  const remixMutation = useMutation({
    mutationFn: async (remixData: any) => {
      return await apiRequest("/api/genre-remixer/create-remix", {
        method: "POST",
        body: JSON.stringify(remixData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/genre-remixer/projects"] });
      setRemixProgress(100);
    }
  });

  const genres = [
    { 
      id: "hip-hop", 
      name: "Hip-Hop", 
      color: "bg-red-600", 
      bpm: "70-140", 
      characteristics: ["Strong beats", "Rap vocals", "Heavy bass"],
      compatibility: { electronic: 92, rock: 78, jazz: 65, classical: 45, pop: 88 }
    },
    { 
      id: "electronic", 
      name: "Electronic", 
      color: "bg-blue-600", 
      bpm: "120-150", 
      characteristics: ["Synthesizers", "Digital effects", "Repetitive patterns"],
      compatibility: { "hip-hop": 92, rock: 85, jazz: 72, classical: 55, pop: 95 }
    },
    { 
      id: "rock", 
      name: "Rock", 
      color: "bg-purple-600", 
      bpm: "100-180", 
      characteristics: ["Electric guitars", "Driving drums", "Power chords"],
      compatibility: { electronic: 85, "hip-hop": 78, jazz: 68, classical: 60, pop: 82 }
    },
    { 
      id: "jazz", 
      name: "Jazz", 
      color: "bg-green-600", 
      bpm: "60-200", 
      characteristics: ["Complex harmonies", "Improvisation", "Swing rhythm"],
      compatibility: { electronic: 72, "hip-hop": 65, rock: 68, classical: 85, pop: 75 }
    },
    { 
      id: "classical", 
      name: "Classical", 
      color: "bg-yellow-600", 
      bpm: "60-120", 
      characteristics: ["Orchestral", "Complex arrangements", "Dynamic range"],
      compatibility: { electronic: 55, "hip-hop": 45, rock: 60, jazz: 85, pop: 70 }
    },
    { 
      id: "pop", 
      name: "Pop", 
      color: "bg-pink-600", 
      bpm: "100-130", 
      characteristics: ["Catchy melodies", "Verse-chorus structure", "Accessible"],
      compatibility: { electronic: 95, "hip-hop": 88, rock: 82, jazz: 75, classical: 70 }
    }
  ];

  const remixTechniques = [
    { id: "tempo-shift", name: "Tempo Shifting", enabled: true, intensity: 80 },
    { id: "harmonic-blend", name: "Harmonic Blending", enabled: true, intensity: 65 },
    { id: "rhythm-fusion", name: "Rhythm Fusion", enabled: true, intensity: 90 },
    { id: "instrumental-swap", name: "Instrumental Swap", enabled: false, intensity: 50 },
    { id: "vocal-style", name: "Vocal Style Transfer", enabled: true, intensity: 70 },
    { id: "dynamic-range", name: "Dynamic Range Adaptation", enabled: true, intensity: 75 }
  ];

  const getCompatibilityScore = (source: string, target: string) => {
    const sourceGenreData = genres.find(g => g.id === source);
    return sourceGenreData?.compatibility[target] || 50;
  };

  const handleRemixGeneration = async () => {
    setAiAnalyzing(true);
    setRemixProgress(0);
    
    const compatibilityScore = getCompatibilityScore(sourceGenre, targetGenre);
    
    // Simulate AI remix process with progress updates
    const progressInterval = setInterval(() => {
      setRemixProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      await remixMutation.mutateAsync({
        sourceGenre,
        targetGenre,
        intensity: remixIntensity[0],
        techniques: remixTechniques.filter(t => t.enabled),
        projectName: currentProject,
        compatibilityScore
      });
    } catch (error) {
      console.error("Remix generation failed:", error);
    } finally {
      setAiAnalyzing(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-indigo-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/artist-tech-logo.jpeg" 
              alt="Artist Tech" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">Genre Remixer Studio</h1>
              <p className="text-white/60">AI-powered cross-genre music fusion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Crown className="w-4 h-4 mr-1" />
              AI Engine Active
            </Badge>
            <Button 
              onClick={handleRemixGeneration}
              disabled={aiAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {aiAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating Remix...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate AI Remix
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Genre Selection */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <ArrowRightLeft className="w-5 h-5 mr-2" />
                Genre Fusion
              </CardTitle>
              <CardDescription>Select source and target genres for AI remixing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Source Genre */}
              <div>
                <label className="block text-sm font-medium mb-2">Source Genre</label>
                <Select value={sourceGenre} onValueChange={setSourceGenre}>
                  <SelectTrigger className="bg-black/50 border-purple-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map(genre => (
                      <SelectItem key={genre.id} value={genre.id}>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${genre.color} mr-2`} />
                          {genre.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Target Genre */}
              <div>
                <label className="block text-sm font-medium mb-2">Target Genre</label>
                <Select value={targetGenre} onValueChange={setTargetGenre}>
                  <SelectTrigger className="bg-black/50 border-purple-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map(genre => (
                      <SelectItem key={genre.id} value={genre.id}>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${genre.color} mr-2`} />
                          {genre.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Compatibility Score */}
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Compatibility Score</span>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    {getCompatibilityScore(sourceGenre, targetGenre)}%
                  </Badge>
                </div>
                <Progress 
                  value={getCompatibilityScore(sourceGenre, targetGenre)} 
                  className="h-2"
                />
                <p className="text-xs text-white/60 mt-2">
                  Higher scores indicate better genre fusion potential
                </p>
              </div>

              {/* Remix Intensity */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Remix Intensity: {remixIntensity[0]}%
                </label>
                <Slider
                  value={remixIntensity}
                  onValueChange={setRemixIntensity}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Remix Techniques */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="w-5 h-5 mr-2" />
                AI Remix Techniques
              </CardTitle>
              <CardDescription>Configure AI-powered remix algorithms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {remixTechniques.map(technique => (
                <div key={technique.id} className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={technique.enabled}
                        onChange={(e) => {
                          const updated = remixTechniques.map(t =>
                            t.id === technique.id ? { ...t, enabled: e.target.checked } : t
                          );
                          // Update remixTechniques state
                        }}
                        className="mr-2 accent-purple-500"
                      />
                      <span className="font-medium">{technique.name}</span>
                    </div>
                    <Badge variant="outline">
                      {technique.intensity}%
                    </Badge>
                  </div>
                  {technique.enabled && (
                    <Slider
                      value={[technique.intensity]}
                      onValueChange={(value) => {
                        const updated = remixTechniques.map(t =>
                          t.id === technique.id ? { ...t, intensity: value[0] } : t
                        );
                        // Update remixTechniques state
                      }}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Analysis & Progress */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Analysis
              </CardTitle>
              <CardDescription>Real-time genre fusion analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Genre Characteristics */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Source: {genres.find(g => g.id === sourceGenre)?.name}</h4>
                  <div className="space-y-1">
                    {genres.find(g => g.id === sourceGenre)?.characteristics.map((char, index) => (
                      <Badge key={index} variant="outline" className="mr-1 text-xs">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Target: {genres.find(g => g.id === targetGenre)?.name}</h4>
                  <div className="space-y-1">
                    {genres.find(g => g.id === targetGenre)?.characteristics.map((char, index) => (
                      <Badge key={index} variant="outline" className="mr-1 text-xs">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Remix Progress */}
              {aiAnalyzing && (
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">AI Processing...</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                      {Math.round(remixProgress)}%
                    </Badge>
                  </div>
                  <Progress value={remixProgress} className="h-2 mb-2" />
                  <p className="text-xs text-white/60">
                    Analyzing musical patterns and generating fusion
                  </p>
                </div>
              )}

              {/* AI Recommendations */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
                <h4 className="font-medium mb-2 flex items-center">
                  <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                  AI Recommendations
                </h4>
                <ul className="text-sm space-y-1 text-white/80">
                  <li>• Increase tempo by 15 BPM for optimal fusion</li>
                  <li>• Apply harmonic blending at 65% intensity</li>
                  <li>• Consider vocal style transfer for uniqueness</li>
                  <li>• Add electronic elements to bridge genres</li>
                </ul>
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="border-purple-500/30 hover:bg-purple-500/20"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-500/30 hover:bg-purple-500/20"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card className="mt-6 bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <TrendingUp className="w-5 h-5 mr-2" />
              Recent Genre Fusion Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Hip-Hop × Classical", compatibility: 85, plays: 2567 },
                { name: "Jazz × Electronic", compatibility: 92, plays: 1834 },
                { name: "Rock × Pop Fusion", compatibility: 88, plays: 3241 }
              ].map((project, index) => (
                <div key={index} className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                  <h4 className="font-medium mb-2">{project.name}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Compatibility: {project.compatibility}%</span>
                    <span className="text-white/60">{project.plays} plays</span>
                  </div>
                  <Progress value={project.compatibility} className="h-1 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}