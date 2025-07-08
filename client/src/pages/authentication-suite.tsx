import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Shield, Music, Settings, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";

export default function AuthenticationSuite() {
  const [activeTab, setActiveTab] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: "user@artisttech.com",
    password: "demo123"
  });
  const [adminCredentials, setAdminCredentials] = useState({
    email: "admin@artisttech.com",
    password: "admin2024!"
  });

  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (userType: 'user' | 'admin') => {
    const credentials = userType === 'user' ? userCredentials : adminCredentials;
    setIsLoading(true);
    
    try {
      // Demo authentication logic
      if ((credentials.email === 'user@artisttech.com' && credentials.password === 'demo123') || 
          (credentials.email === 'admin@artisttech.com' && credentials.password === 'admin2024!')) {
        
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        localStorage.setItem('userRole', userType);
        localStorage.setItem('userEmail', credentials.email);
        
        // Navigate to main app
        navigate('/');
      } else {
        alert('Invalid credentials. Please use the demo accounts provided.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      type: "User Account",
      email: "user@artisttech.com",
      password: "demo123",
      description: "Full access to all creative studios and AI engines",
      features: ["Music Studio", "DJ Studio", "Video Editor", "AI Career Manager", "Social Media Hub"],
      color: "from-blue-600 to-purple-600"
    },
    {
      type: "Admin Account",
      email: "admin@artisttech.com",
      password: "admin2024!",
      description: "Complete platform administration and system control",
      features: ["User Management", "System Monitor", "Enterprise Controls", "Content Management", "Analytics"],
      color: "from-red-600 to-pink-600"
    }
  ];

  const platformFeatures = [
    "19 Self-Hosted AI Engines",
    "Professional Music Production",
    "Live DJ Mixing & Voting",
    "Video Editing & Visual Arts",
    "AI Career Management",
    "Social Media Management",
    "ArtistCoin Rewards System",
    "Real-time Collaboration",
    "Hardware Integration",
    "Educational Platform"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Music className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Artist Tech</h1>
          </div>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            The world's first platform that pays users to view content. Revolutionary "pay-to-view" model with 19 AI engines.
          </p>
        </div>

        {/* Demo Credentials Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoAccounts.map((account, idx) => (
            <Card key={idx} className="bg-white/10 border-purple-400/30 hover:bg-white/15 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${account.color} flex items-center justify-center`}>
                    {account.type.includes('Admin') ? <Shield className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
                  </div>
                  {account.type}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {account.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-black/20 rounded-lg">
                    <div className="text-sm text-gray-300 mb-1">Email:</div>
                    <div className="text-white font-mono">{account.email}</div>
                    <div className="text-sm text-gray-300 mb-1 mt-2">Password:</div>
                    <div className="text-white font-mono">{account.password}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Features:</div>
                    {account.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full" />
                        <span className="text-xs text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Login Interface */}
        <Card className="bg-white/10 border-purple-400/30">
          <CardHeader>
            <CardTitle className="text-white text-center">Login to Artist Tech</CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Choose your account type and sign in to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="user" className="text-white">User Login</TabsTrigger>
                <TabsTrigger value="admin" className="text-white">Admin Login</TabsTrigger>
              </TabsList>

              {/* User Login Tab */}
              <TabsContent value="user" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userEmail" className="text-gray-300">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={userCredentials.email}
                      onChange={(e) => setUserCredentials({...userCredentials, email: e.target.value})}
                      className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400"
                      placeholder="user@artisttech.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userPassword" className="text-gray-300">Password</Label>
                    <div className="relative">
                      <Input
                        id="userPassword"
                        type={showPassword ? "text" : "password"}
                        value={userCredentials.password}
                        onChange={(e) => setUserCredentials({...userCredentials, password: e.target.value})}
                        className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400 pr-10"
                        placeholder="demo123"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="userRemember" />
                    <Label htmlFor="userRemember" className="text-gray-300 text-sm">Remember me</Label>
                  </div>
                  <Button 
                    onClick={() => handleLogin('user')}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In as User'}
                  </Button>
                </div>
              </TabsContent>

              {/* Admin Login Tab */}
              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail" className="text-gray-300">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={adminCredentials.email}
                      onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
                      className="bg-white/10 border-red-400/30 text-white placeholder-gray-400"
                      placeholder="admin@artisttech.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword" className="text-gray-300">Admin Password</Label>
                    <div className="relative">
                      <Input
                        id="adminPassword"
                        type={showPassword ? "text" : "password"}
                        value={adminCredentials.password}
                        onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                        className="bg-white/10 border-red-400/30 text-white placeholder-gray-400 pr-10"
                        placeholder="admin2024!"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="adminRemember" />
                    <Label htmlFor="adminRemember" className="text-gray-300 text-sm">Remember me</Label>
                  </div>
                  <Button 
                    onClick={() => handleLogin('admin')}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In as Admin'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Platform Features */}
        <Card className="bg-white/10 border-green-400/30">
          <CardHeader>
            <CardTitle className="text-white text-center">Platform Features</CardTitle>
            <CardDescription className="text-gray-300 text-center">
              What you'll have access to after logging in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {platformFeatures.map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-center text-green-400 border-green-400 hover:bg-green-400/20 p-2">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>© 2025 Artist Tech. Revolutionary music platform with pay-to-view content economy.</p>
        </div>
      </div>
    </div>
  );
}