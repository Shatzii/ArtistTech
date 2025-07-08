import { useEffect, useRef, useState } from 'react';

interface WaveformProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  height?: number;
  waveformData?: number[];
  color?: string;
  backgroundColor?: string;
  progressColor?: string;
}

export default function Waveform({
  currentTime,
  duration,
  isPlaying,
  onSeek,
  height = 60,
  waveformData,
  color = '#3b82f6',
  backgroundColor = '#1f2937',
  progressColor = '#60a5fa'
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Generate demo waveform data if none provided
  const generateWaveform = () => {
    const samples = 200;
    const data = [];
    for (let i = 0; i < samples; i++) {
      // Create a realistic waveform pattern
      const base = Math.sin(i * 0.1) * 0.5;
      const variation = Math.random() * 0.3;
      const envelope = Math.sin((i / samples) * Math.PI) * 0.8;
      data.push(Math.abs(base + variation) * envelope);
    }
    return data;
  };

  const waveform = waveformData || generateWaveform();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const progress = duration > 0 ? currentTime / duration : 0;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    const barWidth = width / waveform.length;
    const maxBarHeight = height * 0.8;

    for (let i = 0; i < waveform.length; i++) {
      const barHeight = waveform[i] * maxBarHeight;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      // Determine color based on progress
      const barProgress = i / waveform.length;
      const isPlayed = barProgress <= progress;
      
      ctx.fillStyle = isPlayed ? progressColor : color;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }

    // Draw progress line
    const progressX = width * progress;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, height);
    ctx.stroke();

    // Draw time markers every 10 seconds
    if (duration > 10) {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      for (let t = 0; t <= duration; t += 10) {
        const markerX = (t / duration) * width;
        const minutes = Math.floor(t / 60);
        const seconds = Math.floor(t % 60);
        const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Draw marker line
        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(markerX, height - 10);
        ctx.lineTo(markerX, height);
        ctx.stroke();
        
        // Draw time text
        if (markerX < width - 30) {
          ctx.fillText(timeText, markerX + 2, height - 2);
        }
      }
    }

    // Draw playing indicator
    if (isPlaying) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(progressX, height / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [currentTime, duration, isPlaying, waveform, color, backgroundColor, progressColor]);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(event);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      handleSeek(event);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSeek = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const seekTime = (x / width) * duration;
    
    onSeek(Math.max(0, Math.min(duration, seekTime)));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Time display */}
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      {/* Waveform canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        className="w-full cursor-pointer rounded border border-gray-600 hover:border-gray-500 transition-colors"
        style={{ height: `${height}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Additional controls overlay */}
      <div className="absolute top-0 right-0 p-2 text-xs text-gray-400">
        {isPlaying && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        )}
      </div>
    </div>
  );
}