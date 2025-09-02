import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Users, BookOpen, Video, Clock, Award, TrendingUp, Settings, Play, Pause } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function EducationManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [activeStudents, setActiveStudents] = useState(247);
  const [currentLesson, setCurrentLesson] = useState("Music Theory Fundamentals");

  const { data: teacherStats } = useQuery({
    queryKey: ["education-teacher-stats"],
    queryFn: () => apiRequest("/api/education/teacher-stats"),
    enabled: true
  });

  const { data: studentProgress } = useQuery({
    queryKey: ["education-student-progress"],
    queryFn: () => apiRequest("/api/education/student-progress"),
    enabled: true
  });

  const { data: classSchedule } = useQuery({
    queryKey: ["education-class-schedule"],
    queryFn: () => apiRequest("/api/education/class-schedule"),
    enabled: true
  });

  const curriculumModules = [
    {
      id: "theory",
      title: "Music Theory",
      lessons: 24,
      completed: 18,
      difficulty: "Beginner",
      duration: "6 weeks",
      description: "Fundamentals of music theory, scales, and harmony"
    },
    {
      id: "production",
      title: "Music Production",
      lessons: 32,
      completed: 12,
      difficulty: "Intermediate",
      duration: "8 weeks",
      description: "Digital audio workstation and production techniques"
    },
    {
      id: "performance",
      title: "Live Performance",
      lessons: 16,
      completed: 8,
      difficulty: "Advanced",
      duration: "4 weeks",
      description: "Stage presence and live performance skills"
    },
    {
      id: "business",
      title: "Music Business",
      lessons: 20,
      completed: 5,
      difficulty: "Intermediate",
      duration: "5 weeks",
      description: "Industry knowledge and career development"
    }
  ];

  const activeClasses = [
    {
      id: 1,
      title: "Beginner Guitar",
      students: 34,
      time: "10:00 AM",
      duration: "1 hour",
      status: "live",
      instructor: "Sarah Johnson"
    },
    {
      id: 2,
      title: "Music Production 101",
      students: 28,
      time: "2:00 PM",
      duration: "1.5 hours",
      status: "scheduled",
      instructor: "Mike Chen"
    },
    {
      id: 3,
      title: "Piano Fundamentals",
      students: 22,
      time: "4:00 PM",
      duration: "1 hour",
      status: "scheduled",
      instructor: "Emily Davis"
    }
  ];

  const studentAnalytics = [
    { metric: "Total Enrolled", value: 1247, change: 15.3 },
    { metric: "Active This Week", value: 892, change: 8.7 },
    { metric: "Completion Rate", value: 78.5, change: 5.2 },
    { metric: "Average Score", value: 84.2, change: 2.8 }
  ];

  const teacherTools = [
    {
      name: "Live Streaming Studio",
      description: "Professional streaming with screen sharing and interactive tools",
      status: "active",
      users: 12
    },
    {
      name: "Assignment Manager",
      description: "Create and track student assignments and projects",
      status: "active",
      users: 8
    },
    {
      name: "Progress Tracker",
      description: "Monitor individual student progress and performance",
      status: "active",
      users: 15
    },
    {
      name: "Content Library",
      description: "Access to comprehensive music education resources",
      status: "active",
      users: 23
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStudents(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartStream = () => {
    setIsLiveStreaming(!isLiveStreaming);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Education Management Suite
          </h1>
          <p className="text-purple-200 text-lg max-w-3xl mx-auto">
            Comprehensive music education platform with live streaming, curriculum management, and student progress tracking
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 border-indigo-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-400" />
                Active Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeStudents}</div>
              <p className="text-indigo-200 text-sm">Currently online</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-green-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-400" />
                Lessons Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-green-200 text-sm">3 currently live</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-400" />
                Completions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">89</div>
              <p className="text-purple-200 text-sm">This week</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-orange-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Video className="h-5 w-5 text-orange-400" />
                Stream Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isLiveStreaming ? 'text-red-400' : 'text-gray-400'}`}>
                {isLiveStreaming ? 'LIVE' : 'OFFLINE'}
              </div>
              <p className="text-orange-200 text-sm">Broadcasting</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10">
            <TabsTrigger value="dashboard" className="text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="teacher" className="text-white">Teacher Portal</TabsTrigger>
            <TabsTrigger value="student" className="text-white">Student Hub</TabsTrigger>
            <TabsTrigger value="curriculum" className="text-white">Curriculum</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-indigo-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Active Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeClasses.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{cls.title}</div>
                          <div className="text-sm text-gray-300">{cls.instructor} • {cls.time}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cls.status === 'live' ? 'bg-red-600' : 'bg-blue-600'}>
                            {cls.status}
                          </Badge>
                          <span className="text-sm text-gray-300">{cls.students} students</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Student Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentAnalytics.map((stat, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-gray-300">{stat.metric}</span>
                        <div className="text-right">
                          <div className="text-white font-medium">{stat.value}{stat.metric.includes('Rate') || stat.metric.includes('Score') ? '%' : ''}</div>
                          <div className="text-xs text-green-400">+{stat.change}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Teacher Portal Tab */}
          <TabsContent value="teacher" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Live Streaming Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={handleStartStream}
                      className={`flex-1 ${isLiveStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {isLiveStreaming ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isLiveStreaming ? 'Stop Stream' : 'Start Stream'}
                    </Button>
                    <Button variant="outline" className="border-purple-400 text-purple-400">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Current Lesson</label>
                    <Input 
                      value={currentLesson}
                      onChange={(e) => setCurrentLesson(e.target.value)}
                      className="bg-white/10 border-purple-400/30 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Stream Quality</label>
                    <Select defaultValue="1080p">
                      <SelectTrigger className="bg-white/10 border-purple-400/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="720p">720p HD</SelectItem>
                        <SelectItem value="1080p">1080p Full HD</SelectItem>
                        <SelectItem value="4k">4K Ultra HD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Teacher Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teacherTools.map((tool, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-white font-medium">{tool.name}</div>
                          <Badge className="bg-green-600">{tool.status}</Badge>
                        </div>
                        <div className="text-sm text-gray-300 mb-2">{tool.description}</div>
                        <div className="text-xs text-blue-400">{tool.users} active users</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Student Hub Tab */}
          <TabsContent value="student" className="space-y-6">
            <Card className="bg-white/10 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-white">Student Dashboard</CardTitle>
                <CardDescription className="text-gray-300">
                  Track your learning progress and access lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="text-sm text-gray-300">Overall Progress</div>
                    <div className="text-2xl font-bold text-white">73%</div>
                    <Progress value={73} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-300">Lessons Completed</div>
                    <div className="text-2xl font-bold text-white">43/58</div>
                    <Progress value={74} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-300">Current Grade</div>
                    <div className="text-2xl font-bold text-white">A-</div>
                    <div className="text-sm text-green-400">Above average</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curriculumModules.map((module) => (
                <Card key={module.id} className="bg-white/10 border-indigo-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-400" />
                      {module.title}
                      <Badge variant="outline" className="ml-auto text-indigo-400 border-indigo-400">
                        {module.difficulty}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-white">{module.completed}/{module.lessons} lessons</span>
                      </div>
                      <Progress value={(module.completed / module.lessons) * 100} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Duration: {module.duration}</span>
                        <span>{Math.round((module.completed / module.lessons) * 100)}% complete</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Average Session Time</span>
                      <span className="text-white">47 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Weekly Active Users</span>
                      <span className="text-white">892</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Course Completion Rate</span>
                      <span className="text-white">78.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Student Satisfaction</span>
                      <span className="text-green-400">4.8/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Theory Module</span>
                      <span className="text-green-400">+12% completion</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Production Skills</span>
                      <span className="text-blue-400">+8% engagement</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Live Performance</span>
                      <span className="text-purple-400">+15% interest</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Music Business</span>
                      <span className="text-orange-400">+6% enrollment</span>
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