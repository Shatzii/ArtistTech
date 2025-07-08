import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, DollarSign, Share2, Play, Eye, Heart, MessageCircle, Zap, Globe, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function UltimateSocialSuite() {
  const [activeTab, setActiveTab] = useState("hub");
  const [artistCoins, setArtistCoins] = useState(847);
  const [totalViews, setTotalViews] = useState(1247582);
  const [isStreaming, setIsStreaming] = useState(false);

  const { data: socialStats } = useQuery({
    queryKey: ["/api/social/unified-stats"],
    enabled: true
  });

  const { data: contentAnalytics } = useQuery({
    queryKey: ["/api/social/content-analytics"],
    enabled: true
  });

  const platforms = [
    { name: "TikTok", followers: "2.4M", engagement: "8.7%", earnings: "$2,847", color: "bg-pink-600" },
    { name: "Instagram", followers: "1.8M", engagement: "6.2%", earnings: "$1,923", color: "bg-purple-600" },
    { name: "YouTube", followers: "945K", followers_label: "subscribers", engagement: "4.8%", earnings: "$3,156", color: "bg-red-600" },
    { name: "Twitter/X", followers: "1.2M", engagement: "5.4%", earnings: "$892", color: "bg-blue-600" },
    { name: "Spotify", followers: "567K", followers_label: "monthly listeners", engagement: "12.3%", earnings: "$4,278", color: "bg-green-600" },
    { name: "Twitch", followers: "234K", engagement: "15.6%", earnings: "$1,567", color: "bg-purple-500" }
  ];

  const recentContent = [
    {
      id: 1,
      title: "New Beat Drop - Fire Track 🔥",
      platform: "TikTok",
      views: "2.4M",
      likes: "847K",
      comments: "23.4K",
      revenue: "$847",
      status: "viral",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Behind the Scenes Studio Session",
      platform: "Instagram",
      views: "892K",
      likes: "234K",
      comments: "8.9K",
      revenue: "$423",
      status: "trending",
      time: "6 hours ago"
    },
    {
      id: 3,
      title: "Live DJ Set from Rooftop",
      platform: "YouTube",
      views: "1.2M",
      likes: "156K",
      comments: "12.7K",
      revenue: "$1,234",
      status: "live",
      time: "1 day ago"
    }
  ];

  const upcomingPosts = [
    {
      platform: "TikTok",
      title: "New Remix Preview",
      scheduledTime: "3:00 PM Today",
      status: "ready"
    },
    {
      platform: "Instagram",
      title: "Studio Equipment Tour",
      scheduledTime: "8:00 PM Today",
      status: "processing"
    },
    {
      platform: "YouTube",
      title: "Full Track Release",
      scheduledTime: "Tomorrow 12:00 PM",
      status: "scheduled"
    }
  ];

  const aiSuggestions = [
    {
      type: "Content Idea",
      suggestion: "Create a 'Beat Battle' series with other producers",
      impact: "High viral potential",
      platforms: ["TikTok", "Instagram"]
    },
    {
      type: "Posting Time",
      suggestion: "Post at 7:30 PM EST for maximum engagement",
      impact: "+23% expected reach",
      platforms: ["All Platforms"]
    },
    {
      type: "Collaboration",
      suggestion: "Partner with @BeatMakerPro for remix exchange",
      impact: "Cross-audience growth",
      platforms: ["YouTube", "Spotify"]
    }
  ];

  const liveStreamingStats = [
    { metric: "Current Viewers", value: 1247, change: "+15%" },
    { metric: "Total Watch Time", value: "8.2K hours", change: "+32%" },
    { metric: "Stream Revenue", value: "$1,847", change: "+28%" },
    { metric: "New Followers", value: 234, change: "+45%" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setArtistCoins(prev => prev + Math.floor(Math.random() * 5));
      setTotalViews(prev => prev + Math.floor(Math.random() * 50));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartStream = () => {
    setIsStreaming(!isStreaming);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Ultimate Social Media Suite
          </h1>
          <p className="text-pink-200 text-lg max-w-3xl mx-auto">
            Revolutionary unified platform - Create, manage, and monetize content across all social media platforms with AI-powered optimization
          </p>
        </div>

        {/* Live Earnings Counter */}
        <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{artistCoins.toLocaleString()}</div>
                <div className="text-sm text-green-200">ArtistCoins Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{totalViews.toLocaleString()}</div>
                <div className="text-sm text-blue-200">Total Views Today</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">$12,847</div>
                <div className="text-sm text-purple-200">Monthly Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10">
            <TabsTrigger value="hub" className="text-white">Social Hub</TabsTrigger>
            <TabsTrigger value="studio" className="text-white">Content Studio</TabsTrigger>
            <TabsTrigger value="deployment" className="text-white">Auto Deploy</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
            <TabsTrigger value="live" className="text-white">Live Streaming</TabsTrigger>
          </TabsList>

          {/* Social Hub Tab */}
          <TabsContent value="hub" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {platforms.map((platform, idx) => (
                <Card key={idx} className="bg-white/10 border-purple-400/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${platform.color}`} />
                      {platform.name}
                      <Badge variant="outline" className="ml-auto text-green-400 border-green-400">
                        Connected
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">{platform.followers_label || "Followers"}</span>
                        <span className="text-white font-medium">{platform.followers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Engagement</span>
                        <span className="text-green-400">{platform.engagement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">This Month</span>
                        <span className="text-yellow-400">{platform.earnings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-white/10 border-blue-400/30">
              <CardHeader>
                <CardTitle className="text-white">Recent Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <div className="text-white font-medium">{content.title}</div>
                        <div className="text-sm text-gray-300">{content.platform} • {content.time}</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-blue-400" />
                          <span className="text-blue-400">{content.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-400" />
                          <span className="text-red-400">{content.likes}</span>
                        </div>
                        <div className="text-green-400 font-medium">{content.revenue}</div>
                        <Badge className={
                          content.status === 'viral' ? 'bg-red-600' :
                          content.status === 'trending' ? 'bg-orange-600' : 'bg-blue-600'
                        }>
                          {content.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Studio Tab */}
          <TabsContent value="studio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Create New Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Content Type</label>
                    <Select defaultValue="video">
                      <SelectTrigger className="bg-white/10 border-purple-400/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Post</SelectItem>
                        <SelectItem value="audio">Audio Track</SelectItem>
                        <SelectItem value="image">Image Post</SelectItem>
                        <SelectItem value="story">Story Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Title</label>
                    <Input 
                      placeholder="Enter content title..."
                      className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Description</label>
                    <Textarea 
                      placeholder="Content description..."
                      className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400 min-h-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Target Platforms</label>
                    <div className="flex flex-wrap gap-2">
                      {platforms.slice(0, 4).map((platform, idx) => (
                        <Badge key={idx} variant="outline" className="text-purple-400 border-purple-400 cursor-pointer hover:bg-purple-400/20">
                          {platform.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Create Content
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">AI Content Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            {suggestion.type}
                          </Badge>
                          <div className="text-xs text-green-400">{suggestion.impact}</div>
                        </div>
                        <div className="text-sm text-white mb-2">{suggestion.suggestion}</div>
                        <div className="text-xs text-gray-400">
                          Platforms: {suggestion.platforms.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Auto Deploy Tab */}
          <TabsContent value="deployment" className="space-y-6">
            <Card className="bg-white/10 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-white">Scheduled Content</CardTitle>
                <CardDescription className="text-gray-300">
                  AI-optimized posting schedule across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingPosts.map((post, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{post.title}</div>
                        <div className="text-sm text-gray-300">{post.platform} • {post.scheduledTime}</div>
                      </div>
                      <Badge className={
                        post.status === 'ready' ? 'bg-green-600' :
                        post.status === 'processing' ? 'bg-yellow-600' : 'bg-blue-600'
                      }>
                        {post.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Reach</span>
                      <span className="text-white">12.4M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Engagement Rate</span>
                      <span className="text-green-400">8.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Revenue Growth</span>
                      <span className="text-yellow-400">+34%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Follower Growth</span>
                      <span className="text-blue-400">+12.3K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-red-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Beat Drop Video</span>
                      <span className="text-red-400">2.4M views</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Studio Session</span>
                      <span className="text-red-400">1.8M views</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Live DJ Set</span>
                      <span className="text-red-400">1.2M views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Streaming Tab */}
          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-red-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Live Stream Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleStartStream}
                    className={`w-full ${isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isStreaming ? 'Stop Stream' : 'Go Live'}
                  </Button>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Stream Title</label>
                    <Input 
                      placeholder="Live DJ Set - New Beats!"
                      className="bg-white/10 border-red-400/30 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Platforms</label>
                    <div className="flex flex-wrap gap-2">
                      {["TikTok", "Instagram", "YouTube", "Twitch"].map((platform, idx) => (
                        <Badge key={idx} variant="outline" className="text-red-400 border-red-400">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Live Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {liveStreamingStats.map((stat, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-gray-300">{stat.metric}</span>
                        <div className="text-right">
                          <div className="text-white">{stat.value}</div>
                          <div className="text-xs text-green-400">{stat.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}