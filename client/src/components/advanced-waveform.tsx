import { useEffect, useRef, useState } from 'react';

interface AdvancedWaveformProps {
  isPlaying: boolean;
  position: number;
  color: 'blue' | 'red' | 'green' | 'purple';
  title?: string;
  height?: number;
}

export default function AdvancedWaveform({ 
  isPlaying, 
  position, 
  color, 
  title,
  height = 80 
}: AdvancedWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveData, setWaveData] = useState<number[]>([]);

  const colorSchemes = {
    blue: {
      bg: 'from-blue-500/20 via-cyan-500/30 to-blue-500/20',
      active: 'rgba(6, 182, 212, 0.8)',
      inactive: 'rgba(59, 130, 246, 0.6)',
      glow: 'rgba(6, 182, 212, 0.5)'
    },
    red: {
      bg: 'from-red-500/20 via-pink-500/30 to-red-500/20',
      active: 'rgba(236, 72, 153, 0.8)',
      inactive: 'rgba(239, 68, 68, 0.6)',
      glow: 'rgba(236, 72, 153, 0.5)'
    },
    green: {
      bg: 'from-green-500/20 via-emerald-500/30 to-green-500/20',
      active: 'rgba(16, 185, 129, 0.8)',
      inactive: 'rgba(34, 197, 94, 0.6)',
      glow: 'rgba(16, 185, 129, 0.5)'
    },
    purple: {
      bg: 'from-purple-500/20 via-violet-500/30 to-purple-500/20',
      active: 'rgba(139, 92, 246, 0.8)',
      inactive: 'rgba(147, 51, 234, 0.6)',
      glow: 'rgba(139, 92, 246, 0.5)'
    }
  };

  useEffect(() => {
    // Generate realistic waveform data
    const data = [];
    for (let i = 0; i < 200; i++) {
      const base = Math.sin(i * 0.1) * 0.5;
      const high = Math.sin(i * 0.3) * 0.3;
      const noise = (Math.random() - 0.5) * 0.2;
      data.push((base + high + noise + 1) * 0.5);
    }
    setWaveData(data);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scheme = colorSchemes[color];

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw waveform
    const barWidth = width / waveData.length;
    const playPosition = (position / 100) * waveData.length;

    waveData.forEach((value, i) => {
      const barHeight = value * height * 0.8;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;
      
      const isPlayed = i < playPosition;
      const isCurrent = Math.abs(i - playPosition) < 2;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      
      if (isCurrent && isPlaying) {
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(1, scheme.active);
        ctx.shadowColor = scheme.glow;
        ctx.shadowBlur = 10;
      } else if (isPlayed) {
        gradient.addColorStop(0, scheme.active);
        gradient.addColorStop(1, scheme.inactive);
        ctx.shadowBlur = 5;
      } else {
        gradient.addColorStop(0, scheme.inactive);
        gradient.addColorStop(1, 'rgba(100, 100, 100, 0.3)');
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, Math.max(barWidth - 1, 1), barHeight);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    });

    // Draw beat grid
    const beatsPerBar = 4;
    const barsVisible = 8;
    const beatSpacing = width / (beatsPerBar * barsVisible);
    
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= beatsPerBar * barsVisible; i++) {
      const x = i * beatSpacing;
      const isDownbeat = i % beatsPerBar === 0;
      
      ctx.beginPath();
      ctx.moveTo(x, isDownbeat ? 0 : height * 0.2);
      ctx.lineTo(x, isDownbeat ? height : height * 0.8);
      ctx.stroke();
    }

    // Draw playhead
    const playheadX = (position / 100) * width;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 5;
    
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

  }, [waveData, position, isPlaying, color]);

  return (
    <div className="relative">
      {title && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 font-bold">{title}</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-xs text-gray-400">{isPlaying ? 'PLAYING' : 'STOPPED'}</span>
          </div>
        </div>
      )}
      
      <div className={`bg-gradient-to-r ${colorSchemes[color].bg} rounded-lg p-2 border border-gray-600 relative overflow-hidden`}>
        <canvas
          ref={canvasRef}
          width={400}
          height={height}
          className="w-full rounded"
          style={{ height: `${height}px` }}
        />
        
        {/* Frequency Analysis Overlay */}
        <div className="absolute top-2 right-2 text-xs text-white/70 font-mono">
          <div>FREQ: {Math.round(440 + Math.random() * 100)}Hz</div>
          <div>AMP: {Math.round(position)}%</div>
        </div>

        {/* Audio Spectrum Bars */}
        <div className="absolute bottom-2 left-2 flex space-x-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 bg-${color}-400 rounded transition-all duration-100`}
              style={{
                height: `${isPlaying ? 4 + Math.random() * 12 : 4}px`,
                opacity: isPlaying ? 0.7 + Math.random() * 0.3 : 0.3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}