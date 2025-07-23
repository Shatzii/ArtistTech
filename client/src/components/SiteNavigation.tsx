import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Music, Video, Palette, Users, Mic, Camera, 
  Coins, Headphones, Trophy, BarChart3, Settings,
  Menu, X, Home, Zap, Brain, Target, TrendingUp,
  Sparkles, ChevronDown, Search, Bell, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Simplified dropdown without shadcn dependency

interface NavigationItem {
  name: string;
  path: string;
  icon: any;
  badge?: string;
  description?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    title: "Core Studios",
    items: [
      { name: "Music Studio", path: "/ultimate-music-studio", icon: Music, badge: "AI", description: "Professional music production" },
      { name: "Video Studio", path: "/video-studio", icon: Video, badge: "4K", description: "Advanced video editing" },
      { name: "Visual Arts", path: "/visual-studio", icon: Palette, badge: "AI", description: "Digital art creation" },
      { name: "DJ Studio", path: "/dj-studio", icon: Headphones, badge: "PRO", description: "Professional DJ mixing" },
      { name: "Podcast Studio", path: "/podcast-studio", icon: Mic, badge: "HD", description: "Podcast recording & editing" },
      { name: "VR Studio", path: "/vr-studio", icon: Camera, badge: "VR", description: "Virtual reality experiences" }
    ]
  },
  {
    title: "AI & Collaboration",
    items: [
      { name: "Collaborative Studio", path: "/collaborative-studio", icon: Users, badge: "LIVE", description: "Real-time collaboration" },
      { name: "AI Career Manager", path: "/ai-career-manager", icon: Brain, badge: "AI", description: "Career growth assistant" },
      { name: "Genre Remixer", path: "/genre-remixer", icon: Sparkles, badge: "AI", description: "Cross-genre music creation" },
      { name: "Artist Collaboration", path: "/artist-collaboration", icon: Users, badge: "NEW", description: "Connect with artists" }
    ]
  },
  {
    title: "Social & Marketing",
    items: [
      { name: "Social Media Hub", path: "/social-media-hub", icon: TrendingUp, badge: "HOT", description: "Unified social management" },
      { name: "Content Generator", path: "/one-click-social-generator", icon: Zap, badge: "1-CLICK", description: "AI content creation" },
      { name: "Strategy Coach", path: "/social-media-strategy-coach", icon: Target, badge: "NEW", description: "Personalized coaching" },
      { name: "Social Media Studio", path: "/social-media-studio", icon: Camera, badge: "PRO", description: "Professional content creation" }
    ]
  },
  {
    title: "Business & Analytics",
    items: [
      { name: "Career Management", path: "/career-management", icon: Trophy, badge: "PRO", description: "Complete career suite" },
      { name: "Analytics Dashboard", path: "/analytics-dashboard", icon: BarChart3, badge: "INSIGHTS", description: "Performance analytics" },
      { name: "Enterprise Suite", path: "/enterprise-management-studio", icon: Settings, badge: "ENTERPRISE", description: "Business management" },
      { name: "NFT Marketplace", path: "/nft-marketplace", icon: Coins, badge: "CRYPTO", description: "Digital asset trading" }
    ]
  }
];

const quickActions = [
  { name: "Create Music", path: "/ultimate-music-studio", icon: Music },
  { name: "Generate Content", path: "/one-click-social-generator", icon: Zap },
  { name: "Start Stream", path: "/dj-studio", icon: Headphones },
  { name: "Collaborate", path: "/collaborative-studio", icon: Users }
];

export default function SiteNavigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Artist Tech
              </span>
            </Link>

            {/* Main Navigation */}
            <div className="flex items-center space-x-6">
              {/* Studios Dropdown */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-blue-400"
                  onClick={() => toggleDropdown('studios')}
                >
                  Studios <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
                {activeDropdown === 'studios' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-slate-700">
                      <h3 className="text-blue-400 font-semibold">Creative Studios</h3>
                    </div>
                    <div className="p-2">
                      {navigationSections[0].items.map((item) => (
                        <Link 
                          key={item.path} 
                          href={item.path} 
                          className="flex items-center space-x-3 p-2 rounded hover:bg-slate-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <item.icon className="w-4 h-4 text-blue-400" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-white">{item.name}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Tools Dropdown */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-purple-400"
                  onClick={() => toggleDropdown('ai')}
                >
                  AI Tools <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
                {activeDropdown === 'ai' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-slate-700">
                      <h3 className="text-purple-400 font-semibold">AI & Collaboration</h3>
                    </div>
                    <div className="p-2">
                      {navigationSections[1].items.map((item) => (
                        <Link 
                          key={item.path} 
                          href={item.path} 
                          className="flex items-center space-x-3 p-2 rounded hover:bg-slate-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <item.icon className="w-4 h-4 text-purple-400" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-white">{item.name}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-400">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Social & Marketing */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-green-400"
                  onClick={() => toggleDropdown('social')}
                >
                  Social <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
                {activeDropdown === 'social' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-slate-700">
                      <h3 className="text-green-400 font-semibold">Social & Marketing</h3>
                    </div>
                    <div className="p-2">
                      {navigationSections[2].items.map((item) => (
                        <Link 
                          key={item.path} 
                          href={item.path} 
                          className="flex items-center space-x-3 p-2 rounded hover:bg-slate-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <item.icon className="w-4 h-4 text-green-400" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-white">{item.name}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Business */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-orange-400"
                  onClick={() => toggleDropdown('business')}
                >
                  Business <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
                {activeDropdown === 'business' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-slate-700">
                      <h3 className="text-orange-400 font-semibold">Business & Analytics</h3>
                    </div>
                    <div className="p-2">
                      {navigationSections[3].items.map((item) => (
                        <Link 
                          key={item.path} 
                          href={item.path} 
                          className="flex items-center space-x-3 p-2 rounded hover:bg-slate-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <item.icon className="w-4 h-4 text-orange-400" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-white">{item.name}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-400">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Quick Access Links */}
              <Link href="/login" className="text-slate-400 hover:text-white text-sm">Login</Link>
              <Link href="/admin" className="text-slate-400 hover:text-white text-sm">Admin</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Artist Tech
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-slate-900/98 backdrop-blur-sm border-b border-slate-700 max-h-[80vh] overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <Link
                        key={action.path}
                        href={action.path}
                        className="flex items-center space-x-2 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <action.icon className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white">{action.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* All Navigation Sections */}
                {navigationSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-sm font-semibold text-slate-400 mb-3">{section.title}</h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="w-5 h-5 text-blue-400" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-white">{item.name}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16"></div>
    </>
  );
}