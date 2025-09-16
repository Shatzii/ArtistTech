import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  Share2,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface RealTimeMetrics {
  timestamp: Date;
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  views: number;
  revenue: number;
  growth: number;
}

interface RealTimeAlert {
  id: string;
  type: 'performance' | 'opportunity' | 'risk' | 'milestone';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  data: any;
  timestamp: Date;
  acknowledged: boolean;
}

interface LiveTrend {
  id: string;
  name: string;
  category: string;
  direction: 'up' | 'down' | 'stable';
  velocity: number;
  confidence: number;
  data: number[];
  prediction: number;
}

interface RealTimeDashboardData {
  metrics: RealTimeMetrics[];
  alerts: RealTimeAlert[];
  trends: LiveTrend[];
  performance: {
    overallScore: number;
    growthRate: number;
    engagementRate: number;
    revenueGrowth: number;
    audienceGrowth: number;
    contentPerformance: number;
    trendAlignment: number;
  };
  recommendations: any[];
  lastUpdated: Date;
}

export const RealTimeAnalyticsDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<RealTimeDashboardData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Initialize with current data
    fetchDashboardData();

    // Set up Server-Sent Events for real-time updates
    setupRealTimeUpdates();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      const data = await response.json();
      setDashboardData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const setupRealTimeUpdates = () => {
    const eventSource = new EventSource('/api/analytics/dashboard/realtime');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDashboardData(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to parse real-time data:', error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      // Retry connection after 5 seconds
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          setupRealTimeUpdates();
        }
      }, 5000);
    };
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await fetch(`/api/analytics/alerts/${alertId}/acknowledge`, {
        method: 'POST'
      });
      // Refresh data after acknowledging
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-2 text-gray-600">Loading real-time analytics...</p>
        </div>
      </div>
    );
  }

  const { metrics, alerts, trends, performance } = dashboardData;
  const recentMetrics = metrics.slice(-5); // Last 5 data points

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Followers"
          value={recentMetrics.reduce((sum, m) => sum + m.followers, 0)}
          change={performance.audienceGrowth}
          icon={<Users className="h-4 w-4" />}
          format="number"
        />
        <MetricCard
          title="Engagement Rate"
          value={performance.engagementRate}
          change={performance.growthRate}
          icon={<Heart className="h-4 w-4" />}
          format="percentage"
        />
        <MetricCard
          title="Total Revenue"
          value={recentMetrics.reduce((sum, m) => sum + m.revenue, 0)}
          change={performance.revenueGrowth}
          icon={<DollarSign className="h-4 w-4" />}
          format="currency"
        />
        <MetricCard
          title="Overall Score"
          value={performance.overallScore}
          change={0}
          icon={<Activity className="h-4 w-4" />}
          format="number"
        />
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Growth Rate</div>
              <div className="text-2xl font-bold text-green-600">
                {performance.growthRate > 0 ? '+' : ''}{performance.growthRate.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Content Performance</div>
              <div className="text-2xl font-bold text-blue-600">
                {performance.contentPerformance.toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Trend Alignment</div>
              <div className="text-2xl font-bold text-purple-600">
                {performance.trendAlignment.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Audience Growth</div>
              <div className="text-2xl font-bold text-orange-600">
                {performance.audienceGrowth > 0 ? '+' : ''}{performance.audienceGrowth.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <Alert key={alert.id} className={`border-l-4 ${
                  alert.severity === 'error' ? 'border-l-red-500' :
                  alert.severity === 'warning' ? 'border-l-yellow-500' :
                  alert.severity === 'success' ? 'border-l-green-500' :
                  'border-l-blue-500'
                }`}>
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-gray-600">{alert.message}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Trends */}
      {trends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Live Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trends.slice(0, 3).map((trend) => (
                <div key={trend.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {trend.direction === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : trend.direction === 'down' ? (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    ) : (
                      <Activity className="h-5 w-5 text-gray-500" />
                    )}
                    <div>
                      <div className="font-medium">{trend.name}</div>
                      <div className="text-sm text-gray-600">{trend.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {trend.velocity > 0 ? '+' : ''}{trend.velocity.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {trend.confidence.toFixed(0)}% confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['instagram', 'tiktok', 'youtube', 'spotify'].map((platform) => {
              const platformMetrics = recentMetrics.filter(m => m.platform === platform);
              if (platformMetrics.length === 0) return null;

              const latest = platformMetrics[platformMetrics.length - 1];
              const avgEngagement = platformMetrics.reduce((sum, m) => sum + m.engagement, 0) / platformMetrics.length;

              return (
                <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div>
                      <div className="font-medium capitalize">{platform}</div>
                      <div className="text-sm text-gray-600">
                        {latest.followers.toLocaleString()} followers
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">{avgEngagement.toFixed(1)}%</div>
                      <div className="text-xs text-gray-600">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{latest.views.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Views</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  format: 'number' | 'percentage' | 'currency';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, format }) => {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{formatValue(value, format)}</p>
            {change !== 0 && (
              <p className={`text-sm flex items-center ${
                change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(change).toFixed(1)}%
              </p>
            )}
          </div>
          <div className="text-gray-400">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeAnalyticsDashboard;