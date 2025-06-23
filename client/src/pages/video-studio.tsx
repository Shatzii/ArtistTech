import { useState } from 'react';
import { Link } from 'wouter';
import { Play, Pause, SkipBack, SkipForward, Volume2, Camera, Film, Scissors, Palette, Upload, Download, Settings } from 'lucide-react';

export default function VideoStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const videoTools = [
    { name: 'Trim & Cut', icon: Scissors, description: 'Precise video editing' },
    { name: 'Color Grade', icon: Palette, description: 'Professional color correction' },
    { name: 'Effects', icon: Film, description: 'Visual effects library' },
    { name: 'Export', icon: Download, description: 'Multi-format export' },
  ];

  const recentProjects = [
    { name: 'Music Video Edit', duration: '4:32', status: 'Rendering' },
    { name: 'Concert Highlights', duration: '2:15', status: 'Complete' },
    { name: 'Studio Session', duration: '8:45', status: 'In Progress' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-indigo-900 text-white">
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
              <h1 className="text-3xl font-bold">Video Studio</h1>
              <p className="text-white/60">Professional video editing suite</p>
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
          {/* Main Video Editor */}
          <div className="xl:col-span-3 space-y-6">
            {/* Video Preview */}
            <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
              <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-white/60">Drop video files here or click to upload</p>
                  <button className="mt-4 bg-purple-500/20 border border-purple-500/30 px-6 py-3 rounded-lg hover:bg-purple-500/30 transition-colors">
                    <Upload className="w-4 h-4 mr-2 inline" />
                    Select Video
                  </button>
                </div>
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="p-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition-colors">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button className="p-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition-colors">
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  <span>{formatTime(currentTime)}</span>
                  <div className="w-64 h-2 bg-white/20 rounded-full">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-white/60" />
                  <div className="w-16 h-2 bg-white/20 rounded-full">
                    <div className="w-3/4 h-full bg-purple-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold mb-4">Timeline</h3>
              <div className="space-y-2">
                <div className="h-8 bg-purple-500/20 rounded border border-purple-500/30 flex items-center px-3">
                  <Film className="w-4 h-4 mr-2 text-purple-400" />
                  <span className="text-sm">Video Track 1</span>
                </div>
                <div className="h-8 bg-blue-500/20 rounded border border-blue-500/30 flex items-center px-3">
                  <Volume2 className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-sm">Audio Track 1</span>
                </div>
                <div className="h-8 bg-green-500/20 rounded border border-green-500/30 flex items-center px-3">
                  <Palette className="w-4 h-4 mr-2 text-green-400" />
                  <span className="text-sm">Effects Track</span>
                </div>
              </div>
            </div>

            {/* Video Tools */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {videoTools.map((tool, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-4 border border-purple-500/20 hover:border-purple-400/40 transition-colors cursor-pointer">
                  <tool.icon className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="font-bold text-sm mb-1">{tool.name}</h4>
                  <p className="text-white/60 text-xs">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Projects */}
            <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold mb-4">Recent Projects</h3>
              <div className="space-y-3">
                {recentProjects.map((project, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm">{project.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'Complete' ? 'bg-green-500/20 text-green-400' :
                        project.status === 'Rendering' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">{project.duration}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold mb-4">AI Assistant</h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-500/20 border border-purple-500/30 text-purple-400 py-2 px-3 rounded-lg hover:bg-purple-500/30 transition-colors text-sm">
                  Auto Color Correct
                </button>
                <button className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-400 py-2 px-3 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                  Generate Transitions
                </button>
                <button className="w-full bg-green-500/20 border border-green-500/30 text-green-400 py-2 px-3 rounded-lg hover:bg-green-500/30 transition-colors text-sm">
                  Smart Trim
                </button>
                <button className="w-full bg-orange-500/20 border border-orange-500/30 text-orange-400 py-2 px-3 rounded-lg hover:bg-orange-500/30 transition-colors text-sm">
                  Export Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}