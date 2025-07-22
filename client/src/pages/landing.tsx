import { useState } from 'react';
import { Link } from 'wouter';
import ProfessionalHeader from '../components/ProfessionalHeader';
import ProfessionalStudioGrid from '../components/ProfessionalStudioGrid';
import { 
  TrendingUp, Users, Zap, DollarSign, Music, Video, 
  Instagram, Twitter, Youtube, Play, ArrowRight, Star,
  Crown, Globe, Sparkles, Target, Award, Heart,
  Disc, Mic, Volume2, Palette, Camera, Coins, BarChart3,
  Brain, Gamepad2, Shuffle
} from 'lucide-react';

export default function Landing() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // THE GAME-CHANGING PLATFORMS WE'RE REPLACING
  const competitorPlatforms = [
    { name: 'TikTok', users: '1B+', weakness: 'No direct monetization for creators' },
    { name: 'Instagram', users: '2B+', weakness: 'Algorithm favors big accounts' },
    { name: 'Spotify', users: '500M+', weakness: '$0.003 per stream payout' },
    { name: 'SoundCloud', users: '400M+', weakness: 'Limited creation tools' }
  ];

  // CONNECT, CREATE, COLLAB, MAKE CASH - Core Features
  const coreFeatures = [
    {
      id: 'connect',
      title: 'CONNECT',
      subtitle: 'Global Artist Network',
      description: 'Join 50,000+ artists, producers, and creators worldwide. Find collaborators, mentors, and fans instantly.',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      stats: ['50K+ Active Artists', 'Real-time Chat', 'Global Reach'],
      platforms: ['Better than Discord', 'Replaces Instagram DMs']
    },
    {
      id: 'create',
      title: 'CREATE',
      subtitle: '15 AI-Powered Studios',
      description: 'Professional tools that exceed industry standards. Music, video, art, podcasts - everything in one platform.',
      icon: Sparkles,
      color: 'from-yellow-500 to-yellow-600',
      stats: ['15 AI Engines', 'Professional Quality', 'Zero Learning Curve'],
      platforms: ['Beats Premiere Pro', 'Surpasses Logic Pro']
    },
    {
      id: 'collab',
      title: 'COLLAB',
      subtitle: 'Real-time Multi-user',
      description: 'Work together in real-time from anywhere. Share profits automatically. Build hits together.',
      icon: Zap,
      color: 'from-blue-600 to-blue-700',
      stats: ['Live Collaboration', 'Auto Revenue Split', 'Version Control'],
      platforms: ['Better than Google Docs', 'Replaces Zoom Studio']
    },
    {
      id: 'cash-out',
      title: 'CASH OUT',
      subtitle: '13 Revenue Streams',
      description: 'Earn 10x more than Spotify. Direct fan funding, NFTs, sync licensing, live performances, and more.',
      icon: DollarSign,
      color: 'from-yellow-400 to-yellow-500',
      stats: ['$50+ per 1K plays', 'Direct Fan Funding', 'Instant Payouts'],
      platforms: ['10x Spotify Payout', 'Beats OnlyFans Model']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden">
      <ProfessionalHeader />
      
      {/* PROFESSIONAL HERO SECTION */}
      <div className="relative pt-24 pb-20">
        {/* Professional Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 artist-gradient opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Professional Logo Showcase */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <img 
                src="/artist-tech-logo.png" 
                alt="Artist Tech" 
                className="h-32 w-32 object-contain professional-glow"
              />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="metallic-text">ARTIST</span>
              <span className="block text-4xl md:text-5xl artist-gradient bg-clip-text text-transparent mt-2">
                TECH
              </span>
            </h1>
            
            <div className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              The Professional Creative Platform
              <span className="block text-lg text-slate-400 mt-2">
                Connect • Create • Collaborate • Cash Out
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link href="/user-login">
                <button className="w-full sm:w-auto artist-gradient px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all professional-glow">
                  Enter Platform
                </button>
              </Link>
              <Link href="/ultimate-music-studio">
                <button className="w-full sm:w-auto bg-slate-800 border border-slate-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-slate-700 transition-all">
                  Try Studios
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL STUDIOS SHOWCASE */}
      <div className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="metallic-text">Professional</span>
              <span className="artist-gradient bg-clip-text text-transparent"> Studios</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Industry-leading creative tools powered by 19 self-hosted AI engines.
              <span className="block mt-2 text-slate-500">Professional grade • Zero subscription fees • Full ownership</span>
            </p>
          </div>
          
          <ProfessionalStudioGrid />
        </div>
      </div>

      {/* PROFESSIONAL FEATURES OVERVIEW */}
      <div className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="metallic-text">Why Choose</span>
              <span className="artist-gradient bg-clip-text text-transparent"> Artist Tech?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreFeatures.map((feature) => (
              <div 
                key={feature.id}
                className="studio-panel p-6 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`} style={feature.color.includes('yellow') ? {background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'} : undefined}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{feature.subtitle}</p>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center text-xs text-slate-600">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></div>
                      {stat}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROFESSIONAL CALL TO ACTION */}
      <div className="py-20 bg-gradient-to-br from-slate-800 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-8">
            <span className="metallic-text">Ready to Go</span>
            <span className="artist-gradient bg-clip-text text-transparent"> Professional?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Join thousands of creators who have already upgraded to the professional platform.
            <span className="block mt-2 text-slate-400">No subscriptions • Full ownership • Enterprise features</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <Link href="/user-login">
              <button 
                className="w-full sm:w-auto px-12 py-5 rounded-lg font-bold text-xl hover:opacity-90 transition-all professional-glow" 
                style={{background: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 50%, #f59e0b 100%)', color: '#1f2937'}}
              >
                Start Creating
              </button>
            </Link>
            <Link href="/social-media-hub">
              <button className="w-full sm:w-auto bg-slate-700 border border-slate-500 px-12 py-5 rounded-lg font-medium text-xl hover:bg-slate-600 transition-all">
                Explore Platform
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}