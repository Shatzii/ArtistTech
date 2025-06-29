import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';
import { 
  Mic, Headphones, Volume2, Play, Pause, Square, Circle, Settings,
  BarChart3, Users, Upload, Download, Share2, Edit3,
  Filter, Sliders, Music, Camera, Video, Eye, Clock, Calendar,
  TrendingUp, Star, Crown, Globe, Instagram, Twitter, Youtube,
  Zap, Brain, Target, Award, Bell, MessageCircle, Heart, Rss,
  FileText, Scissors, RadioIcon, Sparkles, Wand2, RefreshCw
} from 'lucide-react';

export default function PodcastStudio() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // PROFESSIONAL PODCAST STATE
  const [podcastSession, setPodcastSession] = useState({
    isRecording: false,
    isLive: false,
    currentTime: 0,
    totalTime: 3600, // 1 hour
    currentEpisodeId: null as string | null,
    participants: [
      { id: '1', name: 'Host (You)', role: 'Host', muted: false, volume: 85, color: '#3b82f6' },
      { id: '2', name: 'Sarah Mitchell', role: 'Guest', muted: false, volume: 78, color: '#10b981' },
      { id: '3', name: 'Dr. James Wong', role: 'Expert', muted: true, volume: 82, color: '#f59e0b' }
    ],
    listeners: 1247,
    chatActive: true
  });

  // NEW: Episode Management State
  const [newEpisode, setNewEpisode] = useState({
    title: '',
    description: '',
    guests: [],
    liveStream: false
  });

  // NEW: AI Processing State
  const [aiFeatures, setAiFeatures] = useState({
    transcript: '',
    showNotes: '',
    socialClips: [],
    isGeneratingTranscript: false,
    isGeneratingShowNotes: false,
    isGeneratingSocialClips: false
  });

  // Backend Integration Mutations
  const startRecordingMutation = useMutation({
    mutationFn: async (episodeData: any) => {
      const response = await fetch('/api/podcast/start-recording', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(episodeData)
      });
      if (!response.ok) throw new Error('Failed to start recording');
      return response.json();
    },
    onSuccess: (data) => {
      setPodcastSession(prev => ({ 
        ...prev, 
        isRecording: true, 
        currentEpisodeId: data.episodeId 
      }));
      toast({
        title: "Recording Started",
        description: "Professional podcast recording is now active"
      });
    }
  });

  const generateTranscriptMutation = useMutation({
    mutationFn: async (episodeId: string) => {
      const response = await fetch(`/api/podcast/generate-transcript/${episodeId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to generate transcript');
      return response.json();
    },
    onSuccess: (data) => {
      setAiFeatures(prev => ({ 
        ...prev, 
        transcript: data.transcript,
        isGeneratingTranscript: false 
      }));
      toast({
        title: "AI Transcript Generated",
        description: "Professional transcript with timestamps ready"
      });
    }
  });

  const generateShowNotesMutation = useMutation({
    mutationFn: async (episodeId: string) => {
      const response = await fetch(`/api/podcast/generate-show-notes/${episodeId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to generate show notes');
      return response.json();
    },
    onSuccess: (data) => {
      setAiFeatures(prev => ({ 
        ...prev, 
        showNotes: data.showNotes,
        isGeneratingShowNotes: false 
      }));
      toast({
        title: "AI Show Notes Generated",
        description: "Professional show notes with chapters and links ready"
      });
    }
  });

  const createSocialClipsMutation = useMutation({
    mutationFn: async ({ episodeId, clipCount }: { episodeId: string, clipCount: number }) => {
      const response = await fetch(`/api/podcast/create-social-clips/${episodeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipCount })
      });
      if (!response.ok) throw new Error('Failed to create social clips');
      return response.json();
    },
    onSuccess: (data) => {
      setAiFeatures(prev => ({ 
        ...prev, 
        socialClips: data.clips,
        isGeneratingSocialClips: false 
      }));
      toast({
        title: "Social Clips Created",
        description: `${data.clips.length} optimized clips ready for TikTok, Instagram, YouTube`
      });
    }
  });

  // Professional Podcast Functions
  const handleStartRecording = () => {
    if (!newEpisode.title) {
      toast({
        title: "Episode Title Required",
        description: "Please enter an episode title before recording",
        variant: "destructive"
      });
      return;
    }

    startRecordingMutation.mutate({
      title: newEpisode.title,
      description: newEpisode.description,
      guests: newEpisode.guests,
      liveStream: newEpisode.liveStream
    });
  };

  const handleGenerateTranscript = () => {
    if (!podcastSession.currentEpisodeId) return;
    
    setAiFeatures(prev => ({ ...prev, isGeneratingTranscript: true }));
    generateTranscriptMutation.mutate(podcastSession.currentEpisodeId);
  };

  const handleGenerateShowNotes = () => {
    if (!podcastSession.currentEpisodeId) return;
    
    setAiFeatures(prev => ({ ...prev, isGeneratingShowNotes: true }));
    generateShowNotesMutation.mutate(podcastSession.currentEpisodeId);
  };

  const handleCreateSocialClips = () => {
    if (!podcastSession.currentEpisodeId) return;
    
    setAiFeatures(prev => ({ ...prev, isGeneratingSocialClips: true }));
    createSocialClipsMutation.mutate({ 
      episodeId: podcastSession.currentEpisodeId, 
      clipCount: 3 
    });
  };

  // AUDIO PROCESSING TOOLS
  const [audioTools, setAudioTools] = useState([
    {
      name: 'AI Noise Cancellation',
      icon: Filter,
      description: 'Professional noise removal',
      category: 'AI Audio',
      enabled: true,
      intensity: 85
    },
    {
      name: 'Voice Enhancement',
      icon: Mic,
      description: 'Studio-quality voice processing',
      category: 'AI Audio',
      enabled: true,
      intensity: 70
    },
    {
      name: 'Auto-Leveling',
      icon: BarChart3,
      description: 'Automatic volume balancing',
      category: 'Processing',
      enabled: true,
      intensity: 90
    },
    {
      name: 'Real-time Transcription',
      icon: Edit3,
      description: 'Live speech-to-text with AI',
      category: 'AI Features',
      enabled: true,
      intensity: 95
    },
    {
      name: 'Sentiment Analysis',
      icon: Brain,
      description: 'Real-time audience mood tracking',
      category: 'AI Features',
      enabled: true,
      intensity: 75
    },
    {
      name: 'Topic Extraction',
      icon: Target,
      description: 'AI-powered content tagging',
      category: 'AI Features',
      enabled: false,
      intensity: 80
    }
  ]);

  // STREAMING PLATFORMS
  const [streamingPlatforms, setStreamingPlatforms] = useState([
    { name: 'Spotify', connected: true, listeners: 456, status: 'live' },
    { name: 'YouTube', connected: true, listeners: 342, status: 'live' },
    { name: 'Twitch', connected: true, listeners: 287, status: 'live' },
    { name: 'Apple Podcasts', connected: false, listeners: 0, status: 'offline' },
    { name: 'Google Podcasts', connected: true, listeners: 162, status: 'live' }
  ]);

  // LIVE CHAT & ENGAGEMENT
  const [liveChat, setLiveChat] = useState([
    { id: '1', user: 'PodcastFan2024', message: 'Great discussion on AI in music!', time: '2 min ago', type: 'message' },
    { id: '2', user: 'MusicProducer', message: 'Can you talk about mixing techniques?', time: '3 min ago', type: 'question' },
    { id: '3', user: 'System', message: 'Sarah Mitchell joined the stream', time: '5 min ago', type: 'system' },
    { id: '4', user: 'ArtistLife', message: 'Love this show! Following on Spotify 🎵', time: '7 min ago', type: 'message' }
  ]);

  // PODCAST ANALYTICS
  const [analytics, setAnalytics] = useState({
    totalDownloads: 45632,
    monthlyGrowth: 23,
    averageListenTime: 28.5,
    engagement: 4.2,
    topCountries: ['United States', 'Canada', 'United Kingdom', 'Australia'],
    peakHours: ['9 AM', '2 PM', '7 PM'],
    demographics: {
      '18-24': 15,
      '25-34': 38,
      '35-44': 28,
      '45-54': 14,
      '55+': 5
    }
  });

  // AI EPISODE FEATURES (merged with professional features above)
  const [episodeFeatures, setEpisodeFeatures] = useState({
    autoEdit: false,
    highlightReel: true,
    chapterMarks: true,
    contentSuggestions: true
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI Audio': return 'from-purple-500 to-pink-500';
      case 'Processing': return 'from-blue-500 to-cyan-500';
      case 'AI Features': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPlatformStatus = (status: string) => {
    switch (status) {
      case 'live': return 'text-red-400';
      case 'offline': return 'text-gray-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* PODCAST STUDIO HEADER */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-red-500/30 p-3">
        <div className="flex items-center justify-between max-w-[2000px] mx-auto">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="hover:scale-110 transition-transform">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-10 h-10 rounded-lg object-cover border border-red-500/50"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-red-500">PODCAST STUDIO PRO</h1>
              <p className="text-gray-400 text-xs">Professional Podcasting • Live Streaming • AI-Enhanced</p>
            </div>
            <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded border border-red-500/30">
              <Circle className="w-4 h-4 text-red-400 fill-current animate-pulse" />
              <span className="text-red-400 font-bold">LIVE</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold">{podcastSession.listeners} Listeners</span>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded">
              <span className="text-blue-400 font-bold">Recording: {formatTime(podcastSession.currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW AI-POWERED PODCAST CONTROL CENTER */}
      <div className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 border-y border-purple-500/30 p-4">
        <div className="max-w-[2000px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Episode Setup */}
            <div className="bg-gray-900/50 rounded-lg border border-purple-500/30 p-4">
              <h3 className="text-purple-400 font-bold mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Episode Setup
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Episode Title"
                  value={newEpisode.title}
                  onChange={(e) => setNewEpisode(prev => ({...prev, title: e.target.value}))}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400"
                />
                <textarea
                  placeholder="Episode Description"
                  value={newEpisode.description}
                  onChange={(e) => setNewEpisode(prev => ({...prev, description: e.target.value}))}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400 h-16 resize-none"
                />
                <button
                  onClick={handleStartRecording}
                  disabled={startRecordingMutation.isPending}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 flex items-center justify-center"
                >
                  {startRecordingMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Circle className="w-4 h-4 mr-2 fill-current" />
                      Start Recording
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Transcript Generation */}
            <div className="bg-gray-900/50 rounded-lg border border-blue-500/30 p-4">
              <h3 className="text-blue-400 font-bold mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                AI Transcript
              </h3>
              <div className="space-y-2">
                <div className="bg-gray-800/50 rounded p-2 h-16 text-xs text-gray-300 overflow-y-auto">
                  {aiFeatures.transcript || "AI transcript will appear here after generation..."}
                </div>
                <button
                  onClick={handleGenerateTranscript}
                  disabled={!podcastSession.currentEpisodeId || aiFeatures.isGeneratingTranscript}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                >
                  {aiFeatures.isGeneratingTranscript ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Transcript
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Show Notes */}
            <div className="bg-gray-900/50 rounded-lg border border-green-500/30 p-4">
              <h3 className="text-green-400 font-bold mb-3 flex items-center">
                <Edit3 className="w-4 h-4 mr-2" />
                AI Show Notes
              </h3>
              <div className="space-y-2">
                <div className="bg-gray-800/50 rounded p-2 h-16 text-xs text-gray-300 overflow-y-auto">
                  {aiFeatures.showNotes || "Professional show notes with chapters and links will appear here..."}
                </div>
                <button
                  onClick={handleGenerateShowNotes}
                  disabled={!podcastSession.currentEpisodeId || aiFeatures.isGeneratingShowNotes}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                >
                  {aiFeatures.isGeneratingShowNotes ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Show Notes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Media Clips */}
            <div className="bg-gray-900/50 rounded-lg border border-yellow-500/30 p-4">
              <h3 className="text-yellow-400 font-bold mb-3 flex items-center">
                <Scissors className="w-4 h-4 mr-2" />
                Social Clips
              </h3>
              <div className="space-y-2">
                <div className="bg-gray-800/50 rounded p-2 h-16 text-xs text-gray-300 overflow-y-auto">
                  {aiFeatures.socialClips.length > 0 ? 
                    `${aiFeatures.socialClips.length} clips ready for TikTok, Instagram, YouTube` : 
                    "AI-optimized clips for social media platforms..."
                  }
                </div>
                <button
                  onClick={handleCreateSocialClips}
                  disabled={!podcastSession.currentEpisodeId || aiFeatures.isGeneratingSocialClips}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                >
                  {aiFeatures.isGeneratingSocialClips ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Instagram className="w-4 h-4 mr-2" />
                      Create Social Clips
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-160px)]">
        {/* LEFT PANEL - AUDIO CONTROLS */}
        <div className="w-80 bg-gray-900/50 border-r border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 text-red-400">AUDIO CONTROLS</h2>
          
          {/* Participants Audio Mixer */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 text-cyan-400">PARTICIPANTS</h3>
            <div className="space-y-3">
              {podcastSession.participants.map((participant) => (
                <div key={participant.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: participant.color }}
                      />
                      <span className="font-bold text-sm">{participant.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className={`p-1 rounded ${participant.muted ? 'bg-red-500' : 'bg-green-500'}`}
                        onClick={() => setPodcastSession(prev => ({
                          ...prev,
                          participants: prev.participants.map(p => 
                            p.id === participant.id ? { ...p, muted: !p.muted } : p
                          )
                        }))}
                      >
                        <Mic className="w-3 h-3" />
                      </button>
                      <span className="text-xs text-gray-400">{participant.role}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Volume</span>
                      <span className="text-white">{participant.volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={participant.volume}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Audio Tools */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 text-purple-400">AI AUDIO TOOLS</h3>
            <div className="space-y-2">
              {audioTools.map((tool, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded bg-gradient-to-r ${getCategoryColor(tool.category)}`}>
                        <tool.icon className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-xs">{tool.name}</span>
                        <p className="text-xs text-gray-400">{tool.description}</p>
                      </div>
                    </div>
                    <button 
                      className={`w-8 h-4 rounded-full transition-colors ${
                        tool.enabled ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                      onClick={() => setAudioTools(prev => 
                        prev.map((t, i) => i === index ? { ...t, enabled: !t.enabled } : t)
                      )}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        tool.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  {tool.enabled && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Intensity</span>
                        <span className="text-purple-400">{tool.intensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={tool.intensity}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="space-y-2">
            <button 
              onClick={() => setPodcastSession(prev => ({ ...prev, isRecording: !prev.isRecording }))}
              className={`w-full font-bold py-3 rounded-lg transition-colors ${
                podcastSession.isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {podcastSession.isRecording ? (
                <>
                  <Square className="w-5 h-5 inline mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5 inline mr-2" />
                  Start Recording
                </>
              )}
            </button>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors">
              <Video className="w-4 h-4 inline mr-2" />
              Start Video Stream
            </button>
          </div>
        </div>

        {/* MAIN STUDIO AREA */}
        <div className="flex-1 flex flex-col">
          {/* Studio Header */}
          <div className="bg-gray-800/50 border-b border-gray-700 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-bold">Live Studio</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <BarChart3 className="w-4 h-4" />
                <span>Professional Audio Processing Active</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-2 bg-purple-500 rounded hover:bg-purple-600 transition-colors">
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Studio Visualization */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden p-6">
            {/* Audio Waveform Visualization */}
            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3 text-red-400">Live Audio Waveform</h4>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-end space-x-1 h-32">
                  {Array.from({length: 120}).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-red-500/50 to-red-300/50 rounded-t transition-all duration-75"
                      style={{ height: `${Math.random() * 80 + 20}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Transcript */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold mb-3 text-green-400">Live Transcript</h4>
                <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                  <div className="p-2 bg-blue-500/20 rounded">
                    <span className="text-blue-400 font-bold">Host:</span> Welcome back to the Artist Tech podcast. Today we're discussing the future of AI in music production...
                  </div>
                  <div className="p-2 bg-green-500/20 rounded">
                    <span className="text-green-400 font-bold">Sarah:</span> Thanks for having me! I'm excited to share insights about how AI is transforming creative workflows...
                  </div>
                  <div className="p-2 bg-yellow-500/20 rounded">
                    <span className="text-yellow-400 font-bold">Dr. Wong:</span> From a technical perspective, the advances in neural networks are remarkable...
                  </div>
                </div>
              </div>

              {/* Episode Analytics */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold mb-3 text-yellow-400">Live Analytics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Listeners</span>
                    <span className="text-white font-bold">{podcastSession.listeners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Peak Listeners</span>
                    <span className="text-green-400 font-bold">1,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Engagement Rate</span>
                    <span className="text-blue-400 font-bold">{analytics.engagement}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Chat Messages</span>
                    <span className="text-purple-400 font-bold">237</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recording Time</span>
                    <span className="text-red-400 font-bold">{formatTime(podcastSession.currentTime)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - STREAMING & CHAT */}
        <div className="w-80 bg-gray-900/50 border-l border-gray-700 flex flex-col">
          {/* Streaming Platforms */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-md font-bold mb-3 text-blue-400">LIVE STREAMING</h3>
            <div className="space-y-2">
              {streamingPlatforms.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded border border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      platform.status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
                    }`} />
                    <span className="font-bold text-sm">{platform.name}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${getPlatformStatus(platform.status)}`}>
                      {platform.status.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400">{platform.listeners} listeners</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Chat */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-md font-bold text-green-400">LIVE CHAT</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {liveChat.map((message) => (
                <div key={message.id} className={`p-2 rounded-lg ${
                  message.type === 'system' ? 'bg-blue-500/20 border border-blue-500/30' :
                  message.type === 'question' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                  'bg-gray-800/50 border border-gray-700'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{message.user}</span>
                    <span className="text-xs text-gray-400">{message.time}</span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Chat with listeners..."
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400"
                />
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}