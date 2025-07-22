import { Link } from "wouter";
import { 
  Music, Video, Palette, Mic, Share2, Coins, 
  Brain, Gamepad2, Globe, BarChart3, Disc, Users
} from 'lucide-react';

const professionalStudios = [
  {
    name: 'Music Studio',
    description: 'Professional DAW with AI collaboration',
    icon: Music,
    href: '/ultimate-music-studio',
    color: 'from-blue-500 to-cyan-500',
    features: ['Voice Control', 'AI Assistant', 'Real-time Collab']
  },
  {
    name: 'DJ Suite',
    description: 'Professional mixing with crowd voting',
    icon: Disc,
    href: '/ultimate-dj-suite',
    color: 'from-purple-500 to-pink-500',
    features: ['Live Voting', 'Stem Separation', 'Hardware Integration']
  },
  {
    name: 'Video Studio',
    description: 'Cinema-grade editing and effects',
    icon: Video,
    href: '/video-studio',
    color: 'from-orange-500 to-red-500',
    features: ['8K Editing', 'AI Enhancement', 'Real-time Render']
  },
  {
    name: 'Social Hub',
    description: 'Multi-platform management',
    icon: Share2,
    href: '/social-media-hub',
    color: 'from-green-500 to-emerald-500',
    features: ['Pay-to-View', 'Auto-Post', 'Analytics']
  },
  {
    name: 'VR Studio',
    description: 'Immersive creative environment',
    icon: Gamepad2,
    href: '/vr-studio',
    color: 'from-indigo-500 to-purple-500',
    features: ['Hand Tracking', 'Spatial Audio', 'Multi-user']
  },
  {
    name: 'Podcast Pro',
    description: 'Professional broadcasting suite',
    icon: Mic,
    href: '/podcast-studio',
    color: 'from-teal-500 to-cyan-500',
    features: ['AI Transcription', 'Live Streaming', 'Distribution']
  },
  {
    name: 'AI Career',
    description: 'Intelligent career management',
    icon: Brain,
    href: '/ai-career-manager',
    color: 'from-rose-500 to-pink-500',
    features: ['Market Analysis', 'Opportunity Finder', 'Revenue Optimizer']
  },
  {
    name: 'ArtistCoin',
    description: 'Cryptocurrency rewards system',
    icon: Coins,
    href: '/crypto-studio',
    color: 'from-amber-500 to-orange-500',
    features: ['Earn by Viewing', 'Creator Rewards', 'Viral Challenges']
  }
];

export default function ProfessionalStudioGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {professionalStudios.map((studio) => (
        <Link key={studio.name} href={studio.href}>
          <div className="group studio-panel hover:scale-105 transition-all duration-300 p-6 rounded-xl cursor-pointer">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${studio.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <studio.icon className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              {studio.name}
            </h3>
            
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              {studio.description}
            </p>
            
            <div className="space-y-1">
              {studio.features.map((feature) => (
                <div key={feature} className="flex items-center text-xs text-slate-500">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2"></div>
                  {feature}
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700 group-hover:border-cyan-500/50 transition-colors">
              <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
                Professional Grade →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}