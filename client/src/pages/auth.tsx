import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Music, Video, Cpu, Zap, Brain, Palette, Check, LogIn, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    userType: 'student' as 'admin' | 'teacher' | 'student'
  });
  
  const { toast } = useToast();
  const { login, register, loginLoading, registerLoading, loginError, registerError } = useAuth();
  const [, setLocation] = useLocation();

  const isLoading = loginLoading || registerLoading;

  const plans = [
    {
      id: 'basic',
      name: 'Basic School License',
      price: 2500,
      studentPrice: 15,
      maxStudents: 50,
      features: [
        'Up to 5 teacher accounts',
        'Basic MPC Studio access',
        'Live streaming (10 concurrent)',
        'Email support',
        'Standard sample library'
      ]
    },
    {
      id: 'professional',
      name: 'Professional School License',
      price: 8500,
      studentPrice: 12,
      maxStudents: 200,
      features: [
        'Up to 15 teacher accounts',
        'Full MPC Studio with all samples',
        'Live streaming (50 concurrent)',
        'Priority support',
        'Custom sample uploads (5GB)',
        'White-label options'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise School License',
      price: 25000,
      studentPrice: 8,
      maxStudents: 999999,
      features: [
        'Unlimited teacher accounts',
        'Complete MPC Studio suite',
        'Unlimited concurrent streaming',
        'Dedicated support manager',
        'Unlimited storage',
        'Full white-label customization',
        'API access'
      ]
    }
  ];

  const handleSignUp = async (formData: any) => {
    setLoading(true);
    try {
      // Registration API call would go here
      toast({
        title: "Registration Successful",
        description: "Welcome to ProStudio! Check your email for next steps.",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (formData: any) => {
    setLoading(true);
    try {
      // Demo login - bypass authentication
      localStorage.setItem("demo_user", "true");
      toast({
        title: "Login Successful",
        description: "Welcome to ProStudio! Redirecting to your dashboard...",
      });
      setTimeout(() => {
        window.location.href = "/studio";
      }, 1000);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center mb-6">
            <Music className="text-orange-400 mr-3" size={48} />
            <h1 className="text-4xl font-bold text-white">ProStudio</h1>
          </div>
          <h2 className="text-2xl text-gray-300 mb-4">
            AI-Powered Multimedia Creation Platform
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Revolutionary self-hosted AI technology for music production, video creation, and immersive media.
            15 cutting-edge engines delivering professional-grade capabilities that surpass industry standards.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <Music className="text-orange-400 mx-auto mb-2" size={32} />
              <div className="text-white font-semibold">Neural Audio</div>
              <div className="text-gray-400 text-sm">AI Music Generation</div>
            </div>
            <div className="text-center">
              <Video className="text-orange-400 mx-auto mb-2" size={32} />
              <div className="text-white font-semibold">Cinematic AI</div>
              <div className="text-gray-400 text-sm">Video Creation</div>
            </div>
            <div className="text-center">
              <Cpu className="text-orange-400 mx-auto mb-2" size={32} />
              <div className="text-white font-semibold">Motion Capture</div>
              <div className="text-gray-400 text-sm">Performance AI</div>
            </div>
            <div className="text-center">
              <Brain className="text-orange-400 mx-auto mb-2" size={32} />
              <div className="text-white font-semibold">Adaptive Learning</div>
              <div className="text-gray-400 text-sm">Biometric Analysis</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="px-6 py-12 bg-gray-800/50">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Choose Your School License
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative bg-gray-900 border-gray-700 ${
                  plan.popular ? 'ring-2 ring-orange-400' : ''
                } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-orange-400">
                    ${plan.price.toLocaleString()}
                    <span className="text-lg text-gray-400">/year</span>
                  </div>
                  <div className="text-gray-400">
                    + ${plan.studentPrice}/student/month
                  </div>
                  <CardDescription>
                    Up to {plan.maxStudents === 999999 ? 'unlimited' : plan.maxStudents} students
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <Check className="text-green-400 mr-2" size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      selectedPlan === plan.id 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Forms */}
      <div className="px-6 py-12">
        <div className="mx-auto max-w-md">
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="signup" className="text-white">Sign Up</TabsTrigger>
              <TabsTrigger value="signin" className="text-white">Sign In</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signup">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Create School Account</CardTitle>
                  <CardDescription>
                    Start your 30-day free trial with {plans.find(p => p.id === selectedPlan)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                      <Input id="firstName" className="bg-gray-800 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                      <Input id="lastName" className="bg-gray-800 border-gray-600 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input id="email" type="email" className="bg-gray-800 border-gray-600 text-white" />
                  </div>
                  
                  <div>
                    <Label htmlFor="schoolName" className="text-gray-300">School/Organization Name</Label>
                    <Input id="schoolName" className="bg-gray-800 border-gray-600 text-white" />
                  </div>
                  
                  <div>
                    <Label htmlFor="studentCount" className="text-gray-300">Estimated Student Count</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select student count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-25">1-25 students</SelectItem>
                        <SelectItem value="26-50">26-50 students</SelectItem>
                        <SelectItem value="51-100">51-100 students</SelectItem>
                        <SelectItem value="101-200">101-200 students</SelectItem>
                        <SelectItem value="201+">201+ students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="userType" className="text-gray-300">Your Role</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">School Administrator</SelectItem>
                        <SelectItem value="teacher">Music Teacher</SelectItem>
                        <SelectItem value="director">Music Director</SelectItem>
                        <SelectItem value="owner">School Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Input id="password" type="password" className="bg-gray-800 border-gray-600 text-white" />
                  </div>
                  
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => handleSignUp({})}
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Start Free Trial'}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-400">
                    30-day free trial • No credit card required
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signin">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Sign In</CardTitle>
                  <CardDescription>
                    Access your ProStudio school account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="loginEmail" className="text-gray-300">Email</Label>
                    <Input id="loginEmail" type="email" className="bg-gray-800 border-gray-600 text-white" />
                  </div>
                  
                  <div>
                    <Label htmlFor="loginPassword" className="text-gray-300">Password</Label>
                    <Input id="loginPassword" type="password" className="bg-gray-800 border-gray-600 text-white" />
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSignIn({})}
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  
                  <div className="text-center">
                    <a href="#" className="text-sm text-orange-400 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Demo Access */}
      <div className="px-6 py-8 bg-gray-800/30">
        <div className="mx-auto max-w-md text-center">
          <h4 className="text-lg font-semibold text-white mb-4">Instant Demo Access</h4>
          <div className="space-y-2">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              onClick={() => {
                localStorage.setItem("demo_user", "true");
                window.location.href = "/studio";
              }}
            >
              <LogIn className="mr-2" size={16} />
              Enter ProStudio (No Login Required)
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => {
                  localStorage.setItem("demo_user", "true");
                  window.location.href = "/mpc";
                }}
              >
                <Music className="mr-1" size={14} />
                MPC Studio
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => {
                  localStorage.setItem("demo_user", "true");
                  window.location.href = "/dj";
                }}
              >
                <Zap className="mr-1" size={14} />
                DJ Studio
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => {
                  localStorage.setItem("demo_user", "true");
                  window.location.href = "/video";
                }}
              >
                <Video className="mr-1" size={14} />
                Video Studio
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-600 text-white hover:bg-gray-700"
                onClick={() => {
                  localStorage.setItem("demo_user", "true");
                  window.location.href = "/business";
                }}
              >
                <Brain className="mr-1" size={14} />
                AI Business
              </Button>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-400">
            Full access to all 13 AI engines • No registration required
          </div>
        </div>
      </div>
    </div>
  );
}