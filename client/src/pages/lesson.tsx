import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageSquare,
  Phone,
  PhoneOff,
  Settings,
  Camera,
  Monitor,
  Users,
  Play,
  Pause,
  BookOpen,
  Eye,
  Zap,
  Send,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";

export default function Lesson() {
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<number | null>(null);
  const [lessonStatus, setLessonStatus] = useState<'scheduled' | 'in_progress' | 'completed'>('scheduled');
  const [chatMessage, setChatMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);

  // Mock lesson data
  const lessonData = {
    id: 1,
    title: "Piano Basics - C Major Scale",
    teacher: "Sarah Johnson",
    student: "Emma Wilson",
    scheduledAt: new Date(),
    duration: 30,
    status: lessonStatus
  };

  const exercises = [
    {
      id: 1,
      title: "C Major Scale",
      description: "Learn to play the C major scale with proper fingering",
      difficulty: 'easy' as const,
      completed: false
    },
    {
      id: 2,
      title: "Hand Position",
      description: "Correct hand posture and finger placement",
      difficulty: 'easy' as const,
      completed: true
    },
    {
      id: 3,
      title: "Simple Chords",
      description: "Basic C, F, and G major chords",
      difficulty: 'medium' as const,
      completed: false
    }
  ];

  const chatMessages = [
    {
      id: 1,
      sender: 'teacher',
      name: 'Sarah Johnson',
      message: 'Welcome to your piano lesson! Today we\'ll work on the C major scale.',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      sender: 'student',
      name: 'Emma Wilson', 
      message: 'Thank you! I\'ve been practicing since last week.',
      timestamp: new Date(Date.now() - 240000)
    }
  ];

  useEffect(() => {
    // Initialize media devices
    initializeMediaDevices();
  }, []);

  const initializeMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Failed to access media devices:", error);
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error("Failed to start screen sharing:", error);
    }
  };

  const startLesson = () => {
    setIsConnected(true);
    setLessonStatus('in_progress');
  };

  const endLesson = () => {
    setIsConnected(false);
    setLessonStatus('completed');
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      // Handle message sending
      setChatMessage("");
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Users className="text-blue-400" size={24} />
          <div>
            <h1 className="text-lg font-semibold">{lessonData.title}</h1>
            <p className="text-sm text-gray-400">
              Teacher: {lessonData.teacher} • Student: {lessonData.student}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={lessonStatus === 'in_progress' ? 'default' : 'secondary'}>
            {lessonStatus.replace('_', ' ').toUpperCase()}
          </Badge>
          <span className="text-sm text-gray-400">
            {lessonData.duration} min
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Video and Controls */}
        <div className="w-2/3 flex flex-col">
          {/* Video Area */}
          <div className="flex-1 p-4 grid grid-cols-2 gap-4">
            {/* Teacher Video */}
            <Card className="bg-gray-800 border-gray-700 relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Teacher - {lessonData.teacher}</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <video
                  ref={remoteVideoRef}
                  className="w-full h-48 bg-gray-900 rounded object-cover"
                  autoPlay
                  playsInline
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Badge variant="secondary" className="text-xs">
                    <Video size={12} className="mr-1" />
                    HD
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Student Video */}
            <Card className="bg-gray-800 border-gray-700 relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Student - {lessonData.student}</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <video
                  ref={localVideoRef}
                  className="w-full h-48 bg-gray-900 rounded object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Badge variant="secondary" className="text-xs">
                    <Camera size={12} className="mr-1" />
                    You
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Screen Share Area */}
            {isScreenSharing && (
              <Card className="bg-gray-800 border-gray-700 col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Monitor size={16} className="mr-2" />
                    Screen Share - Piano Tutorial
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <video
                    ref={screenShareRef}
                    className="w-full h-64 bg-gray-900 rounded object-cover"
                    autoPlay
                    playsInline
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Control Bar */}
          <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-center space-x-4">
            <Button
              variant={isAudioOn ? "default" : "destructive"}
              size="lg"
              onClick={toggleAudio}
              className="rounded-full w-12 h-12"
            >
              {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
            </Button>

            <Button
              variant={isVideoOn ? "default" : "destructive"}
              size="lg"
              onClick={toggleVideo}
              className="rounded-full w-12 h-12"
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </Button>

            <Button
              variant={isScreenSharing ? "secondary" : "outline"}
              size="lg"
              onClick={toggleScreenShare}
              className="rounded-full w-12 h-12"
            >
              <Monitor size={20} />
            </Button>

            {!isConnected ? (
              <Button
                onClick={startLesson}
                className="bg-green-600 hover:bg-green-700 px-8"
                size="lg"
              >
                <Phone className="mr-2" size={20} />
                Start Lesson
              </Button>
            ) : (
              <Button
                onClick={endLesson}
                variant="destructive"
                size="lg"
                className="px-8"
              >
                <PhoneOff className="mr-2" size={20} />
                End Lesson
              </Button>
            )}

            <Button variant="outline" size="lg" className="rounded-full w-12 h-12">
              <Settings size={20} />
            </Button>
          </div>
        </div>

        {/* Right Panel - Tools and Chat */}
        <div className="w-1/3 bg-gray-800 border-l border-gray-700 flex flex-col">
          
          {/* Voice Commands Panel */}
          <Card className="bg-gray-900 border-gray-700 mb-4 mx-4 mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="mr-2 text-yellow-400" size={16} />
                  Voice Commands
                </div>
                <Badge variant={isListening ? "default" : "secondary"} className="text-xs">
                  {isListening ? "Listening" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "default"}
                size="sm"
                className="w-full"
              >
                {isListening ? <MicOff size={16} className="mr-2" /> : <Mic size={16} className="mr-2" />}
                {isListening ? "Stop Listening" : "Start Voice Commands"}
              </Button>
              <div className="text-xs text-gray-400">
                Try saying: "play the scale", "stop playing", "next exercise"
              </div>
            </CardContent>
          </Card>

          {/* Exercise Panel */}
          <Card className="bg-gray-900 border-gray-700 mb-4 mx-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <BookOpen className="mr-2 text-green-400" size={16} />
                Lesson Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className={`p-2 rounded cursor-pointer border ${
                        currentExercise === exercise.id
                          ? 'bg-blue-600 bg-opacity-20 border-blue-500'
                          : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                      }`}
                      onClick={() => setCurrentExercise(exercise.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {exercise.completed ? (
                            <CheckCircle size={12} className="text-green-400 mr-2" />
                          ) : (
                            <Clock size={12} className="text-gray-400 mr-2" />
                          )}
                          <span className="text-xs font-medium">{exercise.title}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {exercise.difficulty}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {exercise.description}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Video Analysis Panel */}
          <Card className="bg-gray-900 border-gray-700 mb-4 mx-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="mr-2 text-purple-400" size={16} />
                  Video Analysis
                </div>
                <Badge variant={isRecording ? "default" : "secondary"} className="text-xs">
                  {isRecording ? "Recording" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "default"}
                size="sm"
                className="w-full"
              >
                {isRecording ? "Stop Analysis" : "Start Analysis"}
              </Button>
              {isRecording && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400">Real-time feedback:</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Hand Position</span>
                      <span className="text-green-400">Good</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Posture</span>
                      <span className="text-yellow-400">Fair</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Timing</span>
                      <span className="text-green-400">On Beat</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Panel */}
          <Card className="bg-gray-900 border-gray-700 mx-4 mb-4 flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <MessageSquare className="mr-2 text-blue-400" size={16} />
                Lesson Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 mb-3">
                <div className="space-y-2">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded text-xs ${
                        msg.sender === 'teacher'
                          ? 'bg-blue-600 bg-opacity-20 border border-blue-500'
                          : 'bg-green-600 bg-opacity-20 border border-green-500'
                      }`}
                    >
                      <div className="font-medium mb-1">{msg.name}</div>
                      <div className="text-gray-300">{msg.message}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border-gray-600 text-white text-xs"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} size="sm">
                  <Send size={12} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}