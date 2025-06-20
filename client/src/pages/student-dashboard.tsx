import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Users, 
  MessageCircle, 
  Share, 
  Play,
  Volume2,
  VolumeX,
  Hand,
  BookOpen,
  Music,
  Send,
  Eye,
  EyeOff,
  Radio
} from "lucide-react";
import { useLocation } from "wouter";

interface ClassroomInfo {
  id: string;
  name: string;
  teacher: string;
  topic: string;
  isLive: boolean;
  participants: number;
  startTime: Date;
}

interface ChatMessage {
  id: number;
  senderId: string;
  senderName: string;
  senderType: 'teacher' | 'student';
  message: string;
  timestamp: Date;
  type: 'text' | 'audio' | 'share';
}

interface SharedContent {
  id: number;
  title: string;
  type: 'project' | 'audio' | 'lesson';
  sharedBy: string;
  timestamp: Date;
  url?: string;
}

export default function StudentDashboard() {
  const [, setLocation] = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [volumeLevel, setVolumeLevel] = useState(0.8);
  const [isWatching, setIsWatching] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const teacherVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [currentClassroom, setCurrentClassroom] = useState<ClassroomInfo>({
    id: "music-theory-101",
    name: "Music Theory Fundamentals",
    teacher: "Ms. Anderson",
    topic: "Major Scales and Chord Progressions",
    isLive: true,
    participants: 4,
    startTime: new Date(Date.now() - 1200000) // Started 20 minutes ago
  });

  const [availableClassrooms] = useState<ClassroomInfo[]>([
    {
      id: "music-theory-101",
      name: "Music Theory Fundamentals",
      teacher: "Ms. Anderson",
      topic: "Major Scales and Chord Progressions",
      isLive: true,
      participants: 4,
      startTime: new Date(Date.now() - 1200000)
    },
    {
      id: "piano-basics",
      name: "Piano Basics",
      teacher: "Mr. Johnson",
      topic: "Hand Position and Finger Exercises",
      isLive: false,
      participants: 0,
      startTime: new Date(Date.now() + 3600000) // Starts in 1 hour
    },
    {
      id: "guitar-advanced",
      name: "Advanced Guitar Techniques",
      teacher: "Ms. Garcia",
      topic: "Fingerpicking Patterns",
      isLive: false,
      participants: 0,
      startTime: new Date(Date.now() + 7200000) // Starts in 2 hours
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      senderId: "teacher1",
      senderName: "Ms. Anderson",
      senderType: "teacher",
      message: "Welcome everyone! Today we're covering major scales and chord progressions.",
      timestamp: new Date(Date.now() - 300000),
      type: "text"
    },
    {
      id: 2,
      senderId: "student1",
      senderName: "Emma Johnson",
      senderType: "student",
      message: "Excited to learn about chord progressions!",
      timestamp: new Date(Date.now() - 240000),
      type: "text"
    },
    {
      id: 3,
      senderId: "teacher1",
      senderName: "Ms. Anderson",
      senderType: "teacher",
      message: "Let's start with the C major scale. Everyone try playing it on your instruments.",
      timestamp: new Date(Date.now() - 120000),
      type: "text"
    }
  ]);

  const [sharedContent, setSharedContent] = useState<SharedContent[]>([
    {
      id: 1,
      title: "C Major Scale Exercise",
      type: "lesson",
      sharedBy: "Ms. Anderson",
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: 2,
      title: "Chord Progression Chart",
      type: "lesson",
      sharedBy: "Ms. Anderson",
      timestamp: new Date(Date.now() - 120000)
    }
  ]);

  const [myProgress] = useState({
    lessonsCompleted: 12,
    totalLessons: 20,
    practiceHours: 25,
    currentStreak: 7
  });

  useEffect(() => {
    initializeStream();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to initialize stream:', error);
    }
  };

  const joinClassroom = async (classroomId: string) => {
    setIsConnected(true);
    setIsWatching(true);
    console.log(`Joining classroom: ${classroomId}`);
    
    // Simulate receiving teacher's video stream
    // In a real implementation, this would connect to the teacher's stream
    
    // Add join message to chat
    const joinMessage: ChatMessage = {
      id: Date.now(),
      senderId: "currentStudent",
      senderName: "You",
      senderType: "student",
      message: "👋 Joined the class",
      timestamp: new Date(),
      type: "text"
    };
    setChatMessages(prev => [...prev, joinMessage]);
  };

  const leaveClassroom = () => {
    setIsConnected(false);
    setIsWatching(false);
    setAudioEnabled(false);
    setVideoEnabled(false);
    setHandRaised(false);
    console.log('Leaving classroom...');
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
    }
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
    }
  };

  const raiseHand = () => {
    setHandRaised(!handRaised);
    const handMessage: ChatMessage = {
      id: Date.now(),
      senderId: "currentStudent",
      senderName: "You",
      senderType: "student",
      message: handRaised ? "✋ Lowered hand" : "✋ Raised hand",
      timestamp: new Date(),
      type: "text"
    };
    setChatMessages(prev => [...prev, handMessage]);
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: "currentStudent",
      senderName: "You",
      senderType: "student",
      message: chatMessage,
      timestamp: new Date(),
      type: "text"
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage("");
  };

  const shareMyWork = () => {
    const newContent: SharedContent = {
      id: Date.now(),
      title: "My Practice Recording",
      type: "audio",
      sharedBy: "You",
      timestamp: new Date()
    };
    setSharedContent(prev => [...prev, newContent]);
    
    const shareMessage: ChatMessage = {
      id: Date.now(),
      senderId: "currentStudent",
      senderName: "You",
      senderType: "student",
      message: "🎵 Shared my practice recording",
      timestamp: new Date(),
      type: "share"
    };
    setChatMessages(prev => [...prev, shareMessage]);
  };

  if (!isConnected) {
    return (
      <div className="h-screen bg-gray-900 text-white p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Music className="text-blue-400" size={32} />
              <div>
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
                <p className="text-gray-400">Welcome back! Ready to learn music?</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setLocation('/login')}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Lessons Completed</p>
                  <p className="text-2xl font-bold">{myProgress.lessonsCompleted}/{myProgress.totalLessons}</p>
                </div>
                <BookOpen className="text-blue-400" size={24} />
              </div>
              <Progress value={(myProgress.lessonsCompleted / myProgress.totalLessons) * 100} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Practice Hours</p>
                  <p className="text-2xl font-bold">{myProgress.practiceHours}h</p>
                </div>
                <Music className="text-green-400" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold">{myProgress.currentStreak} days</p>
                </div>
                <Radio className="text-orange-400" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Next Class</p>
                  <p className="text-sm font-bold">In 40 minutes</p>
                </div>
                <Video className="text-purple-400" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Classrooms */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Classes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableClassrooms.map((classroom) => (
              <Card key={classroom.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{classroom.name}</CardTitle>
                    <Badge 
                      variant={classroom.isLive ? "default" : "secondary"}
                      className={classroom.isLive ? "bg-red-500" : ""}
                    >
                      {classroom.isLive ? "🔴 LIVE" : "Scheduled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Teacher</p>
                      <p className="font-medium">{classroom.teacher}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400">Topic</p>
                      <p className="text-sm">{classroom.topic}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-sm">{classroom.participants} students</span>
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        {classroom.isLive ? 
                          `Started ${Math.floor((Date.now() - classroom.startTime.getTime()) / 60000)} min ago` :
                          `Starts ${classroom.startTime.toLocaleTimeString()}`
                        }
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => joinClassroom(classroom.id)}
                      disabled={!classroom.isLive}
                      className="w-full"
                      variant={classroom.isLive ? "default" : "secondary"}
                    >
                      {classroom.isLive ? "Join Class" : "Class Not Started"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => setLocation('/mpc')}
            variant="outline" 
            className="h-16"
          >
            <Music className="mr-2" size={20} />
            Practice with MPC Studio
          </Button>
          
          <Button 
            onClick={() => setLocation('/curriculum')}
            variant="outline" 
            className="h-16"
          >
            <BookOpen className="mr-2" size={20} />
            Browse Curriculum
          </Button>
          
          <Button 
            onClick={() => setLocation('/lesson')}
            variant="outline" 
            className="h-16"
          >
            <Video className="mr-2" size={20} />
            Private Lessons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Video className="text-blue-400" size={24} />
            <span className="font-bold">{currentClassroom.name}</span>
          </div>
          
          <Badge variant="default" className="bg-red-500">
            🔴 LIVE
          </Badge>
          
          <div className="text-sm text-gray-400">
            {currentClassroom.teacher} • {currentClassroom.topic}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {currentClassroom.participants} students
          </Badge>
          <Button onClick={leaveClassroom} variant="destructive" size="sm">
            Leave Class
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Teacher's Stream */}
          <div className="flex-1 bg-black relative">
            <video
              ref={teacherVideoRef}
              autoPlay
              className="w-full h-full object-cover"
            />
            
            {/* Stream Info Overlay */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-2 rounded">
              <p className="text-sm font-medium">{currentClassroom.teacher}</p>
              <p className="text-xs text-gray-300">{currentClassroom.topic}</p>
            </div>
            
            {/* Volume Control */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 px-3 py-2 rounded flex items-center space-x-2">
              <Volume2 size={16} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volumeLevel}
                onChange={(e) => setVolumeLevel(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
          
          {/* Student Controls */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* My Video Preview */}
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-32 h-24 bg-gray-700 rounded object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <div className="absolute bottom-1 left-1 text-xs bg-black bg-opacity-50 px-1 rounded">
                    You
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium">You're in the class</p>
                  <p className="text-gray-400">Audio: {audioEnabled ? 'On' : 'Muted'} • Video: {videoEnabled ? 'On' : 'Off'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={toggleAudio}
                  variant={audioEnabled ? "secondary" : "destructive"}
                  size="sm"
                >
                  {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                </Button>
                
                <Button
                  onClick={toggleVideo}
                  variant={videoEnabled ? "secondary" : "destructive"}
                  size="sm"
                >
                  {videoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
                </Button>
                
                <Button
                  onClick={raiseHand}
                  variant={handRaised ? "default" : "outline"}
                  size="sm"
                  className={handRaised ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                >
                  <Hand size={16} />
                </Button>
                
                <Button onClick={shareMyWork} variant="outline" size="sm">
                  <Share size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chat & Content */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Shared Content */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-semibold mb-3">Shared Content</h3>
            <div className="space-y-2">
              {sharedContent.slice(-3).map((content) => (
                <div key={content.id} className="bg-gray-700 p-2 rounded text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{content.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {content.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    by {content.sharedBy} • {content.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold flex items-center">
                <MessageCircle size={16} className="mr-2" />
                Class Chat
              </h3>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge 
                        variant={msg.senderType === 'teacher' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {msg.senderName}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{msg.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  className="bg-gray-700 border-gray-600 flex-1"
                />
                <Button onClick={sendChatMessage} size="sm">
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}