import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Music, 
  Video, 
  Headphones, 
  Share2, 
  Bot, 
  Mic, 
  Gamepad2, 
  Coins, 
  Users, 
  BarChart3, 
  Palette, 
  Piano, 
  Sliders, 
  ShoppingCart,
  Building,
  Crown,
  Zap,
  Star
} from "lucide-react";

interface Studio {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: any;
  category: "create" | "perform" | "collaborate" | "monetize";
  tier: "free" | "creator" | "producer" | "superstar" | "enterprise";
  price?: string;
  features: string[];
}

const studios: Studio[] = [
  {
    id: "music",
    name: "Music Studio",
    description: "Professional music production with AI-powered tools",
    route: "/ultimate-music-studio",
    icon: Music,
    category: "create",
    tier: "creator",
    features: ["16-Pad MPC", "Step Sequencer", "Professional Mixer", "Voice Commands"]
  },
  {
    id: "dj",
    name: "DJ Suite",
    description: "Professional DJ mixing with live voting and analytics",
    route: "/unified-dj-studio",
    icon: Headphones,
    category: "perform",
    tier: "producer",
    price: "$49/month",
    features: ["Harmonic Mixing", "Live Voting", "Crowd Analytics", "Hardware Integration"]
  },
  {
    id: "video",
    name: "Video Studio",
    description: "Advanced video editing with AI enhancement",
    route: "/video-studio",
    icon: Video,
    category: "create",
    tier: "creator",
    features: ["4K Editing", "AI Enhancement", "Multi-track Timeline", "Professional Effects"]
  },
  {
    id: "social",
    name: "Social Media Hub",
    description: "Revolutionary pay-to-view content management",
    route: "/unified-social-media-hub",
    icon: Share2,
    category: "monetize",
    tier: "creator",
    features: ["Multi-platform", "AI Agents", "Pay-to-View", "Analytics"]
  },
  {
    id: "ai-content",
    name: "AI Content Creator",
    description: "Generate platform-optimized content with AI",
    route: "/ai-content-creator",
    icon: Bot,
    category: "create",
    tier: "creator",
    features: ["Platform Optimization", "Engagement Prediction", "Auto-generation", "Multi-format"]
  },
  {
    id: "podcast",
    name: "Podcast Studio",
    description: "Professional podcast recording and distribution",
    route: "/podcast-studio",
    icon: Mic,
    category: "create",
    tier: "producer",
    price: "$49/month",
    features: ["Live Streaming", "AI Transcription", "Multi-platform Distribution"]
  },
  {
    id: "vr",
    name: "VR Studio",
    description: "Immersive virtual reality creative environment",
    route: "/vr-studio",
    icon: Gamepad2,
    category: "collaborate",
    tier: "producer",
    price: "$49/month",
    features: ["Spatial Audio", "Hand Tracking", "Multi-user Collaboration"]
  },
  {
    id: "crypto",
    name: "ArtistCoin Studio",
    description: "Cryptocurrency rewards and viral challenges",
    route: "/crypto-studio",
    icon: Coins,
    category: "monetize",
    tier: "creator",
    features: ["Viral Challenges", "Crypto Rewards", "Staking", "NFT Integration"]
  },
  {
    id: "collaborate",
    name: "Collaborative Studio",
    description: "Real-time multi-user creative collaboration",
    route: "/collaborative-studio",
    icon: Users,
    category: "collaborate",
    tier: "producer",
    price: "$49/month",
    features: ["Real-time Editing", "Version Control", "Live Chat", "Project Sharing"]
  },
  {
    id: "analytics",
    name: "Analytics Dashboard",
    description: "Comprehensive performance and revenue analytics",
    route: "/analytics-dashboard",
    icon: BarChart3,
    category: "monetize",
    tier: "producer",
    price: "$49/month",
    features: ["Revenue Tracking", "Audience Insights", "Growth Analytics", "Predictive AI"]
  },
  {
    id: "visual",
    name: "Visual Studio",
    description: "AI-powered visual arts and design creation",
    route: "/visual-studio",
    icon: Palette,
    category: "create",
    tier: "creator",
    features: ["AI Enhancement", "Style Transfer", "Digital Art Tools", "NFT Creation"]
  },
  {
    id: "instruments",
    name: "Professional Instruments",
    description: "Virtual instruments and professional sound libraries",
    route: "/professional-instruments-studio",
    icon: Piano,
    category: "create",
    tier: "producer",
    price: "$49/month",
    features: ["Virtual Instruments", "Sound Libraries", "MIDI Control", "Real-time Processing"]
  },
  {
    id: "midi",
    name: "MIDI Controller Studio",
    description: "Hardware integration and MIDI mapping",
    route: "/midi-controller-studio",
    icon: Sliders,
    category: "perform",
    tier: "producer",
    price: "$49/month",
    features: ["Hardware Integration", "Custom Mapping", "LED Feedback", "Multi-device Support"]
  },
  {
    id: "nft",
    name: "NFT Marketplace",
    description: "Create and trade music NFTs with blockchain integration",
    route: "/nft-marketplace-studio",
    icon: ShoppingCart,
    category: "monetize",
    tier: "superstar",
    price: "$99/month",
    features: ["NFT Minting", "Marketplace Trading", "Royalty Management", "Blockchain Integration"]
  },
  {
    id: "enterprise",
    name: "Enterprise Management",
    description: "White-label platform for music industry professionals",
    route: "/enterprise-management-studio",
    icon: Building,
    category: "monetize",
    tier: "enterprise",
    price: "$199/month",
    features: ["White-label", "Client Management", "Custom Branding", "Enterprise Security"]
  }
];

const categories = {
  create: { name: "Create", icon: Music, color: "bg-blue-500" },
  perform: { name: "Perform", icon: Headphones, color: "bg-purple-500" },
  collaborate: { name: "Collaborate", icon: Users, color: "bg-green-500" },
  monetize: { name: "Monetize", icon: Coins, color: "bg-yellow-500" }
};

const tiers = {
  free: { name: "Free", icon: Star, color: "text-gray-500", price: "$0" },
  creator: { name: "Creator", icon: Star, color: "text-blue-500", price: "$19/month" },
  producer: { name: "Producer", icon: Crown, color: "text-purple-500", price: "$49/month" },
  superstar: { name: "Superstar", icon: Zap, color: "text-yellow-500", price: "$99/month" },
  enterprise: { name: "Enterprise", icon: Building, color: "text-red-500", price: "$199/month" }
};

export default function MainNavigationHub() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredStudios = selectedCategory 
    ? studios.filter(studio => studio.category === selectedCategory)
    : studios;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Artist Tech Studios
          </h1>
          <p className="text-xl text-blue-200 mb-6">
            World's First Platform That Pays You to View AND Create Content
          </p>
          
          {/* Category Filters */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="text-white"
            >
              All Studios
            </Button>
            {Object.entries(categories).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  onClick={() => setSelectedCategory(key)}
                  className="text-white"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Pricing Tiers Display */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(tiers).map(([key, tier]) => {
            const Icon = tier.icon;
            return (
              <Card key={key} className="bg-slate-800/50 border-slate-700">
                <CardHeader className="text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${tier.color}`} />
                  <CardTitle className="text-white">{tier.name}</CardTitle>
                  <CardDescription className={tier.color}>
                    {tier.price}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Studios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudios.map((studio) => {
            const Icon = studio.icon;
            const category = categories[studio.category];
            const tier = tiers[studio.tier];
            
            return (
              <Card key={studio.id} className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-8 h-8 text-blue-400" />
                    <div className="flex gap-2">
                      <Badge className={category.color}>{category.name}</Badge>
                      <Badge className={tier.color}>{tier.name}</Badge>
                    </div>
                  </div>
                  <CardTitle className="text-white">{studio.name}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {studio.description}
                  </CardDescription>
                  {studio.price && (
                    <div className="text-yellow-400 font-semibold">
                      {studio.price}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {studio.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Link href={studio.route}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Launch Studio
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Revenue Information */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-yellow-900/30 to-green-900/30 border-yellow-500/50">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-2xl">
                Revolutionary Pay-to-View Model
              </CardTitle>
              <CardDescription className="text-green-300 text-lg">
                Earn 10x More Than Spotify: $50+ per 1K plays vs Spotify's $3
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400">$50+</div>
                  <div className="text-green-200">per 1K plays</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">15</div>
                  <div className="text-blue-200">AI-powered studios</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">24/7</div>
                  <div className="text-purple-200">earning potential</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}