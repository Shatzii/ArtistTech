import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
import { 
  Crown, 
  Star, 
  Zap, 
  Building, 
  Check, 
  Music, 
  Video, 
  Headphones,
  Users,
  Coins,
  BarChart3,
  Shield
} from "lucide-react";
// import { apiRequest } from "@/lib/queryClient";

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  features: string[];
  limits: {
    studios: number | "unlimited";
    storage: string;
    aiGenerations: number | "unlimited";
    collaborators: number | "unlimited";
    exports: string;
  };
  popular?: boolean;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: "creator",
    name: "Creator",
    price: 19,
    yearlyPrice: 190,
    description: "Perfect for individual artists and content creators",
    icon: Star,
    color: "from-blue-500 to-blue-600",
    features: [
      "5 Core Studios (Music, Video, Social, AI, Voice)",
      "100 AI-generated content pieces/month",
      "Basic analytics dashboard",
      "Community support",
      "Standard export quality (1080p, 44kHz)"
    ],
    limits: {
      studios: 5,
      storage: "10GB",
      aiGenerations: 100,
      collaborators: 1,
      exports: "1080p/44kHz"
    }
  },
  {
    id: "producer",
    name: "Producer",
    price: 49,
    yearlyPrice: 490,
    description: "For professional producers and advanced creators",
    icon: Crown,
    color: "from-purple-500 to-purple-600",
    popular: true,
    features: [
      "ALL 15 Studios including DJ, VR, Podcast, Crypto",
      "Unlimited AI content generation",
      "Professional hardware integration",
      "Advanced analytics with audience insights",
      "Collaboration tools for up to 5 users",
      "Professional export quality (4K, 96kHz/24-bit)",
      "Priority support + live chat",
      "NFT marketplace access"
    ],
    limits: {
      studios: 15,
      storage: "100GB",
      aiGenerations: "unlimited",
      collaborators: 5,
      exports: "4K/96kHz"
    }
  },
  {
    id: "superstar",
    name: "Superstar",
    price: 99,
    yearlyPrice: 990,
    description: "For established artists and viral creators",
    icon: Zap,
    color: "from-yellow-500 to-yellow-600",
    features: [
      "All Producer features",
      "Advanced viral prediction AI",
      "Professional PR and marketing automation",
      "Direct industry connections (A&R, labels)",
      "Priority placement on platform",
      "Advanced monetization tools",
      "Live streaming up to 10,000 viewers",
      "Professional tour booking assistance"
    ],
    limits: {
      studios: "unlimited",
      storage: "500GB",
      aiGenerations: "unlimited",
      collaborators: 20,
      exports: "8K/192kHz"
    }
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    yearlyPrice: 1990,
    description: "For record labels and production companies",
    icon: Building,
    color: "from-red-500 to-red-600",
    features: [
      "White-label platform with custom branding",
      "Unlimited users and storage",
      "Advanced enterprise security",
      "Custom AI model training",
      "Dedicated account manager",
      "API access for integrations",
      "Advanced business analytics",
      "Revenue sharing tools",
      "Legal compliance suite"
    ],
    limits: {
      studios: "unlimited",
      storage: "Unlimited",
      aiGenerations: "unlimited",
      collaborators: "unlimited",
      exports: "Any format"
    }
  }
];

const oneTimePurchases = [
  {
    id: "studio-lifetime",
    name: "Complete Studio Bundle",
    price: 799,
    originalPrice: 1299,
    description: "Lifetime access to all 15 studios",
    icon: Music,
    features: ["Lifetime access", "All future studio updates", "No monthly fees"]
  },
  {
    id: "hardware-pack",
    name: "Complete Hardware Pack",
    price: 99,
    originalPrice: 147,
    description: "All professional DJ controller integrations",
    icon: Headphones,
    features: ["Pioneer CDJ", "Native Instruments", "Denon Prime", "Allen & Heath"]
  },
  {
    id: "ai-suite",
    name: "Complete AI Suite",
    price: 399,
    originalPrice: 597,
    description: "Lifetime access to all AI models",
    icon: Zap,
    features: ["Voice Synthesis", "Video AI", "Music Generation", "Content Creation"]
  }
];

export default function SubscriptionManager() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>("producer");

  const { data: currentSubscription } = useQuery({
    queryKey: ["/api/subscription/current"],
  });

  const upgradeMutation = useMutation({
    mutationFn: async (data: { tierId: string; isYearly: boolean }) => {
      const response = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      // Handle successful upgrade
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (data: { itemId: string }) => {
      const response = await fetch("/api/purchase/one-time", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      // Handle successful purchase
    },
  });

  const handleUpgrade = (tierId: string) => {
    setSelectedTier(tierId);
    upgradeMutation.mutate({ tierId, isYearly });
  };

  const handlePurchase = (itemId: string) => {
    purchaseMutation.mutate({ itemId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your Creative Journey
          </h1>
          <p className="text-xl text-blue-200 mb-6">
            Unlock your full potential with our comprehensive creative platform
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg ${!isYearly ? 'text-white' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${isYearly ? 'text-white' : 'text-slate-400'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-green-500 text-white">Save 16%</Badge>
            )}
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {subscriptionTiers.map((tier) => {
            const Icon = tier.icon;
            const price = isYearly ? tier.yearlyPrice : tier.price;
            const savings = isYearly ? (tier.price * 12 - tier.yearlyPrice) : 0;
            
            return (
              <Card 
                key={tier.id}
                className={`relative bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 ${
                  tier.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tier.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-white">
                      ${price}
                      <span className="text-lg text-slate-400">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    {isYearly && savings > 0 && (
                      <div className="text-green-400 text-sm">
                        Save ${savings}/year
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-slate-300">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Key Limits */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Studios:</span>
                      <span className="text-white">{tier.limits.studios}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Storage:</span>
                      <span className="text-white">{tier.limits.storage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">AI Generations:</span>
                      <span className="text-white">{tier.limits.aiGenerations}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-700 my-4" />
                  
                  {/* Features */}
                  <div className="space-y-2">
                    {tier.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                    {tier.features.length > 4 && (
                      <div className="text-sm text-blue-400">
                        +{tier.features.length - 4} more features
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${tier.color} hover:opacity-90`}
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={upgradeMutation.isPending}
                  >
                    {(currentSubscription as any)?.tier === tier.id ? 'Current Plan' : 'Upgrade Now'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* One-Time Purchases */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            One-Time Purchases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {oneTimePurchases.map((item) => {
              const Icon = item.icon;
              const savings = item.originalPrice - item.price;
              const savingsPercent = Math.round((savings / item.originalPrice) * 100);
              
              return (
                <Card key={item.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <Icon className="w-12 h-12 text-yellow-400 mb-4" />
                    <CardTitle className="text-white">{item.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-white">${item.price}</span>
                        <span className="text-lg text-slate-400 line-through">${item.originalPrice}</span>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        Save {savingsPercent}%
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-300">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {item.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => handlePurchase(item.id)}
                      disabled={purchaseMutation.isPending}
                    >
                      Purchase Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Transaction Fees Information */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              Additional Revenue Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Coins className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Pay-to-View Earnings
                </h3>
                <p className="text-slate-300 text-sm">
                  Earn 80% of viewer payments (1-10 ArtistCoins per view)
                </p>
              </div>
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Marketplace Sales
                </h3>
                <p className="text-slate-300 text-sm">
                  Sell beats, samples, and NFTs with 15% platform fee
                </p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Collaboration Services
                </h3>
                <p className="text-slate-300 text-sm">
                  Offer professional services with 20% platform fee
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}