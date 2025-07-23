import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Play, Pause, Square, Mic, SkipBack, SkipForward,
  Volume2, VolumeX, Headphones, Settings, Zap,
  Activity, Cpu, HardDrive, Wifi, Battery
} from 'lucide-react';

interface TransportControlsProps {
  isPlaying: boolean;
  isRecording: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRecord: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TransportControls({
  isPlaying,
  isRecording,
  onPlay,
  onPause,
  onStop,
  onRecord,
  disabled = false,
  size = 'md'
}: TransportControlsProps) {
  const buttonSize = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'default';
  const iconSize = size === 'lg' ? 'w-8 h-8' : size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size={buttonSize}
        onClick={onRecord}
        disabled={disabled}
        className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
      >
        <Mic className={iconSize} />
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => {/* Previous track */}}
        disabled={disabled}
      >
        <SkipBack className={iconSize} />
      </Button>
      
      <Button
        variant="default"
        size={buttonSize}
        onClick={isPlaying ? onPause : onPlay}
        disabled={disabled}
        className="bg-purple-600 hover:bg-purple-700"
      >
        {isPlaying ? <Pause className={iconSize} /> : <Play className={iconSize} />}
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={onStop}
        disabled={disabled}
      >
        <Square className={iconSize} />
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => {/* Next track */}}
        disabled={disabled}
      >
        <SkipForward className={iconSize} />
      </Button>
    </div>
  );
}

interface VolumeControlProps {
  value: number;
  onChange: (value: number) => void;
  muted?: boolean;
  onMute?: () => void;
  orientation?: 'horizontal' | 'vertical';
}

export function VolumeControl({
  value,
  onChange,
  muted = false,
  onMute,
  orientation = 'horizontal'
}: VolumeControlProps) {
  return (
    <div className={`flex items-center space-x-3 ${orientation === 'vertical' ? 'flex-col space-y-3 space-x-0' : ''}`}>
      {onMute && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMute}
          className="p-2"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      )}
      
      <div className={orientation === 'vertical' ? 'h-24' : 'flex-1 min-w-24'}>
        <Slider
          value={[muted ? 0 : value]}
          onValueChange={(values) => onChange(values[0])}
          max={100}
          step={1}
          orientation={orientation}
          className="accent-purple-500"
        />
      </div>
      
      <span className="text-xs text-slate-400 min-w-8 text-center">
        {muted ? '0%' : `${value}%`}
      </span>
    </div>
  );
}

interface PerformanceMonitorProps {
  metrics: {
    fps: number;
    latency: number;
    memory: number;
    cpu: number;
  };
  compact?: boolean;
}

export function PerformanceMonitor({ metrics, compact = false }: PerformanceMonitorProps) {
  if (compact) {
    return (
      <div className="flex items-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <Activity className="w-3 h-3 text-green-400" />
          <span>{metrics.fps.toFixed(0)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Zap className="w-3 h-3 text-yellow-400" />
          <span>{metrics.latency.toFixed(0)}ms</span>
        </div>
        <div className="flex items-center space-x-1">
          <Cpu className="w-3 h-3 text-blue-400" />
          <span>{metrics.cpu.toFixed(0)}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-400">FPS</span>
          </div>
          <div className="text-lg font-bold text-green-400">{metrics.fps.toFixed(0)}</div>
          <Progress value={metrics.fps / 60 * 100} className="h-1 mt-1" />
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-400">Latency</span>
          </div>
          <div className="text-lg font-bold text-yellow-400">{metrics.latency.toFixed(0)}ms</div>
          <Progress value={Math.max(0, 100 - metrics.latency)} className="h-1 mt-1" />
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <HardDrive className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Memory</span>
          </div>
          <div className="text-lg font-bold text-blue-400">{metrics.memory.toFixed(0)}MB</div>
          <Progress value={metrics.memory / 100 * 100} className="h-1 mt-1" />
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400">CPU</span>
          </div>
          <div className="text-lg font-bold text-purple-400">{metrics.cpu.toFixed(0)}%</div>
          <Progress value={metrics.cpu} className="h-1 mt-1" />
        </CardContent>
      </Card>
    </div>
  );
}

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'connecting' | 'error';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusIndicator({ status, label, size = 'md' }: StatusIndicatorProps) {
  const colors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    connecting: 'bg-yellow-500',
    error: 'bg-red-600'
  };

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`${sizes[size]} ${colors[status]} rounded-full ${status === 'connecting' ? 'animate-pulse' : ''}`} />
      {label && (
        <span className="text-sm text-slate-400 capitalize">{label || status}</span>
      )}
    </div>
  );
}

interface CollaboratorListProps {
  collaborators: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    active: boolean;
  }>;
  isConnected: boolean;
}

export function CollaboratorList({ collaborators, isConnected }: CollaboratorListProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>Collaborators</span>
          <StatusIndicator status={isConnected ? 'online' : 'offline'} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {collaborators.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No active collaborators</p>
        ) : (
          <div className="space-y-2">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{collaborator.avatar}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{collaborator.name}</div>
                    <div className="text-xs text-slate-400">{collaborator.role}</div>
                  </div>
                </div>
                <StatusIndicator
                  status={collaborator.active ? 'online' : 'offline'}
                  size="sm"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface QuickActionsProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onShare: () => void;
  saving?: boolean;
  loading?: boolean;
  exporting?: boolean;
}

export function QuickActions({
  onSave,
  onLoad,
  onExport,
  onShare,
  saving = false,
  loading = false,
  exporting = false
}: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onSave}
        disabled={saving}
        className="flex items-center space-x-2"
      >
        <Settings className="w-4 h-4" />
        <span>{saving ? 'Saving...' : 'Save'}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onLoad}
        disabled={loading}
        className="flex items-center space-x-2"
      >
        <HardDrive className="w-4 h-4" />
        <span>{loading ? 'Loading...' : 'Load'}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        disabled={exporting}
        className="flex items-center space-x-2"
      >
        <Activity className="w-4 h-4" />
        <span>{exporting ? 'Exporting...' : 'Export'}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onShare}
        className="flex items-center space-x-2"
      >
        <Wifi className="w-4 h-4" />
        <span>Share</span>
      </Button>
    </div>
  );
}

interface FeatureListProps {
  features: string[];
  maxDisplay?: number;
}

export function FeatureList({ features, maxDisplay = 6 }: FeatureListProps) {
  const displayFeatures = features.slice(0, maxDisplay);
  const remainingCount = features.length - maxDisplay;

  return (
    <div className="space-y-2">
      {displayFeatures.map((feature, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-slate-300">{feature}</span>
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm text-slate-400">+{remainingCount} more features</span>
        </div>
      )}
    </div>
  );
}