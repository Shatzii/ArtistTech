import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';
import { apiRequest } from '../lib/queryClient';
import { 
  Video, Play, Pause, Square, RotateCcw, Download, Upload, Settings,
  Scissors, Copy, Layers, Palette, Sparkles, Zap, Clock, Volume2,
  ChevronLeft, ChevronRight, SkipBack, SkipForward, Maximize,
  Sun, Moon, Contrast, Sliders, Filter, Blend, Grid, Move,
  RotateCw, FlipHorizontal, FlipVertical, Crop, Wand2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface VideoClip {
  id: string;
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  track: number;
  effects: VideoEffect[];
  transitions: Transition[];
}

interface VideoEffect {
  id: string;
  type: 'color' | 'filter' | 'transform' | 'motion';
  name: string;
  parameters: Record<string, number>;
  enabled: boolean;
}

interface Transition {
  id: string;
  type: 'fade' | 'dissolve' | 'wipe' | 'slide' | 'zoom' | 'spin';
  duration: number;
  direction?: string;
  easing: string;
}

interface ColorCorrection {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  temperature: number;
  tint: number;
  exposure: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  vibrance: number;
}

export default function AdvancedVideoEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Timeline state
  const [timelineScale, setTimelineScale] = useState(1);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [clips, setClips] = useState<VideoClip[]>([]);
  
  // Color correction state
  const [colorCorrection, setColorCorrection] = useState<ColorCorrection>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    temperature: 0,
    tint: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    vibrance: 0
  });
  
  // Transition presets
  const transitionPresets = [
    { id: 'fade', name: 'Fade', icon: Sun },
    { id: 'dissolve', name: 'Dissolve', icon: Sparkles },
    { id: 'wipe', name: 'Wipe', icon: Move },
    { id: 'slide', name: 'Slide', icon: ChevronRight },
    { id: 'zoom', name: 'Zoom', icon: Maximize },
    { id: 'spin', name: 'Spin', icon: RotateCw }
  ];
  
  // Color grading presets
  const colorPresets = [
    { name: 'Cinematic', values: { contrast: 20, saturation: 15, temperature: -200, tint: 50 } },
    { name: 'Vintage', values: { brightness: -10, contrast: -15, saturation: -20, temperature: 300 } },
    { name: 'Film Noir', values: { brightness: -20, contrast: 40, saturation: -80, temperature: -100 } },
    { name: 'Sunset', values: { temperature: 500, tint: 100, highlights: -30, shadows: 20 } },
    { name: 'Cold Blue', values: { temperature: -400, tint: -200, vibrance: 30, saturation: 10 } },
    { name: 'Warm Gold', values: { temperature: 600, tint: 150, exposure: 10, vibrance: 25 } }
  ];

  // Video processing mutation
  const processVideoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/video/process', data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Video Processing Complete",
        description: "Your video has been processed with the applied effects",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/video/projects'] });
    },
    onError: () => {
      toast({
        title: "Processing Failed",
        description: "There was an error processing your video",
        variant: "destructive",
      });
    },
  });

  // Export video mutation
  const exportVideoMutation = useMutation({
    mutationFn: async (settings: any) => {
      const response = await apiRequest('POST', '/api/video/export', settings);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Export Started",
        description: "Your video is being exported. You'll be notified when complete.",
      });
    },
  });

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const applyColorCorrection = (property: keyof ColorCorrection, value: number) => {
    setColorCorrection(prev => ({ ...prev, [property]: value }));
    
    // Apply real-time color correction via CSS filters
    if (videoRef.current) {
      const filters = [
        `brightness(${(100 + colorCorrection.brightness) / 100})`,
        `contrast(${(100 + colorCorrection.contrast) / 100})`,
        `saturate(${(100 + colorCorrection.saturation) / 100})`,
        `hue-rotate(${colorCorrection.hue}deg)`,
        `sepia(${Math.abs(colorCorrection.temperature) / 1000})`,
      ];
      videoRef.current.style.filter = filters.join(' ');
    }
  };

  const applyColorPreset = (preset: any) => {
    const newValues = { ...colorCorrection, ...preset.values };
    setColorCorrection(newValues);
    
    Object.entries(preset.values).forEach(([key, value]) => {
      applyColorCorrection(key as keyof ColorCorrection, value as number);
    });
    
    toast({
      title: "Color Preset Applied",
      description: `Applied ${preset.name} color grading`,
    });
  };

  const addTransition = (type: string, clipId: string) => {
    const transition: Transition = {
      id: `transition-${Date.now()}`,
      type: type as any,
      duration: 1000,
      easing: 'ease-in-out'
    };
    
    setClips(prev => prev.map(clip => 
      clip.id === clipId 
        ? { ...clip, transitions: [...clip.transitions, transition] }
        : clip
    ));
    
    toast({
      title: "Transition Added",
      description: `Added ${type} transition to clip`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const exportVideo = () => {
    const exportSettings = {
      resolution: '1920x1080',
      framerate: 30,
      codec: 'h264',
      quality: 'high',
      colorCorrection,
      clips,
      format: 'mp4'
    };
    
    exportVideoMutation.mutate(exportSettings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/50 border-b border-gray-700">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Advanced Video Editor</h1>
                  <p className="text-sm text-gray-400">Professional color correction & transitions</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={exportVideo}
                disabled={exportVideoMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Download className="w-4 h-4 mr-2" />
                {exportVideoMutation.isPending ? 'Exporting...' : 'Export Video'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Tools */}
        <div className="w-80 bg-black/30 border-r border-gray-700 overflow-y-auto">
          <Tabs defaultValue="color" className="h-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
              <TabsTrigger value="color">Color</TabsTrigger>
              <TabsTrigger value="transitions">Transitions</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="color" className="p-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Color Grading Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      onClick={() => applyColorPreset(preset)}
                      variant="outline"
                      className="text-xs h-8 bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Manual Adjustments</h3>
                
                {/* Basic Adjustments */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-300">Brightness</Label>
                    <Slider
                      value={[colorCorrection.brightness]}
                      onValueChange={(value) => applyColorCorrection('brightness', value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-400">{colorCorrection.brightness}</span>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-300">Contrast</Label>
                    <Slider
                      value={[colorCorrection.contrast]}
                      onValueChange={(value) => applyColorCorrection('contrast', value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-400">{colorCorrection.contrast}</span>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-300">Saturation</Label>
                    <Slider
                      value={[colorCorrection.saturation]}
                      onValueChange={(value) => applyColorCorrection('saturation', value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-400">{colorCorrection.saturation}</span>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-300">Hue</Label>
                    <Slider
                      value={[colorCorrection.hue]}
                      onValueChange={(value) => applyColorCorrection('hue', value[0])}
                      min={-180}
                      max={180}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-400">{colorCorrection.hue}°</span>
                  </div>
                </div>
                
                {/* Advanced Color Controls */}
                <div className="border-t border-gray-700 pt-4 space-y-3">
                  <h4 className="text-sm font-medium text-white">Advanced Controls</h4>
                  
                  <div>
                    <Label className="text-sm text-gray-300">Temperature</Label>
                    <Slider
                      value={[colorCorrection.temperature]}
                      onValueChange={(value) => applyColorCorrection('temperature', value[0])}
                      min={-1000}
                      max={1000}
                      step={10}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-400">{colorCorrection.temperature}K</span>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-300">Exposure</Label>
                    <Slider
                      value={[colorCorrection.exposure]}
                      onValueChange={(value) => applyColorCorrection('exposure', value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-400">{colorCorrection.exposure}</span>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-300">Highlights</Label>
                    <Slider
                      value={[colorCorrection.highlights]}
                      onValueChange={(value) => applyColorCorrection('highlights', value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-400">{colorCorrection.highlights}</span>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-300">Shadows</Label>
                    <Slider
                      value={[colorCorrection.shadows]}
                      onValueChange={(value) => applyColorCorrection('shadows', value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-400">{colorCorrection.shadows}</span>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-300">Vibrance</Label>
                    <Slider
                      value={[colorCorrection.vibrance]}
                      onValueChange={(value) => applyColorCorrection('vibrance', value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-400">{colorCorrection.vibrance}</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => setColorCorrection({
                    brightness: 0, contrast: 0, saturation: 0, hue: 0,
                    temperature: 0, tint: 0, exposure: 0, highlights: 0,
                    shadows: 0, whites: 0, blacks: 0, vibrance: 0
                  })}
                  variant="outline"
                  className="w-full mt-4 bg-gray-800/50 border-gray-600 text-gray-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="transitions" className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Transition Library</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {transitionPresets.map((transition) => (
                  <div
                    key={transition.id}
                    className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 hover:border-blue-500/50 transition-all cursor-pointer"
                    onClick={() => selectedClip && addTransition(transition.id, selectedClip)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <transition.icon className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-white">{transition.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Click to add to selected clip
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-white mb-3">Transition Settings</h4>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-300">Duration (ms)</Label>
                    <Input
                      type="number"
                      defaultValue={1000}
                      min={100}
                      max={5000}
                      className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-300">Easing</Label>
                    <Select defaultValue="ease-in-out">
                      <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="ease-in">Ease In</SelectItem>
                        <SelectItem value="ease-out">Ease Out</SelectItem>
                        <SelectItem value="ease-in-out">Ease In-Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="effects" className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Video Effects</h3>
              
              <div className="space-y-3">
                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Blur</span>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">Add motion blur or depth of field</p>
                </div>
                
                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Sharpen</span>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">Enhance video sharpness and clarity</p>
                </div>
                
                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Noise Reduction</span>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">Remove grain and digital noise</p>
                </div>
                
                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Stabilization</span>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">Smooth out camera shake</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center - Video Preview */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <video
              ref={videoRef}
              className="max-w-full max-h-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src="/api/video/preview" type="video/mp4" />
            </video>
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handlePlayPause}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-white" />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-48 bg-gray-900 border-t border-gray-700">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Timeline</h3>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setTimelineScale(Math.max(0.1, timelineScale - 0.1))}
                    >
                      -
                    </Button>
                    <span className="text-sm text-gray-400 px-2">{Math.round(timelineScale * 100)}%</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setTimelineScale(Math.min(3, timelineScale + 0.1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              
              <div ref={timelineRef} className="relative h-24 bg-gray-800 rounded-lg overflow-x-auto">
                {/* Timeline ruler */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-700 border-b border-gray-600">
                  {/* Time markers would go here */}
                </div>
                
                {/* Video tracks */}
                <div className="mt-6 space-y-2 p-2">
                  <div className="h-12 bg-gray-700 rounded flex items-center px-2">
                    <span className="text-xs text-gray-300 mr-2">Video 1</span>
                    {clips.map((clip) => (
                      <div
                        key={clip.id}
                        className={`h-8 bg-blue-600 rounded mr-1 cursor-pointer relative ${
                          selectedClip === clip.id ? 'ring-2 ring-blue-400' : ''
                        }`}
                        style={{
                          width: `${clip.duration * 10 * timelineScale}px`,
                          marginLeft: `${clip.startTime * 10 * timelineScale}px`
                        }}
                        onClick={() => setSelectedClip(clip.id)}
                      >
                        <span className="text-xs text-white absolute inset-0 flex items-center justify-center">
                          {clip.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="h-12 bg-gray-700 rounded flex items-center px-2">
                    <span className="text-xs text-gray-300 mr-2">Audio 1</span>
                  </div>
                </div>
                
                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none"
                  style={{ left: `${currentTime * 10 * timelineScale}px` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-64 bg-black/30 border-l border-gray-700 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Properties</h3>
          
          {selectedClip ? (
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-300">Clip Name</Label>
                <Input
                  defaultValue={clips.find(c => c.id === selectedClip)?.name}
                  className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-sm text-gray-300">Duration</Label>
                <Input
                  type="number"
                  defaultValue={clips.find(c => c.id === selectedClip)?.duration}
                  className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-sm text-gray-300">Start Time</Label>
                <Input
                  type="number"
                  defaultValue={clips.find(c => c.id === selectedClip)?.startTime}
                  className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-white mb-2">Applied Effects</h4>
                <div className="space-y-2">
                  {clips.find(c => c.id === selectedClip)?.effects.map((effect) => (
                    <div key={effect.id} className="flex items-center justify-between bg-gray-800/50 rounded p-2">
                      <span className="text-xs text-gray-300">{effect.name}</span>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Scissors className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-white mb-2">Transitions</h4>
                <div className="space-y-2">
                  {clips.find(c => c.id === selectedClip)?.transitions.map((transition) => (
                    <div key={transition.id} className="flex items-center justify-between bg-gray-800/50 rounded p-2">
                      <span className="text-xs text-gray-300">{transition.type}</span>
                      <span className="text-xs text-gray-400">{transition.duration}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-8">
              <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a clip to view properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}