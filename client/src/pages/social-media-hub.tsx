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
import { SiTiktok, SiInstagram, SiYoutube, SiX, SiSpotify, SiFacebook, SiTwitch } from "react-icons/si";
import { Link } from "wouter";

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
      </div>
    </div>
  );
}