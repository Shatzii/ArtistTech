import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play, Pause, Square, Mic, Save, Upload, Download, Share2,
  Users, Volume2, Headphones, Settings, Zap, Brain, Cpu,
  Activity, Monitor, Smartphone, Tablet, Globe, Wifi,
  Battery, Signal, HardDrive, Clock, TrendingUp
} from 'lucide-react';

// Device Detection Hook
function useDeviceDetection() {
  const [device, setDevice] = useState({
    type: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    performance: 'high' as 'low' | 'medium' | 'high',
    connection: 'fast' as 'slow' | 'medium' | 'fast',
    battery: 100,
    online: true,
    touch: false
  });

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const connection = (navigator as any).connection;
      
      setDevice({
        type: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
        performance: width < 768 ? 'medium' : 'high',
        connection: connection?.effectiveType === '4g' ? 'fast' : 'medium',
        battery: (navigator as any).getBattery ? 85 : 100,
        online: navigator.onLine,
        touch: 'ontouchstart' in window
      });
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    window.addEventListener('online', updateDevice);
    window.addEventListener('offline', updateDevice);

    return () => {
      window.removeEventListener('resize', updateDevice);
      window.removeEventListener('online', updateDevice);
      window.removeEventListener('offline', updateDevice);
    };
  }, []);

  return device;
}

// Performance Monitor Hook
function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    latency: 0,
    fps: 60,
    memory: 0,
    cpu: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      const memory = (performance as any).memory;
      setMetrics({
        latency: Math.random() * 50 + 10, // Simulated
        fps: 60 - Math.random() * 5,
        memory: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0,
        cpu: Math.random() * 30 + 20
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
}

// Real-time Collaboration Hook
function useCollaboration(studioId: string) {
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulated collaboration data
    setCollaborators([
      { id: 1, name: 'Producer Mike', role: 'Producer', avatar: '🎵', active: true },
      { id: 2, name: 'Vocalist Sarah', role: 'Vocalist', avatar: '🎤', active: false },
      { id: 3, name: 'Engineer Tom', role: 'Engineer', avatar: '🎧', active: true }
    ]);
    setIsConnected(true);
  }, [studioId]);

  return { collaborators, isConnected };
}

interface OptimizedStudioInterfaceProps {
  studioType: 'music' | 'video' | 'visual' | 'dj' | 'podcast' | 'vr' | 'crypto';
  title: string;
  description: string;
  features: string[];
  children?: React.ReactNode;
}

export default function OptimizedStudioInterface({
  studioType,
  title,
  description,
  features,
  children
}: OptimizedStudioInterfaceProps) {
  const device = useDeviceDetection();
  const performance = usePerformanceMonitor();
  const collaboration = useCollaboration(studioType);
  const queryClient = useQueryClient();

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [activeTab, setActiveTab] = useState('workspace');

  // Studio Status Query
  const { data: studioStatus } = useQuery({
    queryKey: [`/api/studio/${studioType}/status`],
    refetchInterval: 5000
  });

  // Play/Pause Mutation
  const playMutation = useMutation({
    mutationFn: async (action: 'play' | 'pause' | 'stop') => 
      await apiRequest(`/api/studio/${studioType}/${action}`, 'POST'),
    onSuccess: (data) => {
      setIsPlaying(data.playing);
      queryClient.invalidateQueries({ queryKey: [`/api/studio/${studioType}/status`] });
    }
  });

  // Record Mutation
  const recordMutation = useMutation({
    mutationFn: async (action: 'start' | 'stop') => 
      await apiRequest(`/api/studio/${studioType}/record`, 'POST', { action }),
    onSuccess: (data) => {
      setIsRecording(data.recording);
    }
  });

  // Save Project Mutation
  const saveMutation = useMutation({
    mutationFn: async (projectData: any) => 
      await apiRequest(`/api/studio/${studioType}/save`, 'POST', projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/studio/${studioType}/projects`] });
    }
  });

  const handlePlay = useCallback(() => {
    playMutation.mutate(isPlaying ? 'pause' : 'play');
  }, [isPlaying, playMutation]);

  const handleRecord = useCallback(() => {
    recordMutation.mutate(isRecording ? 'stop' : 'start');
  }, [isRecording, recordMutation]);

  const handleSave = useCallback(() => {
    saveMutation.mutate({
      name: `${title} Project`,
      type: studioType,
      data: { volume, settings: {} }
    });
  }, [saveMutation, title, studioType, volume]);

  // Adaptive UI based on device
  const getLayoutClass = () => {
    switch (device.type) {
      case 'mobile':
        return 'flex flex-col space-y-4 p-4';
      case 'tablet':
        return 'grid grid-cols-2 gap-6 p-6';
      default:
        return 'grid grid-cols-3 gap-8 p-8';
    }
  };

  const getControlSize = () => device.type === 'mobile' ? 'h-12 w-12' : 'h-10 w-10';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
            <p className="text-slate-400 text-sm">{description}</p>
          </div>
          
          {/* Device Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {device.type === 'mobile' && <Smartphone className="w-4 h-4 text-blue-400" />}
              {device.type === 'tablet' && <Tablet className="w-4 h-4 text-green-400" />}
              {device.type === 'desktop' && <Monitor className="w-4 h-4 text-purple-400" />}
              <Badge variant={device.online ? 'default' : 'destructive'}>
                {device.online ? 'Online' : 'Offline'}
              </Badge>
            </div>
            
            {/* Performance Indicators */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400">{performance.fps.toFixed(0)} FPS</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-slate-400">{performance.latency.toFixed(0)}ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-slate-800/50 border-b border-slate-700">
            <TabsTrigger value="workspace" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Workspace</span>
            </TabsTrigger>
            <TabsTrigger value="collaborate" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Collaborate</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workspace" className="mt-6">
            <div className={getLayoutClass()}>
              {/* Transport Controls */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="w-5 h-5 text-purple-400" />
                    <span>Transport</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={handleRecord}
                      variant={isRecording ? "destructive" : "outline"}
                      size={device.type === 'mobile' ? 'lg' : 'default'}
                      disabled={recordMutation.isPending}
                    >
                      <Mic className={getControlSize()} />
                    </Button>
                    <Button
                      onClick={handlePlay}
                      variant="default"
                      size={device.type === 'mobile' ? 'lg' : 'default'}
                      disabled={playMutation.isPending}
                    >
                      {isPlaying ? <Pause className={getControlSize()} /> : <Play className={getControlSize()} />}
                    </Button>
                    <Button
                      onClick={() => playMutation.mutate('stop')}
                      variant="outline"
                      size={device.type === 'mobile' ? 'lg' : 'default'}
                    >
                      <Square className={getControlSize()} />
                    </Button>
                  </div>
                  
                  {/* Volume Control */}
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Volume2 className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">Volume: {volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Studio Features */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span>Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleSave}
                      variant="outline"
                      size="sm"
                      disabled={saveMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Custom Studio Content */}
            {children && (
              <div className="mt-6">
                {children}
              </div>
            )}
          </TabsContent>

          <TabsContent value="collaborate" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span>Active Collaborators</span>
                    <Badge variant={collaboration.isConnected ? 'default' : 'destructive'}>
                      {collaboration.isConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {collaboration.collaborators.map((collab) => (
                      <div key={collab.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{collab.avatar}</span>
                          <div>
                            <div className="font-medium text-white">{collab.name}</div>
                            <div className="text-sm text-slate-400">{collab.role}</div>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${collab.active ? 'bg-green-500' : 'bg-slate-500'}`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Collaboration Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Video className="w-4 h-4 mr-2" />
                      Start Video Call
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Mic className="w-4 h-4 mr-2" />
                      Voice Chat
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Screen Share
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Sync Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm">Frame Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{performance.fps.toFixed(0)} FPS</div>
                  <Progress value={performance.fps / 60 * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm">Latency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">{performance.latency.toFixed(0)}ms</div>
                  <Progress value={Math.max(0, 100 - performance.latency)} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{performance.memory.toFixed(0)}MB</div>
                  <Progress value={performance.memory / 100 * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{performance.cpu.toFixed(0)}%</div>
                  <Progress value={performance.cpu} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Audio Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Sample Rate</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                      <option>44.1 kHz</option>
                      <option>48 kHz</option>
                      <option>96 kHz</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Buffer Size</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white">
                      <option>64 samples</option>
                      <option>128 samples</option>
                      <option>256 samples</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Performance Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">GPU Acceleration</span>
                    <input type="checkbox" defaultChecked className="accent-purple-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Real-time Processing</span>
                    <input type="checkbox" defaultChecked className="accent-purple-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Background Sync</span>
                    <input type="checkbox" defaultChecked className="accent-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}