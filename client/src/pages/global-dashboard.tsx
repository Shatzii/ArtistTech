import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Music, 
  MapPin, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Star,
  Coins,
  Globe,
  Mic,
  Video,
  Radio,
  Building,
  UserPlus,
  Heart,
  Trophy,
  Flame,
  Clock,
  DollarSign
} from "lucide-react";

interface GlobalStats {
  totalUsers: number;
  totalArtists: number;
  totalFanCrews: number;
  totalShows: number;
  totalArtistHouses: number;
  totalGigs: number;
  totalATPEarned: number;
  totalATCInCirculation: number;
}

interface TrendingArtist {
  id: number;
  name: string;
  profileImageUrl?: string;
  influenceScore: number;
  roles: string[];
  recentShows: number;
  atpEarned: number;
  fanCrews: number;
}

interface FanCrew {
  id: number;
  name: string;
  description: string;
  leaderName: string;
  memberCount: number;
  fundingGoal: number;
  currentFunding: number;
  targetArtist?: string;
  status: string;
  targetDate?: string;
}

interface UpcomingShow {
  id: number;
  title: string;
  artistName: string;
  venue: string;
  showDate: string;
  ticketPrice: number;
  soldTickets: number;
  capacity: number;
  status: string;
  city: string;
  country: string;
}

interface OpenGig {
  id: number;
  title: string;
  role: string;
  posterName: string;
  paymentAmount: number;
  paymentType: string;
  location: string;
  urgency: string;
  skillsRequired: string[];
}

export default function GlobalDashboard() {
  const [selectedView, setSelectedView] = useState("overview");

  // Global Statistics
  const { data: globalStats } = useQuery({
    queryKey: ["/api/global/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Trending Artists
  const { data: trendingArtists } = useQuery({
    queryKey: ["/api/global/trending-artists"],
    refetchInterval: 60000, // Refresh every minute
  });

  // Active Fan Crews
  const { data: activeFanCrews } = useQuery({
    queryKey: ["/api/global/active-fan-crews"],
    refetchInterval: 30000,
  });

  // Upcoming Shows
  const { data: upcomingShows } = useQuery({
    queryKey: ["/api/global/upcoming-shows"],
    refetchInterval: 30000,
  });

  // Open Gigs
  const { data: openGigs } = useQuery({
    queryKey: ["/api/global/open-gigs"],
    refetchInterval: 60000,
  });

  // Artist Houses
  const { data: artistHouses } = useQuery({
    queryKey: ["/api/global/artist-houses"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const stats: GlobalStats = globalStats || {
    totalUsers: 0,
    totalArtists: 0,
    totalFanCrews: 0,
    totalShows: 0,
    totalArtistHouses: 0,
    totalGigs: 0,
    totalATPEarned: 0,
    totalATCInCirculation: 0,
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'artist': return <Music className="w-4 h-4" />;
      case 'dj': return <Radio className="w-4 h-4" />;
      case 'engineer': return <Mic className="w-4 h-4" />;
      case 'videographer': return <Video className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'normal': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Global Cultural Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time insights into the ArtistTech ecosystem - where creativity meets technology
          </p>
        </div>

        {/* Global Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-accent/20 to-accent/5">
            <CardContent className="p-4 text-center">
              <Music className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalArtists.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Active Artists</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5">
            <CardContent className="p-4 text-center">
              <Coins className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalATPEarned.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">ATP Earned</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/5">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalShows.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Shows Booked</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="fan-crews">Fan Crews</TabsTrigger>
            <TabsTrigger value="shows">Shows</TabsTrigger>
            <TabsTrigger value="gigs">Gigs</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Trending Artists */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trending Artists
                  </CardTitle>
                  <CardDescription>Top creators gaining influence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendingArtists?.slice(0, 5).map((artist: TrendingArtist, index: number) => (
                      <div key={artist.id} className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-muted-foreground">#{index + 1}</span>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={artist.profileImageUrl} />
                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{artist.name}</div>
                          <div className="flex gap-2">
                            {artist.roles.slice(0, 2).map((role) => (
                              <Badge key={role} variant="secondary" className="text-xs">
                                {getRoleIcon(role)}
                                <span className="ml-1">{role}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{artist.influenceScore.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Influence</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Fan Crews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Hot Fan Crews
                  </CardTitle>
                  <CardDescription>Crews actively funding shows</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeFanCrews?.slice(0, 4).map((crew: FanCrew) => (
                      <div key={crew.id} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{crew.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {crew.memberCount} members • Target: {crew.targetArtist || 'Open'}
                            </div>
                          </div>
                          <Badge variant={crew.status === 'funding' ? 'default' : 'secondary'}>
                            {crew.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Funding Progress</span>
                            <span>${crew.currentFunding.toFixed(0)} / ${crew.fundingGoal.toFixed(0)}</span>
                          </div>
                          <Progress value={(crew.currentFunding / crew.fundingGoal) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="artists" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Artist Leaderboard</CardTitle>
                  <CardDescription>Top performers by influence and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendingArtists?.map((artist: TrendingArtist, index: number) => (
                      <div key={artist.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-primary">#{index + 1}</span>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={artist.profileImageUrl} />
                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{artist.name}</div>
                          <div className="flex gap-2 mb-2">
                            {artist.roles.map((role) => (
                              <Badge key={role} variant="outline">
                                {getRoleIcon(role)}
                                <span className="ml-1">{role}</span>
                              </Badge>
                            ))}
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Influence</div>
                              <div className="font-medium">{artist.influenceScore.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Shows</div>
                              <div className="font-medium">{artist.recentShows}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">ATP Earned</div>
                              <div className="font-medium">{artist.atpEarned.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Fan Crews</div>
                              <div className="font-medium">{artist.fanCrews}</div>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fan Crews Tab */}
          <TabsContent value="fan-crews" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {activeFanCrews?.map((crew: FanCrew) => (
                <Card key={crew.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{crew.name}</CardTitle>
                        <CardDescription>{crew.description}</CardDescription>
                      </div>
                      <Badge variant={crew.status === 'funding' ? 'default' : 'secondary'}>
                        {crew.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Leader:</span>
                      <span className="font-medium">{crew.leaderName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Members:</span>
                      <span className="font-medium">{crew.memberCount}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Funding Progress</span>
                        <span className="font-medium">
                          ${crew.currentFunding.toFixed(0)} / ${crew.fundingGoal.toFixed(0)}
                        </span>
                      </div>
                      <Progress value={(crew.currentFunding / crew.fundingGoal) * 100} />
                    </div>
                    {crew.targetDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Target Date:</span>
                        <span className="font-medium">
                          {new Date(crew.targetDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <Button className="w-full" variant="outline">
                      Join Crew
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Shows Tab */}
          <TabsContent value="shows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Shows</CardTitle>
                <CardDescription>Concerts and events happening soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingShows?.map((show: UpcomingShow) => (
                    <div key={show.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{show.title}</div>
                        <div className="text-muted-foreground mb-2">by {show.artistName}</div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Venue</div>
                            <div className="font-medium">{show.venue}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Date</div>
                            <div className="font-medium">
                              {new Date(show.showDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Location</div>
                            <div className="font-medium">{show.city}, {show.country}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-lg font-bold">${show.ticketPrice}</div>
                        <div className="text-sm text-muted-foreground">
                          {show.soldTickets} / {show.capacity} sold
                        </div>
                        <Progress value={(show.soldTickets / show.capacity) * 100} className="w-20" />
                      </div>
                      <Button>Get Tickets</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gigs Tab */}
          <TabsContent value="gigs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Open Gigs</CardTitle>
                <CardDescription>Available work opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {openGigs?.map((gig: OpenGig) => (
                    <div key={gig.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-semibold text-lg">{gig.title}</div>
                          <Badge variant={getUrgencyColor(gig.urgency)}>
                            {gig.urgency}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground mb-2">
                          {gig.role} • Posted by {gig.posterName}
                        </div>
                        <div className="flex gap-2 mb-2">
                          {gig.skillsRequired.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {gig.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {gig.paymentType === 'fiat' ? '$' : ''}{gig.paymentAmount}
                          {gig.paymentType === 'atp' ? ' ATP' : ''}
                          {gig.paymentType === 'atc' ? ' ATC' : ''}
                        </div>
                        <div className="text-sm text-muted-foreground">{gig.paymentType.toUpperCase()}</div>
                      </div>
                      <Button>Apply</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Venues Tab */}
          <TabsContent value="venues" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {artistHouses?.map((house: any) => (
                <Card key={house.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      {house.name}
                    </CardTitle>
                    <CardDescription>{house.city}, {house.country}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm">{house.description}</div>
                    <div className="flex gap-2 flex-wrap">
                      {house.amenities?.map((amenity: string) => (
                        <Badge key={amenity} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Capacity: {house.capacity}
                      </span>
                      <Badge variant={house.status === 'active' ? 'default' : 'secondary'}>
                        {house.status}
                      </Badge>
                    </div>
                    <Button className="w-full" variant="outline">
                      Book Space
                    </Button>
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