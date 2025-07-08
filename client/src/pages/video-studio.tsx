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
  Video, Play, Pause, Square, SkipBack, SkipForward, 
  Volume2, Camera, Film, Edit, Layers, Palette, 
  Sparkles, Upload, Download, Share, Settings,
  Scissors, RotateCw, Maximize, Eye, Zap, Crown, 
  FileVideo, Clock, MonitorPlay, Wand2, Stars
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function VideoStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes
  const [activeTab, setActiveTab] = useState("timeline");
  const [selectedClip, setSelectedClip] = useState<number | null>(null);
  const [zoom, setZoom] = useState([100]);
  const [volume, setVolume] = useState([80]);
  const [projectTitle, setProjectTitle] = useState("My Video Project");
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { data: projectData } = useQuery({
    queryKey: ["/api/studio/video/projects"],
    enabled: true
  });

  const { data: assetsData } = useQuery({
    queryKey: ["/api/studio/video/assets"],
    enabled: true
  });

  const videoClips = [
    { id: 1, name: "Intro Scene", duration: 15, start: 0, track: 1, color: "bg-blue-500" },
    { id: 2, name: "Main Performance", duration: 120, start: 15, track: 1, color: "bg-green-500" },
    { id: 3, name: "B-Roll Footage", duration: 30, start: 135, track: 1, color: "bg-purple-500" },
    { id: 4, name: "Outro Credits", duration: 15, start: 165, track: 1, color: "bg-red-500" }
  ];

  const audioTracks = [
    { id: 1, name: "Main Audio", duration: 180, start: 0, track: 2, color: "bg-orange-500" },
    { id: 2, name: "Background Music", duration: 180, start: 0, track: 3, color: "bg-pink-500" },
    { id: 3, name: "Sound Effects", duration: 60, start: 60, track: 4, color: "bg-cyan-500" }
  ];

  const effects = [
    { id: "color", name: "Color Correction", enabled: true, intensity: 75 },
    { id: "stabilization", name: "Stabilization", enabled: true, intensity: 60 },
    { id: "noise", name: "Noise Reduction", enabled: false, intensity: 40 },
    { id: "sharpen", name: "Sharpen", enabled: true, intensity: 30 },
    { id: "blur", name: "Motion Blur", enabled: false, intensity: 20 },
    { id: "glow", name: "Glow Effect", enabled: false, intensity: 50 }
  ];

  const aiFeatures = [
    { 
      id: "auto-edit", 
      name: "Auto-Edit", 
      description: "AI automatically cuts and arranges clips",
      status: "ready",
      confidence: 94
    },
    { 
      id: "object-tracking", 
      name: "Object Tracking", 
      description: "Track objects and people automatically",
      status: "processing",
      confidence: 87
    },
    { 
      id: "scene-detection", 
      name: "Scene Detection", 
      description: "Automatically detect scene changes",
      status: "ready",
      confidence: 91
    },
    { 
      id: "voice-sync", 
      name: "Voice Sync", 
      description: "Sync audio with lip movements",
      status: "ready",
      confidence: 96
    }
  ];

  const transitions = [
    { id: "cut", name: "Cut", preview: "▌▌" },
    { id: "fade", name: "Fade", preview: "◐◑" },
    { id: "dissolve", name: "Dissolve", preview: "◇◈" },
    { id: "wipe", name: "Wipe", preview: "▶▷" },
    { id: "slide", name: "Slide", preview: "◀▶" },
    { id: "zoom", name: "Zoom", preview: "⬟⬢" }
  ];

  const exportFormats = [
    { id: "4k", name: "4K Ultra HD", resolution: "3840x2160", bitrate: "50 Mbps" },
    { id: "1080p", name: "Full HD", resolution: "1920x1080", bitrate: "25 Mbps" },
    { id: "720p", name: "HD", resolution: "1280x720", bitrate: "15 Mbps" },
    { id: "480p", name: "Standard", resolution: "854x480", bitrate: "8 Mbps" },
    { id: "vertical", name: "Vertical (TikTok)", resolution: "1080x1920", bitrate: "20 Mbps" },
    { id: "square", name: "Square (Instagram)", resolution: "1080x1080", bitrate: "18 Mbps" }
  ];

  // Playback controls
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleClipSelect = (clipId: number) => {
    setSelectedClip(clipId);
  };

  const handleExport = () => {
    console.log("Exporting video project");
  };

  const handleAIProcess = (featureId: string) => {
    console.log("Processing AI feature:", featureId);
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timeline playback simulation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Video className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Video Studio Pro</h1>
              <Badge className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                8K READY
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>Project:</span>
              <Input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-48"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button className="bg-green-600 hover:bg-green-700">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Editor Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Editor Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Video Preview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="relative bg-black rounded-lg aspect-video mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <MonitorPlay className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400">Video Preview</p>
                      <p className="text-sm text-gray-500">Resolution: 1920x1080</p>
                    </div>
                  </div>
                  {selectedClip && (
                    <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                      {videoClips.find(clip => clip.id === selectedClip)?.name}
                    </div>
                  )}
                </div>
                
                {/* Playback Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handlePlayPause}
                      className={`w-10 h-10 rounded-full ${
                        isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button className="w-10 h-10 rounded-full bg-gray-600 hover:bg-gray-700">
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button className="w-10 h-10 rounded-full bg-gray-600 hover:bg-gray-700">
                      <SkipForward className="w-5 h-5" />
                    </Button>
                    <div className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-gray-400" />
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Zoom:</span>
                      <Slider
                        value={zoom}
                        onValueChange={setZoom}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-400">{zoom[0]}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Timeline Ruler */}
                  <div className="relative h-8 bg-gray-700 rounded">
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="text-xs text-gray-400">
                          {formatTime(i * 20)}
                        </div>
                      ))}
                    </div>
                    <div 
                      className="absolute top-0 w-1 h-full bg-red-500 transition-all duration-100"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>

                  {/* Video Track */}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Video</div>
                    <div className="relative h-12 bg-gray-700 rounded">
                      {videoClips.map((clip) => (
                        <div
                          key={clip.id}
                          onClick={() => handleClipSelect(clip.id)}
                          className={`absolute h-full ${clip.color} rounded cursor-pointer transition-all hover:brightness-110 ${
                            selectedClip === clip.id ? 'ring-2 ring-blue-400' : ''
                          }`}
                          style={{
                            left: `${(clip.start / duration) * 100}%`,
                            width: `${(clip.duration / duration) * 100}%`
                          }}
                        >
                          <div className="p-2 text-white text-xs truncate">
                            {clip.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audio Tracks */}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Audio</div>
                    {audioTracks.map((track) => (
                      <div key={track.id} className="relative h-8 bg-gray-700 rounded">
                        <div
                          className={`absolute h-full ${track.color} rounded opacity-75`}
                          style={{
                            left: `${(track.start / duration) * 100}%`,
                            width: `${(track.duration / duration) * 100}%`
                          }}
                        >
                          <div className="p-1 text-white text-xs truncate">
                            {track.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Editor Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gray-800">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="ai">AI Tools</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="effects" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Video Effects</CardTitle>
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
                              value={[effect.intensity]}
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-400 w-8">{effect.intensity}</span>
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
                      AI Video Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiFeatures.map((feature) => (
                        <div key={feature.id} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium">{feature.name}</h4>
                            <Badge className={`${
                              feature.status === 'ready' ? 'bg-green-600' : 
                              feature.status === 'processing' ? 'bg-yellow-600' : 'bg-gray-600'
                            }`}>
                              {feature.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{feature.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Stars className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-400">{feature.confidence}%</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAIProcess(feature.id)}
                              className="bg-purple-600 hover:bg-purple-700"
                              disabled={feature.status === 'processing'}
                            >
                              <Wand2 className="w-4 h-4 mr-1" />
                              Process
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Export Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {exportFormats.map((format) => (
                          <div key={format.id} className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">{format.name}</h4>
                              {format.id === '4k' && (
                                <Crown className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {format.resolution} • {format.bitrate}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t border-gray-600">
                        <Button onClick={handleExport} className="w-full bg-blue-600 hover:bg-blue-700">
                          <Download className="w-4 h-4 mr-2" />
                          Export Video
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transitions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Transitions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {transitions.map((transition) => (
                    <div key={transition.id} className="p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                      <div className="text-center">
                        <div className="text-2xl mb-1">{transition.preview}</div>
                        <div className="text-sm text-white">{transition.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Properties */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Properties</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedClip ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Clip Name</label>
                      <Input
                        value={videoClips.find(c => c.id === selectedClip)?.name || ''}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Duration</label>
                      <Input
                        value={`${videoClips.find(c => c.id === selectedClip)?.duration || 0}s`}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Opacity</label>
                      <Slider value={[100]} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Speed</label>
                      <Slider value={[100]} className="w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Eye className="w-8 h-8 mx-auto mb-2" />
                    <p>Select a clip to edit properties</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Scissors className="w-4 h-4 mr-2" />
                  Split Clip
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Palette className="w-4 h-4 mr-2" />
                  Color Grade
                </Button>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Maximize className="w-4 h-4 mr-2" />
                  Crop & Resize
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}