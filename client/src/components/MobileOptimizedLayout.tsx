import { ReactNode, useEffect, useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Music, Video, Users, Coins, Settings, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface MobileOptimizedLayoutProps {
  children: ReactNode;
}

export function MobileOptimizedLayout({ children }: MobileOptimizedLayoutProps) {
  const deviceInfo = useDeviceDetection();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // PWA Installation prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Store the event so it can be triggered later
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Adaptive navigation based on device
  const getNavigationItems = () => {
    const baseItems = [
      { href: '/', icon: Home, label: 'Home', shortLabel: 'Home' },
      { href: '/social', icon: Users, label: 'Social Hub', shortLabel: 'Social' },
      { href: '/artistcoin-viral', icon: Coins, label: 'ArtistCoin', shortLabel: 'Coins' },
    ];

    // Add performance-appropriate features
    if (deviceInfo.performance === 'high') {
      baseItems.push(
        { href: '/video-studio', icon: Video, label: 'Video Studio', shortLabel: 'Video' },
        { href: '/music-studio', icon: Music, label: 'Music Studio', shortLabel: 'Music' }
      );
    } else if (deviceInfo.performance === 'medium') {
      baseItems.push(
        { href: '/music-studio', icon: Music, label: 'Music Studio', shortLabel: 'Music' }
      );
    }

    return baseItems;
  };

  // Install PWA function
  const installPWA = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      (window as any).deferredPrompt = null;
    }
  };

  // Mobile navigation component
  const MobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-gray-800">
      <div className="flex items-center justify-around p-2">
        {getNavigationItems().slice(0, deviceInfo.screenSize === 'small' ? 4 : 5).map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={location === item.href ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3",
                location === item.href 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-xs">
                {deviceInfo.screenSize === 'small' ? item.shortLabel : item.label}
              </span>
            </Button>
          </Link>
        ))}
        
        {/* Overflow menu for smaller screens */}
        {deviceInfo.screenSize === 'small' && getNavigationItems().length > 4 && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-gray-400">
                <Menu className="h-4 w-4" />
                <span className="text-xs">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-black border-gray-800">
              <div className="grid grid-cols-2 gap-4 p-4">
                {getNavigationItems().slice(4).map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12 text-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );

  // Desktop/Tablet sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50 bg-black/95 backdrop-blur-md border-r border-gray-800">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 px-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <img 
              src="/artist-tech-logo-new.jpeg" 
              alt="Artist Tech" 
              className="w-10 h-10 rounded-lg object-contain"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Artist Tech
            </h1>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {getNavigationItems().map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? 'default' : 'ghost'}
                  className={cn(
                    "w-full justify-start gap-3",
                    location === item.href 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* PWA Install prompt */}
        {!isInstalled && (window as any).deferredPrompt && (
          <div className="p-4 border-t border-gray-800">
            <Button
              onClick={installPWA}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Install App
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile header with hamburger menu
  const MobileHeader = () => (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center space-x-2">
          <img 
            src="/artist-tech-logo-new.jpeg" 
            alt="Artist Tech" 
            className="w-8 h-8 rounded-lg object-contain"
          />
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Artist Tech
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Device-specific indicators */}
          {deviceInfo.os === 'ios' && (
            <div className="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded">
              iOS Optimized
            </div>
          )}
          {deviceInfo.os === 'android' && (
            <div className="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded">
              Android Ready
            </div>
          )}
          
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-gray-800 w-80">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <nav className="mt-6 space-y-2">
                {getNavigationItems().map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12 text-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
              
              {/* Device info for debugging */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-gray-800 rounded-lg">
                  <h3 className="text-sm font-semibold text-white mb-2">Device Info</h3>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Type: {deviceInfo.type}</div>
                    <div>OS: {deviceInfo.os}</div>
                    <div>Performance: {deviceInfo.performance}</div>
                    <div>Screen: {deviceInfo.screenSize}</div>
                    <div>Connection: {deviceInfo.connection.speed}</div>
                  </div>
                </div>
              )}
              
              {/* PWA Install */}
              {!isInstalled && (window as any).deferredPrompt && (
                <div className="mt-6">
                  <Button
                    onClick={installPWA}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Install App
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );

  // Content wrapper with adaptive padding
  const getContentClasses = () => {
    const baseClasses = "min-h-screen";
    
    if (deviceInfo.type === 'mobile') {
      return `${baseClasses} pt-14 pb-20`; // Account for mobile header and bottom nav
    } else if (deviceInfo.type === 'tablet') {
      return `${baseClasses} md:ml-64`; // Sidebar margin for tablets
    } else {
      return `${baseClasses} md:ml-64`; // Desktop layout
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Desktop/Tablet Sidebar */}
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className={getContentClasses()}>
        {children}
      </div>
      
      {/* Mobile Bottom Navigation */}
      {deviceInfo.type === 'mobile' && <MobileNavigation />}
      
      {/* Dynamic CSS classes based on device */}
      <div className={cn(
        deviceInfo.performance === 'low' && "performance-low",
        deviceInfo.hasTouch && "touch-device",
        deviceInfo.os === 'ios' && "ios-device",
        deviceInfo.os === 'android' && "android-device"
      )} />
    </div>
  );
}