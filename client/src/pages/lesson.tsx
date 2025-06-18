import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Users
} from "lucide-react";
import VoiceCommandPanel from "@/components/lesson/VoiceCommandPanel";
import VideoMonitoringPanel from "@/components/lesson/VideoMonitoringPanel";
import ExercisePanel from "@/components/lesson/ExercisePanel";
import ChatPanel from "@/components/lesson/ChatPanel";

export default function Lesson() {
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<number | null>(null);
  const [lessonStatus, setLessonStatus] = useState<'scheduled' | 'in_progress' | 'completed'>('scheduled');
  
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
    // TODO: Implement actual video toggle
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    // TODO: Implement actual audio toggle
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
          <VoiceCommandPanel lessonId={lessonData.id} />
          
          {/* Exercise Panel */}
          <ExercisePanel 
            currentExercise={currentExercise}
            onExerciseSelect={setCurrentExercise}
          />
          
          {/* Video Monitoring Panel */}
          <VideoMonitoringPanel lessonId={lessonData.id} />
          
          {/* Chat Panel */}
          <ChatPanel lessonId={lessonData.id} />
        </div>
      </div>
    </div>
  );
}