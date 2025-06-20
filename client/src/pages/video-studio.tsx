import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  FastForward,
  Rewind,
  Video,
  Scissors,
  Palette,
  Layers,
  Volume2,
  Download,
  Upload,
  Save,
  Zap,
  Eye,
  Target,
  Sliders,
  Sparkles,
  Wand2,
  Camera,
  Film,
  Clapperboard,
  Wand2 as Magic
} from "lucide-react";

interface VideoClip {
  id: string;
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  position: number; // timeline position
  videoUrl: string;
  thumbnailUrl: string;
  effects: VideoEffect[];
  colorCorrection: ColorCorrection;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  isAIGenerated?: boolean;
  generationPrompt?: string;
  generationStyle?: 'cinematic' | 'realistic' | 'artistic' | 'documentary';
}

interface VideoEffect {
  id: string;
  type: 'transition' | 'filter' | 'animation';
  name: string;
  enabled: boolean;
  duration: number;
  parameters: { [key: string]: number };
}

interface ColorCorrection {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  shadows: number;
  midtones: number;
  highlights: number;
  temperature: number;
  tint: number;
  vibrance: number;
  clarity: number;
  vignette: number;
}

interface Transition {
  id: string;
  name: string;
  type: 'fade' | 'wipe' | 'slide' | 'zoom' | 'rotate' | 'dissolve';
  duration: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export default function VideoStudio() {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState('timeline');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generationStyle, setGenerationStyle] = useState<'cinematic' | 'realistic' | 'artistic' | 'documentary'>('cinematic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const defaultColorCorrection: ColorCorrection = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    shadows: 0,
    midtones: 0,
    highlights: 0,
    temperature: 0,
    tint: 0,
    vibrance: 0,
    clarity: 0,
    vignette: 0
  };

  const transitions: Transition[] = [
    { id: 'fade', name: 'Fade', type: 'fade', duration: 1, easing: 'ease-in-out' },
    { id: 'wipe-left', name: 'Wipe Left', type: 'wipe', duration: 0.5, direction: 'left', easing: 'linear' },
    { id: 'wipe-right', name: 'Wipe Right', type: 'wipe', duration: 0.5, direction: 'right', easing: 'linear' },
    { id: 'slide-up', name: 'Slide Up', type: 'slide', duration: 0.8, direction: 'up', easing: 'ease-out' },
    { id: 'slide-down', name: 'Slide Down', type: 'slide', duration: 0.8, direction: 'down', easing: 'ease-out' },
    { id: 'zoom-in', name: 'Zoom In', type: 'zoom', duration: 1.2, easing: 'ease-in-out' },
    { id: 'zoom-out', name: 'Zoom Out', type: 'zoom', duration: 1.2, easing: 'ease-in-out' },
    { id: 'rotate', name: 'Rotate', type: 'rotate', duration: 1, easing: 'ease-in-out' },
    { id: 'dissolve', name: 'Dissolve', type: 'dissolve', duration: 1.5, easing: 'ease-in' }
  ];

  useEffect(() => {
    initializeSampleClips();
  }, []);

  const initializeSampleClips = () => {
    const sampleClips: VideoClip[] = [
      {
        id: 'clip1',
        name: 'Intro Sequence',
        duration: 10,
        startTime: 0,
        endTime: 10,
        position: 0,
        videoUrl: '/videos/sample1.mp4',
        thumbnailUrl: '/thumbnails/sample1.jpg',
        effects: [],
        colorCorrection: { ...defaultColorCorrection },
        volume: 0.8,
        fadeIn: 0,
        fadeOut: 0
      },
      {
        id: 'clip2',
        name: 'Main Content',
        duration: 25,
        startTime: 0,
        endTime: 25,
        position: 10,
        videoUrl: '/videos/sample2.mp4',
        thumbnailUrl: '/thumbnails/sample2.jpg',
        effects: [],
        colorCorrection: { ...defaultColorCorrection },
        volume: 0.8,
        fadeIn: 0.5,
        fadeOut: 0.5
      }
    ];
    
    setClips(sampleClips);
    setDuration(35); // Total project duration
  };

  const updateClipColorCorrection = (clipId: string, property: keyof ColorCorrection, value: number) => {
    setClips(prev => prev.map(clip => 
      clip.id === clipId 
        ? { 
            ...clip, 
            colorCorrection: { ...clip.colorCorrection, [property]: value }
          }
        : clip
    ));

    if (selectedClip?.id === clipId) {
      setSelectedClip(prev => prev ? {
        ...prev,
        colorCorrection: { ...prev.colorCorrection, [property]: value }
      } : null);
    }

    applyEffectsToCanvas();
  };

  const applyEffectsToCanvas = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply color correction if clip is selected
    if (selectedClip) {
      const { colorCorrection } = selectedClip;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Apply brightness
        data[i] = Math.max(0, Math.min(255, data[i] + colorCorrection.brightness * 2.55));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + colorCorrection.brightness * 2.55));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + colorCorrection.brightness * 2.55));

        // Apply contrast
        const contrastFactor = (259 * (colorCorrection.contrast + 255)) / (255 * (259 - colorCorrection.contrast));
        data[i] = Math.max(0, Math.min(255, contrastFactor * (data[i] - 128) + 128));
        data[i + 1] = Math.max(0, Math.min(255, contrastFactor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.max(0, Math.min(255, contrastFactor * (data[i + 2] - 128) + 128));

        // Apply saturation
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const satFactor = 1 + colorCorrection.saturation / 100;
        data[i] = Math.max(0, Math.min(255, gray + satFactor * (data[i] - gray)));
        data[i + 1] = Math.max(0, Math.min(255, gray + satFactor * (data[i + 1] - gray)));
        data[i + 2] = Math.max(0, Math.min(255, gray + satFactor * (data[i + 2] - gray)));
      }

      ctx.putImageData(imageData, 0, 0);
    }
  };

  const addTransition = (clipId: string, transitionId: string) => {
    const transition = transitions.find(t => t.id === transitionId);
    if (!transition) return;

    const effect: VideoEffect = {
      id: `transition_${Date.now()}`,
      type: 'transition',
      name: transition.name,
      enabled: true,
      duration: transition.duration,
      parameters: {
        type: transition.type === 'fade' ? 0 : 1,
        direction: transition.direction === 'left' ? 0 : transition.direction === 'right' ? 1 : 2,
        easing: transition.easing === 'linear' ? 0 : 1
      }
    };

    setClips(prev => prev.map(clip =>
      clip.id === clipId
        ? { ...clip, effects: [...clip.effects, effect] }
        : clip
    ));
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const generateAIVideo = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      const response = await fetch('/api/ai-video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          style: generationStyle,
          duration: 10, // 10 seconds
          resolution: '1920x1080',
          fps: 24
        })
      });

      const result = await response.json();
      
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Add generated video to timeline
      const newClip: VideoClip = {
        id: `ai_clip_${Date.now()}`,
        name: `AI: ${aiPrompt.substring(0, 30)}...`,
        duration: 10,
        startTime: 0,
        endTime: 10,
        position: clips.reduce((max, clip) => Math.max(max, clip.position + clip.duration), 0),
        videoUrl: result.videoUrl || '/videos/ai-generated-sample.mp4',
        thumbnailUrl: result.thumbnailUrl || '/thumbnails/ai-generated-sample.jpg',
        effects: [],
        colorCorrection: { ...defaultColorCorrection },
        volume: 0,
        fadeIn: 0,
        fadeOut: 0,
        isAIGenerated: true,
        generationPrompt: aiPrompt,
        generationStyle: generationStyle
      };

      setClips(prev => [...prev, newClip]);
      setDuration(prev => prev + 10);
      setAiPrompt('');
      
    } catch (error) {
      console.error('AI video generation failed:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const ColorCorrectionPanel = () => (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-orange-400 mb-4">COLOR CORRECTION</div>
      
      {selectedClip ? (
        <div className="space-y-4">
          {/* Primary Adjustments */}
          <div className="space-y-3">
            <div className="text-xs text-gray-400 font-medium">PRIMARY</div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Brightness</span>
                <span>{selectedClip.colorCorrection.brightness}</span>
              </div>
              <Slider
                value={[selectedClip.colorCorrection.brightness]}
                onValueChange={([value]) => updateClipColorCorrection(selectedClip.id, 'brightness', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Contrast</span>
                <span>{selectedClip.colorCorrection.contrast}</span>
              </div>
              <Slider
                value={[selectedClip.colorCorrection.contrast]}
                onValueChange={([value]) => updateClipColorCorrection(selectedClip.id, 'contrast', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Saturation</span>
                <span>{selectedClip.colorCorrection.saturation}</span>
              </div>
              <Slider
                value={[selectedClip.colorCorrection.saturation]}
                onValueChange={([value]) => updateClipColorCorrection(selectedClip.id, 'saturation', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Vibrance</span>
                <span>{selectedClip.colorCorrection.vibrance}</span>
              </div>
              <Slider
                value={[selectedClip.colorCorrection.vibrance]}
                onValueChange={([value]) => updateClipColorCorrection(selectedClip.id, 'vibrance', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Tone Adjustments */}
          <div className="space-y-3">
            <div className="text-xs text-gray-400 font-medium">TONE</div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Shadows</span>
                <span>{selectedClip.colorCorrection.shadows}</span>
              </div>
              <Slider
                value={[selectedClip.colorCorrection.shadows]}
                onValueChange={([value]) => updateClipColorCorrection(selectedClip.id, 'shadows', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Midtones</span>
                <span>{selectedClip.colorCorrection.midtones}</span>
              </div>
              <Slider
                value={[selectedClip.colorCorrection.midtones]}
                onValueChange={([value]) => updateClipColorCorrection(selectedClip.id, 'midtones', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Highlights</span>
                <span>{selectedClip.colorCorrection.highlights}</span>
              </div>
              <Slider
                value={[selectedClip.colorCorrection.highlights]}
                onValueChange={([value]) => updateClipColorCorrection(selectedClip.id, 'highlights', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Color Temperature */}
          <div className="space-y-3">
            <div className="text-xs text-gray-400 font-medium">COLOR</div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Temperature</span>
                <span>{selectedClip.colorCorrection.temperature}</span>
              </div>
              <Slider
                value={[selectedClip.colorCorrection.temperature]}
                onValueChange={([value]) => updateClipColorCorrection(selectedClip.id, 'temperature', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Tint</span>
                <span>{selectedClip.colorCorrection.tint}</span>
              </div>
              <Slider
                value={[selectedClip.colorCorrection.tint]}
                onValueChange={([value]) => updateClipColorCorrection(selectedClip.id, 'tint', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Effects */}
          <div className="space-y-3">
            <div className="text-xs text-gray-400 font-medium">EFFECTS</div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Clarity</span>
                <span>{selectedClip.colorCorrection.clarity}</span>
              </div>
              <Slider
                value={[selectedClip.colorCorrection.clarity]}
                onValueChange={([value]) => updateClipColorCorrection(selectedClip.id, 'clarity', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Vignette</span>
                <span>{selectedClip.colorCorrection.vignette}</span>
              </div>
              <Slider
                value={[selectedClip.colorCorrection.vignette]}
                onValueChange={([value]) => updateClipColorCorrection(selectedClip.id, 'vignette', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Reset all values to 0
                Object.keys(defaultColorCorrection).forEach(key => {
                  updateClipColorCorrection(selectedClip.id, key as keyof ColorCorrection, 0);
                });
              }}
            >
              Reset
            </Button>
            <Button variant="outline" size="sm">
              Auto
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          Select a clip to adjust color correction
        </div>
      )}
    </div>
  );

  const TransitionsPanel = () => (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-orange-400 mb-4">TRANSITIONS</div>
      
      <div className="grid grid-cols-3 gap-2">
        {transitions.map(transition => (
          <Button
            key={transition.id}
            variant="outline"
            size="sm"
            className="h-16 flex flex-col items-center justify-center text-xs"
            onClick={() => selectedClip && addTransition(selectedClip.id, transition.id)}
            disabled={!selectedClip}
          >
            <Zap size={16} className="mb-1" />
            {transition.name}
          </Button>
        ))}
      </div>

      {selectedClip && (
        <div className="space-y-2">
          <div className="text-xs text-gray-400 font-medium">APPLIED TRANSITIONS</div>
          {selectedClip.effects.filter(e => e.type === 'transition').map(effect => (
            <div key={effect.id} className="bg-gray-800 rounded p-2 flex items-center justify-between">
              <div className="text-sm">{effect.name}</div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">{effect.duration}s</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Video className="text-orange-400" size={28} />
          <div>
            <h1 className="text-xl font-bold">Video Studio</h1>
            <p className="text-sm text-gray-400">Professional Video Editing & Color Correction</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-xs">
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {clips.length} clips
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Preview */}
        <div className="flex-1 flex flex-col">
          {/* Video Viewer */}
          <div className="flex-1 bg-black relative flex items-center justify-center">
            <video
              ref={videoRef}
              className="max-w-full max-h-full"
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              style={{ display: 'none' }}
            />
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full border border-gray-600"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/50 rounded px-4 py-2">
              <Button variant="ghost" size="sm" onClick={() => seekTo(Math.max(0, currentTime - 10))}>
                <Rewind size={16} />
              </Button>
              <Button onClick={togglePlay} className="bg-orange-600 hover:bg-orange-700">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => seekTo(Math.min(duration, currentTime + 10))}>
                <FastForward size={16} />
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-32 bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-orange-400">TIMELINE</div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Scissors size={14} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Layers size={14} />
                </Button>
                <Slider
                  value={[zoom]}
                  onValueChange={([value]) => setZoom(value)}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-20"
                />
              </div>
            </div>
            
            <div 
              ref={timelineRef}
              className="relative h-16 bg-gray-900 rounded border border-gray-600 overflow-x-auto"
            >
              {/* Timeline Ruler */}
              <div className="absolute top-0 left-0 right-0 h-4 border-b border-gray-600">
                {Array.from({ length: Math.ceil(duration) }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-gray-600"
                    style={{ left: `${(i / duration) * 100}%` }}
                  >
                    <span className="absolute top-0 left-1 text-xs text-gray-400">
                      {i}s
                    </span>
                  </div>
                ))}
              </div>

              {/* Video Clips */}
              <div className="absolute top-4 left-0 right-0 bottom-0">
                {clips.map(clip => (
                  <div
                    key={clip.id}
                    className={`absolute h-12 bg-blue-600 rounded border-2 cursor-pointer transition-colors ${
                      selectedClip?.id === clip.id ? 'border-orange-400' : 'border-blue-500'
                    }`}
                    style={{
                      left: `${(clip.position / duration) * 100}%`,
                      width: `${(clip.duration / duration) * 100}%`
                    }}
                    onClick={() => setSelectedClip(clip)}
                  >
                    <div className="p-1 text-xs font-medium truncate">
                      {clip.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-orange-400 z-10"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-gray-700">
              <TabsTrigger value="ai-gen" className="text-xs">
                <Magic size={14} className="mr-1" />
                AI Video
              </TabsTrigger>
              <TabsTrigger value="color" className="text-xs">
                <Palette size={14} className="mr-1" />
                Color
              </TabsTrigger>
              <TabsTrigger value="transitions" className="text-xs">
                <Zap size={14} className="mr-1" />
                Transitions
              </TabsTrigger>
              <TabsTrigger value="effects" className="text-xs">
                <Sparkles size={14} className="mr-1" />
                Effects
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="ai-gen" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-orange-400 mb-4">AI VIDEO GENERATION</div>
                    
                    {/* Generation Style Selection */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400 font-medium">CINEMATIC STYLE</div>
                      <Select value={generationStyle} onValueChange={(value) => setGenerationStyle(value as any)}>
                        <SelectTrigger className="w-full bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cinematic">Cinematic - Film-quality visuals</SelectItem>
                          <SelectItem value="realistic">Realistic - Photorealistic footage</SelectItem>
                          <SelectItem value="artistic">Artistic - Stylized creative look</SelectItem>
                          <SelectItem value="documentary">Documentary - Natural lighting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Prompt Input */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400 font-medium">SCENE DESCRIPTION</div>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Describe your scene in detail: A majestic golden eagle soaring over snow-capped mountains at sunset, with dramatic lighting and cinematic camera movement..."
                        className="w-full h-24 p-3 bg-gray-800 border border-gray-600 rounded text-white text-sm resize-none"
                        disabled={isGenerating}
                      />
                    </div>

                    {/* Preset Prompts */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400 font-medium">PRESET SCENES</div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          "A bustling city street at night with neon lights reflecting on wet pavement",
                          "Ocean waves crashing against rocky cliffs during a storm",
                          "A serene forest with morning sunlight filtering through trees",
                          "Futuristic cityscape with flying cars and holographic billboards",
                          "Time-lapse of clouds moving over a mountain landscape"
                        ].map((preset, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="justify-start text-xs h-auto p-2 text-left"
                            onClick={() => setAiPrompt(preset)}
                            disabled={isGenerating}
                          >
                            {preset}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Generation Controls */}
                    <div className="space-y-3">
                      <div className="text-xs text-gray-400 font-medium">GENERATION SETTINGS</div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs">
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-white ml-2">10 seconds</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-400">Quality:</span>
                          <span className="text-white ml-2">HD 1080p</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-400">FPS:</span>
                          <span className="text-white ml-2">24fps</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-400">Aspect:</span>
                          <span className="text-white ml-2">16:9</span>
                        </div>
                      </div>
                    </div>

                    {/* Generation Progress */}
                    {isGenerating && (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-400 font-medium">GENERATING...</div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${generationProgress}%` }}
                          />
                        </div>
                        <div className="text-xs text-center text-gray-400">
                          {generationProgress < 30 ? 'Analyzing prompt...' :
                           generationProgress < 60 ? 'Generating frames...' :
                           generationProgress < 90 ? 'Rendering video...' : 'Finalizing...'}
                        </div>
                      </div>
                    )}

                    {/* Generate Button */}
                    <Button 
                      onClick={generateAIVideo}
                      disabled={!aiPrompt.trim() || isGenerating}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      {isGenerating ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating Video...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Magic size={16} className="mr-2" />
                          Generate AI Video
                        </div>
                      )}
                    </Button>

                    {/* Recent Generations */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400 font-medium">RECENT AI CLIPS</div>
                      {clips.filter(clip => clip.isAIGenerated).map(clip => (
                        <div key={clip.id} className="bg-gray-900 rounded p-2">
                          <div className="text-xs font-medium text-white mb-1">
                            {clip.name}
                          </div>
                          <div className="text-xs text-gray-400 mb-1">
                            Style: {clip.generationStyle}
                          </div>
                          <div className="text-xs text-gray-500">
                            "{clip.generationPrompt?.substring(0, 50)}..."
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="color" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <ColorCorrectionPanel />
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="transitions" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <TransitionsPanel />
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="effects" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-orange-400 mb-4">VIDEO EFFECTS</div>
                    <div className="text-center text-gray-500 py-8">
                      Video effects panel coming soon
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="h-16 bg-gray-800 border-t border-gray-700 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Save size={16} className="mr-2" />
            Save Project
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Select defaultValue="1080p">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4k">4K (2160p)</SelectItem>
              <SelectItem value="1080p">HD (1080p)</SelectItem>
              <SelectItem value="720p">HD (720p)</SelectItem>
              <SelectItem value="480p">SD (480p)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}