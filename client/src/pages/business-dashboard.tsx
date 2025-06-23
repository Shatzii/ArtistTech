import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye,
  Calendar,
  Target,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Share2,
  MessageSquare,
  Heart,
  PlayCircle,
  Download,
  ShoppingBag,
  Music,
  Video,
  Image,
  Globe
} from "lucide-react";

interface RevenueData {
  streaming: number;
  merchandise: number;
  concerts: number;
  nft: number;
  sponsorships: number;
  total: number;
  growth: number;
}

interface AudienceMetrics {
  totalFollowers: number;
  monthlyListeners: number;
  engagementRate: number;
  demographics: {
    topCountries: string[];
    ageGroups: { range: string; percentage: number }[];
    platforms: { name: string; followers: number }[];
  };
}

interface ContentPerformance {
  totalReleases: number;
  totalViews: number;
  averageEngagement: number;
  topTracks: { name: string; streams: number; revenue: number }[];
  recentContent: { type: string; title: string; performance: number; date: string }[];
}

interface MarketingCampaign {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  reach: number;
  conversions: number;
  roi: number;
}

export default function BusinessDashboard() {
  const [revenue, setRevenue] = useState<RevenueData>({
    streaming: 12500,
    merchandise: 8200,
    concerts: 25000,
    nft: 6800,
    sponsorships: 15000,
    total: 67500,
    growth: 23.5
  });

  const [audience, setAudience] = useState<AudienceMetrics>({
    totalFollowers: 145000,
    monthlyListeners: 78000,
    engagementRate: 4.2,
    demographics: {
      topCountries: ['United States', 'United Kingdom', 'Canada', 'Australia'],
      ageGroups: [
        { range: '18-24', percentage: 35 },
        { range: '25-34', percentage: 40 },
        { range: '35-44', percentage: 20 },
        { range: '45+', percentage: 5 }
      ],
      platforms: [
        { name: 'Instagram', followers: 52000 },
        { name: 'TikTok', followers: 38000 },
        { name: 'YouTube', followers: 28000 },
        { name: 'Twitter', followers: 27000 }
      ]
    }
  });

  const [contentPerformance, setContentPerformance] = useState<ContentPerformance>({
    totalReleases: 24,
    totalViews: 2400000,
    averageEngagement: 5.8,
    topTracks: [
      { name: 'Summer Nights', streams: 450000, revenue: 3200 },
      { name: 'Electric Dreams', streams: 380000, revenue: 2800 },
      { name: 'Midnight Drive', streams: 290000, revenue: 2100 }
    ],
    recentContent: [
      { type: 'Music Video', title: 'New Single Release', performance: 92, date: '2024-12-20' },
      { type: 'Instagram Post', title: 'Studio Session', performance: 78, date: '2024-12-19' },
      { type: 'TikTok Video', title: 'Behind the Scenes', performance: 85, date: '2024-12-18' }
    ]
  });

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([
    {
      id: '1',
      name: 'New Album Launch',
      type: 'Social Media',
      status: 'active',
      budget: 5000,
      spent: 3200,
      reach: 125000,
      conversions: 450,
      roi: 3.2
    },
    {
      id: '2',
      name: 'Tour Announcement',
      type: 'Paid Ads',
      status: 'active',
      budget: 3000,
      spent: 1800,
      reach: 85000,
      conversions: 280,
      roi: 2.8
    }
  ]);

  const [aiInsights, setAiInsights] = useState([
    {
      type: 'revenue',
      insight: 'Your streaming revenue increased 35% this month. Consider releasing more content to maintain momentum.',
      action: 'Schedule 2 more releases this quarter',
      priority: 'high'
    },
    {
      type: 'audience',
      insight: 'Your engagement is highest on weekends between 7-9 PM. Optimize posting schedule.',
      action: 'Update content calendar',
      priority: 'medium'
    },
    {
      type: 'marketing',
      insight: 'Instagram campaigns perform 40% better than TikTok for your audience demographic.',
      action: 'Reallocate 20% budget to Instagram',
      priority: 'medium'
    }
  ]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRevenue(prev => ({
        ...prev,
        total: prev.total + Math.floor(Math.random() * 100)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Business Dashboard
            </h1>
            <p className="text-gray-400 mt-1">AI-powered insights for your music career</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Zap className="w-4 h-4 mr-2" />
              AI Optimization
            </Button>
          </div>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              AI Business Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'}>
                      {insight.priority}
                    </Badge>
                    <Target className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{insight.insight}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    {insight.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(revenue.total)}</p>
                <p className="text-sm text-green-400 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{revenue.growth}% this month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Followers</p>
                <p className="text-2xl font-bold">{formatNumber(audience.totalFollowers)}</p>
                <p className="text-sm text-blue-400 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  {audience.engagementRate}% engagement
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Monthly Listeners</p>
                <p className="text-2xl font-bold">{formatNumber(audience.monthlyListeners)}</p>
                <p className="text-sm text-purple-400 flex items-center mt-1">
                  <PlayCircle className="w-3 h-3 mr-1" />
                  {contentPerformance.totalReleases} releases
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Campaign ROI</p>
                <p className="text-2xl font-bold">3.2x</p>
                <p className="text-sm text-yellow-400 flex items-center mt-1">
                  <Target className="w-3 h-3 mr-1" />
                  {campaigns.length} active campaigns
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="audience">Audience Insights</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Campaigns</TabsTrigger>
          <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Music className="w-4 h-4 mr-2 text-green-500" />
                      Streaming
                    </span>
                    <span className="font-semibold">{formatCurrency(revenue.streaming)}</span>
                  </div>
                  <Progress value={(revenue.streaming / revenue.total) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <PlayCircle className="w-4 h-4 mr-2 text-blue-500" />
                      Concerts
                    </span>
                    <span className="font-semibold">{formatCurrency(revenue.concerts)}</span>
                  </div>
                  <Progress value={(revenue.concerts / revenue.total) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-2 text-purple-500" />
                      Merchandise
                    </span>
                    <span className="font-semibold">{formatCurrency(revenue.merchandise)}</span>
                  </div>
                  <Progress value={(revenue.merchandise / revenue.total) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Image className="w-4 h-4 mr-2 text-yellow-500" />
                      NFTs
                    </span>
                    <span className="font-semibold">{formatCurrency(revenue.nft)}</span>
                  </div>
                  <Progress value={(revenue.nft / revenue.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-700 rounded-lg">
                  <LineChart className="w-16 h-16 text-gray-500" />
                  <p className="ml-4 text-gray-400">Interactive chart visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audience.demographics.platforms.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-blue-500" />
                        {platform.name}
                      </span>
                      <span className="font-semibold">{formatNumber(platform.followers)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audience.demographics.ageGroups.map((group, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span>{group.range}</span>
                        <span>{group.percentage}%</span>
                      </div>
                      <Progress value={group.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Top Performing Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentPerformance.topTracks.map((track, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium">{track.name}</h4>
                        <p className="text-sm text-gray-400">{formatNumber(track.streams)} streams</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(track.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Recent Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentPerformance.recentContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-gray-400">{content.type} • {content.date}</p>
                      </div>
                      <div className="flex items-center">
                        <Progress value={content.performance} className="w-16 h-2 mr-2" />
                        <span className="text-sm">{content.performance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-gray-400">{campaign.type}</p>
                    </div>
                    <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Budget</p>
                      <p className="font-semibold">{formatCurrency(campaign.budget)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Spent</p>
                      <p className="font-semibold">{formatCurrency(campaign.spent)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Reach</p>
                      <p className="font-semibold">{formatNumber(campaign.reach)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">ROI</p>
                      <p className="font-semibold text-green-400">{campaign.roi}x</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Content Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">AI-powered social media content creation</p>
                <Button className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Generate Posts
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Audience Analyzer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">Deep insights into your fan base</p>
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Analyze Audience
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Revenue Optimizer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">AI recommendations for income growth</p>
                <Button className="w-full" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Optimize Revenue
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}