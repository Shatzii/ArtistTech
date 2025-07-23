import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Pause, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Zap, 
  Coins,
  Globe,
  MessageCircle,
  Heart,
  Share as Share2,
  BarChart3,
  Search,
  Bell,
  HelpCircle,
  Home,
  X,
  LogOut,
  User,
  Settings,
  Send,
  Upload,
  Calendar,
  Hash,
  Wifi,
  WifiOff,
  ThumbsUp,
  Repeat,
  Bookmark,
  RefreshCw,
  Download,
  Plus,
  Sparkles,
  Eye
} from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube, SiX, SiSpotify } from "react-icons/si";
import { Link } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

interface SocialPost {
  id: string;
  platform: string;
  icon: any;
  user: string;
  content: string;
  engagement: {
    likes: string;
    shares: string;
    comments: string;
  };
  timestamp: Date;
  reward: number;
  mediaType: string;
  color: string;
}

interface PlatformConnection {
  platform: string;
  connected: boolean;
  followerCount: number;
  username: string;
}

export default function SocialMediaHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentEarnings, setCurrentEarnings] = useState(2847.32);
  const [isWatching, setIsWatching] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'tiktok', 'youtube']);

  // Real-time earnings counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWatching) {
      interval = setInterval(() => {
        setCurrentEarnings(prev => prev + (Math.random() * 0.5 + 0.1));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isWatching]);

  // Sample social media posts
  const socialPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'TikTok',
      icon: SiTiktok,
      user: '@musicproducer',
      content: 'New beat drop! What do you think? 🔥',
      engagement: { likes: '12.4K', shares: '2.1K', comments: '847' },
      timestamp: new Date(),
      reward: 2.5,
      mediaType: 'video',
      color: 'text-pink-400'
    },
    {
      id: '2',
      platform: 'Instagram',
      icon: SiInstagram,
      user: '@beatmaker_official',
      content: 'Studio vibes tonight ✨ Working on something special',
      engagement: { likes: '8.7K', shares: '543', comments: '234' },
      timestamp: new Date(),
      reward: 1.8,
      mediaType: 'image',
      color: 'text-purple-400'
    },
    {
      id: '3',
      platform: 'YouTube',
      icon: SiYoutube,
      user: 'ProducerLife',
      content: 'How to make a hit song in 10 minutes - Full Tutorial',
      engagement: { likes: '45.2K', shares: '12.3K', comments: '3.4K' },
      timestamp: new Date(),
      reward: 5.2,
      mediaType: 'video',
      color: 'text-red-400'
    }
  ];

  const platformConnections: PlatformConnection[] = [
    { platform: 'TikTok', connected: true, followerCount: 25400, username: '@yourmusic' },
    { platform: 'Instagram', connected: true, followerCount: 18900, username: '@yourmusic_official' },
    { platform: 'YouTube', connected: true, followerCount: 12300, username: 'YourMusic Channel' },
    { platform: 'Twitter/X', connected: false, followerCount: 0, username: '' },
    { platform: 'Spotify', connected: true, followerCount: 8700, username: 'YourMusic Artist' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Social Media Hub</h1>
                <p className="text-sm text-gray-400">World's First Pay-to-View Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Live Earnings Counter */}
              <div className="bg-green-600/20 px-4 py-2 rounded-lg">
                <div className="text-green-400 font-bold">${currentEarnings.toFixed(2)} AC</div>
                <div className="text-xs text-gray-400">Live Earnings</div>
              </div>
              <Link href="/one-click-social-generator">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <Home className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="feed" className="data-[state=active]:bg-purple-600">
              <Globe className="w-4 h-4 mr-2" />
              Unified Feed
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="platforms" className="data-[state=active]:bg-cyan-600">
              <Wifi className="w-4 h-4 mr-2" />
              Platforms
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-yellow-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Earnings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Total Platforms</h3>
                      <p className="text-3xl font-bold text-blue-400">5</p>
                    </div>
                    <Globe className="h-12 w-12 text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-400">Connected social platforms</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Total Followers</h3>
                      <p className="text-3xl font-bold text-green-400">65.3K</p>
                    </div>
                    <Users className="h-12 w-12 text-green-400" />
                  </div>
                  <p className="text-sm text-gray-400">Across all platforms</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Monthly Earnings</h3>
                      <p className="text-3xl font-bold text-yellow-400">${currentEarnings.toFixed(0)}</p>
                    </div>
                    <DollarSign className="h-12 w-12 text-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-400">ArtistCoin rewards</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/one-click-social-generator">
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Content
                    </Button>
                  </Link>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => setActiveTab('feed')}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    View Feed
                  </Button>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab('platforms')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Unified Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Unified Social Feed</h2>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsWatching(!isWatching)}
                  className={`${isWatching ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isWatching ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isWatching ? 'Stop Earning' : 'Start Earning'}
                </Button>
                <Badge className={`${isWatching ? 'bg-green-500' : 'bg-gray-500'}`}>
                  {isWatching ? 'EARNING +$0.25/min' : 'PAUSED'}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {socialPosts.map((post) => {
                const IconComponent = post.icon;
                return (
                  <Card key={post.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-6 w-6 ${post.color}`} />
                          <div>
                            <h3 className="font-semibold text-white">{post.user}</h3>
                            <p className="text-sm text-gray-400">{post.platform} • {post.mediaType}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600/20 text-green-400">
                          +${post.reward} AC
                        </Badge>
                      </div>
                      <p className="text-gray-300 mb-4">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.engagement.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            {post.engagement.shares}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.engagement.comments}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="border-gray-600">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Like
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Create Content Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Create New Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link href="/one-click-social-generator">
                    <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 hover:border-yellow-400 transition-colors cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">AI Content Generator</h3>
                        <p className="text-gray-400">Generate content for all platforms with one click</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                    <CardContent className="p-6 text-center">
                      <Upload className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Upload Media</h3>
                      <p className="text-gray-400">Upload photos, videos, and music tracks</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content Text
                    </label>
                    <Textarea 
                      placeholder="What's on your mind? Share your latest creation..."
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Platforms
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {['TikTok', 'Instagram', 'YouTube', 'Twitter', 'Spotify'].map((platform) => (
                        <Button
                          key={platform}
                          variant={selectedPlatforms.includes(platform.toLowerCase()) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const platformId = platform.toLowerCase();
                            setSelectedPlatforms(prev => 
                              prev.includes(platformId)
                                ? prev.filter(p => p !== platformId)
                                : [...prev, platformId]
                            );
                          }}
                          className="justify-start"
                        >
                          {platform}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      Post Now
                    </Button>
                    <Button variant="outline" className="border-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Views</p>
                      <p className="text-2xl font-bold text-white">2.4M</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-xs text-green-400 mt-2">+12.5% this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Engagement Rate</p>
                      <p className="text-2xl font-bold text-white">8.7%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-xs text-green-400 mt-2">+2.1% this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Earnings Rate</p>
                      <p className="text-2xl font-bold text-white">$0.32/min</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-400" />
                  </div>
                  <p className="text-xs text-green-400 mt-2">+5.8% this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Watch Time</p>
                      <p className="text-2xl font-bold text-white">156h</p>
                    </div>
                    <Zap className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="text-xs text-green-400 mt-2">+8.3% this month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Connected Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformConnections.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${platform.connected ? 'bg-green-400' : 'bg-red-400'}`} />
                        <div>
                          <h3 className="font-medium text-white">{platform.platform}</h3>
                          <p className="text-sm text-gray-400">
                            {platform.connected ? `${platform.followerCount.toLocaleString()} followers` : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={platform.connected ? "outline" : "default"}
                        className={platform.connected ? "border-gray-600" : "bg-blue-600 hover:bg-blue-700"}
                      >
                        {platform.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
                <CardContent className="p-6">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white">Today's Earnings</h3>
                    <p className="text-3xl font-bold text-green-400">${(currentEarnings * 0.1).toFixed(2)}</p>
                    <p className="text-sm text-gray-400">+15.3% from yesterday</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white">This Month</h3>
                    <p className="text-3xl font-bold text-blue-400">${currentEarnings.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">Across all platforms</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white">Growth Rate</h3>
                    <p className="text-3xl font-bold text-purple-400">+23.7%</p>
                    <p className="text-sm text-gray-400">Monthly growth</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Earnings Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <SiTiktok className="h-5 w-5 text-pink-400" />
                      <span className="text-white">TikTok Views</span>
                    </div>
                    <span className="text-green-400 font-semibold">${(currentEarnings * 0.35).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <SiInstagram className="h-5 w-5 text-purple-400" />
                      <span className="text-white">Instagram Engagement</span>
                    </div>
                    <span className="text-green-400 font-semibold">${(currentEarnings * 0.28).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <SiYoutube className="h-5 w-5 text-red-400" />
                      <span className="text-white">YouTube Watch Time</span>
                    </div>
                    <span className="text-green-400 font-semibold">${(currentEarnings * 0.37).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}