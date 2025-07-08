import { Users, Wifi, WifiOff, Crown, Settings } from 'lucide-react';
import { CollaborativeSession } from '@/hooks/useCollaborativeSession';

interface CollaborativePanelProps {
  session: CollaborativeSession | null;
  isConnected: boolean;
  connectionError: string | null;
  onInviteUsers?: () => void;
  onSessionSettings?: () => void;
}

export default function CollaborativePanel({ 
  session, 
  isConnected, 
  connectionError,
  onInviteUsers,
  onSessionSettings 
}: CollaborativePanelProps) {
  return (
    <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Live Collaboration
        </h3>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Connected' : connectionError || 'Disconnected'}
          </span>
        </div>
      </div>

      {session && (
        <>
          {/* Active Users */}
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium text-white/70">Active Users ({session.users.length})</h4>
            {session.users.map((user) => (
              <div key={user.id} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-white/60">
                    {user.selectedTrack !== undefined && `Track ${user.selectedTrack + 1}`}
                  </div>
                </div>
                {session.isHost && user.id === session.users.find(u => session.isHost)?.id && (
                  <Crown className="w-4 h-4 text-yellow-400" />
                )}
                <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-gray-400'}`} />
              </div>
            ))}
          </div>

          {/* Recent Edits */}
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium text-white/70">Recent Activity</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {session.edits.slice(-5).map((edit) => {
                const user = session.users.find(u => u.id === edit.userId);
                return (
                  <div key={edit.id} className="text-xs p-2 bg-white/5 rounded">
                    <span style={{ color: user?.color || '#fff' }}>{user?.name}</span>
                    <span className="text-white/60 ml-1">
                      {edit.type === 'volume_change' && 'adjusted volume'}
                      {edit.type === 'track_edit' && 'edited track'}
                      {edit.type === 'effect_change' && 'modified effects'}
                      {edit.type === 'timeline_edit' && 'updated timeline'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={onInviteUsers}
              className="w-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 py-2 px-3 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm"
            >
              Invite Collaborators
            </button>
            {session.isHost && (
              <button
                onClick={onSessionSettings}
                className="w-full bg-white/10 border border-white/20 py-2 px-3 rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center justify-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Session Settings
              </button>
            )}
          </div>
        </>
      )}

      {!session && isConnected && (
        <div className="text-center py-4">
          <div className="text-sm text-white/60">Joining collaborative session...</div>
        </div>
      )}

      {!isConnected && (
        <div className="text-center py-4">
          <div className="text-sm text-red-400 mb-2">
            {connectionError || 'Not connected to collaboration server'}
          </div>
          <button className="text-xs text-cyan-400 hover:text-cyan-300">
            Retry Connection
          </button>
        </div>
      )}
    </div>
  );
}