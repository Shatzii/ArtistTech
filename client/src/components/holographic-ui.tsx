import { ReactNode } from 'react';
import { Zap, Brain, Star } from 'lucide-react';

interface HolographicPanelProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  glowColor?: 'cyan' | 'purple' | 'pink' | 'green' | 'blue';
  ai?: boolean;
  premium?: boolean;
}

export function HolographicPanel({ 
  children, 
  title, 
  subtitle, 
  glowColor = 'cyan', 
  ai = false, 
  premium = false 
}: HolographicPanelProps) {
  const glowColors = {
    cyan: 'shadow-cyan-500/50 border-cyan-500/30',
    purple: 'shadow-purple-500/50 border-purple-500/30',
    pink: 'shadow-pink-500/50 border-pink-500/30',
    green: 'shadow-green-500/50 border-green-500/30',
    blue: 'shadow-blue-500/50 border-blue-500/30'
  };

  return (
    <div className={`relative bg-gray-900/80 backdrop-blur-sm rounded-xl border ${glowColors[glowColor]} p-6 holographic`}>
      {/* Corner Ornaments */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-cyan-400 rounded-tl"></div>
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-cyan-400 rounded-tr"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-cyan-400 rounded-bl"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-cyan-400 rounded-br"></div>

      {/* Header */}
      {(title || ai || premium) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-white neon-text flex items-center">
                {title}
                {ai && <Brain className="w-4 h-4 ml-2 text-cyan-400" />}
                {premium && <Star className="w-4 h-4 ml-2 text-yellow-400" />}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400 matrix-text">{subtitle}</p>
            )}
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-bold">ACTIVE</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse pointer-events-none"></div>
    </div>
  );
}

export function HolographicButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'default',
  disabled = false 
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ai' | 'danger';
  size?: 'small' | 'default' | 'large';
  disabled?: boolean;
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-cyan-500/50',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-gray-500/50',
    ai: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/50',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/50'
  };

  const sizes = {
    small: 'px-3 py-1 text-sm',
    default: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]}
        text-white font-bold rounded-lg transition-all duration-200 
        btn-futuristic transform hover:scale-105 shadow-lg
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
        relative overflow-hidden
      `}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      
      {/* Holographic Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
    </button>
  );
}

export function DataStream({ data, label }: { data: string | number; label: string }) {
  return (
    <div className="bg-black/50 rounded-lg p-3 border border-cyan-500/30 relative overflow-hidden">
      <div className="absolute inset-0 neural-connection opacity-20"></div>
      <div className="relative z-10">
        <div className="text-xs text-gray-400 mb-1 matrix-text">{label}</div>
        <div className="text-xl font-bold text-cyan-400 neon-text">{data}</div>
      </div>
      <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
    </div>
  );
}