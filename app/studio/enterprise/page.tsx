import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building2, Users, TrendingUp, DollarSign, Crown, Star,
  Globe, Target, BarChart3, PieChart, Settings, Shield,
  Zap, Award, Clock, Music, Video, Headphones, Image,
  FileText, Calendar, Bell, Search, Filter, Download
} from "lucide-react";

export default function EnterpriseManagementStudio() {
  const [activeView, setActiveView] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch enterprise data
  const { data: enterpriseData, isLoading: enterpriseLoading } = useQuery({
    queryKey: ["/api/enterprise/overview"],
    queryFn: () => apiRequest("/api/enterprise/overview")
  });

  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/enterprise/clients"],
    queryFn: () => apiRequest("/api/enterprise/clients")
  });

  // Fallback data while loading
  const mockEnterpriseData = enterpriseData || {
    totalClients: 0,
    activeSubscriptions: 0,
    monthlyRecurring: 0,
    growthRate: 0,
    contentGenerated: 0,
    platformsManaged: 0,
    aiEnginesActive: 19,
    studiosDeployed: 15
  };

  const mockClients = clientsData?.length > 0 ? clientsData : [
    {
      id: 1,
      name: "Loading...",
      type: "Loading...",
      subscription: "Loading...",
      users: 0,
      revenue: 0,
      status: "Loading...",
      since: new Date().toISOString().split('T')[0],
      features: ["Loading..."]
    }
  ];

  const platformFeatures = [
    {
      category: "Core Studios",
      features: [
        { name: "Ultimate Music Studio", usage: 94, revenue: 245000 },
        { name: "Video Studio Pro", usage: 87, revenue: 198000 },
        { name: "AI Career Manager", usage: 76, revenue: 156000 },
        { name: "Professional DJ Suite", usage: 83, revenue: 187000 }
      ]
    },
    {
      category: "AI Engines",
      features: [
        { name: "Neural Audio Engine", usage: 91, revenue: 234000 },
        { name: "Advanced Video AI", usage: 78, revenue: 167000 },
        { name: "Voice Synthesis Engine", usage: 65, revenue: 134000 },
        { name: "Motion Capture AI", usage: 72, revenue: 145000 }
      ]
    },
    {
      category: "Enterprise Tools",
      features: [
        { name: "White Label Platform", usage: 89, revenue: 289000 },
        { name: "Custom Branding", usage: 67, revenue: 123000 },
        { name: "Analytics Dashboard", usage: 94, revenue: 267000 },
        { name: "Multi-tenant Management", usage: 78, revenue: 189000 }
      ]
    }
  ];

  const revenueStreams = [
    { name: "Enterprise Subscriptions", amount: 1247000, percentage: 43.8, growth: 18.4 },
    { name: "White Label Licensing", amount: 678000, percentage: 23.8, growth: 25.7 },
    { name: "Professional Services", amount: 456000, percentage: 16.0, growth: 15.2 },
    { name: "API Usage & Integrations", amount: 467000, percentage: 16.4, growth: 32.1 }
  ];

  const getClientStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "border-green-500 text-green-400";
      case "Trial": return "border-yellow-500 text-yellow-400";
      case "Suspended": return "border-red-500 text-red-400";
      default: return "border-gray-500 text-gray-400";
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/50 to-purple-900 text-white">
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
              <h1 className="text-3xl font-bold">Enterprise Management Studio</h1>
              <p className="text-white/60">Complete enterprise platform oversight and management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Building2 className="w-4 h-4 mr-1" />
              {mockEnterpriseData.totalClients} Clients
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Crown className="w-4 h-4 mr-1" />
              Enterprise Pro
            </Badge>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-green-600/20 to-green-800/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-400">Monthly Recurring Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(mockEnterpriseData.monthlyRecurring)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+{mockEnterpriseData.growthRate}%</span>
                <span className="text-sm text-white/60 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-400">Active Clients</p>
                  <p className="text-2xl font-bold">{mockEnterpriseData.activeSubscriptions}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+12.5%</span>
                <span className="text-sm text-white/60 ml-2">client growth</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-400">Content Generated</p>
                  <p className="text-2xl font-bold">{formatNumber(mockEnterpriseData.contentGenerated)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+34.2%</span>
                <span className="text-sm text-white/60 ml-2">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-400">Platform Uptime</p>
                  <p className="text-2xl font-bold">99.9%</p>
                </div>
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="mt-4 flex items-center">
                <Award className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">Enterprise SLA</span>
                <span className="text-sm text-white/60 ml-2">maintained</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/50 border border-purple-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-purple-600">
              <Zap className="w-4 h-4 mr-2" />
              Features
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-purple-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-purple-600">
              <Shield className="w-4 h-4 mr-2" />
              Support
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Platform Usage Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-black/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">AI Engines Active</span>
                        <Badge variant="outline" className="border-green-500 text-green-400">
                          {mockEnterpriseData.aiEnginesActive}/19
                        </Badge>
                      </div>
                      <Progress value={(mockEnterpriseData.aiEnginesActive / 19) * 100} className="h-2" />
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Studios Deployed</span>
                        <Badge variant="outline" className="border-blue-500 text-blue-400">
                          {mockEnterpriseData.studiosDeployed}/15
                        </Badge>
                      </div>
                      <Progress value={(mockEnterpriseData.studiosDeployed / 15) * 100} className="h-2" />
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Platforms Managed</span>
                        <Badge variant="outline" className="border-purple-500 text-purple-400">
                          {mockEnterpriseData.platformsManaged}
                        </Badge>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New client onboarded</p>
                        <p className="text-xs text-white/60">Creative Arts University - Enterprise Pro</p>
                      </div>
                      <span className="text-xs text-white/40">2h ago</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Platform update deployed</p>
                        <p className="text-xs text-white/60">AI Engine v2.1.3 - Performance improvements</p>
                      </div>
                      <span className="text-xs text-white/40">6h ago</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Support ticket resolved</p>
                        <p className="text-xs text-white/60">Integration issue - NextGen Records</p>
                      </div>
                      <span className="text-xs text-white/40">8h ago</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Revenue milestone reached</p>
                        <p className="text-xs text-white/60">Monthly recurring revenue: $2.8M</p>
                      </div>
                      <span className="text-xs text-white/40">1d ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Enterprise Clients</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="Search clients..."
                      className="bg-black/50 border-purple-500/30 w-64"
                    />
                    <Button size="sm" variant="outline">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClients.map(client => (
                    <div 
                      key={client.id}
                      className="bg-black/30 p-6 rounded-lg border border-purple-500/20 hover:border-purple-400/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                          <p className="text-sm text-white/60">{client.type}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline" 
                            className={`mb-2 ${getClientStatusColor(client.status)}`}
                          >
                            {client.status}
                          </Badge>
                          <p className="text-sm text-white/60">Since {client.since}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-black/30 p-3 rounded text-center">
                          <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                          <p className="text-lg font-bold">{formatNumber(client.users)}</p>
                          <p className="text-xs text-white/60">Users</p>
                        </div>
                        <div className="bg-black/30 p-3 rounded text-center">
                          <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-1" />
                          <p className="text-lg font-bold">{formatCurrency(client.revenue)}</p>
                          <p className="text-xs text-white/60">Monthly Revenue</p>
                        </div>
                        <div className="bg-black/30 p-3 rounded text-center">
                          <Crown className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                          <p className="text-lg font-bold">{client.subscription}</p>
                          <p className="text-xs text-white/60">Plan</p>
                        </div>
                        <div className="bg-black/30 p-3 rounded text-center">
                          <Star className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                          <p className="text-lg font-bold">{client.features.length}</p>
                          <p className="text-xs text-white/60">Features</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Active Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {client.features.map(feature => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                        <Button size="sm" variant="outline">
                          <Shield className="w-4 h-4 mr-1" />
                          Support
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <div className="space-y-6">
              {platformFeatures.map(category => (
                <Card key={category.category} className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.features.map(feature => (
                        <div key={feature.name} className="bg-black/30 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{feature.name}</span>
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              {feature.usage}% Usage
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/60">Monthly Revenue</span>
                            <span className="text-sm font-medium">{formatCurrency(feature.revenue)}</span>
                          </div>
                          <Progress value={feature.usage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Streams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueStreams.map(stream => (
                      <div key={stream.name} className="bg-black/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{stream.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              +{stream.growth}%
                            </Badge>
                            <span className="text-sm font-bold">{formatCurrency(stream.amount)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/60">{stream.percentage}% of total revenue</span>
                        </div>
                        <Progress value={stream.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Financial Projections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-500/20 to-green-700/20 p-4 rounded-lg border border-green-500/30">
                      <h4 className="font-medium mb-2">Q1 2025 Projection</h4>
                      <p className="text-2xl font-bold text-green-400">$3.2M</p>
                      <p className="text-sm text-white/60">Monthly recurring revenue target</p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/20 to-blue-700/20 p-4 rounded-lg border border-blue-500/30">
                      <h4 className="font-medium mb-2">Client Growth Target</h4>
                      <p className="text-2xl font-bold text-blue-400">65</p>
                      <p className="text-sm text-white/60">Enterprise clients by Q1 2025</p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/20 to-purple-700/20 p-4 rounded-lg border border-purple-500/30">
                      <h4 className="font-medium mb-2">Feature Adoption</h4>
                      <p className="text-2xl font-bold text-purple-400">89%</p>
                      <p className="text-sm text-white/60">Average feature utilization rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Support Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-black/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Average Response Time</span>
                        <Badge variant="outline" className="border-green-500 text-green-400">
                          2.3 hours
                        </Badge>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Resolution Rate</span>
                        <Badge variant="outline" className="border-green-500 text-green-400">
                          97.8%
                        </Badge>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Customer Satisfaction</span>
                        <Badge variant="outline" className="border-green-500 text-green-400">
                          4.9/5.0
                        </Badge>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Priority Support Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Integration API Error</p>
                          <p className="text-sm text-white/60">Global Music Academy</p>
                        </div>
                        <Badge className="bg-red-600">Critical</Badge>
                      </div>
                    </div>

                    <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Performance Optimization</p>
                          <p className="text-sm text-white/60">NextGen Records</p>
                        </div>
                        <Badge className="bg-yellow-600">High</Badge>
                      </div>
                    </div>

                    <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Feature Request</p>
                          <p className="text-sm text-white/60">Creative Arts University</p>
                        </div>
                        <Badge className="bg-blue-600">Medium</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}