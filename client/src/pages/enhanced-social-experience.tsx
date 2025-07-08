
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark,
  Eye,
  Coins,
  TrendingUp,
  Filter,
  Search,
  Bell,
  Star,
  Gift,
  Users,
  Play,
  Calendar,
  Award,
  Crown,
  Flame,
  Target,
  BarChart3,
  Settings,
  Download,
  Edit,
  Globe,
  Zap
} from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube, SiX, SiSpotify, SiFacebook } from "react-icons/si";

interface SocialPost {
  id: string;
  platform: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  content: {
    type: 'video' | 'image' | 'text' | 'audio';
    url?: string;
    thumbnail?: string;
    caption: string;
    duration?: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  timestamp: Date;
  saved: boolean;
  watched: boolean;
  earnedCoins: number;
}

interface ViewerProfile {
  totalCoinsEarned: number;
  dailyStreak: number;
  viewingTime: string;
  favoritePlatforms: string[];
  topCreators: string[];
  achievements: string[];
  level: string;
  nextLevelProgress: number;
}

export default function EnhancedSocialExperience() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [savedContent, setSavedContent] = useState<SocialPost[]>([]);
  const [viewerProfile, setViewerProfile] = useState<ViewerProfile>();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    loadSocialFeed();
    loadViewerProfile();
  }, []);

  const loadSocialFeed = async () => {
    // Simulate loading posts from multiple platforms
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        platform: 'tiktok',
        creator: {
          name: 'MusicVibes',
          avatar: '/api/placeholder/40/40',
          verified: true,
          followers: 125000
        },
        content: {
          type: 'video',
          thumbnail: '/api/placeholder/300/400',
          caption: '🎵 New beat drop! What do you think? #music #beats #producer',
          duration: '0:15'
        },
        engagement: {
          likes: 45000,
          comments: 1200,
          shares: 850,
          views: 125000
        },
        timestamp: new Date('2025-01-29T10:30:00'),
        saved: false,
        watched: false,
        earnedCoins: 0
      },
      {
        id: '2',
        platform: 'instagram',
        creator: {
          name: 'StudioLife',
          avatar: '/api/placeholder/40/40',
          verified: false,
          followers: 25000
        },
        content: {
          type: 'image',
          thumbnail: '/api/placeholder/400/400',
          caption: 'Behind the scenes in the studio 🎹 #studiolife #music #recording'
        },
        engagement: {
          likes: 3200,
          comments: 145,
          shares: 67,
          views: 8500
        },
        timestamp: new Date('2025-01-29T09:15:00'),
        saved: true,
        watched: true,
        earnedCoins: 5
      }
    ];
    setPosts(mockPosts);
  };

  const loadViewerProfile = () => {
    const profile: ViewerProfile = {
      totalCoinsEarned: 1250,
      dailyStreak: 7,
      viewingTime: '2h 34m',
      favoritePlatforms: ['tiktok', 'instagram', 'youtube'],
      topCreators: ['MusicVibes', 'StudioLife', 'BeatMaker'],
      achievements: ['Early Supporter', 'Trend Spotter', 'Community Builder'],
      level: 'Gold Viewer',
      nextLevelProgress: 75
    };
    setViewerProfile(profile);
  };

  const watchContent = async (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId && !post.watched) {
        return {
          ...post,
          watched: true,
          earnedCoins: 2 // Base viewing reward
        };
      }
      return post;
    }));

    // Update viewer profile
    if (viewerProfile) {
      setViewerProfile({
        ...viewerProfile,
        totalCoinsEarned: viewerProfile.totalCoinsEarned + 2
      });
    }
  };

  const saveContent = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post && !post.saved) {
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, saved: true } : p
      ));
      setSavedContent([...savedContent, { ...post, saved: true }]);
    }
  };

  const engageWithContent = async (postId: string, action: 'like' | 'comment' | 'share') => {
    const coinRewards = { like: 1, comment: 3, share: 5 };
    const reward = coinRewards[action];

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          engagement: {
            ...post.engagement,
            [action === 'like' ? 'likes' : action === 'comment' ? 'comments' : 'shares']: 
              post.engagement[action === 'like' ? 'likes' : action === 'comment' ? 'comments' : 'shares'] + 1
          },
          earnedCoins: post.earnedCoins + reward
        };
      }
      return post;
    }));

    if (viewerProfile) {
      setViewerProfile({
        ...viewerProfile,
        totalCoinsEarned: viewerProfile.totalCoinsEarned + reward
      });
    }
  };

  const platformIcons = {
    tiktok: SiTiktok,
    instagram: SiInstagram,
    youtube: SiYoutube,
    twitter: SiX,
    facebook: SiFacebook,
    spotify: SiSpotify
  };

  const platformColors = {
    tiktok: 'bg-black text-white',
    instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    youtube: 'bg-red-600 text-white',
    twitter: 'bg-blue-500 text-white',
    facebook: 'bg-blue-700 text-white',
    spotify: 'bg-green-500 text-white'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Social Hub Pro
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="font-bold">{viewerProfile?.totalCoinsEarned || 0}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm">{viewerProfile?.dailyStreak || 0} day streak</span>
              </div>
              
              <Badge variant="secondary" className="bg-gold-500/20 text-yellow-400">
                {viewerProfile?.level || 'New Viewer'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="feed">Universal Feed</TabsTrigger>
            <TabsTrigger value="saved">Saved Content</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="analytics">My Analytics</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          {/* Universal Feed */}
          <TabsContent value="feed" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search across all platforms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20"
                />
              </div>
              
              <Button variant="outline" className="border-white/20">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Platform Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {Object.entries(platformIcons).map(([platform, Icon]) => (
                <Button
                  key={platform}
                  variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (selectedPlatforms.includes(platform)) {
                      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                    } else {
                      setSelectedPlatforms([...selectedPlatforms.filter(p => p !== 'all'), platform]);
                    }
                  }}
                  className={`${platformColors[platform as keyof typeof platformColors]} min-w-fit`}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Button>
              ))}
            </div>

            {/* Content Feed */}
            <div className="grid gap-6">
              {posts.map((post) => {
                const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons];
                
                return (
                  <Card key={post.id} className="bg-white/10 backdrop-blur border-white/20">
                    <CardContent className="p-6">
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={post.creator.avatar} 
                            alt={post.creator.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{post.creator.name}</span>
                              {post.creator.verified && (
                                <Badge className="bg-blue-500 text-white text-xs">
                                  ✓ Verified
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {post.creator.followers.toLocaleString()} followers
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <PlatformIcon className="w-5 h-5" />
                          <span className="text-sm text-gray-400">
                            {post.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        {post.content.type === 'video' && (
                          <div className="relative">
                            <img 
                              src={post.content.thumbnail} 
                              alt="Video thumbnail"
                              className="w-full h-64 object-cover rounded-lg"
                            />
                            <Button
                              onClick={() => watchContent(post.id)}
                              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
                              disabled={post.watched}
                            >
                              {post.watched ? (
                                <Eye className="w-6 h-6" />
                              ) : (
                                <Play className="w-6 h-6" />
                              )}
                            </Button>
                            {post.content.duration && (
                              <Badge className="absolute bottom-2 right-2 bg-black/70">
                                {post.content.duration}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <p className="mt-3 text-sm">{post.content.caption}</p>
                      </div>

                      {/* Engagement */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => engageWithContent(post.id, 'like')}
                            className="flex items-center gap-2 text-gray-400 hover:text-red-400"
                          >
                            <Heart className="w-4 h-4" />
                            {post.engagement.likes.toLocaleString()}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => engageWithContent(post.id, 'comment')}
                            className="flex items-center gap-2 text-gray-400 hover:text-blue-400"
                          >
                            <MessageCircle className="w-4 h-4" />
                            {post.engagement.comments.toLocaleString()}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => engageWithContent(post.id, 'share')}
                            className="flex items-center gap-2 text-gray-400 hover:text-green-400"
                          >
                            <Share className="w-4 h-4" />
                            {post.engagement.shares.toLocaleString()}
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          {post.earnedCoins > 0 && (
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              +{post.earnedCoins} AC
                            </Badge>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveContent(post.id)}
                            className={`${post.saved ? 'text-yellow-400' : 'text-gray-400'}`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Saved Content */}
          <TabsContent value="saved" className="space-y-6">
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Your Saved Content</h3>
              <p className="text-gray-400 mb-6">Content you've saved appears here</p>
              
              <div className="grid gap-4">
                {savedContent.map((post) => (
                  <Card key={post.id} className="bg-white/10 backdrop-blur border-white/20 p-4">
                    <div className="flex items-center gap-3">
                      <img src={post.content.thumbnail} alt="" className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium">{post.creator.name}</p>
                        <p className="text-sm text-gray-400 truncate">{post.content.caption}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit & Share
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Collections */}
          <TabsContent value="collections" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Collections</h2>
              <Button>Create Collection</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Favorites', 'Inspiration', 'Watch Later', 'Study Beats'].map((collection) => (
                <Card key={collection} className="bg-white/10 backdrop-blur border-white/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{collection}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-gray-600 rounded"></div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">12 items</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Coins Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold">{viewerProfile?.totalCoinsEarned}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Viewing Time Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span className="text-2xl font-bold">{viewerProfile?.viewingTime}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Daily Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-2xl font-bold">{viewerProfile?.dailyStreak} days</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Level Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{viewerProfile?.level}</span>
                      <span>{viewerProfile?.nextLevelProgress}%</span>
                    </div>
                    <Progress value={viewerProfile?.nextLevelProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {viewerProfile?.achievements.map((achievement) => (
                    <div key={achievement} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                        <Crown className="w-5 h-5 text-yellow-400" />
                      </div>
                      <span className="font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discover */}
          <TabsContent value="discover" className="space-y-6">
            <div className="text-center py-12">
              <Target className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Discover New Content</h3>
              <p className="text-gray-400 mb-6">Find trending creators and content across all platforms</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Trending Now', 'New Creators', 'Rising Stars', 'Your Recommendations'].map((section) => (
                  <Card key={section} className="bg-white/10 backdrop-blur border-white/20">
                    <CardHeader>
                      <CardTitle className="text-center">{section}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                            <div className="flex-1">
                              <p className="font-medium">Creator {i}</p>
                              <p className="text-xs text-gray-400">Music • 25K followers</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
