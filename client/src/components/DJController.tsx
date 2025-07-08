import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, RotateCcw, Sliders, 
  Filter, Zap, Radio, Music, Headphones 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import Waveform from './Waveform';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface DJDeck {
  id: 'left' | 'right';
  track: {
    title: string;
    artist: string;
    key?: string;
    bpm?: number;
  } | null;
  isPlaying: boolean;
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
  };
  cue: boolean;
  pitch: number;
}

interface DJControllerProps {
  onMixChange?: (mixData: any) => void;
  realTimeAnalytics?: boolean;
}

export default function DJController({ onMixChange, realTimeAnalytics = false }: DJControllerProps) {
  const [decks, setDecks] = useState<{ left: DJDeck; right: DJDeck }>({
    left: {
      id: 'left',
      track: {
        title: 'One More Time',
        artist: 'Daft Punk',
        key: 'F# Minor',
        bpm: 123
      },
      isPlaying: false,
      volume: 80,
      eq: { high: 50, mid: 50, low: 50 },
      effects: { reverb: 0, delay: 0, filter: 50 },
      cue: false,
      pitch: 0
    },
    right: {
      id: 'right',
      track: {
        title: 'Strobe',
        artist: 'Deadmau5', 
        key: 'A Minor',
        bpm: 128
      },
      isPlaying: false,
      volume: 80,
      eq: { high: 50, mid: 50, low: 50 },
      effects: { reverb: 0, delay: 0, filter: 50 },
      cue: false,
      pitch: 0
    }
  });

  const [crossfader, setCrossfader] = useState(50);
  const [masterVolume, setMasterVolume] = useState(75);
  const [headphoneVolume, setHeadphoneVolume] = useState(60);
  const [crowdMetrics, setCrowdMetrics] = useState({
    energy: 85,
    engagement: 92,
    dancability: 88
  });

  const audioEngine = useAudioEngine();
  const wsRef = useRef<WebSocket>();

  // Connect to DJ WebSocket server for real-time features
  useEffect(() => {
    if (realTimeAnalytics) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}:8095`;
      
      try {
        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onopen = () => {
          console.log('Connected to DJ engine');
        };
        
        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'crowd_metrics') {
            setCrowdMetrics(data.metrics);
          } else if (data.type === 'track_suggestion') {
            // Handle AI track suggestions
            console.log('AI suggests:', data.suggestion);
          }
        };
        
        wsRef.current.onclose = () => {
          console.log('Disconnected from DJ engine');
        };
      } catch (error) {
        console.error('WebSocket connection failed:', error);
      }
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [realTimeAnalytics]);

  const updateDeck = (deckId: 'left' | 'right', updates: Partial<DJDeck>) => {
    setDecks(prev => ({
      ...prev,
      [deckId]: { ...prev[deckId], ...updates }
    }));
  };

  const handlePlay = (deckId: 'left' | 'right') => {
    const deck = decks[deckId];
    const newPlaying = !deck.isPlaying;
    
    updateDeck(deckId, { isPlaying: newPlaying });
    
    if (newPlaying) {
      audioEngine.play();
    } else {
      audioEngine.pause();
    }

    // Send to WebSocket for real-time processing
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'deck_control',
        deck: deckId,
        action: newPlaying ? 'play' : 'pause',
        track: deck.track
      }));
    }
  };

  const handleEQChange = (deckId: 'left' | 'right', band: 'high' | 'mid' | 'low', value: number) => {
    updateDeck(deckId, {
      eq: { ...decks[deckId].eq, [band]: value }
    });
    
    // Apply EQ in real-time via WebSocket
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'eq_change',
        deck: deckId,
        band,
        value
      }));
    }
  };

  const handleEffectChange = (deckId: 'left' | 'right', effect: 'reverb' | 'delay' | 'filter', value: number) => {
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
  };

  const handleCrossfaderChange = (value: number) => {
    setCrossfader(value);
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'crossfader',
        value
      }));
    }

    if (onMixChange) {
      onMixChange({ crossfader: value, decks });
    }
  };

  const DeckComponent = ({ deck }: { deck: DJDeck }) => (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-4">
      {/* Track Info */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-white">
          {deck.track?.title || 'No Track Loaded'}
        </h3>
        <p className="text-gray-400">{deck.track?.artist}</p>
        {deck.track?.key && deck.track?.bpm && (
          <div className="flex justify-center gap-4 mt-2">
            <Badge variant="outline" className="text-xs">{deck.track.key}</Badge>
            <Badge variant="outline" className="text-xs">{deck.track.bpm} BPM</Badge>
          </div>
        )}
      </div>

      {/* Waveform */}
      <div className="h-20">
        <Waveform
          currentTime={audioEngine.currentTime}
          duration={audioEngine.duration}
          isPlaying={deck.isPlaying}
          onSeek={audioEngine.seekTo}
          height={80}
        />
      </div>

      {/* Transport Controls */}
      <div className="flex justify-center gap-2">
        <Button
          variant={deck.cue ? "default" : "outline"}
          size="sm"
          onClick={() => updateDeck(deck.id, { cue: !deck.cue })}
        >
          CUE
        </Button>
        <Button
          variant={deck.isPlaying ? "default" : "outline"}
          size="lg"
          onClick={() => handlePlay(deck.id)}
        >
          {deck.isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Button variant="outline" size="sm">
          <RotateCcw className="h-4 w-4" />
        </Button>
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
        <div className="grid grid-cols-3 gap-4">
          {(['reverb', 'delay', 'filter'] as const).map((effect) => (
            <div key={effect} className="text-center">
              <label className="text-xs text-gray-400 uppercase">{effect}</label>
              <Slider
                value={[deck.effects[effect]]}
                onValueChange={([value]) => handleEffectChange(deck.id, effect, value)}
                min={0}
                max={100}
                step={1}
                orientation="vertical"
                className="h-20 mx-auto mt-2"
              />
              <div className="text-xs text-gray-500 mt-1">{deck.effects[effect]}</div>
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
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Real-time Analytics */}
      {realTimeAnalytics && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Radio className="h-5 w-5 mr-2" />
            Live Crowd Analytics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{crowdMetrics.energy}%</div>
              <div className="text-sm text-gray-400">Energy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{crowdMetrics.engagement}%</div>
              <div className="text-sm text-gray-400">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{crowdMetrics.dancability}%</div>
              <div className="text-sm text-gray-400">Danceability</div>
            </div>
          </div>
        </div>
      )}

      {/* DJ Decks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeckComponent deck={decks.left} />
        <DeckComponent deck={decks.right} />
      </div>

      {/* Center Mixer Section */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6">
        {/* Crossfader */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Crossfader</span>
            <span className="text-sm text-gray-400">{crossfader}%</span>
          </div>
          <Slider
            value={[crossfader]}
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
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Volume2 className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Master</span>
              </div>
              <span className="text-sm text-gray-400">{masterVolume}%</span>
            </div>
            <Slider
              value={[masterVolume]}
              onValueChange={([value]) => setMasterVolume(value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Headphones className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Headphones</span>
              </div>
              <span className="text-sm text-gray-400">{headphoneVolume}%</span>
            </div>
            <Slider
              value={[headphoneVolume]}
              onValueChange={([value]) => setHeadphoneVolume(value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}