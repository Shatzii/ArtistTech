import { useState } from 'react';
import { Link } from 'wouter';
import StudioNavigation from '../components/studio-navigation';
import { 
  TrendingUp, Users, Zap, DollarSign, Music, Video, 
  Instagram, Twitter, Youtube, Play, ArrowRight, Star,
  Crown, Globe, Sparkles, Target, Award, Heart
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
      id: 'cash',
      title: 'MAKE CASH',
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
                🔥 CONNECT • CREATE • COLLAB • MAKE CASH 🔥
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                The first platform designed for creators to actually get rich
              </p>
              <Link href="/login">
                <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 shadow-2xl">
                  START MAKING MONEY NOW
                  <ArrowRight className="w-6 h-6 ml-2 inline" />
                </button>
              </Link>
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
                  💰 START MAKING CASH
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