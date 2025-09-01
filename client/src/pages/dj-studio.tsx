import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, 
  Headphones, Radio, Users, Vote, DollarSign,
  Music, Disc, Waves, Zap, Crown, Star,
  Search, Filter, Shuffle, Repeat, Heart,
  Activity, BarChart3, Target, Sparkles, Settings,
  Mic, Mic2, Square, Circle, Triangle, Hexagon,
  Monitor, MonitorSpeaker, Keyboard, Gamepad2,
  Camera, Video, Record, StopCircle, Upload,
  Download, Save, FolderOpen, Grid3x3, Layout,
  Maximize, Minimize, RotateCcw, RotateCw,
  Eye, EyeOff, Palette, Lightbulb, Moon, Sun,
  Cpu, HardDrive, Wifi, WifiOff, Bluetooth,
  Volume1, VolumeX, Sliders, Equalizer, Gauge,
  Timer, Clock, Calendar, TrendingUp, TrendingDown,
  Zap as Lightning, Flame, Droplets, Wind,
  Layers, Copy, Scissors, Move, ZoomIn, ZoomOut,
  MousePointer, Edit, LineChart, Spline,
  PlayCircle, PauseCircle, SkipForward as FastForward,
  SkipBack as Rewind, RotateCcw as Loop, Shuffle as Random,
  Volume2 as Speaker, Headphones as HeadphoneIcon,
  Radio as RadioIcon, Users as UsersIcon, Vote as VoteIcon,
  DollarSign as DollarIcon, Music as MusicIcon, Disc as DiscIcon,
  Waves as WavesIcon, Zap as ZapIcon, Crown as CrownIcon,
  Star as StarIcon, Search as SearchIcon, Filter as FilterIcon,
  Shuffle as ShuffleIcon, Repeat as RepeatIcon, Heart as HeartIcon
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function DJStudio() {
  // Enhanced State Management for All 4 Phases
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [deckATrack, setDeckATrack] = useState<any>(null);
  const [deckBTrack, setDeckBTrack] = useState<any>(null);
  const [crossfader, setCrossfader] = useState([50]);
  const [masterVolume, setMasterVolume] = useState([75]);
  const [deckAVolume, setDeckAVolume] = useState([80]);
  const [deckBVolume, setDeckBVolume] = useState([80]);
  const [liveRequests, setLiveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("mixer");

  // Phase 1: Core DJ Features
  const [waveformData, setWaveformData] = useState({
    deckA: { data: [], beats: [], cues: [], loops: [] },
    deckB: { data: [], beats: [], cues: [], loops: [] }
  });
  const [beatDetection, setBeatDetection] = useState({
    deckA: { bpm: 128, confidence: 0.95, phase: 0 },
    deckB: { bpm: 128, confidence: 0.95, phase: 0 },
    syncEnabled: true,
    autoMixEnabled: false
  });
  const [advancedEffects, setAdvancedEffects] = useState({
    deckA: {
      flanger: { enabled: false, rate: 0.5, depth: 0.3, feedback: 0.2 },
      phaser: { enabled: false, rate: 0.8, depth: 0.6, stages: 4 },
      distortion: { enabled: false, drive: 0.4, tone: 0.7, mix: 0.3 },
      filter: { enabled: false, frequency: 1000, resonance: 0.7, type: 'lowpass' },
      reverb: { enabled: true, decay: 2.0, preDelay: 0.1, wet: 0.3 },
      delay: { enabled: false, time: 0.5, feedback: 0.3, wet: 0.2 }
    },
    deckB: {
      flanger: { enabled: false, rate: 0.5, depth: 0.3, feedback: 0.2 },
      phaser: { enabled: false, rate: 0.8, depth: 0.6, stages: 4 },
      distortion: { enabled: false, drive: 0.4, tone: 0.7, mix: 0.3 },
      filter: { enabled: false, frequency: 1000, resonance: 0.7, type: 'lowpass' },
      reverb: { enabled: true, decay: 2.0, preDelay: 0.1, wet: 0.3 },
      delay: { enabled: false, time: 0.5, feedback: 0.3, wet: 0.2 }
    }
  });

  // Phase 2: Live Performance Tools
  const [sampler, setSampler] = useState({
    pads: Array.from({length: 16}, (_, i) => ({
      id: i,
      sample: null,
      name: `Pad ${i + 1}`,
      color: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'][i % 4],
      velocity: 100,
      pitch: 0,
      effects: { reverb: 0, delay: 0, filter: 0 }
    })),
    recording: false,
    currentPad: null,
    bank: 1,
    mode: 'trigger' // trigger, hold, toggle
  });
  const [loopControls, setLoopControls] = useState({
    deckA: {
      enabled: false,
      inPoint: 0,
      outPoint: 16,
      length: 16,
      active: false,
      slipMode: false
    },
    deckB: {
      enabled: false,
      inPoint: 0,
      outPoint: 16,
      length: 16,
      active: false,
      slipMode: false
    }
  });
  const [hotCues, setHotCues] = useState({
    deckA: {
      A: { position: null, color: '#FF6B6B', name: 'Cue A' },
      B: { position: null, color: '#4ECDC4', name: 'Cue B' },
      C: { position: null, color: '#45B7D1', name: 'Cue C' },
      D: { position: null, color: '#96CEB4', name: 'Cue D' }
    },
    deckB: {
      A: { position: null, color: '#FF6B6B', name: 'Cue A' },
      B: { position: null, color: '#4ECDC4', name: 'Cue B' },
      C: { position: null, color: '#45B7D1', name: 'Cue C' },
      D: { position: null, color: '#96CEB4', name: 'Cue D' }
    }
  });

  // Phase 3: Professional Features
  const [visualEffects, setVisualEffects] = useState({
    enabled: true,
    type: 'spectrum', // spectrum, waveform, reactive, custom
    theme: 'neon', // neon, fire, ocean, forest
    intensity: 0.8,
    speed: 1.0,
    lighting: {
      enabled: false,
      mode: 'reactive', // reactive, manual, program
      fixtures: [],
      scenes: []
    }
  });
  const [recording, setRecording] = useState({
    isRecording: false,
    duration: 0,
    format: 'wav', // wav, mp3, flac
    quality: 'high', // low, medium, high
    destination: 'local', // local, cloud, stream
    tracks: [], // individual track recordings
    master: null // master recording
  });
  const [streaming, setStreaming] = useState({
    isLive: false,
    platform: 'twitch', // twitch, youtube, custom
    quality: '1080p',
    bitrate: 6000,
    viewers: 0,
    chatEnabled: true,
    donations: 0
  });
  const [midiController, setMidiController] = useState({
    connected: false,
    device: null,
    mapping: {
      crossfader: null,
      volumeA: null,
      volumeB: null,
      masterVolume: null,
      playA: null,
      playB: null,
      cueA: null,
      cueB: null,
      pads: Array(16).fill(null)
    },
    learnMode: false,
    templates: ['Pioneer DJ', 'Traktor Kontrol', 'Numark Mixtrack', 'Custom']
  });

  // Phase 4: Advanced Features
  const [layout, setLayout] = useState({
    mode: 'single', // single, dual, triple
    theme: 'dark', // dark, light, neon, custom
    panels: {
      mixer: { visible: true, position: 'center', size: 'large' },
      library: { visible: true, position: 'left', size: 'medium' },
      effects: { visible: true, position: 'right', size: 'medium' },
      analytics: { visible: true, position: 'bottom', size: 'small' }
    },
    shortcuts: {
      playA: 'Space',
      playB: 'Enter',
      cueA: 'Q',
      cueB: 'W',
      crossfader: 'X'
    }
  });
  const [performanceAnalytics, setPerformanceAnalytics] = useState({
    session: {
      startTime: Date.now(),
      duration: 0,
      tracksPlayed: [],
      crowdReactions: [],
      earnings: 0
    },
    realTime: {
      energy: 75,
      bpm: 128,
      key: 'C Major',
      genre: 'Electronic',
      danceability: 0.8,
      listeners: 1247,
      engagement: 0.85
    },
    history: {
      totalSessions: 45,
      totalHours: 127,
      topTracks: [],
      earnings: 2847.50,
      averageListeners: 892
    }
  });

  // Legacy state (keeping for compatibility)
  const effects = {
    deckA: {
      reverb: [advancedEffects.deckA.reverb.wet * 100],
      delay: [advancedEffects.deckA.delay.wet * 100],
      filter: [50],
      eq: { low: [50], mid: [50], high: [50] }
    },
    deckB: {
      reverb: [advancedEffects.deckB.reverb.wet * 100],
      delay: [advancedEffects.deckB.delay.wet * 100],
      filter: [50],
      eq: { low: [50], mid: [50], high: [50] }
    }
  };

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Real track library from database
  const { data: trackLibrary = [], isLoading: tracksLoading } = useQuery({
    queryKey: ["/api/audio/tracks"],
    queryFn: () => apiRequest("/api/audio/tracks")
  });

  // Real live voting data
  const { data: liveVotes = [], isLoading: votesLoading } = useQuery({
    queryKey: ["/api/dj/live-votes"],
    queryFn: () => apiRequest("/api/dj/live-votes"),
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Real crowd stats
  const { data: crowdStats = {
    totalListeners: 0,
    activeVoters: 0,
    totalRequests: 0,
    earnings: 0,
    peakEnergy: 0,
    genrePreference: "Loading..."
  }, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dj/crowd-stats"],
    queryFn: () => apiRequest("/api/dj/crowd-stats"),
    refetchInterval: 2000 // Refresh every 2 seconds
  });

  const effects = {
    deckA: {
      reverb: [0],
      delay: [0],
      filter: [50],
      eq: { low: [50], mid: [50], high: [50] }
    },
    deckB: {
      reverb: [0],
      delay: [0],
      filter: [50],
      eq: { low: [50], mid: [50], high: [50] }
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrackLoad = (track, deck) => {
    if (deck === 'A') {
      setDeckATrack(track);
    } else {
      setDeckBTrack(track);
    }
  };

  const handleVoteForTrack = (trackId) => {
    // Handle voting logic
    console.log("Voting for track:", trackId);
  };

  const handleCrossfade = (value) => {
    setCrossfader(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Disc className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Professional DJ Studio</h1>
              <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
                LIVE
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-white font-bold">{crowdStats.totalListeners}</div>
              <div className="text-xs text-gray-400">Listeners</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold">${crowdStats.earnings}</div>
              <div className="text-xs text-gray-400">Earned</div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Radio className="w-4 h-4 mr-2" />
              Go Live
            </Button>
          </div>
        </div>

        {/* Main DJ Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* DJ Mixer - Main Area */}
          <div className="xl:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-12 bg-gray-800">
                <TabsTrigger value="mixer">🎛️ Mixer</TabsTrigger>
                <TabsTrigger value="waveform">📊 Waveform</TabsTrigger>
                <TabsTrigger value="sampler">🎹 Sampler</TabsTrigger>
                <TabsTrigger value="effects">✨ Effects</TabsTrigger>
                <TabsTrigger value="loops">🔁 Loops</TabsTrigger>
                <TabsTrigger value="visuals">🎨 Visuals</TabsTrigger>
                <TabsTrigger value="recording">🎙️ Record</TabsTrigger>
                <TabsTrigger value="streaming">📺 Stream</TabsTrigger>
                <TabsTrigger value="midi">🎮 MIDI</TabsTrigger>
                <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
                <TabsTrigger value="library">📚 Library</TabsTrigger>
                <TabsTrigger value="voting">🗳️ Voting</TabsTrigger>
              </TabsList>

              <TabsContent value="mixer" className="space-y-6">
                {/* Enhanced Deck Controls */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Deck A */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center">
                          <Disc className="w-5 h-5 mr-2" />
                          Deck A
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={`bg-blue-600 ${beatDetection.syncEnabled ? 'animate-pulse' : ''}`}>
                            {beatDetection.deckA.bpm} BPM
                          </Badge>
                          <Badge className="bg-green-600">
                            {beatDetection.syncEnabled ? 'SYNC' : 'FREE'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Enhanced Track Display */}
                        <div className="bg-gray-900 p-4 rounded-lg">
                          {deckATrack ? (
                            <div>
                              <div className="text-white font-bold text-lg">{deckATrack.title}</div>
                              <div className="text-gray-400">{deckATrack.artist}</div>
                              <div className="flex space-x-4 text-sm text-gray-400 mt-2">
                                <span>Key: {deckATrack.key}</span>
                                <span>Energy: {deckATrack.energy}/10</span>
                                <span>Dance: {Math.round(deckATrack.danceability * 100)}%</span>
                              </div>
                              {/* Mini Waveform */}
                              <div className="mt-3 h-8 bg-gray-800 rounded flex items-end justify-center space-x-px">
                                {waveformData.deckA.data.slice(0, 64).map((amplitude, i) => (
                                  <div
                                    key={i}
                                    className="bg-blue-400 w-1 rounded-sm"
                                    style={{ height: `${amplitude * 100}%` }}
                                  ></div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-center py-8">
                              <Disc className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              Load a track to Deck A
                            </div>
                          )}
                        </div>

                        {/* Enhanced Transport Controls */}
                        <div className="flex justify-center space-x-2">
                          <Button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700">
                            <Rewind className="w-5 h-5" />
                          </Button>
                          <Button className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700">
                            <Play className="w-6 h-6" />
                          </Button>
                          <Button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700">
                            <FastForward className="w-5 h-5" />
                          </Button>
                        </div>

                        {/* Hot Cues */}
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(hotCues.deckA).map(([cue, data]: [string, any]) => (
                            <Button
                              key={cue}
                              variant="outline"
                              size="sm"
                              className="h-10 text-xs"
                              style={{ borderColor: data.color, color: data.color }}
                            >
                              {cue}
                            </Button>
                          ))}
                        </div>

                        {/* Volume and EQ */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Volume</label>
                            <Slider
                              value={deckAVolume}
                              onValueChange={setDeckAVolume}
                              className="w-full"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Low</label>
                              <Slider
                                value={effects.deckA.eq.low}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Mid</label>
                              <Slider
                                value={effects.deckA.eq.mid}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">High</label>
                              <Slider
                                value={effects.deckA.eq.high}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Loop Controls */}
                        <div className="flex items-center justify-between">
                          <Button
                            variant={loopControls.deckA.enabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setLoopControls(prev => ({
                              ...prev,
                              deckA: { ...prev.deckA, enabled: !prev.deckA.enabled }
                            }))}
                          >
                            <Loop className="w-4 h-4 mr-1" />
                            Loop
                          </Button>
                          <Badge variant="outline" className="text-xs">
                            {loopControls.deckA.length} beats
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deck B */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center">
                          <Disc className="w-5 h-5 mr-2" />
                          Deck B
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={`bg-purple-600 ${beatDetection.syncEnabled ? 'animate-pulse' : ''}`}>
                            {beatDetection.deckB.bpm} BPM
                          </Badge>
                          <Badge className="bg-green-600">
                            {beatDetection.syncEnabled ? 'SYNC' : 'FREE'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Enhanced Track Display */}
                        <div className="bg-gray-900 p-4 rounded-lg">
                          {deckBTrack ? (
                            <div>
                              <div className="text-white font-bold text-lg">{deckBTrack.title}</div>
                              <div className="text-gray-400">{deckBTrack.artist}</div>
                              <div className="flex space-x-4 text-sm text-gray-400 mt-2">
                                <span>Key: {deckBTrack.key}</span>
                                <span>Energy: {deckBTrack.energy}/10</span>
                                <span>Dance: {Math.round(deckBTrack.danceability * 100)}%</span>
                              </div>
                              {/* Mini Waveform */}
                              <div className="mt-3 h-8 bg-gray-800 rounded flex items-end justify-center space-x-px">
                                {waveformData.deckB.data.slice(0, 64).map((amplitude, i) => (
                                  <div
                                    key={i}
                                    className="bg-purple-400 w-1 rounded-sm"
                                    style={{ height: `${amplitude * 100}%` }}
                                  ></div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-center py-8">
                              <Disc className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              Load a track to Deck B
                            </div>
                          )}
                        </div>

                        {/* Enhanced Transport Controls */}
                        <div className="flex justify-center space-x-2">
                          <Button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700">
                            <Rewind className="w-5 h-5" />
                          </Button>
                          <Button className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700">
                            <Play className="w-6 h-6" />
                          </Button>
                          <Button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700">
                            <FastForward className="w-5 h-5" />
                          </Button>
                        </div>

                        {/* Hot Cues */}
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(hotCues.deckB).map(([cue, data]: [string, any]) => (
                            <Button
                              key={cue}
                              variant="outline"
                              size="sm"
                              className="h-10 text-xs"
                              style={{ borderColor: data.color, color: data.color }}
                            >
                              {cue}
                            </Button>
                          ))}
                        </div>

                        {/* Volume and EQ */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Volume</label>
                            <Slider
                              value={deckBVolume}
                              onValueChange={setDeckBVolume}
                              className="w-full"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Low</label>
                              <Slider
                                value={effects.deckB.eq.low}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Mid</label>
                              <Slider
                                value={effects.deckB.eq.mid}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">High</label>
                              <Slider
                                value={effects.deckB.eq.high}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Loop Controls */}
                        <div className="flex items-center justify-between">
                          <Button
                            variant={loopControls.deckB.enabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setLoopControls(prev => ({
                              ...prev,
                              deckB: { ...prev.deckB, enabled: !prev.deckB.enabled }
                            }))}
                          >
                            <Loop className="w-4 h-4 mr-1" />
                            Loop
                          </Button>
                          <Badge variant="outline" className="text-xs">
                            {loopControls.deckB.length} beats
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Crossfader and Master Controls */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-8 items-center">
                      <div className="text-center">
                        <label className="block text-sm text-gray-400 mb-2">Deck A</label>
                        <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-white font-bold">A</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2 text-center">Crossfader</label>
                          <Slider
                            value={crossfader}
                            onValueChange={handleCrossfade}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2 text-center">Master Volume</label>
                          <Slider
                            value={masterVolume}
                            onValueChange={setMasterVolume}
                            className="w-full"
                          />
                        </div>
                        {/* Beat Sync Controls */}
                        <div className="flex items-center justify-center space-x-4">
                          <Button
                            variant={beatDetection.syncEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBeatDetection(prev => ({ ...prev, syncEnabled: !prev.syncEnabled }))}
                          >
                            <Activity className="w-4 h-4 mr-1" />
                            Sync
                          </Button>
                          <Button
                            variant={beatDetection.autoMixEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBeatDetection(prev => ({ ...prev, autoMixEnabled: !prev.autoMixEnabled }))}
                          >
                            <Zap className="w-4 h-4 mr-1" />
                            Auto-Mix
                          </Button>
                        </div>
                      </div>

                      <div className="text-center">
                        <label className="block text-sm text-gray-400 mb-2">Deck B</label>
                        <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-white font-bold">B</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Waveform Tab */}
              <TabsContent value="waveform" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Deck A Waveform */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2" />
                          Deck A Waveform
                        </span>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ZoomOut className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Large Waveform Display */}
                        <div className="h-48 bg-gray-900 rounded-lg relative overflow-hidden">
                          {/* Waveform */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full flex items-end justify-center space-x-px p-4">
                              {waveformData.deckA.data.map((amplitude, i) => (
                                <div
                                  key={i}
                                  className="bg-gradient-to-t from-blue-500 to-cyan-400 w-1 rounded-sm"
                                  style={{ height: `${amplitude * 100}%` }}
                                ></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Beat Markers */}
                          {waveformData.deckA.beats.map((beat, i) => (
                            <div
                              key={i}
                              className="absolute top-0 bottom-0 w-0.5 bg-red-500 opacity-50"
                              style={{ left: `${(beat.position / waveformData.deckA.data.length) * 100}%` }}
                            ></div>
                          ))}
                          
                          {/* Cue Points */}
                          {waveformData.deckA.cues.map((cue, i) => (
                            <div
                              key={i}
                              className="absolute top-0 bottom-0 w-1 bg-yellow-400 cursor-pointer"
                              style={{ left: `${(cue.position / waveformData.deckA.data.length) * 100}%` }}
                              title={`Cue ${cue.name}`}
                            ></div>
                          ))}
                          
                          {/* Loop Region */}
                          {loopControls.deckA.enabled && (
                            <div
                              className="absolute top-0 bottom-0 bg-blue-500/20 border-l-2 border-r-2 border-blue-400"
                              style={{
                                left: `${(loopControls.deckA.inPoint / waveformData.deckA.data.length) * 100}%`,
                                width: `${((loopControls.deckA.outPoint - loopControls.deckA.inPoint) / waveformData.deckA.data.length) * 100}%`
                              }}
                            ></div>
                          )}
                          
                          {/* Playhead */}
                          <div className="absolute top-0 bottom-0 w-0.5 bg-green-400 z-10"></div>
                        </div>
                        
                        {/* Waveform Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <MousePointer className="w-4 h-4 mr-1" />
                              Select
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Cue
                            </Button>
                            <Button variant="outline" size="sm">
                              <Loop className="w-4 h-4 mr-1" />
                              Loop
                            </Button>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {beatDetection.deckA.bpm} BPM • {beatDetection.deckA.confidence * 100}% confidence
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deck B Waveform */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2" />
                          Deck B Waveform
                        </span>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ZoomOut className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Large Waveform Display */}
                        <div className="h-48 bg-gray-900 rounded-lg relative overflow-hidden">
                          {/* Waveform */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full flex items-end justify-center space-x-px p-4">
                              {waveformData.deckB.data.map((amplitude, i) => (
                                <div
                                  key={i}
                                  className="bg-gradient-to-t from-purple-500 to-pink-400 w-1 rounded-sm"
                                  style={{ height: `${amplitude * 100}%` }}
                                ></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Beat Markers */}
                          {waveformData.deckB.beats.map((beat, i) => (
                            <div
                              key={i}
                              className="absolute top-0 bottom-0 w-0.5 bg-red-500 opacity-50"
                              style={{ left: `${(beat.position / waveformData.deckB.data.length) * 100}%` }}
                            ></div>
                          ))}
                          
                          {/* Cue Points */}
                          {waveformData.deckB.cues.map((cue, i) => (
                            <div
                              key={i}
                              className="absolute top-0 bottom-0 w-1 bg-yellow-400 cursor-pointer"
                              style={{ left: `${(cue.position / waveformData.deckB.data.length) * 100}%` }}
                              title={`Cue ${cue.name}`}
                            ></div>
                          ))}
                          
                          {/* Loop Region */}
                          {loopControls.deckB.enabled && (
                            <div
                              className="absolute top-0 bottom-0 bg-purple-500/20 border-l-2 border-r-2 border-purple-400"
                              style={{
                                left: `${(loopControls.deckB.inPoint / waveformData.deckB.data.length) * 100}%`,
                                width: `${((loopControls.deckB.outPoint - loopControls.deckB.inPoint) / waveformData.deckB.data.length) * 100}%`
                              }}
                            ></div>
                          )}
                          
                          {/* Playhead */}
                          <div className="absolute top-0 bottom-0 w-0.5 bg-green-400 z-10"></div>
                        </div>
                        
                        {/* Waveform Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <MousePointer className="w-4 h-4 mr-1" />
                              Select
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Cue
                            </Button>
                            <Button variant="outline" size="sm">
                              <Loop className="w-4 h-4 mr-1" />
                              Loop
                            </Button>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {beatDetection.deckB.bpm} BPM • {beatDetection.deckB.confidence * 100}% confidence
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Sampler Tab */}
              <TabsContent value="sampler" className="space-y-6">
                <div className="space-y-6">
                  {/* Sampler Controls */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center">
                          <Disc className="w-5 h-5 mr-2" />
                          Sampler Pads
                        </span>
                        <div className="flex items-center space-x-2">
                          <Select value={sampler.mode} onValueChange={(value) => setSampler({...sampler, mode: value})}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="trigger">Trigger</SelectItem>
                              <SelectItem value="hold">Hold</SelectItem>
                              <SelectItem value="toggle">Toggle</SelectItem>
                            </SelectContent>
                          </Select>
                          <Badge variant="outline">Bank {sampler.bank}</Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* 4x4 Pad Grid */}
                      <div className="grid grid-cols-4 gap-3">
                        {sampler.pads.map((pad) => (
                          <div key={pad.id} className="space-y-2">
                            <Button
                              className="w-full h-20 rounded-lg border-2 transition-all duration-200"
                              style={{
                                backgroundColor: pad.sample ? pad.color : '#374151',
                                borderColor: pad.sample ? pad.color : '#4B5563',
                                boxShadow: pad.sample ? `0 0 20px ${pad.color}40` : 'none'
                              }}
                              onClick={() => {
                                // Handle pad trigger
                                console.log(`Pad ${pad.id} triggered`);
                              }}
                            >
                              <div className="text-center">
                                <div className="text-white font-bold text-lg">{pad.id + 1}</div>
                                {pad.sample && (
                                  <div className="text-xs text-white/80 truncate">{pad.name}</div>
                                )}
                              </div>
                            </Button>
                            
                            {/* Pad Controls */}
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm" className="flex-1 text-xs">
                                <Mic className="w-3 h-3 mr-1" />
                                Rec
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 text-xs">
                                <Settings className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Recording Controls */}
                      <div className="mt-6 flex items-center justify-center space-x-4">
                        <Button
                          variant={sampler.recording ? "destructive" : "outline"}
                          onClick={() => setSampler({...sampler, recording: !sampler.recording})}
                        >
                          <Circle className={`w-4 h-4 mr-2 ${sampler.recording ? 'animate-pulse' : ''}`} />
                          {sampler.recording ? 'Stop Recording' : 'Start Recording'}
                        </Button>
                        <Button variant="outline">
                          <Save className="w-4 h-4 mr-2" />
                          Save Bank
                        </Button>
                        <Button variant="outline">
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Load Bank
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Effects Tab */}
              <TabsContent value="effects" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Deck A Effects */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Waves className="w-5 h-5 mr-2" />
                        Deck A Effects
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(advancedEffects.deckA).map(([effectName, effect]) => (
                        <div key={effectName} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-gray-300 capitalize">{effectName}</Label>
                            <Switch
                              checked={effect.enabled}
                              onCheckedChange={(checked) => {
                                const newEffects = {...advancedEffects};
                                newEffects.deckA[effectName].enabled = checked;
                                setAdvancedEffects(newEffects);
                              }}
                            />
                          </div>
                          
                          {/* Effect Parameters */}
                          <div className="grid grid-cols-2 gap-2">
                            {effectName === 'reverb' && (
                              <>
                                <div>
                                  <Label className="text-xs text-gray-400">Wet</Label>
                                  <Slider
                                    value={[effect.wet]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckA.reverb.wet = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={1}
                                    step={0.01}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-400">Decay</Label>
                                  <Slider
                                    value={[effect.decay]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckA.reverb.decay = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={5}
                                    step={0.1}
                                    className="mt-1"
                                  />
                                </div>
                              </>
                            )}
                            
                            {effectName === 'delay' && (
                              <>
                                <div>
                                  <Label className="text-xs text-gray-400">Time</Label>
                                  <Slider
                                    value={[effect.time]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckA.delay.time = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={2}
                                    step={0.01}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-400">Feedback</Label>
                                  <Slider
                                    value={[effect.feedback]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckA.delay.feedback = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={0.9}
                                    step={0.01}
                                    className="mt-1"
                                  />
                                </div>
                              </>
                            )}
                            
                            {effectName === 'flanger' && (
                              <>
                                <div>
                                  <Label className="text-xs text-gray-400">Rate</Label>
                                  <Slider
                                    value={[effect.rate]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckA.flanger.rate = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={5}
                                    step={0.1}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-400">Depth</Label>
                                  <Slider
                                    value={[effect.depth]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckA.flanger.depth = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={1}
                                    step={0.01}
                                    className="mt-1"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Deck B Effects */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Waves className="w-5 h-5 mr-2" />
                        Deck B Effects
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(advancedEffects.deckB).map(([effectName, effect]) => (
                        <div key={effectName} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-gray-300 capitalize">{effectName}</Label>
                            <Switch
                              checked={effect.enabled}
                              onCheckedChange={(checked) => {
                                const newEffects = {...advancedEffects};
                                newEffects.deckB[effectName].enabled = checked;
                                setAdvancedEffects(newEffects);
                              }}
                            />
                          </div>
                          
                          {/* Effect Parameters */}
                          <div className="grid grid-cols-2 gap-2">
                            {effectName === 'reverb' && (
                              <>
                                <div>
                                  <Label className="text-xs text-gray-400">Wet</Label>
                                  <Slider
                                    value={[effect.wet]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckB.reverb.wet = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={1}
                                    step={0.01}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-400">Decay</Label>
                                  <Slider
                                    value={[effect.decay]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckB.reverb.decay = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={5}
                                    step={0.1}
                                    className="mt-1"
                                  />
                                </div>
                              </>
                            )}
                            
                            {effectName === 'delay' && (
                              <>
                                <div>
                                  <Label className="text-xs text-gray-400">Time</Label>
                                  <Slider
                                    value={[effect.time]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckB.delay.time = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={2}
                                    step={0.01}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-400">Feedback</Label>
                                  <Slider
                                    value={[effect.feedback]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckB.delay.feedback = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={0.9}
                                    step={0.01}
                                    className="mt-1"
                                  />
                                </div>
                              </>
                            )}
                            
                            {effectName === 'flanger' && (
                              <>
                                <div>
                                  <Label className="text-xs text-gray-400">Rate</Label>
                                  <Slider
                                    value={[effect.rate]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckB.flanger.rate = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={5}
                                    step={0.1}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-400">Depth</Label>
                                  <Slider
                                    value={[effect.depth]}
                                    onValueChange={(value) => {
                                      const newEffects = {...advancedEffects};
                                      newEffects.deckB.flanger.depth = value[0];
                                      setAdvancedEffects(newEffects);
                                    }}
                                    max={1}
                                    step={0.01}
                                    className="mt-1"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Loops Tab */}
              <TabsContent value="loops" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Deck A Loops */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center">
                          <Loop className="w-5 h-5 mr-2" />
                          Deck A Loops & Cues
                        </span>
                        <Badge variant={loopControls.deckA.enabled ? "default" : "outline"}>
                          {loopControls.deckA.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Loop Controls */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm text-gray-300">Loop Enable</Label>
                          <Switch
                            checked={loopControls.deckA.enabled}
                            onCheckedChange={(checked) => setLoopControls(prev => ({
                              ...prev,
                              deckA: { ...prev.deckA, enabled: checked }
                            }))}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-gray-400">In Point</Label>
                            <Input
                              type="number"
                              value={loopControls.deckA.inPoint}
                              onChange={(e) => setLoopControls(prev => ({
                                ...prev,
                                deckA: { ...prev.deckA, inPoint: Number(e.target.value) }
                              }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">Out Point</Label>
                            <Input
                              type="number"
                              value={loopControls.deckA.outPoint}
                              onChange={(e) => setLoopControls(prev => ({
                                ...prev,
                                deckA: { ...prev.deckA, outPoint: Number(e.target.value) }
                              }))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-gray-400">Length: {loopControls.deckA.length} beats</Label>
                          <Slider
                            value={[loopControls.deckA.length]}
                            onValueChange={(value) => setLoopControls(prev => ({
                              ...prev,
                              deckA: { ...prev.deckA, length: value[0] }
                            }))}
                            min={1}
                            max={64}
                            step={1}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      {/* Hot Cues */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Hot Cues</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(hotCues.deckA).map(([cue, data]: [string, any]) => (
                            <Button
                              key={cue}
                              variant="outline"
                              className="h-12"
                              style={{ borderColor: data.color, color: data.color }}
                              onClick={() => {
                                // Set cue point
                                console.log(`Set cue ${cue} at position:`, data.position);
                              }}
                            >
                              <div className="text-center">
                                <div className="font-bold">{cue}</div>
                                <div className="text-xs">{data.name}</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Slip Mode */}
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-300">Slip Mode</Label>
                        <Switch
                          checked={loopControls.deckA.slipMode}
                          onCheckedChange={(checked) => setLoopControls(prev => ({
                            ...prev,
                            deckA: { ...prev.deckA, slipMode: checked }
                          }))}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deck B Loops */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center">
                          <Loop className="w-5 h-5 mr-2" />
                          Deck B Loops & Cues
                        </span>
                        <Badge variant={loopControls.deckB.enabled ? "default" : "outline"}>
                          {loopControls.deckB.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Loop Controls */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm text-gray-300">Loop Enable</Label>
                          <Switch
                            checked={loopControls.deckB.enabled}
                            onCheckedChange={(checked) => setLoopControls(prev => ({
                              ...prev,
                              deckB: { ...prev.deckB, enabled: checked }
                            }))}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-gray-400">In Point</Label>
                            <Input
                              type="number"
                              value={loopControls.deckB.inPoint}
                              onChange={(e) => setLoopControls(prev => ({
                                ...prev,
                                deckB: { ...prev.deckB, inPoint: Number(e.target.value) }
                              }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">Out Point</Label>
                            <Input
                              type="number"
                              value={loopControls.deckB.outPoint}
                              onChange={(e) => setLoopControls(prev => ({
                                ...prev,
                                deckB: { ...prev.deckB, outPoint: Number(e.target.value) }
                              }))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-gray-400">Length: {loopControls.deckB.length} beats</Label>
                          <Slider
                            value={[loopControls.deckB.length]}
                            onValueChange={(value) => setLoopControls(prev => ({
                              ...prev,
                              deckB: { ...prev.deckB, length: value[0] }
                            }))}
                            min={1}
                            max={64}
                            step={1}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      {/* Hot Cues */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Hot Cues</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(hotCues.deckB).map(([cue, data]: [string, any]) => (
                            <Button
                              key={cue}
                              variant="outline"
                              className="h-12"
                              style={{ borderColor: data.color, color: data.color }}
                              onClick={() => {
                                // Set cue point
                                console.log(`Set cue ${cue} at position:`, data.position);
                              }}
                            >
                              <div className="text-center">
                                <div className="font-bold">{cue}</div>
                                <div className="text-xs">{data.name}</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Slip Mode */}
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-300">Slip Mode</Label>
                        <Switch
                          checked={loopControls.deckB.slipMode}
                          onCheckedChange={(checked) => setLoopControls(prev => ({
                            ...prev,
                            deckB: { ...prev.deckB, slipMode: checked }
                          }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Visuals Tab */}
              <TabsContent value="visuals" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Visual Effects Controls */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Palette className="w-5 h-5 mr-2" />
                        Visual Effects
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-300">Enable Visuals</Label>
                        <Switch
                          checked={visualEffects.enabled}
                          onCheckedChange={(checked) => setVisualEffects(prev => ({ ...prev, enabled: checked }))}
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-300">Visual Type</Label>
                        <Select
                          value={visualEffects.type}
                          onValueChange={(value) => setVisualEffects(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spectrum">Spectrum</SelectItem>
                            <SelectItem value="waveform">Waveform</SelectItem>
                            <SelectItem value="reactive">Reactive</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-300">Theme</Label>
                        <Select
                          value={visualEffects.theme}
                          onValueChange={(value) => setVisualEffects(prev => ({ ...prev, theme: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="neon">Neon</SelectItem>
                            <SelectItem value="fire">Fire</SelectItem>
                            <SelectItem value="ocean">Ocean</SelectItem>
                            <SelectItem value="forest">Forest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-300">Intensity: {visualEffects.intensity}</Label>
                        <Slider
                          value={[visualEffects.intensity]}
                          onValueChange={(value) => setVisualEffects(prev => ({ ...prev, intensity: value[0] }))}
                          max={1}
                          step={0.01}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-300">Speed: {visualEffects.speed}</Label>
                        <Slider
                          value={[visualEffects.speed]}
                          onValueChange={(value) => setVisualEffects(prev => ({ ...prev, speed: value[0] }))}
                          max={2}
                          step={0.01}
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lighting Controls */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2" />
                        Lighting Control
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-300">Enable Lighting</Label>
                        <Switch
                          checked={visualEffects.lighting.enabled}
                          onCheckedChange={(checked) => setVisualEffects(prev => ({
                            ...prev,
                            lighting: { ...prev.lighting, enabled: checked }
                          }))}
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-300">Lighting Mode</Label>
                        <Select
                          value={visualEffects.lighting.mode}
                          onValueChange={(value) => setVisualEffects(prev => ({
                            ...prev,
                            lighting: { ...prev.lighting, mode: value }
                          }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reactive">Reactive</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="program">Program</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Lighting Fixtures */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Fixtures</Label>
                        <div className="space-y-1">
                          {['Front Left', 'Front Right', 'Back Left', 'Back Right', 'Center'].map((fixture, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                              <span className="text-sm text-gray-300">{fixture}</span>
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">On</Button>
                                <Button variant="outline" size="sm">Off</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Visual Preview */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Visual Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <Sparkles className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Visual Effects Preview</div>
                        <div className="text-xs text-gray-300">Theme: {visualEffects.theme} • Type: {visualEffects.type}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recording Tab */}
              <TabsContent value="recording" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Recording Controls */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center">
                          <Mic className="w-5 h-5 mr-2" />
                          Recording Studio
                        </span>
                        <Badge variant={recording.isRecording ? "destructive" : "outline"}>
                          {recording.isRecording ? 'Recording' : 'Ready'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          variant={recording.isRecording ? "destructive" : "default"}
                          size="lg"
                          onClick={() => setRecording(prev => ({ ...prev, isRecording: !prev.isRecording }))}
                        >
                          {recording.isRecording ? (
                            <>
                              <StopCircle className="w-5 h-5 mr-2" />
                              Stop Recording
                            </>
                          ) : (
                            <>
                              <Record className="w-5 h-5 mr-2" />
                              Start Recording
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-300">Format</Label>
                          <Select
                            value={recording.format}
                            onValueChange={(value) => setRecording(prev => ({ ...prev, format: value }))}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wav">WAV</SelectItem>
                              <SelectItem value="mp3">MP3</SelectItem>
                              <SelectItem value="flac">FLAC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-300">Quality</Label>
                          <Select
                            value={recording.quality}
                            onValueChange={(value) => setRecording(prev => ({ ...prev, quality: value }))}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-300">Destination</Label>
                        <Select
                          value={recording.destination}
                          onValueChange={(value) => setRecording(prev => ({ ...prev, destination: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="local">Local Storage</SelectItem>
                            <SelectItem value="cloud">Cloud Storage</SelectItem>
                            <SelectItem value="stream">Live Stream</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-300">Duration</Label>
                        <Badge variant="outline">{recording.duration}s</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Track Management */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Layers className="w-5 h-5 mr-2" />
                        Track Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <span className="text-sm text-gray-300">Master Track</span>
                          <Switch checked={true} />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <span className="text-sm text-gray-300">Deck A</span>
                          <Switch checked={true} />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <span className="text-sm text-gray-300">Deck B</span>
                          <Switch checked={true} />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <span className="text-sm text-gray-300">Sampler</span>
                          <Switch checked={false} />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-600">
                        <Button variant="outline" className="w-full">
                          <Save className="w-4 h-4 mr-2" />
                          Save Recording
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Streaming Tab */}
              <TabsContent value="streaming" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Stream Controls */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center">
                          <Radio className="w-5 h-5 mr-2" />
                          Live Streaming
                        </span>
                        <Badge variant={streaming.isLive ? "destructive" : "outline"}>
                          {streaming.isLive ? 'LIVE' : 'Offline'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-center">
                        <Button
                          variant={streaming.isLive ? "destructive" : "default"}
                          size="lg"
                          onClick={() => setStreaming(prev => ({ ...prev, isLive: !prev.isLive }))}
                        >
                          {streaming.isLive ? (
                            <>
                              <StopCircle className="w-5 h-5 mr-2" />
                              End Stream
                            </>
                          ) : (
                            <>
                              <Radio className="w-5 h-5 mr-2" />
                              Go Live
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-300">Platform</Label>
                          <Select
                            value={streaming.platform}
                            onValueChange={(value) => setStreaming(prev => ({ ...prev, platform: value }))}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="twitch">Twitch</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="custom">Custom RTMP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-300">Quality</Label>
                          <Select
                            value={streaming.quality}
                            onValueChange={(value) => setStreaming(prev => ({ ...prev, quality: value }))}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="720p">720p</SelectItem>
                              <SelectItem value="1080p">1080p</SelectItem>
                              <SelectItem value="1440p">1440p</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-300">Bitrate: {streaming.bitrate}kbps</Label>
                        <Slider
                          value={[streaming.bitrate]}
                          onValueChange={(value) => setStreaming(prev => ({ ...prev, bitrate: value[0] }))}
                          min={1000}
                          max={6000}
                          step={100}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-300">Chat Enabled</Label>
                        <Switch
                          checked={streaming.chatEnabled}
                          onCheckedChange={(checked) => setStreaming(prev => ({ ...prev, chatEnabled: checked }))}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stream Stats */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Stream Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-700 rounded">
                          <div className="text-2xl font-bold text-blue-400">{streaming.viewers}</div>
                          <div className="text-sm text-gray-400">Viewers</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700 rounded">
                          <div className="text-2xl font-bold text-green-400">${streaming.donations}</div>
                          <div className="text-sm text-gray-400">Donations</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Stream Health</span>
                          <Badge variant="outline" className="text-green-400">Excellent</Badge>
                        </div>
                        <Progress value={95} className="w-full" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Chat Activity</span>
                          <Badge variant="outline" className="text-blue-400">High</Badge>
                        </div>
                        <Progress value={78} className="w-full" />
                      </div>
                      
                      <div className="pt-4 border-t border-gray-600">
                        <Button variant="outline" className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Stream Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* MIDI Tab */}
              <TabsContent value="midi" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* MIDI Devices */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center">
                          <Keyboard className="w-5 h-5 mr-2" />
                          MIDI Devices
                        </span>
                        <Badge variant={midiController.connected ? "default" : "outline"}>
                          {midiController.connected ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {midiController.devices.map((device) => (
                        <div key={device.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${device.connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <div>
                              <div className="text-white font-medium text-sm">{device.name}</div>
                              <div className="text-xs text-gray-400 capitalize">{device.type}</div>
                            </div>
                          </div>
                          <Button
                            variant={device.connected ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const newDevices = [...midiController.devices];
                              const deviceIndex = newDevices.findIndex(d => d.id === device.id);
                              newDevices[deviceIndex].connected = !newDevices[deviceIndex].connected;
                              setMidiController(prev => ({ ...prev, devices: newDevices }));
                            }}
                          >
                            {device.connected ? 'Disconnect' : 'Connect'}
                          </Button>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add MIDI Device
                      </Button>
                    </CardContent>
                  </Card>

                  {/* MIDI Mapping */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center">
                          <Settings className="w-5 h-5 mr-2" />
                          MIDI Mapping
                        </span>
                        <Button
                          variant={midiController.learnMode ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMidiController(prev => ({ ...prev, learnMode: !prev.learnMode }))}
                        >
                          {midiController.learnMode ? 'Learning...' : 'Learn Mode'}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-300">Controller Template</Label>
                        <Select
                          value={midiController.templates[0]}
                          onValueChange={(value) => {
                            // Apply template
                            console.log('Applying template:', value);
                          }}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {midiController.templates.map((template) => (
                              <SelectItem key={template} value={template}>
                                {template}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Mapped Controls</Label>
                        <div className="space-y-1">
                          {[
                            { control: 'Crossfader', midi: 'CC 1' },
                            { control: 'Deck A Volume', midi: 'CC 7' },
                            { control: 'Deck B Volume', midi: 'CC 8' },
                            { control: 'Play A', midi: 'Note 60' },
                            { control: 'Play B', midi: 'Note 61' }
                          ].map((mapping, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                              <span className="text-sm text-gray-300">{mapping.control}</span>
                              <Badge variant="outline" className="text-xs">{mapping.midi}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-600">
                        <Button variant="outline" className="w-full">
                          <Save className="w-4 h-4 mr-2" />
                          Save Mapping
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Real-time Analytics */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        Real-time Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-700 rounded">
                          <div className="text-2xl font-bold text-cyan-400">{performanceAnalytics.realTime.energy}%</div>
                          <div className="text-sm text-gray-400">Crowd Energy</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700 rounded">
                          <div className="text-2xl font-bold text-purple-400">{performanceAnalytics.realTime.listeners}</div>
                          <div className="text-sm text-gray-400">Listeners</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400">BPM</span>
                            <span className="text-sm text-cyan-400 font-bold">{performanceAnalytics.realTime.bpm}</span>
                          </div>
                          <Progress value={(performanceAnalytics.realTime.bpm / 200) * 100} className="w-full" />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400">Engagement</span>
                            <span className="text-sm text-green-400 font-bold">{performanceAnalytics.realTime.engagement * 100}%</span>
                          </div>
                          <Progress value={performanceAnalytics.realTime.engagement * 100} className="w-full" />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400">Danceability</span>
                            <span className="text-sm text-pink-400 font-bold">{performanceAnalytics.realTime.danceability * 100}%</span>
                          </div>
                          <Progress value={performanceAnalytics.realTime.danceability * 100} className="w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Session Analytics */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Session Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-700 rounded">
                          <div className="text-2xl font-bold text-green-400">${performanceAnalytics.session.earnings}</div>
                          <div className="text-sm text-gray-400">Session Earnings</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700 rounded">
                          <div className="text-2xl font-bold text-blue-400">{performanceAnalytics.session.tracksPlayed.length}</div>
                          <div className="text-sm text-gray-400">Tracks Played</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Session Duration</span>
                          <Badge variant="outline">{Math.floor(performanceAnalytics.session.duration / 60)}m {performanceAnalytics.session.duration % 60}s</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Requests Fulfilled</span>
                          <Badge variant="outline">{performanceAnalytics.session.totalRequests}</Badge>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-600">
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export Session Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Historical Analytics */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Historical Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-700 rounded">
                        <div className="text-xl font-bold text-cyan-400">{performanceAnalytics.history.totalSessions}</div>
                        <div className="text-xs text-gray-400">Total Sessions</div>
                      </div>
                      <div className="text-center p-4 bg-gray-700 rounded">
                        <div className="text-xl font-bold text-purple-400">{performanceAnalytics.history.totalHours}h</div>
                        <div className="text-xs text-gray-400">Total Hours</div>
                      </div>
                      <div className="text-center p-4 bg-gray-700 rounded">
                        <div className="text-xl font-bold text-green-400">${performanceAnalytics.history.earnings}</div>
                        <div className="text-xs text-gray-400">Total Earnings</div>
                      </div>
                      <div className="text-center p-4 bg-gray-700 rounded">
                        <div className="text-xl font-bold text-blue-400">{performanceAnalytics.history.averageListeners}</div>
                        <div className="text-xs text-gray-400">Avg Listeners</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="library" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Track Library</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Search tracks..."
                          className="bg-gray-700 border-gray-600 text-white w-64"
                        />
                        <Button className="bg-gray-600 hover:bg-gray-700">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {trackLibrary.map((track) => (
                        <div key={track.id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{track.title}</div>
                            <div className="text-gray-400 text-sm">{track.artist}</div>
                          </div>
                          <div className="text-sm text-gray-400 text-center">
                            <div>{track.bpm} BPM</div>
                            <div>Key: {track.key}</div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {track.duration}
                          </div>
                          <Badge className="bg-purple-600">{track.genre}</Badge>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              onClick={() => handleTrackLoad(track, 'A')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              → A
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleTrackLoad(track, 'B')}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              → B
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voting" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Vote className="w-5 h-5 mr-2" />
                      Live Crowd Voting
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Listeners can vote for free or pay to prioritize their requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {liveVotes.map((vote, index) => (
                        <div key={vote.id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{vote.track}</div>
                            <div className="text-gray-400 text-sm">{vote.artist}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-white">{vote.votes}</span>
                          </div>
                          {vote.paidRequest && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 font-bold">${vote.amount}</span>
                            </div>
                          )}
                          <Button
                            size="sm"
                            className={`${vote.paidRequest ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                          >
                            {vote.paidRequest ? 'Play Next' : 'Queue'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Live Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Listeners</span>
                  <span className="text-white font-bold">{crowdStats.totalListeners}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Voters</span>
                  <span className="text-blue-400 font-bold">{crowdStats.activeVoters}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Requests</span>
                  <span className="text-purple-400 font-bold">{crowdStats.totalRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Earnings</span>
                  <span className="text-green-400 font-bold">${crowdStats.earnings}</span>
                </div>
                <div className="pt-3 border-t border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Crowd Energy</span>
                    <span className="text-orange-400 font-bold">{crowdStats.peakEnergy}%</span>
                  </div>
                  <Progress value={crowdStats.peakEnergy} className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Radio className="w-4 h-4 mr-2" />
                  Start Live Stream
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Music className="w-4 h-4 mr-2" />
                  Import Tracks
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Enable Paid Requests
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Headphones className="w-4 h-4 mr-2" />
                  Cue Monitor
                </Button>
              </CardContent>
            </Card>

            {/* Playlist Queue */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Up Next</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { title: "Summer Vibes", artist: "DJ Cosmic" },
                    { title: "Electric Storm", artist: "Thunder Beats" },
                    { title: "Deep Ocean", artist: "Ambient Flow" }
                  ].map((track, index) => (
                    <div key={index} className="p-2 bg-gray-700 rounded">
                      <div className="text-white text-sm font-medium">{track.title}</div>
                      <div className="text-gray-400 text-xs">{track.artist}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}