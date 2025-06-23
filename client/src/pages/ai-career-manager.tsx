import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Brain, TrendingUp, DollarSign, Users, Star, Crown, Target, Zap,
  BarChart3, PieChart, LineChart, Calendar, Clock, Mail, Phone,
  Instagram, Twitter, Youtube, Music, Mic, Camera, Palette, Film,
  Globe, Shield, Award, Briefcase, CreditCard, Building, Handshake,
  Bell, Settings, Download, Upload, Share2, Eye, Heart, MessageCircle
} from 'lucide-react';

export default function AICareerManager() {
  // AI CAREER MANAGEMENT STATE
  const [artistProfile, setArtistProfile] = useState({
    name: 'Alex Martinez',
    genre: 'Electronic/Pop',
    stage: 'Rising Artist',
    totalFollowers: 47832,
    monthlyListeners: 23456,
    totalRevenue: 15678,
    marketValue: 125000,
    careerScore: 78,
    nextMilestone: 'Hit 50K followers',
    aiAgentStatus: 'Active'
  });

  // AI AGENTS MANAGING CAREER
  const [aiAgents, setAiAgents] = useState([
    {
      name: 'Marketing Maven AI',
      role: 'Social Media & Brand Manager',
      status: 'Active',
      tasks: ['Instagram content scheduling', 'TikTok trend analysis', 'Brand partnership outreach'],
      performance: 92,
      revenue: 3240,
      color: '#ff6b6b'
    },
    {
      name: 'Revenue Maximizer AI',
      role: 'Monetization Specialist',
      status: 'Active',
      tasks: ['Royalty optimization', 'Streaming strategy', 'Merchandise planning'],
      performance: 88,
      revenue: 5680,
      color: '#4ecdc4'
    },
    {
      name: 'Booking Agent AI',
      role: 'Performance & Events',
      status: 'Active',
      tasks: ['Venue booking', 'Tour planning', 'Festival submissions'],
      performance: 85,
      revenue: 4200,
      color: '#45b7d1'
    },
    {
      name: 'Legal Guardian AI',
      role: 'Contracts & Rights',
      status: 'Active',
      tasks: ['Contract review', 'Copyright protection', 'Publishing deals'],
      performance: 95,
      revenue: 2558,
      color: '#96ceb4'
    }
  ]);

  // REVENUE STREAMS
  const [revenueStreams, setRevenueStreams] = useState([
    { name: 'Streaming Royalties', amount: 5420, growth: 12, percentage: 34.6 },
    { name: 'Live Performances', amount: 4200, growth: 8, percentage: 26.8 },
    { name: 'Merchandise', amount: 2890, growth: 23, percentage: 18.4 },
    { name: 'Brand Partnerships', amount: 1890, growth: 45, percentage: 12.1 },
    { name: 'Sync Licensing', amount: 768, growth: 67, percentage: 4.9 },
    { name: 'NFT Sales', amount: 510, growth: 156, percentage: 3.2 }
  ]);

  // SOCIAL MEDIA PERFORMANCE
  const [socialMetrics, setSocialMetrics] = useState({
    instagram: { followers: 18420, engagement: 4.2, growth: 15 },
    tiktok: { followers: 12890, engagement: 8.7, growth: 34 },
    twitter: { followers: 8950, engagement: 2.1, growth: 8 },
    youtube: { followers: 7572, engagement: 6.3, growth: 22 },
    spotify: { followers: 23456, engagement: 12.4, growth: 18 }
  });

  // AI RECOMMENDATIONS
  const [aiRecommendations, setAiRecommendations] = useState([
    {
      type: 'Marketing',
      priority: 'High',
      title: 'TikTok Viral Opportunity',
      description: 'AI detected a trending sound perfect for your style. Create content in next 6 hours.',
      expectedROI: '2.3x engagement boost',
      timeframe: '6 hours',
      automated: true
    },
    {
      type: 'Revenue',
      priority: 'Medium',
      title: 'Sync Licensing Match',
      description: 'Your track "Midnight Dreams" matches 3 upcoming Netflix shows.',
      expectedROI: '$12,000 potential',
      timeframe: '2 weeks',
      automated: false
    },
    {
      type: 'Booking',
      priority: 'High',
      title: 'Festival Opportunity',
      description: 'Coachella 2026 applications open. AI optimized your submission.',
      expectedROI: '$50,000+ exposure',
      timeframe: '1 week',
      automated: true
    },
    {
      type: 'Legal',
      priority: 'Medium',
      title: 'Copyright Alert',
      description: 'Similar track detected. Preemptive protection filed.',
      expectedROI: 'Rights protected',
      timeframe: 'Completed',
      automated: true
    }
  ]);

  // CAREER MILESTONES
  const [milestones, setMilestones] = useState([
    { title: '50K Total Followers', progress: 95, target: 50000, current: 47832, reward: '$500 bonus' },
    { title: 'First Sync License', progress: 85, target: 1, current: 0, reward: 'Industry recognition' },
    { title: '$20K Monthly Revenue', progress: 78, target: 20000, current: 15678, reward: 'Pro tier unlock' },
    { title: 'Major Label Interest', progress: 45, target: 100, current: 45, reward: 'Recording deal' }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'Medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'Low': return 'bg-green-500/20 border-green-500/30 text-green-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Marketing': return Instagram;
      case 'Revenue': return DollarSign;
      case 'Booking': return Calendar;
      case 'Legal': return Shield;
      default: return Brain;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* AI CAREER MANAGER HEADER */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-green-500/30 p-3">
        <div className="flex items-center justify-between max-w-[2000px] mx-auto">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="hover:scale-110 transition-transform">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-10 h-10 rounded-lg object-cover border border-green-500/50"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-green-500">AI CAREER MANAGER</h1>
              <p className="text-gray-400 text-xs">Complete Artist Career Automation • Marketing • Revenue • Bookings</p>
            </div>
            <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded border border-green-500/30">
              <Brain className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-green-400 font-bold">4 AI AGENTS ACTIVE</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded flex items-center space-x-2">
              <Crown className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-bold">Career Score: {artistProfile.careerScore}</span>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 px-3 py-1 rounded">
              <span className="text-yellow-400 font-bold">${artistProfile.totalRevenue.toLocaleString()} Monthly</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[2000px] mx-auto">
        {/* ARTIST OVERVIEW DASHBOARD */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Artist Profile Card */}
          <div className="col-span-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
                {artistProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-xl font-bold">{artistProfile.name}</h2>
                <p className="text-gray-400">{artistProfile.genre}</p>
                <p className="text-green-400 font-bold">{artistProfile.stage}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Followers</span>
                <span className="text-white font-bold">{artistProfile.totalFollowers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Listeners</span>
                <span className="text-white font-bold">{artistProfile.monthlyListeners.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Market Value</span>
                <span className="text-green-400 font-bold">${artistProfile.marketValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Milestone</span>
                <span className="text-yellow-400 font-bold">{artistProfile.nextMilestone}</span>
              </div>
            </div>
          </div>

          {/* Revenue Overview */}
          <div className="col-span-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-green-400">Revenue Streams</h3>
            <div className="space-y-3">
              {revenueStreams.slice(0, 4).map((stream, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">{stream.name}</span>
                      <span className="text-sm font-bold">${stream.amount}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${stream.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className={`ml-3 px-2 py-1 rounded text-xs font-bold ${
                    stream.growth > 20 ? 'bg-green-500/20 text-green-400' : 
                    stream.growth > 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'
                  }`}>
                    +{stream.growth}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Performance */}
          <div className="col-span-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-blue-400">Social Performance</h3>
            <div className="space-y-3">
              {Object.entries(socialMetrics).map(([platform, metrics]) => {
                const Icon = platform === 'instagram' ? Instagram : 
                           platform === 'tiktok' ? Music : 
                           platform === 'twitter' ? Twitter : 
                           platform === 'youtube' ? Youtube : Music;
                
                return (
                  <div key={platform} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-sm font-bold capitalize">{platform}</div>
                        <div className="text-xs text-gray-400">{metrics.followers.toLocaleString()} followers</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{metrics.engagement}%</div>
                      <div className="text-xs text-green-400">+{metrics.growth}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI AGENTS DASHBOARD */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {aiAgents.map((agent, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2" style={{ borderColor: agent.color + '30' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: agent.color + '20', border: `2px solid ${agent.color}30` }}
                  >
                    <Brain className="w-6 h-6" style={{ color: agent.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: agent.color }}>{agent.name}</h3>
                    <p className="text-gray-400 text-sm">{agent.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">Performance: {agent.performance}%</div>
                  <div className="text-sm font-bold" style={{ color: agent.color }}>+${agent.revenue} this month</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-300">Active Tasks:</h4>
                {agent.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }} />
                    <span className="text-sm text-gray-300">{task}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-400">Agent Performance</span>
                  <span className="text-xs font-bold" style={{ color: agent.color }}>{agent.performance}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${agent.performance}%`,
                      background: `linear-gradient(90deg, ${agent.color}80, ${agent.color})`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI RECOMMENDATIONS & MILESTONES */}
        <div className="grid grid-cols-2 gap-6">
          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-yellow-400">AI Recommendations</h3>
            <div className="space-y-4">
              {aiRecommendations.map((rec, index) => {
                const IconComponent = getTypeIcon(rec.type);
                return (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <IconComponent className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{rec.title}</h4>
                          <p className="text-xs text-gray-400">{rec.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                        {rec.automated && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Auto-executing" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{rec.description}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400 font-bold">ROI: {rec.expectedROI}</span>
                      <span className="text-blue-400">Timeline: {rec.timeframe}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Career Milestones */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-purple-400">Career Milestones</h3>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm">{milestone.title}</h4>
                    <span className="text-xs text-purple-400 font-bold">{milestone.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">
                      {milestone.current.toLocaleString()} / {milestone.target.toLocaleString()}
                    </span>
                    <span className="text-yellow-400 font-bold">Reward: {milestone.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}