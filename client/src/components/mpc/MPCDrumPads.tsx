import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DrumPad {
  id: string;
  name: string;
  category: 'kick' | 'snare' | 'hihat' | 'crash' | 'perc' | 'fx';
  isActive: boolean;
  volume: number;
  muted: boolean;
  solo: boolean;
}

interface MPCDrumPadsProps {
  pads: DrumPad[];
  selectedPad: string;
  onPadSelect: (padId: string) => void;
  onPadTrigger: (padId: string) => void;
}

export default function MPCDrumPads({ pads, selectedPad, onPadSelect, onPadTrigger }: MPCDrumPadsProps) {
  const [pressedPads, setPressedPads] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Map keyboard keys to pads (QWERTY layout)
      const keyToPad: { [key: string]: string } = {
        'q': 'pad1', 'w': 'pad2', 'e': 'pad3', 'r': 'pad4',
        'a': 'pad5', 's': 'pad6', 'd': 'pad7', 'f': 'pad8',
        'z': 'pad9', 'x': 'pad10', 'c': 'pad11', 'v': 'pad12',
        'u': 'pad13', 'i': 'pad14', 'o': 'pad15', 'p': 'pad16'
      };

      const padId = keyToPad[event.key.toLowerCase()];
      if (padId && !pressedPads.has(padId)) {
        setPressedPads(prev => new Set([...prev, padId]));
        onPadTrigger(padId);
        onPadSelect(padId);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const keyToPad: { [key: string]: string } = {
        'q': 'pad1', 'w': 'pad2', 'e': 'pad3', 'r': 'pad4',
        'a': 'pad5', 's': 'pad6', 'd': 'pad7', 'f': 'pad8',
        'z': 'pad9', 'x': 'pad10', 'c': 'pad11', 'v': 'pad12',
        'u': 'pad13', 'i': 'pad14', 'o': 'pad15', 'p': 'pad16'
      };

      const padId = keyToPad[event.key.toLowerCase()];
      if (padId) {
        setPressedPads(prev => {
          const newSet = new Set(prev);
          newSet.delete(padId);
          return newSet;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedPads, onPadTrigger, onPadSelect]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'kick': return 'from-red-600 to-red-800 border-red-500';
      case 'snare': return 'from-blue-600 to-blue-800 border-blue-500';
      case 'hihat': return 'from-yellow-600 to-yellow-800 border-yellow-500';
      case 'crash': return 'from-purple-600 to-purple-800 border-purple-500';
      case 'perc': return 'from-green-600 to-green-800 border-green-500';
      case 'fx': return 'from-pink-600 to-pink-800 border-pink-500';
      default: return 'from-gray-600 to-gray-800 border-gray-500';
    }
  };

  const getKeyboardKey = (padId: string) => {
    const padToKey: { [padId: string]: string } = {
      'pad1': 'Q', 'pad2': 'W', 'pad3': 'E', 'pad4': 'R',
      'pad5': 'A', 'pad6': 'S', 'pad7': 'D', 'pad8': 'F',
      'pad9': 'Z', 'pad10': 'X', 'pad11': 'C', 'pad12': 'V',
      'pad13': 'U', 'pad14': 'I', 'pad15': 'O', 'pad16': 'P'
    };
    return padToKey[padId] || '';
  };

  const handlePadPress = (padId: string) => {
    onPadTrigger(padId);
    onPadSelect(padId);
    
    // Visual feedback
    setPressedPads(prev => new Set([...prev, padId]));
    setTimeout(() => {
      setPressedPads(prev => {
        const newSet = new Set(prev);
        newSet.delete(padId);
        return newSet;
      });
    }, 150);
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Drum Pads</h3>
        <div className="text-sm text-gray-400">
          Use keyboard (QWERTY) or click pads to trigger sounds
        </div>
      </div>

      {/* MPC-style 4x4 grid */}
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {pads.map((pad) => {
          const isPressed = pressedPads.has(pad.id);
          const isSelected = selectedPad === pad.id;
          const isPlaying = pad.isActive;
          
          return (
            <div
              key={pad.id}
              className="relative aspect-square"
            >
              {/* Main Pad Button */}
              <Button
                className={cn(
                  "w-full h-full relative overflow-hidden border-2 transition-all duration-150",
                  "bg-gradient-to-br shadow-lg hover:shadow-xl",
                  getCategoryColor(pad.category),
                  isPressed && "scale-95 shadow-inner",
                  isSelected && "ring-2 ring-white ring-opacity-50",
                  isPlaying && "animate-pulse",
                  (pad.muted || pad.solo) && "opacity-75"
                )}
                onMouseDown={() => handlePadPress(pad.id)}
                onMouseUp={() => {
                  setPressedPads(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(pad.id);
                    return newSet;
                  });
                }}
              >
                {/* Keyboard Key Indicator */}
                <div className="absolute top-1 left-1 text-xs font-bold opacity-60">
                  {getKeyboardKey(pad.id)}
                </div>

                {/* Pad Name */}
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-sm font-bold text-center leading-tight mb-1">
                    {pad.name}
                  </div>
                  <div className="text-xs opacity-75 capitalize">
                    {pad.category}
                  </div>
                </div>

                {/* Volume Level Indicator */}
                <div className="absolute bottom-1 right-1">
                  <div 
                    className="w-2 h-8 bg-black bg-opacity-30 rounded-sm"
                  >
                    <div 
                      className="w-full bg-white rounded-sm transition-all"
                      style={{ height: `${pad.volume * 100}%` }}
                    />
                  </div>
                </div>

                {/* Active Indicator */}
                {isPlaying && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Button>

              {/* Status Badges */}
              <div className="absolute -top-2 -right-2 flex space-x-1">
                {pad.muted && (
                  <Badge variant="destructive" className="text-xs px-1 py-0 h-5">
                    M
                  </Badge>
                )}
                {pad.solo && (
                  <Badge variant="default" className="text-xs px-1 py-0 h-5 bg-yellow-500">
                    S
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 text-center">
        <div className="text-xs text-gray-400 mb-2">Pad Categories:</div>
        <div className="flex justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-br from-red-600 to-red-800 rounded"></div>
            <span>Kick</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded"></div>
            <span>Snare</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded"></div>
            <span>Hi-Hat</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-br from-green-600 to-green-800 rounded"></div>
            <span>Perc</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-br from-purple-600 to-purple-800 rounded"></div>
            <span>Crash</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-br from-pink-600 to-pink-800 rounded"></div>
            <span>FX</span>
          </div>
        </div>
      </div>
    </div>
  );
}