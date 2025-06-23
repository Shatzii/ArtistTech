import { useState } from 'react';
import { Link } from 'wouter';
import { Users, DollarSign, BarChart3, Settings, Music, Video, Palette, Crown, Shield, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [activeUsers, setActiveUsers] = useState(1247);
  const [totalRevenue, setTotalRevenue] = useState(48750);
  const [monthlyGrowth, setMonthlyGrowth] = useState(23.5);

  const quickActions = [
    { name: 'DJ Studio', path: '/dj', icon: Music, description: 'Full DJ suite with voting system', color: 'from-purple-500 to-blue-500' },
    { name: 'Video Studio', path: '/video', icon: Video, description: 'Professional video editing', color: 'from-green-500 to-teal-500' },
    { name: 'Visual Arts', path: '/visual', icon: Palette, description: 'Image creation and editing', color: 'from-pink-500 to-rose-500' },
    { name: 'User Management', path: '/users', icon: Users, description: 'Manage platform users', color: 'from-orange-500 to-red-500' },
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
                <h1 className="text-2xl font-bold">Artist Tech Admin</h1>
                <p className="text-white/60">Full platform control center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
        {/* Platform Statistics */}
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

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions - Full Platform Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.path}>
                <div className={`bg-gradient-to-br ${action.color} p-6 rounded-lg hover:scale-105 transition-all cursor-pointer group`}>
                  <action.icon className="w-8 h-8 text-white mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold text-white mb-2">{action.name}</h3>
                  <p className="text-white/80 text-sm">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real-time Activity Feed */}
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

          {/* Admin Controls */}
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