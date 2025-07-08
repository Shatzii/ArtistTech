import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '../lib/queryClient';
import { SiInstagram, SiYoutube, SiTwitter, SiFacebook, SiTiktok, SiSpotify, SiSoundcloud, SiApple } from 'react-icons/si';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Music, 
  Shuffle, 
  TrendingUp, 
  Zap, 
  Target, 
  Lightbulb,
  AudioLines,
  Settings,
  Download,
  Upload,
  Mic,
  Volume2,
  ChevronRight,
  Star,
  Brain,
  Headphones,
  Video as VideoIcon,
  Film,
  Camera,
  Wand2,
  Hash,
  Bot,
  BarChart3,
  Calendar,
  Globe,
  Users,
  Radio,
  Tv,
  Send,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Repeat2,
  Activity,
  Sparkles,
  Waves,
  Palette,
  Crown
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface GenreProfile {
  id: string;
  name: string;
  characteristics: {
    bpm: { min: number; max: number; ideal: number };
    keySignatures: string[];
    rhythmPatterns: string[];
    instrumentalElements: string[];
    energyLevel: number;
    complexity: number;
  };
  commonTransitions: string[];
  remixTechniques: string[];
}

interface RemixSuggestion {
  id: string;
  sourceGenre: string;
  targetGenre: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  techniques: {
    bpmTransition: {
      method: string;
      steps: string[];
    };
    keyHarmony: {
      approach: string;
      keyChanges: string[];
    };
  };
  timeline: {
    phase: string;
    duration: number;
    actions: string[];
  }[];
  aiSuggestions: string[];
}

interface TrackAnalysis {
  originalTrackAnalysis: {
    genre: string;
    confidence: number;
    subGenres: string[];
    musicalElements: string[];
    emotionalTone: string;
    danceability: number;
    energy: number;
  };
  remixOpportunities: {
    genre: string;
    compatibility: number;
    techniques: string[];
    estimatedTime: number;
    difficulty: string;
  }[];
  crossGenrePotential: {
    hybridGenres: string[];
    innovativeApproaches: string[];
    marketViability: number;
  };
}

export default function GenreRemixer() {
  const [selectedSourceGenre, setSelectedSourceGenre] = useState<string>('');
  const [selectedTargetGenre, setSelectedTargetGenre] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remixProgress, setRemixProgress] = useState(0);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // SOCIAL MEDIA CREATION STATE
  const [socialTab, setSocialTab] = useState('platforms');
  const [musicPlatforms] = useState([
    { id: 'spotify', name: 'Spotify', icon: SiSpotify, connected: true, streams: 245000 },
    { id: 'soundcloud', name: 'SoundCloud', icon: SiSoundcloud, connected: true, streams: 89000 },
    { id: 'apple', name: 'Apple Music', icon: SiApple, connected: true, streams: 156000 },
    { id: 'youtube', name: 'YouTube Music', icon: SiYoutube, connected: true, streams: 432000 },
    { id: 'instagram', name: 'Instagram Reels', icon: SiInstagram, connected: true, streams: 523000 },
    { id: 'tiktok', name: 'TikTok Music', icon: VideoIcon, connected: true, streams: 1200000 }
  ]);
  
  const [genreViralData] = useState({
    hiphop: { trending: 95, engagement: 4.2, peakHours: ['9PM', '11PM'] },
    electronic: { trending: 82, engagement: 3.8, peakHours: ['10PM', '12AM'] },
    pop: { trending: 89, engagement: 4.5, peakHours: ['8PM', '10PM'] },
    rock: { trending: 76, engagement: 3.9, peakHours: ['7PM', '9PM'] },
    jazz: { trending: 68, engagement: 3.2, peakHours: ['6PM', '8PM'] },
    classical: { trending: 45, engagement: 2.8, peakHours: ['2PM', '4PM'] }
  });

  const [beatVisualization, setBeatVisualization] = useState(null);
  const [musicVideoTemplate, setMusicVideoTemplate] = useState('beat-drop');
  const [remixChallengeActive, setRemixChallengeActive] = useState(false);
  const [collaborationRequests, setCollaborationRequests] = useState([]);

  // SOCIAL MEDIA MUTATIONS
  const musicViralAnalysisMutation = useMutation({
    mutationFn: async (data: { genre: string; trackData: any }) => {
      return await apiRequest('POST', '/api/genre-remixer/viral-analysis', data);
    },
    onSuccess: (data) => {
      toast({ title: "Viral Analysis Complete", description: `Genre score: ${data.viralScore}/100` });
    }
  });

  const musicVideoGeneratorMutation = useMutation({
    mutationFn: async (data: { audioFile: string; template: string; effects: string[] }) => {
      return await apiRequest('POST', '/api/genre-remixer/generate-video', data);
    },
    onSuccess: (data) => {
      toast({ title: "Music Video Generated", description: "Ready for social media publishing" });
    }
  });

  const genreTrendMappingMutation = useMutation({
    mutationFn: async (data: { genres: string[]; timeframe: string }) => {
      return await apiRequest('POST', '/api/genre-remixer/trend-mapping', data);
    },
    onSuccess: (data) => {
      toast({ title: "Trend Mapping Complete", description: `Found ${data.trends.length} trending combinations` });
    }
  });

  const remixChallengeMutation = useMutation({
    mutationFn: async (data: { challengeType: string; genre: string; rules: any }) => {
      return await apiRequest('POST', '/api/genre-remixer/create-challenge', data);
    },
    onSuccess: (data) => {
      setRemixChallengeActive(true);
      toast({ title: "Remix Challenge Created", description: `Challenge ID: ${data.challengeId}` });
    }
  });

  const artistCollaborationMutation = useMutation({
    mutationFn: async (data: { genre: string; level: string; location?: string }) => {
      return await apiRequest('POST', '/api/genre-remixer/find-collaborators', data);
    },
    onSuccess: (data) => {
      setCollaborationRequests(data.artists);
      toast({ title: "Collaborators Found", description: `${data.artists.length} artists available` });
    }
  });

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:8110`);
    setWebsocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'track_analysis_complete') {
        queryClient.setQueryData(['track-analysis'], data.analysis);
      } else if (data.type === 'project_created') {
        setActiveProject(data.project);
      }
    };

    return () => ws.close();
  }, [queryClient]);

  // Fetch genre profiles
  const { data: genreProfiles = [] } = useQuery<GenreProfile[]>({
    queryKey: ['/api/genre-remixer/profiles'],
  });

  // Fetch remix suggestions
  const { data: remixSuggestions = [] } = useQuery<RemixSuggestion[]>({
    queryKey: [`/api/genre-remixer/suggestions/${selectedSourceGenre}/${selectedTargetGenre}`],
    enabled: !!(selectedSourceGenre && selectedTargetGenre),
  });

  // Track analysis mutation
  const analyzeTrackMutation = useMutation({
    mutationFn: async (data: { audioUrl: string; genre: string }) => {
      return apiRequest('POST', '/api/genre-remixer/analyze', data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['track-analysis'], data);
    },
  });

  // Create remix project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: { userId: string; sourceTrack: any; targetGenres: string[] }) => {
      return apiRequest('POST', '/api/genre-remixer/project', data);
    },
    onSuccess: (data) => {
      setActiveProject(data);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleAnalyzeTrack = () => {
    if (audioFile && selectedSourceGenre) {
      // In a real implementation, you'd upload the file and get a URL
      const audioUrl = URL.createObjectURL(audioFile);
      analyzeTrackMutation.mutate({ audioUrl, genre: selectedSourceGenre });
    }
  };

  const handleCreateRemix = () => {
    if (audioFile && selectedSourceGenre && selectedTargetGenre) {
      const sourceTrack = {
        title: audioFile.name.replace(/\.[^/.]+$/, ""),
        artist: 'Unknown Artist',
        genre: selectedSourceGenre,
        bpm: 128,
        key: 'C major',
        audioUrl: URL.createObjectURL(audioFile)
      };

      createProjectMutation.mutate({
        userId: 'demo-user',
        sourceTrack,
        targetGenres: [selectedTargetGenre]
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getGenreColor = (genre: string) => {
    const colorMap: { [key: string]: string } = {
      'house': 'from-blue-500 to-cyan-500',
      'trap': 'from-purple-500 to-pink-500',
      'techno': 'from-gray-500 to-slate-600',
      'future-bass': 'from-cyan-500 to-blue-500',
      'latin': 'from-orange-500 to-red-500',
      'drum-bass': 'from-green-500 to-emerald-500'
    };
    return colorMap[genre] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            🎵 SOCIAL MEDIA GENRE REMIXER STUDIO
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Music-focused social media creation with viral genre fusion, beat-synced videos, remix challenges, and multi-platform music publishing
          </p>
        </div>

        <Tabs defaultValue="social-platforms" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto bg-black/30">
            <TabsTrigger value="social-platforms" className="data-[state=active]:bg-purple-600">
              <Globe className="w-4 h-4 mr-2" />
              Music Platforms
            </TabsTrigger>
            <TabsTrigger value="viral-analysis" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Viral Analysis
            </TabsTrigger>
            <TabsTrigger value="video-creator" className="data-[state=active]:bg-green-600">
              <Film className="w-4 h-4 mr-2" />
              Music Videos
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-yellow-600">
              <Crown className="w-4 h-4 mr-2" />
              Remix Challenges
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="data-[state=active]:bg-red-600">
              <Users className="w-4 h-4 mr-2" />
              Collaborations
            </TabsTrigger>
            <TabsTrigger value="publishing" className="data-[state=active]:bg-pink-600">
              <Send className="w-4 h-4 mr-2" />
              Publishing
            </TabsTrigger>
          </TabsList>

          {/* MUSIC PLATFORMS TAB */}
          <TabsContent value="social-platforms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-400">
                    <SiSpotify className="w-5 h-5 mr-2" />
                    Connected Music Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {musicPlatforms.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <div key={platform.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-6 h-6 text-purple-400" />
                            <div>
                              <div className="font-bold">{platform.name}</div>
                              <div className="text-sm text-gray-400">{platform.streams.toLocaleString()} streams</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-gray-500'}`} />
                            <Button size="sm" variant="outline" className="border-purple-500/50">
                              {platform.connected ? 'Connected' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Hash className="w-5 h-5 mr-2" />
                    Music-Focused Hashtag Research
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Genre</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-900/50 border-gray-600">
                          <SelectValue placeholder="Select genre..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hiphop">Hip-Hop</SelectItem>
                          <SelectItem value="electronic">Electronic</SelectItem>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Hashtags
                    </Button>
                    <div className="p-3 bg-gray-900/50 rounded-lg">
                      <div className="font-bold mb-2">Trending Hashtags</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-purple-500/20 rounded text-xs">#RemixChallenge</span>
                        <span className="px-2 py-1 bg-blue-500/20 rounded text-xs">#GenreFusion</span>
                        <span className="px-2 py-1 bg-green-500/20 rounded text-xs">#MusicProducer</span>
                        <span className="px-2 py-1 bg-yellow-500/20 rounded text-xs">#BeatMaker</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* VIRAL ANALYSIS TAB */}
          <TabsContent value="viral-analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-400">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Genre-Based Viral Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(genreViralData).map(([genre, data]) => (
                      <div key={genre} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold capitalize">{genre}</div>
                          <div className={`px-2 py-1 rounded text-xs ${
                            data.trending > 80 ? 'bg-green-500/20 text-green-400' :
                            data.trending > 60 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {data.trending}% Trending
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Engagement</div>
                            <div className="font-bold text-blue-400">{data.engagement}x</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Peak Hours</div>
                            <div className="font-bold text-purple-400">{data.peakHours.join(', ')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-400">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Cross-Genre Trend Mapping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Genres to Analyze</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Hip-Hop', 'Electronic', 'Pop', 'Rock'].map(genre => (
                          <div key={genre} className="flex items-center space-x-2 p-2 bg-gray-900/50 rounded">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{genre}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() => genreTrendMappingMutation.mutate({
                        genres: ['hip-hop', 'electronic'],
                        timeframe: '30d'
                      })}
                      disabled={genreTrendMappingMutation.isPending}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analyze Trends
                    </Button>
                    <div className="p-3 bg-gray-900/50 rounded-lg">
                      <div className="font-bold mb-2">Trending Fusions</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Hip-Hop + Electronic</span>
                          <span className="text-green-400">+234%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pop + Rock</span>
                          <span className="text-blue-400">+189%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Electronic + Jazz</span>
                          <span className="text-purple-400">+156%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MUSIC VIDEO CREATOR TAB */}
          <TabsContent value="video-creator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-400">
                    <Film className="w-5 h-5 mr-2" />
                    Music Video Auto-Creator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Video Template</Label>
                      <Select value={musicVideoTemplate} onValueChange={setMusicVideoTemplate}>
                        <SelectTrigger className="bg-gray-900/50 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beat-drop">Beat-Drop Sync</SelectItem>
                          <SelectItem value="visualizer">Audio Visualizer</SelectItem>
                          <SelectItem value="lyric-video">Lyric Video</SelectItem>
                          <SelectItem value="performance">Performance Style</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Audio File</Label>
                      <Input type="file" accept="audio/*" className="bg-gray-900/50 border-gray-600" />
                    </div>
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() => musicVideoGeneratorMutation.mutate({
                        audioFile: 'demo-track.mp3',
                        template: musicVideoTemplate,
                        effects: ['beat-sync', 'color-spectrum']
                      })}
                      disabled={musicVideoGeneratorMutation.isPending}
                    >
                      <Film className="w-4 h-4 mr-2" />
                      Generate Music Video
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Waves className="w-5 h-5 mr-2" />
                    Beat-Synced Video Creator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-900/50 rounded-lg">
                      <div className="font-bold mb-2">Sound Wave Visualization</div>
                      <div className="h-20 bg-gray-800 rounded flex items-center justify-center">
                        <div className="flex space-x-1">
                          {Array.from({length: 20}, (_, i) => (
                            <div 
                              key={i} 
                              className="w-2 bg-gradient-to-t from-purple-500 to-cyan-500 rounded-t"
                              style={{ height: `${Math.random() * 60 + 10}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="border-cyan-500/50">
                        <Camera className="w-3 h-3 mr-1" />
                        Add Effects
                      </Button>
                      <Button size="sm" variant="outline" className="border-purple-500/50">
                        <Palette className="w-3 h-3 mr-1" />
                        Color Sync
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* REMIX CHALLENGES TAB */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-400">
                    <Crown className="w-5 h-5 mr-2" />
                    Collaborative Remix Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold">Hip-Hop to Jazz Challenge</div>
                        <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">ACTIVE</div>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">Transform hip-hop beats into jazz arrangements</div>
                      <div className="flex items-center justify-between text-xs">
                        <span>127 participants</span>
                        <span>Ends in 5 days</span>
                      </div>
                    </div>
                    <Button 
                      className={`w-full ${remixChallengeActive ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                      onClick={() => remixChallengeMutation.mutate({
                        challengeType: 'genre-fusion',
                        genre: 'electronic-rock',
                        rules: { timeLimit: '7d', maxParticipants: 100 }
                      })}
                      disabled={remixChallengeMutation.isPending}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      {remixChallengeActive ? 'Leave Challenge' : 'Join Challenge'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-400">
                    <Star className="w-5 h-5 mr-2" />
                    Fan Remix Contest Hub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-400">$500</div>
                        <div className="text-sm text-gray-400">Prize Pool</div>
                      </div>
                      <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-400">84</div>
                        <div className="text-sm text-gray-400">Submissions</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Top Remix</span>
                        <span className="text-green-400">@BeatMaster_Pro</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Most Creative</span>
                        <span className="text-blue-400">@GenreBender</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* COLLABORATION TAB */}
          <TabsContent value="collaboration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-400">
                    <Users className="w-5 h-5 mr-2" />
                    Artist Collaboration Finder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Your Genre</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-900/50 border-gray-600">
                          <SelectValue placeholder="Select your genre..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hiphop">Hip-Hop</SelectItem>
                          <SelectItem value="electronic">Electronic</SelectItem>
                          <SelectItem value="pop">Pop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Collaboration Type</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-900/50 border-gray-600">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="remix">Remix Collaboration</SelectItem>
                          <SelectItem value="original">Original Track</SelectItem>
                          <SelectItem value="sample">Sample Exchange</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full bg-red-500 hover:bg-red-600"
                      onClick={() => artistCollaborationMutation.mutate({
                        genre: 'electronic',
                        level: 'intermediate',
                        location: 'global'
                      })}
                      disabled={artistCollaborationMutation.isPending}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Find Collaborators
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-400">
                    <Music className="w-5 h-5 mr-2" />
                    Music Discovery Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collaborationRequests.length > 0 ? (
                      <div className="space-y-3">
                        {collaborationRequests.slice(0, 3).map((artist, i) => (
                          <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-bold">Artist {i + 1}</div>
                                <div className="text-sm text-gray-400">Electronic • 5.2K followers</div>
                              </div>
                              <Button size="sm" variant="outline" className="border-orange-500/50">
                                Connect
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-900/50 rounded-lg text-center text-gray-400">
                        Search for collaborators to see matches here
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PUBLISHING TAB */}
          <TabsContent value="publishing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-pink-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-pink-400">
                    <Send className="w-5 h-5 mr-2" />
                    Multi-Platform Music Publishing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Track Title</Label>
                      <Input placeholder="Enter track title..." className="bg-gray-900/50 border-gray-600" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <textarea 
                        placeholder="Track description..."
                        className="w-full bg-gray-900/50 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Platforms</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {musicPlatforms.map(platform => {
                          const Icon = platform.icon;
                          return (
                            <div key={platform.id} className="flex items-center space-x-2 p-2 bg-gray-900/50 rounded">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <Icon className="w-4 h-4" />
                              <span className="text-sm">{platform.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                      <Send className="w-4 h-4 mr-2" />
                      Publish to All Platforms
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-pink-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-400">
                    <Activity className="w-5 h-4 mr-2" />
                    Music Platform Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-900/50 rounded-lg">
                      <div className="font-bold mb-2">Platform Recommendations</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Spotify</span>
                          <span className="text-green-400">Optimize for playlists</span>
                        </div>
                        <div className="flex justify-between">
                          <span>TikTok</span>
                          <span className="text-blue-400">30-second hook focus</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SoundCloud</span>
                          <span className="text-purple-400">Community engagement</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-400">87%</div>
                        <div className="text-sm text-gray-400">Match Score</div>
                      </div>
                      <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-400">12K</div>
                        <div className="text-sm text-gray-400">Est. Reach</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Original Remix Studio Tab (kept for functionality) */}
          <TabsContent value="remix" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Track Upload & Source Genre */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Track
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Audio File</Label>
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="bg-black/50 border-purple-500/30"
                    />
                  </div>
                  
                  <div>
                    <Label>Source Genre</Label>
                    <Select value={selectedSourceGenre} onValueChange={setSelectedSourceGenre}>
                      <SelectTrigger className="bg-black/50 border-purple-500/30">
                        <SelectValue placeholder="Select source genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genreProfiles.map((genre) => (
                          <SelectItem key={genre.id} value={genre.id}>
                            {genre.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {audioFile && (
                    <div className="p-4 bg-purple-900/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{audioFile.name}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="border-cyan-500/50"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AudioLines className="w-4 h-4 text-cyan-400" />
                        <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 w-1/3"></div>
                        </div>
                        <Volume2 className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Target Genre Selection */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Target className="w-5 h-5 mr-2" />
                    Target Genre
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Remix To</Label>
                    <Select value={selectedTargetGenre} onValueChange={setSelectedTargetGenre}>
                      <SelectTrigger className="bg-black/50 border-purple-500/30">
                        <SelectValue placeholder="Select target genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genreProfiles
                          .filter(genre => genre.id !== selectedSourceGenre)
                          .map((genre) => (
                            <SelectItem key={genre.id} value={genre.id}>
                              {genre.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSourceGenre && selectedTargetGenre && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg">
                        <div className="text-center">
                          <div className="font-medium">{genreProfiles.find(g => g.id === selectedSourceGenre)?.name}</div>
                          <div className="text-sm text-gray-400">Source</div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-cyan-400" />
                        <div className="text-center">
                          <div className="font-medium">{genreProfiles.find(g => g.id === selectedTargetGenre)?.name}</div>
                          <div className="text-sm text-gray-400">Target</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={handleAnalyzeTrack}
                          disabled={!audioFile || analyzeTrackMutation.isPending}
                          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze Track
                        </Button>
                        <Button
                          onClick={handleCreateRemix}
                          disabled={!audioFile || createProjectMutation.isPending}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Create Remix
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Remix Suggestions */}
            {remixSuggestions.length > 0 && (
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    AI Remix Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {remixSuggestions.map((suggestion, index) => (
                      <div key={suggestion.id} className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">
                            {suggestion.sourceGenre} → {suggestion.targetGenre}
                          </h3>
                          <Badge className={`${getDifficultyColor(suggestion.difficulty)} text-white`}>
                            {suggestion.difficulty}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium mb-2 text-cyan-300">BPM Transition</h4>
                            <p className="text-sm text-gray-300 mb-2">Method: {suggestion.techniques.bpmTransition.method}</p>
                            <div className="space-y-1">
                              {suggestion.techniques.bpmTransition.steps.slice(0, 2).map((step, i) => (
                                <div key={i} className="text-xs text-gray-400">• {step}</div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2 text-cyan-300">Key Harmony</h4>
                            <p className="text-sm text-gray-300 mb-2">Approach: {suggestion.techniques.keyHarmony.approach}</p>
                            <div className="space-y-1">
                              {suggestion.techniques.keyHarmony.keyChanges.slice(0, 2).map((change, i) => (
                                <div key={i} className="text-xs text-gray-400">• {change}</div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium mb-2 text-cyan-300">AI Suggestions</h4>
                          <div className="space-y-1">
                            {suggestion.aiSuggestions.map((aiSuggestion, i) => (
                              <div key={i} className="text-sm text-purple-300 flex items-start">
                                <Star className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                                {aiSuggestion}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-cyan-500/50">
                            <Play className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline" className="border-purple-500/50">
                            <Download className="w-3 h-3 mr-1" />
                            Export Guide
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Remix Project */}
            {activeProject && (
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Settings className="w-5 h-5 mr-2" />
                    Active Remix Project
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{activeProject.sourceTrack.title}</h3>
                      <Badge variant="outline" className="border-cyan-500/50">
                        {activeProject.currentPhase}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{activeProject.progress.completion}%</span>
                      </div>
                      <Progress 
                        value={activeProject.progress.completion} 
                        className="bg-gray-700"
                      />
                      <p className="text-sm text-gray-400">{activeProject.progress.currentStep}</p>
                    </div>

                    {activeProject.progress.nextSuggestions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-cyan-300">Next Steps</h4>
                        <div className="space-y-1">
                          {activeProject.progress.nextSuggestions.map((suggestion: string, i: number) => (
                            <div key={i} className="text-sm text-purple-300">• {suggestion}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <Brain className="w-5 h-5 mr-2" />
                  Track Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyzeTrackMutation.data ? (
                  <div className="space-y-6">
                    {/* Original Track Analysis */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-cyan-300">Original Track Analysis</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-purple-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-cyan-400">
                            {Math.round(analyzeTrackMutation.data.originalTrackAnalysis.confidence * 100)}%
                          </div>
                          <div className="text-sm text-gray-400">Confidence</div>
                        </div>
                        <div className="text-center p-3 bg-purple-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-cyan-400">
                            {analyzeTrackMutation.data.originalTrackAnalysis.energy}/10
                          </div>
                          <div className="text-sm text-gray-400">Energy</div>
                        </div>
                        <div className="text-center p-3 bg-purple-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-cyan-400">
                            {Math.round(analyzeTrackMutation.data.originalTrackAnalysis.danceability * 100)}%
                          </div>
                          <div className="text-sm text-gray-400">Danceability</div>
                        </div>
                        <div className="text-center p-3 bg-purple-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-cyan-400 capitalize">
                            {analyzeTrackMutation.data.originalTrackAnalysis.emotionalTone}
                          </div>
                          <div className="text-sm text-gray-400">Tone</div>
                        </div>
                      </div>
                    </div>

                    {/* Remix Opportunities */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-cyan-300">Best Remix Opportunities</h3>
                      <div className="space-y-3">
                        {analyzeTrackMutation.data.remixOpportunities.slice(0, 3).map((opportunity: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                            <div>
                              <div className="font-medium capitalize">{opportunity.genre}</div>
                              <div className="text-sm text-gray-400">
                                {Math.round(opportunity.compatibility * 100)}% compatibility • 
                                {opportunity.estimatedTime} min • {opportunity.difficulty}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedTargetGenre(opportunity.genre)}
                              className="bg-gradient-to-r from-cyan-600 to-blue-600"
                            >
                              Select
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cross-Genre Potential */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-cyan-300">Cross-Genre Innovation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 text-purple-300">Hybrid Genres</h4>
                          <div className="space-y-1">
                            {analyzeTrackMutation.data.crossGenrePotential.hybridGenres.map((genre: string, i: number) => (
                              <Badge key={i} variant="outline" className="mr-2 mb-1 border-purple-500/50">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-purple-300">Innovative Approaches</h4>
                          <div className="space-y-1">
                            {analyzeTrackMutation.data.crossGenrePotential.innovativeApproaches.slice(0, 3).map((approach: string, i: number) => (
                              <div key={i} className="text-sm text-gray-300">• {approach}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Upload a track and click "Analyze Track" to see AI-powered insights
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Genre Profiles Tab */}
          <TabsContent value="genres" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {genreProfiles.map((genre) => (
                <Card key={genre.id} className="bg-black/40 border-purple-500/30 hover:border-purple-400/50 transition-colors">
                  <CardHeader>
                    <CardTitle className={`text-center bg-gradient-to-r ${getGenreColor(genre.id)} bg-clip-text text-transparent`}>
                      {genre.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-2 bg-purple-900/20 rounded">
                        <div className="font-semibold text-cyan-400">{genre.characteristics.bpm.ideal}</div>
                        <div className="text-gray-400">BPM</div>
                      </div>
                      <div className="text-center p-2 bg-purple-900/20 rounded">
                        <div className="font-semibold text-cyan-400">{genre.characteristics.energyLevel}/10</div>
                        <div className="text-gray-400">Energy</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-cyan-300">Key Elements</h4>
                      <div className="space-y-1">
                        {genre.characteristics.instrumentalElements.slice(0, 3).map((element, i) => (
                          <div key={i} className="text-xs text-gray-300">• {element}</div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-cyan-300">Remix Techniques</h4>
                      <div className="flex flex-wrap gap-1">
                        {genre.remixTechniques.slice(0, 3).map((technique, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-purple-500/50">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                      onClick={() => setSelectedSourceGenre(genre.id)}
                    >
                      Select as Source
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <Settings className="w-5 h-5 mr-2" />
                  Your Remix Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeProject ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{activeProject.sourceTrack.title}</h3>
                        <Badge variant="outline" className="border-cyan-500/50">
                          {activeProject.currentPhase}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-2 bg-black/30 rounded">
                          <div className="font-semibold text-cyan-400">{activeProject.sourceTrack.genre}</div>
                          <div className="text-sm text-gray-400">Source Genre</div>
                        </div>
                        <div className="text-center p-2 bg-black/30 rounded">
                          <div className="font-semibold text-cyan-400">{activeProject.targetGenres.join(', ')}</div>
                          <div className="text-sm text-gray-400">Target Genre(s)</div>
                        </div>
                        <div className="text-center p-2 bg-black/30 rounded">
                          <div className="font-semibold text-cyan-400">{activeProject.progress.completion}%</div>
                          <div className="text-sm text-gray-400">Progress</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-gradient-to-r from-cyan-600 to-blue-600">
                          <Play className="w-3 h-3 mr-1" />
                          Resume
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-500/50">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No active projects. Create a remix to get started!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}