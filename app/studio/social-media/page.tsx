'use client';

import { useState, useEffect, useRef, useMemo, useCallback, memo, lazy, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp, Users, DollarSign, Eye, Heart, MessageCircle, Share2,
  Zap, Sparkles, Target, BarChart3, Calendar, Clock, Globe,
  Instagram, Twitter, Youtube, Facebook, Play, Pause, Upload,
  Bot, Mic, Video, Image as ImageIcon, Type, Hash, Wand2, Send,
  Brain, Rocket, Crown, Star, Award, Trophy, Flame, Zap as Lightning,
  BarChart, PieChart, LineChart, Activity, Settings, Filter,
  Search, Plus, Minus, RefreshCw, CheckCircle, AlertCircle,
  Camera, Film, Music, Radio, Headphones, Speaker, Volume2,
  Edit, Copy, Trash2, Save, Download, Link, ExternalLink,
  ThumbsUp, ThumbsDown, Bookmark, Flag, Bell, BellOff,
  User, Users2, UserCheck, UserX, Shield, ShieldCheck,
  Palette, Brush, Layers, Grid, Layout, Maximize, Minimize,
  ZoomIn, ZoomOut, RotateCw, FlipHorizontal, FlipVertical,
  Crop, Scissors, Move, MousePointer, Hand, EyeOff,
  Sun, Moon, Monitor, Smartphone, Tablet, Laptop,
  Wifi, WifiOff, Battery, BatteryCharging, Signal, SignalLow
} from "lucide-react";
import { SiTiktok, SiSpotify, SiApple, SiSoundcloud } from "react-icons/si";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Loading component for lazy loaded components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

// Memoized Platform Card Component
const PlatformCard = memo(({ platform, onToggle, isSelected }: {
  platform: any;
  onToggle: (id: string) => void;
  isSelected: boolean;
}) => (
  <Card className="bg-slate-800 border-slate-700">
    <CardContent className="p-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${platform.color}`}>
          <platform.icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-white">{platform.name}</h3>
          <p className="text-sm text-slate-400">{platform.followers}</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Engagement</span>
          <span className="text-xs text-green-400">{platform.engagement}</span>
        </div>
        <Progress value={parseFloat(platform.engagement)} className="mt-1 h-2" />
      </div>
    </CardContent>
  </Card>
));

PlatformCard.displayName = 'PlatformCard';

// Memoized Recent Post Component
const RecentPost = memo(({ post }: { post: any }) => (
  <div className="bg-slate-900 p-4 rounded-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Badge 
          variant="secondary" 
          className={
            post.status === 'viral' ? 'bg-red-600' :
            post.status === 'trending' ? 'bg-orange-600' : 'bg-blue-600'
          }
        >
          {post.status}
        </Badge>
        <div>
          <h4 className="font-medium text-white">{post.content}</h4>
          <p className="text-sm text-slate-400">{post.platform}</p>
        </div>
      </div>
      <div className="flex items-center space-x-6 text-sm">
        <div className="text-center">
          <div className="text-white font-medium">{post.views.toLocaleString()}</div>
          <div className="text-slate-400 text-xs">views</div>
        </div>
        <div className="text-center">
          <div className="text-red-400 font-medium">{post.likes.toLocaleString()}</div>
          <div className="text-slate-400 text-xs">likes</div>
        </div>
        <div className="text-center">
          <div className="text-blue-400 font-medium">{post.comments}</div>
          <div className="text-slate-400 text-xs">comments</div>
        </div>
        <div className="text-center">
          <div className="text-green-400 font-medium">${post.earnings}</div>
          <div className="text-slate-400 text-xs">earned</div>
        </div>
      </div>
    </div>
  </div>
));

RecentPost.displayName = 'RecentPost';

export default function AdvancedSocialMediaStudio() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram", "tiktok", "youtube"]);
  const [contentType, setContentType] = useState("video");
  const [isGenerating, setIsGenerating] = useState(false);
  const [earnings, setEarnings] = useState(342.50);
  const [totalViews, setTotalViews] = useState(128497);
  const [engagement, setEngagement] = useState(94.2);
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [autoPost, setAutoPost] = useState(false);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [aiOptimization, setAiOptimization] = useState(true);
  const [realTimeAnalytics, setRealTimeAnalytics] = useState(true);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);

  const queryClient = useQueryClient();

  // Enhanced API queries
  const { data: platformStatsData } = useQuery({
    queryKey: ["/api/social/platform-stats"],
    enabled: true
  });

  const { data: contentAnalytics } = useQuery({
    queryKey: ["/api/social/analytics"],
    enabled: true
  });

  const { data: trendsData } = useQuery({
    queryKey: ["/api/social/trends"],
    enabled: true
  });

  const { data: aiAgents } = useQuery({
    queryKey: ["/api/social/ai-agents"],
    enabled: true
  });

  const { data: contentLibrary } = useQuery({
    queryKey: ["/api/social/content"],
    enabled: true
  });

  const { data: audienceInsights } = useQuery({
    queryKey: ["/api/social/audience"],
    enabled: true
  });

  // Enhanced mutations
  const generateContentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/social/generate-content", "POST", data),
    onSuccess: () => {
      setIsGenerating(false);
      queryClient.invalidateQueries({ queryKey: ["/api/social/content"] });
    }
  });

  const deployContentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/social/deploy", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social/deployments"] });
    }
  });

  const optimizeContentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/social/optimize", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social/analytics"] });
    }
  });

  // Advanced platform configurations
  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-600", followers: "45.2K", engagement: "8.4%", features: ["Stories", "Reels", "Posts", "IGTV"] },
    { id: "tiktok", name: "TikTok", icon: SiTiktok, color: "bg-black", followers: "127K", engagement: "12.7%", features: ["Videos", "Live", "Duets", "Stitches"] },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-600", followers: "23.8K", engagement: "6.2%", features: ["Videos", "Shorts", "Live", "Community"] },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-blue-500", followers: "18.9K", engagement: "5.1%", features: ["Tweets", "Threads", "Spaces", "Fleets"] },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-700", followers: "34.1K", engagement: "3.8%", features: ["Posts", "Stories", "Live", "Groups"] },
    { id: "spotify", name: "Spotify", icon: SiSpotify, color: "bg-green-600", followers: "89.3K", engagement: "15.2%", features: ["Podcasts", "Episodes", "Clips"] },
    { id: "apple", name: "Apple Podcasts", icon: SiApple, color: "bg-gray-800", followers: "67.1K", engagement: "9.8%", features: ["Episodes", "Series", "Clips"] },
    { id: "soundcloud", name: "SoundCloud", icon: SiSoundcloud, color: "bg-orange-600", followers: "156K", engagement: "11.3%", features: ["Tracks", "Playlists", "Live"] }
  ];

  // Advanced content types with AI capabilities
  const contentTypes = [
    { id: "video", name: "AI Video Generation", icon: Video, description: "AI-powered video creation with custom scripts", aiFeatures: ["Script writing", "Scene generation", "Voice synthesis"] },
    { id: "image", name: "Smart Image Creation", icon: ImageIcon, description: "AI-generated visuals with brand consistency", aiFeatures: ["Style transfer", "Object recognition", "Color optimization"] },
    { id: "text", name: "Content Writing Assistant", icon: Type, description: "AI-powered copywriting with tone analysis", aiFeatures: ["Tone matching", "SEO optimization", "Hashtag generation"] },
    { id: "carousel", name: "Dynamic Carousel Builder", icon: BarChart3, description: "Multi-slide content with AI sequencing", aiFeatures: ["Storytelling", "Flow optimization", "Engagement prediction"] },
    { id: "live", name: "Live Stream Producer", icon: Radio, description: "AI-assisted live streaming with real-time features", aiFeatures: ["Chat moderation", "Content suggestions", "Audience analysis"] },
    { id: "story", name: "Story Series Creator", icon: Layers, description: "Connected story content with AI narrative", aiFeatures: ["Series planning", "Hook generation", "Engagement tracking"] }
  ];

  // Advanced AI agents with specialized roles
  const aiAgentsList = [
    {
      name: "Content Strategist",
      icon: Brain,
      status: "active",
      description: "Plans content calendars and optimizes posting strategies",
      tasksCompleted: 47,
      color: "text-purple-400",
      capabilities: ["Strategy planning", "Performance analysis", "Trend prediction"]
    },
    {
      name: "Creative Director",
      icon: Sparkles,
      status: "active",
      description: "Generates viral content ideas and creative concepts",
      tasksCompleted: 89,
      color: "text-pink-400",
      capabilities: ["Idea generation", "Concept development", "Style analysis"]
    },
    {
      name: "Trend Analyzer",
      icon: TrendingUp,
      status: "active",
      description: "Monitors trending topics and predicts viral potential",
      tasksCompleted: 156,
      color: "text-green-400",
      capabilities: ["Trend monitoring", "Viral prediction", "Market analysis"]
    },
    {
      name: "Audience Psychologist",
      icon: Users,
      status: "active",
      description: "Analyzes audience behavior and optimizes engagement",
      tasksCompleted: 78,
      color: "text-blue-400",
      capabilities: ["Behavior analysis", "Engagement optimization", "Persona creation"]
    },
    {
      name: "Performance Optimizer",
      icon: BarChart,
      status: "active",
      description: "A/B tests content and optimizes for maximum reach",
      tasksCompleted: 234,
      color: "text-orange-400",
      capabilities: ["A/B testing", "Performance tracking", "Algorithm analysis"]
    },
    {
      name: "Crisis Manager",
      icon: Shield,
      status: "standby",
      description: "Monitors sentiment and handles reputation management",
      tasksCompleted: 12,
      color: "text-red-400",
      capabilities: ["Sentiment analysis", "Crisis detection", "Response generation"]
    }
  ];

  // Advanced analytics metrics
  const analyticsMetrics = [
    { label: "Total Reach", value: "2.4M", change: "+18.3%", trend: "up" },
    { label: "Engagement Rate", value: "12.7%", change: "+5.2%", trend: "up" },
    { label: "Conversion Rate", value: "3.8%", change: "+12.1%", trend: "up" },
    { label: "Average Views", value: "45.2K", change: "+8.7%", trend: "up" },
    { label: "Follower Growth", value: "+2.3K", change: "+15.4%", trend: "up" },
    { label: "Revenue Generated", value: "$12.4K", change: "+22.8%", trend: "up" }
  ];

  // Content performance insights
  const contentInsights = [
    { type: "Top Performing", content: "Dance Challenge Video", platform: "TikTok", metrics: { views: "2.1M", engagement: "18.3%" } },
    { type: "Viral Potential", content: "Behind-the-Scenes", platform: "Instagram", metrics: { views: "890K", engagement: "12.7%" } },
    { type: "Audience Favorite", content: "Q&A Session", platform: "YouTube", metrics: { views: "456K", engagement: "15.2%" } },
    { type: "Trending Topic", content: "Music Production Tips", platform: "Twitter", metrics: { views: "234K", engagement: "9.8%" } }
  ];

  // Real-time notifications
  const notifications = [
    { id: 1, type: "trend", message: "🎯 New trending sound detected on TikTok", time: "2 min ago", priority: "high" },
    { id: 2, type: "engagement", message: "📈 Post reached 100K views milestone", time: "15 min ago", priority: "medium" },
    { id: 3, type: "opportunity", message: "💡 AI suggests posting about current trend", time: "1 hour ago", priority: "low" },
    { id: 4, type: "alert", message: "⚠️ Engagement dropping on Instagram", time: "2 hours ago", priority: "high" }
  ];

  // Advanced content creation tools
  const creationTools = [
    {
      name: "AI Script Writer",
      description: "Generate compelling scripts with perfect timing",
      features: ["Hook generation", "Story structure", "Call-to-action"],
      usage: "85% of videos"
    },
    {
      name: "Visual Style Analyzer",
      description: "Analyze successful content and replicate styles",
      features: ["Color palette extraction", "Composition analysis", "Brand consistency"],
      usage: "92% of images"
    },
    {
      name: "Hashtag Optimizer",
      description: "Find trending and relevant hashtags automatically",
      features: ["Trend analysis", "Competition research", "Performance tracking"],
      usage: "78% of posts"
    },
    {
      name: "Posting Scheduler",
      description: "Schedule content for optimal engagement times",
      features: ["Timezone optimization", "Platform-specific timing", "A/B testing"],
      usage: "94% of content"
    }
  ];

  // Theme configurations
  const themes = {
    dark: { bg: 'bg-gray-900', card: 'bg-gray-800/50', text: 'text-white', accent: 'text-cyan-400' },
    light: { bg: 'bg-gray-50', card: 'bg-white', text: 'text-gray-900', accent: 'text-blue-600' },
    neon: { bg: 'bg-black', card: 'bg-gray-900/80', text: 'text-green-400', accent: 'text-pink-400' },
    studio: { bg: 'bg-gradient-to-br from-blue-900 to-purple-900', card: 'bg-white/10', text: 'text-white', accent: 'text-yellow-400' }
  };

  const currentTheme = useMemo(() => themes[selectedTheme as keyof typeof themes], [selectedTheme]);

  // Memoized expensive computations
  const analyticsSummary = useMemo(() => ({
    totalEarnings: earnings,
    totalViews: totalViews,
    engagementRate: engagement,
    growth: ((earnings - 280.00) / 280.00) * 100
  }), [earnings, totalViews, engagement]);

  const computedPlatformStats = useMemo(() => ({
    activePlatforms: selectedPlatforms.length,
    totalReach: selectedPlatforms.reduce((acc, platform) => acc + (platform === 'instagram' ? 45000 : platform === 'tiktok' ? 89000 : 67000), 0),
    avgEngagement: engagement
  }), [selectedPlatforms, engagement]);

  const revenueStreams = useMemo(() => [
    { name: "Pay-to-View Earnings", amount: 184.30, change: "+23%", icon: Eye, color: "text-green-400" },
    { name: "Sponsored Content", amount: 89.50, change: "+12%", icon: DollarSign, color: "text-blue-400" },
    { name: "Creator Fund", amount: 45.70, change: "+8%", icon: Zap, color: "text-purple-400" },
    { name: "Tips & Donations", amount: 23.00, change: "+45%", icon: Heart, color: "text-red-400" }
  ], []);

  const recentPosts = [
    {
      id: 1,
      platform: "TikTok",
      content: "Ultimate DJ Studio Demo",
      views: 45620,
      likes: 2834,
      comments: 492,
      shares: 187,
      earnings: 34.50,
      status: "viral"
    },
    {
      id: 2,
      platform: "Instagram",
      content: "Music Production Tips",
      views: 18930,
      likes: 1247,
      comments: 89,
      shares: 156,
      earnings: 18.90,
      status: "trending"
    },
    {
      id: 3,
      platform: "YouTube",
      content: "Artist Tech Features",
      views: 12450,
      likes: 896,
      comments: 67,
      shares: 234,
      earnings: 29.80,
      status: "growing"
    }
  ];

  // Handle content generation
  const handleGenerateContent = useCallback(async () => {
    console.log('Starting content generation...');
    setIsGenerating(true);
    setShowGeneratedContent(false);

    try {
      const result = await generateContentMutation.mutateAsync({
        platforms: selectedPlatforms,
        contentType,
        topic: "music production",
        style: "engaging",
        includeHashtags: true
      });

      console.log('Content generation result:', result);

      if (result && result.content) {
        setGeneratedContent(result.content);
        setShowGeneratedContent(true);
      }

    } catch (error) {
      console.error('Content generation failed:', error);
      setGeneratedContent({ error: 'Failed to generate content. Please try again.' });
      setShowGeneratedContent(true);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedPlatforms, contentType, generateContentMutation]);

  // Handle platform selection
  const togglePlatform = useCallback((platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  }, []);

  // Handle content type selection
  const selectContentType = useCallback((typeId: string) => {
    setContentType(typeId);
  }, []);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEarnings(prev => prev + Math.random() * 2);
      setTotalViews(prev => prev + Math.floor(Math.random() * 50));
      setEngagement(prev => Math.max(90, Math.min(98, prev + (Math.random() - 0.5) * 2)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Social Media Command Center
            </h1>
            <p className="text-slate-400 mt-1">
              Revolutionary "pay-to-view" platform • 10x higher payouts than traditional social media
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 rounded-lg animate-pulse">
              <DollarSign className="w-4 h-4 text-white" />
              <span className="text-white font-bold">${earnings.toFixed(2)}</span>
              <span className="text-green-100 text-sm">earned today</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-lg">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-white font-medium">{totalViews.toLocaleString()}</span>
              <span className="text-slate-400">total views</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-lg">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-white font-medium">{engagement.toFixed(1)}%</span>
              <span className="text-slate-400">engagement</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800 mb-6">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-purple-600">
            <Wand2 className="w-4 h-4 mr-2" />
            Content Hub
          </TabsTrigger>
          <TabsTrigger value="deploy" className="data-[state=active]:bg-green-600">
            <Send className="w-4 h-4 mr-2" />
            Auto Deploy
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="ai-agents" className="data-[state=active]:bg-cyan-600">
            <Bot className="w-4 h-4 mr-2" />
            AI Agents
          </TabsTrigger>
          <TabsTrigger value="earnings" className="data-[state=active]:bg-emerald-600">
            <DollarSign className="w-4 h-4 mr-2" />
            Pay-to-View
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Platform Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                onToggle={togglePlatform}
                isSelected={selectedPlatforms.includes(platform.id)}
              />
            ))}
          </div>

          {/* Recent Posts Performance */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Content Performance</CardTitle>
              <CardDescription>Live tracking of your latest posts across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <RecentPost key={post.id} post={post} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Hub Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Generator */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400">AI Content Generator</CardTitle>
                <CardDescription>Create viral content for multiple platforms simultaneously</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Platform Selection */}
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Select Platforms</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {platforms.slice(0, 3).map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedPlatforms.includes(platform.id)
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        <platform.icon className="w-5 h-5 mx-auto mb-1 text-white" />
                        <div className="text-xs text-white">{platform.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Type */}
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Content Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {contentTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => selectContentType(type.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          contentType === type.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        <type.icon className="w-4 h-4 mb-2 text-white" />
                        <div className="text-sm font-medium text-white">{type.name}</div>
                        <div className="text-xs text-slate-400">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={handleGenerateContent}
                  disabled={isGenerating || generateContentMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Viral Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Content Preview */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400">Content Preview</CardTitle>
                <CardDescription>AI-generated content ready for deployment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isGenerating ? (
                  <div className="bg-slate-900 p-8 rounded-lg text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
                    <p className="text-slate-300">Generating content...</p>
                  </div>
                ) : showGeneratedContent && generatedContent ? (
                  <div className="bg-slate-900 p-4 rounded-lg">
                    {generatedContent.error ? (
                      <div className="text-red-400">
                        <h4 className="font-medium text-white mb-2">Error</h4>
                        <p className="text-sm">{generatedContent.error}</p>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-medium text-white mb-2">Generated Caption</h4>
                        <p className="text-slate-300 text-sm mb-3">
                          {generatedContent.caption || generatedContent.content || "Content generated successfully!"}
                        </p>
                        {generatedContent.hashtags && (
                          <div className="flex flex-wrap gap-2">
                            {generatedContent.hashtags.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">#{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Caption</h4>
                    <p className="text-slate-300 text-sm mb-3">
                      🎵 Mind-blown by these AI music production features! Artist Tech is literally changing the game -
                      from stem separation to real-time collaboration. The future of music creation is HERE! 🚀
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">#MusicProduction</Badge>
                      <Badge variant="outline" className="text-xs">#AIMusic</Badge>
                      <Badge variant="outline" className="text-xs">#TechInnovation</Badge>
                      <Badge variant="outline" className="text-xs">#MusicTech</Badge>
                    </div>
                  </div>
                )}

                <div className="bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Platform Optimizations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Instagram:</span>
                      <span className="text-blue-400">Square video + Stories</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">TikTok:</span>
                      <span className="text-purple-400">Vertical 9:16 + Trending audio</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">YouTube:</span>
                      <span className="text-red-400">16:9 + SEO description</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Send className="w-4 h-4 mr-2" />
                    Deploy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Auto Deploy Tab */}
        <TabsContent value="deploy" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-green-400">Automated Content Deployment</CardTitle>
              <CardDescription>Schedule and manage posts across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Deployment Queue</h4>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-slate-900 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">Music Studio Demo #{i}</span>
                          <Badge variant="secondary" className="bg-green-600">Scheduled</Badge>
                        </div>
                        <div className="text-sm text-slate-400">
                          <div className="flex justify-between">
                            <span>Platform:</span>
                            <span className="text-white">Instagram, TikTok</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Schedule:</span>
                            <span className="text-blue-400">Today 2:30 PM</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-white">Deployment Settings</h4>
                  <div className="bg-slate-900 p-4 rounded-lg space-y-4">
                    <div>
                      <label className="text-sm text-slate-400">Posting Frequency</label>
                      <select className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white">
                        <option>3 times per day</option>
                        <option>5 times per day</option>
                        <option>Hourly</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Optimal Timing</label>
                      <div className="mt-2">
                        <Badge className="bg-blue-600">AI-Optimized</Badge>
                        <p className="text-xs text-slate-400 mt-1">Based on audience activity patterns</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Content Themes</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">Music Production</Badge>
                        <Badge variant="outline">DJ Tips</Badge>
                        <Badge variant="outline">Tech Reviews</Badge>
                        <Badge variant="outline">Studio Tours</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-400">Total Views</span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">{totalViews.toLocaleString()}</div>
                <div className="text-sm text-green-400">+23% from last week</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="text-slate-400">Engagement Rate</span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">{engagement.toFixed(1)}%</div>
                <div className="text-sm text-green-400">+8.3% from last week</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-400">New Followers</span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">2,847</div>
                <div className="text-sm text-green-400">+42% from last week</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-5 h-5 text-green-400" />
                  <span className="text-slate-400">Shares</span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">1,432</div>
                <div className="text-sm text-green-400">+67% from last week</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-slate-900 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                  <p className="text-slate-400">Analytics chart visualization</p>
                  <p className="text-slate-500 text-sm">Real-time performance data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Agents Tab */}
        <TabsContent value="ai-agents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiAgentsList.map((agent) => (
              <Card key={agent.name} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className={`flex items-center ${agent.color}`}>
                    <agent.icon className="w-5 h-5 mr-2" />
                    {agent.name}
                    <Badge variant="secondary" className="ml-auto bg-green-600">
                      {agent.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Tasks Completed Today</span>
                      <span className="text-white font-medium">{agent.tasksCompleted}</span>
                    </div>
                    <Progress value={(agent.tasksCompleted / 50) * 100} className="h-2" />
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pay-to-View Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <Card className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 border-emerald-700">
            <CardHeader>
              <CardTitle className="text-emerald-400 text-xl">Revolutionary Pay-to-View Model</CardTitle>
              <CardDescription className="text-emerald-200">
                World's first platform that pays users for viewing content • 10x higher creator payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {revenueStreams.map((stream) => (
                  <div key={stream.name} className="bg-slate-800/80 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <stream.icon className={`w-4 h-4 ${stream.color}`} />
                      <span className="text-slate-300 text-sm">{stream.name}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">${stream.amount}</div>
                    <div className={`text-sm ${stream.color}`}>{stream.change}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400">Viewer Rewards System</CardTitle>
                <CardDescription>How users earn while consuming content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Earning Rates</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Viewing (per minute):</span>
                        <span className="text-green-400">1 ArtistCoin</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Liking content:</span>
                        <span className="text-green-400">2 ArtistCoins</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Commenting:</span>
                        <span className="text-green-400">5 ArtistCoins</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sharing:</span>
                        <span className="text-green-400">10 ArtistCoins</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Live Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Viewers:</span>
                        <span className="text-white">12,847</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Coins Distributed:</span>
                        <span className="text-blue-400">2.3M today</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Average View Time:</span>
                        <span className="text-purple-400">4.2 minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Creator Earnings Comparison</CardTitle>
                <CardDescription>Artist Tech vs Traditional Platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-3">Per 1,000 Plays</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                          <span className="text-white font-medium">Artist Tech</span>
                        </div>
                        <span className="text-green-400 font-bold">$53.20</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-600 rounded"></div>
                          <span className="text-slate-400">Spotify</span>
                        </div>
                        <span className="text-slate-400">$3.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-red-600 rounded"></div>
                          <span className="text-slate-400">YouTube</span>
                        </div>
                        <span className="text-slate-400">$1.80</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-orange-600 rounded"></div>
                          <span className="text-slate-400">SoundCloud</span>
                        </div>
                        <span className="text-slate-400">$0.40</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-900/30 border border-emerald-700 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400">17.7x</div>
                      <div className="text-emerald-200 text-sm">Higher payouts than Spotify</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}