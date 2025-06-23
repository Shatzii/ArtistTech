import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Share, 
  MessageSquare,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Settings,
  Crown,
  UserPlus,
  GitBranch,
  Save,
  Lock,
  Unlock,
  Eye,
  Headphones,
  Monitor,
  Wifi,
  WifiOff,
  MousePointer2
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer' | 'guest';
  status: 'online' | 'away' | 'busy' | 'offline';
  isSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  cursor?: {
    timeline: number;
    trackId?: string;
    visible: boolean;
    tool: string;
  };
  color: string;
  joinedAt: Date;
  lastSeen: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'timeline_link' | 'asset_share';
  metadata?: any;
}

interface CollaborativeClip {
  id: string;
  assetId: string;
  startTime: number;
  endTime: number;
  trackId: string;
  fadeIn: number;
  fadeOut: number;
  volume: number;
  pitch: number;
  locked: boolean;
  lockedBy?: string;
  editedBy: string;
  lastModified: Date;
}

interface CollaborativeTrack {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'midi' | 'automation';
  clips: CollaborativeClip[];
  muted: boolean;
  solo: boolean;
  volume: number;
  pan: number;
  effects: string[];
  locked: boolean;
  lockedBy?: string;
  color: string;
}

interface ActiveEdit {
  id: string;
  userId: string;
  userName: string;
  type: 'clip_move' | 'clip_resize' | 'clip_edit' | 'track_edit' | 'effect_edit';
  targetId: string;
  startTime: Date;
  lockDuration: number;
  changes: Record<string, any>;
}

interface SessionState {
  connected: boolean;
  sessionId: string | null;
  yourUserId: string;
  yourRole: string;
  latency: number;
  syncStatus: 'synced' | 'syncing' | 'conflict' | 'error';
}

export default function CollaborativeStudio() {
  const [sessionState, setSessionState] = useState<SessionState>({
    connected: false,
    sessionId: null,
    yourUserId: 'user_1',
    yourRole: 'owner',
    latency: 0,
    syncStatus: 'synced'
  });

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'user_1',
      name: 'You',
      email: 'you@example.com',
      role: 'owner',
      status: 'online',
      isSpeaking: false,
      isMuted: false,
      isDeafened: false,
      cursor: { timeline: 0, visible: true, tool: 'select' },
      color: '#3b82f6',
      joinedAt: new Date(),
      lastSeen: new Date()
    },
    {
      id: 'user_2',
      name: 'Sarah Chen',
      email: 'sarah@studio.com',
      role: 'editor',
      status: 'online',
      isSpeaking: true,
      isMuted: false,
      isDeafened: false,
      cursor: { timeline: 15.2, trackId: 'track_2', visible: true, tool: 'trim' },
      color: '#ef4444',
      joinedAt: new Date(Date.now() - 300000),
      lastSeen: new Date()
    },
    {
      id: 'user_3',
      name: 'Mike Rodriguez',
      email: 'mike@producer.net',
      role: 'editor',
      status: 'away',
      isSpeaking: false,
      isMuted: true,
      isDeafened: false,
      cursor: { timeline: 8.7, visible: false, tool: 'select' },
      color: '#22c55e',
      joinedAt: new Date(Date.now() - 600000),
      lastSeen: new Date(Date.now() - 120000)
    }
  ]);

  const [tracks, setTracks] = useState<CollaborativeTrack[]>([
    {
      id: 'track_1',
      name: 'Lead Vocals',
      type: 'audio',
      clips: [
        {
          id: 'clip_1',
          assetId: 'asset_vocals',
          startTime: 0,
          endTime: 30,
          trackId: 'track_1',
          fadeIn: 0.5,
          fadeOut: 1.0,
          volume: 0.8,
          pitch: 0,
          locked: false,
          editedBy: 'user_1',
          lastModified: new Date()
        }
      ],
      muted: false,
      solo: false,
      volume: 0.75,
      pan: 0,
      effects: ['reverb_1'],
      locked: false,
      color: '#3b82f6'
    },
    {
      id: 'track_2',
      name: 'Bass Line',
      type: 'audio',
      clips: [
        {
          id: 'clip_2',
          assetId: 'asset_bass',
          startTime: 4,
          endTime: 32,
          trackId: 'track_2',
          fadeIn: 0,
          fadeOut: 0.5,
          volume: 0.9,
          pitch: 0,
          locked: true,
          lockedBy: 'user_2',
          editedBy: 'user_2',
          lastModified: new Date(Date.now() - 30000)
        }
      ],
      muted: false,
      solo: false,
      volume: 0.85,
      pan: 0,
      effects: ['eq_1', 'compressor_1'],
      locked: false,
      color: '#ef4444'
    },
    {
      id: 'track_3',
      name: 'Drums',
      type: 'audio',
      clips: [],
      muted: false,
      solo: false,
      volume: 0.8,
      pan: 0,
      effects: [],
      locked: false,
      color: '#22c55e'
    }
  ]);

  const [activeEdits, setActiveEdits] = useState<ActiveEdit[]>([
    {
      id: 'edit_1',
      userId: 'user_2',
      userName: 'Sarah Chen',
      type: 'clip_edit',
      targetId: 'clip_2',
      startTime: new Date(Date.now() - 25000),
      lockDuration: 30000,
      changes: { volume: 0.9, fadeOut: 0.5 }
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      userId: 'system',
      userName: 'System',
      message: 'Collaborative session "Epic Track Master" started',
      timestamp: new Date(Date.now() - 900000),
      type: 'system'
    },
    {
      id: 'msg_2',
      userId: 'user_2',
      userName: 'Sarah Chen',
      message: 'Ready to work on the bass section!',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: 'msg_3',
      userId: 'user_3',
      userName: 'Mike Rodriguez',
      message: 'Loving the vocal melody. Going to add some drum layers.',
      timestamp: new Date(Date.now() - 180000),
      type: 'text'
    },
    {
      id: 'msg_4',
      userId: 'system',
      userName: 'System',
      message: 'Sarah Chen is editing Bass Line clip',
      timestamp: new Date(Date.now() - 25000),
      type: 'system'
    }
  ]);

  const [isVoiceChatActive, setIsVoiceChatActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMyMicMuted, setIsMyMicMuted] = useState(false);
  const [isMyAudioDeafened, setIsMyAudioDeafened] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [selectedTool, setSelectedTool] = useState('select');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const animationRef = useRef<number>();

  // WebSocket connection for real-time collaboration
  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket('ws://localhost:8103');
      
      wsRef.current.onopen = () => {
        setSessionState(prev => ({ ...prev, connected: true }));
        console.log('Connected to collaborative studio');
      };
      
      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      };
      
      wsRef.current.onclose = () => {
        setSessionState(prev => ({ ...prev, connected: false }));
        console.log('Disconnected from collaborative studio');
        
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setSessionState(prev => ({ ...prev, syncStatus: 'error' }));
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'collaborative_engine_ready':
        setSessionState(prev => ({ ...prev, connected: true }));
        break;
      
      case 'participant_joined':
        setParticipants(prev => [...prev, message.participant]);
        addSystemChatMessage(`${message.participant.name} joined the session`);
        break;
      
      case 'participant_left':
        setParticipants(prev => prev.filter(p => p.id !== message.userId));
        addSystemChatMessage(`${message.userName} left the session`);
        break;
      
      case 'cursor_updated':
        setParticipants(prev => prev.map(p => 
          p.id === message.userId ? { ...p, cursor: message.cursor, lastSeen: new Date() } : p
        ));
        break;
      
      case 'timeline_edit_applied':
        handleRemoteEdit(message.edit);
        break;
      
      case 'chat_message':
        setChatMessages(prev => [...prev, message.message]);
        break;
      
      case 'voice_chat_updated':
        updateVoiceChatState(message.voiceChat);
        break;
      
      case 'lock_acquired':
        handleLockAcquired(message.targetId, message.userId, message.userName);
        break;
      
      case 'lock_released':
        handleLockReleased(message.targetId);
        break;
    }
  };

  const sendWebSocketMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  const handleRemoteEdit = (edit: ActiveEdit) => {
    setActiveEdits(prev => [...prev.filter(e => e.id !== edit.id), edit]);
    
    // Apply the edit to local state
    if (edit.type === 'clip_edit') {
      setTracks(prev => prev.map(track => ({
        ...track,
        clips: track.clips.map(clip => 
          clip.id === edit.targetId 
            ? { ...clip, ...edit.changes, lastModified: new Date() }
            : clip
        )
      })));
    }
    
    setSessionState(prev => ({ ...prev, syncStatus: 'synced' }));
  };

  const handleLockAcquired = (targetId: string, userId: string, userName: string) => {
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(clip => 
        clip.id === targetId ? { ...clip, locked: true, lockedBy: userId } : clip
      )
    })));
    
    if (userId !== sessionState.yourUserId) {
      addSystemChatMessage(`${userName} is editing ${targetId}`);
    }
  };

  const handleLockReleased = (targetId: string) => {
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(clip => 
        clip.id === targetId ? { ...clip, locked: false, lockedBy: undefined } : clip
      )
    })));
    
    setActiveEdits(prev => prev.filter(e => e.targetId !== targetId));
  };

  const addSystemChatMessage = (message: string) => {
    const systemMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: 'system',
      userName: 'System',
      message,
      timestamp: new Date(),
      type: 'system'
    };
    setChatMessages(prev => [...prev, systemMessage]);
  };

  const updateVoiceChatState = (voiceChatData: any) => {
    setParticipants(prev => prev.map(p => {
      const voiceParticipant = voiceChatData.participants.find((vp: any) => vp.userId === p.id);
      return voiceParticipant 
        ? { ...p, isSpeaking: voiceParticipant.speaking, isMuted: voiceParticipant.muted }
        : p;
    }));
  };

  // Timeline rendering and interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawTimeline = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Draw timeline background
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);

      // Draw time ruler
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, 0, width, 30);

      // Draw time markers
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px monospace';
      for (let i = 0; i <= 60; i += 5) {
        const x = (i / 60) * width * timelineZoom;
        if (x < width) {
          ctx.fillText(`${i}s`, x + 4, 20);
          ctx.fillRect(x, 25, 1, 5);
        }
      }

      // Draw tracks
      const trackHeight = (height - 30) / tracks.length;
      tracks.forEach((track, trackIndex) => {
        const trackY = 30 + trackIndex * trackHeight;
        
        // Track background
        ctx.fillStyle = trackIndex % 2 === 0 ? '#1f2937' : '#111827';
        ctx.fillRect(0, trackY, width, trackHeight);
        
        // Track border
        ctx.strokeStyle = '#374151';
        ctx.strokeRect(0, trackY, width, trackHeight);
        
        // Track name
        ctx.fillStyle = track.color;
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(track.name, 10, trackY + 20);
        
        // Draw clips
        track.clips.forEach(clip => {
          const clipX = (clip.startTime / 60) * width * timelineZoom;
          const clipWidth = ((clip.endTime - clip.startTime) / 60) * width * timelineZoom;
          const clipY = trackY + 30;
          const clipHeight = trackHeight - 35;
          
          // Clip background
          ctx.fillStyle = clip.locked ? '#7f1d1d' : track.color + '80';
          ctx.fillRect(clipX, clipY, clipWidth, clipHeight);
          
          // Clip border
          ctx.strokeStyle = clip.locked ? '#ef4444' : track.color;
          ctx.lineWidth = clip.locked ? 2 : 1;
          ctx.strokeRect(clipX, clipY, clipWidth, clipHeight);
          
          // Clip name
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px sans-serif';
          ctx.fillText(clip.id, clipX + 5, clipY + 15);
          
          // Lock indicator
          if (clip.locked && clip.lockedBy) {
            const lockedUser = participants.find(p => p.id === clip.lockedBy);
            if (lockedUser) {
              ctx.fillStyle = '#ef4444';
              ctx.fillText(`🔒 ${lockedUser.name}`, clipX + 5, clipY + clipHeight - 5);
            }
          }
        });
      });

      // Draw playhead
      const playheadX = (playhead / 60) * width * timelineZoom;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();

      // Draw participant cursors
      participants.forEach(participant => {
        if (participant.cursor?.visible && participant.id !== sessionState.yourUserId) {
          const cursorX = (participant.cursor.timeline / 60) * width * timelineZoom;
          ctx.strokeStyle = participant.color;
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(cursorX, 30);
          ctx.lineTo(cursorX, height);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Cursor label
          ctx.fillStyle = participant.color;
          ctx.fillRect(cursorX - 30, 5, 60, 20);
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px sans-serif';
          ctx.fillText(participant.name, cursorX - 25, 18);
        }
      });
    };

    drawTimeline();
    
    const animate = () => {
      if (isPlaying) {
        setPlayhead(prev => prev + 0.1);
        drawTimeline();
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [tracks, participants, playhead, isPlaying, timelineZoom, sessionState.yourUserId]);

  const sendChatMessage = () => {
    if (chatInput.trim()) {
      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        userId: sessionState.yourUserId,
        userName: 'You',
        message: chatInput,
        timestamp: new Date(),
        type: 'text'
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');
      
      sendWebSocketMessage({
        type: 'chat_message',
        message: {
          message: chatInput,
          type: 'text'
        }
      });
    }
  };

  const toggleVoiceChat = () => {
    const newState = !isVoiceChatActive;
    setIsVoiceChatActive(newState);
    
    sendWebSocketMessage({
      type: 'voice_chat_toggle',
      action: { type: newState ? 'join' : 'leave' }
    });
  };

  const toggleMute = () => {
    const newMuted = !isMyMicMuted;
    setIsMyMicMuted(newMuted);
    
    sendWebSocketMessage({
      type: 'voice_chat_toggle',
      action: { type: 'mute', muted: newMuted }
    });
  };

  const toggleDeafen = () => {
    const newDeafened = !isMyAudioDeafened;
    setIsMyAudioDeafened(newDeafened);
    
    // Update local participant
    setParticipants(prev => prev.map(p => 
      p.id === sessionState.yourUserId ? { ...p, isDeafened: newDeafened } : p
    ));
  };

  const toggleScreenShare = () => {
    const newSharing = !isScreenSharing;
    setIsScreenSharing(newSharing);
    
    if (newSharing) {
      sendWebSocketMessage({
        type: 'screen_share_start',
        settings: { quality: 'high', frameRate: 30, audio: false }
      });
    }
  };

  const saveCheckpoint = () => {
    sendWebSocketMessage({
      type: 'save_checkpoint',
      commitData: {
        message: `Checkpoint at ${new Date().toLocaleTimeString()}`,
        branchId: 'main'
      }
    });
    
    addSystemChatMessage('Project checkpoint saved');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'online': 'bg-green-500',
      'away': 'bg-yellow-500',
      'busy': 'bg-red-500',
      'offline': 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'editor': return <Lock className="w-3 h-3 text-blue-500" />;
      case 'viewer': return <Eye className="w-3 h-3 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Collaborative Studio</h1>
          <Badge variant="secondary" className={`${sessionState.connected ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            {sessionState.connected ? 'Connected' : 'Reconnecting...'}
          </Badge>
          {sessionState.connected && (
            <Badge variant="outline" className="text-gray-300">
              {sessionState.latency}ms
            </Badge>
          )}
          <Badge variant="outline" className="capitalize">
            {sessionState.syncStatus}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={isVoiceChatActive ? "default" : "outline"}
            size="sm"
            onClick={toggleVoiceChat}
            title="Toggle Voice Chat"
          >
            {isVoiceChatActive ? <Headphones className="w-4 h-4" /> : <Headphones className="w-4 h-4 opacity-50" />}
          </Button>
          
          <Button
            variant={isMyMicMuted ? "destructive" : "outline"}
            size="sm"
            onClick={toggleMute}
            disabled={!isVoiceChatActive}
            title="Toggle Microphone"
          >
            {isMyMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Button
            variant={isMyAudioDeafened ? "destructive" : "outline"}
            size="sm"
            onClick={toggleDeafen}
            disabled={!isVoiceChatActive}
            title="Toggle Audio"
          >
            {isMyAudioDeafened ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          <Button
            variant={isScreenSharing ? "default" : "outline"}
            size="sm"
            onClick={toggleScreenShare}
            title="Screen Share"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={saveCheckpoint}
            title="Save Checkpoint"
          >
            <Save className="w-4 h-4" />
          </Button>
          
          <Button variant="outline" size="sm" title="Invite Users">
            <UserPlus className="w-4 h-4" />
          </Button>
          
          <Button variant="outline" size="sm" title="Settings">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Studio Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedTool === 'select' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTool('select')}
              >
                <MousePointer2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant={selectedTool === 'trim' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTool('trim')}
              >
                Trim
              </Button>
              
              <Button
                variant={selectedTool === 'fade' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTool('fade')}
              >
                Fade
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={isPlaying ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsPlaying(false);
                  setPlayhead(0);
                }}
              >
                <Square className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Zoom:</span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={timelineZoom}
                  onChange={(e) => setTimelineZoom(parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
          </div>

          {/* Timeline/Workspace */}
          <div className="flex-1 bg-gray-850 p-4">
            <Card className="h-full bg-black border-gray-700">
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Multi-Track Timeline</h3>
                  
                  <div className="text-sm text-gray-400">
                    Playhead: {playhead.toFixed(1)}s | Active Edits: {activeEdits.length}
                  </div>
                </div>
                
                {/* Canvas for timeline */}
                <canvas
                  ref={canvasRef}
                  className="flex-1 border border-gray-600 rounded cursor-crosshair"
                  width={800}
                  height={400}
                />
                
                {/* Track Controls */}
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                  {tracks.map((track, index) => (
                    <div key={track.id} className="flex items-center space-x-4 p-2 bg-gray-800 rounded">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: track.color }} />
                      <span className="w-24 text-sm truncate">{track.name}</span>
                      
                      <Button 
                        variant={track.muted ? "destructive" : "outline"} 
                        size="sm"
                        onClick={() => {
                          setTracks(prev => prev.map(t => 
                            t.id === track.id ? { ...t, muted: !t.muted } : t
                          ));
                        }}
                      >
                        {track.muted ? 'Unmute' : 'Mute'}
                      </Button>
                      
                      <Button 
                        variant={track.solo ? "default" : "outline"} 
                        size="sm"
                        onClick={() => {
                          setTracks(prev => prev.map(t => 
                            t.id === track.id ? { ...t, solo: !t.solo } : t
                          ));
                        }}
                      >
                        Solo
                      </Button>
                      
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01"
                        value={track.volume}
                        onChange={(e) => {
                          const newVolume = parseFloat(e.target.value);
                          setTracks(prev => prev.map(t => 
                            t.id === track.id ? { ...t, volume: newVolume } : t
                          ));
                        }}
                        className="flex-1" 
                      />
                      
                      <span className="text-xs text-gray-400 w-12">
                        {(20 * Math.log10(track.volume) || -60).toFixed(1)} dB
                      </span>
                      
                      {track.locked && (
                        <div className="flex items-center space-x-1 text-red-400">
                          <Lock className="w-3 h-3" />
                          <span className="text-xs">
                            {participants.find(p => p.id === track.lockedBy)?.name || 'Unknown'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <Tabs defaultValue="participants" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-gray-700">
              <TabsTrigger value="participants">Users</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="participants" className="flex-1 flex flex-col mt-0">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Participants ({participants.length})
                  </h3>
                  {isVoiceChatActive && (
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      Voice Active
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  {participants.map(participant => (
                    <div key={participant.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback 
                            className="text-xs text-white"
                            style={{ backgroundColor: participant.color }}
                          >
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        {getRoleIcon(participant.role) && (
                          <div className="absolute -top-1 -right-1">
                            {getRoleIcon(participant.role)}
                          </div>
                        )}
                        
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(participant.status)}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {participant.name}
                          {participant.id === sessionState.yourUserId && ' (You)'}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {participant.role} • {participant.status}
                        </div>
                        {participant.cursor?.visible && (
                          <div className="text-xs text-gray-500">
                            @{participant.cursor.timeline.toFixed(1)}s
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {participant.isSpeaking && isVoiceChatActive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        )}
                        
                        {isVoiceChatActive && (
                          <>
                            {participant.isMuted ? (
                              <MicOff className="w-3 h-3 text-red-500" />
                            ) : (
                              <Mic className="w-3 h-3 text-gray-400" />
                            )}
                            
                            {participant.isDeafened && (
                              <VolumeX className="w-3 h-3 text-red-500" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map(message => (
                  <div key={message.id} className={`text-sm ${
                    message.type === 'system' ? 'text-gray-400 italic' : ''
                  }`}>
                    {message.type === 'text' && (
                      <div className="font-medium mb-1" style={{ 
                        color: participants.find(p => p.id === message.userId)?.color || '#3b82f6' 
                      }}>
                        {message.userName}
                      </div>
                    )}
                    <div>{message.message}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 border-gray-600"
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  />
                  <Button onClick={sendChatMessage} size="sm">
                    Send
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="flex-1 flex flex-col mt-0">
              <div className="p-4">
                <h3 className="font-semibold mb-3">Active Edits</h3>
                <div className="space-y-2">
                  {activeEdits.map(edit => (
                    <div key={edit.id} className="p-2 bg-gray-700 rounded text-sm">
                      <div className="font-medium text-yellow-400">{edit.userName}</div>
                      <div className="text-gray-300">{edit.type.replace('_', ' ')} on {edit.targetId}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.max(0, Math.floor((edit.lockDuration - (Date.now() - edit.startTime.getTime())) / 1000))}s remaining
                      </div>
                    </div>
                  ))}
                  {activeEdits.length === 0 && (
                    <div className="text-gray-500 text-sm">No active edits</div>
                  )}
                </div>
                
                <h3 className="font-semibold mb-3 mt-6">Session Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Connected Users:</span>
                    <span>{participants.filter(p => p.status === 'online').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Voice Participants:</span>
                    <span>{participants.filter(p => p.isSpeaking && !p.isMuted).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Project Length:</span>
                    <span>{Math.max(...tracks.flatMap(t => t.clips.map(c => c.endTime))).toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Tracks:</span>
                    <span>{tracks.length}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}