import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Piano, Volume2, Settings, Download, Upload, 
  RotateCcw, Mic, Play, Square, Activity 
} from "lucide-react";

interface PianoKey {
  note: string;
  frequency: number;
  octave: number;
  isBlack: boolean;
  midiNote: number;
}

interface ProfessionalPianoProps {
  onNotePlay?: (note: string, velocity: number) => void;
  onNoteStop?: (note: string) => void;
  octaves?: number;
  startOctave?: number;
  velocity?: number;
  sustain?: boolean;
  showLabels?: boolean;
  enableRecording?: boolean;
}

export default function ProfessionalPiano({
  onNotePlay,
  onNoteStop,
  octaves = 2,
  startOctave = 3,
  velocity = 80,
  sustain = false,
  showLabels = true,
  enableRecording = false
}: ProfessionalPianoProps) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [currentVelocity, setCurrentVelocity] = useState([velocity]);
  const [sustainEnabled, setSustainEnabled] = useState(sustain);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<Array<{note: string, time: number, velocity: number}>>([]);
  const [selectedInstrument, setSelectedInstrument] = useState("piano");
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());

  const instruments = [
    { id: "piano", name: "Grand Piano", type: "acoustic" },
    { id: "electric", name: "Electric Piano", type: "electric" },
    { id: "organ", name: "Hammond Organ", type: "organ" },
    { id: "synth", name: "Analog Synth", type: "synthesizer" },
    { id: "strings", name: "String Ensemble", type: "strings" }
  ];

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && !audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
    }
  }, [audioContext]);

  useEffect(() => {
    // Keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMapping: { [key: string]: string } = {
        'a': 'C3', 'w': 'C#3', 's': 'D3', 'e': 'D#3', 'd': 'F3',
        'f': 'F#3', 't': 'G3', 'g': 'G#3', 'y': 'A3', 'h': 'A#3',
        'u': 'B3', 'j': 'C4', 'i': 'C#4', 'k': 'D4', 'o': 'D#4',
        'l': 'E4', ';': 'F4', 'p': 'F#4', "'": 'G4'
      };

      const note = keyMapping[e.key.toLowerCase()];
      if (note && !pressedKeys.has(note)) {
        playNote(note, currentVelocity[0]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyMapping: { [key: string]: string } = {
        'a': 'C3', 'w': 'C#3', 's': 'D3', 'e': 'D#3', 'd': 'F3',
        'f': 'F#3', 't': 'G3', 'g': 'G#3', 'y': 'A3', 'h': 'A#3',
        'u': 'B3', 'j': 'C4', 'i': 'C#4', 'k': 'D4', 'o': 'D#4',
        'l': 'E4', ';': 'F4', 'p': 'F#4', "'": 'G4'
      };

      const note = keyMapping[e.key.toLowerCase()];
      if (note) {
        stopNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedKeys, currentVelocity]);

  const generateKeys = (): PianoKey[] => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keys: PianoKey[] = [];

    for (let octave = startOctave; octave < startOctave + octaves; octave++) {
      notes.forEach((note, index) => {
        const midiNote = (octave + 1) * 12 + index;
        const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
        
        keys.push({
          note: `${note}${octave}`,
          frequency,
          octave,
          isBlack: note.includes('#'),
          midiNote
        });
      });
    }

    return keys;
  };

  const playNote = (note: string, vel: number) => {
    if (!audioContext) return;

    const key = keys.find(k => k.note === note);
    if (!key) return;

    // Stop existing oscillator for this note
    const existingOsc = oscillatorsRef.current.get(note);
    if (existingOsc) {
      existingOsc.stop();
      oscillatorsRef.current.delete(note);
    }

    // Create new oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Configure based on selected instrument
    switch (selectedInstrument) {
      case "piano":
        oscillator.type = "triangle";
        break;
      case "electric":
        oscillator.type = "square";
        break;
      case "organ":
        oscillator.type = "sawtooth";
        break;
      case "synth":
        oscillator.type = "square";
        break;
      case "strings":
        oscillator.type = "sawtooth";
        break;
      default:
        oscillator.type = "sine";
    }

    oscillator.frequency.setValueAtTime(key.frequency, audioContext.currentTime);
    
    // Apply velocity
    const volume = (vel / 127) * 0.3;
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start oscillator
    oscillator.start();
    oscillatorsRef.current.set(note, oscillator);

    // Update state
    setPressedKeys(prev => new Set(prev).add(note));

    // Record note if recording
    if (isRecording) {
      setRecordedNotes(prev => [...prev, {
        note,
        time: Date.now(),
        velocity: vel
      }]);
    }

    // Callback
    onNotePlay?.(note, vel);
  };

  const stopNote = (note: string) => {
    if (!sustainEnabled) {
      const oscillator = oscillatorsRef.current.get(note);
      if (oscillator && audioContext) {
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        setTimeout(() => {
          oscillator.stop();
          oscillatorsRef.current.delete(note);
        }, 500);
      }
    }

    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });

    onNoteStop?.(note);
  };

  const stopAllNotes = () => {
    oscillatorsRef.current.forEach((osc, note) => {
      osc.stop();
    });
    oscillatorsRef.current.clear();
    setPressedKeys(new Set());
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      console.log('Recorded notes:', recordedNotes);
    } else {
      setRecordedNotes([]);
      setIsRecording(true);
    }
  };

  const keys = generateKeys();
  const whiteKeys = keys.filter(key => !key.isBlack);
  const blackKeys = keys.filter(key => key.isBlack);

  return (
    <Card className="bg-gray-900 border-gray-700 p-4">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Piano className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">Professional Piano</span>
          </div>
          
          <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {instruments.map(instrument => (
                <SelectItem key={instrument.id} value={instrument.id}>
                  {instrument.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4" />
            <Slider
              value={currentVelocity}
              onValueChange={setCurrentVelocity}
              min={1}
              max={127}
              step={1}
              className="w-20"
            />
            <span className="text-xs font-mono w-8">{currentVelocity[0]}</span>
          </div>

          <Button
            variant={sustainEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setSustainEnabled(!sustainEnabled)}
          >
            Sustain
          </Button>

          {enableRecording && (
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={toggleRecording}
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={stopAllNotes}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Piano Keyboard */}
      <div className="relative bg-gray-800 p-4 rounded-lg">
        <div className="relative flex">
          {/* White Keys */}
          {whiteKeys.map((key) => (
            <div
              key={key.note}
              className={`
                relative w-12 h-32 bg-white border border-gray-300 cursor-pointer
                transition-all duration-75 select-none
                ${pressedKeys.has(key.note) 
                  ? 'bg-blue-200 shadow-inner' 
                  : 'hover:bg-gray-100 shadow-sm'
                }
              `}
              onMouseDown={() => playNote(key.note, currentVelocity[0])}
              onMouseUp={() => stopNote(key.note)}
              onMouseLeave={() => stopNote(key.note)}
            >
              {showLabels && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                  {key.note}
                </div>
              )}
            </div>
          ))}

          {/* Black Keys */}
          <div className="absolute top-0 left-0 flex">
            {keys.map((key, index) => {
              if (!key.isBlack) return null;

              // Calculate position based on white key pattern
              const whiteKeyIndex = whiteKeys.findIndex(wk => 
                wk.octave === key.octave && 
                notes.indexOf(wk.note.replace(/\d/, '')) < notes.indexOf(key.note.replace(/\d/, ''))
              );
              
              const leftOffset = whiteKeyIndex * 48 + 36; // 48px per white key, offset by 36px

              return (
                <div
                  key={key.note}
                  className={`
                    absolute w-8 h-20 bg-gray-900 border border-gray-700 cursor-pointer
                    transition-all duration-75 select-none z-10 rounded-b
                    ${pressedKeys.has(key.note) 
                      ? 'bg-blue-600 shadow-inner' 
                      : 'hover:bg-gray-700 shadow-md'
                    }
                  `}
                  style={{ left: `${leftOffset}px` }}
                  onMouseDown={() => playNote(key.note, currentVelocity[0])}
                  onMouseUp={() => stopNote(key.note)}
                  onMouseLeave={() => stopNote(key.note)}
                >
                  {showLabels && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-300">
                      {key.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status and Info */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3 text-green-400" />
            <span>Audio Context: {audioContext ? 'Active' : 'Inactive'}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <span>Keys: {octaves} octaves</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <span>Instrument: {instruments.find(i => i.id === selectedInstrument)?.name}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span>Pressed: {pressedKeys.size}</span>
          {isRecording && (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span>Recording</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="mt-2 text-xs text-gray-500">
        Keyboard: A-L keys play notes, W/E/T/Y/U/I/O/P for sharps/flats
      </div>
    </Card>
  );

  // Helper function - should be outside component in real implementation
  function notes(): string[] {
    return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  }
}