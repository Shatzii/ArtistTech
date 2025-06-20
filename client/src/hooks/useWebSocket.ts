import { useState, useEffect, useRef, useCallback } from "react";

interface WebSocketMessage {
  type: string;
  payload?: any;
  timestamp?: Date;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export function useWebSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  autoReconnect = true,
  reconnectInterval = 3000
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<WebSocketMessage[]>([]);

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        onConnect?.();

        // Send queued messages
        while (messageQueueRef.current.length > 0) {
          const message = messageQueueRef.current.shift();
          if (message && wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
          }
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        onDisconnect?.();

        if (autoReconnect) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection failed');
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to connect');
    }
  }, [url, onMessage, onConnect, onDisconnect, autoReconnect, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      // Queue message if not connected
      messageQueueRef.current.push(message);
    }
  }, []);

  const sendAuth = useCallback((userId: string, userType: 'teacher' | 'student', userName: string, token: string) => {
    sendMessage({
      type: 'auth',
      payload: { userId, userType, userName, token }
    });
  }, [sendMessage]);

  const joinClassroom = useCallback((classroomId: string) => {
    sendMessage({
      type: 'join_classroom',
      payload: { classroomId }
    });
  }, [sendMessage]);

  const leaveClassroom = useCallback(() => {
    sendMessage({
      type: 'leave_classroom',
      payload: {}
    });
  }, [sendMessage]);

  const startLiveClass = useCallback((topic: string) => {
    sendMessage({
      type: 'start_live_class',
      payload: { topic }
    });
  }, [sendMessage]);

  const endLiveClass = useCallback(() => {
    sendMessage({
      type: 'end_live_class',
      payload: {}
    });
  }, [sendMessage]);

  const sendChatMessage = useCallback((message: string, type: 'text' | 'audio' | 'share' = 'text') => {
    sendMessage({
      type: 'chat_message',
      payload: { message, type }
    });
  }, [sendMessage]);

  const shareContent = useCallback((title: string, contentType: string, url?: string, data?: any) => {
    sendMessage({
      type: 'share_content',
      payload: { title, contentType, url, data }
    });
  }, [sendMessage]);

  const updateMediaState = useCallback((audioEnabled: boolean, videoEnabled: boolean) => {
    sendMessage({
      type: 'update_media_state',
      payload: { audioEnabled, videoEnabled }
    });
  }, [sendMessage]);

  const raiseHand = useCallback((raised: boolean) => {
    sendMessage({
      type: 'raise_hand',
      payload: { raised }
    });
  }, [sendMessage]);

  const muteStudent = useCallback((studentId: string) => {
    sendMessage({
      type: 'mute_student',
      payload: { studentId }
    });
  }, [sendMessage]);

  const requestStudentVideo = useCallback((studentId: string) => {
    sendMessage({
      type: 'request_student_video',
      payload: { studentId }
    });
  }, [sendMessage]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionError,
    sendMessage,
    sendAuth,
    joinClassroom,
    leaveClassroom,
    startLiveClass,
    endLiveClass,
    sendChatMessage,
    shareContent,
    updateMediaState,
    raiseHand,
    muteStudent,
    requestStudentVideo,
    connect,
    disconnect
  };
}