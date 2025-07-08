import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, Video, MessageSquare, Share2, GitBranch, 
  Play, Pause, Mic, MicOff, Camera, CameraOff, 
  Monitor, Edit, Clock, CheckCircle, AlertCircle,
  Settings, Crown, Star, Zap, Volume2, PhoneCall
} from "lucide-react";

export default function CollaborativeStudio() {
  const [activeTab, setActiveTab] = useState("workspace");
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sessionTitle, setSessionTitle] = useState("Collaborative Music Session");

  const collaborators = [
    { 
      id: 1, 
      name: "Alex Rivera", 
      role: "Producer", 
      status: "online", 
      avatar: "/api/placeholder/40/40",
      lastSeen: "now",
      permissions: ["edit", "comment", "share"]
    },
    { 
      id: 2, 
      name: "Sarah Chen", 
      role: "Vocalist", 
      status: "online", 
      avatar: "/api/placeholder/40/40",
      lastSeen: "now",
      permissions: ["edit", "comment"]
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      role: "Mixing Engineer", 
      status: "away", 
      avatar: "/api/placeholder/40/40",
      lastSeen: "5 min ago",
      permissions: ["comment"]
    },
    { 
      id: 4, 
      name: "Emma Wilson", 
      role: "Songwriter", 
      status: "offline", 
      avatar: "/api/placeholder/40/40",
      lastSeen: "2 hours ago",
      permissions: ["edit", "comment", "share"]
    }
  ];

  const chatMessages = [
    { id: 1, user: "Alex Rivera", message: "Hey everyone! Ready to work on the bridge section?", timestamp: "10:30 AM", type: "message" },
    { id: 2, user: "Sarah Chen", message: "Yes! I have some melody ideas to try", timestamp: "10:32 AM", type: "message" },
    { id: 3, user: "System", message: "Mike Johnson joined the session", timestamp: "10:35 AM", type: "system" },
    { id: 4, user: "Mike Johnson", message: "The mix sounds great so far! Maybe we can add some reverb to the vocals?", timestamp: "10:36 AM", type: "message" },
    { id: 5, user: "Alex Rivera", message: "Good idea! I'll adjust that now", timestamp: "10:37 AM", type: "message" },
    { id: 6, user: "System", message: "Project checkpoint saved", timestamp: "10:40 AM", type: "system" }
  ];

  const projectVersions = [
    { id: 1, name: "Version 1.0", author: "Alex Rivera", timestamp: "2 hours ago", status: "active" },
    { id: 2, name: "Version 1.1", author: "Sarah Chen", timestamp: "1 hour ago", status: "merged" },
    { id: 3, name: "Version 1.2", author: "Mike Johnson", timestamp: "30 min ago", status: "pending" },
    { id: 4, name: "Version 1.3", author: "Alex Rivera", timestamp: "10 min ago", status: "current" }
  ];

  const activeEdits = [
    { id: 1, user: "Alex Rivera", action: "Editing track 2 (Bass)", timestamp: "now", color: "bg-blue-500" },
    { id: 2, user: "Sarah Chen", action: "Adding vocals to track 4", timestamp: "30s ago", color: "bg-green-500" },
    { id: 3, user: "Mike Johnson", action: "Adjusting EQ on master", timestamp: "1m ago", color: "bg-purple-500" }
  ];

  const recentActivity = [
    { id: 1, user: "Alex Rivera", action: "Created new project", timestamp: "3 hours ago", icon: GitBranch },
    { id: 2, user: "Sarah Chen", action: "Joined collaboration", timestamp: "2 hours ago", icon: Users },
    { id: 3, user: "Mike Johnson", action: "Added mixing notes", timestamp: "1 hour ago", icon: MessageSquare },
    { id: 4, user: "Emma Wilson", action: "Shared project externally", timestamp: "45 min ago", icon: Share2 },
    { id: 5, user: "Alex Rivera", action: "Saved checkpoint", timestamp: "15 min ago", icon: CheckCircle }
  ];

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsMicOn(true);
    setIsCameraOn(false);
    setIsScreenSharing(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message to chat
      setNewMessage("");
    }
  };

  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const handleToggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'merged': return <GitBranch className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Collaborative Studio</h1>
              <Badge className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                LIVE
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>Session:</span>
              <Input
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isCallActive ? (
              <Button onClick={handleStartCall} className="bg-green-600 hover:bg-green-700">
                <PhoneCall className="w-4 h-4 mr-2" />
                Start Call
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleToggleMic}
                  className={`${isMicOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={handleToggleCamera}
                  className={`${isCameraOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                >
                  {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={handleToggleScreenShare}
                  className={`${isScreenSharing ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button onClick={handleEndCall} className="bg-red-600 hover:bg-red-700">
                  End Call
                </Button>
              </div>
            )}
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Share2 className="w-4 h-4 mr-2" />
              Share Session
            </Button>
          </div>
        </div>

        {/* Main Collaborative Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Workspace */}
          <div className="xl:col-span-3 space-y-6">
            {/* Video Call Interface */}
            {isCallActive && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {collaborators.filter(c => c.status === 'online').map((collaborator) => (
                      <div key={collaborator.id} className="relative bg-gray-900 rounded-lg aspect-video">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Avatar className="w-16 h-16 mx-auto mb-2">
                              <AvatarImage src={collaborator.avatar} />
                              <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="text-white text-sm">{collaborator.name}</p>
                            <p className="text-xs text-gray-400">{collaborator.role}</p>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                          {collaborator.id === 1 && (
                            <>
                              <div className={`w-2 h-2 rounded-full ${isMicOn ? 'bg-green-500' : 'bg-red-500'}`} />
                              <div className={`w-2 h-2 rounded-full ${isCameraOn ? 'bg-blue-500' : 'bg-gray-500'}`} />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shared Workspace */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="workspace">Workspace</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="workspace" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Shared Workspace</CardTitle>
                    <CardDescription className="text-gray-400">
                      Real-time collaborative editing environment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Live Editing Indicators */}
                      <div className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-white text-sm">Live Editing</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {activeEdits.map((edit) => (
                            <div key={edit.id} className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${edit.color}`} />
                              <span className="text-xs text-gray-400">{edit.user}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Workspace Canvas */}
                      <div className="bg-gray-900 rounded-lg p-4 min-h-96">
                        <div className="text-center text-gray-400 mt-32">
                          <Edit className="w-16 h-16 mx-auto mb-4" />
                          <p className="text-lg mb-2">Collaborative Workspace</p>
                          <p className="text-sm">Real-time editing with version control</p>
                        </div>
                      </div>

                      {/* Current Active Edits */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {activeEdits.map((edit) => (
                          <div key={edit.id} className="p-3 bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${edit.color}`} />
                              <span className="text-white text-sm font-medium">{edit.user}</span>
                            </div>
                            <p className="text-xs text-gray-400">{edit.action}</p>
                            <p className="text-xs text-gray-500 mt-1">{edit.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="versions" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Project Versions</CardTitle>
                    <CardDescription className="text-gray-400">
                      Version history and branch management
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {projectVersions.map((version) => (
                        <div key={version.id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(version.status)}
                            <span className="text-white font-medium">{version.name}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-400">by {version.author}</p>
                            <p className="text-xs text-gray-500">{version.timestamp}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${
                              version.status === 'current' ? 'bg-green-600' :
                              version.status === 'pending' ? 'bg-yellow-600' :
                              'bg-blue-600'
                            }`}>
                              {version.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <GitBranch className="w-4 h-4 mr-1" />
                              {version.status === 'current' ? 'Active' : 'Restore'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <activity.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              <span className="font-medium">{activity.user}</span> {activity.action}
                            </p>
                            <p className="text-xs text-gray-400">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collaborators */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Collaborators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center space-x-3 p-2 bg-gray-700 rounded-lg">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={collaborator.avatar} />
                          <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-700 ${getStatusColor(collaborator.status)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{collaborator.name}</div>
                        <div className="text-xs text-gray-400">{collaborator.role}</div>
                      </div>
                      <div className="text-xs text-gray-500">{collaborator.lastSeen}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`p-2 rounded-lg ${
                      message.type === 'system' ? 'bg-blue-600 bg-opacity-20' : 'bg-gray-700'
                    }`}>
                      {message.type === 'system' ? (
                        <div className="text-xs text-blue-400">{message.message}</div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-white">{message.user}</span>
                            <span className="text-xs text-gray-400">{message.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-300">{message.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-gray-700 border-gray-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Session Controls */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Session Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Checkpoint
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Create Branch
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Invite Others
                </Button>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Session Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}