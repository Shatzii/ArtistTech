import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Headphones, Zap, Gamepad2, Eye, Hand, Mic,
  Play, Pause, Square, Settings, Volume2, Maximize,
  Users, Globe, Layers, Sparkles, Camera, Monitor,
  Cpu, Radio, Target, BarChart3, RefreshCw, Share2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VREnvironment {
  id: string;
  name: string;
  description: string;
  type: 'studio' | 'stage' | 'gallery' | 'theater';
  users: number;
  maxUsers: number;
  isActive: boolean;
}

interface VRSession {
  id: string;
  title: string;
  participants: number;
  duration: string;
  isRecording: boolean;
  quality: '720p' | '1080p' | '4K' | '8K';
}

interface VRDevice {
  id: string;
  name: string;
  type: 'headset' | 'controller' | 'tracker';
  connected: boolean;
  battery?: number;
  tracking: boolean;
}

export default function VRStudio() {
  const [isVRActive, setIsVRActive] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState('music-studio');
  const [handTracking, setHandTracking] = useState(true);
  const [spatialAudio, setSpatialAudio] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(85);
  const [participants, setParticipants] = useState(3);

  const queryClient = useQueryClient();

  // API Queries
  const { data: environmentsData, isLoading: environmentsLoading } = useQuery({
    queryKey: ['vr-environments'],
    queryFn: () => apiRequest('/api/studio/vr/environments'),
  });

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['vr-sessions'],
    queryFn: () => apiRequest('/api/studio/vr/sessions'),
  });

  const { data: devicesData, isLoading: devicesLoading } = useQuery({
    queryKey: ['vr-devices'],
    queryFn: () => apiRequest('/api/studio/vr/devices'),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['vr-stats'],
    queryFn: () => apiRequest('/api/studio/vr/stats'),
  });

  // API Mutations
  const createSessionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/studio/vr/session', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vr-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['vr-stats'] });
    },
  });

  const controlSessionMutation = useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: any }) =>
      apiRequest(`/api/studio/vr/session/${sessionId}/control`, 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vr-sessions'] });
    },
  });

  // Transform API data to match component expectations
  const vrEnvironments = environmentsData?.environments?.map((env: any) => ({
    id: env.id,
    name: env.name,
    description: `${env.type} environment with ${env.assets} assets`,
    type: env.type === 'music' ? 'studio' : env.type === 'performance' ? 'stage' : env.type === 'futuristic' ? 'gallery' : 'theater',
    users: Math.floor(Math.random() * 50) + 1,
    maxUsers: env.type === 'performance' ? 1000 : env.type === 'futuristic' ? 50 : 8,
    isActive: true
  })) || [];

  const vrSessions = sessionsData?.sessions || [];

  const vrDevices = devicesData?.devices || [];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getEnvironmentIcon = (type: string) => {
    switch (type) {
      case 'studio': return Mic;
      case 'stage': return Radio;
      case 'gallery': return Camera;
      case 'theater': return Monitor;
      default: return Globe;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'headset': return Headphones;
      case 'controller': return Gamepad2;
      case 'tracker': return Target;
      default: return Cpu;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-purple-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">VR Studio Pro</h1>
            <p className="text-sm text-gray-400">Immersive Creative Environment</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant={isVRActive ? "default" : "outline"} className={isVRActive ? "bg-green-500" : ""}>
              <Eye className="w-3 h-3 mr-1" />
              {isVRActive ? "VR Active" : "VR Inactive"}
            </Badge>
            <Switch checked={isVRActive} onCheckedChange={setIsVRActive} />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Active Users</div>
            <div className="text-xl font-bold text-purple-400">{participants}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <Tabs defaultValue="environments" className="w-full">
            <TabsList className="grid grid-cols-5 w-full bg-black/30">
              <TabsTrigger value="environments">Environments</TabsTrigger>
              <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
              <TabsTrigger value="devices">Hardware</TabsTrigger>
              <TabsTrigger value="spatial">Spatial Audio</TabsTrigger>
              <TabsTrigger value="settings">VR Settings</TabsTrigger>
            </TabsList>

            {/* Environments Tab */}
            <TabsContent value="environments" className="space-y-6">
              {environmentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-400">Loading VR environments...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vrEnvironments.map((environment) => {
                    const IconComponent = getEnvironmentIcon(environment.type);
                    return (
                      <Card key={environment.id} className={`bg-black/40 border-purple-500/20 cursor-pointer transition-all ${
                        selectedEnvironment === environment.id ? 'border-purple-500 bg-purple-500/10' : ''
                      }`} onClick={() => setSelectedEnvironment(environment.id)}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-6 h-6 text-purple-400" />
                              <CardTitle className="text-white">{environment.name}</CardTitle>
                            </div>
                            <Badge variant={environment.isActive ? "default" : "outline"}>
                              {environment.isActive ? "Active" : "Offline"}
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-400">
                            {environment.description}
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Participants</span>
                          <span className="text-white font-bold">
                            {environment.users}/{environment.maxUsers}
                          </span>
                        </div>
                        <Progress 
                          value={(environment.users / environment.maxUsers) * 100} 
                          className="h-2" 
                        />
                        
                        <div className="flex space-x-2">
                          <Button 
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                            disabled={!environment.isActive}
                            onClick={() => createSessionMutation.mutate({
                              environmentId: environment.id,
                              mode: 'single',
                              participants: 1
                            })}
                          >
                            {createSessionMutation.isPending ? (
                              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <Globe className="w-4 h-4 mr-2" />
                            )}
                            Enter VR
                          </Button>
                          {environment.type === 'stage' && (
                            <Button variant="outline" className="text-purple-400 border-purple-500">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                </div>
              )}

              {/* Quick Actions */}
              <Card className="bg-black/40 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Quick VR Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    <Square className="w-4 h-4 mr-2" />
                    Record VR
                  </Button>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Invite Others
                  </Button>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Enhance
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="space-y-6">
              <div className="space-y-4">
                  {vrSessions.map((session) => (
                    <Card key={session.id} className="bg-black/40 border-purple-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg">{session.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {session.participants} participants
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {session.duration}
                              </span>
                              <Badge variant={session.isRecording ? "destructive" : "outline"}>
                                {session.isRecording ? "Recording" : "Live"}
                            </Badge>
                            <Badge variant="secondary">
                              {session.quality}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" className="text-purple-400 border-purple-500">
                            <Eye className="w-4 h-4 mr-2" />
                            Watch
                          </Button>
                          <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                            <Users className="w-4 h-4 mr-2" />
                            Join VR
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-black/40 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Create New VR Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Session Title</label>
                      <Input 
                        placeholder="Enter session name..."
                        className="bg-black/60 border-purple-500/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Max Participants</label>
                      <Input 
                        type="number"
                        placeholder="8"
                        className="bg-black/60 border-purple-500/30 text-white"
                      />
                    </div>
                  </div>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    <Globe className="w-4 h-4 mr-2" />
                    Launch VR Session
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Devices Tab */}
            <TabsContent value="devices" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vrDevices.map((device) => {
                  const IconComponent = getDeviceIcon(device.type);
                  return (
                    <Card key={device.id} className="bg-black/40 border-purple-500/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-6 h-6 text-purple-400" />
                            <CardTitle className="text-white">{device.name}</CardTitle>
                          </div>
                          <Badge variant={device.connected ? "default" : "outline"}>
                            {device.connected ? "Connected" : "Disconnected"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {device.battery && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Battery</span>
                              <span className="text-white">{device.battery}%</span>
                            </div>
                            <Progress value={device.battery} className="h-2" />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Tracking</span>
                          <Badge variant={device.tracking ? "default" : "outline"}>
                            {device.tracking ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <Button 
                          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                          disabled={!device.connected}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Spatial Audio Tab */}
            <TabsContent value="spatial" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Volume2 className="w-5 h-5 mr-2" />
                      3D Audio Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-300">Spatial Audio</label>
                        <Switch checked={spatialAudio} onCheckedChange={setSpatialAudio} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-gray-300">Room Size</label>
                          <span className="text-white">Large</span>
                        </div>
                        <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-gray-300">Reverb</label>
                          <span className="text-white">60%</span>
                        </div>
                        <Slider defaultValue={[60]} max={100} step={1} className="w-full" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-gray-300">Distance Attenuation</label>
                          <span className="text-white">45%</span>
                        </div>
                        <Slider defaultValue={[45]} max={100} step={1} className="w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Headphones className="w-5 h-5 mr-2" />
                      Audio Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {['Master Output', 'Voice Chat', 'Music', 'Environment', 'Effects'].map((source, i) => (
                        <div key={source} className="flex items-center justify-between p-3 bg-black/60 rounded">
                          <span className="text-white">{source}</span>
                          <div className="flex items-center space-x-2">
                            <Slider 
                              defaultValue={[85 - i * 10]} 
                              max={100} 
                              step={1} 
                              className="w-20" 
                            />
                            <span className="text-gray-400 text-sm w-8">{85 - i * 10}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Hand className="w-5 h-5 mr-2" />
                      Interaction Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Hand Tracking</label>
                      <Switch checked={handTracking} onCheckedChange={setHandTracking} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-gray-300">Haptic Feedback</label>
                        <span className="text-white">{hapticFeedback}%</span>
                      </div>
                      <Slider 
                        value={[hapticFeedback]} 
                        onValueChange={(value) => setHapticFeedback(value[0])}
                        max={100} 
                        step={1} 
                        className="w-full" 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Eye Tracking</label>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Voice Commands</label>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Monitor className="w-5 h-5 mr-2" />
                      Display Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-gray-300">Refresh Rate</label>
                      <select className="w-full bg-black/60 border border-purple-500/30 rounded p-2 text-white">
                        <option>90 Hz</option>
                        <option>120 Hz</option>
                        <option>144 Hz</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-300">Resolution</label>
                      <select className="w-full bg-black/60 border border-purple-500/30 rounded p-2 text-white">
                        <option>1920x1080 per eye</option>
                        <option>2560x1440 per eye</option>
                        <option>3840x2160 per eye</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-gray-300">Brightness</label>
                        <span className="text-white">75%</span>
                      </div>
                      <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Motion Smoothing</label>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Panel */}
        <div className="w-80 p-6 bg-black/60 border-l border-purple-500/20 space-y-6">
          {/* VR Status */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                VR Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Frame Rate</span>
                <span className="text-green-400 font-bold">90 FPS</span>
              </div>
              <Progress value={90} className="h-2" />
              
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Latency</span>
                <span className="text-blue-400 font-bold">12ms</span>
              </div>
              <Progress value={25} className="h-2" />
              
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">GPU Usage</span>
                <span className="text-yellow-400 font-bold">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </CardContent>
          </Card>

          {/* Quick Controls */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Quick Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Enter VR Mode
              </Button>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white" size="sm">
                <Square className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Stream Live
              </Button>
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Calibrate
              </Button>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Active in VR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white">User {i + 1}</span>
                  <span className="text-gray-400 ml-auto">Music Studio</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}