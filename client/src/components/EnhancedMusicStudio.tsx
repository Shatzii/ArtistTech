import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, Square, Volume2, Music, Mic, Upload, Save, Share2, 
  Plus, Trash2, Settings, Layers, Sliders, Filter, Zap, Download, 
  Users, Record, Scissors, Copy, Undo, Redo, Maximize, Minimize,
  Eye, EyeOff, Lock, Unlock, RotateCcw, SkipBack, SkipForward
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Waveform from './Waveform';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AudioTrack {
  id: string;
  name: string;
  color: string;
  volume: number;
  muted: boolean;
  solo: boolean;
  pan: number;
  armed: boolean;
  locked: boolean;
  visible: boolean;
  effects: {
    reverb: number;
    delay: number;
    filter: number;
    compressor: number;
    chorus: number;
    phaser: number;
  };
  audioFileId?: string;
  regions: Array<{
    id: string;
    start: number;
    end: number;
    fadeIn: number;
    fadeOut: number;
    gain: number;
  }>;
  automation: Array<{
    parameter: string;
    points: Array<{ time: number; value: number }>;
  }>;
}

interface Project {
  id?: string;
  name: string;
  bpm: number;
  timeSignature: string;
  key: string;
  tracks: AudioTrack[];
  masterVolume: number;
  masterEffects: {
    eq: { low: number; mid: number; high: number };
    compressor: number;
    limiter: number;
    reverb: number;
  };
}

interface VSTPlugin {
  id: string;
  name: string;
  type: 'instrument' | 'effect';
  preset: string;
  parameters: Record<string, number>;
}

export default function EnhancedMusicStudio() {
  const audioEngine = useAudioEngine();
  const queryClient = useQueryClient();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [spectrum, setSpectrum] = useState<Uint8Array>(new Uint8Array(0));
  const spectrumRef = useRef<HTMLCanvasElement>(null);

  const [project, setProject] = useState<Project>({
    name: 'New Project',
    bpm: 120,
    timeSignature: '4/4',
    key: 'C Major',
    masterVolume: 80,
    masterEffects: {
      eq: { low: 50, mid: 50, high: 50 },
      compressor: 0,
      limiter: 0,
      reverb: 0
    },
    tracks: [
      {
        id: 'track-1',
        name: 'Kick',
        color: '#ef4444',
        volume: 80,
        muted: false,
        solo: false,
        pan: 0,
        armed: false,
        locked: false,
        visible: true,
        effects: { reverb: 0, delay: 0, filter: 50, compressor: 0, chorus: 0, phaser: 0 },
        regions: [],
        automation: []
      },
      {
        id: 'track-2',
        name: 'Snare',
        color: '#3b82f6',
        volume: 75,
        muted: false,
        solo: false,
        pan: 0,
        armed: false,
        locked: false,
        visible: true,
        effects: { reverb: 10, delay: 0, filter: 50, compressor: 25, chorus: 0, phaser: 0 },
        regions: [],
        automation: []
      },
      {
        id: 'track-3',
        name: 'Hi-Hat',
        color: '#10b981',
        volume: 60,
        muted: false,
        solo: false,
        pan: 20,
        armed: false,
        locked: false,
        visible: true,
        effects: { reverb: 15, delay: 0, filter: 70, compressor: 0, chorus: 0, phaser: 0 },
        regions: [],
        automation: []
      },
      {
        id: 'track-4',
        name: 'Bass',
        color: '#8b5cf6',
        volume: 85,
        muted: false,
        solo: false,
        pan: 0,
        armed: false,
        locked: false,
        visible: true,
        effects: { reverb: 0, delay: 0, filter: 30, compressor: 40, chorus: 0, phaser: 0 },
        regions: [],
        automation: []
      }
    ]
  });

  const [selectedTrack, setSelectedTrack] = useState<string>('track-1');
  const [playbackMode, setPlaybackMode] = useState<'loop' | 'linear'>('linear');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState('1/16');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showMixer, setShowMixer] = useState(true);
  const [showEffects, setShowEffects] = useState(true);
  const [showPianoRoll, setShowPianoRoll] = useState(false);
  const [recordingTrack, setRecordingTrack] = useState<string | null>(null);
  const [loopRegion, setLoopRegion] = useState({ start: 0, end: 0, enabled: false });

  // Fetch user's audio tracks
  const { data: userTracks = [] } = useQuery({
    queryKey: ['/api/audio/tracks'],
    enabled: true
  });

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (projectData: Project) => {
      const response = await apiRequest('POST', '/api/projects', projectData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    }
  });

  // Real-time spectrum visualization
  useEffect(() => {
    const updateSpectrum = () => {
      const spectrumData = audioEngine.getSpectrum();
      setSpectrum(spectrumData);
      
      if (spectrumRef.current && spectrumData.length > 0) {
        const canvas = spectrumRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const barWidth = width / spectrumData.length;
        let x = 0;
        
        for (let i = 0; i < spectrumData.length; i++) {
          const barHeight = (spectrumData[i] / 255) * height;
          
          const hue = (i / spectrumData.length) * 360;
          ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
          
          x += barWidth;
        }
      }
      
      requestAnimationFrame(updateSpectrum);
    };
    
    updateSpectrum();
  }, [audioEngine]);

  const updateTrack = useCallback((trackId: string, updates: Partial<AudioTrack>) => {
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.map(track => 
        track.id === trackId ? { ...track, ...updates } : track
      )
    }));
  }, []);

  const addTrack = useCallback(() => {
    const newTrack: AudioTrack = {
      id: `track-${Date.now()}`,
      name: `Track ${project.tracks.length + 1}`,
      color: '#6b7280',
      volume: 75,
      muted: false,
      solo: false,
      pan: 0,
      armed: false,
      locked: false,
      visible: true,
      effects: { reverb: 0, delay: 0, filter: 50, compressor: 0, chorus: 0, phaser: 0 },
      regions: [],
      automation: []
    };
    
    setProject(prev => ({
      ...prev,
      tracks: [...prev.tracks, newTrack]
    }));
  }, [project.tracks.length]);

  const duplicateTrack = useCallback((trackId: string) => {
    const track = project.tracks.find(t => t.id === trackId);
    if (!track) return;

    const newTrack: AudioTrack = {
      ...track,
      id: `track-${Date.now()}`,
      name: `${track.name} Copy`,
      regions: track.regions.map(region => ({ ...region, id: `region-${Date.now()}-${Math.random()}` }))
    };
    
    setProject(prev => ({
      ...prev,
      tracks: [...prev.tracks, newTrack]
    }));
  }, [project.tracks]);

  const removeTrack = useCallback((trackId: string) => {
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.filter(track => track.id !== trackId)
    }));
  }, []);

  const handleRecord = useCallback((trackId: string) => {
    if (recordingTrack === trackId) {
      // Stop recording
      audioEngine.stopRecording();
      setRecordingTrack(null);
      updateTrack(trackId, { armed: false });
    } else {
      // Start recording
      audioEngine.record();
      setRecordingTrack(trackId);
      updateTrack(trackId, { armed: true });
    }
  }, [recordingTrack, audioEngine, updateTrack]);

  const handleFileUpload = useCallback(async (file: File, trackId?: string) => {
    try {
      const audioTrack = await audioEngine.uploadAudio(file);
      
      if (trackId) {
        updateTrack(trackId, { 
          audioFileId: audioTrack.id, 
          name: audioTrack.name,
          regions: [{
            id: `region-${Date.now()}`,
            start: 0,
            end: audioTrack.duration,
            fadeIn: 0,
            fadeOut: 0,
            gain: 1
          }]
        });
      } else {
        const newTrack: AudioTrack = {
          id: `track-${Date.now()}`,
          name: audioTrack.name,
          color: '#3b82f6',
          volume: 75,
          muted: false,
          solo: false,
          pan: 0,
          armed: false,
          locked: false,
          visible: true,
          effects: { reverb: 0, delay: 0, filter: 50, compressor: 0, chorus: 0, phaser: 0 },
          audioFileId: audioTrack.id,
          regions: [{
            id: `region-${Date.now()}`,
            start: 0,
            end: audioTrack.duration,
            fadeIn: 0,
            fadeOut: 0,
            gain: 1
          }],
          automation: []
        };
        
        setProject(prev => ({
          ...prev,
          tracks: [...prev.tracks, newTrack]
        }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [audioEngine, updateTrack]);

  const TrackComponent = ({ track }: { track: AudioTrack }) => (
    <div className={`border-l-4 ${track.color} bg-gray-900 border-gray-700 ${
      selectedTrack === track.id ? 'ring-2 ring-blue-400' : ''
    }`}>
      {/* Track Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Input
              value={track.name}
              onChange={(e) => updateTrack(track.id, { name: e.target.value })}
              className="text-sm font-medium bg-transparent border-none p-0 h-auto"
              onClick={() => setSelectedTrack(track.id)}
            />
            {recordingTrack === track.id && (
              <Badge variant="destructive" className="animate-pulse">REC</Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant={track.visible ? "ghost" : "outline"}
              size="sm"
              onClick={() => updateTrack(track.id, { visible: !track.visible })}
              className="h-6 w-6 p-0"
            >
              {track.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
            <Button
              variant={track.locked ? "default" : "ghost"}
              size="sm"
              onClick={() => updateTrack(track.id, { locked: !track.locked })}
              className="h-6 w-6 p-0"
            >
              {track.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            </Button>
            <Button
              variant={track.armed ? "destructive" : "ghost"}
              size="sm"
              onClick={() => handleRecord(track.id)}
              className="h-6 w-6 p-0"
              disabled={track.locked}
            >
              <Record className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Track Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={track.muted ? "destructive" : "ghost"}
              size="sm"
              onClick={() => updateTrack(track.id, { muted: !track.muted })}
              className="h-6 w-8 text-xs"
              disabled={track.locked}
            >
              M
            </Button>
            <Button
              variant={track.solo ? "default" : "ghost"}
              size="sm"
              onClick={() => updateTrack(track.id, { solo: !track.solo })}
              className="h-6 w-8 text-xs"
              disabled={track.locked}
            >
              S
            </Button>
            
            <input
              type="color"
              value={track.color}
              onChange={(e) => updateTrack(track.id, { color: e.target.value })}
              className="w-6 h-6 rounded border-0 cursor-pointer"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => duplicateTrack(track.id)}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeTrack(track.id)}
              className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
              disabled={track.locked}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Waveform/Timeline */}
      <div className="h-24 p-2">
        {track.audioFileId ? (
          <Waveform
            currentTime={audioEngine.currentTime}
            duration={audioEngine.duration}
            isPlaying={audioEngine.isPlaying}
            onSeek={audioEngine.seekTo}
            height={80}
            color={track.color}
          />
        ) : (
          <div 
            className="h-full bg-gray-800 rounded flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'audio/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleFileUpload(file, track.id);
              };
              input.click();
            }}
          >
            <div className="text-center">
              <Upload className="h-6 w-6 mx-auto mb-1" />
              <div className="text-xs">Drop audio or click to browse</div>
            </div>
          </div>
        )}
      </div>

      {/* Track Controls Panel */}
      <div className="p-4 space-y-4">
        {/* Volume & Pan */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <Volume2 className="h-3 w-3" />
              <span>{track.volume}%</span>
            </div>
            <Slider
              value={[track.volume]}
              onValueChange={([value]) => updateTrack(track.id, { volume: value })}
              min={0}
              max={100}
              step={1}
              disabled={track.locked}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Pan</span>
              <span>{track.pan > 0 ? `R${track.pan}` : track.pan < 0 ? `L${Math.abs(track.pan)}` : 'C'}</span>
            </div>
            <Slider
              value={[track.pan]}
              onValueChange={([value]) => updateTrack(track.id, { pan: value })}
              min={-100}
              max={100}
              step={1}
              disabled={track.locked}
            />
          </div>
        </div>

        {/* Effects */}
        {showEffects && (
          <div className="space-y-3">
            <div className="text-xs font-medium flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              Effects
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(track.effects).map(([effect, value]) => (
                <div key={effect} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize">{effect}</span>
                    <span>{value}%</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={([newValue]) => 
                      updateTrack(track.id, { 
                        effects: { ...track.effects, [effect]: newValue }
                      })
                    }
                    min={0}
                    max={100}
                    step={1}
                    disabled={track.locked}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              value={project.name}
              onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
              className="max-w-xs bg-gray-800 border-gray-600"
              placeholder="Project Name"
            />
            
            <div className="flex items-center space-x-2 text-sm">
              <span>BPM:</span>
              <Input
                type="number"
                value={project.bpm}
                onChange={(e) => setProject(prev => ({ ...prev, bpm: parseInt(e.target.value) || 120 }))}
                className="w-20 bg-gray-800 border-gray-600"
                min={60}
                max={200}
              />
            </div>
            
            <Select value={project.timeSignature} onValueChange={(value) => setProject(prev => ({ ...prev, timeSignature: value }))}>
              <SelectTrigger className="w-20 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4/4">4/4</SelectItem>
                <SelectItem value="3/4">3/4</SelectItem>
                <SelectItem value="6/8">6/8</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={project.key} onValueChange={(value) => setProject(prev => ({ ...prev, key: value }))}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C Major">C Major</SelectItem>
                <SelectItem value="G Major">G Major</SelectItem>
                <SelectItem value="D Major">D Major</SelectItem>
                <SelectItem value="A Minor">A Minor</SelectItem>
                <SelectItem value="E Minor">E Minor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Transport Controls */}
            <Button variant="ghost" size="sm">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant={audioEngine.isPlaying ? "default" : "outline"}
              size="sm"
              onClick={audioEngine.isPlaying ? audioEngine.pause : audioEngine.play}
            >
              {audioEngine.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={audioEngine.stop}>
              <Square className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-6 bg-gray-600 mx-2" />
            
            <Button
              variant={showMixer ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMixer(!showMixer)}
            >
              <Sliders className="h-4 w-4 mr-1" />
              Mixer
            </Button>
            
            <Button
              variant={showEffects ? "default" : "outline"}
              size="sm"
              onClick={() => setShowEffects(!showEffects)}
            >
              <Zap className="h-4 w-4 mr-1" />
              Effects
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => saveProjectMutation.mutate(project)}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Track List */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Tracks</h3>
              <Button variant="outline" size="sm" onClick={addTrack}>
                <Plus className="h-4 w-4 mr-1" />
                Add Track
              </Button>
            </div>
          </div>
          
          <div className="space-y-1">
            {project.tracks.filter(track => track.visible).map(track => (
              <TrackComponent key={track.id} track={track} />
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 bg-gray-800 overflow-auto" ref={timelineRef}>
          {/* Timeline controls would go here */}
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Music className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Professional Timeline</h3>
              <p>Track arrangement and editing area</p>
            </div>
          </div>
        </div>

        {/* Master Section */}
        {showMixer && (
          <div className="w-64 bg-gray-900 border-l border-gray-700 p-4">
            <h3 className="font-medium mb-4">Master</h3>
            
            {/* Spectrum Analyzer */}
            <div className="mb-6">
              <canvas
                ref={spectrumRef}
                width={200}
                height={100}
                className="w-full border border-gray-600 rounded"
              />
            </div>
            
            {/* Master Volume */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <Volume2 className="h-4 w-4" />
                  <span>{project.masterVolume}%</span>
                </div>
                <Slider
                  value={[project.masterVolume]}
                  onValueChange={([value]) => setProject(prev => ({ ...prev, masterVolume: value }))}
                  min={0}
                  max={100}
                  step={1}
                  orientation="vertical"
                  className="h-32 mx-auto"
                />
              </div>

              {/* Master EQ */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Master EQ</h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'mid', 'high'] as const).map((band) => (
                    <div key={band} className="text-center">
                      <label className="text-xs text-gray-400 uppercase">{band}</label>
                      <Slider
                        value={[project.masterEffects.eq[band]]}
                        onValueChange={([value]) => 
                          setProject(prev => ({
                            ...prev,
                            masterEffects: {
                              ...prev.masterEffects,
                              eq: { ...prev.masterEffects.eq, [band]: value }
                            }
                          }))
                        }
                        min={0}
                        max={100}
                        step={1}
                        orientation="vertical"
                        className="h-20 mx-auto mt-2"
                      />
                      <div className="text-xs text-gray-500 mt-1">{project.masterEffects.eq[band]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-gray-900 border-t border-gray-700 p-2 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span>Time: {Math.floor(audioEngine.currentTime / 60)}:{Math.floor(audioEngine.currentTime % 60).toString().padStart(2, '0')}</span>
          <span>BPM: {project.bpm}</span>
          <span>Key: {project.key}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant={snapToGrid ? "default" : "ghost"}
            size="sm"
            onClick={() => setSnapToGrid(!snapToGrid)}
          >
            Snap: {gridSize}
          </Button>
          <span>Zoom: {zoomLevel}%</span>
        </div>
      </div>
    </div>
  );
}