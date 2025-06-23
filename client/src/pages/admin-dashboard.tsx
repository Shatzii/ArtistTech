import { useState } from 'react';
import { Link } from 'wouter';
import { Users, DollarSign, BarChart3, Settings, Music, Video, Palette, Crown, Shield, Activity, UserCheck, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const [activeUsers, setActiveUsers] = useState(1247);
  const [totalRevenue, setTotalRevenue] = useState(48750);
  const [monthlyGrowth, setMonthlyGrowth] = useState(23.5);
  const [viewMode, setViewMode] = useState<'admin' | 'user'>('admin');

  const quickActions = [
    { name: 'DJ Studio', path: '/dj-studio', icon: Music, description: 'Full DJ suite with voting system', color: 'from-purple-500 to-blue-500' },
    { name: 'Video Studio', path: '/video-studio', icon: Video, description: 'Professional video editing', color: 'from-green-500 to-teal-500' },
    { name: 'Visual Arts', path: '/visual-studio', icon: Palette, description: 'Image creation and editing', color: 'from-pink-500 to-rose-500' },
    { name: 'Music Studio', path: '/music-studio', icon: Music, description: 'Audio production suite', color: 'from-blue-500 to-cyan-500' },
    { name: 'Collaborative Studio', path: '/collaborative-studio', icon: Users, description: 'Real-time team creation', color: 'from-green-500 to-emerald-500' },
    { name: 'NFT Marketplace', path: '/nft-marketplace', icon: Activity, description: 'Trade digital music assets', color: 'from-orange-500 to-red-500' },
  ];

  const platformStats = [
    { name: 'Active Users', value: activeUsers.toLocaleString(), change: '+12.3%', icon: Users },
    { name: 'Revenue (30d)', value: `$${totalRevenue.toLocaleString()}`, change: `+${monthlyGrowth}%`, icon: DollarSign },
    { name: 'DJ Sessions', value: '3,842', change: '+18.7%', icon: Music },
    { name: 'Projects Created', value: '12,456', change: '+25.1%', icon: Activity },
  ];

  const recentActivity = [
    { user: 'DJ_Master2024', action: 'Started voting session', revenue: 125, time: '2 min ago' },
    { user: 'VideoCreator_Pro', action: 'Published video project', revenue: 0, time: '5 min ago' },
    { user: 'ClubOwner_NYC', action: 'Upgraded to Premium', revenue: 199, time: '12 min ago' },
    { user: 'Artist_Sarah', action: 'Created NFT collection', revenue: 350, time: '18 min ago' },
    { user: 'DJ_Phoenix', action: 'Accepted song request', revenue: 45, time: '23 min ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  Artist Tech {viewMode === 'admin' ? 'Admin' : 'User View'}
                </h1>
                <p className="text-white/60">
                  {viewMode === 'admin' ? 'Full platform control center' : 'Viewing as regular user'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-black/30 rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => setViewMode('admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'admin' 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-1 inline" />
                  Admin
                </button>
                <button
                  onClick={() => setViewMode('user')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'user' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <UserCheck className="w-4 h-4 mr-1 inline" />
                  User
                </button>
              </div>
              
              <div className="bg-yellow-500/20 border border-yellow-500/30 px-4 py-2 rounded-lg">
                <Crown className="inline w-4 h-4 mr-2 text-yellow-400" />
                <span className="text-yellow-400 font-bold">ADMIN ACCESS</span>
              </div>
              <Link href="/">
                <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  Back to Site
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'admin' ? (
          <>
            {/* Admin View - Platform Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {platformStats.map((stat, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="w-8 h-8 text-purple-400" />
                    <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.name}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* User View - Welcome & Quick Access */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome to Artist Tech
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
                Your complete creative studio with 15 AI-powered engines for music production, video editing, and visual arts.
              </p>
              
              {/* User Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
                <div className="bg-blue-500/20 rounded-lg p-6 border border-blue-500/30">
                  <Music className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">42</div>
                  <div className="text-white/60 text-sm">Projects Created</div>
                </div>
                <div className="bg-cyan-500/20 rounded-lg p-6 border border-cyan-500/30">
                  <Activity className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyan-400">18h</div>
                  <div className="text-white/60 text-sm">Studio Time</div>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-6 border border-purple-500/30">
                  <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">PRO</div>
                  <div className="text-white/60 text-sm">Membership</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {viewMode === 'admin' ? 'Admin Quick Actions - Full Platform Access' : 'Your Creative Studios'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.path}>
                <div className={`bg-gradient-to-br ${action.color} p-6 rounded-lg hover:scale-105 transition-all cursor-pointer group shadow-lg`}>
                  <action.icon className="w-8 h-8 text-white mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold text-white mb-2">{action.name}</h3>
                  <p className="text-white/80 text-sm">{action.description}</p>
                  {viewMode === 'user' && (
                    <div className="mt-3 px-3 py-1 bg-white/20 rounded-full text-xs text-white/90 inline-block">
                      Launch Studio
                    </div>
                  )}
                  {viewMode === 'admin' && (
                    <div className="mt-3 text-xs text-white/60">
                      Admin access enabled
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {viewMode === 'admin' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Admin: Real-time Activity Feed */}
            <div className="bg-black/30 rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Live Platform Activity</h2>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <div className="font-bold text-sm">{activity.user}</div>
                      <div className="text-white/70 text-xs">{activity.action}</div>
                      <div className="text-white/50 text-xs">{activity.time}</div>
                    </div>
                    {activity.revenue > 0 && (
                      <div className="text-green-400 font-bold text-sm">
                        +${activity.revenue}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Admin: Admin Controls */}
            <div className="bg-black/30 rounded-lg p-6 border border-white/20">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-400" />
                Admin Controls
              </h2>
              <div className="space-y-4">
                <button className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-400 py-3 px-4 rounded-lg hover:bg-blue-500/30 transition-colors">
                  View All DJ Voting Sessions
                </button>
                <button className="w-full bg-green-500/20 border border-green-500/30 text-green-400 py-3 px-4 rounded-lg hover:bg-green-500/30 transition-colors">
                  Revenue Analytics Dashboard
                </button>
                <button className="w-full bg-purple-500/20 border border-purple-500/30 text-purple-400 py-3 px-4 rounded-lg hover:bg-purple-500/30 transition-colors">
                  User Management Panel
                </button>
                <button className="w-full bg-orange-500/20 border border-orange-500/30 text-orange-400 py-3 px-4 rounded-lg hover:bg-orange-500/30 transition-colors">
                  Content Moderation
                </button>
                <button className="w-full bg-red-500/20 border border-red-500/30 text-red-400 py-3 px-4 rounded-lg hover:bg-red-500/30 transition-colors">
                  System Settings
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User: Recent Projects */}
            <div className="bg-black/30 rounded-lg p-6 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-cyan-400">Your Recent Projects</h2>
                <Link href="/dj">
                  <button className="text-sm bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-lg hover:bg-cyan-500/30 transition-colors">
                    Create New
                  </button>
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center space-x-3">
                    <Music className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="font-bold text-sm">Summer Mix 2025</div>
                      <div className="text-white/60 text-xs">DJ Project • 2 hours ago</div>
                    </div>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">Open</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center space-x-3">
                    <Video className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="font-bold text-sm">Music Video Edit</div>
                      <div className="text-white/60 text-xs">Video Project • 1 day ago</div>
                    </div>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">Open</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="font-bold text-sm">Album Cover Art</div>
                      <div className="text-white/60 text-xs">Visual Project • 3 days ago</div>
                    </div>
                  </div>
                  <button className="text-green-400 hover:text-green-300 text-sm">Open</button>
                </div>
              </div>
            </div>

            {/* User: AI Assistant */}
            <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold mb-6 text-purple-400">AI Creative Assistant</h2>
              <div className="space-y-4">
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <h3 className="font-bold text-sm mb-2">Today's Suggestions</h3>
                  <ul className="text-white/70 text-sm space-y-2">
                    <li>• Try the new harmonic mixing feature in DJ Studio</li>
                    <li>• Your track "Summer Mix" is trending - create a remix</li>
                    <li>• Complete your profile for better AI recommendations</li>
                  </ul>
                </div>
                <button className="w-full bg-purple-500/20 border border-purple-500/30 text-purple-400 py-3 px-4 rounded-lg hover:bg-purple-500/30 transition-colors">
                  Get Creative Ideas
                </button>
                <button className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-400 py-3 px-4 rounded-lg hover:bg-blue-500/30 transition-colors">
                  Generate Samples
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Platform Health */}
        <div className="mt-8 bg-black/30 rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-bold mb-6">Platform Health & Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-white/60">Uptime</div>
              <div className="text-xs text-green-400">All systems operational</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">47ms</div>
              <div className="text-white/60">Avg Response Time</div>
              <div className="text-xs text-blue-400">Excellent performance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">15</div>
              <div className="text-white/60">AI Engines Active</div>
              <div className="text-xs text-purple-400">All engines running</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}