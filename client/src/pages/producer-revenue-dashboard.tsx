import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, Briefcase, TrendingUp, Music, Headphones, 
  Mic, Clock, Star, Target, MapPin, Calendar 
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function ProducerRevenueDashboard() {
  const [selectedStream, setSelectedStream] = useState("all");
  const [jobFilters, setJobFilters] = useState({
    type: "all",
    budget: "any",
    timeline: "any"
  });

  const { data: jobOpportunities, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/producer/find-jobs"],
    enabled: true
  });

  const { data: revenueStreams, isLoading: streamsLoading } = useQuery({
    queryKey: ["/api/producer/revenue-streams"],
    enabled: true
  });

  const { data: marketplaces, isLoading: marketplacesLoading } = useQuery({
    queryKey: ["/api/producer/marketplaces"],
    enabled: true
  });

  const { data: engineStatus } = useQuery({
    queryKey: ["/api/producer/engine-status"],
    enabled: true
  });

  const generateBusinessPlan = useMutation({
    mutationFn: () => apiRequest("POST", "/api/producer/business-plan", {}),
  });

  if (jobsLoading || streamsLoading || marketplacesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Producer Revenue Ecosystem
          </h1>
          <p className="text-orange-200 text-lg max-w-3xl mx-auto">
            Complete business platform for producers - Find jingles, jobs, and maximize all revenue streams
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 border-orange-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-400" />
                Active Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {jobOpportunities?.jobs?.length || 0}
              </div>
              <p className="text-orange-200 text-sm">opportunities available</p>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-orange-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                Weekly Potential
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${jobOpportunities?.estimated_weekly_earnings?.toLocaleString() || '0'}
              </div>
              <p className="text-orange-200 text-sm">estimated earnings</p>
              <Progress value={68} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-orange-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Revenue Streams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {revenueStreams?.total_streams_available || 0}
              </div>
              <p className="text-orange-200 text-sm">income opportunities</p>
              <Progress value={83} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-orange-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                Marketplaces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {marketplaces?.total_platforms || 0}
              </div>
              <p className="text-orange-200 text-sm">connected platforms</p>
              <Progress value={91} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10">
            <TabsTrigger value="jobs">Job Board</TabsTrigger>
            <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
            <TabsTrigger value="marketplaces">Marketplaces</TabsTrigger>
            <TabsTrigger value="rates">Rate Optimization</TabsTrigger>
            <TabsTrigger value="business">Business Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {/* Job Filters */}
            <Card className="bg-white/10 border-orange-400/30">
              <CardHeader>
                <CardTitle className="text-white">Filter Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={jobFilters.type} onValueChange={(value) => 
                    setJobFilters(prev => ({ ...prev, type: value }))
                  }>
                    <SelectTrigger className="bg-white/10 border-orange-400/30 text-white">
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="jingle">Jingles & Commercials</SelectItem>
                      <SelectItem value="beat_sale">Beat Sales</SelectItem>
                      <SelectItem value="custom_production">Custom Production</SelectItem>
                      <SelectItem value="mixing">Mixing & Mastering</SelectItem>
                      <SelectItem value="ghost_production">Ghost Production</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={jobFilters.budget} onValueChange={(value) => 
                    setJobFilters(prev => ({ ...prev, budget: value }))
                  }>
                    <SelectTrigger className="bg-white/10 border-orange-400/30 text-white">
                      <SelectValue placeholder="Budget Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Budget</SelectItem>
                      <SelectItem value="100-500">$100 - $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                      <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                      <SelectItem value="2500+">$2,500+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={jobFilters.timeline} onValueChange={(value) => 
                    setJobFilters(prev => ({ ...prev, timeline: value }))
                  }>
                    <SelectTrigger className="bg-white/10 border-orange-400/30 text-white">
                      <SelectValue placeholder="Timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Timeline</SelectItem>
                      <SelectItem value="24h">24 Hours</SelectItem>
                      <SelectItem value="3d">3 Days</SelectItem>
                      <SelectItem value="1w">1 Week</SelectItem>
                      <SelectItem value="1m">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Job Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sample Job Cards */}
              <Card className="bg-white/10 border-orange-400/30 hover:bg-white/15 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Mic className="h-5 w-5 text-orange-400" />
                        Radio Station Jingle
                      </CardTitle>
                      <CardDescription className="text-orange-200">
                        30-second energetic jingle for morning show
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-600">$800</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-orange-200">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      3 days
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Remote
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      High Priority
                    </span>
                  </div>
                  <p className="text-orange-100 text-sm">
                    Looking for an upbeat, memorable jingle with vocal tag. Rock/Pop style preferred.
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-orange-400/30 hover:bg-white/15 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Music className="h-5 w-5 text-blue-400" />
                        Custom Beat Production
                      </CardTitle>
                      <CardDescription className="text-orange-200">
                        Hip-hop beat for upcoming album
                      </CardDescription>
                    </div>
                    <Badge className="bg-purple-600">$1,200</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-orange-200">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      1 week
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Los Angeles
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Verified Client
                    </span>
                  </div>
                  <p className="text-orange-100 text-sm">
                    Need modern trap-influenced beat, 140 BPM, with room for melodic vocals.
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-orange-400/30 hover:bg-white/15 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Headphones className="h-5 w-5 text-green-400" />
                        Podcast Intro Music
                      </CardTitle>
                      <CardDescription className="text-orange-200">
                        15-second intro for business podcast
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-600">$400</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-orange-200">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      2 days
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Remote
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Rush Job
                    </span>
                  </div>
                  <p className="text-orange-100 text-sm">
                    Professional, corporate sound. Clean production with optional voiceover space.
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-orange-400/30 hover:bg-white/15 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Music className="h-5 w-5 text-purple-400" />
                        TV Commercial Music
                      </CardTitle>
                      <CardDescription className="text-orange-200">
                        Background music for car commercial
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-600">$1,500</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-orange-200">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      5 days
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Remote
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Premium Client
                    </span>
                  </div>
                  <p className="text-orange-100 text-sm">
                    Cinematic, driving music to complement luxury vehicle footage. Multiple versions needed.
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="streams" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {revenueStreams?.recommended_streams?.slice(0, 9).map((stream: any, index: number) => (
                <Card key={index} className="bg-white/10 border-orange-400/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{stream.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={
                        stream.earning_potential === 'very_high' ? 'bg-green-600' :
                        stream.earning_potential === 'high' ? 'bg-blue-600' :
                        stream.earning_potential === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'
                      }>
                        {stream.earning_potential.replace('_', ' ')}
                      </Badge>
                      <Badge className={
                        stream.setup_difficulty === 'easy' ? 'bg-green-600' :
                        stream.setup_difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                      }>
                        {stream.setup_difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-orange-200 text-sm">{stream.description}</p>
                    <div className="space-y-2">
                      <p className="text-orange-100 font-medium text-sm">Getting Started:</p>
                      <ul className="text-orange-200 text-xs space-y-1">
                        {stream.getting_started?.slice(0, 3).map((step: string, stepIndex: number) => (
                          <li key={stepIndex}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketplaces" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketplaces?.recommended_marketplaces?.map((marketplace: any, index: number) => (
                <Card key={index} className="bg-white/10 border-orange-400/30">
                  <CardHeader>
                    <CardTitle className="text-white">{marketplace.platform}</CardTitle>
                    <CardDescription className="text-orange-200">
                      {marketplace.type.replace('_', ' ')} • {marketplace.commission_rate * 100}% commission
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-orange-200">Payout:</p>
                        <p className="text-white font-medium">{marketplace.payout_frequency}</p>
                      </div>
                      <div>
                        <p className="text-orange-200">Commission:</p>
                        <p className="text-white font-medium">{marketplace.commission_rate * 100}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-orange-200 text-sm mb-2">Pros:</p>
                      <ul className="text-orange-100 text-xs space-y-1">
                        {marketplace.pros?.slice(0, 3).map((pro: string, proIndex: number) => (
                          <li key={proIndex}>✓ {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Join Platform
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rates" className="space-y-6">
            <Card className="bg-white/10 border-orange-400/30">
              <CardHeader>
                <CardTitle className="text-white">AI Rate Optimization</CardTitle>
                <CardDescription className="text-orange-200">
                  Get market-competitive rates based on your experience and location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Optimize My Rates
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <Card className="bg-white/10 border-orange-400/30">
              <CardHeader>
                <CardTitle className="text-white">AI Business Plan Generator</CardTitle>
                <CardDescription className="text-orange-200">
                  Get a personalized business plan with revenue projections and action items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => generateBusinessPlan.mutate()}
                  disabled={generateBusinessPlan.isPending}
                >
                  {generateBusinessPlan.isPending ? 'Generating...' : 'Generate Business Plan'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}