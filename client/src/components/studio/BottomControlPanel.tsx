import { useState } from "react";
import { StudioMode } from "@/pages/studio";
import { AudioEngineType } from "@/hooks/useAudioEngine";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import WaveformCanvas from "./WaveformCanvas";
import Knob from "./Knob";
import Fader from "./Fader";

interface BottomControlPanelProps {
  mode: StudioMode;
  audioEngine: AudioEngineType;
}

interface DeckState {
  fileId?: number;
  fileName?: string;
  bpm?: number;
  position: number;
  volume: number;
  eqHigh: number;
  eqMid: number;
  eqLow: number;
  gain: number;
}

export default function BottomControlPanel({ mode, audioEngine }: BottomControlPanelProps) {
  const [deckA, setDeckA] = useState<DeckState>({
    position: 0,
    volume: 0.8,
    eqHigh: 0.5,
    eqMid: 0.5,
    eqLow: 0.5,
    gain: 0.5,
  });

  const [deckB, setDeckB] = useState<DeckState>({
    position: 0,
    volume: 0.6,
    eqHigh: 0.5,
    eqMid: 0.5,
    eqLow: 0.5,
    gain: 0.5,
  });

  const [crossfader, setCrossfader] = useState(0.5);
  const [masterVolume, setMasterVolume] = useState(0.8);

  const handleDrop = (event: React.DragEvent, deck: 'A' | 'B') => {
    event.preventDefault();
    
    try {
      const data = JSON.parse(event.dataTransfer.getData("application/json"));
      
      if (data.type === "audio-file") {
        const deckState = {
          fileId: data.fileId,
          fileName: data.fileName,
          bpm: 128, // TODO: Detect BPM from audio file
          position: 0,
          volume: deck === 'A' ? deckA.volume : deckB.volume,
          eqHigh: 0.5,
          eqMid: 0.5,
          eqLow: 0.5,
          gain: 0.5,
        };

        if (deck === 'A') {
          setDeckA(deckState);
        } else {
          setDeckB(deckState);
        }
      }
    } catch (error) {
      console.error("Failed to handle deck drop:", error);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleSync = () => {
    if (deckA.bpm && deckB.bpm) {
      // TODO: Implement beat matching logic
      console.log("Syncing decks...");
    }
  };

  if (mode !== 'dj') {
    return (
      <div className="h-80 studio-panel border-t studio-border flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>Switch to DJ mode to access mixing controls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 studio-panel border-t studio-border flex">
      {/* DJ Deck A */}
      <div
        className="flex-1 p-4 border-r studio-border"
        onDrop={(e) => handleDrop(e, 'A')}
        onDragOver={handleDragOver}
      >
        <div className="text-sm font-semibold mb-3 studio-accent">DECK A</div>
        
        {/* Deck Display */}
        <div className="studio-bg rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 truncate">
              {deckA.fileName || "Drop a track here"}
            </span>
            <span className="text-xs font-mono">
              {deckA.bpm ? `${deckA.bpm.toFixed(1)} BPM` : "--.- BPM"}
            </span>
          </div>
          
          {/* Waveform Display */}
          <div className="h-16 studio-bg rounded border spectrum-analyzer relative">
            {deckA.fileId ? (
              <WaveformCanvas
                fileId={deckA.fileId}
                startTime={0}
                duration={30}
                showPlayhead
                playheadPosition={deckA.position}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Drop audio file here
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-px h-full bg-[var(--studio-accent)] opacity-75"></div>
            </div>
          </div>
        </div>

        {/* Deck Controls */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Knob
              value={deckA.gain}
              onChange={(value) => setDeckA(prev => ({ ...prev, gain: value }))}
              size={64}
              className="mx-auto mb-2"
            />
            <span className="text-xs text-gray-400">GAIN</span>
          </div>
          
          <div className="text-center">
            <Knob
              value={deckA.eqHigh}
              onChange={(value) => setDeckA(prev => ({ ...prev, eqHigh: value }))}
              size={64}
              className="mx-auto mb-2"
            />
            <span className="text-xs text-gray-400">EQ HIGH</span>
          </div>
          
          <div className="text-center">
            <Knob
              value={deckA.eqMid}
              onChange={(value) => setDeckA(prev => ({ ...prev, eqMid: value }))}
              size={64}
              className="mx-auto mb-2"
            />
            <span className="text-xs text-gray-400">EQ MID</span>
          </div>
        </div>
      </div>

      {/* Center Mixer */}
      <div className="w-48 p-4 studio-bg">
        <div className="text-sm font-semibold mb-3 text-center studio-accent">MIXER</div>
        
        {/* Crossfader */}
        <div className="mb-6">
          <div className="text-xs text-gray-400 text-center mb-2">CROSSFADER</div>
          <div className="relative h-2 studio-panel rounded-full cursor-pointer">
            <Slider
              value={[crossfader]}
              onValueChange={([value]) => setCrossfader(value)}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>A</span>
            <span>B</span>
          </div>
        </div>

        {/* Channel Faders */}
        <div className="flex justify-center space-x-6">
          <div className="text-center">
            <Fader
              value={deckA.volume}
              onChange={(value) => setDeckA(prev => ({ ...prev, volume: value }))}
              height={128}
              className="mb-2"
            />
            <span className="text-xs text-gray-400">A</span>
          </div>
          
          <div className="text-center">
            <Fader
              value={deckB.volume}
              onChange={(value) => setDeckB(prev => ({ ...prev, volume: value }))}
              height={128}
              className="mb-2"
            />
            <span className="text-xs text-gray-400">B</span>
          </div>
        </div>

        {/* BPM Sync */}
        <div className="mt-4 text-center">
          <Button
            onClick={handleSync}
            className="bg-[var(--studio-accent)] bg-opacity-20 text-[var(--studio-accent)] px-4 py-2 font-medium text-sm hover:bg-opacity-30"
          >
            SYNC
          </Button>
        </div>
      </div>

      {/* DJ Deck B */}
      <div
        className="flex-1 p-4 border-l studio-border"
        onDrop={(e) => handleDrop(e, 'B')}
        onDragOver={handleDragOver}
      >
        <div className="text-sm font-semibold mb-3 studio-accent">DECK B</div>
        
        {/* Deck Display */}
        <div className="studio-bg rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 truncate">
              {deckB.fileName || "Drop a track here"}
            </span>
            <span className="text-xs font-mono">
              {deckB.bpm ? `${deckB.bpm.toFixed(1)} BPM` : "--.- BPM"}
            </span>
          </div>
          
          {/* Waveform Display */}
          <div className="h-16 studio-bg rounded border spectrum-analyzer relative">
            {deckB.fileId ? (
              <WaveformCanvas
                fileId={deckB.fileId}
                startTime={0}
                duration={30}
                showPlayhead
                playheadPosition={deckB.position}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Drop audio file here
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-px h-full bg-[var(--studio-accent)] opacity-75"></div>
            </div>
          </div>
        </div>

        {/* Deck Controls */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Knob
              value={deckB.gain}
              onChange={(value) => setDeckB(prev => ({ ...prev, gain: value }))}
              size={64}
              className="mx-auto mb-2"
            />
            <span className="text-xs text-gray-400">GAIN</span>
          </div>
          
          <div className="text-center">
            <Knob
              value={deckB.eqHigh}
              onChange={(value) => setDeckB(prev => ({ ...prev, eqHigh: value }))}
              size={64}
              className="mx-auto mb-2"
            />
            <span className="text-xs text-gray-400">EQ HIGH</span>
          </div>
          
          <div className="text-center">
            <Knob
              value={deckB.eqMid}
              onChange={(value) => setDeckB(prev => ({ ...prev, eqMid: value }))}
              size={64}
              className="mx-auto mb-2"
            />
            <span className="text-xs text-gray-400">EQ MID</span>
          </div>
        </div>
      </div>
    </div>
  );
}
