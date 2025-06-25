import { useState } from 'react';
import { Play, Pause, Square, Shuffle, Layers, Zap, Brain } from 'lucide-react';

interface BeatMakerProps {
  beatMaker: any;
  setBeatMaker: (value: any) => void;
}

export default function CuttingEdgeBeatMaker({ beatMaker, setBeatMaker }: BeatMakerProps) {
  const padTypes = [
    'KICK', 'SNARE', 'HAT', 'CRASH', 'TOM1', 'TOM2', 'RIDE', 'PERC1', 
    'BASS', 'LEAD', 'PAD', 'PLUCK', 'VOCAL', 'FX1', 'FX2', 'AIR'
  ];

  const padColors = [
    'from-red-500 to-red-600',      // KICK
    'from-yellow-500 to-orange-500', // SNARE
    'from-cyan-500 to-blue-500',    // HAT
    'from-purple-500 to-pink-500',  // CRASH
    'from-green-500 to-emerald-500', // TOM1
    'from-indigo-500 to-purple-500', // TOM2
    'from-teal-500 to-cyan-500',    // RIDE
    'from-orange-500 to-red-500',   // PERC1
    'from-blue-500 to-indigo-500',  // BASS
    'from-pink-500 to-rose-500',    // LEAD
    'from-violet-500 to-purple-500', // PAD
    'from-emerald-500 to-teal-500', // PLUCK
    'from-rose-500 to-pink-500',    // VOCAL
    'from-amber-500 to-yellow-500', // FX1
    'from-lime-500 to-green-500',   // FX2
    'from-sky-500 to-blue-500'      // AIR
  ];

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6 relative overflow-hidden">
      {/* Holographic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 holographic"></div>
      
      <h4 className="text-lg font-bold mb-4 text-cyan-400 flex items-center relative z-10">
        <Layers className="w-5 h-5 mr-2" />
        Neural Beat Maker Pro
        <div className="ml-auto flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-bold">AI ACTIVE</span>
        </div>
      </h4>
      
      {/* Advanced Pattern Visualizer */}
      <div className="mb-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Neural Pattern Sequence</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-cyan-400">BPM: {beatMaker.bpm}</span>
            <div className="w-px h-4 bg-gray-600"></div>
            <span className="text-xs text-purple-400">4/4</span>
          </div>
        </div>
        
        <div className="h-12 bg-black rounded-lg p-2 flex items-center space-x-1 overflow-hidden border border-cyan-500/30">
          {Array.from({ length: 64 }).map((_, i) => {
            const isActive = beatMaker.activePads.length > 0 && i % 16 < beatMaker.activePads.length * 2;
            const isBeat = i % 4 === 0;
            const isPlaying = beatMaker.isPlaying && i % 8 === Math.floor((Date.now() / 150) % 8);
            
            return (
              <div 
                key={i}
                className={`w-1 h-8 rounded transition-all duration-100 ${
                  isPlaying 
                    ? 'bg-gradient-to-t from-cyan-400 to-white shadow-lg shadow-cyan-400/50 transform scale-y-150' 
                    : isActive 
                      ? 'bg-gradient-to-t from-cyan-500 to-blue-400' 
                      : isBeat 
                        ? 'bg-gradient-to-t from-yellow-500/50 to-yellow-400/50' 
                        : 'bg-gray-600'
                }`}
              />
            );
          })}
        </div>
      </div>
      
      {/* 16-Pad Grid with Advanced Styling */}
      <div className="grid grid-cols-4 gap-3 relative z-10 mb-4">
        {Array.from({ length: 16 }).map((_, i) => {
          const isActive = beatMaker.activePads.includes(i);
          const isTriggered = beatMaker.isPlaying && isActive && Math.random() > 0.7;
          
          return (
            <button
              key={i}
              className={`aspect-square rounded-xl border-2 transition-all duration-200 text-xs font-bold relative overflow-hidden group btn-futuristic ${
                isActive
                  ? `bg-gradient-to-br ${padColors[i]} border-white/50 text-white shadow-xl`
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 text-gray-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20'
              } ${isTriggered ? 'animate-pulse' : ''}`}
              onClick={() => {
                setBeatMaker(prev => ({
                  ...prev,
                  activePads: prev.activePads.includes(i)
                    ? prev.activePads.filter(pad => pad !== i)
                    : [...prev.activePads, i]
                }));
              }}
              onMouseEnter={() => {
                // Add hover sound effect here
              }}
            >
              {/* Holographic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity neural-connection" />
              
              {/* Main Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="text-lg font-bold mb-1 neon-text">{i + 1}</div>
                <div className="text-xs opacity-80 matrix-text">{padTypes[i]}</div>
              </div>
              
              {/* Activation Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
              )}
              
              {/* Corner LED Indicator */}
              <div className={`absolute top-1 right-1 w-2 h-2 rounded-full transition-all ${
                isActive 
                  ? 'bg-white shadow-lg shadow-white/50 glow-cyan' 
                  : 'bg-gray-500'
              }`} />
              
              {/* Velocity Indicator */}
              {isActive && (
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-white transition-all duration-300"
                    style={{ width: `${70 + Math.random() * 30}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Advanced Master Controls */}
      <div className="relative z-10">
        <div className="bg-gray-900/80 rounded-lg p-3 border border-gray-600 cyber-grid">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <button 
                className={`p-3 rounded-full transition-all duration-200 shadow-lg btn-futuristic ${
                  beatMaker.isPlaying 
                    ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/50' 
                    : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/50'
                }`}
                onClick={() => setBeatMaker(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
              >
                {beatMaker.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button className="p-3 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg btn-futuristic">
                <Square className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/50 btn-futuristic">
                <Shuffle className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-purple-500/50 btn-futuristic">
                <Brain className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-black/50 rounded-lg px-3 py-2 border border-cyan-500/30 gradient-border">
                <div className="text-xs text-gray-400 mb-1">BPM</div>
                <div className="text-lg font-bold text-cyan-400 neon-text">{beatMaker.bpm}</div>
              </div>
              <div className="flex flex-col space-y-1">
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={beatMaker.bpm}
                  onChange={(e) => setBeatMaker(prev => ({ ...prev, bpm: parseInt(e.target.value) }))}
                  className="w-24 slider-purple"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>60</span>
                  <span>200</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Pattern Controls */}
          <div className="grid grid-cols-4 gap-2">
            <button className="bg-purple-500/20 border border-purple-500/30 text-purple-400 py-2 px-3 rounded text-xs hover:bg-purple-500/30 transition-colors btn-futuristic">
              <Zap className="w-3 h-3 inline mr-1" />
              Pattern A
            </button>
            <button className="bg-gray-600/20 border border-gray-600/30 text-gray-400 py-2 px-3 rounded text-xs hover:bg-gray-600/30 transition-colors btn-futuristic">
              Pattern B
            </button>
            <button className="bg-gray-600/20 border border-gray-600/30 text-gray-400 py-2 px-3 rounded text-xs hover:bg-gray-600/30 transition-colors btn-futuristic">
              Fill
            </button>
            <button className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 py-2 px-3 rounded text-xs hover:bg-yellow-500/30 transition-colors btn-futuristic">
              <Brain className="w-3 h-3 inline mr-1" />
              AI Gen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}