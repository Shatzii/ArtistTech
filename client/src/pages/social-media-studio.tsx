import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Share2, Eye, Heart, MessageCircle, TrendingUp, DollarSign,
  Youtube, Instagram, Twitter, Facebook, Twitch, Music,
  Video, Camera, Mic, Upload, Download, Edit3, Sparkles,
  Zap, Users, Globe, Clock, Target, BarChart3, Cpu,
  Play, Pause, Square, Settings, Filter, Layers,
  Plus, RefreshCw, Send, Bell, Star, ArrowUp
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: any;
  color: string;
  connected: boolean;
  followers: number;
  engagement: number;
  earnings: number;
}

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'published';
  views: number;
  likes: number;
  earnings: number;
  scheduledTime?: Date;
}

interface AiAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'processing' | 'idle';
  tasksCompleted: number;
}

export default function SocialMediaStudio() {
  const [selectedTab, setSelectedTab] = useState("content");
  const [totalEarnings, setTotalEarnings] = useState(2847.50);
  const [isRecording, setIsRecording] = useState(false);
  const [activeAiAgents, setActiveAiAgents] = useState(4);

  const platforms: Platform[] = [
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'text-red-500',
      connected: true,
      followers: 125000,
      engagement: 8.4,
      earnings: 1247.30
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Video,
      color: 'text-black dark:text-white',
      connected: true,
      followers: 89000,
      engagement: 12.1,
      earnings: 892.40
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-500',
      connected: true,
      followers: 67000,
      engagement: 6.8,
      earnings: 567.20
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'text-blue-500',
      connected: false,
      followers: 45000,
      engagement: 4.2,
      earnings: 140.60
    },
    {
      id: 'twitch',
      name: 'Twitch',
      icon: Twitch,
      color: 'text-purple-500',
      connected: true,
      followers: 23000,
      engagement: 15.6,
      earnings: 0
    }
  ];

  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Behind the Scenes: Studio Tour',
      platform: 'YouTube',
      status: 'published',
      views: 47230,
      likes: 3850,
      earnings: 342.50,
      scheduledTime: new Date()
    },
    {
      id: '2',
      title: 'Quick Beat Making Tips',
      platform: 'TikTok',
      status: 'scheduled',
      views: 0,
      likes: 0,
      earnings: 0,
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'New Track Preview',
      platform: 'Instagram',
      status: 'draft',
      views: 0,
      likes: 0,
      earnings: 0
    }
  ];

  const aiAgents: AiAgent[] = [
    {
      id: '1',
      name: 'Content Creator AI',
      role: 'Generates trending content ideas and captions',
      status: 'active',
      tasksCompleted: 127
    },
    {
      id: '2',
      name: 'Trend Analyzer AI',
      role: 'Monitors viral trends and hashtags',
      status: 'processing',
      tasksCompleted: 89
    },
    {
      id: '3',
      name: 'Audience Finder AI',
      role: 'Identifies and targets potential followers',
      status: 'active',
      tasksCompleted: 203
    },
    {
      id: '4',
      name: 'Engagement Bot AI',
      role: 'Manages comments and community interaction',
      status: 'idle',
      tasksCompleted: 456
    }
  ];

  // Simulate real-time earnings update
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalEarnings(prev => prev + (Math.random() * 0.50));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-blue-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Social Media Studio Pro</h1>
            <p className="text-sm text-gray-400">Revolutionary "Pay to View" Content Creation Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Live Earnings</div>
            <div className="text-xl font-bold text-green-400">${totalEarnings.toFixed(2)}</div>
          </div>
          <Badge variant="default" className="bg-green-500 animate-pulse">
            <DollarSign className="w-3 h-3 mr-1" />
            10x Higher Payouts
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full bg-black/30">
              <TabsTrigger value="content">Content Hub</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="creator">AI Creator</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="earnings">Pay-to-View</TabsTrigger>
            </TabsList>

            {/* Content Hub */}
            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Content Creation */}
                <Card className="bg-black/40 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Edit3 className="w-5 h-5 mr-2" />
                      Create Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Content Title</label>
                      <Input 
                        placeholder="Enter your content title..."
                        className="bg-black/60 border-blue-500/30 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Description</label>
                      <Textarea 
                        placeholder="Describe your content..."
                        className="bg-black/60 border-blue-500/30 text-white"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                        onClick={() => setIsRecording(!isRecording)}
                      >
                        {isRecording ? (
                          <>
                            <Square className="w-4 h-4 mr-2" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4 mr-2" />
                            Record
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="text-white border-blue-500">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>

                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Enhance Content
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-black/40 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white">
                      <Youtube className="w-4 h-4 mr-2" />
                      YouTube Short
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-black to-gray-700 text-white">
                      <Video className="w-4 h-4 mr-2" />
                      TikTok Video
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram Reel
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter Thread
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                      <Twitch className="w-4 h-4 mr-2" />
                      Live Stream
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Content */}
              <Card className="bg-black/40 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <Layers className="w-5 h-5 mr-2" />
                      Content Library
                    </div>
                    <Button size="sm" variant="outline" className="text-blue-400 border-blue-500">
                      <Plus className="w-4 h-4 mr-2" />
                      New Content
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contentItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-black/60 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-white font-medium">{item.title}</h3>
                            <Badge variant={
                              item.status === 'published' ? 'default' :
                              item.status === 'scheduled' ? 'secondary' : 'outline'
                            }>
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{item.platform}</p>
                        </div>
                        <div className="text-right">
                          {item.status === 'published' && (
                            <>
                              <div className="text-white font-bold">{item.views.toLocaleString()} views</div>
                              <div className="text-green-400 text-sm">${item.earnings}</div>
                            </>
                          )}
                          {item.status === 'scheduled' && item.scheduledTime && (
                            <div className="text-yellow-400 text-sm">
                              {item.scheduledTime.toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Platforms Tab */}
            <TabsContent value="platforms" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <Card key={platform.id} className="bg-black/40 border-blue-500/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className={`w-6 h-6 ${platform.color}`} />
                            <CardTitle className="text-white">{platform.name}</CardTitle>
                          </div>
                          <Switch checked={platform.connected} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-white">
                              {(platform.followers / 1000).toFixed(0)}K
                            </div>
                            <div className="text-sm text-gray-400">Followers</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-white">
                              {platform.engagement}%
                            </div>
                            <div className="text-sm text-gray-400">Engagement</div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-400">
                            ${platform.earnings.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-400">Earnings</div>
                        </div>

                        <Button 
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                          disabled={!platform.connected}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Post Content
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* AI Creator Tab */}
            <TabsContent value="creator" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Cpu className="w-5 h-5 mr-2" />
                      AI Content Agents
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      4 AI agents working 24/7 to grow your audience and earnings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiAgents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-3 bg-black/60 rounded-lg">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{agent.name}</h3>
                          <p className="text-sm text-gray-400">{agent.role}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            agent.status === 'active' ? 'default' :
                            agent.status === 'processing' ? 'secondary' : 'outline'
                          }>
                            {agent.status}
                          </Badge>
                          <div className="text-sm text-gray-400 mt-1">
                            {agent.tasksCompleted} tasks completed
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <div className="flex items-center text-green-400 mb-2">
                        <ArrowUp className="w-4 h-4 mr-2" />
                        Trending Topic Detected
                      </div>
                      <p className="text-white text-sm">"AI Music Production" is trending +340% today</p>
                    </div>

                    <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center text-blue-400 mb-2">
                        <Target className="w-4 h-4 mr-2" />
                        Optimal Posting Time
                      </div>
                      <p className="text-white text-sm">Best engagement window: 7-9 PM EST</p>
                    </div>

                    <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center text-purple-400 mb-2">
                        <Users className="w-4 h-4 mr-2" />
                        Audience Growth
                      </div>
                      <p className="text-white text-sm">+2,340 new followers this week (+12.3%)</p>
                    </div>

                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Content Ideas
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-black/40 border-blue-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Eye className="w-8 h-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Total Views</p>
                        <p className="text-2xl font-bold text-white">1.2M</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-blue-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Followers</p>
                        <p className="text-2xl font-bold text-white">349K</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-blue-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Heart className="w-8 h-8 text-red-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Engagement</p>
                        <p className="text-2xl font-bold text-white">8.4%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-blue-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="w-8 h-8 text-yellow-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-400">Revenue</p>
                        <p className="text-2xl font-bold text-white">${totalEarnings.toFixed(0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-black/40 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performance Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-black/60 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Advanced Analytics Chart</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pay-to-View Tab */}
            <TabsContent value="earnings" className="space-y-6">
              <Card className="bg-black/40 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Revolutionary Pay-to-View Model
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    World's first platform where users earn ArtistCoins for viewing content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Creator Earnings (10x Higher)</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">YouTube</span>
                          <span className="text-white">$50+ per 1K plays</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">vs Spotify</span>
                          <span className="text-red-400">$3 per 1K plays</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">TikTok</span>
                          <span className="text-white">$25+ per 1K views</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Instagram</span>
                          <span className="text-white">$35+ per 1K views</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Viewer Rewards</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Watching content</span>
                          <span className="text-green-400">1 AC/minute</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Liking posts</span>
                          <span className="text-green-400">2 AC per like</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sharing content</span>
                          <span className="text-green-400">5 AC per share</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Comments</span>
                          <span className="text-green-400">3 AC per comment</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Replace TikTok, Instagram, YouTube & Spotify
                    </h3>
                    <p className="text-gray-300">
                      The only platform that pays users to view content while giving creators 10x higher payouts
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Panel */}
        <div className="w-80 p-6 bg-black/60 border-l border-blue-500/20 space-y-6">
          {/* Live Stats */}
          <Card className="bg-black/40 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Live Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Active Viewers</span>
                <span className="text-white font-bold">2,347</span>
              </div>
              <Progress value={75} className="h-2" />
              
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Engagement Rate</span>
                <span className="text-green-400 font-bold">+23%</span>
              </div>
              <Progress value={85} className="h-2" />
              
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">ArtistCoins Earned</span>
                <span className="text-yellow-400 font-bold">4,729 AC</span>
              </div>
            </CardContent>
          </Card>

          {/* Trending Hashtags */}
          <Card className="bg-black/40 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['#AIMusic', '#BeatMaking', '#ProducerLife', '#MusicTech', '#StudioVibes'].map((tag, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-blue-400">{tag}</span>
                  <span className="text-gray-400">+{(340 - i * 50)}%</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-black/40 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-2 bg-blue-500/20 rounded text-sm text-white">
                Post a "beat making challenge" video for maximum engagement
              </div>
              <div className="p-2 bg-purple-500/20 rounded text-sm text-white">
                Collaborate with @MusicProducer for viral potential
              </div>
              <div className="p-2 bg-green-500/20 rounded text-sm text-white">
                Share behind-the-scenes studio content at 8 PM
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}