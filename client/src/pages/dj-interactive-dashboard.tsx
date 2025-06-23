import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, Pause, SkipForward, Volume2, Users, DollarSign,
  CheckCircle, XCircle, Clock, TrendingUp, Zap, 
  Mic, Radio, Bell, Crown, Gift, Music, Vote,
  BarChart3, Activity, AlertCircle, Star
} from 'lucide-react';

interface SongRequest {
  id: string;
  track: {
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    genre: string;
  };
  requestedBy: string;
  requestType: 'paid' | 'voted';
  amount?: number;
  votes: number;
  priority: number;
  timestamp: Date;
  status: 'pending' | 'playing' | 'played' | 'rejected';
  djNotes?: string;
}

interface DJNotification {
  id: string;
  type: 'new_request' | 'high_payment' | 'popular_vote' | 'milestone';
  message: string;
  amount?: number;
  timestamp: Date;
  read: boolean;
}

interface SessionStats {
  totalRequests: number;
  totalVotes: number;
  revenue: number;
  activeListeners: number;
  hourlyRevenue: number;
  averagePerListener: number;
}

export default function DJInteractiveDashboard() {
  const [currentTrack, setCurrentTrack] = useState<SongRequest | null>(null);
  const [upcomingTracks, setUpcomingTracks] = useState<SongRequest[]>([]);
  const [allRequests, setAllRequests] = useState<SongRequest[]>([]);
  const [notifications, setNotifications] = useState<DJNotification[]>([]);
  const [stats, setStats] = useState<SessionStats>({
    totalRequests: 0,
    totalVotes: 0,
    revenue: 0,
    activeListeners: 0,
    hourlyRevenue: 0,
    averagePerListener: 0
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [sessionActive, setSessionActive] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection for DJ interface
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/voting?type=dj&session=default`;
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      console.log('DJ connected to voting system');
      getPlaylistData();
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      updateRealtimeData();
    }, 5000);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(updateInterval);
    };
  }, []);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'playlist_data':
        setAllRequests(message.playlist);
        setStats(message.stats);
        setUpcomingTracks(message.playlist.filter((r: SongRequest) => r.status === 'pending').slice(0, 10));
        break;
      case 'new_notification':
        addNotification(message.notification);
        break;
      case 'dj_action_completed':
        getPlaylistData();
        break;
    }
  };

  const getPlaylistData = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'get_playlist',
        sessionId: 'default'
      }));
    }
  };

  const updateRealtimeData = () => {
    // Simulate live metrics updates
    setStats(prev => ({
      ...prev,
      activeListeners: Math.max(10, prev.activeListeners + Math.floor((Math.random() - 0.5) * 4)),
      revenue: prev.revenue + Math.random() * 5,
      hourlyRevenue: prev.revenue / 2, // Approximate
      averagePerListener: prev.activeListeners > 0 ? prev.revenue / prev.activeListeners : 0
    }));

    // Simulate new notifications
    if (Math.random() < 0.3) { // 30% chance
      const notificationTypes = ['new_request', 'high_payment', 'popular_vote', 'milestone'];
      const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)] as any;
      
      addNotification({
        id: `notif_${Date.now()}`,
        type,
        message: getNotificationMessage(type),
        amount: type === 'high_payment' ? Math.floor(Math.random() * 50) + 25 : undefined,
        timestamp: new Date(),
        read: false
      });
    }
  };

  const getNotificationMessage = (type: string): string => {
    const messages = {
      new_request: 'New song request received',
      high_payment: 'High-value request received!',
      popular_vote: 'Song getting popular votes',
      milestone: 'Revenue milestone reached!'
    };
    return messages[type as keyof typeof messages] || 'New activity';
  };

  const addNotification = (notification: DJNotification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Keep last 20
  };

  const djAction = (action: string, requestId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'dj_action',
        sessionId: 'default',
        action,
        requestId
      }));
    }

    // Update local state immediately for responsiveness
    if (action === 'play') {
      const request = allRequests.find(r => r.id === requestId);
      if (request) {
        setCurrentTrack({...request, status: 'playing'});
        setIsPlaying(true);
      }
    } else if (action === 'reject') {
      setAllRequests(prev => prev.map(r => 
        r.id === requestId ? {...r, status: 'rejected'} : r
      ));
    }
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? {...n, read: true} : n
    ));
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* DJ Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">DJ Control Center</h1>
                  <p className="text-white/70">Interactive Crowd Voting System</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <Radio className="w-3 h-3 mr-1" />
                LIVE SESSION
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/30 rounded-lg px-3 py-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="font-mono text-lg">${stats.revenue.toFixed(0)}</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 rounded-lg px-3 py-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>{stats.activeListeners} listeners</span>
              </div>
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/20 hover:bg-white/10"
                  onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Current Track & Controls */}
        <div className="w-1/3 border-r border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="p-6 space-y-6">
            {/* Current Track */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Now Playing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentTrack ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{currentTrack.track.title}</h3>
                      <p className="text-white/70">{currentTrack.track.artist}</p>
                      <Badge className="mt-2">{currentTrack.track.genre}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {currentTrack.requestType === 'paid' ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <DollarSign className="w-3 h-3 mr-1" />
                            ${currentTrack.amount}
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            <Vote className="w-3 h-3 mr-1" />
                            {currentTrack.votes} votes
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/60">
                        Requested by {currentTrack.requestedBy}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/50">
                    <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No track currently playing</p>
                    <p className="text-sm">Select a track from the queue</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* DJ Controls */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle>DJ Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    size="lg"
                    variant={isPlaying ? "secondary" : "default"}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/20">
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-sm">75%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-play Queue</span>
                  <Button
                    size="sm"
                    variant={autoPlayEnabled ? "default" : "outline"}
                    onClick={() => setAutoPlayEnabled(!autoPlayEnabled)}
                    className={autoPlayEnabled ? "bg-green-500 hover:bg-green-600" : "border-white/20"}
                  >
                    {autoPlayEnabled ? "ON" : "OFF"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Stats */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Live Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Hourly Revenue</span>
                  <span className="font-bold text-green-400">${stats.hourlyRevenue.toFixed(0)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Avg per Listener</span>
                  <span className="font-bold text-blue-400">${stats.averagePerListener.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total Votes</span>
                  <span className="font-bold text-purple-400">{stats.totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Queue Length</span>
                  <span className="font-bold text-orange-400">{upcomingTracks.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Center Panel - Request Queue */}
        <div className="flex-1 bg-black/10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                Live Request Queue
              </h2>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-white/20">
                  Sort by Priority
                </Button>
                <Button size="sm" variant="outline" className="border-white/20">
                  Sort by Payment
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {upcomingTracks.map((request, index) => (
                <Card key={request.id} className={`
                  transition-all duration-300 border-white/10 hover:border-purple-500/30
                  ${index < 3 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20' : 'bg-white/5'}
                `}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center font-bold
                            ${index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' : 'bg-white/20'}
                          `}>
                            {index + 1}
                          </div>
                          {index === 0 && <Crown className="w-4 h-4 text-yellow-400 mt-1" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{request.track.title}</h4>
                          <p className="text-white/70">{request.track.artist}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{request.track.genre}</Badge>
                            <span className="text-xs text-white/50">
                              {Math.floor(request.track.duration / 60)}:{String(request.track.duration % 60).padStart(2, '0')}
                            </span>
                            <span className="text-xs text-white/50">
                              {new Date(request.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          {request.requestType === 'paid' ? (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-5 h-5 text-green-400" />
                              <span className="text-xl font-bold text-green-400">${request.amount}</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <Vote className="w-5 h-5 text-blue-400" />
                              <span className="text-xl font-bold text-blue-400">{request.votes}</span>
                            </div>
                          )}
                          <p className="text-sm text-white/60">Priority: {request.priority}</p>
                          <p className="text-xs text-white/50">by {request.requestedBy}</p>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            onClick={() => djAction('play', request.id)}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Play Now
                          </Button>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                              onClick={() => djAction('accept', request.id)}
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                              onClick={() => djAction('reject', request.id)}
                            >
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Notifications & Analytics */}
        <div className="w-1/3 border-l border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="p-6">
            <Tabs defaultValue="notifications" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/40">
                <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-500">
                  Notifications {unreadNotifications > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="notifications" className="mt-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`
                        cursor-pointer transition-all duration-200
                        ${notification.read ? 'bg-white/5 border-white/10' : 'bg-purple-500/20 border-purple-500/30'}
                      `}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                            ${notification.type === 'high_payment' ? 'bg-green-500/20' :
                              notification.type === 'popular_vote' ? 'bg-blue-500/20' :
                              notification.type === 'milestone' ? 'bg-yellow-500/20' : 'bg-purple-500/20'}
                          `}>
                            {notification.type === 'high_payment' ? <DollarSign className="w-4 h-4 text-green-400" /> :
                             notification.type === 'popular_vote' ? <TrendingUp className="w-4 h-4 text-blue-400" /> :
                             notification.type === 'milestone' ? <Star className="w-4 h-4 text-yellow-400" /> :
                             <Bell className="w-4 h-4 text-purple-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{notification.message}</p>
                            {notification.amount && (
                              <p className="text-lg font-bold text-green-400">${notification.amount}</p>
                            )}
                            <p className="text-xs text-white/60 mt-1">
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-4">
                <div className="space-y-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Session Performance
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/70">Session Revenue</span>
                          <span className="font-bold text-green-400">${stats.revenue.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Active Listeners</span>
                          <span className="font-bold text-blue-400">{stats.activeListeners}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Total Requests</span>
                          <span className="font-bold text-purple-400">{stats.totalRequests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Engagement Rate</span>
                          <span className="font-bold text-orange-400">
                            {stats.activeListeners > 0 ? Math.round((stats.totalVotes / stats.activeListeners) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Request Types</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/70">Paid Requests</span>
                          <span className="text-green-400">68%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Voted Requests</span>
                          <span className="text-blue-400">32%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Popular Genres</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/70">Hip-Hop</span>
                          <span className="text-purple-400">35%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">House</span>
                          <span className="text-blue-400">28%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Pop</span>
                          <span className="text-pink-400">22%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Other</span>
                          <span className="text-gray-400">15%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}