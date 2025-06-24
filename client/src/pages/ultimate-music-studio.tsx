import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Play, Pause, Square, Volume2, Music, Mic, Headphones, Settings, Upload, Save, Share2,
  Zap, Brain, Target, Star, Crown, TrendingUp, BarChart3, Users, Clock, Download,
  Wand2, Sparkles, Radio, Waves, Sliders, Filter, Layers, Eye, Heart, Award,
  Globe, Instagram, Youtube, Music2, Disc3, Shuffle, SkipForward, Repeat
} from 'lucide-react';

export default function UltimateMusicStudio() {
  // HIT SONG ANALYZER STATE
  const [hitAnalysis, setHitAnalysis] = useState({
    currentHits: [
      { title: 'Flowers', artist: 'Miley Cyrus', key: 'G Major', bpm: 95, structure: 'ABABCB', hitScore: 98 },
      { title: 'Anti-Hero', artist: 'Taylor Swift', key: 'C Major', bpm: 97, structure: 'ABABCB', hitScore: 96 },
      { title: 'As It Was', artist: 'Harry Styles', key: 'A Major', bpm: 95, structure: 'ABABCB', hitScore: 94 }
    ],
    trendPredictions: [
      { trend: 'Nostalgic 80s Synths', probability: 87, timeframe: '3-4 months' },
      { trend: 'Latin Pop Fusion', probability: 73, timeframe: '2-3 months' },
      { trend: 'AI Vocal Harmonies', probability: 91, timeframe: '1-2 months' }
    ],
    songScore: 0
  });

  // AI VOCALIST & VOICE CLONING
  const [voiceStudio, setVoiceStudio] = useState({
    availableVoices: [
      { name: 'Pop Princess', style: 'Taylor Swift-like', quality: 95 },
      { name: 'Soul Master', style: 'John Legend-like', quality: 93 },
      { name: 'Rock Legend', style: 'Freddie Mercury-like', quality: 97 },
      { name: 'Hip-Hop King', style: 'Drake-like', quality: 89 },
      { name: 'Electronic Queen', style: 'Billie Eilish-like', quality: 92 }
    ],
    selectedVoice: null,
    lyrics: '',
    harmonies: false,
    autoTune: 50,
    vibrato: 30
  });

  // ADVANCED BEAT MAKING
  const [beatMaker, setBeatMaker] = useState({
    drumKit: 'Billboard Trap',
    patterns: [
      { name: 'Drake Style', genre: 'Hip-Hop', complexity: 8, hitPotential: 94 },
      { name: 'Dua Lipa Groove', genre: 'Pop', complexity: 6, hitPotential: 91 },
      { name: 'Weeknd Vibe', genre: 'R&B', complexity: 7, hitPotential: 88 },
      { name: 'BTS Energy', genre: 'K-Pop', complexity: 9, hitPotential: 96 }
    ],
    selectedPattern: null,
    humanization: 75,
    swing: 16,
    velocity: 85
  });

  // MELODY & CHORD AI
  const [melodyAI, setMelodyAI] = useState({
    currentKey: 'C Major',
    progression: ['C', 'Am', 'F', 'G'],
    melodyComplexity: 6,
    emotion: 'Uplifting',
    suggestedProgression: ['vi', 'IV', 'I', 'V'],
    hookStrength: 0,
    catchiness: 0
  });

  // STEM SEPARATION ENGINE
  const [stemSeparator, setStemSeparator] = useState({
    uploadedTrack: null,
    separatedStems: {
      vocals: null,
      drums: null,
      bass: null,
      melody: null,
      harmony: null
    },
    mixingEnabled: false,
    qualityScore: 0
  });

  // PROFESSIONAL MIXING SUITE
  const [mixingSuite, setMixingSuite] = useState({
    masteringPreset: 'Spotify Loud',
    spatialAudio: false,
    referenceTrack: 'Blinding Lights - The Weeknd',
    loudnessLUFS: -14,
    dynamicRange: 8,
    stereoWidth: 100
  });

  // SOCIAL MEDIA INTEGRATION
  const [socialMedia, setSocialMedia] = useState({
    tiktokHooks: [],
    viralPotential: 0,
    hashtagSuggestions: ['#newmusic', '#hitsong', '#artisttech'],
    platformOptimization: {
      tiktok: false,
      instagram: false,
      youtube: false,
      spotify: false
    }
  });

  // COLLABORATION FEATURES
  const [collaboration, setCollaboration] = useState({
    connectedProducers: [
      { name: 'Dr. Dre AI', specialty: 'Hip-Hop', rating: 10, available: true },
      { name: 'Max Martin AI', specialty: 'Pop', rating: 10, available: true },
      { name: 'Timbaland AI', specialty: 'R&B', rating: 9, available: false }
    ],
    arScore: 0
  });

  // REVENUE OPTIMIZATION
  const [revenueOptimizer, setRevenueOptimizer] = useState({
    estimatedEarnings: {
      streaming: 2500,
      sync: 15000,
      performance: 8000
    },
    releaseStrategy: 'Single -> EP -> Album',
    optimalReleaseDate: 'Friday, March 15th',
    marketingBudget: 5000
  });

  // CURRENT PROJECT STATE
  const [currentProject, setCurrentProject] = useState({
    name: 'Untitled Hit',
    genre: 'Pop',
    bpm: 120,
    key: 'C Major',
    duration: '0:00',
    layers: 8,
    completion: 15,
    hitPotential: 0
  });

  // REAL-TIME HIT SCORE CALCULATION
  useEffect(() => {
    const calculateHitScore = () => {
      const factors = [
        beatMaker.hitPotential || 0,
        melodyAI.hookStrength,
        melodyAI.catchiness,
        voiceStudio.selectedVoice ? 85 : 0,
        stemSeparator.qualityScore,
        socialMedia.viralPotential,
        collaboration.arScore
      ];
      
      const avgScore = factors.reduce((sum, score) => sum + score, 0) / factors.length;
      setHitAnalysis(prev => ({ ...prev, songScore: Math.round(avgScore) }));
      setCurrentProject(prev => ({ ...prev, hitPotential: Math.round(avgScore) }));
    };

    calculateHitScore();
  }, [beatMaker, melodyAI, voiceStudio, stemSeparator, socialMedia, collaboration]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 70) return 'from-yellow-500 to-orange-500';
    if (score >= 50) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* STUDIO HEADER */}
      <div className="bg-gradient-to-r from-black via-purple-900/50 to-black border-b-2 border-purple-500/30 p-3">
        <div className="flex items-center justify-between max-w-[2000px] mx-auto">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="hover:scale-110 transition-transform">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-10 h-10 rounded-lg object-cover border border-purple-500/50"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-purple-400">ULTIMATE MUSIC STUDIO</h1>
              <p className="text-gray-400 text-xs">Hit Song Creation • AI-Powered • Industry Standard</p>
            </div>
            <div className={`flex items-center space-x-2 bg-gradient-to-r ${getScoreBackground(hitAnalysis.songScore)} px-3 py-1 rounded border`}>
              <Crown className="w-4 h-4 text-white" />
              <span className="text-white font-bold">HIT SCORE: {hitAnalysis.songScore}%</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold">Chart Potential: {currentProject.hitPotential}%</span>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded">
              <span className="text-blue-400 font-bold">{currentProject.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* LEFT PANEL - HIT ANALYSIS & AI TOOLS */}
        <div className="w-80 bg-gray-900/50 border-r border-gray-700 p-4 overflow-y-auto">
          
          {/* Hit Song Analyzer */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4 text-purple-400 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              HIT ANALYZER AI
            </h2>
            
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 mb-4">
              <h3 className="text-sm font-bold mb-2 text-green-400">Current Billboard Hits</h3>
              <div className="space-y-2">
                {hitAnalysis.currentHits.map((hit, index) => (
                  <div key={index} className="bg-gray-700/50 rounded p-2">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="font-bold text-xs">{hit.title}</div>
                        <div className="text-xs text-gray-400">{hit.artist}</div>
                      </div>
                      <div className={`text-xs font-bold ${getScoreColor(hit.hitScore)}`}>
                        {hit.hitScore}%
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{hit.key} • {hit.bpm} BPM</span>
                      <span>{hit.structure}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <h3 className="text-sm font-bold mb-2 text-yellow-400">Trend Predictions</h3>
              <div className="space-y-2">
                {hitAnalysis.trendPredictions.map((trend, index) => (
                  <div key={index} className="bg-gray-700/50 rounded p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs">{trend.trend}</span>
                      <span className={`text-xs font-bold ${getScoreColor(trend.probability)}`}>
                        {trend.probability}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">{trend.timeframe}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Voice Studio */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 text-cyan-400 flex items-center">
              <Mic className="w-4 h-4 mr-2" />
              AI VOICE STUDIO
            </h3>
            <div className="space-y-2">
              {voiceStudio.availableVoices.map((voice, index) => (
                <div 
                  key={index} 
                  className={`bg-gray-800/50 rounded-lg p-3 border cursor-pointer transition-colors ${
                    voiceStudio.selectedVoice === voice.name 
                      ? 'border-cyan-500 bg-cyan-500/10' 
                      : 'border-gray-700 hover:border-cyan-500/50'
                  }`}
                  onClick={() => setVoiceStudio(prev => ({ ...prev, selectedVoice: voice.name }))}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm">{voice.name}</div>
                    <div className={`text-xs font-bold ${getScoreColor(voice.quality)}`}>
                      {voice.quality}%
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{voice.style}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Auto-Tune</span>
                  <span className="text-cyan-400">{voiceStudio.autoTune}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voiceStudio.autoTune}
                  onChange={(e) => setVoiceStudio(prev => ({ ...prev, autoTune: parseInt(e.target.value) }))}
                  className="w-full accent-cyan-500"
                />
              </div>
              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded-lg transition-colors">
                Generate AI Vocals
              </button>
            </div>
          </div>

          {/* Beat Maker AI */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 text-orange-400 flex items-center">
              <Music2 className="w-4 h-4 mr-2" />
              BEAT MAKER AI
            </h3>
            <div className="space-y-2">
              {beatMaker.patterns.map((pattern, index) => (
                <div 
                  key={index}
                  className={`bg-gray-800/50 rounded-lg p-3 border cursor-pointer transition-colors ${
                    beatMaker.selectedPattern === pattern.name
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-700 hover:border-orange-500/50'
                  }`}
                  onClick={() => setBeatMaker(prev => ({ ...prev, selectedPattern: pattern.name, hitPotential: pattern.hitPotential }))}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm">{pattern.name}</div>
                    <div className={`text-xs font-bold ${getScoreColor(pattern.hitPotential)}`}>
                      {pattern.hitPotential}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{pattern.genre}</span>
                    <span>Complexity: {pattern.complexity}/10</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Humanization</span>
                  <span className="text-orange-400">{beatMaker.humanization}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={beatMaker.humanization}
                  onChange={(e) => setBeatMaker(prev => ({ ...prev, humanization: parseInt(e.target.value) }))}
                  className="w-full accent-orange-500"
                />
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition-colors">
                Generate Hit Beat
              </button>
            </div>
          </div>
        </div>

        {/* MAIN STUDIO AREA */}
        <div className="flex-1 flex flex-col">
          {/* Studio Controls */}
          <div className="bg-gray-800/50 border-b border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors">
                  <Play className="w-6 h-6" />
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors">
                  <Pause className="w-6 h-6" />
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors">
                  <Square className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-white font-mono">{currentProject.duration}</span>
                <span className="text-gray-400">•</span>
                <span className="text-purple-400">{currentProject.bpm} BPM</span>
                <span className="text-gray-400">•</span>
                <span className="text-cyan-400">{currentProject.key}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Import Track</span>
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Project</span>
              </button>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black p-6 overflow-y-auto">
            
            {/* Melody & Chord AI Section */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold mb-3 text-green-400 flex items-center">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Melody AI Generator
                </h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Current Key</label>
                      <select 
                        value={melodyAI.currentKey}
                        onChange={(e) => setMelodyAI(prev => ({ ...prev, currentKey: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        <option>C Major</option>
                        <option>G Major</option>
                        <option>D Major</option>
                        <option>A Major</option>
                        <option>E Major</option>
                        <option>Am</option>
                        <option>Em</option>
                        <option>Bm</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Emotion</label>
                      <select 
                        value={melodyAI.emotion}
                        onChange={(e) => setMelodyAI(prev => ({ ...prev, emotion: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        <option>Uplifting</option>
                        <option>Melancholic</option>
                        <option>Energetic</option>
                        <option>Romantic</option>
                        <option>Dark</option>
                        <option>Euphoric</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Melody Complexity</span>
                      <span className="text-green-400">{melodyAI.melodyComplexity}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={melodyAI.melodyComplexity}
                      onChange={(e) => setMelodyAI(prev => ({ ...prev, melodyComplexity: parseInt(e.target.value) }))}
                      className="w-full accent-green-500"
                    />
                  </div>
                  
                  <div className="bg-gray-700/50 rounded p-3">
                    <div className="text-xs text-gray-400 mb-2">Suggested Chord Progression</div>
                    <div className="flex space-x-2">
                      {melodyAI.suggestedProgression.map((chord, index) => (
                        <div key={index} className="bg-green-500/20 border border-green-500/30 px-2 py-1 rounded text-xs font-bold text-green-400">
                          {chord}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors"
                    onClick={() => setMelodyAI(prev => ({ ...prev, hookStrength: Math.random() * 40 + 60, catchiness: Math.random() * 30 + 70 }))}
                  >
                    Generate Hit Melody
                  </button>
                </div>
              </div>

              {/* Stem Separation Engine */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold mb-3 text-blue-400 flex items-center">
                  <Layers className="w-5 h-5 mr-2" />
                  Stem Separator AI
                </h4>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-400">Drop any song here for AI stem separation</div>
                    <div className="text-xs text-gray-500 mt-1">99% accuracy • Instant processing</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(stemSeparator.separatedStems).map(([stem, file]) => (
                      <div key={stem} className={`p-2 rounded border ${file ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'}`}>
                        <div className="font-bold capitalize">{stem}</div>
                        <div className="text-gray-400">{file ? 'Ready' : 'Waiting...'}</div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors"
                    onClick={() => setStemSeparator(prev => ({ ...prev, qualityScore: Math.random() * 20 + 80 }))}
                  >
                    Start Separation
                  </button>
                </div>
              </div>
            </div>

            {/* Professional Mixing Suite */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
              <h4 className="text-lg font-bold mb-3 text-red-400 flex items-center">
                <Sliders className="w-5 h-5 mr-2" />
                Professional Mixing & Mastering Suite
              </h4>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Mastering Preset</label>
                  <select 
                    value={mixingSuite.masteringPreset}
                    onChange={(e) => setMixingSuite(prev => ({ ...prev, masteringPreset: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option>Spotify Loud</option>
                    <option>Apple Music</option>
                    <option>YouTube Music</option>
                    <option>Radio Ready</option>
                    <option>Club System</option>
                    <option>Streaming Balanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Reference Track</label>
                  <select 
                    value={mixingSuite.referenceTrack}
                    onChange={(e) => setMixingSuite(prev => ({ ...prev, referenceTrack: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option>Blinding Lights - The Weeknd</option>
                    <option>Flowers - Miley Cyrus</option>
                    <option>As It Was - Harry Styles</option>
                    <option>Anti-Hero - Taylor Swift</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Loudness (LUFS)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="-23"
                      max="-6"
                      value={mixingSuite.loudnessLUFS}
                      onChange={(e) => setMixingSuite(prev => ({ ...prev, loudnessLUFS: parseInt(e.target.value) }))}
                      className="flex-1 accent-red-500"
                    />
                    <span className="text-red-400 text-xs font-bold w-8">{mixingSuite.loudnessLUFS}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Stereo Width</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={mixingSuite.stereoWidth}
                      onChange={(e) => setMixingSuite(prev => ({ ...prev, stereoWidth: parseInt(e.target.value) }))}
                      className="flex-1 accent-red-500"
                    />
                    <span className="text-red-400 text-xs font-bold w-8">{mixingSuite.stereoWidth}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-4">
                <button 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    mixingSuite.spatialAudio ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setMixingSuite(prev => ({ ...prev, spatialAudio: !prev.spatialAudio }))}
                >
                  <Waves className="w-4 h-4" />
                  <span>Spatial Audio</span>
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-lg transition-colors">
                  AI Master Track
                </button>
              </div>
            </div>

            {/* Social Media & TikTok Integration */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold mb-3 text-pink-400 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Viral Hook Creator
                </h4>
                
                <div className="space-y-3">
                  <div className="bg-gray-700/50 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">TikTok Hook Potential</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${socialMedia.viralPotential}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${getScoreColor(socialMedia.viralPotential)}`}>
                        {socialMedia.viralPotential}%
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-lg transition-colors"
                    onClick={() => setSocialMedia(prev => ({ ...prev, viralPotential: Math.random() * 40 + 60 }))}
                  >
                    Generate TikTok Hook
                  </button>
                  
                  <div className="space-y-1">
                    {socialMedia.hashtagSuggestions.map((tag, index) => (
                      <div key={index} className="bg-pink-500/20 border border-pink-500/30 px-2 py-1 rounded text-xs text-pink-400">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold mb-3 text-yellow-400 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Producer Collaboration
                </h4>
                
                <div className="space-y-2">
                  {collaboration.connectedProducers.map((producer, index) => (
                    <div key={index} className={`p-2 rounded border ${producer.available ? 'border-green-500 bg-green-500/10' : 'border-gray-600'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-sm">{producer.name}</div>
                          <div className="text-xs text-gray-400">{producer.specialty}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-yellow-400">★ {producer.rating}/10</div>
                          <div className={`text-xs ${producer.available ? 'text-green-400' : 'text-red-400'}`}>
                            {producer.available ? 'Available' : 'Busy'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg transition-colors mt-3"
                  onClick={() => setCollaboration(prev => ({ ...prev, arScore: Math.random() * 30 + 70 }))}
                >
                  Connect with A&R
                </button>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold mb-3 text-green-400 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Revenue Optimizer
                </h4>
                
                <div className="space-y-3">
                  <div className="bg-gray-700/50 rounded p-3">
                    <div className="text-xs text-gray-400 mb-2">Estimated Earnings (Year 1)</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Streaming</span>
                        <span className="text-green-400 font-bold">${revenueOptimizer.estimatedEarnings.streaming.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Sync Licensing</span>
                        <span className="text-green-400 font-bold">${revenueOptimizer.estimatedEarnings.sync.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Performance</span>
                        <span className="text-green-400 font-bold">${revenueOptimizer.estimatedEarnings.performance.toLocaleString()}</span>
                      </div>
                      <hr className="border-gray-600" />
                      <div className="flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span className="text-green-400">${(revenueOptimizer.estimatedEarnings.streaming + revenueOptimizer.estimatedEarnings.sync + revenueOptimizer.estimatedEarnings.performance).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs">
                    <div className="text-gray-400">Optimal Release</div>
                    <div className="text-white font-bold">{revenueOptimizer.optimalReleaseDate}</div>
                  </div>
                  
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors">
                    Optimize Release
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - DISTRIBUTION & ANALYTICS */}
        <div className="w-80 bg-gray-900/50 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-md font-bold text-blue-400 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              DISTRIBUTION & ANALYTICS
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Platform Distribution */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <h4 className="font-bold mb-2 text-sm">Platform Distribution</h4>
              <div className="space-y-2">
                {Object.entries(socialMedia.platformOptimization).map(([platform, enabled]) => (
                  <div key={platform} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <span className="text-sm capitalize">{platform}</span>
                    </div>
                    <button
                      onClick={() => setSocialMedia(prev => ({
                        ...prev,
                        platformOptimization: {
                          ...prev.platformOptimization,
                          [platform]: !enabled
                        }
                      }))}
                      className={`w-8 h-4 rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button className="w-full bg-spotify-green hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Music className="w-4 h-4" />
                <span>Release to Spotify</span>
              </button>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Youtube className="w-4 h-4" />
                <span>Upload to YouTube</span>
              </button>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Instagram className="w-4 h-4" />
                <span>Share on Instagram</span>
              </button>
            </div>

            {/* Project Stats */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <h4 className="font-bold mb-2 text-sm">Project Statistics</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Completion</span>
                  <span className="text-white">{currentProject.completion}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Audio Layers</span>
                  <span className="text-white">{currentProject.layers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Genre</span>
                  <span className="text-white">{currentProject.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hit Potential</span>
                  <span className={`font-bold ${getScoreColor(currentProject.hitPotential)}`}>
                    {currentProject.hitPotential}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}