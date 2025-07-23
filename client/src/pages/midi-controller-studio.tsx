import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Music, Settings, Zap, Crown, Star, TrendingUp, 
  Gamepad2, Disc, Volume2, Play, Pause, RotateCcw,
  Target, Wifi, BatteryFull, Bluetooth, Usb,
  Layers, Filter, Sparkles, AudioWaveform
} from "lucide-react";

export default function MIDIControllerStudio() {
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [midiLearnMode, setMidiLearnMode] = useState(false);
  const [activeMapping, setActiveMapping] = useState<number | null>(null);
  const [latency, setLatency] = useState(12); // ms
  const queryClient = useQueryClient();

  // Fetch MIDI controller data
  const { data: controllersData } = useQuery({
    queryKey: ["/api/midi/controllers"],
    enabled: true
  });

  const { data: mappingsData } = useQuery({
    queryKey: ["/api/midi/mappings"],
    enabled: true
  });

  // MIDI mapping mutation
  const mapMutation = useMutation({
    mutationFn: async (mappingData: any) => {
      return await apiRequest("/api/midi/create-mapping", {
        method: "POST",
        body: JSON.stringify(mappingData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/midi/mappings"] });
    }
  });

  const controllers = [
    {
      id: "akai-mpk-mini",
      name: "Akai MPK Mini MK3",
      type: "Keyboard Controller",
      status: "connected",
      features: ["25 Keys", "8 Pads", "8 Knobs"],
      color: "bg-green-600"
    },
    {
      id: "novation-launchpad",
      name: "Novation Launchpad Pro",
      type: "Grid Controller",
      status: "connected",
      features: ["64 RGB Pads", "Velocity Sensitive", "After Touch"],
      color: "bg-blue-600"
    },
    {
      id: "arturia-beatstep",
      name: "Arturia BeatStep Pro",
      type: "Sequencer",
      status: "disconnected",
      features: ["16 Steps", "2 Sequences", "Drum Mode"],
      color: "bg-gray-600"
    },
    {
      id: "pioneer-ddj-sx3",
      name: "Pioneer DDJ-SX3",
      type: "DJ Controller",
      status: "connected",
      features: ["4 Channel", "Jog Wheels", "Performance Pads"],
      color: "bg-purple-600"
    }
  ];

  const controlMappings = [
    {
      id: 1,
      controlType: "Knob",
      controlNumber: "CC1",
      parameter: "Master Volume",
      min: 0,
      max: 127,
      curve: "Linear",
      learned: true
    },
    {
      id: 2,
      controlType: "Pad",
      controlNumber: "Note 36",
      parameter: "Kick Drum",
      velocity: true,
      aftertouch: false,
      learned: true
    },
    {
      id: 3,
      controlType: "Fader",
      controlNumber: "CC7",
      parameter: "Filter Cutoff",
      min: 0,
      max: 127,
      curve: "Exponential",
      learned: false
    },
    {
      id: 4,
      controlType: "Button",
      controlNumber: "CC64",
      parameter: "Sustain Pedal",
      toggle: true,
      momentary: false,
      learned: true
    }
  ];

  const presetProfiles = [
    {
      id: "studio-standard",
      name: "Studio Standard",
      description: "General purpose studio controls",
      mappings: 24,
      rating: 4.9
    },
    {
      id: "dj-performance",
      name: "DJ Performance",
      description: "Optimized for live DJ sets",
      mappings: 32,
      rating: 4.8
    },
    {
      id: "producer-workflow",
      name: "Producer Workflow",
      description: "Beat making and production",
      mappings: 28,
      rating: 4.7
    },
    {
      id: "live-looping",
      name: "Live Looping",
      description: "Real-time loop performance",
      mappings: 16,
      rating: 4.6
    }
  ];

  const handleMidiLearn = (mappingId: number) => {
    setMidiLearnMode(true);
    setActiveMapping(mappingId);
    
    // Simulate MIDI learn process
    setTimeout(() => {
      setMidiLearnMode(false);
      setActiveMapping(null);
      // Update mapping as learned
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <Wifi className="w-4 h-4 text-green-400" />;
      case "disconnected": return <Wifi className="w-4 h-4 text-gray-400" />;
      case "pairing": return <Bluetooth className="w-4 h-4 text-blue-400 animate-pulse" />;
      default: return <Usb className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/50 to-purple-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/artist-tech-logo.jpeg" 
              alt="Artist Tech" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">MIDI Controller Studio</h1>
              <p className="text-white/60">Professional hardware integration and mapping</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <BatteryFull className="w-4 h-4 mr-1" />
              {latency}ms Latency
            </Badge>
            <Button 
              onClick={() => setMidiLearnMode(!midiLearnMode)}
              className={`${midiLearnMode ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {midiLearnMode ? (
                <>
                  <Target className="w-4 h-4 mr-2 animate-pulse" />
                  Learning...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  MIDI Learn
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connected Controllers */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Connected Controllers
              </CardTitle>
              <CardDescription>Hardware devices and connection status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {controllers.map(controller => (
                <div 
                  key={controller.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedDevice === controller.id 
                      ? 'bg-purple-600/30 border-purple-400' 
                      : 'bg-black/30 border-purple-500/20 hover:border-purple-400/50'
                  }`}
                  onClick={() => setSelectedDevice(controller.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{controller.name}</h4>
                    {getStatusIcon(controller.status)}
                  </div>
                  
                  <p className="text-sm text-white/60 mb-2">{controller.type}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {controller.features.map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        controller.status === 'connected' 
                          ? 'border-green-500 text-green-400' 
                          : 'border-gray-500 text-gray-400'
                      }`}
                    >
                      {controller.status}
                    </Badge>
                  </div>
                </div>
              ))}
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Bluetooth className="w-4 h-4 mr-2" />
                Scan for Devices
              </Button>
            </CardContent>
          </Card>

          {/* Control Mappings */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="w-5 h-5 mr-2" />
                Control Mappings
              </CardTitle>
              <CardDescription>Configure parameter assignments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {controlMappings.map(mapping => (
                <div key={mapping.id} className="bg-black/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{mapping.controlType}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {mapping.controlNumber}
                      </Badge>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        mapping.learned 
                          ? 'border-green-500 text-green-400' 
                          : 'border-yellow-500 text-yellow-400'
                      }`}
                    >
                      {mapping.learned ? 'Mapped' : 'Unmapped'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-white/70 mb-2">{mapping.parameter}</p>
                  
                  {mapping.controlType === "Knob" || mapping.controlType === "Fader" ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Range: {mapping.min} - {mapping.max}</span>
                        <span>Curve: {mapping.curve}</span>
                      </div>
                      <Slider 
                        value={[65]} 
                        max={127} 
                        className="w-full" 
                        disabled={midiLearnMode && activeMapping === mapping.id}
                      />
                    </div>
                  ) : null}
                  
                  <div className="flex space-x-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-purple-500/30"
                      onClick={() => handleMidiLearn(mapping.id)}
                      disabled={midiLearnMode}
                    >
                      {midiLearnMode && activeMapping === mapping.id ? (
                        <>
                          <Target className="w-3 h-3 mr-1 animate-pulse" />
                          Learning...
                        </>
                      ) : (
                        <>
                          <Target className="w-3 h-3 mr-1" />
                          Learn
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-purple-500/30"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Preset Profiles */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                Preset Profiles
              </CardTitle>
              <CardDescription>Pre-configured mapping sets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {presetProfiles.map(preset => (
                <div key={preset.id} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{preset.name}</h4>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm">{preset.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/70 mb-2">{preset.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {preset.mappings} mappings
                    </Badge>
                    <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                      Professional
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Load Preset
                    </Button>
                    <Button size="sm" variant="outline" className="border-purple-500/30">
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Custom Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Performance Monitor */}
        <Card className="mt-6 bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <AudioWaveform className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-2xl font-bold">{latency}ms</p>
                <p className="text-sm text-white/60">Latency</p>
                <Progress value={((20 - latency) / 20) * 100} className="mt-2 h-1" />
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <Disc className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold">127</p>
                <p className="text-sm text-white/60">MIDI Messages/sec</p>
                <Progress value={65} className="mt-2 h-1" />
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <Volume2 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-2xl font-bold">23%</p>
                <p className="text-sm text-white/60">CPU Usage</p>
                <Progress value={23} className="mt-2 h-1" />
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <BatteryFull className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <p className="text-2xl font-bold">98%</p>
                <p className="text-sm text-white/60">Device Battery</p>
                <Progress value={98} className="mt-2 h-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Test All Controls
              </Button>
              <Button className="w-full" variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
              <Button className="w-full" variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Calibrate Sensitivity
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Global Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Buffer Size</label>
                <select className="w-full bg-black/50 border border-purple-500/30 rounded px-3 py-2 text-sm">
                  <option>64 samples</option>
                  <option>128 samples</option>
                  <option>256 samples</option>
                  <option>512 samples</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Sample Rate</label>
                <select className="w-full bg-black/50 border border-purple-500/30 rounded px-3 py-2 text-sm">
                  <option>44.1 kHz</option>
                  <option>48 kHz</option>
                  <option>88.2 kHz</option>
                  <option>96 kHz</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Controller Info</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDevice ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white/60">Model:</span>
                    <span className="text-sm">{controllers.find(c => c.id === selectedDevice)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/60">Status:</span>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/60">Protocol:</span>
                    <span className="text-sm">USB MIDI 2.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/60">Firmware:</span>
                    <span className="text-sm">v2.1.3</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-white/60 text-center py-8">
                  Select a controller to view details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}