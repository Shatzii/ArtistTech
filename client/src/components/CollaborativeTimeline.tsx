import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, Square, Users, MousePointer, Edit3, 
  Volume2, Scissors, Copy, Trash2, Lock, Unlock,
  Eye, EyeOff, AlertCircle, Check, X, Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { useCollaboration } from '../hooks/useCollaboration';

interface TimelineTrack {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'midi';
  color: string;
  muted: boolean;
  solo: boolean;
  locked: boolean;
  visible: boolean;
  editedBy?: string;
  clips: TimelineClip[];
}

interface TimelineClip {
  id: string;
  startTime: number;
  duration: number;
  name: string;
  color: string;
  selected: boolean;
  editedBy?: string;
}

interface CollaborativeTimelineProps {
  sessionId: string;
  projectType: 'audio' | 'video';
  userId: string;
  userName: string;
  onTrackEdit?: (trackId: string, changes: any) => void;
  onClipEdit?: (clipId: string, changes: any) => void;
}

export default function CollaborativeTimeline({
  sessionId,
  projectType,
  userId,
  userName,
  onTrackEdit,
  onClipEdit
}: CollaborativeTimelineProps) {
  const [tracks, setTracks] = useState<TimelineTrack[]>([
    {
      id: 'track_1',
      name: 'Lead Vocals',
      type: 'audio',
      color: '#3b82f6',
      muted: false,
      solo: false,
      locked: false,
      visible: true,
      clips: [
        {
          id: 'clip_1',
          startTime: 0,
          duration: 120,
          name: 'Verse 1',
          color: '#3b82f6',
          selected: false
        },
        {
          id: 'clip_2',
          startTime: 150,
          duration: 100,
          name: 'Chorus',
          color: '#3b82f6',
          selected: false
        }
      ]
    },
    {
      id: 'track_2',
      name: 'Instruments',
      type: 'audio',
      color: '#10b981',
      muted: false,
      solo: false,
      locked: false,
      visible: true,
      clips: [
        {
          id: 'clip_3',
          startTime: 0,
          duration: 300,
          name: 'Full Instrumental',
          color: '#10b981',
          selected: false
        }
      ]
    },
    {
      id: 'track_3',
      name: 'Video Layer',
      type: 'video',
      color: '#f59e0b',
      muted: false,
      solo: false,
      locked: false,
      visible: true,
      clips: [
        {
          id: 'clip_4',
          startTime: 0,
          duration: 280,
          name: 'Main Video',
          color: '#f59e0b',
          selected: false
        }
      ]
    }
  ]);

  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [draggedClip, setDraggedClip] = useState<string | null>(null);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  // Collaborative editing integration
  const {
    users,
    sendEdit,
    updateCursor,
    isConnected,
    conflicts
  } = useCollaboration({
    sessionId,
    projectType,
    userId,
    userName,
    onEdit: handleCollaborativeEdit,
    onConflict: handleConflict
  });

  function handleCollaborativeEdit(edit: any) {
    switch (edit.type) {
      case 'track_edit':
        applyTrackEdit(edit);
        break;
      case 'clip_edit':
        applyClipEdit(edit);
        break;
      case 'playhead_update':
        setPlayheadPosition(edit.changes.position);
        break;
      case 'selection_change':
        setSelectedClips(edit.changes.clipIds);
        break;
    }
  }

  function handleConflict(conflict: any) {
    // Handle conflicts by showing notification
    console.log('Conflict detected:', conflict);
  }

  // Track editing functions
  const toggleMute = useCallback((trackId: string) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, muted: !track.muted }
        : track
    ));

    sendEdit('track_edit', {
      trackId,
      property: 'muted',
      value: !tracks.find(t => t.id === trackId)?.muted
    }, trackId);

    onTrackEdit?.(trackId, { muted: !tracks.find(t => t.id === trackId)?.muted });
  }, [tracks, sendEdit, onTrackEdit]);

  const toggleSolo = useCallback((trackId: string) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, solo: !track.solo }
        : { ...track, solo: false } // Only one track can be solo
    ));

    sendEdit('track_edit', {
      trackId,
      property: 'solo',
      value: !tracks.find(t => t.id === trackId)?.solo
    }, trackId);

    onTrackEdit?.(trackId, { solo: !tracks.find(t => t.id === trackId)?.solo });
  }, [tracks, sendEdit, onTrackEdit]);

  const toggleLock = useCallback((trackId: string) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, locked: !track.locked }
        : track
    ));

    sendEdit('track_edit', {
      trackId,
      property: 'locked',
      value: !tracks.find(t => t.id === trackId)?.locked
    }, trackId);
  }, [tracks, sendEdit]);

  // Clip editing functions
  const selectClip = useCallback((clipId: string, addToSelection: boolean = false) => {
    let newSelection: string[];
    
    if (addToSelection) {
      newSelection = selectedClips.includes(clipId)
        ? selectedClips.filter(id => id !== clipId)
        : [...selectedClips, clipId];
    } else {
      newSelection = [clipId];
    }

    setSelectedClips(newSelection);

    sendEdit('selection_change', {
      clipIds: newSelection,
      userId
    });
  }, [selectedClips, sendEdit, userId]);

  const moveClip = useCallback((clipId: string, newStartTime: number) => {
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(clip =>
        clip.id === clipId
          ? { ...clip, startTime: Math.max(0, newStartTime) }
          : clip
      )
    })));

    sendEdit('clip_edit', {
      clipId,
      property: 'startTime',
      value: Math.max(0, newStartTime)
    }, clipId);

    onClipEdit?.(clipId, { startTime: Math.max(0, newStartTime) });
  }, [sendEdit, onClipEdit]);

  const resizeClip = useCallback((clipId: string, newDuration: number) => {
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(clip =>
        clip.id === clipId
          ? { ...clip, duration: Math.max(10, newDuration) }
          : clip
      )
    })));

    sendEdit('clip_edit', {
      clipId,
      property: 'duration',
      value: Math.max(10, newDuration)
    }, clipId);

    onClipEdit?.(clipId, { duration: Math.max(10, newDuration) });
  }, [sendEdit, onClipEdit]);

  // Apply collaborative edits from other users
  const applyTrackEdit = useCallback((edit: any) => {
    const { trackId, property, value } = edit.changes;
    
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { 
            ...track, 
            [property]: value,
            editedBy: edit.userId !== userId ? edit.userId : undefined
          }
        : track
    ));

    // Clear editing indicator after 2 seconds
    setTimeout(() => {
      setTracks(prev => prev.map(track => 
        track.id === trackId 
          ? { ...track, editedBy: undefined }
          : track
      ));
    }, 2000);
  }, [userId]);

  const applyClipEdit = useCallback((edit: any) => {
    const { clipId, property, value } = edit.changes;
    
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(clip =>
        clip.id === clipId
          ? { 
              ...clip, 
              [property]: value,
              editedBy: edit.userId !== userId ? edit.userId : undefined
            }
          : clip
      )
    })));

    // Clear editing indicator after 2 seconds
    setTimeout(() => {
      setTracks(prev => prev.map(track => ({
        ...track,
        clips: track.clips.map(clip =>
          clip.id === clipId
            ? { ...clip, editedBy: undefined }
            : clip
        )
      })));
    }, 2000);
  }, [userId]);

  // Playback controls
  const togglePlayback = useCallback(() => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    sendEdit('playback_control', {
      action: newIsPlaying ? 'play' : 'pause',
      position: playheadPosition
    });
  }, [isPlaying, playheadPosition, sendEdit]);

  const updatePlayhead = useCallback((position: number) => {
    setPlayheadPosition(position);
    
    sendEdit('playhead_update', {
      position
    });
  }, [sendEdit]);

  // Mouse interaction handlers
  const handleTimelineMouseMove = useCallback((e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    updateCursor(x, y);
  }, [updateCursor]);

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const timePosition = (x / rect.width) * 300; // Assuming 300 second timeline
    
    updatePlayhead(timePosition);
  }, [updatePlayhead]);

  // Render collaborative user cursors
  const renderUserCursors = () => {
    return users.map(user => (
      <div
        key={user.id}
        className="absolute pointer-events-none z-50"
        style={{
          left: user.cursor.x,
          top: user.cursor.y,
          transform: 'translate(-2px, -2px)'
        }}
      >
        <div 
          className="w-3 h-3 border border-white rounded-full"
          style={{ backgroundColor: user.color }}
        />
        <div 
          className="mt-1 px-1 py-0.5 text-xs text-white rounded whitespace-nowrap"
          style={{ backgroundColor: user.color }}
        >
          {user.name}
        </div>
      </div>
    ));
  };

  // Get user color by ID
  const getUserColor = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.color || '#6b7280';
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
      {/* Timeline Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-xs text-gray-400">
                {isConnected ? `${users.length + 1} users` : 'Reconnecting...'}
              </span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={togglePlayback}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsPlaying(false);
                  updatePlayhead(0);
                }}
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom Control */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Zoom:</span>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                max={4}
                min={0.25}
                step={0.25}
                className="w-20"
              />
            </div>
          </div>

          {/* Conflicts Indicator */}
          {conflicts.length > 0 && (
            <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400 font-bold">
                {conflicts.length} conflicts
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative" style={{ height: '400px' }}>
        {/* Track Headers */}
        <div className="absolute left-0 top-0 w-48 bg-gray-800 border-r border-gray-700 h-full overflow-y-auto">
          {tracks.map((track, index) => (
            <div 
              key={track.id} 
              className={`h-16 border-b border-gray-700 p-2 flex items-center justify-between ${
                track.editedBy ? 'bg-opacity-20' : ''
              }`}
              style={{
                backgroundColor: track.editedBy ? getUserColor(track.editedBy) + '20' : undefined
              }}
            >
              <div className="flex-1">
                <div className="text-sm font-bold text-white truncate">{track.name}</div>
                <div className="text-xs text-gray-400">{track.type}</div>
                {track.editedBy && (
                  <div 
                    className="text-xs font-bold mt-1"
                    style={{ color: getUserColor(track.editedBy) }}
                  >
                    Edited by {users.find(u => u.id === track.editedBy)?.name}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant={track.muted ? "default" : "outline"}
                  onClick={() => toggleMute(track.id)}
                  className="w-6 h-6 p-0"
                  disabled={track.locked}
                >
                  <Volume2 className="w-3 h-3" />
                </Button>
                
                <Button
                  size="sm"
                  variant={track.solo ? "default" : "outline"}
                  onClick={() => toggleSolo(track.id)}
                  className="w-6 h-6 p-0"
                  disabled={track.locked}
                >
                  S
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleLock(track.id)}
                  className="w-6 h-6 p-0"
                >
                  {track.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Area */}
        <div 
          ref={timelineRef}
          className="absolute left-48 top-0 right-0 bottom-0 bg-gray-950 overflow-auto cursor-crosshair"
          onMouseMove={handleTimelineMouseMove}
          onClick={handleTimelineClick}
        >
          {/* Time Ruler */}
          <div className="h-8 bg-gray-800 border-b border-gray-700 relative">
            {Array.from({ length: 31 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-gray-600 flex items-center"
                style={{ left: `${(i * 10 * zoom)}px` }}
              >
                <span className="text-xs text-gray-400 ml-1">{i * 10}s</span>
              </div>
            ))}
          </div>

          {/* Tracks */}
          {tracks.map((track, trackIndex) => (
            <div 
              key={track.id}
              className="h-16 border-b border-gray-700 relative"
              style={{ backgroundColor: track.editedBy ? getUserColor(track.editedBy) + '10' : undefined }}
            >
              {track.clips.map(clip => (
                <div
                  key={clip.id}
                  className={`absolute h-12 top-2 rounded border-2 cursor-move flex items-center px-2 ${
                    selectedClips.includes(clip.id) ? 'border-white' : 'border-gray-600'
                  } ${clip.editedBy ? 'animate-pulse' : ''}`}
                  style={{
                    left: `${clip.startTime * zoom}px`,
                    width: `${clip.duration * zoom}px`,
                    backgroundColor: clip.color + '40',
                    borderColor: clip.editedBy ? getUserColor(clip.editedBy) : undefined
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectClip(clip.id, e.ctrlKey || e.metaKey);
                  }}
                >
                  <span className="text-xs text-white font-bold truncate">
                    {clip.name}
                  </span>
                  
                  {clip.editedBy && (
                    <div 
                      className="absolute -top-4 left-0 text-xs px-1 rounded"
                      style={{ 
                        backgroundColor: getUserColor(clip.editedBy),
                        color: 'white'
                      }}
                    >
                      {users.find(u => u.id === clip.editedBy)?.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Playhead */}
          <div
            ref={playheadRef}
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none"
            style={{ left: `${playheadPosition * zoom}px` }}
          >
            <div className="w-4 h-4 bg-red-500 -ml-2 -mt-1 rotate-45" />
          </div>

          {/* User Cursors */}
          {renderUserCursors()}
        </div>
      </div>
    </div>
  );
}