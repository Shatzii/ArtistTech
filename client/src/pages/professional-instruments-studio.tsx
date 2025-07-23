import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Music, Piano, Guitar, Drum, Headphones, Mic, Volume2,
  Play, Pause, Square, RotateCcw, Save, Upload, Settings,
  Zap, Crown, Star, TrendingUp, Layers, Filter, Sparkles
} from "lucide-react";

export default function ProfessionalInstrumentsStudio() {
  const [activeInstrument, setActiveInstrument] = useState("piano");
  const [currentOctave, setCurrentOctave] = useState(4);
  const [masterVolume, setMasterVolume] = useState([75]);
  const [selectedPreset, setSelectedPreset] = useState("grand-piano");
  const [isRecording, setIsRecording] = useState(false);
  const [keyboardPressed, setKeyboardPressed] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const queryClient = useQueryClient();

  // Fetch instrument presets
  const { data: presets } = useQuery({
    queryKey: ["/api/instruments/presets"],
    enabled: true
  });

  const { data: recordings } = useQuery({
    queryKey: ["/api/instruments/recordings"],
    enabled: true
  });

  // Recording mutation
  const recordMutation = useMutation({
    mutationFn: async (recordingData: any) => {
      return await apiRequest("/api/instruments/record", {
        method: "POST",
        body: JSON.stringify(recordingData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/instruments/recordings"] });
    }
  });

  const instruments = [
    {
      id: "piano",
      name: "Grand Piano",
      icon: Piano,
      category: "Keys",
      presets: ["Grand Piano", "Electric Piano", "Honky Tonk", "Church Organ"],
      color: "bg-blue-600"
    },
    {
      id: "guitar",
      name: "Electric Guitar",
      icon: Guitar,
      category: "Strings",
      presets: ["Clean Electric", "Overdriven", "Distorted", "Acoustic"],
      color: "bg-red-600"
    },
    {
      id: "drums",
      name: "Drum Kit",
      icon: Drum,
      category: "Percussion",
      presets: ["Rock Kit", "Jazz Kit", "Electronic", "Orchestral"],
      color: "bg-green-600"
    },
    {
      id: "synth",
      name: "Synthesizer",
      icon: Music,
      category: "Synth",
      presets: ["Lead Synth", "Pad", "Bass", "Arp"],
      color: "bg-purple-600"
    }
  ];

  const pianoKeys = [
    { note: "C", type: "white", midi: 60 },
    { note: "C#", type: "black", midi: 61 },
    { note: "D", type: "white", midi: 62 },
    { note: "D#", type: "black", midi: 63 },
    { note: "E", type: "white", midi: 64 },
    { note: "F", type: "white", midi: 65 },
    { note: "F#", type: "black", midi: 66 },
    { note: "G", type: "white", midi: 67 },
    { note: "G#", type: "black", midi: 68 },
    { note: "A", type: "white", midi: 69 },
    { note: "A#", type: "black", midi: 70 },
    { note: "B", type: "white", midi: 71 }
  ];

  const effectChains = [
    { 
      id: "reverb", 
      name: "Reverb", 
      enabled: true, 
      intensity: 30,
      type: "Hall"
    },
    { 
      id: "delay", 
      name: "Delay", 
      enabled: false, 
      intensity: 15,
      type: "Stereo"
    },
    { 
      id: "chorus", 
      name: "Chorus", 
      enabled: true, 
      intensity: 25,
      type: "Classic"
    },
    { 
      id: "distortion", 
      name: "Distortion", 
      enabled: false, 
      intensity: 40,
      type: "Tube"
    }
  ];

  const drumPads = [
    { id: "kick", name: "Kick", key: "Q", x: 0, y: 0 },
    { id: "snare", name: "Snare", key: "W", x: 1, y: 0 },
    { id: "hihat", name: "Hi-Hat", key: "E", x: 2, y: 0 },
    { id: "crash", name: "Crash", key: "R", x: 3, y: 0 },
    { id: "tom1", name: "Tom 1", key: "A", x: 0, y: 1 },
    { id: "tom2", name: "Tom 2", key: "S", x: 1, y: 1 },
    { id: "tom3", name: "Tom 3", key: "D", x: 2, y: 1 },
    { id: "ride", name: "Ride", key: "F", x: 3, y: 1 }
  ];

  const playNote = (note: string, velocity: number = 127) => {
    // Simulate playing a note - in production would use Web Audio API
    console.log(`Playing ${note} with velocity ${velocity}`);
    
    // Visual feedback
    setKeyboardPressed(prev => new Set([...prev, note]));
    setTimeout(() => {
      setKeyboardPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 200);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    const keyMap: { [key: string]: string } = {
      'q': 'C', 'w': 'D', 'e': 'E', 'r': 'F', 't': 'G', 'y': 'A', 'u': 'B',
      '2': 'C#', '3': 'D#', '5': 'F#', '6': 'G#', '7': 'A#'
    };

    const note = keyMap[event.key.toLowerCase()];
    if (note && !event.repeat) {
      playNote(note);
    }
  };

  const renderPianoKeyboard = () => {
    const octaves = [3, 4, 5];
    
    return (
      <div className="relative bg-black p-4 rounded-lg">
        <div className="flex">
          {octaves.map(octave =>
            pianoKeys.map((key, index) => {
              const noteId = `${key.note}${octave}`;
              const isPressed = keyboardPressed.has(key.note);
              
              if (key.type === "white") {
                return (
                  <button
                    key={noteId}
                    className={`w-12 h-40 border border-gray-300 ${
                      isPressed ? 'bg-blue-300' : 'bg-white'
                    } hover:bg-gray-100 transition-colors relative`}
                    onMouseDown={() => playNote(key.note)}
                  >
                    <span className="absolute bottom-2 text-xs text-gray-600">
                      {key.note}{octave}
                    </span>
                  </button>
                );
              }
              return null;
            })
          )}
        </div>
        
        {/* Black keys overlay */}
        <div className="absolute top-4 left-4 flex">
          {octaves.map(octave =>
            pianoKeys.map((key, index) => {
              if (key.type === "black") {
                const noteId = `${key.note}${octave}`;
                const isPressed = keyboardPressed.has(key.note);
                const leftOffset = getBlackKeyOffset(key.note, index);
                
                return (
                  <button
                    key={noteId}
                    className={`w-8 h-24 ${
                      isPressed ? 'bg-gray-600' : 'bg-gray-800'
                    } hover:bg-gray-700 transition-colors absolute rounded-b`}
                    style={{ left: `${leftOffset}px` }}
                    onMouseDown={() => playNote(key.note)}
                  >
                    <span className="absolute bottom-1 text-xs text-white">
                      {key.note}{octave}
                    </span>
                  </button>
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    );
  };

  const getBlackKeyOffset = (note: string, index: number): number => {
    const offsets: { [key: string]: number } = {
      'C#': 36, 'D#': 84, 'F#': 180, 'G#': 228, 'A#': 276
    };
    return offsets[note] || 0;
  };

  const renderDrumPads = () => {
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        {drumPads.map(pad => (
          <button
            key={pad.id}
            className={`aspect-square bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-lg flex flex-col items-center justify-center text-white font-bold transition-all ${
              keyboardPressed.has(pad.key) ? 'scale-95 brightness-125' : ''
            }`}
            onMouseDown={() => {
              playNote(pad.id);
              setKeyboardPressed(prev => new Set([...prev, pad.key]));
              setTimeout(() => {
                setKeyboardPressed(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(pad.key);
                  return newSet;
                });
              }, 150);
            }}
          >
            <span className="text-lg">{pad.name}</span>
            <span className="text-xs bg-black/30 px-2 py-1 rounded">{pad.key}</span>
          </button>
        ))}
      </div>
    );
  };

  const currentInstrument = instruments.find(inst => inst.id === activeInstrument);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-indigo-900 text-white" onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/artist-tech-logo.jpeg" 
              alt="Artist Tech" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">Professional Instruments Studio</h1>
              <p className="text-white/60">Studio-grade virtual instruments and effects</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Crown className="w-4 h-4 mr-1" />
              Studio Quality
            </Badge>
            <Button 
              onClick={() => setIsRecording(!isRecording)}
              className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Instrument Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {instruments.map(instrument => (
            <Card 
              key={instrument.id}
              className={`cursor-pointer transition-all ${
                activeInstrument === instrument.id 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400' 
                  : 'bg-black/40 border-purple-500/30 hover:border-purple-400/50'
              }`}
              onClick={() => setActiveInstrument(instrument.id)}
            >
              <CardContent className="p-4 text-center">
                <instrument.icon className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold">{instrument.name}</h3>
                <p className="text-sm text-white/60">{instrument.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Instrument Interface */}
          <div className="lg:col-span-3">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-white">
                    {currentInstrument && <currentInstrument.icon className="w-6 h-6 mr-2" />}
                    {currentInstrument?.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <select 
                      value={selectedPreset}
                      onChange={(e) => setSelectedPreset(e.target.value)}
                      className="bg-black/50 border border-purple-500/30 rounded px-3 py-1 text-sm"
                    >
                      {currentInstrument?.presets.map(preset => (
                        <option key={preset} value={preset.toLowerCase().replace(' ', '-')}>
                          {preset}
                        </option>
                      ))}
                    </select>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {masterVolume[0]}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Piano Interface */}
                {activeInstrument === "piano" && (
                  <div className="space-y-4">
                    {renderPianoKeyboard()}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button size="sm" variant="outline" onClick={() => setCurrentOctave(Math.max(1, currentOctave - 1))}>
                          Oct -
                        </Button>
                        <span className="text-sm font-medium">Octave {currentOctave}</span>
                        <Button size="sm" variant="outline" onClick={() => setCurrentOctave(Math.min(8, currentOctave + 1))}>
                          Oct +
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">Sustain</span>
                        <Button size="sm" variant="outline">
                          <Headphones className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Drum Interface */}
                {activeInstrument === "drums" && (
                  <div className="space-y-4">
                    {renderDrumPads()}
                    
                    <div className="bg-black/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Drum Patterns</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {["Rock Beat", "Jazz Swing", "Hip-Hop", "Latin", "Funk", "Ballad"].map(pattern => (
                          <Button key={pattern} size="sm" variant="outline" className="border-red-500/30">
                            {pattern}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Guitar Interface */}
                {activeInstrument === "guitar" && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 p-6 rounded-lg">
                      <h4 className="font-medium mb-4">Fretboard</h4>
                      <div className="space-y-2">
                        {["E", "A", "D", "G", "B", "E"].map((string, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="w-4 text-sm font-medium">{string}</span>
                            <div className="flex-1 h-8 bg-gradient-to-r from-yellow-800 to-yellow-600 rounded-full relative">
                              {Array.from({ length: 12 }, (_, fret) => (
                                <button
                                  key={fret}
                                  className="absolute top-0 bottom-0 w-6 hover:bg-white/20 transition-colors"
                                  style={{ left: `${(fret / 12) * 100}%` }}
                                  onClick={() => playNote(`${string}${fret}`)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {["Open", "Power", "Barre", "Sus4"].map(chord => (
                        <Button key={chord} size="sm" variant="outline" className="border-orange-500/30">
                          {chord}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Synth Interface */}
                {activeInstrument === "synth" && (
                  <div className="space-y-4">
                    {renderPianoKeyboard()}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Oscillator</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm mb-1">Waveform</label>
                            <select className="w-full bg-black/50 border border-purple-500/30 rounded px-2 py-1 text-sm">
                              <option>Sine</option>
                              <option>Square</option>
                              <option>Sawtooth</option>
                              <option>Triangle</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Detune</label>
                            <Slider value={[0]} min={-50} max={50} className="w-full" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Filter</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm mb-1">Cutoff</label>
                            <Slider value={[70]} max={100} className="w-full" />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Resonance</label>
                            <Slider value={[25]} max={100} className="w-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Controls & Effects */}
          <div className="space-y-6">
            {/* Master Controls */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Master Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Volume</label>
                  <Slider
                    value={masterVolume}
                    onValueChange={setMasterVolume}
                    max={100}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Pan</label>
                  <Slider value={[0]} min={-50} max={50} className="w-full" />
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mic className="w-4 h-4 mr-1" />
                    Solo
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Volume2 className="w-4 h-4 mr-1" />
                    Mute
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Effects Chain */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Effects Chain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {effectChains.map(effect => (
                  <div key={effect.id} className="bg-black/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={effect.enabled}
                          onChange={() => {
                            // Toggle effect
                          }}
                          className="mr-2 accent-purple-500"
                        />
                        <span className="font-medium text-sm">{effect.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {effect.type}
                      </Badge>
                    </div>
                    {effect.enabled && (
                      <>
                        <Slider
                          value={[effect.intensity]}
                          max={100}
                          className="w-full mb-2"
                        />
                        <div className="flex justify-between text-xs text-white/60">
                          <span>0%</span>
                          <span>{effect.intensity}%</span>
                          <span>100%</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Add Effect
                </Button>
              </CardContent>
            </Card>

            {/* Recording Status */}
            {isRecording && (
              <Card className="bg-black/40 border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Play className="w-5 h-5 mr-2 text-red-400" />
                    Recording
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge className="bg-red-600 animate-pulse">
                        REC
                      </Badge>
                    </div>
                    <div className="text-sm text-white/60">
                      Duration: 00:32
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => setIsRecording(false)}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop & Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" className="w-full" variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preset
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Load Sample
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Tips */}
        <Card className="mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>• QWERTY keys play notes</li>
                  <li>• Numbers play black keys</li>
                  <li>• Spacebar sustains</li>
                  <li>• Ctrl+R starts recording</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Best Practices</h4>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>• Use headphones for latency</li>
                  <li>• Layer multiple instruments</li>
                  <li>• Apply effects sparingly</li>
                  <li>• Save presets regularly</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Performance</h4>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>• Low latency mode: ON</li>
                  <li>• Buffer size: 128 samples</li>
                  <li>• Sample rate: 44.1kHz</li>
                  <li>• CPU usage: 23%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}