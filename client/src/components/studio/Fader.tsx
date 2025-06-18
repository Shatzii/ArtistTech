import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface FaderProps {
  value: number; // 0 to 1
  onChange: (value: number) => void;
  height?: number;
  width?: number;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export default function Fader({ 
  value, 
  onChange, 
  height = 128, 
  width = 32,
  className = "",
  disabled = false,
  min = 0,
  max = 1
}: FaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const faderRef = useRef<HTMLDivElement>(null);

  const normalizedValue = (value - min) / (max - min);
  const handlePosition = (1 - normalizedValue) * (height - 24); // 24px for handle height

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    
    const rect = faderRef.current?.getBoundingClientRect();
    if (!rect) return;

    const handleMouseMove = (e: MouseEvent) => {
      const y = e.clientY - rect.top;
      const newValue = Math.max(0, Math.min(1, 1 - (y - 12) / (height - 24)));
      const scaledValue = min + (newValue * (max - min));
      onChange(scaledValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Handle initial click
    const y = e.clientY - rect.top;
    const newValue = Math.max(0, Math.min(1, 1 - (y - 12) / (height - 24)));
    const scaledValue = min + (newValue * (max - min));
    onChange(scaledValue);
  }, [disabled, height, min, max, onChange]);

  return (
    <div
      ref={faderRef}
      className={cn(
        "fader-track rounded-full relative cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{ width, height }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={cn(
          "absolute left-0 right-0 h-6 bg-[var(--studio-accent)] rounded cursor-grab transition-transform",
          isDragging && "cursor-grabbing scale-110"
        )}
        style={{ top: `${handlePosition}px` }}
      />
    </div>
  );
}
