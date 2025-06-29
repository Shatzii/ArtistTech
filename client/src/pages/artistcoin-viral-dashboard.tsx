import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Trophy, Zap, Users, TrendingUp, Gift, Target, Star, Crown, Flame } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function ArtistCoinViralDashboard() {
  const [currentBalance, setCurrentBalance] = useState(3247);
  const [isEarning, setIsEarning] = useState(true);
  const queryClient = useQueryClient();

  // Fetch viral challenges
  const { data: challengesData } = useQuery({
    queryKey: ['/api/artistcoin/viral-challenges']
  });

  // Fetch gamification data
  const { data: gamificationData } = useQuery({
    queryKey: ['/api/artistcoin/gamification']
  });

  // Fetch social features
  const { data: socialData } = useQuery({
    queryKey: ['/api/artistcoin/social-features']
  });

  // Fetch influencer campaigns
  const { data: campaignsData } = useQuery({
    queryKey: ['/api/artistcoin/influencer-campaigns']
  });

  // Fetch ArtistCoin stats
  const { data: statsData } = useQuery({
    queryKey: ['/api/artistcoin/stats']
  });

  // Join challenge mutation
  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      return apiRequest('POST', '/api/artistcoin/join-challenge', { 
        challengeId, 
        userId: 'demo-user' 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artistcoin/viral-challenges'] });
    }
  });

  // Use power-up mutation
  const usePowerUpMutation = useMutation({
    mutationFn: async (powerUpId: string) => {
      return apiRequest('POST', '/api/artistcoin/use-powerup', { 
        powerUpId, 
        userId: 'demo-user' 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artistcoin/gamification'] });
    }
  });

  // Real-time earning counter
  useEffect(() => {
    if (isEarning) {
      const interval = setInterval(() => {
        setCurrentBalance(prev => prev + Math.floor(Math.random() * 3) + 1);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isEarning]);

  const challenges = challengesData?.challenges || [];
  const gamification = gamificationData?.gamificationData || {};
  const social = socialData?.socialFeatures || {};
  const campaigns = campaignsData?.campaigns || [];
  const stats = statsData?.stats || {};

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500'
    };
    return colors[rarity] || 'bg-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-500',
      medium: 'bg-yellow-500',
      hard: 'bg-red-500',
      legendary: 'bg-purple-500'
    };
    return colors[difficulty] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ArtistCoin Viral Dashboard
          </h1>
          <p className="text-xl text-blue-200 mb-6">
            The World's First Cryptocurrency That Pays You to Watch & Create!
          </p>
          
          {/* Live Balance Counter */}
          <div className="bg-black/20 rounded-lg p-6 mb-6 border border-yellow-500/20">
            <div className="flex items-center justify-center gap-4">
              <Coins className="h-8 w-8 text-yellow-400 animate-spin" />
              <div>
                <p className="text-sm text-gray-300">Your ArtistCoin Balance</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {currentBalance.toLocaleString()} AC
                </p>
              </div>
              <div className="h-12 w-1 bg-yellow-400 animate-pulse" />
              <div>
                <p className="text-sm text-green-300">Live Earnings</p>
                <p className="text-lg font-semibold text-green-400">
                  +{Math.floor(Math.random() * 5) + 1} AC/min
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">
                {isEarning ? 'Earning Active' : 'Earning Paused'} 
                <Zap className="h-3 w-3 ml-1" />
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-black/20">
            <TabsTrigger value="challenges" className="data-[state=active]:bg-purple-600">
              <Flame className="h-4 w-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600">
              <Crown className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="powerups" className="data-[state=active]:bg-purple-600">
              <Zap className="h-4 w-4 mr-2" />
              Power-Ups
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-purple-600">
              <Users className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
          </TabsList>

          {/* Viral Challenges */}
          <TabsContent value="challenges">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="bg-black/20 border-purple-500/20 text-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-yellow-400">{challenge.title}</CardTitle>
                      {challenge.trending && (
                        <Badge className="bg-red-500/20 text-red-300 border border-red-500/30">
                          <Flame className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-gray-300">
                      {challenge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-bold">
                          {challenge.reward} AC Reward
                        </span>
                        <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white`}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Participants</span>
                          <span className="text-blue-300">{challenge.participantCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Time Remaining</span>
                          <span className="text-orange-300">{challenge.timeRemaining}h</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Requirements:</p>
                        <ul className="text-xs space-y-1">
                          {challenge.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        onClick={() => joinChallengeMutation.mutate(challenge.id)}
                        disabled={joinChallengeMutation.isPending}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {joinChallengeMutation.isPending ? 'Joining...' : 'Join Challenge'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gamification.achievements?.map((achievement) => (
                <Card key={achievement.id} className="bg-black/20 border-purple-500/20 text-white">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className="text-yellow-400">{achievement.title}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {achievement.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-bold">
                          {achievement.reward} AC
                        </span>
                        <Badge className={`${getRarityColor(achievement.rarity)} text-white`}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Unlocked by</span>
                          <span className="text-blue-300">{achievement.unlockedBy}% of users</span>
                        </div>
                        <Progress 
                          value={100 - achievement.unlockedBy} 
                          className="h-2"
                        />
                      </div>

                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                        <Star className="h-4 w-4 mr-2" />
                        Unlock Achievement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard">
            <Card className="bg-black/20 border-purple-500/20 text-white">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Top ArtistCoin Earners - Weekly
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Compete for massive weekly rewards and exclusive badges!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gamification.leaderboards?.[0]?.topUsers?.map((user, index) => (
                    <div key={user.rank} className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-500 text-black' :
                          'bg-purple-600 text-white'
                        }`}>
                          {user.rank}
                        </div>
                        <div className="text-2xl">{user.avatar}</div>
                        <div>
                          <p className="font-semibold">{user.username}</p>
                          <p className="text-sm text-gray-400">
                            {user.change > 0 ? '↗' : user.change < 0 ? '↘' : '→'} 
                            {Math.abs(user.change)} positions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-yellow-400">
                          {user.score.toLocaleString()} AC
                        </p>
                        <p className="text-sm text-green-400">
                          +{Math.floor(Math.random() * 500) + 100} today
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-900/30 rounded-lg">
                  <h3 className="font-semibold text-green-400 mb-3">Weekly Rewards</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-300">1st Place</p>
                      <p className="text-xl font-bold text-yellow-400">5,000 AC</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">2nd-5th</p>
                      <p className="text-xl font-bold text-gray-400">2,000 AC</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">6th-20th</p>
                      <p className="text-xl font-bold text-orange-400">500 AC</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Power-Ups */}
          <TabsContent value="powerups">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gamification.powerUps?.map((powerUp) => (
                <Card key={powerUp.id} className="bg-black/20 border-purple-500/20 text-white">
                  <CardHeader>
                    <CardTitle className="text-yellow-400 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      {powerUp.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {powerUp.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 font-bold">
                          Cost: {powerUp.cost} AC
                        </span>
                        <Badge className={`${getRarityColor(powerUp.rarity)} text-white`}>
                          {powerUp.rarity}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Duration</span>
                          <span className="text-blue-300">{powerUp.duration} minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Effect</span>
                          <span className="text-green-300">
                            {powerUp.effect.value}x {powerUp.effect.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => usePowerUpMutation.mutate(powerUp.id)}
                        disabled={usePowerUpMutation.isPending || currentBalance < powerUp.cost}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {usePowerUpMutation.isPending ? 'Activating...' : `Use Power-Up (${powerUp.cost} AC)`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Social Features */}
          <TabsContent value="social">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Referral Program */}
              <Card className="bg-black/20 border-purple-500/20 text-white">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Referral Program
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Earn ArtistCoins by inviting friends!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-green-900/30 p-3 rounded-lg">
                        <p className="text-sm text-gray-300">Your Referrals</p>
                        <p className="text-2xl font-bold text-green-400">{social.referralProgram?.yourReferrals || 0}</p>
                      </div>
                      <div className="bg-yellow-900/30 p-3 rounded-lg">
                        <p className="text-sm text-gray-300">Total Earned</p>
                        <p className="text-2xl font-bold text-yellow-400">{social.referralProgram?.totalEarned || 0} AC</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-400">Tier Rewards</h4>
                      {social.referralProgram?.tieredRewards?.map((tier, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-purple-900/30 rounded">
                          <span className="text-sm">{tier.title}</span>
                          <span className="text-sm font-bold text-yellow-400">
                            {tier.referrals} refs = {tier.bonus} AC
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Gift className="h-4 w-4 mr-2" />
                      Share Referral Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Community Goals */}
              <Card className="bg-black/20 border-purple-500/20 text-white">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Community Goals
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Work together to unlock massive rewards!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {social.communityGoals?.map((goal) => (
                      <div key={goal.id} className="p-4 bg-purple-900/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{goal.title}</h4>
                          <span className="text-sm text-gray-400">
                            {goal.participants?.toLocaleString()} participants
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{goal.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="text-blue-300">
                              {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                            </span>
                          </div>
                          <Progress 
                            value={(goal.current / goal.target) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-sm">
                            <span className="text-green-400">Reward: {goal.reward.toLocaleString()} AC</span>
                            <span className="text-orange-400">
                              {Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trending Hashtags */}
            <Card className="bg-black/20 border-purple-500/20 text-white mt-6">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Trending Hashtags
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Use these hashtags to earn bonus ArtistCoins!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {social.trendingHashtags?.map((hashtag, index) => (
                    <div key={index} className="text-center p-3 bg-purple-900/30 rounded-lg">
                      <p className="font-bold text-blue-400">{hashtag.tag}</p>
                      <p className="text-sm text-gray-300">{hashtag.posts.toLocaleString()} posts</p>
                      <p className="text-sm font-bold text-green-400">+{hashtag.reward} AC</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Influencer Campaigns */}
          <TabsContent value="campaigns">
            <div className="grid gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-black/20 border-purple-500/20 text-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{campaign.influencer.avatar}</div>
                        <div>
                          <CardTitle className="text-yellow-400">{campaign.campaign.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            By {campaign.influencer.name} on {campaign.influencer.platform}
                          </CardDescription>
                        </div>
                      </div>
                      {campaign.influencer.verified && (
                        <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 font-bold text-xl">
                            {campaign.campaign.reward.toLocaleString()} AC Reward
                          </span>
                          <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            {campaign.campaign.duration} days
                          </Badge>
                        </div>
                        
                        <div>
                          <p className="font-semibold mb-2">Campaign Requirements:</p>
                          <ul className="space-y-1">
                            {campaign.campaign.requirements.map((req, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-blue-300">
                            {campaign.influencer.followers.toLocaleString()} followers
                          </span>
                          <Badge className={`${campaign.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                            {campaign.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-purple-400">Live Campaign Stats</h4>
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div className="bg-purple-900/30 p-3 rounded">
                            <p className="text-sm text-gray-300">Views</p>
                            <p className="font-bold text-blue-400">{campaign.engagement.views.toLocaleString()}</p>
                          </div>
                          <div className="bg-purple-900/30 p-3 rounded">
                            <p className="text-sm text-gray-300">Likes</p>
                            <p className="font-bold text-red-400">{campaign.engagement.likes.toLocaleString()}</p>
                          </div>
                          <div className="bg-purple-900/30 p-3 rounded">
                            <p className="text-sm text-gray-300">Shares</p>
                            <p className="font-bold text-green-400">{campaign.engagement.shares.toLocaleString()}</p>
                          </div>
                          <div className="bg-purple-900/30 p-3 rounded">
                            <p className="text-sm text-gray-300">Comments</p>
                            <p className="font-bold text-yellow-400">{campaign.engagement.comments.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Platform Stats */}
        <Card className="bg-black/20 border-purple-500/20 text-white mt-8">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-center">
              ArtistCoin vs Traditional Platforms
            </CardTitle>
            <CardDescription className="text-gray-300 text-center">
              See why we're revolutionizing the creator economy!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="bg-green-900/30 p-4 rounded-lg">
                <p className="text-sm text-gray-300">Total Users</p>
                <p className="text-2xl font-bold text-green-400">{stats.totalUsers?.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-900/30 p-4 rounded-lg">
                <p className="text-sm text-gray-300">Total Coins Earned</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.totalCoinsEarned?.toLocaleString()}</p>
              </div>
              <div className="bg-purple-900/30 p-4 rounded-lg">
                <p className="text-sm text-gray-300">Daily Growth</p>
                <p className="text-2xl font-bold text-purple-400">{stats.dailyGrowth}%</p>
              </div>
              <div className="bg-blue-900/30 p-4 rounded-lg">
                <p className="text-sm text-gray-300">Market Cap</p>
                <p className="text-2xl font-bold text-blue-400">${stats.marketCap?.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-900/30 to-yellow-900/30 rounded-lg">
              <p className="text-center text-lg font-bold text-yellow-400 mb-2">
                🚀 Why ArtistCoin is the Future
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="font-semibold text-green-400">Users Get Paid</p>
                  <p>First platform to reward viewers</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-400">10x Higher Payouts</p>
                  <p>$50+ per 1K vs Spotify's $3</p>
                </div>
                <div>
                  <p className="font-semibold text-purple-400">Instant Earnings</p>
                  <p>Real-time cryptocurrency rewards</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}