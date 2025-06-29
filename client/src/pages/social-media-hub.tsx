import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Share,
  BarChart3,
  Clock,
  Gift,
  Target,
  Trophy,
  Flame
} from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube, SiX, SiSpotify, SiFacebook, SiTwitch, SiDiscord, SiWhatsapp, SiTelegram, SiSnapchat, SiLinkedin, SiReddit, SiPinterest } from "react-icons/si";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Send, Phone, MessageSquare, Bell, Search, Filter, Smile, Paperclip, Mic, Video, Camera, Music } from "lucide-react";

// Revolutionary Social Media Hub - The Future of Content Consumption & Creation

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

interface ViewerReward {
  id: string;
  amount: number;
  type: 'view' | 'like' | 'share' | 'comment' | 'follow';
  platform: string;
  timestamp: Date;
  contentTitle: string;
}

export default function SocialMediaHub() {
  const [rewardMetrics, setRewardMetrics] = useState<RewardMetrics>({
    totalEarned: 2847.32,
    viewingRewards: 1523.45,
    creationRewards: 892.18,
    engagementRewards: 431.69,
    dailyStreak: 23,
    rank: "Gold Creator",
    nextRankProgress: 73
  });

  const [platformStats] = useState<PlatformStats[]>([
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
      platform: "Twitch",
      icon: SiTwitch,
      earnings: 387.45,
      viewers: 12300,
      timeWatched: "67h",
      growth: 31.8,
      color: "#9146ff"
    },
    {
      platform: "Spotify",
      icon: SiSpotify,
      earnings: 169.45,
      viewers: 8900,
      timeWatched: "89h",
      growth: 12.3,
      color: "#1db954"
    }
  ]);

  const [recentRewards, setRecentRewards] = useState<ViewerReward[]>([
    { id: '1', amount: 5.2, type: 'view', platform: 'TikTok', timestamp: new Date(), contentTitle: 'AI Music Production Tips' },
    { id: '2', amount: 2.8, type: 'like', platform: 'Instagram', timestamp: new Date(), contentTitle: 'Beat Making Tutorial' },
    { id: '3', amount: 8.5, type: 'share', platform: 'YouTube', timestamp: new Date(), contentTitle: 'Studio Setup Guide' },
    { id: '4', amount: 3.7, type: 'comment', platform: 'TikTok', timestamp: new Date(), contentTitle: 'Vocal Recording Tricks' },
    { id: '5', amount: 12.3, type: 'follow', platform: 'Twitch', timestamp: new Date(), contentTitle: 'Live Beat Battle' }
  ]);

  const [isEarning, setIsEarning] = useState(false);
  const [currentEarnings, setCurrentEarnings] = useState(0);

  // Simulate real-time earnings while viewing content
  useEffect(() => {
    if (isEarning) {
      const interval = setInterval(() => {
        setCurrentEarnings(prev => prev + Math.random() * 0.5 + 0.1);
        
        // Add random viewer rewards
        if (Math.random() > 0.95) {
          const rewardTypes: ViewerReward['type'][] = ['view', 'like', 'share', 'comment'];
          const platforms = ['TikTok', 'Instagram', 'YouTube', 'Twitch', 'Spotify'];
          const newReward: ViewerReward = {
            id: Date.now().toString(),
            amount: Math.random() * 10 + 1,
            type: rewardTypes[Math.floor(Math.random() * rewardTypes.length)],
            platform: platforms[Math.floor(Math.random() * platforms.length)],
            timestamp: new Date(),
            contentTitle: 'Trending Content'
          };
          
          setRecentRewards(prev => [newReward, ...prev.slice(0, 9)]);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isEarning]);

  const toggleEarning = () => {
    setIsEarning(!isEarning);
    if (!isEarning) {
      setCurrentEarnings(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Revolutionary Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-yellow-500 text-black px-4 py-2 text-lg font-bold">
              🌍 WORLD'S FIRST
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent">
            GET PAID TO VIEW CONTENT
          </h1>
          
          <p className="text-xl md:text-3xl mb-8 max-w-4xl mx-auto font-semibold">
            The ONLY platform that pays you ArtistCoins for watching, creating, and engaging with content
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="bg-green-500 text-white px-6 py-3 text-lg">
              💰 ${rewardMetrics.totalEarned.toFixed(2)} Total Earned
            </Badge>
            <Badge variant="secondary" className="bg-blue-500 text-white px-6 py-3 text-lg">
              👁️ ${rewardMetrics.viewingRewards.toFixed(2)} From Viewing
            </Badge>
            <Badge variant="secondary" className="bg-purple-500 text-white px-6 py-3 text-lg">
              🔥 {rewardMetrics.dailyStreak} Day Streak
            </Badge>
          </div>
          
          <div className="flex justify-center space-x-4">
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
              <Button size="lg" className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-2 border-yellow-400/50 shadow-yellow-400/20 shadow-lg">
                <Coins className="mr-2 animate-spin" /> ArtistCoin Hub
              </Button>
            </Link>
            
            <Link href="/social-media-studio">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-bold border-white text-white hover:bg-white hover:text-black">
                <Rocket className="mr-2" /> Full Studio
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Earnings Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Live Earnings Counter */}
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

          {/* Rank Progress */}
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
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <platform.icon className="h-6 w-6 mr-2" style={{ color: platform.color }} />
                    <span className="font-semibold">{platform.platform}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earnings:</span>
                      <span className="text-green-400 font-bold">${platform.earnings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Viewers:</span>
                      <span>{platform.viewers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span>{platform.timeWatched}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Growth:</span>
                      <span className="text-green-400">+{platform.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Viewer Rewards */}
        <Card className="mb-12 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Gift className="mr-3" />
              Recent Viewer Rewards
              <Badge className="ml-3 bg-green-600">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                      {reward.type === 'view' && <Eye className="h-5 w-5" />}
                      {reward.type === 'like' && <Heart className="h-5 w-5" />}
                      {reward.type === 'share' && <Share className="h-5 w-5" />}
                      {reward.type === 'comment' && <MessageCircle className="h-5 w-5" />}
                      {reward.type === 'follow' && <Users className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-semibold">{reward.contentTitle}</div>
                      <div className="text-sm text-gray-400">{reward.platform} • {reward.type}</div>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold">+${reward.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revolutionary Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-purple-600 to-blue-700 border-0 text-white text-center">
            <CardContent className="pt-6">
              <Eye className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Paid to View</h3>
              <p>Earn ArtistCoins for every minute you watch content. The more you view, the more you earn!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-teal-700 border-0 text-white text-center">
            <CardContent className="pt-6">
              <Coins className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Create & Earn</h3>
              <p>10x higher payouts than Spotify. $50+ per 1K plays vs their $3. Your creativity pays off!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-red-700 border-0 text-white text-center">
            <CardContent className="pt-6">
              <Globe className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">All Platforms</h3>
              <p>Manage TikTok, Instagram, YouTube, Twitch, Spotify all from one unified dashboard.</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 border-0 text-white text-center">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Replace All Social Media?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join the revolution. Be part of the first platform that actually pays you for your time and engagement.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/social-media-studio">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold">
                  <Rocket className="mr-2" /> Launch Full Studio
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-bold">
                <Trophy className="mr-2" /> View Leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* All-Platform Integration Hub */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🌐 All-Platform Integration Hub
          </h2>
          <p className="text-xl text-center text-gray-300 mb-8">
            Access ALL your social platforms in one place. Never leave this site again!
          </p>

          <Tabs defaultValue="unified-feed" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-black/30">
              <TabsTrigger value="unified-feed" className="data-[state=active]:bg-purple-600">
                <Globe className="h-4 w-4 mr-2" />
                Unified Feed
              </TabsTrigger>
              <TabsTrigger value="discord" className="data-[state=active]:bg-purple-600">
                <SiDiscord className="h-4 w-4 mr-2" />
                Discord
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="data-[state=active]:bg-purple-600">
                <SiWhatsapp className="h-4 w-4 mr-2" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="messaging" className="data-[state=active]:bg-purple-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="live-chat" className="data-[state=active]:bg-purple-600">
                <Users className="h-4 w-4 mr-2" />
                Live Chat
              </TabsTrigger>
              <TabsTrigger value="platforms" className="data-[state=active]:bg-purple-600">
                <Zap className="h-4 w-4 mr-2" />
                All Platforms
              </TabsTrigger>
            </TabsList>

            {/* Unified Feed */}
            <TabsContent value="unified-feed" className="mt-6">
              <div className="space-y-6">
                {/* Platform Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-red-500">
                    <SiTiktok className="h-4 w-4 mr-2" />
                    TikTok (47 new)
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <SiInstagram className="h-4 w-4 mr-2" />
                    Instagram (23 new)
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-red-500 to-red-600">
                    <SiYoutube className="h-4 w-4 mr-2" />
                    YouTube (15 new)
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-400 to-blue-600">
                    <SiX className="h-4 w-4 mr-2" />
                    X/Twitter (89 new)
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <SiFacebook className="h-4 w-4 mr-2" />
                    Facebook (12 new)
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600">
                    <SiTwitch className="h-4 w-4 mr-2" />
                    Twitch (5 live)
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600">
                    <SiDiscord className="h-4 w-4 mr-2" />
                    Discord (34 messages)
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600">
                    <SiWhatsapp className="h-4 w-4 mr-2" />
                    WhatsApp (8 chats)
                  </Button>
                </div>

                {/* Feed Items */}
                <div className="grid gap-4">
                  {[
                    {
                      platform: 'TikTok',
                      icon: SiTiktok,
                      user: '@musicproducer_jay',
                      content: 'New beat drop! 🔥 This one\'s going viral...',
                      engagement: { likes: '2.3M', shares: '45K', comments: '12K' },
                      time: '2 min ago',
                      reward: '+8 AC',
                      color: 'from-pink-500 to-red-500'
                    },
                    {
                      platform: 'Instagram',
                      icon: SiInstagram,
                      user: '@studio_sessions',
                      content: 'Behind the scenes at our latest recording session. The energy is unmatched! 🎵',
                      engagement: { likes: '847K', shares: '23K', comments: '5.2K' },
                      time: '5 min ago',
                      reward: '+6 AC',
                      color: 'from-purple-500 to-pink-500'
                    },
                    {
                      platform: 'YouTube',
                      icon: SiYoutube,
                      user: 'Beat Academy',
                      content: 'How to make VIRAL beats in 2025 - Complete Tutorial',
                      engagement: { likes: '156K', shares: '8.4K', comments: '2.1K' },
                      time: '12 min ago',
                      reward: '+12 AC',
                      color: 'from-red-500 to-red-600'
                    },
                    {
                      platform: 'Discord',
                      icon: SiDiscord,
                      user: 'Producer Community',
                      content: 'New collab opportunity: Looking for vocalists for trap beat #4',
                      engagement: { likes: '47', shares: '12', comments: '23' },
                      time: '18 min ago',
                      reward: '+4 AC',
                      color: 'from-indigo-500 to-purple-600'
                    }
                  ].map((post, index) => (
                    <Card key={index} className="bg-black/20 border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${post.color}`}>
                            <post.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{post.user}</span>
                                <Badge className="bg-purple-600/20 text-purple-300 border border-purple-500/30">
                                  {post.platform}
                                </Badge>
                                <span className="text-sm text-gray-400">{post.time}</span>
                              </div>
                              <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">
                                {post.reward}
                              </Badge>
                            </div>
                            <p className="text-gray-200 mb-3">{post.content}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                <span>{post.engagement.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share className="h-4 w-4" />
                                <span>{post.engagement.shares}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.engagement.comments}</span>
                              </div>
                              <Button size="sm" className="ml-auto bg-purple-600 hover:bg-purple-700">
                                <Eye className="h-3 w-3 mr-1" />
                                Watch & Earn
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8">
                    <Eye className="h-4 w-4 mr-2" />
                    Load More Content & Earn ArtistCoins
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Discord Integration */}
            <TabsContent value="discord" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Server List */}
                <Card className="bg-black/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-400">
                      <SiDiscord className="h-5 w-5 mr-2" />
                      Your Servers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: 'Music Producers Hub', members: '45.2K', online: '3.4K', unread: 12 },
                        { name: 'Beat Makers United', members: '23.8K', online: '1.8K', unread: 5 },
                        { name: 'AI Music Creation', members: '18.6K', online: '2.1K', unread: 0 },
                        { name: 'Artist Collaboration', members: '32.4K', online: '4.2K', unread: 23 }
                      ].map((server, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg hover:bg-purple-900/30 cursor-pointer">
                          <div>
                            <p className="font-semibold text-white">{server.name}</p>
                            <p className="text-sm text-gray-400">{server.members} members • {server.online} online</p>
                          </div>
                          {server.unread > 0 && (
                            <Badge className="bg-red-500 text-white">{server.unread}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Area */}
                <Card className="lg:col-span-2 bg-black/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-white">#general</span>
                        <Badge className="ml-2 bg-green-500/20 text-green-300 border border-green-500/30">
                          Music Producers Hub
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" />
                        <Search className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 mb-4 overflow-y-auto space-y-3 bg-gray-900/20 p-4 rounded-lg">
                      {[
                        { user: 'BeatMaker2025', message: 'Just dropped a new track! Check it out 🔥', time: '2:34 PM', avatar: '🎵' },
                        { user: 'ProducerLife', message: 'Anyone know good VSTs for trap beats?', time: '2:35 PM', avatar: '🎹' },
                        { user: 'SoundEngineer', message: 'Try Serum with the new preset pack', time: '2:36 PM', avatar: '🔊' },
                        { user: 'You', message: 'Thanks for the tip! Will try it out', time: '2:37 PM', avatar: '🎤', isYou: true }
                      ].map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.isYou ? 'flex-row-reverse' : ''}`}>
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">
                            {msg.avatar}
                          </div>
                          <div className={`flex-1 ${msg.isYou ? 'text-right' : ''}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white">{msg.user}</span>
                              <span className="text-xs text-gray-400">{msg.time}</span>
                            </div>
                            <p className={`text-gray-200 ${msg.isYou ? 'bg-purple-600/20' : 'bg-gray-800/50'} rounded-lg p-2 inline-block`}>
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="p-2">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input 
                        placeholder="Type a message..." 
                        className="flex-1 bg-gray-800/50 border-gray-600"
                      />
                      <Button size="sm" variant="outline" className="p-2">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* WhatsApp Integration */}
            <TabsContent value="whatsapp" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Chat List */}
                <Card className="bg-black/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-400">
                      <SiWhatsapp className="h-5 w-5 mr-2" />
                      WhatsApp Chats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: 'Studio Crew 🎵', lastMessage: 'Session at 7 PM tonight!', time: '2:45 PM', unread: 3, online: true },
                        { name: 'Mom', lastMessage: 'How\'s the music going?', time: '1:30 PM', unread: 1, online: false },
                        { name: 'Collaboration Group', lastMessage: 'New beat ideas?', time: '12:15 PM', unread: 0, online: true },
                        { name: 'Record Label', lastMessage: 'Contract details attached', time: '11:00 AM', unread: 5, online: true }
                      ].map((chat, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg hover:bg-green-900/30 cursor-pointer">
                          <div className="relative">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                              {chat.name[0]}
                            </div>
                            {chat.online && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-white">{chat.name}</p>
                              <span className="text-xs text-gray-400">{chat.time}</span>
                            </div>
                            <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                          </div>
                          {chat.unread > 0 && (
                            <Badge className="bg-green-500 text-white">{chat.unread}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="lg:col-span-2 bg-black/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          S
                        </div>
                        <div>
                          <p className="text-white">Studio Crew 🎵</p>
                          <p className="text-xs text-green-400">4 members • 3 online</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" />
                        <Video className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" />
                        <Search className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 mb-4 overflow-y-auto space-y-3 bg-gray-900/20 p-4 rounded-lg">
                      {[
                        { user: 'Mike', message: 'Studio session at 7 PM tonight! 🎤', time: '2:30 PM', avatar: '🎸', side: 'left' },
                        { user: 'Sarah', message: 'Count me in! What should I bring?', time: '2:32 PM', avatar: '🎹', side: 'left' },
                        { user: 'You', message: 'Just your energy! Equipment is covered 🔥', time: '2:33 PM', avatar: '🎵', side: 'right' },
                        { user: 'DJ Alex', message: 'This is going to be epic! 🚀', time: '2:34 PM', avatar: '🎧', side: 'left' }
                      ].map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.side === 'right' ? 'flex-row-reverse' : ''}`}>
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs">
                            {msg.avatar}
                          </div>
                          <div className={`max-w-xs ${msg.side === 'right' ? 'text-right' : ''}`}>
                            {msg.side === 'left' && (
                              <p className="text-xs text-gray-400 mb-1">{msg.user}</p>
                            )}
                            <div className={`p-3 rounded-lg ${
                              msg.side === 'right' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-700 text-gray-200'
                            }`}>
                              <p>{msg.message}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="p-2">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input 
                        placeholder="Type a message..." 
                        className="flex-1 bg-gray-800/50 border-gray-600"
                      />
                      <Button size="sm" variant="outline" className="p-2">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Unified Messaging */}
            <TabsContent value="messaging" className="mt-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Platform Messages */}
                <Card className="bg-black/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-blue-400">All Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { platform: 'Instagram', icon: SiInstagram, user: '@fanpage_music', message: 'Love your latest track!', unread: 3, color: 'purple' },
                        { platform: 'X/Twitter', icon: SiX, user: '@producer_jay', message: 'Collab opportunity?', unread: 1, color: 'blue' },
                        { platform: 'TikTok', icon: SiTiktok, user: '@viral_beats', message: 'Can I use your beat?', unread: 5, color: 'pink' },
                        { platform: 'Telegram', icon: SiTelegram, user: 'Music Group', message: 'New beat challenge!', unread: 2, color: 'blue' }
                      ].map((msg, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-900/20 rounded-lg hover:bg-gray-900/30 cursor-pointer">
                          <div className={`p-2 rounded-lg bg-${msg.color}-600`}>
                            <msg.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-white text-sm">{msg.user}</p>
                              {msg.unread > 0 && (
                                <Badge className="bg-red-500 text-white text-xs">{msg.unread}</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                            <p className="text-xs text-gray-500">{msg.platform}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Unified Chat */}
                <Card className="lg:col-span-3 bg-black/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <SiInstagram className="h-5 w-5 text-purple-400" />
                        <span className="text-white">@fanpage_music</span>
                        <Badge className="bg-purple-600/20 text-purple-300 border border-purple-500/30">
                          Instagram DM
                        </Badge>
                      </div>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Zap className="h-3 w-3 mr-1" />
                        Quick Reply
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 mb-4 overflow-y-auto space-y-3 bg-gray-900/20 p-4 rounded-lg">
                      {[
                        { user: '@fanpage_music', message: 'Hey! Love your latest track "Digital Dreams" 🔥', time: '2:15 PM', side: 'left', platform: 'Instagram' },
                        { user: '@fanpage_music', message: 'Would love to feature it on our page!', time: '2:16 PM', side: 'left', platform: 'Instagram' },
                        { user: 'You', message: 'Thank you so much! That would be amazing 🙏', time: '2:18 PM', side: 'right', platform: 'Instagram' },
                        { user: '@fanpage_music', message: 'Perfect! Can you send the high-quality file?', time: '2:19 PM', side: 'left', platform: 'Instagram' }
                      ].map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.side === 'right' ? 'flex-row-reverse' : ''}`}>
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs">
                            {msg.side === 'right' ? '🎵' : '👤'}
                          </div>
                          <div className={`max-w-xs ${msg.side === 'right' ? 'text-right' : ''}`}>
                            {msg.side === 'left' && (
                              <p className="text-xs text-gray-400 mb-1">{msg.user}</p>
                            )}
                            <div className={`p-3 rounded-lg ${
                              msg.side === 'right' 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-gray-700 text-gray-200'
                            }`}>
                              <p>{msg.message}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="p-2">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input 
                        placeholder="Reply across all platforms..." 
                        className="flex-1 bg-gray-800/50 border-gray-600"
                      />
                      <Button size="sm" variant="outline" className="p-2">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        Thanks for the support! 🙏
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        Check out my latest track!
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        Let's collaborate! 🎵
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Live Community Chat */}
            <TabsContent value="live-chat" className="mt-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Chat Rooms */}
                <Card className="bg-black/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-orange-400">Live Rooms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: '🔥 Beat Battles', users: 1247, active: true, topic: 'Weekly beat competition' },
                        { name: '🎤 Collaboration Hub', users: 892, active: true, topic: 'Find your next collab partner' },
                        { name: '💰 Money Talks', users: 2134, active: true, topic: 'Revenue and business tips' },
                        { name: '🎵 New Releases', users: 567, active: false, topic: 'Share your latest drops' }
                      ].map((room, index) => (
                        <div key={index} className="p-3 bg-orange-900/20 rounded-lg hover:bg-orange-900/30 cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-white text-sm">{room.name}</p>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${room.active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                              <span className="text-xs text-gray-400">{room.users}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">{room.topic}</p>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                      <Users className="h-4 w-4 mr-2" />
                      Create Room
                    </Button>
                  </CardContent>
                </Card>

                {/* Live Chat */}
                <Card className="lg:col-span-3 bg-black/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-white">🔥 Beat Battles</span>
                        <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">
                          1,247 online
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Mic className="h-3 w-3 mr-1" />
                          Voice
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-3 w-3 mr-1" />
                          Stream
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 mb-4 overflow-y-auto space-y-2 bg-gray-900/20 p-4 rounded-lg">
                      {[
                        { user: 'BeatGod2025', message: 'This week\'s theme is TRAP! Let\'s go! 🔥', time: '2:45 PM', badge: 'Moderator', reward: '+5 AC' },
                        { user: 'ProducerKing', message: 'Just dropped my entry! Check it out', time: '2:46 PM', badge: 'Pro', reward: '+3 AC' },
                        { user: 'NewbieMaker', message: 'First time joining! Excited to compete 🎵', time: '2:47 PM', badge: 'New', reward: '+2 AC' },
                        { user: 'VoteBot', message: '🏆 Voting opens in 30 minutes! Get your beats ready!', time: '2:48 PM', badge: 'Bot', reward: '+1 AC', isBot: true },
                        { user: 'MusicFan123', message: 'Love the energy in here! ArtistCoin to the moon! 🚀', time: '2:49 PM', badge: 'Fan', reward: '+4 AC' }
                      ].map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.isBot ? 'bg-blue-900/20' : ''} p-2 rounded`}>
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-sm font-bold">
                            {msg.user[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white text-sm">{msg.user}</span>
                              <Badge className={`text-xs ${
                                msg.badge === 'Moderator' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                msg.badge === 'Pro' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                msg.badge === 'Bot' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                'bg-gray-500/20 text-gray-300 border-gray-500/30'
                              }`}>
                                {msg.badge}
                              </Badge>
                              <span className="text-xs text-gray-400">{msg.time}</span>
                              <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs">
                                {msg.reward}
                              </Badge>
                            </div>
                            <p className="text-gray-200 text-sm">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="p-2">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Input 
                        placeholder="Join the conversation and earn ArtistCoins..." 
                        className="flex-1 bg-gray-800/50 border-gray-600"
                      />
                      <Button size="sm" variant="outline" className="p-2">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="text-gray-400">
                        💰 Earn ArtistCoins by chatting, voting, and participating!
                      </div>
                      <div className="text-green-400 font-semibold">
                        +12 AC earned this session
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* All Platform Overview */}
            <TabsContent value="platforms" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { platform: 'TikTok', icon: SiTiktok, followers: '2.3M', posts: 47, engagement: '94%', earnings: '$2,847', color: 'from-pink-500 to-red-500' },
                  { platform: 'Instagram', icon: SiInstagram, followers: '1.8M', posts: 23, engagement: '87%', earnings: '$1,924', color: 'from-purple-500 to-pink-500' },
                  { platform: 'YouTube', icon: SiYoutube, followers: '945K', posts: 15, engagement: '91%', earnings: '$3,256', color: 'from-red-500 to-red-600' },
                  { platform: 'Twitter/X', icon: SiX, followers: '756K', posts: 89, engagement: '76%', earnings: '$1,485', color: 'from-blue-400 to-blue-600' },
                  { platform: 'Discord', icon: SiDiscord, followers: '45K', posts: 34, engagement: '98%', earnings: '$658', color: 'from-indigo-500 to-purple-600' },
                  { platform: 'WhatsApp', icon: SiWhatsapp, followers: 'Private', posts: 8, engagement: '100%', earnings: '$245', color: 'from-green-500 to-green-600' },
                  { platform: 'Twitch', icon: SiTwitch, followers: '234K', posts: 5, engagement: '89%', earnings: '$1,789', color: 'from-purple-600 to-indigo-600' },
                  { platform: 'Spotify', icon: SiSpotify, followers: '1.2M', posts: 12, engagement: '85%', earnings: '$4,125', color: 'from-green-400 to-green-600' }
                ].map((platform, index) => (
                  <Card key={index} className="bg-black/20 border-gray-700 hover:border-purple-500/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${platform.color}`}>
                          <platform.icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">
                          Connected
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-white mb-2">{platform.platform}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Followers:</span>
                          <span className="text-white font-semibold">{platform.followers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">New Posts:</span>
                          <span className="text-blue-400">{platform.posts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Engagement:</span>
                          <span className="text-green-400">{platform.engagement}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Earnings:</span>
                          <span className="text-yellow-400 font-bold">{platform.earnings}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}