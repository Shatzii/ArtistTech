import { useState, useEffect, useRef, useCallback } from 'react';

export interface CollaborativeUser {
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

export interface CollaborativeEdit {
  id: string;
  userId: string;
  type: string;
  timestamp: Date;
  changes: any;
  status: 'pending' | 'applied' | 'conflict';
  target?: string; // Which element/track was edited
}

export interface CollaborationOptions {
  sessionId: string;
  projectType: 'audio' | 'video' | 'image' | 'document';
  userId: string;
  userName: string;
  onUserJoin?: (user: CollaborativeUser) => void;
  onUserLeave?: (userId: string) => void;
  onEdit?: (edit: CollaborativeEdit) => void;
  onConflict?: (conflict: any) => void;
}

export function useCollaboration({
  sessionId,
  projectType,
  userId,
  userName,
  onUserJoin,
  onUserLeave,
  onEdit,
  onConflict
}: CollaborationOptions) {
  const [users, setUsers] = useState<CollaborativeUser[]>([]);
  const [edits, setEdits] = useState<CollaborativeEdit[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket connection with auto-reconnect
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/collaboration`;
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // Join the collaboration session
      wsRef.current?.send(JSON.stringify({
        type: 'join_session',
        sessionId,
        projectType,
        user: {
          id: userId,
          name: userName,
          timestamp: new Date().toISOString()
        }
      }));

      // Start heartbeat
      heartbeatIntervalRef.current = setInterval(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);
    };
    
    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    wsRef.current.onclose = (event) => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      
      // Auto-reconnect unless explicitly closed
      if (event.code !== 1000) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      }
    };
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };
  }, [sessionId, projectType, userId, userName]);

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'user_joined':
        setUsers(prev => {
          if (prev.some(u => u.id === data.user.id)) return prev;
          const newUsers = [...prev, data.user];
          onUserJoin?.(data.user);
          return newUsers;
        });
        break;
      
      case 'user_left':
        setUsers(prev => {
          const filtered = prev.filter(u => u.id !== data.userId);
          onUserLeave?.(data.userId);
          return filtered;
        });
        break;
      
      case 'users_list':
        setUsers(data.users.filter((u: any) => u.id !== userId));
        break;
      
      case 'cursor_update':
        setUsers(prev => prev.map(u => 
          u.id === data.userId 
            ? { ...u, cursor: data.cursor, lastActivity: new Date() }
            : u
        ));
        break;
      
      case 'edit_applied':
        setEdits(prev => {
          const newEdits = [...prev, data.edit];
          onEdit?.(data.edit);
          return newEdits.slice(-50); // Keep last 50 edits
        });
        break;
      
      case 'conflict_detected':
        setConflicts(prev => {
          const newConflicts = [...prev, data.conflict];
          onConflict?.(data.conflict);
          return newConflicts;
        });
        break;
      
      case 'conflict_resolved':
        setConflicts(prev => prev.filter(c => c.id !== data.conflictId));
        break;
        
      case 'pong':
        // Heartbeat response
        break;
    }
  }, [userId, onUserJoin, onUserLeave, onEdit, onConflict]);

  // Send edit to other collaborators
  const sendEdit = useCallback((editType: string, changes: any, target?: string) => {
    if (!isConnected || !wsRef.current) return;

    const edit: CollaborativeEdit = {
      id: `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: editType,
      timestamp: new Date(),
      changes,
      status: 'pending',
      target
    };

    wsRef.current.send(JSON.stringify({
      type: 'apply_edit',
      sessionId,
      edit
    }));

    setEdits(prev => [...prev, edit].slice(-50));
    return edit;
  }, [isConnected, sessionId, userId]);

  // Update cursor position
  const updateCursor = useCallback((x: number, y: number) => {
    if (!isConnected || !wsRef.current) return;

    wsRef.current.send(JSON.stringify({
      type: 'cursor_update',
      sessionId,
      cursor: { x, y }
    }));
  }, [isConnected, sessionId]);

  // Send chat message
  const sendChatMessage = useCallback((message: string) => {
    if (!isConnected || !wsRef.current || !message.trim()) return;

    wsRef.current.send(JSON.stringify({
      type: 'chat_message',
      sessionId,
      message: {
        id: `msg_${Date.now()}`,
        userId,
        userName,
        message: message.trim(),
        timestamp: new Date().toISOString()
      }
    }));
  }, [isConnected, sessionId, userId, userName]);

  // Resolve conflict
  const resolveConflict = useCallback((conflictId: string, resolution: 'accept' | 'reject' | 'merge') => {
    if (!isConnected || !wsRef.current) return;

    wsRef.current.send(JSON.stringify({
      type: 'resolve_conflict',
      sessionId,
      conflictId,
      resolution,
      userId
    }));
  }, [isConnected, sessionId, userId]);

  // Leave session
  const leaveSession = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'leave_session',
        sessionId,
        userId
      }));
      wsRef.current.close(1000);
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
  }, [sessionId, userId]);

  // Initialize connection
  useEffect(() => {
    connect();
    
    return () => {
      leaveSession();
    };
  }, [connect, leaveSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, []);

  return {
    users,
    edits,
    conflicts,
    isConnected,
    connectionStatus,
    sendEdit,
    updateCursor,
    sendChatMessage,
    resolveConflict,
    leaveSession,
    reconnect: connect
  };
}