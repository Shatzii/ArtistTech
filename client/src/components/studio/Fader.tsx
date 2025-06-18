import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface FaderProps {
  value: number; // 0 to 1
  onChange: (value: number) => void;
  height?: number;
  width?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
  min?: number;
  max?: number;
}

export default function Fader({ 
  value, 
  onChange, 
  height = 100, 
  width = 20,
  className, 
  disabled = false,
  label,
  min = 0,
  max = 1
}: FaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const faderRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);

  const normalizedValue = (value - min) / (max - min);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    startValueRef.current = value;
    startYRef.current = e.clientY;

    e.preventDefault();
  }, [disabled, value]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return;

    const deltaY = startYRef.current - e.clientY; // Inverted for fader behavior
    const sensitivity = 1 / height;
    const deltaValue = deltaY * sensitivity * (max - min);
    
    const newValue = Math.max(min, Math.min(max, startValueRef.current + deltaValue));
    onChange(newValue);
  }, [isDragging, disabled, onChange, min, max, height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse event handlers
  useState(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  });

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {label && (
        <div className="text-xs text-gray-400 mb-1 text-center">
          {label}
        </div>
      )}
      
      <div
        ref={faderRef}
        className={cn(
          "relative bg-gray-700 border border-gray-600 cursor-pointer select-none",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{ width, height }}
        onMouseDown={handleMouseDown}
      >
        {/* Fader track */}
        <div className="absolute inset-0 bg-gray-800">
          {/* Fill indicator */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 to-green-400 transition-all"
            style={{ height: `${normalizedValue * 100}%` }}
          />
        </div>

        {/* Fader handle */}
        <div 
          className={cn(
            "absolute w-full bg-gray-300 border border-gray-500 cursor-grab transition-all",
            isDragging && "bg-gray-100 cursor-grabbing scale-110"
          )}
          style={{
            height: '8px',
            bottom: `${normalizedValue * (height - 8)}px`,
            borderRadius: '2px'
          }}
        >
          {/* Handle grip lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-px">
              <div className="w-px h-2 bg-gray-600"></div>
              <div className="w-px h-2 bg-gray-600"></div>
              <div className="w-px h-2 bg-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Value display */}
      <div className="text-xs font-mono mt-1 text-center text-gray-400">
        {Math.round(value * 100)}
      </div>
    </div>
  );
}