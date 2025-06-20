import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Music, Settings, Gamepad2, Sliders, Circle, Square, RotateCcw, Play, Pause, Volume2, Lightbulb } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface MIDIDevice {
  id: string;
  name: string;
  manufacturer: string;
  type: 'controller' | 'keyboard' | 'drum_pad' | 'fader_bank' | 'transport';
  inputs: number;
  outputs: number;
  connected: boolean;
  lastActivity: Date;
  capabilities: MIDICapability[];
  presets: MIDIPreset[];
}

interface MIDICapability {
  type: 'note' | 'cc' | 'pitchbend' | 'aftertouch' | 'program_change' | 'sysex';
  channel?: number;
  range?: { min: number; max: number };
  resolution?: number;
}

interface MIDIPreset {
  id: string;
  name: string;
  deviceId: string;
  mappings: MIDIMapping[];
  scenes: MIDIScene[];
}

interface MIDIMapping {
  id: string;
  midiCC: number;
  midiChannel: number;
  targetType: 'mixer' | 'effect' | 'transport' | 'ai_engine' | 'custom';
  targetParameter: string;
  valueMapping: ValueMapping;
  feedbackEnabled: boolean;
  feedbackColor?: string;
}

interface ValueMapping {
  inputMin: number;
  inputMax: number;
  outputMin: number;
  outputMax: number;
  curve: 'linear' | 'logarithmic' | 'exponential' | 'custom';
  steps?: number;
}

interface MIDIScene {
  id: string;
  name: string;
  mappings: MIDIMapping[];
  parameters: Record<string, any>;
}

interface MIDIStatus {
  connectedDevices: number;
  activeMappings: number;
  activePresets: number;
  supportedProfiles: number;
  recordingMode: boolean;
  recordedMessages: number;
  capabilities: string[];
}

export default function MIDIController() {
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [learningMode, setLearningMode] = useState(false);
  const [learningParameter, setLearningParameter] = useState("");
  const [midiSocket, setMidiSocket] = useState<WebSocket | null>(null);
  const [midiMessages, setMidiMessages] = useState<any[]>([]);
  
  const queryClient = useQueryClient();

  // Fetch connected MIDI devices
  const { data: devices = [] } = useQuery<MIDIDevice[]>({
    queryKey: ['/api/midi/devices'],
    refetchInterval: 5000
  });

  // Fetch hardware profiles
  const { data: profiles = [] } = useQuery<string[]>({
    queryKey: ['/api/midi/profiles']
  });

  // Fetch MIDI engine status
  const { data: midiStatus } = useQuery<MIDIStatus>({
    queryKey: ['/api/midi/status'],
    refetchInterval: 3000
  });

  // Export mappings mutation
  const exportMappings = useMutation({
    mutationFn: async (deviceId?: string) => {
      const response = await fetch('/api/midi/mappings/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId })
      });
      return response.json();
    },
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `midi-mappings-${selectedDevice || 'all'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });

  // Import mappings mutation
  const importMappings = useMutation({
    mutationFn: async (mappings: any) => {
      const response = await fetch('/api/midi/mappings/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappings })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/midi/status'] });
    }
  });

  // Setup WebSocket connection for real-time MIDI
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/midi-ws`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('MIDI WebSocket connected');
      setMidiSocket(ws);
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMidiMessages(prev => [message, ...prev.slice(0, 99)]); // Keep last 100 messages
    };
    
    ws.onclose = () => {
      console.log('MIDI WebSocket disconnected');
      setMidiSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const mappings = JSON.parse(e.target?.result as string);
          importMappings.mutate(mappings);
        } catch (error) {
          console.error('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const startMIDILearning = (parameter: string) => {
    setLearningMode(true);
    setLearningParameter(parameter);
    
    if (midiSocket) {
      midiSocket.send(JSON.stringify({
        type: 'start_learning',
        targetParameter: parameter
      }));
    }
  };

  const stopMIDILearning = () => {
    setLearningMode(false);
    setLearningParameter("");
    
    if (midiSocket) {
      midiSocket.send(JSON.stringify({
        type: 'stop_learning'
      }));
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'keyboard': return <Music className="h-5 w-5" />;
      case 'drum_pad': return <Circle className="h-5 w-5" />;
      case 'fader_bank': return <Sliders className="h-5 w-5" />;
      case 'transport': return <Play className="h-5 w-5" />;
      default: return <Gamepad2 className="h-5 w-5" />;
    }
  };

  const getCapabilityIcon = (type: string) => {
    switch (type) {
      case 'note': return <Music className="h-4 w-4" />;
      case 'cc': return <RotateCcw className="h-4 w-4" />;
      case 'pitchbend': return <Volume2 className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">MIDI Controller Studio</h1>
          <p className="text-muted-foreground">Professional hardware integration and mapping</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={midiSocket ? "default" : "secondary"}>
            {midiSocket ? "Connected" : "Disconnected"}
          </Badge>
          {midiStatus && (
            <Badge variant="outline">
              {midiStatus.connectedDevices} Device{midiStatus.connectedDevices !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="mappings">Mappings</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <Card key={device.id} className={`transition-all ${selectedDevice === device.id ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                    </div>
                    <Badge variant={device.connected ? "default" : "secondary"}>
                      {device.connected ? "Connected" : "Offline"}
                    </Badge>
                  </div>
                  <CardDescription>{device.manufacturer}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Inputs: {device.inputs}</span>
                    <span>Outputs: {device.outputs}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Capabilities</Label>
                    <div className="flex flex-wrap gap-1">
                      {device.capabilities.map((cap, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {getCapabilityIcon(cap.type)}
                          <span className="ml-1">{cap.type.toUpperCase()}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant={selectedDevice === device.id ? "secondary" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedDevice(selectedDevice === device.id ? "" : device.id)}
                  >
                    {selectedDevice === device.id ? "Selected" : "Select Device"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {devices.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Gamepad2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No MIDI Devices Detected</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Connect a MIDI controller to your computer and it will appear here automatically.
                  Supported devices include keyboards, drum pads, mixers, and control surfaces.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mappings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>MIDI Parameter Mapping</CardTitle>
              <CardDescription>
                Map MIDI controls to application parameters with advanced value transformation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Quick Parameter Mapping</Label>
                  
                  <div className="space-y-3">
                    {[
                      { name: "Master Volume", param: "master_volume", icon: <Volume2 className="h-4 w-4" /> },
                      { name: "AI Video Style", param: "ai_video_style", icon: <Lightbulb className="h-4 w-4" /> },
                      { name: "Transport Play", param: "transport_play", icon: <Play className="h-4 w-4" /> },
                      { name: "Reverb Wet", param: "reverb_wet", icon: <Volume2 className="h-4 w-4" /> }
                    ].map((item) => (
                      <div key={item.param} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant={learningMode && learningParameter === item.param ? "secondary" : "outline"}
                          onClick={() => 
                            learningMode && learningParameter === item.param 
                              ? stopMIDILearning() 
                              : startMIDILearning(item.param)
                          }
                        >
                          {learningMode && learningParameter === item.param ? "Stop Learning" : "Learn"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Mapping Configuration</Label>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="target-type">Target Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mixer">Mixer</SelectItem>
                          <SelectItem value="effect">Effects</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="ai_engine">AI Engine</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="curve-type">Response Curve</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select curve" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linear">Linear</SelectItem>
                          <SelectItem value="logarithmic">Logarithmic</SelectItem>
                          <SelectItem value="exponential">Exponential</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="feedback" />
                      <Label htmlFor="feedback">Enable LED Feedback</Label>
                    </div>
                  </div>
                </div>
              </div>

              {learningMode && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Circle className="h-4 w-4 animate-pulse text-primary" />
                    <span className="font-medium">MIDI Learn Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Move a control on your MIDI device to map it to: <strong>{learningParameter}</strong>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preset Management</CardTitle>
              <CardDescription>
                Save, load, and share custom MIDI mapping configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Button onClick={() => exportMappings.mutate(selectedDevice)}>
                  Export Mappings
                </Button>
                
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                    id="import-file"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="import-file" className="cursor-pointer">
                      Import Mappings
                    </label>
                  </Button>
                </div>
              </div>

              {midiStatus && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{midiStatus.activeMappings}</div>
                    <div className="text-sm text-muted-foreground">Active Mappings</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{midiStatus.activePresets}</div>
                    <div className="text-sm text-muted-foreground">Saved Presets</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{midiStatus.supportedProfiles}</div>
                    <div className="text-sm text-muted-foreground">Hardware Profiles</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{profiles.length}</div>
                    <div className="text-sm text-muted-foreground">Available Profiles</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time MIDI Monitor</CardTitle>
              <CardDescription>
                Live view of incoming MIDI messages and system activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {midiStatus && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>Recording Mode</span>
                    <Badge variant={midiStatus.recordingMode ? "default" : "secondary"}>
                      {midiStatus.recordingMode ? `Recording (${midiStatus.recordedMessages})` : "Idle"}
                    </Badge>
                  </div>
                )}

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {midiMessages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No MIDI messages received. Try moving a control on your device.
                    </div>
                  ) : (
                    midiMessages.map((message, index) => (
                      <div key={index} className="flex items-center justify-between p-2 text-sm border rounded">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{message.type}</Badge>
                          <span>Channel: {message.message?.channel || 'N/A'}</span>
                          <span>Value: {message.message?.value || 'N/A'}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {midiStatus && (
        <Card>
          <CardHeader>
            <CardTitle>System Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {midiStatus.capabilities.map((capability, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-primary text-primary" />
                  <span className="text-sm">{capability}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}