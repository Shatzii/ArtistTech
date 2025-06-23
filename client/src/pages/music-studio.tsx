import { useState } from 'react';
import { Link } from 'wouter';
import { Play, Pause, Volume2, Music, Mic, Headphones, Settings, Upload, Save, Share } from 'lucide-react';

export default function MusicStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(75);

  const tracks = [
    { name: 'Kick', color: 'bg-red-500', volume: 80, muted: false, solo: false },
    { name: 'Snare', color: 'bg-blue-500', volume: 70, muted: false, solo: false },
    { name: 'Hi-Hat', color: 'bg-green-500', volume: 60, muted: false, solo: false },
    { name: 'Bass', color: 'bg-purple-500', volume: 85, muted: false, solo: false },
    { name: 'Lead', color: 'bg-yellow-500', volume: 65, muted: false, solo: false },
    { name: 'Vocals', color: 'bg-pink-500', volume: 75, muted: false, solo: false },
  ];

  const recentProjects = [
    { name: 'Summer Vibes', bpm: 128, duration: '3:42', status: 'Recording' },
    { name: 'Deep House Mix', bpm: 124, duration: '5:18', status: 'Mixing' },
    { name: 'Pop Ballad', bpm: 80, duration: '4:05', status: 'Complete' },
  ];

  const instruments = [
    { name: 'Piano', icon: Music, active: true },
    { name: 'Guitar', icon: Music, active: false },
    { name: 'Drums', icon: Music, active: true },
    { name: 'Bass', icon: Music, active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/40 to-cyan-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/artist-tech-logo.jpeg" 
              alt="Artist Tech" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">Music Studio</h1>
              <p className="text-white/60">Professional audio production suite</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <button className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Studio */}
          <div className="xl:col-span-3 space-y-6">
            {/* Transport Controls */}
            <div className="bg-black/30 rounded-lg p-6 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-4 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors">
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                  </button>
                  <button className="p-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                    <div className="w-4 h-4 bg-white rounded" />
                  </button>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-mono">00:00</div>
                    <div className="text-xs text-white/60">Position</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mono">128</div>
                    <div className="text-xs text-white/60">BPM</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-5 h-5" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm w-8">{volume}</span>
                  </div>
                </div>
              </div>

              {/* Waveform Display */}
              <div className="h-32 bg-black/50 rounded-lg border border-cyan-500/20 flex items-center justify-center">
                <div className="text-center">
                  <Music className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                  <p className="text-white/60">Audio waveform will appear here</p>
                </div>
              </div>
            </div>

            {/* Mixer */}
            <div className="bg-black/30 rounded-lg p-6 border border-cyan-500/20">
              <h3 className="text-lg font-bold mb-4">Mixer</h3>
              <div className="grid grid-cols-6 gap-4">
                {tracks.map((track, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <div className="text-center mb-4">
                      <h4 className="font-bold text-sm mb-2">{track.name}</h4>
                      <div className={`w-full h-2 ${track.color} rounded mb-2`} />
                    </div>
                    
                    {/* Volume Fader */}
                    <div className="flex flex-col items-center space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={track.volume}
                        className="w-20 transform -rotate-90"
                        style={{ height: '80px' }}
                      />
                      <div className="text-xs">{track.volume}</div>
                    </div>

                    {/* Track Controls */}
                    <div className="space-y-2 mt-4">
                      <button className="w-full bg-red-500/20 border border-red-500/30 py-1 px-2 rounded text-xs hover:bg-red-500/30 transition-colors">
                        M
                      </button>
                      <button className="w-full bg-yellow-500/20 border border-yellow-500/30 py-1 px-2 rounded text-xs hover:bg-yellow-500/30 transition-colors">
                        S
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instruments */}
            <div className="bg-black/30 rounded-lg p-6 border border-cyan-500/20">
              <h3 className="text-lg font-bold mb-4">Virtual Instruments</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {instruments.map((instrument, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-lg border transition-colors ${
                      instrument.active
                        ? 'bg-cyan-500/20 border-cyan-400/40'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <instrument.icon className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                    <p className="text-sm font-bold">{instrument.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Projects */}
            <div className="bg-black/30 rounded-lg p-6 border border-cyan-500/20">
              <h3 className="text-lg font-bold mb-4">Recent Projects</h3>
              <div className="space-y-3">
                {recentProjects.map((project, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm">{project.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'Complete' ? 'bg-green-500/20 text-green-400' :
                        project.status === 'Recording' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>{project.bpm} BPM</span>
                      <span>{project.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Library */}
            <div className="bg-black/30 rounded-lg p-6 border border-cyan-500/20">
              <h3 className="text-lg font-bold mb-4">Audio Library</h3>
              <div className="space-y-3">
                <button className="w-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 py-2 px-3 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm">
                  <Upload className="w-4 h-4 mr-2 inline" />
                  Import Audio
                </button>
                <div className="space-y-2">
                  <div className="p-2 bg-white/5 rounded border border-white/10 text-xs">
                    Kick_128.wav
                  </div>
                  <div className="p-2 bg-white/5 rounded border border-white/10 text-xs">
                    Snare_Acoustic.wav
                  </div>
                  <div className="p-2 bg-white/5 rounded border border-white/10 text-xs">
                    Bass_Synth.wav
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-black/30 rounded-lg p-6 border border-cyan-500/20">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-500/20 border border-green-500/30 text-green-400 py-2 px-3 rounded-lg hover:bg-green-500/30 transition-colors text-sm">
                  <Save className="w-4 h-4 mr-2 inline" />
                  Save Project
                </button>
                <button className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-400 py-2 px-3 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                  <Share className="w-4 h-4 mr-2 inline" />
                  Export Track
                </button>
                <button className="w-full bg-purple-500/20 border border-purple-500/30 text-purple-400 py-2 px-3 rounded-lg hover:bg-purple-500/30 transition-colors text-sm">
                  <Headphones className="w-4 h-4 mr-2 inline" />
                  Master
                </button>
                <button className="w-full bg-orange-500/20 border border-orange-500/30 text-orange-400 py-2 px-3 rounded-lg hover:bg-orange-500/30 transition-colors text-sm">
                  <Settings className="w-4 h-4 mr-2 inline" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}