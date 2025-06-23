import { useState, useEffect } from 'react';

export default function SimpleVotingDemo() {
  const [tracks, setTracks] = useState([
    { id: '1', title: 'One More Time', artist: 'Daft Punk', votes: 12, amount: 25 },
    { id: '2', title: 'Strobe', artist: 'Deadmau5', votes: 8, amount: 15 },
    { id: '3', title: 'HUMBLE.', artist: 'Kendrick Lamar', votes: 15, amount: 50 },
    { id: '4', title: 'Blinding Lights', artist: 'The Weeknd', votes: 6, amount: 10 },
  ]);
  
  const [userBalance, setUserBalance] = useState(50);
  const [userVotes, setUserVotes] = useState(3);

  const voteForTrack = (trackId: string) => {
    if (userVotes <= 0) return;
    
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, votes: track.votes + 1 }
        : track
    ));
    setUserVotes(prev => prev - 1);
  };

  const payForTrack = (trackId: string, amount: number) => {
    if (userBalance < amount) return;
    
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, amount: track.amount + amount }
        : track
    ));
    setUserBalance(prev => prev - amount);
  };

  const sortedTracks = [...tracks].sort((a, b) => 
    (b.votes * 5 + b.amount) - (a.votes * 5 + a.amount)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎵 Interactive DJ Voting & Jukebox System
          </h1>
          <p className="text-xl text-white/80">Club listeners vote for songs or pay for priority requests</p>
        </div>

        {/* User Stats */}
        <div className="bg-black/30 rounded-lg p-6 mb-8">
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">${userBalance}</div>
              <div className="text-white/70">Wallet Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{userVotes}</div>
              <div className="text-white/70">Votes Left</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">${tracks.reduce((sum, t) => sum + t.amount, 0)}</div>
              <div className="text-white/70">Total Revenue</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Queue */}
          <div className="bg-black/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              🔥 Live Request Queue
            </h2>
            <div className="space-y-4">
              {sortedTracks.map((track, index) => (
                <div key={track.id} className={`
                  p-4 rounded-lg transition-all duration-300
                  ${index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' : 'bg-white/10'}
                `}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold
                        ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' : 'bg-white/20'}
                      `}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold">{track.title}</h3>
                        <p className="text-white/70">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">👍 {track.votes}</div>
                        <div className="text-xs text-white/60">votes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-bold">${track.amount}</div>
                        <div className="text-xs text-white/60">paid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-bold">{track.votes * 5 + track.amount}</div>
                        <div className="text-xs text-white/60">priority</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voting Interface */}
          <div className="bg-black/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              🎯 Request a Song
            </h2>
            <div className="space-y-4">
              {tracks.map((track) => (
                <div key={track.id} className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold">{track.title}</h4>
                      <p className="text-white/70">{track.artist}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => voteForTrack(track.id)}
                        disabled={userVotes <= 0}
                        className={`
                          px-4 py-2 rounded-lg font-medium transition-all
                          ${userVotes > 0 
                            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                        `}
                      >
                        👍 Vote
                      </button>
                      <button
                        onClick={() => payForTrack(track.id, 10)}
                        disabled={userBalance < 10}
                        className={`
                          px-4 py-2 rounded-lg font-medium transition-all
                          ${userBalance >= 10 
                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                        `}
                      >
                        💰 $10
                      </button>
                      <button
                        onClick={() => payForTrack(track.id, 25)}
                        disabled={userBalance < 25}
                        className={`
                          px-4 py-2 rounded-lg font-medium transition-all
                          ${userBalance >= 25 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                        `}
                      >
                        💎 $25
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Funds */}
            <div className="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <h3 className="font-bold mb-2">💳 Add Funds</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUserBalance(prev => prev + 25)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  +$25
                </button>
                <button
                  onClick={() => setUserBalance(prev => prev + 50)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  +$50
                </button>
              </div>
            </div>

            {/* Reset Demo */}
            <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <button
                onClick={() => {
                  setUserBalance(50);
                  setUserVotes(3);
                  setTracks([
                    { id: '1', title: 'One More Time', artist: 'Daft Punk', votes: 12, amount: 25 },
                    { id: '2', title: 'Strobe', artist: 'Deadmau5', votes: 8, amount: 15 },
                    { id: '3', title: 'HUMBLE.', artist: 'Kendrick Lamar', votes: 15, amount: 50 },
                    { id: '4', title: 'Blinding Lights', artist: 'The Weeknd', votes: 6, amount: 10 },
                  ]);
                }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                🔄 Reset Demo
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-black/30 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🎪 How the Interactive DJ System Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
              <h3 className="font-bold text-blue-400 mb-2">👍 Free Voting</h3>
              <p className="text-white/80">Vote for songs to increase their priority. More votes = higher in queue!</p>
            </div>
            <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
              <h3 className="font-bold text-green-400 mb-2">💰 Paid Requests</h3>
              <p className="text-white/80">Pay money to guarantee your song gets played. Higher payments get instant priority!</p>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
              <h3 className="font-bold text-purple-400 mb-2">🎵 DJ Control</h3>
              <p className="text-white/80">DJ sees all requests live and can accept, play, or interact with the crowd in real-time!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}