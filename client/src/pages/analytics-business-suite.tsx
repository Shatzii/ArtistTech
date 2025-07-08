import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, TrendingUp, Users, Globe, Heart, MessageCircle, Share2, Vote, Target, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AnalyticsBusinessSuite() {
  const [activeTab, setActiveTab] = useState("global");
  const [selectedRegion, setSelectedRegion] = useState("Global");
  const [selectedMetric, setSelectedMetric] = useState("engagement");
  const [votingActive, setVotingActive] = useState(false);

  const { data: globalAnalytics } = useQuery({
    queryKey: ["/api/analytics/global"],
    enabled: true
  });

  const { data: fanMetrics } = useQuery({
    queryKey: ["/api/analytics/fan-engagement"],
    enabled: true
  });

  const globalMetrics = [
    { name: "Total Reach", value: "24.8M", change: "+15.2%", trend: "up", color: "text-blue-400" },
    { name: "Global Engagement", value: "18.4%", change: "+2.8%", trend: "up", color: "text-green-400" },
    { name: "Revenue Growth", value: "$89.2K", change: "+34.1%", trend: "up", color: "text-yellow-400" },
    { name: "Market Share", value: "12.6%", change: "+0.9%", trend: "up", color: "text-purple-400" },
    { name: "Fan Satisfaction", value: "94.3%", change: "+1.2%", trend: "up", color: "text-pink-400" },
    { name: "Brand Recognition", value: "87.1%", change: "+5.3%", trend: "up", color: "text-indigo-400" }
  ];

  const regionalData = [
    { region: "North America", users: "8.4M", engagement: "22.1%", revenue: "$34.2K", growth: "+18%" },
    { region: "Europe", users: "6.2M", engagement: "19.8%", revenue: "$28.7K", growth: "+12%" },
    { region: "Asia Pacific", users: "7.8M", engagement: "16.4%", revenue: "$18.9K", growth: "+25%" },
    { region: "Latin America", users: "1.9M", engagement: "24.6%", revenue: "$5.8K", growth: "+31%" },
    { region: "Middle East", users: "0.9M", engagement: "21.3%", revenue: "$3.2K", growth: "+22%" },
    { region: "Africa", users: "0.6M", engagement: "26.8%", revenue: "$1.4K", growth: "+45%" }
  ];

  const fanEngagementData = [
    { 
      segment: "Super Fans", 
      count: "12.3K", 
      engagement: "89.4%", 
      avgSpend: "$127", 
      retention: "94.2%",
      activities: ["Daily streams", "Merchandise", "Live events", "Premium content"]
    },
    { 
      segment: "Regular Fans", 
      count: "84.7K", 
      engagement: "67.2%", 
      avgSpend: "$38", 
      retention: "78.5%",
      activities: ["Weekly streams", "Social sharing", "Occasional merch", "Free content"]
    },
    { 
      segment: "Casual Listeners", 
      count: "234.5K", 
      engagement: "23.8%", 
      avgSpend: "$12", 
      retention: "45.3%",
      activities: ["Monthly streams", "Basic interaction", "Free content only"]
    },
    { 
      segment: "New Discoverers", 
      count: "67.9K", 
      engagement: "34.6%", 
      avgSpend: "$8", 
      retention: "28.7%",
      activities: ["First-time listeners", "Social discovery", "Exploring content"]
    }
  ];

  const votingPolls = [
    {
      id: 1,
      question: "Which genre should I explore next?",
      options: [
        { text: "Lo-Fi Hip-Hop", votes: 2847, percentage: 34.2 },
        { text: "Future Bass", votes: 2156, percentage: 25.9 },
        { text: "Synthwave", votes: 1923, percentage: 23.1 },
        { text: "Ambient", votes: 1398, percentage: 16.8 }
      ],
      totalVotes: 8324,
      timeLeft: "2 days",
      status: "active"
    },
    {
      id: 2,
      question: "Best time for live streaming?",
      options: [
        { text: "7 PM EST", votes: 1567, percentage: 28.4 },
        { text: "9 PM EST", votes: 2234, percentage: 40.5 },
        { text: "11 PM EST", votes: 1034, percentage: 18.7 },
        { text: "Weekend Afternoon", votes: 681, percentage: 12.4 }
      ],
      totalVotes: 5516,
      timeLeft: "5 days",
      status: "active"
    },
    {
      id: 3,
      question: "Favorite collaboration style?",
      options: [
        { text: "Remix Exchange", votes: 3456, percentage: 42.1 },
        { text: "Joint Original", votes: 2789, percentage: 34.0 },
        { text: "Producer Battle", votes: 1234, percentage: 15.0 },
        { text: "Live Session", votes: 734, percentage: 8.9 }
      ],
      totalVotes: 8213,
      timeLeft: "Completed",
      status: "completed"
    }
  ];

  const competitorAnalysis = [
    { name: "Spotify", metric: "Monthly Listeners", value: "456M", ourPosition: "Growing", gap: "-423M" },
    { name: "SoundCloud", metric: "Track Uploads", value: "12M/day", ourPosition: "Competitive", gap: "-8M" },
    { name: "Bandcamp", metric: "Artist Revenue", value: "$178M", ourPosition: "Outperforming", gap: "+$23M" },
    { name: "TikTok", metric: "Music Discovery", value: "89%", ourPosition: "Leading", gap: "+12%" },
    { name: "YouTube Music", metric: "Video Engagement", value: "34%", ourPosition: "Competitive", gap: "-3%" }
  ];

  const businessInsights = [
    {
      category: "Revenue Optimization",
      insight: "Premium subscriptions show 67% higher engagement during evening hours",
      action: "Schedule premium content releases between 7-9 PM",
      impact: "High",
      priority: "Immediate"
    },
    {
      category: "Audience Growth",
      insight: "TikTok collaborations generate 3x more cross-platform followers",
      action: "Increase TikTok collaboration frequency to weekly",
      impact: "High",
      priority: "This Week"
    },
    {
      category: "Content Strategy",
      insight: "Behind-the-scenes content has 45% higher retention rates",
      action: "Create weekly studio session content",
      impact: "Medium",
      priority: "This Month"
    },
    {
      category: "Fan Engagement",
      insight: "Interactive polls boost fan participation by 78%",
      action: "Implement weekly fan voting on track selection",
      impact: "Medium",
      priority: "This Month"
    }
  ];

  const achievements = [
    { title: "Viral Hit", description: "Track reached 1M plays in 24 hours", date: "2 days ago", type: "milestone" },
    { title: "Fan Milestone", description: "Reached 100K followers", date: "1 week ago", type: "growth" },
    { title: "Revenue Goal", description: "Monthly revenue exceeded $50K", date: "2 weeks ago", type: "financial" },
    { title: "Collaboration Success", description: "Joint track with @ProducerX went viral", date: "1 month ago", type: "partnership" },
    { title: "Platform Leader", description: "Top 10 in Electronic genre", date: "1 month ago", type: "ranking" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data updates
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartVoting = () => {
    setVotingActive(true);
  };

  const handleVote = (pollId: number, optionIndex: number) => {
    console.log(`Vote cast for poll ${pollId}, option ${optionIndex}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Analytics & Business Suite
          </h1>
          <p className="text-purple-200 text-lg max-w-3xl mx-auto">
            Comprehensive business intelligence, global analytics, fan engagement metrics, and interactive voting platform
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {globalMetrics.map((metric, idx) => (
            <Card key={idx} className="bg-white/10 border-purple-400/30">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-300">{metric.name}</div>
                <div className={`text-xl font-bold ${metric.color}`}>{metric.value}</div>
                <div className="text-xs text-green-400">{metric.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="global" className="text-white">Global Dashboard</TabsTrigger>
            <TabsTrigger value="fans" className="text-white">Fan Engagement</TabsTrigger>
            <TabsTrigger value="voting" className="text-white">Interactive Voting</TabsTrigger>
          </TabsList>

          {/* Global Dashboard Tab */}
          <TabsContent value="global" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Regional Performance</CardTitle>
                  <CardDescription className="text-gray-300">
                    Global reach and engagement by region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regionalData.map((region, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-white font-medium">{region.region}</div>
                            <div className="text-sm text-gray-300">{region.users} users</div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-medium">{region.revenue}</div>
                            <div className="text-xs text-green-400">{region.growth}</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Engagement</span>
                          <span className="text-white">{region.engagement}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Competitor Analysis</CardTitle>
                  <CardDescription className="text-gray-300">
                    Market positioning and competitive insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {competitorAnalysis.map((competitor, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <div className="text-white font-medium">{competitor.name}</div>
                            <div className="text-xs text-gray-400">{competitor.metric}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white text-sm">{competitor.value}</div>
                            <div className="text-xs text-gray-400">{competitor.gap}</div>
                          </div>
                        </div>
                        <Badge className={
                          competitor.ourPosition === 'Leading' ? 'bg-green-600' :
                          competitor.ourPosition === 'Outperforming' ? 'bg-blue-600' :
                          competitor.ourPosition === 'Competitive' ? 'bg-yellow-600' : 'bg-red-600'
                        }>
                          {competitor.ourPosition}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Business Insights & Recommendations</CardTitle>
                <CardDescription className="text-gray-300">
                  AI-powered business intelligence and actionable insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businessInsights.map((insight, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white font-medium">{insight.category}</div>
                          <div className="text-sm text-gray-300 mt-1">{insight.insight}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={
                            insight.impact === 'High' ? 'bg-red-600' :
                            insight.impact === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                          }>
                            {insight.impact}
                          </Badge>
                          <div className="text-xs text-gray-400">{insight.priority}</div>
                        </div>
                      </div>
                      <div className="text-sm text-blue-400 mt-2">
                        💡 {insight.action}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fan Engagement Tab */}
          <TabsContent value="fans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-pink-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Fan Segmentation</CardTitle>
                  <CardDescription className="text-gray-300">
                    Detailed fan behavior and engagement analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fanEngagementData.map((segment, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-white font-medium">{segment.segment}</div>
                            <div className="text-sm text-gray-300">{segment.count} fans</div>
                          </div>
                          <div className="text-right">
                            <div className="text-pink-400 font-medium">{segment.avgSpend}</div>
                            <div className="text-xs text-gray-400">avg spend</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                          <div>
                            <span className="text-gray-300">Engagement: </span>
                            <span className="text-white">{segment.engagement}</span>
                          </div>
                          <div>
                            <span className="text-gray-300">Retention: </span>
                            <span className="text-white">{segment.retention}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {segment.activities.map((activity, actIdx) => (
                            <Badge key={actIdx} variant="outline" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Recent Achievements</CardTitle>
                  <CardDescription className="text-gray-300">
                    Milestones and success metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Award className="h-5 w-5 text-yellow-400 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-white font-medium">{achievement.title}</div>
                            <div className="text-sm text-gray-300">{achievement.description}</div>
                            <div className="text-xs text-gray-400 mt-1">{achievement.date}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {achievement.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interactive Voting Tab */}
          <TabsContent value="voting" className="space-y-6">
            <Card className="bg-white/10 border-indigo-400/30">
              <CardHeader>
                <CardTitle className="text-white">Fan Voting Dashboard</CardTitle>
                <CardDescription className="text-gray-300">
                  Interactive polls and fan decision making
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {votingPolls.map((poll, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-white font-medium">{poll.question}</div>
                          <div className="text-sm text-gray-300">{poll.totalVotes.toLocaleString()} total votes</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={poll.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                            {poll.status}
                          </Badge>
                          <span className="text-xs text-gray-400">{poll.timeLeft}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {poll.options.map((option, optIdx) => (
                          <div key={optIdx} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-white text-sm">{option.text}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-300 text-xs">{option.votes.toLocaleString()}</span>
                                <span className="text-indigo-400 text-sm font-medium">{option.percentage}%</span>
                                {poll.status === 'active' && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleVote(poll.id, optIdx)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-xs px-2"
                                  >
                                    Vote
                                  </Button>
                                )}
                              </div>
                            </div>
                            <Progress value={option.percentage} className="h-2" />
                          </div>
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