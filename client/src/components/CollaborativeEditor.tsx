import { useState, useEffect, useRef } from 'react';
import { 
  Users, MousePointer, Edit3, GitBranch, Save, Eye, Wifi, 
  MessageCircle, Video, Mic, Share2, Crown, AlertCircle,
  Check, X, Clock, Play, Pause, Volume2, Settings,
  Monitor, Camera, Headphones, Layers, Move
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';

interface CollaborativeUser {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'editing' | 'idle' | 'offline';
  avatar: string;
  cursor: { x: number; y: number };
  color: string;
  permissions: string[];
  lastActivity: Date;
}

interface CollaborativeEdit {
  id: string;
  userId: string;
  type: string;
  timestamp: Date;
  changes: any;
  status: 'pending' | 'applied' | 'conflict';
}

interface CollaborativeEditorProps {
  sessionId: string;
  projectType: 'audio' | 'video' | 'image' | 'document';
  onUserJoin?: (user: CollaborativeUser) => void;
  onUserLeave?: (userId: string) => void;
  onEdit?: (edit: CollaborativeEdit) => void;
}

export default function CollaborativeEditor({ 
  sessionId, 
  projectType, 
  onUserJoin, 
  onUserLeave, 
  onEdit 
}: CollaborativeEditorProps) {
  const [users, setUsers] = useState<CollaborativeUser[]>([
    {
      id: '1',
      name: 'Alex Rodriguez (You)',
      role: 'Producer/Host',
      status: 'active',
      avatar: 'AR',
      cursor: { x: 450, y: 300 },
      color: '#3b82f6',
      permissions: ['admin', 'edit', 'export'],
      lastActivity: new Date()
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'Video Director',
      status: 'editing',
      avatar: 'SC',
      cursor: { x: 650, y: 200 },
      color: '#10b981',
      permissions: ['edit', 'comment'],
      lastActivity: new Date(Date.now() - 2000)
    },
    {
      id: '3',
      name: 'Marcus Williams',
      role: 'Audio Engineer',
      status: 'active',
      avatar: 'MW',
      cursor: { x: 300, y: 500 },
      color: '#f59e0b',
      permissions: ['edit', 'mix'],
      lastActivity: new Date(Date.now() - 1000)
    }
  ]);

  const [activeEdits, setActiveEdits] = useState<CollaborativeEdit[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // WebSocket connection for real-time collaboration
  useEffect(() => {
    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/collaboration`;
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        wsRef.current?.send(JSON.stringify({
          type: 'join_session',
          sessionId,
          projectType
        }));
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };
      
      wsRef.current.onclose = () => {
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    };

    connectWebSocket();

    return () => {
      wsRef.current?.close();
    };
  }, [sessionId, projectType]);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'user_joined':
        if (onUserJoin) onUserJoin(data.user);
        setUsers(prev => [...prev, data.user]);
        break;
      
      case 'user_left':
        if (onUserLeave) onUserLeave(data.userId);
        setUsers(prev => prev.filter(u => u.id !== data.userId));
        break;
      
      case 'cursor_update':
        setUsers(prev => prev.map(u => 
          u.id === data.userId 
            ? { ...u, cursor: data.cursor, lastActivity: new Date() }
            : u
        ));
        break;
      
      case 'edit_applied':
        if (onEdit) onEdit(data.edit);
        setActiveEdits(prev => [...prev, data.edit]);
        break;
      
      case 'conflict_detected':
        setConflicts(prev => [...prev, data.conflict]);
        break;
      
      case 'chat_message':
        setChatMessages(prev => [...prev, data.message]);
        break;
    }
  };

  const sendEdit = (editType: string, changes: any) => {
    const edit: CollaborativeEdit = {
      id: `edit_${Date.now()}`,
      userId: '1', // Current user
      type: editType,
      timestamp: new Date(),
      changes,
      status: 'pending'
    };

    wsRef.current?.send(JSON.stringify({
      type: 'apply_edit',
      sessionId,
      edit
    }));

    setActiveEdits(prev => [...prev, edit]);
  };

  const sendChatMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `msg_${Date.now()}`,
      userId: '1',
      userName: 'Alex Rodriguez',
      message: newMessage,
      timestamp: new Date()
    };

    wsRef.current?.send(JSON.stringify({
      type: 'chat_message',
      sessionId,
      message
    }));

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const resolveConflict = (conflictId: string, resolution: 'accept' | 'reject') => {
    wsRef.current?.send(JSON.stringify({
      type: 'resolve_conflict',
      sessionId,
      conflictId,
      resolution
    }));

    setConflicts(prev => prev.filter(c => c.id !== conflictId));
  };

  // Real-time cursor tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cursor = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    wsRef.current?.send(JSON.stringify({
      type: 'cursor_update',
      sessionId,
      cursor
    }));
  };

  const renderUserCursors = () => {
    return users.filter(u => u.id !== '1').map(user => (
      <div
        key={user.id}
        className="absolute pointer-events-none z-50"
        style={{
          left: user.cursor.x,
          top: user.cursor.y,
          transform: 'translate(-2px, -2px)'
        }}
      >
        <div 
          className="w-4 h-4 border-2 border-white rounded-full"
          style={{ backgroundColor: user.color }}
        />
        <div 
          className="mt-1 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
          style={{ backgroundColor: user.color }}
        >
          {user.name}
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
      {/* Collaboration Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm font-bold text-white">
                {isConnected ? 'Connected' : 'Reconnecting...'}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-bold">
                {users.length} Collaborators
              </span>
            </div>

            {conflicts.length > 0 && (
              <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400 font-bold">
                  {conflicts.length} Conflicts
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={voiceEnabled ? "default" : "outline"}
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="flex items-center space-x-1"
            >
              <Mic className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant={videoEnabled ? "default" : "outline"}
              onClick={() => setVideoEnabled(!videoEnabled)}
              className="flex items-center space-x-1"
            >
              <Video className="w-4 h-4" />
            </Button>
            
            <Button size="sm" variant="outline" className="flex items-center space-x-1">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 h-96">
        {/* Main Collaborative Canvas */}
        <div className="col-span-8 relative bg-black">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseMove={handleMouseMove}
            width={800}
            height={384}
          />
          
          {/* Real-time Cursors */}
          {renderUserCursors()}
          
          {/* Live Editing Indicators */}
          <div className="absolute top-4 left-4 space-y-2">
            {activeEdits.slice(-3).map((edit, index) => (
              <div
                key={edit.id}
                className="bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded text-xs text-blue-400"
              >
                {users.find(u => u.id === edit.userId)?.name} • {edit.type}
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Sidebar */}
        <div className="col-span-4 bg-gray-800 border-l border-gray-700">
          {/* Active Users */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-bold text-white mb-3">Active Users</h3>
            <div className="space-y-2">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.role}</div>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    user.status === 'active' ? 'bg-green-500' :
                    user.status === 'editing' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                </div>
              ))}
            </div>
          </div>

          {/* Live Chat */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-bold text-white mb-3">Live Chat</h3>
            <div className="space-y-2 h-32 overflow-y-auto mb-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className="text-xs">
                  <span className="text-blue-400 font-bold">{msg.userName}:</span>
                  <span className="text-gray-300 ml-1">{msg.message}</span>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type message..."
                className="text-xs"
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              />
              <Button size="sm" onClick={sendChatMessage}>
                <MessageCircle className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Conflict Resolution */}
          {conflicts.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-bold text-red-400 mb-3">Conflicts</h3>
              <div className="space-y-2">
                {conflicts.map(conflict => (
                  <div key={conflict.id} className="bg-red-500/20 border border-red-500/30 p-2 rounded">
                    <div className="text-xs text-red-400 mb-2">{conflict.description}</div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveConflict(conflict.id, 'accept')}
                        className="text-xs"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveConflict(conflict.id, 'reject')}
                        className="text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}