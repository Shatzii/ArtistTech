import { ReactNode } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdaptiveCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
}

export function AdaptiveCard({ title, children, className, priority = 'medium' }: AdaptiveCardProps) {
  const deviceInfo = useDeviceDetection();

  // Skip low-priority cards on low-performance devices
  if (deviceInfo.performance === 'low' && priority === 'low') {
    return null;
  }

  // Simplified layout for small screens
  if (deviceInfo.screenSize === 'small') {
    return (
      <div className={cn("bg-black/20 border border-gray-700 rounded-lg p-4", className)}>
        <h3 className="font-semibold text-white mb-3 text-sm">{title}</h3>
        <div className="text-sm">{children}</div>
      </div>
    );
  }

  // Standard card for larger screens
  return (
    <Card className={cn("bg-black/20 border-gray-700", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface AdaptiveGridProps {
  children: ReactNode;
  className?: string;
}

export function AdaptiveGrid({ children, className }: AdaptiveGridProps) {
  const deviceInfo = useDeviceDetection();

  const getGridClasses = () => {
    switch (deviceInfo.screenSize) {
      case 'small':
        return 'grid grid-cols-1 gap-4';
      case 'medium':
        return 'grid grid-cols-1 md:grid-cols-2 gap-4';
      case 'large':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      case 'xlarge':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  return (
    <div className={cn(getGridClasses(), className)}>
      {children}
    </div>
  );
}

interface AdaptiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function AdaptiveButton({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'default',
  className,
  disabled 
}: AdaptiveButtonProps) {
  const deviceInfo = useDeviceDetection();

  // Touch-friendly sizing for mobile
  const getSize = () => {
    if (deviceInfo.hasTouch) {
      return size === 'sm' ? 'default' : size === 'default' ? 'lg' : 'lg';
    }
    return size;
  };

  // Add haptic feedback for mobile
  const handleClick = () => {
    if (deviceInfo.hasTouch && deviceInfo.capabilities.vibration) {
      navigator.vibrate?.(10); // Light haptic feedback
    }
    onClick?.();
  };

  return (
    <Button
      variant={variant}
      size={getSize()}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        deviceInfo.hasTouch && "min-h-[44px] min-w-[44px]", // iOS touch guidelines
        className
      )}
    >
      {children}
    </Button>
  );
}

interface AdaptiveTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    shortLabel?: string;
    content: ReactNode;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function AdaptiveTabs({ tabs, activeTab, onTabChange, className }: AdaptiveTabsProps) {
  const deviceInfo = useDeviceDetection();

  // Horizontal scrolling tabs for mobile
  if (deviceInfo.screenSize === 'small') {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex overflow-x-auto scrollbar-hide pb-2">
          <div className="flex space-x-2 min-w-max px-4">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className="whitespace-nowrap min-w-[80px]"
              >
                {tab.shortLabel || tab.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="px-4">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      </div>
    );
  }

  // Standard tabs for larger screens
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 min-w-[120px]"
          >
            {tab.label}
          </Button>
        ))}
      </div>
      
      <div>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

interface AdaptiveMediaProps {
  src: string;
  alt?: string;
  type: 'image' | 'video';
  className?: string;
}

export function AdaptiveMedia({ src, alt, type, className }: AdaptiveMediaProps) {
  const deviceInfo = useDeviceDetection();

  // Optimize media for device performance
  const getMediaProps = () => {
    if (deviceInfo.performance === 'low' || deviceInfo.connection.speed === 'slow') {
      return {
        loading: 'lazy' as const,
        quality: 60,
        preload: 'none' as const,
      };
    }
    
    if (deviceInfo.performance === 'medium') {
      return {
        loading: 'lazy' as const,
        quality: 80,
        preload: 'metadata' as const,
      };
    }
    
    return {
      loading: 'eager' as const,
      quality: 100,
      preload: 'auto' as const,
    };
  };

  const mediaProps = getMediaProps();

  if (type === 'video') {
    return (
      <video
        src={src}
        controls
        preload={mediaProps.preload}
        className={cn("w-full rounded-lg", className)}
        playsInline // iOS optimization
        muted // Allow autoplay on mobile
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={mediaProps.loading}
      className={cn("w-full rounded-lg object-cover", className)}
    />
  );
}

interface PerformanceIndicatorProps {
  className?: string;
}

export function PerformanceIndicator({ className }: PerformanceIndicatorProps) {
  const deviceInfo = useDeviceDetection();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getPerformanceColor = () => {
    switch (deviceInfo.performance) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConnectionColor = () => {
    switch (deviceInfo.connection.speed) {
      case 'fast': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'slow': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={cn("fixed bottom-4 left-4 z-50 flex gap-2", className)}>
      <Badge className={cn("text-xs", getPerformanceColor())}>
        {deviceInfo.performance} perf
      </Badge>
      <Badge className={cn("text-xs", getConnectionColor())}>
        {deviceInfo.connection.speed} net
      </Badge>
      <Badge className="text-xs bg-blue-500">
        {deviceInfo.type}
      </Badge>
    </div>
  );
}

interface AdaptiveListProps {
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    action?: ReactNode;
  }>;
  className?: string;
}

export function AdaptiveList({ items, className }: AdaptiveListProps) {
  const deviceInfo = useDeviceDetection();

  // Simplified list for small screens
  if (deviceInfo.screenSize === 'small') {
    return (
      <div className={cn("space-y-2", className)}>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-900/20 rounded-lg">
            {item.icon && <div className="flex-shrink-0">{item.icon}</div>}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">{item.title}</p>
              {item.subtitle && (
                <p className="text-xs text-gray-400 truncate">{item.subtitle}</p>
              )}
            </div>
            {item.action && <div className="flex-shrink-0">{item.action}</div>}
          </div>
        ))}
      </div>
    );
  }

  // Enhanced list for larger screens
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-900/20 rounded-lg hover:bg-gray-900/30 transition-colors">
          {item.icon && <div className="flex-shrink-0">{item.icon}</div>}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white">{item.title}</p>
            {item.subtitle && (
              <p className="text-sm text-gray-400">{item.subtitle}</p>
            )}
          </div>
          {item.action && <div className="flex-shrink-0">{item.action}</div>}
        </div>
      ))}
    </div>
  );
}

interface AdaptiveStatsProps {
  stats: Array<{
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  className?: string;
}

export function AdaptiveStats({ stats, className }: AdaptiveStatsProps) {
  const deviceInfo = useDeviceDetection();

  // Compact stats for mobile
  if (deviceInfo.screenSize === 'small') {
    return (
      <div className={cn("grid grid-cols-2 gap-3", className)}>
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-3 bg-gray-900/20 rounded-lg">
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    );
  }

  // Enhanced stats for larger screens
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center p-4 bg-gray-900/20 rounded-lg">
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-sm text-gray-400">{stat.label}</p>
          {stat.change && (
            <p className={cn(
              "text-xs mt-1",
              stat.trend === 'up' ? 'text-green-400' :
              stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
            )}>
              {stat.change}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}