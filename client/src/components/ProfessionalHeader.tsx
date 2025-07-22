import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfessionalHeader() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="professional-header glass-effect sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Professional Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src="/artist-tech-logo.png" 
              alt="Artist Tech" 
              className="h-8 w-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold metallic-text">ARTIST</span>
              <span className="text-sm font-medium text-slate-400 -mt-1">TECH</span>
            </div>
          </Link>

          {/* Professional Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/ultimate-music-studio" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Studios
            </Link>
            <Link href="/social-media-hub" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Social Hub
            </Link>
            <Link href="/ai-career-manager" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              AI Career
            </Link>
            <Link href="/crypto-studio" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              ArtistCoin
            </Link>
          </nav>

          {/* Professional Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-300">
                  Welcome, {user?.email?.split('@')[0]}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/user-login">
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    Login
                  </Button>
                </Link>
                <Link href="/admin-login">
                  <Button 
                    size="sm" 
                    className="artist-gradient professional-glow text-white hover:opacity-90"
                  >
                    Admin
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}