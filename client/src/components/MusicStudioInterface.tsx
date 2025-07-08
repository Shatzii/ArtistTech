import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, Square, Volume2, Music, Mic, 
  Upload, Save, Share2, Plus, Trash2, Settings,
  Layers, Sliders, Filter, Zap, Download, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Waveform from './Waveform';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useCollaborativeSession } from '@/hooks/useCollaborativeSession';
import CollaborativePanel from './CollaborativePanel';
import CollaborativeCursor from './CollaborativeCursor';
import AIAssistant from './AIAssistant';
import RealTimeMetrics from './RealTimeMetrics';
import AdvancedAudioProcessor from './AdvancedAudioProcessor';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Track {
  id: string;
  name: string;
  color: string;
  volume: number;
  muted: boolean;
  solo: boolean;
  pan: number;
  effects: {
    reverb: number;
    delay: number;
    filter: number;
    compressor: number;
  };
  audioFileId?: string;
}

interface Project {
  id?: string;
  name: string;
  bpm: number;
  tracks: Track[];
  masterVolume: number;
}

export default function MusicStudioInterface() {
  const audioEngine = useAudioEngine();
  const [spectrum, setSpectrum] = useState<Uint8Array>(new Uint8Array(0));
  const spectrumRef = useRef<HTMLCanvasElement>(null);
  const [showRecordingPanel, setShowRecordingPanel] = useState(false);
  const [showMasterEffects, setShowMasterEffects] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);
  const [showAdvancedProcessor, setShowAdvancedProcessor] = useState(false);

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

  const [project, setProject] = useState<Project>({
    name: 'New Project',
    bpm: audioEngine.bpm,
    masterVolume: audioEngine.volume,
    tracks: [
      { id: '1', name: 'Kick', color: 'bg-red-500', volume: 80, muted: false, solo: false, pan: 0, effects: { reverb: 0, delay: 0, filter: 50, compressor: 0 } },
      { id: '2', name: 'Snare', color: 'bg-blue-500', volume: 70, muted: false, solo: false, pan: 0, effects: { reverb: 0, delay: 0, filter: 50, compressor: 0 } },
      { id: '3', name: 'Hi-Hat', color: 'bg-green-500', volume: 60, muted: false, solo: false, pan: 0, effects: { reverb: 0, delay: 0, filter: 50, compressor: 0 } },
      { id: '4', name: 'Bass', color: 'bg-purple-500', volume: 85, muted: false, solo: false, pan: 0, effects: { reverb: 0, delay: 0, filter: 50, compressor: 0 } },
      { id: '5', name: 'Lead', color: 'bg-yellow-500', volume: 65, muted: false, solo: false, pan: 0, effects: { reverb: 0, delay: 0, filter: 50, compressor: 0 } },
      { id: '6', name: 'Vocals', color: 'bg-pink-500', volume: 75, muted: false, solo: false, pan: 0, effects: { reverb: 0, delay: 0, filter: 50, compressor: 0 } }
    ]
  });

  const [isRecording, setIsRecording] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('1');
  const [showUpload, setShowUpload] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(true);

  const audioEngine = useAudioEngine();
  const queryClient = useQueryClient();

  // Collaborative session
  const projectId = "demo-project-1"; // In real app, this would come from props or URL
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    session,
    isConnected,
    connectionError,
    sendEdit,
    updateCursor,
    selectTrack: selectCollaborativeTrack
  } = useCollaborativeSession(projectId);

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

  const updateTrack = (trackId: string, updates: Partial<Track>) => {
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.map(track => 
        track.id === trackId ? { ...track, ...updates } : track
      )
    }));

    // Send collaborative edit
    if (updates.volume !== undefined) {
      sendEdit({
        type: 'volume_change',
        trackId: parseInt(trackId),
        data: { volume: updates.volume }
      });
    }
    if (updates.effects) {
      sendEdit({
        type: 'effect_change',
        trackId: parseInt(trackId),
        data: { effects: updates.effects }
      });
    }
  };

  const addTrack = () => {
    const newTrack: Track = {
      id: Date.now().toString(),
      name: `Track ${project.tracks.length + 1}`,
      color: `bg-indigo-500`,
      volume: 75,
      muted: false,
      solo: false,
      pan: 0,
      effects: { reverb: 0, delay: 0, filter: 50, compressor: 0 }
    };
    
    setProject(prev => ({
      ...prev,
      tracks: [...prev.tracks, newTrack]
    }));
  };

  const removeTrack = (trackId: string) => {
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.filter(track => track.id !== trackId)
    }));
  };

  const handleTrackPlay = (trackId: string) => {
    const track = project.tracks.find(t => t.id === trackId);
    if (track && track.audioFileId) {
      // Load and play the associated audio file
      const userTrack = userTracks.find((ut: any) => ut.id === track.audioFileId);
      if (userTrack) {
        audioEngine.loadTrack({
          id: userTrack.id,
          name: userTrack.filename,
          url: `/uploads/${userTrack.filename}`,
          duration: userTrack.duration || 0,
          bpm: userTrack.bpm,
          key: userTrack.key
        });
      }
    }
  };

  const handleFileUpload = async (file: File, trackId?: string) => {
    try {
      const audioTrack = await audioEngine.uploadAudio(file);
      
      if (trackId) {
        // Update existing track
        updateTrack(trackId, { 
          audioFileId: audioTrack.id, 
          name: audioTrack.name 
        });
      } else {
        // Add new track
        const newTrack: Track = {
          id: audioTrack.id,
          name: audioTrack.name,
          color: '#3b82f6',
          volume: 75,
          muted: false,
          solo: false,
          pan: 0,
          effects: { reverb: 0, delay: 0, filter: 0, compressor: 0 },
          audioFileId: audioTrack.id
        };
        
        setProject(prev => ({
          ...prev,
          tracks: [...prev.tracks, newTrack]
        }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Handle recording
  const handleRecord = () => {
    if (audioEngine.isRecording) {
      audioEngine.stopRecording();
      setShowRecordingPanel(false);
    } else {
      audioEngine.record();
      setShowRecordingPanel(true);
    }
  };

  // Handle export
  const handleExport = async (format: 'wav' | 'mp3') => {
    try {
      const blob = await audioEngine.exportProject(format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting project:', error);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExportFile = async (file: File, trackId: string) => {
    try {
      const uploadedTrack = await audioEngine.uploadAudio(file);
      updateTrack(trackId, { 
        audioFileId: uploadedTrack.id,
        name: uploadedTrack.name 
      });
      setShowUpload(false);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleSaveProject = () => {
    saveProjectMutation.mutate(project);
  };

  // Mouse tracking for collaborative cursors
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        updateCursor(event.clientX, event.clientY);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [updateCursor]);

  const handleTrackSelect = (trackId: string) => {
    setSelectedTrack(trackId);
    selectCollaborativeTrack(parseInt(trackId));
  };

  const TrackComponent = ({ track }: { track: Track }) => (
    <Card className={`${track.color} bg-opacity-20 border-opacity-30 ${selectedTrack === track.id ? 'ring-2 ring-blue-400' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{track.name}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant={track.muted ? "default" : "ghost"}
              size="sm"
              onClick={() => updateTrack(track.id, { muted: !track.muted })}
              className="h-6 w-8 text-xs"
            >
              M
            </Button>
            <Button
              variant={track.solo ? "default" : "ghost"}
              size="sm"
              onClick={() => updateTrack(track.id, { solo: !track.solo })}
              className="h-6 w-8 text-xs"
            >
              S
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeTrack(track.id)}
              className="h-6 w-8 text-xs text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Waveform placeholder */}
        <div 
          className="h-12 bg-black bg-opacity-40 rounded cursor-pointer"
          onClick={() => setSelectedTrack(track.id)}
        >
          {track.audioFileId ? (
            <Waveform 
              currentTime={audioEngine.currentTime}
              duration={audioEngine.duration}
              isPlaying={audioEngine.isPlaying}
              onSeek={audioEngine.seekTo}
              height={48}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-xs">
              No audio loaded
            </div>
          )}
        </div>

        {/* Transport Controls */}
        <div className="flex justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTrackPlay(track.id)}
            disabled={!track.audioFileId}
          >
            {audioEngine.isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="sm">
            <Square className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowUpload(true)}
          >
            <Upload className="h-3 w-3" />
          </Button>
        </div>

        {/* Volume & Pan */}
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
            className="w-full"
          />
          
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
            className="w-full"
          />
        </div>

        {/* Effects */}
        <div className="space-y-2">
          <div className="text-xs font-medium flex items-center">
            <Zap className="h-3 w-3 mr-1" />
            Effects
          </div>
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
                className="w-full"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            value={project.name}
            onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
            className="max-w-xs"
            placeholder="Project Name"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">BPM:</span>
            <Input
              type="number"
              value={project.bpm}
              onChange={(e) => setProject(prev => ({ ...prev, bpm: parseInt(e.target.value) || 120 }))}
              className="w-20"
              min={60}
              max={200}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowAIAssistant(!showAIAssistant)} 
            variant={showAIAssistant ? "default" : "outline"}
            className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
          >
            🤖 AI Assistant
          </Button>
          <Button 
            onClick={() => setShowAdvancedProcessor(!showAdvancedProcessor)} 
            variant={showAdvancedProcessor ? "default" : "outline"}
            className="border-green-500 text-green-400 hover:bg-green-500/20"
          >
            🎛️ Pro Audio
          </Button>
          <Button 
            onClick={() => setShowCollaboration(!showCollaboration)} 
            variant={showCollaboration ? "default" : "outline"}
            className={showCollaboration ? "bg-cyan-600 hover:bg-cyan-700" : "border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"}
          >
            <Users className="h-4 w-4 mr-2" />
            Collaboration {isConnected ? `(${session?.users.length || 0})` : '(Offline)'}
          </Button>
          <Button
            variant={audioEngine.isRecording ? "destructive" : "default"}
            onClick={handleRecord}
          >
            <Mic className="h-4 w-4 mr-2" />
            {audioEngine.isRecording ? 'Stop Recording' : 'Record'}
          </Button>
          <Button
            onClick={handleSaveProject}
            disabled={saveProjectMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Project
          </Button>
          <div className="flex gap-1">
            <Button variant="outline" onClick={() => handleExport('wav')}>
              <Download className="h-4 w-4 mr-2" />
              Export WAV
            </Button>
            <Button variant="outline" onClick={() => handleExport('mp3')}>
              <Download className="h-4 w-4 mr-2" />
              Export MP3
            </Button>
          </div>
        </div>
      </div>

      {/* Professional Transport Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Transport Controls
            </div>
            <div className="text-sm font-mono bg-black/20 px-3 py-1 rounded">
              {formatTime(audioEngine.currentTime)} / {formatTime(audioEngine.duration)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Button 
              size="lg"
              variant="ghost"
              onClick={audioEngine.stop}
            >
              <Square className="h-6 w-6" />
            </Button>
            <Button 
              size="lg"
              variant={audioEngine.isPlaying ? "default" : "ghost"}
              onClick={audioEngine.isPlaying ? audioEngine.pause : audioEngine.play}
              disabled={audioEngine.isLoading}
            >
              {audioEngine.isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button 
              size="lg"
              variant={audioEngine.isRecording ? "destructive" : "ghost"}
              onClick={handleRecord}
            >
              <Mic className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Spectrum Analyzer */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Real-time Spectrum Analyzer</h3>
            <canvas
              ref={spectrumRef}
              width={800}
              height={150}
              className="w-full h-24 bg-black/10 rounded border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Master Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sliders className="h-5 w-5 mr-2" />
            Master Controls & Effects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Master Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">{audioEngine.volume}%</span>
              </div>
              <Slider
                value={[audioEngine.volume]}
                onValueChange={([value]) => audioEngine.setVolume(value)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Master Effects */}
            {Object.entries(audioEngine.masterEffects).map(([effect, value]) => (
              <div key={effect} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm capitalize flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    {effect}
                  </span>
                  <span className="text-sm">{value}%</span>
                </div>
                <Slider
                  value={[value]}
                  onValueChange={([newValue]) => audioEngine.setMasterEffect(effect, newValue)}
                  min={0}
                  max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Transport Controls */}
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={audioEngine.play}
                disabled={!audioEngine.activeTrack}
              >
                <Play className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={audioEngine.pause}
              >
                <Pause className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={audioEngine.stop}
              >
                <Square className="h-6 w-6" />
              </Button>
            </div>

            {/* Project Stats */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tracks:</span>
                <span>{project.tracks.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{Math.floor(audioEngine.duration / 60)}:{Math.floor(audioEngine.duration % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span>CPU:</span>
                <span>23%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Enhancement Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* AI Assistant */}
        {showAIAssistant && (
          <div className="lg:col-span-1">
            <AIAssistant 
              context="music"
              onSuggestion={(suggestion) => {
                console.log('AI Suggestion received:', suggestion);
              }}
            />
          </div>
        )}

        {/* Real-time Metrics */}
        {showMetrics && (
          <div className="lg:col-span-2">
            <RealTimeMetrics context="studio" />
          </div>
        )}
      </div>

      {/* Advanced Audio Processor */}
      {showAdvancedProcessor && (
        <div className="mb-6">
          <AdvancedAudioProcessor
            onEffectChange={(effects) => {
              effects.forEach(effect => {
                if (effect.enabled) {
                  audioEngine.setMasterEffect(effect.name.toLowerCase(), effect.parameters);
                }
              });
            }}
          />
        </div>
      )}

      {/* Track List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            Tracks
          </h3>
          <Button onClick={addTrack} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Track
          </Button>
        </div>

        <div className={`grid ${showCollaboration ? 'lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
          {/* Tracks */}
          <div className={`${showCollaboration ? 'lg:col-span-3' : ''} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
            {project.tracks.map(track => (
              <div key={track.id} onClick={() => handleTrackSelect(track.id)}>
                <TrackComponent track={track} />
              </div>
            ))}
          </div>

          {/* Collaborative Panel */}
          {showCollaboration && (
            <div className="lg:col-span-1">
              <CollaborativePanel
                session={session}
                isConnected={isConnected}
                connectionError={connectionError}
                onInviteUsers={() => {
                  console.log('Invite users - TODO: Implement invite modal');
                }}
                onSessionSettings={() => {
                  console.log('Session settings - TODO: Implement settings modal');
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* File Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Upload Audio File</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && selectedTrack) {
                    handleFileUpload(file, selectedTrack);
                  }
                }}
                className="w-full"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Collaborative Cursors Overlay */}
      {session?.users.map((user) => (
        <CollaborativeCursor
          key={user.id}
          user={user}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}