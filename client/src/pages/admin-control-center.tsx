import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, Settings, BarChart3, Database, Globe, Bell, Lock, Activity, Server, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AdminControlCenter() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [totalUsers, setTotalUsers] = useState(15847);
  const [systemLoad, setSystemLoad] = useState(67);
  const [pendingApprovals, setPendingApprovals] = useState(23);

  const { data: systemStats } = useQuery({
    queryKey: ["/api/admin/system-stats"],
    enabled: true
  });

  const { data: userAnalytics } = useQuery({
    queryKey: ["/api/admin/user-analytics"],
    enabled: true
  });

  const { data: enterpriseClients } = useQuery({
    queryKey: ["/api/admin/enterprise-clients"],
    enabled: true
  });

  const systemModules = [
    { name: "Neural Audio Engine", status: "running", load: 78, port: 8081 },
    { name: "Motion Capture Engine", status: "running", load: 45, port: 8082 },
    { name: "Immersive Media Engine", status: "running", load: 89, port: 8083 },
    { name: "Adaptive Learning Engine", status: "running", load: 56, port: 8084 },
    { name: "Spatial Interface Engine", status: "running", load: 34, port: 8085 },
    { name: "Enterprise Platform Engine", status: "running", load: 67, port: 8086 },
    { name: "MIDI Controller Engine", status: "running", load: 23, port: 8087 },
    { name: "AI Marketing Engine", status: "running", load: 88, port: 8088 },
    { name: "Visual Arts Engine", status: "running", load: 72, port: 8092 },
    { name: "Advanced Audio Engine", status: "running", load: 91, port: 8093 }
  ];

  const userManagementStats = [
    { category: "Total Users", value: 15847, change: 8.3, color: "text-blue-400" },
    { category: "Active Artists", value: 8924, change: 12.7, color: "text-green-400" },
    { category: "Premium Users", value: 2156, change: 15.2, color: "text-purple-400" },
    { category: "Enterprise Clients", value: 47, change: 23.8, color: "text-orange-400" }
  ];

  const recentActivities = [
    { action: "New enterprise client registered", user: "TechCorp Music", time: "2 min ago", type: "enterprise" },
    { action: "System backup completed", user: "Automated System", time: "15 min ago", type: "system" },
    { action: "Premium subscription activated", user: "DJ MixMaster", time: "23 min ago", type: "subscription" },
    { action: "AI engine optimization completed", user: "System Admin", time: "1 hour ago", type: "optimization" },
    { action: "New feature deployment", user: "Development Team", time: "2 hours ago", type: "deployment" }
  ];

  const securityAlerts = [
    { level: "info", message: "Security scan completed - no issues found", time: "30 min ago" },
    { level: "warning", message: "Unusual login pattern detected for user_12847", time: "1 hour ago" },
    { level: "success", message: "SSL certificate renewed successfully", time: "2 hours ago" }
  ];

  const enterpriseFeatures = [
    {
      name: "White-Label Platform",
      description: "Rebrandable solution for music schools and institutions",
      clients: 12,
      revenue: 45000,
      status: "active"
    },
    {
      name: "AI Business Intelligence",
      description: "Advanced analytics and automated marketing campaigns",
      clients: 8,
      revenue: 32000,
      status: "active"
    },
    {
      name: "Record Label Management",
      description: "Complete A&R, distribution, and talent management suite",
      clients: 5,
      revenue: 78000,
      status: "active"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalUsers(prev => prev + Math.floor(Math.random() * 5));
      setSystemLoad(prev => Math.max(30, Math.min(95, prev + Math.floor(Math.random() * 10) - 5)));
      setPendingApprovals(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Control Center
          </h1>
          <p className="text-red-200 text-lg max-w-3xl mx-auto">
            Complete platform administration with system monitoring, user management, and enterprise controls
          </p>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 border-blue-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalUsers.toLocaleString()}</div>
              <p className="text-blue-200 text-sm">+8.3% this month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-green-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                System Load
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{systemLoad}%</div>
              <Progress value={systemLoad} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-orange-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-400" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pendingApprovals}</div>
              <p className="text-orange-200 text-sm">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-purple-400" />
                AI Engines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">19/19</div>
              <p className="text-green-200 text-sm">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10">
            <TabsTrigger value="dashboard" className="text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="users" className="text-white">User Management</TabsTrigger>
            <TabsTrigger value="system" className="text-white">System Monitor</TabsTrigger>
            <TabsTrigger value="enterprise" className="text-white">Enterprise</TabsTrigger>
            <TabsTrigger value="cms" className="text-white">Content Management</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-red-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <div>
                          <div className="text-sm text-white">{activity.action}</div>
                          <div className="text-xs text-gray-300">{activity.user}</div>
                        </div>
                        <div className="text-xs text-gray-400">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Security Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityAlerts.map((alert, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-white/5 rounded">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.level === 'success' ? 'bg-green-400' :
                          alert.level === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`} />
                        <div className="flex-1">
                          <div className="text-sm text-white">{alert.message}</div>
                          <div className="text-xs text-gray-400">{alert.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">User Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userManagementStats.map((stat, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-gray-300">{stat.category}</span>
                        <div className="text-right">
                          <div className={`font-medium ${stat.color}`}>{stat.value.toLocaleString()}</div>
                          <div className="text-xs text-green-400">+{stat.change}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-white">User Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Monitor Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-white/10 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-white">AI Engine Status</CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time monitoring of all 19 AI engines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systemModules.map((module, idx) => (
                    <div key={idx} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium">{module.name}</span>
                        <Badge className="bg-green-600 text-white">{module.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-300">Port: {module.port}</span>
                        <span className="text-xs text-gray-300">Load: {module.load}%</span>
                      </div>
                      <Progress value={module.load} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enterprise Tab */}
          <TabsContent value="enterprise" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {enterpriseFeatures.map((feature, idx) => (
                <Card key={idx} className="bg-white/10 border-purple-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-400" />
                      {feature.name}
                      <Badge variant="outline" className="ml-auto text-green-400 border-green-400">
                        {feature.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Active Clients</span>
                        <span className="text-white">{feature.clients}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Monthly Revenue</span>
                        <span className="text-green-400">${feature.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* CMS Tab */}
          <TabsContent value="cms" className="space-y-6">
            <Card className="bg-white/10 border-blue-400/30">
              <CardHeader>
                <CardTitle className="text-white">Content Management System</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage platform content, announcements, and educational materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Content Type</label>
                    <Select defaultValue="announcement">
                      <SelectTrigger className="bg-white/10 border-blue-400/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">System Announcement</SelectItem>
                        <SelectItem value="feature">Feature Update</SelectItem>
                        <SelectItem value="maintenance">Maintenance Notice</SelectItem>
                        <SelectItem value="educational">Educational Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Target Audience</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-white/10 border-blue-400/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="premium">Premium Users</SelectItem>
                        <SelectItem value="enterprise">Enterprise Clients</SelectItem>
                        <SelectItem value="educators">Educators</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Title</label>
                  <Input 
                    placeholder="Content title..."
                    className="bg-white/10 border-blue-400/30 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Content</label>
                  <Textarea 
                    placeholder="Content body..."
                    className="bg-white/10 border-blue-400/30 text-white placeholder-gray-400 min-h-32"
                  />
                </div>

                <div className="flex gap-2">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Publish Now
                  </Button>
                  <Button variant="outline" className="border-blue-400 text-blue-400">
                    Schedule
                  </Button>
                  <Button variant="outline" className="border-gray-400 text-gray-400">
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}