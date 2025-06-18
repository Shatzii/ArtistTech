import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface KnobProps {
  value: number; // 0 to 1
  onChange: (value: number) => void;
  size?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
  min?: number;
  max?: number;
}

export default function Knob({ 
  value, 
  onChange, 
  size = 40, 
  className, 
  disabled = false,
  label,
  min = 0,
  max = 1
}: KnobProps) {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);

  const normalizedValue = (value - min) / (max - min);
  const angle = -135 + (normalizedValue * 270); // -135° to +135° (270° range)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    startValueRef.current = value;
    
    const rect = knobRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      startAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    }

    e.preventDefault();
  }, [disabled, value]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return;

    const rect = knobRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      
      const angleDiff = currentAngle - startAngleRef.current;
      const sensitivity = 0.5;
      const deltaValue = (angleDiff * sensitivity) / (2 * Math.PI);
      
      const newValue = Math.max(min, Math.min(max, startValueRef.current + deltaValue * (max - min)));
      onChange(newValue);
    }
  }, [isDragging, disabled, onChange, min, max]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse event listeners
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
      <div
        ref={knobRef}
        className={cn(
          "relative rounded-full border-2 border-gray-600 bg-gray-800 cursor-pointer select-none transition-all",
          isDragging && "scale-105 border-blue-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
      >
        {/* Knob body */}
        <div 
          className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-300 to-gray-600"
          style={{
            transform: `rotate(${angle}deg)`
          }}
        >
          {/* Indicator line */}
          <div 
            className="absolute w-0.5 bg-white rounded-full"
            style={{
              height: size * 0.3,
              left: '50%',
              top: size * 0.1,
              transform: 'translateX(-50%)'
            }}
          />
        </div>

        {/* Center dot */}
        <div 
          className="absolute bg-gray-800 rounded-full"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
      
      {label && (
        <div className="text-xs text-gray-400 mt-1 text-center">
          {label}
        </div>
      )}
    </div>
  );
}