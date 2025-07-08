import { useEffect, useRef, useState } from 'react';

interface WaveformProps {
  audioData?: Float32Array;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  height?: number;
  className?: string;
}

export default function Waveform({ 
  audioData, 
  currentTime, 
  duration, 
  isPlaying, 
  onSeek, 
  height = 100,
  className = ""
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Generate sample waveform data if none provided
  const generateSampleWaveform = (length: number = 1000): Float32Array => {
    const data = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      data[i] = Math.sin(i * 0.02) * 0.5 + Math.random() * 0.3 - 0.15;
    }
    return data;
  };

  const waveData = audioData || generateSampleWaveform();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height: canvasHeight } = canvas;
    const centerY = canvasHeight / 2;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, width, canvasHeight);

    // Draw waveform
    const sliceWidth = width / waveData.length;
    let x = 0;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#3B82F6'; // Blue color

    for (let i = 0; i < waveData.length; i++) {
      const v = waveData[i] * 0.5;
      const y = centerY + v * centerY;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();

    // Draw played portion in different color
    if (duration > 0) {
      const playedWidth = (currentTime / duration) * width;
      
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#10B981'; // Green color for played portion
      
      x = 0;
      for (let i = 0; i < waveData.length && x < playedWidth; i++) {
        const v = waveData[i] * 0.5;
        const y = centerY + v * centerY;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();

      // Draw playhead
      ctx.beginPath();
      ctx.strokeStyle = '#EF4444'; // Red color for playhead
      ctx.lineWidth = 2;
      ctx.moveTo(playedWidth, 0);
      ctx.lineTo(playedWidth, canvasHeight);
      ctx.stroke();
    }

    // Draw time markers
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px sans-serif';
    
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    ctx.fillText(timeText, 10, 20);
    
    if (duration > 0) {
      const durationMinutes = Math.floor(duration / 60);
      const durationSeconds = Math.floor(duration % 60);
      const durationText = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
      
      ctx.fillText(durationText, width - 60, 20);
    }

  }, [waveData, currentTime, duration, isPlaying]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSeek(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSeek = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || duration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const seekTime = (x / canvas.width) * duration;
    
    onSeek(Math.max(0, Math.min(seekTime, duration)));
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        className="w-full h-full cursor-pointer border border-gray-600 rounded-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Loading overlay */}
      {!audioData && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="text-white text-sm">Loading waveform...</div>
        </div>
      )}
    </div>
  );
}