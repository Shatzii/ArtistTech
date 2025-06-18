import { useEffect, useRef } from "react";
import { useAudioFiles } from "@/hooks/useAudioFile";
import { generateWaveformData, drawWaveform } from "@/lib/waveformUtils";

interface WaveformCanvasProps {
  fileId?: number;
  startTime?: number;
  duration?: number;
  showPlayhead?: boolean;
  playheadPosition?: number;
  className?: string;
}

export default function WaveformCanvas({ 
  fileId, 
  startTime = 0, 
  duration = 30,
  showPlayhead = false,
  playheadPosition = 0,
  className = "" 
}: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioFiles } = useAudioFiles();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fileId) return;

    const audioFile = audioFiles.find(f => f.id === fileId);
    if (!audioFile) return;

    const drawWaveformForFile = async () => {
      try {
        // Load audio file
        const response = await fetch(`/api/audio-files/${fileId}/stream`);
        const arrayBuffer = await response.arrayBuffer();
        
        // Create audio context for analysis
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Generate waveform data
        const waveformData = generateWaveformData(audioBuffer, startTime, duration);
        
        // Draw waveform
        drawWaveform(canvas, waveformData, {
          showPlayhead,
          playheadPosition,
          color: 'var(--studio-accent)',
          backgroundColor: 'transparent',
        });
        
        audioContext.close();
      } catch (error) {
        console.error("Failed to generate waveform:", error);
        
        // Draw placeholder waveform
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'var(--studio-inactive)';
          ctx.fillRect(0, canvas.height / 2 - 2, canvas.width, 4);
        }
      }
    };

    drawWaveformForFile();
  }, [fileId, startTime, duration, audioFiles, showPlayhead, playheadPosition]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
