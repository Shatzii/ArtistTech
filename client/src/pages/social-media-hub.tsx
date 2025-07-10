import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  DollarSign, 
  Eye, 
  Users, 
  TrendingUp, 
  Zap, 
  Crown,
  Star,
  Coins,
  Rocket,
  Globe,
  MessageCircle,
  Heart,
  Share as Share2,
  BarChart3,
  Clock,
  Gift,
  Target,
  Trophy,
  Flame,
  Music,
  Camera,
  Mic,
  Video,
  Headphones,
  Radio,
  Palette,
  Gamepad2,
  Sparkles,
  Search,
  Bell,
  HelpCircle,
  Brain,
  TrendingDown,
  Home,
  X,
  LogOut,
  User
} from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube, SiX, SiSpotify, SiFacebook, SiTwitch, SiDiscord } from "react-icons/si";
import { Link } from "wouter";
import { useAuth } from "../contexts/AuthContext";

// Revolutionary Social Media Hub - The First Platform That Pays to View Content

interface RewardMetrics {
  totalEarned: number;
  viewingRewards: number;
  creationRewards: number;
  engagementRewards: number;
  dailyStreak: number;
  rank: string;
  nextRankProgress: number;
}

interface PlatformStats {
  platform: string;
  icon: any;
  earnings: number;
  viewers: number;
  timeWatched: string;
  growth: number;
  color: string;
}

interface StudioFeature {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  route: string;
  badge?: string;
}

export default function SocialMediaHub() {
  const { user, logout } = useAuth();
  const [rewardMetrics, setRewardMetrics] = useState<RewardMetrics>({
    totalEarned: 2847.32,
    viewingRewards: 1523.45,
    creationRewards: 892.18,
    engagementRewards: 431.69,
    dailyStreak: 23,
    rank: "Gold Creator",
    nextRankProgress: 73
  });

  const [isEarning, setIsEarning] = useState(false);
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'earnings' | 'studios' | 'analytics'>('overview');

  // Check if user is new (show onboarding)
  useEffect(() => {
    const hasVisited = localStorage.getItem('artisttech-visited');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('artisttech-visited', 'true');
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Could trigger confetti or celebration animation here
  };

  const platformStats: PlatformStats[] = [
    {
      platform: "TikTok",
      icon: SiTiktok,
      earnings: 892.34,
      viewers: 45200,
      timeWatched: "127h",
      growth: 23.4,
      color: "#ff0050"
    },
    {
      platform: "Instagram",
      icon: SiInstagram,
      earnings: 743.21,
      viewers: 38100,
      timeWatched: "98h",
      growth: 18.7,
      color: "#e4405f"
    },
    {
      platform: "YouTube",
      icon: SiYoutube,
      earnings: 654.87,
      viewers: 29800,
      timeWatched: "156h",
      growth: 15.2,
      color: "#ff0000"
    },
    {
      platform: "Spotify",
      icon: SiSpotify,
      earnings: 387.45,
      viewers: 12300,
      timeWatched: "67h",
      growth: 31.8,
      color: "#1db954"
    },
    {
      platform: "Twitch",
      icon: SiTwitch,
      earnings: 169.45,
      viewers: 8900,
      timeWatched: "43h",
      growth: 28.3,
      color: "#9146ff"
    }
  ];

  const studioFeatures: StudioFeature[] = [
    {
      id: "music-studio",
      name: "Music Studio Pro",
      description: "Professional DAW with AI composition, unlimited tracks, VST support",
      icon: Music,
      color: "from-purple-600 to-blue-600",
      route: "/ultimate-music-studio",
      badge: "PRO"
    },
    {
      id: "dj-studio",
      name: "Ultimate DJ Studio",
      description: "Real-time stem separation, harmonic mixing, crowd analytics",
      icon: Headphones,
      color: "from-orange-600 to-red-600",
      route: "/ultimate-dj-studio",
      badge: "LIVE"
    },
    {
      id: "video-studio",
      name: "Video Creator Pro",
      description: "8K editing, AI effects, cinematic tools surpassing Premiere Pro",
      icon: Video,
      color: "from-green-600 to-emerald-600",
      route: "/video-studio",
      badge: "AI"
    },
    {
      id: "podcast-studio",
      name: "Podcast Studio Pro",
      description: "Live streaming, AI transcription, social clips automation",
      icon: Mic,
      color: "from-cyan-600 to-blue-600",
      route: "/podcast-studio",
      badge: "NEW"
    },
    {
      id: "visual-studio",
      name: "Visual Arts Studio",
      description: "AI background removal, neural style transfer, 16K upscaling",
      icon: Palette,
      color: "from-pink-600 to-purple-600",
      route: "/visual-studio",
      badge: "AI"
    },
    {
      id: "collaborative-studio",
      name: "Collaborative Studio",
      description: "Real-time multi-user editing, voice chat, version control",
      icon: Users,
      color: "from-yellow-600 to-orange-600",
      route: "/collaborative-studio",
      badge: "COLLAB"
    },
    {
      id: "ai-career",
      name: "AI Career Manager",
      description: "4 AI Agents • Complete career automation • Real-time analytics",
      icon: BarChart3,
      color: "from-indigo-600 to-purple-600",
      route: "/ai-career-manager",
      badge: "AI"
    },
    {
      id: "genre-remixer",
      name: "Genre Remixer AI",
      description: "Cross-genre collaboration, remix opportunities, AI analysis",
      icon: Gamepad2,
      color: "from-teal-600 to-cyan-600",
      route: "/genre-remixer",
      badge: "AI"
    },
    {
      id: "social-media-studio",
      name: "Social Media Studio",
      description: "Multi-platform content creation, AI optimization, viral tracking",
      icon: Globe,
      color: "from-rose-600 to-pink-600",
      route: "/social-media-studio",
      badge: "VIRAL"
    },
    {
      id: "crypto-studio",
      name: "ArtistCoin Studio",
      description: "Cryptocurrency rewards, gamification, influencer partnerships",
      icon: Coins,
      color: "from-amber-600 to-yellow-600",
      route: "/crypto-studio",
      badge: "CRYPTO"
    },
    {
      id: "vr-studio",
      name: "VR Studio",
      description: "Immersive VR environments, spatial audio, hand tracking",
      icon: Zap,
      color: "from-violet-600 to-purple-600",
      route: "/vr-studio",
      badge: "VR"
    },
    {
      id: "artist-collaboration",
      name: "Artist Collaboration",
      description: "Cross-genre partnerships, AI matchmaking, project discovery",
      icon: Users,
      color: "from-emerald-600 to-teal-600",
      route: "/artist-collaboration",
      badge: "COLLAB"
    },
    {
      id: "nft-marketplace",
      name: "NFT Marketplace",
      description: "Blockchain integration, automated royalties, artist profiles",
      icon: Crown,
      color: "from-fuchsia-600 to-purple-600",
      route: "/nft-marketplace",
      badge: "NFT"
    },
    {
      id: "admin-dashboard",
      name: "Admin Control Center",
      description: "System monitoring, user management, enterprise controls",
      icon: Settings,
      color: "from-red-600 to-pink-600",
      route: "/admin",
      badge: "ADMIN"
    },
    {
      id: "education-hub",
      name: "Education Hub",
      description: "Live streaming classes, curriculum management, progress tracking",
      icon: Brain,
      color: "from-blue-600 to-indigo-600",
      route: "/education",
      badge: "EDU"
    }
  ];

  // Live earning simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isEarning) {
      interval = setInterval(() => {
        setCurrentEarnings(prev => prev + Math.random() * 0.05);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEarning]);

  const toggleEarning = () => {
    if (isEarning) {
      setRewardMetrics(prev => ({
        ...prev,
        totalEarned: prev.totalEarned + currentEarnings,
        viewingRewards: prev.viewingRewards + currentEarnings
      }));
      setCurrentEarnings(0);
    }
    setIsEarning(!isEarning);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      {/* Enhanced Navigation Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/artist-tech-logo-new.jpeg" 
                alt="Artist Tech" 
                className="w-10 h-10 rounded-lg object-contain"
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ARTIST TECH
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchOpen(true)}
                className="text-gray-300 hover:text-white"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowOnboarding(true)}
                className="text-gray-300 hover:text-white"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Badge className="bg-green-600 text-white">
                <Bell className="h-3 w-3 mr-1" />
                Live
              </Badge>

              {/* User Menu */}
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-gray-300 hidden sm:inline">
                    {user?.email || 'User'}
                  </span>
                  {user?.role === 'admin' && (
                    <Badge className="bg-purple-600 text-xs">ADMIN</Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-gray-300 hover:text-red-400"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'studios', label: 'Studios', icon: Brain },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={currentView === id ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView(id as any)}
                className={`text-xs ${
                  currentView === id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/artist-tech-logo-new.jpeg" 
              alt="Artist Tech" 
              className="w-16 h-16 rounded-lg object-contain mr-4"
            />
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              ARTIST TECH
            </h1>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            🌟 FIRST PLATFORM TO PAY USERS FOR VIEWING CONTENT 🌟
          </h2>

          <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto text-cyan-100">
            Revolutionary "pay-to-view" model disrupts traditional social media. Earn ArtistCoins every minute you spend consuming content!
          </p>

          <div className="flex items-center justify-center space-x-8 mb-8">
            <Badge className="bg-green-600 text-white px-6 py-3 text-lg">
              <DollarSign className="mr-2" />
              ${(rewardMetrics.totalEarned + currentEarnings).toFixed(2)} Earned
            </Badge>
            <Badge className="bg-yellow-600 text-white px-6 py-3 text-lg">
              <Flame className="mr-2" />
              🔥 {rewardMetrics.dailyStreak} Day Streak
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={toggleEarning}
              size="lg" 
              className={`px-8 py-4 text-lg font-bold ${isEarning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isEarning ? (
                <>
                  <Pause className="mr-2" /> Stop Earning (+${currentEarnings.toFixed(2)})
                </>
              ) : (
                <>
                  <Play className="mr-2" /> Start Earning Money Now
                </>
              )}
            </Button>

            <Link href="/artistcoin-viral">
              <Button size="lg" className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <Coins className="mr-2 animate-spin" /> ArtistCoin Hub
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Dynamic Content Based on Current View */}
        {currentView === 'overview' && (
          <>
            {/* Live Earnings Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-green-600 to-emerald-700 border-0 text-white col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <DollarSign className="mr-3 h-8 w-8" />
                Live Earnings Counter
                {isEarning && <Zap className="ml-2 h-6 w-6 animate-pulse text-yellow-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">
                ${(rewardMetrics.totalEarned + currentEarnings).toFixed(2)}
                {isEarning && <span className="text-lg text-green-200 ml-2">+${currentEarnings.toFixed(2)} live</span>}
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-green-200">Viewing Rewards</div>
                  <div className="font-bold">${rewardMetrics.viewingRewards.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-green-200">Creation Rewards</div>
                  <div className="font-bold">${rewardMetrics.creationRewards.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-green-200">Engagement Rewards</div>
                  <div className="font-bold">${rewardMetrics.engagementRewards.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-600 to-orange-700 border-0 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="mr-2" />
                Creator Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{rewardMetrics.rank}</div>
              <Progress value={rewardMetrics.nextRankProgress} className="mb-2" />
              <div className="text-sm text-yellow-200">{rewardMetrics.nextRankProgress}% to Diamond</div>
              <div className="flex items-center mt-4">
                <Flame className="mr-2 h-5 w-5 text-yellow-400" />
                <span>{rewardMetrics.dailyStreak} day streak</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance */}
        <Card className="mb-12 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <BarChart3 className="mr-3" />
              Platform Performance & Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {platformStats.map((platform, index) => (
                <Card key={index} className="bg-gray-900 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <platform.icon className="h-6 w-6" style={{ color: platform.color }} />
                      <Badge className="bg-green-600 text-xs">+{platform.growth}%</Badge>
                    </div>
                    <h3 className="font-bold text-white">{platform.platform}</h3>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Earnings: <span className="text-green-400 font-bold">${platform.earnings}</span></div>
                      <div>Viewers: <span className="text-blue-400">{platform.viewers.toLocaleString()}</span></div>
                      <div>Watch Time: <span className="text-purple-400">{platform.timeWatched}</span></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revolutionary Studios Showcase */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              🚀 15 REVOLUTIONARY AI-POWERED STUDIOS 🚀
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional-grade tools that replace entire industry software suites - all in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studioFeatures.map((studio) => (
              <Link key={studio.id} href={studio.route}>
                <Card className="bg-gray-800 border-gray-600 hover:border-blue-500 transition-all transform hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${studio.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <studio.icon className="w-6 h-6 text-white" />
                      </div>
                      {studio.badge && (
                        <Badge className="bg-blue-600 text-white text-xs">
                          {studio.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {studio.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {studio.description}
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600">
                      <Rocket className="w-4 h-4 mr-2" />
                      Launch Studio
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Access Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/global-dashboard">
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 text-white cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Global Dashboard</h3>
                <p className="text-blue-100">Complete platform overview and analytics</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/artist-fan-engagement">
            <Card className="bg-gradient-to-br from-pink-600 to-red-600 border-0 text-white cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Fan Engagement</h3>
                <p className="text-pink-100">Connect with your audience and grow</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/enterprise-management">
            <Card className="bg-gradient-to-br from-green-600 to-emerald-600 border-0 text-white cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Enterprise Suite</h3>
                <p className="text-green-100">Professional business management</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Revolutionary Feature Callout */}
        <Card className="mt-12 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 border-0 text-white">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 animate-pulse" />
            <h3 className="text-3xl font-bold mb-4">🔥 GAME-CHANGING ANNOUNCEMENT 🔥</h3>
            <p className="text-xl mb-6">
              You're experiencing the WORLD'S FIRST platform that pays users for viewing content!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-bold">
                <Trophy className="mr-2" />
                Learn More About Our Revolution
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Star className="mr-2" />
                Share This Platform
              </Button>
            </div>
          </CardContent>
        </Card>
            </>
        )}

        {/* Earnings Dashboard View */}
        {currentView === 'earnings' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">💰 Real-Time Earnings Dashboard</h2>
              <p className="text-gray-300">Track your revenue across all platforms and activities</p>
            </div>
            {/* Placeholder for RealTimeEarningsDashboard component */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-bold text-white mb-2">Enhanced Earnings Tracking</h3>
              <p className="text-gray-400">Real-time earnings dashboard with live activity feed coming soon!</p>
            </div>
          </div>
        )}

        {/* Studios Recommendations View */}
        {currentView === 'studios' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🎨 AI-Powered Studio Recommendations</h2>
              <p className="text-gray-300">Personalized studio suggestions based on your skills and goals</p>
            </div>
            {/* Placeholder for StudioRecommendations component */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold text-white mb-2">Intelligent Studio Matching</h3>
              <p className="text-gray-400">AI analyzes your profile to recommend the perfect studios for your creative journey!</p>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">📊 Performance Analytics</h2>
              <p className="text-gray-300">Comprehensive insights into your creative growth and earnings</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Analytics Cards */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-lg font-bold text-white mb-2">Growth Tracking</h3>
                  <p className="text-gray-400 text-sm">Monitor your skill progression across all studios</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-lg font-bold text-white mb-2">Goal Achievement</h3>
                  <p className="text-gray-400 text-sm">Track milestones and career objectives</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                  <h3 className="text-lg font-bold text-white mb-2">Network Growth</h3>
                  <p className="text-gray-400 text-sm">Analyze collaboration and fan engagement</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Global Search Modal */}
      {/* Placeholder for GlobalSearch component */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Global Search</h3>
                <Button variant="ghost" size="sm" onClick={() => setSearchOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search studios, projects, artists, tutorials..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
                <p className="text-gray-400 text-sm text-center">Enhanced search functionality coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Onboarding Tutorial Modal */}
      {/* Placeholder for OnboardingTutorial component */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Welcome to Artist Tech!</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowOnboarding(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="text-center space-y-4">
                <Sparkles className="w-16 h-16 mx-auto text-blue-400" />
                <h4 className="text-xl font-bold text-white">🌟 FIRST Platform to Pay Users for Viewing Content!</h4>
                <p className="text-gray-300">
                  You're about to experience a revolutionary platform where you actually earn money while consuming content.
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={() => setShowOnboarding(false)} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="mr-2 h-4 w-4" />
                    Start Earning Now
                  </Button>
                  <Button variant="outline" onClick={() => setShowOnboarding(false)} className="border-gray-600 text-gray-300">
                    Skip Tutorial
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}