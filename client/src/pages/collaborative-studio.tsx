import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { 
  Users, Video, Mic, Share2, MessageCircle, Clock, Play, Pause, Volume2, Settings,
  MousePointer, Eye, Edit3, GitBranch, Save, Download, Upload, Zap, Wifi, WifiOff,
  Camera, Monitor, Headphones, Layers, Move, RotateCw, Scale, Palette, Music,
  Film, Image, Code, FileText, Folder, Plus, Minus, X, Check, AlertCircle,
  Crown, Star, Shield, Bell, Search, Filter, Grid3X3, Maximize2, SkipBack, SkipForward,
  Video as VideoIcon, Twitch, Calendar,
  Hash, Bot, Brain, Languages, Send, BarChart3, Globe, Smartphone, Tablet,
  Tv, Radio, Target, Wand2, Sparkles, Trending, Activity, BookOpen, PaintBucket,
  Megaphone, Clock3, Users2, Heart, Repeat2, Eye as Views, MessageSquare
} from 'lucide-react';
import { SiInstagram, SiYoutube, SiX, SiFacebook, SiTiktok } from 'react-icons/si';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { useToast } from '../hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import CollaborativeEditor from '../components/CollaborativeEditor';
import CollaborativeTimeline from '../components/CollaborativeTimeline';

export default function CollaborativeStudio() {
  // REAL-TIME COLLABORATION STATE
  const [session, setSession] = useState({
    id: 'collab_session_001',
    name: 'Epic Music Video Project',
    type: 'multi-media',
    isHost: true,
    participants: [
      { 
        id: '1', 
        name: 'Alex Rodriguez (You)', 
        role: 'Producer/Host', 
        status: 'active', 
        avatar: 'AR',
        cursor: { x: 450, y: 300 },
        color: '#3b82f6',
        permissions: ['admin', 'edit', 'export']
      },
      { 
        id: '2', 
        name: 'Sarah Chen', 
        role: 'Video Director', 
        status: 'editing', 
        avatar: 'SC',
        cursor: { x: 650, y: 200 },
        color: '#10b981',
        permissions: ['edit', 'comment']
      },
      { 
        id: '3', 
        name: 'Mike Johnson', 
        role: 'Audio Engineer', 
        status: 'recording', 
        avatar: 'MJ',
        cursor: { x: 350, y: 500 },
        color: '#f59e0b',
        permissions: ['edit', 'comment']
      },
      { 
        id: '4', 
        name: 'Lisa Wang', 
        role: 'Visual Artist', 
        status: 'designing', 
        avatar: 'LW',
        cursor: { x: 800, y: 400 },
        color: '#8b5cf6',
        permissions: ['edit', 'comment']
      }
    ]
  });

  // COLLABORATIVE EDITING TOOLS
  const [collaborativeTools, setCollaborativeTools] = useState([
    {
      name: 'Real-time Timeline',
      icon: Film,
      description: 'Multi-user video/audio timeline editing',
      category: 'Core',
      active: true,
      conflicts: 0
    },
    {
      name: 'Live Cursor Tracking',
      icon: MousePointer,
      description: 'See where everyone is working',
      category: 'Core',
      active: true,
      conflicts: 0
    },
    {
      name: 'Voice Chat & Video',
      icon: Video,
      description: 'HD video conferencing built-in',
      category: 'Communication',
      active: true,
      conflicts: 0
    },
    {
      name: 'Version Control',
      icon: GitBranch,
      description: 'Advanced branching and merging',
      category: 'Management',
      active: true,
      conflicts: 0
    },
    {
      name: 'AI Conflict Resolution',
      icon: Zap,
      description: 'Smart merge conflict resolution',
      category: 'AI',
      active: true,
      conflicts: 2
    },
    {
      name: 'Live Asset Sharing',
      icon: Share2,
      description: 'Instant file sync across users',
      category: 'Core',
      active: true,
      conflicts: 0
    }
  ]);

  // SOCIAL MEDIA CREATION STUDIO STATE
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [socialTab, setSocialTab] = useState('platforms');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'tiktok', 'youtube']);
  const [teamBrandKit, setTeamBrandKit] = useState(null);
  const [collaborativeContent, setCollaborativeContent] = useState(null);
  const [liveStreamingActive, setLiveStreamingActive] = useState(false);
  const [audienceInteraction, setAudienceInteraction] = useState({
    viewers: 847,
    likes: 342,
    comments: 89,
    shares: 23
  });
  const [teamAnalytics, setTeamAnalytics] = useState(null);
  const [contentCalendar, setContentCalendar] = useState([]);
  const [translationActive, setTranslationActive] = useState(false);
  const [targetLanguages, setTargetLanguages] = useState(['es', 'fr', 'de']);
  
  const [platforms] = useState([
    { id: 'instagram', name: 'Instagram', icon: SiInstagram, connected: true, followers: 15420 },
    { id: 'tiktok', name: 'TikTok', icon: SiTiktok, connected: true, followers: 8750 },
    { id: 'youtube', name: 'YouTube', icon: SiYoutube, connected: true, followers: 32100 },
    { id: 'twitter', name: 'Twitter', icon: SiX, connected: false, followers: 0 },
    { id: 'facebook', name: 'Facebook', icon: SiFacebook, connected: true, followers: 12300 },
    { id: 'twitch', name: 'Twitch', icon: Twitch, connected: true, followers: 5680 }
  ]);

  // SOCIAL MEDIA API MUTATIONS
  const collaborativeCaptionMutation = useMutation({
    mutationFn: async (data: { content: string; platforms: string[]; teamInput: any[] }) => {
      return await apiRequest('POST', '/api/collaborative/generate-captions', data);
    },
    onSuccess: (data) => {
      setCollaborativeContent(data);
      toast({ title: "Team Captions Generated", description: `Created ${data.variations.length} collaborative variations` });
    }
  });

  const teamViralAnalysisMutation = useMutation({
    mutationFn: async (data: { content: string; teamMembers: string[] }) => {
      return await apiRequest('POST', '/api/collaborative/viral-analysis', data);
    },
    onSuccess: (data) => {
      toast({ title: "Team Viral Analysis Complete", description: `Score: ${data.teamScore}/100` });
    }
  });

  const multiPlatformPublishMutation = useMutation({
    mutationFn: async (data: { content: any; platforms: string[]; schedule?: string }) => {
      return await apiRequest('POST', '/api/collaborative/publish', data);
    },
    onSuccess: (data) => {
      toast({ title: "Team Content Published", description: `Published to ${data.successful}/${data.total} platforms` });
    }
  });

  const liveStreamMutation = useMutation({
    mutationFn: async (data: { platforms: string[]; title: string; description: string }) => {
      return await apiRequest('POST', '/api/collaborative/start-stream', data);
    },
    onSuccess: () => {
      setLiveStreamingActive(true);
      toast({ title: "Live Stream Started", description: "Broadcasting to all selected platforms" });
    }
  });

  // PROJECT WORKSPACE
  const [workspace, setWorkspace] = useState({
    currentTool: 'timeline',
    selectedElement: null,
    zoom: 100,
    gridSnap: true,
    layers: [
      { id: '1', name: 'Video Track 1', type: 'video', locked: false, visible: true, editedBy: null },
      { id: '2', name: 'Audio Track 1', type: 'audio', locked: false, visible: true, editedBy: 'Mike Johnson' },
      { id: '3', name: 'Graphics Layer', type: 'graphics', locked: false, visible: true, editedBy: 'Lisa Wang' },
      { id: '4', name: 'Text Overlay', type: 'text', locked: false, visible: true, editedBy: null }
    ],
    timeline: {
      duration: 240,
      currentTime: 45,
      isPlaying: false,
      playbackSpeed: 1
    }
  });

  // LIVE CHAT & COMMENTS
  const [chatState, setChatState] = useState({
    messages: [
      { 
        id: '1', 
        user: 'Sarah Chen', 
        message: 'Just added the intro sequence. Check the new transition at 0:15!', 
        time: '2 min ago',
        type: 'message',
        timestamp: Date.now() - 120000
      },
      { 
        id: '2', 
        user: 'Mike Johnson', 
        message: 'Audio levels look good. The bass drop at 1:30 is perfect 🔥', 
        time: '5 min ago',
        type: 'message',
        timestamp: Date.now() - 300000
      },
      { 
        id: '3', 
        user: 'System', 
        message: 'Lisa Wang started editing Graphics Layer', 
        time: '7 min ago',
        type: 'system',
        timestamp: Date.now() - 420000
      },
      { 
        id: '4', 
        user: 'Alex Rodriguez', 
        message: 'Team sync in 10 minutes. Please save your current work.', 
        time: '12 min ago',
        type: 'announcement',
        timestamp: Date.now() - 720000
      }
    ],
    newMessage: '',
    unreadCount: 0
  });

  // VERSION CONTROL
  const [versionHistory, setVersionHistory] = useState({
    currentVersion: 'v2.4.1',
    branches: [
      { name: 'main', commits: 23, lastEdit: 'Alex Rodriguez', active: true },
      { name: 'audio-enhancement', commits: 7, lastEdit: 'Mike Johnson', active: false },
      { name: 'visual-effects', commits: 12, lastEdit: 'Lisa Wang', active: false }
    ],
    recentCommits: [
      { id: 'c001', message: 'Added intro transition effects', author: 'Sarah Chen', time: '3 min ago' },
      { id: 'c002', message: 'Improved audio mixing balance', author: 'Mike Johnson', time: '8 min ago' },
      { id: 'c003', message: 'Updated color grading preset', author: 'Lisa Wang', time: '15 min ago' }
    ]
  });

  // REAL-TIME UPDATES SIMULATION
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate cursor movements
      setSession(prev => ({
        ...prev,
        participants: prev.participants.map(p => 
          p.id !== '1' ? {
            ...p,
            cursor: {
              x: p.cursor.x + (Math.random() - 0.5) * 20,
              y: p.cursor.y + (Math.random() - 0.5) * 20
            }
          } : p
        )
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (chatState.newMessage.trim()) {
      const newMsg = {
        id: Date.now().toString(),
        user: 'Alex Rodriguez',
        message: chatState.newMessage,
        time: 'now',
        type: 'message',
        timestamp: Date.now()
      };
      
      setChatState(prev => ({
        ...prev,
        messages: [newMsg, ...prev.messages],
        newMessage: ''
      }));
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core': return 'from-blue-500 to-cyan-500';
      case 'Communication': return 'from-green-500 to-emerald-500';
      case 'Management': return 'from-purple-500 to-pink-500';
      case 'AI': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'editing': return 'bg-blue-500';
      case 'recording': return 'bg-red-500';
      case 'designing': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* COLLABORATIVE BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Connection Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            {session.participants.map((participant, i) => 
              session.participants.slice(i + 1).map((other, j) => (
                <line
                  key={`${i}-${j}`}
                  x1={participant.cursor.x}
                  y1={participant.cursor.y}
                  x2={other.cursor.x}
                  y2={other.cursor.y}
                  stroke={participant.color}
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.3"
                />
              ))
            )}
          </svg>
        </div>

        {/* Live Cursors */}
        {session.participants.filter(p => p.id !== '1').map((participant) => (
          <div
            key={participant.id}
            className="absolute transition-all duration-200 z-20 pointer-events-none"
            style={{ 
              left: participant.cursor.x, 
              top: participant.cursor.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <MousePointer 
                className="w-6 h-6 transform rotate-12" 
                style={{ color: participant.color }}
              />
              <div 
                className="absolute top-6 left-0 px-2 py-1 rounded text-xs font-bold text-white whitespace-nowrap"
                style={{ backgroundColor: participant.color }}
              >
                {participant.name.split(' ')[0]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div className="relative z-10 bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-green-500/30 p-3">
        <div className="flex items-center justify-between max-w-[2000px] mx-auto">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="hover:scale-110 transition-transform">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-10 h-10 rounded-lg object-cover border border-green-500/50"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-green-500">SOCIAL MEDIA COLLABORATIVE STUDIO</h1>
              <p className="text-gray-400 text-xs">Team Content Creation • Multi-Platform Broadcasting • Live Collaboration</p>
            </div>
            <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded border border-green-500/30">
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold">LIVE SYNC</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-bold">{session.participants.length} Collaborators</span>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded">
              <span className="text-purple-400 font-bold">Project: {session.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-[calc(100vh-64px)]">
        {/* LEFT PANEL - COLLABORATIVE TOOLS */}
        <div className="w-80 bg-gray-900/50 border-r border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 text-green-400">COLLABORATION TOOLS</h2>
          
          {/* Active Participants */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 text-cyan-400">LIVE PARTICIPANTS</h3>
            <div className="space-y-2">
              {session.participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: participant.color }}
                    >
                      {participant.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{participant.name}</div>
                      <div className="text-xs text-gray-400">{participant.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {participant.permissions.includes('admin') && (
                      <Crown className="w-4 h-4 text-yellow-400" />
                    )}
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collaboration Features */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 text-yellow-400">ACTIVE FEATURES</h3>
            <div className="space-y-2">
              {collaborativeTools.map((tool, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(tool.category)}`}>
                        <tool.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{tool.name}</h4>
                        <p className="text-xs text-gray-400">{tool.description}</p>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${tool.active ? 'bg-green-500' : 'bg-gray-500'}`} />
                  </div>
                  {tool.conflicts > 0 && (
                    <div className="bg-red-500/20 border border-red-500/30 px-2 py-1 rounded text-xs text-red-400">
                      {tool.conflicts} conflicts detected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Version Control */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 text-purple-400">VERSION CONTROL</h3>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold">Current Version</span>
                <span className="text-purple-400 font-bold">{versionHistory.currentVersion}</span>
              </div>
              <div className="space-y-1 mb-3">
                {versionHistory.recentCommits.slice(0, 3).map((commit) => (
                  <div key={commit.id} className="text-xs text-gray-400">
                    <span className="text-white">{commit.author}:</span> {commit.message}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold py-1 px-2 rounded transition-colors">
                  Save Version
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-1 px-2 rounded transition-colors">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN WORKSPACE */}
        <div className="flex-1 bg-gray-900 relative">
          {/* SOCIAL MEDIA CREATION TABS */}
          <Tabs value={socialTab} onValueChange={setSocialTab} className="h-full flex flex-col">
            <div className="bg-gray-800 border-b border-gray-700">
              <TabsList className="bg-transparent border-none w-full justify-start p-0">
                <TabsTrigger value="platforms" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Globe className="w-4 h-4 mr-2" />
                  Platforms
                </TabsTrigger>
                <TabsTrigger value="streaming" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  <Radio className="w-4 h-4 mr-2" />
                  Live Stream
                </TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  <Bot className="w-4 h-4 mr-2" />
                  Team Content
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="calendar" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </div>

            {/* PLATFORMS TAB */}
            <TabsContent value="platforms" className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-blue-400 mb-4">Connected Platforms</h3>
                  <div className="space-y-3">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <div key={platform.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-600">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-6 h-6 text-blue-400" />
                            <div>
                              <div className="font-bold">{platform.name}</div>
                              <div className="text-sm text-gray-400">{platform.followers.toLocaleString()} followers</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-gray-500'}`} />
                            <button 
                              onClick={() => setSelectedPlatforms(prev => 
                                prev.includes(platform.id) 
                                  ? prev.filter(p => p !== platform.id)
                                  : [...prev, platform.id]
                              )}
                              className={`px-3 py-1 rounded text-xs font-bold ${
                                selectedPlatforms.includes(platform.id) 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-600 text-gray-300'
                              }`}
                            >
                              {selectedPlatforms.includes(platform.id) ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-green-400 mb-4">Team Brand Kit</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-900 rounded-lg">
                      <div className="font-bold mb-2">Brand Colors</div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 rounded bg-blue-500 border border-gray-600"></div>
                        <div className="w-8 h-8 rounded bg-green-500 border border-gray-600"></div>
                        <div className="w-8 h-8 rounded bg-purple-500 border border-gray-600"></div>
                        <div className="w-8 h-8 rounded bg-yellow-500 border border-gray-600"></div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-900 rounded-lg">
                      <div className="font-bold mb-2">Team Templates</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800 p-2 rounded text-xs text-center">Instagram Story</div>
                        <div className="bg-gray-800 p-2 rounded text-xs text-center">TikTok Video</div>
                        <div className="bg-gray-800 p-2 rounded text-xs text-center">YouTube Thumbnail</div>
                        <div className="bg-gray-800 p-2 rounded text-xs text-center">Twitter Header</div>
                      </div>
                    </div>
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      <PaintBucket className="w-4 h-4 mr-2" />
                      Update Brand Kit
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* LIVE STREAMING TAB */}
            <TabsContent value="streaming" className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-red-400 mb-4">Multi-Platform Live Stream</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-900 rounded-lg">
                      <div className="font-bold mb-2">Stream Status</div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${liveStreamingActive ? 'bg-red-500' : 'bg-gray-500'}`} />
                        <span className="text-sm">{liveStreamingActive ? 'LIVE' : 'OFFLINE'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Stream Title</Label>
                      <Input placeholder="Enter stream title..." className="bg-gray-900 border-gray-600" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <textarea 
                        placeholder="Stream description..."
                        className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Platforms</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {platforms.filter(p => p.connected).map(platform => {
                          const Icon = platform.icon;
                          return (
                            <div key={platform.id} className="flex items-center space-x-2 p-2 bg-gray-900 rounded">
                              <input type="checkbox" className="rounded" />
                              <Icon className="w-4 h-4" />
                              <span className="text-sm">{platform.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <Button 
                      className={`w-full ${liveStreamingActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      onClick={() => setLiveStreamingActive(!liveStreamingActive)}
                    >
                      {liveStreamingActive ? (
                        <>
                          <Square className="w-4 h-4 mr-2" />
                          Stop Stream
                        </>
                      ) : (
                        <>
                          <Radio className="w-4 h-4 mr-2" />
                          Start Live Stream
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-blue-400 mb-4">Live Audience</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-900 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-400">{audienceInteraction.viewers}</div>
                        <div className="text-sm text-gray-400">Viewers</div>
                      </div>
                      <div className="p-3 bg-gray-900 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-400">{audienceInteraction.likes}</div>
                        <div className="text-sm text-gray-400">Likes</div>
                      </div>
                      <div className="p-3 bg-gray-900 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-400">{audienceInteraction.comments}</div>
                        <div className="text-sm text-gray-400">Comments</div>
                      </div>
                      <div className="p-3 bg-gray-900 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-400">{audienceInteraction.shares}</div>
                        <div className="text-sm text-gray-400">Shares</div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-900 rounded-lg">
                      <div className="font-bold mb-2">Live Comments</div>
                      <div className="space-y-2 h-32 overflow-y-auto">
                        <div className="text-sm"><span className="font-bold text-blue-400">@musicfan23:</span> Amazing collaboration!</div>
                        <div className="text-sm"><span className="font-bold text-green-400">@producer_pro:</span> Love this track!</div>
                        <div className="text-sm"><span className="font-bold text-yellow-400">@beatmaker:</span> When is this releasing?</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TEAM CONTENT TAB */}
            <TabsContent value="content" className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-green-400 mb-4">Collaborative Caption Generator</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Content Description</Label>
                      <textarea 
                        placeholder="Describe your collaborative content..."
                        className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Team Input Style</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-900 border-gray-600">
                          <SelectValue placeholder="Select style..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collaborative">Collaborative</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="energetic">Energetic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() => collaborativeCaptionMutation.mutate({
                        content: "Our amazing collaborative track",
                        platforms: selectedPlatforms,
                        teamInput: session.participants.map(p => ({ name: p.name, role: p.role }))
                      })}
                      disabled={collaborativeCaptionMutation.isPending}
                    >
                      <Bot className="w-4 h-4 mr-2" />
                      Generate Team Captions
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-purple-400 mb-4">Multi-Language Hub</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Auto-Translation</span>
                      <button 
                        onClick={() => setTranslationActive(!translationActive)}
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          translationActive ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {translationActive ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    <div className="space-y-2">
                      <Label>Target Languages</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { code: 'es', name: 'Spanish' },
                          { code: 'fr', name: 'French' },
                          { code: 'de', name: 'German' },
                          { code: 'it', name: 'Italian' },
                          { code: 'pt', name: 'Portuguese' },
                          { code: 'ja', name: 'Japanese' }
                        ].map(lang => (
                          <div key={lang.code} className="flex items-center space-x-2 p-2 bg-gray-900 rounded">
                            <input 
                              type="checkbox" 
                              checked={targetLanguages.includes(lang.code)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setTargetLanguages(prev => [...prev, lang.code]);
                                } else {
                                  setTargetLanguages(prev => prev.filter(l => l !== lang.code));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{lang.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ANALYTICS TAB */}
            <TabsContent value="analytics" className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-purple-400 mb-4">Team Performance</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-900 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-400">89%</div>
                        <div className="text-sm text-gray-400">Engagement Rate</div>
                      </div>
                      <div className="p-3 bg-gray-900 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-400">12.4K</div>
                        <div className="text-sm text-gray-400">Total Reach</div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-900 rounded-lg">
                      <div className="font-bold mb-2">Platform Breakdown</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Instagram</span>
                          <span className="text-sm text-blue-400">45%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">TikTok</span>
                          <span className="text-sm text-green-400">32%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">YouTube</span>
                          <span className="text-sm text-purple-400">23%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-yellow-400 mb-4">Collaborative Insights</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-900 rounded-lg">
                      <div className="font-bold mb-2">Team Contributions</div>
                      <div className="space-y-2">
                        {session.participants.map(participant => (
                          <div key={participant.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: participant.color }}
                              />
                              <span className="text-sm">{participant.name.split(' ')[0]}</span>
                            </div>
                            <span className="text-sm text-gray-400">{Math.floor(Math.random() * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600">
                      <Activity className="w-4 h-4 mr-2" />
                      Generate Team Report
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* CALENDAR TAB */}
            <TabsContent value="calendar" className="flex-1 p-4 overflow-y-auto">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-bold text-orange-400 mb-4">Team Content Calendar</h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-bold text-gray-400 p-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({length: 35}, (_, i) => (
                    <div key={i} className="aspect-square bg-gray-900 rounded border border-gray-700 p-1">
                      <div className="text-xs text-gray-400">{(i % 30) + 1}</div>
                      {i === 15 && <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>}
                      {i === 22 && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Collaborative Single Release</span>
                    </div>
                    <span className="text-xs text-gray-400">Tomorrow</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-900 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Team Live Stream</span>
                    </div>
                    <span className="text-xs text-gray-400">Next Week</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT PANEL - CHAT & COMMUNICATION */}
        <div className="w-80 bg-gray-900/50 border-l border-gray-700 flex flex-col">
          {/* Video Chat Panel */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-md font-bold mb-3 text-green-400">VIDEO CHAT</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {session.participants.slice(0, 4).map((participant) => (
                <div key={participant.id} className="aspect-video bg-gray-800 rounded-lg border border-gray-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: participant.color }}
                    >
                      {participant.avatar}
                    </div>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black/70 px-1 py-0.5 rounded text-xs text-white">
                    {participant.name.split(' ')[0]}
                  </div>
                  <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getStatusColor(participant.status)}`} />
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition-colors">
                <Video className="w-4 h-4 inline mr-2" />
                Video
              </button>
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition-colors">
                <Mic className="w-4 h-4 inline mr-2" />
                Audio
              </button>
            </div>
          </div>

          {/* Live Chat */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-md font-bold text-yellow-400">LIVE CHAT</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatState.messages.map((message) => (
                <div key={message.id} className={`p-3 rounded-lg ${
                  message.type === 'system' ? 'bg-blue-500/20 border border-blue-500/30' :
                  message.type === 'announcement' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                  'bg-gray-800/50 border border-gray-700'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{message.user}</span>
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
                  value={chatState.newMessage}
                  onChange={(e) => setChatState(prev => ({ ...prev, newMessage: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400"
                />
                <button 
                  onClick={sendMessage}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                >
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