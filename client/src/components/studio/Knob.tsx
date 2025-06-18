import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface KnobProps {
  value: number; // 0 to 1
  onChange: (value: number) => void;
  size?: number;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export default function Knob({ 
  value, 
  onChange, 
  size = 48, 
  className = "",
  disabled = false,
  min = 0,
  max = 1
}: KnobProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const knobRef = useRef<HTMLDivElement>(null);

  const normalizedValue = (value - min) / (max - min);
  const rotation = (normalizedValue * 270) - 135; // -135° to +135°

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(value);
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startY - e.clientY; // Inverted for natural feel
      const sensitivity = 0.01;
      const newValue = Math.max(min, Math.min(max, startValue + (deltaY * sensitivity)));
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [disabled, value, startY, startValue, min, max, onChange]);

  return (
    <div
      ref={knobRef}
      className={cn(
        "knob rounded-full relative cursor-pointer select-none transition-transform",
        isDragging && "scale-95",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{ width: size, height: size }}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute inset-2 bg-[var(--studio-accent)] bg-opacity-20 rounded-full" />
      <div
        className="absolute w-1 bg-[var(--studio-accent)] rounded-full transition-transform"
        style={{
          height: size * 0.3,
          left: '50%',
          top: '50%',
          transformOrigin: 'center bottom',
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        }}
      />
    </div>
  );
}
