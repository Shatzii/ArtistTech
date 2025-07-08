import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedDJStudio from '@/components/EnhancedDJStudio';

export default function DJStudio() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-pink-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/artist-tech-logo-new.jpeg" 
              alt="Artist Tech" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">DJ Studio Pro</h1>
              <p className="text-white/60">Professional mixing with real-time crowd analytics</p>
              {user && (
                <p className="text-purple-400 text-sm">Welcome, {user.email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/social-media-hub">
              <button className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub
              </button>
            </Link>
          </div>
        </div>

        {/* Enhanced Professional DJ Studio */}
        <EnhancedDJStudio />
      </div>
    </div>
  );
}