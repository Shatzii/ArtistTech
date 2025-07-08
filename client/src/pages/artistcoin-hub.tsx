import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { 
  Coins, TrendingUp, Trophy, Gift, Zap, Users, Target,
  Play, Share2, Heart, MessageCircle, Star, Crown,
  Timer, Flame, Award, Gem, Clock, ArrowUpRight
} from 'lucide-react';

export default function ArtistCoinHub() {
  const queryClient = useQueryClient();
  
  // ArtistCoin state
  const [selectedTab, setSelectedTab] = useState<'balance' | 'challenges' | 'rewards' | 'leaderboard'>('balance');
  const [realTimeBalance, setRealTimeBalance] = useState(2847);

  // Fetch ArtistCoin balance and data
  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['/api/artistcoin/balance'],
    refetchInterval: 5000
  });

  const { data: viralData, isLoading: viralLoading } = useQuery({
    queryKey: ['/api/artistcoin/viral'],
    refetchInterval: 30000
  });

  // Claim reward mutation
  const claimMutation = useMutation({
    mutationFn: async ({ rewardId, cost }: { rewardId: string; cost: number }) => {
      const response = await apiRequest('POST', '/api/artistcoin/claim', {
        rewardId,
        cost
      });
      return response.json();
    },
    onSuccess: (data) => {
      setRealTimeBalance(data.newBalance);
      queryClient.invalidateQueries({ queryKey: ['/api/artistcoin/balance'] });
    }
  });

  // Complete challenge mutation
  const completeMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      const response = await apiRequest('POST', '/api/artistcoin/challenge', {
        challengeId
      });
      return response.json();
    },
    onSuccess: (data) => {
      setRealTimeBalance(prev => prev + data.reward);
      queryClient.invalidateQueries({ queryKey: ['/api/artistcoin/balance'] });
    }
  });

  // Simulate real-time balance updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeBalance(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 10000); // Add 1-3 coins every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (balanceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading ArtistCoin Hub...</div>
      </div>
    );
  }

  const balance = balanceData || {
    currentBalance: realTimeBalance,
    totalEarned: 15420,
    rank: 342,
    streak: 12,
    recentActivity: [],
    challenges: []
  };

  const viral = viralData || {
    totalParticipants: 15420,
    activeChallengers: 892,
    weeklyWinners: [],
    trendingHashtags: [],
    powerUps: []
  };

  const rewards = [
    { id: 'exclusive_content', name: 'Exclusive Track Access', cost: 100, type: 'content' },
    { id: 'artist_shoutout', name: 'Artist Shoutout', cost: 500, type: 'social' },
    { id: 'studio_time', name: '1 Hour Studio Time', cost: 1000, type: 'experience' },
    { id: 'concert_ticket', name: 'VIP Concert Ticket', cost: 2000, type: 'experience' },
    { id: 'collaboration', name: 'Collaboration Opportunity', cost: 3000, type: 'career' },
    { id: 'nft_artwork', name: 'Limited Edition NFT', cost: 1500, type: 'collectible' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-purple-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-purple-400 hover:text-purple-300">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Coins className="w-6 h-6" />
              ArtistCoin Hub
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full text-white font-bold text-lg">
              {realTimeBalance} AC
            </div>
            <div className="bg-purple-500/20 px-3 py-1 rounded-full text-purple-300 text-sm">
              Rank #{balance.rank}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Live Balance Display */}
        <div className="bg-gradient-to-r from-yellow-800/30 to-orange-800/30 rounded-lg p-8 border border-yellow-500/30 mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Your ArtistCoin Balance</h2>
          <div className="text-6xl font-bold text-yellow-400 mb-4 flex items-center justify-center gap-2">
            <Coins className="w-12 h-12" />
            {realTimeBalance.toLocaleString()}
          </div>
          <div className="text-gray-300">
            Total Earned: {balance.totalEarned.toLocaleString()} AC • {balance.streak}-day streak
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-800/30 to-cyan-800/30 rounded-lg p-4 border border-blue-500/30">
            <div className="text-blue-300 text-sm">Total Participants</div>
            <div className="text-2xl font-bold text-white">{viral.totalParticipants.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-r from-green-800/30 to-emerald-800/30 rounded-lg p-4 border border-green-500/30">
            <div className="text-green-300 text-sm">Active Challengers</div>
            <div className="text-2xl font-bold text-white">{viral.activeChallengers.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-lg p-4 border border-purple-500/30">
            <div className="text-purple-300 text-sm">Your Rank</div>
            <div className="text-2xl font-bold text-white">#{balance.rank}</div>
          </div>
          <div className="bg-gradient-to-r from-red-800/30 to-orange-800/30 rounded-lg p-4 border border-red-500/30">
            <div className="text-red-300 text-sm">Daily Streak</div>
            <div className="text-2xl font-bold text-white">{balance.streak} days</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
            {[
              { id: 'balance', label: 'Balance & Activity', icon: Coins },
              { id: 'challenges', label: 'Challenges', icon: Target },
              { id: 'rewards', label: 'Rewards Store', icon: Gift },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Balance & Activity Tab */}
        {selectedTab === 'balance' && (
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {balance.recentActivity && balance.recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'view' ? 'bg-blue-500/20 text-blue-400' :
                        activity.type === 'share' ? 'bg-green-500/20 text-green-400' :
                        activity.type === 'like' ? 'bg-red-500/20 text-red-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {activity.type === 'view' && <Play className="w-4 h-4" />}
                        {activity.type === 'share' && <Share2 className="w-4 h-4" />}
                        {activity.type === 'like' && <Heart className="w-4 h-4" />}
                        {activity.type === 'comment' && <MessageCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-white font-medium">{activity.action}</div>
                        <div className="text-gray-400 text-sm">{activity.time}</div>
                      </div>
                    </div>
                    <div className="text-yellow-400 font-bold">+{activity.amount} AC</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Earning Methods */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Ways to Earn ArtistCoins
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { action: 'Watch Content', reward: '1-5 AC/min', icon: <Play className="w-6 h-6" />, color: 'from-blue-500 to-cyan-500' },
                  { action: 'Share Posts', reward: '10-25 AC', icon: <Share2 className="w-6 h-6" />, color: 'from-green-500 to-emerald-500' },
                  { action: 'Like Content', reward: '2-5 AC', icon: <Heart className="w-6 h-6" />, color: 'from-red-500 to-pink-500' },
                  { action: 'Create Content', reward: '50-500 AC', icon: <Star className="w-6 h-6" />, color: 'from-purple-500 to-pink-500' }
                ].map((method, index) => (
                  <div key={index} className={`bg-gradient-to-r ${method.color} bg-opacity-20 rounded-lg p-4 border border-gray-600`}>
                    <div className="text-white mb-2">{method.icon}</div>
                    <h4 className="font-bold text-white">{method.action}</h4>
                    <p className="text-gray-300 text-sm">{method.reward}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {selectedTab === 'challenges' && (
          <div className="space-y-4">
            {balance.challenges && balance.challenges.map((challenge: any, index: number) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
                  <div className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-300 font-bold">
                    {challenge.reward} AC
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{challenge.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{challenge.progress}/{challenge.target}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">
                    {challenge.completed ? 'Completed!' : 'In Progress'}
                  </div>
                  <button 
                    onClick={() => completeMutation.mutate(challenge.id)}
                    disabled={challenge.completed || completeMutation.isPending}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      challenge.completed 
                        ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
                        : challenge.progress >= challenge.target
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {challenge.completed ? 'Completed' : challenge.progress >= challenge.target ? 'Claim Reward' : 'In Progress'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rewards Store Tab */}
        {selectedTab === 'rewards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">{reward.name}</h3>
                  <div className={`px-2 py-1 rounded text-xs ${
                    reward.type === 'content' ? 'bg-blue-500/20 text-blue-300' :
                    reward.type === 'social' ? 'bg-green-500/20 text-green-300' :
                    reward.type === 'experience' ? 'bg-purple-500/20 text-purple-300' :
                    reward.type === 'career' ? 'bg-red-500/20 text-red-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {reward.type}
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-yellow-400">{reward.cost} AC</div>
                </div>

                <button 
                  onClick={() => claimMutation.mutate({ rewardId: reward.id, cost: reward.cost })}
                  disabled={realTimeBalance < reward.cost || claimMutation.isPending}
                  className={`w-full py-2 rounded-lg font-medium transition-all ${
                    realTimeBalance >= reward.cost
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {realTimeBalance >= reward.cost ? 'Claim Reward' : 'Insufficient Balance'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard Tab */}
        {selectedTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                Top Earners This Week
              </h3>
              <div className="space-y-3">
                {viral.weeklyWinners && viral.weeklyWinners.map((winner: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl ${
                        index === 0 ? 'text-yellow-400' : 
                        index === 1 ? 'text-gray-300' : 
                        index === 2 ? 'text-orange-400' : 'text-gray-500'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <div>
                        <div className="text-white font-bold">{winner.name}</div>
                        <div className="text-gray-400 text-sm">{winner.trend} growth</div>
                      </div>
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">{winner.coins.toLocaleString()} AC</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}