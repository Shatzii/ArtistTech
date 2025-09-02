'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Play, Pause, Square, Circle, SkipForward, SkipBack, Volume2,
  Music, Mic, Headphones, Settings, Users, Save, Download,
  Piano, Drum, Waves, Sliders, Layers, Wand2, Zap, CloudUpload,
  Maximize2, Minimize2, Grid3x3, Move, RotateCw, Eye, EyeOff,
  Volume1, VolumeX, Repeat, Shuffle, Clock, Activity, Cpu,
  BarChart3, Target, Sparkles, Crown, Star, TrendingUp,
  Keyboard, Guitar, Mic2, Speaker, Radio, Disc3,
  Palette, Lightbulb, Moon, Sun, MonitorSpeaker, AudioLines,
  Upload, Plus, ZoomIn, ZoomOut, MousePointer, Edit, LineChart, Spline
} from 'lucide-react';

export default function UltimateMusicStudio() {
  // Enhanced State Management
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [masterVolume, setMasterVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedInstrument, setSelectedInstrument] = useState('piano');
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWaveform, setShowWaveform] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [loopMode, setLoopMode] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [quantizeEnabled, setQuantizeEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Enhanced Theme System
  const [theme, setTheme] = useState<'dark' | 'light' | 'neon' | 'cyberpunk' | 'minimal' | 'studio' | 'vintage' | 'nature' | 'sunset' | 'ocean' | 'midnight'>('dark');
  const [layout, setLayout] = useState<'compact' | 'expanded' | 'grid' | 'waveform' | 'classic'>('expanded');
  const [visualEffects, setVisualEffects] = useState({
    particles: false,
    glow: true,
    animations: true,
    waveforms: true,
    spectrum: false
  });

  // Dynamic Theme Styles
  const getThemeStyles = () => {
    const themes = {
      dark: {
        bg: 'bg-gray-900',
        card: 'bg-gray-800/50 border-gray-700',
        text: 'text-white',
        accent: 'text-blue-400',
        glow: 'shadow-blue-500/20'
      },
      light: {
        bg: 'bg-gray-50',
        card: 'bg-white border-gray-200',
        text: 'text-gray-900',
        accent: 'text-blue-600',
        glow: 'shadow-blue-200/50'
      },
      neon: {
        bg: 'bg-black',
        card: 'bg-gray-900/80 border-pink-500/50',
        text: 'text-green-400',
        accent: 'text-pink-400',
        glow: 'shadow-pink-500/50'
      },
      cyberpunk: {
        bg: 'bg-purple-900',
        card: 'bg-gray-800/70 border-cyan-400/50',
        text: 'text-cyan-300',
        accent: 'text-purple-400',
        glow: 'shadow-cyan-400/30'
      },
      minimal: {
        bg: 'bg-white',
        card: 'bg-gray-50 border-gray-200',
        text: 'text-gray-800',
        accent: 'text-gray-600',
        glow: 'shadow-gray-300/20'
      },
      studio: {
        bg: 'bg-gradient-to-br from-blue-900 to-purple-900',
        card: 'bg-white/10 backdrop-blur-md border-white/20',
        text: 'text-white',
        accent: 'text-yellow-400',
        glow: 'shadow-yellow-400/30'
      },
      vintage: {
        bg: 'bg-gradient-to-br from-amber-100 to-orange-200',
        card: 'bg-amber-50/80 border-amber-300',
        text: 'text-amber-900',
        accent: 'text-orange-600',
        glow: 'shadow-amber-400/40'
      },
      nature: {
        bg: 'bg-gradient-to-br from-green-800 to-emerald-900',
        card: 'bg-emerald-50/20 border-emerald-400/50',
        text: 'text-emerald-100',
        accent: 'text-green-300',
        glow: 'shadow-emerald-400/40'
      }
    };
    return themes[theme];
  };

  const themeStyles = getThemeStyles();

  // 2. Effects Rack
  const [effectsRack, setEffectsRack] = useState({
    selectedTrack: null,
    showRack: false,
    effects: [
      { id: 'reverb', name: 'Reverb', enabled: true, wet: 0.3, decay: 2.0, preDelay: 0.1 },
      { id: 'delay', name: 'Delay', enabled: false, wet: 0.2, time: 0.5, feedback: 0.3 },
      { id: 'chorus', name: 'Chorus', enabled: false, wet: 0.2, rate: 0.5, depth: 0.3 },
      { id: 'compressor', name: 'Compressor', enabled: true, threshold: -20, ratio: 4, attack: 0.01, release: 0.1 },
      { id: 'eq', name: 'EQ', enabled: true, bands: [
        { freq: 100, gain: 0, q: 1.4 },
        { freq: 1000, gain: 2, q: 1.4 },
        { freq: 5000, gain: -1, q: 1.4 }
      ]}
    ]
  });

  // 3. Collaboration Features
  const [collaboration, setCollaboration] = useState({
    isOnline: true,
    collaborators: [
      { id: 'user1', name: 'Alice', avatar: '🎵', status: 'online', cursor: { x: 100, y: 200 } },
      { id: 'user2', name: 'Bob', avatar: '🎹', status: 'online', cursor: { x: 300, y: 150 } }
    ],
    chatMessages: [
      { id: '1', user: 'Alice', message: 'Great mix on the drums!', timestamp: Date.now() - 300000 },
      { id: '2', user: 'Bob', message: 'Let me add some reverb to the vocals', timestamp: Date.now() - 120000 }
    ],
    sharedCursor: { x: 0, y: 0, user: '' }
  });

  // 4. Advanced EQ
  const [advancedEQ, setAdvancedEQ] = useState({
    showEQ: false,
    selectedTrack: null,
    bands: [
      { id: 'low', freq: 80, gain: 0, q: 0.7, type: 'lowshelf' },
      { id: 'lowmid', freq: 250, gain: 0, q: 1.4, type: 'peaking' },
      { id: 'mid', freq: 1000, gain: 0, q: 1.4, type: 'peaking' },
      { id: 'highmid', freq: 4000, gain: 0, q: 1.4, type: 'peaking' },
      { id: 'high', freq: 12000, gain: 0, q: 0.7, type: 'highshelf' }
    ]
  });

  // 5. MIDI Integration
  const [midiIntegration, setMidiIntegration] = useState({
    devices: [
      { id: 'midi1', name: 'Arturia KeyLab 61', type: 'keyboard', connected: true },
      { id: 'midi2', name: 'Akai MPD218', type: 'pad', connected: false }
    ],
    midiLearn: false,
    midiMappings: [
      { control: 'play', midiNote: 60, channel: 1 },
      { control: 'record', midiNote: 61, channel: 1 },
      { control: 'stop', midiNote: 62, channel: 1 }
    ],
    keyboardOctave: 4,
    velocityCurve: 'linear'
  });

  // Advanced Audio State
  const [audioEngine, setAudioEngine] = useState({
    sampleRate: 44100,
    bufferSize: 256,
    latency: 5.8,
    cpuUsage: 23,
    ramUsage: 1.2,
    activeTracks: 8,
    totalTracks: 16
  });

  // Professional Track System
  const [tracks, setTracks] = useState([
    {
      id: 'track_01',
      name: 'Lead Melody',
      type: 'audio',
      volume: 85,
      pan: 0,
      muted: false,
      solo: false,
      armed: false,
      color: '#3B82F6',
      waveform: [0.2, 0.5, 0.8, 0.3, 0.9, 0.1, 0.7, 0.4],
      effects: { reverb: 15, delay: 8, chorus: 5, compressor: 3 },
      eq: { high: 0, mid: 2, low: 0 },
      gain: 3,
      phase: false
    },
    {
      id: 'track_02',
      name: 'Bass Line',
      type: 'midi',
      volume: 75,
      pan: -10,
      muted: false,
      solo: false,
      armed: false,
      color: '#EF4444',
      waveform: [0.8, 0.9, 0.7, 0.8, 0.6, 0.9, 0.8, 0.7],
      effects: { reverb: 5, delay: 0, chorus: 0, compressor: 8 },
      eq: { high: -2, mid: 0, low: 4 },
      gain: 0,
      phase: false
    },
    {
      id: 'track_03',
      name: 'Drums',
      type: 'drums',
      volume: 90,
      pan: 0,
      muted: false,
      solo: false,
      armed: false,
      color: '#10B981',
      waveform: [0.9, 0.3, 0.9, 0.2, 0.9, 0.4, 0.9, 0.3],
      effects: { reverb: 25, delay: 12, chorus: 0, compressor: 6 },
      eq: { high: 3, mid: -1, low: 2 },
      gain: 2,
      phase: false
    },
    {
      id: 'track_04',
      name: 'Vocals',
      type: 'audio',
      volume: 80,
      pan: 15,
      muted: false,
      solo: false,
      armed: false,
      color: '#8B5CF6',
      waveform: [0.4, 0.7, 0.5, 0.8, 0.3, 0.9, 0.4, 0.6],
      effects: { reverb: 20, delay: 15, chorus: 8, compressor: 4 },
      eq: { high: 1, mid: 3, low: -1 },
      gain: 1,
      phase: false
    }
  ]);

  // Professional Instruments
  const [instruments, setInstruments] = useState([
    { id: "piano", name: "Grand Piano", category: "keys", loaded: true, samples: 88, icon: Piano },
    { id: "guitar", name: "Electric Guitar", category: "strings", loaded: true, samples: 64, icon: Guitar },
    { id: "bass", name: "Electric Bass", category: "bass", loaded: true, samples: 32, icon: Speaker },
    { id: "drums", name: "Studio Kit", category: "drums", loaded: true, samples: 16, icon: Drum },
    { id: "synth", name: "Analog Synth", category: "synth", loaded: false, samples: 128, icon: Waves },
    { id: "vocals", name: "Vocal Chain", category: "vocals", loaded: false, samples: 96, icon: Mic2 }
  ]);

  // AI Features State
  const [aiFeatures, setAIFeatures] = useState({
    compositionAssistant: true,
    harmonicAnalysis: true,
    rhythmGeneration: false,
    mastering: true,
    stemSeparation: false,
    voiceCloning: false,
    autoMix: false,
    genreDetection: true
  });

  // Full-stack API integration
  const studioActions = useEnhancedStudioActions();
  const { toast } = useToast();

  // Transport Controls with Real Backend Integration
  const handlePlay = async () => {
    try {
      const result = await studioActions.music.transport.play.mutateAsync({ projectId: 'current_project', position: currentTime });
      setIsPlaying(true);
      toast({
        title: "Playback Started",
        description: result.message || "Audio playback initiated successfully",
      });
    } catch (error) {
      toast({
        title: "Playback Error",
        description: "Failed to start playback",
        variant: "destructive",
      });
    }
  };

  const handlePause = async () => {
    try {
      const result = await studioActions.music.transport.pause.mutateAsync({ projectId: 'current_project' });
      setIsPlaying(false);
      toast({
        title: "Playback Paused",
        description: result.message || "Audio playback paused",
      });
    } catch (error) {
      toast({
        title: "Pause Error",
        description: "Failed to pause playback",
        variant: "destructive",
      });
    }
  };

  const handleRecord = async () => {
    try {
      const result = await studioActions.music.transport.record.mutateAsync({ 
        projectId: 'current_project', 
        trackId: 'track_01' 
      });
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: result.message || "Recording initiated on Track 1",
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Failed to start recording",
        variant: "destructive",
      });
    }
  };

  const handleInstrumentLoad = async (instrumentType: string, preset: string) => {
    try {
      const result = await studioActions.music.instruments.loadInstrument.mutateAsync({ 
        instrumentType, 
        preset 
      });
      setSelectedInstrument(instrumentType);
      toast({
        title: "Instrument Loaded",
        description: result.message || `${instrumentType} loaded with preset: ${preset}`,
      });
    } catch (error) {
      toast({
        title: "Load Error",
        description: "Failed to load instrument",
        variant: "destructive",
      });
    }
  };

  const handleSaveProject = async () => {
    try {
      const result = await studioActions.music.project.saveProject.mutateAsync({
        projectName,
        tracks: generateCurrentTracks(),
        settings: { bpm, masterVolume, selectedInstrument }
      });
      toast({
        title: "Project Saved",
        description: result.message || `Project "${projectName}" saved successfully`,
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const handleMixerChange = async (channelId: string, property: string, value: number) => {
    try {
      await studioActions.music.mixer.updateChannel.mutateAsync({
        channelId,
        property,
        value
      });
    } catch (error) {
      console.error('Mixer update failed:', error);
    }
  };

  // Generate current track data
  const generateCurrentTracks = () => {
    return [
      { id: 'track_01', name: 'Lead Melody', type: 'audio', volume: 85, muted: false },
      { id: 'track_02', name: 'Bass Line', type: 'audio', volume: 75, muted: false },
      { id: 'track_03', name: 'Drums', type: 'audio', volume: 90, muted: false },
      { id: 'track_04', name: 'Vocals', type: 'audio', volume: 80, muted: false }
    ];
  };

  // Professional Studio Status
  const { data: studioStatus } = studioActions.status;

  // Enhanced Theme-based styling with global CSS theme system
  const getThemeClasses = () => {
    const themeMap: Record<string, string> = {
      dark: 'studio-theme-dark',
      light: 'studio-theme-light',
      neon: 'studio-theme-neon',
      cyberpunk: 'studio-theme-cyberpunk',
      minimal: 'studio-theme-minimal',
      studio: 'studio-theme-studio',
      vintage: 'studio-theme-vintage',
      nature: 'studio-theme-nature',
      sunset: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 text-white',
      ocean: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600 text-white',
      midnight: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-purple-100'
    };
    return themeMap[theme] || 'studio-theme-dark';
  };

  const getLayoutClasses = () => {
    const layoutMap: Record<string, string> = {
      compact: 'layout-compact',
      expanded: 'layout-expanded',
      grid: 'layout-grid',
      waveform: 'layout-waveform',
      classic: 'layout-classic',
      minimal: 'layout-minimal'
    };
    return layoutMap[layout] || 'layout-expanded';
  };

  const getAccentColor = () => {
    switch (theme) {
      case 'light': return 'cyan';
      case 'neon': return 'pink';
      case 'cyberpunk': return 'cyan';
      case 'minimal': return 'gray';
      case 'studio': return 'yellow';
      case 'vintage': return 'orange';
      case 'nature': return 'emerald';
      case 'sunset': return 'pink';
      case 'ocean': return 'cyan';
      case 'midnight': return 'purple';
      default: return 'cyan';
    }
  };

  return (
    <TooltipProvider>
      <div className={`min-h-screen ${getThemeClasses()} ${getLayoutClasses()}`}>
        {/* Enhanced Header with Controls */}
        <div className={`border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50 ${theme === 'light' ? 'bg-white/95 border-gray-200' : ''}`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Music className={`w-10 h-10 text-${getAccentColor()}-400`} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Ultimate Music Studio Pro
                  </h1>
                  <p className="text-sm text-gray-400">AI-Powered Professional DAW</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Studio Status */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-300">CPU: {audioEngine.cpuUsage}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-300">RAM: {audioEngine.ramUsage}GB</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-gray-300">{bpm} BPM</span>
                  </div>
                </div>

                {/* Enhanced Theme Toggle with 10 Professional Options */}
                <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">🌙 Dark Pro</SelectItem>
                    <SelectItem value="light">☀️ Light Pro</SelectItem>
                    <SelectItem value="neon">✨ Neon Glow</SelectItem>
                    <SelectItem value="cyberpunk">🤖 Cyberpunk</SelectItem>
                    <SelectItem value="minimal">🎯 Minimal</SelectItem>
                    <SelectItem value="studio">🎵 Studio Blue</SelectItem>
                    <SelectItem value="vintage">📻 Vintage</SelectItem>
                    <SelectItem value="nature">🌿 Nature</SelectItem>
                    <SelectItem value="sunset">🌅 Sunset</SelectItem>
                    <SelectItem value="ocean">🌊 Ocean</SelectItem>
                    <SelectItem value="midnight">🌌 Midnight</SelectItem>
                  </SelectContent>
                </Select>

                {/* Enhanced Layout Toggle with 8 Professional Options */}
                <Select value={layout} onValueChange={(value: any) => setLayout(value)}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">📦 Compact</SelectItem>
                    <SelectItem value="expanded">📺 Expanded</SelectItem>
                    <SelectItem value="minimal">🎯 Minimal</SelectItem>
                    <SelectItem value="grid">🔲 Grid View</SelectItem>
                    <SelectItem value="waveform">📊 Waveform</SelectItem>
                    <SelectItem value="classic">🎼 Classic DAW</SelectItem>
                    <SelectItem value="modern">🚀 Modern</SelectItem>
                    <SelectItem value="theater">🎭 Theater</SelectItem>
                  </SelectContent>
                </Select>

                <Badge variant="outline" className={`border-${getAccentColor()}-400/50 text-${getAccentColor()}-300`}>
                  {studioStatus?.studios?.music?.users || 1247} Online
                </Badge>

                <Badge variant="outline" className={`border-green-400/50 text-green-300 ${isRecording ? 'animate-pulse' : ''}`}>
                  {isPlaying ? '▶️ Playing' : isRecording ? '🔴 Recording' : '⏸️ Ready'}
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="h-8 w-8 p-0"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="transport" className="space-y-6">
            <TabsList className={`grid w-full grid-cols-13 ${theme === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-gray-800 border-gray-700'}`}>
              <TabsTrigger value="transport" className={`data-[state=active]:bg-${getAccentColor()}-600`}>🎵 Transport</TabsTrigger>
              <TabsTrigger value="mixer" className={`data-[state=active]:bg-${getAccentColor()}-600`}>🎛️ Mixer</TabsTrigger>
              <TabsTrigger value="instruments" className={`data-[state=active]:bg-${getAccentColor()}-600`}>🎹 Instruments</TabsTrigger>
              <TabsTrigger value="effects" className={`data-[state=active]:bg-${getAccentColor()}-600`}>✨ Effects</TabsTrigger>
              <TabsTrigger value="arrangement" className={`data-[state=active]:bg-${getAccentColor()}-600`}>📋 Arrangement</TabsTrigger>
              <TabsTrigger value="collaboration" className={`data-[state=active]:bg-${getAccentColor()}-600`}>👥 Collaborate</TabsTrigger>
              <TabsTrigger value="ai" className={`data-[state=active]:bg-${getAccentColor()}-600`}>🤖 AI Assistant</TabsTrigger>
              <TabsTrigger value="eq" className={`data-[state=active]:bg-${getAccentColor()}-600`}>🎚️ EQ</TabsTrigger>
              <TabsTrigger value="effects-rack" className={`data-[state=active]:bg-${getAccentColor()}-600`}>🔧 Effects Rack</TabsTrigger>
              <TabsTrigger value="midi" className={`data-[state=active]:bg-${getAccentColor()}-600`}>🎹 MIDI</TabsTrigger>
              <TabsTrigger value="timeline" className={`data-[state=active]:bg-${getAccentColor()}-600`}>⏱️ Timeline</TabsTrigger>
              <TabsTrigger value="automation" className={`data-[state=active]:bg-${getAccentColor()}-600`}>📈 Automation</TabsTrigger>
              <TabsTrigger value="settings" className={`data-[state=active]:bg-${getAccentColor()}-600`}>⚙️ Settings</TabsTrigger>
            </TabsList>

            {/* Enhanced Transport Controls */}
            <TabsContent value="transport" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Transport */}
                <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center text-${getAccentColor()}-300`}>
                      <Play className="w-5 h-5 mr-2" />
                      Professional Transport Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Time Display */}
                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold text-white mb-2">
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(2).padStart(5, '0')}
                      </div>
                      <div className="flex justify-center space-x-4 text-sm text-gray-400">
                        <span>BPM: {bpm}</span>
                        <span>•</span>
                        <span>4/4</span>
                        <span>•</span>
                        <span>44.1kHz</span>
                      </div>
                    </div>

                    {/* Main Transport Buttons */}
                    <div className="flex items-center justify-center space-x-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-16 h-16 rounded-full border-gray-600 hover:border-cyan-400"
                            onClick={() => setCurrentTime(Math.max(0, currentTime - 5000))}
                          >
                            <SkipBack className="w-6 h-6" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Rewind 5 seconds</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="lg"
                            className={`w-20 h-20 rounded-full transition-all duration-300 ${
                              isPlaying
                                ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 shadow-lg shadow-orange-500/25'
                                : 'bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-400 hover:to-cyan-500 shadow-lg shadow-green-500/25'
                            }`}
                            onClick={isPlaying ? handlePause : handlePlay}
                            disabled={studioActions.music.transport.play.isPending || studioActions.music.transport.pause.isPending}
                          >
                            {studioActions.music.transport.play.isPending ? (
                              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : isPlaying ? (
                              <Pause className="w-8 h-8" />
                            ) : (
                              <Play className="w-8 h-8" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isPlaying ? 'Pause' : 'Play'}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-16 h-16 rounded-full border-gray-600 hover:border-cyan-400"
                            onClick={() => {
                              setIsPlaying(false);
                              setCurrentTime(0);
                            }}
                          >
                            <Square className="w-6 h-6" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Stop</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="lg"
                            className={`w-16 h-16 rounded-full transition-all duration-300 ${
                              isRecording
                                ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse shadow-lg shadow-red-500/25'
                                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-600/25'
                            }`}
                            onClick={handleRecord}
                            disabled={studioActions.music.transport.record.isPending}
                          >
                            {studioActions.music.transport.record.isPending ? (
                              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Circle className="w-6 h-6" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isRecording ? 'Stop Recording' : 'Start Recording'}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-16 h-16 rounded-full border-gray-600 hover:border-cyan-400"
                            onClick={() => setCurrentTime(currentTime + 5000)}
                          >
                            <SkipForward className="w-6 h-6" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Forward 5 seconds</TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Transport Options */}
                    <div className="flex justify-center space-x-4">
                      <Button
                        variant={loopMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLoopMode(!loopMode)}
                        className={loopMode ? 'bg-purple-600 hover:bg-purple-700' : ''}
                      >
                        <Repeat className="w-4 h-4 mr-1" />
                        Loop
                      </Button>
                      <Button
                        variant={metronomeEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMetronomeEnabled(!metronomeEnabled)}
                        className={metronomeEnabled ? 'bg-blue-600 hover:bg-blue-700' : ''}
                      >
                        <Activity className="w-4 h-4 mr-1" />
                        Metronome
                      </Button>
                      <Button
                        variant={quantizeEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQuantizeEnabled(!quantizeEnabled)}
                        className={quantizeEnabled ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        <Target className="w-4 h-4 mr-1" />
                        Quantize
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* BPM & Master Controls */}
                <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                  <CardHeader>
                    <CardTitle className={`text-${getAccentColor()}-300`}>Master Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">BPM</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBpm(Math.max(60, bpm - 1))}
                            className="h-8 w-8 p-0"
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={bpm}
                            onChange={(e) => setBpm(Number(e.target.value))}
                            className="text-center h-8"
                            min="60"
                            max="200"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBpm(Math.min(200, bpm + 1))}
                            className="h-8 w-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium flex items-center justify-between">
                          Master Volume
                          <span className="text-xs text-gray-400">{masterVolume}%</span>
                        </Label>
                        <Slider
                          value={[masterVolume]}
                          onValueChange={(value) => setMasterVolume(value[0])}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                  <CardHeader>
                    <CardTitle className={`text-${getAccentColor()}-300`}>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="h-12 flex-col space-y-1"
                        onClick={handleSaveProject}
                        disabled={studioActions.music.project.saveProject.isPending}
                      >
                        <Save className="w-4 h-4" />
                        <span className="text-xs">Save</span>
                      </Button>
                      <Button variant="outline" className="h-12 flex-col space-y-1">
                        <Download className="w-4 h-4" />
                        <span className="text-xs">Export</span>
                      </Button>
                      <Button variant="outline" className="h-12 flex-col space-y-1">
                        <Upload className="w-4 h-4" />
                        <span className="text-xs">Import</span>
                      </Button>
                      <Button variant="outline" className="h-12 flex-col space-y-1">
                        <CloudUpload className="w-4 h-4" />
                        <span className="text-xs">Cloud</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Professional Mixer Interface */}
            <TabsContent value="mixer" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Master Section */}
                <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                  <CardHeader>
                    <CardTitle className={`text-${getAccentColor()}-300 text-center`}>Master</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-32 mx-auto bg-gray-700 rounded-lg relative overflow-hidden">
                        <div
                          className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-yellow-500 to-red-500 transition-all duration-300"
                          style={{ height: `${masterVolume}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-end justify-center pb-2">
                          <span className="text-xs font-mono text-white">{masterVolume}</span>
                        </div>
                      </div>
                      <Slider
                        value={[masterVolume]}
                        onValueChange={(value) => setMasterVolume(value[0])}
                        max={100}
                        step={1}
                        orientation="vertical"
                        className="h-32 mt-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-center">Master Bus</Label>
                      <div className="flex justify-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Volume1 className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <VolumeX className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Track Channels */}
                {tracks.slice(0, 3).map((track, index) => (
                  <Card key={track.id} className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-${getAccentColor()}-300 text-sm text-center truncate`} style={{ color: track.color }}>
                        {track.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Volume Fader */}
                      <div className="text-center">
                        <div className="w-12 h-24 mx-auto bg-gray-700 rounded relative overflow-hidden">
                          <div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-yellow-500 transition-all duration-300"
                            style={{ height: `${track.volume}%` }}
                          ></div>
                          <div className="absolute inset-0 flex items-end justify-center pb-1">
                            <span className="text-xs font-mono text-white">{track.volume}</span>
                          </div>
                        </div>
                        <Slider
                          value={[track.volume]}
                          onValueChange={(value) => {
                            const newTracks = [...tracks];
                            newTracks[index].volume = value[0];
                            setTracks(newTracks);
                          }}
                          max={100}
                          step={1}
                          orientation="vertical"
                          className="h-24 mt-1"
                        />
                      </div>

                      {/* Pan Control */}
                      <div className="space-y-1">
                        <Label className="text-xs text-center">Pan</Label>
                        <Slider
                          value={[track.pan]}
                          onValueChange={(value) => {
                            const newTracks = [...tracks];
                            newTracks[index].pan = value[0];
                            setTracks(newTracks);
                          }}
                          min={-50}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-center text-gray-400">{track.pan > 0 ? `R${track.pan}` : track.pan < 0 ? `L${Math.abs(track.pan)}` : 'C'}</div>
                      </div>

                      {/* Channel Controls */}
                      <div className="flex justify-center space-x-1">
                        <Button
                          variant={track.muted ? "destructive" : "ghost"}
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            const newTracks = [...tracks];
                            newTracks[index].muted = !newTracks[index].muted;
                            setTracks(newTracks);
                          }}
                        >
                          <VolumeX className="w-3 h-3" />
                        </Button>
                        <Button
                          variant={track.solo ? "default" : "ghost"}
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            const newTracks = [...tracks];
                            newTracks[index].solo = !newTracks[index].solo;
                            setTracks(newTracks);
                          }}
                        >
                          <Headphones className="w-3 h-3" />
                        </Button>
                        <Button
                          variant={track.armed ? "destructive" : "ghost"}
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            const newTracks = [...tracks];
                            newTracks[index].armed = !newTracks[index].armed;
                            setTracks(newTracks);
                          }}
                        >
                          <Circle className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Mini Waveform */}
                      <div className="h-8 bg-gray-800 rounded flex items-end justify-center space-x-px">
                        {track.waveform.map((height, i) => (
                          <div
                            key={i}
                            className="bg-cyan-400 w-1 rounded-sm"
                            style={{ height: `${height * 100}%` }}
                          ></div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Mixer Toolbar */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="border-green-400/50 text-green-300">
                        {tracks.filter(t => !t.muted).length}/{tracks.length} Active
                      </Badge>
                      <Badge variant="outline" className="border-blue-400/50 text-blue-300">
                        {tracks.filter(t => t.solo).length} Solo
                      </Badge>
                      <Badge variant="outline" className="border-red-400/50 text-red-300">
                        {tracks.filter(t => t.armed).length} Armed
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Sliders className="w-4 h-4 mr-1" />
                        EQ
                      </Button>
                      <Button variant="outline" size="sm">
                        <Waves className="w-4 h-4 mr-1" />
                        Effects
                      </Button>
                      <Button variant="outline" size="sm">
                        <Zap className="w-4 h-4 mr-1" />
                        Automation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>          {/* Instruments Tab */}
          <TabsContent value="instruments" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 border-cyan-400/30">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-300">
                  <Piano className="w-5 h-5 mr-2" />
                  Professional Instruments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { type: 'piano', name: 'Grand Piano', preset: 'steinway_d', icon: Piano },
                    { type: 'synth', name: 'Lead Synth', preset: 'analog_lead', icon: Waves },
                    { type: 'drums', name: 'Drum Kit', preset: 'acoustic_kit', icon: Drum },
                    { type: 'bass', name: 'Bass Guitar', preset: 'electric_bass', icon: Music }
                  ].map(({ type, name, preset, icon: Icon }) => (
                    <Button
                      key={type}
                      variant={selectedInstrument === type ? "default" : "outline"}
                      className={`h-20 flex-col space-y-2 ${
                        selectedInstrument === type 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                          : 'border-gray-600 hover:border-cyan-400'
                      }`}
                      onClick={() => handleInstrumentLoad(type, preset)}
                      disabled={studioActions.music.instruments.loadInstrument.isPending}
                    >
                      {studioActions.music.instruments.loadInstrument.isPending ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                      <span className="text-sm">{name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Composition Assistant */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardHeader>
                  <CardTitle className={`flex items-center text-${getAccentColor()}-300`}>
                    <Wand2 className="w-5 h-5 mr-2" />
                    AI Composition Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                      onClick={() => {/* AI composition logic */}}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Melody
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-purple-400/50 hover:bg-purple-400/10"
                      onClick={() => {/* AI harmony logic */}}
                    >
                      <Music className="w-4 h-4 mr-2" />
                      Add Harmony
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-blue-400/50 hover:bg-blue-400/10"
                      onClick={() => {/* AI rhythm logic */}}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Generate Rhythm
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-green-400/50 hover:bg-green-400/10"
                      onClick={() => {/* AI arrangement logic */}}
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      Arrange Song
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis & Suggestions */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardHeader>
                  <CardTitle className={`flex items-center text-${getAccentColor()}-300`}>
                    <Target className="w-5 h-5 mr-2" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Genre Detection</span>
                        <Badge variant="outline" className="border-cyan-400/50 text-cyan-300">Electronic</Badge>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Mix Quality</span>
                        <Badge variant="outline" className="border-green-400/50 text-green-300">Good</Badge>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Creative Potential</span>
                        <Badge variant="outline" className="border-purple-400/50 text-purple-300">High</Badge>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Suggestions */}
            <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
              <CardHeader>
                <CardTitle className={`text-${getAccentColor()}-300`}>AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-300">Add Reverb to Vocals</h4>
                        <p className="text-sm text-gray-400">Your vocal track would benefit from a hall reverb to create more space and depth.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-300">Try a Bridge Section</h4>
                        <p className="text-sm text-gray-400">Consider adding a bridge at 1:45 to break the verse-chorus pattern and add interest.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-300">Compress the Drums</h4>
                        <p className="text-sm text-gray-400">Apply compression to even out the drum dynamics and make them punchier.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced EQ Tab */}
          <TabsContent value="eq" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* EQ Controls */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardHeader>
                  <CardTitle className={`flex items-center text-${getAccentColor()}-300`}>
                    <Sliders className="w-5 h-5 mr-2" />
                    Parametric EQ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {advancedEQ.bands.map((band, index) => (
                      <div key={band.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">{band.type.toUpperCase()}</Label>
                          <Badge variant="outline" className="text-xs">{band.freq}Hz</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">Gain</Label>
                            <Slider
                              value={[band.gain]}
                              onValueChange={(value) => {
                                const newBands = [...advancedEQ.bands];
                                newBands[index].gain = value[0];
                                setAdvancedEQ({...advancedEQ, bands: newBands});
                              }}
                              min={-12}
                              max={12}
                              step={0.1}
                              className="mt-1"
                            />
                            <div className="text-xs text-center mt-1">{band.gain}dB</div>
                          </div>
                          <div>
                            <Label className="text-xs">Q</Label>
                            <Slider
                              value={[band.q]}
                              onValueChange={(value) => {
                                const newBands = [...advancedEQ.bands];
                                newBands[index].q = value[0];
                                setAdvancedEQ({...advancedEQ, bands: newBands});
                              }}
                              min={0.1}
                              max={5}
                              step={0.1}
                              className="mt-1"
                            />
                            <div className="text-xs text-center mt-1">{band.q.toFixed(1)}</div>
                          </div>
                          <div>
                            <Label className="text-xs">Freq</Label>
                            <Slider
                              value={[band.freq]}
                              onValueChange={(value) => {
                                const newBands = [...advancedEQ.bands];
                                newBands[index].freq = value[0];
                                setAdvancedEQ({...advancedEQ, bands: newBands});
                              }}
                              min={band.id === 'low' ? 20 : band.id === 'high' ? 2000 : 100}
                              max={band.id === 'low' ? 500 : band.id === 'high' ? 20000 : 8000}
                              step={10}
                              className="mt-1"
                            />
                            <div className="text-xs text-center mt-1">{band.freq}Hz</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* EQ Visualization */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardHeader>
                  <CardTitle className={`text-${getAccentColor()}-300`}>Frequency Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-900 rounded-lg flex items-end justify-center space-x-1 p-4">
                    {Array.from({length: 32}, (_, i) => {
                      const freq = Math.pow(2, i/4) * 20; // Logarithmic frequency scale
                      let gain = 0;
                      
                      // Calculate EQ response
                      advancedEQ.bands.forEach(band => {
                        const diff = Math.abs(Math.log2(freq / band.freq));
                        const q = band.q;
                        const response = band.gain * Math.exp(-diff * diff / (2 * q * q));
                        gain += response;
                      });
                      
                      const height = Math.max(0, Math.min(100, 50 + gain * 2));
                      
                      return (
                        <div
                          key={i}
                          className="bg-gradient-to-t from-cyan-500 to-purple-500 rounded-sm w-2"
                          style={{ height: `${height}%` }}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>20Hz</span>
                    <span>1kHz</span>
                    <span>20kHz</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Effects Rack Tab */}
          <TabsContent value="effects-rack" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Effects Chain */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardHeader>
                  <CardTitle className={`text-${getAccentColor()}-300`}>Effects Chain</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {effectsRack.effects.map((effect, index) => (
                    <div key={effect.id} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                      <Button
                        variant={effect.enabled ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => {
                          const newEffects = [...effectsRack.effects];
                          newEffects[index].enabled = !newEffects[index].enabled;
                          setEffectsRack({...effectsRack, effects: newEffects});
                        }}
                      >
                        {effect.enabled ? <Zap className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      </Button>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{effect.name}</div>
                        <div className="text-xs text-gray-400">
                          {effect.id === 'reverb' && `Wet: ${(effect.wet * 100).toFixed(0)}%`}
                          {effect.id === 'delay' && `Time: ${(effect.time * 1000).toFixed(0)}ms`}
                          {effect.id === 'chorus' && `Rate: ${(effect.rate * 100).toFixed(0)}Hz`}
                          {effect.id === 'compressor' && `Ratio: ${effect.ratio}:1`}
                          {effect.id === 'eq' && `${effect.bands.length} bands`}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Effect Parameters */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardHeader>
                  <CardTitle className={`text-${getAccentColor()}-300`}>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {effectsRack.effects.find(e => e.enabled)?.id === 'reverb' && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Wet Mix</Label>
                        <Slider
                          value={[effectsRack.effects.find(e => e.id === 'reverb')?.wet || 0]}
                          onValueChange={(value) => {
                            const newEffects = [...effectsRack.effects];
                            const effect = newEffects.find(e => e.id === 'reverb');
                            if (effect) effect.wet = value[0];
                            setEffectsRack({...effectsRack, effects: newEffects});
                          }}
                          max={1}
                          step={0.01}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Decay</Label>
                        <Slider
                          value={[effectsRack.effects.find(e => e.id === 'reverb')?.decay || 0]}
                          onValueChange={(value) => {
                            const newEffects = [...effectsRack.effects];
                            const effect = newEffects.find(e => e.id === 'reverb');
                            if (effect) effect.decay = value[0];
                            setEffectsRack({...effectsRack, effects: newEffects});
                          }}
                          max={5}
                          step={0.1}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                  {effectsRack.effects.find(e => e.enabled)?.id === 'delay' && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Time</Label>
                        <Slider
                          value={[effectsRack.effects.find(e => e.id === 'delay')?.time || 0]}
                          onValueChange={(value) => {
                            const newEffects = [...effectsRack.effects];
                            const effect = newEffects.find(e => e.id === 'delay');
                            if (effect) effect.time = value[0];
                            setEffectsRack({...effectsRack, effects: newEffects});
                          }}
                          max={2}
                          step={0.01}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Feedback</Label>
                        <Slider
                          value={[effectsRack.effects.find(e => e.id === 'delay')?.feedback || 0]}
                          onValueChange={(value) => {
                            const newEffects = [...effectsRack.effects];
                            const effect = newEffects.find(e => e.id === 'delay');
                            if (effect) effect.feedback = value[0];
                            setEffectsRack({...effectsRack, effects: newEffects});
                          }}
                          max={0.9}
                          step={0.01}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Presets */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardHeader>
                  <CardTitle className={`text-${getAccentColor()}-300`}>Presets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Save className="w-4 h-4 mr-2" />
                    Save Current
                  </Button>
                  <div className="space-y-2">
                    {['Vocal Hall', 'Drum Room', 'Guitar Delay', 'Master Bus'].map((preset) => (
                      <Button key={preset} variant="ghost" className="w-full justify-start text-sm">
                        {preset}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MIDI Integration Tab */}
          <TabsContent value="midi" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MIDI Devices */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardHeader>
                  <CardTitle className={`flex items-center text-${getAccentColor()}-300`}>
                    <Keyboard className="w-5 h-5 mr-2" />
                    MIDI Devices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {midiIntegration.devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${device.connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <div>
                          <div className="font-medium text-sm">{device.name}</div>
                          <div className="text-xs text-gray-400 capitalize">{device.type}</div>
                        </div>
                      </div>
                      <Button
                        variant={device.connected ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newDevices = [...midiIntegration.devices];
                          const deviceIndex = newDevices.findIndex(d => d.id === device.id);
                          newDevices[deviceIndex].connected = !newDevices[deviceIndex].connected;
                          setMidiIntegration({...midiIntegration, devices: newDevices});
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

              {/* MIDI Settings */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardHeader>
                  <CardTitle className={`text-${getAccentColor()}-300`}>MIDI Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm">Keyboard Octave</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMidiIntegration({...midiIntegration, keyboardOctave: Math.max(0, midiIntegration.keyboardOctave - 1)})}
                      >
                        -
                      </Button>
                      <span className="text-lg font-mono w-12 text-center">{midiIntegration.keyboardOctave}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMidiIntegration({...midiIntegration, keyboardOctave: Math.min(8, midiIntegration.keyboardOctave + 1)})}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm">Velocity Curve</Label>
                    <Select
                      value={midiIntegration.velocityCurve}
                      onValueChange={(value) => setMidiIntegration({...midiIntegration, velocityCurve: value})}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="log">Logarithmic</SelectItem>
                        <SelectItem value="exp">Exponential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">MIDI Learn</Label>
                    <Button
                      variant={midiIntegration.midiLearn ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setMidiIntegration({...midiIntegration, midiLearn: !midiIntegration.midiLearn})}
                    >
                      {midiIntegration.midiLearn ? 'Listening...' : 'Start MIDI Learn'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* MIDI Keyboard */}
            <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
              <CardHeader>
                <CardTitle className={`text-${getAccentColor()}-300`}>Virtual Keyboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-1 overflow-x-auto pb-4">
                  {Array.from({length: 24}, (_, i) => {
                    const note = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][i % 12];
                    const octave = Math.floor(i / 12) + midiIntegration.keyboardOctave;
                    const isBlackKey = ['C#', 'D#', 'F#', 'G#', 'A#'].includes(note);
                    
                    return (
                      <Button
                        key={i}
                        variant="outline"
                        className={`min-w-8 h-20 ${
                          isBlackKey 
                            ? 'bg-gray-900 border-gray-600 text-white relative z-10 -mx-2' 
                            : 'bg-white border-gray-300 text-black'
                        }`}
                        onMouseDown={() => {/* Play note */}}
                        onMouseUp={() => {/* Stop note */}}
                      >
                        <div className="text-xs">
                          {note}{octave}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline/Arrangement Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
              <CardHeader>
                <CardTitle className={`flex items-center text-${getAccentColor()}-300`}>
                  <Clock className="w-5 h-5 mr-2" />
                  Timeline & Arrangement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Timeline Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm">
                        <ZoomIn className="w-4 h-4 mr-1" />
                        Zoom In
                      </Button>
                      <Button variant="outline" size="sm">
                        <ZoomOut className="w-4 h-4 mr-1" />
                        Zoom Out
                      </Button>
                      <Button variant="outline" size="sm">
                        <Move className="w-4 h-4 mr-1" />
                        Fit to Window
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Zoom: {arrangementView.zoom}x</Badge>
                      <Badge variant="outline">Grid: {arrangementView.gridSize}px</Badge>
                    </div>
                  </div>

                  {/* Timeline Grid */}
                  <div className="h-96 bg-gray-900 rounded-lg overflow-hidden relative">
                    {/* Time Ruler */}
                    <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center">
                      {Array.from({length: 32}, (_, i) => (
                        <div key={i} className="flex-1 text-center text-xs text-gray-400 border-r border-gray-700">
                          {i % 4 === 0 ? `${Math.floor(i/4)}:00` : ''}
                        </div>
                      ))}
                    </div>

                    {/* Track Lanes */}
                    {tracks.slice(0, 4).map((track, trackIndex) => (
                      <div key={track.id} className="h-16 border-b border-gray-700 relative">
                        {/* Track Header */}
                        <div className="absolute left-0 top-0 w-32 h-full bg-gray-800 border-r border-gray-700 flex items-center px-2">
                          <div className={`w-3 h-3 rounded mr-2`} style={{ backgroundColor: track.color }}></div>
                          <span className="text-xs font-medium truncate">{track.name}</span>
                        </div>

                        {/* Track Content */}
                        <div className="ml-32 h-full relative">
                          {/* Grid Lines */}
                          {Array.from({length: 32}, (_, i) => (
                            <div key={i} className="absolute top-0 bottom-0 border-r border-gray-700/50" 
                                 style={{ left: `${(i / 32) * 100}%` }}>
                            </div>
                          ))}

                          {/* Sample Clip */}
                          <div 
                            className="absolute top-2 bottom-2 rounded cursor-move"
                            style={{ 
                              left: `${(trackIndex * 2 + 1) * 3}%`, 
                              width: `${Math.random() * 20 + 10}%`,
                              backgroundColor: track.color,
                              opacity: 0.8
                            }}
                          >
                            <div className="h-full flex items-center justify-center">
                              <div className="w-full h-1 bg-white/30 rounded mx-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Playhead */}
                    <div 
                      className="absolute top-8 bottom-0 w-0.5 bg-red-500 z-10"
                      style={{ left: `${(currentTime / 240000) * 100}%` }}
                    >
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Automation Lanes */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardHeader>
                  <CardTitle className={`text-${getAccentColor()}-300`}>Automation Lanes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tracks.slice(0, 3).map((track) => (
                    <div key={track.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{track.name}</span>
                        <Select defaultValue="volume">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="volume">Volume</SelectItem>
                            <SelectItem value="pan">Pan</SelectItem>
                            <SelectItem value="send1">Send 1</SelectItem>
                            <SelectItem value="send2">Send 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="h-16 bg-gray-800 rounded relative">
                        {/* Automation Curve */}
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path
                            d="M0,50 Q25,30 50,70 T100,20"
                            stroke={track.color}
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>
                        {/* Automation Points */}
                        <div className="absolute w-3 h-3 bg-white rounded-full border-2 border-gray-600" style={{ left: '20%', top: '30%' }}></div>
                        <div className="absolute w-3 h-3 bg-white rounded-full border-2 border-gray-600" style={{ left: '50%', top: '70%' }}></div>
                        <div className="absolute w-3 h-3 bg-white rounded-full border-2 border-gray-600" style={{ left: '80%', top: '20%' }}></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Automation Tools */}
              <Card className={`bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 to-white border-gray-200' : 'from-gray-800/90 to-gray-700/90'} border-${getAccentColor()}-400/30`}>
                <CardHeader>
                  <CardTitle className={`text-${getAccentColor()}-300`}>Automation Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm">
                      <MousePointer className="w-4 h-4 mr-1" />
                      Select
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Draw
                    </Button>
                    <Button variant="outline" size="sm">
                      <LineChart className="w-4 h-4 mr-1" />
                      Line
                    </Button>
                    <Button variant="outline" size="sm">
                      <Spline className="w-4 h-4 mr-1" />
                      Curve
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Automation Mode</Label>
                      <Select defaultValue="read">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="touch">Touch</SelectItem>
                          <SelectItem value="latch">Latch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Curve Type</Label>
                      <Select defaultValue="linear">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linear">Linear</SelectItem>
                          <SelectItem value="smooth">Smooth</SelectItem>
                          <SelectItem value="step">Step</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Additional tabs would go here */}
        </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}