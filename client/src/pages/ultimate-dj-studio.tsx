import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Play, Pause, Square, Volume2, Music, Mic, Headphones, Settings, 
  Users, Heart, TrendingUp, Zap, Radio, Shuffle, SkipForward, SkipBack, 
  Repeat, Download, Upload, Share2, Star, Eye, Clock, Disc3, Brain,
  Waves, Layers, Target, Crown, Sparkles, Globe, Camera, Lightbulb,
  Wand2, BarChart3, Crosshair, Sliders, Filter, Gauge, Activity
} from 'lucide-react';
import StudioNavigation from '../components/studio-navigation';
import { HolographicPanel, HolographicButton, DataStream } from '../components/holographic-ui';
import AdvancedWaveform from '../components/advanced-waveform';
import NeuralBackground from '../components/neural-background';
import AIAssistant from '../components/ai-assistant';

export default function UltimateDJStudio() {
  // AI BEATMATCHING & HARMONIC MIXING
  const [beatMatching, setBeatMatching] = useState({
    deckA: { bpm: 128, key: '8A', energy: 75, beatPhase: 0 },
    deckB: { bpm: 0, key: null, energy: 0, beatPhase: 0 },
    crossfaderPosition: 50,
    harmonicMatch: 0,
    syncEnabled: true,
    keyLockEnabled: true,
    camelotWheel: true
  });

  // LIVE STEM SEPARATION
  const [stemSeparation, setStemSeparation] = useState({
    deckA: {
      vocals: { level: 100, isolated: false, effects: [] },
      drums: { level: 100, isolated: false, effects: [] },
      bass: { level: 100, isolated: false, effects: [] },
      melody: { level: 100, isolated: false, effects: [] }
    },
    deckB: {
      vocals: { level: 100, isolated: false, effects: [] },
      drums: { level: 100, isolated: false, effects: [] },
      bass: { level: 100, isolated: false, effects: [] },
      melody: { level: 100, isolated: false, effects: [] }
    },
    realTimeProcessing: true,
    qualityMode: 'Ultra'
  });

  // CROWD ANALYTICS
  const [crowdAnalytics, setCrowdAnalytics] = useState({
    energyLevel: 78,
    faceDetection: true,
    activeUsers: 247,
    peakMoments: [45, 128, 203, 284],
    socialMentions: 1337,
    requestQueue: [
      { track: 'Flowers - Miley Cyrus', votes: 23, prediction: 94 },
      { track: 'Anti-Hero - Taylor Swift', votes: 18, prediction: 89 },
      { track: 'As It Was - Harry Styles', votes: 15, prediction: 85 }
    ],
    nextSuggestion: { track: 'Unholy - Sam Smith', confidence: 91 }
  });

  // CLUB INTEGRATION
  const [clubIntegration, setClubIntegration] = useState({
    pioneerLink: true,
    lightingSync: true,
    soundSystemEQ: 'Auto',
    venueProfile: 'Superclub',
    networkDevices: [
      { name: 'CDJ-3000 #1', status: 'connected' },
      { name: 'CDJ-3000 #2', status: 'connected' },
      { name: 'DJM-A9', status: 'connected' },
      { name: 'Lighting Console', status: 'connected' }
    ]
  });

  // VOCAL EFFECTS & MC TOOLS
  const [vocalStudio, setVocalStudio] = useState({
    autoTune: 45,
    voiceCloning: 'Classic DJ Voice',
    realTimeTranslation: false,
    supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Japanese'],
    micGain: 75,
    effects: {
      reverb: 30,
      delay: 20,
      filter: 0,
      distortion: 0
    }
  });

  // CURRENT TRACKS
  const [tracks, setTracks] = useState({
    deckA: {
      title: 'Flowers',
      artist: 'Miley Cyrus',
      bpm: 96,
      key: '8A',
      duration: '3:20',
      position: 85,
      loaded: true,
      playing: true,
      hitScore: 98
    },
    deckB: {
      title: 'Select Track...',
      artist: '',
      bpm: 0,
      key: null,
      duration: '0:00',
      position: 0,
      loaded: false,
      playing: false,
      hitScore: 0
    }
  });

  // LIVE VOTING SYSTEM
  const [voting, setVoting] = useState({
    enabled: true,
    currentPoll: 'Next Genre?',
    options: [
      { name: 'House', votes: 34, percentage: 42 },
      { name: 'Hip-Hop', votes: 28, percentage: 35 },
      { name: 'Pop', votes: 18, percentage: 23 }
    ],
    totalVotes: 80,
    timeRemaining: 45
  });

  // HARMONIC MIXING SUGGESTIONS
  const harmonicSuggestions = [
    { track: 'Blinding Lights - The Weeknd', key: '9A', match: 95, energy: 82 },
    { track: 'Levitating - Dua Lipa', key: '7A', match: 88, energy: 78 },
    { track: 'Good 4 U - Olivia Rodrigo', key: '8B', match: 92, energy: 85 }
  ];

  // REAL-TIME BPM SYNC
  useEffect(() => {
    if (beatMatching.syncEnabled && tracks.deckA.playing && tracks.deckB.loaded) {
      const interval = setInterval(() => {
        setBeatMatching(prev => ({
          ...prev,
          deckB: {
            ...prev.deckB,
            bpm: prev.deckA.bpm,
            beatPhase: (prev.deckA.beatPhase + 1) % 4
          }
        }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [beatMatching.syncEnabled, tracks]);

  const getKeyColor = (key: string) => {
    if (!key) return 'text-gray-400';
    const keyColors = {
      '1A': 'text-red-400', '1B': 'text-red-500',
      '2A': 'text-orange-400', '2B': 'text-orange-500',
      '3A': 'text-yellow-400', '3B': 'text-yellow-500',
      '4A': 'text-green-400', '4B': 'text-green-500',
      '5A': 'text-blue-400', '5B': 'text-blue-500',
      '6A': 'text-indigo-400', '6B': 'text-indigo-500',
      '7A': 'text-purple-400', '7B': 'text-purple-500',
      '8A': 'text-pink-400', '8B': 'text-pink-500',
      '9A': 'text-cyan-400', '9B': 'text-cyan-500',
      '10A': 'text-teal-400', '10B': 'text-teal-500',
      '11A': 'text-lime-400', '11B': 'text-lime-500',
      '12A': 'text-emerald-400', '12B': 'text-emerald-500'
    };
    return keyColors[key] || 'text-gray-400';
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 80) return 'text-red-400';
    if (energy >= 60) return 'text-yellow-400';
    if (energy >= 40) return 'text-green-400';
    return 'text-blue-400';
  };

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
                className="w-10 h-10 rounded-lg object-cover border border-blue-500/50"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-blue-400">ULTIMATE DJ STUDIO</h1>
              <p className="text-gray-400 text-xs">AI Beatmatching • Stem Separation • Crowd Analytics • Club Integration</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-bold">CROWD: {crowdAnalytics.energyLevel}%</span>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-bold">{crowdAnalytics.activeUsers}</span>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-bold">{crowdAnalytics.socialMentions}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-red-500/20 border border-red-500/30 px-3 py-1 rounded">
              <span className="text-red-400 font-bold">🔴 LIVE</span>
            </div>
            <div className="text-blue-400 font-mono text-sm">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* LEFT PANEL - CROWD ANALYTICS & AI TOOLS */}
        <div className="w-80 bg-gray-900/50 border-r border-gray-700 p-4 overflow-y-auto">
          
          {/* Crowd Analytics */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4 text-green-400 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              CROWD ANALYTICS AI
            </h2>
            
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Energy Level</span>
                <span className={`font-bold ${getEnergyColor(crowdAnalytics.energyLevel)}`}>
                  {crowdAnalytics.energyLevel}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    crowdAnalytics.energyLevel >= 80 ? 'bg-red-500' :
                    crowdAnalytics.energyLevel >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${crowdAnalytics.energyLevel}%` }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Peak Moments</div>
                  <div className="text-white font-bold">{crowdAnalytics.peakMoments.length}</div>
                </div>
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-gray-400">Face Detection</div>
                  <div className={`font-bold ${crowdAnalytics.faceDetection ? 'text-green-400' : 'text-red-400'}`}>
                    {crowdAnalytics.faceDetection ? 'ON' : 'OFF'}
                  </div>
                </div>
                </HolographicPanel>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <h3 className="text-sm font-bold mb-2 text-yellow-400">AI Song Predictions</h3>
              <div className="space-y-2">
                {crowdAnalytics.requestQueue.map((request, index) => (
                  <div key={index} className="bg-gray-700/50 rounded p-2">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-xs">{request.track}</div>
                      <div className="text-xs font-bold text-green-400">{request.prediction}%</div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{request.votes} votes</span>
                      <span>Crowd Score</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 bg-blue-500/20 border border-blue-500/30 rounded p-2">
                <div className="text-xs text-blue-400 mb-1">AI Recommendation</div>
                <div className="font-bold text-xs">{crowdAnalytics.nextSuggestion.track}</div>
                <div className="text-xs text-gray-400">Confidence: {crowdAnalytics.nextSuggestion.confidence}%</div>
              </div>
            </div>
          </div>

          {/* Harmonic Mixing */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 text-purple-400 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              HARMONIC MIXING AI
            </h3>
            <div className="space-y-2">
              {harmonicSuggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-purple-500/50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm">{suggestion.track.split(' - ')[1]}</div>
                    <div className="text-xs font-bold text-green-400">{suggestion.match}%</div>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">{suggestion.track.split(' - ')[0]}</div>
                  <div className="flex justify-between text-xs">
                    <span className={`font-bold ${getKeyColor(suggestion.key)}`}>{suggestion.key}</span>
                    <span className={`${getEnergyColor(suggestion.energy)}`}>Energy: {suggestion.energy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Club Integration */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 text-cyan-400 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              CLUB INTEGRATION
            </h3>
            <div className="space-y-2">
              {clubIntegration.networkDevices.map((device, index) => (
                <div key={index} className="bg-gray-800/50 rounded p-2 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{device.name}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      device.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Pioneer Link</span>
                <div className={`w-2 h-2 rounded-full ${clubIntegration.pioneerLink ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Lighting Sync</span>
                <div className={`w-2 h-2 rounded-full ${clubIntegration.lightingSync ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN DJ INTERFACE */}
        <div className="flex-1 flex flex-col">
          {/* Master Controls */}
          <div className="bg-gray-800/50 border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors">
                    <Play className="w-5 h-5" />
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors">
                    <Pause className="w-5 h-5" />
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors">
                    <Square className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-bold">AI SYNC</span>
                    <div className={`w-2 h-2 rounded-full ${beatMatching.syncEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Crosshair className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm font-bold">HARMONIC</span>
                    <span className="text-white text-sm">{beatMatching.harmonicMatch}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Load Track</span>
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Mic className="w-4 h-4" />
                  <span>Voice FX</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main DJ Decks */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 via-blue-900/20 to-black p-6">
            <div className="grid grid-cols-3 gap-6 h-full">
              
              {/* DECK A */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-blue-400">DECK A</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${tracks.deckA.playing ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                    <span className="text-xs text-gray-400">{tracks.deckA.playing ? 'PLAYING' : 'STOPPED'}</span>
                  </div>
                </div>
                
                {/* Track Info */}
                <div className="bg-gray-700/50 rounded p-3 mb-4">
                  <div className="font-bold text-lg mb-1">{tracks.deckA.title}</div>
                  <div className="text-gray-400 text-sm mb-2">{tracks.deckA.artist}</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white">{tracks.deckA.bpm} BPM</span>
                    <span className={`font-bold ${getKeyColor(tracks.deckA.key)}`}>{tracks.deckA.key}</span>
                    <span className="text-green-400">Hit: {tracks.deckA.hitScore}%</span>
                  </div>
                </div>

                {/* Ultra-Advanced Waveform Display */}
                <AdvancedWaveform
                  isPlaying={tracks.deckA.playing}
                  position={tracks.deckA.position}
                  color="blue"
                  title="DECK A - NEURAL WAVEFORM"
                  height={120}
                />

                {/* Stem Controls */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-bold text-cyan-400 flex items-center">
                    <Layers className="w-4 h-4 mr-1" />
                    LIVE STEMS
                  </h4>
                  {Object.entries(stemSeparation.deckA).map(([stem, control]) => (
                    <div key={stem} className="flex items-center space-x-2">
                      <button 
                        className={`w-12 h-6 rounded-full transition-colors text-xs font-bold ${
                          control.isolated ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300'
                        }`}
                        onClick={() => setStemSeparation(prev => ({
                          ...prev,
                          deckA: {
                            ...prev.deckA,
                            [stem]: { ...prev.deckA[stem], isolated: !prev.deckA[stem].isolated }
                          }
                        }))}
                      >
                        {stem.toUpperCase()}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={control.level}
                        onChange={(e) => setStemSeparation(prev => ({
                          ...prev,
                          deckA: {
                            ...prev.deckA,
                            [stem]: { ...prev.deckA[stem], level: parseInt(e.target.value) }
                          }
                        }))}
                        className="flex-1 accent-cyan-500"
                      />
                      <span className="text-xs text-cyan-400 w-8">{control.level}</span>
                    </div>
                  ))}
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

              {/* CENTER MIXER - ULTRA HIGH-TECH */}
              <div className="space-y-4">
                <HolographicPanel title="AI NEURAL CROSSFADER" subtitle="Quantum Audio Processing" glowColor="purple" ai={true}>
                  <div className="space-y-4">
                
                {/* Advanced Crossfader */}
                <div className="mb-6">
                  <div className="bg-black rounded-lg p-4 border border-purple-500/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/20 to-red-500/10"></div>
                    <div className="relative">
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span className="text-blue-400 font-bold">DECK A</span>
                          <span className="text-purple-400 font-bold">AI CROSSFADER</span>
                          <span className="text-red-400 font-bold">DECK B</span>
                        </div>
                        
                        {/* Visual Mix Display */}
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-300"
                            style={{ 
                              background: `linear-gradient(to right, 
                                rgba(59, 130, 246, ${(100 - beatMatching.crossfaderPosition) / 100}) 0%, 
                                rgba(139, 69, 19, 0.5) 50%, 
                                rgba(239, 68, 68, ${beatMatching.crossfaderPosition / 100}) 100%)`
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={beatMatching.crossfaderPosition}
                          onChange={(e) => setBeatMatching(prev => ({ ...prev, crossfaderPosition: parseInt(e.target.value) }))}
                          className="w-full h-8 bg-transparent appearance-none cursor-pointer slider-purple"
                          style={{
                            background: `linear-gradient(to right, 
                              #3b82f6 0%, 
                              #8b5cf6 50%, 
                              #ef4444 100%)`
                          }}
                        />
                        
                        {/* Crossfader Indicator */}
                        <div 
                          className="absolute top-0 w-1 h-8 bg-white shadow-lg shadow-white/50 rounded-full pointer-events-none transition-all duration-100"
                          style={{ 
                            left: `calc(${beatMatching.crossfaderPosition}% - 2px)`,
                            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs mt-3">
                        <div className="text-blue-400">
                          Volume: {100 - beatMatching.crossfaderPosition}%
                        </div>
                        <div className="text-purple-400">
                          {beatMatching.crossfaderPosition === 50 ? 'BALANCED' : 
                           beatMatching.crossfaderPosition < 50 ? 'A DOMINANT' : 'B DOMINANT'}
                        </div>
                        <div className="text-red-400">
                          Volume: {beatMatching.crossfaderPosition}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BPM Sync Display */}
                <div className="bg-gray-700/50 rounded p-3 mb-4">
                  <div className="text-center mb-2">
                    <div className="text-xs text-gray-400">BPM SYNC</div>
                    <div className="text-2xl font-bold text-green-400">
                      {beatMatching.deckA.bpm} ↔ {beatMatching.deckB.bpm || '--'}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button 
                      className={`px-4 py-2 rounded transition-colors ${
                        beatMatching.syncEnabled ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                      }`}
                      onClick={() => setBeatMatching(prev => ({ ...prev, syncEnabled: !prev.syncEnabled }))}
                    >
                      {beatMatching.syncEnabled ? 'SYNC ON' : 'SYNC OFF'}
                    </button>
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

                {/* Vocal Studio */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-bold text-pink-400 flex items-center">
                    <Mic className="w-4 h-4 mr-1" />
                    VOCAL STUDIO
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Auto-Tune</span>
                      <span className="text-pink-400">{vocalStudio.autoTune}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vocalStudio.autoTune}
                      onChange={(e) => setVocalStudio(prev => ({ ...prev, autoTune: parseInt(e.target.value) }))}
                      className="w-full accent-pink-500"
                    />
                  </div>
                  <select 
                    value={vocalStudio.voiceCloning}
                    onChange={(e) => setVocalStudio(prev => ({ ...prev, voiceCloning: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                  >
                    <option>Classic DJ Voice</option>
                    <option>Radio Host</option>
                    <option>Club MC</option>
                    <option>Festival Announcer</option>
                  </select>
                </div>
              </div>

              {/* DECK B */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-red-400">DECK B</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${tracks.deckB.playing ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                    <span className="text-xs text-gray-400">{tracks.deckB.playing ? 'PLAYING' : 'STOPPED'}</span>
                  </div>
                </div>
                
                {/* Track Info */}
                <div className="bg-gray-700/50 rounded p-3 mb-4 border-2 border-dashed border-gray-600 text-center">
                  {tracks.deckB.loaded ? (
                    <div>
                      <div className="font-bold text-lg mb-1">{tracks.deckB.title}</div>
                      <div className="text-gray-400 text-sm mb-2">{tracks.deckB.artist}</div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white">{tracks.deckB.bpm} BPM</span>
                        <span className={`font-bold ${getKeyColor(tracks.deckB.key)}`}>{tracks.deckB.key}</span>
                        <span className="text-green-400">Hit: {tracks.deckB.hitScore}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <div className="text-gray-400 text-sm">Load Next Track</div>
                      <div className="text-xs text-gray-500">AI will suggest harmonic matches</div>
                    </div>
                  )}
                </div>

                {/* Ultra-Advanced Waveform Display B */}
                {tracks.deckB.loaded ? (
                  <AdvancedWaveform
                    isPlaying={tracks.deckB.playing}
                    position={tracks.deckB.position}
                    color="red"
                    title="DECK B - NEURAL WAVEFORM"
                    height={120}
                  />
                ) : (
                  <HolographicPanel title="DECK B" subtitle="Load track to activate neural analysis">
                    <div className="text-center py-8">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <div className="text-gray-400">Drag & drop or click to load</div>
                      <HolographicButton variant="secondary" size="small">
                        Browse Files
                      </HolographicButton>
                    </div>
                  </HolographicPanel>
                )}

                {/* Stem Controls */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-bold text-cyan-400 flex items-center">
                    <Layers className="w-4 h-4 mr-1" />
                    LIVE STEMS
                  </h4>
                  {Object.entries(stemSeparation.deckB).map(([stem, control]) => (
                    <div key={stem} className="flex items-center space-x-2">
                      <button 
                        className={`w-12 h-6 rounded-full transition-colors text-xs font-bold ${
                          control.isolated ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300'
                        }`}
                        onClick={() => setStemSeparation(prev => ({
                          ...prev,
                          deckB: {
                            ...prev.deckB,
                            [stem]: { ...prev.deckB[stem], isolated: !prev.deckB[stem].isolated }
                          }
                        }))}
                      >
                        {stem.toUpperCase()}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={control.level}
                        onChange={(e) => setStemSeparation(prev => ({
                          ...prev,
                          deckB: {
                            ...prev.deckB,
                            [stem]: { ...prev.deckB[stem], level: parseInt(e.target.value) }
                          }
                        }))}
                        className="flex-1 accent-cyan-500"
                      />
                      <span className="text-xs text-cyan-400 w-8">{control.level}</span>
                    </div>
                  ))}
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
                </HolographicPanel>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - LIVE VOTING & SOCIAL */}
        <div className="w-80 bg-gray-900/50 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-md font-bold text-green-400 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              LIVE VOTING & SOCIAL
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Current Poll */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <h4 className="font-bold mb-2 text-sm text-yellow-400">{voting.currentPoll}</h4>
              <div className="space-y-2">
                {voting.options.map((option, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{option.name}</span>
                      <span className="text-yellow-400">{option.votes} ({option.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-400 text-center">
                {voting.timeRemaining}s remaining • {voting.totalVotes} total votes
              </div>
            </div>

            {/* Social Media Feed */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <h4 className="font-bold mb-2 text-sm text-blue-400">Social Mentions</h4>
              <div className="space-y-2 text-xs">
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-blue-400 font-bold">@musiclover23</div>
                  <div className="text-gray-300">"This DJ is killing it! 🔥 #artisttech"</div>
                  <div className="text-gray-400 text-xs">2 minutes ago</div>
                </div>
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-pink-400 font-bold">@partygirl</div>
                  <div className="text-gray-300">"Need this playlist! Drop the tracklist!"</div>
                  <div className="text-gray-400 text-xs">3 minutes ago</div>
                </div>
                <div className="bg-gray-700/50 rounded p-2">
                  <div className="text-green-400 font-bold">@clubkid</div>
                  <div className="text-gray-300">"Best set I've heard all year 🎵"</div>
                  <div className="text-gray-400 text-xs">5 minutes ago</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Radio className="w-4 h-4" />
                <span>Go Live on Instagram</span>
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share Set Clip</span>
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Mix</span>
              </button>
            </div>

            {/* Performance Stats */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <h4 className="font-bold mb-2 text-sm text-cyan-400">Performance Stats</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Set Duration</span>
                  <span className="text-white">2:47:33</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tracks Played</span>
                  <span className="text-white">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Peak Energy</span>
                  <span className="text-green-400">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Mix Rating</span>
                  <span className="text-yellow-400">9.2/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}