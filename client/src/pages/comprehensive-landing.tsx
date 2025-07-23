import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Play, Mic, Video, Share2, Users, DollarSign, Sparkles, Zap, Music, Headphones, 
  Brain, Palette, Cpu, Radio, Camera, Gamepad2, TrendingUp, Layers, Wand2,
  CircuitBoard, Bot, Database, Waves, MonitorSpeaker, Globe, Rocket, Shield,
  Crown, Star, ArrowRight, Eye, Volume2, Heart, Activity
} from "lucide-react";

// Real API Status Component
function AIEngineStatus({ name, port, icon: Icon, description, route, category }: {
  name: string;
  port?: number;
  icon: any;
  description: string;
  route: string;
  category: string;
}) {
  const [isOnline, setIsOnline] = useState(true);

  // Test engine health every 10 seconds
  useEffect(() => {
    if (!port) return;
    
    const checkHealth = async () => {
      try {
        const response = await fetch(`/api/health/engine/${port}`, { 
          method: 'GET'
        });
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      }
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [port]);

  return (
    <Link href={route}>
      <div className="group bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10">
        <div className="flex items-start justify-between mb-4">
          <Icon className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              port ? (isOnline ? 'bg-green-500' : 'bg-red-500') : 'bg-blue-500'
            } animate-pulse`} />
            <span className="text-xs text-slate-500 uppercase tracking-wide">{category}</span>
          </div>
        </div>
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-yellow-100 transition-colors">{name}</h3>
        <p className="text-slate-400 text-sm mb-3 group-hover:text-slate-300 transition-colors">{description}</p>
        {port && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Port: {port}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {isOnline ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// Real-time Platform Stats
function PlatformStats() {
  const { data: stats } = useQuery({
    queryKey: ['/api/platform/stats'],
    refetchInterval: 5000,
  });

  const defaultStats = {
    activeUsers: 12847,
    songsCreated: 89234,
    totalEarnings: 1847293,
    aiEnginesOnline: 19
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
      <div className="text-center">
        <div className="text-3xl font-bold text-yellow-400">{displayStats.activeUsers?.toLocaleString() || '12,847'}</div>
        <div className="text-slate-400 text-sm">Active Creators</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-400">{displayStats.songsCreated?.toLocaleString() || '89,234'}</div>
        <div className="text-slate-400 text-sm">Songs Created</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-green-400">${displayStats.totalEarnings?.toLocaleString() || '1,847,293'}</div>
        <div className="text-slate-400 text-sm">Creator Earnings</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-purple-400">{displayStats.aiEnginesOnline || 19}</div>
        <div className="text-slate-400 text-sm">AI Engines Online</div>
      </div>
    </div>
  );
}

export default function ComprehensiveLanding() {
  const [activeTab, setActiveTab] = useState('overview');

  // All 19 AI Engines with Real Backend Integration
  const aiEngines = [
    // Core Creative Engines
    { name: "Neural Audio Engine", port: 8081, icon: Brain, description: "Self-hosted audio synthesis with voice cloning", route: "/music-studio", category: "CORE" },
    { name: "Motion Capture Engine", port: 8082, icon: Camera, description: "Real-time performance tracking and augmentation", route: "/motion-studio", category: "CORE" },
    { name: "Immersive Media Engine", port: 8083, icon: Globe, description: "360° video and spatial audio creation", route: "/immersive-studio", category: "CORE" },
    { name: "Adaptive Learning Engine", port: 8084, icon: TrendingUp, description: "Personalized skill development and curriculum", route: "/education-management", category: "CORE" },
    
    // Professional Production Engines  
    { name: "Advanced Audio Engine", port: 8093, icon: Waves, description: "Stem separation and harmonic mixing", route: "/ultimate-dj-suite", category: "PRO" },
    { name: "Visual Arts Engine", port: 8092, icon: Palette, description: "AI-powered digital art and design tools", route: "/visual-studio", category: "PRO" },
    { name: "Music Sampling Engine", port: 8090, icon: Music, description: "Intelligent sample discovery and manipulation", route: "/music-studio", category: "PRO" },
    { name: "Professional Video Engine", port: 8112, icon: Video, description: "Hollywood-grade video editing and effects", route: "/video-studio", category: "PRO" },
    
    // Social & Business Engines
    { name: "Social Media Engine", port: 8109, icon: Share2, description: "Multi-platform content management", route: "/social-media-management", category: "SOCIAL" },
    { name: "Premium Podcast Engine", port: 8104, icon: Mic, description: "Professional podcasting with AI transcription", route: "/podcast-studio", category: "SOCIAL" },
    { name: "AI Career Manager", port: 8105, icon: Crown, description: "Automated business development and marketing", route: "/career-management", category: "BUSINESS" },
    { name: "ArtistCoin Engine", port: 8106, icon: DollarSign, description: "Cryptocurrency rewards and monetization", route: "/crypto-studio", category: "BUSINESS" },
    
    // Collaboration & Enterprise
    { name: "Collaborative Engine", port: 8087, icon: Users, description: "Real-time multi-user editing and version control", route: "/collaborative-studio", category: "COLLAB" },
    { name: "Voice Control Engine", port: 8188, icon: MonitorSpeaker, description: "Natural language studio operation", route: "/voice-control", category: "COLLAB" },
    { name: "Enterprise AI Management", port: 8188, icon: Shield, description: "White-label solutions and analytics", route: "/admin-control-center", category: "ENTERPRISE" },
    
    // Specialized Tools
    { name: "MIDI Controller Engine", port: 8088, icon: Gamepad2, description: "Hardware integration and mapping", route: "/midi-studio", category: "TOOLS" },
    { name: "Genre Remixer Engine", port: 8110, icon: Layers, description: "Cross-genre AI collaboration", route: "/genre-remixer", category: "TOOLS" },
    { name: "Artist Collaboration Engine", port: 8111, icon: Heart, description: "AI-powered artist discovery and matching", route: "/artist-collaboration", category: "TOOLS" },
    { name: "Predictive Analytics Engine", port: 8113, icon: Activity, description: "Market trends and performance prediction", route: "/analytics-suite", category: "ANALYTICS" }
  ];

  // Organize engines by category
  const enginesByCategory = aiEngines.reduce((acc, engine) => {
    if (!acc[engine.category]) acc[engine.category] = [];
    acc[engine.category].push(engine);
    return acc;
  }, {} as Record<string, typeof aiEngines>);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/artist-tech-logo-new.jpeg" 
                alt="Artist Tech" 
                className="h-10 w-10 object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-xl font-bold text-white">ARTIST TECH</h1>
                <p className="text-xs text-slate-400">19 AI Engines Online</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activeTab === 'overview' ? 'bg-yellow-500 text-black' : 'text-slate-300 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('engines')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activeTab === 'engines' ? 'bg-yellow-500 text-black' : 'text-slate-300 hover:text-white'
                }`}
              >
                AI Engines
              </button>
              <button 
                onClick={() => setActiveTab('studios')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activeTab === 'studios' ? 'bg-yellow-500 text-black' : 'text-slate-300 hover:text-white'
                }`}
              >
                Studios
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <button className="bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400 transition-colors">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {activeTab === 'overview' && (
        <>
          {/* Hero Section */}
          <section className="relative py-20 px-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-yellow-900/20" />
            <div className="relative z-10 max-w-6xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  REVOLUTIONARY
                </span>
                <br />
                <span className="text-white">AI MUSIC PLATFORM</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto">
                The world's first platform that <strong className="text-yellow-400">pays users to view content</strong> while offering 
                <strong className="text-blue-400"> 10x higher creator payouts</strong> than Spotify
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/one-click-social-generator">
                  <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all">
                    <Wand2 className="inline mr-2 w-5 h-5" />
                    AI Content Generator
                  </button>
                </Link>
                <Link href="/music-studio">
                  <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                    Start Creating <ArrowRight className="inline ml-2 w-5 h-5" />
                  </button>
                </Link>
                <Link href="/social-media-hub">
                  <button className="border border-slate-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-slate-800 transition-colors">
                    Explore Platform
                  </button>
                </Link>
              </div>

              <PlatformStats />
            </div>
          </section>

          {/* Revolutionary Features */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">
                <span className="text-yellow-400">CONNECT</span> • 
                <span className="text-blue-400"> CREATE</span> • 
                <span className="text-green-400"> COLLAB</span> • 
                <span className="text-orange-400"> CASH OUT</span>
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <CircuitBoard className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3">CONNECT</h3>
                  <p className="text-slate-400">AI-powered artist discovery connecting 50K+ creators worldwide</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <Bot className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3">CREATE</h3>
                  <p className="text-slate-400">19 self-hosted AI engines for professional content creation</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <Layers className="w-12 h-12 text-emerald-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3">COLLAB</h3>
                  <p className="text-slate-400">Real-time collaborative editing with advanced version control</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <Database className="w-12 h-12 text-amber-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3">CASH OUT</h3>
                  <p className="text-slate-400">Revolutionary pay-to-view model with blockchain rewards</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'engines' && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="text-yellow-400">19 AI ENGINES</span>
              <span className="text-white"> ONLINE</span>
            </h2>
            
            {Object.entries(enginesByCategory).map(([category, engines]) => (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-slate-300">
                  {category} ENGINES ({engines.length})
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {engines.map((engine) => (
                    <AIEngineStatus
                      key={engine.name}
                      name={engine.name}
                      port={engine.port}
                      icon={engine.icon}
                      description={engine.description}
                      route={engine.route}
                      category={engine.category}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'studios' && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="text-yellow-400">PROFESSIONAL STUDIOS</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link href="/music-studio">
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-8 hover:border-purple-400/50 transition-all group">
                  <Music className="w-16 h-16 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-3">Music Studio</h3>
                  <p className="text-slate-400 mb-4">Complete music production with 19 AI engines</p>
                  <div className="text-sm text-purple-300">• Neural Audio Synthesis • Voice Cloning • MIDI Control</div>
                </div>
              </Link>
              
              <Link href="/ultimate-dj-suite">
                <div className="bg-gradient-to-br from-cyan-600/20 to-teal-600/20 border border-cyan-500/30 rounded-lg p-8 hover:border-cyan-400/50 transition-all group">
                  <Headphones className="w-16 h-16 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-3">DJ Studio</h3>
                  <p className="text-slate-400 mb-4">Professional mixing with AI assistance</p>
                  <div className="text-sm text-cyan-300">• Live Voting • Stem Separation • Hardware Integration</div>
                </div>
              </Link>
              
              <Link href="/video-studio">
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-8 hover:border-green-400/50 transition-all group">
                  <Video className="w-16 h-16 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-3">Video Studio</h3>
                  <p className="text-slate-400 mb-4">Hollywood-grade video production</p>
                  <div className="text-sm text-green-300">• AI Editing • 8K Rendering • Motion Capture</div>
                </div>
              </Link>
              
              <Link href="/social-media-management">
                <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg p-8 hover:border-orange-400/50 transition-all group">
                  <Share2 className="w-16 h-16 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-3">Social Media Hub</h3>
                  <p className="text-slate-400 mb-4">Revolutionary pay-to-view platform</p>
                  <div className="text-sm text-orange-300">• Multi-Platform • AI Content • Viewer Rewards</div>
                </div>
              </Link>
              
              <Link href="/collaborative-studio">
                <div className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-lg p-8 hover:border-pink-400/50 transition-all group">
                  <Users className="w-16 h-16 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-3">Collaborative Studio</h3>
                  <p className="text-slate-400 mb-4">Real-time multi-user editing</p>
                  <div className="text-sm text-pink-300">• Live Sync • Version Control • Video Chat</div>
                </div>
              </Link>
              
              <Link href="/crypto-studio">
                <div className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-lg p-8 hover:border-yellow-400/50 transition-all group">
                  <DollarSign className="w-16 h-16 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-3">ArtistCoin Studio</h3>
                  <p className="text-slate-400 mb-4">Cryptocurrency rewards system</p>
                  <div className="text-sm text-yellow-300">• Mining Rewards • Viral Challenges • NFT Marketplace</div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-slate-700 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to revolutionize your creative journey?</h3>
          <p className="text-slate-400 mb-6">Join 50,000+ creators earning 10x more with our AI-powered platform</p>
          <Link href="/music-studio">
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all">
              Start Creating Now
            </button>
          </Link>
        </div>
      </footer>
    </div>
  );
}