import { Link, useLocation } from 'wouter';
import { 
  Home, Music, Video, Palette, Users, 
  Briefcase, GraduationCap, Settings,
  Sparkles, Zap, Crown, Star
} from 'lucide-react';

const navigationItems = [
  { path: '/admin', label: 'Dashboard', icon: Home, category: 'Core' },
  { path: '/ultimate-music-studio', label: 'Music Studio', icon: Music, category: 'Core', badge: 'AI' },
  { path: '/ultimate-dj-studio', label: 'DJ Studio', icon: Zap, category: 'Core', badge: 'PRO' },
  { path: '/video-studio', label: 'Video Studio', icon: Video, category: 'Visual', badge: 'NEW' },
  { path: '/visual-studio', label: 'Visual Arts', icon: Palette, category: 'Visual' },
  { path: '/collaborative-studio', label: 'Collaboration', icon: Users, category: 'Social' },
  { path: '/business-dashboard', label: 'Business', icon: Briefcase, category: 'Business' },
  { path: '/curriculum', label: 'Education', icon: GraduationCap, category: 'Education' }
];

export default function StudioNavigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-black/90 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-[2000px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Artist Tech
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`
                    relative px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }
                  `}>
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className={`
                          px-1.5 py-0.5 text-xs font-bold rounded
                          ${item.badge === 'AI' ? 'bg-purple-500 text-white' :
                            item.badge === 'PRO' ? 'bg-yellow-500 text-black' :
                            item.badge === 'NEW' ? 'bg-green-500 text-white' :
                            'bg-blue-500 text-white'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Link href="/admin-login" className="text-gray-300 hover:text-white text-sm">
              Admin
            </Link>
            <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}