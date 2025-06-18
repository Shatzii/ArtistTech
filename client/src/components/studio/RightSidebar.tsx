import { useState } from "react";
import { StudioMode } from "@/pages/studio";
import { AudioEngineType } from "@/hooks/useAudioEngine";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Film, Save, Power } from "lucide-react";
import Knob from "./Knob";
import Fader from "./Fader";

interface Effect {
  id: string;
  name: string;
  enabled: boolean;
  parameters: Record<string, number>;
}

interface RightSidebarProps {
  mode: StudioMode;
  projectId: number | null;
  audioEngine: AudioEngineType;
}

export default function RightSidebar({ mode, projectId, audioEngine }: RightSidebarProps) {
  const [effects, setEffects] = useState<Effect[]>([
    {
      id: 'reverb',
      name: 'Reverb',
      enabled: true,
      parameters: {
        size: 0.45,
        mix: 0.6,
      },
    },
    {
      id: 'delay',
      name: 'Delay',
      enabled: false,
      parameters: {
        time: 0.3,
        feedback: 0.4,
      },
    },
  ]);

  const [masterVolume, setMasterVolume] = useState(0.8);
  const [leftLevel, setLeftLevel] = useState(0.75);
  const [rightLevel, setRightLevel] = useState(0.65);

  const toggleEffect = (effectId: string) => {
    setEffects(prev => prev.map(effect => 
      effect.id === effectId 
        ? { ...effect, enabled: !effect.enabled }
        : effect
    ));
  };

  const updateEffectParameter = (effectId: string, parameter: string, value: number) => {
    setEffects(prev => prev.map(effect => 
      effect.id === effectId 
        ? { 
            ...effect, 
            parameters: { ...effect.parameters, [parameter]: value }
          }
        : effect
    ));
  };

  const handleExportAudio = async () => {
    if (!projectId) return;
    
    try {
      const response = await fetch(`/api/export/audio/${projectId}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("Audio export started:", result);
      }
    } catch (error) {
      console.error("Failed to export audio:", error);
    }
  };

  const handleExportVideo = async () => {
    if (!projectId) return;
    
    try {
      const response = await fetch(`/api/export/video/${projectId}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("Video export started:", result);
      }
    } catch (error) {
      console.error("Failed to export video:", error);
    }
  };

  return (
    <div className="w-64 studio-panel border-l studio-border">
      <ScrollArea className="h-full">
        {/* Effects Rack */}
        <div className="p-4 border-b studio-border">
          <h3 className="text-sm font-semibold mb-3 studio-accent">EFFECTS</h3>
          
          <div className="space-y-3">
            {effects.map((effect) => (
              <div
                key={effect.id}
                className={`studio-bg rounded p-3 border ${
                  effect.enabled ? 'border-[var(--studio-accent)]' : 'border-[var(--studio-border)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{effect.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEffect(effect.id)}
                    className={`w-6 h-6 p-0 rounded ${
                      effect.enabled 
                        ? 'bg-[var(--studio-accent)] bg-opacity-20 text-[var(--studio-accent)]'
                        : 'bg-[var(--studio-inactive)] bg-opacity-20 text-[var(--studio-inactive)]'
                    }`}
                  >
                    <Power size={12} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(effect.parameters).map(([param, value]) => (
                    <div key={param} className="text-center">
                      <Knob
                        value={value}
                        onChange={(newValue) => updateEffectParameter(effect.id, param, newValue)}
                        size={40}
                        className="mx-auto mb-1"
                        disabled={!effect.enabled}
                      />
                      <span className="text-xs text-gray-400 capitalize">
                        {param}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master Output */}
        <div className="p-4 border-b studio-border">
          <h3 className="text-sm font-semibold mb-3 studio-accent">MASTER</h3>
          
          <div className="flex justify-center mb-4">
            <div className="text-center">
              <Fader
                value={masterVolume}
                onChange={setMasterVolume}
                height={160}
                className="mb-2"
              />
              <span className="text-xs text-gray-400">MASTER</span>
            </div>
          </div>

          {/* Level Meters */}
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-2 h-32 studio-bg rounded-full relative">
              <div
                className="absolute bottom-0 left-0 right-0 level-meter rounded-full transition-all duration-75"
                style={{ height: `${leftLevel * 100}%` }}
              />
            </div>
            <div className="w-2 h-32 studio-bg rounded-full relative">
              <div
                className="absolute bottom-0 left-0 right-0 level-meter rounded-full transition-all duration-75"
                style={{ height: `${rightLevel * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-3 studio-accent">EXPORT</h3>
          
          <div className="space-y-2">
            <Button
              onClick={handleExportAudio}
              disabled={!projectId}
              className="w-full bg-[var(--studio-accent)] bg-opacity-20 text-[var(--studio-accent)] py-2 px-4 hover:bg-opacity-30 text-sm"
            >
              <Download className="mr-2" size={16} />
              Export Audio
            </Button>
            
            <Button
              onClick={handleExportVideo}
              disabled={!projectId}
              className="w-full bg-[var(--studio-accent)] bg-opacity-20 text-[var(--studio-accent)] py-2 px-4 hover:bg-opacity-30 text-sm"
            >
              <Film className="mr-2" size={16} />
              Export Video
            </Button>
            
            <Button
              disabled={!projectId}
              className="w-full bg-[var(--studio-inactive)] bg-opacity-20 text-[var(--studio-inactive)] py-2 px-4 text-sm"
            >
              <Save className="mr-2" size={16} />
              Save Project
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
