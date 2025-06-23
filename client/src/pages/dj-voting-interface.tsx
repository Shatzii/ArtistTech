import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Play, Music, Vote, DollarSign, Search, Users, 
  TrendingUp, Clock, Star, Zap, Wallet, Crown,
  Volume2, Heart, ThumbsUp, Gift, Radio,
  Mic, Trophy, FireIcon as Fire
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  genre: string;
  bpm: number;
}

interface SongRequest {
  id: string;
  track: Track;
  requestedBy: string;
  requestType: 'paid' | 'voted';
  amount?: number;
  votes: number;
  priority: number;
  timestamp: Date;
  status: 'pending' | 'playing' | 'played';
}

interface VotingSession {
  id: string;
  eventName: string;
  djName: string;
  venue: string;
  isActive: boolean;
  settings: {
    minRequestPrice: number;
    maxRequestPrice: number;
    maxVotesPerUser: number;
    maxRequestsPerUser: number;
  };
}

interface Listener {
  id: string;
  name: string;
  walletBalance: number;
  votesUsed: number;
  requestsSubmitted: number;
}

export default function DJVotingInterface() {
  const [session, setSession] = useState<VotingSession | null>(null);
  const [listener, setListener] = useState<Listener | null>(null);
  const [playlist, setPlaylist] = useState<SongRequest[]>([]);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [requestAmount, setRequestAmount] = useState([25]);
  const [currentTrack, setCurrentTrack] = useState<SongRequest | null>(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalVotes: 0,
    revenue: 0,
    activeListeners: 0
  });

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/voting?type=listener&session=default`;
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      console.log('Connected to voting system');
      // Join as listener
      joinAsListener();
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    wsRef.current.onerror = (error) => {
      console.error('Voting WebSocket error:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'connection_established':
        if (message.availableSessions.length > 0) {
          // Auto-join first available session
          const sessionId = message.availableSessions[0];
          getSessionData(sessionId);
        }
        break;
      case 'listener_joined':
        setListener({
          id: message.listenerId,
          name: 'Club Listener',
          walletBalance: 50,
          votesUsed: 0,
          requestsSubmitted: 0
        });
        setSession(message.session);
        getPlaylist();
        break;
      case 'playlist_data':
        setPlaylist(message.playlist);
        setStats(message.stats);
        break;
      case 'search_results':
        setSearchResults(message.results);
        break;
      case 'request_submitted':
        getPlaylist(); // Refresh playlist
        searchMusic(); // Refresh search
        break;
      case 'vote_recorded':
        getPlaylist(); // Refresh playlist
        break;
      case 'funds_added':
        if (listener) {
          setListener({ ...listener, walletBalance: message.newBalance });
        }
        break;
      case 'error':
        console.error('Voting error:', message.message);
        break;
    }
  };

  const joinAsListener = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'join_listener',
        sessionId: 'default',
        listenerData: {
          name: `Listener_${Math.floor(Math.random() * 1000)}`,
          initialBalance: 50,
          preferences: {
            genres: ['House', 'Hip-Hop', 'Pop'],
            explicitContent: true
          }
        }
      }));
    }
  };

  const getSessionData = (sessionId: string) => {
    // In a real implementation, this would fetch session data
    const mockSession: VotingSession = {
      id: sessionId,
      eventName: 'Saturday Night Club Mix',
      djName: 'DJ ProStudio',
      venue: 'Club Remix',
      isActive: true,
      settings: {
        minRequestPrice: 5,
        maxRequestPrice: 100,
        maxVotesPerUser: 5,
        maxRequestsPerUser: 3
      }
    };
    setSession(mockSession);
  };

  const getPlaylist = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'get_playlist',
        sessionId: session?.id || 'default'
      }));
    }
  };

  const searchMusic = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'search_music',
        query: searchQuery,
        genre: selectedGenre,
        limit: 20
      }));
    }
  };

  const submitSongRequest = (track: Track, type: 'paid' | 'voted') => {
    if (!listener || !session) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'submit_request',
        request: {
          sessionId: session.id,
          listenerId: listener.id,
          trackId: track.id,
          requestType: type,
          amount: type === 'paid' ? requestAmount[0] : undefined
        }
      }));
    }
  };

  const voteForSong = (requestId: string) => {
    if (!listener || !session) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'vote_song',
        sessionId: session.id,
        listenerId: listener.id,
        requestId
      }));
    }
  };

  const addFunds = (amount: number) => {
    if (!listener) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'add_funds',
        listenerId: listener.id,
        amount
      }));
    }
  };

  useEffect(() => {
    if (searchQuery || selectedGenre) {
      const delayedSearch = setTimeout(() => {
        searchMusic();
      }, 300);
      return () => clearTimeout(delayedSearch);
    }
  }, [searchQuery, selectedGenre]);

  const genres = ['House', 'Techno', 'Hip-Hop', 'R&B', 'Pop', 'Rock', 'EDM', 'Reggaeton', 'Afrobeats', 'Latin'];

  if (!session || !listener) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-96 bg-black/40 border-purple-500/30">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                <Radio className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Connecting to DJ Session...</h2>
              <p className="text-white/70">Setting up your voting interface</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{session.eventName}</h1>
                  <p className="text-sm text-white/70">DJ {session.djName} • {session.venue}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                LIVE
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/30 rounded-lg px-3 py-2">
                <Wallet className="w-4 h-4 text-yellow-400" />
                <span className="font-mono">${listener.walletBalance}</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 rounded-lg px-3 py-2">
                <Vote className="w-4 h-4 text-blue-400" />
                <span>{session.settings.maxVotesPerUser - listener.votesUsed} votes left</span>
              </div>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                onClick={() => addFunds(25)}
              >
                <Gift className="w-4 h-4 mr-2" />
                Add $25
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Search & Request */}
        <div className="w-1/3 border-r border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Request a Song
              </h2>
              
              <div className="space-y-4">
                <Input
                  placeholder="Search for songs, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre} className="bg-black">{genre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Results */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((track) => (
                <Card key={track.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{track.title}</h4>
                        <p className="text-sm text-white/70 truncate">{track.artist}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{track.genre}</Badge>
                          <span className="text-xs text-white/50">{Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                          onClick={() => submitSongRequest(track, 'voted')}
                          disabled={listener.votesUsed >= session.settings.maxVotesPerUser}
                        >
                          <Vote className="w-3 h-3 mr-1" />
                          Vote
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          onClick={() => submitSongRequest(track, 'paid')}
                          disabled={listener.walletBalance < requestAmount[0]}
                        >
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${requestAmount[0]}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Amount Slider */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Request Amount</label>
                <span className="text-lg font-bold text-green-400">${requestAmount[0]}</span>
              </div>
              <Slider
                value={requestAmount}
                onValueChange={setRequestAmount}
                max={session.settings.maxRequestPrice}
                min={session.settings.minRequestPrice}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-white/60">Higher amounts get priority placement</p>
            </div>
          </div>
        </div>

        {/* Center Panel - Live Playlist */}
        <div className="flex-1 bg-black/10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
                Live Requests Queue
              </h2>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Music className="w-4 h-4 text-blue-400" />
                  <span>{stats.totalRequests} requests</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Vote className="w-4 h-4 text-purple-400" />
                  <span>{stats.totalVotes} votes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span>${stats.revenue}</span>
                </div>
              </div>
            </div>

            {/* Current Playing Track */}
            {currentTrack && (
              <Card className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">NOW PLAYING</h3>
                      <p className="text-xl">{currentTrack.track.title}</p>
                      <p className="text-white/70">{currentTrack.track.artist}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-2">
                        {currentTrack.requestType === 'paid' ? `$${currentTrack.amount}` : `${currentTrack.votes} votes`}
                      </Badge>
                      <p className="text-sm text-white/70">Requested by {currentTrack.requestedBy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Playlist Queue */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {playlist.map((request, index) => (
                <Card key={request.id} className={`
                  transition-all duration-300 border-white/10
                  ${request.status === 'playing' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30' : 
                    index < 3 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-white/5'}
                `}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/20'}
                          `}>
                            {index + 1}
                          </div>
                          {index < 3 && <Crown className="w-4 h-4 text-yellow-400 mt-1" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{request.track.title}</h4>
                          <p className="text-sm text-white/70">{request.track.artist}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">{request.track.genre}</Badge>
                            <span className="text-xs text-white/50">
                              {Math.floor(request.track.duration / 60)}:{String(request.track.duration % 60).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          {request.requestType === 'paid' ? (
                            <div className="flex items-center space-x-1 text-green-400">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-bold">${request.amount}</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-blue-400">
                              <Vote className="w-4 h-4" />
                              <span className="font-bold">{request.votes}</span>
                            </div>
                          )}
                          <p className="text-xs text-white/60 mt-1">
                            Priority: {request.priority}
                          </p>
                        </div>
                        {request.requestType === 'voted' && request.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                            onClick={() => voteForSong(request.id)}
                            disabled={listener.votesUsed >= session.settings.maxVotesPerUser}
                          >
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Vote
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Stats & Activity */}
        <div className="w-1/4 border-l border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Live Stats
              </h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Active Listeners</span>
                    <span className="text-xl font-bold text-blue-400">{stats.activeListeners}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Total Revenue</span>
                    <span className="text-xl font-bold text-green-400">${stats.revenue}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Total Votes</span>
                    <span className="text-xl font-bold text-purple-400">{stats.totalVotes}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Queue Length</span>
                    <span className="text-xl font-bold text-orange-400">{stats.totalRequests}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Your Activity
              </h3>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Requests Made</span>
                    <span className="font-bold">{listener.requestsSubmitted}/{session.settings.maxRequestsPerUser}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Votes Used</span>
                    <span className="font-bold">{listener.votesUsed}/{session.settings.maxVotesPerUser}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Wallet Balance</span>
                    <span className="font-bold text-yellow-400">${listener.walletBalance}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Fire className="w-5 h-5 mr-2" />
                How It Works
              </h3>
              <div className="space-y-3 text-sm text-white/70">
                <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                  <h4 className="font-medium text-blue-400 mb-1">Voting System</h4>
                  <p>Vote for songs to increase their priority. More votes = higher in queue!</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                  <h4 className="font-medium text-green-400 mb-1">Paid Requests</h4>
                  <p>Pay to guarantee your song gets played. Higher payments get instant priority!</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <h4 className="font-medium text-purple-400 mb-1">Interactive DJ</h4>
                  <p>The DJ sees all requests live and can accept, play, or interact with the crowd!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}