import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, DollarSign, Target, Calendar, Music, Video, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AICareerDashboard() {
  const [selectedGoal, setSelectedGoal] = useState("growth");

  const { data: careerAnalytics, isLoading } = useQuery({
    queryKey: ["/api/career/analytics"],
    enabled: true
  });

  const { data: recommendations } = useQuery({
    queryKey: ["/api/career/recommendations"],
    enabled: true
  });

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
            AI Career Acceleration Dashboard
          </h1>
          <p className="text-purple-200 text-lg max-w-3xl mx-auto">
            Intelligent career guidance powered by industry data and predictive analytics
          </p>
        </div>

        {/* Career Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Audience Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+24.3%</div>
              <p className="text-purple-200 text-sm">vs last month</p>
              <Progress value={74} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                Revenue Streams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8/12</div>
              <p className="text-purple-200 text-sm">active streams</p>
              <Progress value={67} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                Career Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">87/100</div>
              <p className="text-purple-200 text-sm">industry ranking</p>
              <Progress value={87} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">71%</div>
              <p className="text-purple-200 text-sm">Q4 targets</p>
              <Progress value={71} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Recommendations */}
              <Card className="bg-white/10 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white">AI Career Recommendations</CardTitle>
                  <CardDescription className="text-purple-200">
                    Personalized insights based on your progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <Music className="h-5 w-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-white font-medium">Release Timing Optimization</p>
                        <p className="text-purple-200 text-sm">
                          Friday 3PM EST shows 34% higher engagement for your genre
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <Video className="h-5 w-5 text-blue-400 mt-1" />
                      <div>
                        <p className="text-white font-medium">Content Strategy</p>
                        <p className="text-purple-200 text-sm">
                          Behind-the-scenes content performing 2.3x better than promotional posts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <Share2 className="h-5 w-5 text-green-400 mt-1" />
                      <div>
                        <p className="text-white font-medium">Collaboration Opportunity</p>
                        <p className="text-purple-200 text-sm">
                          3 artists in your network ready for collaboration projects
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/10 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-purple-200">
                    Accelerate your career with AI-powered tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Generate Release Strategy
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Analyze Competitor Trends
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Find Collaboration Partners
                  </Button>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Optimize Revenue Streams
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Breakdown */}
            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Revenue Stream Performance</CardTitle>
                <CardDescription className="text-purple-200">
                  Track earnings across all monetization channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-white">$2,847</div>
                    <p className="text-purple-200">Streaming Revenue</p>
                    <Badge className="mt-2 bg-green-600">+12%</Badge>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-white">$1,920</div>
                    <p className="text-purple-200">Live Performances</p>
                    <Badge className="mt-2 bg-blue-600">+8%</Badge>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-white">$743</div>
                    <p className="text-purple-200">Merchandise</p>
                    <Badge className="mt-2 bg-orange-600">+24%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200">
                  Comprehensive analytics dashboard with predictive insights coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Growth Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200">
                  AI-identified opportunities for career acceleration...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Career Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200">
                  Set and track your career milestones...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Career Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200">
                  Personalized career development pathway...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}