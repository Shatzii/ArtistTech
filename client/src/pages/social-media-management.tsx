import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, Users, Share2, Eye, Heart, MessageCircle, Calendar, Zap, Target, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function SocialMediaManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [earnings, setEarnings] = useState(2856.42);
  const [totalViews, setTotalViews] = useState(1247592);

  const { data: socialStats } = useQuery({
    queryKey: ["/api/social/analytics"],
    enabled: true
  });

  const { data: artistcoinBalance } = useQuery({
    queryKey: ["/api/artistcoin/balance"],
    enabled: true
  });

  const { data: deploymentStatus } = useQuery({
    queryKey: ["/api/social-deploy/status"],
    enabled: true
  });

  const platforms = [
    { 
      name: "TikTok", 
      followers: 847200, 
      growth: 23.5, 
      engagement: 8.7,
      earnings: 420.50,
      color: "from-pink-600 to-red-600"
    },
    { 
      name: "Instagram", 
      followers: 623800, 
      growth: 18.2, 
      engagement: 6.4,
      earnings: 380.20,
      color: "from-purple-600 to-pink-600"
    },
    { 
      name: "YouTube", 
      followers: 298400, 
      growth: 31.8, 
      engagement: 12.3,
      earnings: 890.40,
      color: "from-red-600 to-orange-600"
    },
    { 
      name: "Spotify", 
      followers: 156700, 
      growth: 41.2, 
      engagement: 5.8,
      earnings: 1165.32,
      color: "from-green-600 to-emerald-600"
    }
  ];

  const contentTypes = [
    { type: "Music Videos", performance: 94, viral: 87, engagement: 9.2 },
    { type: "Behind Scenes", performance: 89, viral: 72, engagement: 8.7 },
    { type: "Live Streams", performance: 91, viral: 56, engagement: 11.8 },
    { type: "Tutorials", performance: 76, viral: 45, engagement: 6.3 },
    { type: "Collaborations", performance: 88, viral: 93, engagement: 10.4 }
  ];

  const trendingHashtags = [
    "#MusicProducer", "#NewMusic", "#Studio", "#BehindTheScenes", "#LiveMusic",
    "#MusicVideo", "#Artist", "#Creative", "#Vibes", "#Producer"
  ];

  const aiAgents = [
    { name: "Content Creator", status: "active", posts: 47, engagement: "8.7%" },
    { name: "Trend Analyzer", status: "active", insights: 23, accuracy: "94%" },
    { name: "Audience Finder", status: "active", leads: 156, conversion: "23%" },
    { name: "Engagement Bot", status: "active", interactions: 892, growth: "31%" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setEarnings(prev => prev + (Math.random() * 5));
      setTotalViews(prev => prev + Math.floor(Math.random() * 100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Social Media Management Suite
          </h1>
          <p className="text-purple-200 text-lg max-w-3xl mx-auto">
            Unified platform management with AI-powered content creation, deployment, and the world's first "pay-to-view" reward system
          </p>
        </div>

        {/* Live Earnings Banner */}
        <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Live Earnings: ${earnings.toFixed(2)}</h3>
                <p className="text-green-200">You earn ArtistCoins for every minute viewers spend watching your content</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-white">{totalViews.toLocaleString()} Total Views</div>
                <div className="text-sm text-blue-200">+{artistcoinBalance?.currentBalance || 2856} ArtistCoins today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform, idx) => (
            <Card key={idx} className="bg-white/10 border-purple-400/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                    <Share2 className="h-4 w-4 text-white" />
                  </div>
                  {platform.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-xl font-bold text-white">{platform.followers.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">+{platform.growth}% growth</div>
                  <div className="text-sm text-green-400">${platform.earnings.toFixed(2)} earned</div>
                  <Progress value={platform.engagement * 10} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10">
            <TabsTrigger value="dashboard" className="text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="content" className="text-white">Content Hub</TabsTrigger>
            <TabsTrigger value="deployment" className="text-white">Auto Deploy</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
            <TabsTrigger value="ai-agents" className="text-white">AI Agents</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Content Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentTypes.map((content, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white">{content.type}</span>
                          <span className="text-purple-400">{content.performance}%</span>
                        </div>
                        <div className="flex gap-2">
                          <Progress value={content.viral} className="flex-1 h-2" />
                          <span className="text-xs text-gray-300">Viral: {content.viral}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Trending Hashtags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {trendingHashtags.map((hashtag, idx) => (
                      <Badge key={idx} variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-400/20">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Hub Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="bg-white/10 border-blue-400/30">
              <CardHeader>
                <CardTitle className="text-white">AI Content Creator</CardTitle>
                <CardDescription className="text-gray-300">
                  Generate platform-optimized content with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Content Type</label>
                    <select className="w-full p-2 bg-white/10 border border-purple-400/30 rounded text-white">
                      <option>Music Video Post</option>
                      <option>Behind the Scenes</option>
                      <option>Live Stream Announcement</option>
                      <option>Collaboration Post</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Target Platform</label>
                    <select className="w-full p-2 bg-white/10 border border-purple-400/30 rounded text-white">
                      <option>All Platforms</option>
                      <option>TikTok</option>
                      <option>Instagram</option>
                      <option>YouTube</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Content Description</label>
                  <Textarea 
                    placeholder="Describe your content idea..."
                    className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate AI Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auto Deploy Tab */}
          <TabsContent value="deployment" className="space-y-6">
            <Card className="bg-white/10 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-white">Automated Deployment</CardTitle>
                <CardDescription className="text-gray-300">
                  Schedule and deploy content across all platforms automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Deployment Schedule</label>
                    <select className="w-full p-2 bg-white/10 border border-green-400/30 rounded text-white">
                      <option>Immediately</option>
                      <option>Peak Hours</option>
                      <option>Custom Schedule</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Frequency</label>
                    <select className="w-full p-2 bg-white/10 border border-green-400/30 rounded text-white">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Bi-weekly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Auto-Optimize</label>
                    <select className="w-full p-2 bg-white/10 border border-green-400/30 rounded text-white">
                      <option>Enabled</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                    <span className="text-white">TikTok Auto-Deploy</span>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                    <span className="text-white">Instagram Auto-Deploy</span>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                    <span className="text-white">YouTube Auto-Deploy</span>
                    <Badge className="bg-yellow-600 text-white">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Engagement Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Likes</span>
                      <span className="text-white">1.2M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Comments</span>
                      <span className="text-white">84.7K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Shares</span>
                      <span className="text-white">156.3K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Saves</span>
                      <span className="text-white">67.8K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">ArtistCoin Earnings</span>
                      <span className="text-green-400">${artistcoinBalance?.totalEarned || 15431}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Platform Monetization</span>
                      <span className="text-green-400">$2,235</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Brand Partnerships</span>
                      <span className="text-green-400">$4,820</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Revenue</span>
                      <span className="text-green-400">${earnings.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Agents Tab */}
          <TabsContent value="ai-agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiAgents.map((agent, idx) => (
                <Card key={idx} className="bg-white/10 border-purple-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      {agent.name}
                      <Badge variant="outline" className="ml-auto text-green-400 border-green-400">
                        {agent.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {agent.posts && <div className="text-sm text-gray-300">Posts Created: <span className="text-white">{agent.posts}</span></div>}
                      {agent.insights && <div className="text-sm text-gray-300">Insights Generated: <span className="text-white">{agent.insights}</span></div>}
                      {agent.leads && <div className="text-sm text-gray-300">Leads Found: <span className="text-white">{agent.leads}</span></div>}
                      {agent.interactions && <div className="text-sm text-gray-300">Interactions: <span className="text-white">{agent.interactions}</span></div>}
                      
                      {agent.engagement && <div className="text-sm text-gray-300">Engagement Rate: <span className="text-purple-400">{agent.engagement}</span></div>}
                      {agent.accuracy && <div className="text-sm text-gray-300">Accuracy Rate: <span className="text-green-400">{agent.accuracy}</span></div>}
                      {agent.conversion && <div className="text-sm text-gray-300">Conversion Rate: <span className="text-blue-400">{agent.conversion}</span></div>}
                      {agent.growth && <div className="text-sm text-gray-300">Growth Impact: <span className="text-orange-400">{agent.growth}</span></div>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}