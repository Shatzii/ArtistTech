import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Brain, TrendingUp, DollarSign, Calendar, Users, 
  Star, Target, BarChart, MessageSquare, Briefcase,
  Zap, Crown, Award, Music, Mic, Video, Camera,
  Globe, Share2, Sparkles, Bot, Clock
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AICareerManager() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedGoal, setSelectedGoal] = useState("streaming");

  const { data: careerData } = useQuery({
    queryKey: ["/api/career/analytics"],
    enabled: true
  });

  const { data: recommendations } = useQuery({
    queryKey: ["/api/career/recommendations"],
    enabled: true
  });

  // AI Agents
  const aiAgents = [
    {
      id: "marketing",
      name: "Marketing AI",
      role: "Social Media & Promotion",
      status: "active",
      confidence: 94,
      icon: TrendingUp,
      color: "bg-blue-600",
      tasks: ["Content scheduling", "Hashtag optimization", "Influencer outreach"],
      lastAction: "Created 15 TikTok posts",
      nextAction: "Instagram story campaign"
    },
    {
      id: "revenue",
      name: "Revenue AI",
      role: "Monetization Strategy",
      status: "active",
      confidence: 89,
      icon: DollarSign,
      color: "bg-green-600",
      tasks: ["Stream optimization", "Sync licensing", "Merchandise planning"],
      lastAction: "Secured 3 playlist placements",
      nextAction: "Brand partnership outreach"
    },
    {
      id: "booking",
      name: "Booking AI",
      role: "Performance & Tours",
      status: "processing",
      confidence: 87,
      icon: Calendar,
      color: "bg-purple-600",
      tasks: ["Venue research", "Tour routing", "Contract negotiation"],
      lastAction: "Found 12 venue opportunities",
      nextAction: "Submitting booking requests"
    },
    {
      id: "legal",
      name: "Legal AI",
      role: "Contracts & Rights",
      status: "monitoring",
      confidence: 96,
      icon: Briefcase,
      color: "bg-red-600",
      tasks: ["Contract review", "Copyright protection", "Royalty tracking"],
      lastAction: "Reviewed 3 contracts",
      nextAction: "Filing copyright applications"
    }
  ];

  // Career Metrics
  const metrics = [
    { label: "Monthly Listeners", value: "47.2K", change: "+23%", trend: "up" },
    { label: "Revenue (30 days)", value: "$3,847", change: "+156%", trend: "up" },
    { label: "Social Followers", value: "12.8K", change: "+45%", trend: "up" },
    { label: "Playlist Placements", value: "23", change: "+8", trend: "up" },
    { label: "Live Shows Booked", value: "7", change: "+4", trend: "up" },
    { label: "Sync Opportunities", value: "12", change: "+12", trend: "up" }
  ];

  // Goals & Milestones
  const goals = [
    {
      id: "streaming",
      title: "Reach 100K Monthly Listeners",
      current: 47200,
      target: 100000,
      timeline: "6 months",
      strategies: ["Playlist pitching", "Social media growth", "Collaborations"],
      progress: 47
    },
    {
      id: "revenue",
      title: "Monthly Revenue $10K",
      current: 3847,
      target: 10000,
      timeline: "8 months",
      strategies: ["Live performances", "Sync licensing", "Merchandise"],
      progress: 38
    },
    {
      id: "social",
      title: "Social Media 50K Followers",
      current: 12800,
      target: 50000,
      timeline: "4 months",
      strategies: ["Content consistency", "Viral campaigns", "Collaborations"],
      progress: 26
    }
  ];

  // Recommendations
  const careerRecommendations = [
    {
      id: 1,
      type: "opportunity",
      priority: "high",
      title: "Submit to Spotify Editorial Playlists",
      description: "3 playlists accepting submissions with 500K+ followers",
      deadline: "2 days",
      effort: "low",
      impact: "high",
      agent: "marketing"
    },
    {
      id: 2,
      type: "collaboration",
      priority: "medium",
      title: "Collaborate with @ProducerXYZ",
      description: "Producer with 2M followers looking for vocalists",
      deadline: "1 week",
      effort: "medium",
      impact: "high",
      agent: "marketing"
    },
    {
      id: 3,
      type: "revenue",
      priority: "high",
      title: "License Track for TV Commercial",
      description: "Brand seeking upbeat track for $5K+ sync fee",
      deadline: "3 days",
      effort: "low",
      impact: "high",
      agent: "revenue"
    },
    {
      id: 4,
      type: "performance",
      priority: "medium",
      title: "Festival Performance Slot",
      description: "Summer festival has opening slot available",
      deadline: "1 week",
      effort: "high",
      impact: "high",
      agent: "booking"
    }
  ];

  // Revenue Streams
  const revenueStreams = [
    { name: "Streaming", amount: 1847, percentage: 48, trend: "+67%" },
    { name: "Live Shows", amount: 1200, percentage: 31, trend: "+234%" },
    { name: "Sync Licensing", amount: 500, percentage: 13, trend: "New!" },
    { name: "Merchandise", amount: 300, percentage: 8, trend: "+12%" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'monitoring': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">AI Career Manager</h1>
              <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
                4 AI AGENTS
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Strategy
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <BarChart className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="agents">AI Agents</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                {/* Key Metrics */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Career Metrics</CardTitle>
                    <CardDescription className="text-gray-400">
                      Real-time tracking of your music career growth
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {metrics.map((metric, index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">{metric.label}</span>
                            <Badge className={`${metric.trend === 'up' ? 'bg-green-600' : 'bg-red-600'}`}>
                              {metric.change}
                            </Badge>
                          </div>
                          <div className="text-2xl font-bold text-white">{metric.value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Breakdown */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue Streams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueStreams.map((stream, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white font-medium">{stream.name}</span>
                              <span className="text-white">${stream.amount}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress value={stream.percentage} className="flex-1" />
                              <Badge className="bg-green-600">{stream.trend}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agents" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiAgents.map((agent) => (
                    <Card key={agent.id} className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${agent.color} rounded-lg flex items-center justify-center`}>
                            <agent.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-white">{agent.name}</CardTitle>
                            <CardDescription className="text-gray-400">{agent.role}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                            <Badge className="bg-purple-600">{agent.confidence}%</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Current Tasks</h4>
                            <div className="space-y-1">
                              {agent.tasks.map((task, index) => (
                                <div key={index} className="text-sm text-gray-400">• {task}</div>
                              ))}
                            </div>
                          </div>
                          <div className="pt-3 border-t border-gray-600">
                            <div className="text-sm text-gray-400">
                              <span className="text-green-400">Last:</span> {agent.lastAction}
                            </div>
                            <div className="text-sm text-gray-400">
                              <span className="text-blue-400">Next:</span> {agent.nextAction}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="goals" className="space-y-6">
                <div className="space-y-6">
                  {goals.map((goal) => (
                    <Card key={goal.id} className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">{goal.title}</CardTitle>
                          <Badge className="bg-blue-600">{goal.timeline}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>{goal.current.toLocaleString()}</span>
                            <span>{goal.target.toLocaleString()}</span>
                          </div>
                          <Progress value={goal.progress} className="w-full" />
                          <div className="text-center text-sm text-white font-medium">
                            {goal.progress}% Complete
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Strategies</h4>
                            <div className="flex flex-wrap gap-2">
                              {goal.strategies.map((strategy, index) => (
                                <Badge key={index} className="bg-purple-600 text-white">
                                  {strategy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4">
                <div className="space-y-4">
                  {careerRecommendations.map((rec) => (
                    <Card key={rec.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getPriorityColor(rec.priority)}>
                                {rec.priority} priority
                              </Badge>
                              <Badge className="bg-gray-600 capitalize">{rec.type}</Badge>
                              <Badge className="bg-blue-600">{rec.deadline}</Badge>
                            </div>
                            <h3 className="text-white font-semibold mb-1">{rec.title}</h3>
                            <p className="text-gray-400 text-sm mb-3">{rec.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-400">
                              <span>Effort: {rec.effort}</span>
                              <span>Impact: {rec.impact}</span>
                              <span>Agent: {rec.agent}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Accept
                            </Button>
                            <Button size="sm" variant="outline">
                              Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Career Score</span>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-bold">847</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Growth Rate</span>
                  <span className="text-green-400 font-bold">+23%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Opportunities</span>
                  <span className="text-blue-400 font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Next Milestone</span>
                  <span className="text-purple-400 font-bold">6 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">AI Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { agent: "Marketing AI", action: "Posted to 3 platforms", time: "2 min ago", icon: TrendingUp },
                    { agent: "Revenue AI", action: "Found sync opportunity", time: "15 min ago", icon: DollarSign },
                    { agent: "Booking AI", action: "Sent venue inquiry", time: "1 hour ago", icon: Calendar },
                    { agent: "Legal AI", action: "Reviewed contract", time: "3 hours ago", icon: Briefcase }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-gray-700 rounded">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <activity.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{activity.agent}</div>
                        <div className="text-gray-400 text-xs">{activity.action}</div>
                      </div>
                      <div className="text-gray-500 text-xs">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Music className="w-4 h-4 mr-2" />
                  Upload New Track
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Target className="w-4 h-4 mr-2" />
                  Set New Goal
                </Button>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}