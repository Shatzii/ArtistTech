import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Inline Switch component
const Switch = ({ checked, onCheckedChange, ...props }: { checked: boolean; onCheckedChange: (checked: boolean) => void; [key: string]: any }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
      checked ? 'bg-purple-600' : 'bg-gray-600'
    }`}
    {...props}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-1'
      }`}
    />
  </button>
);
import { 
  Play, 
  Pause, 
  Square, 
  Video, 
  Camera, 
  Mic, 
  Settings, 
  Users, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle, 
  TrendingUp,
  Coins,
  Filter,
  Search,
  Calendar,
  Clock,
  Globe,
  Zap,
  Target,
  BarChart3,
  Upload,
  Send,
  RefreshCw
} from "lucide-react";
import { 
  SiTiktok, 
  SiInstagram, 
  SiYoutube, 
  SiX, 
  SiFacebook, 
  SiLinkedin, 
  SiTwitch, 
  SiSpotify 
} from "react-icons/si";

interface SocialPlatform {
  id: string;
  name: string;
  icon: any;
  connected: boolean;
  followers: number;
  engagement: number;
  color: string;
  maxLength: number;
  features: string[];
  liveEnabled: boolean;
}

interface ContentPost {
  id: string;
  platform: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  earnings: number;
  optimized: boolean;
  scheduled?: string;
}

interface ViewerReward {
  userId: string;
  action: string;
  platform: string;
  coinsEarned: number;
  timestamp: string;
}

interface LiveSession {
  platform: string;
  viewers: number;
  duration: string;
  earnings: number;
  status: 'live' | 'scheduled' | 'ended';
}

export default function SocialMediaStudio() {
  const [platforms] = useState<SocialPlatform[]>([
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: SiTiktok,
      connected: true,
      followers: 125000,
      engagement: 8.5,
      color: '#ff0050',
      maxLength: 2200,
      features: ['video', 'live', 'hashtags', 'duets'],
      liveEnabled: true
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: SiInstagram,
      connected: true,
      followers: 85000,
      engagement: 6.2,
      color: '#e4405f',
      maxLength: 2200,
      features: ['posts', 'stories', 'reels', 'live', 'igtv'],
      liveEnabled: true
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: SiYoutube,
      connected: true,
      followers: 45000,
      engagement: 12.1,
      color: '#ff0000',
      maxLength: 5000,
      features: ['videos', 'shorts', 'live', 'community'],
      liveEnabled: true
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: SiX,
      connected: true,
      followers: 32000,
      engagement: 4.8,
      color: '#1da1f2',
      maxLength: 280,
      features: ['tweets', 'threads', 'spaces', 'fleets'],
      liveEnabled: false
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: SiFacebook,
      connected: false,
      followers: 18000,
      engagement: 3.2,
      color: '#1877f2',
      maxLength: 63206,
      features: ['posts', 'stories', 'live', 'marketplace'],
      liveEnabled: true
    },
    {
      id: 'twitch',
      name: 'Twitch',
      icon: SiTwitch,
      connected: true,
      followers: 12000,
      engagement: 15.3,
      color: '#9146ff',
      maxLength: 500,
      features: ['live', 'clips', 'chat'],
      liveEnabled: true
    },
    {
      id: 'spotify',
      name: 'Spotify',
      icon: SiSpotify,
      connected: true,
      followers: 8500,
      engagement: 9.7,
      color: '#1db954',
      maxLength: 0,
      features: ['music', 'podcasts', 'playlists'],
      liveEnabled: false
    }
  ]);

  const [superFeed, setSuperFeed] = useState<ContentPost[]>([
    {
      id: '1',
      platform: 'tiktok',
      content: 'New beat preview! 🔥 This track is going to be legendary #NewMusic #Producer',
      mediaUrl: '/api/placeholder/video',
      mediaType: 'video',
      timestamp: '2 hours ago',
      likes: 15420,
      comments: 342,
      shares: 1205,
      views: 89450,
      earnings: 89.45,
      optimized: true
    },
    {
      id: '2',
      platform: 'instagram',
      content: 'Studio session vibes ✨ Working on something special for you all',
      mediaUrl: '/api/placeholder/image',
      mediaType: 'image',
      timestamp: '4 hours ago',
      likes: 8920,
      comments: 156,
      shares: 445,
      views: 34520,
      earnings: 34.52,
      optimized: true
    },
    {
      id: '3',
      platform: 'youtube',
      content: 'HOW TO MAKE BEATS LIKE THE PROS - Full Tutorial',
      mediaUrl: '/api/placeholder/video',
      mediaType: 'video',
      timestamp: '1 day ago',
      likes: 2340,
      comments: 89,
      shares: 234,
      views: 12450,
      earnings: 124.50,
      optimized: true
    }
  ]);

  const [filteredFeed, setFilteredFeed] = useState<ContentPost[]>(superFeed);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isLive, setIsLive] = useState(false);
  const [liveViewers, setLiveViewers] = useState(0);
  const [viewerRewards, setViewerRewards] = useState<ViewerReward[]>([]);
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    mediaType: 'none' as 'none' | 'image' | 'video' | 'audio',
    scheduledTime: '',
    autoOptimize: true
  });

  // Viewer reward system
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate viewer rewards for watching content
      const randomReward: ViewerReward = {
        userId: `viewer_${Math.floor(Math.random() * 10000)}`,
        action: Math.random() > 0.5 ? 'view' : 'engage',
        platform: platforms[Math.floor(Math.random() * platforms.length)].id,
        coinsEarned: Math.floor(Math.random() * 5) + 1,
        timestamp: new Date().toISOString()
      };
      
      setViewerRewards(prev => [randomReward, ...prev.slice(0, 99)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [platforms]);

  // Live session simulation
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setLiveViewers(prev => prev + Math.floor(Math.random() * 10) - 2);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  // Filter feed by platform
  useEffect(() => {
    if (selectedPlatform === 'all') {
      setFilteredFeed(superFeed);
    } else {
      setFilteredFeed(superFeed.filter(post => post.platform === selectedPlatform));
    }
  }, [selectedPlatform, superFeed]);

  const handleStartLive = () => {
    setIsLive(true);
    setLiveViewers(Math.floor(Math.random() * 50) + 10);
  };

  const handleStopLive = () => {
    setIsLive(false);
    setLiveViewers(0);
  };

  const handleCreatePost = () => {
    if (!newPost.content.trim()) return;

    const optimizedContent = newPost.autoOptimize ? 
      optimizeContentForPlatforms(newPost.content, newPost.platforms) : 
      newPost.content;

    newPost.platforms.forEach(platformId => {
      const post: ContentPost = {
        id: Date.now().toString() + platformId,
        platform: platformId,
        content: optimizedContent[platformId] || newPost.content,
        mediaType: newPost.mediaType !== 'none' ? newPost.mediaType : undefined,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        earnings: 0,
        optimized: newPost.autoOptimize,
        scheduled: newPost.scheduledTime || undefined
      };

      setSuperFeed(prev => [post, ...prev]);
    });

    // Reset form
    setNewPost({
      content: '',
      platforms: [],
      mediaType: 'none',
      scheduledTime: '',
      autoOptimize: true
    });
  };

  const optimizeContentForPlatforms = (content: string, platformIds: string[]) => {
    const optimized: Record<string, string> = {};
    
    platformIds.forEach(platformId => {
      const platform = platforms.find(p => p.id === platformId);
      if (!platform) return;

      let optimizedContent = content;

      // Platform-specific optimizations
      switch (platformId) {
        case 'tiktok':
          optimizedContent += ' #fyp #viral #music #beats';
          break;
        case 'instagram':
          optimizedContent += ' #music #producer #beats #studio';
          break;
        case 'youtube':
          optimizedContent += '\n\n🔔 Subscribe for more!\n👍 Like if you enjoyed!';
          break;
        case 'twitter':
          optimizedContent = optimizedContent.slice(0, 240) + ' #music #beats';
          break;
      }

      // Truncate if needed
      if (optimizedContent.length > platform.maxLength && platform.maxLength > 0) {
        optimizedContent = optimizedContent.slice(0, platform.maxLength - 3) + '...';
      }

      optimized[platformId] = optimizedContent;
    });

    return optimized;
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return Globe;
    return platform.icon;
  };

  const getPlatformColor = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.color || '#666';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Social Media Studio Pro
              </h1>
              <p className="text-gray-300 mt-1">Create, optimize, and publish to all platforms instantly</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-300">Viewer Rewards Pool</div>
                <div className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  {viewerRewards.reduce((sum, reward) => sum + reward.coinsEarned, 0)} AC
                </div>
              </div>
              {isLive && (
                <div className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  LIVE • {liveViewers} viewers
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="create" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-black/30">
            <TabsTrigger value="create">Create & Post</TabsTrigger>
            <TabsTrigger value="superfeed">Super Feed</TabsTrigger>
            <TabsTrigger value="live">Live Studio</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Create & Post Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Content Creator */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Create New Post
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="What's happening in your studio today?"
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({...prev, content: e.target.value}))}
                      className="min-h-[120px] bg-black/50 border-purple-500/30"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Media Type</label>
                        <Select value={newPost.mediaType} onValueChange={(value: any) => setNewPost(prev => ({...prev, mediaType: value}))}>
                          <SelectTrigger className="bg-black/50 border-purple-500/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Text Only</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Schedule (Optional)</label>
                        <Input
                          type="datetime-local"
                          value={newPost.scheduledTime}
                          onChange={(e) => setNewPost(prev => ({...prev, scheduledTime: e.target.value}))}
                          className="bg-black/50 border-purple-500/30"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={newPost.autoOptimize}
                          onCheckedChange={(checked) => setNewPost(prev => ({...prev, autoOptimize: checked}))}
                        />
                        <span className="text-sm">Auto-optimize for each platform</span>
                      </div>
                      
                      <Button onClick={handleCreatePost} className="bg-purple-600 hover:bg-purple-700">
                        <Send className="w-4 h-4 mr-2" />
                        Post to Selected
                      </Button>
                    </div>

                    <div className="border-t border-purple-500/20 pt-4">
                      <label className="text-sm font-medium mb-3 block">Select Platforms</label>
                      <div className="grid grid-cols-4 gap-3">
                        {platforms.map((platform) => {
                          const Icon = platform.icon;
                          const isSelected = newPost.platforms.includes(platform.id);
                          
                          return (
                            <button
                              key={platform.id}
                              onClick={() => {
                                if (isSelected) {
                                  setNewPost(prev => ({
                                    ...prev, 
                                    platforms: prev.platforms.filter(p => p !== platform.id)
                                  }));
                                } else {
                                  setNewPost(prev => ({
                                    ...prev, 
                                    platforms: [...prev.platforms, platform.id]
                                  }));
                                }
                              }}
                              className={`p-3 rounded-lg border transition-all ${
                                isSelected 
                                  ? 'border-purple-500 bg-purple-500/20' 
                                  : 'border-gray-600 bg-black/30 hover:border-purple-500/50'
                              } ${!platform.connected ? 'opacity-50' : ''}`}
                              disabled={!platform.connected}
                            >
                              <Icon className="w-6 h-6 mx-auto mb-2" style={{color: platform.color}} />
                              <div className="text-xs">{platform.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Platform Stats */}
              <div className="space-y-6">
                <Card className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Platform Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {platforms.filter(p => p.connected).map((platform) => {
                        const Icon = platform.icon;
                        return (
                          <div key={platform.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5" style={{color: platform.color}} />
                              <div>
                                <div className="font-medium">{platform.name}</div>
                                <div className="text-xs text-gray-400">{platform.followers.toLocaleString()} followers</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{platform.engagement}%</div>
                              <div className="text-xs text-gray-400">engagement</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      Live Viewer Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {viewerRewards.slice(0, 10).map((reward, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-300">{reward.action}</span>
                          </div>
                          <span className="text-yellow-400">+{reward.coinsEarned} AC</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Super Feed Tab */}
          <TabsContent value="superfeed" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-48 bg-black/50 border-purple-500/30">
                    <SelectValue placeholder="Filter by platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="border-purple-500/30">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Feed
                </Button>
              </div>

              <div className="text-sm text-gray-400">
                Showing {filteredFeed.length} posts • Total earnings: ${filteredFeed.reduce((sum, post) => sum + post.earnings, 0).toFixed(2)}
              </div>
            </div>

            <div className="grid gap-6">
              {filteredFeed.map((post) => {
                const Icon = getPlatformIcon(post.platform);
                const platform = platforms.find(p => p.id === post.platform);
                
                return (
                  <Card key={post.id} className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6" style={{color: getPlatformColor(post.platform)}} />
                          <div>
                            <div className="font-medium">{platform?.name}</div>
                            <div className="text-sm text-gray-400">{post.timestamp}</div>
                          </div>
                          {post.optimized && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                              Optimized
                            </Badge>
                          )}
                          {post.scheduled && (
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                              Scheduled
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">${post.earnings.toFixed(2)}</div>
                          <div className="text-xs text-gray-400">earned</div>
                        </div>
                      </div>

                      <p className="text-gray-200 mb-4">{post.content}</p>

                      {post.mediaUrl && (
                        <div className="mb-4">
                          {post.mediaType === 'video' ? (
                            <div className="bg-gray-800 rounded-lg h-48 flex items-center justify-center">
                              <Video className="w-12 h-12 text-gray-400" />
                            </div>
                          ) : (
                            <div className="bg-gray-800 rounded-lg h-48 flex items-center justify-center">
                              <Camera className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {post.views.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            {post.likes.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            {post.shares.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="text-sm text-yellow-400">
                          +{Math.floor(post.views / 100)} AC from viewers
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Live Studio Tab */}
          <TabsContent value="live" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Live Streaming Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-black rounded-lg h-64 flex items-center justify-center relative">
                    {isLive ? (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-lg font-bold">You're Live!</div>
                        <div className="text-sm text-gray-400">{liveViewers} viewers watching</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="text-lg">Ready to go live?</div>
                        <div className="text-sm text-gray-400">Connect your camera and microphone</div>
                      </div>
                    )}
                    
                    {isLive && (
                      <div className="absolute top-4 left-4 bg-red-500 px-2 py-1 rounded text-sm font-bold">
                        LIVE
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    {!isLive ? (
                      <Button onClick={handleStartLive} className="bg-red-500 hover:bg-red-600">
                        <Play className="w-4 h-4 mr-2" />
                        Go Live
                      </Button>
                    ) : (
                      <Button onClick={handleStopLive} variant="destructive">
                        <Square className="w-4 h-4 mr-2" />
                        End Stream
                      </Button>
                    )}
                    
                    <Button variant="outline" className="border-purple-500/30">
                      <Camera className="w-4 h-4 mr-2" />
                      Camera
                    </Button>
                    
                    <Button variant="outline" className="border-purple-500/30">
                      <Mic className="w-4 h-4 mr-2" />
                      Microphone
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {platforms.filter(p => p.liveEnabled && p.connected).map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <div key={platform.id} className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" style={{color: platform.color}} />
                            <span className="text-sm">{platform.name}</span>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Live Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{liveViewers}</div>
                        <div className="text-sm text-gray-400">Current Viewers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">${(liveViewers * 0.05).toFixed(2)}</div>
                        <div className="text-sm text-gray-400">Live Earnings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{liveViewers * 2}</div>
                        <div className="text-sm text-gray-400">AC Generated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{isLive ? '00:15:32' : '00:00:00'}</div>
                        <div className="text-sm text-gray-400">Duration</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      Viewer Reward Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-400 mb-4">
                      Viewers earn ArtistCoins for watching and engaging with your content
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Watching (per minute)</span>
                        <span className="text-yellow-400">1 AC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Liking content</span>
                        <span className="text-yellow-400">2 AC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Commenting</span>
                        <span className="text-yellow-400">3 AC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sharing</span>
                        <span className="text-yellow-400">5 AC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Following creator</span>
                        <span className="text-yellow-400">10 AC</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Total Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">2.4M</div>
                  <div className="text-sm text-gray-400">across all platforms</div>
                  <Progress value={85} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Creator Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">$3,248</div>
                  <div className="text-sm text-gray-400">this month</div>
                  <div className="text-xs text-green-400 mt-1">+24% vs last month</div>
                </CardContent>
              </Card>

              <Card className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Viewer Rewards Given</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-400">45,290 AC</div>
                  <div className="text-sm text-gray-400">to {Math.floor(45290 / 12)} viewers</div>
                  <div className="text-xs text-yellow-400 mt-1">Building engagement</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {platforms.filter(p => p.connected).map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <div key={platform.id} className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Icon className="w-8 h-8" style={{color: platform.color}} />
                          <div>
                            <div className="font-medium">{platform.name}</div>
                            <div className="text-sm text-gray-400">{platform.followers.toLocaleString()} followers</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">
                            ${(platform.followers * platform.engagement / 1000).toFixed(0)}
                          </div>
                          <div className="text-sm text-gray-400">{platform.engagement}% engagement</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}