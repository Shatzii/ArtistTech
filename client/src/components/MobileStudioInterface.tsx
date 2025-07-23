import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Play, Pause, Square, Mic, Volume2, Settings,
  Smartphone, Wifi, Battery, Activity, Zap,
  Users, Share2, Download, Save
} from 'lucide-react';

interface MobileStudioInterfaceProps {
  isPlaying: boolean;
  isRecording: boolean;
  volume: number;
  onPlay: () => void;
  onRecord: () => void;
  onVolumeChange: (value: number) => void;
  onSave: () => void;
  performance?: {
    fps: number;
    latency: number;
    battery: number;
  };
}

export default function MobileStudioInterface({
  isPlaying,
  isRecording,
  volume,
  onPlay,
  onRecord,
  onVolumeChange,
  onSave,
  performance = { fps: 60, latency: 20, battery: 85 }
}: MobileStudioInterfaceProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-700 p-4 z-50">
      {/* Mobile Status Bar */}
      <div className="flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <Badge variant="outline" className="border-green-500 text-green-400">
            <Wifi className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3 text-green-400" />
            <span className="text-slate-400">{performance.fps}fps</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-slate-400">{performance.latency}ms</span>
          </div>
          <div className="flex items-center space-x-1">
            <Battery className="w-3 h-3 text-green-400" />
            <span className="text-slate-400">{performance.battery}%</span>
          </div>
        </div>
      </div>

      {/* Main Transport Controls - Touch Optimized */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Button
          onClick={onRecord}
          variant={isRecording ? "destructive" : "outline"}
          size="lg"
          className="h-16 flex-col space-y-1"
        >
          <Mic className="w-6 h-6" />
          <span className="text-xs">{isRecording ? 'Stop' : 'Record'}</span>
        </Button>

        <Button
          onClick={onPlay}
          variant="default"
          size="lg"
          className="h-16 flex-col space-y-1 bg-purple-600 hover:bg-purple-700"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          <span className="text-xs">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>

        <Button
          onClick={() => {/* Stop */}}
          variant="outline"
          size="lg"
          className="h-16 flex-col space-y-1"
        >
          <Square className="w-6 h-6" />
          <span className="text-xs">Stop</span>
        </Button>
      </div>

      {/* Volume Control */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">Volume</span>
          </div>
          <span className="text-sm text-slate-400">{volume}%</span>
        </div>
        <Slider
          value={[volume]}
          onValueChange={(values) => onVolumeChange(values[0])}
          max={100}
          step={1}
          className="touch-friendly"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          onClick={onSave}
          variant="outline"
          size="sm"
          className="h-12 flex-col space-y-1"
        >
          <Save className="w-4 h-4" />
          <span className="text-xs">Save</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-12 flex-col space-y-1"
        >
          <Download className="w-4 h-4" />
          <span className="text-xs">Export</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-12 flex-col space-y-1"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-xs">Share</span>
        </Button>

        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="outline"
          size="sm"
          className="h-12 flex-col space-y-1"
        >
          <Settings className="w-4 h-4" />
          <span className="text-xs">Settings</span>
        </Button>
      </div>

      {/* Expandable Settings Panel */}
      {showSettings && (
        <Card className="mt-4 bg-slate-800/90 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Mobile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Touch Haptics</span>
              <input type="checkbox" defaultChecked className="accent-purple-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Low Power Mode</span>
              <input type="checkbox" className="accent-purple-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Offline Sync</span>
              <input type="checkbox" defaultChecked className="accent-purple-500" />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Audio Quality</label>
              <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm">
                <option>High (48kHz)</option>
                <option>Medium (44.1kHz)</option>
                <option>Low (22kHz)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}