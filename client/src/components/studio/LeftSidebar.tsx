import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Waves, Disc, Film, Music, Folder, Upload, Keyboard, Drum, Guitar } from "lucide-react";
import { useAudioFiles } from "@/hooks/useAudioFile";
import { StudioMode } from "@/pages/studio";

interface LeftSidebarProps {
  mode: StudioMode;
  onModeChange: (mode: StudioMode) => void;
}

export default function LeftSidebar({ mode, onModeChange }: LeftSidebarProps) {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const { audioFiles, uploadAudioFile } = useAudioFiles();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadFile(file);

    try {
      await uploadAudioFile(file);
      setUploadFile(null);
    } catch (error) {
      console.error("Failed to upload file:", error);
      setUploadFile(null);
    }
  };

  const handleDragStart = (event: React.DragEvent, fileId: number, fileName: string) => {
    event.dataTransfer.setData("application/json", JSON.stringify({
      type: "audio-file",
      fileId,
      fileName,
    }));
  };

  return (
    <div className="w-64 studio-panel border-r studio-border flex flex-col">
      {/* Mode Tabs */}
      <div className="flex border-b studio-border">
        <Button
          variant="ghost"
          className={`flex-1 py-3 text-sm font-medium rounded-none ${
            mode === 'daw' 
              ? 'bg-[var(--studio-accent)] bg-opacity-20 text-[var(--studio-accent)] border-b-2 border-[var(--studio-accent)]'
              : 'hover:bg-[var(--studio-accent)] hover:bg-opacity-10'
          }`}
          onClick={() => onModeChange('daw')}
        >
          <Waves className="mr-2" size={16} />
          DAW
        </Button>
        
        <Button
          variant="ghost"
          className={`flex-1 py-3 text-sm font-medium rounded-none ${
            mode === 'dj'
              ? 'bg-[var(--studio-accent)] bg-opacity-20 text-[var(--studio-accent)] border-b-2 border-[var(--studio-accent)]'
              : 'hover:bg-[var(--studio-accent)] hover:bg-opacity-10'
          }`}
          onClick={() => onModeChange('dj')}
        >
          <Disc className="mr-2" size={16} />
          DJ
        </Button>
        
        <Button
          variant="ghost"
          className={`flex-1 py-3 text-sm font-medium rounded-none ${
            mode === 'video'
              ? 'bg-[var(--studio-accent)] bg-opacity-20 text-[var(--studio-accent)] border-b-2 border-[var(--studio-accent)]'
              : 'hover:bg-[var(--studio-accent)] hover:bg-opacity-10'
          }`}
          onClick={() => onModeChange('video')}
        >
          <Film className="mr-2" size={16} />
          Video
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {/* File Browser */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 studio-accent">BROWSER</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 p-2 hover:bg-[var(--studio-bg)] rounded cursor-pointer">
              <Folder className="text-yellow-500" size={16} />
              <span className="text-sm">Audio Samples</span>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-[var(--studio-bg)] rounded cursor-pointer">
              <Folder className="text-yellow-500" size={16} />
              <span className="text-sm">MIDI Files</span>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-[var(--studio-bg)] rounded cursor-pointer">
              <Folder className="text-yellow-500" size={16} />
              <span className="text-sm">Video Clips</span>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="flex items-center justify-center w-full p-2 border-2 border-dashed studio-border rounded cursor-pointer hover:bg-[var(--studio-bg)]">
              <Upload size={16} className="mr-2" />
              <span className="text-sm">Upload Files</span>
              <input
                type="file"
                className="hidden"
                accept="audio/*,video/*"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Audio Files */}
          <div className="space-y-1">
            {audioFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-2 p-2 hover:bg-[var(--studio-bg)] rounded cursor-pointer ml-4"
                draggable
                onDragStart={(e) => handleDragStart(e, file.id, file.name)}
              >
                <Music className="studio-accent" size={14} />
                <span className="text-xs text-gray-400 truncate">{file.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Virtual Instruments */}
        {mode === 'daw' && (
          <div>
            <h3 className="text-sm font-semibold mb-3 studio-accent">INSTRUMENTS</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 hover:bg-[var(--studio-bg)] rounded cursor-pointer">
                <Keyboard className="text-purple-400" size={16} />
                <span className="text-sm">Piano</span>
              </div>
              <div className="flex items-center space-x-2 p-2 hover:bg-[var(--studio-bg)] rounded cursor-pointer">
                <Drum className="text-orange-400" size={16} />
                <span className="text-sm">Drum Kit</span>
              </div>
              <div className="flex items-center space-x-2 p-2 hover:bg-[var(--studio-bg)] rounded cursor-pointer">
                <Guitar className="text-green-400" size={16} />
                <span className="text-sm">Bass Synth</span>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
