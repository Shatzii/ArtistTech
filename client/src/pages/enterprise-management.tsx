import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Music, 
  Video, 
  Globe, 
  BarChart3,
  Search,
  UserPlus,
  Calendar,
  FileText,
  Camera,
  Megaphone,
  Truck,
  Shield,
  Target,
  Star,
  Award,
  Briefcase
} from "lucide-react";

interface Discovery {
  id: string;
  platform: string;
  username: string;
  metrics: {
    followers: number;
    engagement_rate: number;
    monthly_views: number;
    growth_rate: number;
  };
  potential_score: number;
  contact_info: { email: string };
  scouted_date: string;
}

interface Artist {
  id: string;
  name: string;
  genre: string[];
  skillLevel: string;
  marketValue: number;
  contracts: any[];
}

interface MarketAnalysis {
  trending_genres: Array<{ genre: string; growth: number; opportunity: string }>;
  market_opportunities: Array<{ region: string; growth: number; potential: string }>;
  platform_insights: Array<{ platform: string; user_growth: number; monetization: string }>;
  industry_forecast: {
    streaming_revenue: { current: string; projected: string; growth: number };
    live_events: { current: string; projected: string; growth: number };
    sync_licensing: { current: string; projected: string; growth: number };
  };
}

export default function EnterpriseManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Scout Talent State
  const [scoutData, setScoutData] = useState({
    platforms: ['tiktok', 'instagram', 'youtube'],
    criteria: {
      min_followers: 1000,
      engagement_rate: 0.03,
      genre_match: ['all'],
      market_potential: 0.7
    }
  });

  // Sign Artist State
  const [artistData, setArtistData] = useState({
    name: '',
    genre: ['pop'],
    skillLevel: 'emerging'
  });

  const [contractTerms, setContractTerms] = useState({
    type: '360_deal',
    duration: 24,
    royaltyRate: 0.15,
    advance: 50000,
    recoupmentRate: 0.5
  });

  // Release Planning State
  const [releaseData, setReleaseData] = useState({
    artistId: '',
    title: '',
    type: 'single',
    releaseDate: '',
    budget: 25000
  });

  // Tour Booking State
  const [tourData, setTourData] = useState({
    artistId: '',
    name: '',
    venueCount: 3
  });

  // Film Project State
  const [filmData, setFilmData] = useState({
    title: '',
    type: 'music_video',
    budget: 100000
  });

  // Campaign State
  const [campaignData, setCampaignData] = useState({
    name: '',
    budget: 50000,
    duration: 30
  });

  // Content Distribution State
  const [contentData, setContentData] = useState({
    id: '',
    title: '',
    type: 'audio'
  });

  // Fetch Market Analysis
  const { data: marketAnalysis } = useQuery<MarketAnalysis>({
    queryKey: ["/api/management/market-analysis"],
  });

  // Fetch Financial Overview
  const { data: financialOverview } = useQuery({
    queryKey: ["/api/management/financial-overview"],
  });

  // Scout Talent Mutation
  const scoutTalentMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/management/scout-talent", scoutData);
    },
    onSuccess: (data) => {
      toast({
        title: "Talent Discovered",
        description: `Found ${data.discoveries?.length || 0} potential artists`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to scout talent",
        variant: "destructive",
      });
    },
  });

  // Sign Artist Mutation
  const signArtistMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/management/sign-artist", {
        artistData: { ...artistData, id: `artist_${Date.now()}` },
        contractTerms
      });
    },
    onSuccess: () => {
      toast({
        title: "Artist Signed",
        description: "Artist contract created successfully",
      });
      setArtistData({ name: '', genre: ['pop'], skillLevel: 'emerging' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to sign artist",
        variant: "destructive",
      });
    },
  });

  // Plan Release Mutation
  const planReleaseMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/management/plan-release", {
        artistId: releaseData.artistId || `artist_${Date.now()}`,
        releaseData
      });
    },
    onSuccess: () => {
      toast({
        title: "Release Planned",
        description: "Release strategy created successfully",
      });
      setReleaseData({ artistId: '', title: '', type: 'single', releaseDate: '', budget: 25000 });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to plan release",
        variant: "destructive",
      });
    },
  });

  // Book Tour Mutation
  const bookTourMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/management/book-tour", {
        artistId: tourData.artistId || `artist_${Date.now()}`,
        tourData
      });
    },
    onSuccess: () => {
      toast({
        title: "Tour Booked",
        description: "Tour schedule created successfully",
      });
      setTourData({ artistId: '', name: '', venueCount: 3 });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to book tour",
        variant: "destructive",
      });
    },
  });

  // Create Film Project Mutation
  const createFilmMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/management/create-film-project", {
        projectData: { ...filmData, id: `film_${Date.now()}` }
      });
    },
    onSuccess: () => {
      toast({
        title: "Film Project Created",
        description: "Production timeline established",
      });
      setFilmData({ title: '', type: 'music_video', budget: 100000 });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create film project",
        variant: "destructive",
      });
    },
  });

  // Create Campaign Mutation
  const createCampaignMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/management/create-campaign", {
        campaignData: { ...campaignData, id: `campaign_${Date.now()}` }
      });
    },
    onSuccess: () => {
      toast({
        title: "Campaign Created",
        description: "Marketing strategy launched",
      });
      setCampaignData({ name: '', budget: 50000, duration: 30 });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    },
  });

  // Distribute Content Mutation
  const distributeContentMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/management/distribute-content", {
        contentData: { ...contentData, id: contentData.id || `content_${Date.now()}` }
      });
    },
    onSuccess: () => {
      toast({
        title: "Content Distributed",
        description: "Global distribution initiated",
      });
      setContentData({ id: '', title: '', type: 'audio' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to distribute content",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Enterprise AI Management
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            Full-Scale Record Label & Film Production Operations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {financialOverview?.artist_breakdown?.length || 0}
                  </p>
                  <p className="text-slate-400">Active Artists</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    ${financialOverview?.total_revenue?.toLocaleString() || '0'}
                  </p>
                  <p className="text-slate-400">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {((financialOverview?.profit_margin || 0) * 100).toFixed(1)}%
                  </p>
                  <p className="text-slate-400">Profit Margin</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-2xl font-bold text-white">41</p>
                  <p className="text-slate-400">Distribution Platforms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="talent" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Talent
            </TabsTrigger>
            <TabsTrigger value="production" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Production
            </TabsTrigger>
            <TabsTrigger value="film" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Film
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Distribution
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Analysis */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketAnalysis?.trending_genres?.map((genre, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{genre.genre}</p>
                          <p className="text-sm text-slate-400">Growth: +{genre.growth}%</p>
                        </div>
                        <Badge 
                          variant={genre.opportunity === 'high' ? 'default' : 'secondary'}
                          className={genre.opportunity === 'high' ? 'bg-green-600' : ''}
                        >
                          {genre.opportunity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Financial Overview */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Revenue Streams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialOverview?.revenue_streams && Object.entries(financialOverview.revenue_streams).map(([stream, data]: [string, any]) => (
                      <div key={stream} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="capitalize text-white">{stream.replace('_', ' ')}</span>
                          <span className="text-white">${data.amount?.toLocaleString()}</span>
                        </div>
                        <Progress value={data.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Industry Forecast */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Industry Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {marketAnalysis?.industry_forecast && Object.entries(marketAnalysis.industry_forecast).map(([category, data]: [string, any]) => (
                    <div key={category} className="text-center">
                      <h4 className="text-lg font-semibold text-white capitalize mb-2">
                        {category.replace('_', ' ')}
                      </h4>
                      <p className="text-2xl font-bold text-green-400">{data.current}</p>
                      <p className="text-slate-400">→ {data.projected}</p>
                      <Badge className="mt-2 bg-purple-600">+{data.growth}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Talent Management Tab */}
          <TabsContent value="talent" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Scout Talent */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-400" />
                    Talent Discovery
                  </CardTitle>
                  <CardDescription>
                    AI-powered talent scouting across platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Minimum Followers</Label>
                    <Input
                      type="number"
                      value={scoutData.criteria.min_followers}
                      onChange={(e) => setScoutData({
                        ...scoutData,
                        criteria: { ...scoutData.criteria, min_followers: parseInt(e.target.value) }
                      })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>Engagement Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={scoutData.criteria.engagement_rate * 100}
                      onChange={(e) => setScoutData({
                        ...scoutData,
                        criteria: { ...scoutData.criteria, engagement_rate: parseFloat(e.target.value) / 100 }
                      })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <Button 
                    onClick={() => scoutTalentMutation.mutate()}
                    disabled={scoutTalentMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {scoutTalentMutation.isPending ? "Scouting..." : "Scout Talent"}
                  </Button>
                </CardContent>
              </Card>

              {/* Sign Artist */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-green-400" />
                    Artist Signing
                  </CardTitle>
                  <CardDescription>
                    Create contracts and development plans
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Artist Name</Label>
                    <Input
                      value={artistData.name}
                      onChange={(e) => setArtistData({ ...artistData, name: e.target.value })}
                      placeholder="Enter artist name"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>Contract Type</Label>
                    <Select value={contractTerms.type} onValueChange={(value) => setContractTerms({ ...contractTerms, type: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="360_deal">360 Deal</SelectItem>
                        <SelectItem value="recording">Recording Contract</SelectItem>
                        <SelectItem value="publishing">Publishing Deal</SelectItem>
                        <SelectItem value="distribution">Distribution Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Advance ($)</Label>
                    <Input
                      type="number"
                      value={contractTerms.advance}
                      onChange={(e) => setContractTerms({ ...contractTerms, advance: parseInt(e.target.value) })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <Button 
                    onClick={() => signArtistMutation.mutate()}
                    disabled={signArtistMutation.isPending || !artistData.name}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {signArtistMutation.isPending ? "Creating Contract..." : "Sign Artist"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Production Tab */}
          <TabsContent value="production" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Release Planning */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-purple-400" />
                    Release Planning
                  </CardTitle>
                  <CardDescription>
                    Plan and schedule music releases
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Release Title</Label>
                    <Input
                      value={releaseData.title}
                      onChange={(e) => setReleaseData({ ...releaseData, title: e.target.value })}
                      placeholder="Enter release title"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>Release Type</Label>
                    <Select value={releaseData.type} onValueChange={(value) => setReleaseData({ ...releaseData, type: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="ep">EP</SelectItem>
                        <SelectItem value="album">Album</SelectItem>
                        <SelectItem value="compilation">Compilation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Release Date</Label>
                    <Input
                      type="date"
                      value={releaseData.releaseDate}
                      onChange={(e) => setReleaseData({ ...releaseData, releaseDate: e.target.value })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>Budget ($)</Label>
                    <Input
                      type="number"
                      value={releaseData.budget}
                      onChange={(e) => setReleaseData({ ...releaseData, budget: parseInt(e.target.value) })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <Button 
                    onClick={() => planReleaseMutation.mutate()}
                    disabled={planReleaseMutation.isPending || !releaseData.title}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {planReleaseMutation.isPending ? "Planning..." : "Plan Release"}
                  </Button>
                </CardContent>
              </Card>

              {/* Tour Booking */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    Tour Management
                  </CardTitle>
                  <CardDescription>
                    Book and manage artist tours
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tour Name</Label>
                    <Input
                      value={tourData.name}
                      onChange={(e) => setTourData({ ...tourData, name: e.target.value })}
                      placeholder="Enter tour name"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>Number of Venues</Label>
                    <Select value={tourData.venueCount.toString()} onValueChange={(value) => setTourData({ ...tourData, venueCount: parseInt(value) })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Venues</SelectItem>
                        <SelectItem value="5">5 Venues</SelectItem>
                        <SelectItem value="10">10 Venues</SelectItem>
                        <SelectItem value="20">20 Venues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => bookTourMutation.mutate()}
                    disabled={bookTourMutation.isPending || !tourData.name}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    {bookTourMutation.isPending ? "Booking..." : "Book Tour"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Film Production Tab */}
          <TabsContent value="film" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-red-400" />
                  Film Production
                </CardTitle>
                <CardDescription>
                  Create and manage film projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Project Title</Label>
                    <Input
                      value={filmData.title}
                      onChange={(e) => setFilmData({ ...filmData, title: e.target.value })}
                      placeholder="Enter project title"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>Project Type</Label>
                    <Select value={filmData.type} onValueChange={(value) => setFilmData({ ...filmData, type: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="music_video">Music Video</SelectItem>
                        <SelectItem value="documentary">Documentary</SelectItem>
                        <SelectItem value="concert_film">Concert Film</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="feature_film">Feature Film</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Budget ($)</Label>
                    <Input
                      type="number"
                      value={filmData.budget}
                      onChange={(e) => setFilmData({ ...filmData, budget: parseInt(e.target.value) })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => createFilmMutation.mutate()}
                  disabled={createFilmMutation.isPending || !filmData.title}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {createFilmMutation.isPending ? "Creating..." : "Create Film Project"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-yellow-400" />
                  Marketing Campaigns
                </CardTitle>
                <CardDescription>
                  Create and manage marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Campaign Name</Label>
                    <Input
                      value={campaignData.name}
                      onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                      placeholder="Enter campaign name"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>Budget ($)</Label>
                    <Input
                      type="number"
                      value={campaignData.budget}
                      onChange={(e) => setCampaignData({ ...campaignData, budget: parseInt(e.target.value) })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>Duration (days)</Label>
                    <Input
                      type="number"
                      value={campaignData.duration}
                      onChange={(e) => setCampaignData({ ...campaignData, duration: parseInt(e.target.value) })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => createCampaignMutation.mutate()}
                  disabled={createCampaignMutation.isPending || !campaignData.name}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-cyan-400" />
                  Global Distribution
                </CardTitle>
                <CardDescription>
                  Distribute content across platforms worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Content Title</Label>
                    <Input
                      value={contentData.title}
                      onChange={(e) => setContentData({ ...contentData, title: e.target.value })}
                      placeholder="Enter content title"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>Content Type</Label>
                    <Select value={contentData.type} onValueChange={(value) => setContentData({ ...contentData, type: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="podcast">Podcast</SelectItem>
                        <SelectItem value="livestream">Livestream</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={() => distributeContentMutation.mutate()}
                  disabled={distributeContentMutation.isPending || !contentData.title}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {distributeContentMutation.isPending ? "Distributing..." : "Distribute Content"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}