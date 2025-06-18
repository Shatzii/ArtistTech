import { useState, useRef, useEffect } from "react";
import { StudioMode } from "@/pages/studio";
import { AudioEngineType } from "@/hooks/useAudioEngine";
import { useProjects } from "@/hooks/useProjects";
import WaveformCanvas from "./WaveformCanvas";
import { Button } from "@/components/ui/button";
import { Archive, Mic, Play } from "lucide-react";

interface Track {
  id: string;
  name: string;
  type: 'audio' | 'midi' | 'video';
  volume: number;
  muted: boolean;
  solo: boolean;
  clips: Clip[];
}

interface Clip {
  id: string;
  fileId?: number;
  start: number;
  end: number;
  offset: number;
  volume: number;
}

interface MainTimelineProps {
  mode: StudioMode;
  projectId: number | null;
  audioEngine: AudioEngineType;
}

export default function MainTimeline({ mode, projectId, audioEngine }: MainTimelineProps) {
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { projects, updateProject } = useProjects();
  
  const currentProject = projectId ? projects.find(p => p.id === projectId) : null;
  const tracks: Track[] = currentProject?.data?.tracks || [];
  
  const { currentTime, isPlaying } = audioEngine;

  const timeToPixels = (time: number) => time * 50 * zoomLevel; // 50px per second
  const pixelsToTime = (pixels: number) => pixels / (50 * zoomLevel);

  const generateTimeMarkers = () => {
    const markers = [];
    const timelineWidth = 2000; // Approximate timeline width
    const interval = 4; // 4 second intervals
    
    for (let time = 0; time < pixelsToTime(timelineWidth); time += interval) {
      markers.push({
        time,
        position: timeToPixels(time),
        label: formatTime(time),
      });
    }
    return markers;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDrop = (event: React.DragEvent, trackIndex: number) => {
    event.preventDefault();
    
    try {
      const data = JSON.parse(event.dataTransfer.getData("application/json"));
      
      if (data.type === "audio-file") {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const startTime = pixelsToTime(x);
        
        const newClip: Clip = {
          id: `clip-${Date.now()}`,
          fileId: data.fileId,
          start: startTime,
          end: startTime + 30, // Default 30 seconds
          offset: 0,
          volume: 1,
        };

        // Add clip to track
        const updatedTracks = [...tracks];
        if (updatedTracks[trackIndex]) {
          updatedTracks[trackIndex].clips.push(newClip);
        }

        // Update project
        if (currentProject) {
          updateProject(currentProject.id, {
            data: {
              ...currentProject.data,
              tracks: updatedTracks,
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to handle drop:", error);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const addTrack = () => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      name: `Audio ${tracks.length + 1}`,
      type: 'audio',
      volume: 1,
      muted: false,
      solo: false,
      clips: [],
    };

    if (currentProject) {
      updateProject(currentProject.id, {
        data: {
          ...currentProject.data,
          tracks: [...tracks, newTrack],
        },
      });
    }
  };

  const timeMarkers = generateTimeMarkers();

  if (mode === 'dj') {
    return (
      <div className="flex-1 studio-bg border-b studio-border flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Disc className="mx-auto mb-4" size={48} />
          <p>DJ mode uses the bottom panel for mixing controls</p>
        </div>
      </div>
    );
  }

  if (mode === 'video') {
    return (
      <div className="flex-1 studio-bg border-b studio-border flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Film className="mx-auto mb-4" size={48} />
          <p>Video timeline coming soon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 studio-bg border-b studio-border" ref={timelineRef}>
      {/* Timeline Ruler */}
      <div className="h-8 studio-panel border-b studio-border timeline-ruler relative">
        <div className="absolute inset-0 flex items-center">
          {timeMarkers.map((marker, index) => (
            <div
              key={index}
              className="absolute text-xs text-gray-400 font-mono"
              style={{ left: `${marker.position}px` }}
            >
              {marker.label}
            </div>
          ))}
        </div>
        
        {/* Playhead */}
        <div
          className="playhead h-full"
          style={{ left: `${timeToPixels(currentTime)}px` }}
        />
      </div>

      {/* Track Area */}
      <div className="flex-1 flex">
        {/* Track Headers */}
        <div className="w-48 studio-panel border-r studio-border">
          {tracks.map((track, index) => (
            <div key={track.id} className="h-16 border-b studio-border p-2 flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 rounded-full bg-[var(--studio-live)] bg-opacity-20 p-0"
              >
                <Archive className="studio-live text-xs" size={12} />
              </Button>
              
              <div className="flex-1">
                <div className="text-sm font-medium">{track.name}</div>
                <div className="text-xs text-gray-400">{track.type}</div>
              </div>
              
              <Button variant="ghost" size="sm" className="studio-accent hover:text-white p-1">
                <Settings size={14} />
              </Button>
            </div>
          ))}
          
          {/* Add Track Button */}
          <div className="p-2">
            <Button
              onClick={addTrack}
              variant="outline"
              size="sm"
              className="w-full text-xs"
            >
              + Add Track
            </Button>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 relative overflow-x-auto">
          {tracks.map((track, trackIndex) => (
            <div
              key={track.id}
              className="timeline-track"
              onDrop={(e) => handleDrop(e, trackIndex)}
              onDragOver={handleDragOver}
            >
              {track.clips.map((clip) => (
                <div
                  key={clip.id}
                  className={`track-clip absolute bg-[var(--studio-accent)] bg-opacity-30 border border-[var(--studio-accent)] ${
                    selectedClips.includes(clip.id) ? 'selected' : ''
                  }`}
                  style={{
                    left: `${timeToPixels(clip.start)}px`,
                    top: '4px',
                    width: `${timeToPixels(clip.end - clip.start)}px`,
                    height: '56px',
                  }}
                  onClick={() => {
                    setSelectedClips(prev => 
                      prev.includes(clip.id) 
                        ? prev.filter(id => id !== clip.id)
                        : [...prev, clip.id]
                    );
                  }}
                >
                  <div className="waveform-canvas h-full rounded relative overflow-hidden">
                    <WaveformCanvas
                      fileId={clip.fileId}
                      startTime={clip.offset}
                      duration={clip.end - clip.start}
                    />
                    <div className="absolute bottom-1 left-1 text-xs font-medium">
                      Clip {clip.id.split('-')[1]?.slice(-2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
