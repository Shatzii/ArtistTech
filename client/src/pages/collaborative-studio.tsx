import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Share, 
  MessageCircle, 
  Settings,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Headphones,
  Monitor,
  Radio,
  Zap,
  Clock
} from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: 'host' | 'collaborator' | 'viewer';
  isOnline: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
  instrument?: string;
  lastActive: string;
}

interface ProjectActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
}

export default function CollaborativeStudio() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [projectActivities, setProjectActivities] = useState<ProjectActivity[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Mock collaborators data
    setCollaborators([
      {
        id: "1",
        name: "Alex Producer",
        avatar: "/api/placeholder/40/40",
        role: "host",
        isOnline: true,
        isVideoOn: true,
        isAudioOn: true,
        instrument: "Piano",
        lastActive: "now"
      },
      {
        id: "2", 
        name: "Sam Vocalist",
        avatar: "/api/placeholder/40/40",
        role: "collaborator",
        isOnline: true,
        isVideoOn: false,
        isAudioOn: true,
        instrument: "Vocals",
        lastActive: "2 min ago"
      },
      {
        id: "3",
        name: "Jordan Drummer",
        avatar: "/api/placeholder/40/40",
        role: "collaborator", 
        isOnline: true,
        isVideoOn: true,
        isAudioOn: false,
        instrument: "Drums",
        lastActive: "5 min ago"
      }
    ]);

    // Mock activity feed
    setProjectActivities([
      {
        id: "1",
        user: "Alex Producer",
        action: "added new track",
        timestamp: "2 minutes ago",
        details: "Lead Synth - Track 3"
      },
      {
        id: "2",
        user: "Sam Vocalist",
        action: "recorded vocals",
        timestamp: "5 minutes ago", 
        details: "Chorus section - Take 2"
      },
      {
        id: "3",
        user: "Jordan Drummer",
        action: "updated arrangement",
        timestamp: "8 minutes ago",
        details: "Extended bridge section"
      }
    ]);

    // Initialize webcam
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.log("Camera access denied:", err));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (isRecording) {
      setRecordingTime(0);
    }
    setIsRecording(!isRecording);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Collaborative Studio</h1>
              <Badge variant="secondary" className="bg-green-600">
                <Radio className="w-3 h-3 mr-1" />
                Live Session
              </Badge>
              <Badge variant="outline">
                <Users className="w-3 h-3 mr-1" />
                3 Active
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Invite
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Conference Grid */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Collaboration</span>
                  <div className="flex items-center space-x-2">
                    {isRecording && (
                      <Badge variant="destructive" className="animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        REC {formatTime(recordingTime)}
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {/* Main user video */}
                  <div className="relative bg-gray-700 rounded-lg overflow-hidden aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
                    />
                    {!isVideoOn && (
                      <div className="w-full h-full flex items-center justify-center">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src="/api/placeholder/64/64" />
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary">You</Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 flex space-x-1">
                      {!isAudioOn && <MicOff className="w-4 h-4 text-red-400" />}
                      {!isVideoOn && <VideoOff className="w-4 h-4 text-red-400" />}
                    </div>
                  </div>

                  {/* Collaborator videos */}
                  {collaborators.filter(c => c.isOnline).map((collaborator) => (
                    <div key={collaborator.id} className="relative bg-gray-700 rounded-lg overflow-hidden aspect-video">
                      {collaborator.isVideoOn ? (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-semibold">Camera Feed</span>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={collaborator.avatar} />
                            <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary">{collaborator.name}</Badge>
                      </div>
                      <div className="absolute bottom-2 right-2 flex space-x-1">
                        {!collaborator.isAudioOn && <MicOff className="w-4 h-4 text-red-400" />}
                        {!collaborator.isVideoOn && <VideoOff className="w-4 h-4 text-red-400" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Video Controls */}
                <div className="flex items-center justify-center space-x-4 p-4 bg-gray-700 rounded-lg">
                  <Button
                    variant={isAudioOn ? "default" : "destructive"}
                    size="sm"
                    onClick={toggleAudio}
                  >
                    {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant={isVideoOn ? "default" : "destructive"}
                    size="sm"
                    onClick={toggleVideo}
                  >
                    {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant={isRecording ? "destructive" : "default"}
                    onClick={toggleRecording}
                  >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Monitor className="w-4 h-4 mr-2" />
                    Share Screen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* DAW Interface */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Project: "Summer Vibes Track"</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Transport Controls */}
                  <div className="flex items-center justify-center space-x-4 p-4 bg-gray-700 rounded-lg">
                    <Button variant="outline" size="sm">
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Pause className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                    <div className="text-sm font-mono bg-gray-600 px-3 py-1 rounded">
                      00:00:00
                    </div>
                    <div className="text-sm text-gray-400">120 BPM</div>
                  </div>

                  {/* Track Grid */}
                  <div className="space-y-2">
                    {[
                      { name: "Lead Vocals", user: "Sam Vocalist", color: "bg-blue-600", active: true },
                      { name: "Piano", user: "Alex Producer", color: "bg-green-600", active: true },
                      { name: "Drums", user: "Jordan Drummer", color: "bg-red-600", active: false },
                      { name: "Bass", user: "Available", color: "bg-gray-600", active: false }
                    ].map((track, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                        <div className={`w-4 h-4 rounded ${track.color}`}></div>
                        <div className="flex-1">
                          <div className="font-medium">{track.name}</div>
                          <div className="text-sm text-gray-400">{track.user}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Headphones className="w-4 h-4" />
                          </Button>
                          {track.active && (
                            <Badge variant="secondary" className="bg-green-600">
                              <Zap className="w-3 h-3 mr-1" />
                              Live
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Collaborators Panel */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Collaborators ({collaborators.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                      </Avatar>
                      {collaborator.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{collaborator.name}</div>
                      <div className="text-sm text-gray-400">{collaborator.instrument}</div>
                    </div>
                    <Badge variant={collaborator.role === 'host' ? 'default' : 'secondary'}>
                      {collaborator.role}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Chat Panel */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  <div className="text-sm">
                    <span className="font-medium text-blue-400">Alex:</span>
                    <span className="ml-2">Let's try the chorus again</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-green-400">Sam:</span>
                    <span className="ml-2">Sounds good! Ready when you are</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-red-400">Jordan:</span>
                    <span className="ml-2">Can we slow down the tempo a bit?</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                  <Button size="sm">Send</Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projectActivities.map((activity) => (
                  <div key={activity.id} className="text-sm">
                    <div className="font-medium text-purple-400">{activity.user}</div>
                    <div className="text-gray-300">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.details}</div>
                    <div className="text-xs text-gray-500">{activity.timestamp}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}