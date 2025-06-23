import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Play, Pause, Square, RotateCcw, Volume2, Headphones, Search, DollarSign, Heart, Clock, Users, TrendingUp, SkipForward, Shuffle, Repeat, Music, Settings, Filter, Zap, Mic, Radio, Download, Upload, Timer, Smartphone, Monitor, Vote, Power
} from 'lucide-react';

export default function DJStudio() {
  // TRADITIONAL CLUB SETUP STATE
  const [decks, setDecks] = useState({
    left: {
      isPlaying: false,
      currentTime: 45,
      duration: 225,
      bpm: 123,
      pitch: 0,
      volume: 80,
      eq: { high: 0, mid: 0, low: 0 },
      cue: false,
      track: { 
        title: 'One More Time', 
        artist: 'Daft Punk',
        key: 'F# Minor',
        energy: 85,
        genre: 'House'
      }
    },
    right: {
      isPlaying: false,
      currentTime: 0,
      duration: 210,
      bpm: 128,
      pitch: 0,
      volume: 80,
      eq: { high: 0, mid: 0, low: 0 },
      cue: false,
      track: { 
        title: 'Strobe', 
        artist: 'Deadmau5',
        key: 'A Minor',
        energy: 92,
        genre: 'Progressive House'
      }
    }
  });

  // CLUB FEATURES
  const [clubFeatures, setClubFeatures] = useState({
    autoDJ: false,
    phoneVoting: true,
    clubDisplay: true,
    voteTimer: 60, // seconds
    timeRemaining: 0,
    isVoteActive: false
  });

  // VOTING SYSTEM
  const [votingQueue, setVotingQueue] = useState([
    { id: '1', title: 'HUMBLE.', artist: 'Kendrick Lamar', votes: 15, amount: 50, timeLeft: 45, requestedBy: 'Club_VIP' },
    { id: '2', title: 'Levels', artist: 'Avicii', votes: 12, amount: 25, timeLeft: 30, requestedBy: 'Mike_DJ' },
    { id: '3', title: 'Titanium', artist: 'David Guetta', votes: 9, amount: 20, timeLeft: 15, requestedBy: 'Party_King' },
    { id: '4', title: 'Animals', artist: 'Martin Garrix', votes: 8, amount: 15, timeLeft: 60, requestedBy: 'Sarah_M' },
  ]);

  // CLUB STATS
  const [clubStats, setClubStats] = useState({
    totalRevenue: 450,
    liveVoters: 156,
    songsPlayed: 23,
    crowdEnergy: 85,
    peakTime: '11:30 PM'
  });

  // AUTO-DJ STATE
  const [autoDJStatus, setAutoDJStatus] = useState({
    enabled: false,
    currentAction: 'Standby',
    nextTransition: '2:30',
    mixingStyle: 'Smooth',
    energyTarget: 90
  });

  const startVoteSession = () => {
    setClubFeatures(prev => ({
      ...prev,
      isVoteActive: true,
      timeRemaining: prev.voteTimer
    }));
    
    // Start countdown
    const interval = setInterval(() => {
      setClubFeatures(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(interval);
          return { ...prev, isVoteActive: false, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  };

  const toggleAutoDJ = () => {
    const newStatus = !autoDJStatus.enabled;
    setAutoDJStatus(prev => ({
      ...prev,
      enabled: newStatus,
      currentAction: newStatus ? 'Auto-Mixing Active' : 'Standby'
    }));
    
    if (newStatus) {
      startVoteSession();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* INSANE VISUAL BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Reactive Particle System */}
        <div className="absolute inset-0">
          {Array.from({length: 200}).map((_, i) => {
            const isActive = (decks.left.isPlaying || decks.right.isPlaying);
            const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
            const activeColor = colors[Math.floor(Math.random() * colors.length)];
            
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
        
        {/* Beat Visualization */}
        <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end opacity-30">
          {Array.from({length: 64}).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-red-500/50 to-transparent mx-px transition-all duration-75"
              style={{ height: `${Math.random() * 80 + 20}%` }}
            />
          ))}
        </div>
      </div>

      {/* CLUB HEADER */}
      <div className="relative z-10 bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-red-500/30 p-3">
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
              <h1 className="text-xl font-bold text-red-500">CLUB DJ SYSTEM</h1>
              <p className="text-gray-400 text-xs">Pioneer CDJ-3000 • Club Experience • Live Voting</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold">{clubStats.liveVoters} Live Voters</span>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 px-3 py-1 rounded flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold">${clubStats.totalRevenue}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-4 max-w-[1800px] mx-auto">
        {/* TRADITIONAL CLUB CDJ LAYOUT */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* LEFT CDJ-3000 */}
          <div className="col-span-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-6 border-2 border-gray-600">
            {/* CDJ Screen */}
            <div className="bg-black rounded-lg p-4 mb-4 border border-gray-500">
              <div className="text-center mb-2">
                <div className="text-blue-400 font-bold text-lg">LEFT DECK</div>
                <div className="text-green-400 font-mono text-2xl">{decks.left.bpm} BPM</div>
              </div>
              <div className="border-t border-gray-600 pt-2">
                <h3 className="text-white font-bold truncate">{decks.left.track.title}</h3>
                <p className="text-gray-300 text-sm truncate">{decks.left.track.artist}</p>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{decks.left.track.key}</span>
                  <span>{formatTime(decks.left.currentTime)}</span>
                </div>
              </div>
            </div>

            {/* Traditional JOG WHEEL */}
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 cdj-jog rounded-full border-4 border-gray-500 flex items-center justify-center cursor-pointer relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-800/30 to-blue-900/30 border-2 border-blue-500/50 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  {/* Rotation indicator */}
                  <div className="absolute w-1 h-8 bg-red-500 rounded-full top-6" />
                </div>
              </div>
            </div>

            {/* Transport Controls */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded text-white transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 p-3 rounded text-white transition-colors">
                <Headphones className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setDecks(prev => ({ ...prev, left: { ...prev.left, isPlaying: !prev.left.isPlaying } }))}
                className={`p-3 rounded transition-colors ${decks.left.isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {decks.left.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button className="bg-red-500 hover:bg-red-600 p-3 rounded text-white transition-colors">
                <Square className="w-5 h-5" />
              </button>
            </div>

            {/* EQ Section */}
            <div className="space-y-3">
              {(['high', 'mid', 'low'] as const).map((freq) => (
                <div key={freq} className="flex items-center space-x-3">
                  <span className="text-xs w-8 text-gray-400">{freq.toUpperCase()}</span>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={decks.left.eq[freq as keyof typeof decks.left.eq]}
                    className="flex-1"
                  />
                  <span className="text-xs w-8 text-gray-400">{decks.left.eq[freq as keyof typeof decks.left.eq]}</span>
                </div>
              ))}
            </div>

            {/* Volume Fader */}
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-400">VOLUME</span>
                <span className="text-xs text-gray-400">{decks.left.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={decks.left.volume}
                className="w-full"
              />
            </div>
          </div>

          {/* CENTER - CLUB VOTING INTERFACE */}
          <div className="col-span-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border-2 border-purple-500/30">
            {/* Auto-DJ Controls */}
            <div className="bg-black/50 rounded-lg p-4 mb-4 border border-purple-500/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-purple-400 font-bold">AUTO-DJ SYSTEM</h3>
                <button
                  onClick={toggleAutoDJ}
                  className={`px-4 py-2 rounded font-bold transition-colors ${
                    autoDJStatus.enabled 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  <Power className="w-4 h-4 inline mr-2" />
                  {autoDJStatus.enabled ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="text-sm text-gray-300">
                <div>Status: <span className="text-green-400">{autoDJStatus.currentAction}</span></div>
                <div>Style: <span className="text-blue-400">{autoDJStatus.mixingStyle}</span></div>
                <div>Energy: <span className="text-yellow-400">{autoDJStatus.energyTarget}%</span></div>
              </div>
            </div>

            {/* Live Voting Panel */}
            <div className="bg-black/50 rounded-lg p-4 mb-4 border border-green-500/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-green-400 font-bold">LIVE CROWD VOTING</h3>
                {clubFeatures.isVoteActive && (
                  <div className="bg-red-500/20 border border-red-500/30 px-3 py-1 rounded flex items-center space-x-2">
                    <Timer className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-bold">{clubFeatures.timeRemaining}s</span>
                  </div>
                )}
              </div>
              
              {!clubFeatures.isVoteActive ? (
                <button
                  onClick={startVoteSession}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition-colors"
                >
                  START VOTE SESSION
                </button>
              ) : (
                <div className="space-y-2">
                  {votingQueue.slice(0, 4).map((track, index) => (
                    <div key={track.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <div className="flex-1">
                        <div className="font-bold text-sm text-white">{track.title}</div>
                        <div className="text-xs text-gray-400">{track.artist}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="bg-green-500/20 px-2 py-1 rounded text-green-400 text-xs font-bold">
                          {track.votes} votes
                        </div>
                        <div className="bg-yellow-500/20 px-2 py-1 rounded text-yellow-400 text-xs font-bold">
                          ${track.amount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Connection */}
            <div className="bg-black/50 rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-blue-400 font-bold">PHONE VOTING</h4>
                <Smartphone className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-sm text-gray-300">
                <div>QR Code: Scan to Vote</div>
                <div>URL: club.artist-tech.com/vote</div>
                <div>Active Connections: <span className="text-green-400">{clubStats.liveVoters}</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT CDJ-3000 */}
          <div className="col-span-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-6 border-2 border-gray-600">
            {/* CDJ Screen */}
            <div className="bg-black rounded-lg p-4 mb-4 border border-gray-500">
              <div className="text-center mb-2">
                <div className="text-orange-400 font-bold text-lg">RIGHT DECK</div>
                <div className="text-green-400 font-mono text-2xl">{decks.right.bpm} BPM</div>
              </div>
              <div className="border-t border-gray-600 pt-2">
                <h3 className="text-white font-bold truncate">{decks.right.track.title}</h3>
                <p className="text-gray-300 text-sm truncate">{decks.right.track.artist}</p>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{decks.right.track.key}</span>
                  <span>{formatTime(decks.right.currentTime)}</span>
                </div>
              </div>
            </div>

            {/* Traditional JOG WHEEL */}
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 cdj-jog rounded-full border-4 border-gray-500 flex items-center justify-center cursor-pointer relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-800/30 to-orange-900/30 border-2 border-orange-500/50 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                  {/* Rotation indicator */}
                  <div className="absolute w-1 h-8 bg-red-500 rounded-full top-6" />
                </div>
              </div>
            </div>

            {/* Transport Controls */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded text-white transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 p-3 rounded text-white transition-colors">
                <Headphones className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setDecks(prev => ({ ...prev, right: { ...prev.right, isPlaying: !prev.right.isPlaying } }))}
                className={`p-3 rounded transition-colors ${decks.right.isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                {decks.right.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button className="bg-red-500 hover:bg-red-600 p-3 rounded text-white transition-colors">
                <Square className="w-5 h-5" />
              </button>
            </div>

            {/* EQ Section */}
            <div className="space-y-3">
              {(['high', 'mid', 'low'] as const).map((freq) => (
                <div key={freq} className="flex items-center space-x-3">
                  <span className="text-xs w-8 text-gray-400">{freq.toUpperCase()}</span>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={decks.right.eq[freq as keyof typeof decks.right.eq]}
                    className="flex-1"
                  />
                  <span className="text-xs w-8 text-gray-400">{decks.right.eq[freq as keyof typeof decks.right.eq]}</span>
                </div>
              ))}
            </div>

            {/* Volume Fader */}
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-400">VOLUME</span>
                <span className="text-xs text-gray-400">{decks.right.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={decks.right.volume}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* CLUB DISPLAY SYSTEM */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          {/* Main Club Display */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border-2 border-yellow-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-yellow-400 font-bold text-lg">CLUB DISPLAY</h3>
              <Monitor className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="bg-black/70 rounded-lg p-4 border border-yellow-500/20">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white">NOW PLAYING</h2>
                <div className="text-yellow-400 text-xl font-bold">
                  {decks.left.isPlaying ? decks.left.track.title : decks.right.isPlaying ? decks.right.track.title : 'Select Track'}
                </div>
                <div className="text-gray-300">
                  {decks.left.isPlaying ? decks.left.track.artist : decks.right.isPlaying ? decks.right.track.artist : ''}
                </div>
              </div>
              
              {clubFeatures.isVoteActive && (
                <div className="space-y-2">
                  <h3 className="text-green-400 font-bold text-center">VOTE FOR NEXT SONG!</h3>
                  {votingQueue.slice(0, 3).map((track, index) => (
                    <div key={track.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <span className="text-white font-bold">#{index + 1} {track.title} - {track.artist}</span>
                      <span className="text-green-400 font-bold">{track.votes} votes</span>
                    </div>
                  ))}
                  <div className="text-center text-red-400 font-bold">
                    Vote now! {clubFeatures.timeRemaining} seconds left
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DJ Control Panel */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border-2 border-cyan-500/30">
            <h3 className="text-cyan-400 font-bold text-lg mb-4">DJ MASTER CONTROLS</h3>
            
            {/* Crossfader */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-blue-400">LEFT</span>
                <span className="text-white font-bold">CROSSFADER</span>
                <span className="text-orange-400">RIGHT</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="50"
                className="w-full"
              />
            </div>

            {/* Master Volume */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-cyan-400">MASTER VOLUME</span>
                <span className="text-white">85%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="85"
                className="w-full"
              />
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded transition-colors">
                SYNC TRACKS
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition-colors">
                AUTO-TRANSITION
              </button>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded transition-colors">
                EMERGENCY STOP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}