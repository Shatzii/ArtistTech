import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";
import { 
  TrendingUp, Calendar, Clock, MapPin, Users, Heart,
  Share, Eye, MessageCircle, Zap, Target, Activity,
  BarChart3, PieChart, Download, Filter, RefreshCw,
  Instagram, Twitter, Youtube, Facebook, ArrowUp, ArrowDown
} from "lucide-react";

interface HeatmapData {
  hour: number;
  day: number;
  value: number;
  engagement: number;
  platform: string;
  content_type: string;
}

interface PlatformMetrics {
  platform: string;
  total_posts: number;
  avg_engagement: number;
  best_time: string;
  peak_hours: number[];
  top_content_type: string;
  growth_rate: number;
}

export default function SocialMediaHeatmap() {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("engagement");
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const queryClient = useQueryClient();

  // Fetch heatmap data
  const { data: heatmapAnalytics, isLoading } = useQuery({
    queryKey: ["/api/social/heatmap", selectedPlatform, selectedTimeframe, selectedMetric],
    enabled: true
  });

  const { data: platformMetrics } = useQuery({
    queryKey: ["/api/social/platform-metrics"],
    enabled: true
  });

  // Generate heatmap data
  useEffect(() => {
    generateHeatmapData();
  }, [selectedPlatform, selectedTimeframe, selectedMetric]);

  const generateHeatmapData = () => {
    const data: HeatmapData[] = [];
    const platforms = selectedPlatform === "all" 
      ? ["instagram", "tiktok", "youtube", "twitter", "facebook"]
      : [selectedPlatform];

    // Generate 24x7 heatmap data (hours x days)
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        platforms.forEach(platform => {
          const baseValue = Math.random() * 100;
          // Higher engagement during peak hours (7-9 PM)
          const peakMultiplier = (hour >= 19 && hour <= 21) ? 1.8 : 1;
          // Weekend boost
          const weekendMultiplier = (day === 0 || day === 6) ? 1.3 : 1;
          
          const value = Math.min(100, baseValue * peakMultiplier * weekendMultiplier);
          
          data.push({
            hour,
            day,
            value: Math.round(value),
            engagement: Math.round(value * 0.8 + Math.random() * 20),
            platform,
            content_type: ["post", "story", "reel", "video"][Math.floor(Math.random() * 4)]
          });
        });
      }
    }
    setHeatmapData(data);
  };

  const mockPlatformMetrics: PlatformMetrics[] = [
    {
      platform: "instagram",
      total_posts: 342,
      avg_engagement: 7.8,
      best_time: "8:00 PM",
      peak_hours: [19, 20, 21],
      top_content_type: "Reels",
      growth_rate: 12.4
    },
    {
      platform: "tiktok",
      total_posts: 289,
      avg_engagement: 11.2,
      best_time: "7:30 PM",
      peak_hours: [18, 19, 20],
      top_content_type: "Videos",
      growth_rate: 18.7
    },
    {
      platform: "youtube",
      total_posts: 156,
      avg_engagement: 6.3,
      best_time: "9:00 PM",
      peak_hours: [20, 21, 22],
      top_content_type: "Shorts",
      growth_rate: 8.9
    },
    {
      platform: "twitter",
      total_posts: 567,
      avg_engagement: 4.2,
      best_time: "12:00 PM",
      peak_hours: [11, 12, 13],
      top_content_type: "Threads",
      growth_rate: 5.6
    },
    {
      platform: "facebook",
      total_posts: 234,
      avg_engagement: 3.8,
      best_time: "6:00 PM",
      peak_hours: [17, 18, 19],
      top_content_type: "Posts",
      growth_rate: -2.1
    }
  ];

  const getHeatmapColor = (value: number): string => {
    if (value >= 80) return "bg-red-500";
    if (value >= 60) return "bg-orange-500";
    if (value >= 40) return "bg-yellow-500";
    if (value >= 20) return "bg-green-500";
    return "bg-blue-500";
  };

  const getHeatmapIntensity = (value: number): string => {
    const opacity = Math.max(0.1, value / 100);
    return `opacity-${Math.round(opacity * 10) * 10}`;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram": return <Instagram className="w-4 h-4" />;
      case "twitter": return <Twitter className="w-4 h-4" />;
      case "youtube": return <Youtube className="w-4 h-4" />;
      case "facebook": return <Facebook className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getDayName = (day: number): string => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
  };

  const getTimeLabel = (hour: number): string => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  const aggregatedData = heatmapData.reduce((acc, item) => {
    const key = `${item.day}-${item.hour}`;
    if (!acc[key]) {
      acc[key] = { ...item, count: 1 };
    } else {
      acc[key].value = (acc[key].value + item.value) / 2;
      acc[key].engagement = (acc[key].engagement + item.engagement) / 2;
      acc[key].count++;
    }
    return acc;
  }, {} as Record<string, HeatmapData & { count: number }>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-blue-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/artist-tech-logo-new.jpeg" 
              alt="Artist Tech" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">Social Media Content Heatmap</h1>
              <p className="text-white/60">Visual analytics for optimal posting times and engagement patterns</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button onClick={() => generateHeatmapData()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export Heatmap
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Platform:</span>
            <select 
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-black/50 border border-purple-500/30 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Timeframe:</span>
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-black/50 border border-purple-500/30 rounded px-3 py-1 text-sm"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Metric:</span>
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-black/50 border border-purple-500/30 rounded px-3 py-1 text-sm"
            >
              <option value="engagement">Engagement Rate</option>
              <option value="views">View Count</option>
              <option value="likes">Likes</option>
              <option value="shares">Shares</option>
              <option value="comments">Comments</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Heatmap */}
          <div className="xl:col-span-3">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Weekly Engagement Heatmap</CardTitle>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Low</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>High</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Peak</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Hour labels */}
                  <div className="grid grid-cols-25 gap-1 text-xs text-white/60">
                    <div></div>
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="text-center">
                        {i % 4 === 0 ? getTimeLabel(i) : ""}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap grid */}
                  {Array.from({ length: 7 }, (_, day) => (
                    <div key={day} className="grid grid-cols-25 gap-1">
                      <div className="text-xs text-white/60 text-right pr-2 flex items-center">
                        {getDayName(day)}
                      </div>
                      {Array.from({ length: 24 }, (_, hour) => {
                        const cellData = aggregatedData[`${day}-${hour}`];
                        const value = cellData?.value || 0;
                        
                        return (
                          <div
                            key={hour}
                            className={`
                              h-6 rounded-sm border border-white/10 cursor-pointer transition-all hover:scale-110 hover:z-10
                              ${getHeatmapColor(value)} ${getHeatmapIntensity(value)}
                            `}
                            title={`${getDayName(day)} ${getTimeLabel(hour)}: ${Math.round(value)}% engagement`}
                          >
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Peak times summary */}
                <div className="mt-6 p-4 bg-black/30 rounded-lg">
                  <h4 className="font-medium mb-3">Peak Engagement Times</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">7-9 PM</div>
                      <div className="text-sm text-white/60">Weekday Peak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">2-4 PM</div>
                      <div className="text-sm text-white/60">Weekend Peak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">8.7%</div>
                      <div className="text-sm text-white/60">Avg Engagement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Metrics Sidebar */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPlatformMetrics.map(metric => (
                    <div key={metric.platform} className="bg-black/30 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(metric.platform)}
                          <span className="font-medium capitalize">{metric.platform}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            metric.growth_rate > 0 
                              ? "border-green-500 text-green-400" 
                              : "border-red-500 text-red-400"
                          }`}
                        >
                          {metric.growth_rate > 0 ? "+" : ""}{metric.growth_rate}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">Posts:</span>
                          <span>{metric.total_posts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Avg Engagement:</span>
                          <span>{metric.avg_engagement}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Best Time:</span>
                          <span>{metric.best_time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Top Content:</span>
                          <span>{metric.top_content_type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-green-500/20 p-3 rounded-lg border border-green-500/30">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium">Best Strategy</span>
                    </div>
                    <p className="text-xs text-white/80">
                      Post TikTok content at 7:30 PM for maximum engagement
                    </p>
                  </div>

                  <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium">Timing Optimization</span>
                    </div>
                    <p className="text-xs text-white/80">
                      Avoid posting on Tuesday mornings - 40% lower engagement
                    </p>
                  </div>

                  <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                    <div className="flex items-center space-x-2 mb-1">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium">Content Focus</span>
                    </div>
                    <p className="text-xs text-white/80">
                      Instagram Reels outperforming posts by 180%
                    </p>
                  </div>

                  <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-500/30">
                    <div className="flex items-center space-x-2 mb-1">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium">Growth Opportunity</span>
                    </div>
                    <p className="text-xs text-white/80">
                      Increase YouTube Shorts frequency for 25% growth boost
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}