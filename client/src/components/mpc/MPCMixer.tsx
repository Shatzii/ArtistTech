import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Fader from "@/components/studio/Fader";
import Knob from "@/components/studio/Knob";
import { Volume2, VolumeX, Headphones } from "lucide-react";

interface Track {
  id: string;
  name: string;
  sound: {
    name: string;
    category: string;
    volume: number;
    pitch: number;
    pan: number;
  };
  muted: boolean;
  solo: boolean;
  volume: number;
  effects: string[];
}

interface MPCMixerProps {
  tracks: Track[];
  onTrackUpdate: (trackId: string, updates: Partial<Track>) => void;
}

export default function MPCMixer({ tracks, onTrackUpdate }: MPCMixerProps) {
  const handleVolumeChange = (trackId: string, volume: number) => {
    onTrackUpdate(trackId, { volume });
  };

  const handleMuteToggle = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      onTrackUpdate(trackId, { muted: !track.muted });
    }
  };

  const handleSoloToggle = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      onTrackUpdate(trackId, { solo: !track.solo });
    }
  };

  const handlePitchChange = (trackId: string, pitch: number) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      onTrackUpdate(trackId, {
        sound: { ...track.sound, pitch }
      });
    }
  };

  const handlePanChange = (trackId: string, pan: number) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      onTrackUpdate(trackId, {
        sound: { ...track.sound, pan }
      });
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700 flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Volume2 className="mr-2" size={16} />
          Mixer
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-3 space-y-3">
            {tracks.slice(0, 8).map((track) => (
              <div key={track.id} className="bg-gray-800 rounded p-3 space-y-3">
                {/* Track Header */}
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium truncate flex-1">
                    {track.sound.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {track.id.replace('pad', '')}
                  </div>
                </div>

                {/* Controls Row 1: Mute/Solo/Monitor */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleMuteToggle(track.id)}
                    variant={track.muted ? "destructive" : "outline"}
                    size="sm"
                    className="flex-1 text-xs h-7"
                  >
                    {track.muted ? <VolumeX size={12} /> : "M"}
                  </Button>
                  
                  <Button
                    onClick={() => handleSoloToggle(track.id)}
                    variant={track.solo ? "default" : "outline"}
                    size="sm"
                    className="flex-1 text-xs h-7 bg-yellow-600 hover:bg-yellow-700"
                  >
                    S
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-7"
                  >
                    <Headphones size={12} />
                  </Button>
                </div>

                {/* Controls Row 2: Pitch and Pan Knobs */}
                <div className="flex justify-around items-center">
                  <div className="text-center">
                    <Knob
                      value={(track.sound.pitch + 24) / 48} // Normalize -24 to +24 semitones to 0-1
                      onChange={(value) => handlePitchChange(track.id, (value * 48) - 24)}
                      size={32}
                      className="mb-1"
                    />
                    <div className="text-xs text-gray-400">PITCH</div>
                    <div className="text-xs font-mono">
                      {track.sound.pitch > 0 ? '+' : ''}{track.sound.pitch.toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Knob
                      value={(track.sound.pan + 1) / 2} // Normalize -1 to +1 to 0-1
                      onChange={(value) => handlePanChange(track.id, (value * 2) - 1)}
                      size={32}
                      className="mb-1"
                    />
                    <div className="text-xs text-gray-400">PAN</div>
                    <div className="text-xs font-mono">
                      {track.sound.pan === 0 ? 'C' : 
                       track.sound.pan < 0 ? `L${Math.abs(track.sound.pan * 50).toFixed(0)}` : 
                       `R${(track.sound.pan * 50).toFixed(0)}`}
                    </div>
                  </div>
                </div>

                {/* Volume Fader */}
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-400 w-8">VOL</div>
                  <div className="flex-1">
                    <Slider
                      value={[track.volume]}
                      onValueChange={([value]) => handleVolumeChange(track.id, value)}
                      min={0}
                      max={1}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                  <div className="text-xs font-mono w-12 text-right">
                    {Math.round(track.volume * 100)}%
                  </div>
                </div>

                {/* Level Meter */}
                <div className="flex justify-center">
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                      style={{ 
                        width: `${track.volume * (track.muted ? 0 : 75)}%`,
                        opacity: track.muted ? 0.3 : 1
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}