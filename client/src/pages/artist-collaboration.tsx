import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';
import { 
  Users, Music, Heart, Star, Globe, MapPin, Clock, 
  Play, Shuffle, Mic, Headphones, Volume2, Radio,
  ArrowRight, Zap, Target, Award, TrendingUp, Sparkles,
  MessageCircle, Share, Plus, Edit, Search, Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form schemas
const artistProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  primaryGenre: z.string().min(1, "Primary genre is required"),
  secondaryGenres: z.array(z.string()).optional(),
  musicalInterests: z.array(z.string()).optional(),
  collaborationPreferences: z.object({
    openToGenres: z.array(z.string()).optional(),
    lookingFor: z.array(z.string()).optional(),
    experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'professional']),
    workingStyle: z.enum(['remote', 'in-person', 'hybrid']),
    timeCommitment: z.enum(['casual', 'part-time', 'full-time'])
  }),
  soundSignature: z.object({
    energy: z.number().min(1).max(10),
    mood: z.string(),
    instruments: z.array(z.string()).optional(),
    vocalStyle: z.string().optional(),
    productionStyle: z.array(z.string()).optional()
  }),
  inspirations: z.array(z.string()).optional(),
  location: z.string().optional(),
  crossGenreExperience: z.object({
    attempted: z.array(z.string()).optional(),
    successful: z.array(z.string()).optional(),
    interested: z.array(z.string()).optional()
  })
});

const genreOptions = [
  'house', 'trap', 'techno', 'future-bass', 'latin', 'drum-bass',
  'hip-hop', 'r&b', 'pop', 'electronic', 'reggaeton', 'afrobeats',
  'gospel', 'jazz', 'rock', 'indie', 'folk', 'country'
];

const roleOptions = [
  'vocalist', 'producer', 'songwriter', 'instrumentalist', 'mixer'
];

const instrumentOptions = [
  'vocals', 'piano', 'guitar', 'bass', 'drums', 'synthesizer',
  'violin', 'saxophone', 'trumpet', 'flute', '808s', 'sampler'
];

export default function ArtistCollaboration() {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all artists
  const { data: artistsData, isLoading: artistsLoading } = useQuery({
    queryKey: ['/api/collaboration/artists'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch collaboration matches for selected artist
  const { data: matchesData, isLoading: matchesLoading } = useQuery({
    queryKey: ['/api/collaboration/matches', selectedArtist],
    enabled: !!selectedArtist,
    refetchInterval: 60000 // Refresh every minute
  });

  // Fetch cross-genre opportunities for selected artist
  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['/api/collaboration/opportunities', selectedArtist],
    enabled: !!selectedArtist,
    refetchInterval: 60000
  });

  // Artist profile form
  const form = useForm({
    resolver: zodResolver(artistProfileSchema),
    defaultValues: {
      name: '',
      primaryGenre: '',
      secondaryGenres: [],
      musicalInterests: [],
      collaborationPreferences: {
        openToGenres: [],
        lookingFor: [],
        experienceLevel: 'intermediate',
        workingStyle: 'hybrid',
        timeCommitment: 'casual'
      },
      soundSignature: {
        energy: 5,
        mood: '',
        instruments: [],
        vocalStyle: '',
        productionStyle: []
      },
      inspirations: [],
      location: '',
      crossGenreExperience: {
        attempted: [],
        successful: [],
        interested: []
      }
    }
  });

  // Create/Update artist profile mutation
  const profileMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingArtist) {
        return apiRequest('PUT', `/api/collaboration/artist/${editingArtist.id}`, data);
      } else {
        return apiRequest('POST', '/api/collaboration/artist', data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Profile Saved",
        description: editingArtist ? "Artist profile updated successfully!" : "New artist profile created successfully!",
      });
      setIsProfileDialogOpen(false);
      setEditingArtist(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/collaboration/artists'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: any) => {
    profileMutation.mutate(data);
  };

  const openEditDialog = (artist: any) => {
    setEditingArtist(artist);
    form.reset(artist);
    setIsProfileDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingArtist(null);
    form.reset();
    setIsProfileDialogOpen(true);
  };

  const filteredArtists = artistsData?.artists?.filter((artist: any) => {
    const matchesGenre = filterGenre === 'all' || 
      artist.primaryGenre === filterGenre || 
      artist.secondaryGenres?.includes(filterGenre);
    
    const matchesSearch = searchQuery === '' || 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.primaryGenre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesGenre && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            🤝 Artist Collaboration Network
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Connect with artists across genres, styles, and musical beliefs. Create unexpected partnerships 
            that push creative boundaries and build lasting musical relationships.
          </p>
        </div>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="discover" className="data-[state=active]:bg-cyan-500/20">
              <Search className="w-4 h-4 mr-2" />
              Discover Artists
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-purple-500/20">
              <Heart className="w-4 h-4 mr-2" />
              AI Matches
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-pink-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Cross-Genre Opportunities
            </TabsTrigger>
            <TabsTrigger value="profiles" className="data-[state=active]:bg-green-500/20">
              <Users className="w-4 h-4 mr-2" />
              Manage Profiles
            </TabsTrigger>
          </TabsList>

          {/* Discover Artists Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 bg-gray-800/30 p-4 rounded-xl border border-gray-700">
              <div className="flex-1">
                <Input
                  placeholder="Search artists by name, genre, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>
              <Select value={filterGenre} onValueChange={setFilterGenre}>
                <SelectTrigger className="w-48 bg-gray-700/50 border-gray-600">
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genreOptions.map(genre => (
                    <SelectItem key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                <Plus className="w-4 h-4 mr-2" />
                Create Profile
              </Button>
            </div>

            {/* Artists Grid */}
            {artistsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                    <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtists.map((artist: any) => (
                  <Card key={artist.id} className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-all group">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-white group-hover:text-cyan-400 transition-colors">
                        {artist.name}
                      </CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="mb-2">
                          {artist.primaryGenre}
                        </Badge>
                        {artist.location && (
                          <div className="flex items-center justify-center text-gray-400 text-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            {artist.location}
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Sound Signature:</p>
                        <p className="text-sm text-white">{artist.soundSignature?.mood || 'Creative'}</p>
                        <div className="flex items-center mt-1">
                          <Volume2 className="w-3 h-3 mr-1 text-cyan-400" />
                          <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                              style={{ width: `${(artist.soundSignature?.energy || 5) * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 ml-1">
                            {artist.soundSignature?.energy || 5}/10
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Open to Genres:</p>
                        <div className="flex flex-wrap gap-1">
                          {artist.collaborationPreferences?.openToGenres?.slice(0, 3).map((genre: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          )) || <span className="text-xs text-gray-500">All genres</span>}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400 mb-1">Looking for:</p>
                        <div className="flex flex-wrap gap-1">
                          {artist.collaborationPreferences?.lookingFor?.slice(0, 2).map((role: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs border-cyan-500/30">
                              {role}
                            </Badge>
                          )) || <span className="text-xs text-gray-500">Open to all</span>}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedArtist(artist.id)}
                        className="border-cyan-500/30 hover:bg-cyan-500/10"
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        Find Matches
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(artist)}
                        className="border-purple-500/30 hover:bg-purple-500/10"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* AI Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            {!selectedArtist ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Select an Artist</h3>
                <p className="text-gray-500">Choose an artist from the Discover tab to see AI-powered collaboration matches</p>
              </div>
            ) : matchesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {matchesData?.matches?.map((match: any, index: number) => {
                  const partner = artistsData?.artists?.find((a: any) => a.id === match.artistB);
                  if (!partner) return null;

                  return (
                    <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                              <Music className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white">{partner.name}</CardTitle>
                              <CardDescription>{partner.primaryGenre} • {partner.location}</CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-purple-400 font-bold">
                              <Star className="w-4 h-4 mr-1" />
                              {Math.round(match.compatibility * 100)}% Match
                            </div>
                            <Badge variant="outline" className="mt-1">
                              {match.suggestedProject?.targetGenre}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-cyan-400 mb-2">Project Concept:</h4>
                          <p className="text-sm text-gray-300">{match.suggestedProject?.concept}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold text-purple-400 mb-2">Match Strengths:</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Genre Compatibility:</span>
                                <span className="text-cyan-400">{Math.round(match.matchReason.genreComplementarity * 100)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Cross-Genre Potential:</span>
                                <span className="text-purple-400">{Math.round(match.matchReason.crossGenrePotential * 100)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Skill Complement:</span>
                                <span className="text-pink-400">{Math.round(match.matchReason.skillComplementarity * 100)}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-pink-400 mb-2">Suggested Timeline:</h5>
                            <p className="text-sm text-gray-300 mb-2">{match.suggestedProject?.estimatedTimeline}</p>
                            <p className="text-xs text-gray-400">{match.suggestedProject?.fusionApproach}</p>
                          </div>
                        </div>

                        {match.inspirationSources?.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-green-400 mb-2">Common Inspirations:</h5>
                            <div className="flex flex-wrap gap-1">
                              {match.inspirationSources.map((inspiration: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {inspiration}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          className="border-purple-500/30 hover:bg-purple-500/10"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start Conversation
                        </Button>
                        <Button
                          variant="outline"
                          className="border-cyan-500/30 hover:bg-cyan-500/10"
                        >
                          <Share className="w-4 h-4 mr-2" />
                          Share Project
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Cross-Genre Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            {!selectedArtist ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Select an Artist</h3>
                <p className="text-gray-500">Choose an artist to explore cross-genre collaboration opportunities</p>
              </div>
            ) : opportunitiesLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {opportunitiesData?.opportunities?.map((opportunity: any, index: number) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-pink-500/50 transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white flex items-center">
                            <Shuffle className="w-5 h-5 mr-2 text-pink-400" />
                            {opportunity.targetGenre} Exploration
                          </CardTitle>
                          <CardDescription>Cross-genre collaboration opportunity</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-pink-400 font-bold">
                            <Target className="w-4 h-4 mr-1" />
                            {Math.round(opportunity.successPrediction * 100)}% Success Rate
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-pink-400 mb-2">Potential Partners:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {opportunity.potentialPartners?.slice(0, 4).map((partner: any, i: number) => {
                            const partnerProfile = artistsData?.artists?.find((a: any) => a.id === partner.artistId);
                            return (
                              <div key={i} className="bg-gray-700/30 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-white">{partnerProfile?.name || 'Unknown Artist'}</h5>
                                  <Badge variant="outline" className="text-xs">
                                    Expertise: {partner.expertiseLevel}/10
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-400">{partner.uniqueValue}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-cyan-400 mb-2">Project Concepts:</h4>
                        <div className="space-y-3">
                          {opportunity.projectConcepts?.map((concept: any, i: number) => (
                            <div key={i} className="bg-gray-700/30 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-white">{concept.title}</h5>
                                <div className="flex space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    Market: {Math.round(concept.marketPotential * 100)}%
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Complexity: {Math.round(concept.technicalComplexity * 100)}%
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-gray-300 mb-1">{concept.description}</p>
                              <p className="text-xs text-cyan-400">Fusion Style: {concept.fusionStyle}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {opportunity.inspirationTracks?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-green-400 mb-2">Inspiration Tracks:</h4>
                          <div className="flex flex-wrap gap-2">
                            {opportunity.inspirationTracks.map((track: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                <Play className="w-3 h-3 mr-1" />
                                {track}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start Cross-Genre Project
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Manage Profiles Tab */}
          <TabsContent value="profiles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Artist Profiles</h2>
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-green-500 to-cyan-500">
                <Plus className="w-4 h-4 mr-2" />
                Create New Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artistsData?.artists?.map((artist: any) => (
                <Card key={artist.id} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">{artist.name}</CardTitle>
                    <CardDescription>{artist.primaryGenre}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Experience:</span>
                        <span className="ml-2 text-white">{artist.collaborationPreferences?.experienceLevel}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Working Style:</span>
                        <span className="ml-2 text-white">{artist.collaborationPreferences?.workingStyle}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Cross-Genre Ready:</span>
                        <span className="ml-2 text-cyan-400">
                          {artist.crossGenreExperience?.interested?.length || 0} genres interested
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(artist)}
                      className="border-cyan-500/30 hover:bg-cyan-500/10"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedArtist(artist.id)}
                      className="border-purple-500/30 hover:bg-purple-500/10"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      View Matches
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Artist Profile Dialog */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingArtist ? 'Edit Artist Profile' : 'Create Artist Profile'}
              </DialogTitle>
              <DialogDescription>
                Build a comprehensive profile to find the perfect collaboration partners across all genres.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Artist Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="City, State/Country" className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Genre Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primaryGenre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Primary Genre</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                              <SelectValue placeholder="Select primary genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genreOptions.map(genre => (
                              <SelectItem key={genre} value={genre}>
                                {genre.charAt(0).toUpperCase() + genre.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="collaborationPreferences.experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Experience Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sound Signature */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400">Sound Signature</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="soundSignature.mood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Musical Mood</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., energetic, emotional, dark" className="bg-gray-700 border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="soundSignature.energy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Energy Level (1-10)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                min={1}
                                max={10}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="w-full"
                              />
                              <div className="text-center text-cyan-400 font-bold">{field.value}</div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Collaboration Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-400">Collaboration Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="collaborationPreferences.workingStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Working Style</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="remote">Remote</SelectItem>
                              <SelectItem value="in-person">In-Person</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="collaborationPreferences.timeCommitment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Time Commitment</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="part-time">Part-Time</SelectItem>
                              <SelectItem value="full-time">Full-Time</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsProfileDialogOpen(false)}
                    className="border-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={profileMutation.isPending}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500"
                  >
                    {profileMutation.isPending ? 'Saving...' : editingArtist ? 'Update Profile' : 'Create Profile'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}