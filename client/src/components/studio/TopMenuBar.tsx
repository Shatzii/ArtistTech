import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Play, Pause, SkipBack, SkipForward, Circle, Grid, GraduationCap, Video, Users } from "lucide-react";
import { Link } from "wouter";
import { useProjects } from "@/hooks/useProjects";
import { AudioEngineType } from "@/hooks/useAudioEngine";

interface TopMenuBarProps {
  currentProjectId: number | null;
  onProjectChange: (id: number | null) => void;
  audioEngine: AudioEngineType;
}

export default function TopMenuBar({ currentProjectId, onProjectChange, audioEngine }: TopMenuBarProps) {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectType, setNewProjectType] = useState<'daw' | 'dj' | 'video'>('daw');
  
  const { projects, createProject } = useProjects();
  const { isPlaying, currentTime, bpm, play, pause, stop, rewind, fastForward, record } = audioEngine;

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      const project = await createProject({
        name: newProjectName,
        type: newProjectType,
        data: getDefaultProjectData(newProjectType),
      });
      
      onProjectChange(project.id);
      setIsNewProjectOpen(false);
      setNewProjectName("");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const getDefaultProjectData = (type: string) => {
    switch (type) {
      case 'daw':
        return {
          bpm: 120,
          tracks: [],
          masterVolume: 1,
          effects: [],
        };
      case 'dj':
        return {
          deckA: { volume: 1, eqHigh: 0.5, eqMid: 0.5, eqLow: 0.5, position: 0 },
          deckB: { volume: 1, eqHigh: 0.5, eqMid: 0.5, eqLow: 0.5, position: 0 },
          crossfader: 0.5,
          masterVolume: 1,
        };
      case 'video':
        return {
          timeline: [],
          resolution: { width: 1920, height: 1080 },
          framerate: 30,
        };
      default:
        return {};
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="studio-panel border-b studio-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Music className="studio-accent text-xl" />
          <span className="font-bold text-lg">ProStudio</span>
        </div>
        
        <nav className="flex space-x-1">
          <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm hover:bg-opacity-20 hover:bg-[var(--studio-accent)]">
                File
              </Button>
            </DialogTrigger>
            <DialogContent className="studio-panel">
              <DialogHeader>
                <DialogTitle>New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
                <Select value={newProjectType} onValueChange={(value: 'daw' | 'dj' | 'video') => setNewProjectType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daw">DAW Project</SelectItem>
                    <SelectItem value="dj">DJ Set</SelectItem>
                    <SelectItem value="video">Video Project</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateProject} className="w-full">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Link href="/mpc">
            <Button variant="ghost" size="sm" className="text-sm hover:bg-opacity-20 hover:bg-[var(--studio-accent)]">
              <Grid size={14} className="mr-1" />
              MPC Beats
            </Button>
          </Link>
          
          <Link href="/lesson">
            <Button variant="ghost" size="sm" className="text-sm hover:bg-opacity-20 hover:bg-[var(--studio-accent)]">
              <Video size={14} className="mr-1" />
              Lessons
            </Button>
          </Link>
          
          <Link href="/curriculum">
            <Button variant="ghost" size="sm" className="text-sm hover:bg-opacity-20 hover:bg-[var(--studio-accent)]">
              <GraduationCap size={14} className="mr-1" />
              Curriculum
            </Button>
          </Link>
          
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-sm hover:bg-opacity-20 hover:bg-[var(--studio-accent)]">
              <Users size={14} className="mr-1" />
              Login
            </Button>
          </Link>
          
          <Button variant="ghost" size="sm" className="text-sm hover:bg-opacity-20 hover:bg-[var(--studio-accent)]">
            Help
          </Button>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 studio-bg px-3 py-1 rounded">
          <Button
            variant="ghost"
            size="sm"
            onClick={rewind}
            className="studio-accent hover:text-white p-1"
          >
            <SkipBack size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={isPlaying ? pause : play}
            className="studio-accent hover:text-white p-1 text-lg"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={fastForward}
            className="studio-accent hover:text-white p-1"
          >
            <SkipForward size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={record}
            className="studio-live hover:text-white p-1"
          >
            <Circle size={16} />
          </Button>
        </div>
        
        <div className="text-sm font-mono studio-bg px-2 py-1 rounded">
          {formatTime(currentTime)}
        </div>
        
        <div className="text-sm studio-bg px-2 py-1 rounded">
          {Math.round(bpm)} BPM
        </div>
      </div>
    </div>
  );
}
