import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface CollaborativeUser {
  id: string;
  name: string;
  email: string;
  cursor?: { x: number; y: number };
  selectedTrack?: number;
  isActive: boolean;
  color: string;
}

export interface CollaborativeEdit {
  id: string;
  userId: string;
  type: 'track_edit' | 'volume_change' | 'effect_change' | 'timeline_edit';
  trackId?: number;
  data: any;
  timestamp: number;
}

export interface CollaborativeSession {
  sessionId: string;
  projectId: string;
  users: CollaborativeUser[];
  edits: CollaborativeEdit[];
  isHost: boolean;
}

export function useCollaborativeSession(projectId: string) {
  const { user } = useAuth();
  const [session, setSession] = useState<CollaborativeSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!user || !projectId) return;

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/collaboration`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to collaborative session');
        setIsConnected(true);
        setConnectionError(null);
        
        // Join the project session
        wsRef.current?.send(JSON.stringify({
          type: 'join_session',
          projectId,
          user: {
            id: user.id || user.email,
            name: user.email,
            email: user.email,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
          }
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('Disconnected from collaborative session');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection failed');
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to connect');
    }
  }, [user, projectId]);

  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'session_joined':
        setSession(message.session);
        break;
      
      case 'user_joined':
        setSession(prev => prev ? {
          ...prev,
          users: [...prev.users, message.user]
        } : null);
        break;
      
      case 'user_left':
        setSession(prev => prev ? {
          ...prev,
          users: prev.users.filter(u => u.id !== message.userId)
        } : null);
        break;
      
      case 'cursor_update':
        setSession(prev => prev ? {
          ...prev,
          users: prev.users.map(u => 
            u.id === message.userId 
              ? { ...u, cursor: message.cursor }
              : u
          )
        } : null);
        break;
      
      case 'track_selection':
        setSession(prev => prev ? {
          ...prev,
          users: prev.users.map(u => 
            u.id === message.userId 
              ? { ...u, selectedTrack: message.trackId }
              : u
          )
        } : null);
        break;
      
      case 'edit_applied':
        setSession(prev => prev ? {
          ...prev,
          edits: [...prev.edits, message.edit]
        } : null);
        break;
      
      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  const sendEdit = useCallback((edit: Omit<CollaborativeEdit, 'id' | 'userId' | 'timestamp'>) => {
    if (!wsRef.current || !user || wsRef.current.readyState !== WebSocket.OPEN) return;

    const fullEdit: CollaborativeEdit = {
      ...edit,
      id: `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id || user.email,
      timestamp: Date.now()
    };

    wsRef.current.send(JSON.stringify({
      type: 'apply_edit',
      edit: fullEdit
    }));
  }, [user]);

  const updateCursor = useCallback((x: number, y: number) => {
    if (!wsRef.current || !user || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({
      type: 'cursor_update',
      cursor: { x, y }
    }));
  }, [user]);

  const selectTrack = useCallback((trackId: number) => {
    if (!wsRef.current || !user || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({
      type: 'track_selection',
      trackId
    }));
  }, [user]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setSession(null);
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (user && projectId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, projectId, connect, disconnect]);

  return {
    session,
    isConnected,
    connectionError,
    sendEdit,
    updateCursor,
    selectTrack,
    connect,
    disconnect
  };
}