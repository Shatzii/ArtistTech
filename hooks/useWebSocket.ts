import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: Date;
}

interface UseWebSocketOptions {
  url: string;
  protocols?: string | string[];
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  shouldReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => void;
  subscribe: (eventType: string, callback: (data: any) => void) => () => void;
  unsubscribe: (eventType: string, callback: (data: any) => void) => void;
  reconnect: () => void;
  close: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions): UseWebSocketReturn => {
  const {
    url,
    protocols,
    onOpen,
    onClose,
    onError,
    onMessage,
    shouldReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10
  } = options;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscribersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  const connect = useCallback(() => {
    if (isConnecting || (socket && socket.readyState === WebSocket.OPEN)) {
      return;
    }

    setIsConnecting(true);

    try {
      const ws = new WebSocket(url, protocols);
      setSocket(ws);

      ws.onopen = (event) => {
        setIsConnected(true);
        setIsConnecting(false);
        setReconnectAttempts(0);
        onOpen?.(event);
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        setSocket(null);
        onClose?.(event);

        // Attempt to reconnect if enabled and under max attempts
        if (shouldReconnect && reconnectAttempts < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (event) => {
        setIsConnecting(false);
        onError?.(event);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = {
            type: 'message',
            data: JSON.parse(event.data),
            timestamp: new Date()
          };

          setLastMessage(message);

          // Notify subscribers
          const subscribers = subscribersRef.current.get(message.data.type) || new Set();
          subscribers.forEach(callback => {
            try {
              callback(message.data);
            } catch (error) {
              console.error('WebSocket subscriber callback error:', error);
            }
          });

          onMessage?.(event);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    } catch (error) {
      setIsConnecting(false);
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [url, protocols, onOpen, onClose, onError, onMessage, shouldReconnect, reconnectInterval, maxReconnectAttempts, isConnecting, socket, reconnectAttempts]);

  const sendMessage = useCallback((message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, [socket]);

  const subscribe = useCallback((eventType: string, callback: (data: any) => void) => {
    if (!subscribersRef.current.has(eventType)) {
      subscribersRef.current.set(eventType, new Set());
    }

    subscribersRef.current.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      unsubscribe(eventType, callback);
    };
  }, []);

  const unsubscribe = useCallback((eventType: string, callback: (data: any) => void) => {
    const subscribers = subscribersRef.current.get(eventType);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        subscribersRef.current.delete(eventType);
      }
    }
  }, []);

  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setReconnectAttempts(0);
    connect();
  }, [connect]);

  const close = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (socket) {
      socket.close();
    }

    setSocket(null);
    setIsConnected(false);
    setIsConnecting(false);
  }, [socket]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (socket) {
        socket.close();
      }
    };
  }, [connect, socket]);

  return {
    socket,
    isConnected,
    isConnecting,
    lastMessage,
    sendMessage,
    subscribe,
    unsubscribe,
    reconnect,
    close
  };
};

// Analytics-specific WebSocket hook
interface UseAnalyticsWebSocketOptions {
  onMetricsUpdate?: (metrics: any) => void;
  onAlert?: (alert: any) => void;
  onTrendUpdate?: (trend: any) => void;
  onDashboardUpdate?: (dashboard: any) => void;
}

export const useAnalyticsWebSocket = (options: UseAnalyticsWebSocketOptions = {}) => {
  const {
    onMetricsUpdate,
    onAlert,
    onTrendUpdate,
    onDashboardUpdate
  } = options;

  const {
    isConnected,
    sendMessage,
    subscribe,
    unsubscribe
  } = useWebSocket({
    url: `ws://localhost:8080/analytics`,
    shouldReconnect: true,
    reconnectInterval: 5000,
    maxReconnectAttempts: 20
  });

  useEffect(() => {
    // Subscribe to analytics events
    const unsubscribeMetrics = subscribe('metrics_update', (data) => {
      onMetricsUpdate?.(data);
    });

    const unsubscribeAlerts = subscribe('alert', (data) => {
      onAlert?.(data);
    });

    const unsubscribeTrends = subscribe('trend', (data) => {
      onTrendUpdate?.(data);
    });

    const unsubscribeDashboard = subscribe('dashboard_update', (data) => {
      onDashboardUpdate?.(data);
    });

    return () => {
      unsubscribeMetrics();
      unsubscribeAlerts();
      unsubscribeTrends();
      unsubscribeDashboard();
    };
  }, [subscribe, unsubscribe, onMetricsUpdate, onAlert, onTrendUpdate, onDashboardUpdate]);

  const subscribeToStream = useCallback((streamType: string) => {
    sendMessage({
      type: 'SUBSCRIBE',
      streamType
    });
  }, [sendMessage]);

  const unsubscribeFromStream = useCallback((streamType: string) => {
    sendMessage({
      type: 'UNSUBSCRIBE',
      streamType
    });
  }, [sendMessage]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    sendMessage({
      type: 'ACKNOWLEDGE_ALERT',
      alertId
    });
  }, [sendMessage]);

  const getDashboard = useCallback(() => {
    sendMessage({
      type: 'GET_DASHBOARD'
    });
  }, [sendMessage]);

  return {
    isConnected,
    subscribeToStream,
    unsubscribeFromStream,
    acknowledgeAlert,
    getDashboard,
    sendMessage
  };
};

// Real-time metrics hook with automatic updates
export const useRealTimeMetrics = (platform?: string) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isConnected } = useAnalyticsWebSocket({
    onMetricsUpdate: (data) => {
      setMetrics(prev => {
        const newMetrics = [...prev, data];
        // Keep only last 100 metrics
        return newMetrics.slice(-100);
      });
    }
  });

  useEffect(() => {
    // Fetch initial metrics
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        const url = platform
          ? `/api/analytics/streams/${platform}?limit=50`
          : '/api/analytics/dashboard';

        const response = await fetch(url);
        const data = await response.json();

        if (platform) {
          setMetrics(data.data || []);
        } else {
          setMetrics(data.metrics || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [platform]);

  return {
    metrics,
    isLoading,
    error,
    isConnected
  };
};

// Real-time alerts hook
export const useRealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [unacknowledgedCount, setUnacknowledgedCount] = useState(0);

  const { acknowledgeAlert } = useAnalyticsWebSocket({
    onAlert: (alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 49)]); // Keep last 50 alerts
    }
  });

  useEffect(() => {
    // Fetch initial alerts
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/analytics/dashboard');
        const data = await response.json();
        setAlerts(data.alerts || []);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  useEffect(() => {
    setUnacknowledgedCount(alerts.filter(alert => !alert.acknowledged).length);
  }, [alerts]);

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId);
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        )
      );
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  return {
    alerts,
    unacknowledgedCount,
    acknowledgeAlert: handleAcknowledgeAlert
  };
};

// Real-time trends hook
export const useRealTimeTrends = () => {
  const [trends, setTrends] = useState<any[]>([]);

  useAnalyticsWebSocket({
    onTrendUpdate: (trend) => {
      setTrends(prev => {
        const existingIndex = prev.findIndex(t => t.id === trend.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = trend;
          return updated;
        } else {
          return [trend, ...prev.slice(0, 19)]; // Keep last 20 trends
        }
      });
    }
  });

  useEffect(() => {
    // Fetch initial trends
    const fetchTrends = async () => {
      try {
        const response = await fetch('/api/analytics/trends');
        const data = await response.json();
        setTrends(data);
      } catch (error) {
        console.error('Failed to fetch trends:', error);
      }
    };

    fetchTrends();
  }, []);

  return { trends };
};