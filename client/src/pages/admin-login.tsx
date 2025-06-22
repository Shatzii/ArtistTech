import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Music, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@prostudio.ai");
  const [password, setPassword] = useState("ProStudio2025!");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login, loginLoading, loginError } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({ email, password });
      
      toast({
        title: "Admin Login Successful",
        description: "Welcome to ProStudio Admin Panel",
      });
      
      setLocation('/');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid admin credentials",
        variant: "destructive",
      });
    }
  };

  const handleQuickLogin = () => {
    setEmail("admin@prostudio.ai");
    setPassword("ProStudio2025!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="text-red-500 mr-3" size={48} />
            <Music className="text-orange-400" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ProStudio Admin</h1>
          <p className="text-gray-400">Administrative Control Panel</p>
        </div>

        {/* Demo Credentials Card */}
        <Card className="bg-red-950/20 border-red-500/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-400 text-sm flex items-center">
              <AlertCircle size={16} className="mr-2" />
              Demo Admin Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="bg-gray-900/50 p-3 rounded font-mono text-sm">
              <div className="text-gray-400">Email:</div>
              <div className="text-white">admin@prostudio.ai</div>
            </div>
            <div className="bg-gray-900/50 p-3 rounded font-mono text-sm">
              <div className="text-gray-400">Password:</div>
              <div className="text-white">ProStudio2025!</div>
            </div>
            <Button 
              onClick={handleQuickLogin}
              variant="outline" 
              size="sm" 
              className="w-full mt-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              Use Demo Credentials
            </Button>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Admin Login</CardTitle>
            <CardDescription>
              Access the ProStudio administrative interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-950/50 border border-red-500/50 rounded p-3">
                  <div className="text-red-400 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    {loginError.message}
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  <>
                    <Shield className="mr-2" size={16} />
                    Login as Admin
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Admin Features Preview */}
        <Card className="bg-gray-900/30 border-gray-700 mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Admin Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Badge variant="outline" className="text-gray-300 border-gray-600">
                User Management
              </Badge>
              <Badge variant="outline" className="text-gray-300 border-gray-600">
                System Analytics
              </Badge>
              <Badge variant="outline" className="text-gray-300 border-gray-600">
                License Control
              </Badge>
              <Badge variant="outline" className="text-gray-300 border-gray-600">
                AI Engine Status
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Back to Main Auth */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/auth')}
            className="text-gray-400 hover:text-white"
          >
            ← Back to Main Login
          </Button>
        </div>
      </div>
    </div>
  );
}