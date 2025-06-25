import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Play, Pause, Square, Volume2, Music, Mic, Headphones, Settings, Upload, Save, Share2,
  Zap, Brain, Target, Star, Crown, TrendingUp, BarChart3, Users, Clock, Download,
  Wand2, Sparkles, Radio, Waves, Sliders, Filter, Layers, Eye, Heart, Award,
  Globe, Instagram, Youtube, Music2, Disc3, Shuffle, SkipForward, Repeat, DollarSign,
  Lightbulb, Camera, Gauge, Activity, Crosshair, MapPin, Calendar, Briefcase, 
  MessageSquare, Headphones as HeadphonesIcon, Wireless, Cpu, Database, Mic2
} from 'lucide-react';
import StudioNavigation from '../components/studio-navigation';

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

  // BILLBOARD HIT FORMULA ANALYZER
  const [billboardAnalyzer, setBillboardAnalyzer] = useState({
    currentChartData: [
      { position: 1, track: 'Flowers - Miley Cyrus', weeks: 8, formula: 'vi-IV-I-V', hitScore: 98 },
      { position: 2, track: 'Anti-Hero - Taylor Swift', weeks: 12, formula: 'I-V-vi-IV', hitScore: 96 },
      { position: 3, track: 'As It Was - Harry Styles', weeks: 15, formula: 'vi-IV-I-V', hitScore: 94 }
    ],
    trendingElements: ['80s Synths', 'Auto-tuned Vocals', 'Trap Drums', 'Guitar Riffs'],
    hitProbability: 0,
    structureAnalysis: null
  });

  // CELEBRITY VOICE SYNTHESIS
  const [celebrityVoices, setCelebrityVoices] = useState({
    availableVoices: [
      { name: 'Taylor Swift Style', genre: 'Pop', quality: 96, legal: true },
      { name: 'Drake Style', genre: 'Hip-Hop', quality: 94, legal: true },
      { name: 'Billie Eilish Style', genre: 'Alt-Pop', quality: 95, legal: true },
      { name: 'The Weeknd Style', genre: 'R&B', quality: 93, legal: true },
      { name: 'Ariana Grande Style', genre: 'Pop', quality: 97, legal: true }
    ],
    selectedVoice: null,
    harmoniesGenerated: false,
    vocalProcessing: {
      autotune: 60,
      compression: 70,
      reverb: 40,
      delay: 30
    }
  });

  // ADVANCED COMPOSITION AI
  const [compositionAI, setCompositionAI] = useState({
    melodyGPT: {
      active: false,
      genre: 'Pop',
      mood: 'Uplifting',
      complexity: 7,
      generatedMelody: null
    },
    chordGenius: {
      currentProgression: ['C', 'Am', 'F', 'G'],
      suggestions: [
        { progression: 'vi-IV-I-V', popularity: 95, used_in: 'Flowers, Someone Like You' },
        { progression: 'I-V-vi-IV', popularity: 89, used_in: 'Let It Be, Don\'t Stop Believin\'' },
        { progression: 'I-vi-IV-V', popularity: 82, used_in: 'Stand By Me, Blue Moon' }
      ]
    },
    songStructure: {
      recommended: 'Intro-Verse-PreChorus-Chorus-Verse-PreChorus-Chorus-Bridge-Chorus-Outro',
      timing: { intro: 8, verse: 16, prechorus: 8, chorus: 16, bridge: 8 }
    }
  });

  // SESSION MUSICIAN AI
  const [sessionMusicians, setSessionMusicians] = useState({
    virtualOrchestra: {
      strings: { active: false, style: 'Cinematic', intensity: 70 },
      brass: { active: false, style: 'Jazz', intensity: 60 },
      woodwinds: { active: false, style: 'Classical', intensity: 50 }
    },
    guitarSolo: {
      style: 'Blues Rock',
      artist: 'Hendrix Style',
      generated: false,
      duration: 16
    },
    drumProgramming: {
      style: 'Modern Pop',
      humanization: 85,
      complexity: 7,
      swing: 16
    }
  });

  // TIKTOK & VIRAL HOOK CREATOR  
  const [viralHookCreator, setViralHookCreator] = useState({
    hooks: [],
    currentTrends: [
      { sound: 'Aesthetic Synth Pad', popularity: 94, timeframe: '15-30s' },
      { sound: 'Vocal Chop Drop', popularity: 87, timeframe: '7-15s' },
      { sound: 'Guitar Riff Loop', popularity: 81, timeframe: '10-20s' }
    ],
    optimalHashtags: ['#newmusic', '#viral', '#artisttech', '#hitsong'],
    viralPotential: 0
  });

  // COLLABORATION HUB
  const [collaborationHub, setCollaborationHub] = useState({
    connectedProducers: [
      { name: 'Max Martin AI', specialty: 'Pop Hits', rating: 10, available: true, price: '$5000' },
      { name: 'Metro Boomin AI', specialty: 'Hip-Hop', rating: 9, available: true, price: '$3500' },
      { name: 'Jack Antonoff AI', specialty: 'Indie Pop', rating: 9, available: false, price: '$4000' }
    ],
    arConnections: [
      { label: 'Atlantic Records', interest: 94, genre: 'Pop' },
      { label: 'Interscope', interest: 87, genre: 'Hip-Hop' },
      { label: 'Republic Records', interest: 91, genre: 'Pop/R&B' }
    ],
    syncOpportunities: [
      { project: 'Netflix Series Soundtrack', match: 89, budget: '$15000' },
      { project: 'Apple iPhone Commercial', match: 76, budget: '$25000' },
      { project: 'FIFA 2025 Game', match: 83, budget: '$8000' }
    ]
  });

  // REAL-TIME COLLABORATION
  const [realTimeCollab, setRealTimeCollab] = useState({
    activeUsers: [
      { name: 'Producer Mike', role: 'Beat Maker', status: 'online', location: 'Mix Console' },
      { name: 'Vocalist Sarah', role: 'Singer', status: 'recording', location: 'Vocal Booth' },
      { name: 'Engineer Tom', role: 'Mix Engineer', status: 'mixing', location: 'Master Bus' }
    ],
    versionControl: {
      currentVersion: '2.1.3',
      branches: ['main', 'vocal-experiment', 'beat-variation'],
      changes: 15
    },
    videoCall: false
  });

  // INDUSTRY ANALYTICS
  const [industryAnalytics, setIndustryAnalytics] = useState({
    marketPosition: {
      genre: 'Pop',
      saturation: 73,
      opportunity: 'High',
      competitors: ['Dua Lipa', 'Harry Styles', 'Billie Eilish']
    },
    fanDemographics: {
      age: '18-34',
      gender: '65% Female',
      location: 'US, UK, Canada',
      interests: ['Pop Music', 'Social Media', 'Fashion']
    },
    careerTrajectory: {
      currentLevel: 'Emerging Artist',
      nextMilestone: '100K Monthly Listeners',
      timeToAchieve: '6-8 months',
      successProbability: 78
    }
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

            {/* Billboard Hit Formula Analyzer */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
              <h4 className="text-lg font-bold mb-3 text-yellow-400 flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Billboard Hit Formula Analyzer
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-bold mb-2 text-green-400">Current Chart Analysis</h5>
                  <div className="space-y-2">
                    {billboardAnalyzer.currentChartData.map((hit, index) => (
                      <div key={index} className="bg-gray-700/50 rounded p-2">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <div className="font-bold text-xs">#{hit.position} {hit.track}</div>
                            <div className="text-xs text-gray-400">{hit.weeks} weeks • {hit.formula}</div>
                          </div>
                          <div className={`text-xs font-bold ${getScoreColor(hit.hitScore)}`}>
                            {hit.hitScore}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-bold mb-2 text-purple-400">Trending Elements</h5>
                  <div className="space-y-1">
                    {billboardAnalyzer.trendingElements.map((element, index) => (
                      <div key={index} className="bg-purple-500/20 border border-purple-500/30 px-2 py-1 rounded text-xs text-purple-400">
                        {element}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="text-sm font-bold mb-2 text-blue-400">Chord Progression Genius</h5>
                    <div className="space-y-1">
                      {compositionAI.chordGenius.suggestions.map((prog, index) => (
                        <div key={index} className="bg-gray-700/50 rounded p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xs">{prog.progression}</span>
                            <span className="text-xs text-green-400">{prog.popularity}%</span>
                          </div>
                          <div className="text-xs text-gray-400">{prog.used_in}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg transition-colors mt-4"
                onClick={() => setBillboardAnalyzer(prev => ({ ...prev, hitProbability: Math.random() * 30 + 70 }))}
              >
                Analyze Hit Potential
              </button>
            </div>

            {/* Celebrity Voice Synthesis & Session Musicians */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold mb-3 text-pink-400 flex items-center">
                  <Mic2 className="w-5 h-5 mr-2" />
                  Celebrity Voice Synthesis
                </h4>
                
                <div className="space-y-2 mb-4">
                  {celebrityVoices.availableVoices.map((voice, index) => (
                    <div 
                      key={index} 
                      className={`bg-gray-700/50 rounded p-2 cursor-pointer transition-colors border ${
                        celebrityVoices.selectedVoice === voice.name 
                          ? 'border-pink-500 bg-pink-500/10' 
                          : 'border-gray-600 hover:border-pink-500/50'
                      }`}
                      onClick={() => setCelebrityVoices(prev => ({ ...prev, selectedVoice: voice.name }))}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-bold text-sm">{voice.name}</div>
                        <div className={`text-xs font-bold ${getScoreColor(voice.quality)}`}>
                          {voice.quality}%
                        </div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">{voice.genre}</span>
                        <span className={`${voice.legal ? 'text-green-400' : 'text-red-400'}`}>
                          {voice.legal ? 'Legal' : 'Sample Only'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <button 
                    className={`w-full py-2 rounded transition-colors ${
                      celebrityVoices.harmoniesGenerated 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setCelebrityVoices(prev => ({ ...prev, harmoniesGenerated: !prev.harmoniesGenerated }))}
                  >
                    {celebrityVoices.harmoniesGenerated ? 'Harmonies Generated' : 'Generate AI Harmonies'}
                  </button>
                  <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded transition-colors">
                    Clone & Synthesize Voice
                  </button>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold mb-3 text-orange-400 flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  Session Musician AI
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-bold mb-2 text-cyan-400">Virtual Orchestra</h5>
                    {Object.entries(sessionMusicians.virtualOrchestra).map(([instrument, config]) => (
                      <div key={instrument} className="flex items-center space-x-2 mb-1">
                        <button 
                          className={`w-16 h-6 rounded transition-colors text-xs font-bold ${
                            config.active ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300'
                          }`}
                          onClick={() => setSessionMusicians(prev => ({
                            ...prev,
                            virtualOrchestra: {
                              ...prev.virtualOrchestra,
                              [instrument]: { ...prev.virtualOrchestra[instrument], active: !prev.virtualOrchestra[instrument].active }
                            }
                          }))}
                        >
                          {instrument.toUpperCase()}
                        </button>
                        <select 
                          value={config.style}
                          onChange={(e) => setSessionMusicians(prev => ({
                            ...prev,
                            virtualOrchestra: {
                              ...prev.virtualOrchestra,
                              [instrument]: { ...prev.virtualOrchestra[instrument], style: e.target.value }
                            }
                          }))}
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                        >
                          <option>Cinematic</option>
                          <option>Classical</option>
                          <option>Modern</option>
                          <option>Jazz</option>
                        </select>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-bold mb-2 text-yellow-400">Guitar Solo Generator</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        value={sessionMusicians.guitarSolo.style}
                        onChange={(e) => setSessionMusicians(prev => ({
                          ...prev,
                          guitarSolo: { ...prev.guitarSolo, style: e.target.value }
                        }))}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                      >
                        <option>Blues Rock</option>
                        <option>Shred Metal</option>
                        <option>Jazz Fusion</option>
                        <option>Classic Rock</option>
                      </select>
                      <select 
                        value={sessionMusicians.guitarSolo.artist}
                        onChange={(e) => setSessionMusicians(prev => ({
                          ...prev,
                          guitarSolo: { ...prev.guitarSolo, artist: e.target.value }
                        }))}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                      >
                        <option>Hendrix Style</option>
                        <option>Page Style</option>
                        <option>Gilmour Style</option>
                        <option>Slash Style</option>
                      </select>
                    </div>
                    <button 
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 rounded transition-colors mt-2"
                      onClick={() => setSessionMusicians(prev => ({ ...prev, guitarSolo: { ...prev.guitarSolo, generated: true } }))}
                    >
                      Generate Guitar Solo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TikTok Creator & Real-Time Collaboration */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold mb-3 text-pink-400 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  TikTok Hook Creator
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
                <h4 className="text-lg font-bold mb-3 text-cyan-400 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Real-Time Collaboration
                </h4>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Multi-User DAW</span>
                    <button 
                      className={`px-2 py-1 rounded text-xs ${
                        realTimeCollab.videoCall ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                      }`}
                      onClick={() => setRealTimeCollab(prev => ({ ...prev, videoCall: !prev.videoCall }))}
                    >
                      {realTimeCollab.videoCall ? 'Video ON' : 'Video OFF'}
                    </button>
                  </div>
                  
                  {realTimeCollab.activeUsers.map((user, index) => (
                    <div key={index} className="bg-gray-700/50 rounded p-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-sm">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.role}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs ${
                            user.status === 'online' ? 'text-green-400' : 
                            user.status === 'recording' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {user.status.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-400">{user.location}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-700/50 rounded p-2 mb-3">
                  <div className="text-xs text-gray-400 mb-1">Version Control</div>
                  <div className="flex justify-between text-xs">
                    <span>v{realTimeCollab.versionControl.currentVersion}</span>
                    <span>{realTimeCollab.versionControl.changes} changes</span>
                  </div>
                  <div className="flex space-x-1 mt-1">
                    {realTimeCollab.versionControl.branches.map((branch, index) => (
                      <span key={index} className="bg-cyan-500/20 px-1 rounded text-xs text-cyan-400">
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded-lg transition-colors">
                  Start Collaboration
                </button>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-bold mb-3 text-yellow-400 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Industry Connections
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-bold mb-1 text-green-400">A&R Connections</h5>
                    {collaborationHub.arConnections.map((ar, index) => (
                      <div key={index} className="bg-gray-700/50 rounded p-2 mb-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-sm">{ar.label}</div>
                            <div className="text-xs text-gray-400">{ar.genre}</div>
                          </div>
                          <div className={`text-xs font-bold ${getScoreColor(ar.interest)}`}>
                            {ar.interest}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-bold mb-1 text-purple-400">Sync Opportunities</h5>
                    {collaborationHub.syncOpportunities.slice(0, 2).map((sync, index) => (
                      <div key={index} className="bg-gray-700/50 rounded p-2 mb-1">
                        <div className="font-bold text-xs">{sync.project}</div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">{sync.match}% match</span>
                          <span className="text-green-400">{sync.budget}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg transition-colors mt-3"
                  onClick={() => setCollaboration(prev => ({ ...prev, arScore: Math.random() * 30 + 70 }))}
                >
                  Connect with Labels
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

            {/* Industry Analytics */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 mb-4">
              <h4 className="font-bold mb-2 text-sm text-cyan-400 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Industry Analytics
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-gray-400 mb-1">Market Position</div>
                  <div className="bg-gray-700/50 rounded p-2">
                    <div className="flex justify-between mb-1">
                      <span>Genre Saturation</span>
                      <span className={`${industryAnalytics.marketPosition.saturation > 70 ? 'text-red-400' : 'text-green-400'}`}>
                        {industryAnalytics.marketPosition.saturation}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Opportunity</span>
                      <span className="text-green-400">{industryAnalytics.marketPosition.opportunity}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400 mb-1">Fan Demographics</div>
                  <div className="bg-gray-700/50 rounded p-2">
                    <div className="flex justify-between mb-1">
                      <span>Primary Age</span>
                      <span className="text-white">{industryAnalytics.fanDemographics.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gender Split</span>
                      <span className="text-white">{industryAnalytics.fanDemographics.gender}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400 mb-1">Career Trajectory</div>
                  <div className="bg-gray-700/50 rounded p-2">
                    <div className="flex justify-between mb-1">
                      <span>Success Probability</span>
                      <span className={`font-bold ${getScoreColor(industryAnalytics.careerTrajectory.successProbability)}`}>
                        {industryAnalytics.careerTrajectory.successProbability}%
                      </span>
                    </div>
                    <div className="text-gray-400">{industryAnalytics.careerTrajectory.timeToAchieve}</div>
                  </div>
                </div>
              </div>
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