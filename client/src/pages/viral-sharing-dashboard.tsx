
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Share2, TrendingUp, Coins, Users, Eye, MousePointer, 
  Gift, Crown, Flame, Copy, ExternalLink, Trophy,
  BarChart3, Clock, Target, Zap, Heart, MessageCircle
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ShareData {
  share: {
    id: string;
    songId: string;
    shareUrl: string;
    platform: string;
    trackingCode: string;
    metadata: {
      songTitle: string;
      artist: string;
    };
    timestamp: string;
  };
  stats: {
    clicks: number;
    conversions: number;
    secondaryShares: number;
    earnings: number;
    viralScore: number;
  };
}

export default function ViralSharingDashboard() {
  const [selectedSong, setSelectedSong] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('tiktok');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [userId] = useState('demo-user');
  const queryClient = useQueryClient();

  // Fetch user shares
  const { data: userSharesData, isLoading: loadingShares } = useQuery({
    queryKey: ['/api/viral-sharing/user-shares', userId],
    queryFn: () => apiRequest('GET', `/api/viral-sharing/user-shares/${userId}`)
  });

  // Fetch top performing shares
  const { data: topSharesData } = useQuery({
    queryKey: ['/api/viral-sharing/top-shares'],
    queryFn: () => apiRequest('GET', '/api/viral-sharing/top-shares')
  });

  // Fetch platform metrics
  const { data: platformData } = useQuery({
    queryKey: ['/api/viral-sharing/platform-metrics'],
    queryFn: () => apiRequest('GET', '/api/viral-sharing/platform-metrics')
  });

  // Create share mutation
  const createShareMutation = useMutation({
    mutationFn: async (shareData: any) => {
      return apiRequest('POST', '/api/viral-sharing/create-share', shareData);
    },
    onSuccess: (data) => {
      setShareUrl(data.shareUrl);
      queryClient.invalidateQueries({ queryKey: ['/api/viral-sharing/user-shares'] });
    }
  });

  const userShares: ShareData[] = userSharesData?.shares || [];
  const topShares: ShareData[] = topSharesData?.shares || [];
  const platformMetrics = platformData?.metrics || [];

  const totalEarnings = userShares.reduce((sum, share) => sum + share.stats.earnings, 0);
  const totalClicks = userShares.reduce((sum, share) => sum + share.stats.clicks, 0);
  const totalSecondaryShares = userShares.reduce((sum, share) => sum + share.stats.secondaryShares, 0);

  const demoSongs = [
    { id: 'song1', title: 'Summer Vibes', artist: 'DJ Sunshine' },
    { id: 'song2', title: 'Night Drive', artist: 'Neon Dreams' },
    { id: 'song3', title: 'Electric Love', artist: 'Synth Wave' },
    { id: 'song4', title: 'Bass Drop', artist: 'Heavy Beats' }
  ];

  const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
    { id: 'telegram', name: 'Telegram', icon: '📱' }
  ];

  const handleCreateShare = () => {
    if (!selectedSong) return;

    const song = demoSongs.find(s => s.id === selectedSong);
    createShareMutation.mutate({
      songId: selectedSong,
      userId,
      platform: selectedPlatform,
      songTitle: song?.title,
      artist: song?.artist,
      originalUploader: 'demo-artist'
    });
  };

  const copyShareUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // You'd typically show a toast notification here
  };

  const getViralLevel = (score: number) => {
    if (score >= 1000) return { level: 'Legendary', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    if (score >= 500) return { level: 'Mega Viral', color: 'text-purple-400', bgColor: 'bg-purple-500/20' };
    if (score >= 100) return { level: 'Viral', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    return { level: 'Growing', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
  };

  const getNextMilestone = (clicks: number) => {
    if (clicks < 1000) return { next: 1000, bonus: 100 };
    if (clicks < 10000) return { next: 10000, bonus: 500 };
    if (clicks < 100000) return { next: 100000, bonus: 2500 };
    return { next: 1000000, bonus: 10000 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Viral Sharing Dashboard
          </h1>
          <p className="text-xl text-blue-200 mb-6">
            Share songs, track performance, earn ArtistCoins for every viral moment!
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/20 rounded-lg p-4 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">{totalEarnings.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Total Earnings (AC)</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">{totalClicks.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Total Clicks</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">{userShares.length}</div>
              <div className="text-sm text-gray-300">Active Shares</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-400">{totalSecondaryShares}</div>
              <div className="text-sm text-gray-300">Viral Re-shares</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20">
            <TabsTrigger value="create" className="data-[state=active]:bg-purple-600">
              <Share2 className="h-4 w-4 mr-2" />
              Create Share
            </TabsTrigger>
            <TabsTrigger value="my-shares" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              My Shares
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Create Share */}
          <TabsContent value="create">
            <Card className="bg-black/20 border-purple-500/20 text-white">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Create Viral Share
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Share a song and start earning ArtistCoins for every click, conversion, and viral moment!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Song</label>
                      <select
                        value={selectedSong}
                        onChange={(e) => setSelectedSong(e.target.value)}
                        className="w-full p-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white"
                      >
                        <option value="">Choose a song...</option>
                        {demoSongs.map(song => (
                          <option key={song.id} value={song.id}>
                            {song.title} - {song.artist}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Select Platform</label>
                      <div className="grid grid-cols-3 gap-2">
                        {platforms.map(platform => (
                          <button
                            key={platform.id}
                            onClick={() => setSelectedPlatform(platform.id)}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              selectedPlatform === platform.id 
                                ? 'bg-purple-600 border-purple-400' 
                                : 'bg-purple-900/30 border-purple-500/30 hover:bg-purple-800/30'
                            }`}
                          >
                            <div className="text-2xl mb-1">{platform.icon}</div>
                            <div className="text-xs">{platform.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleCreateShare}
                      disabled={!selectedSong || createShareMutation.isPending}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {createShareMutation.isPending ? 'Creating Share...' : 'Create Share Link'}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-purple-900/30 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-400 mb-3">💰 Earning Opportunities</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Create share</span>
                          <span className="text-green-400">+5 AC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Per click on your share</span>
                          <span className="text-green-400">+1 AC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Per conversion (follow/subscribe)</span>
                          <span className="text-green-400">+10 AC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Per re-share from your link</span>
                          <span className="text-green-400">+15 AC</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-900/30 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-400 mb-3">🔥 Viral Bonuses</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>1,000 clicks</span>
                          <span className="text-yellow-400">+100 AC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>10,000 clicks</span>
                          <span className="text-yellow-400">+500 AC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>100,000 clicks</span>
                          <span className="text-yellow-400">+2,500 AC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1,000,000 clicks</span>
                          <span className="text-yellow-400">+10,000 AC</span>
                        </div>
                      </div>
                    </div>

                    {shareUrl && (
                      <div className="bg-green-900/30 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-400 mb-3">✅ Share Created!</h3>
                        <div className="flex gap-2">
                          <Input
                            value={shareUrl}
                            readOnly
                            className="bg-black/20 border-green-500/30 text-white"
                          />
                          <Button
                            onClick={() => copyShareUrl(shareUrl)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          Share this link and start earning ArtistCoins!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Shares */}
          <TabsContent value="my-shares">
            <div className="grid gap-6">
              {loadingShares ? (
                <div className="text-center py-8">Loading your shares...</div>
              ) : userShares.length === 0 ? (
                <Card className="bg-black/20 border-purple-500/20 text-white">
                  <CardContent className="text-center py-8">
                    <Share2 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-xl font-semibold mb-2">No shares yet</h3>
                    <p className="text-gray-400 mb-4">Create your first share to start earning ArtistCoins!</p>
                    <Button 
                      onClick={() => document.querySelector('[value="create"]')?.click()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Create First Share
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                userShares.map((shareData) => {
                  const viral = getViralLevel(shareData.stats.viralScore);
                  const milestone = getNextMilestone(shareData.stats.clicks);
                  const progress = (shareData.stats.clicks / milestone.next) * 100;

                  return (
                    <Card key={shareData.share.id} className="bg-black/20 border-purple-500/20 text-white">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-yellow-400">
                              {shareData.share.metadata.songTitle}
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                              by {shareData.share.metadata.artist} • Shared on {shareData.share.platform}
                            </CardDescription>
                          </div>
                          <Badge className={`${viral.bgColor} ${viral.color} border-0`}>
                            <Flame className="h-3 w-3 mr-1" />
                            {viral.level}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="bg-blue-900/30 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-blue-400">
                                  {shareData.stats.clicks.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-300">Clicks</div>
                              </div>
                              <div className="bg-green-900/30 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-green-400">
                                  {shareData.stats.earnings.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-300">AC Earned</div>
                              </div>
                              <div className="bg-purple-900/30 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-purple-400">
                                  {shareData.stats.conversions}
                                </div>
                                <div className="text-sm text-gray-300">Conversions</div>
                              </div>
                              <div className="bg-orange-900/30 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-orange-400">
                                  {shareData.stats.secondaryShares}
                                </div>
                                <div className="text-sm text-gray-300">Re-shares</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Next Viral Milestone</span>
                                <span className="text-yellow-400">
                                  {milestone.next.toLocaleString()} clicks (+{milestone.bonus} AC)
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <div className="text-xs text-gray-400 mt-1">
                                {(milestone.next - shareData.stats.clicks).toLocaleString()} clicks to go
                              </div>
                            </div>

                            <div className="bg-purple-900/30 p-3 rounded-lg">
                              <div className="text-sm font-semibold text-purple-400 mb-2">Viral Score</div>
                              <div className="text-2xl font-bold">{shareData.stats.viralScore.toFixed(1)}</div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex gap-2">
                              <Input
                                value={shareData.share.shareUrl}
                                readOnly
                                className="bg-black/20 border-purple-500/30 text-white text-sm"
                              />
                              <Button
                                onClick={() => copyShareUrl(shareData.share.shareUrl)}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="text-sm text-gray-300">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-3 w-3" />
                                Shared {new Date(shareData.share.timestamp).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-3 w-3" />
                                Tracking: {shareData.share.trackingCode}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard">
            <Card className="bg-black/20 border-purple-500/20 text-white">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Top Viral Shares
                </CardTitle>
                <CardDescription className="text-gray-300">
                  See the most viral shares and their incredible performance!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topShares.map((shareData, index) => {
                    const viral = getViralLevel(shareData.stats.viralScore);
                    
                    return (
                      <div key={shareData.share.id} className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-orange-500 text-black' :
                            'bg-purple-600 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{shareData.share.metadata.songTitle}</p>
                            <p className="text-sm text-gray-400">
                              by {shareData.share.metadata.artist} • {shareData.share.platform}
                            </p>
                          </div>
                          <Badge className={`${viral.bgColor} ${viral.color} border-0`}>
                            {viral.level}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-400">
                            {shareData.stats.clicks.toLocaleString()} clicks
                          </p>
                          <p className="text-sm text-green-400">
                            {shareData.stats.earnings.toLocaleString()} AC earned
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-black/20 border-purple-500/20 text-white">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Platform Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformMetrics.map(platform => (
                      <div key={platform.platform} className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {platforms.find(p => p.id === platform.platform)?.icon || '📱'}
                          </div>
                          <div>
                            <p className="font-semibold capitalize">{platform.platform}</p>
                            <p className="text-sm text-gray-400">
                              {platform.totalShares} shares • {platform.conversionRate}% conversion
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-400">
                            {platform.averageEarnings.toFixed(1)} AC avg
                          </p>
                          <p className="text-sm text-blue-400">
                            {platform.totalClicks.toLocaleString()} clicks
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20 text-white">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Earning Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-900/30 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-400 mb-3">Total Earnings</h3>
                      <div className="text-3xl font-bold text-green-400">{totalEarnings.toLocaleString()} AC</div>
                      <p className="text-sm text-gray-300">From {userShares.length} active shares</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-blue-900/30 p-3 rounded-lg">
                        <div className="text-xl font-bold text-blue-400">{totalClicks.toLocaleString()}</div>
                        <div className="text-sm text-gray-300">Total Clicks</div>
                      </div>
                      <div className="bg-orange-900/30 p-3 rounded-lg">
                        <div className="text-xl font-bold text-orange-400">{totalSecondaryShares}</div>
                        <div className="text-sm text-gray-300">Viral Re-shares</div>
                      </div>
                    </div>

                    <div className="bg-purple-900/30 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-400 mb-3">Your Best Share</h3>
                      {userShares.length > 0 ? (
                        <div>
                          <p className="font-semibold">
                            {userShares.sort((a, b) => b.stats.viralScore - a.stats.viralScore)[0]?.share.metadata.songTitle}
                          </p>
                          <p className="text-sm text-gray-300">
                            {userShares.sort((a, b) => b.stats.viralScore - a.stats.viralScore)[0]?.stats.clicks.toLocaleString()} clicks
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-400">No shares yet</p>
                      )}
                    </div>
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
