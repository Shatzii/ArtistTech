import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Play, Pause, Square, RotateCcw, Volume2, Headphones, Search, DollarSign, Heart, Clock, Users, TrendingUp, SkipForward, Shuffle, Repeat, Music, Settings, Filter, Zap, Mic, Radio, Download, Upload } from 'lucide-react';

export default function DJStudio() {
  // 4-CHANNEL PIONEER DJM-900NXS2 + CDJ-3000 SETUP
  const [decks, setDecks] = useState({
    A: {
      isPlaying: false,
      currentTime: 45,
      duration: 225,
      volume: 0.8,
      pitch: 0,
      gain: 0.7,
      eq: { high: 0, mid: 0, low: 0 },
      cue: false,
      loop: { enabled: false, start: 0, end: 0, length: 4 },
      hotCues: Array(8).fill(null),
      slip: false,
      quantize: true,
      keyShift: 0,
      effects: { 
        reverb: 0, 
        delay: 0, 
        filter: 0,
        echo: 0,
        flanger: 0,
        phaser: 0,
        bitCrusher: 0,
        rollGate: 0
      },
      bpm: 123,
      tempoRange: 16, // ±16%
      jogMode: 'vinyl', // vinyl or cd
      needleLock: false,
      track: { 
        title: 'One More Time', 
        artist: 'Daft Punk',
        album: 'Discovery',
        key: 'F# Minor',
        energy: 85,
        genre: 'House',
        beatGrid: true,
        analyzed: true,
        rating: 5,
        color: 'blue'
      }
    },
    B: {
      isPlaying: false,
      currentTime: 0,
      duration: 210,
      volume: 0.8,
      pitch: 0,
      gain: 0.7,
      eq: { high: 0, mid: 0, low: 0 },
      cue: false,
      loop: { enabled: false, start: 0, end: 0, length: 4 },
      hotCues: Array(8).fill(null),
      slip: false,
      quantize: true,
      keyShift: 0,
      effects: { 
        reverb: 0, 
        delay: 0, 
        filter: 0,
        echo: 0,
        flanger: 0,
        phaser: 0,
        bitCrusher: 0,
        rollGate: 0
      },
      bpm: 128,
      tempoRange: 16,
      jogMode: 'vinyl',
      needleLock: false,
      track: { 
        title: 'Strobe', 
        artist: 'Deadmau5',
        album: 'For Lack of a Better Name',
        key: 'A Minor',
        energy: 92,
        genre: 'Progressive House',
        beatGrid: true,
        analyzed: true,
        rating: 4,
        color: 'orange'
      }
    },
    C: {
      isPlaying: false,
      currentTime: 0,
      duration: 195,
      volume: 0.8,
      pitch: 0,
      gain: 0.7,
      eq: { high: 0, mid: 0, low: 0 },
      cue: false,
      loop: { enabled: false, start: 0, end: 0, length: 4 },
      hotCues: Array(8).fill(null),
      slip: false,
      quantize: true,
      keyShift: 0,
      effects: { 
        reverb: 0, 
        delay: 0, 
        filter: 0,
        echo: 0,
        flanger: 0,
        phaser: 0,
        bitCrusher: 0,
        rollGate: 0
      },
      bpm: 140,
      tempoRange: 16,
      jogMode: 'vinyl',
      needleLock: false,
      track: { 
        title: 'Levels', 
        artist: 'Avicii',
        album: 'True',
        key: 'C# Minor',
        energy: 98,
        genre: 'Progressive House',
        beatGrid: true,
        analyzed: true,
        rating: 5,
        color: 'green'
      }
    },
    D: {
      isPlaying: false,
      currentTime: 0,
      duration: 180,
      volume: 0.8,
      pitch: 0,
      gain: 0.7,
      eq: { high: 0, mid: 0, low: 0 },
      cue: false,
      loop: { enabled: false, start: 0, end: 0, length: 4 },
      hotCues: Array(8).fill(null),
      slip: false,
      quantize: true,
      keyShift: 0,
      effects: { 
        reverb: 0, 
        delay: 0, 
        filter: 0,
        echo: 0,
        flanger: 0,
        phaser: 0,
        bitCrusher: 0,
        rollGate: 0
      },
      bpm: 126,
      tempoRange: 16,
      jogMode: 'vinyl',
      needleLock: false,
      track: { 
        title: 'Titanium', 
        artist: 'David Guetta ft. Sia',
        album: 'Nothing But The Beat',
        key: 'F# Major',
        energy: 89,
        genre: 'Electro House',
        beatGrid: true,
        analyzed: true,
        rating: 4,
        color: 'purple'
      }
    }
  });

  // 4-CHANNEL DJM-900NXS2 MIXER CONTROLS
  const [crossfaderA, setCrossfaderA] = useState(50); // A vs B
  const [crossfaderB, setCrossfaderB] = useState(50); // C vs D
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [masterEQ, setMasterEQ] = useState({ high: 0, mid: 0, low: 0 });
  const [headphoneLevel, setHeadphoneLevel] = useState(0.6);
  const [cueMix, setCueMix] = useState(50);
  
  // SOUND COLOR FX & BEAT FX (DJM-900NXS2 Features)
  const [soundColorFX, setSoundColorFX] = useState({
    A: { type: 'none', intensity: 0 },
    B: { type: 'none', intensity: 0 },
    C: { type: 'none', intensity: 0 },
    D: { type: 'none', intensity: 0 }
  });
  const [beatFX, setBeatFX] = useState({ type: 'none', beat: '1/4', time: 1000 });
  
  // VISUAL EFFECTS SYSTEM
  const [visualEffects, setVisualEffects] = useState({
    enabled: true,
    mode: 'reactive', // reactive, auto, manual
    intensity: 80,
    colorPalette: 'spectrum', // spectrum, neon, club, custom
    particleCount: 500,
    strobeSync: true,
    laserShow: true,
    smokeEffect: true
  });
  
  // CROWD ENERGY & VISUAL FEEDBACK
  const [crowdEnergy, setCrowdEnergy] = useState(75);
  const [visualBeats, setVisualBeats] = useState(Array(32).fill(0));
  
  // Live Performance Features
  const [isLive, setIsLive] = useState(true);
  const [liveListeners, setLiveListeners] = useState(1247);
  const [totalRevenue, setTotalRevenue] = useState(340);
  const [showVotingQueue, setShowVotingQueue] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  
  // Integrated Voting System (Core Feature)
  const [votingQueue, setVotingQueue] = useState([
    { id: '1', title: 'HUMBLE.', artist: 'Kendrick Lamar', votes: 15, amount: 50, priority: 125, energy: 95, bpm: 150, key: 'C Minor', requestedBy: 'Club_VIP', timeRequested: '1 min ago', genre: 'Hip-Hop' },
    { id: '2', title: 'One More Time', artist: 'Daft Punk', votes: 12, amount: 25, priority: 85, energy: 85, bpm: 123, key: 'F# Minor', requestedBy: 'Mike_DJ', timeRequested: '2 min ago', genre: 'House' },
    { id: '3', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', votes: 9, amount: 20, priority: 65, energy: 88, bpm: 115, key: 'D Minor', requestedBy: 'Party_King', timeRequested: '3 min ago', genre: 'Funk' },
    { id: '4', title: 'Strobe', artist: 'Deadmau5', votes: 8, amount: 15, priority: 55, energy: 92, bpm: 128, key: 'A Minor', requestedBy: 'Sarah_M', timeRequested: '5 min ago', genre: 'Progressive House' },
    { id: '5', title: 'Blinding Lights', artist: 'The Weeknd', votes: 6, amount: 10, priority: 40, energy: 80, bpm: 171, key: 'F# Major', requestedBy: 'Anonymous', timeRequested: '8 min ago', genre: 'Pop' },
  ]);

  // Music Library
  const [library, setLibrary] = useState([
    { id: 'lib1', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', bpm: 178, key: 'F# Major', energy: 89, genre: 'Pop Rock' },
    { id: 'lib2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', bpm: 103, key: 'B Minor', energy: 85, genre: 'Disco Pop' },
    { id: 'lib3', title: 'Industry Baby', artist: 'Lil Nas X, Jack Harlow', album: 'MONTERO', bpm: 150, key: 'D Minor', energy: 94, genre: 'Hip-Hop' },
    { id: 'lib4', title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', bpm: 80, key: 'E Minor', energy: 75, genre: 'Indie Pop' },
    { id: 'lib5', title: 'As It Was', artist: 'Harry Styles', album: 'Harry\'s House', bpm: 173, key: 'A Major', energy: 82, genre: 'Pop' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Professional Functions
  const updateDeck = (deck: 'A' | 'B', property: string, value: any) => {
    setDecks(prev => ({
      ...prev,
      [deck]: {
        ...prev[deck],
        [property]: value
      }
    }));
  };

  const updateEQ = (deck: 'A' | 'B', band: 'high' | 'mid' | 'low', value: number) => {
    setDecks(prev => ({
      ...prev,
      [deck]: {
        ...prev[deck],
        eq: { ...prev[deck].eq, [band]: value }
      }
    }));
  };

  const loadTrackToDeck = (track: any, deck: 'A' | 'B') => {
    setDecks(prev => ({
      ...prev,
      [deck]: {
        ...prev[deck],
        track: track,
        bpm: track.bpm,
        currentTime: 0,
        isPlaying: false
      }
    }));
    
    // If from voting queue, remove it and add revenue
    if (track.amount) {
      setVotingQueue(prev => prev.filter(t => t.id !== track.id));
      setTotalRevenue(prev => prev + track.amount);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBPMDifference = () => {
    return Math.abs(decks.A.bpm - decks.B.bpm);
  };

  const getKeyCompatibility = () => {
    const keyMap: { [key: string]: number } = {
      'C Major': 0, 'A Minor': 0, 'G Major': 1, 'E Minor': 1, 'D Major': 2, 'B Minor': 2,
      'A Major': 3, 'F# Minor': 3, 'E Major': 4, 'C# Minor': 4, 'B Major': 5, 'G# Minor': 5,
      'F# Major': 6, 'D# Minor': 6, 'C# Major': 7, 'A# Minor': 7, 'G# Major': 8, 'F Minor': 8,
      'D# Major': 9, 'C Minor': 9, 'A# Major': 10, 'G Minor': 10, 'F Major': 11, 'D Minor': 11
    };
    
    const keyA = keyMap[decks.A.track.key] || 0;
    const keyB = keyMap[decks.B.track.key] || 0;
    const diff = Math.min(Math.abs(keyA - keyB), 12 - Math.abs(keyA - keyB));
    
    if (diff === 0) return { status: 'Perfect', color: 'text-green-400' };
    if (diff <= 1) return { status: 'Compatible', color: 'text-yellow-400' };
    return { status: 'Clash', color: 'text-red-400' };
  };

  const sortedVotingQueue = [...votingQueue].sort((a, b) => b.priority - a.priority);
  const keyCompatibility = getKeyCompatibility();
  const bpmDiff = getBPMDifference();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Club-Standard Header - Pioneer CDJ-3000 + DJM-900NXS2 */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-red-500/30 p-3">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="hover:scale-110 transition-transform">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-10 h-10 rounded-lg object-cover border border-red-500/50"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-red-500">
                PIONEER CDJ-3000 × DJM-900NXS2
              </h1>
              <p className="text-gray-400 text-xs">Industry Standard Club Setup • rekordbox Integration</p>
            </div>
            <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-bold text-sm">PROFESSIONAL MODE</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-bold">LIVE</span>
              <span className="text-white/60">•</span>
              <span className="text-white/60">{liveListeners.toLocaleString()} listeners</span>
            </div>
            <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-lg">
              <DollarSign className="w-4 h-4 inline mr-2 text-green-400" />
              <span className="text-green-400 font-bold">${totalRevenue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* INSANE VISUAL BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Reactive Particle System */}
        <div className="absolute inset-0">
          {Array.from({length: visualEffects.particleCount}).map((_, i) => {
            const isActive = visualBeats[i % visualBeats.length] > 50;
            const deckColors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
            const activeDecks = [decks.A.isPlaying, decks.B.isPlaying, decks.C.isPlaying, decks.D.isPlaying];
            const activeColor = deckColors[activeDecks.findIndex(Boolean)] || '#6b7280';
            
            return (
              <div
                key={i}
                className={`absolute w-1 h-1 rounded-full transition-all duration-100 ${
                  isActive ? 'opacity-100 scale-150' : 'opacity-30 scale-100'
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: activeColor,
                  boxShadow: isActive ? `0 0 20px ${activeColor}` : 'none',
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            );
          })}
        </div>
        
        {/* Laser Show Effect */}
        {visualEffects.laserShow && (
          <div className="absolute inset-0">
            {[decks.A, decks.B, decks.C, decks.D].map((deck, i) => {
              if (!deck.isPlaying) return null;
              const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
              return (
                <div
                  key={i}
                  className="absolute opacity-30"
                  style={{
                    left: `${25 * i}%`,
                    top: '0',
                    width: '2px',
                    height: '100%',
                    background: `linear-gradient(to bottom, ${colors[i]}, transparent)`,
                    animation: `laser${i} ${60000/deck.bpm}ms linear infinite`,
                    filter: 'blur(0.5px)'
                  }}
                />
              );
            })}
          </div>
        )}
        
        {/* Beat Visualization Grid */}
        <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end">
          {visualBeats.map((beat, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-red-500/30 to-transparent mx-px transition-all duration-75"
              style={{ height: `${beat}%` }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-4 max-w-[2000px] mx-auto">
        {/* 4-CHANNEL PIONEER DJM-900NXS2 + CDJ-3000 SETUP */}
        <div className="grid grid-cols-16 gap-2">
          
          {/* LEFT CDJ-3000 DECK A */}
          <div className="col-span-5 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-6 border-2 border-gray-700 shadow-2xl">
            {/* CDJ-3000 TOP SECTION */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">CDJ-3000</div>
                <div className="text-blue-400 font-bold text-lg">DECK A</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${decks.A.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="bg-black px-2 py-1 rounded text-green-400 font-mono text-sm">{decks.A.bpm} BPM</span>
                <span className="bg-black px-2 py-1 rounded text-cyan-400 font-mono text-sm">{decks.A.track.key}</span>
              </div>
            </div>

            {/* PIONEER TOUCH SCREEN DISPLAY */}
            <div className="bg-black rounded-lg p-4 mb-6 border-2 border-gray-600">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg truncate">{decks.A.track.title}</h3>
                  <p className="text-gray-300 truncate">{decks.A.track.artist}</p>
                  <p className="text-gray-500 text-sm truncate">{decks.A.track.album}</p>
                </div>
                <div className="text-right">
                  <div className="text-orange-400 font-bold">{formatTime(decks.A.currentTime)}</div>
                  <div className="text-gray-400 text-sm">-{formatTime(decks.A.duration - decks.A.currentTime)}</div>
                  <div className="flex items-center space-x-1 mt-1">
                    {Array.from({length: 5}).map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < decks.A.track.rating ? 'bg-yellow-400' : 'bg-gray-600'}`} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* PROFESSIONAL WAVEFORM WITH BEATGRID */}
              <div className="h-20 bg-gray-900 rounded border border-gray-700 relative overflow-hidden">
                <div className="flex items-center h-full px-2">
                  {Array.from({length: 80}).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 mx-px transition-all ${
                        i < (decks.A.currentTime / decks.A.duration) * 80 
                          ? 'bg-blue-500 opacity-100' 
                          : 'bg-blue-300 opacity-30'
                      }`}
                      style={{ height: `${Math.sin(i * 0.5) * 30 + 40}px` }}
                    />
                  ))}
                </div>
                {/* Beat markers */}
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center">
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className="flex-1 border-l border-green-500/30 h-full" />
                  ))}
                </div>
                {/* Playhead */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-red-500 z-10"
                  style={{ left: `${(decks.A.currentTime / decks.A.duration) * 100}%` }}
                />
              </div>
            </div>

            {/* MASSIVE PIONEER JOG WHEEL */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-black border-4 border-gray-600 flex items-center justify-center cursor-pointer hover:brightness-110 transition-all shadow-2xl">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-800/30 to-blue-900/30 border-2 border-blue-500/50 flex items-center justify-center relative">
                    {/* Vinyl texture lines */}
                    {Array.from({length: 12}).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute w-px h-16 bg-blue-400/20"
                        style={{ 
                          transform: `rotate(${i * 30}deg)`,
                          transformOrigin: 'center'
                        }}
                      />
                    ))}
                    {/* Center dot */}
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    {/* Rotation indicator */}
                    <div className="absolute w-1 h-12 bg-red-500 rounded-full top-4" />
                  </div>
                </div>
                <div className="text-center mt-3">
                  <div className="flex items-center justify-center space-x-2">
                    <button className={`px-3 py-1 rounded text-xs font-bold ${decks.A.jogMode === 'vinyl' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                      VINYL
                    </button>
                    <button className={`px-3 py-1 rounded text-xs font-bold ${decks.A.jogMode === 'cd' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                      CD
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-purple-400">DECK A</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${decks.A.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-sm font-mono">{decks.A.bpm} BPM</span>
              </div>
            </div>

            {/* Track Info */}
            <div className="bg-black/50 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-lg truncate">{decks.A.track.title}</h4>
              <p className="text-white/70 truncate">{decks.A.track.artist}</p>
              <div className="flex justify-between text-xs text-white/60 mt-2">
                <span>{decks.A.track.key}</span>
                <span>{decks.A.track.genre}</span>
                <span>Energy: {decks.A.track.energy}%</span>
              </div>
            </div>

            {/* Waveform */}
            <div className="h-16 bg-black/50 rounded-lg mb-4 flex items-center justify-center border border-purple-500/20">
              <div className="flex items-center space-x-1">
                {Array.from({length: 40}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 bg-purple-500 transition-all ${
                      i < (decks.A.currentTime / decks.A.duration) * 40 ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{ height: `${Math.random() * 40 + 10}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Transport Controls */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() => updateDeck('A', 'isPlaying', !decks.A.isPlaying)}
                className={`p-3 rounded-lg transition-colors ${
                  decks.A.isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                {decks.A.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Square className="w-6 h-6" />
              </button>
              <button 
                onClick={() => updateDeck('A', 'cue', !decks.A.cue)}
                className={`p-3 rounded-lg transition-colors ${
                  decks.A.cue ? 'bg-orange-500' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Headphones className="w-6 h-6" />
              </button>
            </div>

            {/* EQ Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">HIGH</span>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={decks.A.eq.high}
                  onChange={(e) => updateEQ('A', 'high', Number(e.target.value))}
                  className="flex-1 mx-3"
                />
                <span className="text-xs w-12 text-right">{decks.A.eq.high > 0 ? '+' : ''}{decks.A.eq.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">MID</span>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={decks.A.eq.mid}
                  onChange={(e) => updateEQ('A', 'mid', Number(e.target.value))}
                  className="flex-1 mx-3"
                />
                <span className="text-xs w-12 text-right">{decks.A.eq.mid > 0 ? '+' : ''}{decks.A.eq.mid}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">LOW</span>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={decks.A.eq.low}
                  onChange={(e) => updateEQ('A', 'low', Number(e.target.value))}
                  className="flex-1 mx-3"
                />
                <span className="text-xs w-12 text-right">{decks.A.eq.low > 0 ? '+' : ''}{decks.A.eq.low}</span>
              </div>
            </div>

            {/* Volume Fader */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">VOLUME</span>
                <span className="text-xs">{Math.round(decks.A.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={decks.A.volume * 100}
                onChange={(e) => updateDeck('A', 'volume', Number(e.target.value) / 100)}
                className="w-full"
              />
            </div>
          </div>

          {/* Center Mixer Section */}
          <div className="col-span-4 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-center mb-6 text-cyan-400">MIXER</h3>

            {/* Crowd Queue Integration */}
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-purple-400">CROWD QUEUE</h4>
                <span className="bg-purple-500/30 px-2 py-1 rounded text-xs">{votingQueue.length}</span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {sortedVotingQueue.slice(0, 3).map((track, index) => (
                  <div key={track.id} className="flex items-center justify-between p-2 bg-black/30 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{track.title}</p>
                      <p className="text-xs text-white/60 truncate">{track.artist}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400 text-xs font-bold">${track.amount}</span>
                      <button
                        onClick={() => loadTrackToDeck(track, 'A')}
                        className="p-1 bg-purple-500/30 rounded hover:bg-purple-500/50 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crossfader */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-400">A</span>
                <span className="text-sm font-bold">CROSSFADER</span>
                <span className="text-sm text-blue-400">B</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={crossfader}
                onChange={(e) => setCrossfader(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-xs text-white/60 mt-1">
                {crossfader < 40 ? 'A' : crossfader > 60 ? 'B' : 'MIX'}
              </div>
            </div>

            {/* Master Volume */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">MASTER</span>
                <span className="text-xs">{Math.round(masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume * 100}
                onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
                className="w-full"
              />
            </div>

            {/* Harmonic Mixing Assistant */}
            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="text-sm font-bold mb-2 text-cyan-400">MIX ASSISTANT</h4>
              <div className="flex justify-between text-xs">
                <span>BPM Diff:</span>
                <span className={bpmDiff < 5 ? 'text-green-400' : bpmDiff < 10 ? 'text-yellow-400' : 'text-red-400'}>
                  {bpmDiff} BPM
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Key Match:</span>
                <span className={keyCompatibility.color}>{keyCompatibility.status}</span>
              </div>
            </div>
          </div>

          {/* Right Deck B */}
          <div className="col-span-4 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-400">DECK B</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${decks.B.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-sm font-mono">{decks.B.bpm} BPM</span>
              </div>
            </div>

            {/* Track Info */}
            <div className="bg-black/50 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-lg truncate">{decks.B.track.title}</h4>
              <p className="text-white/70 truncate">{decks.B.track.artist}</p>
              <div className="flex justify-between text-xs text-white/60 mt-2">
                <span>{decks.B.track.key}</span>
                <span>{decks.B.track.genre}</span>
                <span>Energy: {decks.B.track.energy}%</span>
              </div>
            </div>

            {/* Waveform */}
            <div className="h-16 bg-black/50 rounded-lg mb-4 flex items-center justify-center border border-blue-500/20">
              <div className="flex items-center space-x-1">
                {Array.from({length: 40}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 bg-blue-500 transition-all ${
                      i < (decks.B.currentTime / decks.B.duration) * 40 ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{ height: `${Math.random() * 40 + 10}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Transport Controls */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() => updateDeck('B', 'isPlaying', !decks.B.isPlaying)}
                className={`p-3 rounded-lg transition-colors ${
                  decks.B.isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {decks.B.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Square className="w-6 h-6" />
              </button>
              <button 
                onClick={() => updateDeck('B', 'cue', !decks.B.cue)}
                className={`p-3 rounded-lg transition-colors ${
                  decks.B.cue ? 'bg-orange-500' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Headphones className="w-6 h-6" />
              </button>
            </div>

            {/* EQ Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">HIGH</span>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={decks.B.eq.high}
                  onChange={(e) => updateEQ('B', 'high', Number(e.target.value))}
                  className="flex-1 mx-3"
                />
                <span className="text-xs w-12 text-right">{decks.B.eq.high > 0 ? '+' : ''}{decks.B.eq.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">MID</span>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={decks.B.eq.mid}
                  onChange={(e) => updateEQ('B', 'mid', Number(e.target.value))}
                  className="flex-1 mx-3"
                />
                <span className="text-xs w-12 text-right">{decks.B.eq.mid > 0 ? '+' : ''}{decks.B.eq.mid}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">LOW</span>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={decks.B.eq.low}
                  onChange={(e) => updateEQ('B', 'low', Number(e.target.value))}
                  className="flex-1 mx-3"
                />
                <span className="text-xs w-12 text-right">{decks.B.eq.low > 0 ? '+' : ''}{decks.B.eq.low}</span>
              </div>
            </div>

            {/* Volume Fader */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">VOLUME</span>
                <span className="text-xs">{Math.round(decks.B.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={decks.B.volume * 100}
                onChange={(e) => updateDeck('B', 'volume', Number(e.target.value) / 100)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Bottom Panel - Extended Voting Queue & Library */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Full Voting Queue */}
          <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-purple-400">Live Crowd Requests</h3>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-sm">{votingQueue.length} requests</span>
              </div>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sortedVotingQueue.map((track, index) => (
                <div key={track.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/10">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm">{track.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 font-bold text-sm">${track.amount}</span>
                        <span className="text-purple-400 text-xs">#{index + 1}</span>
                      </div>
                    </div>
                    <p className="text-white/70 text-xs">{track.artist} • {track.genre}</p>
                    <div className="flex items-center justify-between text-xs text-white/60 mt-1">
                      <span>{track.bpm} BPM • {track.key}</span>
                      <span>by {track.requestedBy} • {track.timeRequested}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => loadTrackToDeck(track, 'A')}
                      className="p-2 bg-purple-500/30 rounded hover:bg-purple-500/50 transition-colors"
                      title="Load to Deck A"
                    >
                      A
                    </button>
                    <button
                      onClick={() => loadTrackToDeck(track, 'B')}
                      className="p-2 bg-blue-500/30 rounded hover:bg-blue-500/50 transition-colors"
                      title="Load to Deck B"
                    >
                      B
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Music Library */}
          <div className="bg-gray-900/20 rounded-lg p-6 border border-gray-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-400">Music Library</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/30 border border-gray-500/30 rounded px-3 py-1 text-sm w-48"
                />
                <Search className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {library.filter(track => 
                track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                track.artist.toLowerCase().includes(searchQuery.toLowerCase())
              ).map(track => (
                <div key={track.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-500/10">
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{track.title}</h4>
                    <p className="text-white/70 text-xs">{track.artist} • {track.genre}</p>
                    <div className="flex items-center justify-between text-xs text-white/60 mt-1">
                      <span>{track.bpm} BPM • {track.key}</span>
                      <span>Energy: {track.energy}%</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => loadTrackToDeck(track, 'A')}
                      className="p-2 bg-purple-500/30 rounded hover:bg-purple-500/50 transition-colors"
                    >
                      A
                    </button>
                    <button
                      onClick={() => loadTrackToDeck(track, 'B')}
                      className="p-2 bg-blue-500/30 rounded hover:bg-blue-500/50 transition-colors"
                    >
                      B
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}