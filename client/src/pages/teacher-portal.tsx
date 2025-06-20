import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Users, 
  MessageCircle, 
  Share, 
  Play,
  Pause,
  Volume2,
  Settings,
  Camera,
  Radio,
  Eye,
  Monitor,
  Music,
  BookOpen,
  Send
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  isOnline: boolean;
  joinedAt?: Date;
  audioEnabled: boolean;
  videoEnabled: boolean;
  instrument?: string;
  currentActivity: string;
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

export default function TeacherPortal() {
  const [isLive, setIsLive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("Introduction to Music Theory");
  const [chatMessage, setChatMessage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Emma Johnson",
      email: "emma.j@student.edu",
      isOnline: true,
      joinedAt: new Date(),
      audioEnabled: true,
      videoEnabled: true,
      instrument: "Piano",
      currentActivity: "Practicing scales"
    },
    {
      id: 2,
      name: "Marcus Chen",
      email: "marcus.c@student.edu",
      isOnline: true,
      joinedAt: new Date(),
      audioEnabled: true,
      videoEnabled: false,
      instrument: "Guitar",
      currentActivity: "Chord progressions"
    },
    {
      id: 3,
      name: "Sofia Rodriguez",
      email: "sofia.r@student.edu",
      isOnline: true,
      joinedAt: new Date(),
      audioEnabled: false,
      videoEnabled: true,
      instrument: "Violin",
      currentActivity: "Reading lesson material"
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james.w@student.edu",
      isOnline: false,
      audioEnabled: false,
      videoEnabled: false,
      instrument: "Drums",
      currentActivity: "Offline"
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
      senderId: "student2",
      senderName: "Marcus Chen",
      senderType: "student",
      message: "Can you play the C major scale example again?",
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
      title: "Emma's Piano Practice",
      type: "audio",
      sharedBy: "Emma Johnson",
      timestamp: new Date(Date.now() - 60000)
    }
  ]);

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

  const startLiveClass = async () => {
    setIsLive(true);
    // Simulate starting live stream
    console.log('Starting live class...');
    
    // Add teacher message
    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: "teacher1",
      senderName: "Ms. Anderson",
      senderType: "teacher",
      message: "📹 Live class has started! Welcome everyone!",
      timestamp: new Date(),
      type: "text"
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const stopLiveClass = () => {
    setIsLive(false);
    setIsRecording(false);
    console.log('Stopping live class...');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    console.log(isRecording ? 'Stopping recording...' : 'Starting recording...');
  };

  const toggleScreenShare = async () => {
    try {
      if (!screenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setScreenSharing(true);
      } else {
        await initializeStream();
        setScreenSharing(false);
      }
    } catch (error) {
      console.error('Screen share failed:', error);
    }
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: "teacher1",
      senderName: "Ms. Anderson",
      senderType: "teacher",
      message: chatMessage,
      timestamp: new Date(),
      type: "text"
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage("");
  };

  const shareContent = (type: 'lesson' | 'audio' | 'project') => {
    const newContent: SharedContent = {
      id: Date.now(),
      title: `New ${type} shared`,
      type,
      sharedBy: "Ms. Anderson",
      timestamp: new Date()
    };
    setSharedContent(prev => [...prev, newContent]);
  };

  const muteStudent = (studentId: number) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, audioEnabled: false }
        : student
    ));
  };

  const requestStudentVideo = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      const message: ChatMessage = {
        id: Date.now(),
        senderId: "teacher1",
        senderName: "Ms. Anderson",
        senderType: "teacher",
        message: `${student.name}, please turn on your video for the demonstration.`,
        timestamp: new Date(),
        type: "text"
      };
      setChatMessages(prev => [...prev, message]);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Video className="text-green-400" size={24} />
            <span className="font-bold text-lg">Teacher Portal</span>
          </div>
          
          <Badge variant={isLive ? "default" : "secondary"} className={isLive ? "bg-red-500" : ""}>
            {isLive ? "🔴 LIVE" : "Offline"}
          </Badge>
          
          <div className="text-sm text-gray-400">
            Topic: {currentTopic}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {students.filter(s => s.isOnline).length} students online
          </Badge>
          <Button variant="outline" size="sm">
            <Settings size={16} className="mr-1" />
            Settings
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Streaming Area */}
          <div className="flex-1 bg-gray-800 p-4">
            <div className="h-full relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
                style={{ transform: screenSharing ? 'none' : 'scaleX(-1)' }}
              />
              
              {/* Stream Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <Button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  variant={audioEnabled ? "secondary" : "destructive"}
                  size="sm"
                >
                  {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                </Button>
                
                <Button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  variant={videoEnabled ? "secondary" : "destructive"}
                  size="sm"
                >
                  {videoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
                </Button>
                
                <Button
                  onClick={toggleScreenShare}
                  variant={screenSharing ? "default" : "secondary"}
                  size="sm"
                >
                  <Monitor size={16} />
                </Button>
                
                <Button
                  onClick={toggleRecording}
                  variant={isRecording ? "destructive" : "secondary"}
                  size="sm"
                >
                  {isRecording ? <Pause size={16} /> : <Radio size={16} />}
                </Button>
              </div>

              {/* Live Indicator */}
              {isLive && (
                <div className="absolute top-4 left-4 bg-red-500 px-2 py-1 rounded text-sm font-bold animate-pulse">
                  🔴 LIVE
                </div>
              )}

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-600 px-2 py-1 rounded text-sm">
                  ⏺ Recording
                </div>
              )}
            </div>
          </div>

          {/* Class Controls */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Update lesson topic..."
                  value={currentTopic}
                  onChange={(e) => setCurrentTopic(e.target.value)}
                  className="bg-gray-700 border-gray-600 w-64"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                {!isLive ? (
                  <Button onClick={startLiveClass} className="bg-green-600 hover:bg-green-700">
                    <Play size={16} className="mr-2" />
                    Start Live Class
                  </Button>
                ) : (
                  <Button onClick={stopLiveClass} variant="destructive">
                    <Pause size={16} className="mr-2" />
                    End Class
                  </Button>
                )}
                
                <Button onClick={() => shareContent('lesson')} variant="outline">
                  <Share size={16} className="mr-2" />
                  Share Content
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Students & Chat */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Students Panel */}
          <div className="flex-1">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold flex items-center">
                <Users size={16} className="mr-2" />
                Students ({students.filter(s => s.isOnline).length}/{students.length})
              </h3>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {students.map((student) => (
                  <Card 
                    key={student.id} 
                    className={`bg-gray-700 border-gray-600 cursor-pointer transition-colors ${
                      selectedStudent === student.id ? 'bg-blue-600/20 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${student.isOnline ? 'bg-green-400' : 'bg-gray-500'}`} />
                          <span className="text-sm font-medium">{student.name}</span>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              muteStudent(student.id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="p-1"
                          >
                            {student.audioEnabled ? <Mic size={12} /> : <MicOff size={12} />}
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              requestStudentVideo(student.id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="p-1"
                          >
                            {student.videoEnabled ? <Video size={12} /> : <Eye size={12} />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        <div>Instrument: {student.instrument}</div>
                        <div>Activity: {student.currentActivity}</div>
                        {student.joinedAt && (
                          <div>Joined: {student.joinedAt.toLocaleTimeString()}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Panel */}
          <div className="h-80 border-t border-gray-700 flex flex-col">
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