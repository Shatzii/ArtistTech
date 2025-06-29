import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { 
  Coins, TrendingUp, Users, Heart, MessageCircle, Share, 
  Eye, Play, Instagram, Twitter, Youtube, Music,
  Plus, RefreshCw, Settings, Crown, Trophy, Target,
  BarChart3, Zap, Link as LinkIcon
} from 'lucide-react';

interface SocialConnection {
  platform: string;
  connected: boolean;
  followerCount: number;
  username?: string;
}

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  mediaUrls: string[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: string;
}

interface WalletInfo {
  balance: number;
  totalEarned: number;
  profitShareStatus: {
    eligible: boolean;
    tier: number;
    sharePercentage: number;
    registrationNumber: number;
    monthlyProfitShare: number;
  };
}

export default function SocialMediaDashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [coinBalance, setCoinBalance] = useState(0);
  const [isEarning, setIsEarning] = useState(false);
  const queryClient = useQueryClient();

  const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: <Play className="w-5 h-5" />, color: 'bg-black' },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'bg-pink-600' },
    { id: 'twitter', name: 'Twitter/X', icon: <Twitter className="w-5 h-5" />, color: 'bg-blue-500' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: 'bg-red-600' },
    { id: 'spotify', name: 'Spotify', icon: <Music className="w-5 h-5" />, color: 'bg-green-600' },
  ];

  // Fetch wallet info
  const { data: walletInfo = {} as WalletInfo } = useQuery<WalletInfo>({
    queryKey: ['/api/artistcoin/wallet'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch social connections
  const { data: connections = [] } = useQuery<SocialConnection[]>({
    queryKey: ['/api/artistcoin/social-connections'],
  });

  // Fetch unified social feed
  const { data: socialFeed = [] } = useQuery<SocialPost[]>({
    queryKey: ['/api/artistcoin/social-feed', selectedPlatform],
  });

  // Connect social platform mutation
  const connectPlatformMutation = useMutation({
    mutationFn: (platform: string) => apiRequest('POST', '/api/artistcoin/connect-social', { platform }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artistcoin/social-connections'] });
    },
  });

  // Sync social feed mutation
  const syncFeedMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/artistcoin/sync-feed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artistcoin/social-feed'] });
    },
  });

  // Start earning session
  useEffect(() => {
    const startSession = async () => {
      setIsEarning(true);
      await apiRequest('POST', '/api/artistcoin/start-session');
      
      // Log activity every minute
      const activityInterval = setInterval(() => {
        apiRequest('POST', '/api/artistcoin/log-activity', { 
          activityType: 'dashboard_view',
          duration: 60 
        });
      }, 60000);

      return () => clearInterval(activityInterval);
    };

    startSession();
  }, []);

  const filteredFeed = selectedPlatform === 'all' 
    ? socialFeed 
    : socialFeed.filter((post: SocialPost) => post.platform === selectedPlatform);

  const getPlatformIcon = (platform: string) => {
    const platformConfig = platforms.find(p => p.id === platform);
    return platformConfig?.icon || <LinkIcon className="w-5 h-5" />;
  };

  const getPlatformColor = (platform: string) => {
    const platformConfig = platforms.find(p => p.id === platform);
    return platformConfig?.color || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with ArtistCoin Wallet */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Social Media Command Center
            </h1>
            <p className="text-gray-300">All your platforms in one place • Earn ArtistCoins while you browse</p>
          </div>

          {/* ArtistCoin Wallet */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 text-white min-w-[300px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6" />
                <span className="font-bold">ArtistCoin Wallet</span>
              </div>
              {isEarning && (
                <div className="flex items-center gap-1 text-green-200">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Earning</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Balance:</span>
                <span className="font-bold">{walletInfo?.balance?.toLocaleString() || '0'} AC</span>
              </div>
              <div className="flex justify-between">
                <span>Total Earned:</span>
                <span className="font-bold">{walletInfo?.totalEarned?.toLocaleString() || '0'} AC</span>
              </div>
              
              {walletInfo?.profitShareStatus?.eligible && (
                <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-yellow-400">Profit Share Tier {walletInfo.profitShareStatus.tier}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Share: {walletInfo.profitShareStatus.sharePercentage}% of company profits</div>
                    <div>Registration: #{walletInfo.profitShareStatus.registrationNumber.toLocaleString()}</div>
                    <div>Monthly Dividend: ${walletInfo.profitShareStatus.monthlyProfitShare.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Platform Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {platforms.map((platform) => {
            const connection = connections.find((c: SocialConnection) => c.platform === platform.id);
            
            return (
              <div key={platform.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                    {platform.icon}
                  </div>
                  {connection?.connected ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  ) : (
                    <button
                      onClick={() => connectPlatformMutation.mutate(platform.id)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      disabled={connectPlatformMutation.isPending}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h3 className="font-semibold text-white mb-1">{platform.name}</h3>
                
                {connection?.connected ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">@{connection.username || 'connected'}</p>
                    <p className="text-sm text-green-400">{connection.followerCount.toLocaleString()} followers</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Not connected</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Feed Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Unified Feed</h2>
            <button
              onClick={() => syncFeedMutation.mutate()}
              disabled={syncFeedMutation.isPending}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncFeedMutation.isPending ? 'animate-spin' : ''}`} />
              Sync All
            </button>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPlatform === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedPlatform === platform.id 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {platform.icon}
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        {/* Social Media Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeed.map((post: SocialPost) => (
            <div key={post.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getPlatformColor(post.platform)} text-white`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white capitalize">{post.platform}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>

              {post.mediaUrls.length > 0 && (
                <div className="mb-4">
                  <img
                    src={post.mediaUrls[0]}
                    alt="Post media"
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share className="w-4 h-4" />
                    <span>{post.shares.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFeed.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
            <p className="text-gray-400 mb-4">
              {selectedPlatform === 'all' 
                ? 'Connect your social media accounts to see your unified feed'
                : `No posts from ${platforms.find(p => p.id === selectedPlatform)?.name}`
              }
            </p>
            <button
              onClick={() => syncFeedMutation.mutate()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Sync Now
            </button>
          </div>
        )}

        {/* ArtistCoin Earning Info */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">💰 How You're Earning ArtistCoins</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white mb-2">Daily Login</h4>
              <p className="text-green-400 text-lg font-bold">10 AC/day</p>
              <p className="text-sm text-gray-400">Just for staying connected</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white mb-2">Active Browsing</h4>
              <p className="text-blue-400 text-lg font-bold">0.1 AC/min</p>
              <p className="text-sm text-gray-400">While viewing content</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white mb-2">Profit Sharing</h4>
              <p className="text-purple-400 text-lg font-bold">5-10%</p>
              <p className="text-sm text-gray-400">Company profit shares</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}