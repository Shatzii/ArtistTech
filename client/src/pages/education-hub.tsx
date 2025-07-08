
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, Users, BookOpen, Video, Music, Award, 
  TrendingUp, Calendar, Clock, Target, Star, Trophy,
  Play, Pause, CheckCircle, Lock, Unlock, Brain,
  Headphones, Mic, Piano, Guitar, Drums, Violin,
  FileText, MessageCircle, Settings, ChevronRight
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  progress: number;
  lastActive: Date;
  currentCourse: string;
  completedLessons: number;
  totalLessons: number;
}

interface Course {
  id: string;
  title: string;
  grade: string;
  instrument: string;
  totalLessons: number;
  completedLessons: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  enrolledStudents: number;
  averageScore: number;
}

interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  startTime: Date;
  duration: number;
  participants: number;
  maxParticipants: number;
  instrument: string;
  isLive: boolean;
}

export default function EducationHub() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [userRole, setUserRole] = useState<'admin' | 'teacher' | 'student'>('admin');

  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Emma Johnson',
      email: 'emma@school.edu',
      grade: 'Grade 5',
      progress: 85,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      currentCourse: 'Piano Fundamentals',
      completedLessons: 12,
      totalLessons: 16
    },
    {
      id: '2',
      name: 'Marcus Chen',
      email: 'marcus@school.edu',
      grade: 'Grade 7',
      progress: 92,
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
      currentCourse: 'Guitar Intermediate',
      completedLessons: 18,
      totalLessons: 20
    },
    {
      id: '3',
      name: 'Sofia Rodriguez',
      email: 'sofia@school.edu',
      grade: 'Grade 4',
      progress: 78,
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
      currentCourse: 'Music Theory Basics',
      completedLessons: 8,
      totalLessons: 12
    }
  ]);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Piano Fundamentals',
      grade: 'K-5',
      instrument: 'Piano',
      totalLessons: 16,
      completedLessons: 12,
      difficulty: 'beginner',
      instructor: 'Ms. Anderson',
      enrolledStudents: 24,
      averageScore: 87
    },
    {
      id: '2',
      title: 'Guitar Intermediate',
      grade: '6-8',
      instrument: 'Guitar',
      totalLessons: 20,
      completedLessons: 15,
      difficulty: 'intermediate',
      instructor: 'Mr. Johnson',
      enrolledStudents: 18,
      averageScore: 91
    },
    {
      id: '3',
      title: 'Music Theory Advanced',
      grade: '9-12',
      instrument: 'Theory',
      totalLessons: 24,
      completedLessons: 8,
      difficulty: 'advanced',
      instructor: 'Dr. Williams',
      enrolledStudents: 12,
      averageScore: 89
    }
  ]);

  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([
    {
      id: '1',
      title: 'Piano Practice Session',
      instructor: 'Ms. Anderson',
      startTime: new Date(Date.now() + 30 * 60 * 1000),
      duration: 60,
      participants: 8,
      maxParticipants: 12,
      instrument: 'Piano',
      isLive: false
    },
    {
      id: '2',
      title: 'Guitar Masterclass',
      instructor: 'Mr. Johnson',
      startTime: new Date(Date.now() - 15 * 60 * 1000),
      duration: 90,
      participants: 15,
      maxParticipants: 20,
      instrument: 'Guitar',
      isLive: true
    }
  ]);

  const schoolStats = {
    totalStudents: 156,
    totalCourses: 24,
    totalInstructors: 8,
    activeClasses: 3,
    completionRate: 88,
    averageGrade: 87,
    totalLessonsCompleted: 1247,
    streamingHours: 342
  };

  const getInstrumentIcon = (instrument: string) => {
    switch (instrument.toLowerCase()) {
      case 'piano': return Piano;
      case 'guitar': return Guitar;
      case 'drums': return Drums;
      case 'violin': return Violin;
      case 'theory': return BookOpen;
      default: return Music;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const formatUpcomingTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 0) return 'Started';
    if (minutes < 60) return `Starts in ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `Starts in ${hours}h ${minutes % 60}m`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <GraduationCap className="text-blue-400" size={32} />
              <div>
                <h1 className="text-2xl font-bold">ProStudio Education Hub</h1>
                <p className="text-gray-400">Complete K-12 Music Education Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
              </Badge>
              <Button onClick={() => window.location.href = '/'} variant="outline">
                Back to Studios
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Users className="text-blue-400 mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-blue-400">{schoolStats.totalStudents}</div>
                <div className="text-xs text-gray-400">Students</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <BookOpen className="text-green-400 mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-green-400">{schoolStats.totalCourses}</div>
                <div className="text-xs text-gray-400">Courses</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <GraduationCap className="text-purple-400 mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-purple-400">{schoolStats.totalInstructors}</div>
                <div className="text-xs text-gray-400">Instructors</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Video className="text-red-400 mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-red-400">{schoolStats.activeClasses}</div>
                <div className="text-xs text-gray-400">Live Classes</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Target className="text-orange-400 mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-orange-400">{schoolStats.completionRate}%</div>
                <div className="text-xs text-gray-400">Completion</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Star className="text-yellow-400 mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-yellow-400">{schoolStats.averageGrade}%</div>
                <div className="text-xs text-gray-400">Avg Grade</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Trophy className="text-cyan-400 mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-cyan-400">{schoolStats.totalLessonsCompleted}</div>
                <div className="text-xs text-gray-400">Lessons</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Clock className="text-pink-400 mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-pink-400">{schoolStats.streamingHours}h</div>
                <div className="text-xs text-gray-400">Streaming</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="live">Live Classes</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 text-blue-400" size={20} />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">{student.name.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{student.name}</div>
                              <div className="text-xs text-gray-400">{student.currentCourse}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">{student.progress}%</div>
                            <div className="text-xs text-gray-400">{formatTimeAgo(student.lastActive)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Live Classes */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 text-red-400" size={20} />
                    Live Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {liveClasses.map((liveClass) => {
                        const IconComponent = getInstrumentIcon(liveClass.instrument);
                        return (
                          <div key={liveClass.id} className="p-3 bg-gray-900 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <IconComponent size={16} className="text-blue-400" />
                                <span className="font-medium">{liveClass.title}</span>
                                {liveClass.isLive && (
                                  <Badge className="bg-red-500 text-white">LIVE</Badge>
                                )}
                              </div>
                              <Button size="sm" variant={liveClass.isLive ? "default" : "outline"}>
                                {liveClass.isLive ? "Join" : "Schedule"}
                              </Button>
                            </div>
                            <div className="text-sm text-gray-400 mb-2">
                              Instructor: {liveClass.instructor}
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>{formatUpcomingTime(liveClass.startTime)}</span>
                              <span>{liveClass.participants}/{liveClass.maxParticipants} participants</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Student Management</h2>
                <div className="flex items-center space-x-4">
                  <Input placeholder="Search students..." className="bg-gray-800 border-gray-700" />
                  <Button>Add Student</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <Card key={student.id} className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold">{student.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{student.name}</CardTitle>
                          <p className="text-sm text-gray-400">{student.grade}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Current Course</span>
                          <span className="text-blue-400">{student.currentCourse}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{student.progress}%</span>
                        </div>
                        <Progress value={student.progress} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Lessons Completed</span>
                        <span>{student.completedLessons}/{student.totalLessons}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Last Active</span>
                        <span>{formatTimeAgo(student.lastActive)}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Course Management</h2>
                <div className="flex items-center space-x-4">
                  <Input placeholder="Search courses..." className="bg-gray-800 border-gray-700" />
                  <Button>Create Course</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => {
                  const IconComponent = getInstrumentIcon(course.instrument);
                  return (
                    <Card key={course.id} className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent size={20} className="text-blue-400" />
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                          </div>
                          <Badge variant="outline">{course.grade}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Instructor</span>
                          <span className="text-blue-400">{course.instructor}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Difficulty</span>
                          <Badge 
                            variant="outline" 
                            className={
                              course.difficulty === 'beginner' ? 'text-green-400 border-green-400' :
                              course.difficulty === 'intermediate' ? 'text-yellow-400 border-yellow-400' :
                              'text-red-400 border-red-400'
                            }
                          >
                            {course.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Students Enrolled</span>
                          <span>{course.enrolledStudents}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Average Score</span>
                          <span>{course.averageScore}%</span>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                          </div>
                          <Progress value={(course.completedLessons / course.totalLessons) * 100} className="h-2" />
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Edit Course
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="live">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Live Classes</h2>
                <div className="flex items-center space-x-4">
                  <Button variant="outline">
                    <Calendar className="mr-2" size={16} />
                    Schedule Class
                  </Button>
                  <Button>
                    <Video className="mr-2" size={16} />
                    Start Live Class
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveClasses.map((liveClass) => {
                  const IconComponent = getInstrumentIcon(liveClass.instrument);
                  return (
                    <Card key={liveClass.id} className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent size={24} className="text-blue-400" />
                            <div>
                              <CardTitle className="text-lg">{liveClass.title}</CardTitle>
                              <p className="text-sm text-gray-400">with {liveClass.instructor}</p>
                            </div>
                          </div>
                          {liveClass.isLive && (
                            <Badge className="bg-red-500 text-white animate-pulse">
                              🔴 LIVE
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Duration:</span>
                            <div>{liveClass.duration} minutes</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Participants:</span>
                            <div>{liveClass.participants}/{liveClass.maxParticipants}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <div className={liveClass.isLive ? "text-red-400" : "text-blue-400"}>
                              {liveClass.isLive ? "Live Now" : formatUpcomingTime(liveClass.startTime)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Instrument:</span>
                            <div>{liveClass.instrument}</div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            variant={liveClass.isLive ? "default" : "outline"}
                          >
                            {liveClass.isLive ? "Join Class" : "Edit Schedule"}
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle size={16} />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="curriculum">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Curriculum Builder</h2>
                <Button onClick={() => window.location.href = '/curriculum'}>
                  <BookOpen className="mr-2" size={16} />
                  Full Curriculum View
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 text-green-400" size={20} />
                      Elementary (K-5)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Modules</span>
                        <span>12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span>8</span>
                      </div>
                      <Progress value={67} className="h-2" />
                      <Button className="w-full mt-3" size="sm">
                        View Elementary Curriculum
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 text-yellow-400" size={20} />
                      Middle School (6-8)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Modules</span>
                        <span>16</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span>12</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <Button className="w-full mt-3" size="sm">
                        View Middle School Curriculum
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 text-red-400" size={20} />
                      High School (9-12)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Modules</span>
                        <span>20</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span>15</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <Button className="w-full mt-3" size="sm">
                        View High School Curriculum
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="mb-2" size={24} />
                    Student Dashboard
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Video className="mb-2" size={24} />
                    Teacher Portal
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <BookOpen className="mb-2" size={24} />
                    Lesson Builder
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Award className="mb-2" size={24} />
                    Assessments
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Student Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Average Score</span>
                        <span className="text-green-400">{schoolStats.averageGrade}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completion Rate</span>
                        <span className="text-blue-400">{schoolStats.completionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Students</span>
                        <span className="text-purple-400">{schoolStats.totalStudents}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Course Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Courses</span>
                        <span className="text-green-400">{schoolStats.totalCourses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Instructors</span>
                        <span className="text-blue-400">{schoolStats.totalInstructors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Streaming Hours</span>
                        <span className="text-purple-400">{schoolStats.streamingHours}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Lessons</span>
                        <span className="text-green-400">{schoolStats.totalLessonsCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Live Classes</span>
                        <span className="text-blue-400">{schoolStats.activeClasses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Session Time</span>
                        <span className="text-purple-400">45m</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
