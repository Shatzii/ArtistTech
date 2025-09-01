import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { 
  Play, Pause, RotateCcw, Volume2, Mic, Users, Music, TrendingUp, Radio, 
  Headphones, Settings, Disc3, SkipForward, SkipBack, Heart, MessageCircle, 
  Share2, DollarSign, Zap, Sliders, Sparkles, BarChart3, Monitor, Activity,
  Crown, Star, Target, Wand2, Shuffle, Repeat, Eye, EyeOff, Clock, Maximize2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function CuttingEdgeDJStudio() {
  // Advanced DJ State Management
  const [isPlaying, setIsPlaying] = useState({ deckA: false, deckB: false });
  const [crossfaderPosition, setCrossfaderPosition] = useState(50);
  const [masterVolume, setMasterVolume] = useState(75);
  const [headphoneVolume, setHeadphoneVolume] = useState(60);
  const [masterEQ, setMasterEQ] = useState({ high: 50, mid: 50, low: 50 });
  const [activeTab, setActiveTab] = useState("mixing");
  
  // Live Performance Metrics
  const [liveStats, setLiveStats] = useState({
    listeners: 2847,
    earnings: 486.30,
    votes: 127,
    energy: 94,
    engagement: 87,
    requests: 23
  });

  // Professional Track System
  const [decks, setDecks] = useState({
    deckA: {
      track: {
        title: "Midnight Chronicles",
        artist: "Neural Beats",
        bpm: 128,
        key: "C Major",
        duration: 245,
        position: 67,
        energy: 92,
        genre: "Progressive House"
      },
      volume: 85,
      eq: { high: 52, mid: 48, low: 55 },
      effects: { reverb: 0, delay: 0, filter: 50, echo: 0, flanger: 0 },
      cue: false,
      sync: true,
      keylock: true,
      playing: false,
      loading: false
    },
    deckB: {
      track: {
        title: "Digital Dreams",
        artist: "AI Symphony",
        bpm: 132,
        key: "G Minor",
        duration: 198,
        position: 23,
        energy: 88,
        genre: "Tech House"
      },
      volume: 80,
      eq: { high: 48, mid: 52, low: 47 },
      effects: { reverb: 0, delay: 0, filter: 50, echo: 0, flanger: 0 },
      cue: false,
      sync: false,
      keylock: true,
      playing: false,
      loading: false
    }
  });

  // Advanced Features
  const [features, setFeatures] = useState({
    harmonicMixing: true,
    stemSeparation: false,
    crowdAnalytics: true,
    aiSuggestions: true,
    liveVoting: true,
    autoMix: false,
    smartTransitions: true,
    beatMatching: true
  });

  // Crowd Analytics & Voting
  const [crowdData, setCrowdData] = useState({
    energyLevel: 94,
    danceIntensity: 87,
    faceDetection: 312,
    vocalResponse: 78,
    peakTime: "23:45",
    favoriteGenre: "Progressive House",
    requestedTracks: [
      { title: "Epic Drops", votes: 45, priority: "high" },
      { title: "Bass Revolution", votes: 32, priority: "medium" },
      { title: "Synth Dreams", votes: 28, priority: "medium" }
    ]
  });

  // Real-time Waveform Data
  const [waveforms, setWaveforms] = useState({
    deckA: Array.from({ length: 64 }, () => Math.random() * 100),
    deckB: Array.from({ length: 64 }, () => Math.random() * 100)
  });

  // Professional Hardware Integration
  const [hardware, setHardware] = useState({
    cdj3000Connected: true,
    djm900Connected: true,
    ledFeedback: true,
    motorFaders: true,
    jogWheels: true,
    hotCues: Array.from({ length: 8 }, (_, i) => ({ id: i + 1, active: false, time: 0 }))
  });

  // Real-time Updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update live stats
      setLiveStats(prev => ({
        ...prev,
        listeners: prev.listeners + Math.floor(Math.random() * 10 - 5),
        earnings: prev.earnings + Math.random() * 2,
        energy: 85 + Math.random() * 15,
        engagement: 80 + Math.random() * 20
      }));

      // Update waveforms
      if (decks.deckA.playing || decks.deckB.playing) {
        setWaveforms(prev => ({
          deckA: prev.deckA.map(() => Math.random() * 100),
          deckB: prev.deckB.map(() => Math.random() * 100)
        }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [decks.deckA.playing, decks.deckB.playing]);

  // Professional API Integration
  const queryClient = useQueryClient();

  const mixMutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/dj/mix', 'POST', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/dj/status"] })
  });

  const votingQuery = useQuery({
    queryKey: ["/api/dj/voting"],
    refetchInterval: 5000
  });

  // Advanced Control Functions
  const handleDeckPlay = (deck: 'deckA' | 'deckB') => {
    setDecks(prev => ({
      ...prev,
      [deck]: { ...prev[deck], playing: !prev[deck].playing }
    }));
    
    mixMutation.mutate({
      action: 'play',
      deck,
      trackId: decks[deck].track.title
    });
  };

  const handleCrossfaderChange = (value: number[]) => {
    setCrossfaderPosition(value[0]);
    mixMutation.mutate({
      action: 'crossfade',
      position: value[0]
    });
  };

  const handleEQChange = (deck: 'deckA' | 'deckB', band: string, value: number) => {
    setDecks(prev => ({
      ...prev,
      [deck]: {
        ...prev[deck],
        eq: { ...prev[deck].eq, [band]: value }
      }
    }));
  };

  const handleEffectChange = (deck: 'deckA' | 'deckB', effect: string, value: number) => {
    setDecks(prev => ({
      ...prev,
      [deck]: {
        ...prev[deck],
        effects: { ...prev[deck].effects, [effect]: value }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-orange-900/20 text-white">
      {/* Professional DJ Header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-red-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Disc3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Professional DJ Studio</h1>
                <p className="text-sm text-gray-400">Pioneer CDJ-3000 • DJM-900NXS2 • Live Performance</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{liveStats.listeners.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Live Listeners</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">${liveStats.earnings.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">Tonight's Earnings</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-400">{liveStats.energy}%</div>
                  <div className="text-xs text-gray-400">Crowd Energy</div>
                </div>
              </div>
              
              <Badge variant="outline" className="text-red-400 border-red-400 animate-pulse">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                LIVE
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Master DJ Control Surface */}
        <Card className="bg-gray-800/50 border-red-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Master Controls */}
              <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">MASTER</h3>
                  <Badge variant="outline" className="text-xs">CDJ-3000</Badge>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">VOLUME</div>
                    <Slider
                      value={[masterVolume]}
                      onValueChange={(v) => setMasterVolume(v[0])}
                      className="w-full"
                    />
                    <div className="text-xs mt-1">{masterVolume}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">HEADPHONES</div>
                    <Slider
                      value={[headphoneVolume]}
                      onValueChange={(v) => setHeadphoneVolume(v[0])}
                      className="w-full"
                    />
                    <div className="text-xs mt-1">{headphoneVolume}</div>
                  </div>
                </div>
              </div>

              {/* Crossfader */}
              <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">CROSSFADER</h3>
                  <div className="text-xs text-blue-400">
                    {crossfaderPosition < 40 ? 'A' : crossfaderPosition > 60 ? 'B' : 'MIX'}
                  </div>
                </div>
                <div className="space-y-3">
                  <Slider
                    value={[crossfaderPosition]}
                    onValueChange={handleCrossfaderChange}
                    className="w-full"
                  />
                  <div className="grid grid-cols-3 text-xs text-center">
                    <div className={crossfaderPosition < 40 ? 'text-red-400 font-bold' : 'text-gray-400'}>A</div>
                    <div className={crossfaderPosition >= 40 && crossfaderPosition <= 60 ? 'text-green-400 font-bold' : 'text-gray-400'}>MIX</div>
                    <div className={crossfaderPosition > 60 ? 'text-blue-400 font-bold' : 'text-gray-400'}>B</div>
                  </div>
                </div>
              </div>

              {/* Master EQ */}
              <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">MASTER EQ</h3>
                  <Button size="sm" variant="ghost" className="h-6 text-xs">
                    RESET
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">HIGH</div>
                    <Slider
                      orientation="vertical"
                      value={[masterEQ.high]}
                      onValueChange={([v]) => setMasterEQ(prev => ({ ...prev, high: v }))}
                      className="h-16 mx-auto"
                    />
                    <div className="text-xs mt-1">{masterEQ.high}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">MID</div>
                    <Slider
                      orientation="vertical"
                      value={[masterEQ.mid]}
                      onValueChange={([v]) => setMasterEQ(prev => ({ ...prev, mid: v }))}
                      className="h-16 mx-auto"
                    />
                    <div className="text-xs mt-1">{masterEQ.mid}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">LOW</div>
                    <Slider
                      orientation="vertical"
                      value={[masterEQ.low]}
                      onValueChange={([v]) => setMasterEQ(prev => ({ ...prev, low: v }))}
                      className="h-16 mx-auto"
                    />
                    <div className="text-xs mt-1">{masterEQ.low}</div>
                  </div>
                </div>
              </div>

              {/* Crowd Analytics */}
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">CROWD AI</h3>
                  <Eye className="w-4 h-4 text-purple-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Energy</span>
                    <span className="text-red-400 font-bold">{crowdData.energyLevel}%</span>
                  </div>
                  <Progress value={crowdData.energyLevel} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span>Dancing</span>
                    <span className="text-green-400 font-bold">{crowdData.danceIntensity}%</span>
                  </div>
                  <Progress value={crowdData.danceIntensity} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span>Faces</span>
                    <span className="text-blue-400 font-bold">{crowdData.faceDetection}</span>
                  </div>
                </div>
              </div>

              {/* Live Performance Stats */}
              <div className="bg-gradient-to-br from-yellow-900/50 to-amber-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">PERFORMANCE</h3>
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Votes</span>
                    <span className="text-yellow-400 font-bold">{liveStats.votes}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Requests</span>
                    <span className="text-orange-400 font-bold">{liveStats.requests}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Engagement</span>
                    <span className="text-green-400 font-bold">{liveStats.engagement}%</span>
                  </div>
                  <div className="text-center text-xs text-gray-400 mt-2">
                    Peak: {crowdData.peakTime}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dual Deck Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Deck A */}
          <Card className="bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-600/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{decks.deckA.track.title}</div>
                    <div className="text-sm text-gray-400">{decks.deckA.track.artist}</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-red-400 border-red-400">
                  {decks.deckA.track.bpm} BPM
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Waveform Display */}
              <div className="bg-gray-900 rounded-lg p-3 h-24 relative overflow-hidden">
                <div className="flex items-center h-full space-x-1">
                  {waveforms.deckA.map((amplitude, i) => (
                    <div key={i} className="flex-1 bg-gray-700 rounded relative">
                      <div 
                        className={`bg-gradient-to-t ${decks.deckA.playing ? 'from-red-500 to-orange-500' : 'from-gray-500 to-gray-400'} rounded transition-all duration-75`}
                        style={{ height: `${amplitude}%`, minHeight: '2px' }}
                      />
                    </div>
                  ))}
                </div>
                {/* Progress indicator */}
                <div className="absolute top-2 left-2 text-xs text-white bg-red-600 px-2 py-1 rounded">
                  {Math.floor(decks.deckA.track.position / 60)}:{(decks.deckA.track.position % 60).toString().padStart(2, '0')}
                </div>
                <div className="absolute top-2 right-2 text-xs text-gray-300">
                  {decks.deckA.track.key} • {decks.deckA.track.genre}
                </div>
              </div>

              {/* Deck Controls */}
              <div className="grid grid-cols-2 gap-4">
                {/* Transport */}
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    <Button size="sm" onClick={() => handleDeckPlay('deckA')} 
                            className={decks.deckA.playing ? 'bg-green-600' : 'bg-red-600'}>
                      {decks.deckA.playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" 
                            className={decks.deckA.cue ? 'bg-orange-600' : ''}>
                      CUE
                    </Button>
                    <Button size="sm" variant="outline"
                            className={decks.deckA.sync ? 'bg-blue-600' : ''}>
                      SYNC
                    </Button>
                    <Button size="sm" variant="outline"
                            className={decks.deckA.keylock ? 'bg-purple-600' : ''}>
                      KEY
                    </Button>
                  </div>
                  
                  {/* Volume Fader */}
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-2">VOLUME</div>
                    <Slider
                      orientation="vertical"
                      value={[decks.deckA.volume]}
                      onValueChange={([v]) => setDecks(prev => ({
                        ...prev,
                        deckA: { ...prev.deckA, volume: v }
                      }))}
                      className="h-20 mx-auto"
                    />
                    <div className="text-xs mt-2">{decks.deckA.volume}</div>
                  </div>
                </div>

                {/* EQ Section */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-center">3-BAND EQ</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">HIGH</div>
                      <Slider
                        orientation="vertical"
                        value={[decks.deckA.eq.high]}
                        onValueChange={([v]) => handleEQChange('deckA', 'high', v)}
                        className="h-16 mx-auto"
                      />
                      <div className="text-xs">{decks.deckA.eq.high}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">MID</div>
                      <Slider
                        orientation="vertical"
                        value={[decks.deckA.eq.mid]}
                        onValueChange={([v]) => handleEQChange('deckA', 'mid', v)}
                        className="h-16 mx-auto"
                      />
                      <div className="text-xs">{decks.deckA.eq.mid}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">LOW</div>
                      <Slider
                        orientation="vertical"
                        value={[decks.deckA.eq.low]}
                        onValueChange={([v]) => handleEQChange('deckA', 'low', v)}
                        className="h-16 mx-auto"
                      />
                      <div className="text-xs">{decks.deckA.eq.low}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Effects Section */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-xs font-bold mb-3 text-center">EFFECTS RACK</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">Reverb</span>
                      <span className="text-xs">{decks.deckA.effects.reverb}%</span>
                    </div>
                    <Slider
                      value={[decks.deckA.effects.reverb]}
                      onValueChange={([v]) => handleEffectChange('deckA', 'reverb', v)}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">Delay</span>
                      <span className="text-xs">{decks.deckA.effects.delay}%</span>
                    </div>
                    <Slider
                      value={[decks.deckA.effects.delay]}
                      onValueChange={([v]) => handleEffectChange('deckA', 'delay', v)}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">Filter</span>
                      <span className="text-xs">{decks.deckA.effects.filter}%</span>
                    </div>
                    <Slider
                      value={[decks.deckA.effects.filter]}
                      onValueChange={([v]) => handleEffectChange('deckA', 'filter', v)}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">Echo</span>
                      <span className="text-xs">{decks.deckA.effects.echo}%</span>
                    </div>
                    <Slider
                      value={[decks.deckA.effects.echo]}
                      onValueChange={([v]) => handleEffectChange('deckA', 'echo', v)}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              {/* Hot Cues */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-xs font-bold mb-3 text-center">HOT CUES</div>
                <div className="grid grid-cols-4 gap-2">
                  {hardware.hotCues.slice(0, 4).map((cue) => (
                    <Button key={cue.id} size="sm" variant="outline" 
                            className={`h-8 text-xs ${cue.active ? 'bg-red-600' : ''}`}>
                      {cue.id}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deck B - Similar structure with blue theme */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-600/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold">B</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{decks.deckB.track.title}</div>
                    <div className="text-sm text-gray-400">{decks.deckB.track.artist}</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {decks.deckB.track.bpm} BPM
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Waveform Display */}
              <div className="bg-gray-900 rounded-lg p-3 h-24 relative overflow-hidden">
                <div className="flex items-center h-full space-x-1">
                  {waveforms.deckB.map((amplitude, i) => (
                    <div key={i} className="flex-1 bg-gray-700 rounded relative">
                      <div 
                        className={`bg-gradient-to-t ${decks.deckB.playing ? 'from-blue-500 to-cyan-500' : 'from-gray-500 to-gray-400'} rounded transition-all duration-75`}
                        style={{ height: `${amplitude}%`, minHeight: '2px' }}
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute top-2 left-2 text-xs text-white bg-blue-600 px-2 py-1 rounded">
                  {Math.floor(decks.deckB.track.position / 60)}:{(decks.deckB.track.position % 60).toString().padStart(2, '0')}
                </div>
                <div className="absolute top-2 right-2 text-xs text-gray-300">
                  {decks.deckB.track.key} • {decks.deckB.track.genre}
                </div>
              </div>

              {/* Similar control structure as Deck A but with blue theme */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    <Button size="sm" onClick={() => handleDeckPlay('deckB')} 
                            className={decks.deckB.playing ? 'bg-green-600' : 'bg-blue-600'}>
                      {decks.deckB.playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline">CUE</Button>
                    <Button size="sm" variant="outline">SYNC</Button>
                    <Button size="sm" variant="outline" className="bg-purple-600">KEY</Button>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-2">VOLUME</div>
                    <Slider
                      orientation="vertical"
                      value={[decks.deckB.volume]}
                      onValueChange={([v]) => setDecks(prev => ({
                        ...prev,
                        deckB: { ...prev.deckB, volume: v }
                      }))}
                      className="h-20 mx-auto"
                    />
                    <div className="text-xs mt-2">{decks.deckB.volume}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-center">3-BAND EQ</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['high', 'mid', 'low'].map((band) => (
                      <div key={band} className="text-center">
                        <div className="text-xs text-gray-400">{band.toUpperCase()}</div>
                        <Slider
                          orientation="vertical"
                          value={[decks.deckB.eq[band as keyof typeof decks.deckB.eq]]}
                          onValueChange={([v]) => handleEQChange('deckB', band, v)}
                          className="h-16 mx-auto"
                        />
                        <div className="text-xs">{decks.deckB.eq[band as keyof typeof decks.deckB.eq]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Effects and Hot Cues similar to Deck A */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-xs font-bold mb-3 text-center">EFFECTS RACK</div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(decks.deckB.effects).slice(0, 4).map(([effect, value]) => (
                    <div key={effect}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs capitalize">{effect}</span>
                        <span className="text-xs">{value}%</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([v]) => handleEffectChange('deckB', effect, v)}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-xs font-bold mb-3 text-center">HOT CUES</div>
                <div className="grid grid-cols-4 gap-2">
                  {hardware.hotCues.slice(4, 8).map((cue) => (
                    <Button key={cue.id} size="sm" variant="outline" className="h-8 text-xs">
                      {cue.id}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Voting & Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Live Voting */}
          <Card className="bg-gray-800 border-yellow-600/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                Live Voting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {crowdData.requestedTracks.map((track, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div>
                      <div className="text-sm font-medium">{track.title}</div>
                      <div className="text-xs text-gray-400">{track.votes} votes</div>
                    </div>
                    <Badge variant={track.priority === 'high' ? 'destructive' : 'secondary'}>
                      {track.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Analytics */}
          <Card className="bg-gray-800 border-green-600/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Energy Level</span>
                    <span className="text-sm font-bold text-red-400">{crowdData.energyLevel}%</span>
                  </div>
                  <Progress value={crowdData.energyLevel} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Dance Response</span>
                    <span className="text-sm font-bold text-green-400">{crowdData.danceIntensity}%</span>
                  </div>
                  <Progress value={crowdData.danceIntensity} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Vocal Response</span>
                    <span className="text-sm font-bold text-blue-400">{crowdData.vocalResponse}%</span>
                  </div>
                  <Progress value={crowdData.vocalResponse} className="h-2" />
                </div>
                <div className="text-center text-sm text-gray-400">
                  Favorite: {crowdData.favoriteGenre}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="bg-gray-800 border-purple-600/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Suggest Next Track
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Target className="w-4 h-4 mr-2" />
                  Perfect Transition
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Activity className="w-4 h-4 mr-2" />
                  Analyze Mix
                </Button>
                <div className="text-xs text-gray-400 text-center mt-4">
                  AI Confidence: 94%<br />
                  Next suggestion in {Math.floor(Math.random() * 30 + 10)}s
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}