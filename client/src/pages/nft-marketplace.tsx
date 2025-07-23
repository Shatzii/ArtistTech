import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Zap, TrendingUp, Eye, Heart, ShoppingCart, Star, Filter, Search,
  Ethereum, Bitcoin, DollarSign, Users, Crown, Sparkles
} from 'lucide-react';

export default function NFTMarketplace() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filters = [
    { id: 'all', name: 'All', count: 1247 },
    { id: 'music', name: 'Music', count: 456 },
    { id: 'art', name: 'Visual Art', count: 321 },
    { id: 'video', name: 'Video', count: 234 },
    { id: 'beats', name: 'Beats', count: 236 },
  ];

  const featuredNFTs = [
    {
      id: 1,
      title: 'Synthwave Dreams',
      artist: 'CyberBeats',
      price: 2.5,
      currency: 'ETH',
      image: 'gradient-1',
      likes: 234,
      views: 1567,
      category: 'music',
      verified: true
    },
    {
      id: 2,
      title: 'Digital Harmony',
      artist: 'AudioVision',
      price: 1.8,
      currency: 'ETH',
      image: 'gradient-2',
      likes: 156,
      views: 892,
      category: 'art',
      verified: true
    },
    {
      id: 3,
      title: 'Beat Collection #001',
      artist: 'RhythmMaster',
      price: 0.5,
      currency: 'ETH',
      image: 'gradient-3',
      likes: 89,
      views: 445,
      category: 'beats',
      verified: false
    },
    {
      id: 4,
      title: 'Live Concert Visuals',
      artist: 'VisualFlow',
      price: 3.2,
      currency: 'ETH',
      image: 'gradient-4',
      likes: 345,
      views: 2134,
      category: 'video',
      verified: true
    },
  ];

  const trendingArtists = [
    { name: 'CyberBeats', sales: 45, growth: '+23%' },
    { name: 'AudioVision', sales: 32, growth: '+18%' },
    { name: 'RhythmMaster', sales: 28, growth: '+15%' },
    { name: 'VisualFlow', sales: 25, growth: '+12%' },
  ];

  const getGradientClass = (image: string) => {
    const gradients = {
      'gradient-1': 'from-purple-500 to-pink-500',
      'gradient-2': 'from-blue-500 to-cyan-500',
      'gradient-3': 'from-green-500 to-emerald-500',
      'gradient-4': 'from-orange-500 to-red-500',
    };
    return gradients[image as keyof typeof gradients] || 'from-gray-500 to-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/40 to-purple-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/artist-tech-logo.jpeg" 
              alt="Artist Tech" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">NFT Marketplace</h1>
              <p className="text-white/60">Discover and trade unique digital music assets</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
              Create NFT
            </button>
            <Link href="/admin">
              <button className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Volume</p>
                <p className="text-xl font-bold">1,234.5 ETH</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Active NFTs</p>
                <p className="text-xl font-bold">1,247</p>
              </div>
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Artists</p>
                <p className="text-xl font-bold">456</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-pink-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Floor Price</p>
                <p className="text-xl font-bold">0.1 ETH</p>
              </div>
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search NFTs, artists, collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-white/60" />
                  <div className="flex space-x-2">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeFilter === filter.id
                            ? 'bg-purple-500/30 border border-purple-400/50 text-purple-300'
                            : 'bg-white/10 border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {filter.name} ({filter.count})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured NFTs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNFTs.map((nft) => (
                <div key={nft.id} className="bg-black/30 rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-colors group">
                  {/* NFT Image */}
                  <div className={`aspect-square bg-gradient-to-br ${getGradientClass(nft.image)} flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Zap className="w-8 h-8" />
                      </div>
                      <p className="font-bold">{nft.title}</p>
                    </div>
                  </div>

                  {/* NFT Details */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{nft.title}</h3>
                      {nft.verified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-white/60 text-sm mb-3">by {nft.artist}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-white/60">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{nft.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{nft.likes}</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        nft.category === 'music' ? 'bg-purple-500/20 text-purple-400' :
                        nft.category === 'art' ? 'bg-pink-500/20 text-pink-400' :
                        nft.category === 'video' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {nft.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-xs">Current Price</p>
                        <p className="text-xl font-bold">{nft.price} {nft.currency}</p>
                      </div>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center space-x-2">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Artists */}
            <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Trending Artists
              </h3>
              <div className="space-y-3">
                {trendingArtists.map((artist, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{artist.name.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm">{artist.name}</p>
                        <p className="text-xs text-white/60">{artist.sales} sales</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-xs font-bold">{artist.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
                  Create Collection
                </button>
                <button className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-400 py-3 px-4 rounded-lg hover:bg-blue-500/30 transition-colors">
                  My NFTs
                </button>
                <button className="w-full bg-green-500/20 border border-green-500/30 text-green-400 py-3 px-4 rounded-lg hover:bg-green-500/30 transition-colors">
                  Wallet
                </button>
                <button className="w-full bg-orange-500/20 border border-orange-500/30 text-orange-400 py-3 px-4 rounded-lg hover:bg-orange-500/30 transition-colors">
                  Analytics
                </button>
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="bg-black/30 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold mb-4">Blockchain Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Network</span>
                  <span className="text-sm font-bold">Ethereum</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Gas Price</span>
                  <span className="text-sm font-bold">25 Gwei</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">ETH Price</span>
                  <span className="text-sm font-bold text-green-400">$2,345</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-bold text-green-400">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}