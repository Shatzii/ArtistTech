import { useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, SkipForward, SkipBack, 
  Disc3, Music, TrendingUp, Users, BarChart3, 
  Heart, MessageCircle, Share2, DollarSign, 
  Zap, Sliders, Settings, Radio, Sparkles 
} from 'lucide-react';

export default function UltimateDJStudio() {
  const [crossfaderPosition, setCrossfaderPosition] = useState(50);
  const [masterVolume, setMasterVolume] = useState(75);
  const [crowdAnalytics, setCrowdAnalytics] = useState({
    energyLevel: 85,
    danceIntensity: 92,
    vocals: 78,
    engagement: 94,
    faceDetection: true
  });

  const [tracks, setTracks] = useState({
    deckA: {
      title: "Epic Future Bass",
      artist: "AI Producer",
      bpm: 128,
      key: "C Major",
      playing: false,
      position: 0.35,
      energy: 92
    },
    deckB: {
      title: "Neural Trap",
      artist: "AI Beatmaker",
      bpm: 140,
      key: "G Minor",
      playing: false,
      position: 0.65,
      energy: 88
    }
  });

  const [effects, setEffects] = useState({
    deckA: { reverb: 0, delay: 0, filter: 50, echo: 0 },
    deckB: { reverb: 0, delay: 0, filter: 50, echo: 0 }
  });

  const [eqSettings, setEQSettings] = useState({
    deckA: { high: 50, mid: 50, low: 50 },
    deckB: { high: 50, mid: 50, low: 50 }
  });

  const [requests, setRequests] = useState([
    { id: 1, track: "Synthwave Nights", votes: 45, payment: 25, priority: "high" },
    { id: 2, track: "Bass Drop City", votes: 32, payment: 15, priority: "medium" },
    { id: 3, track: "Chill Vibes Only", votes: 28, payment: 10, priority: "low" },
    { id: 4, track: "Electronic Dreams", votes: 19, payment: 0, priority: "low" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCrowdAnalytics(prev => ({
        ...prev,
        energyLevel: Math.max(70, Math.min(100, prev.energyLevel + (Math.random() - 0.5) * 10)),
        danceIntensity: Math.max(70, Math.min(100, prev.danceIntensity + (Math.random() - 0.5) * 8)),
        engagement: Math.max(80, Math.min(100, prev.engagement + (Math.random() - 0.5) * 6))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handlePlayToggle = (deck: string) => {
    setTracks(prev => ({
      ...prev,
      [deck]: { ...prev[deck as keyof typeof prev], playing: !prev[deck as keyof typeof prev].playing }
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-red-900/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="relative z-50 bg-gray-900/90 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Disc3 className="w-8 h-8 text-blue-400 animate-spin" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ULTIMATE DJ STUDIO
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">Live Audience: 1,247</div>
            <div className="text-sm text-green-400">Revenue: $2,847</div>
          </div>
        </div>
      </div>

      {/* STUDIO HEADER */}
      <div className="bg-gradient-to-r from-black via-blue-900/50 to-black border-b-2 border-blue-500/30 p-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-2xl font-bold text-blue-400 animate-pulse">🎵 ARTIST TECH DJ STUDIO PRO 🎵</div>
            <div className="flex items-center space-x-2 text-green-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-sm">LIVE • 1,247 listeners</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-orange-400 font-bold">💰 Revenue: $2,847</div>
            <div className="text-blue-400">🎯 Energy: {crowdAnalytics.energyLevel}%</div>
            <div className="text-purple-400">💃 Dance: {crowdAnalytics.danceIntensity}%</div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-100px)]">
        {/* LEFT SIDEBAR - AI ANALYTICS */}
        <div className="w-80 bg-gray-900/50 border-r border-gray-700 p-4 space-y-4 overflow-y-auto">
          <div className="bg-gray-800/50 rounded-lg border border-green-500/30 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-green-400">AI CROWD ANALYTICS</h3>
              <div className="text-xs text-green-400">Real-time Audience Intelligence</div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Energy Level</div>
                  <div className="text-green-400 font-bold">{crowdAnalytics.energyLevel}%</div>
                </div>
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Dance Intensity</div>
                  <div className="text-blue-400 font-bold">{crowdAnalytics.danceIntensity}%</div>
                </div>
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Vocal Response</div>
                  <div className="text-yellow-400 font-bold">{crowdAnalytics.vocals}%</div>
                </div>
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Face Detection</div>
                  <div className={`font-bold ${crowdAnalytics.faceDetection ? 'text-green-400' : 'text-red-400'}`}>
                    {crowdAnalytics.faceDetection ? 'ON' : 'OFF'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <h3 className="text-purple-400 font-bold mb-3">🎵 LIVE REQUESTS QUEUE</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {requests.map((request) => (
                <div 
                  key={request.id} 
                  className={`p-3 rounded border ${
                    request.priority === 'high' ? 'border-green-500 bg-green-500/10' :
                    request.priority === 'medium' ? 'border-yellow-500 bg-yellow-500/10' :
                    'border-gray-500 bg-gray-500/10'
                  }`}
                >
                  <div className="font-semibold text-sm">{request.track}</div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-blue-400">👍 {request.votes}</span>
                    <span className="text-green-400">${request.payment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-purple-500/30 p-4">
            <h3 className="text-lg font-bold text-purple-400 mb-3">AI Assistant</h3>
            <div className="text-sm text-gray-300">Voice commands and real-time suggestions active</div>
          </div>
        </div>

        {/* MAIN STUDIO INTERFACE */}
        <div className="flex-1 bg-gray-900/30 p-6 space-y-6 overflow-y-auto">
          {/* TOP ROW - DUAL DECK SYSTEM */}
          <div className="grid grid-cols-12 gap-6 h-[400px]">
            {/* LEFT DECK A */}
            <div className="col-span-4 space-y-4">
              <div className="bg-gray-800/50 rounded-lg border border-blue-500/30 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-blue-400">DECK A</h3>
                  <div className="text-xs text-blue-400">Neural Audio Analysis</div>
                </div>
                <div className="space-y-4">
                  {/* Track Display */}
                  <div className="bg-black/30 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-center mb-3">
                      <div className="text-blue-400 font-bold">{tracks.deckA.title}</div>
                      <div className="text-gray-400 text-sm">{tracks.deckA.artist}</div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                        <span className="text-blue-400">{tracks.deckA.bpm} BPM</span>
                        <span className="text-purple-400">{tracks.deckA.key}</span>
                        <span className="text-green-400">{tracks.deckA.energy}% Energy</span>
                      </div>
                    </div>

                    <div className="h-16 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded border border-blue-500/30 flex items-center justify-center">
                      <div className="text-blue-400 text-sm">WAVEFORM DISPLAY</div>
                    </div>
                  </div>

                  {/* Deck Controls */}
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handlePlayToggle('deckA')}
                      className={`p-3 rounded ${tracks.deckA.playing ? 'bg-green-500' : 'bg-gray-700'} hover:opacity-80 transition-all`}
                    >
                      {tracks.deckA.playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button className="p-3 rounded bg-gray-700 hover:bg-gray-600">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded bg-gray-700 hover:bg-gray-600">
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER MIXER */}
            <div className="col-span-4 space-y-4">
              <div className="bg-gray-800/50 rounded-lg border border-purple-500/30 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-purple-400">AI NEURAL CROSSFADER</h3>
                  <div className="text-xs text-purple-400">Quantum Audio Processing</div>
                </div>
                <div className="space-y-4">
                  {/* Advanced Crossfader */}
                  <div className="mb-6">
                    <div className="bg-black rounded-lg p-4 border border-purple-500/30 relative overflow-hidden">
                      <div className="text-center text-purple-400 text-sm mb-2">CROSSFADER POSITION</div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={crossfaderPosition}
                        onChange={(e) => setCrossfaderPosition(Number(e.target.value))}
                        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer crossfader-slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>DECK A</span>
                        <span>{crossfaderPosition}%</span>
                        <span>DECK B</span>
                      </div>
                    </div>
                  </div>

                  {/* EQ CONTROLS */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-blue-400 text-sm mb-2">DECK A EQ</div>
                      {(['high', 'mid', 'low'] as const).map((band) => (
                        <div key={band} className="mb-2">
                          <div className="text-xs text-gray-400 mb-1">{band.toUpperCase()}</div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={eqSettings.deckA[band]}
                            onChange={(e) => setEQSettings(prev => ({
                              ...prev,
                              deckA: { ...prev.deckA, [band]: Number(e.target.value) }
                            }))}
                            className="w-full h-20 bg-gray-700 rounded-lg appearance-none cursor-pointer eq-slider"
                            style={{ writingMode: 'vertical-lr' }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-center">
                      <div className="text-red-400 text-sm mb-2">DECK B EQ</div>
                      {(['high', 'mid', 'low'] as const).map((band) => (
                        <div key={band} className="mb-2">
                          <div className="text-xs text-gray-400 mb-1">{band.toUpperCase()}</div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={eqSettings.deckB[band]}
                            onChange={(e) => setEQSettings(prev => ({
                              ...prev,
                              deckB: { ...prev.deckB, [band]: Number(e.target.value) }
                            }))}
                            className="w-full h-20 bg-gray-700 rounded-lg appearance-none cursor-pointer eq-slider"
                            style={{ writingMode: 'vertical-lr' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg border border-purple-500/30 p-4">
                <h3 className="text-lg font-bold text-purple-400 mb-3">AI Assistant</h3>
                <div className="text-sm text-gray-300">Voice commands and real-time suggestions active</div>
              </div>
            </div>

            {/* RIGHT DECK B */}
            <div className="col-span-4 space-y-4">
              <div className="bg-gray-800/50 rounded-lg border border-red-500/30 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-red-400">DECK B</h3>
                  <div className="text-xs text-red-400">AI Enhanced Audio Processing</div>
                </div>
                <div className="space-y-4">
                  {/* Track Display */}
                  <div className="bg-black/30 rounded-lg p-4 border border-red-500/30">
                    <div className="text-center mb-3">
                      <div className="text-red-400 font-bold">{tracks.deckB.title}</div>
                      <div className="text-gray-400 text-sm">{tracks.deckB.artist}</div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                        <span className="text-blue-400">{tracks.deckB.bpm} BPM</span>
                        <span className="text-purple-400">{tracks.deckB.key}</span>
                        <span className="text-green-400">{tracks.deckB.energy}% Energy</span>
                      </div>
                    </div>

                    <div className="h-16 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded border border-red-500/30 flex items-center justify-center">
                      <div className="text-red-400 text-sm">WAVEFORM DISPLAY</div>
                    </div>
                  </div>

                  {/* Deck Controls */}
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handlePlayToggle('deckB')}
                      className={`p-3 rounded ${tracks.deckB.playing ? 'bg-green-500' : 'bg-gray-700'} hover:opacity-80 transition-all`}
                    >
                      {tracks.deckB.playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button className="p-3 rounded bg-gray-700 hover:bg-gray-600">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded bg-gray-700 hover:bg-gray-600">
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION - EFFECTS AND FEATURES */}
          <div className="grid grid-cols-3 gap-6">
            {/* EFFECTS PANEL */}
            <div className="bg-gray-800/50 rounded-lg border border-yellow-500/30 p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">NEURAL EFFECTS</h3>
              <div className="space-y-4">
                {['reverb', 'delay', 'filter', 'echo'].map((effect) => (
                  <div key={effect}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 capitalize">{effect}</span>
                      <span className="text-yellow-400">{effects.deckA[effect as keyof typeof effects.deckA]}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={effects.deckA[effect as keyof typeof effects.deckA]}
                      onChange={(e) => setEffects(prev => ({
                        ...prev,
                        deckA: { ...prev.deckA, [effect]: Number(e.target.value) }
                      }))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* AI FEATURES */}
            <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-4">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">AI FEATURES</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:opacity-80 transition-all">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Auto-Mix Transition
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-80 transition-all">
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  BPM Sync Assistant
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg hover:opacity-80 transition-all">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Key Harmonic Match
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg hover:opacity-80 transition-all">
                  <Users className="w-4 h-4 inline mr-2" />
                  Crowd Energy Boost
                </button>
              </div>
            </div>

            {/* REVENUE TRACKING */}
            <div className="bg-gray-800/50 rounded-lg border border-green-500/30 p-4">
              <h3 className="text-lg font-bold text-green-400 mb-4">REVENUE TRACKER</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Tonight's Earnings:</span>
                  <span className="text-green-400 font-bold">$2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Paid Requests:</span>
                  <span className="text-blue-400">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tips Received:</span>
                  <span className="text-yellow-400">$847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Peak Audience:</span>
                  <span className="text-purple-400">1,892</span>
                </div>
                <div className="bg-green-500/20 rounded p-2 mt-4">
                  <div className="text-green-400 text-sm font-bold">🎯 Target: $3,000 (95%)</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}