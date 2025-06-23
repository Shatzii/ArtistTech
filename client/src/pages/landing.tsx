import { useState } from 'react';
import { Link } from 'wouter';

export default function Landing() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'ai-production',
      title: 'AI Music Production',
      description: 'Neural audio synthesis, voice cloning, and intelligent composition',
      icon: '🎵',
      premium: true
    },
    {
      id: 'dj-tools',
      title: 'Professional DJ Suite',
      description: 'Real-time stem separation, harmonic mixing, and crowd analytics',
      icon: '🎧',
      premium: true
    },
    {
      id: 'video-studio',
      title: 'Video Creation Studio',
      description: 'AI-powered editing exceeding Premiere Pro standards',
      icon: '🎬',
      premium: true
    },
    {
      id: 'visual-arts',
      title: 'Visual Arts Suite',
      description: 'Image creation surpassing Photoshop and Canva capabilities',
      icon: '🎨',
      premium: true
    },
    {
      id: 'collaborative',
      title: 'Real-time Collaboration',
      description: 'Multi-user editing with voice chat and version control',
      icon: '🤝',
      new: true
    },
    {
      id: 'dj-voting',
      title: 'Interactive DJ Voting',
      description: 'Club listeners vote and pay for song requests in real-time',
      icon: '🗳️',
      new: true
    },
    {
      id: 'nft-marketplace',
      title: 'NFT Marketplace',
      description: 'Blockchain integration with automated royalty distribution',
      icon: '💎',
      premium: true
    },
    {
      id: 'business-tools',
      title: 'AI Business Intelligence',
      description: 'Automated marketing, analytics, and revenue optimization',
      icon: '📊',
      premium: true
    }
  ];

  const testimonials = [
    {
      name: 'Marcus Chen',
      role: 'Music Producer',
      content: 'This platform completely transformed my workflow. The AI composition tools are incredible.',
      rating: 5
    },
    {
      name: 'DJ Aurora',
      role: 'Club DJ',
      content: 'The real-time stem separation and crowd voting system made my sets legendary.',
      rating: 5
    },
    {
      name: 'Sarah Mitchell',
      role: 'Video Creator',
      content: 'Better than Premiere Pro! The AI editing suggestions save me hours every day.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/artist-tech-logo.jpeg" 
                alt="Artist Tech" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="text-xl font-bold">Artist Tech</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
              <a href="#testimonials" className="hover:text-purple-400 transition-colors">Reviews</a>
              <Link href="/login">
                <button className="border border-white/30 px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all">
                  User Login
                </button>
              </Link>
              <Link href="/admin">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                  Admin
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Artist Tech
            <br />
            Creative Studio
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            15 cutting-edge AI engines powering the world's most advanced multimedia creation platform. 
            Professional music production, DJ tools, video editing, and visual arts - all powered by Artist Tech.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/voting">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg text-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105">
                Try Interactive Demo
              </button>
            </Link>
            <button className="border border-white/30 px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/10 transition-all">
              Watch Overview
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">15</div>
              <div className="text-white/60">AI Engines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">115/115</div>
              <div className="text-white/60">Security Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">$3.2M</div>
              <div className="text-white/60">Year 1 Target</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Revolutionary Features</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Professional-grade tools powered by self-hosted AI that surpass industry standards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`
                  relative p-6 rounded-lg border border-white/10 transition-all duration-300 cursor-pointer
                  ${hoveredFeature === feature.id 
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 transform scale-105' 
                    : 'bg-black/20 hover:bg-white/5'}
                `}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {feature.premium && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                    PRO
                  </div>
                )}
                {feature.new && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    NEW
                  </div>
                )}
                
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-6 bg-black/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Experience the Future Now</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Link href="/voting">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all cursor-pointer group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🗳️</div>
                <h3 className="text-xl font-bold mb-2">Interactive DJ Voting</h3>
                <p className="text-white/70 mb-4">Try the live voting system where listeners pay for song requests</p>
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg inline-block">
                  Try Demo →
                </div>
              </div>
            </Link>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-lg border border-purple-500/30">
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2">AI Music Production</h3>
              <p className="text-white/70 mb-4">Neural synthesis and voice cloning capabilities</p>
              <div className="bg-purple-500 text-white px-4 py-2 rounded-lg inline-block opacity-50">
                Coming Soon
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 p-8 rounded-lg border border-green-500/30">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-2">Video Studio</h3>
              <p className="text-white/70 mb-4">AI editing that exceeds professional standards</p>
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg inline-block opacity-50">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Creators Say</h2>
            <p className="text-xl text-white/70">Join thousands of professionals transforming their creative workflow</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-black/30 p-6 rounded-lg border border-white/10">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-white/80 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-black/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/5 p-8 rounded-lg border border-white/10">
              <h3 className="text-2xl font-bold mb-4">Starter</h3>
              <div className="text-4xl font-bold mb-4">$49<span className="text-lg text-white/60">/mo</span></div>
              <ul className="space-y-2 mb-8 text-left">
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Basic AI Tools</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> DJ Voting System</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> 5GB Storage</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Community Support</li>
              </ul>
              <button className="w-full bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-lg border-2 border-purple-500/50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-4">Professional</h3>
              <div className="text-4xl font-bold mb-4">$199<span className="text-lg text-white/60">/mo</span></div>
              <ul className="space-y-2 mb-8 text-left">
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> All AI Engines</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Real-time Collaboration</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> 100GB Storage</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Priority Support</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Commercial License</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Start Free Trial
              </button>
            </div>

            <div className="bg-white/5 p-8 rounded-lg border border-white/10">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <div className="text-4xl font-bold mb-4">Custom</div>
              <ul className="space-y-2 mb-8 text-left">
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> White-label Solution</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Unlimited Everything</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Custom Integrations</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> 24/7 Support</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Revenue Sharing</li>
              </ul>
              <button className="w-full bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Creative Workflow?</h2>
          <p className="text-xl text-white/70 mb-8">
            Join the future of multimedia creation with our revolutionary AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/voting">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg text-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105">
                Try Interactive Demo
              </button>
            </Link>
            <button className="border border-white/30 px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/10 transition-all">
              Schedule Demo Call
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/assets/artist-tech-logo.jpeg" 
                  alt="Artist Tech" 
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="text-xl font-bold">Artist Tech</span>
              </div>
              <p className="text-white/60">The world's most advanced AI-powered multimedia creation platform</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <div className="space-y-2 text-white/60">
                <div>Music Production</div>
                <div>DJ Tools</div>
                <div>Video Studio</div>
                <div>Visual Arts</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <div className="space-y-2 text-white/60">
                <div>AI Engines</div>
                <div>Real-time Collaboration</div>
                <div>Interactive Voting</div>
                <div>NFT Integration</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <div className="space-y-2 text-white/60">
                <div>About Us</div>
                <div>Contact</div>
                <div>Privacy</div>
                <div>Terms</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2025 ProStudio. All rights reserved. Built for the next generation of creators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}