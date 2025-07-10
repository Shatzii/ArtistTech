import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Music, Play, Pause, Square, RotateCcw, Volume2, Mic, 
  Settings, Save, Upload, Download, Headphones, Piano,
  Disc, Layers, Waves, AudioWaveform, Zap, Sparkles,
  Users, Video, Share, Crown, Star, TrendingUp
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function UltimateMusicStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentProject, setCurrentProject] = useState("Untitled Project");
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState([75]);
  const [activeTab, setActiveTab] = useState("daw");
  const [selectedInstrument, setSelectedInstrument] = useState("piano");
  const [currentPattern, setCurrentPattern] = useState(0);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: projectData } = useQuery({
    queryKey: ["/api/studio/music/projects"],
    enabled: true
  });

  const { data: instrumentData } = useQuery({
    queryKey: ["/api/studio/music/instruments"],
    enabled: true
  });

  // Studio tools and instruments
  const instruments = [
    { id: "piano", name: "Grand Piano", icon: Piano, color: "bg-blue-600" },
    { id: "synthesizer", name: "Synthesizer", icon: Zap, color: "bg-purple-600" },
    { id: "drums", name: "Drum Kit", icon: Disc, color: "bg-red-600" },
    { id: "bass", name: "Bass Guitar", icon: AudioWaveform, color: "bg-green-600" },
    { id: "guitar", name: "Electric Guitar", icon: Waves, color: "bg-orange-600" },
    { id: "strings", name: "String Section", icon: Music, color: "bg-pink-600" }
  ];

  const tracks = [
    { id: 1, name: "Main Melody", instrument: "piano", volume: 85, muted: false, solo: false, pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] },
    { id: 2, name: "Bass Line", instrument: "bass", volume: 72, muted: false, solo: false, pattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] },
    { id: 3, name: "Drum Beat", instrument: "drums", volume: 80, muted: false, solo: false, pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] },
    { id: 4, name: "Synth Pad", instrument: "synthesizer", volume: 60, muted: false, solo: false, pattern: [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0] },
    { id: 5, name: "Lead Guitar", instrument: "guitar", volume: 68, muted: true, solo: false, pattern: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1] },
    { id: 6, name: "Strings", instrument: "strings", volume: 55, muted: false, solo: false, pattern: [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0] }
  ];

  const effects = [
    { id: "reverb", name: "Reverb", enabled: true, value: 30 },
    { id: "delay", name: "Delay", enabled: false, value: 20 },
    { id: "chorus", name: "Chorus", enabled: true, value: 40 },
    { id: "compressor", name: "Compressor", enabled: true, value: 60 },
    { id: "eq", name: "EQ", enabled: true, value: 50 },
    { id: "filter", name: "Filter", enabled: false, value: 70 }
  ];

  const aiSuggestions = [
    { type: "chord", suggestion: "Try adding a Cmaj7 chord at measure 8", confidence: 92 },
    { type: "melody", suggestion: "Consider raising the melody by an octave in the chorus", confidence: 87 },
    { type: "rhythm", suggestion: "Add syncopation to the bass line for more groove", confidence: 85 },
    { type: "arrangement", suggestion: "Bridge section could use string arrangement", confidence: 90 }
  ];

  const collaborators = [
    { id: 1, name: "Sarah Chen", role: "Producer", status: "online", avatar: "SC" },
    { id: 2, name: "Mike Johnson", role: "Mixing Engineer", status: "busy", avatar: "MJ" },
    { id: 3, name: "Alex Rivera", role: "Vocalist", status: "offline", avatar: "AR" }
  ];

  // Initialize waveform visualization
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const drawWaveform = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          for (let i = 0; i < canvas.width; i++) {
            const y = Math.sin(i * 0.02 + Date.now() * 0.001) * 20 + canvas.height / 2;
            if (i === 0) ctx.moveTo(i, y);
            else ctx.lineTo(i, y);
          }
          ctx.stroke();
        };

        const interval = setInterval(drawWaveform, 50);
        return () => clearInterval(interval);
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
  };

  const handleSaveProject = () => {
    console.log("Saving project:", currentProject);
  };

  const handleExportProject = () => {
    console.log("Exporting project");
  };

  const handleInstrumentSelect = (instrumentId: string) => {
    setSelectedInstrument(instrumentId);
  };

  const toggleMute = (trackId: number) => {
    console.log("Toggling mute for track:", trackId);
  };

  const toggleSolo = (trackId: number) => {
    console.log("Toggling solo for track:", trackId);
  };

  const toggleCollaboration = () => {
    setCollaborationMode(!collaborationMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h1 className="text-2xl font-bold text-white">Ultimate Music Studio</h1>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                PRO
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>Project:</span>
              <Input
                value={currentProject}
                onChange={(e) => setCurrentProject(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-48"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleCollaboration}
              variant={collaborationMode ? "default" : "outline"}
              className="bg-green-600 hover:bg-green-700"
            >
              <Users className="w-4 h-4 mr-2" />
              {collaborationMode ? "Exit Collab" : "Collaborate"}
            </Button>
            <Button onClick={handleSaveProject} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleExportProject} className="bg-purple-600 hover:bg-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Studio Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main DAW Section */}
          <div className="xl:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gray-800">
                <TabsTrigger value="daw">DAW</TabsTrigger>
                <TabsTrigger value="instruments">Instruments</TabsTrigger>
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                <TabsTrigger value="mix">Mix & Master</TabsTrigger>
              </TabsList>

              <TabsContent value="daw" className="space-y-4">
                {/* Transport Controls */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={handlePlayPause}
                          className={`w-12 h-12 rounded-full ${
                            isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>
                        <Button
                          onClick={handleRecord}
                          className={`w-12 h-12 rounded-full ${
                            isRecording ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
                          }`}
                        >
                          <Mic className="w-6 h-6" />
                        </Button>
                        <Button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700">
                          <Square className="w-6 h-6" />
                        </Button>
                        <Button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700">
                          <RotateCcw className="w-6 h-6" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">BPM:</span>
                          <Input
                            type="number"
                            value={bpm}
                            onChange={(e) => setBpm(Number(e.target.value))}
                            className="w-20 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-4 h-4 text-gray-400" />
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-400">{volume[0]}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Waveform Display */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Waveform</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-600">
                          {isRecording ? "Recording" : isPlaying ? "Playing" : "Stopped"}
                        </Badge>
                        <Badge className="bg-blue-600">
                          {bpm} BPM
                        </Badge>
                      </div>
                    </div>
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={100}
                      className="w-full h-24 bg-gray-900 rounded"
                    />
                  </CardContent>
                </Card>

                {/* Track Mixer */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Track Mixer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tracks.map((track) => (
                        <div key={track.id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                            {instruments.find(i => i.id === track.instrument)?.icon && (
                              <span className="text-white">
                                {instruments.find(i => i.id === track.instrument)?.icon}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{track.name}</div>
                            <div className="text-sm text-gray-400">{track.instrument}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant={track.muted ? "destructive" : "outline"}
                              onClick={() => toggleMute(track.id)}
                            >
                              M
                            </Button>
                            <Button
                              size="sm"
                              variant={track.solo ? "default" : "outline"}
                              onClick={() => toggleSolo(track.id)}
                            >
                              S
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Slider
                              value={[track.volume]}
                              className="w-24"
                            />
                            <span className="text-sm text-gray-400 w-8">{track.volume}</span>
                          </div>
                          <div className="flex space-x-1">
                            {track.pattern.map((step, index) => (
                              <div
                                key={index}
                                className={`w-4 h-4 rounded ${
                                  step ? "bg-blue-500" : "bg-gray-600"
                                } cursor-pointer`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instruments" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Virtual Instruments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {instruments.map((instrument) => (
                        <div
                          key={instrument.id}
                          onClick={() => handleInstrumentSelect(instrument.id)}
                          className={`p-4 rounded-lg cursor-pointer transition-all ${
                            selectedInstrument === instrument.id
                              ? "bg-blue-600 ring-2 ring-blue-400"
                              : "bg-gray-700 hover:bg-gray-600"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${instrument.color} rounded-lg flex items-center justify-center`}>
                              <instrument.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{instrument.name}</div>
                              <div className="text-sm text-gray-400">Ready to play</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Virtual Keyboard */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Virtual Keyboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-1">
                      {[...Array(12)].map((_, index) => (
                        <div
                          key={index}
                          className={`h-32 cursor-pointer transition-all ${
                            [1, 3, 6, 8, 10].includes(index % 12)
                              ? "w-8 bg-gray-900 hover:bg-gray-800"
                              : "w-12 bg-white hover:bg-gray-100"
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Audio Effects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {effects.map((effect) => (
                        <div key={effect.id} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-medium">{effect.name}</h4>
                            <Button
                              size="sm"
                              variant={effect.enabled ? "default" : "outline"}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {effect.enabled ? "ON" : "OFF"}
                            </Button>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Slider
                              value={[effect.value]}
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-400 w-8">{effect.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                      AI Music Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-purple-600 capitalize">{suggestion.type}</Badge>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-400">{suggestion.confidence}%</span>
                            </div>
                          </div>
                          <p className="text-white">{suggestion.suggestion}</p>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Apply
                            </Button>
                            <Button size="sm" variant="outline">
                              Preview
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mix" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Mix & Master</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Master Volume */}
                      <div>
                        <h4 className="text-white font-medium mb-3">Master Volume</h4>
                        <div className="flex items-center space-x-4">
                          <Volume2 className="w-5 h-5 text-gray-400" />
                          <Slider value={[85]} className="flex-1" />
                          <span className="text-sm text-gray-400 w-8">85</span>
                        </div>
                      </div>
                      
                      {/* EQ Controls */}
                      <div>
                        <h4 className="text-white font-medium mb-3">Master EQ</h4>
                        <div className="grid grid-cols-4 gap-4">
                          {["Low", "Low Mid", "High Mid", "High"].map((band) => (
                            <div key={band} className="text-center">
                              <div className="text-sm text-gray-400 mb-2">{band}</div>
                              <Slider
                                orientation="vertical"
                                value={[50]}
                                className="h-32 mx-auto"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Auto-Mastering */}
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium">AI Auto-Mastering</h4>
                          <Badge className="bg-purple-600">PRO</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Pop/Rock
                          </Button>
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Headphones className="w-4 h-4 mr-2" />
                            Hip-Hop
                          </Button>
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Music className="w-4 h-4 mr-2" />
                            Electronic
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collaboration Panel */}
            {collaborationMode && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Collaborators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center space-x-3 p-2 bg-gray-700 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {collaborator.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{collaborator.name}</div>
                          <div className="text-xs text-gray-400">{collaborator.role}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          collaborator.status === 'online' ? 'bg-green-500' :
                          collaborator.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Audio
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Share className="w-4 h-4 mr-2" />
                  Share Project
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Video className="w-4 h-4 mr-2" />
                  Create Video
                </Button>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Summer Vibes", "Night Drive", "Electronic Dreams", "Jazz Fusion"].map((project) => (
                    <div key={project} className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600">
                      <div className="text-white text-sm">{project}</div>
                      <div className="text-xs text-gray-400">2 hours ago</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}