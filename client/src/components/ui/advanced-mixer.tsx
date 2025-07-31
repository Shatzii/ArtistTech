import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Volume2, VolumeX, Headphones, Mic, Settings, 
  RotateCcw, Zap, Activity, Sliders, Filter,
  Volume, VolumeX as Mute, PenTool, Signal, Cpu, Radio
} from "lucide-react";

interface ChannelStrip {
  id: string;
  name: string;
  type: 'audio' | 'instrument' | 'fx' | 'bus';
  level: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  armed: boolean;
  eq: {
    high: number;
    mid: number;
    low: number;
  };
  effects: {
    reverb: number;
    delay: number;
    chorus: number;
    compressor: number;
  };
  gain: number;
  phase: boolean;
  hpf: number; // High-pass filter
  lpf: number; // Low-pass filter
}

interface AdvancedMixerProps {
  channels: ChannelStrip[];
  masterVolume: number;
  onChannelChange: (channelId: string, updates: Partial<ChannelStrip>) => void;
  onMasterVolumeChange: (volume: number) => void;
  showMetering?: boolean;
  compactMode?: boolean;
}

export default function AdvancedMixer({
  channels,
  masterVolume,
  onChannelChange,
  onMasterVolumeChange,
  showMetering = true,
  compactMode = false
}: AdvancedMixerProps) {
  const [meteringData, setMeteringData] = useState<{ [key: string]: { peak: number; rms: number } }>({});
  const [showEQ, setShowEQ] = useState<{ [key: string]: boolean }>({});
  const [showEffects, setShowEffects] = useState<{ [key: string]: boolean }>({});
  const [cpuUsage, setCpuUsage] = useState(0);

  useEffect(() => {
    // Simulate real-time audio metering
    const interval = setInterval(() => {
      const newMetering: { [key: string]: { peak: number; rms: number } } = {};
      
      channels.forEach(channel => {
        if (!channel.muted) {
          newMetering[channel.id] = {
            peak: Math.random() * channel.level * 0.8 + 20,
            rms: Math.random() * channel.level * 0.6 + 10
          };
        } else {
          newMetering[channel.id] = { peak: 0, rms: 0 };
        }
      });
      
      setMeteringData(newMetering);
      setCpuUsage(Math.random() * 30 + 15);
    }, 50);

    return () => clearInterval(interval);
  }, [channels]);

  const ChannelStripComponent = ({ channel }: { channel: ChannelStrip }) => (
    <Card key={channel.id} className="bg-gray-800 border-gray-600 w-20">
      <CardHeader className="p-2 pb-1">
        <div className="text-xs font-medium text-center truncate">{channel.name}</div>
        <Badge 
          variant={channel.type === 'audio' ? 'default' : 'secondary'} 
          className="text-xs h-5 justify-center"
        >
          {channel.type.toUpperCase()}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-2 space-y-2">
        {/* Input Gain */}
        <div className="space-y-1">
          <div className="text-xs text-gray-400">GAIN</div>
          <Slider
            value={[channel.gain]}
            onValueChange={(value) => onChannelChange(channel.id, { gain: value[0] })}
            min={-20}
            max={20}
            step={0.1}
            orientation="vertical"
            className="h-12"
          />
          <div className="text-xs text-center font-mono">{channel.gain.toFixed(1)}</div>
        </div>

        {/* EQ Section */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-6 p-0 text-xs"
            onClick={() => setShowEQ(prev => ({ ...prev, [channel.id]: !prev[channel.id] }))}
          >
            EQ
          </Button>
          
          {showEQ[channel.id] && (
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="text-xs text-gray-400">HI</div>
                <Slider
                  value={[channel.eq.high]}
                  onValueChange={(value) => onChannelChange(channel.id, { 
                    eq: { ...channel.eq, high: value[0] } 
                  })}
                  min={-15}
                  max={15}
                  step={0.5}
                  orientation="vertical"
                  className="h-8"
                />
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-400">MID</div>
                <Slider
                  value={[channel.eq.mid]}
                  onValueChange={(value) => onChannelChange(channel.id, { 
                    eq: { ...channel.eq, mid: value[0] } 
                  })}
                  min={-15}
                  max={15}
                  step={0.5}
                  orientation="vertical"
                  className="h-8"
                />
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-400">LO</div>
                <Slider
                  value={[channel.eq.low]}
                  onValueChange={(value) => onChannelChange(channel.id, { 
                    eq: { ...channel.eq, low: value[0] } 
                  })}
                  min={-15}
                  max={15}
                  step={0.5}
                  orientation="vertical"
                  className="h-8"
                />
              </div>
            </div>
          )}
        </div>

        {/* Effects Section */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-6 p-0 text-xs"
            onClick={() => setShowEffects(prev => ({ ...prev, [channel.id]: !prev[channel.id] }))}
          >
            FX
          </Button>
          
          {showEffects[channel.id] && (
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="text-xs text-gray-400">REV</div>
                <Slider
                  value={[channel.effects.reverb]}
                  onValueChange={(value) => onChannelChange(channel.id, { 
                    effects: { ...channel.effects, reverb: value[0] } 
                  })}
                  min={0}
                  max={100}
                  step={1}
                  orientation="vertical"
                  className="h-8"
                />
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-400">DLY</div>
                <Slider
                  value={[channel.effects.delay]}
                  onValueChange={(value) => onChannelChange(channel.id, { 
                    effects: { ...channel.effects, delay: value[0] } 
                  })}
                  min={0}
                  max={100}
                  step={1}
                  orientation="vertical"
                  className="h-8"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pan Control */}
        <div className="space-y-1">
          <div className="text-xs text-gray-400">PAN</div>
          <Slider
            value={[channel.pan]}
            onValueChange={(value) => onChannelChange(channel.id, { pan: value[0] })}
            min={-100}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-center font-mono">
            {channel.pan === 0 ? 'C' : channel.pan > 0 ? `R${channel.pan}` : `L${Math.abs(channel.pan)}`}
          </div>
        </div>

        {/* Mute/Solo/Arm Buttons */}
        <div className="space-y-1">
          <Button
            variant={channel.muted ? "destructive" : "outline"}
            size="sm"
            className="w-full h-6 text-xs"
            onClick={() => onChannelChange(channel.id, { muted: !channel.muted })}
          >
            {channel.muted ? <VolumeX className="w-3 h-3" /> : "MUTE"}
          </Button>
          
          <Button
            variant={channel.solo ? "default" : "outline"}
            size="sm"
            className="w-full h-6 text-xs"
            onClick={() => onChannelChange(channel.id, { solo: !channel.solo })}
          >
            SOLO
          </Button>
          
          <Button
            variant={channel.armed ? "destructive" : "outline"}
            size="sm"
            className="w-full h-6 text-xs"
            onClick={() => onChannelChange(channel.id, { armed: !channel.armed })}
          >
            {channel.armed ? <Mic className="w-3 h-3" /> : "ARM"}
          </Button>
        </div>

        {/* Level Fader */}
        <div className="space-y-1">
          <div className="text-xs text-gray-400">LEVEL</div>
          <div className="flex items-center space-x-1">
            {showMetering && (
              <div className="w-2 h-32 bg-gray-700 rounded-sm relative overflow-hidden">
                {/* Peak Meter */}
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-75"
                  style={{ height: `${Math.min(meteringData[channel.id]?.peak || 0, 100)}%` }}
                />
                {/* RMS Meter */}
                <div 
                  className="absolute bottom-0 w-1/2 bg-blue-400 opacity-80 transition-all duration-100"
                  style={{ height: `${Math.min(meteringData[channel.id]?.rms || 0, 100)}%` }}
                />
              </div>
            )}
            
            <Slider
              value={[channel.level]}
              onValueChange={(value) => onChannelChange(channel.id, { level: value[0] })}
              min={0}
              max={100}
              step={0.1}
              orientation="vertical"
              className="h-32"
            />
          </div>
          
          <div className="text-xs text-center font-mono">{channel.level.toFixed(1)}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Advanced Mixer</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Cpu className="w-3 h-3" />
            <span>{cpuUsage.toFixed(1)}%</span>
          </Badge>
          <Badge variant={showMetering ? "default" : "outline"}>
            <Signal className="w-3 h-3 mr-1" />
            Meters
          </Badge>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-4">
        {/* Channel Strips */}
        {channels.map(channel => (
          <ChannelStripComponent key={channel.id} channel={channel} />
        ))}

        {/* Master Section */}
        <Card className="bg-gray-800 border-gray-600 w-24">
          <CardHeader className="p-2 pb-1">
            <div className="text-xs font-medium text-center">MASTER</div>
            <Badge variant="default" className="text-xs h-5 justify-center">
              OUT
            </Badge>
          </CardHeader>
          
          <CardContent className="p-2 space-y-2">
            {/* Master EQ */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 text-center">MASTER EQ</div>
              <div className="grid grid-cols-3 gap-1">
                <Slider
                  value={[0]}
                  min={-15}
                  max={15}
                  step={0.5}
                  orientation="vertical"
                  className="h-12"
                />
                <Slider
                  value={[0]}
                  min={-15}
                  max={15}
                  step={0.5}
                  orientation="vertical"
                  className="h-12"
                />
                <Slider
                  value={[0]}
                  min={-15}
                  max={15}
                  step={0.5}
                  orientation="vertical"
                  className="h-12"
                />
              </div>
            </div>

            {/* Master Level */}
            <div className="space-y-1">
              <div className="text-xs text-gray-400">MASTER</div>
              <div className="flex items-center space-x-1">
                {showMetering && (
                  <div className="w-3 h-32 bg-gray-700 rounded-sm relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-75"
                      style={{ height: `${Math.min(masterVolume * 0.8, 100)}%` }}
                    />
                  </div>
                )}
                
                <Slider
                  value={[masterVolume]}
                  onValueChange={(value) => onMasterVolumeChange(value[0])}
                  min={0}
                  max={100}
                  step={0.1}
                  orientation="vertical"
                  className="h-32"
                />
              </div>
              
              <div className="text-xs text-center font-mono">{masterVolume.toFixed(1)}</div>
            </div>

            {/* Master Controls */}
            <div className="space-y-1">
              <Button variant="outline" size="sm" className="w-full h-6 text-xs">
                <Headphones className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm" className="w-full h-6 text-xs">
                <Settings className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Meters:</span>
            <Switch 
              checked={showMetering} 
              onCheckedChange={(checked) => {
                // showMetering is controlled by parent component
                console.log('Meters toggled:', checked);
              }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Activity className="w-4 h-4 text-green-400" />
            <span>44.1kHz / 24-bit</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Radio className="w-4 h-4 text-blue-400" />
            <span>128 samples</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>2.9ms latency</span>
          </div>
        </div>
      </div>
    </div>
  );
}