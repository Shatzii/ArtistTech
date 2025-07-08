import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Brain, TrendingUp, DollarSign, Users, Star, Crown, Target, Zap,
  BarChart3, PieChart, LineChart, Calendar, Clock, Mail, Phone,
  Instagram, Twitter, Youtube, Music, Mic, Camera, Palette, Film,
  Globe, Shield, Award, Briefcase, CreditCard, Building, Handshake,
  Bell, Settings, Download, Upload, Share2, Eye, Heart, MessageCircle,
  Play, CheckCircle, AlertCircle, Activity, RefreshCw
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AICareerManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Real-time data fetching from backend
  const { data: artistProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/career/profile"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: aiAgents, isLoading: agentsLoading } = useQuery({
    queryKey: ["/api/career/agents"],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const { data: revenueStreams, isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/career/revenue-streams"],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: socialMetrics, isLoading: socialLoading } = useQuery({
    queryKey: ["/api/career/social-metrics"],
    refetchInterval: 30000,
  });

  const { data: aiRecommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ["/api/career/recommendations"],
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: ["/api/career/milestones"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Interactive mutations for user actions
  const executeRecommendationMutation = useMutation({
    mutationFn: async ({ recommendationId, action }: { recommendationId: number, action: string }) => {
      const response = await apiRequest('POST', '/api/career/execute-recommendation', {
        recommendationId,
        action
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "AI Action Executed",
        description: data.message,
      });
      // Refresh relevant data
      queryClient.invalidateQueries({ queryKey: ["/api/career/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/career/profile"] });
    },
    onError: () => {
      toast({
        title: "Action Failed",
        description: "Unable to execute AI recommendation",
        variant: "destructive",
      });
    }
  });

  const configureAgentMutation = useMutation({
    mutationFn: async ({ agentId, settings }: { agentId: string, settings: any }) => {
      const response = await apiRequest('POST', '/api/career/configure-agent', {
        agentId,
        settings
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Agent Configured",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/career/agents"] });
    }
  });

  // Loading state
  if (profileLoading || agentsLoading || revenueLoading || socialLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto" />
          <h2 className="text-xl font-bold text-green-400">Loading AI Career Manager...</h2>
          <p className="text-gray-400">Fetching real-time career data</p>
        </div>
      </div>
    );
  }

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
              <span className="text-green-400 font-bold">{aiAgents?.length || 4} AI AGENTS ACTIVE</span>
              <Activity className="w-3 h-3 text-green-400 animate-pulse" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded flex items-center space-x-2">
              <Crown className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-bold">Career Score: {artistProfile?.careerScore || 78}</span>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 px-3 py-1 rounded">
              <span className="text-yellow-400 font-bold">${(artistProfile?.totalRevenue || 15678).toLocaleString()} Monthly</span>
            </div>
            <button 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/career/profile"] });
                queryClient.invalidateQueries({ queryKey: ["/api/career/agents"] });
                toast({ title: "Data Refreshed", description: "Latest career metrics loaded" });
              }}
              className="bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded flex items-center space-x-2 hover:bg-blue-500/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-bold">Refresh</span>
            </button>
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
                <h2 className="text-xl font-bold">{artistProfile?.name || 'Alex Martinez'}</h2>
                <p className="text-gray-400">{artistProfile?.genre || 'Electronic/Pop'}</p>
                <p className="text-green-400 font-bold">{artistProfile?.stage || 'Rising Artist'}</p>
                {artistProfile?.lastUpdated && (
                  <p className="text-xs text-gray-500">Updated: {new Date(artistProfile.lastUpdated).toLocaleTimeString()}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Followers</span>
                <span className="text-white font-bold">{(artistProfile?.totalFollowers || 47832).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Listeners</span>
                <span className="text-white font-bold">{(artistProfile?.monthlyListeners || 23456).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Market Value</span>
                <span className="text-green-400 font-bold">${(artistProfile?.marketValue || 125000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Milestone</span>
                <span className="text-yellow-400 font-bold">{artistProfile?.nextMilestone || 'Hit 50K followers'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">AI Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-bold">{artistProfile?.aiAgentStatus || 'Active'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Overview */}
          <div className="col-span-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-green-400">Revenue Streams</h3>
            <div className="space-y-3">
              {(revenueStreams || []).slice(0, 4).map((stream, index) => (
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
              {Object.entries(socialMetrics || {}).map(([platform, metrics]) => {
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
          {(aiAgents || []).map((agent, index) => (
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
                  {agent.lastActivity && (
                    <div className="text-xs text-gray-400 mt-1">{agent.lastActivity}</div>
                  )}
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
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Active Projects: {agent.activeProjects || 0}</span>
                  <span className="text-gray-400">Completed: {agent.completedTasks || 0}</span>
                </div>
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
                <button
                  onClick={() => configureAgentMutation.mutate({ agentId: agent.id, settings: { optimize: true } })}
                  className="w-full mt-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                  disabled={configureAgentMutation.isPending}
                >
                  {configureAgentMutation.isPending ? 'Optimizing...' : 'Optimize Agent'}
                </button>
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
              {(aiRecommendations || []).map((rec, index) => {
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
              {(milestones || []).map((milestone, index) => (
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
                      {(milestone.current || 0).toLocaleString()} / {(milestone.target || 1).toLocaleString()}
                    </span>
                    <span className="text-yellow-400 font-bold">Reward: {milestone.reward || 'TBD'}</span>
                  </div>
                  {milestone.deadline && (
                    <div className="mt-2 text-xs text-gray-500">
                      Deadline: {new Date(milestone.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}