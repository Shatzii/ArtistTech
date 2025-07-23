import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Pause, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Zap, 
  Coins,
  Globe,
  MessageCircle,
  Heart,
  Share as Share2,
  BarChart3,
  Search,
  Bell,
  HelpCircle,
  Home,
  X,
  LogOut,
  User,
  Settings,
  Send,
  Upload,
  Calendar,
  Hash,
  Wifi,
  WifiOff,
  ThumbsUp,
  Repeat,
  Bookmark,
  RefreshCw,
  Download,
  Plus,
  Sparkles
} from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube, SiX, SiSpotify } from "react-icons/si";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SocialPost {
  id: string;
  platform: string;
  icon: any;
  user: string;
  content: string;
  engagement: {
    likes: string;
    shares: string;
    comments: string;
  };
  timestamp: Date;
  reward: number;
  mediaType: string;
  color: string;
}

interface PlatformConnection {
  platform: string;
  connected: boolean;
  followerCount: number;
  username: string;
}

export default function SocialMediaHub() {
  // Temporarily simplify to test and find the error
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading Social Media Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Social Media Hub
          </h1>
          <p className="text-gray-300 mb-8">Revolutionary "Pay-to-View" Platform</p>
          
          <Card className="bg-gray-800/50 border-gray-700 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <SiTiktok className="h-8 w-8 text-pink-500" />
                <SiInstagram className="h-8 w-8 text-purple-500" />
                <SiYoutube className="h-8 w-8 text-red-500" />
                <SiX className="h-8 w-8 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                🎯 FIRST Platform to Pay Users for Viewing Content!
              </h2>
              <p className="text-gray-300 mb-6">
                Unified social media experience with real cryptocurrency rewards.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <div className="text-green-400 font-bold">$2,847.32 AC</div>
                  <div className="text-gray-400">Total Earnings</div>
                </div>
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <div className="text-blue-400 font-bold">5 Platforms</div>
                  <div className="text-gray-400">Connected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}