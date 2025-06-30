import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  Music, 
  Users, 
  Star, 
  Trophy, 
  Gift,
  Headphones,
  Play,
  Share2,
  DollarSign,
  Crown,
  Zap,
  Clock,
  MapPin,
  Ticket
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Types for artist-fan engagement
interface Artist {
  id: string;
  name: string;
  image: string;
  genre: string;
  followers: number;
  monthlyListeners: number;
  fanCrewCount: number;
  upcomingShows: number;
  artistCoinsEarned: number;
  engagementRate: number;
  topTracks: string[];
}

interface Fan {
  id: string;
  name: string;
  image: string;
  fanLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  totalSpent: number;
  artistCoinsEarned: number;
  favoriteArtists: string[];
  crewMemberships: string[];
  showsAttended: number;
  engagementScore: number;
}

interface FanCrewMembership {
  id: string;
  crewName: string;
  artistName: string;
  role: 'Member' | 'Moderator' | 'VIP' | 'Captain';
  joinedDate: string;
  contributions: number;
  perks: string[];
  nextReward: string;
}

interface ArtistInteraction {
  id: string;
  type: 'like' | 'comment' | 'share' | 'playlist_add' | 'show_attend' | 'merchandise' | 'tip';
  artistName: string;
  description: string;
  timestamp: string;
  artistCoinsEarned: number;
  fanXpGained: number;
}

interface ShowBookingRequest {
  id: string;
  artistName: string;
  requestedBy: string;
  venue: string;
  proposedDate: string;
  budget: number;
  status: 'pending' | 'approved' | 'declined' | 'negotiating';
  fanSupport: number;
  expectedAttendance: number;
}

export default function ArtistFanEngagement() {
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const queryClient = useQueryClient();

  // API Queries
  const { data: currentFan } = useQuery({
    queryKey: ['/api/fan/profile'],
    refetchInterval: 30000
  });

  const { data: recommendedArtists } = useQuery({
    queryKey: ['/api/fan/recommended-artists'],
    refetchInterval: 60000
  });

  const { data: fanCrewMemberships } = useQuery({
    queryKey: ['/api/fan/crew-memberships'],
    refetchInterval: 30000
  });

  const { data: recentInteractions } = useQuery({
    queryKey: ['/api/fan/recent-interactions'],
    refetchInterval: 15000
  });

  const { data: showBookingRequests } = useQuery({
    queryKey: ['/api/fan/show-booking-requests'],
    refetchInterval: 30000
  });

  // Mutations
  const followArtistMutation = useMutation({
    mutationFn: (artistId: string) => apiRequest("POST", "/api/fan/follow-artist", { artistId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fan/recommended-artists'] });
      queryClient.invalidateQueries({ queryKey: ['/api/fan/profile'] });
    }
  });

  const joinFanCrewMutation = useMutation({
    mutationFn: (data: { artistId: string; crewType: string }) => 
      apiRequest("POST", "/api/fan/join-crew", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fan/crew-memberships'] });
    }
  });

  const requestShowMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/fan/request-show", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fan/show-booking-requests'] });
      setShowBookingDialog(false);
    }
  });

  const supportShowMutation = useMutation({
    mutationFn: (showId: string) => apiRequest("POST", `/api/fan/support-show/${showId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fan/show-booking-requests'] });
    }
  });

  const getFanLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'bg-orange-500';
      case 'Silver': return 'bg-gray-400';
      case 'Gold': return 'bg-yellow-500';
      case 'Platinum': return 'bg-purple-500';
      case 'Diamond': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'declined': return 'destructive';
      case 'negotiating': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Artist-Fan Engagement Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect, support, and earn rewards through meaningful artist interactions
          </p>
        </div>

        {/* Fan Profile Summary */}
        {currentFan && (
          <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={currentFan.image} />
                  <AvatarFallback>{currentFan.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{currentFan.name}</h2>
                    <Badge className={`${getFanLevelColor(currentFan.fanLevel)} text-white`}>
                      <Crown className="w-3 h-3 mr-1" />
                      {currentFan.fanLevel} Fan
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
                      <div className="font-bold text-lg text-blue-600">{currentFan.artistCoinsEarned?.toLocaleString()}</div>
                      <div className="text-muted-foreground">ArtistCoins</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900 rounded-lg">
                      <div className="font-bold text-lg text-green-600">{currentFan.showsAttended}</div>
                      <div className="text-muted-foreground">Shows Attended</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 dark:bg-purple-900 rounded-lg">
                      <div className="font-bold text-lg text-purple-600">{currentFan.crewMemberships?.length}</div>
                      <div className="text-muted-foreground">Fan Crews</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 dark:bg-orange-900 rounded-lg">
                      <div className="font-bold text-lg text-orange-600">{currentFan.engagementScore}</div>
                      <div className="text-muted-foreground">Engagement Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-max lg:grid-cols-5 mx-auto">
            <TabsTrigger value="discover">Discover Artists</TabsTrigger>
            <TabsTrigger value="crews">Fan Crews</TabsTrigger>
            <TabsTrigger value="shows">Show Requests</TabsTrigger>
            <TabsTrigger value="interactions">Activity</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          {/* Discover Artists Tab */}
          <TabsContent value="discover" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Recommended Artists
                </CardTitle>
                <CardDescription>
                  Discover new artists based on your taste and earn ArtistCoins for engaging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(recommendedArtists as Artist[] || []).map((artist: Artist) => (
                    <Card key={artist.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                          <Avatar className="w-24 h-24 mx-auto">
                            <AvatarImage src={artist.image} />
                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-lg">{artist.name}</h3>
                            <p className="text-muted-foreground">{artist.genre}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-center">
                              <div className="font-bold">{artist.followers?.toLocaleString()}</div>
                              <div className="text-muted-foreground">Followers</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold">{artist.monthlyListeners?.toLocaleString()}</div>
                              <div className="text-muted-foreground">Monthly</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Button 
                              className="w-full" 
                              onClick={() => followArtistMutation.mutate(artist.id)}
                              disabled={followArtistMutation.isPending}
                            >
                              <Heart className="w-4 h-4 mr-2" />
                              Follow (+25 AC)
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                setSelectedArtist(artist);
                                setShowBookingDialog(true);
                              }}
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Request Show
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fan Crews Tab */}
          <TabsContent value="crews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  My Fan Crews
                </CardTitle>
                <CardDescription>
                  Join exclusive fan communities and unlock special perks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {(fanCrewMemberships as FanCrewMembership[] || []).map((membership: FanCrewMembership) => (
                    <Card key={membership.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{membership.crewName}</h3>
                              <p className="text-muted-foreground">by {membership.artistName}</p>
                            </div>
                            <Badge variant="outline">
                              <Star className="w-3 h-3 mr-1" />
                              {membership.role}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Contributions</span>
                              <span className="font-bold">{membership.contributions}</span>
                            </div>
                            <Progress value={(membership.contributions % 100)} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Current Perks:</h4>
                            <div className="flex flex-wrap gap-1">
                              {membership.perks?.map((perk, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {perk}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                              <Gift className="w-4 h-4 inline mr-1" />
                              Next Reward: {membership.nextReward}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Show Requests Tab */}
          <TabsContent value="shows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Show Booking Requests
                </CardTitle>
                <CardDescription>
                  Request shows from your favorite artists and rally fan support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(showBookingRequests as ShowBookingRequest[] || []).map((request: ShowBookingRequest) => (
                    <Card key={request.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{request.artistName}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {request.venue}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(request.proposedDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ${request.budget?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                          <div className="font-bold text-lg text-green-600">{request.fanSupport}</div>
                          <div className="text-sm text-muted-foreground">Fan Support</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                          <div className="font-bold text-lg text-blue-600">{request.expectedAttendance}</div>
                          <div className="text-sm text-muted-foreground">Expected Attendance</div>
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <Button 
                          onClick={() => supportShowMutation.mutate(request.id)}
                          disabled={supportShowMutation.isPending}
                          className="w-full"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Support This Show (+10 AC)
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Interactions Tab */}
          <TabsContent value="interactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your recent interactions and earnings with artists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(recentInteractions as ArtistInteraction[] || []).map((interaction: ArtistInteraction) => (
                    <div key={interaction.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        {interaction.type === 'like' && <Heart className="w-5 h-5 text-red-500" />}
                        {interaction.type === 'comment' && <MessageCircle className="w-5 h-5 text-blue-500" />}
                        {interaction.type === 'share' && <Share2 className="w-5 h-5 text-green-500" />}
                        {interaction.type === 'playlist_add' && <Play className="w-5 h-5 text-purple-500" />}
                        {interaction.type === 'show_attend' && <Calendar className="w-5 h-5 text-orange-500" />}
                        {interaction.type === 'merchandise' && <Gift className="w-5 h-5 text-pink-500" />}
                        {interaction.type === 'tip' && <DollarSign className="w-5 h-5 text-yellow-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{interaction.artistName}</div>
                        <div className="text-sm text-muted-foreground">{interaction.description}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(interaction.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">+{interaction.artistCoinsEarned} AC</div>
                        <div className="text-sm text-muted-foreground">+{interaction.fanXpGained} XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Fan Rewards Program
                </CardTitle>
                <CardDescription>
                  Unlock exclusive rewards and perks as you engage with artists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="p-4 bg-gradient-to-br from-bronze-100 to-bronze-200 dark:from-orange-900 dark:to-orange-800">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold">Bronze Tier</h3>
                      <p className="text-sm text-muted-foreground">5% bonus ArtistCoins</p>
                      <div className="text-xs">Unlock at 1,000 AC</div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold">Silver Tier</h3>
                      <p className="text-sm text-muted-foreground">10% bonus + Early access</p>
                      <div className="text-xs">Unlock at 5,000 AC</div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-700 dark:to-yellow-600">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold">Gold Tier</h3>
                      <p className="text-sm text-muted-foreground">15% bonus + VIP perks</p>
                      <div className="text-xs">Unlock at 15,000 AC</div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Show Booking Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Show: {selectedArtist?.name}</DialogTitle>
              <DialogDescription>
                Rally fan support to bring this artist to your city
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Venue</label>
                  <Input placeholder="Enter venue name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Proposed Date</label>
                  <Input type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Budget Range</label>
                  <Input placeholder="e.g., $5,000 - $10,000" />
                </div>
                <div>
                  <label className="text-sm font-medium">Expected Attendance</label>
                  <Input placeholder="e.g., 500 people" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Additional Details</label>
                <Textarea placeholder="Why would this show be amazing? Any special requests or ideas?" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => requestShowMutation.mutate({})}
                  disabled={requestShowMutation.isPending}
                  className="flex-1"
                >
                  Submit Request (+50 AC)
                </Button>
                <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}