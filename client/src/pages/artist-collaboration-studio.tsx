import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, Search, MessageCircle, Video, Music, Star, 
  MapPin, Clock, TrendingUp, Crown, Sparkles, Heart,
  Play, Headphones, Share, Settings, User, Filter
} from "lucide-react";

export default function ArtistCollaborationStudio() {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const queryClient = useQueryClient();

  // Fetch collaboration data
  const { data: artistsData } = useQuery({
    queryKey: ["/api/collaboration/artists"],
    enabled: true
  });

  const { data: matchesData } = useQuery({
    queryKey: ["/api/collaboration/matches"],
    enabled: true
  });

  const { data: projectsData } = useQuery({
    queryKey: ["/api/collaboration/projects"],
    enabled: true
  });

  // Send collaboration request mutation
  const collaborateMutation = useMutation({
    mutationFn: async (requestData: any) => {
      return await apiRequest("/api/collaboration/send-request", {
        method: "POST",
        body: JSON.stringify(requestData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collaboration/requests"] });
    }
  });

  const mockArtists = [
    {
      id: 1,
      name: "BeatMaster Pro",
      genre: "Hip-Hop",
      location: "Los Angeles, CA",
      followers: 125000,
      rating: 4.9,
      avatar: "BM",
      skills: ["Production", "Mixing", "Songwriting"],
      recentTracks: 23,
      collaborations: 45,
      matchScore: 94,
      status: "online",
      lookingFor: ["Vocalists", "Guitarists"],
      bio: "Professional producer with 10+ years experience in hip-hop and R&B"
    },
    {
      id: 2,
      name: "VocalVibes",
      genre: "R&B/Soul",
      location: "Nashville, TN",
      followers: 89000,
      rating: 4.8,
      avatar: "VV",
      skills: ["Vocals", "Songwriting", "Harmony"],
      recentTracks: 15,
      collaborations: 32,
      matchScore: 91,
      status: "busy",
      lookingFor: ["Producers", "Instrumentalists"],
      bio: "Soulful vocalist specializing in R&B, Gospel, and Neo-Soul"
    },
    {
      id: 3,
      name: "SynthWave King",
      genre: "Electronic",
      location: "Berlin, Germany",
      followers: 78000,
      rating: 4.7,
      avatar: "SW",
      skills: ["Synthesis", "Sound Design", "Production"],
      recentTracks: 31,
      collaborations: 28,
      matchScore: 87,
      status: "online",
      lookingFor: ["Vocalists", "Live Performers"],
      bio: "Electronic music producer creating retro-futuristic soundscapes"
    }
  ];

  const mockProjects = [
    {
      id: 1,
      title: "Cyberpunk Dreams",
      artists: ["BeatMaster Pro", "SynthWave King"],
      genre: "Electronic Hip-Hop Fusion",
      progress: 75,
      status: "In Progress",
      deadline: "2025-08-15",
      description: "Futuristic hip-hop track with cyberpunk aesthetics"
    },
    {
      id: 2,
      title: "Soulful Nights",
      artists: ["VocalVibes", "Jazz Master"],
      genre: "Neo-Soul",
      progress: 45,
      status: "Recording",
      deadline: "2025-08-30",
      description: "Emotional neo-soul ballad with jazz influences"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-green-400 border-green-500";
      case "busy": return "text-yellow-400 border-yellow-500";
      case "offline": return "text-gray-400 border-gray-500";
      default: return "text-gray-400 border-gray-500";
    }
  };

  const handleCollaborationRequest = async (artistId: number) => {
    try {
      await collaborateMutation.mutateAsync({
        targetArtistId: artistId,
        message: "Hi! I'd love to collaborate on a project. Let's create something amazing together!",
        projectType: "collaboration"
      });
    } catch (error) {
      console.error("Failed to send collaboration request:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-blue-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/artist-tech-logo.jpeg" 
              alt="Artist Tech" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">Artist Collaboration Studio</h1>
              <p className="text-white/60">Connect, collaborate, and create together</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Users className="w-4 h-4 mr-1" />
              {mockArtists.length} Artists Online
            </Badge>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Video className="w-4 h-4 mr-2" />
              Start Live Session
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-purple-500/30">
            <TabsTrigger value="discover" className="data-[state=active]:bg-purple-600">
              <Search className="w-4 h-4 mr-2" />
              Discover Artists
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-purple-600">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Matches
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-purple-600">
              <Music className="w-4 h-4 mr-2" />
              Active Projects
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              My Network
            </TabsTrigger>
          </TabsList>

          {/* Discover Artists Tab */}
          <TabsContent value="discover">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Search & Filters */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Search & Filter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Search artists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black/50 border-purple-500/30"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Genre</label>
                    <select 
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="w-full bg-black/50 border border-purple-500/30 rounded-md px-3 py-2"
                    >
                      <option value="all">All Genres</option>
                      <option value="hip-hop">Hip-Hop</option>
                      <option value="electronic">Electronic</option>
                      <option value="r&b">R&B/Soul</option>
                      <option value="rock">Rock</option>
                      <option value="pop">Pop</option>
                      <option value="jazz">Jazz</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Looking For</label>
                    <div className="space-y-2">
                      {["Vocalists", "Producers", "Instrumentalists", "Songwriters", "Mixers"].map(skill => (
                        <label key={skill} className="flex items-center">
                          <input type="checkbox" className="mr-2 accent-purple-500" />
                          <span className="text-sm">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Artist Cards */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mockArtists.map(artist => (
                  <Card key={artist.id} className="bg-black/40 border-purple-500/30 hover:border-purple-400/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-purple-600">{artist.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-white">{artist.name}</h3>
                            <p className="text-sm text-white/60">{artist.genre}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(artist.status)}>
                          {artist.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Match Score</span>
                        <Badge className="bg-green-600">{artist.matchScore}%</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">Followers</span>
                          <p className="font-medium">{artist.followers.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-white/60">Rating</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span>{artist.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-white/60 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {artist.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>  
                      </div>

                      <div>
                        <p className="text-sm text-white/60 mb-2">Looking For</p>
                        <div className="flex flex-wrap gap-1">
                          {artist.lookingFor.map(need => (
                            <Badge key={need} variant="outline" className="text-xs border-green-500 text-green-400">
                              {need}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-white/70">{artist.bio}</p>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleCollaborationRequest(artist.id)}
                          disabled={collaborateMutation.isPending}
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Collaborate
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-500/30">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-500/30">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Matches Tab */}
          <TabsContent value="matches">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                  AI-Powered Collaboration Matches
                </CardTitle>
                <CardDescription>Based on your style, goals, and musical preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockArtists.slice(0, 2).map(artist => (
                    <div key={artist.id} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-16 h-16">
                            <AvatarFallback className="bg-purple-600 text-lg">{artist.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-xl font-bold text-white">{artist.name}</h3>
                            <p className="text-white/60">{artist.genre}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600 text-lg px-3 py-1">
                          <Crown className="w-4 h-4 mr-1" />
                          {artist.matchScore}% Match
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-black/30 p-3 rounded">
                          <h4 className="font-medium mb-2 text-white">Why This Match?</h4>
                          <ul className="text-sm text-white/80 space-y-1">
                            <li>• Complementary musical styles</li>
                            <li>• Similar creative vision and goals</li>
                            <li>• Matching availability and timeline</li>
                            <li>• High collaboration success rate</li>
                          </ul>
                        </div>

                        <div className="flex space-x-2">
                          <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600">
                            <Heart className="w-4 h-4 mr-2" />
                            Connect Now
                          </Button>
                          <Button variant="outline" className="border-purple-500/30">
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Projects Tab */}
          <TabsContent value="projects">
            <div className="space-y-6">
              {mockProjects.map(project => (
                <Card key={project.id} className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-white/60 mb-2">Collaborators</p>
                          <div className="flex space-x-2">
                            {project.artists.map(artist => (
                              <Badge key={artist} variant="outline">
                                {artist}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-white/60 mb-2">Genre</p>
                          <Badge className="bg-purple-600">{project.genre}</Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-white/60 mb-2">Progress</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-black/30 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{project.progress}%</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-white/60 mb-2">Deadline</p>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                            <span className="text-sm">{project.deadline}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Music className="w-4 h-4 mr-2" />
                          Enter Studio
                        </Button>
                        <Button variant="outline" className="border-purple-500/30">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        <Button variant="outline" className="border-purple-500/30">
                          <Video className="w-4 h-4 mr-2" />
                          Video Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Network Tab */}
          <TabsContent value="network">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Network Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 p-3 rounded text-center">
                      <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold">45</p>
                      <p className="text-sm text-white/60">Connections</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded text-center">
                      <Music className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-white/60">Collaborations</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded text-center">
                      <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold">4.8</p>
                      <p className="text-sm text-white/60">Avg Rating</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded text-center">
                      <Crown className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold">23</p>
                      <p className="text-sm text-white/60">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-black/30 rounded">
                      <Users className="w-5 h-5 text-green-400" />
                      <div className="flex-1">
                        <p className="text-sm">New collaboration request from <span className="text-purple-400">SynthWave King</span></p>
                        <p className="text-xs text-white/60">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-black/30 rounded">
                      <Music className="w-5 h-5 text-purple-400" />
                      <div className="flex-1">
                        <p className="text-sm">Project "Cyberpunk Dreams" reached 75% completion</p>
                        <p className="text-xs text-white/60">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-black/30 rounded">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <div className="flex-1">
                        <p className="text-sm">Received 5-star rating from <span className="text-purple-400">VocalVibes</span></p>
                        <p className="text-xs text-white/60">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}