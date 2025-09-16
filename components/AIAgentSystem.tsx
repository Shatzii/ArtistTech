import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bot,
  Brain,
  TrendingUp,
  Target,
  Award,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Zap,
  BookOpen,
  Trophy,
  Star,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  MessageSquare,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { AICareerManager } from './AICareerManager';
import { AIAnalyticsInsights } from './AIAnalyticsInsights';
import { RealTimeAnalyticsDashboard } from './RealTimeAnalyticsDashboard';
import { useWebSocket } from '@/hooks/useWebSocket';

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'learning' | 'analyzing';
  confidence: number;
  lastAction: string;
  nextAction: string;
  performance: number;
}

interface AgentTask {
  id: string;
  type: 'analysis' | 'optimization' | 'content' | 'engagement' | 'monetization';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  assignedAgent: string;
  deadline: Date;
  dependencies: string[];
}

interface AISystemStatus {
  overallHealth: number;
  activeAgents: number;
  pendingTasks: number;
  completedTasks: number;
  systemLoad: number;
  lastUpdate: Date;
}

export const AIAgentSystem: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: 'career-manager',
      name: 'Career Manager AI',
      role: 'Career Strategy & Planning',
      status: 'active',
      confidence: 92,
      lastAction: 'Analyzed career trajectory',
      nextAction: 'Optimize content strategy',
      performance: 88
    },
    {
      id: 'analytics-engine',
      name: 'Analytics Engine',
      role: 'Data Analysis & Insights',
      status: 'active',
      confidence: 95,
      lastAction: 'Generated performance insights',
      nextAction: 'Predict revenue trends',
      performance: 91
    },
    {
      id: 'content-optimizer',
      name: 'Content Optimizer',
      role: 'Content Creation & Optimization',
      status: 'learning',
      confidence: 78,
      lastAction: 'Analyzed content performance',
      nextAction: 'Generate content recommendations',
      performance: 76
    },
    {
      id: 'engagement-booster',
      name: 'Engagement Booster',
      role: 'Audience Engagement & Growth',
      status: 'active',
      confidence: 89,
      lastAction: 'Optimized posting schedule',
      nextAction: 'Analyze audience demographics',
      performance: 84
    },
    {
      id: 'monetization-advisor',
      name: 'Monetization Advisor',
      role: 'Revenue Optimization',
      status: 'analyzing',
      confidence: 85,
      lastAction: 'Reviewed revenue streams',
      nextAction: 'Suggest new monetization methods',
      performance: 82
    }
  ]);

  const [tasks, setTasks] = useState<AgentTask[]>([
    {
      id: 'analyze-performance',
      type: 'analysis',
      title: 'Analyze Performance Metrics',
      description: 'Deep dive into engagement rates and growth patterns',
      priority: 'high',
      status: 'in_progress',
      progress: 75,
      assignedAgent: 'analytics-engine',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      dependencies: []
    },
    {
      id: 'optimize-content',
      type: 'content',
      title: 'Optimize Content Strategy',
      description: 'Improve content quality and posting frequency',
      priority: 'high',
      status: 'pending',
      progress: 0,
      assignedAgent: 'content-optimizer',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      dependencies: ['analyze-performance']
    },
    {
      id: 'boost-engagement',
      type: 'engagement',
      title: 'Boost Audience Engagement',
      description: 'Implement strategies to increase interaction rates',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      assignedAgent: 'engagement-booster',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      dependencies: ['optimize-content']
    },
    {
      id: 'maximize-revenue',
      type: 'monetization',
      title: 'Maximize Revenue Streams',
      description: 'Optimize and diversify monetization channels',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      assignedAgent: 'monetization-advisor',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      dependencies: ['boost-engagement']
    }
  ]);

  const [systemStatus, setSystemStatus] = useState<AISystemStatus>({
    overallHealth: 87,
    activeAgents: 4,
    pendingTasks: 3,
    completedTasks: 12,
    systemLoad: 65,
    lastUpdate: new Date()
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAutoMode, setIsAutoMode] = useState(true);

  // WebSocket connection for real-time updates
  const { isConnected, metrics, alerts, trends } = useWebSocket();

  // Mock data for demonstration
  const mockMetrics = {
    followers: 15420,
    engagement: 7.8,
    revenue: 3240,
    contentQuality: 8.5,
    brandValue: 7.2,
    growthRate: 12.3,
    platformDiversity: 4.2,
    audienceRetention: 68.5
  };

  const mockGoals = [
    {
      id: 'reach-20k-followers',
      title: 'Reach 20K Followers',
      description: 'Grow follower count to 20,000 across all platforms',
      target: 20000,
      current: 15420,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      category: 'growth',
      priority: 'high',
      progress: 77
    },
    {
      id: 'increase-engagement',
      title: 'Increase Engagement Rate',
      description: 'Achieve 10% engagement rate across content',
      target: 10,
      current: 7.8,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      category: 'engagement',
      priority: 'high',
      progress: 78
    },
    {
      id: 'monthly-revenue',
      title: 'Monthly Revenue Goal',
      description: 'Reach $5,000 monthly revenue',
      target: 5000,
      current: 3240,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      category: 'revenue',
      priority: 'medium',
      progress: 65
    }
  ];

  const mockRecommendations = [
    {
      id: 'content-schedule',
      type: 'content',
      title: 'Optimize Posting Schedule',
      description: 'Post during peak engagement hours (2-4 PM EST) for maximum reach',
      impact: 'high',
      effort: 'low',
      timeframe: '1 week',
      actionable: true
    },
    {
      id: 'collaboration-network',
      type: 'networking',
      title: 'Build Collaboration Network',
      description: 'Partner with 3-5 similar-sized creators for cross-promotion',
      impact: 'high',
      effort: 'medium',
      timeframe: '2 weeks',
      actionable: true
    },
    {
      id: 'premium-content',
      type: 'monetization',
      title: 'Launch Premium Content',
      description: 'Create exclusive content for top supporters',
      impact: 'medium',
      effort: 'high',
      timeframe: '1 month',
      actionable: true
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      updateSystemStatus();
      updateAgentActivities();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateSystemStatus = () => {
    setSystemStatus(prev => ({
      ...prev,
      overallHealth: Math.max(80, Math.min(100, prev.overallHealth + (Math.random() - 0.5) * 5)),
      systemLoad: Math.max(20, Math.min(95, prev.systemLoad + (Math.random() - 0.5) * 10)),
      lastUpdate: new Date()
    }));
  };

  const updateAgentActivities = () => {
    setAgents(prev => prev.map(agent => ({
      ...agent,
      confidence: Math.max(70, Math.min(100, agent.confidence + (Math.random() - 0.5) * 3)),
      performance: Math.max(70, Math.min(100, agent.performance + (Math.random() - 0.5) * 2))
    })));

    // Update task progress
    setTasks(prev => prev.map(task => {
      if (task.status === 'in_progress') {
        const newProgress = Math.min(100, task.progress + Math.random() * 5);
        return {
          ...task,
          progress: newProgress,
          status: newProgress >= 100 ? 'completed' : 'in_progress'
        };
      }
      return task;
    }));
  };

  const toggleAutoMode = () => {
    setIsAutoMode(!isAutoMode);
  };

  const refreshSystem = () => {
    updateSystemStatus();
    updateAgentActivities();
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'learning': return 'text-blue-600 bg-blue-100';
      case 'analyzing': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-2xl">
                <Bot className="h-6 w-6 mr-2 text-indigo-600" />
                AI Agent System
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Intelligent career management and optimization
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">System Health</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {systemStatus.overallHealth}%
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isAutoMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleAutoMode}
                >
                  {isAutoMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isAutoMode ? 'Auto' : 'Manual'}
                </Button>
                <Button variant="outline" size="sm" onClick={refreshSystem}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {systemStatus.activeAgents}
              </div>
              <div className="text-sm text-gray-500">Active Agents</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {systemStatus.pendingTasks}
              </div>
              <div className="text-sm text-gray-500">Pending Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {systemStatus.completedTasks}
              </div>
              <div className="text-sm text-gray-500">Completed Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
                {systemStatus.systemLoad}%
              </div>
              <div className="text-sm text-gray-500">System Load</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <AICareerManager
            userId="user-123"
            metrics={mockMetrics}
            goals={mockGoals}
            recommendations={mockRecommendations}
            analyticsData={metrics || []}
          />
        </TabsContent>

        {/* AI Agents Tab */}
        <TabsContent value="agents" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Agent Team</h3>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Configure Agents
            </Button>
          </div>

          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Bot className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{agent.name}</h4>
                          <p className="text-sm text-gray-500">{agent.role}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Status</div>
                          <Badge className={getAgentStatusColor(agent.status)}>
                            {agent.status}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Confidence</div>
                          <div className="text-lg font-semibold">{agent.confidence}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Performance</div>
                          <div className="text-lg font-semibold">{agent.performance}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Last Action</div>
                          <div className="text-sm">{agent.lastAction}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Performance</span>
                            <span>{agent.performance}%</span>
                          </div>
                          <Progress value={agent.performance} className="h-2" />
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">
                          <strong>Next:</strong> {agent.nextAction}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3 mr-1" />
                        Config
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Agent Tasks</h3>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={
                          task.priority === 'high' ? 'destructive' :
                          task.priority === 'medium' ? 'default' :
                          'secondary'
                        }>
                          {task.priority} priority
                        </Badge>
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {task.type}
                        </Badge>
                      </div>

                      <h4 className="font-medium mb-1">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="text-sm text-gray-500">
                          Assigned to: {agents.find(a => a.id === task.assignedAgent)?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{task.progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      </div>

                      {task.dependencies.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm text-gray-500 mb-1">Dependencies:</div>
                          <div className="flex flex-wrap gap-1">
                            {task.dependencies.map(dep => (
                              <Badge key={dep} variant="outline" className="text-xs">
                                {tasks.find(t => t.id === dep)?.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <Button size="sm" disabled={task.status === 'completed'}>
                        {task.status === 'in_progress' ? 'Pause' : 'Start'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <RealTimeAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAgentSystem;