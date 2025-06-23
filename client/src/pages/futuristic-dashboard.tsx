import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Cpu, 
  Zap, 
  Globe, 
  Brain, 
  Headphones, 
  Eye, 
  Mic, 
  Radio,
  Sparkles,
  Activity,
  Layers,
  Monitor,
  Palette,
  Music,
  Video,
  Image,
  Users,
  Coins,
  Shield,
  Workflow,
  Database,
  Network,
  ChevronRight,
  Play,
  Square,
  Settings,
  BarChart3,
  TrendingUp,
  Waves,
  Headset
} from 'lucide-react';

interface EngineStatus {
  name: string;
  status: 'active' | 'standby' | 'processing' | 'offline';
  load: number;
  users: number;
  icon: any;
  color: string;
  gradient: string;
}

interface PerformanceMetric {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export default function FuturisticDashboard() {
  const [engines, setEngines] = useState<EngineStatus[]>([
    { name: 'AI Auto-Mixing', status: 'active', load: 85, users: 24, icon: Cpu, color: '#00f5ff', gradient: 'from-cyan-400 to-blue-500' },
    { name: '3D Spatial Audio', status: 'active', load: 72, users: 18, icon: Headphones, color: '#ff6b6b', gradient: 'from-red-400 to-pink-500' },
    { name: 'Voice Synthesis', status: 'processing', load: 94, users: 31, icon: Mic, color: '#4ecdc4', gradient: 'from-teal-400 to-cyan-500' },
    { name: 'VR Studio', status: 'active', load: 67, users: 12, icon: Eye, color: '#ffe66d', gradient: 'from-yellow-400 to-orange-500' },
    { name: 'Blockchain NFT', status: 'active', load: 43, users: 89, icon: Coins, color: '#a8e6cf', gradient: 'from-green-400 to-emerald-500' },
    { name: 'Motion Capture', status: 'standby', load: 28, users: 7, icon: Activity, color: '#ff8b94', gradient: 'from-pink-400 to-rose-500' },
    { name: 'Collaborative', status: 'active', load: 78, users: 156, icon: Users, color: '#b4a7d6', gradient: 'from-purple-400 to-indigo-500' },
    { name: 'Neural Audio', status: 'active', load: 89, users: 67, icon: Brain, color: '#ffd93d', gradient: 'from-amber-400 to-yellow-500' }
  ]);

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    { label: 'Audio Processing', value: 2847, unit: 'ops/sec', trend: 'up', color: '#00f5ff' },
    { label: 'AI Inferences', value: 1394, unit: 'req/min', trend: 'up', color: '#4ecdc4' },
    { label: 'VR Sessions', value: 23, unit: 'active', trend: 'stable', color: '#ffe66d' },
    { label: 'NFT Minted', value: 156, unit: 'today', trend: 'up', color: '#a8e6cf' }
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(new Date());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Animate engine metrics
    const interval = setInterval(() => {
      setEngines(prev => prev.map(engine => ({
        ...engine,
        load: Math.max(10, Math.min(100, engine.load + (Math.random() - 0.5) * 10)),
        users: Math.max(0, engine.users + Math.floor((Math.random() - 0.5) * 4))
      })));

      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + Math.floor((Math.random() - 0.5) * metric.value * 0.1))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Neural network visualization
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nodes: Array<{ x: number; y: number; vx: number; vy: number; connections: number[] }> = [];
    
    // Create nodes
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: []
      });
    }

    // Create connections
    nodes.forEach((node, i) => {
      const nearbyNodes = nodes
        .map((n, idx) => ({ ...n, idx }))
        .filter((n, idx) => {
          if (idx === i) return false;
          const distance = Math.sqrt((n.x - node.x) ** 2 + (n.y - node.y) ** 2);
          return distance < 100;
        })
        .sort((a, b) => {
          const distA = Math.sqrt((a.x - node.x) ** 2 + (a.y - node.y) ** 2);
          const distB = Math.sqrt((b.x - node.x) ** 2 + (b.y - node.y) ** 2);
          return distA - distB;
        })
        .slice(0, 3);
      
      node.connections = nearbyNodes.map(n => n.idx);
    });

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));

        // Draw connections
        node.connections.forEach(connectionIdx => {
          const connection = nodes[connectionIdx];
          if (connection) {
            const distance = Math.sqrt((connection.x - node.x) ** 2 + (connection.y - node.y) ** 2);
            const alpha = Math.max(0, 1 - distance / 100);
            
            ctx.strokeStyle = `rgba(0, 245, 255, ${alpha * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connection.x, connection.y);
            ctx.stroke();
          }
        });

        // Draw node
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 3);
        gradient.addColorStop(0, '#00f5ff');
        gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'processing': return 'text-yellow-400 bg-yellow-400/20';
      case 'standby': return 'text-blue-400 bg-blue-400/20';
      case 'offline': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
      default: return <BarChart3 className="w-3 h-3 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <canvas 
          ref={canvasRef}
          className="w-full h-full opacity-30"
          width={1920}
          height={1080}
        />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                ProStudio Neural Network
              </h1>
              <p className="text-gray-400">Advanced AI-Powered Production Suite</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-gray-400">System Time</div>
              <div className="font-mono text-lg text-cyan-400">{time.toLocaleTimeString()}</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm">All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">{metric.label}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-baseline space-x-2">
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: metric.color }}
                  >
                    {metric.value.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm">{metric.unit}</span>
                </div>
                <div className="mt-3">
                  <Progress 
                    value={(metric.value / (metric.value * 1.2)) * 100} 
                    className="h-1"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* AI Engines Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {engines.map((engine, index) => {
            const Icon = engine.icon;
            return (
              <Card 
                key={index} 
                className="bg-gray-900/30 border-gray-700 backdrop-blur-md hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden relative"
              >
                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${engine.color}, transparent 70%)`
                  }}
                />
                
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className={`p-3 rounded-xl bg-gradient-to-r ${engine.gradient} shadow-lg`}
                      style={{ boxShadow: `0 10px 25px ${engine.color}25` }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={getStatusColor(engine.status)}>
                      {engine.status}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-white mb-2">{engine.name}</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Load</span>
                        <span style={{ color: engine.color }}>{engine.load}%</span>
                      </div>
                      <Progress 
                        value={engine.load} 
                        className="h-2"
                        style={{
                          background: 'rgba(255,255,255,0.1)'
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Active Users</span>
                      <span className="text-white">{engine.users}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-4 text-cyan-400 hover:bg-cyan-400/10 border border-cyan-400/20"
                  >
                    Monitor <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Advanced Features Showcase */}
        <div className="grid grid-cols-3 gap-6">
          {/* AI Auto-Mixing */}
          <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 backdrop-blur-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Cpu className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-lg font-semibold text-cyan-400">AI Auto-Mixing</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Intelligent stem separation, genre-specific processing, and reference track matching with real-time analysis.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Stems Processed</span>
                  <span className="text-cyan-400">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mastering Quality</span>
                  <span className="text-cyan-400">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reference Matches</span>
                  <span className="text-cyan-400">94.2%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 3D Spatial Audio */}
          <Card className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border-red-500/30 backdrop-blur-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Headphones className="w-6 h-6 text-red-400 mr-3" />
                <h3 className="text-lg font-semibold text-red-400">3D Spatial Audio</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Dolby Atmos rendering, binaural HRTF processing, and immersive venue acoustics simulation.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Binaural Sessions</span>
                  <span className="text-red-400">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Venue Libraries</span>
                  <span className="text-red-400">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Head Tracking</span>
                  <span className="text-red-400">Active</span>
                </div>
              </div>
            </div>
          </Card>

          {/* VR Studio */}
          <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30 backdrop-blur-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 text-yellow-400 mr-3" />
                <h3 className="text-lg font-semibold text-yellow-400">VR Studio</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Multi-user VR collaboration with hand tracking, haptic feedback, and 360° recording capabilities.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">VR Sessions</span>
                  <span className="text-yellow-400">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hand Tracking</span>
                  <span className="text-yellow-400">98.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Eye Tracking</span>
                  <span className="text-yellow-400">Active</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="mt-8 flex items-center justify-center space-x-4">
          <Button
            variant={isPlaying ? "default" : "outline"}
            size="lg"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-lg shadow-cyan-500/25"
          >
            {isPlaying ? <Square className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isPlaying ? 'Stop All Systems' : 'Initialize All Systems'}
          </Button>
          
          <Button variant="outline" size="lg" className="border-gray-600 hover:bg-gray-800">
            <Settings className="w-5 h-5 mr-2" />
            Neural Configuration
          </Button>
          
          <Button variant="outline" size="lg" className="border-gray-600 hover:bg-gray-800">
            <Monitor className="w-5 h-5 mr-2" />
            System Diagnostics
          </Button>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}