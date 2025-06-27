import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Play, Pause, Square, Volume2, Mic, Headphones, 
  Disc3, Music, TrendingUp, Users, BarChart3, 
  Heart, MessageCircle, Share2, DollarSign, 
  Zap, Sliders, Settings, Radio, Sparkles 
} from 'lucide-react';
import StudioNavigation from '@/components/ui/studio-navigation';
import NeuralBackground from '@/components/neural-background';
import HolographicPanel from '@/components/holographic-ui';
import AdvancedWaveform from '@/components/advanced-waveform';
import AIAssistant from '@/components/ai-assistant';

export default function UltimateDJStudio() {
  const [crossfaderPosition, setCrossfaderPosition] = useState(50);
  const [masterVolume, setMasterVolume] = useState(75);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [voteSocketConnected, setVoteSocketConnected] = useState(false);

  // Enhanced track state with AI features
  const [tracks, setTracks] = useState({
    deckA: {
      loaded: true,
      playing: true,
      title: "Summer Vibes 2025",
      artist: "DJ Neural",
      bpm: 128,
      key: "Am",
      energy: 85,
      position: 45,
      duration: 240,
      cuePoints: [30, 60, 120, 180]
    },
    deckB: {
      loaded: true,
      playing: false,
      title: "Future Bass Dreams",
      artist: "Quantum Beat",
      bpm: 140,
      key: "Gm",
      energy: 92,
      position: 0,
      duration: 195,
      cuePoints: [25, 50, 100, 150]
    }
  });

  // Enhanced stem separation state
  const [stemSeparation, setStemSeparation] = useState({
    vocals: { level: 100, isolated: false, effects: [] },
    drums: { level: 100, isolated: false, effects: [] },
    bass: { level: 100, isolated: false, effects: [] },
    melody: { level: 100, isolated: false, effects: [] }
  });

  // Crowd analytics with AI
  const [crowdAnalytics, setCrowdAnalytics] = useState({
    energyLevel: 78,
    responseTime: 2.3,
    peakMoments: [45, 92, 156, 203],
    faceDetection: true,
    nextTrackSuggestions: [
      { title: "Electric Dreams", match: 94, genre: "Progressive House" },
      { title: "Neon Nights", match: 89, genre: "Future Bass" },
      { title: "Digital Love", match: 87, genre: "Synthwave" }
    ]
  });

  // Live requests with payment integration
  const [liveRequests, setLiveRequests] = useState([
    { id: 1, song: "Blinding Lights", artist: "The Weeknd", user: "PartyGoer123", payment: 15, votes: 89, priority: "high" },
    { id: 2, song: "Don't Start Now", artist: "Dua Lipa", user: "DanceFan99", payment: 10, votes: 67, priority: "medium" },
    { id: 3, song: "Watermelon Sugar", artist: "Harry Styles", user: "MusicLover", payment: 8, votes: 45, priority: "medium" },
    { id: 4, song: "Levitating", artist: "Dua Lipa", user: "VibeChecker", payment: 0, votes: 34, priority: "low" },
    { id: 5, song: "Peaches", artist: "Justin Bieber", user: "PopFan2025", payment: 12, votes: 78, priority: "high" }
  ]);

  const [totalRevenue, setTotalRevenue] = useState(247.50);

  const keyCompatibility = {
    '1A': 'Am', '1B': 'C', '2A': 'Em', '2B': 'G', '3A': 'Bm', '3B': 'D',
    '4A': 'F#m', '4B': 'A', '5A': 'C#m', '5B': 'E', '6A': 'G#m', '6B': 'B',
    '7A': 'D#m', '7B': 'F#', '8A': 'A#m', '8B': 'C#', '9A': 'Fm', '9B': 'G#',
    '10A': 'Cm', '10B': 'D#', '11A': 'Gm', '11B': 'A#', '12A': 'Dm', '12B': 'F'
  };

  const getCompatibleKeys = (currentKey: string) => {
    const keyToNumber = Object.entries(keyCompatibility).find(([_, key]) => key === currentKey)?.[0];
    return keyToNumber || '1A';
  };

  useEffect(() => {
    // WebSocket connection for live voting
    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`);
    ws.onopen = () => setVoteSocketConnected(true);
    ws.onclose = () => setVoteSocketConnected(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'newRequest') {
        setLiveRequests(prev => [...prev, data.request]);
        setTotalRevenue(prev => prev + (data.request.payment || 0));
      }
    };
    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <NeuralBackground />
      <StudioNavigation />
      
      {/* STUDIO HEADER */}
      <div className="bg-gradient-to-r from-black via-blue-900/50 to-black border-b-2 border-blue-500/30 p-3 relative z-10">
        <div className="flex items-center justify-between max-w-[2000px] mx-auto">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="hover:scale-110 transition-transform">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="h-12 w-auto rounded-lg border-2 border-blue-500/50 hover:border-blue-400"
              />
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                ULTIMATE DJ STUDIO PRO
              </h1>
              <p className="text-blue-300 text-sm">Professional Club Integration • AI-Powered Mixing • Live Crowd Interaction</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-black/50 rounded-lg p-3 border border-green-500/30">
              <div className="text-xs text-green-400 mb-1">LIVE REVENUE</div>
              <div className="text-lg font-bold text-green-400">${totalRevenue.toFixed(2)}</div>
            </div>
            <div className="bg-black/50 rounded-lg p-3 border border-purple-500/30">
              <div className="text-xs text-purple-400 mb-1">CROWD ENERGY</div>
              <div className="text-lg font-bold text-purple-400">{crowdAnalytics.energyLevel}%</div>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${voteSocketConnected ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
              <div className={`w-2 h-2 rounded-full ${voteSocketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`text-xs font-bold ${voteSocketConnected ? 'text-green-400' : 'text-red-400'}`}>
                {voteSocketConnected ? 'LIVE CONNECTED' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-100px)]">
        {/* LEFT SIDEBAR - AI ANALYTICS */}
        <div className="w-80 bg-gray-900/50 border-r border-gray-700 p-4 space-y-4 overflow-y-auto">
          <HolographicPanel title="AI CROWD ANALYTICS" subtitle="Real-time Audience Intelligence" glowColor="green" ai={true}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Energy Level</div>
                  <div className="text-green-400 font-bold">{crowdAnalytics.energyLevel}%</div>
                </div>
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Response Time</div>
                  <div className="text-blue-400 font-bold">{crowdAnalytics.responseTime}s</div>
                </div>
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Face Detection</div>
                  <div className={`font-bold ${crowdAnalytics.faceDetection ? 'text-green-400' : 'text-red-400'}`}>
                    {crowdAnalytics.faceDetection ? 'ON' : 'OFF'}
                  </div>
                </div>
              </div>
            </div>
          </HolographicPanel>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <h3 className="text-sm font-bold mb-2 text-yellow-400">AI Song Predictions</h3>
            <div className="space-y-2">
              {crowdAnalytics.nextTrackSuggestions.map((song, idx) => (
                <div key={idx} className="bg-gray-700/50 rounded p-2 text-xs">
                  <div className="font-bold text-white">{song.title}</div>
                  <div className="text-gray-400">{song.genre}</div>
                  <div className="text-green-400">{song.match}% match</div>
                </div>
              ))}
            </div>
          </div>

          <AIAssistant />
        </div>

        {/* MAIN STUDIO INTERFACE */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* TOP ROW - DUAL DECK SYSTEM */}
          <div className="grid grid-cols-12 gap-6 h-[400px]">
            {/* LEFT DECK A */}
            <div className="col-span-4 space-y-4">
              <HolographicPanel title="DECK A" subtitle="Neural Audio Analysis" glowColor="blue">
                <div className="space-y-4">
                  {/* Track Display */}
                  <div className="bg-black/30 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-center mb-3">
                      <div className="text-lg font-bold text-blue-400">{tracks.deckA.title}</div>
                      <div className="text-gray-400 text-sm">{tracks.deckA.artist}</div>
                      <div className="flex justify-center space-x-4 mt-2 text-xs">
                        <span className="text-blue-400">{tracks.deckA.bpm} BPM</span>
                        <span className="text-purple-400">{tracks.deckA.key}</span>
                        <span className="text-green-400">{tracks.deckA.energy}% Energy</span>
                      </div>
                    </div>
                    
                    <AdvancedWaveform 
                      isPlaying={tracks.deckA.playing} 
                      position={tracks.deckA.position} 
                      color="blue"
                      title="Deck A"
                    />
                  </div>

                  {/* Deck Controls */}
                  <div className="grid grid-cols-3 gap-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors">
                      <Play className="w-4 h-4 mx-auto" />
                    </button>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition-colors">
                      <Pause className="w-4 h-4 mx-auto" />
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors">
                      <Square className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </HolographicPanel>
            </div>

            {/* CENTER MIXER */}
            <div className="col-span-4 space-y-4">
              <HolographicPanel title="AI NEURAL CROSSFADER" subtitle="Quantum Audio Processing" glowColor="purple" ai={true}>
                <div className="space-y-4">
                  {/* Advanced Crossfader */}
                  <div className="mb-6">
                    <div className="bg-black rounded-lg p-4 border border-purple-500/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/20 to-red-500/10"></div>
                      <div className="relative">
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>DECK A</span>
                            <span className="text-purple-400 font-bold">AI CROSSFADER</span>
                            <span>DECK B</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={crossfaderPosition}
                            onChange={(e) => setCrossfaderPosition(Number(e.target.value))}
                            className="w-full h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer crossfader-slider"
                          />
                        </div>
                        
                        {/* EQ Section */}
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          {['HIGH', 'MID', 'LOW'].map((band) => (
                            <div key={band} className="text-center">
                              <div className="text-xs text-gray-400 mb-1">{band}</div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                defaultValue="50"
                                className="w-full h-20 bg-gray-700 rounded-lg appearance-none cursor-pointer eq-slider"
                                style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Effects */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-yellow-400">MASTER FX</h4>
                    {['Reverb', 'Delay', 'Filter', 'Distortion'].map((fx) => (
                      <div key={fx} className="flex items-center space-x-2">
                        <span className="text-xs w-16">{fx}</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="0"
                          className="flex-1 accent-yellow-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </HolographicPanel>

              <AIAssistant />
            </div>

            {/* RIGHT DECK B */}
            <div className="col-span-4 space-y-4">
              <HolographicPanel title="DECK B" subtitle="AI Enhanced Audio Processing" glowColor="red">
                <div className="space-y-4">
                  {/* Track Display */}
                  <div className="bg-black/30 rounded-lg p-4 border border-red-500/30">
                    <div className="text-center mb-3">
                      <div className="text-lg font-bold text-red-400">{tracks.deckB.title}</div>
                      <div className="text-gray-400 text-sm">{tracks.deckB.artist}</div>
                      <div className="flex justify-center space-x-4 mt-2 text-xs">
                        <span className="text-red-400">{tracks.deckB.bpm} BPM</span>
                        <span className="text-purple-400">{tracks.deckB.key}</span>
                        <span className="text-green-400">{tracks.deckB.energy}% Energy</span>
                      </div>
                    </div>
                    
                    <AdvancedWaveform 
                      isPlaying={tracks.deckB.playing} 
                      position={tracks.deckB.position} 
                      color="red"
                      title="Deck B"
                    />
                  </div>

                  {/* Deck Controls */}
                  <div className="grid grid-cols-3 gap-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors">
                      <Play className="w-4 h-4 mx-auto" />
                    </button>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition-colors">
                      <Pause className="w-4 h-4 mx-auto" />
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors">
                      <Square className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </HolographicPanel>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - LIVE VOTING & SOCIAL */}
        <div className="w-80 bg-gray-900/50 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-bold text-purple-400 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              LIVE CROWD REQUESTS
            </h2>
            <div className="text-xs text-gray-400 mt-1">
              {liveRequests.length} requests • ${totalRevenue.toFixed(2)} earned
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {liveRequests.map((request) => (
              <div 
                key={request.id}
                className={`bg-gray-800/70 rounded-lg p-3 border cursor-pointer transition-all hover:scale-105 ${
                  request.priority === 'high' ? 'border-green-500/50' : 
                  request.priority === 'medium' ? 'border-yellow-500/50' : 'border-gray-600/50'
                } ${selectedRequest === request.id.toString() ? 'ring-2 ring-purple-500' : ''}`}
                onClick={() => setSelectedRequest(request.id.toString())}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-white text-sm">{request.song}</div>
                    <div className="text-gray-400 text-xs">{request.artist}</div>
                    <div className="text-blue-400 text-xs">by {request.user}</div>
                  </div>
                  <div className="text-right">
                    {request.payment > 0 && (
                      <div className="text-green-400 font-bold text-sm flex items-center">
                        <DollarSign className="w-3 h-3" />
                        {request.payment}
                      </div>
                    )}
                    <div className="text-purple-400 text-xs flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {request.votes}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    request.priority === 'high' ? 'bg-green-900/50 text-green-400' :
                    request.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-gray-700/50 text-gray-400'
                  }`}>
                    {request.priority.toUpperCase()}
                  </div>
                  
                  <div className="flex space-x-1">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white p-1 rounded text-xs">
                      <Play className="w-3 h-3" />
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded text-xs">
                      <Zap className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-700 space-y-3">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Total Revenue</span>
                <span className="text-green-400 font-bold">${totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg Mix Rating</span>
                <span className="text-yellow-400">9.2/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}