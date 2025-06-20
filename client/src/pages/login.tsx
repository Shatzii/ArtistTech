import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Music, GraduationCap, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Teacher login state
  const [teacherForm, setTeacherForm] = useState({
    email: "",
    password: ""
  });
  
  // Student login state
  const [studentForm, setStudentForm] = useState({
    email: "",
    password: ""
  });

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/teacher/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherForm)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userSession', JSON.stringify(data));
        toast({
          title: "Welcome back!",
          description: "Successfully logged in as teacher",
        });
        setLocation('/teacher-portal');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your email and password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userSession', JSON.stringify(data));
        toast({
          title: "Welcome back!",
          description: "Successfully logged in as student",
        });
        setLocation('/student-dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your email and password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Music className="text-blue-400 mr-2" size={32} />
            <h1 className="text-2xl font-bold">ProStudio Education</h1>
          </div>
          <p className="text-gray-400">Sign in to your music learning platform</p>
        </div>

        {/* Login Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="flex items-center">
                  <Users size={16} className="mr-2" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="teacher" className="flex items-center">
                  <GraduationCap size={16} className="mr-2" />
                  Teacher
                </TabsTrigger>
              </TabsList>

              {/* Student Login */}
              <TabsContent value="student">
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="student@example.com"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-gray-700 border-gray-600"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input
                      id="student-password"
                      type="password"
                      placeholder="Enter your password"
                      value={studentForm.password}
                      onChange={(e) => setStudentForm(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-gray-700 border-gray-600"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Student"}
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-blue-600/20 rounded border border-blue-500/30">
                  <p className="text-sm text-blue-300 mb-2">Demo Student Account:</p>
                  <div className="text-xs space-y-1">
                    <div>Email: demo.student@prostudio.edu</div>
                    <div>Password: student123</div>
                  </div>
                </div>
              </TabsContent>

              {/* Teacher Login */}
              <TabsContent value="teacher">
                <form onSubmit={handleTeacherLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      placeholder="teacher@example.com"
                      value={teacherForm.email}
                      onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-gray-700 border-gray-600"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teacher-password">Password</Label>
                    <Input
                      id="teacher-password"
                      type="password"
                      placeholder="Enter your password"
                      value={teacherForm.password}
                      onChange={(e) => setTeacherForm(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-gray-700 border-gray-600"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Teacher"}
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-green-600/20 rounded border border-green-500/30">
                  <p className="text-sm text-green-300 mb-2">Demo Teacher Account:</p>
                  <div className="text-xs space-y-1">
                    <div>Email: demo.teacher@prostudio.edu</div>
                    <div>Password: teacher123</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Quick Access */}
            <div className="mt-6 pt-4 border-t border-gray-600">
              <p className="text-center text-sm text-gray-400 mb-3">Quick Access</p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setLocation('/mpc')}
                >
                  MPC Studio
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setLocation('/curriculum')}
                >
                  Curriculum
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <Badge variant="secondary">Live Streaming</Badge>
            <Badge variant="secondary">Real-time Collaboration</Badge>
            <Badge variant="secondary">Music Theory</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}