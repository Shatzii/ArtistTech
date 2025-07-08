import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { 
  Users, Heart, Star, Music, Video, Mic, MessageCircle, 
  MapPin, Calendar, Trophy, Award, Share2, Play, Pause,
  Search, Filter, ArrowRight, CheckCircle, Clock, Zap
} from 'lucide-react';

export default function ArtistCollaboration() {
  const queryClient = useQueryClient();
  
  // Collaboration state
  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'projects' | 'network'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('');

  const [discoveredArtists, setDiscoveredArtists] = useState([
    {
      id: 1,
      name: 'Luna Rodriguez',
      genre: 'Electronic Pop',
      location: 'Los Angeles, CA',
      compatibility: 94,
      followers: 25600,
      avatar: '🎵',
      specialties: ['Vocals', 'Songwriting', 'Production'],
      recentWork: 'Midnight Vibes EP',
      status: 'Available',
      matchReason: 'Similar electronic influences and vocal style'
    },
    {
      id: 2,
      name: 'Marcus Thompson',
      genre: 'Hip-Hop',
      location: 'Atlanta, GA',
      compatibility: 87,
      followers: 34200,
      avatar: '🎤',
      specialties: ['Rap', 'Mixing', 'Beat Making'],
      recentWork: 'Urban Stories Album',
      status: 'Busy',
      matchReason: 'Complementary skills in rhythm and flow'
    },
    {
      id: 3,
      name: 'Aria Chen',
      genre: 'Indie Folk',
      location: 'Portland, OR',
      compatibility: 91,
      followers: 18900,
      avatar: '🎸',
      specialties: ['Guitar', 'Harmonies', 'Storytelling'],
      recentWork: 'Whispering Pines',
      status: 'Available',
      matchReason: 'Exceptional harmonic sensibilities'
    },
    {
      id: 4,
      name: 'DJ Neon',
      genre: 'Electronic Dance',
      location: 'Miami, FL',
      compatibility: 89,
      followers: 42800,
      avatar: '🎧',
      specialties: ['DJ Sets', 'Remixing', 'Live Performance'],
      recentWork: 'Festival Circuit 2024',
      status: 'Available',
      matchReason: 'Perfect for electronic crossover projects'
    }
  ]);

  const [collaborationRequests, setCollaborationRequests] = useState([
    {
      id: 1,
      artist: 'Sophie Martinez',
      project: 'Summer Anthem Collab',
      type: 'Feature Request',
      message: 'Love your latest track! Would love to add vocals to a summer anthem I\'m working on.',
      status: 'pending',
      date: '2 days ago',
      genre: 'Pop'
    },
    {
      id: 2,
      artist: 'Beat Maker Pro',
      project: 'Beat Pack Collaboration',
      type: 'Production',
      message: 'Interested in co-producing a beat pack for upcoming artists.',
      status: 'accepted',
      date: '1 week ago',
      genre: 'Hip-Hop'
    },
    {
      id: 3,
      artist: 'Indie Collective',
      project: 'Compilation Album',
      type: 'Album Feature',
      message: 'We\'re curating an indie compilation and would love to feature your work.',
      status: 'pending',
      date: '3 days ago',
      genre: 'Indie'
    }
  ]);

  const [activeProjects, setActiveProjects] = useState([
    {
      id: 1,
      name: 'Neon Dreams',
      collaborators: ['Luna Rodriguez', 'DJ Neon'],
      progress: 75,
      deadline: '2024-03-15',
      status: 'In Progress',
      type: 'Single',
      genre: 'Electronic Pop'
    },
    {
      id: 2,
      name: 'Urban Stories Remix',
      collaborators: ['Marcus Thompson'],
      progress: 45,
      deadline: '2024-03-22',
      status: 'In Progress',
      type: 'Remix',
      genre: 'Hip-Hop'
    },
    {
      id: 3,
      name: 'Indie Folk Sessions',
      collaborators: ['Aria Chen', 'Mountain Echo'],
      progress: 90,
      deadline: '2024-03-10',
      status: 'Final Review',
      type: 'EP',
      genre: 'Indie Folk'
    }
  ]);

  const [networkStats, setNetworkStats] = useState({
    totalConnections: 156,
    activeCollaborations: 8,
    completedProjects: 23,
    avgCompatibility: 87.5,
    genreReach: 12,
    monthlyGrowth: 15.2
  });

  const genres = [
    'Electronic', 'Hip-Hop', 'Pop', 'Indie', 'Rock', 'R&B', 'Jazz', 'Folk', 'Classical', 'Ambient'
  ];

  // Fetch collaboration data
  const { data: collaborationData, isLoading } = useQuery({
    queryKey: ['/api/collaboration/artists'],
    refetchInterval: 60000
  });

  // Send collaboration request mutation
  const sendRequestMutation = useMutation({
    mutationFn: async (artistId: number) => {
      const response = await apiRequest('POST', '/api/collaboration/request', {
        artistId,
        message: 'I\'d love to collaborate on a new project!'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/collaboration/artists'] });
    }
  });

  // Accept collaboration request mutation
  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await apiRequest('POST', '/api/collaboration/accept', {
        requestId
      });
      return response.json();
    },
    onSuccess: () => {
      setCollaborationRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' } : req
      ));
    }
  });

  // Filter artists based on search and preferences
  const filteredArtists = discoveredArtists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artist.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenres.length === 0 || selectedGenres.some(genre => 
      artist.genre.toLowerCase().includes(genre.toLowerCase())
    );
    const matchesLocation = !locationFilter || artist.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesGenre && matchesLocation;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'text-green-400';
      case 'Busy': return 'text-yellow-400';
      case 'Offline': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Artist Collaboration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-purple-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-purple-400 hover:text-purple-300">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6" />
              Artist Collaboration Network
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500/20 px-3 py-1 rounded-full text-blue-300 text-sm">
              {networkStats.totalConnections} Connections
            </div>
            <div className="bg-green-500/20 px-3 py-1 rounded-full text-green-300 text-sm">
              {networkStats.activeCollaborations} Active
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-800/30 to-cyan-800/30 rounded-lg p-4 border border-blue-500/30">
            <div className="text-blue-300 text-sm">Total Connections</div>
            <div className="text-2xl font-bold text-white">{networkStats.totalConnections}</div>
          </div>
          <div className="bg-gradient-to-r from-green-800/30 to-emerald-800/30 rounded-lg p-4 border border-green-500/30">
            <div className="text-green-300 text-sm">Active Projects</div>
            <div className="text-2xl font-bold text-white">{networkStats.activeCollaborations}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-lg p-4 border border-purple-500/30">
            <div className="text-purple-300 text-sm">Completed</div>
            <div className="text-2xl font-bold text-white">{networkStats.completedProjects}</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-800/30 to-orange-800/30 rounded-lg p-4 border border-yellow-500/30">
            <div className="text-yellow-300 text-sm">Avg. Compatibility</div>
            <div className="text-2xl font-bold text-white">{networkStats.avgCompatibility}%</div>
          </div>
          <div className="bg-gradient-to-r from-red-800/30 to-pink-800/30 rounded-lg p-4 border border-red-500/30">
            <div className="text-red-300 text-sm">Genre Reach</div>
            <div className="text-2xl font-bold text-white">{networkStats.genreReach}</div>
          </div>
          <div className="bg-gradient-to-r from-indigo-800/30 to-purple-800/30 rounded-lg p-4 border border-indigo-500/30">
            <div className="text-indigo-300 text-sm">Monthly Growth</div>
            <div className="text-2xl font-bold text-white">+{networkStats.monthlyGrowth}%</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
            {[
              { id: 'discover', label: 'Discover Artists', icon: Search },
              { id: 'requests', label: 'Collaboration Requests', icon: MessageCircle },
              { id: 'projects', label: 'Active Projects', icon: Music },
              { id: 'network', label: 'My Network', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Discover Artists Tab */}
        {activeTab === 'discover' && (
          <div>
            {/* Search and Filters */}
            <div className="mb-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Search Artists</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or genre..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Location</label>
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="Filter by location..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {genres.slice(0, 5).map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenres(prev => 
                          prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
                        )}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedGenres.includes(genre)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Artist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtists.map((artist) => (
                <div key={artist.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{artist.avatar}</div>
                      <div>
                        <h3 className="text-white font-bold">{artist.name}</h3>
                        <p className="text-gray-400 text-sm">{artist.genre}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(artist.status)}`}>
                      {artist.status}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{artist.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{artist.followers.toLocaleString()} followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm font-bold ${getCompatibilityColor(artist.compatibility)}`}>
                        {artist.compatibility}% compatibility
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {artist.specialties.map((specialty, index) => (
                        <div key={index} className="bg-purple-500/20 px-2 py-1 rounded text-purple-300 text-xs">
                          {specialty}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Recent Work:</p>
                    <p className="text-white text-sm font-medium">{artist.recentWork}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">AI Match Reason:</p>
                    <p className="text-gray-300 text-sm">{artist.matchReason}</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => sendRequestMutation.mutate(artist.id)}
                      disabled={artist.status === 'Busy'}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        artist.status === 'Busy' 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                    >
                      {artist.status === 'Busy' ? 'Unavailable' : 'Request Collab'}
                    </button>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collaboration Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {collaborationRequests.map((request) => (
              <div key={request.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold">{request.project}</h3>
                    <p className="text-gray-400">from {request.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-500/20 px-3 py-1 rounded-full text-purple-300 text-sm">
                      {request.type}
                    </div>
                    <div className="bg-blue-500/20 px-3 py-1 rounded-full text-blue-300 text-sm">
                      {request.genre}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{request.message}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{request.date}</span>
                  <div className="flex gap-2">
                    {request.status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => acceptRequestMutation.mutate(request.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                        >
                          Accept
                        </button>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium">
                          Decline
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Accepted</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Projects Tab */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project) => (
              <div key={project.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">{project.name}</h3>
                  <div className="bg-purple-500/20 px-3 py-1 rounded-full text-purple-300 text-sm">
                    {project.type}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">
                      {project.collaborators.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">Due: {project.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{project.genre}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' :
                    project.status === 'Final Review' ? 'bg-green-500/20 text-green-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {project.status}
                  </div>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}