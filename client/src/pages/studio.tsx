import { useState, useEffect } from "react";
import TopMenuBar from "@/components/studio/TopMenuBar";
import LeftSidebar from "@/components/studio/LeftSidebar";
import MainTimeline from "@/components/studio/MainTimeline";
import BottomControlPanel from "@/components/studio/BottomControlPanel";
import RightSidebar from "@/components/studio/RightSidebar";
import AudioEngine from "@/components/studio/AudioEngine";
import { useAudioEngine } from "@/hooks/useAudioEngine";

export type StudioMode = 'daw' | 'dj' | 'video';

export default function Studio() {
  const [mode, setMode] = useState<StudioMode>('daw');
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const audioEngine = useAudioEngine();

  useEffect(() => {
    document.title = "ProStudio - Music, DJ & Video Production Suite";
  }, []);

  return (
    <div className="h-screen flex flex-col studio-bg text-gray-200 font-sans overflow-hidden">
      <AudioEngine />
      
      <TopMenuBar 
        currentProjectId={currentProjectId}
        onProjectChange={setCurrentProjectId}
        audioEngine={audioEngine}
      />
      
      <div className="flex-1 flex">
        <LeftSidebar 
          mode={mode}
          onModeChange={setMode}
        />
        
        <div className="flex-1 flex flex-col">
          <MainTimeline 
            mode={mode}
            projectId={currentProjectId}
            audioEngine={audioEngine}
          />
          
          <BottomControlPanel 
            mode={mode}
            audioEngine={audioEngine}
          />
        </div>
        
        <RightSidebar 
          mode={mode}
          projectId={currentProjectId}
          audioEngine={audioEngine}
        />
      </div>
    </div>
  );
}
