import { useState } from 'react';
import { Link } from 'wouter';
import { 
  TrendingUp, Users, Zap, DollarSign, Music, Video, 
  Play, ArrowRight, Star, Crown, Globe, Sparkles,
  Cpu, Bot, CircuitBoard, Database, Layers, MonitorSpeaker,
  Waves, Brain, Rocket, Shield
} from 'lucide-react';

export default function NewLanding() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const coreFeatures = [
    {
      id: 'connect',
      title: 'CONNECT',
      subtitle: 'Neural Network Community',
      description: 'AI-powered artist discovery & matching',
      icon: CircuitBoard,
      color: 'from-cyan-500 to-blue-600',
      stats: ['50K+ Active Artists', 'AI Matching', 'Quantum Network']
    },
    {
      id: 'create',
      title: 'CREATE',
      subtitle: '19 AI Engines',
      description: 'Self-hosted AI for professional content',
      icon: Bot,
      color: 'from-purple-500 to-violet-600',
      stats: ['Neural Audio Synthesis', 'AI Video Generation', 'Voice Cloning']
    },
    {
      id: 'collab',
      title: 'COLLAB',
      subtitle: 'Quantum Collaboration',
      description: 'Real-time multi-dimensional editing',
      icon: Layers,
      color: 'from-emerald-500 to-teal-600',
      stats: ['Live Sync', 'AI Assistance', 'Holographic Interface']
    },
    {
      id: 'cash',
      title: 'CASH OUT',
      subtitle: 'Blockchain Rewards',
      description: '10x higher payouts than Spotify',
      icon: Database,
      color: 'from-amber-500 to-orange-600',
      stats: ['$50+ per 1K plays', 'ArtistCoin Mining', 'Smart Contracts']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* PROFESSIONAL HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10" style={{background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)'}}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <img 
                  src="/artist-tech-logo-new.jpeg" 
                  alt="Artist Tech" 
                  className="h-12 w-12 object-contain relative z-10 rounded-lg"
                  onError={(e) => {
                    // Try fallback logo formats
                    const fallbacks = ['/artist-tech-logo.jpeg', '/artist-tech-logo.png'];
                    const currentSrc = e.currentTarget.src;
                    const nextFallback = fallbacks.find(f => !currentSrc.includes(f));
                    if (nextFallback) {
                      e.currentTarget.src = nextFallback;
                    } else {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
                {/* Fallback Logo */}
                <div className="hidden h-12 w-12 rounded-lg real-gold-button items-center justify-center">
                  <Cpu className="w-6 h-6 text-slate-900" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold metallic-text">
                  ARTIST
                </span>
                <span className="text-sm font-medium text-cyan-400 -mt-1">TECH</span>
              </div>
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              <Link href="/user-login">
                <button className="px-4 py-2 text-sm border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg transition-all">
                  Login
                </button>
              </Link>
              <Link href="/admin-login">
                <button 
                  className="px-4 py-2 text-sm rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 50%, #f59e0b 100%)',
                    color: '#1f2937',
                    boxShadow: '0 2px 10px rgba(251, 191, 36, 0.3)'
                  }}
                >
                  Admin
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION - CUTTING EDGE */}
      <div className="relative py-20 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950/80 to-slate-800"></div>
          {/* Tech Grid Pattern */}
          <div className="absolute inset-0 opacity-20" 
               style={{
                 backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 212, 255, 0.3) 1px, transparent 0)`,
                 backgroundSize: '50px 50px'
               }}>
          </div>
          {/* Dynamic Tech Elements */}
          <div className="absolute top-20 left-20 w-3 h-3 bg-cyan-400 rounded-full tech-pulse"></div>
          <div className="absolute top-60 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 left-32 w-4 h-4 border border-cyan-400 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-12 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-12 h-1 bg-gradient-to-r from-yellow-400 to-transparent animate-pulse"></div>
          
          {/* Floating Circuit Lines */}
          <div className="absolute top-1/2 left-10 w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute top-1/4 right-16 w-0.5 h-16 bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Tech Badge - Enhanced */}
            <div className="inline-flex items-center px-6 py-3 mb-8 rounded-full holographic float-animation">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-cyan-400 text-sm font-bold tracking-wider">CUTTING-EDGE TECHNOLOGY</span>
              <div className="w-2 h-2 bg-yellow-400 rounded-full ml-3 animate-ping" style={{animationDelay: '0.5s'}}></div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="metallic-text block">
                FIRST PLATFORM
              </span>
              <span className="text-white block">TO PAY YOU FOR</span>
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text block">
                VIEWING CONTENT
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Revolutionary "pay-to-view" model powered by <span className="text-cyan-400 font-semibold">19 AI engines</span>. 
              <span className="block mt-2 text-slate-400">
                Earn ArtistCoins while consuming content • 
                <span className="metallic-text font-bold"> 10x higher payouts</span>
              </span>
            </p>
            
            {/* Tech Stats - Enhanced */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
              <div className="holographic p-6 rounded-xl float-animation" style={{animationDelay: '0s'}}>
                <div className="text-3xl font-bold metallic-text mb-1">19</div>
                <div className="text-sm text-cyan-400 font-medium">AI Engines</div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2 animate-pulse"></div>
              </div>
              <div className="holographic p-6 rounded-xl float-animation" style={{animationDelay: '0.3s'}}>
                <div className="text-3xl font-bold metallic-text mb-1">$50+</div>
                <div className="text-sm text-yellow-400 font-medium">Per 1K Plays</div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mt-2 animate-pulse"></div>
              </div>
              <div className="holographic p-6 rounded-xl float-animation" style={{animationDelay: '0.6s'}}>
                <div className="text-3xl font-bold text-cyan-400 mb-1">100%</div>
                <div className="text-sm text-slate-300 font-medium">Self-Hosted</div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2 animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link href="/user-login">
                <button className="real-gold-button w-full sm:w-auto px-12 py-5 rounded-xl font-bold text-xl transition-all">
                  Start Creating
                </button>
              </Link>
              <Link href="/social-media-hub">
                <button className="w-full sm:w-auto bg-slate-800/50 border border-cyan-400/50 px-8 py-4 rounded-xl font-medium text-lg hover:bg-slate-700/70 transition-all tech-border">
                  Explore Platform
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CORE FEATURES */}
      <div className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span style={{background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                Connect • Create • Collab • Cash Out
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              The complete creative ecosystem for artists, producers, and content creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreFeatures.map((feature, index) => (
              <div 
                key={feature.id}
                className={`cutting-edge-panel p-6 rounded-xl transition-all duration-500 cursor-pointer hover:scale-105 ${
                  hoveredFeature === feature.id ? 'tech-border' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Icon with Tech Effect */}
                <div className="relative mb-6">
                  <div 
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center relative overflow-hidden`}
                    style={feature.id === 'cash' ? {
                      background: 'linear-gradient(135deg, var(--gold-dark) 0%, var(--gold-base) 50%, var(--gold-shine) 100%)'
                    } : undefined}
                  >
                    <feature.icon className="w-8 h-8 text-white relative z-10" />
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-pulse"></div>
                  </div>
                  {/* Floating Tech Indicator */}
                  {feature.id === 'cash' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <h3 className={`text-2xl font-bold mb-3 ${
                  feature.id === 'cash' ? 'metallic-text' : 'text-white'
                }`}>
                  {feature.title}
                </h3>
                <p className="text-cyan-400 text-sm mb-4 font-medium">{feature.subtitle}</p>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center text-xs text-slate-500">
                      <div className="w-2 h-2 rounded-full mr-3 real-gold-button" style={{padding: '1px'}}></div>
                      {stat}
                    </div>
                  ))}
                </div>
                
                {/* Enhanced Tech Corner Accent */}
                <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-cyan-400/50 tech-pulse"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-yellow-400/30 tech-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="py-20 bg-gradient-to-br from-slate-800 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-8">
            <span style={{background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Ready to Go Professional?
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Join thousands of creators earning more with our revolutionary platform.
            <span className="block mt-2 text-slate-400">No subscriptions • Full ownership • Enterprise features</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <Link href="/user-login">
              <button 
                className="w-full sm:w-auto px-12 py-5 rounded-lg font-bold text-xl transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 50%, #f59e0b 100%)',
                  color: '#1f2937',
                  boxShadow: '0 4px 20px rgba(251, 191, 36, 0.3)'
                }}
              >
                Start Creating
              </button>
            </Link>
            <Link href="/social-media-hub">
              <button className="w-full sm:w-auto bg-slate-800 border border-slate-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-slate-700 transition-all">
                Explore Platform
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}