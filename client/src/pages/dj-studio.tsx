import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  FastForward,
  Rewind,
  Volume2,
  Settings,
  Disc,
  Zap,
  Headphones,
  Music,
  Filter,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle
} from "lucide-react";

interface DJDeck {
  id: 'A' | 'B';
  audioFile: any | null;
  isPlaying: boolean;
  position: number; // 0-1
  bpm: number;
  pitch: number; // -100 to +100 (percentage)
  volume: number; // 0-1
  eqHigh: number; // 0-1
  eqMid: number; // 0-1
  eqLow: number; // 0-1
  filterHp: number; // 0-1 (high pass)
  filterLp: number; // 0-1 (low pass)
  loop: {
    enabled: boolean;
    start: number;
    end: number;
    size: number; // beats
  };
  cue: {
    position: number;
    enabled: boolean;
  };
  sync: boolean;
  keylock: boolean;
  reverse: boolean;
}

interface DJEffect {
  id: string;
  name: string;
  enabled: boolean;
  wetDry: number; // 0-1
  parameter1: number;
  parameter2: number;
  parameter3: number;
}

export default function DJStudio() {
  const [deckA, setDeckA] = useState<DJDeck>({
    id: 'A',
    audioFile: null,
    isPlaying: false,
    position: 0,
    bpm: 128,
    pitch: 0,
    volume: 0.8,
    eqHigh: 0.5,
    eqMid: 0.5,
    eqLow: 0.5,
    filterHp: 0,
    filterLp: 1,
    loop: { enabled: false, start: 0, end: 1, size: 4 },
    cue: { position: 0, enabled: false },
    sync: false,
    keylock: false,
    reverse: false
  });

  const [deckB, setDeckB] = useState<DJDeck>({
    id: 'B',
    audioFile: null,
    isPlaying: false,
    position: 0,
    bpm: 128,
    pitch: 0,
    volume: 0.8,
    eqHigh: 0.5,
    eqMid: 0.5,
    eqLow: 0.5,
    filterHp: 0,
    filterLp: 1,
    loop: { enabled: false, start: 0, end: 1, size: 4 },
    cue: { position: 0, enabled: false },
    sync: false,
    keylock: false,
    reverse: false
  });

  const [crossfader, setCrossfader] = useState(0.5);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [cueMix, setCueMix] = useState(0.5); // headphone cue mix
  const [cueVolume, setCueVolume] = useState(0.8);
  const [micVolume, setMicVolume] = useState(0);
  const [recordMode, setRecordMode] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [quantize, setQuantize] = useState(true);

  const [effects, setEffects] = useState<DJEffect[]>([
    { id: 'reverb', name: 'Reverb', enabled: false, wetDry: 0.3, parameter1: 0.5, parameter2: 0.3, parameter3: 0.8 },
    { id: 'delay', name: 'Delay', enabled: false, wetDry: 0.3, parameter1: 0.5, parameter2: 0.6, parameter3: 0.4 },
    { id: 'filter', name: 'Filter', enabled: false, wetDry: 0.5, parameter1: 0.5, parameter2: 0.5, parameter3: 0.5 },
    { id: 'flanger', name: 'Flanger', enabled: false, wetDry: 0.4, parameter1: 0.3, parameter2: 0.7, parameter3: 0.5 }
  ]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const deckASourceRef = useRef<AudioBufferSourceNode | null>(null);
  const deckBSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    initializeAudio();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initializeAudio = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  };

  const updateDeck = (deckId: 'A' | 'B', updates: Partial<DJDeck>) => {
    if (deckId === 'A') {
      setDeckA(prev => ({ ...prev, ...updates }));
    } else {
      setDeckB(prev => ({ ...prev, ...updates }));
    }
  };

  const togglePlay = (deckId: 'A' | 'B') => {
    const deck = deckId === 'A' ? deckA : deckB;
    updateDeck(deckId, { isPlaying: !deck.isPlaying });
  };

  const setCuePoint = (deckId: 'A' | 'B') => {
    const deck = deckId === 'A' ? deckA : deckB;
    updateDeck(deckId, { 
      cue: { ...deck.cue, position: deck.position, enabled: true }
    });
  };

  const jumpToCue = (deckId: 'A' | 'B') => {
    const deck = deckId === 'A' ? deckA : deckB;
    if (deck.cue.enabled) {
      updateDeck(deckId, { position: deck.cue.position });
    }
  };

  const toggleLoop = (deckId: 'A' | 'B') => {
    const deck = deckId === 'A' ? deckA : deckB;
    updateDeck(deckId, { 
      loop: { ...deck.loop, enabled: !deck.loop.enabled }
    });
  };

  const syncDecks = () => {
    if (deckA.bpm !== deckB.bpm) {
      // Sync slower deck to faster deck
      if (deckA.bpm < deckB.bpm) {
        const pitchAdjustment = ((deckB.bpm - deckA.bpm) / deckA.bpm) * 100;
        updateDeck('A', { pitch: Math.min(100, pitchAdjustment) });
      } else {
        const pitchAdjustment = ((deckA.bpm - deckB.bpm) / deckB.bpm) * 100;
        updateDeck('B', { pitch: Math.min(100, pitchAdjustment) });
      }
    }
  };

  const beatMatch = () => {
    // Advanced beat matching algorithm
    syncDecks();
    // In production, this would analyze phase alignment and adjust timing
  };

  const DeckControls = ({ deck, onUpdate }: { deck: DJDeck, onUpdate: (updates: Partial<DJDeck>) => void }) => (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-orange-400 text-center">DECK {deck.id}</CardTitle>
        <div className="text-center text-sm text-gray-400">
          {deck.audioFile ? deck.audioFile.name : 'No track loaded'}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Waveform Display */}
        <div className="h-20 bg-gray-800 rounded border-2 border-gray-600 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <Music size={32} />
          </div>
          {/* Position indicator */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-orange-400 z-10"
            style={{ left: `${deck.position * 100}%` }}
          />
          {/* Cue point */}
          {deck.cue.enabled && (
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-green-400 z-10"
              style={{ left: `${deck.cue.position * 100}%` }}
            />
          )}
          {/* Loop markers */}
          {deck.loop.enabled && (
            <div 
              className="absolute top-0 bottom-0 bg-blue-400/30"
              style={{ 
                left: `${deck.loop.start * 100}%`,
                width: `${(deck.loop.end - deck.loop.start) * 100}%`
              }}
            />
          )}
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdate({ position: Math.max(0, deck.position - 0.01) })}
          >
            <SkipBack size={16} />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => jumpToCue(deck.id)}
            className={deck.cue.enabled ? 'bg-green-600' : ''}
          >
            CUE
          </Button>
          
          <Button 
            onClick={() => togglePlay(deck.id)}
            className={deck.isPlaying ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
          >
            {deck.isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCuePoint(deck.id)}
          >
            SET
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdate({ position: Math.min(1, deck.position + 0.01) })}
          >
            <SkipForward size={16} />
          </Button>
        </div>

        {/* BPM and Pitch */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">BPM</div>
            <div className="text-lg font-mono text-white bg-gray-800 rounded px-2 py-1">
              {(deck.bpm * (1 + deck.pitch / 100)).toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">PITCH</div>
            <div className="text-lg font-mono text-white bg-gray-800 rounded px-2 py-1">
              {deck.pitch > 0 ? '+' : ''}{deck.pitch.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Pitch Slider */}
        <div>
          <div className="text-xs text-gray-400 mb-2 text-center">PITCH FADER</div>
          <div className="relative">
            <Slider
              value={[deck.pitch]}
              onValueChange={([value]) => onUpdate({ pitch: value })}
              min={-50}
              max={50}
              step={0.1}
              orientation="vertical"
              className="h-32 mx-auto"
            />
            <div className="absolute -right-12 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
              <span>+50%</span>
              <span>0</span>
              <span>-50%</span>
            </div>
          </div>
        </div>

        {/* EQ Controls */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400 text-center mb-2">EQ</div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>HIGH</span>
              <span>{Math.round(deck.eqHigh * 100)}%</span>
            </div>
            <Slider
              value={[deck.eqHigh]}
              onValueChange={([value]) => onUpdate({ eqHigh: value })}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>MID</span>
              <span>{Math.round(deck.eqMid * 100)}%</span>
            </div>
            <Slider
              value={[deck.eqMid]}
              onValueChange={([value]) => onUpdate({ eqMid: value })}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>LOW</span>
              <span>{Math.round(deck.eqLow * 100)}%</span>
            </div>
            <Slider
              value={[deck.eqLow]}
              onValueChange={([value]) => onUpdate({ eqLow: value })}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400 text-center mb-2">FILTER</div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>HP</span>
              <span>{Math.round(deck.filterHp * 100)}%</span>
            </div>
            <Slider
              value={[deck.filterHp]}
              onValueChange={([value]) => onUpdate({ filterHp: value })}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>LP</span>
              <span>{Math.round(deck.filterLp * 100)}%</span>
            </div>
            <Slider
              value={[deck.filterLp]}
              onValueChange={([value]) => onUpdate({ filterLp: value })}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>

        {/* Loop Controls */}
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toggleLoop(deck.id)}
            className={deck.loop.enabled ? 'bg-blue-600' : ''}
          >
            LOOP
          </Button>
          <Button variant="outline" size="sm">
            {deck.loop.size}
          </Button>
          <Button variant="outline" size="sm">
            AUTO
          </Button>
        </div>

        {/* Function Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdate({ sync: !deck.sync })}
            className={deck.sync ? 'bg-green-600' : ''}
          >
            SYNC
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdate({ keylock: !deck.keylock })}
            className={deck.keylock ? 'bg-blue-600' : ''}
          >
            KEY
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdate({ reverse: !deck.reverse })}
            className={deck.reverse ? 'bg-red-600' : ''}
          >
            REV
          </Button>
        </div>

        {/* Volume */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>VOLUME</span>
            <span>{Math.round(deck.volume * 100)}%</span>
          </div>
          <Slider
            value={[deck.volume]}
            onValueChange={([value]) => onUpdate({ volume: value })}
            max={1}
            step={0.01}
            className="w-full"
          />
        </div>

        {/* Cue Button */}
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => onUpdate({ cue: { ...deck.cue, enabled: !deck.cue.enabled }})}
        >
          <Headphones size={16} className="mr-2" />
          CUE
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Disc className="text-orange-400" size={28} />
          <div>
            <h1 className="text-xl font-bold">DJ Studio</h1>
            <p className="text-sm text-gray-400">Professional Virtual DJ Controller</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-xs">
            Master: {Math.round(masterVolume * 100)}%
          </Badge>
          <Badge variant={recordMode ? "destructive" : "secondary"} className="text-xs">
            {recordMode ? "REC" : "READY"}
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Deck */}
        <div className="flex-1 p-4">
          <DeckControls 
            deck={deckA} 
            onUpdate={(updates) => updateDeck('A', updates)} 
          />
        </div>

        {/* Center Mixer */}
        <div className="w-80 bg-gray-800 border-x border-gray-700 p-4 space-y-4">
          <div className="text-center font-semibold text-orange-400 mb-4">MIXER</div>
          
          {/* Master Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>MASTER VOLUME</span>
                <span>{Math.round(masterVolume * 100)}%</span>
              </div>
              <Slider
                value={[masterVolume]}
                onValueChange={([value]) => setMasterVolume(value)}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Crossfader */}
            <div>
              <div className="text-xs text-gray-400 text-center mb-2">CROSSFADER</div>
              <div className="relative">
                <Slider
                  value={[crossfader]}
                  onValueChange={([value]) => setCrossfader(value)}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>A</span>
                  <span>B</span>
                </div>
              </div>
            </div>

            {/* Headphone Controls */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 text-center">HEADPHONES</div>
              
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>CUE MIX</span>
                  <span>{Math.round(cueMix * 100)}%</span>
                </div>
                <Slider
                  value={[cueMix]}
                  onValueChange={([value]) => setCueMix(value)}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>CUE VOL</span>
                  <span>{Math.round(cueVolume * 100)}%</span>
                </div>
                <Slider
                  value={[cueVolume]}
                  onValueChange={([value]) => setCueVolume(value)}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </div>

            {/* Microphone */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>MIC LEVEL</span>
                <span>{Math.round(micVolume * 100)}%</span>
              </div>
              <Slider
                value={[micVolume]}
                onValueChange={([value]) => setMicVolume(value)}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Master Functions */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={beatMatch}
              >
                SYNC
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAutoSync(!autoSync)}
                className={autoSync ? 'bg-blue-600' : ''}
              >
                AUTO
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuantize(!quantize)}
                className={quantize ? 'bg-green-600' : ''}
              >
                QUANT
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setRecordMode(!recordMode)}
                className={recordMode ? 'bg-red-600' : ''}
              >
                REC
              </Button>
            </div>
          </div>

          {/* Effects Section */}
          <div className="space-y-2">
            <div className="text-xs text-gray-400 text-center">EFFECTS</div>
            {effects.map(effect => (
              <div key={effect.id} className="bg-gray-900 rounded p-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">{effect.name}</span>
                  <Switch
                    checked={effect.enabled}
                    onCheckedChange={(checked) => {
                      setEffects(prev => prev.map(e => 
                        e.id === effect.id ? { ...e, enabled: checked } : e
                      ));
                    }}
                  />
                </div>
                {effect.enabled && (
                  <Slider
                    value={[effect.wetDry]}
                    onValueChange={([value]) => {
                      setEffects(prev => prev.map(e => 
                        e.id === effect.id ? { ...e, wetDry: value } : e
                      ));
                    }}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Deck */}
        <div className="flex-1 p-4">
          <DeckControls 
            deck={deckB} 
            onUpdate={(updates) => updateDeck('B', updates)} 
          />
        </div>
      </div>

      {/* Bottom Browser/Library */}
      <div className="h-48 bg-gray-800 border-t border-gray-700 p-4">
        <div className="text-sm font-semibold text-orange-400 mb-2">MUSIC LIBRARY</div>
        <ScrollArea className="h-32">
          <div className="space-y-1">
            <div className="flex items-center p-2 bg-gray-700 rounded text-sm hover:bg-gray-600 cursor-pointer">
              <Music size={16} className="mr-2" />
              <span className="flex-1">Sample Track 1.mp3</span>
              <span className="text-gray-400">128 BPM</span>
            </div>
            <div className="flex items-center p-2 bg-gray-700 rounded text-sm hover:bg-gray-600 cursor-pointer">
              <Music size={16} className="mr-2" />
              <span className="flex-1">Sample Track 2.mp3</span>
              <span className="text-gray-400">132 BPM</span>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}