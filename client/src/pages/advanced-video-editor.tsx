import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Video, Play, Pause, Square, RotateCcw, Upload, Download,
  Scissors, Copy, Layers, Settings, Zap, Sparkles, Crown,
  Film, Camera, Mic, Volume2, Clock, Move, Maximize2,
  Palette, Sun, Contrast, Filter, TrendingUp, Save
} from "lucide-react";

export default function AdvancedVideoEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes
  const [selectedClip, setSelectedClip] = useState<number | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch video projects
  const { data: videoProjects } = useQuery({
    queryKey: ["/api/video/projects"],
    enabled: true
  });

  const { data: videoEffects } = useQuery({
    queryKey: ["/api/video/effects"],
    enabled: true
  });

  // Video processing mutation
  const processMutation = useMutation({
    mutationFn: async (processData: any) => {
      return await apiRequest("/api/video/process", {
        method: "POST",
        body: JSON.stringify(processData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/video/projects"] });
    }
  });

  const videoClips = [
    {
      id: 1,
      name: "Intro Sequence",
      startTime: 0,
      duration: 45,
      track: 1,
      type: "video",
      color: "bg-blue-600",
      effects: ["fade_in", "color_correction"]
    },
    {
      id: 2,
      name: "Main Content",
      startTime: 45,
      duration: 180,
      track: 1,
      type: "video",
      color: "bg-green-600",
      effects: ["stabilization"]
    },
    {
      id: 3,
      name: "Background Music",
      startTime: 0,
      duration: 300,
      track: 2,
      type: "audio",
      color: "bg-purple-600",
      effects: ["normalize", "eq"]
    },
    {
      id: 4,
      name: "Outro Graphics",
      startTime: 225,
      duration: 75,
      track: 3,
      type: "graphics",
      color: "bg-orange-600",
      effects: ["fade_in", "fade_out"]
    }
  ];

  const aiFeatures = [
    { 
      id: "auto-edit", 
      name: "Auto-Edit", 
      description: "AI creates optimal cuts and transitions",
      confidence: 94,
      icon: Scissors 
    },
    { 
      id: "object-tracking", 
      name: "Object Tracking", 
      description: "Automatically track and follow subjects",
      confidence: 91,
      icon: Camera 
    },
    { 
      id: "scene-detection", 
      name: "Scene Detection", 
      description: "Identify and separate different scenes",
      confidence: 89,
      icon: Film 
    },
    { 
      id: "color-match", 
      name: "Color Match", 
      description: "Match colors across different clips",
      confidence: 96,
      icon: Palette 
    },
    { 
      id: "noise-reduction", 
      name: "Noise Reduction", 
      description: "Remove background noise from audio",
      confidence: 87,
      icon: Mic 
    },
    { 
      id: "upscale-4k", 
      name: "4K Upscaling", 
      description: "AI upscale to 4K resolution",
      confidence: 93,
      icon: Maximize2 
    }
  ];

  const colorGradingControls = [
    { id: "exposure", name: "Exposure", value: 0, min: -100, max: 100 },
    { id: "contrast", name: "Contrast", value: 0, min: -100, max: 100 },
    { id: "highlights", name: "Highlights", value: 0, min: -100, max: 100 },
    { id: "shadows", name: "Shadows", value: 0, min: -100, max: 100 },
    { id: "saturation", name: "Saturation", value: 0, min: -100, max: 100 },
    { id: "temperature", name: "Temperature", value: 0, min: -100, max: 100 }
  ];

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      setCurrentTime(newTime);
      
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
      }
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsExporting(false);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    try {
      await processMutation.mutateAsync({
        action: "export",
        format: "mp4",
        quality: "high",
        resolution: "1920x1080"
      });
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
      clearInterval(progressInterval);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/50 to-purple-900 text-white">
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
              <h1 className="text-3xl font-bold">Advanced Video Editor</h1>
              <p className="text-white/60">Professional 8K video editing with AI enhancement</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Crown className="w-4 h-4 mr-1" />
              8K Ready
            </Badge>
            <Button 
              onClick={handleExport}
              disabled={isExporting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isExporting ? (
                <>
                  <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Video
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Editor Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Preview */}
          <div className="lg:col-span-3">
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Video Preview</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">1920x1080</Badge>
                    <Badge variant="outline">30fps</Badge>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Video Player */}
                <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    className="w-full h-80 object-cover"
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  >
                    <source src="/placeholder-video.mp4" type="video/mp4" />
                  </video>
                  
                  {/* Play/Pause Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Button
                      size="lg"
                      onClick={handlePlayPause}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8" />
                      ) : (
                        <Play className="w-8 h-8" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {/* Timeline Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button size="sm" onClick={handlePlayPause}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" onClick={() => setCurrentTime(0)}>
                        <Square className="w-4 h-4" />
                      </Button>
                      <Button size="sm">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4" />
                      <Slider
                        value={[75]}
                        max={100}
                        step={1}
                        className="w-20"
                      />
                    </div>
                  </div>

                  {/* Timeline Tracks */}
                  <div 
                    ref={timelineRef}
                    className="relative bg-black/50 rounded-lg p-4 min-h-32 cursor-pointer"
                    onClick={handleTimelineClick}
                  >
                    {/* Time Ruler */}
                    <div className="absolute top-0 left-4 right-4 h-6 border-b border-white/20">
                      {Array.from({ length: 11 }, (_, i) => (
                        <div
                          key={i}
                          className="absolute text-xs text-white/60"
                          style={{ left: `${i * 10}%`, transform: 'translateX(-50%)' }}
                        >
                          {formatTime((duration * i) / 10)}
                        </div>
                      ))}
                    </div>

                    {/* Playhead */}
                    <div
                      className="absolute top-6 bottom-0 w-0.5 bg-red-500 z-20"
                      style={{ left: `${4 + (currentTime / duration) * 92}%` }}
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5 -mt-1" />
                    </div>

                    {/* Video Tracks */}
                    <div className="mt-8 space-y-2">
                      {[1, 2, 3].map(trackNum => (
                        <div key={trackNum} className="flex items-center h-12">
                          <div className="w-16 text-sm text-white/60 flex items-center">
                            Track {trackNum}
                          </div>
                          <div className="flex-1 relative bg-white/5 rounded">
                            {videoClips
                              .filter(clip => clip.track === trackNum)
                              .map(clip => (
                                <div
                                  key={clip.id}
                                  className={`absolute h-10 ${clip.color} rounded cursor-pointer border-2 ${
                                    selectedClip === clip.id ? 'border-white' : 'border-transparent'
                                  } hover:border-white/50 flex items-center px-2`}
                                  style={{
                                    left: `${(clip.startTime / duration) * 100}%`,
                                    width: `${(clip.duration / duration) * 100}%`
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedClip(clip.id);
                                  }}
                                >
                                  <span className="text-xs font-medium truncate">
                                    {clip.name}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Tools & Effects */}
          <div className="space-y-6">
            {/* AI Features */}
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                  AI Enhancement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiFeatures.slice(0, 3).map(feature => (
                  <div key={feature.id} className="bg-black/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <feature.icon className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="font-medium text-sm">{feature.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feature.confidence}%
                      </Badge>
                    </div>
                    <p className="text-xs text-white/60 mb-2">{feature.description}</p>
                    <Button 
                      size="sm" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => processMutation.mutate({
                        action: feature.id,
                        clipId: selectedClip
                      })}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Apply
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Color Grading */}
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Palette className="w-5 h-5 mr-2" />
                  Color Grading
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {colorGradingControls.slice(0, 4).map(control => (
                  <div key={control.id}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">{control.name}</label>
                      <span className="text-xs text-white/60">{control.value}</span>
                    </div>
                    <Slider
                      value={[control.value]}
                      onValueChange={(value) => {
                        // Update control value
                      }}
                      min={control.min}
                      max={control.max}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Export Progress */}
            {isExporting && (
              <Card className="bg-black/40 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Export Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rendering...</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        {Math.round(exportProgress)}%
                      </Badge>
                    </div>
                    <Progress value={exportProgress} className="h-2" />
                    <p className="text-xs text-white/60">
                      Estimated time: {Math.round((100 - exportProgress) / 10)} minutes
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bottom Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-blue-500/30">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Timeline Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {videoClips.map(clip => (
                    <div key={clip.id} className="bg-black/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">{clip.name}</h4>
                      <div className="space-y-1 text-sm text-white/60">
                        <p>Duration: {formatTime(clip.duration)}</p>
                        <p>Start: {formatTime(clip.startTime)}</p>
                        <p>Track: {clip.track}</p>
                        <p>Type: {clip.type}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-white/60 mb-1">Effects:</p>
                        <div className="flex flex-wrap gap-1">
                          {clip.effects.map(effect => (
                            <Badge key={effect} variant="outline" className="text-xs">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="effects">
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Video Effects Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {aiFeatures.map(feature => (
                    <div key={feature.id} className="bg-black/30 p-4 rounded-lg text-center">
                      <feature.icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                      <h4 className="font-medium mb-1">{feature.name}</h4>
                      <p className="text-xs text-white/60 mb-2">{feature.description}</p>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        Apply
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audio">
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Audio Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Master Audio</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2">Volume</label>
                        <Slider value={[75]} max={100} className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Balance</label>
                        <Slider value={[0]} min={-100} max={100} className="w-full" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Audio Effects</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="border-blue-500/30">
                        <Mic className="w-4 h-4 mr-2" />
                        Normalize
                      </Button>
                      <Button variant="outline" className="border-blue-500/30">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Compressor
                      </Button>
                      <Button variant="outline" className="border-blue-500/30">
                        <Filter className="w-4 h-4 mr-2" />
                        EQ
                      </Button>
                      <Button variant="outline" className="border-blue-500/30">
                        <Zap className="w-4 h-4 mr-2" />
                        Reverb
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export">
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Export Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Format</label>
                      <select className="w-full bg-black/50 border border-blue-500/30 rounded px-3 py-2">
                        <option>MP4</option>
                        <option>MOV</option>
                        <option>AVI</option>
                        <option>MKV</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Quality</label>
                      <select className="w-full bg-black/50 border border-blue-500/30 rounded px-3 py-2">
                        <option>Ultra (8K)</option>
                        <option>High (4K)</option>
                        <option>Medium (1080p)</option>
                        <option>Low (720p)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Frame Rate</label>
                      <select className="w-full bg-black/50 border border-blue-500/30 rounded px-3 py-2">
                        <option>60fps</option>
                        <option>30fps</option>
                        <option>24fps</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Codec</label>
                      <select className="w-full bg-black/50 border border-blue-500/30 rounded px-3 py-2">
                        <option>H.264</option>
                        <option>H.265</option>
                        <option>ProRes</option>
                      </select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isExporting ? (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
                        Exporting... {Math.round(exportProgress)}%
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Export Video
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}