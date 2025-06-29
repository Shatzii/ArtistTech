import { useState } from 'react';
import { Link } from 'wouter';
import StudioNavigation from '../components/studio-navigation';
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
      color: 'from-purple-500 to-pink-500',
      stats: ['15 AI Engines', 'Professional Quality', 'Zero Learning Curve'],
      platforms: ['Beats Premiere Pro', 'Surpasses Logic Pro']
    },
    {
      id: 'collab',
      title: 'COLLAB',
      subtitle: 'Real-time Multi-user',
      description: 'Work together in real-time from anywhere. Share profits automatically. Build hits together.',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      stats: ['Live Collaboration', 'Auto Revenue Split', 'Version Control'],
      platforms: ['Better than Google Docs', 'Replaces Zoom Studio']
    },
    {
      id: 'cash-out',
      title: 'CASH OUT',
      subtitle: '13 Revenue Streams',
      description: 'Earn 10x more than Spotify. Direct fan funding, NFTs, sync licensing, live performances, and more.',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      stats: ['$50+ per 1K plays', 'Direct Fan Funding', 'Instant Payouts'],
      platforms: ['10x Spotify Payout', 'Beats OnlyFans Model']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white overflow-hidden">
      <StudioNavigation />
      
      {/* HERO SECTION - GAME CHANGER MESSAGING */}
      <div className="relative pt-20 pb-16">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* MAIN BRAND MESSAGE */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              ARTIST-TECH.COM
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              THE PLATFORM THAT CHANGES EVERYTHING
            </h2>
            <div className="text-xl md:text-2xl font-semibold mb-6 text-gray-300">
              Where Creators Actually Make Money
            </div>
          </div>

          {/* CONNECT CREATE COLLAB CASH - Core Messaging */}
          <div className="bg-black/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {coreFeatures.map((feature) => (
                <div key={feature.id} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.subtitle}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                🔥 CONNECT • CREATE • COLLAB • CASH OUT 🔥
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                The first platform designed for creators to actually get rich
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 shadow-2xl">
                    START MAKING MONEY NOW
                    <ArrowRight className="w-6 h-6 ml-2 inline" />
                  </button>
                </Link>
                <Link href="/admin">
                  <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 shadow-2xl">
                    ADMIN ACCESS
                    <Crown className="w-6 h-6 ml-2 inline" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* COMPETITOR COMPARISON - Why We're Destroying The Competition */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-8">
              🚀 DESTROYING THE OLD PLATFORMS 🚀
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {competitorPlatforms.map((platform, index) => (
                <div key={platform.name} className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-bold text-red-400 mb-2">{platform.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{platform.users} users</p>
                  <p className="text-sm text-red-300 mb-4">{platform.weakness}</p>
                  <div className="text-xs text-red-500 font-semibold">
                    ARTIST-TECH SOLVES THIS ✓
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* REVOLUTIONARY FEATURES SHOWCASE */}
      <div className="py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            💥 WHAT MAKES US GAME-CHANGING 💥
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {coreFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 hover:border-blue-500/50 transition-all transform hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`w-16 h-16 mb-4 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                
                <div className="space-y-2 mb-4">
                  {feature.stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <Star className="w-4 h-4 text-yellow-400 mr-2" />
                      <span className="text-green-400">{stat}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-orange-400 font-semibold">
                  {feature.platforms.map((platform, idx) => (
                    <div key={idx}>• {platform}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* COMPREHENSIVE STUDIOS SHOWCASE */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              🎯 ALL 15 REVOLUTIONARY STUDIOS 🎯
            </h2>
            <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
              Professional-grade tools that replace entire industry software suites - all in one platform
            </p>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Music & Audio Studios */}
              <div className="bg-gradient-to-br from-purple-800/30 to-blue-800/30 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Music Studio Pro</h3>
                <p className="text-sm text-gray-300 mb-3">Professional DAW with unlimited tracks, VST support, and AI composition</p>
                <div className="text-xs text-purple-400">Replaces: Logic Pro, Pro Tools</div>
              </div>

              <div className="bg-gradient-to-br from-orange-800/30 to-red-800/30 border border-orange-500/30 rounded-xl p-6 hover:border-orange-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Disc className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Ultimate DJ Studio</h3>
                <p className="text-sm text-gray-300 mb-3">Real-time stem separation, harmonic mixing, crowd analytics</p>
                <div className="text-xs text-orange-400">Replaces: Serato, Traktor Pro</div>
              </div>

              <div className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 border border-green-500/30 rounded-xl p-6 hover:border-green-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Podcast Studio Pro</h3>
                <p className="text-sm text-gray-300 mb-3">Live streaming, AI transcription, multi-guest support, auto-editing</p>
                <div className="text-xs text-green-400">Replaces: Riverside, Anchor</div>
              </div>

              <div className="bg-gradient-to-br from-cyan-800/30 to-blue-800/30 border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">MPC Beats Studio</h3>
                <p className="text-sm text-gray-300 mb-3">16-pad drum machine, step sequencer, professional mixer</p>
                <div className="text-xs text-cyan-400">Replaces: Akai MPC, Maschine</div>
              </div>

              {/* Video & Visual Studios */}
              <div className="bg-gradient-to-br from-pink-800/30 to-purple-800/30 border border-pink-500/30 rounded-xl p-6 hover:border-pink-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Cinema Studio Pro</h3>
                <p className="text-sm text-gray-300 mb-3">8K editing, AI effects, motion capture, real-time rendering</p>
                <div className="text-xs text-pink-400">Replaces: Premiere Pro, DaVinci</div>
              </div>

              <div className="bg-gradient-to-br from-indigo-800/30 to-purple-800/30 border border-indigo-500/30 rounded-xl p-6 hover:border-indigo-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Visual Arts Studio</h3>
                <p className="text-sm text-gray-300 mb-3">AI background removal, 16K upscaling, neural style transfer</p>
                <div className="text-xs text-indigo-400">Replaces: Photoshop, Canva</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-800/30 to-orange-800/30 border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">360° Video Studio</h3>
                <p className="text-sm text-gray-300 mb-3">VR/AR content creation, spatial audio, immersive experiences</p>
                <div className="text-xs text-yellow-400">Replaces: After Effects VR</div>
              </div>

              <div className="bg-gradient-to-br from-red-800/30 to-pink-800/30 border border-red-500/30 rounded-xl p-6 hover:border-red-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Live Streaming Suite</h3>
                <p className="text-sm text-gray-300 mb-3">Multi-platform streaming, real-time effects, audience interaction</p>
                <div className="text-xs text-red-400">Replaces: OBS, Streamlabs</div>
              </div>

              <Link href="/social-media-deployment">
                <div className="bg-gradient-to-br from-teal-800/30 to-cyan-800/30 border border-teal-500/30 rounded-xl p-6 hover:border-teal-400 transition-all transform hover:scale-105 cursor-pointer">
                  <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Social Media Deploy</h3>
                  <p className="text-sm text-gray-300 mb-3">Direct deployment to TikTok, Twitter, Instagram with AI optimization</p>
                  <div className="text-xs text-teal-400">Replaces: Creator Studio, Buffer</div>
                </div>
              </Link>

              {/* Business & Collaboration */}
              <div className="bg-gradient-to-br from-emerald-800/30 to-green-800/30 border border-emerald-500/30 rounded-xl p-6 hover:border-emerald-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Career Manager</h3>
                <p className="text-sm text-gray-300 mb-3">4 AI agents: marketing, revenue, bookings, legal automation</p>
                <div className="text-xs text-emerald-400">Replaces: Multiple agencies</div>
              </div>

              <div className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Collaborative Studio</h3>
                <p className="text-sm text-gray-300 mb-3">Real-time multi-user editing, video chat, version control</p>
                <div className="text-xs text-blue-400">Replaces: Figma, Frame.io</div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/30 to-indigo-800/30 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">NFT Marketplace</h3>
                <p className="text-sm text-gray-300 mb-3">Create, mint, and trade music NFTs with royalty automation</p>
                <div className="text-xs text-purple-400">Replaces: OpenSea, Foundation</div>
              </div>

              <div className="bg-gradient-to-br from-teal-800/30 to-cyan-800/30 border border-teal-500/30 rounded-xl p-6 hover:border-teal-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Analytics Dashboard</h3>
                <p className="text-sm text-gray-300 mb-3">Real-time performance tracking across all platforms</p>
                <div className="text-xs text-teal-400">Replaces: Spotify for Artists</div>
              </div>

              {/* AI & Advanced Features */}
              <div className="bg-gradient-to-br from-violet-800/30 to-purple-800/30 border border-violet-500/30 rounded-xl p-6 hover:border-violet-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-violet-500 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Voice Synthesis</h3>
                <p className="text-sm text-gray-300 mb-3">30-second voice cloning, multiple languages, realistic avatars</p>
                <div className="text-xs text-violet-400">Replaces: ElevenLabs, Murf</div>
              </div>

              <div className="bg-gradient-to-br from-rose-800/30 to-red-800/30 border border-rose-500/30 rounded-xl p-6 hover:border-rose-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">VR Studio Engine</h3>
                <p className="text-sm text-gray-300 mb-3">Immersive 3D workspaces, hand tracking, spatial collaboration</p>
                <div className="text-xs text-rose-400">Replaces: Horizon Workrooms</div>
              </div>

              <div className="bg-gradient-to-br from-amber-800/30 to-yellow-800/30 border border-amber-500/30 rounded-xl p-6 hover:border-amber-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Social Media AI Team</h3>
                <p className="text-sm text-gray-300 mb-3">5 AI agents for content creation, trends, and viral optimization</p>
                <div className="text-xs text-amber-400">Replaces: Hootsuite, Buffer</div>
              </div>

              <div className="bg-gradient-to-br from-pink-800/30 to-purple-800/30 border border-pink-500/30 rounded-xl p-6 hover:border-pink-400 transition-all transform hover:scale-105">
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Shuffle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Genre Remixer</h3>
                <p className="text-sm text-gray-300 mb-3">Transform any track into any genre with AI-powered suggestions</p>
                <div className="text-xs text-pink-400">Replaces: Manual remixing workflows</div>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 inline-block">
                <h3 className="text-2xl font-bold text-green-400 mb-2">💰 ALL THIS FOR JUST $29/MONTH 💰</h3>
                <p className="text-gray-300">Compare: Adobe Creative Suite ($52.99/mo) + Logic Pro ($199) + Serato DJ ($9.99/mo) = $262+</p>
                <p className="text-xl font-bold text-white mt-2">Save $233+ monthly with Artist-Tech!</p>
              </div>
            </div>
          </div>

          {/* REVENUE COMPARISON */}
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-2xl p-8 text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-6">
              💸 ACTUAL MONEY COMPARISON 💸
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6">
                <h4 className="text-xl font-bold text-red-400 mb-2">Spotify</h4>
                <p className="text-3xl font-bold text-red-300 mb-2">$3</p>
                <p className="text-sm text-gray-400">per 1,000 streams</p>
              </div>
              <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-6">
                <h4 className="text-xl font-bold text-orange-400 mb-2">TikTok</h4>
                <p className="text-3xl font-bold text-orange-300 mb-2">$0</p>
                <p className="text-sm text-gray-400">per 1M views</p>
              </div>
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6 ring-2 ring-green-400">
                <h4 className="text-xl font-bold text-green-400 mb-2">ARTIST-TECH</h4>
                <p className="text-4xl font-bold text-green-300 mb-2">$50+</p>
                <p className="text-sm text-gray-400">per 1,000 plays</p>
                <div className="text-xs text-green-400 font-semibold mt-2">
                  🔥 10x MORE MONEY 🔥
                </div>
              </div>
            </div>
          </div>

          {/* CALL TO ACTION */}
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-6">
              🎯 READY TO CHANGE THE GAME? 🎯
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the platform where creators connect globally, create professionally, 
              collaborate in real-time, and actually make serious money.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <Link href="/login" className="w-full md:w-auto">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 shadow-2xl">
                  🚀 JOIN THE REVOLUTION
                </button>
              </Link>
              <Link href="/admin" className="w-full md:w-auto">
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 shadow-2xl">
                  💰 CASH OUT NOW
                </button>
              </Link>
            </div>
            
            <div className="mt-8 text-lg text-gray-400">
              🌟 50,000+ Artists Already Making Bank 🌟
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}