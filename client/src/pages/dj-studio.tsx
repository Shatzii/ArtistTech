import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, 
  Headphones, Radio, Users, Vote, DollarSign,
  Music, Disc, Waves, Zap, Crown, Star,
  Search, Filter, Shuffle, Repeat, Heart
} from "lucide-react";

export default function DJStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [deckATrack, setDeckATrack] = useState(null);
  const [deckBTrack, setDeckBTrack] = useState(null);
  const [crossfader, setCrossfader] = useState([50]);
  const [masterVolume, setMasterVolume] = useState([75]);
  const [deckAVolume, setDeckAVolume] = useState([80]);
  const [deckBVolume, setDeckBVolume] = useState([80]);
  const [liveRequests, setLiveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("mixer");

  // Mock data for demonstration
  const trackLibrary = [
    { id: 1, title: "Summer Vibes", artist: "DJ Cosmic", bpm: 128, key: "Am", duration: "3:45", genre: "House" },
    { id: 2, title: "Night Drive", artist: "Electronic Soul", bpm: 124, key: "Gm", duration: "4:12", genre: "Techno" },
    { id: 3, title: "Neon Dreams", artist: "Synth Wave", bpm: 132, key: "Em", duration: "3:28", genre: "Synthwave" },
    { id: 4, title: "Deep Ocean", artist: "Ambient Flow", bpm: 120, key: "Dm", duration: "5:16", genre: "Deep House" },
    { id: 5, title: "Electric Storm", artist: "Thunder Beats", bpm: 140, key: "Cm", duration: "3:52", genre: "Drum & Bass" },
    { id: 6, title: "Sunset Boulevard", artist: "Retro Future", bpm: 126, key: "Fm", duration: "4:05", genre: "Nu-Disco" }
  ];

  const liveVotes = [
    { id: 1, track: "Summer Vibes", artist: "DJ Cosmic", votes: 47, paidRequest: false, amount: 0 },
    { id: 2, track: "Electric Storm", artist: "Thunder Beats", votes: 23, paidRequest: true, amount: 15 },
    { id: 3, track: "Deep Ocean", artist: "Ambient Flow", votes: 18, paidRequest: false, amount: 0 },
    { id: 4, track: "Neon Dreams", artist: "Synth Wave", votes: 12, paidRequest: true, amount: 8 },
    { id: 5, track: "Night Drive", artist: "Electronic Soul", votes: 9, paidRequest: false, amount: 0 }
  ];

  const crowdStats = {
    totalListeners: 342,
    activeVoters: 89,
    totalRequests: 5,
    earnings: 23,
    peakEnergy: 87,
    genrePreference: "House (43%)"
  };

  const effects = {
    deckA: {
      reverb: [0],
      delay: [0],
      filter: [50],
      eq: { low: [50], mid: [50], high: [50] }
    },
    deckB: {
      reverb: [0],
      delay: [0],
      filter: [50],
      eq: { low: [50], mid: [50], high: [50] }
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrackLoad = (track, deck) => {
    if (deck === 'A') {
      setDeckATrack(track);
    } else {
      setDeckBTrack(track);
    }
  };

  const handleVoteForTrack = (trackId) => {
    // Handle voting logic
    console.log("Voting for track:", trackId);
  };

  const handleCrossfade = (value) => {
    setCrossfader(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Disc className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Professional DJ Studio</h1>
              <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
                LIVE
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-white font-bold">{crowdStats.totalListeners}</div>
              <div className="text-xs text-gray-400">Listeners</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold">${crowdStats.earnings}</div>
              <div className="text-xs text-gray-400">Earned</div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Radio className="w-4 h-4 mr-2" />
              Go Live
            </Button>
          </div>
        </div>

        {/* Main DJ Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* DJ Mixer - Main Area */}
          <div className="xl:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="mixer">DJ Mixer</TabsTrigger>
                <TabsTrigger value="library">Track Library</TabsTrigger>
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="voting">Live Voting</TabsTrigger>
              </TabsList>

              <TabsContent value="mixer" className="space-y-6">
                {/* Deck Controls */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Deck A */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Deck A</CardTitle>
                        <Badge className="bg-blue-600">Primary</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Track Display */}
                        <div className="bg-gray-900 p-4 rounded-lg">
                          {deckATrack ? (
                            <div>
                              <div className="text-white font-bold">{deckATrack.title}</div>
                              <div className="text-gray-400">{deckATrack.artist}</div>
                              <div className="flex space-x-4 text-sm text-gray-400 mt-2">
                                <span>{deckATrack.bpm} BPM</span>
                                <span>Key: {deckATrack.key}</span>
                                <span>{deckATrack.duration}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-center py-4">
                              Load a track to Deck A
                            </div>
                          )}
                        </div>

                        {/* Deck Controls */}
                        <div className="flex justify-center space-x-2">
                          <Button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700">
                            <SkipBack className="w-5 h-5" />
                          </Button>
                          <Button className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700">
                            <Play className="w-5 h-5" />
                          </Button>
                          <Button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700">
                            <SkipForward className="w-5 h-5" />
                          </Button>
                        </div>

                        {/* Volume and EQ */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Volume</label>
                            <Slider
                              value={deckAVolume}
                              onValueChange={setDeckAVolume}
                              className="w-full"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Low</label>
                              <Slider
                                value={effects.deckA.eq.low}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Mid</label>
                              <Slider
                                value={effects.deckA.eq.mid}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">High</label>
                              <Slider
                                value={effects.deckA.eq.high}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deck B */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Deck B</CardTitle>
                        <Badge className="bg-purple-600">Secondary</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Track Display */}
                        <div className="bg-gray-900 p-4 rounded-lg">
                          {deckBTrack ? (
                            <div>
                              <div className="text-white font-bold">{deckBTrack.title}</div>
                              <div className="text-gray-400">{deckBTrack.artist}</div>
                              <div className="flex space-x-4 text-sm text-gray-400 mt-2">
                                <span>{deckBTrack.bpm} BPM</span>
                                <span>Key: {deckBTrack.key}</span>
                                <span>{deckBTrack.duration}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-center py-4">
                              Load a track to Deck B
                            </div>
                          )}
                        </div>

                        {/* Deck Controls */}
                        <div className="flex justify-center space-x-2">
                          <Button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700">
                            <SkipBack className="w-5 h-5" />
                          </Button>
                          <Button className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700">
                            <Play className="w-5 h-5" />
                          </Button>
                          <Button className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700">
                            <SkipForward className="w-5 h-5" />
                          </Button>
                        </div>

                        {/* Volume and EQ */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Volume</label>
                            <Slider
                              value={deckBVolume}
                              onValueChange={setDeckBVolume}
                              className="w-full"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Low</label>
                              <Slider
                                value={effects.deckB.eq.low}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Mid</label>
                              <Slider
                                value={effects.deckB.eq.mid}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">High</label>
                              <Slider
                                value={effects.deckB.eq.high}
                                orientation="vertical"
                                className="h-16"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Crossfader and Master Controls */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-8 items-center">
                      <div className="text-center">
                        <label className="block text-sm text-gray-400 mb-2">Deck A</label>
                        <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-white font-bold">A</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2 text-center">Crossfader</label>
                          <Slider
                            value={crossfader}
                            onValueChange={handleCrossfade}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2 text-center">Master Volume</label>
                          <Slider
                            value={masterVolume}
                            onValueChange={setMasterVolume}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="text-center">
                        <label className="block text-sm text-gray-400 mb-2">Deck B</label>
                        <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-white font-bold">B</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="library" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Track Library</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Search tracks..."
                          className="bg-gray-700 border-gray-600 text-white w-64"
                        />
                        <Button className="bg-gray-600 hover:bg-gray-700">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {trackLibrary.map((track) => (
                        <div key={track.id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{track.title}</div>
                            <div className="text-gray-400 text-sm">{track.artist}</div>
                          </div>
                          <div className="text-sm text-gray-400 text-center">
                            <div>{track.bpm} BPM</div>
                            <div>Key: {track.key}</div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {track.duration}
                          </div>
                          <Badge className="bg-purple-600">{track.genre}</Badge>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              onClick={() => handleTrackLoad(track, 'A')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              → A
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleTrackLoad(track, 'B')}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              → B
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voting" className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Vote className="w-5 h-5 mr-2" />
                      Live Crowd Voting
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Listeners can vote for free or pay to prioritize their requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {liveVotes.map((vote, index) => (
                        <div key={vote.id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{vote.track}</div>
                            <div className="text-gray-400 text-sm">{vote.artist}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-white">{vote.votes}</span>
                          </div>
                          {vote.paidRequest && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 font-bold">${vote.amount}</span>
                            </div>
                          )}
                          <Button
                            size="sm"
                            className={`${vote.paidRequest ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                          >
                            {vote.paidRequest ? 'Play Next' : 'Queue'}
                          </Button>
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
            {/* Live Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Live Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Listeners</span>
                  <span className="text-white font-bold">{crowdStats.totalListeners}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Voters</span>
                  <span className="text-blue-400 font-bold">{crowdStats.activeVoters}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Requests</span>
                  <span className="text-purple-400 font-bold">{crowdStats.totalRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Earnings</span>
                  <span className="text-green-400 font-bold">${crowdStats.earnings}</span>
                </div>
                <div className="pt-3 border-t border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Crowd Energy</span>
                    <span className="text-orange-400 font-bold">{crowdStats.peakEnergy}%</span>
                  </div>
                  <Progress value={crowdStats.peakEnergy} className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Radio className="w-4 h-4 mr-2" />
                  Start Live Stream
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Music className="w-4 h-4 mr-2" />
                  Import Tracks
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Enable Paid Requests
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Headphones className="w-4 h-4 mr-2" />
                  Cue Monitor
                </Button>
              </CardContent>
            </Card>

            {/* Playlist Queue */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Up Next</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { title: "Summer Vibes", artist: "DJ Cosmic" },
                    { title: "Electric Storm", artist: "Thunder Beats" },
                    { title: "Deep Ocean", artist: "Ambient Flow" }
                  ].map((track, index) => (
                    <div key={index} className="p-2 bg-gray-700 rounded">
                      <div className="text-white text-sm font-medium">{track.title}</div>
                      <div className="text-gray-400 text-xs">{track.artist}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}