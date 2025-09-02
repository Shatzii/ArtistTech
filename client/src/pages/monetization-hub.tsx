import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, Users, Zap, Star, Trophy, Target, Gift } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function MonetizationHub() {
  const [activeTab, setActiveTab] = useState("artistcoin");
  const [artistCoins, setArtistCoins] = useState(12847);
  const [totalEarnings, setTotalEarnings] = useState(3456.78);
  const [fanCount, setFanCount] = useState(24589);

  const { data: revenueStats } = useQuery({
    queryKey: ["monetization-revenue"],
    queryFn: () => apiRequest("/api/monetization/revenue-stats"),
    enabled: true
  });

  const { data: fanEngagement } = useQuery({
    queryKey: ["monetization-fan-engagement"],
    queryFn: () => apiRequest("/api/monetization/fan-engagement"),
    enabled: true
  });

  const revenueStreams = [
    { name: "Streaming Royalties", amount: "$1,234.56", change: "+12%", color: "bg-green-600" },
    { name: "Producer Marketplace", amount: "$2,847.23", change: "+34%", color: "bg-blue-600" },
    { name: "NFT Collections", amount: "$5,692.11", change: "+78%", color: "bg-purple-600" },
    { name: "Fan Subscriptions", amount: "$1,456.89", change: "+23%", color: "bg-pink-600" },
    { name: "Live Performances", amount: "$3,789.45", change: "+45%", color: "bg-yellow-600" },
    { name: "ArtistCoin Rewards", amount: "$892.34", change: "+89%", color: "bg-indigo-600" }
  ];

  const artistCoinActivities = [
    { action: "Fan listened to 'Summer Vibes'", coins: 5, time: "2 min ago", type: "streaming" },
    { action: "Fan shared your TikTok video", coins: 12, time: "5 min ago", type: "social" },
    { action: "Producer bought your beat", coins: 150, time: "1 hour ago", type: "marketplace" },
    { action: "Fan joined your live stream", coins: 8, time: "3 hours ago", type: "live" },
    { action: "Fan purchased NFT", coins: 200, time: "6 hours ago", type: "nft" }
  ];

  const producerJobs = [
    { title: "Hip-Hop Beat for Indie Artist", budget: "$500-800", bids: 12, deadline: "3 days", type: "Beat Production" },
    { title: "Podcast Intro Music", budget: "$200-400", bids: 8, deadline: "1 week", type: "Audio Branding" },
    { title: "Commercial Jingle", budget: "$1,000-2,000", bids: 24, deadline: "2 weeks", type: "Commercial" },
    { title: "Film Score Excerpt", budget: "$800-1,200", bids: 6, deadline: "1 month", type: "Film Music" }
  ];

  const nftCollections = [
    { name: "Exclusive Beats Collection", items: 12, totalValue: "$2,400", sold: 8, status: "active" },
    { name: "Album Art Series", items: 5, totalValue: "$1,200", sold: 3, status: "active" },
    { name: "Behind the Scenes", items: 20, totalValue: "$800", sold: 15, status: "trending" },
    { name: "Limited Edition Remixes", items: 8, totalValue: "$1,600", sold: 6, status: "sold out" }
  ];

  const fanTiers = [
    { name: "Casual Listener", fans: 18234, price: "Free", perks: ["Stream access", "Basic community"] },
    { name: "True Fan", fans: 4567, price: "$5/month", perks: ["Early access", "Exclusive content", "Monthly live stream"] },
    { name: "VIP Supporter", fans: 1234, price: "$15/month", perks: ["Everything above", "Direct messages", "Custom requests"] },
    { name: "Elite Circle", fans: 189, price: "$50/month", perks: ["Everything above", "1-on-1 sessions", "Collaboration opportunities"] }
  ];

  const challenges = [
    { title: "Stream Challenge", target: 10000, current: 7834, reward: 500, timeLeft: "2 days" },
    { title: "Social Share Goal", target: 1000, current: 743, reward: 200, timeLeft: "1 week" },
    { title: "New Followers", target: 5000, current: 3456, reward: 1000, timeLeft: "2 weeks" },
    { title: "Producer Sales", target: 50, current: 32, reward: 2000, timeLeft: "1 month" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setArtistCoins(prev => prev + Math.floor(Math.random() * 10));
      setTotalEarnings(prev => prev + Math.random() * 5);
      setFanCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Monetization Hub
          </h1>
          <p className="text-emerald-200 text-lg max-w-3xl mx-auto">
            Complete revenue management ecosystem - ArtistCoins, producer marketplace, NFT collections, and fan engagement
          </p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-400/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400">{artistCoins.toLocaleString()}</div>
              <div className="text-sm text-yellow-200">ArtistCoins Balance</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-400/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400">${totalEarnings.toLocaleString()}</div>
              <div className="text-sm text-green-200">Total Earnings</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">{fanCount.toLocaleString()}</div>
              <div className="text-sm text-blue-200">Total Fans</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger value="artistcoin" className="text-white">ArtistCoin</TabsTrigger>
            <TabsTrigger value="producer" className="text-white">Producer Hub</TabsTrigger>
            <TabsTrigger value="nft" className="text-white">NFT Collections</TabsTrigger>
            <TabsTrigger value="fans" className="text-white">Fan Engagement</TabsTrigger>
          </TabsList>

          {/* ArtistCoin Tab */}
          <TabsContent value="artistcoin" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Streams</CardTitle>
                  <CardDescription className="text-gray-300">
                    All your income sources in one place
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueStreams.map((stream, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${stream.color}`} />
                          <span className="text-white">{stream.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{stream.amount}</div>
                          <div className="text-xs text-green-400">{stream.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Recent ArtistCoin Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {artistCoinActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <div className="flex-1">
                          <div className="text-sm text-white">{activity.action}</div>
                          <div className="text-xs text-gray-400">{activity.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-medium">+{activity.coins}</div>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Active Challenges</CardTitle>
                <CardDescription className="text-gray-300">
                  Complete challenges to earn bonus ArtistCoins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {challenges.map((challenge, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white font-medium">{challenge.title}</div>
                          <div className="text-sm text-gray-300">{challenge.timeLeft} left</div>
                        </div>
                        <div className="text-yellow-400 font-bold">+{challenge.reward}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Progress</span>
                          <span className="text-white">{challenge.current}/{challenge.target}</span>
                        </div>
                        <Progress value={(challenge.current / challenge.target) * 100} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Producer Hub Tab */}
          <TabsContent value="producer" className="space-y-6">
            <Card className="bg-white/10 border-blue-400/30">
              <CardHeader>
                <CardTitle className="text-white">Available Producer Jobs</CardTitle>
                <CardDescription className="text-gray-300">
                  Find and bid on music production opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {producerJobs.map((job, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <div className="text-white font-medium">{job.title}</div>
                        <div className="text-sm text-gray-300">{job.type} • {job.deadline}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-green-400 font-medium">{job.budget}</div>
                          <div className="text-xs text-gray-400">{job.bids} bids</div>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Bid Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFT Collections Tab */}
          <TabsContent value="nft" className="space-y-6">
            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Your NFT Collections</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage and track your digital collectibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nftCollections.map((collection, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-white font-medium">{collection.name}</div>
                          <div className="text-sm text-gray-300">{collection.items} items</div>
                        </div>
                        <Badge className={
                          collection.status === 'active' ? 'bg-green-600' :
                          collection.status === 'trending' ? 'bg-orange-600' : 'bg-red-600'
                        }>
                          {collection.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-purple-400 font-medium">{collection.totalValue}</div>
                          <div className="text-xs text-gray-400">{collection.sold} sold</div>
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fan Engagement Tab */}
          <TabsContent value="fans" className="space-y-6">
            <Card className="bg-white/10 border-pink-400/30">
              <CardHeader>
                <CardTitle className="text-white">Fan Subscription Tiers</CardTitle>
                <CardDescription className="text-gray-300">
                  Monetize your fan base with subscription tiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fanTiers.map((tier, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-white font-medium">{tier.name}</div>
                          <div className="text-sm text-gray-300">{tier.fans.toLocaleString()} fans</div>
                        </div>
                        <div className="text-pink-400 font-bold">{tier.price}</div>
                      </div>
                      <div className="space-y-1">
                        {tier.perks.map((perk, perkIdx) => (
                          <div key={perkIdx} className="text-xs text-gray-400">• {perk}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}