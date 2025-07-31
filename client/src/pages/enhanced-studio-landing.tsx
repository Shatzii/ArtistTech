import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Music, Video, Mic, Palette, Radio, Users, Zap, DollarSign,
  Play, ArrowRight, Star, Crown, Globe, Sparkles, Target, Award,
  Disc, Volume2, Camera, Coins, BarChart3, Brain, Gamepad2,
  Instagram, Twitter, Youtube, Twitch, Monitor, Smartphone,
  Headphones, Sliders, Layers, AudioWaveform, Piano, Wand2
} from 'lucide-react';

// Import actual studio components for live previews
import EnhancedCanvas from "@/components/ui/enhanced-canvas";
import ProfessionalTransport from "@/components/ui/professional-transport";
import AdvancedMixer from "@/components/ui/advanced-mixer";
import WaveformVisualizer from "@/components/ui/waveform-visualizer";
import ProfessionalPiano from "@/components/ui/professional-piano";

export default function EnhancedStudioLanding() {
  const [activeDemo, setActiveDemo] = useState('music');
  const [hoveredStudio, setHoveredStudio] = useState<string | null>(null);
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null);
  const [earnings, setEarnings] = useState(342.50);
  const [userCount, setUserCount] = useState(14486);

  // Live counter animations
  useEffect(() => {
    const interval = setInterval(() => {
      setEarnings(prev => prev + Math.random() * 0.5);
      setUserCount(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Professional Studio Showcase
  const studioFeatures = [
    {
      id: 'music',
      name: 'Ultimate Music Studio',
      description: 'Professional DAW with AI-powered composition, real-time collaboration, and industry-standard mixing',
      icon: Music,
      color: 'from-blue-500 to-purple-600',
      features: [
        '16-track professional mixing console',
        'VST plugin integration (Serum, Pro-Q 3, Massive)',
        'AI composition and chord progression generation',
        'Real-time multi-user collaboration',
        'Professional transport controls with precise BPM',
        'Advanced waveform visualization and editing',
        'Professional piano with multi-octave support',
        'Infinite canvas for creative arrangement'
      ],
      route: '/ultimate-music-studio',
      preview: 'Enhanced Canvas + Professional Transport',
      stats: { tracks: '16+', plugins: '50+', users: '12.3K' }
    },
    {
      id: 'dj',
      name: 'Professional DJ Suite',
      description: 'Pioneer CDJ-3000 integration, harmonic mixing, live voting, and crowd analytics',
      icon: Disc,
      color: 'from-orange-500 to-red-600',
      features: [
        'Professional dual-deck mixing interface',
        'Pioneer CDJ-3000 and DJM-900NXS2 integration',
        'AI-powered harmonic mixing and key matching',
        'Live audience voting and track requests',
        'Real-time crowd energy analytics',
        'Advanced stem separation and remixing',
        'Live streaming to multiple platforms',
        'Professional crossfader and EQ controls'
      ],
      route: '/unified-dj-studio',
      preview: 'Advanced Mixer + Live Performance',
      stats: { decks: '2', listeners: '3.2K', events: '847' }
    },
    {
      id: 'video',
      name: 'Hollywood Video Studio',
      description: '8K editing, AI effects, motion capture, and professional color grading',
      icon: Video,
      color: 'from-red-500 to-pink-600',
      features: ['8K editing', 'AI effects', 'Motion capture', 'Color grading'],
      route: '/video-studio',
      preview: 'Timeline + Effects Engine'
    },
    {
      id: 'social',
      name: 'Social Media Hub',
      description: 'Revolutionary "pay-to-view" platform replacing TikTok, Instagram, and YouTube',
      icon: Globe,
      color: 'from-green-500 to-teal-600',
      features: ['Multi-platform posting', 'Viral prediction', 'Auto content', 'Pay-to-view'],
      route: '/unified-social-media-hub',
      preview: 'Content Creator + Analytics'
    },
    {
      id: 'podcast',
      name: 'Podcast Studio Pro',
      description: 'Professional recording, AI transcription, and multi-platform distribution',
      icon: Mic,
      color: 'from-purple-500 to-indigo-600',
      features: ['Pro recording', 'AI transcription', 'Distribution', 'Live streaming'],
      route: '/podcast-studio',
      preview: 'Recording Interface + Analytics'
    },
    {
      id: 'visual',
      name: 'Visual Arts Studio',
      description: 'AI-powered art creation, NFT marketplace, and collaborative design tools',
      icon: Palette,
      color: 'from-pink-500 to-rose-600',
      features: ['AI art generation', 'NFT creation', 'Collaborative tools', 'Style transfer'],
      route: '/visual-studio',
      preview: 'AI Canvas + Style Tools'
    },
    {
      id: 'vr',
      name: 'VR Creative Space',
      description: 'Immersive 3D environments for music creation and virtual performances',
      icon: Gamepad2,
      color: 'from-cyan-500 to-blue-600',
      features: ['3D environments', 'Hand tracking', 'Virtual concerts', 'Spatial audio'],
      route: '/vr-studio',
      preview: '3D Interface + Motion Controls'
    },
    {
      id: 'crypto',
      name: 'ArtistCoin Studio',
      description: 'Gamified cryptocurrency system with viral challenges and fan rewards',
      icon: Coins,
      color: 'from-yellow-500 to-orange-600',
      features: ['Crypto rewards', 'Viral challenges', 'Fan monetization', 'Staking system'],
      route: '/crypto-studio',
      preview: 'Crypto Dashboard + Challenges'
    }
  ];

  // Mock data for live studio demos
  const [transportState, setTransportState] = useState({
    isPlaying: false,
    isRecording: false,
    isPaused: false,
    position: 45.7,
    duration: 240,
    bpm: 128,
    volume: 75,
    sampleRate: 44100,
    bufferSize: 256,
    latency: 5.8
  });

  const [mixerChannels] = useState([
    {
      id: '1', name: 'Lead', type: 'audio' as const, level: 75, pan: 0,
      muted: false, solo: false, armed: false,
      eq: { high: 0, mid: 2, low: 0 },
      effects: { reverb: 15, delay: 8, chorus: 5, compressor: 3 },
      gain: 3, phase: false, hpf: 80, lpf: 8000
    }
  ]);

  const renderStudioPreview = () => {
    switch (activeDemo) {
      case 'music':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <ProfessionalTransport
                state={transportState}
                onPlay={() => setTransportState(prev => ({ ...prev, isPlaying: true }))}
                onPause={() => setTransportState(prev => ({ ...prev, isPlaying: false }))}
                onStop={() => setTransportState(prev => ({ ...prev, isPlaying: false, position: 0 }))}
                onRecord={() => setTransportState(prev => ({ ...prev, isRecording: !prev.isRecording }))}
                onSeek={(position) => setTransportState(prev => ({ ...prev, position }))}
                onVolumeChange={(volume) => setTransportState(prev => ({ ...prev, volume }))}
                onBPMChange={(bpm) => setTransportState(prev => ({ ...prev, bpm }))}
                compact={true}
              />
            </div>
            <div className="bg-gray-900 rounded-lg p-2">
              <WaveformVisualizer
                width={600}
                height={80}
                isPlaying={transportState.isPlaying}
                currentTime={transportState.position}
                duration={transportState.duration}
                showControls={false}
              />
            </div>
            <div className="bg-gray-900 rounded-lg p-2">
              <AdvancedMixer
                channels={mixerChannels}
                masterVolume={transportState.volume}
                onChannelChange={() => {}}
                onMasterVolumeChange={() => {}}
                compactMode={true}
              />
            </div>
          </div>
        );

      case 'dj':
        return (
          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded p-3">
                <h4 className="text-sm font-bold mb-2">DECK A</h4>
                <div className="space-y-2">
                  <div className="text-xs">Epic Future Bass - 128 BPM</div>
                  <div className="h-2 bg-blue-600 rounded w-3/4"></div>
                  <div className="flex space-x-1">
                    <Button size="sm" className="h-6 text-xs">PLAY</Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs">CUE</Button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded p-3">
                <h4 className="text-sm font-bold mb-2">DECK B</h4>
                <div className="space-y-2">
                  <div className="text-xs">Neural Trap - 140 BPM</div>
                  <div className="h-2 bg-red-600 rounded w-1/2"></div>
                  <div className="flex space-x-1">
                    <Button size="sm" className="h-6 text-xs">PLAY</Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs">CUE</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs mb-1">CROSSFADER</div>
              <div className="h-2 bg-gray-600 rounded relative">
                <div className="absolute top-0 left-1/2 w-4 h-2 bg-white rounded transform -translate-x-1/2"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>Live Listeners: <span className="text-green-400">1,247</span></div>
              <div>Earnings: <span className="text-yellow-400">${earnings.toFixed(2)}</span></div>
              <div>Energy: <span className="text-red-400">92%</span></div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span className="text-sm">Instagram</span>
                  <Badge variant="outline" className="text-xs">45.2K</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span className="text-sm">YouTube</span>
                  <Badge variant="outline" className="text-xs">23.8K</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs">Total Views: <span className="text-blue-400">128,497</span></div>
                <div className="text-xs">Engagement: <span className="text-green-400">94.2%</span></div>
                <div className="text-xs">Earnings Today: <span className="text-yellow-400">${earnings.toFixed(2)}</span></div>
              </div>
            </div>
            <div className="bg-gray-800 rounded p-3">
              <div className="text-sm font-bold mb-2">Pay-to-View Model</div>
              <div className="text-xs mb-2">Revolutionary system paying users to consume content</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>1 AC/min viewing</div>
                <div>5 AC per like</div>
                <div>10 AC per share</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-lg font-bold mb-2">Live Studio Demo</div>
            <div className="text-sm text-gray-400">Select a studio to see it in action</div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
      {/* Enhanced Header */}
      <header className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">Artist Tech</div>
              <div className="text-xs text-gray-400">Professional Creative Platform</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-400">Active Users:</span> 
              <span className="text-green-400 font-mono">{userCount.toLocaleString()}</span>
            </div>
            <Button asChild>
              <Link href="/ultimate-music-studio">Enter Studios</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Live Studio Preview */}
      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Professional Creative Studios
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the world's most advanced creative platform. 15 AI-powered studios, 
              real-time collaboration, and revolutionary monetization that pays creators 10x more.
            </p>
            
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">${earnings.toFixed(2)}</div>
                <div className="text-sm text-gray-400">Live Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{userCount.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">15</div>
                <div className="text-sm text-gray-400">AI Studios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">10x</div>
                <div className="text-sm text-gray-400">Better Payouts</div>
              </div>
            </div>
          </div>

          {/* Compact Studio Grid with Expandable Features */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-8">Professional Studio Interfaces</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {studioFeatures.map((studio) => (
                <Card 
                  key={studio.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 bg-gray-800 border-gray-600 hover:border-gray-500 group"
                  onClick={() => setSelectedStudio(selectedStudio === studio.id ? null : studio.id)}
                >
                  <CardContent className="p-4">
                    {/* Studio Interface Preview */}
                    <div className={`w-full h-20 rounded-lg bg-gradient-to-r ${studio.color} mb-3 flex items-center justify-center relative overflow-hidden`}>
                      <studio.icon className="w-8 h-8 text-white/80" />
                      {/* Mini interface preview */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-1 opacity-60">
                          <div className="w-2 h-1 bg-white/50 rounded"></div>
                          <div className="w-2 h-1 bg-white/70 rounded"></div>
                          <div className="w-2 h-1 bg-white/50 rounded"></div>
                          <div className="w-2 h-1 bg-white/30 rounded"></div>
                          <div className="w-2 h-1 bg-white/80 rounded"></div>
                          <div className="w-2 h-1 bg-white/40 rounded"></div>
                        </div>
                      </div>
                      {/* Click indicator */}
                      <div className="absolute top-1 right-1">
                        <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h4 className="font-bold text-sm mb-1">{studio.name}</h4>
                      {studio.stats && (
                        <div className="flex justify-between text-xs text-gray-400">
                          {Object.entries(studio.stats).map(([key, value]) => (
                            <span key={key}>{value}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Expandable Feature Panel */}
            {selectedStudio && (
              <Card className="bg-gray-800 border-gray-600 animate-in slide-in-from-top duration-300">
                <CardContent className="p-6">
                  {(() => {
                    const studio = studioFeatures.find(s => s.id === selectedStudio);
                    if (!studio) return null;
                    
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Studio Details */}
                        <div>
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${studio.color} flex items-center justify-center`}>
                              <studio.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold">{studio.name}</h3>
                              <p className="text-gray-400">{studio.description}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-lg">Professional Features</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {studio.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-700/50 rounded">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <Button asChild size="lg" className={`w-full bg-gradient-to-r ${studio.color}`}>
                              <Link href={studio.route}>
                                Open {studio.name}
                                <ArrowRight className="w-5 h-5 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                        
                        {/* Live Studio Preview */}
                        <div>
                          <h4 className="font-semibold text-lg mb-4">Live Interface Preview</h4>
                          <div className="bg-gray-900 rounded-lg p-4">
                            {selectedStudio === 'music' && renderStudioPreview()}
                            {selectedStudio === 'dj' && (
                              <div className="space-y-4">
                                {renderStudioPreview()}
                              </div>
                            )}
                            {selectedStudio === 'social' && renderStudioPreview()}
                            {!['music', 'dj', 'social'].includes(selectedStudio) && (
                              <div className="text-center py-8">
                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${studio.color} flex items-center justify-center mx-auto mb-4`}>
                                  <studio.icon className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-gray-400">Interactive preview coming soon</p>
                                <Button asChild className="mt-4">
                                  <Link href={studio.route}>Try Now</Link>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Quick Access Studio Grid */}
      <section className="py-12 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Quick Studio Access</h2>
            <p className="text-gray-300">Jump directly into any professional studio</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {studioFeatures.map((studio) => (
              <Card 
                key={studio.id}
                className="bg-gray-800 border-gray-600 hover:border-gray-500 transition-all duration-300 group cursor-pointer hover:scale-105"
                onMouseEnter={() => setHoveredStudio(studio.id)}
                onMouseLeave={() => setHoveredStudio(null)}
              >
                <CardContent className="p-4 text-center">
                  <Link href={studio.route} className="block">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${studio.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <studio.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-sm font-bold mb-1">{studio.name.replace('Ultimate ', '').replace('Professional ', '')}</h3>
                    {studio.stats && (
                      <div className="text-xs text-gray-400">
                        {Object.values(studio.stats)[0]}
                      </div>
                    )}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400 mb-4">Click any studio interface above to see detailed features</p>
          </div>
        </div>
      </section>

      {/* Revolutionary Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Artists Choose Us</h2>
            <p className="text-xl text-gray-300">The platform that's replacing TikTok, Spotify, and YouTube</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
              <CardContent className="p-8 text-center">
                <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">10x Better Payouts</h3>
                <p className="text-green-200 mb-4">$50+ per 1,000 plays vs Spotify's $3</p>
                <div className="space-y-2 text-sm">
                  <div>✓ Direct fan funding</div>
                  <div>✓ NFT marketplace</div>
                  <div>✓ Live performance booking</div>
                  <div>✓ Sync licensing opportunities</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
              <CardContent className="p-8 text-center">
                <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Real-time Collaboration</h3>
                <p className="text-blue-200 mb-4">Work together from anywhere, instantly</p>
                <div className="space-y-2 text-sm">
                  <div>✓ Live multi-user editing</div>
                  <div>✓ Automatic revenue splitting</div>
                  <div>✓ Version control & conflict resolution</div>
                  <div>✓ Cross-studio compatibility</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
              <CardContent className="p-8 text-center">
                <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">19 AI Engines</h3>
                <p className="text-purple-200 mb-4">Self-hosted AI that learns from you</p>
                <div className="space-y-2 text-sm">
                  <div>✓ AI composition & mastering</div>
                  <div>✓ Viral content prediction</div>
                  <div>✓ Automatic social media posting</div>
                  <div>✓ Smart collaboration matching</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Creative Career?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of artists already earning 10x more and creating better content
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
              <Link href="/ultimate-music-studio">
                Start Creating Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Link href="/unified-social-media-hub">
                Explore Social Hub
                <Globe className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-gray-300 mt-6">
            No credit card required • Professional tools • Start earning immediately
          </p>
        </div>
      </section>
    </div>
  );
}