import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Volume2, Headphones, Search, DollarSign, Heart, Clock, Users, TrendingUp, SkipForward, Shuffle, Repeat, Music } from 'lucide-react';

export default function DJStudio() {
  const [isPlayingA, setIsPlayingA] = useState(false);
  const [isPlayingB, setIsPlayingB] = useState(false);
  const [currentTimeA, setCurrentTimeA] = useState(0);
  const [currentTimeB, setCurrentTimeB] = useState(0);
  const [durationA, setDurationA] = useState(180);
  const [durationB, setDurationB] = useState(210);
  const [volumeA, setVolumeA] = useState(0.8);
  const [volumeB, setVolumeB] = useState(0.8);
  const [crossfader, setCrossfader] = useState(50);
  const [showVotingPanel, setShowVotingPanel] = useState(true);
  const [showSpotifyPanel, setShowSpotifyPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Revenue tracking
  const [totalRevenue, setTotalRevenue] = useState(340);
  const [sessionsToday, setSessionsToday] = useState(12);
  
  // Voting system state
  const [votingTracks, setVotingTracks] = useState([
    { id: '1', title: 'One More Time', artist: 'Daft Punk', votes: 12, amount: 25, priority: 85, source: 'spotify', requestedBy: 'Mike_DJ', timeRequested: '2 min ago' },
    { id: '2', title: 'Strobe', artist: 'Deadmau5', votes: 8, amount: 15, priority: 55, source: 'spotify', requestedBy: 'Sarah_M', timeRequested: '5 min ago' },
    { id: '3', title: 'HUMBLE.', artist: 'Kendrick Lamar', votes: 15, amount: 50, priority: 125, source: 'spotify', requestedBy: 'Club_VIP', timeRequested: '1 min ago' },
    { id: '4', title: 'Blinding Lights', artist: 'The Weeknd', votes: 6, amount: 10, priority: 40, source: 'spotify', requestedBy: 'Anonymous', timeRequested: '8 min ago' },
    { id: '5', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', votes: 9, amount: 20, priority: 65, source: 'spotify', requestedBy: 'Party_King', timeRequested: '3 min ago' },
  ]);
  
  // Spotify integration state
  const [spotifyTracks, setSpotifyTracks] = useState([
    { id: 'spotify1', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58', popularity: 95, bpm: 178, key: 'F# Major' },
    { id: 'spotify2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23', popularity: 92, bpm: 103, key: 'B Minor' },
    { id: 'spotify3', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', album: 'F*CK LOVE 3', duration: '2:21', popularity: 98, bpm: 144, key: 'C Major' },
    { id: 'spotify4', title: 'Industry Baby', artist: 'Lil Nas X, Jack Harlow', album: 'MONTERO', duration: '3:32', popularity: 89, bpm: 150, key: 'D Minor' },
    { id: 'spotify5', title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration: '3:58', popularity: 87, bpm: 80, key: 'E Minor' },
    { id: 'spotify6', title: 'As It Was', artist: 'Harry Styles', album: 'Harry\'s House', duration: '2:47', popularity: 96, bpm: 173, key: 'A Major' },
    { id: 'spotify7', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', duration: '3:20', popularity: 94, bpm: 97, key: 'G Major' },
  ]);
  
  const [trackA, setTrackA] = useState({ 
    title: 'One More Time', 
    artist: 'Daft Punk',
    bpm: 123,
    key: 'F# Minor',
    source: 'spotify',
    duration: '3:45'
  });
  
  const [trackB, setTrackB] = useState({ 
    title: 'Levitating', 
    artist: 'Dua Lipa',
    bpm: 103,
    key: 'B Minor',
    source: 'spotify',
    duration: '3:23'
  });

  const sortedVotingTracks = [...votingTracks].sort((a, b) => b.priority - a.priority);

  const loadTrackToDeck = (track: any, deck: 'A' | 'B') => {
    const trackData = {
      title: track.title,
      artist: track.artist,
      bpm: track.bpm || Math.floor(Math.random() * 40) + 100,
      key: track.key || ['A Major', 'B Minor', 'C# Minor', 'D Major', 'E Minor', 'F# Minor', 'G Major'][Math.floor(Math.random() * 7)],
      source: track.source || 'spotify',
      duration: track.duration || '3:30'
    };
    
    if (deck === 'A') {
      setTrackA(trackData);
    } else {
      setTrackB(trackData);
    }
  };

  const acceptRequest = (trackId: string) => {
    const track = votingTracks.find(t => t.id === trackId);
    if (track) {
      loadTrackToDeck(track, 'A');
      setTotalRevenue(prev => prev + track.amount);
      setVotingTracks(prev => prev.filter(t => t.id !== trackId));
    }
  };

  const searchSpotify = (query: string) => {
    if (!query.trim()) return;
    
    // Simulated Spotify search results based on query
    const mockResults = [
      { id: 'search1', title: `${query} (Radio Edit)`, artist: 'Various Artists', album: 'Top Hits', duration: '3:45', popularity: 85, bpm: 128, key: 'C Major' },
      { id: 'search2', title: `${query} (Extended Mix)`, artist: 'DJ Remix', album: 'Club Bangers', duration: '5:12', popularity: 78, bpm: 130, key: 'A Minor' },
      { id: 'search3', title: `${query} (Acoustic Version)`, artist: 'Acoustic Covers', album: 'Unplugged', duration: '3:28', popularity: 92, bpm: 85, key: 'G Major' },
    ];
    setSpotifyTracks(mockResults);
  };

  // Simulate playback progress
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlayingA && currentTimeA < durationA) {
        setCurrentTimeA(prev => prev + 1);
      }
      if (isPlayingB && currentTimeB < durationB) {
        setCurrentTimeB(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlayingA, isPlayingB, currentTimeA, currentTimeB, durationA, durationB]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              AT
            </div>
            <div>
              <h1 className="text-3xl font-bold">Artist Tech DJ Studio</h1>
              <p className="text-white/60">Professional mixing with interactive voting</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
              <span className="text-green-400 font-bold">${totalRevenue}</span>
              <span className="text-white/60 ml-2">Revenue Today</span>
            </div>
            <div className="bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30">
              <span className="text-blue-400 font-bold">{sessionsToday}</span>
              <span className="text-white/60 ml-2">Sessions</span>
            </div>
            <button
              onClick={() => setShowVotingPanel(!showVotingPanel)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showVotingPanel ? 'bg-green-500 text-white' : 'bg-white/20 text-white/70'
              }`}
            >
              🗳️ Voting Panel
            </button>
            <button
              onClick={() => setShowSpotifyPanel(!showSpotifyPanel)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showSpotifyPanel ? 'bg-green-500 text-white' : 'bg-white/20 text-white/70'
              }`}
            >
              🎵 Spotify
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* DJ Decks - Main Area */}
          <div className="xl:col-span-2">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Deck A */}
              <div className="bg-black/30 rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-red-400">DECK A</h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isPlayingA ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {isPlayingA ? 'LIVE' : 'READY'}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-bold text-lg truncate">{trackA.title}</h3>
                  <p className="text-white/70 truncate">{trackA.artist}</p>
                  <div className="flex justify-between text-sm text-white/60 mt-2">
                    <span>{trackA.bpm} BPM</span>
                    <span>{trackA.key}</span>
                    <span>{trackA.duration}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="bg-white/20 rounded-full h-2 mb-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(currentTimeA / durationA) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{formatTime(currentTimeA)}</span>
                    <span>{formatTime(durationA)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-2 mb-4">
                  <button
                    onClick={() => setIsPlayingA(!isPlayingA)}
                    className={`p-3 rounded-full transition-all ${
                      isPlayingA ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isPlayingA ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
                    <Square size={20} />
                  </button>
                  <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
                    <RotateCcw size={20} />
                  </button>
                </div>

                {/* Volume */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Volume A</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volumeA}
                    onChange={(e) => setVolumeA(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-red"
                  />
                  <div className="text-center text-sm text-white/60">{Math.round(volumeA * 100)}%</div>
                </div>
              </div>

              {/* Deck B */}
              <div className="bg-black/30 rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-blue-400">DECK B</h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isPlayingB ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {isPlayingB ? 'LIVE' : 'READY'}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-bold text-lg truncate">{trackB.title}</h3>
                  <p className="text-white/70 truncate">{trackB.artist}</p>
                  <div className="flex justify-between text-sm text-white/60 mt-2">
                    <span>{trackB.bpm} BPM</span>
                    <span>{trackB.key}</span>
                    <span>{trackB.duration}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="bg-white/20 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(currentTimeB / durationB) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{formatTime(currentTimeB)}</span>
                    <span>{formatTime(durationB)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-2 mb-4">
                  <button
                    onClick={() => setIsPlayingB(!isPlayingB)}
                    className={`p-3 rounded-full transition-all ${
                      isPlayingB ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isPlayingB ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
                    <Square size={20} />
                  </button>
                  <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
                    <RotateCcw size={20} />
                  </button>
                </div>

                {/* Volume */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Volume B</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volumeB}
                    onChange={(e) => setVolumeB(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-blue"
                  />
                  <div className="text-center text-sm text-white/60">{Math.round(volumeB * 100)}%</div>
                </div>
              </div>
            </div>

            {/* Crossfader */}
            <div className="bg-black/30 rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-4 text-center">Crossfader</h3>
              <div className="flex items-center space-x-4">
                <span className="text-red-400 font-bold">A</span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={crossfader}
                    onChange={(e) => setCrossfader(parseInt(e.target.value))}
                    className="w-full h-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <span className="text-blue-400 font-bold">B</span>
              </div>
              <div className="text-center mt-2 text-white/60">
                {crossfader < 25 ? 'A Dominant' : crossfader > 75 ? 'B Dominant' : 'Mixed'}
              </div>
            </div>
          </div>

          {/* Voting Panel */}
          {showVotingPanel && (
            <div className="bg-black/30 rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-yellow-400">🗳️ Live Requests</h2>
                <div className="text-sm text-white/60">{sortedVotingTracks.length} pending</div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sortedVotingTracks.map((track, index) => (
                  <div key={track.id} className={`
                    p-4 rounded-lg border transition-all
                    ${index === 0 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
                      : 'bg-white/10 border-white/20'}
                  `}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{track.title}</h4>
                        <p className="text-white/70 text-xs truncate">{track.artist}</p>
                        <p className="text-white/50 text-xs">by {track.requestedBy} • {track.timeRequested}</p>
                      </div>
                      <div className="flex flex-col items-end ml-3">
                        <div className="text-xs text-purple-400 font-bold">#{index + 1}</div>
                        <div className="text-xs text-white/60">{track.priority} pts</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-blue-400">👍 {track.votes}</span>
                        <span className="text-green-400">${track.amount}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => loadTrackToDeck(track, 'A')}
                        className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-2 px-3 rounded text-xs font-medium hover:bg-red-500/30 transition-colors"
                      >
                        Load → A
                      </button>
                      <button
                        onClick={() => loadTrackToDeck(track, 'B')}
                        className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 py-2 px-3 rounded text-xs font-medium hover:bg-blue-500/30 transition-colors"
                      >
                        Load → B
                      </button>
                      <button
                        onClick={() => acceptRequest(track.id)}
                        className="bg-green-500 text-white py-2 px-3 rounded text-xs font-medium hover:bg-green-600 transition-colors"
                      >
                        ✓ Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spotify Panel */}
          {showSpotifyPanel && (
            <div className="bg-black/30 rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-green-400">🎵 Spotify Integration</h2>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                  <input
                    type="text"
                    placeholder="Search Spotify tracks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchSpotify(searchQuery)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-green-500 focus:outline-none"
                  />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => searchSpotify(searchQuery)}
                    className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    Search Spotify
                  </button>
                )}
              </div>

              {/* Track List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {spotifyTracks.map((track) => (
                  <div key={track.id} className="p-3 bg-white/10 rounded-lg border border-white/10 hover:border-green-500/30 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{track.title}</h4>
                        <p className="text-white/70 text-xs truncate">{track.artist}</p>
                        <p className="text-white/50 text-xs truncate">{track.album}</p>
                      </div>
                      <div className="text-xs text-white/60 ml-2">
                        <div>{track.duration}</div>
                        <div>♪ {track.popularity}%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2 text-xs text-white/60">
                      <span>{track.bpm} BPM</span>
                      <span>{track.key}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => loadTrackToDeck(track, 'A')}
                        className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-1 px-2 rounded text-xs font-medium hover:bg-red-500/30 transition-colors"
                      >
                        → A
                      </button>
                      <button
                        onClick={() => loadTrackToDeck(track, 'B')}
                        className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 py-1 px-2 rounded text-xs font-medium hover:bg-blue-500/30 transition-colors"
                      >
                        → B
                      </button>
                      <button className="bg-green-500/20 border border-green-500/30 text-green-400 py-1 px-2 rounded text-xs font-medium hover:bg-green-500/30 transition-colors">
                        ♪ Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider-red::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
        }
        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider-red::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: none;
        }
        .slider-blue::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}