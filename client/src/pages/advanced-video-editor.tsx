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
  RotateCw, FlipHorizontal, FlipVertical, Crop, Wand2, Target,
  Droplets, Sunset, Sunrise, CloudRain, Snowflake, Lightbulb,
  Eye, Monitor, Brain, Shuffle, RefreshCw, Film, Camera, Image,
  Share2, Calendar, BarChart3, Hash, MessageCircle, TrendingUp,
  Globe, Languages, Palette as BrandKit, Megaphone, Bot, Eye as Viral,
  Monitor as Preview, Smartphone, Tablet, Instagram, Youtube,
  Twitter, Facebook, LinkedinIcon, Send, Clock3, Users, Heart,
  MessageSquare, Repeat2, Bookmark, BarChart2, Activity, Mic
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

interface SocialMediaPlatform {
  id: string;
  name: string;
  icon: any;
  format: {
    width: number;
    height: number;
    ratio: string;
    maxDuration: number;
  };
  connected: boolean;
  followers?: number;
}

interface TrendingTemplate {
  id: string;
  name: string;
  platform: string;
  views: string;
  engagement: number;
  thumbnail?: string;
}

interface ViralAnalysis {
  viralScore: number;
  factors: {
    hook_strength: number;
    visual_appeal: number;
    trending_alignment: number;
    engagement_triggers: number;
    platform_optimization: number;
    timing_score: number;
    hashtag_potential: number;
  };
  predictions: {
    estimatedViews: string;
    viralProbability: string;
    peakTime: string;
    targetAudience: string;
  };
  improvements: string[];
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
  
  // Social Media Creation Studio State
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'tiktok', 'youtube']);
  const [socialTab, setSocialTab] = useState('platforms');
  const [viralAnalysis, setViralAnalysis] = useState<ViralAnalysis | null>(null);
  const [trendingTemplates, setTrendingTemplates] = useState<TrendingTemplate[]>([]);
  const [generatedCaptions, setGeneratedCaptions] = useState<any>(null);
  const [hashtagSuggestions, setHashtagSuggestions] = useState<any>(null);
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [greenScreenEnabled, setGreenScreenEnabled] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('modern_office');
  const [captionStyle, setCaptionStyle] = useState('engaging');
  const [targetLanguages, setTargetLanguages] = useState<string[]>(['es', 'fr']);
  
  const [platforms] = useState<SocialMediaPlatform[]>([
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      format: { width: 1080, height: 1920, ratio: '9:16', maxDuration: 90 },
      connected: true,
      followers: 15420
    },
    {
      id: 'tiktok', 
      name: 'TikTok',
      icon: Video,
      format: { width: 1080, height: 1920, ratio: '9:16', maxDuration: 180 },
      connected: true,
      followers: 8750
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      format: { width: 1920, height: 1080, ratio: '16:9', maxDuration: 600 },
      connected: true,
      followers: 32100
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      format: { width: 1280, height: 720, ratio: '16:9', maxDuration: 140 },
      connected: false,
      followers: 0
    },
    {
      id: 'facebook',
      name: 'Facebook', 
      icon: Facebook,
      format: { width: 1920, height: 1080, ratio: '16:9', maxDuration: 240 },
      connected: false,
      followers: 0
    }
  ]);
  
  // Enhanced color correction state
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

  // Advanced effects state
  const [advancedEffects, setAdvancedEffects] = useState({
    colorGrading: {
      shadows: { r: 0, g: 0, b: 0 },
      midtones: { r: 0, g: 0, b: 0 },
      highlights: { r: 0, g: 0, b: 0 },
      lift: 0,
      gamma: 1,
      gain: 1
    },
    curves: {
      red: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      green: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      blue: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      luma: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }, { x: 1, y: 1 }]
    },
    lut: {
      enabled: false,
      intensity: 100,
      preset: 'none'
    },
    chromaKey: {
      enabled: false,
      color: '#00FF00',
      tolerance: 10,
      softness: 5
    },
    stabilization: {
      enabled: false,
      strength: 50,
      smoothness: 75
    }
  });

  // Professional transition presets
  const transitionPresets = [
    { id: 'fade', name: 'Fade', icon: Sun, category: 'Basic' },
    { id: 'dissolve', name: 'Dissolve', icon: Sparkles, category: 'Basic' },
    { id: 'wipe', name: 'Wipe', icon: Move, category: 'Basic' },
    { id: 'slide', name: 'Slide', icon: ChevronRight, category: 'Basic' },
    { id: 'zoom', name: 'Zoom', icon: Maximize, category: 'Transform' },
    { id: 'spin', name: 'Spin', icon: RotateCw, category: 'Transform' },
    { id: 'film_burn', name: 'Film Burn', icon: Zap, category: 'Creative' },
    { id: 'light_leak', name: 'Light Leak', icon: Lightbulb, category: 'Creative' },
    { id: 'glitch', name: 'Glitch', icon: Target, category: 'Creative' },
    { id: 'morphing', name: 'Morphing', icon: Blend, category: 'Advanced' },
    { id: 'liquid', name: 'Liquid', icon: Droplets, category: 'Advanced' },
    { id: 'particles', name: 'Particles', icon: Sparkles, category: 'Advanced' }
  ];
  
  // Professional color grading presets
  const colorPresets = [
    { id: 'neutral', name: 'Neutral', icon: Sun },
    { id: 'cinematic', name: 'Cinematic', icon: Film },
    { id: 'vintage', name: 'Vintage', icon: Camera },
    { id: 'warm', name: 'Warm Sunset', icon: Sunset },
    { id: 'cool', name: 'Cool Morning', icon: Sunrise },
    { id: 'dramatic', name: 'Dramatic', icon: CloudRain },
    { id: 'noir', name: 'Film Noir', icon: Moon },
    { id: 'vibrant', name: 'Vibrant', icon: Palette },
    { id: 'bleach', name: 'Bleach Bypass', icon: Eye },
    { id: 'teal_orange', name: 'Teal & Orange', icon: Target }
  ];

  // LUT (Look-Up Table) presets
  const lutPresets = [
    { id: 'rec709', name: 'Rec.709', description: 'Standard broadcast color space' },
    { id: 'rec2020', name: 'Rec.2020', description: 'Ultra HD color space' },
    { id: 'dci_p3', name: 'DCI-P3', description: 'Digital cinema color space' },
    { id: 'alexalux', name: 'Alexa LUX', description: 'ARRI Alexa film emulation' },
    { id: 'redlog', name: 'RED Log', description: 'RED camera log profile' },
    { id: 'slog3', name: 'S-Log3', description: 'Sony S-Log3 profile' }
  ];

  // Real-time effect processing
  const [activeTab, setActiveTab] = useState('color');
  const [previewMode, setPreviewMode] = useState('realtime');

  // Enhanced color correction functions
  const applyColorPreset = (presetId: string) => {
    const presets: Record<string, Partial<ColorCorrection>> = {
      neutral: { brightness: 0, contrast: 0, saturation: 0, temperature: 0 },
      cinematic: { contrast: 20, saturation: 15, temperature: -200, tint: 50, shadows: -10, highlights: -15 },
      vintage: { brightness: -10, contrast: -15, saturation: -20, temperature: 300, vibrance: -25 },
      warm: { temperature: 400, tint: 100, highlights: 10, shadows: -5 },
      cool: { temperature: -400, tint: -100, highlights: -10, shadows: 5 },
      dramatic: { contrast: 35, blacks: -20, whites: 15, vibrance: 20 },
      noir: { brightness: -20, contrast: 40, saturation: -30, shadows: -30 },
      vibrant: { saturation: 30, vibrance: 25, contrast: 15 },
      bleach: { contrast: 50, saturation: -40, highlights: 30, shadows: -20 },
      teal_orange: { temperature: -100, tint: 200, shadows: -15, highlights: 10 }
    };
    
    const preset = presets[presetId];
    if (preset) {
      setColorCorrection(prev => ({ ...prev, ...preset }));
      // Apply changes to video element in real-time
      applyFiltersToVideo();
    }
  };

  const applyFiltersToVideo = useCallback(() => {
    if (videoRef.current) {
      const filters = [
        `brightness(${100 + colorCorrection.brightness}%)`,
        `contrast(${100 + colorCorrection.contrast}%)`,
        `saturate(${100 + colorCorrection.saturation}%)`,
        `hue-rotate(${colorCorrection.hue}deg)`,
        `sepia(${Math.max(0, colorCorrection.temperature / 1000)})`,
        `blur(${Math.max(0, colorCorrection.exposure < 0 ? Math.abs(colorCorrection.exposure) / 20 : 0)}px)`
      ].join(' ');
      
      videoRef.current.style.filter = filters;
    }
  }, [colorCorrection]);

  // Apply filters whenever color correction changes
  useEffect(() => {
    applyFiltersToVideo();
  }, [applyFiltersToVideo]);

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
    // Real-time preview update
    if (previewMode === 'realtime') {
      applyFiltersToVideo();
    }
  };

  // Transition application function
  const applyTransition = (transitionId: string, duration: number = 1) => {
    if (selectedClip) {
      setClips(prev => prev.map(clip => 
        clip.id === selectedClip 
          ? { ...clip, transition: { type: transitionId, duration, properties: {} } }
          : clip
      ));
      
      toast({
        title: "Transition Applied",
        description: `${transitionPresets.find(t => t.id === transitionId)?.name} transition added`,
      });
    }
  };

  // Advanced effect controls
  const updateAdvancedEffect = (category: string, property: string, value: any) => {
    setAdvancedEffects(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [property]: value
      }
    }));
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

  // Social Media API Mutations
  const autoFormatMutation = useMutation({
    mutationFn: async (data: { videoId: string; platforms: string[] }) => {
      return await apiRequest('POST', '/api/social/auto-format', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Auto-Format Complete",
        description: `Generated ${data.versions.length} platform-optimized versions`,
      });
    }
  });

  const viralAnalysisMutation = useMutation({
    mutationFn: async (data: { videoContent: string; platform: string; duration: number }) => {
      return await apiRequest('POST', '/api/social/analyze-viral-potential', data);
    },
    onSuccess: (data) => {
      setViralAnalysis(data);
      setIsAnalyzing(false);
      toast({
        title: "Viral Analysis Complete",
        description: `Viral Score: ${data.viralScore}/100`,
      });
    }
  });

  const captionMutation = useMutation({
    mutationFn: async (data: { videoContent: string; platform: string; style: string }) => {
      return await apiRequest('POST', '/api/social/generate-captions', data);
    },
    onSuccess: (data) => {
      setGeneratedCaptions(data);
      toast({
        title: "Captions Generated",
        description: `Created ${data.variations.length} caption variations`,
      });
    }
  });

  const hashtagMutation = useMutation({
    mutationFn: async (data: { keywords: string[]; platform: string; contentType: string }) => {
      return await apiRequest('POST', '/api/social/hashtag-research', data);
    },
    onSuccess: (data) => {
      setHashtagSuggestions(data);
      toast({
        title: "Hashtag Research Complete",
        description: `Found ${data.hashtags.length} optimized hashtags`,
      });
    }
  });

  const publishMutation = useMutation({
    mutationFn: async (data: { videoId: string; platforms: string[]; content: any; scheduledTime?: string }) => {
      return await apiRequest('POST', '/api/social/publish', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Publishing Complete",
        description: `Successfully published to ${data.summary.successful}/${data.summary.total} platforms`,
      });
    }
  });

  const greenScreenMutation = useMutation({
    mutationFn: async (data: { videoId: string; backgroundType: string; customBackground?: string }) => {
      return await apiRequest('POST', '/api/social/green-screen', data);
    },
    onSuccess: () => {
      toast({
        title: "Green Screen Applied",
        description: "Background replacement processing complete",
      });
    }
  });

  // Fetch trending templates
  const { data: templates } = useQuery({
    queryKey: ['/api/social/trending-templates'],
    enabled: socialTab === 'templates'
  });

  // Fetch brand kit
  const { data: brandKit } = useQuery({
    queryKey: ['/api/social/brand-kit'],
    enabled: socialTab === 'brand'
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/social/analytics'],
    enabled: socialTab === 'analytics'
  });

  // Social Media Functions
  const runViralAnalysis = () => {
    setIsAnalyzing(true);
    viralAnalysisMutation.mutate({
      videoContent: `Video with ${clips.length} clips`,
      platform: selectedPlatforms[0] || 'instagram',
      duration: duration
    });
  };

  const generateCaptions = () => {
    captionMutation.mutate({
      videoContent: `Professional video content`,
      platform: selectedPlatforms[0] || 'instagram',
      style: captionStyle
    });
  };

  const researchHashtags = () => {
    hashtagMutation.mutate({
      keywords: ['video', 'content', 'creator'],
      platform: selectedPlatforms[0] || 'instagram',
      contentType: 'video'
    });
  };

  const publishToSocial = () => {
    const content = {
      caption: generatedCaptions?.generated?.caption || 'New video content!',
      hashtags: hashtagSuggestions?.hashtags?.slice(0, 5).map((h: any) => h.hashtag) || [],
      scheduledTime: scheduledTime || undefined
    };

    publishMutation.mutate({
      videoId: 'current-video',
      platforms: selectedPlatforms,
      content,
      scheduledTime
    });
  };

  const autoFormatForPlatforms = () => {
    autoFormatMutation.mutate({
      videoId: 'current-video',
      platforms: selectedPlatforms
    });
  };

  const applyGreenScreen = () => {
    setGreenScreenEnabled(true);
    greenScreenMutation.mutate({
      videoId: 'current-video',
      backgroundType: selectedBackground
    });
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
                  <h1 className="text-xl font-bold text-white">Social Media Creation Studio</h1>
                  <p className="text-sm text-gray-400">All-in-one video editing + viral content optimization</p>
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
            <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 text-xs">
              <TabsTrigger value="color">Color</TabsTrigger>
              <TabsTrigger value="transitions">Effects</TabsTrigger>
              <TabsTrigger value="social" className="text-cyan-400">Social</TabsTrigger>
              <TabsTrigger value="publish" className="text-green-400">Publish</TabsTrigger>
              <TabsTrigger value="analytics" className="text-purple-400">Analytics</TabsTrigger>
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

            {/* SOCIAL MEDIA CREATION STUDIO */}
            <TabsContent value="social" className="p-4 space-y-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">🚀 Social Media Creation Studio</h3>
                  <p className="text-xs text-gray-400">Transform your video into viral content for all platforms</p>
                </div>

                <Tabs value={socialTab} onValueChange={setSocialTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
                    <TabsTrigger value="platforms" className="text-xs">Platforms</TabsTrigger>
                    <TabsTrigger value="captions" className="text-xs">Captions</TabsTrigger>
                    <TabsTrigger value="viral" className="text-xs">Viral AI</TabsTrigger>
                    <TabsTrigger value="formats" className="text-xs">Formats</TabsTrigger>
                  </TabsList>

                  <TabsContent value="platforms" className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-300 mb-2 block">Select Target Platforms</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {platforms.map((platform) => (
                          <div
                            key={platform.id}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedPlatforms.includes(platform.id)
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                            }`}
                            onClick={() => {
                              setSelectedPlatforms(prev => 
                                prev.includes(platform.id) 
                                  ? prev.filter(p => p !== platform.id)
                                  : [...prev, platform.id]
                              );
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <platform.icon className="w-5 h-5 text-cyan-400" />
                              <div>
                                <div className="text-sm font-medium text-white">{platform.name}</div>
                                <div className="text-xs text-gray-400">{platform.format.ratio} • {platform.format.maxDuration}s max</div>
                              </div>
                            </div>
                            <div className="text-right">
                              {platform.connected ? (
                                <div>
                                  <div className="text-xs text-green-400">Connected</div>
                                  <div className="text-xs text-gray-400">{platform.followers?.toLocaleString()} followers</div>
                                </div>
                              ) : (
                                <div className="text-xs text-red-400">Not connected</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={autoFormatForPlatforms}
                        disabled={autoFormatMutation.isPending || selectedPlatforms.length === 0}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      >
                        <Monitor className="w-4 h-4 mr-2" />
                        {autoFormatMutation.isPending ? 'Processing...' : 'Auto-Format'}
                      </Button>
                      <Button
                        onClick={() => setGreenScreenEnabled(!greenScreenEnabled)}
                        variant={greenScreenEnabled ? "default" : "outline"}
                        className={greenScreenEnabled ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Green Screen
                      </Button>
                    </div>

                    {greenScreenEnabled && (
                      <div className="space-y-3 p-3 bg-gray-800/30 rounded-lg">
                        <Label className="text-sm text-gray-300">Virtual Background</Label>
                        <Select value={selectedBackground} onValueChange={setSelectedBackground}>
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="modern_office">Modern Office</SelectItem>
                            <SelectItem value="neon_city">Neon Cityscape</SelectItem>
                            <SelectItem value="nature_forest">Forest Paradise</SelectItem>
                            <SelectItem value="luxury_studio">Luxury Studio</SelectItem>
                            <SelectItem value="space_nebula">Space Nebula</SelectItem>
                            <SelectItem value="beach_sunset">Beach Sunset</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={applyGreenScreen}
                          disabled={greenScreenMutation.isPending}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                        >
                          {greenScreenMutation.isPending ? 'Applying...' : 'Apply Background'}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="captions" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-gray-300 mb-2 block">Caption Style</Label>
                        <Select value={captionStyle} onValueChange={setCaptionStyle}>
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="engaging">🔥 Engaging</SelectItem>
                            <SelectItem value="professional">💼 Professional</SelectItem>
                            <SelectItem value="fun">🎉 Fun & Playful</SelectItem>
                            <SelectItem value="educational">📚 Educational</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={generateCaptions}
                          disabled={captionMutation.isPending}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Bot className="w-4 h-4 mr-2" />
                          {captionMutation.isPending ? 'Generating...' : 'AI Captions'}
                        </Button>
                        <Button
                          onClick={researchHashtags}
                          disabled={hashtagMutation.isPending}
                          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        >
                          <Hash className="w-4 h-4 mr-2" />
                          {hashtagMutation.isPending ? 'Researching...' : 'Hashtags'}
                        </Button>
                      </div>

                      {generatedCaptions && (
                        <div className="space-y-3 p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <Label className="text-sm text-gray-300">Generated Caption</Label>
                            <div className="mt-2 p-3 bg-gray-700/50 rounded text-sm text-white">
                              {generatedCaptions.generated.caption}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {generatedCaptions.generated.hashtags?.map((tag: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="text-xs text-gray-400">
                            Viral Potential: {generatedCaptions.viralPotential}% • SEO Score: {generatedCaptions.seoScore}%
                          </div>
                        </div>
                      )}

                      <div>
                        <Label className="text-sm text-gray-300 mb-2 block">Auto-Translate Subtitles</Label>
                        <div className="grid grid-cols-3 gap-1 mb-2">
                          {[
                            { code: 'es', name: 'Spanish' },
                            { code: 'fr', name: 'French' },
                            { code: 'de', name: 'German' },
                            { code: 'zh', name: 'Chinese' },
                            { code: 'ja', name: 'Japanese' },
                            { code: 'pt', name: 'Portuguese' }
                          ].map((lang) => (
                            <Button
                              key={lang.code}
                              size="sm"
                              variant={targetLanguages.includes(lang.code) ? "default" : "outline"}
                              className="text-xs h-8"
                              onClick={() => {
                                setTargetLanguages(prev => 
                                  prev.includes(lang.code)
                                    ? prev.filter(l => l !== lang.code)
                                    : [...prev, lang.code]
                                );
                              }}
                            >
                              {lang.name}
                            </Button>
                          ))}
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                          disabled={targetLanguages.length === 0}
                        >
                          <Languages className="w-4 h-4 mr-2" />
                          Translate to {targetLanguages.length} Languages
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="viral" className="space-y-4">
                    <div className="text-center">
                      <Button
                        onClick={runViralAnalysis}
                        disabled={isAnalyzing}
                        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Viral Potential'}
                      </Button>
                    </div>

                    {viralAnalysis && (
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-lg">
                          <div className="text-3xl font-bold text-white mb-2">{viralAnalysis.viralScore}/100</div>
                          <div className="text-sm text-gray-300">Viral Score</div>
                        </div>

                        <div className="space-y-3">
                          <div className="text-sm font-medium text-white">Breakdown:</div>
                          {Object.entries(viralAnalysis.factors).map(([factor, score]) => (
                            <div key={factor} className="flex justify-between items-center">
                              <span className="text-xs text-gray-300 capitalize">
                                {factor.replace('_', ' ')}
                              </span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                                <span className="text-xs text-white w-8 text-right">{score}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-white">Predictions:</div>
                          <div className="space-y-1 text-xs text-gray-300">
                            <div>Views: {viralAnalysis.predictions.estimatedViews}</div>
                            <div>Probability: {viralAnalysis.predictions.viralProbability}</div>
                            <div>Peak: {viralAnalysis.predictions.peakTime}</div>
                            <div>Audience: {viralAnalysis.predictions.targetAudience}</div>
                          </div>
                        </div>

                        {viralAnalysis.improvements.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-white">Improvements:</div>
                            <div className="space-y-1">
                              {viralAnalysis.improvements.map((improvement, index) => (
                                <div key={index} className="text-xs text-yellow-400 flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{improvement}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="formats" className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-300 mb-3 block">Platform Preview</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedPlatforms.map((platformId) => {
                          const platform = platforms.find(p => p.id === platformId);
                          if (!platform) return null;
                          
                          return (
                            <div key={platformId} className="p-3 bg-gray-800/30 rounded-lg border border-gray-600">
                              <div className="flex items-center space-x-2 mb-2">
                                <platform.icon className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm font-medium text-white">{platform.name}</span>
                              </div>
                              <div className="space-y-1 text-xs text-gray-400">
                                <div>Format: {platform.format.ratio}</div>
                                <div>Max Duration: {platform.format.maxDuration}s</div>
                                <div>Resolution: {platform.format.width}x{platform.format.height}</div>
                              </div>
                              <div className="mt-2 aspect-video bg-gray-700 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-400">Preview</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        disabled={selectedPlatforms.length === 0}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate All Platform Versions
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Download All
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview Mode
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            {/* PUBLISHING & SCHEDULING */}
            <TabsContent value="publish" className="p-4 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-400 mb-2">📢 Publish & Schedule</h3>
                <p className="text-xs text-gray-400">One-click publishing to all connected platforms</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-300 mb-2 block">Schedule Publishing</Label>
                  <Input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={publishToSocial}
                    disabled={publishMutation.isPending || selectedPlatforms.length === 0}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {publishMutation.isPending ? 'Publishing...' : 'Publish Now'}
                  </Button>
                  <Button
                    disabled={selectedPlatforms.length === 0 || !scheduledTime}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Clock3 className="w-4 h-4 mr-2" />
                    Schedule Post
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-white">Publishing Status:</div>
                  {selectedPlatforms.map((platformId) => {
                    const platform = platforms.find(p => p.id === platformId);
                    if (!platform) return null;
                    
                    return (
                      <div key={platformId} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                        <div className="flex items-center space-x-2">
                          <platform.icon className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm text-white">{platform.name}</span>
                        </div>
                        <div className="text-xs text-green-400">Ready</div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <div className="text-sm font-medium text-blue-300 mb-1">🚀 Cross-Platform Strategy</div>
                  <div className="text-xs text-gray-300">
                    • Instagram: Post at 6-9 PM for maximum engagement<br/>
                    • TikTok: Upload during 6-10 PM peak hours<br/>
                    • YouTube: Schedule for 2-4 PM or 8-11 PM<br/>
                    • Twitter: Best times are 9 AM and 7-9 PM
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ANALYTICS & INSIGHTS */}
            <TabsContent value="analytics" className="p-4 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">📊 Analytics & Insights</h3>
                <p className="text-xs text-gray-400">Real-time performance tracking across all platforms</p>
              </div>

              {analytics && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-800/30 rounded-lg text-center">
                      <div className="text-lg font-bold text-white">{analytics.totals.views.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Total Views</div>
                    </div>
                    <div className="p-3 bg-gray-800/30 rounded-lg text-center">
                      <div className="text-lg font-bold text-white">{analytics.totals.likes.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Total Likes</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-white">Platform Performance:</div>
                    {analytics.platforms.slice(0, 3).map((platform: any) => (
                      <div key={platform.platform} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                        <div className="text-sm text-white capitalize">{platform.platform}</div>
                        <div className="text-right">
                          <div className="text-sm text-white">{platform.metrics.views.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">{platform.growth.engagement}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-white">Key Insights:</div>
                    {analytics.insights.slice(0, 3).map((insight: string, index: number) => (
                      <div key={index} className="text-xs text-gray-300 flex items-start">
                        <span className="mr-2 text-purple-400">•</span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </div>
              )}
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