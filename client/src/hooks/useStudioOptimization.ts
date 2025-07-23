import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 60,
    latency: 0,
    memory: 0,
    cpu: 0,
    renderTime: 0,
    audioDropouts: 0
  });

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationId: number;
    
    const measurePerformance = () => {
      const now = performance.now();
      const delta = now - lastTime.current;
      
      frameCount.current++;
      
      // Calculate FPS every second
      if (delta >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / delta);
        frameCount.current = 0;
        lastTime.current = now;
        
        setMetrics(prev => ({
          ...prev,
          fps,
          latency: Math.random() * 20 + 5, // Simulated
          memory: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0,
          cpu: Math.random() * 40 + 10,
          renderTime: delta / frameCount.current
        }));
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };

    measurePerformance();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return metrics;
}

// Device detection with capabilities
export function useDeviceDetection() {
  const [device, setDevice] = useState({
    type: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    os: 'unknown' as 'windows' | 'mac' | 'linux' | 'ios' | 'android' | 'unknown',
    browser: 'unknown' as 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown',
    performance: 'high' as 'low' | 'medium' | 'high',
    connection: 'fast' as 'slow' | 'medium' | 'fast',
    battery: 100,
    online: true,
    touch: false,
    webgl: false,
    webassembly: false,
    audioContext: false,
    gamepad: false
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const connection = (navigator as any).connection;
      
      // Device type detection
      let type: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (width < 768) type = 'mobile';
      else if (width < 1024) type = 'tablet';

      // OS detection
      let os: typeof device.os = 'unknown';
      if (userAgent.includes('windows')) os = 'windows';
      else if (userAgent.includes('mac')) os = 'mac';
      else if (userAgent.includes('linux')) os = 'linux';
      else if (userAgent.includes('iphone') || userAgent.includes('ipad')) os = 'ios';
      else if (userAgent.includes('android')) os = 'android';

      // Browser detection
      let browser: typeof device.browser = 'unknown';
      if (userAgent.includes('chrome')) browser = 'chrome';
      else if (userAgent.includes('firefox')) browser = 'firefox';
      else if (userAgent.includes('safari')) browser = 'safari';
      else if (userAgent.includes('edge')) browser = 'edge';

      // Performance estimation
      const cores = navigator.hardwareConcurrency || 4;
      const memory = (navigator as any).deviceMemory || 4;
      let performance: typeof device.performance = 'medium';
      if (cores >= 8 && memory >= 8) performance = 'high';
      else if (cores >= 4 && memory >= 4) performance = 'medium';
      else performance = 'low';

      // Feature detection
      const canvas = document.createElement('canvas');
      const webgl = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      const webassembly = typeof WebAssembly === 'object';
      const audioContext = !!(window.AudioContext || (window as any).webkitAudioContext);

      setDevice({
        type,
        os,
        browser,
        performance,
        connection: connection?.effectiveType === '4g' ? 'fast' : 'medium',
        battery: 100, // Would need battery API
        online: navigator.onLine,
        touch: 'ontouchstart' in window,
        webgl,
        webassembly,
        audioContext,
        gamepad: 'getGamepads' in navigator
      });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    window.addEventListener('online', detectDevice);
    window.addEventListener('offline', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('online', detectDevice);
      window.removeEventListener('offline', detectDevice);
    };
  }, []);

  return device;
}

// Real-time collaboration with WebSocket
export function useRealTimeCollaboration(studioId: string) {
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [cursors, setCursors] = useState<Map<string, { x: number, y: number, user: string }>>(new Map());
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/collaborate/${studioId}`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('Collaboration WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'user_joined':
            setCollaborators(prev => [...prev.filter(c => c.id !== data.user.id), data.user]);
            break;
          case 'user_left':
            setCollaborators(prev => prev.filter(c => c.id !== data.userId));
            break;
          case 'cursor_move':
            setCursors(prev => new Map(prev.set(data.userId, data.position)));
            break;
          case 'collaborators_list':
            setCollaborators(data.collaborators);
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log('Collaboration WebSocket disconnected');
    };

    // Send join message
    const joinMessage = {
      type: 'join',
      studioId,
      user: {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: 'Anonymous User',
        avatar: '👤'
      }
    };

    const sendJoin = () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(joinMessage));
      }
    };

    // Wait for connection then send join
    setTimeout(sendJoin, 1000);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [studioId]);

  const sendCursorPosition = useCallback((x: number, y: number) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'cursor_move',
        position: { x, y }
      }));
    }
  }, []);

  const sendEdit = useCallback((editData: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'edit',
        data: editData
      }));
    }
  }, []);

  return {
    collaborators,
    isConnected,
    cursors,
    sendCursorPosition,
    sendEdit
  };
}

// Audio optimization hook
export function useAudioOptimization() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0));

  useEffect(() => {
    const initAudio = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass({
          sampleRate: 44100,
          latencyHint: 'interactive'
        });

        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 2048;
        
        setAudioContext(ctx);
        setAnalyser(analyserNode);
        setAudioData(new Uint8Array(analyserNode.frequencyBinCount));
      } catch (error) {
        console.error('Audio initialization error:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const getAudioAnalysis = useCallback(() => {
    if (analyser && audioData) {
      analyser.getByteFrequencyData(audioData);
      return {
        frequencies: Array.from(audioData),
        volume: audioData.reduce((sum, val) => sum + val, 0) / audioData.length,
        peak: Math.max(...audioData)
      };
    }
    return null;
  }, [analyser, audioData]);

  return {
    audioContext,
    analyser,
    getAudioAnalysis,
    isSupported: !!(window.AudioContext || (window as any).webkitAudioContext)
  };
}

// Studio state management
export function useStudioState(studioType: string) {
  const [localState, setLocalState] = useState<any>({});
  const [isDirty, setIsDirty] = useState(false);

  // Query for studio status
  const { data: studioStatus, refetch } = useQuery({
    queryKey: [`/api/studio/${studioType}/status`],
    refetchInterval: 5000
  });

  // Auto-save mutation
  const autoSaveMutation = useMutation({
    mutationFn: async (state: any) => 
      await apiRequest(`/api/studio/${studioType}/autosave`, 'POST', state),
    onSuccess: () => {
      setIsDirty(false);
    }
  });

  // Update local state and mark as dirty
  const updateState = useCallback((updates: any) => {
    setLocalState(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  // Auto-save every 30 seconds if dirty
  useEffect(() => {
    if (!isDirty) return;

    const autoSaveTimer = setTimeout(() => {
      autoSaveMutation.mutate(localState);
    }, 30000);

    return () => clearTimeout(autoSaveTimer);
  }, [isDirty, localState, autoSaveMutation]);

  return {
    studioStatus,
    localState,
    isDirty,
    updateState,
    refetch,
    save: () => autoSaveMutation.mutate(localState)
  };
}

// Gesture recognition for touch devices
export function useGestureRecognition() {
  const [gestures, setGestures] = useState<{
    pinch: number;
    rotation: number;
    pan: { x: number; y: number };
  }>({
    pinch: 1,
    rotation: 0,
    pan: { x: 0, y: 0 }
  });

  const lastTouches = useRef<TouchList | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    lastTouches.current = e.touches;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!lastTouches.current || e.touches.length !== lastTouches.current.length) return;

    if (e.touches.length === 2) {
      // Pinch gesture
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const lastTouch1 = lastTouches.current[0];
      const lastTouch2 = lastTouches.current[1];

      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      const lastDistance = Math.sqrt(
        Math.pow(lastTouch2.clientX - lastTouch1.clientX, 2) +
        Math.pow(lastTouch2.clientY - lastTouch1.clientY, 2)
      );

      const pinchScale = currentDistance / lastDistance;

      setGestures(prev => ({
        ...prev,
        pinch: prev.pinch * pinchScale
      }));
    }

    lastTouches.current = e.touches;
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastTouches.current = null;
  }, []);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return gestures;
}

// Keyboard shortcuts
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = [
        e.ctrlKey && 'ctrl',
        e.shiftKey && 'shift',
        e.altKey && 'alt',
        e.metaKey && 'meta',
        e.key.toLowerCase()
      ].filter(Boolean).join('+');

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}