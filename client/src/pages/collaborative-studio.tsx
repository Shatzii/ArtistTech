import { useState } from 'react';
import { Link } from 'wouter';
import { Users, Video, Mic, Share2, MessageCircle, Clock, Play, Pause } from 'lucide-react';

export default function CollaborativeStudio() {
  const [isConnected, setIsConnected] = useState(true);
  const [activeParticipants, setActiveParticipants] = useState(3);

  const participants = [
    { name: 'Alex Producer', role: 'Producer', status: 'online', avatar: 'AP' },
    { name: 'Sarah Vocalist', role: 'Vocalist', status: 'recording', avatar: 'SV' },
    { name: 'Mike Drummer', role: 'Drummer', status: 'online', avatar: 'MD' },
  ];

  const chatMessages = [
    { user: 'Alex', message: 'Let\'s try a different tempo on the chorus', time: '2 min ago' },
    { user: 'Sarah', message: 'I have some new vocal ideas', time: '5 min ago' },
    { user: 'Mike', message: 'Ready for the drum recording', time: '8 min ago' },
  ];

  const sharedFiles = [
    { name: 'Main_Track_v3.wav', size: '24.5 MB', type: 'audio', user: 'Alex' },
    { name: 'Vocal_Lead.wav', size: '12.1 MB', type: 'audio', user: 'Sarah' },
    { name: 'Drum_Pattern.mid', size: '2.3 MB', type: 'midi', user: 'Mike' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/40 to-teal-900 text-white">
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
              <h1 className="text-3xl font-bold">Collaborative Studio</h1>
              <p className="text-white/60">Real-time music creation with your team</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <Link href="/admin">
              <button className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Collaboration Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Video Conference */}
            <div className="bg-black/30 rounded-lg p-6 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Live Session</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                {participants.map((participant, index) => (
                  <div key={index} className="aspect-video bg-black/50 rounded-lg border border-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg font-bold">{participant.avatar}</span>
                      </div>
                      <p className="font-bold text-sm">{participant.name}</p>
                      <p className="text-xs text-white/60">{participant.role}</p>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                        participant.status === 'online' ? 'bg-green-500/20 text-green-400' :
                        participant.status === 'recording' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {participant.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Timeline */}
            <div className="bg-black/30 rounded-lg p-6 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Shared Timeline</h3>
                <div className="flex items-center space-x-4">
                  <button className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
                    <Play className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-mono">00:00 / 04:32</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-12 bg-blue-500/20 rounded border border-blue-500/30 flex items-center px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm font-medium">Main Track</span>
                    <span className="text-xs text-white/60">Alex Producer</span>
                  </div>
                </div>
                <div className="h-12 bg-purple-500/20 rounded border border-purple-500/30 flex items-center px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Vocals</span>
                    <span className="text-xs text-white/60">Sarah Vocalist (Recording)</span>
                  </div>
                </div>
                <div className="h-12 bg-orange-500/20 rounded border border-orange-500/30 flex items-center px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <span className="text-sm font-medium">Drums</span>
                    <span className="text-xs text-white/60">Mike Drummer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Collaboration Assistant */}
            <div className="bg-black/30 rounded-lg p-6 border border-green-500/20">
              <h3 className="text-lg font-bold mb-4">AI Assistant Suggestions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-sm font-medium mb-1">Harmony Suggestion</p>
                  <p className="text-xs text-white/70">The AI suggests adding a C major seventh chord at 2:15 to enhance the vocal melody.</p>
                  <div className="flex space-x-2 mt-2">
                    <button className="text-xs bg-green-500/20 px-2 py-1 rounded hover:bg-green-500/30 transition-colors">Apply</button>
                    <button className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">Preview</button>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm font-medium mb-1">Tempo Sync</p>
                  <p className="text-xs text-white/70">Consider adjusting the drum pattern tempo to better match the vocal rhythm.</p>
                  <div className="flex space-x-2 mt-2">
                    <button className="text-xs bg-blue-500/20 px-2 py-1 rounded hover:bg-blue-500/30 transition-colors">Apply</button>
                    <button className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">Preview</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <div className="bg-black/30 rounded-lg p-6 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Participants</h3>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{activeParticipants}</span>
                </div>
              </div>
              <div className="space-y-3">
                {participants.map((participant, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">{participant.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{participant.name}</p>
                      <p className="text-xs text-white/60">{participant.role}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      participant.status === 'online' ? 'bg-green-500' :
                      participant.status === 'recording' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-black/30 rounded-lg p-6 border border-green-500/20">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Live Chat
              </h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="p-2 bg-white/5 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{msg.user}</span>
                      <span className="text-xs text-white/60">{msg.time}</span>
                    </div>
                    <p className="text-xs text-white/80">{msg.message}</p>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>

            {/* Shared Files */}
            <div className="bg-black/30 rounded-lg p-6 border border-green-500/20">
              <h3 className="text-lg font-bold mb-4">Shared Files</h3>
              <div className="space-y-2">
                {sharedFiles.map((file, index) => (
                  <div key={index} className="p-2 bg-white/5 rounded border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium truncate">{file.name}</span>
                      <span className={`text-xs px-1 py-0.5 rounded ${
                        file.type === 'audio' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {file.type}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>{file.size}</span>
                      <span>{file.user}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}