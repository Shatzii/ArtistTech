import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  Activity,
  Shield,
  Globe,
  Cpu
} from 'lucide-react';
import { AIAgentSystem } from './AIAgentSystem';
import { AICareerManager } from './AICareerManager';
import { AIAnalyticsInsights } from './AIAnalyticsInsights';
import { RealTimeAnalyticsDashboard } from './RealTimeAnalyticsDashboard';

interface SystemMetrics {
  uptime: number;
  responseTime: number;
  accuracy: number;
  userSatisfaction: number;
  activeUsers: number;
  processedRequests: number;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export const AICareerManagerSystem: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'agents' | 'analytics' | 'settings'>('overview');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    uptime: 99.9,
    responseTime: 45,
    accuracy: 94.2,
    userSatisfaction: 4.8,
    activeUsers: 1247,
    processedRequests: 45632
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: 'system-health',
      type: 'success',
      title: 'System Health Optimal',
      message: 'All AI agents are performing within expected parameters',
      timestamp: new Date(),
      resolved: false
    },
    {
      id: 'performance-boost',
      type: 'info',
      title: 'Performance Optimization Complete',
      message: 'AI models have been updated with latest training data',
      timestamp: new Date(Date.now() - 3600000),
      resolved: false
    }
  ]);

  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      updateSystemMetrics();
      setLastUpdate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const updateSystemMetrics = () => {
    setSystemMetrics(prev => ({
      ...prev,
      uptime: Math.max(99.5, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
      responseTime: Math.max(30, Math.min(60, prev.responseTime + (Math.random() - 0.5) * 5)),
      accuracy: Math.max(90, Math.min(98, prev.accuracy + (Math.random() - 0.5) * 0.5)),
      userSatisfaction: Math.max(4.5, Math.min(5.0, prev.userSatisfaction + (Math.random() - 0.5) * 0.1)),
      activeUsers: Math.max(1000, Math.min(1500, prev.activeUsers + Math.floor((Math.random() - 0.5) * 50))),
      processedRequests: prev.processedRequests + Math.floor(Math.random() * 100)
    }));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <Award className="h-4 w-4 text-green-500" />;
      case 'warning': return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'error': return <Zap className="h-4 w-4 text-red-500" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500';
      case 'warning': return 'border-l-yellow-500';
      case 'error': return 'border-l-red-500';
      case 'info': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* System Status Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isSystemOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {isSystemOnline ? 'System Online' : 'System Offline'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Uptime: {systemMetrics.uptime.toFixed(1)}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Response: {systemMetrics.responseTime}ms</span>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Career Manager System
          </h1>
          <p className="text-gray-600">
            Intelligent career optimization and analytics platform powered by advanced AI agents
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center">
                <Bot className="h-4 w-4 mr-2" />
                AI Agents
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* System Metrics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Performance</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.accuracy.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                      AI Accuracy Rate
                    </p>
                    <div className="mt-2">
                      <Progress value={systemMetrics.accuracy} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.userSatisfaction.toFixed(1)}/5</div>
                    <p className="text-xs text-muted-foreground">
                      Average Rating
                    </p>
                    <div className="mt-2">
                      <Progress value={(systemMetrics.userSatisfaction / 5) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.activeUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Currently Online
                    </p>
                    <div className="mt-2">
                      <Progress value={(systemMetrics.activeUsers / 1500) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={`p-4 border-l-4 rounded-lg ${getAlertColor(alert.type)} bg-gray-50`}>
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {alert.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {alert.message}
                            </p>
                            <div className="mt-2 text-xs text-gray-500">
                              {alert.timestamp.toLocaleString()}
                            </div>
                          </div>
                          {!alert.resolved && (
                            <Button size="sm" variant="outline">
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Bot className="h-6 w-6" />
                      <span>Deploy New Agent</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <BarChart3 className="h-6 w-6" />
                      <span>Run Analytics</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Target className="h-6 w-6" />
                      <span>Set Goals</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Settings className="h-6 w-6" />
                      <span>System Config</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Agents Tab */}
            <TabsContent value="agents" className="space-y-6 mt-6">
              <AIAgentSystem />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6 mt-6">
              <div className="grid gap-6">
                <RealTimeAnalyticsDashboard />
                <AIAnalyticsInsights
                  metrics={[]} // Would be populated from real-time data
                  alerts={[]} // Would be populated from system alerts
                  trends={[]} // Would be populated from trend analysis
                />
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Agent Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Auto-Learning Mode</h4>
                          <p className="text-sm text-gray-500">Allow agents to learn from user interactions</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Performance Monitoring</h4>
                          <p className="text-sm text-gray-500">Enable detailed performance tracking</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Alert Thresholds</h4>
                          <p className="text-sm text-gray-500">Set custom alert thresholds</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Data Retention</h4>
                          <p className="text-sm text-gray-500">Configure how long to keep analytics data</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Backup Settings</h4>
                          <p className="text-sm text-gray-500">Manage automatic backups</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">API Access</h4>
                          <p className="text-sm text-gray-500">Manage API keys and access</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AICareerManagerSystem;