import React, { useState, useEffect } from 'react';
import { 
  Users, Wifi, Video, Mic, Settings, Activity, Monitor, 
  Play, Pause, Volume2, Share, MessageSquare, Clock,
  GitBranch, Save, Download, Upload, Eye, Edit3,
  Headphones, Music, Camera, Layers, Zap, Crown
} from 'lucide-react';
import CollaborativeEditor from '../components/CollaborativeEditor';
import CollaborativeTimeline from '../components/CollaborativeTimeline';
import { useCollaboration } from '../hooks/useCollaboration';
import StudioNavigation from '../components/studio-navigation';

export default function CollaborativeDemo() {
  const sessionId = `demo_session_${Date.now()}`;
  const [activeDemo, setActiveDemo] = useState('timeline');
  
  const {
    isConnected,
    users,
    cursors,
    conflicts,
    versionHistory
  } = useCollaboration(sessionId, 'demo_user', 'Demo User');

  const [demoUsers] = useState([
    {
      id: '1',
      name: 'Alex Producer',
      role: 'Lead Producer',
      status: 'active',
      avatar: 'AP',
      color: '#3b82f6',
      location: 'Mixing Console',
      lastSeen: Date.now()
    },
    {
      id: '2',
      name: 'Sarah Vocalist',
      role: 'Vocalist',
      status: 'recording',
      avatar: 'SV',
      color: '#10b981',
      location: 'Vocal Booth',
      lastSeen: Date.now() - 5000
    },
    {
      id: '3',
      name: 'Mike Engineer',
      role: 'Sound Engineer',
      status: 'mixing',
      avatar: 'ME',
      color: '#f59e0b',
      location: 'Master Bus',
      lastSeen: Date.now() - 2000
    },
    {
      id: '4',
      name: 'Lisa Songwriter',
      role: 'Songwriter',
      status: 'editing',
      avatar: 'LS',
      color: '#8b5cf6',
      location: 'Lyrics Editor',
      lastSeen: Date.now() - 1000
    }
  ]);

  const [liveActivity] = useState([
    { user: 'Alex Producer', action: 'Adjusted EQ on drums', timestamp: Date.now() - 30000, type: 'audio' },
    { user: 'Sarah Vocalist', action: 'Recorded new vocal take', timestamp: Date.now() - 45000, type: 'recording' },
    { user: 'Mike Engineer', action: 'Applied compression to bass', timestamp: Date.now() - 60000, type: 'effect' },
    { user: 'Lisa Songwriter', action: 'Updated bridge lyrics', timestamp: Date.now() - 90000, type: 'text' }
  ]);

  const [projectStats] = useState({
    totalTracks: 12,
    totalDuration: '3:45',
    lastSaved: Date.now() - 120000,
    version: '2.1.4',
    pendingChanges: 7,
    conflicts: 0
  });

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Volume2 className="w-3 h-3" />;
      case 'recording': return <Mic className="w-3 h-3" />;
      case 'effect': return <Zap className="w-3 h-3" />;
      case 'text': return <Edit3 className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      <StudioNavigation />
      
      {/* Header */}
      <div className="relative z-10 pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              🤝 Real-Time Collaborative Editing Demo
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Experience revolutionary real-time collaboration with multi-user editing, live cursor tracking, 
              conflict resolution, and synchronized creative workflows across all Artist Tech studios.
            </p>
          </div>

          {/* Connection Status */}
          <div className="bg-gray-900/50 backdrop-blur-lg border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Wifi className={`w-5 h-5 ${isConnected ? 'text-green-400 animate-pulse' : 'text-red-400'}`} />
                  <span className={`font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {isConnected ? 'LIVE SYNC ACTIVE' : 'CONNECTING...'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-bold">{demoUsers.length} Collaborators</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">Session: {sessionId.slice(-8)}</div>
            </div>
          </div>

          {/* Demo Navigation */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'timeline', name: 'Timeline Editor', icon: Layers },
                { id: 'editor', name: 'Text Editor', icon: Edit3 },
                { id: 'users', name: 'User Management', icon: Users },
                { id: 'activity', name: 'Live Activity', icon: Activity },
                { id: 'version', name: 'Version Control', icon: GitBranch }
              ].map((demo) => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.id}
                    onClick={() => setActiveDemo(demo.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                      activeDemo === demo.id
                        ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{demo.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Demo Area */}
            <div className="lg:col-span-2">
              {activeDemo === 'timeline' && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                    <Layers className="w-5 h-5 mr-2" />
                    Collaborative Timeline Editor
                  </h3>
                  <CollaborativeTimeline
                    sessionId={sessionId}
                    projectType="audio"
                    userId="demo_user"
                    userName="Demo User"
                    onTrackEdit={(trackId, changes) => {
                      console.log('Track edited:', trackId, changes);
                    }}
                    onClipEdit={(clipId, changes) => {
                      console.log('Clip edited:', clipId, changes);
                    }}
                  />
                </div>
              )}

              {activeDemo === 'editor' && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                    <Edit3 className="w-5 h-5 mr-2" />
                    Real-Time Text Editor
                  </h3>
                  <CollaborativeEditor
                    sessionId={sessionId}
                    projectType="text"
                    onUserJoin={(user) => console.log('User joined:', user)}
                    onUserLeave={(userId) => console.log('User left:', userId)}
                  />
                </div>
              )}

              {activeDemo === 'users' && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Active Collaborators
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {demoUsers.map((user) => (
                      <div key={user.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                              style={{ backgroundColor: user.color }}
                            >
                              {user.avatar}
                            </div>
                            <div>
                              <div className="font-bold">{user.name}</div>
                              <div className="text-sm text-gray-400">{user.role}</div>
                            </div>
                          </div>
                          {user.role === 'Lead Producer' && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Status</span>
                            <span className={`font-bold ${
                              user.status === 'active' ? 'text-green-400' :
                              user.status === 'recording' ? 'text-red-400' :
                              user.status === 'mixing' ? 'text-blue-400' :
                              'text-yellow-400'
                            }`}>
                              {user.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Location</span>
                            <span className="text-white">{user.location}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Last Seen</span>
                            <span className="text-gray-300">{formatTimeAgo(user.lastSeen)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeDemo === 'activity' && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Live Activity Feed
                  </h3>
                  <div className="space-y-3">
                    {liveActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
                        <div className="bg-gray-700 p-2 rounded-lg">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-sm">{activity.user}</div>
                              <div className="text-gray-300 text-sm">{activity.action}</div>
                            </div>
                            <div className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeDemo === 'version' && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                    <GitBranch className="w-5 h-5 mr-2" />
                    Version Control & Branching
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="font-bold text-cyan-400 mb-3">Current Project Status</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400">Version</div>
                          <div className="font-bold">{projectStats.version}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Total Tracks</div>
                          <div className="font-bold">{projectStats.totalTracks}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Duration</div>
                          <div className="font-bold">{projectStats.totalDuration}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Pending Changes</div>
                          <div className="font-bold text-yellow-400">{projectStats.pendingChanges}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="font-bold text-purple-400 mb-3">Active Branches</h4>
                      <div className="space-y-2">
                        {['main', 'vocal-experiment', 'beat-variation', 'mix-master'].map((branch, index) => (
                          <div key={branch} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                            <div className="flex items-center space-x-2">
                              <GitBranch className="w-4 h-4 text-purple-400" />
                              <span className={`font-bold ${index === 0 ? 'text-green-400' : 'text-gray-300'}`}>
                                {branch}
                              </span>
                              {index === 0 && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">ACTIVE</span>}
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/30 transition-colors">
                                View
                              </button>
                              {index !== 0 && (
                                <button className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded hover:bg-green-500/30 transition-colors">
                                  Merge
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Session Info */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-yellow-400 mb-3 flex items-center">
                  <Monitor className="w-4 h-4 mr-2" />
                  Session Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Session ID</span>
                    <span className="text-white font-mono">{sessionId.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">12:34</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Data Sync</span>
                    <span className="text-green-400">Real-time</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Conflicts</span>
                    <span className="text-green-400">0</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-cyan-400 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded transition-colors text-sm">
                    <Share className="w-4 h-4 mr-2 inline" />
                    Share Session
                  </button>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded transition-colors text-sm">
                    <Video className="w-4 h-4 mr-2 inline" />
                    Start Video Call
                  </button>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-3 rounded transition-colors text-sm">
                    <Save className="w-4 h-4 mr-2 inline" />
                    Save Checkpoint
                  </button>
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded transition-colors text-sm">
                    <Download className="w-4 h-4 mr-2 inline" />
                    Export Project
                  </button>
                </div>
              </div>

              {/* Live Statistics */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-orange-400 mb-3">Live Statistics</h4>
                <div className="space-y-3">
                  <div className="bg-gray-800/50 rounded p-2">
                    <div className="text-xs text-gray-400">Active Edits/Min</div>
                    <div className="text-lg font-bold text-green-400">23</div>
                  </div>
                  <div className="bg-gray-800/50 rounded p-2">
                    <div className="text-xs text-gray-400">Sync Latency</div>
                    <div className="text-lg font-bold text-blue-400">15ms</div>
                  </div>
                  <div className="bg-gray-800/50 rounded p-2">
                    <div className="text-xs text-gray-400">Data Transferred</div>
                    <div className="text-lg font-bold text-purple-400">2.3MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}