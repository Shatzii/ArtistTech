import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  TrendingUp, BarChart3, PieChart, LineChart, Users, Eye,
  Play, Heart, Share, Download, DollarSign, Crown,
  Target, Globe, Calendar, Clock, Zap, Star, Music,
  Video, Image, Headphones, Sparkles, Filter
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [chartType, setChartType] = useState("line");
  const queryClient = useQueryClient();

  // Fetch analytics data
  const { data: analyticsData } = useQuery({
    queryKey: ["/api/analytics/overview", timeRange],
    enabled: true
  });

  const { data: platformStats } = useQuery({
    queryKey: ["/api/analytics/platforms"],
    enabled: true
  });

  const { data: revenueData } = useQuery({
    queryKey: ["/api/analytics/revenue", timeRange],
    enabled: true
  });

  const mockAnalyticsData = {
    totalViews: 1247000,
    totalPlays: 892000,
    totalEarnings: 15670.50,
    growthRate: 18.3,
    engagement: 7.2,
    fanGrowth: 24.7,
    platforms: [
      { name: "TikTok", views: 487000, growth: 32.1, color: "bg-pink-600" },
      { name: "Instagram", views: 324000, growth: 15.4, color: "bg-purple-600" },
      { name: "YouTube", views: 289000, growth: 8.7, color: "bg-red-600" },
      { name: "Spotify", views: 147000, growth: 22.3, color: "bg-green-600" }
    ],
    contentTypes: [
      { type: "Music", count: 45, engagement: 8.4, revenue: 8245.30 },
      { type: "Video", count: 23, engagement: 9.1, revenue: 4892.15 },
      { type: "Live Stream", count: 12, engagement: 12.3, revenue: 2533.05 }
    ],
    topContent: [
      { 
        title: "Midnight Vibes", 
        type: "music", 
        views: 89400, 
        engagement: 9.2, 
        revenue: 1247.50,
        platform: "Spotify"
      },
      { 
        title: "Studio Session #47", 
        type: "video", 
        views: 67200, 
        engagement: 11.8, 
        revenue: 892.30,
        platform: "YouTube"
      },
      { 
        title: "Beat Making Tutorial", 
        type: "video", 
        views: 54100, 
        engagement: 8.7, 
        revenue: 634.75,
        platform: "TikTok"
      }
    ]
  };

  const timeRanges = [
    { value: "1d", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "1y", label: "1 Year" }
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case "music": return <Music className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "image": return <Image className="w-4 h-4" />;
      case "podcast": return <Headphones className="w-4 h-4" />;
      default: return <Music className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/50 to-purple-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/artist-tech-logo.jpeg" 
              alt="Artist Tech" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-white/60">Comprehensive performance insights and metrics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-black/50 border border-purple-500/30 rounded px-3 py-2"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <Badge variant="outline" className="border-green-500 text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{mockAnalyticsData.growthRate}% Growth
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-400">Total Views</p>
                  <p className="text-2xl font-bold">{formatNumber(mockAnalyticsData.totalViews)}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+{mockAnalyticsData.growthRate}%</span>
                <span className="text-sm text-white/60 ml-2">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600/20 to-green-800/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-400">Total Plays</p>
                  <p className="text-2xl font-bold">{formatNumber(mockAnalyticsData.totalPlays)}</p>
                </div>
                <Play className="w-8 h-8 text-green-400" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+{mockAnalyticsData.fanGrowth}%</span>
                <span className="text-sm text-white/60 ml-2">engagement up</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-400">Total Earnings</p>
                  <p className="text-2xl font-bold">{formatCurrency(mockAnalyticsData.totalEarnings)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+15.2%</span>
                <span className="text-sm text-white/60 ml-2">revenue growth</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-400">Engagement Rate</p>
                  <p className="text-2xl font-bold">{mockAnalyticsData.engagement}%</p>
                </div>
                <Heart className="w-8 h-8 text-purple-400" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+2.1%</span>
                <span className="text-sm text-white/60 ml-2">above average</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Performance */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <BarChart3 className="w-5 h-5 mr-2" />
                Platform Performance
              </CardTitle>
              <CardDescription>Views and growth across platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAnalyticsData.platforms.map((platform, index) => (
                <div key={platform.name} className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${platform.color} mr-3`} />
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      +{platform.growth}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">Views</span>
                    <span className="font-medium">{formatNumber(platform.views)}</span>
                  </div>
                  
                  <Progress 
                    value={(platform.views / mockAnalyticsData.platforms[0].views) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Content */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                Top Performing Content
              </CardTitle>
              <CardDescription>Your most successful content pieces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAnalyticsData.topContent.map((content, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getContentIcon(content.type)}
                      <span className="font-medium ml-2">{content.title}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {content.platform}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Views</p>
                      <p className="font-medium">{formatNumber(content.views)}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Engagement</p>
                      <p className="font-medium">{content.engagement}%</p>
                    </div>
                    <div>
                      <p className="text-white/60">Revenue</p>
                      <p className="font-medium">{formatCurrency(content.revenue)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Progress value={content.engagement * 10} className="h-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content Performance */}
        <Card className="mt-6 bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <PieChart className="w-5 h-5 mr-2" />
              Content Type Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockAnalyticsData.contentTypes.map((type, index) => (
                <div key={type.type} className="bg-black/30 p-6 rounded-lg text-center">
                  {getContentIcon(type.type.toLowerCase())}
                  <h3 className="text-xl font-bold mt-2">{type.type}</h3>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-white/60">Count:</span>
                      <span className="text-sm font-medium">{type.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white/60">Avg Engagement:</span>
                      <span className="text-sm font-medium">{type.engagement}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white/60">Revenue:</span>
                      <span className="text-sm font-medium">{formatCurrency(type.revenue)}</span>
                    </div>
                  </div>
                  
                  <Progress value={type.engagement * 10} className="mt-4 h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Target className="w-5 h-5 mr-2" />
                Audience Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Demographics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Age 18-24:</span>
                    <span className="text-sm">34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Age 25-34:</span>
                    <span className="text-sm">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Age 35+:</span>
                    <span className="text-sm">21%</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Geographic Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">United States:</span>
                    <span className="text-sm">42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">United Kingdom:</span>
                    <span className="text-sm">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Canada:</span>
                    <span className="text-sm">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Other:</span>
                    <span className="text-sm">31%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Clock className="w-5 h-5 mr-2" />
                Peak Performance Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Best Posting Times</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monday 7-9 PM:</span>
                    <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                      Peak
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Friday 5-7 PM:</span>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs">
                      High
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sunday 12-2 PM:</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-400 text-xs">
                      Good
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Engagement Patterns</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Session Duration:</span>
                    <span className="text-sm">4m 32s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Return Visitors:</span>
                    <span className="text-sm">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Share Rate:</span>
                    <span className="text-sm">12.4%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
              AI-Powered Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-blue-400" />
                  Growth Opportunities
                </h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• Your TikTok content performs 32% better on Mondays - consider scheduling more posts</li>
                  <li>• Music content generates 2.3x more revenue than video content</li>
                  <li>• Your engagement peaks during 7-9 PM EST - optimize posting schedule</li>
                  <li>• Collaborate with artists in the electronic genre for cross-promotion</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  Content Strategy
                </h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• Behind-the-scenes content has 45% higher engagement</li>
                  <li>• Tutorial content generates 3.1x more shares</li>
                  <li>• Live streaming sessions increase fan retention by 23%</li>
                  <li>• Short-form content (30-60s) performs best on all platforms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}