import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, DollarSign, Target, Calendar, Music, Video, Share2, Brain, BarChart3, Briefcase, Zap, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function CareerManagement() {
  const [activeAgent, setActiveAgent] = useState("marketing");
  const [selectedGoal, setSelectedGoal] = useState("growth");

  const { data: careerAnalytics, isLoading } = useQuery({
    queryKey: ["/api/career/analytics"],
    enabled: true
  });

  const { data: recommendations } = useQuery({
    queryKey: ["/api/career/recommendations"],
    enabled: true
  });

  const { data: revenueData } = useQuery({
    queryKey: ["/api/producer/revenue-streams"],
    enabled: true
  });

  const careerAgents = [
    {
      id: "marketing",
      name: "Marketing AI Agent",
      description: "Automated social media, content creation, and audience growth",
      features: ["TikTok viral optimization", "Instagram growth hacking", "YouTube SEO", "Cross-platform campaigns"],
      color: "from-blue-600 to-purple-600",
      status: "active"
    },
    {
      id: "revenue",
      name: "Revenue AI Agent", 
      description: "Multi-stream income optimization and financial planning",
      features: ["Streaming optimization", "Sync licensing", "Merchandise planning", "Tour revenue"],
      color: "from-green-600 to-blue-600",
      status: "active"
    },
    {
      id: "booking",
      name: "Booking AI Agent",
      description: "Automated venue booking and tour management",
      features: ["Venue matching", "Tour routing", "Contract negotiation", "Performance analytics"],
      color: "from-orange-600 to-red-600",
      status: "active"
    },
    {
      id: "legal",
      name: "Legal AI Agent",
      description: "Contract management and legal compliance",
      features: ["Contract review", "Rights management", "Compliance monitoring", "Risk assessment"],
      color: "from-purple-600 to-pink-600",
      status: "active"
    }
  ];

  const revenueStreams = [
    { name: "Streaming Platforms", current: 4520, potential: 8500, growth: 23.5 },
    { name: "Live Performances", current: 12800, potential: 25000, growth: 18.2 },
    { name: "Merchandise", current: 3200, potential: 7500, growth: 41.3 },
    { name: "Sync Licensing", current: 1800, potential: 5500, growth: 67.8 },
    { name: "NFTs & Digital", current: 2100, potential: 6200, growth: 54.1 }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Career Management Suite
          </h1>
          <p className="text-purple-200 text-lg max-w-3xl mx-auto">
            Complete career automation with 4 specialized AI agents managing marketing, revenue, booking, and legal operations
          </p>
        </div>

        {/* Career Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Total Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{careerAnalytics?.fanCount?.toLocaleString() || "156,840"}</div>
              <p className="text-purple-200 text-sm">+{careerAnalytics?.monthlyGrowth?.toFixed(1) || "24.5"}% this month</p>
              <Progress value={74} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-green-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${(careerAnalytics?.totalRevenue || 87420).toLocaleString()}</div>
              <p className="text-green-200 text-sm">+{careerAnalytics?.monthlyGrowth?.toFixed(1) || "24.5"}% growth</p>
              <Progress value={82} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-blue-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="h-5 w-5 text-blue-400" />
                Streaming Plays
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{(careerAnalytics?.streamingPlays || 2847592).toLocaleString()}</div>
              <p className="text-blue-200 text-sm">Across all platforms</p>
              <Progress value={67} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-orange-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-400" />
                Career Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{careerAnalytics?.careerScore || 92}/100</div>
              <p className="text-orange-200 text-sm">Industry ranking</p>
              <Progress value={careerAnalytics?.careerScore || 92} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger value="agents" className="text-white">AI Agents</TabsTrigger>
            <TabsTrigger value="revenue" className="text-white">Revenue Streams</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
            <TabsTrigger value="recommendations" className="text-white">AI Recommendations</TabsTrigger>
          </TabsList>

          {/* AI Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careerAgents.map((agent) => (
                <Card key={agent.id} className="bg-white/10 border-purple-400/30 hover:bg-white/15 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${agent.color} flex items-center justify-center`}>
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      {agent.name}
                      <Badge variant="outline" className="ml-auto text-green-400 border-green-400">
                        {agent.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {agent.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        {agent.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={() => setActiveAgent(agent.id)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Agent
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Revenue Streams Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="bg-white/10 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-white">Revenue Stream Analysis</CardTitle>
                <CardDescription className="text-gray-300">
                  Current performance vs potential across all income sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueStreams.map((stream, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{stream.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-300">${stream.current.toLocaleString()}</span>
                          <span className="text-sm text-green-400">+{stream.growth}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={(stream.current / stream.potential) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Current: ${stream.current.toLocaleString()}</span>
                          <span>Potential: ${stream.potential.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Platform Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {careerAnalytics?.platformData?.map((platform: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-white">{platform.platform}</span>
                        <div className="text-right">
                          <div className="text-sm text-white">{platform.plays.toLocaleString()} plays</div>
                          <div className="text-xs text-green-400">+{platform.growth}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Social Engagement</span>
                      <span className="text-purple-400">{careerAnalytics?.socialEngagement?.toFixed(1) || "89.2"}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Fan Retention</span>
                      <span className="text-green-400">94.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Viral Potential</span>
                      <span className="text-orange-400">87.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-4">
              {recommendations?.map((rec: any, idx: number) => (
                <Card key={idx} className="bg-white/10 border-purple-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      {rec.title}
                      <Badge variant="outline" className={`ml-auto ${rec.priority === 'High' ? 'text-red-400 border-red-400' : 'text-yellow-400 border-yellow-400'}`}>
                        {rec.priority}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {rec.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-300">Expected ROI: <span className="text-green-400">{rec.expectedROI}</span></div>
                        <div className="text-sm text-gray-300">Timeframe: <span className="text-blue-400">{rec.timeframe}</span></div>
                        <div className="text-sm text-gray-300">Confidence: <span className="text-purple-400">{rec.confidence}%</span></div>
                      </div>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Execute
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}