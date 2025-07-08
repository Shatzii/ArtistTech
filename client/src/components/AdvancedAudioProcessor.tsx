import { useState, useEffect, useRef } from 'react';
import { Activity, BarChart3, Settings, Sliders, Zap, Filter, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface AudioEffect {
  id: string;
  name: string;
  type: 'filter' | 'dynamics' | 'modulation' | 'delay' | 'reverb';
  parameters: { [key: string]: number };
  enabled: boolean;
  preset?: string;
}

interface AdvancedAudioProcessorProps {
  onEffectChange?: (effects: AudioEffect[]) => void;
}

export default function AdvancedAudioProcessor({ onEffectChange }: AdvancedAudioProcessorProps) {
  const audioEngine = useAudioEngine();
  const spectrumRef = useRef<HTMLCanvasElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  
  const [effects, setEffects] = useState<AudioEffect[]>([
    {
      id: 'lowpass',
      name: 'Low Pass Filter',
      type: 'filter',
      parameters: { frequency: 20000, resonance: 1 },
      enabled: false,
      preset: 'gentle'
    },
    {
      id: 'compressor',
      name: 'Compressor',
      type: 'dynamics',
      parameters: { threshold: -24, ratio: 4, attack: 3, release: 250 },
      enabled: false,
      preset: 'vocal'
    },
    {
      id: 'chorus',
      name: 'Chorus',
      type: 'modulation',
      parameters: { rate: 1.5, depth: 0.3, feedback: 0.2, mix: 0.5 },
      enabled: false,
      preset: 'warm'
    },
    {
      id: 'delay',
      name: 'Delay',
      type: 'delay',
      parameters: { time: 250, feedback: 0.3, mix: 0.2 },
      enabled: false,
      preset: 'eighth'
    },
    {
      id: 'reverb',
      name: 'Convolution Reverb',
      type: 'reverb',
      parameters: { roomSize: 0.7, damping: 0.5, mix: 0.3 },
      enabled: false,
      preset: 'hall'
    }
  ]);

  const [analysisData, setAnalysisData] = useState({
    peak: 0,
    rms: 0,
    spectralCentroid: 0,
    dynamicRange: 0,
    stereoWidth: 0
  });

  // Real-time audio analysis
  useEffect(() => {
    const analyzeAudio = () => {
      const spectrum = audioEngine.getSpectrum();
      
      if (spectrum.length > 0) {
        // Calculate peak and RMS
        let peak = 0;
        let sum = 0;
        
        for (let i = 0; i < spectrum.length; i++) {
          const value = spectrum[i] / 255;
          peak = Math.max(peak, value);
          sum += value * value;
        }
        
        const rms = Math.sqrt(sum / spectrum.length);
        const spectralCentroid = calculateSpectralCentroid(spectrum);
        
        setAnalysisData({
          peak: peak * 100,
          rms: rms * 100,
          spectralCentroid: spectralCentroid,
          dynamicRange: (peak - rms) * 100,
          stereoWidth: Math.random() * 100 // Simulated stereo width
        });

        // Update spectrum visualization
        drawSpectrum(spectrum);
        drawWaveform();
      }
      
      requestAnimationFrame(analyzeAudio);
    };
    
    analyzeAudio();
  }, [audioEngine]);

  const calculateSpectralCentroid = (spectrum: Uint8Array): number => {
    let weightedSum = 0;
    let magnitudeSum = 0;
    
    for (let i = 0; i < spectrum.length; i++) {
      const magnitude = spectrum[i] / 255;
      weightedSum += i * magnitude;
      magnitudeSum += magnitude;
    }
    
    return magnitudeSum > 0 ? (weightedSum / magnitudeSum) / spectrum.length * 22050 : 0;
  };

  const drawSpectrum = (spectrum: Uint8Array) => {
    const canvas = spectrumRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw frequency bands
    const barWidth = width / spectrum.length;
    
    for (let i = 0; i < spectrum.length; i++) {
      const barHeight = (spectrum[i] / 255) * height;
      
      // Color gradient based on frequency
      const hue = (i / spectrum.length) * 240; // Blue to red
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
    
    // Draw frequency labels
    ctx.fillStyle = '#666';
    ctx.font = '10px Arial';
    ctx.fillText('20Hz', 5, height - 5);
    ctx.fillText('20kHz', width - 35, height - 5);
  };

  const drawWaveform = () => {
    const canvas = waveformRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Simulate waveform data
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < width; i++) {
      const y = height / 2 + Math.sin(i * 0.1 + Date.now() * 0.001) * height / 4;
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    
    ctx.stroke();
  };

  const updateEffect = (effectId: string, parameter: string, value: number) => {
    setEffects(prev => prev.map(effect => 
      effect.id === effectId 
        ? { ...effect, parameters: { ...effect.parameters, [parameter]: value } }
        : effect
    ));
  };

  const toggleEffect = (effectId: string) => {
    setEffects(prev => prev.map(effect => 
      effect.id === effectId 
        ? { ...effect, enabled: !effect.enabled }
        : effect
    ));
  };

  useEffect(() => {
    onEffectChange?.(effects);
  }, [effects, onEffectChange]);

  const presets = {
    vocal: () => setEffects(prev => prev.map(e => ({ ...e, enabled: e.id === 'compressor' || e.id === 'reverb' }))),
    master: () => setEffects(prev => prev.map(e => ({ ...e, enabled: e.id === 'compressor' || e.id === 'lowpass' }))),
    creative: () => setEffects(prev => prev.map(e => ({ ...e, enabled: e.id === 'chorus' || e.id === 'delay' })))
  };

  return (
    <div className="space-y-6">
      {/* Real-time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Real-time Audio Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Audio Meters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">{analysisData.peak.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Peak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">{analysisData.rms.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">RMS</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{analysisData.spectralCentroid.toFixed(0)}Hz</div>
              <div className="text-xs text-gray-500">Centroid</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">{analysisData.dynamicRange.toFixed(1)}dB</div>
              <div className="text-xs text-gray-500">Dynamic Range</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-500">{analysisData.stereoWidth.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Stereo Width</div>
            </div>
          </div>
          
          {/* Spectrum Analyzer */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Frequency Spectrum</h4>
            <canvas
              ref={spectrumRef}
              width={600}
              height={120}
              className="w-full h-20 bg-black rounded border"
            />
          </div>
          
          {/* Waveform */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Waveform</h4>
            <canvas
              ref={waveformRef}
              width={600}
              height={80}
              className="w-full h-16 bg-black rounded border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Effect Chain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Professional Effects Chain
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={presets.vocal}>Vocal</Button>
              <Button variant="outline" size="sm" onClick={presets.master}>Master</Button>
              <Button variant="outline" size="sm" onClick={presets.creative}>Creative</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {effects.map((effect) => (
            <div
              key={effect.id}
              className={`p-4 rounded-lg border ${
                effect.enabled ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : 'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Switch
                    checked={effect.enabled}
                    onCheckedChange={() => toggleEffect(effect.id)}
                  />
                  <span className="ml-3 font-medium">{effect.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {effect.preset}
                  </Badge>
                </div>
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              
              {effect.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(effect.parameters).map(([param, value]) => (
                    <div key={param} className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize">{param}</span>
                        <span>{value}</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => updateEffect(effect.id, param, newValue)}
                        min={param === 'frequency' ? 20 : param === 'threshold' ? -60 : 0}
                        max={param === 'frequency' ? 20000 : param === 'ratio' ? 20 : param === 'release' ? 1000 : 1}
                        step={param === 'frequency' ? 100 : param === 'ratio' ? 0.1 : 0.01}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}