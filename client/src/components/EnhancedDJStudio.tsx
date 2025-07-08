import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, Square, Volume2, RotateCcw, Sliders, 
  Filter, Zap, Radio, Music, Headphones, Sync, 
  Shuffle, Settings, Upload, Download, Crosshair,
  Activity, TrendingUp, Users, Eye, Mic, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Waveform from './Waveform';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface DJTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  bpm: number;
  key: string;
  genre: string;
  energy: number;
  url: string;
  waveformData?: number[];
}

interface DJDeck {
  id: 'A' | 'B';
  track: DJTrack | null;
  isPlaying: boolean;
  isLoaded: boolean;
  volume: number;
  eq: {
    high: number;
    mid: number;
    low: number;
  };
  effects: {
    reverb: number;
    delay: number;
    filter: number;
    flanger: number;
  };
  cue: boolean;
  pitch: number;
  loop: {
    enabled: boolean;
    start: number;
    end: number;
  };
  hotCues: Array<{ position: number; label: string }>;
}

interface CrowdMetrics {
  energy: number;
  engagement: number;
  danceability: number;
  requests: Array<{ track: string; votes: number; tip: number }>;
}

export default function EnhancedDJStudio() {
  const audioEngine = useAudioEngine();
  const wsRef = useRef<WebSocket>();
  
  const [decks, setDecks] = useState<{ A: DJDeck; B: DJDeck }>({
    A: {
      id: 'A',
      track: null,
      isPlaying: false,
      isLoaded: false,
      volume: 80,
      eq: { high: 50, mid: 50, low: 50 },
      effects: { reverb: 0, delay: 0, filter: 50, flanger: 0 },
      cue: false,
      pitch: 0,
      loop: { enabled: false, start: 0, end: 0 },
      hotCues: []
    },
    B: {
      id: 'B',
      track: null,
      isPlaying: false,
      isLoaded: false,
      volume: 80,
      eq: { high: 50, mid: 50, low: 50 },
      effects: { reverb: 0, delay: 0, filter: 50, flanger: 0 },
      cue: false,
      pitch: 0,
      loop: { enabled: false, start: 0, end: 0 },
      hotCues: []
    }
  });

  const [mixer, setMixer] = useState({
    crossfader: 50,
    masterVolume: 75,
    headphoneVolume: 60,
    headphoneMix: 50,
    booth: 50,
    record: false
  });

  const [crowdMetrics, setCrowdMetrics] = useState<CrowdMetrics>({
    energy: 85,
    engagement: 92,
    danceability: 88,
    requests: [
      { track: "Levels - Avicii", votes: 23, tip: 15 },
      { track: "Titanium - David Guetta", votes: 18, tip: 8 },
      { track: "Animals - Martin Garrix", votes: 15, tip: 12 }
    ]
  });

  const [aiSuggestions, setAiSuggestions] = useState<Array<{
    track: string;
    reason: string;
    compatibility: number;
  }>>([]);

  const [showBrowser, setShowBrowser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [beatSync, setBeatSync] = useState(false);
  const [autoMix, setAutoMix] = useState(false);

  // Sample track library
  const sampleTracks: DJTrack[] = [
    {
      id: '1',
      title: 'One More Time',
      artist: 'Daft Punk',
      duration: 240,
      bpm: 123,
      key: 'F# Minor',
      genre: 'Electronic',
      energy: 85,
      url: '/sample-tracks/one-more-time.mp3'
    },
    {
      id: '2',
      title: 'Strobe',
      artist: 'Deadmau5',
      duration: 380,
      bpm: 128,
      key: 'A Minor',
      genre: 'Progressive House',
      energy: 75,
      url: '/sample-tracks/strobe.mp3'
    },
    {
      id: '3',
      title: 'Levels',
      artist: 'Avicii',
      duration: 200,
      bpm: 126,
      key: 'C# Minor',
      genre: 'Progressive House',
      energy: 90,
      url: '/sample-tracks/levels.mp3'
    },
    {
      id: '4',
      title: 'Animals',
      artist: 'Martin Garrix',
      duration: 180,
      bpm: 128,
      key: 'G Minor',
      genre: 'Big Room',
      energy: 95,
      url: '/sample-tracks/animals.mp3'
    }
  ];

  // Connect to DJ WebSocket for real-time features
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}:8206`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('Connected to Advanced DJ Engine');
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'crowd_analytics':
            setCrowdMetrics(data.metrics);
            break;
          case 'ai_suggestions':
            setAiSuggestions(data.suggestions);
            break;
          case 'track_analysis':
            // Handle track analysis results
            break;
        }
      };
      
      wsRef.current.onclose = () => {
        console.log('Disconnected from DJ engine');
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const updateDeck = useCallback((deckId: 'A' | 'B', updates: Partial<DJDeck>) => {
    setDecks(prev => ({
      ...prev,
      [deckId]: { ...prev[deckId], ...updates }
    }));
  }, []);

  const loadTrack = useCallback(async (track: DJTrack, deckId: 'A' | 'B') => {
    updateDeck(deckId, { track, isLoaded: true });
    
    // Send to WebSocket for analysis
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'load_track',
        deck: deckId,
        track
      }));
    }
  }, [updateDeck]);

  const handlePlay = useCallback((deckId: 'A' | 'B') => {
    const deck = decks[deckId];
    if (!deck.track) return;

    const newPlaying = !deck.isPlaying;
    updateDeck(deckId, { isPlaying: newPlaying });
    
    if (newPlaying) {
      audioEngine.play();
    } else {
      audioEngine.pause();
    }

    // Send to WebSocket
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'deck_control',
        deck: deckId,
        action: newPlaying ? 'play' : 'pause',
        track: deck.track
      }));
    }
  }, [decks, updateDeck, audioEngine]);

  const handleEQChange = useCallback((deckId: 'A' | 'B', band: 'high' | 'mid' | 'low', value: number) => {
    updateDeck(deckId, {
      eq: { ...decks[deckId].eq, [band]: value }
    });
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'eq_change',
        deck: deckId,
        band,
        value
      }));
    }
  }, [decks, updateDeck]);

  const handleEffectChange = useCallback((deckId: 'A' | 'B', effect: keyof DJDeck['effects'], value: number) => {
    updateDeck(deckId, {
      effects: { ...decks[deckId].effects, [effect]: value }
    });
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'effect_change',
        deck: deckId,
        effect,
        value
      }));
    }
  }, [decks, updateDeck]);

  const handleCrossfaderChange = useCallback((value: number) => {
    setMixer(prev => ({ ...prev, crossfader: value }));
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'crossfader',
        value
      }));
    }
  }, []);

  const syncDecks = useCallback(() => {
    const deckA = decks.A;
    const deckB = decks.B;
    
    if (deckA.track && deckB.track) {
      // Calculate BPM sync
      const targetBPM = deckA.track.bpm;
      const adjustmentFactor = targetBPM / deckB.track.bpm;
      
      updateDeck('B', { pitch: (adjustmentFactor - 1) * 100 });
      setBeatSync(true);
      
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'sync_decks',
          deckA: deckA.track,
          deckB: deckB.track
        }));
      }
    }
  }, [decks, updateDeck]);

  const DeckComponent = ({ deck }: { deck: DJDeck }) => (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={deck.isLoaded ? "default" : "outline"}>
              DECK {deck.id}
            </Badge>
            {deck.isPlaying && (
              <Badge variant="default" className="bg-green-500">LIVE</Badge>
            )}
          </div>
          <div className="flex space-x-1">
            <Button
              variant={deck.cue ? "default" : "ghost"}
              size="sm"
              onClick={() => updateDeck(deck.id, { cue: !deck.cue })}
            >
              CUE
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBrowser(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Track Info */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-white">
            {deck.track?.title || 'No Track Loaded'}
          </h3>
          <p className="text-gray-400">{deck.track?.artist}</p>
          {deck.track && (
            <div className="flex justify-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="text-xs">{deck.track.key}</Badge>
              <Badge variant="outline" className="text-xs">{deck.track.bpm} BPM</Badge>
              <Badge variant="outline" className="text-xs">{deck.track.genre}</Badge>
            </div>
          )}
        </div>

        {/* Waveform */}
        <div className="h-20">
          {deck.track ? (
            <Waveform
              currentTime={audioEngine.currentTime}
              duration={deck.track.duration}
              isPlaying={deck.isPlaying}
              onSeek={audioEngine.seekTo}
              height={80}
              waveformData={deck.track.waveformData}
              color={deck.id === 'A' ? '#3b82f6' : '#f59e0b'}
            />
          ) : (
            <div className="h-20 bg-gray-800 rounded flex items-center justify-center text-gray-400">
              Load a track to see waveform
            </div>
          )}
        </div>

        {/* Transport Controls */}
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* Handle cue */}}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant={deck.isPlaying ? "default" : "outline"}
            size="lg"
            onClick={() => handlePlay(deck.id)}
            disabled={!deck.track}
            className="h-12 w-12"
          >
            {deck.isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateDeck(deck.id, { isPlaying: false })}
            disabled={!deck.track}
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {/* Pitch Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Pitch</span>
            <span>{deck.pitch > 0 ? '+' : ''}{deck.pitch.toFixed(1)}%</span>
          </div>
          <Slider
            value={[deck.pitch]}
            onValueChange={([value]) => updateDeck(deck.id, { pitch: value })}
            min={-50}
            max={50}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* EQ Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center">
            <Sliders className="h-4 w-4 mr-2" />
            EQ
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {(['high', 'mid', 'low'] as const).map((band) => (
              <div key={band} className="text-center">
                <label className="text-xs text-gray-400 uppercase">{band}</label>
                <Slider
                  value={[deck.eq[band]]}
                  onValueChange={([value]) => handleEQChange(deck.id, band, value)}
                  min={0}
                  max={100}
                  step={1}
                  orientation="vertical"
                  className="h-20 mx-auto mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">{deck.eq[band]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Effects Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Effects
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(deck.effects).map(([effect, value]) => (
              <div key={effect} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="capitalize">{effect}</span>
                  <span>{value}%</span>
                </div>
                <Slider
                  value={[value]}
                  onValueChange={([newValue]) => 
                    handleEffectChange(deck.id, effect as keyof DJDeck['effects'], newValue)
                  }
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Volume2 className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">{deck.volume}%</span>
          </div>
          <Slider
            value={[deck.volume]}
            onValueChange={([value]) => updateDeck(deck.id, { volume: value })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6 bg-black text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Enhanced DJ Studio
          </h1>
          <Badge variant="outline" className="border-green-500 text-green-400">
            PRO
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={beatSync ? "default" : "outline"}
            onClick={syncDecks}
            className="border-purple-500 text-purple-400"
          >
            <Sync className="h-4 w-4 mr-2" />
            Beat Sync
          </Button>
          <Button
            variant={autoMix ? "default" : "outline"}
            onClick={() => setAutoMix(!autoMix)}
            className="border-green-500 text-green-400"
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto Mix
          </Button>
        </div>
      </div>

      {/* Live Analytics */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Radio className="h-5 w-5 mr-2" />
            Live Crowd Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{crowdMetrics.energy}%</div>
              <div className="text-sm text-gray-400">Energy Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{crowdMetrics.engagement}%</div>
              <div className="text-sm text-gray-400">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{crowdMetrics.danceability}%</div>
              <div className="text-sm text-gray-400">Danceability</div>
            </div>
          </div>
          
          {/* Track Requests */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Live Requests</h4>
            <div className="space-y-2">
              {crowdMetrics.requests.map((request, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                  <span className="text-sm">{request.track}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {request.votes}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-green-400">
                      ${request.tip}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DJ Decks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeckComponent deck={decks.A} />
        <DeckComponent deck={decks.B} />
      </div>

      {/* Mixer Section */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle>Professional Mixer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Crossfader */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Crossfader</span>
              <span className="text-sm text-gray-400">{mixer.crossfader}%</span>
            </div>
            <Slider
              value={[mixer.crossfader]}
              onValueChange={([value]) => handleCrossfaderChange(value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>DECK A</span>
              <span>DECK B</span>
            </div>
          </div>

          {/* Master Controls */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Volume2 className="h-4 w-4 mr-2" />
                  <span className="text-sm">Master</span>
                </div>
                <span className="text-sm text-gray-400">{mixer.masterVolume}%</span>
              </div>
              <Slider
                value={[mixer.masterVolume]}
                onValueChange={([value]) => setMixer(prev => ({ ...prev, masterVolume: value }))}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Headphones className="h-4 w-4 mr-2" />
                  <span className="text-sm">Headphones</span>
                </div>
                <span className="text-sm text-gray-400">{mixer.headphoneVolume}%</span>
              </div>
              <Slider
                value={[mixer.headphoneVolume]}
                onValueChange={([value]) => setMixer(prev => ({ ...prev, headphoneVolume: value }))}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mic className="h-4 w-4 mr-2" />
                  <span className="text-sm">Booth</span>
                </div>
                <span className="text-sm text-gray-400">{mixer.booth}%</span>
              </div>
              <Slider
                value={[mixer.booth]}
                onValueChange={([value]) => setMixer(prev => ({ ...prev, booth: value }))}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              AI Track Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                  <div>
                    <div className="font-medium">{suggestion.track}</div>
                    <div className="text-sm text-gray-400">{suggestion.reason}</div>
                  </div>
                  <Badge variant="outline" className="text-green-400">
                    {suggestion.compatibility}% match
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Track Browser Modal */}
      {showBrowser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-4/5 max-w-4xl max-h-4/5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Track Browser</h3>
              <Button variant="ghost" onClick={() => setShowBrowser(false)}>
                ✕
              </Button>
            </div>
            
            <Input
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleTracks
                .filter(track => 
                  track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  track.artist.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(track => (
                  <div key={track.id} className="bg-gray-800 p-4 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium">{track.title}</div>
                        <div className="text-sm text-gray-400">{track.artist}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            loadTrack(track, 'A');
                            setShowBrowser(false);
                          }}
                        >
                          Load A
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            loadTrack(track, 'B');
                            setShowBrowser(false);
                          }}
                        >
                          Load B
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2 text-xs">
                      <Badge variant="outline">{track.bpm} BPM</Badge>
                      <Badge variant="outline">{track.key}</Badge>
                      <Badge variant="outline">{track.genre}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}