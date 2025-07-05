import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Heart, 
  Share, 
  Music, 
  Video, 
  Users,
  Zap,
  Target,
  Clock,
  Award,
  Flame
} from 'lucide-react';
import { SiTiktok, SiInstagram, SiYoutube, SiSpotify, SiTwitch } from 'react-icons/si';

interface EarningActivity {
  id: string;
  type: 'view' | 'like' | 'share' | 'comment' | 'follow' | 'stream' | 'create';
  amount: number;
  platform: string;
  content: string;
  timestamp: Date;
}

interface PlatformEarnings {
  platform: string;
  icon: any;
  totalEarned: number;
  todayEarned: number;
  viewTime: number;
  engagements: number;
  color: string;
  growth: number;
}

interface DailyGoal {
  target: number;
  current: number;
  description: string;
}

export default function RealTimeEarningsDashboard() {
  const [totalEarnings, setTotalEarnings] = useState(2847.32);
  const [todayEarnings, setTodayEarnings] = useState(45.67);
  const [isLiveEarning, setIsLiveEarning] = useState(false);
  const [recentActivities, setRecentActivities] = useState<EarningActivity[]>([]);
  const [dailyStreak, setDailyStreak] = useState(23);

  const [platformEarnings] = useState<PlatformEarnings[]>([
    {
      platform: 'TikTok',
      icon: SiTiktok,
      totalEarned: 892.34,
      todayEarned: 12.45,
      viewTime: 127,
      engagements: 234,
      color: '#ff0050',
      growth: 23.4
    },
    {
      platform: 'Instagram',
      icon: SiInstagram,
      totalEarned: 743.21,
      todayEarned: 8.92,
      viewTime: 98,
      engagements: 189,
      color: '#e4405f',
      growth: 18.7
    },
    {
      platform: 'YouTube',
      icon: SiYoutube,
      totalEarned: 654.87,
      todayEarned: 15.34,
      viewTime: 156,
      engagements: 156,
      color: '#ff0000',
      growth: 15.2
    },
    {
      platform: 'Spotify',
      icon: SiSpotify,
      totalEarned: 387.45,
      todayEarned: 6.78,
      viewTime: 67,
      engagements: 89,
      color: '#1db954',
      growth: 31.8
    },
    {
      platform: 'Twitch',
      icon: SiTwitch,
      totalEarned: 169.45,
      todayEarned: 2.18,
      viewTime: 43,
      engagements: 45,
      color: '#9146ff',
      growth: 28.3
    }
  ]);

  const [dailyGoals] = useState<DailyGoal[]>([
    { target: 50, current: todayEarnings, description: 'Daily Earnings Goal' },
    { target: 100, current: 67, description: 'Minutes Watched' },
    { target: 20, current: 14, description: 'Content Interactions' }
  ]);

  // Simulate real-time earnings updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of earning event
        const earningTypes = ['view', 'like', 'share', 'comment', 'stream'] as const;
        const platforms = ['TikTok', 'Instagram', 'YouTube', 'Spotify', 'Twitch'];
        const contentTypes = ['Music Video', 'DJ Set', 'Tutorial', 'Live Stream', 'Collaboration'];
        
        const newActivity: EarningActivity = {
          id: Date.now().toString(),
          type: earningTypes[Math.floor(Math.random() * earningTypes.length)],
          amount: Math.random() * 0.25 + 0.05, // $0.05 - $0.30
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          content: contentTypes[Math.floor(Math.random() * contentTypes.length)],
          timestamp: new Date()
        };

        setRecentActivities(prev => [newActivity, ...prev.slice(0, 9)]);
        setTodayEarnings(prev => prev + newActivity.amount);
        setTotalEarnings(prev => prev + newActivity.amount);
        setIsLiveEarning(true);
        
        setTimeout(() => setIsLiveEarning(false), 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view': return Eye;
      case 'like': return Heart;
      case 'share': return Share;
      case 'comment': return Users;
      case 'stream': return Music;
      case 'create': return Video;
      default: return DollarSign;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'view': return 'text-blue-400';
      case 'like': return 'text-red-400';
      case 'share': return 'text-green-400';
      case 'comment': return 'text-purple-400';
      case 'stream': return 'text-yellow-400';
      case 'create': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Earnings Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`bg-gradient-to-br from-green-600 to-emerald-700 border-0 text-white transition-all duration-500 ${isLiveEarning ? 'scale-105 shadow-2xl' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <DollarSign className="mr-2 h-6 w-6" />
              Total Earnings
              {isLiveEarning && <Zap className="ml-2 h-5 w-5 animate-pulse text-yellow-300" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              ${totalEarnings.toFixed(2)}
            </div>
            <div className="text-green-200 text-sm">
              +${(totalEarnings - 2800).toFixed(2)} this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-cyan-700 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-6 w-6" />
              Today's Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              ${todayEarnings.toFixed(2)}
            </div>
            <div className="text-blue-200 text-sm">
              Goal: ${dailyGoals[0].target.toFixed(2)} ({((todayEarnings / dailyGoals[0].target) * 100).toFixed(0)}%)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-red-700 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Flame className="mr-2 h-6 w-6" />
              Daily Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {dailyStreak} Days
            </div>
            <div className="text-orange-200 text-sm">
              Personal record!
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Goals Progress */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Target className="mr-2" />
            Daily Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyGoals.map((goal, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">{goal.description}</span>
                <span className="text-white font-medium">
                  {goal.current.toFixed(goal.description.includes('Earnings') ? 2 : 0)} / {goal.target}
                </span>
              </div>
              <Progress 
                value={(goal.current / goal.target) * 100} 
                className="h-2 bg-gray-700"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Platform Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {platformEarnings.map((platform, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <platform.icon className="h-6 w-6" style={{ color: platform.color }} />
                  <Badge className="bg-green-600 text-xs">+{platform.growth}%</Badge>
                </div>
                <h3 className="text-white font-semibold text-sm">{platform.platform}</h3>
                <div className="text-green-400 font-bold">${platform.totalEarned}</div>
                <div className="text-gray-400 text-xs">
                  Today: +${platform.todayEarned.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Clock className="mr-2" />
            Live Earnings Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-2 bg-gray-900 rounded">
                    <div className={`w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm">
                        +${activity.amount.toFixed(2)} from {activity.type} on {activity.platform}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {activity.content} • {activity.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Award className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                <p>Start earning by viewing content or creating!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}