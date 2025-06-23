import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { 
  Users, Video, Mic, Share2, MessageCircle, Clock, Play, Pause, Volume2, Settings,
  MousePointer, Eye, Edit3, GitBranch, Save, Download, Upload, Zap, Wifi, WifiOff,
  Camera, Monitor, Headphones, Layers, Move, RotateCw, Scale, Palette, Music,
  Film, Image, Code, FileText, Folder, Plus, Minus, X, Check, AlertCircle,
  Crown, Star, Shield, Bell, Search, Filter, Grid3X3, Maximize2, SkipBack, SkipForward
} from 'lucide-react';

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
              <h1 className="text-xl font-bold text-green-500">COLLABORATIVE STUDIO</h1>
              <p className="text-gray-400 text-xs">Real-time Multi-user Editing • Advanced Conflict Resolution</p>
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
        <div className="flex-1 flex flex-col">
          {/* Workspace Header */}
          <div className="bg-gray-800/50 border-b border-gray-700 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-bold">Collaborative Timeline</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(workspace.timeline.currentTime / 60)}:{(workspace.timeline.currentTime % 60).toString().padStart(2, '0')} / {Math.floor(workspace.timeline.duration / 60)}:{(workspace.timeline.duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timeline Workspace */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
            {/* Layer Panel */}
            <div className="absolute left-0 top-0 bottom-0 w-48 bg-gray-800/80 border-r border-gray-600 p-3">
              <h4 className="text-sm font-bold mb-3 text-cyan-400">LAYERS</h4>
              <div className="space-y-2">
                {workspace.layers.map((layer) => (
                  <div key={layer.id} className="flex items-center justify-between p-2 bg-gray-700/50 rounded border border-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${layer.visible ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <span className="text-xs font-bold truncate">{layer.name}</span>
                    </div>
                    {layer.editedBy && (
                      <div className="text-xs text-blue-400 truncate">{layer.editedBy.split(' ')[0]}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Timeline */}
            <div className="ml-48 h-full flex flex-col">
              {/* Timeline Header */}
              <div className="h-12 bg-gray-800/50 border-b border-gray-600 flex items-center px-4">
                <div className="flex-1 relative">
                  {Array.from({length: 24}).map((_, i) => (
                    <div key={i} className="absolute h-full flex items-center text-xs text-gray-400" style={{ left: `${(i * 100 / 24)}%` }}>
                      {i}:00
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Tracks */}
              <div className="flex-1 relative">
                {workspace.layers.map((layer, index) => (
                  <div key={layer.id} className="h-16 border-b border-gray-600 relative">
                    {/* Sample timeline clips */}
                    <div className="absolute inset-1 bg-gradient-to-r from-blue-600/50 to-blue-800/50 rounded border border-blue-500/50 flex items-center px-2" style={{ width: '30%', left: '10%' }}>
                      <span className="text-xs font-bold text-white truncate">Video Clip {index + 1}</span>
                    </div>
                    {layer.editedBy && (
                      <div className="absolute top-1 right-1 bg-blue-500/20 border border-blue-500/30 px-2 py-1 rounded text-xs text-blue-400">
                        Editing: {layer.editedBy.split(' ')[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Playback Controls */}
              <div className="h-16 bg-gray-800/50 border-t border-gray-600 flex items-center justify-center space-x-4">
                <button className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <Play className="w-5 h-5 transform rotate-180" />
                </button>
                <button 
                  onClick={() => setWorkspace(prev => ({ ...prev, timeline: { ...prev.timeline, isPlaying: !prev.timeline.isPlaying } }))}
                  className="p-4 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                >
                  {workspace.timeline.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <Play className="w-5 h-5" />
                </button>
                <div className="bg-gray-700 px-3 py-2 rounded-lg text-sm font-mono">
                  Speed: {workspace.timeline.playbackSpeed}x
                </div>
              </div>
            </div>
          </div>
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