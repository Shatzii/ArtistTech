import { Link, useLocation } from 'wouter';
import { 
  Music, Disc3, Video, Palette, Users, Mic, Briefcase, Radio,
  Crown, Brain, Sparkles, Zap, Star, ChevronDown, Menu, X,
  TrendingUp, DollarSign, Building
} from 'lucide-react';
import { useState } from 'react';

interface Studio {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  premium?: boolean;
  new?: boolean;
}

const studios: Studio[] = [
  {
    name: 'Ultimate Music Studio',
    path: '/ultimate-music-studio',
    icon: Crown,
    description: 'Billboard Analysis • Celebrity Voices • Hit Generator',
    color: 'from-purple-500 to-pink-500',
    premium: true
  },
  {
    name: 'Ultimate DJ Studio',
    path: '/ultimate-dj-studio',
    icon: Disc3,
    description: 'AI Beatmatching • Stem Separation • Club Integration',
    color: 'from-blue-500 to-cyan-500',
    premium: true
  },
  {
    name: 'Video Studio',
    path: '/video-studio',
    icon: Video,
    description: 'Professional Video Editor • 4K Export • AI Enhancement',
    color: 'from-red-500 to-orange-500'
  },
  {
    name: 'Visual Arts Studio',
    path: '/visual-studio',
    icon: Palette,
    description: 'AI Art Generator • Style Transfer • NFT Creator',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Collaborative Studio',
    path: '/collaborative-studio',
    icon: Users,
    description: 'Real-time Collaboration • Multi-user DAW • Live Chat',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Podcast Studio',
    path: '/podcast-studio',
    icon: Mic,
    description: 'Professional Recording • AI Voice Enhancement • Distribution',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    name: 'AI Career Manager',
    path: '/ai-career-manager',
    icon: Briefcase,
    description: 'Career Analytics • Industry Connections • Revenue Optimization',
    color: 'from-teal-500 to-blue-500'
  },
  {
    name: 'AI Career Dashboard',
    path: '/ai-career-dashboard',
    icon: TrendingUp,
    description: 'Real-time Analytics • Predictive Insights • Growth Tracking',
    color: 'from-purple-500 to-pink-500',
    new: true
  },
  {
    name: 'Producer Revenue Hub',
    path: '/producer-revenue',
    icon: DollarSign,
    description: 'Job Marketplace • 13 Revenue Streams • Rate Optimization',
    color: 'from-orange-500 to-red-500',
    new: true
  },
  {
    name: 'Enterprise Management',
    path: '/enterprise-management',
    icon: Building,
    description: 'Record Label Operations • Film Production • Global Distribution',
    color: 'from-gray-500 to-slate-500',
    premium: true
  },
  {
    name: 'NFT Marketplace',
    path: '/nft-marketplace',
    icon: Star,
    description: 'Create & Sell NFTs • Blockchain Integration • Royalty Tracking',
    color: 'from-pink-500 to-purple-500'
  }
];

export default function StudioNavigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Navigation Bar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-3 hover:scale-105 transition-transform">
            <img 
              src="/assets/artist-tech-logo.jpeg" 
              alt="Artist Tech" 
              className="w-8 h-8 rounded object-cover border border-blue-500/50"
            />
            <div>
              <div className="text-lg font-bold text-white">KREAYSHAWN STUDIOS</div>
              <div className="text-xs text-blue-400">Ultimate Hit-Making Platform</div>
            </div>
          </Link>

          {/* Studio Selector */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <Brain className="w-4 h-4" />
              <span className="font-semibold">Select Studio</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
                <div className="p-3 border-b border-gray-700 bg-gray-800">
                  <h3 className="text-white font-bold">Kreayshawn Studios</h3>
                  <p className="text-gray-400 text-xs">Choose your creative workspace</p>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {studios.map((studio, index) => {
                    const Icon = studio.icon;
                    const isActive = location === studio.path;
                    
                    return (
                      <Link
                        key={index}
                        href={studio.path}
                        className={`block p-3 hover:bg-gray-800 transition-colors border-l-4 ${
                          isActive 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-transparent'
                        }`}
                        onClick={() => setShowDropdown(false)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${studio.color}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-semibold text-sm">{studio.name}</span>
                              {studio.premium && (
                                <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                                  ULTIMATE
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs mt-1">{studio.description}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                
                <div className="p-3 border-t border-gray-700 bg-gray-800">
                  <Link
                    href="/admin"
                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-lg transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Admin Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 px-3 py-1 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-bold">LIVE</span>
            </div>
            <div className="text-blue-400 font-mono text-sm">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      <div className={`md:hidden fixed inset-0 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
        
        <div className={`absolute left-0 top-0 h-full w-80 bg-gray-900 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-10 h-10 rounded object-cover border border-blue-500/50"
              />
              <div>
                <div className="text-lg font-bold text-white">KREAYSHAWN</div>
                <div className="text-sm text-blue-400">Studios</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {studios.map((studio, index) => {
              const Icon = studio.icon;
              const isActive = location === studio.path;
              
              return (
                <Link
                  key={index}
                  href={studio.path}
                  className={`block p-4 hover:bg-gray-800 transition-colors border-l-4 ${
                    isActive 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-transparent'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${studio.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold">{studio.name}</span>
                        {studio.premium && (
                          <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                            ULTIMATE
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{studio.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-700">
            <Link
              href="/admin"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer for desktop nav */}
      <div className="hidden md:block h-16" />
    </>
  );
}