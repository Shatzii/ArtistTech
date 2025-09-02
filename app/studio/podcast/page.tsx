'use client';

import { useState, useRef, useEffect, useMemo, useCallback, memo, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Mic, MicOff, Play, Pause, Square, SkipBack, SkipForward,
  Volume2, VolumeX, Settings, Users, Headphones, Radio,
  Upload, Download, Share2, Eye, MessageCircle, Heart,
  Zap, TrendingUp, DollarSign, Clock, Cpu, Wifi,
  Video, VideoOff, Camera, Monitor, Globe, Youtube,
  Instagram, Twitter, Facebook, Twitch, Music,
  Edit3, Layers, Filter, Sparkles, BarChart3,
  Brain, Rocket, Target, Calendar, Bot, Hash,
  Send, RefreshCw, CheckCircle, AlertCircle, Plus,
  Minus, Search, Grid, Layout, ZoomIn, ZoomOut,
  Hand, Crop, FlipHorizontal, FlipVertical, RotateCcw,
  Undo, Redo, Save, Copy, Trash2, Link, ExternalLink,
  ThumbsUp, Bookmark, Bell, User, Shield, Palette,
  Speaker, Activity, FileAudio, BarChart3 as Waveform, Podcast,
  Radio as RadioIcon, Headphones as HeadphonesIcon,
  Mic2, Circle as Record, StopCircle, PlayCircle, PauseCircle,
  SkipForward as SkipNext, SkipBack as SkipPrev,
  Volume1, VolumeX as Mute, Settings2, Users2,
  UserCheck, UserX, Crown, Star, Award, Trophy,
  Flame, TrendingUp as Trending, DollarSign as Money,
  Clock as Time, Cpu as Processor, Wifi as Wireless,
  Video as VideoIcon, Camera as Cam, Monitor as Screen,
  Globe as World, Youtube as YT, Instagram as IG,
  Twitter as TW, Facebook as FB, Twitch as TWITCH,
  Music as Song, Edit3 as Edit, Layers as Stack,
  Filter as Funnel, Sparkles as Magic, BarChart3 as Chart
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  isPlaying: boolean;
}

interface StreamingState {
  isLive: boolean;
  viewers: number;
  platform: string;
  bitrate: number;
  quality: string;
}

interface AIFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  processing: boolean;
}

export default function PodcastStudio() {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    isPlaying: false
  });

  const [streamingState, setStreamingState] = useState<StreamingState>({
    isLive: false,
    viewers: 1247,
    platform: 'YouTube',
    bitrate: 128,
    quality: 'HD'
  });

  const [micLevel, setMicLevel] = useState(75);
  const [outputLevel, setOutputLevel] = useState(85);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [selectedTab, setSelectedTab] = useState("recording");

  const [aiFeatures] = useState<AIFeature[]>([
    {
      id: 'transcription',
      name: 'Real-time Transcription',
      description: 'AI-powered speech-to-text with speaker identification',
      enabled: true,
      processing: true
    },
    {
      id: 'enhancement',
      name: 'Audio Enhancement',
      description: 'Noise reduction, EQ optimization, and dynamic range',
      enabled: true,
      processing: false
    },
    {
      id: 'highlights',
      name: 'Auto Highlights',
      description: 'AI detects best moments for social media clips',
      enabled: true,
      processing: false
    },
    {
      id: 'chapters',
      name: 'Chapter Generation',
      description: 'Automatic topic detection and chapter creation',
      enabled: false,
      processing: false
    }
  ]);

  const platforms = [
    { name: 'YouTube', icon: Youtube, color: 'text-red-500', connected: true },
    { name: 'Spotify', icon: Music, color: 'text-green-500', connected: true },
    { name: 'Twitch', icon: Twitch, color: 'text-purple-500', connected: false },
    { name: 'Instagram', icon: Instagram, color: 'text-pink-500', connected: true },
    { name: 'Twitter', icon: Twitter, color: 'text-blue-500', connected: false }
  ];

  // Enhanced state management
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [autoSave, setAutoSave] = useState(true);
  const [realTimePreview, setRealTimePreview] = useState(true);
  const [aiEnhancement, setAiEnhancement] = useState(true);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [episodeTitle, setEpisodeTitle] = useState("Episode #1 - Getting Started");
  const [episodeDescription, setEpisodeDescription] = useState("");
  const [showNotes, setShowNotes] = useState("");
  const [tags, setTags] = useState(["podcast", "interview", "tech"]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Enhanced API queries and mutations
  const { data: podcastProjects } = useQuery({
    queryKey: ["/api/studio/podcast/projects"],
    enabled: true
  });

  const { data: episodesData } = useQuery({
    queryKey: ["/api/studio/podcast/episodes"],
    enabled: true
  });

  const { data: aiSuggestions } = useQuery({
    queryKey: ["/api/studio/podcast/ai-suggestions"],
    enabled: aiEnhancement
  });

  const { data: collaborationData } = useQuery({
    queryKey: ["/api/studio/podcast/collaboration"],
    enabled: collaborationMode
  });

  const queryClient = useQueryClient();

  const saveEpisodeMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/studio/podcast/save", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/studio/podcast/projects"] });
    }
  });

  const processAudioMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/studio/podcast/process", "POST", data),
    onSuccess: () => {
      setIsProcessing(false);
      setProcessingProgress(100);
      queryClient.invalidateQueries({ queryKey: ["/api/studio/podcast/episodes"] });
    },
    onError: () => {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  });

  const publishEpisodeMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/studio/podcast/publish", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/studio/podcast/episodes"] });
    }
  });

  // Simulate recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingState.isRecording && !recordingState.isPaused) {
      interval = setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recordingState.isRecording, recordingState.isPaused]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleStartRecording = useCallback(() => {
    setRecordingState(prev => ({ ...prev, isRecording: true, isPaused: false }));
  }, []);

  const handlePauseRecording = useCallback(() => {
    setRecordingState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const handleStopRecording = useCallback(() => {
    setRecordingState({ isRecording: false, isPaused: false, duration: 0, isPlaying: false });
  }, []);

  const handleGoLive = useCallback(() => {
    setStreamingState(prev => ({ ...prev, isLive: !prev.isLive }));
  }, []);

  const handleSaveEpisode = useCallback(async () => {
    try {
      await saveEpisodeMutation.mutateAsync({
        title: episodeTitle,
        description: episodeDescription,
        showNotes: showNotes,
        tags: tags,
        duration: recordingState.duration
      });
    } catch (error) {
      console.error("Error saving episode:", error);
    }
  }, [episodeTitle, episodeDescription, showNotes, tags, recordingState.duration, saveEpisodeMutation]);

  const handleProcessAudio = useCallback(async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    try {
      await processAudioMutation.mutateAsync({
        episodeId: episodeTitle,
        features: aiFeatures.filter(f => f.enabled).map(f => f.id)
      });
    } catch (error) {
      console.error("Error processing audio:", error);
    }
  }, [episodeTitle, aiFeatures, processAudioMutation]);

  const handlePublishEpisode = useCallback(async () => {
    try {
      await publishEpisodeMutation.mutateAsync({
        episodeId: episodeTitle,
        platforms: platforms.filter((p: any) => p.connected).map((p: any) => p.name)
      });
    } catch (error) {
      console.error("Error publishing episode:", error);
    }
  }, [episodeTitle, platforms, publishEpisodeMutation]);

  const handleThemeChange = useCallback((theme: string) => {
    setSelectedTheme(theme);
  }, []);

  const handleCollaborationToggle = useCallback(() => {
    setCollaborationMode(!collaborationMode);
  }, [collaborationMode]);

  // Memoized expensive computations
  const connectedPlatforms = useMemo(() => {
    return platforms.filter(p => p.connected);
  }, [platforms]);

  const enabledAIFeatures = useMemo(() => {
    return aiFeatures.filter(f => f.enabled);
  }, [aiFeatures]);

  const recordingStats = useMemo(() => {
    return {
      formattedDuration: formatTime(recordingState.duration),
      isActive: recordingState.isRecording && !recordingState.isPaused,
      progress: (recordingState.duration / 3600) * 100 // Assuming 1 hour max
    };
  }, [recordingState, formatTime]);

  const streamingStats = useMemo(() => {
    return {
      isActive: streamingState.isLive,
      quality: streamingState.quality,
      formattedBitrate: `${streamingState.bitrate}kbps`,
      viewerCount: streamingState.viewers.toLocaleString()
    };
  }, [streamingState]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-purple-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Podcast Studio Pro</h1>
            <p className="text-sm text-gray-400">Professional podcast production & streaming</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={streamingState.isLive ? "destructive" : "secondary"} className="animate-pulse">
            <div className="w-2 h-2 bg-current rounded-full mr-2" />
            {streamingState.isLive ? 'LIVE' : 'OFFLINE'}
          </Badge>
          {streamingState.isLive && (
            <div className="flex items-center space-x-2 text-white">
              <Eye className="w-4 h-4" />
              <span className="font-bold">{streamingState.viewers.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full bg-black/30">
              <TabsTrigger value="recording">Recording</TabsTrigger>
              <TabsTrigger value="streaming">Live Stream</TabsTrigger>
              <TabsTrigger value="editing">Edit & Post</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
            </TabsList>

            {/* Recording Tab */}
            <TabsContent value="recording" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recording Controls */}
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Mic className="w-5 h-5 mr-2" />
                      Recording Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">
                        {formatTime(recordingState.duration)}
                      </div>
                      <div className="flex justify-center space-x-2 mb-4">
                        {!recordingState.isRecording ? (
                          <Button 
                            onClick={handleStartRecording}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            <Mic className="w-4 h-4 mr-2" />
                            Start Recording
                          </Button>
                        ) : (
                          <>
                            <Button 
                              onClick={handlePauseRecording}
                              variant="outline"
                              className="border-yellow-500 text-yellow-500"
                            >
                              {recordingState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            </Button>
                            <Button 
                              onClick={handleStopRecording}
                              variant="outline"
                              className="border-red-500 text-red-500"
                            >
                              <Square className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Audio Levels */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-300">Microphone Level</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMicMuted(!micMuted)}
                          className={micMuted ? "text-red-500" : "text-green-500"}
                        >
                          {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Slider
                        value={[micLevel]}
                        onValueChange={(value) => setMicLevel(value[0])}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <Progress value={micLevel} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm text-gray-300">Output Level</label>
                      <Slider
                        value={[outputLevel]}
                        onValueChange={(value) => setOutputLevel(value[0])}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <Progress value={outputLevel} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Video Controls */}
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Video Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-black/60 rounded-lg flex items-center justify-center">
                      {cameraEnabled ? (
                        <div className="text-center">
                          <Video className="w-12 h-12 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-300">Camera Preview</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <VideoOff className="w-12 h-12 text-red-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-300">Camera Disabled</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Enable Camera</label>
                      <Switch 
                        checked={cameraEnabled}
                        onCheckedChange={setCameraEnabled}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="text-white border-purple-500">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button variant="outline" size="sm" className="text-white border-purple-500">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Streaming Tab */}
            <TabsContent value="streaming" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Stream Controls */}
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Live Stream
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <Button 
                        onClick={handleGoLive}
                        className={streamingState.isLive ? 
                          "bg-red-500 hover:bg-red-600 text-white" : 
                          "bg-green-500 hover:bg-green-600 text-white"
                        }
                        size="lg"
                      >
                        {streamingState.isLive ? (
                          <>
                            <Square className="w-4 h-4 mr-2" />
                            End Stream
                          </>
                        ) : (
                          <>
                            <Radio className="w-4 h-4 mr-2" />
                            Go Live
                          </>
                        )}
                      </Button>
                    </div>

                    {streamingState.isLive && (
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-white">{streamingState.viewers}</div>
                          <div className="text-sm text-gray-400">Viewers</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{streamingState.bitrate}k</div>
                          <div className="text-sm text-gray-400">Bitrate</div>
                        </div>
                      </div>
                    )}

                    <div className="h-px bg-purple-500/20" />

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Stream Title</label>
                      <Input 
                        placeholder="Enter your podcast episode title..."
                        className="bg-black/60 border-purple-500/30 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Description</label>
                      <Textarea 
                        placeholder="Describe your episode..."
                        className="bg-black/60 border-purple-500/30 text-white"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Integration */}
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Share2 className="w-5 h-5 mr-2" />
                      Multi-Platform Streaming
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {platforms.map((platform) => {
                      const IconComponent = platform.icon;
                      return (
                        <div key={platform.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`w-5 h-5 ${platform.color}`} />
                            <span className="text-white">{platform.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={platform.connected ? "default" : "secondary"}>
                              {platform.connected ? "Connected" : "Disconnected"}
                            </Badge>
                            <Switch checked={platform.connected} />
                          </div>
                        </div>
                      );
                    })}
                    
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-4">
                      <Zap className="w-4 h-4 mr-2" />
                      Stream to All Platforms
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Editing Tab */}
            <TabsContent value="editing" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Edit3 className="w-5 h-5 mr-2" />
                      Post-Production
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Recording
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="text-white border-purple-500">
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI Enhance
                        </Button>
                        <Button variant="outline" size="sm" className="text-white border-purple-500">
                          <Layers className="w-4 h-4 mr-2" />
                          Multi-track
                        </Button>
                      </div>
                      
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export Episode
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      AI-Powered Clips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      AI automatically creates social media clips from your best moments
                    </p>
                    
                    <div className="space-y-2">
                      {['Best Quote (0:45)', 'Funny Moment (1:23)', 'Key Insight (2:17)'].map((clip, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-black/60 rounded">
                          <span className="text-white text-sm">{clip}</span>
                          <Button size="sm" variant="outline" className="text-purple-400 border-purple-500">
                            Export
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-black/40 border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Total Downloads</p>
                        <p className="text-2xl font-bold text-white">47.2K</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Clock className="w-8 h-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Avg. Listen Time</p>
                        <p className="text-2xl font-bold text-white">32m 15s</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="w-8 h-8 text-yellow-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Revenue</p>
                        <p className="text-2xl font-bold text-white">$1,247</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-black/40 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-black/60 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Analytics Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Tools Tab */}
            <TabsContent value="ai-tools" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiFeatures.map((feature) => (
                  <Card key={feature.id} className="bg-black/40 border-purple-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center">
                          <Cpu className="w-5 h-5 mr-2" />
                          {feature.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          {feature.processing && (
                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                          )}
                          <Switch checked={feature.enabled} />
                        </div>
                      </div>
                      <CardDescription className="text-gray-400">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Panel */}
        <div className="w-80 p-6 bg-black/60 border-l border-purple-500/20 space-y-6">
          {/* Live Chat */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {streamingState.isLive ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-purple-400 font-semibold">User{i + 1}: </span>
                      <span className="text-gray-300">Great episode!</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">
                  Start streaming to see live chat
                </p>
              )}
            </CardContent>
          </Card>

          {/* Episodes */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Headphones className="w-5 h-5 mr-2" />
                Recent Episodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Episode {i + 47}</p>
                    <p className="text-gray-400 text-xs">2 days ago</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-purple-400">
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Wifi className="w-5 h-5 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">CPU Usage</span>
                <span className="text-green-400 text-sm">34%</span>
              </div>
              <Progress value={34} className="h-2" />
              
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Memory</span>
                <span className="text-yellow-400 text-sm">67%</span>
              </div>
              <Progress value={67} className="h-2" />
              
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Network</span>
                <span className="text-green-400 text-sm">Excellent</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}