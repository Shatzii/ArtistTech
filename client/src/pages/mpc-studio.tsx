import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Save,
  Upload,
  Download,
  Volume2,
  Settings,
  Layers,
  Grid,
  Zap
} from "lucide-react";
import MPCDrumPads from "@/components/mpc/MPCDrumPads";
import MPCSequencer from "@/components/mpc/MPCSequencer";
import MPCMixer from "@/components/mpc/MPCMixer";
import MPCSampleLibrary from "@/components/mpc/MPCSampleLibrary";
import MPCEffectsRack from "@/components/mpc/MPCEffectsRack";

interface DrumSound {
  id: string;
  name: string;
  category: 'kick' | 'snare' | 'hihat' | 'crash' | 'perc' | 'fx';
  audioUrl: string;
  volume: number;
  pitch: number;
  pan: number;
  reverb: number;
  delay: number;
  filter: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

interface Pattern {
  id: string;
  name: string;
  length: number; // in steps (16, 32, etc.)
  tempo: number;
  swing: number;
  steps: { [padId: string]: boolean[] }; // array of boolean for each step
  velocity: { [padId: string]: number[] }; // velocity for each step
}

interface Track {
  id: string;
  name: string;
  sound: DrumSound;
  muted: boolean;
  solo: boolean;
  volume: number;
  effects: string[];
}

export default function MPCStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tempo, setTempo] = useState(120);
  const [swing, setSwing] = useState(0);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [selectedPad, setSelectedPad] = useState<string>('pad1');
  const [currentPattern, setCurrentPattern] = useState<Pattern>({
    id: 'pattern1',
    name: 'New Pattern',
    length: 16,
    tempo: 120,
    swing: 0,
    steps: {},
    velocity: {}
  });
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [recordMode, setRecordMode] = useState(false);
  const [quantize, setQuantize] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const schedulerRef = useRef<number | null>(null);
  const nextStepTimeRef = useRef<number>(0);
  const lookAhead = 25.0; // milliseconds
  const scheduleAheadTime = 0.1; // seconds

  // Initialize audio context and default sounds
  useEffect(() => {
    initializeAudio();
    initializeDefaultKit();
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

  const initializeDefaultKit = () => {
    // Default drum kit with 16 pads
    const defaultSounds: DrumSound[] = [
      { id: 'pad1', name: 'Kick 1', category: 'kick', audioUrl: '/samples/kick1.wav', volume: 0.8, pitch: 0, pan: 0, reverb: 0.1, delay: 0, filter: 0, attack: 0, decay: 0.5, sustain: 0.3, release: 0.2 },
      { id: 'pad2', name: 'Kick 2', category: 'kick', audioUrl: '/samples/kick2.wav', volume: 0.7, pitch: 0, pan: 0, reverb: 0.1, delay: 0, filter: 0, attack: 0, decay: 0.4, sustain: 0.2, release: 0.3 },
      { id: 'pad3', name: 'Snare 1', category: 'snare', audioUrl: '/samples/snare1.wav', volume: 0.9, pitch: 0, pan: 0, reverb: 0.2, delay: 0, filter: 0, attack: 0, decay: 0.3, sustain: 0.1, release: 0.4 },
      { id: 'pad4', name: 'Snare 2', category: 'snare', audioUrl: '/samples/snare2.wav', volume: 0.8, pitch: 0, pan: 0, reverb: 0.15, delay: 0, filter: 0, attack: 0, decay: 0.25, sustain: 0.15, release: 0.35 },
      { id: 'pad5', name: 'Hi-Hat Closed', category: 'hihat', audioUrl: '/samples/hihat_closed.wav', volume: 0.6, pitch: 0, pan: 0.2, reverb: 0.05, delay: 0, filter: 0.2, attack: 0, decay: 0.1, sustain: 0, release: 0.1 },
      { id: 'pad6', name: 'Hi-Hat Open', category: 'hihat', audioUrl: '/samples/hihat_open.wav', volume: 0.7, pitch: 0, pan: 0.2, reverb: 0.1, delay: 0, filter: 0.1, attack: 0, decay: 0.3, sustain: 0.2, release: 0.5 },
      { id: 'pad7', name: 'Crash', category: 'crash', audioUrl: '/samples/crash.wav', volume: 0.5, pitch: 0, pan: -0.3, reverb: 0.4, delay: 0.1, filter: 0, attack: 0, decay: 1.0, sustain: 0.5, release: 2.0 },
      { id: 'pad8', name: 'Ride', category: 'crash', audioUrl: '/samples/ride.wav', volume: 0.6, pitch: 0, pan: 0.3, reverb: 0.2, delay: 0, filter: 0, attack: 0, decay: 0.8, sustain: 0.4, release: 1.5 },
      { id: 'pad9', name: 'Tom High', category: 'perc', audioUrl: '/samples/tom_high.wav', volume: 0.7, pitch: 0, pan: -0.1, reverb: 0.15, delay: 0, filter: 0, attack: 0, decay: 0.4, sustain: 0.2, release: 0.6 },
      { id: 'pad10', name: 'Tom Mid', category: 'perc', audioUrl: '/samples/tom_mid.wav', volume: 0.75, pitch: 0, pan: 0, reverb: 0.15, delay: 0, filter: 0, attack: 0, decay: 0.5, sustain: 0.25, release: 0.7 },
      { id: 'pad11', name: 'Tom Low', category: 'perc', audioUrl: '/samples/tom_low.wav', volume: 0.8, pitch: 0, pan: 0.1, reverb: 0.2, delay: 0, filter: 0, attack: 0, decay: 0.6, sustain: 0.3, release: 0.8 },
      { id: 'pad12', name: 'Shaker', category: 'perc', audioUrl: '/samples/shaker.wav', volume: 0.5, pitch: 0, pan: -0.2, reverb: 0.1, delay: 0, filter: 0.3, attack: 0, decay: 0.2, sustain: 0, release: 0.3 },
      { id: 'pad13', name: 'Clap', category: 'perc', audioUrl: '/samples/clap.wav', volume: 0.7, pitch: 0, pan: 0, reverb: 0.25, delay: 0.05, filter: 0, attack: 0, decay: 0.3, sustain: 0.1, release: 0.4 },
      { id: 'pad14', name: 'Cowbell', category: 'perc', audioUrl: '/samples/cowbell.wav', volume: 0.6, pitch: 0, pan: 0.1, reverb: 0.1, delay: 0, filter: 0, attack: 0, decay: 0.2, sustain: 0.1, release: 0.3 },
      { id: 'pad15', name: 'FX Sweep', category: 'fx', audioUrl: '/samples/fx_sweep.wav', volume: 0.4, pitch: 0, pan: 0, reverb: 0.5, delay: 0.2, filter: -0.2, attack: 0.1, decay: 2.0, sustain: 0.3, release: 1.5 },
      { id: 'pad16', name: 'Vinyl Stop', category: 'fx', audioUrl: '/samples/vinyl_stop.wav', volume: 0.6, pitch: 0, pan: 0, reverb: 0.3, delay: 0.1, filter: 0, attack: 0, decay: 1.5, sustain: 0, release: 0.5 }
    ];

    // Initialize tracks from sounds
    const defaultTracks: Track[] = defaultSounds.map(sound => ({
      id: sound.id,
      name: sound.name,
      sound,
      muted: false,
      solo: false,
      volume: sound.volume,
      effects: []
    }));

    setTracks(defaultTracks);
    
    // Initialize pattern with empty steps
    const initialPattern = { ...currentPattern };
    defaultSounds.forEach(sound => {
      initialPattern.steps[sound.id] = new Array(16).fill(false);
      initialPattern.velocity[sound.id] = new Array(16).fill(0.8);
    });
    setCurrentPattern(initialPattern);
  };

  // Sequencer engine
  useEffect(() => {
    if (isPlaying) {
      nextStepTimeRef.current = audioContextRef.current?.currentTime || 0;
      startScheduler();
    } else {
      stopScheduler();
    }

    return () => stopScheduler();
  }, [isPlaying, tempo]);

  const startScheduler = () => {
    const scheduler = () => {
      if (!audioContextRef.current) return;

      while (nextStepTimeRef.current < audioContextRef.current.currentTime + scheduleAheadTime) {
        scheduleStep(nextStepTimeRef.current);
        nextStep();
      }
      
      schedulerRef.current = requestAnimationFrame(scheduler);
    };
    
    scheduler();
  };

  const stopScheduler = () => {
    if (schedulerRef.current) {
      cancelAnimationFrame(schedulerRef.current);
      schedulerRef.current = null;
    }
  };

  const scheduleStep = (time: number) => {
    // Play sounds for current step
    tracks.forEach(track => {
      if (!track.muted && !track.solo && currentPattern.steps[track.id]?.[currentStep]) {
        playSound(track.sound, time, currentPattern.velocity[track.id][currentStep]);
      }
    });

    // Handle solo tracks
    const soloTracks = tracks.filter(track => track.solo);
    if (soloTracks.length > 0) {
      soloTracks.forEach(track => {
        if (currentPattern.steps[track.id]?.[currentStep]) {
          playSound(track.sound, time, currentPattern.velocity[track.id][currentStep]);
        }
      });
    }
  };

  const nextStep = () => {
    const stepDuration = 60.0 / (tempo * 4); // 16th note duration
    const swingAmount = (swing / 100) * (stepDuration * 0.1); // Subtle swing
    
    // Apply swing to odd steps
    const swingDelay = currentStep % 2 === 1 ? swingAmount : 0;
    
    nextStepTimeRef.current += stepDuration + swingDelay;
    setCurrentStep(prev => (prev + 1) % currentPattern.length);
  };

  const playSound = async (sound: DrumSound, time: number = 0, velocity: number = 0.8) => {
    if (!audioContextRef.current) return;

    try {
      // Create proper audio buffer for realistic drum sounds
      const buffer = createDrumSample(sound.category, audioContextRef.current!);
      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();
      const filterNode = audioContextRef.current.createBiquadFilter();

      source.buffer = buffer;
      
      // Apply sound parameters
      gainNode.gain.setValueAtTime(velocity * sound.volume * masterVolume, time || audioContextRef.current.currentTime);
      
      // Apply filter if specified
      if (sound.filter !== 0) {
        filterNode.frequency.setValueAtTime(1000 + (sound.filter * 2000), time || audioContextRef.current.currentTime);
        filterNode.type = sound.filter > 0 ? 'highpass' : 'lowpass';
        source.connect(filterNode);
        filterNode.connect(gainNode);
      } else {
        source.connect(gainNode);
      }
      
      gainNode.connect(audioContextRef.current.destination);
      
      // Apply pitch adjustment
      source.playbackRate.setValueAtTime(1 + (sound.pitch / 12), time || audioContextRef.current.currentTime);
      
      source.start(time || audioContextRef.current.currentTime);
      
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  };

  const toggleStep = (padId: string, stepIndex: number) => {
    setCurrentPattern(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        [padId]: prev.steps[padId]?.map((step, index) => 
          index === stepIndex ? !step : step
        ) || []
      }
    }));
  };

  const clearPattern = () => {
    setCurrentPattern(prev => ({
      ...prev,
      steps: Object.keys(prev.steps).reduce((acc, padId) => {
        acc[padId] = new Array(prev.length).fill(false);
        return acc;
      }, {} as { [key: string]: boolean[] })
    }));
  };

  const savePattern = () => {
    const newPattern = { ...currentPattern, id: `pattern_${Date.now()}` };
    setPatterns(prev => [...prev, newPattern]);
  };

  // Generate realistic drum samples
  const createDrumSample = (category: string, audioContext: AudioContext): AudioBuffer => {
    const sampleRate = audioContext.sampleRate;
    const duration = category === 'crash' ? 2.0 : 0.5;
    const length = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    switch (category) {
      case 'kick':
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const frequency = 60 * Math.exp(-t * 8);
          const amplitude = Math.exp(-t * 6);
          data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * 0.8;
        }
        break;

      case 'snare':
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const noise = (Math.random() * 2 - 1);
          const tone = Math.sin(2 * Math.PI * 200 * t);
          const amplitude = Math.exp(-t * 8);
          data[i] = amplitude * (noise * 0.7 + tone * 0.3) * 0.6;
        }
        break;

      case 'hihat':
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const noise = (Math.random() * 2 - 1);
          const amplitude = Math.exp(-t * 15);
          data[i] = amplitude * noise * 0.4;
        }
        break;

      case 'crash':
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          let signal = 0;
          for (let h = 1; h <= 8; h++) {
            signal += Math.sin(2 * Math.PI * 400 * h * t) / h;
          }
          const amplitude = Math.exp(-t * 2);
          data[i] = amplitude * signal * 0.3;
        }
        break;

      case 'perc':
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const frequency = 300;
          const amplitude = Math.exp(-t * 10);
          data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * 0.5;
        }
        break;

      case 'fx':
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const frequency = 100 + t * 1000;
          const amplitude = Math.exp(-t * 3);
          data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * 0.4;
        }
        break;

      default:
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const amplitude = Math.exp(-t * 5);
          data[i] = amplitude * Math.sin(2 * Math.PI * 440 * t) * 0.4;
        }
    }

    return buffer;
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Grid className="text-orange-400" size={28} />
          <div>
            <h1 className="text-xl font-bold">MPC Studio</h1>
            <p className="text-sm text-gray-400">Beat Making & Sampling Workstation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-xs">
            Pattern: {currentPattern.name}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {tempo} BPM
          </Badge>
          <Badge variant={isPlaying ? "default" : "secondary"} className="text-xs">
            {isPlaying ? "Playing" : "Stopped"}
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Controls */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 space-y-4">
          {/* Transport Controls */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Transport</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={isPlaying ? "bg-green-600 hover:bg-green-700" : ""}
                  size="sm"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </Button>
                <Button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStep(0);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Square size={16} />
                </Button>
                <Button
                  onClick={() => setCurrentStep(0)}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw size={16} />
                </Button>
              </div>

              {/* Tempo */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Tempo</span>
                  <span>{tempo} BPM</span>
                </div>
                <Slider
                  value={[tempo]}
                  onValueChange={([value]) => setTempo(value)}
                  min={60}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Swing */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Swing</span>
                  <span>{swing}%</span>
                </div>
                <Slider
                  value={[swing]}
                  onValueChange={([value]) => setSwing(value)}
                  min={0}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Master Volume */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Master Volume</span>
                  <span>{Math.round(masterVolume * 100)}%</span>
                </div>
                <Slider
                  value={[masterVolume]}
                  onValueChange={([value]) => setMasterVolume(value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pattern Controls */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pattern</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex space-x-2">
                <Button onClick={clearPattern} variant="outline" size="sm" className="flex-1">
                  Clear
                </Button>
                <Button onClick={savePattern} variant="outline" size="sm" className="flex-1">
                  <Save size={14} className="mr-1" />
                  Save
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Pattern Length</label>
                <div className="grid grid-cols-3 gap-1">
                  {[8, 16, 32].map(length => (
                    <Button
                      key={length}
                      onClick={() => setCurrentPattern(prev => ({ ...prev, length }))}
                      variant={currentPattern.length === length ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {length}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Record Mode</span>
                <Button
                  onClick={() => setRecordMode(!recordMode)}
                  variant={recordMode ? "destructive" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {recordMode ? "REC" : "OFF"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Quantize</span>
                <Button
                  onClick={() => setQuantize(!quantize)}
                  variant={quantize ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {quantize ? "ON" : "OFF"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sample Library */}
          <MPCSampleLibrary onSampleSelect={(sample: any) => console.log('Sample selected:', sample)} />
        </div>

        {/* Center Panel - Main Interface */}
        <div className="flex-1 flex flex-col">
          {/* Drum Pads */}
          <div className="flex-1 p-4">
            <MPCDrumPads
              pads={tracks.map(track => ({
                id: track.id,
                name: track.sound.name,
                category: track.sound.category,
                isActive: currentPattern.steps[track.id]?.[currentStep] || false,
                volume: track.volume,
                muted: track.muted,
                solo: track.solo
              }))}
              selectedPad={selectedPad}
              onPadSelect={setSelectedPad}
              onPadTrigger={(padId: string) => {
                const track = tracks.find(t => t.id === padId);
                if (track && audioContextRef.current) {
                  playSound(track.sound, audioContextRef.current.currentTime);
                }
              }}
            />
          </div>

          {/* Sequencer */}
          <div className="border-t border-gray-700">
            <MPCSequencer
              pattern={currentPattern}
              currentStep={currentStep}
              selectedPad={selectedPad}
              onStepToggle={toggleStep}
            />
          </div>
        </div>

        {/* Right Panel - Mixer & Effects */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <MPCMixer
            tracks={tracks}
            onTrackUpdate={(trackId: string, updates: any) => {
              setTracks(prev => prev.map(track => 
                track.id === trackId ? { ...track, ...updates } : track
              ));
            }}
          />
          
          <MPCEffectsRack
            selectedTrack={tracks.find(t => t.id === selectedPad)}
            onEffectChange={(effectId: string, value: number) => {
              console.log(`Effect ${effectId} changed to ${value}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}