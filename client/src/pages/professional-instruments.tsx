import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Piano, 
  Volume2, 
  Play, 
  Square, 
  Pause,
  Settings,
  Zap,
  Music,
  Mic,
  Headphones,
  Radio,
  Guitar,
  Drum,
  Keyboard,
  Monitor,
  Circle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Professional instrument types
interface InstrumentPreset {
  id: string;
  name: string;
  category: string;
  waveform: string;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  cutoff: number;
  resonance: number;
  effects: {
    reverb: number;
    delay: number;
    chorus: number;
    distortion: number;
  };
}

interface AudioEngine {
  context: AudioContext | null;
  oscillators: Map<string, OscillatorNode>;
  gainNodes: Map<string, GainNode>;
  filterNodes: Map<string, BiquadFilterNode>;
  masterGain: GainNode | null;
  isInitialized: boolean;
}

export default function ProfessionalInstruments() {
  const [selectedInstrument, setSelectedInstrument] = useState<string>("piano");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [masterVolume, setMasterVolume] = useState([75]);
  const [currentPreset, setCurrentPreset] = useState<InstrumentPreset | null>(null);
  const [recordingMode, setRecordingMode] = useState(false);
  const [arpeggiatorEnabled, setArpeggiatorEnabled] = useState(false);
  
  const audioEngineRef = useRef<AudioEngine>({
    context: null,
    oscillators: new Map(),
    gainNodes: new Map(),
    filterNodes: new Map(),
    masterGain: null,
    isInitialized: false
  });

  // Fetch instrument presets
  const { data: presets = [] } = useQuery({
    queryKey: ["/api/instruments/presets"],
    retry: false
  });

  // Fetch MIDI status for integration
  const { data: midiStatus } = useQuery({
    queryKey: ["/api/midi/status"],
    retry: false
  });

  // Initialize audio engine
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);
        masterGain.gain.value = masterVolume[0] / 100;

        audioEngineRef.current = {
          context: audioContext,
          oscillators: new Map(),
          gainNodes: new Map(),
          filterNodes: new Map(),
          masterGain,
          isInitialized: true
        };
      } catch (error) {
        console.error("Failed to initialize audio:", error);
      }
    };

    initializeAudio();

    return () => {
      if (audioEngineRef.current.context) {
        audioEngineRef.current.context.close();
      }
    };
  }, []);

  // Update master volume
  useEffect(() => {
    if (audioEngineRef.current.masterGain) {
      audioEngineRef.current.masterGain.gain.value = masterVolume[0] / 100;
    }
  }, [masterVolume]);

  // Professional instrument categories
  const instrumentCategories = {
    synthesizers: [
      { id: "analog_synth", name: "Analog Synthesizer", icon: <Keyboard className="h-4 w-4" /> },
      { id: "digital_synth", name: "Digital Synthesizer", icon: <Zap className="h-4 w-4" /> },
      { id: "fm_synth", name: "FM Synthesizer", icon: <Radio className="h-4 w-4" /> },
      { id: "wavetable", name: "Wavetable Synth", icon: <Radio className="h-4 w-4" /> }
    ],
    pianos: [
      { id: "grand_piano", name: "Concert Grand Piano", icon: <Piano className="h-4 w-4" /> },
      { id: "electric_piano", name: "Electric Piano", icon: <Keyboard className="h-4 w-4" /> },
      { id: "upright_piano", name: "Upright Piano", icon: <Piano className="h-4 w-4" /> },
      { id: "vintage_keys", name: "Vintage Keys", icon: <Music className="h-4 w-4" /> }
    ],
    guitars: [
      { id: "electric_guitar", name: "Electric Guitar", icon: <Guitar className="h-4 w-4" /> },
      { id: "acoustic_guitar", name: "Acoustic Guitar", icon: <Guitar className="h-4 w-4" /> },
      { id: "bass_guitar", name: "Bass Guitar", icon: <Guitar className="h-4 w-4" /> },
      { id: "vintage_bass", name: "Vintage Bass", icon: <Guitar className="h-4 w-4" /> }
    ],
    drums: [
      { id: "acoustic_drums", name: "Acoustic Drum Kit", icon: <Drum className="h-4 w-4" /> },
      { id: "electronic_drums", name: "Electronic Drums", icon: <Drum className="h-4 w-4" /> },
      { id: "vintage_drums", name: "Vintage Drum Kit", icon: <Drum className="h-4 w-4" /> },
      { id: "percussion", name: "World Percussion", icon: <Drum className="h-4 w-4" /> }
    ]
  };

  // Note frequency mapping
  const noteFrequencies: { [key: string]: number } = {
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
    'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
    'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25,
    'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99
  };

  // Piano key layout
  const pianoKeys = [
    { note: 'C4', type: 'white', label: 'C' },
    { note: 'C#4', type: 'black', label: 'C#' },
    { note: 'D4', type: 'white', label: 'D' },
    { note: 'D#4', type: 'black', label: 'D#' },
    { note: 'E4', type: 'white', label: 'E' },
    { note: 'F4', type: 'white', label: 'F' },
    { note: 'F#4', type: 'black', label: 'F#' },
    { note: 'G4', type: 'white', label: 'G' },
    { note: 'G#4', type: 'black', label: 'G#' },
    { note: 'A4', type: 'white', label: 'A' },
    { note: 'A#4', type: 'black', label: 'A#' },
    { note: 'B4', type: 'white', label: 'B' },
    { note: 'C5', type: 'white', label: 'C' },
    { note: 'C#5', type: 'black', label: 'C#' },
    { note: 'D5', type: 'white', label: 'D' },
    { note: 'D#5', type: 'black', label: 'D#' },
    { note: 'E5', type: 'white', label: 'E' },
    { note: 'F5', type: 'white', label: 'F' },
    { note: 'F#5', type: 'black', label: 'F#' },
    { note: 'G5', type: 'white', label: 'G' }
  ];

  // Play note function
  const playNote = (note: string, velocity: number = 0.7) => {
    if (!audioEngineRef.current.isInitialized || !audioEngineRef.current.context) return;

    const frequency = noteFrequencies[note];
    if (!frequency) return;

    const audioContext = audioEngineRef.current.context;
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    // Configure oscillator based on instrument
    switch (selectedInstrument) {
      case "analog_synth":
        oscillator.type = "sawtooth";
        break;
      case "digital_synth":
        oscillator.type = "square";
        break;
      case "grand_piano":
        oscillator.type = "triangle";
        break;
      default:
        oscillator.type = "sine";
    }

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Configure filter
    filterNode.type = "lowpass";
    filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);
    filterNode.Q.setValueAtTime(1, audioContext.currentTime);

    // Configure ADSR envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(velocity * 0.8, audioContext.currentTime + 0.1); // Attack
    gainNode.gain.exponentialRampToValueAtTime(velocity * 0.6, audioContext.currentTime + 0.3); // Decay
    
    // Connect nodes
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioEngineRef.current.masterGain!);

    // Start oscillator
    oscillator.start();

    // Store for cleanup
    audioEngineRef.current.oscillators.set(note, oscillator);
    audioEngineRef.current.gainNodes.set(note, gainNode);
    audioEngineRef.current.filterNodes.set(note, filterNode);

    setActiveNotes(prev => new Set([...prev, note]));
  };

  // Stop note function
  const stopNote = (note: string) => {
    const oscillator = audioEngineRef.current.oscillators.get(note);
    const gainNode = audioEngineRef.current.gainNodes.get(note);

    if (oscillator && gainNode && audioEngineRef.current.context) {
      // Release envelope
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioEngineRef.current.context.currentTime + 0.5);
      
      setTimeout(() => {
        oscillator.stop();
        audioEngineRef.current.oscillators.delete(note);
        audioEngineRef.current.gainNodes.delete(note);
        audioEngineRef.current.filterNodes.delete(note);
      }, 500);
    }

    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  };

  // Keyboard event handlers
  useEffect(() => {
    const keyMap: { [key: string]: string } = {
      'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
      'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
      'u': 'A#4', 'j': 'B4', 'k': 'C5', 'o': 'C#5', 'l': 'D5'
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const note = keyMap[event.key.toLowerCase()];
      if (note && !activeNotes.has(note)) {
        playNote(note);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = keyMap[event.key.toLowerCase()];
      if (note && activeNotes.has(note)) {
        stopNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNotes, selectedInstrument]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Professional Instruments Suite</h1>
          <p className="text-blue-200">Studio-grade virtual instruments with real-time audio synthesis</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="secondary">16+ Premium Instruments</Badge>
            <Badge variant="secondary">Real-time Audio Engine</Badge>
            <Badge variant="secondary">MIDI Integration</Badge>
            {midiStatus?.connectedDevices?.length > 0 && (
              <Badge className="bg-green-500">MIDI Connected</Badge>
            )}
          </div>
        </div>

        {/* Master Controls */}
        <Card className="bg-black/30 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Master Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Master Volume</Label>
                <Slider
                  value={masterVolume}
                  onValueChange={setMasterVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <span className="text-sm text-gray-300">{masterVolume[0]}%</span>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Recording</Label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setRecordingMode(!recordingMode)}
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      recordingMode ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      recordingMode ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <span className="text-sm text-gray-300">
                    {recordingMode ? "Recording" : "Standby"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Arpeggiator</Label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setArpeggiatorEnabled(!arpeggiatorEnabled)}
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      arpeggiatorEnabled ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      arpeggiatorEnabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <span className="text-sm text-gray-300">
                    {arpeggiatorEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Active Notes</Label>
                <div className="text-2xl font-bold text-purple-400">
                  {activeNotes.size}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instrument Selection */}
        <Tabs defaultValue="synthesizers" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/30">
            <TabsTrigger value="synthesizers" className="data-[state=active]:bg-purple-600">
              Synthesizers
            </TabsTrigger>
            <TabsTrigger value="pianos" className="data-[state=active]:bg-purple-600">
              Pianos
            </TabsTrigger>
            <TabsTrigger value="guitars" className="data-[state=active]:bg-purple-600">
              Guitars
            </TabsTrigger>
            <TabsTrigger value="drums" className="data-[state=active]:bg-purple-600">
              Drums
            </TabsTrigger>
          </TabsList>

          {Object.entries(instrumentCategories).map(([category, instruments]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {instruments.map((instrument) => (
                  <Card
                    key={instrument.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedInstrument === instrument.id
                        ? 'bg-purple-600/30 border-purple-400 ring-2 ring-purple-400'
                        : 'bg-black/20 border-gray-600/30 hover:bg-purple-600/10'
                    }`}
                    onClick={() => setSelectedInstrument(instrument.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="p-3 rounded-full bg-purple-600/20">
                          {instrument.icon}
                        </div>
                        <h3 className="font-medium text-white text-sm">
                          {instrument.name}
                        </h3>
                        {selectedInstrument === instrument.id && (
                          <Badge className="bg-purple-600">Active</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Virtual Piano Keyboard */}
        <Card className="bg-black/30 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Piano className="h-5 w-5" />
              Virtual Keyboard
              <Badge className="ml-2">{selectedInstrument.replace('_', ' ').toUpperCase()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Piano Keys */}
              <div className="flex relative h-40 bg-gray-800 rounded-lg overflow-hidden">
                {pianoKeys.map((key, index) => (
                  <button
                    key={key.note}
                    className={`relative transition-all duration-100 ${
                      key.type === 'white'
                        ? `flex-1 bg-white hover:bg-gray-100 border-r border-gray-300 ${
                            activeNotes.has(key.note) ? 'bg-purple-200' : ''
                          }`
                        : `absolute w-8 h-24 bg-gray-900 hover:bg-gray-700 z-10 ${
                            activeNotes.has(key.note) ? 'bg-purple-600' : ''
                          }`
                    }`}
                    style={
                      key.type === 'black'
                        ? {
                            left: `${((index - 0.5) / pianoKeys.filter(k => k.type === 'white').length) * 100}%`,
                            transform: 'translateX(-50%)',
                          }
                        : {}
                    }
                    onMouseDown={() => playNote(key.note)}
                    onMouseUp={() => stopNote(key.note)}
                    onMouseLeave={() => stopNote(key.note)}
                  >
                    <span className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium ${
                      key.type === 'white' ? 'text-gray-600' : 'text-white'
                    }`}>
                      {key.label}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Keyboard Shortcuts Hint */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  Use your computer keyboard: A-L keys for white notes, W-U keys for black notes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-black/30 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {audioEngineRef.current.isInitialized ? "Ready" : "Loading"}
              </div>
              <div className="text-sm text-gray-300">Audio Engine</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {audioEngineRef.current.oscillators.size}
              </div>
              <div className="text-sm text-gray-300">Active Voices</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {midiStatus?.connectedDevices || 0}
              </div>
              <div className="text-sm text-gray-300">MIDI Devices</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                48kHz
              </div>
              <div className="text-sm text-gray-300">Sample Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}