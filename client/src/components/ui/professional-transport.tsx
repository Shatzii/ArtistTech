import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, Square, SkipBack, SkipForward, RotateCcw, 
  Volume2, Mic, Radio, Activity, Clock, Zap, Cpu 
} from "lucide-react";

interface TransportState {
  isPlaying: boolean;
  isRecording: boolean;
  isPaused: boolean;
  position: number; // in seconds
  duration: number; // in seconds
  bpm: number;
  volume: number;
  sampleRate: number;
  bufferSize: number;
  latency: number;
}

interface ProfessionalTransportProps {
  state: TransportState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRecord: () => void;
  onSeek: (position: number) => void;
  onVolumeChange: (volume: number) => void;
  onBPMChange: (bpm: number) => void;
  showAdvanced?: boolean;
  compact?: boolean;
}

export default function ProfessionalTransport({
  state,
  onPlay,
  onPause,
  onStop,
  onRecord,
  onSeek,
  onVolumeChange,
  onBPMChange,
  showAdvanced = true,
  compact = false
}: ProfessionalTransportProps) {
  const [showMetrics, setShowMetrics] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    activeVoices: 0,
    dropouts: 0
  });

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && !audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
    }
  }, [audioContext]);

  useEffect(() => {
    // Simulate performance monitoring
    const interval = setInterval(() => {
      setPerformanceMetrics(prev => ({
        cpuUsage: Math.random() * 30 + 10,
        memoryUsage: Math.random() * 40 + 20,
        activeVoices: Math.floor(Math.random() * 64),
        dropouts: prev.dropouts + (Math.random() > 0.95 ? 1 : 0)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30); // Assuming 30fps
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${frames.toString().padStart(2, '0')}`;
  };

  const formatBPM = (bpm: number): string => {
    return `${bpm.toFixed(1)} BPM`;
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2 bg-gray-900 p-2 rounded-lg">
        <Button
          variant={state.isPlaying ? "default" : "outline"}
          size="sm"
          onClick={state.isPlaying ? onPause : onPlay}
          className="w-8 h-8 p-0"
        >
          {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        
        <Button
          variant={state.isRecording ? "destructive" : "outline"}
          size="sm"
          onClick={onRecord}
          className="w-8 h-8 p-0"
        >
          <Mic className={`w-4 h-4 ${state.isRecording ? 'animate-pulse' : ''}`} />
        </Button>
        
        <div className="text-xs font-mono">{formatTime(state.position)}</div>
        <div className="text-xs text-gray-400">{formatBPM(state.bpm)}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-4">
      {/* Main Transport Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSeek(0)}
            className="w-10 h-10 p-0"
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button
            variant={state.isPlaying ? "default" : "outline"}
            size="sm"
            onClick={state.isPlaying ? onPause : onPlay}
            className="w-12 h-12 p-0"
          >
            {state.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onStop}
            className="w-10 h-10 p-0"
          >
            <Square className="w-5 h-5" />
          </Button>
          
          <Button
            variant={state.isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={onRecord}
            className="w-10 h-10 p-0"
          >
            <Mic className={`w-5 h-5 ${state.isRecording ? 'animate-pulse' : ''}`} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSeek(state.duration)}
            className="w-10 h-10 p-0"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSeek(0)}
            className="w-10 h-10 p-0"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Time Display */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-blue-400">
              {formatTime(state.position)}
            </div>
            <div className="text-xs text-gray-400">
              / {formatTime(state.duration)}
            </div>
          </div>
          
          <div className="w-px h-12 bg-gray-600" />
          
          <div className="text-center">
            <div className="text-xl font-mono font-bold text-green-400">
              {formatBPM(state.bpm)}
            </div>
            <div className="text-xs text-gray-400">Tempo</div>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <Slider
            value={[state.volume]}
            onValueChange={(value) => onVolumeChange(value[0])}
            min={0}
            max={100}
            step={1}
            className="w-24"
          />
          <span className="text-sm font-mono w-8">{state.volume}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[state.position]}
          onValueChange={(value) => onSeek(value[0])}
          min={0}
          max={state.duration}
          step={0.01}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>0:00.00</span>
          <span className="text-blue-400">Position: {(state.position / state.duration * 100).toFixed(1)}%</span>
          <span>{formatTime(state.duration)}</span>
        </div>
      </div>

      {showAdvanced && (
        <div className="border-t border-gray-700 pt-4 space-y-3">
          {/* BPM Control */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm">BPM:</span>
            </div>
            <div className="flex items-center space-x-2">
              <Slider
                value={[state.bpm]}
                onValueChange={(value) => onBPMChange(value[0])}
                min={60}
                max={200}
                step={0.1}
                className="w-32"
              />
              <span className="text-sm font-mono w-12">{state.bpm.toFixed(1)}</span>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Sample Rate:</span>
              <Badge variant="outline">{state.sampleRate / 1000}kHz</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Buffer:</span>
              <Badge variant="outline">{state.bufferSize} samples</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Latency:</span>
              <Badge variant={state.latency < 10 ? "default" : "destructive"}>
                {state.latency.toFixed(1)}ms
              </Badge>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMetrics(!showMetrics)}
              className="flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Performance</span>
            </Button>
            
            {showMetrics && (
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <Cpu className="w-3 h-3 text-blue-400" />
                  <span>{performanceMetrics.cpuUsage.toFixed(1)}%</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-green-400" />
                  <span>{performanceMetrics.memoryUsage.toFixed(1)}MB</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Radio className="w-3 h-3 text-yellow-400" />
                  <span>{performanceMetrics.activeVoices} voices</span>
                </div>
                
                {performanceMetrics.dropouts > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {performanceMetrics.dropouts} dropouts
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-1 ${audioContext ? 'text-green-400' : 'text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full ${audioContext ? 'bg-green-400' : 'bg-red-400'}`} />
            <span>Audio Engine</span>
          </div>
          
          <div className="flex items-center space-x-1 text-blue-400">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Real-time</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span>44.1kHz • 16-bit • Stereo</span>
        </div>
      </div>
    </div>
  );
}