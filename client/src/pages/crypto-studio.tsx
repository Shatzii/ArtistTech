import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Coins, TrendingUp, DollarSign, Zap, Users, Gift,
  Star, Crown, Flame, Award, Target, ArrowUp,
  Play, Heart, Share2, MessageCircle, Eye,
  Sparkles, Trophy, Gamepad2, BarChart3, Wallet
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Challenge {
  id: string;
  title: string;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
  timeLeft: string;
  participants: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Influencer {
  id: string;
  name: string;
  platform: string;
  followers: string;
  contribution: string;
  reward: number;
}

export default function CryptoStudio() {
  const [balance, setBalance] = useState(15847);
  const [totalEarned, setTotalEarned] = useState(47293);
  const [dailyStreak, setDailyStreak] = useState(12);
  const [level, setLevel] = useState(7);
  const [experience, setExperience] = useState(3420);
  const [nextLevelXp, setNextLevelXp] = useState(5000);

  const queryClient = useQueryClient();

  // API Queries
  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['crypto-balance'],
    queryFn: () => apiRequest('/api/studio/crypto/balance'),
  });

  const { data: challengesData, isLoading: challengesLoading } = useQuery({
    queryKey: ['crypto-challenges'],
    queryFn: () => apiRequest('/api/studio/crypto/challenges'),
  });

  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: ['crypto-achievements'],
    queryFn: () => apiRequest('/api/studio/crypto/achievements'),
  });

  const { data: influencersData, isLoading: influencersLoading } = useQuery({
    queryKey: ['crypto-influencers'],
    queryFn: () => apiRequest('/api/studio/crypto/influencers'),
  });

  // API Mutations
  const claimRewardMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/studio/crypto/claim-reward', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crypto-balance'] });
      queryClient.invalidateQueries({ queryKey: ['crypto-challenges'] });
    },
  });

  const stakeMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/studio/crypto/stake', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crypto-balance'] });
    },
  });

  // Transform API data to match component expectations
  const challenges = challengesData?.challenges || [];
  const achievements = achievementsData?.achievements || [];
  const influencers = influencersData?.influencers || [];
  const cryptoBalance = balanceData?.artistcoin || { balance: 0, usd_value: 0, change_24h: 0, staked: 0, rewards_pending: 0 };

  // Simulate real-time balance updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomGain = Math.floor(Math.random() * 10) + 1;
      setBalance(prev => prev + randomGain);
      setTotalEarned(prev => prev + randomGain);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-yellow-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-yellow-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ArtistCoin Studio</h1>
            <p className="text-sm text-gray-400">Revolutionary Cryptocurrency for Creators & Fans</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-sm text-gray-400">Level {level}</div>
            <div className="w-24 bg-black/60 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${(experience / nextLevelXp) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">ArtistCoin Balance</div>
            <div className="text-2xl font-bold text-yellow-400 flex items-center">
              <Coins className="w-6 h-6 mr-2" />
              {cryptoBalance.balance.toLocaleString()} AC
            </div>
          </div>
          <Badge variant="default" className="bg-yellow-500 text-black animate-pulse">
            <Flame className="w-3 h-3 mr-1" />
            {dailyStreak} Day Streak
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <Tabs defaultValue="earn" className="w-full">
            <TabsList className="grid grid-cols-5 w-full bg-black/30">
              <TabsTrigger value="earn">Earn Coins</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="viral">Viral Hub</TabsTrigger>
            </TabsList>

            {/* Earn Coins Tab */}
            <TabsContent value="earn" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-black/40 border-yellow-500/20">
                  <CardContent className="p-6 text-center">
                    <Eye className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Watch Content</h3>
                    <p className="text-gray-400 text-sm mb-4">Earn 1 AC per minute watching</p>
                    <div className="text-2xl font-bold text-yellow-400 mb-4">+1 AC/min</div>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      <Play className="w-4 h-4 mr-2" />
                      Start Watching
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-yellow-500/20">
                  <CardContent className="p-6 text-center">
                    <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Engage</h3>
                    <p className="text-gray-400 text-sm mb-4">Like, share, comment to earn</p>
                    <div className="text-2xl font-bold text-yellow-400 mb-4">2-10 AC</div>
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                      <Heart className="w-4 h-4 mr-2" />
                      Engage Now
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-yellow-500/20">
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Refer Friends</h3>
                    <p className="text-gray-400 text-sm mb-4">Get 100 AC per referral</p>
                    <div className="text-2xl font-bold text-yellow-400 mb-4">+100 AC</div>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <Share2 className="w-4 h-4 mr-2" />
                      Invite Friends
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Rewards */}
                <Card className="bg-black/40 border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Gift className="w-5 h-5 mr-2" />
                      Daily Login Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 7 }, (_, i) => (
                        <div key={i} className={`p-2 rounded text-center text-sm ${
                          i < dailyStreak ? 'bg-yellow-500/20 border border-yellow-500' : 'bg-gray-700'
                        }`}>
                          <div className="text-white font-bold">Day {i + 1}</div>
                          <div className="text-yellow-400">{(i + 1) * 10} AC</div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                      <Gift className="w-4 h-4 mr-2" />
                      Claim Today's Reward ({dailyStreak * 10} AC)
                    </Button>
                  </CardContent>
                </Card>

                {/* Power-ups */}
                <Card className="bg-black/40 border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Power-ups & Multipliers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-black/60 rounded">
                      <div>
                        <div className="text-white font-medium">2x Earnings Boost</div>
                        <div className="text-gray-400 text-sm">Double AC for 1 hour</div>
                      </div>
                      <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                        500 AC
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-black/60 rounded">
                      <div>
                        <div className="text-white font-medium">Mega Multiplier</div>
                        <div className="text-gray-400 text-sm">5x AC for 30 minutes</div>
                      </div>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        1000 AC
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/60 rounded">
                      <div>
                        <div className="text-white font-medium">Lucky Chest</div>
                        <div className="text-gray-400 text-sm">Random reward 50-2000 AC</div>
                      </div>
                      <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        750 AC
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Challenges Tab */}
            <TabsContent value="challenges" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="bg-black/40 border-yellow-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{challenge.title}</CardTitle>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-yellow-400">
                            {challenge.reward} AC
                          </div>
                          <div className="text-sm text-gray-400">Reward</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {challenge.timeLeft}
                          </div>
                          <div className="text-sm text-gray-400">Time Left</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {challenge.participants.toLocaleString()} participants
                        </span>
                      </div>

                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                        <Target className="w-4 h-4 mr-2" />
                        Join Challenge
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className={`bg-black/40 ${
                    achievement.unlocked ? 'border-yellow-500/50' : 'border-gray-500/20'
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center">
                          {achievement.unlocked ? (
                            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                          ) : (
                            <Award className="w-5 h-5 mr-2 text-gray-500" />
                          )}
                          {achievement.title}
                        </CardTitle>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        {achievement.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-yellow-400">
                          {achievement.reward.toLocaleString()} AC
                        </div>
                        {achievement.unlocked ? (
                          <Badge variant="default" className="bg-green-500">
                            Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-500 text-gray-400">
                            Locked
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Marketplace Tab */}
            <TabsContent value="marketplace" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-black/40 border-yellow-500/20">
                  <CardContent className="p-6 text-center">
                    <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">VIP Membership</h3>
                    <p className="text-gray-400 text-sm mb-4">3x earning multiplier + exclusive content</p>
                    <div className="text-2xl font-bold text-yellow-400 mb-4">5,000 AC</div>
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-yellow-500/20">
                  <CardContent className="p-6 text-center">
                    <Star className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Custom Avatar</h3>
                    <p className="text-gray-400 text-sm mb-4">Unique profile customization options</p>
                    <div className="text-2xl font-bold text-yellow-400 mb-4">2,500 AC</div>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      <Star className="w-4 h-4 mr-2" />
                      Purchase
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-yellow-500/20">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Mini Games</h3>
                    <p className="text-gray-400 text-sm mb-4">Fun games with AC rewards</p>
                    <div className="text-2xl font-bold text-yellow-400 mb-4">1,000 AC</div>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Unlock
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Viral Hub Tab */}
            <TabsContent value="viral" className="space-y-6">
              <Card className="bg-black/40 border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Influencer Partnerships
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Major influencers promoting ArtistCoin across all platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {influencers.map((influencer) => (
                    <div key={influencer.id} className="flex items-center justify-between p-4 bg-black/60 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-bold">{influencer.name}</h3>
                          <Badge variant="outline" className="text-blue-400 border-blue-500">
                            {influencer.platform}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{influencer.followers} followers</p>
                        <p className="text-gray-300 text-sm">{influencer.contribution}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold">
                          {influencer.reward.toLocaleString()} AC
                        </div>
                        <div className="text-gray-400 text-sm">Reward Pool</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Viral Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded border border-red-500/30">
                      <div className="font-bold text-white">#ArtistCoinChallenge</div>
                      <div className="text-sm text-gray-300">Show your earnings growth</div>
                      <div className="text-yellow-400 font-bold">10,000 AC Prize Pool</div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded border border-blue-500/30">
                      <div className="font-bold text-white">#CreatorSupport</div>
                      <div className="text-sm text-gray-300">Support your favorite artists</div>
                      <div className="text-yellow-400 font-bold">5,000 AC Prize Pool</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Community Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Platform Users</span>
                        <span className="text-white">847K / 1M</span>
                      </div>
                      <Progress value={84.7} className="h-2" />
                      <div className="text-center text-yellow-400 text-sm mt-1">
                        Reward: 100,000 AC for all users
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Total AC Earned</span>
                        <span className="text-white">23.4M / 50M</span>
                      </div>
                      <Progress value={46.8} className="h-2" />
                      <div className="text-center text-yellow-400 text-sm mt-1">
                        Unlock: New power-ups and features
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Panel */}
        <div className="w-80 p-6 bg-black/60 border-l border-yellow-500/20 space-y-6">
          {/* Wallet Summary */}
          <Card className="bg-black/40 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Wallet Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Balance</span>
                <span className="text-yellow-400 font-bold">{cryptoBalance.balance.toLocaleString()} AC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Earned</span>
                <span className="text-green-400 font-bold">{totalEarned.toLocaleString()} AC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Today's Earnings</span>
                <span className="text-blue-400 font-bold">+2,847 AC</span>
              </div>
              <Separator className="bg-yellow-500/20" />
              <div className="flex justify-between">
                <span className="text-gray-400">USD Value</span>
                <span className="text-white font-bold">${(balance * 0.12).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-black/40 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Top Earners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-yellow-500 text-black' :
                      i === 1 ? 'bg-gray-400 text-black' :
                      i === 2 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-white'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="text-white">User{i + 1}</span>
                  </div>
                  <span className="text-yellow-400">{(50000 - i * 5000).toLocaleString()} AC</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-black/40 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Quick Earn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Watch Video (+10 AC)
              </Button>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Like Content (+5 AC)
              </Button>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Post (+15 AC)
              </Button>
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Comment (+8 AC)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}