import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Knob from "@/components/studio/Knob";
import { 
  Zap, 
  Volume2, 
  Waves, 
  RotateCw, 
  Filter,
  Settings,
  Power,
  Shuffle
} from "lucide-react";

interface Effect {
  id: string;
  name: string;
  type: 'reverb' | 'delay' | 'filter' | 'distortion' | 'compressor' | 'eq' | 'chorus' | 'phaser';
  enabled: boolean;
  parameters: { [key: string]: number };
  preset?: string;
}

interface Track {
  id: string;
  name: string;
  sound: {
    name: string;
    category: string;
    volume: number;
    pitch: number;
    pan: number;
    reverb: number;
    delay: number;
    filter: number;
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  muted: boolean;
  solo: boolean;
  volume: number;
  effects: string[];
}

interface MPCEffectsRackProps {
  selectedTrack?: Track;
  onEffectChange: (effectId: string, value: number) => void;
}

export default function MPCEffectsRack({ selectedTrack, onEffectChange }: MPCEffectsRackProps) {
  const [activeEffects, setActiveEffects] = useState<Effect[]>([
    {
      id: 'reverb',
      name: 'Hall Reverb',
      type: 'reverb',
      enabled: true,
      parameters: {
        size: 0.5,
        decay: 0.6,
        damping: 0.3,
        predelay: 0.1,
        mix: 0.25
      },
      preset: 'Hall'
    },
    {
      id: 'delay',
      name: 'Stereo Delay',
      type: 'delay',
      enabled: false,
      parameters: {
        time: 0.25,
        feedback: 0.4,
        highcut: 0.7,
        mix: 0.3
      },
      preset: 'Eighth Note'
    },
    {
      id: 'filter',
      name: 'Low Pass Filter',
      type: 'filter',
      enabled: false,
      parameters: {
        frequency: 0.8,
        resonance: 0.2,
        drive: 0.0
      },
      preset: 'Warm'
    },
    {
      id: 'compressor',
      name: 'Vintage Comp',
      type: 'compressor',
      enabled: false,
      parameters: {
        threshold: 0.7,
        ratio: 0.5,
        attack: 0.1,
        release: 0.4,
        makeup: 0.2
      },
      preset: 'Punchy'
    }
  ]);

  const [selectedEffect, setSelectedEffect] = useState<string>('reverb');

  const toggleEffect = (effectId: string) => {
    setActiveEffects(prev => prev.map(effect => 
      effect.id === effectId ? { ...effect, enabled: !effect.enabled } : effect
    ));
  };

  const updateEffectParameter = (effectId: string, paramName: string, value: number) => {
    setActiveEffects(prev => prev.map(effect => 
      effect.id === effectId 
        ? { ...effect, parameters: { ...effect.parameters, [paramName]: value } }
        : effect
    ));
    onEffectChange(effectId, value);
  };

  const getEffectIcon = (type: string) => {
    switch (type) {
      case 'reverb': return <Waves size={14} />;
      case 'delay': return <RotateCw size={14} />;
      case 'filter': return <Filter size={14} />;
      case 'compressor': return <Volume2 size={14} />;
      default: return <Zap size={14} />;
    }
  };

  const effectPresets = {
    reverb: ['Hall', 'Room', 'Plate', 'Spring', 'Cathedral'],
    delay: ['Eighth Note', 'Quarter Note', 'Dotted', 'Triplet', 'Ping Pong'],
    filter: ['Warm', 'Bright', 'Vintage', 'Modern', 'Aggressive'],
    compressor: ['Punchy', 'Smooth', 'Vintage', 'Modern', 'Heavy']
  };

  const currentEffect = activeEffects.find(e => e.id === selectedEffect);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="mr-2" size={16} />
            Effects Rack
          </div>
          <Badge variant="secondary" className="text-xs">
            {selectedTrack?.sound.name || 'No Track'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Effect Selection */}
        <div className="grid grid-cols-2 gap-2">
          {activeEffects.map(effect => (
            <Button
              key={effect.id}
              onClick={() => setSelectedEffect(effect.id)}
              variant={selectedEffect === effect.id ? "default" : "outline"}
              size="sm"
              className="text-xs justify-start relative"
            >
              <div className="flex items-center space-x-2">
                {getEffectIcon(effect.type)}
                <span className="truncate">{effect.name}</span>
              </div>
              
              {/* Power indicator */}
              <div className="absolute top-1 right-1">
                <div 
                  className={`w-2 h-2 rounded-full ${
                    effect.enabled ? 'bg-green-400' : 'bg-gray-600'
                  }`}
                />
              </div>
            </Button>
          ))}
        </div>

        {/* Current Effect Controls */}
        {currentEffect && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{currentEffect.name}</div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => toggleEffect(currentEffect.id)}
                  variant={currentEffect.enabled ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  <Power size={12} className="mr-1" />
                  {currentEffect.enabled ? 'ON' : 'OFF'}
                </Button>
              </div>
            </div>

            {/* Preset Selection */}
            {effectPresets[currentEffect.type as keyof typeof effectPresets] && (
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Presets</div>
                <div className="grid grid-cols-3 gap-1">
                  {effectPresets[currentEffect.type as keyof typeof effectPresets].map(preset => (
                    <Button
                      key={preset}
                      variant={currentEffect.preset === preset ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Effect Parameters */}
            <ScrollArea className="h-48">
              <div className="space-y-4">
                {Object.entries(currentEffect.parameters).map(([paramName, value]) => (
                  <div key={paramName} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 capitalize">
                        {paramName.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-xs font-mono">
                        {Math.round(value * 100)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Knob
                        value={value}
                        onChange={(newValue) => 
                          updateEffectParameter(currentEffect.id, paramName, newValue)
                        }
                        size={24}
                        disabled={!currentEffect.enabled}
                      />
                      <div className="flex-1">
                        <Slider
                          value={[value]}
                          onValueChange={([newValue]) => 
                            updateEffectParameter(currentEffect.id, paramName, newValue)
                          }
                          min={0}
                          max={1}
                          step={0.01}
                          disabled={!currentEffect.enabled}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* ADSR Envelope Controls (for selected track) */}
        {selectedTrack && (
          <div className="space-y-3 border-t border-gray-700 pt-4">
            <div className="text-sm font-medium">ADSR Envelope</div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Attack</div>
                <div className="flex items-center space-x-2">
                  <Knob
                    value={selectedTrack.sound.attack}
                    onChange={(value) => onEffectChange('attack', value)}
                    size={20}
                  />
                  <span className="text-xs font-mono w-8">
                    {Math.round(selectedTrack.sound.attack * 100)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Decay</div>
                <div className="flex items-center space-x-2">
                  <Knob
                    value={selectedTrack.sound.decay}
                    onChange={(value) => onEffectChange('decay', value)}
                    size={20}
                  />
                  <span className="text-xs font-mono w-8">
                    {Math.round(selectedTrack.sound.decay * 100)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Sustain</div>
                <div className="flex items-center space-x-2">
                  <Knob
                    value={selectedTrack.sound.sustain}
                    onChange={(value) => onEffectChange('sustain', value)}
                    size={20}
                  />
                  <span className="text-xs font-mono w-8">
                    {Math.round(selectedTrack.sound.sustain * 100)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Release</div>
                <div className="flex items-center space-x-2">
                  <Knob
                    value={selectedTrack.sound.release}
                    onChange={(value) => onEffectChange('release', value)}
                    size={20}
                  />
                  <span className="text-xs font-mono w-8">
                    {Math.round(selectedTrack.sound.release * 100)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2 text-xs">
          <Button variant="outline" size="sm" className="flex-1">
            <Settings size={12} className="mr-1" />
            Settings
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Shuffle size={12} className="mr-1" />
            Random
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}