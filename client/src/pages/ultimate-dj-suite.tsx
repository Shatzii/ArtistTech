import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Volume2, Mic, Users, Music, TrendingUp, Radio, Headphones, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function UltimateDJSuite() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("Electronic Vibes - DJ Mix");
  const [volume, setVolume] = useState([75]);
  const [crossfader, setCrossfader] = useState([50]);
  const [deckAVolume, setDeckAVolume] = useState([80]);
  const [deckBVolume, setDeckBVolume] = useState([70]);
  const [votes, setVotes] = useState(0);
  const [activeTab, setActiveTab] = useState("mixing");
  const [liveListeners, setLiveListeners] = useState(1247);
  const [earnings, setEarnings] = useState(284.50);

  const { data: mixingData } = useQuery({
    queryKey: ["/api/advanced-audio/harmonic-mixing"],
    enabled: true
  });

  const { data: crowdRequests } = useQuery({
    queryKey: ["/api/dj-voting/requests"],
    enabled: true
  });

  const { data: stemData } = useQuery({
    queryKey: ["/api/advanced-audio/stem-separation"],
    enabled: true
  });

  const trackQueue = [
    { id: 1, title: "Midnight Dreams", artist: "Synthwave", votes: 23, paid: true, amount: 5.00 },
    { id: 2, title: "Neon Nights", artist: "ElectroBeats", votes: 18, paid: false, amount: 0 },
    { id: 3, title: "Digital Love", artist: "FutureBass", votes: 31, paid: true, amount: 8.50 },
    { id: 4, title: "Cyber Groove", artist: "TechHouse", votes: 12, paid: false, amount: 0 },
    { id: 5, title: "Aurora Pulse", artist: "Ambient", votes: 27, paid: true, amount: 3.00 }
  ];

  const hardwareControllers = [
    { name: "Pioneer CDJ-3000", status: "connected", features: ["Touchscreen", "Hot Cues", "Loop Roll"] },
    { name: "Denon Prime 4", status: "connected", features: ["Standalone", "Streaming", "WiFi"] },
    { name: "Allen & Heath Xone:96", status: "connected", features: ["Analog Filters", "Dual FX", "USB"] }
  ];

  const stemChannels = [
    { name: "Vocals", level: 85, color: "bg-purple-500" },
    { name: "Drums", level: 92, color: "bg-red-500" },
    { name: "Bass", level: 78, color: "bg-green-500" },
    { name: "Melody", level: 88, color: "bg-blue-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveListeners(prev => prev + Math.floor(Math.random() * 10) - 5);
      setEarnings(prev => prev + (Math.random() * 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVote = (trackId: number) => {
    setVotes(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Ultimate DJ Suite</h1>
          <p className="text-purple-200">Professional DJ mixing with AI-powered features, live voting, and hardware integration</p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Live Listeners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{liveListeners.toLocaleString()}</div>
              <p className="text-purple-200 text-sm">Currently tuned in</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-green-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Session Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${earnings.toFixed(2)}</div>
              <p className="text-green-200 text-sm">From tips & requests</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-blue-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="h-5 w-5 text-blue-400" />
                Queue Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{votes}</div>
              <p className="text-blue-200 text-sm">Total votes cast</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-orange-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Radio className="h-5 w-5 text-orange-400" />
                Stream Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">LIVE</div>
              <p className="text-orange-200 text-sm">Broadcasting now</p>
            </CardContent>
          </Card>
        </div>

        {/* Main DJ Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10">
            <TabsTrigger value="mixing" className="text-white">DJ Mixing</TabsTrigger>
            <TabsTrigger value="voting" className="text-white">Live Voting</TabsTrigger>
            <TabsTrigger value="stems" className="text-white">Stem Separation</TabsTrigger>
            <TabsTrigger value="hardware" className="text-white">Hardware</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
          </TabsList>

          {/* DJ Mixing Tab */}
          <TabsContent value="mixing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Deck A */}
              <Card className="bg-white/10 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Deck A</CardTitle>
                  <CardDescription className="text-gray-300">
                    {currentTrack}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <Button 
                      onClick={handlePlay}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" className="border-purple-400 text-purple-400">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Volume</label>
                    <Slider 
                      value={deckAVolume} 
                      onValueChange={setDeckAVolume}
                      max={100}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">EQ High</label>
                    <Slider defaultValue={[50]} max={100} className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">EQ Mid</label>
                    <Slider defaultValue={[50]} max={100} className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">EQ Low</label>
                    <Slider defaultValue={[50]} max={100} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Deck B */}
              <Card className="bg-white/10 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Deck B</CardTitle>
                  <CardDescription className="text-gray-300">
                    Ready for next track
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="border-blue-400 text-blue-400">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Volume</label>
                    <Slider 
                      value={deckBVolume} 
                      onValueChange={setDeckBVolume}
                      max={100}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">EQ High</label>
                    <Slider defaultValue={[50]} max={100} className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">EQ Mid</label>
                    <Slider defaultValue={[50]} max={100} className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">EQ Low</label>
                    <Slider defaultValue={[50]} max={100} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Crossfader */}
            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white text-center">Crossfader & Master Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Crossfader</label>
                  <Slider 
                    value={crossfader} 
                    onValueChange={setCrossfader}
                    max={100}
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Master Volume</label>
                    <Slider 
                      value={volume} 
                      onValueChange={setVolume}
                      max={100}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Headphone Mix</label>
                    <Slider defaultValue={[50]} max={100} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Voting Tab */}
          <TabsContent value="voting" className="space-y-6">
            <Card className="bg-white/10 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-white">Live Song Requests & Voting</CardTitle>
                <CardDescription className="text-gray-300">
                  Crowd-powered playlist with paid requests and free voting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackQueue.map((track) => (
                    <div key={track.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Music className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{track.title}</div>
                          <div className="text-gray-300 text-sm">{track.artist}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {track.paid && (
                          <Badge className="bg-green-600 text-white">
                            ${track.amount.toFixed(2)}
                          </Badge>
                        )}
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleVote(track.id)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            Vote
                          </Button>
                          <span className="text-white text-sm">{track.votes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stem Separation Tab */}
          <TabsContent value="stems" className="space-y-6">
            <Card className="bg-white/10 border-blue-400/30">
              <CardHeader>
                <CardTitle className="text-white">AI Stem Separation</CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time audio stem isolation for advanced mixing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stemChannels.map((stem, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-white font-medium">{stem.name}</label>
                        <span className="text-gray-300 text-sm">{stem.level}%</span>
                      </div>
                      <div className="space-y-2">
                        <div className={`h-4 ${stem.color} rounded-full`} style={{ width: `${stem.level}%` }} />
                        <Slider defaultValue={[stem.level]} max={100} className="w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hardware Tab */}
          <TabsContent value="hardware" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hardwareControllers.map((controller, idx) => (
                <Card key={idx} className="bg-white/10 border-purple-400/30">
                  <CardHeader>
                    <CardTitle className="text-white">{controller.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      <Badge className="bg-green-600 text-white">{controller.status}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {controller.features.map((feature, featureIdx) => (
                        <div key={featureIdx} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
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
                  <CardTitle className="text-white">Session Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Peak Listeners</span>
                      <span className="text-white">1,847</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Avg Session Time</span>
                      <span className="text-white">23 mins</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Engagement Rate</span>
                      <span className="text-white">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tips Received</span>
                      <span className="text-green-400">$127.50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Track Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Most Requested</span>
                      <span className="text-white">Electronic</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Crowd Energy</span>
                      <span className="text-orange-400">High</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Mix Transitions</span>
                      <span className="text-white">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Harmonic Matches</span>
                      <span className="text-purple-400">89%</span>
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