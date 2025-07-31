import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  ZoomIn, ZoomOut, Scissors, Copy, Trash2 
} from "lucide-react";

interface WaveformVisualizerProps {
  audioUrl?: string;
  width?: number;
  height?: number;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  onTimeSeek?: (time: number) => void;
  onPlayPause?: () => void;
  editable?: boolean;
  showControls?: boolean;
}

export default function WaveformVisualizer({
  audioUrl,
  width = 800,
  height = 150,
  isPlaying = false,
  currentTime = 0,
  duration = 100,
  onTimeSeek,
  onPlayPause,
  editable = false,
  showControls = true
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [zoom, setZoom] = useState([100]);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined' && !audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
    }
  }, [audioContext]);

  useEffect(() => {
    if (audioUrl && audioContext) {
      loadAudioFile(audioUrl);
    }
  }, [audioUrl, audioContext]);

  useEffect(() => {
    drawWaveform();
  }, [waveformData, currentTime, selection, zoom]);

  const loadAudioFile = async (url: string) => {
    if (!audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      
      setAudioBuffer(buffer);
      generateWaveformData(buffer);
    } catch (error) {
      console.error('Failed to load audio file:', error);
      // Generate mock waveform for demo
      generateMockWaveform();
    }
  };

  const generateWaveformData = (buffer: AudioBuffer) => {
    const channelData = buffer.getChannelData(0);
    const samples = Math.floor(channelData.length / width);
    const waveform: number[] = [];

    for (let i = 0; i < width; i++) {
      const start = Math.floor(i * samples);
      const end = Math.floor((i + 1) * samples);
      let max = 0;

      for (let j = start; j < end; j++) {
        const sample = Math.abs(channelData[j]);
        if (sample > max) max = sample;
      }

      waveform.push(max);
    }

    setWaveformData(waveform);
  };

  const generateMockWaveform = () => {
    const mockData: number[] = [];
    for (let i = 0; i < width; i++) {
      const freq1 = Math.sin(i * 0.02) * 0.5;
      const freq2 = Math.sin(i * 0.05) * 0.3;
      const noise = (Math.random() - 0.5) * 0.1;
      mockData.push(Math.abs(freq1 + freq2 + noise));
    }
    setWaveformData(mockData);
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(75, 85, 99, 0.3)';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let y = 0; y <= height; y += height / 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical lines (time markers)
    const timeStep = width / 10;
    for (let x = 0; x <= width; x += timeStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw selection background
    if (selection) {
      const startX = (selection.start / duration) * width;
      const endX = (selection.end / duration) * width;
      
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.fillRect(startX, 0, endX - startX, height);
    }

    // Draw waveform
    const centerY = height / 2;
    const zoomLevel = zoom[0] / 100;
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let i = 0; i < waveformData.length; i++) {
      const x = (i / waveformData.length) * width;
      const amplitude = waveformData[i] * centerY * zoomLevel;
      
      // Draw positive wave
      ctx.moveTo(x, centerY);
      ctx.lineTo(x, centerY - amplitude);
      
      // Draw negative wave
      ctx.moveTo(x, centerY);
      ctx.lineTo(x, centerY + amplitude);
    }
    
    ctx.stroke();

    // Draw progress indicator
    const progressX = (currentTime / duration) * width;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, height);
    ctx.stroke();

    // Draw time markers
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px monospace';
    
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      const time = (i / 10) * duration;
      const timeText = formatTime(time);
      
      ctx.fillText(timeText, x + 2, height - 5);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !onTimeSeek) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = (x / width) * duration;
    
    onTimeSeek(clickTime);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!editable) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const startTime = (x / width) * duration;

    setSelection({ start: startTime, end: startTime });
    setIsDragging(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selection || !editable) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const endTime = (x / width) * duration;

    setSelection(prev => prev ? { ...prev, end: endTime } : null);
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const clearSelection = () => {
    setSelection(null);
  };

  const copySelection = () => {
    if (selection) {
      console.log('Copying selection:', selection);
      // Implement copy functionality
    }
  };

  const deleteSelection = () => {
    if (selection) {
      console.log('Deleting selection:', selection);
      // Implement delete functionality
      setSelection(null);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700 p-4">
      {showControls && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onPlayPause}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button variant="ghost" size="sm">
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs">Zoom:</span>
              <Button variant="ghost" size="sm" onClick={() => setZoom([Math.max(25, zoom[0] - 25)])}>
                <ZoomOut className="w-3 h-3" />
              </Button>
              <Slider
                value={zoom}
                onValueChange={setZoom}
                min={25}
                max={400}
                step={25}
                className="w-20"
              />
              <Button variant="ghost" size="sm" onClick={() => setZoom([Math.min(400, zoom[0] + 25)])}>
                <ZoomIn className="w-3 h-3" />
              </Button>
              <span className="text-xs font-mono w-12">{zoom[0]}%</span>
            </div>

            {editable && (
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={copySelection} disabled={!selection}>
                  <Copy className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={deleteSelection} disabled={!selection}>
                  <Trash2 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Scissors className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-600 rounded cursor-pointer bg-gray-800"
          onClick={handleCanvasClick}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
        
        {selection && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-xs">
              Selection: {formatTime(selection.start)} - {formatTime(selection.end)}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
        <span>{formatTime(currentTime)}</span>
        <div className="flex items-center space-x-4">
          <span>Duration: {formatTime(duration)}</span>
          <span>Sample Rate: 44.1kHz</span>
          <span>Bit Depth: 24-bit</span>
        </div>
        <span>{formatTime(duration)}</span>
      </div>
    </Card>
  );
}