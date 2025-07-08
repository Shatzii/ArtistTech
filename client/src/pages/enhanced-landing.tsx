import { useState } from 'react';
import { Link } from 'wouter';
import { 
  TrendingUp, Users, Zap, DollarSign, Music, Video, 
  Instagram, Twitter, Youtube, Play, ArrowRight, Star,
  Crown, Globe, Sparkles, Target, Award, Heart,
  Disc, Mic, Volume2, Palette, Camera, Coins, BarChart3,
  Brain, Gamepad2, Shuffle, Radio, Headphones, MonitorPlay,
  Timer, ChevronDown, ExternalLink, CheckCircle, Building
} from 'lucide-react';

export default function EnhancedLanding() {
  const [activeStudio, setActiveStudio] = useState<string | null>(null);
  const [showFeatures, setShowFeatures] = useState(false);

  const studios = [
    {
      id: 'podcast',
      name: 'Podcast Studio Pro',
      icon: <Mic className="w-8 h-8" />,
      route: '/podcast-studio',
      color: 'from-green-600 to-emerald-600',
      borderColor: 'border-green-500',
      description: 'Professional podcast creation with AI transcription, guest management, and live streaming',
      features: ['AI Transcription', 'Guest Management', 'Live Streaming', 'Show Notes AI', 'Multi-Platform Publishing'],
      replaces: 'Audacity, Hindenburg Pro'
    },
    {
      id: 'video',
      name: 'Advanced Video Editor',
      icon: <Video className="w-8 h-8" />,
      route: '/advanced-video-editor',
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500',
      description: 'Hollywood-grade video editing with 8K support, AI effects, and real-time rendering',
      features: ['8K Editing', 'AI Effects', 'Color Grading', 'Motion Graphics', 'Real-time Rendering'],
      replaces: 'Premiere Pro, DaVinci Resolve'
    },
    {
      id: 'music',
      name: 'Ultimate Music Studio',
      icon: <Music className="w-8 h-8" />,
      route: '/ultimate-music-studio',
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500',
      description: 'Complete music production suite with AI composition, mixing, and mastering',
      features: ['AI Composition', 'Virtual Instruments', 'Professional Mixing', 'Auto-Mastering', 'MIDI Support'],
      replaces: 'Logic Pro, Ableton Live'
    },
    {
      id: 'dj',
      name: 'Ultimate DJ Studio',
      icon: <Disc className="w-8 h-8" />,
      route: '/ultimate-dj-studio',
      color: 'from-orange-600 to-red-600',
      borderColor: 'border-orange-500',
      description: 'Professional DJ controller with live streaming, crowd voting, and AI mixing',
      features: ['Live Streaming', 'Crowd Voting', 'AI Mixing', 'Hardware Support', 'Real-time Effects'],
      replaces: 'Serato DJ, Virtual DJ'
    },
    {
      id: 'visual',
      name: 'Visual Arts Studio',
      icon: <Palette className="w-8 h-8" />,
      route: '/visual-studio',
      color: 'from-indigo-600 to-purple-600',
      borderColor: 'border-indigo-500',
      description: 'Professional image editing with AI enhancement, background removal, and style transfer',
      features: ['AI Enhancement', 'Background Removal', 'Style Transfer', '16K Upscaling', 'Batch Processing'],
      replaces: 'Photoshop, Canva Pro'
    },
    {
      id: 'collaboration',
      name: 'Artist Collaboration',
      icon: <Users className="w-8 h-8" />,
      route: '/artist-collaboration',
      color: 'from-cyan-600 to-teal-600',
      borderColor: 'border-cyan-500',
      description: 'AI-powered cross-genre artist discovery and collaboration network',
      features: ['AI Matching', 'Cross-Genre Discovery', 'Project Management', 'Revenue Sharing', 'Real-time Collab'],
      replaces: 'Manual networking, outdated platforms'
    }
  ];

  const businessFeatures = [
    {
      name: 'AI Career Manager',
      icon: <Brain className="w-6 h-6" />,
      route: '/ai-career-manager',
      description: '4 AI agents managing marketing, revenue, bookings, and legal'
    },
    {
      name: 'Producer Revenue Hub',
      icon: <DollarSign className="w-6 h-6" />,
      route: '/producer-revenue',
      description: '13 revenue streams and marketplace integrations'
    },
    {
      name: 'Enterprise Management',
      icon: <Building className="w-6 h-6" />,
      route: '/enterprise-management',
      description: 'Full record label and film production operations'
    },
    {
      name: 'Social Media Deployment',
      icon: <Globe className="w-6 h-6" />,
      route: '/social-media-deployment',
      description: 'Direct deployment to TikTok, Twitter, Instagram, YouTube'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Hero Section with Interactive Studios */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16">

          {/* Main Headline */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Artist-Tech
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-white mb-4">
              Connect • Create • Collab • Cash Out
            </p>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
              The world's first AI-powered multimedia empire. Replace TikTok, Instagram, Spotify, and YouTube with one revolutionary platform that pays artists 10x more.
            </p>

            {/* Quick Access Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link href="/login">
                <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all shadow-2xl">
                  Start Creating Now - FREE
                </button>
              </Link>
              <button 
                onClick={() => setShowFeatures(!showFeatures)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
              >
                Explore All Features
                <ChevronDown className={`w-5 h-5 transition-transform ${showFeatures ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Interactive Studio Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {studios.map((studio) => (
              <div
                key={studio.id}
                className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  activeStudio === studio.id ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setActiveStudio(studio.id)}
                onMouseLeave={() => setActiveStudio(null)}
              >
                <div className={`bg-gradient-to-br ${studio.color} p-1 rounded-2xl`}>
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${studio.color}`}>
                        {studio.icon}
                      </div>
                      <Link href={studio.route}>
                        <button className="text-white hover:text-cyan-400 transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{studio.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{studio.description}</p>

                    {/* Feature List */}
                    <div className={`transition-all duration-300 ${
                      activeStudio === studio.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                      <div className="space-y-2 mb-4">
                        {studio.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-400">
                        Replaces: {studio.replaces}
                      </div>
                    </div>

                    {/* Access Button */}
                    <Link href={studio.route}>
                      <button className={`w-full mt-4 bg-gradient-to-r ${studio.color} text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}>
                        Launch Studio
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Business Features Section */}
          <div className={`transition-all duration-500 ${showFeatures ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="bg-gradient-to-r from-gray-900/50 to-purple-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 mb-16">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                💼 Business & Revenue Features
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {businessFeatures.map((feature, index) => (
                  <Link key={index} href={feature.route}>
                    <div className="bg-black/40 border border-gray-700 rounded-xl p-6 hover:border-purple-400 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-500 transition-colors">
                          {feature.icon}
                        </div>
                        <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">
                          {feature.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-300">{feature.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Comparison */}
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-2xl p-8 text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              💰 Revolutionary Artist Payouts
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-red-400 mb-2">Spotify</h3>
                <p className="text-3xl font-bold text-white">$3-5</p>
                <p className="text-gray-300">per 1,000 plays</p>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">YouTube</h3>
                <p className="text-3xl font-bold text-white">$1-3</p>
                <p className="text-gray-300">per 1,000 views</p>
              </div>
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-green-400 mb-2">Artist-Tech</h3>
                <p className="text-3xl font-bold text-white">$50+</p>
                <p className="text-gray-300">per 1,000 plays</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-400 mt-8">
              10x Higher Payouts + Keep 95% of Revenue!
            </p>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 inline-block">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Build Your Empire?
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Join the platform that's replacing the entire creator economy
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/login">
                  <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all shadow-2xl">
                    Start Free - No Credit Card
                  </button>
                </Link>
                <Link href="/admin-login">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all shadow-2xl">
                    Admin Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}