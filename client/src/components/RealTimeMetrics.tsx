import { useState, useEffect } from 'react';
import { TrendingUp, Users, Eye, DollarSign, Zap, Globe, Music, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface RealTimeMetricsProps {
  context?: 'studio' | 'live' | 'global';
}

export default function RealTimeMetrics({ context = 'studio' }: RealTimeMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [liveStats, setLiveStats] = useState({
    activeUsers: 0,
    currentEarnings: 0,
    viewerEngagement: 0,
    platformReach: 0
  });

  // Simulate real-time data updates
  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics: MetricData[] = [
        {
          label: 'Live Viewers',
          value: Math.floor(Math.random() * 1000) + 500,
          change: Math.floor(Math.random() * 20) - 10,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          icon: <Eye className="h-4 w-4" />,
          color: 'text-blue-500'
        },
        {
          label: 'ArtistCoins Earned',
          value: Math.floor(Math.random() * 500) + 100,
          change: Math.floor(Math.random() * 50),
          trend: 'up',
          icon: <DollarSign className="h-4 w-4" />,
          color: 'text-green-500'
        },
        {
          label: 'Engagement Rate',
          value: Math.floor(Math.random() * 40) + 60,
          change: Math.floor(Math.random() * 10) - 5,
          trend: Math.random() > 0.3 ? 'up' : 'stable',
          icon: <Heart className="h-4 w-4" />,
          color: 'text-red-500'
        },
        {
          label: 'Platform Reach',
          value: Math.floor(Math.random() * 5000) + 2000,
          change: Math.floor(Math.random() * 100),
          trend: 'up',
          icon: <Globe className="h-4 w-4" />,
          color: 'text-purple-500'
        }
      ];

      setMetrics(newMetrics);
      
      setLiveStats({
        activeUsers: Math.floor(Math.random() * 50) + 20,
        currentEarnings: Math.floor(Math.random() * 1000) + 500,
        viewerEngagement: Math.floor(Math.random() * 30) + 70,
        platformReach: Math.floor(Math.random() * 8) + 5
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 3000);
    return () => clearInterval(interval);
  }, [context]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`${metric.color}`}>
                  {metric.icon}
                </div>
                <div className="flex items-center">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-xs ml-1 ${
                    metric.trend === 'up' ? 'text-green-500' : 
                    metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                <div className="text-sm text-gray-500">{metric.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Performance Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            Live Performance Analytics
            <Badge variant="secondary" className="ml-2 animate-pulse">
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Active Collaboration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm">Active Collaborators</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold mr-2">{liveStats.activeUsers}</span>
              <div className="flex -space-x-1">
                {[...Array(Math.min(liveStats.activeUsers, 5))].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"
                  />
                ))}
                {liveStats.activeUsers > 5 && (
                  <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-white">+{liveStats.activeUsers - 5}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Earnings Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Session Earnings</span>
              <span className="text-lg font-bold text-green-500">
                {liveStats.currentEarnings.toLocaleString()} ATP
              </span>
            </div>
            <Progress value={Math.min((liveStats.currentEarnings / 2000) * 100, 100)} className="h-2" />
            <div className="text-xs text-gray-500">
              Goal: 2,000 ATP • {Math.round((liveStats.currentEarnings / 2000) * 100)}% complete
            </div>
          </div>

          {/* Engagement Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Viewer Engagement</span>
              <span className="text-lg font-bold">{liveStats.viewerEngagement}%</span>
            </div>
            <Progress value={liveStats.viewerEngagement} className="h-2" />
            <div className="text-xs text-gray-500">
              Excellent engagement! Keep the energy high.
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-500">{liveStats.platformReach}</div>
              <div className="text-xs text-gray-500">Platforms</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">94%</div>
              <div className="text-xs text-gray-500">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">1.2k</div>
              <div className="text-xs text-gray-500">New Followers</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}