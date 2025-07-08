import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Video, Palette, Users, Play, Pause, Square, RotateCcw, Volume2, Mic, Camera, Brush } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function CreativeStudiosHub() {
  const [activeTab, setActiveTab] = useState("music");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentProject, setCurrentProject] = useState("Untitled Project");

  const { data: projectStats } = useQuery({
    queryKey: ["/api/studios/project-stats"],
    enabled: true
  });

  const { data: recentProjects } = useQuery({
    queryKey: ["/api/studios/recent-projects"],
    enabled: true
  });

  const musicProjects = [
    { id: 1, name: "Summer Vibes EP", type: "Album", progress: 85, lastEdited: "2 hours ago", collaborators: 3 },
    { id: 2, name: "Night Drive", type: "Single", progress: 62, lastEdited: "1 day ago", collaborators: 1 },
    { id: 3, name: "Electronic Dreams", type: "Remix", progress: 93, lastEdited: "3 days ago", collaborators: 2 }
  ];

  const videoProjects = [
    { id: 1, name: "Music Video - Summer Vibes", type: "Music Video", progress: 78, lastEdited: "4 hours ago", duration: "3:42" },
    { id: 2, name: "Behind the Scenes", type: "Documentary", progress: 45, lastEdited: "2 days ago", duration: "8:15" },
    { id: 3, name: "Live Performance", type: "Concert", progress: 89, lastEdited: "1 week ago", duration: "45:30" }
  ];

  const visualArtProjects = [
    { id: 1, name: "Album Cover - Summer Vibes", type: "Cover Art", progress: 95, lastEdited: "1 hour ago", dimensions: "3000x3000" },
    { id: 2, name: "Social Media Kit", type: "Brand Kit", progress: 67, lastEdited: "6 hours ago", dimensions: "Multiple" },
    { id: 3, name: "Concert Poster", type: "Poster", progress: 43, lastEdited: "2 days ago", dimensions: "1080x1920" }
  ];

  const collaborativeProjects = [
    { id: 1, name: "Global Remix Challenge", type: "Collaboration", participants: 12, status: "active", genre: "Electronic" },
    { id: 2, name: "Producer Meetup Session", type: "Live Session", participants: 6, status: "scheduled", genre: "Hip-Hop" },
    { id: 3, name: "Cross-Genre Experiment", type: "Experiment", participants: 8, status: "completed", genre: "Fusion" }
  ];

  const audioTracks = [
    { id: 1, name: "Main Beat", length: "2:34", volume: 85, muted: false, solo: false },
    { id: 2, name: "Bass Line", length: "2:34", volume: 72, muted: false, solo: false },
    { id: 3, name: "Melody", length: "2:34", volume: 68, muted: false, solo: false },
    { id: 4, name: "Vocals", length: "2:34", volume: 80, muted: true, solo: false }
  ];

  const videoClips = [
    { id: 1, name: "Intro Sequence", duration: "0:15", type: "Video", position: "00:00" },
    { id: 2, name: "Main Performance", duration: "2:30", type: "Video", position: "00:15" },
    { id: 3, name: "B-Roll Footage", duration: "1:20", type: "Video", position: "02:45" },
    { id: 4, name: "Outro Credits", duration: "0:30", type: "Text", position: "04:05" }
  ];

  const designTools = [
    { name: "Brush Tool", active: true, size: 15, opacity: 100 },
    { name: "Text Tool", active: false, font: "Arial", size: 24 },
    { name: "Shape Tool", active: false, type: "Rectangle", fill: "#FF6B6B" },
    { name: "Color Picker", active: false, color: "#4ECDC4", palette: "Cool" }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        // Simulate playback progress
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Creative Studios Hub
          </h1>
          <p className="text-purple-200 text-lg max-w-3xl mx-auto">
            Professional-grade creative tools for music production, video editing, visual arts, and collaborative projects
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 border-blue-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="h-5 w-5 text-blue-400" />
                Music Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-blue-200 text-sm">3 in progress</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-red-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Video className="h-5 w-5 text-red-400" />
                Video Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8</div>
              <p className="text-red-200 text-sm">2 rendering</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-green-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5 text-green-400" />
                Visual Arts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">15</div>
              <p className="text-green-200 text-sm">5 published</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Collaborations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">6</div>
              <p className="text-purple-200 text-sm">2 active</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger value="music" className="text-white">Music Studio</TabsTrigger>
            <TabsTrigger value="video" className="text-white">Video Studio</TabsTrigger>
            <TabsTrigger value="visual" className="text-white">Visual Arts</TabsTrigger>
            <TabsTrigger value="collaborative" className="text-white">Collaborative</TabsTrigger>
          </TabsList>

          {/* Music Studio Tab */}
          <TabsContent value="music" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Current Project: {currentProject}</CardTitle>
                  <CardDescription className="text-gray-300">
                    Professional music production workspace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Transport Controls */}
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={handleRecord}
                      className={`${isRecording ? 'bg-red-600' : 'bg-gray-600'} hover:bg-red-700`}
                    >
                      <div className={`w-3 h-3 ${isRecording ? 'bg-white animate-pulse' : 'bg-white'} rounded-full`} />
                    </Button>
                    <Button onClick={handlePlayPause} className="bg-green-600 hover:bg-green-700">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button className="bg-gray-600 hover:bg-gray-700">
                      <Square className="h-4 w-4" />
                    </Button>
                    <Button className="bg-gray-600 hover:bg-gray-700">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Master Volume */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-gray-300">Master Volume</span>
                    </div>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Quick Project Selector */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Project</label>
                    <Select value={currentProject} onValueChange={setCurrentProject}>
                      <SelectTrigger className="bg-white/10 border-blue-400/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Untitled Project">Untitled Project</SelectItem>
                        <SelectItem value="Summer Vibes EP">Summer Vibes EP</SelectItem>
                        <SelectItem value="Night Drive">Night Drive</SelectItem>
                        <SelectItem value="Electronic Dreams">Electronic Dreams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Professional Tools Suite</CardTitle>
                  <CardDescription className="text-gray-300">
                    Hardware integration and professional instruments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* MIDI Controllers */}
                    <div className="space-y-2">
                      <div className="text-sm text-white font-medium">MIDI Controllers</div>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="p-2 bg-white/5 rounded">
                          <div className="flex justify-between items-center">
                            <div className="text-white text-sm">Traktor Kontrol S4</div>
                            <Badge className="bg-green-600 text-xs">Connected</Badge>
                          </div>
                          <div className="text-xs text-gray-400">4 channels • Battery: 87%</div>
                          <Progress value={87} className="h-1 mt-1" />
                        </div>
                        <div className="p-2 bg-white/5 rounded">
                          <div className="flex justify-between items-center">
                            <div className="text-white text-sm">Pioneer DDJ-SB3</div>
                            <Badge className="bg-green-600 text-xs">Connected</Badge>
                          </div>
                          <div className="text-xs text-gray-400">2 channels • Battery: 92%</div>
                          <Progress value={92} className="h-1 mt-1" />
                        </div>
                        <div className="p-2 bg-white/5 rounded">
                          <div className="flex justify-between items-center">
                            <div className="text-white text-sm">Akai MPC One</div>
                            <Badge className="bg-gray-600 text-xs">Available</Badge>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs mt-1 w-full">
                            Connect
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Professional Instruments */}
                    <div className="space-y-2">
                      <div className="text-sm text-white font-medium">Virtual Instruments</div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs">
                          Serum Synth
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                          Massive X
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                          Pro-Q 3 EQ
                        </Button>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs">
                          Kontakt 7
                        </Button>
                      </div>
                    </div>
                    
                    {/* Track Mixer */}
                    <div className="space-y-2">
                      <div className="text-sm text-white font-medium">Track Mixer</div>
                      <div className="space-y-1">
                        {audioTracks.map((track) => (
                          <div key={track.id} className="flex items-center gap-2 p-1 bg-white/5 rounded text-xs">
                            <div className="flex-1 text-white">{track.name}</div>
                            <Button size="sm" variant={track.muted ? "default" : "outline"} className="w-6 h-6 p-0 text-xs">M</Button>
                            <Button size="sm" variant={track.solo ? "default" : "outline"} className="w-6 h-6 p-0 text-xs">S</Button>
                            <div className="w-12 text-xs text-gray-300 text-center">{track.volume}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Recent Music Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {musicProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <div className="text-white font-medium">{project.name}</div>
                        <div className="text-sm text-gray-300">{project.type} • {project.lastEdited}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-xs text-gray-300">Progress</div>
                          <div className="text-sm text-white">{project.progress}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-300">Collaborators</div>
                          <div className="text-sm text-white">{project.collaborators}</div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Open
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Studio Tab */}
          <TabsContent value="video" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-red-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Video Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {videoClips.map((clip) => (
                      <div key={clip.id} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                        <Camera className="h-4 w-4 text-red-400" />
                        <div className="flex-1">
                          <div className="text-white text-sm">{clip.name}</div>
                          <div className="text-gray-400 text-xs">{clip.duration} at {clip.position}</div>
                        </div>
                        <Badge variant="outline" className="text-red-400 border-red-400">
                          {clip.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-orange-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Video Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {videoProjects.map((project) => (
                      <div key={project.id} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-white font-medium">{project.name}</div>
                            <div className="text-sm text-gray-300">{project.type}</div>
                          </div>
                          <div className="text-sm text-orange-400">{project.duration}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-300">Progress</span>
                            <span className="text-white">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Visual Arts Tab */}
          <TabsContent value="visual" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Design Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {designTools.map((tool, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <div className="flex items-center gap-2">
                          <Brush className="h-4 w-4 text-green-400" />
                          <span className="text-white text-sm">{tool.name}</span>
                        </div>
                        <Badge variant={tool.active ? "default" : "outline"} className="text-green-400">
                          {tool.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Visual Art Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {visualArtProjects.map((project) => (
                      <div key={project.id} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-white font-medium">{project.name}</div>
                            <div className="text-sm text-gray-300">{project.type}</div>
                          </div>
                          <div className="text-sm text-yellow-400">{project.dimensions}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-300">Progress</span>
                            <span className="text-white">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Collaborative Tab */}
          <TabsContent value="collaborative" className="space-y-6">
            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Active Collaborations</CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time collaborative projects with other creators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collaborativeProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <div className="text-white font-medium">{project.name}</div>
                        <div className="text-sm text-gray-300">{project.type} • {project.genre}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-xs text-gray-300">Participants</div>
                          <div className="text-sm text-white">{project.participants}</div>
                        </div>
                        <Badge className={
                          project.status === 'active' ? 'bg-green-600' :
                          project.status === 'scheduled' ? 'bg-blue-600' : 'bg-gray-600'
                        }>
                          {project.status}
                        </Badge>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}