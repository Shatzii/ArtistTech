import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Crown, Zap, Star, TrendingUp, Eye, Heart, Share,
  Coins, ShoppingCart, Upload, Image, Music, Video,
  User, Clock, DollarSign, Sparkles, Filter, Award
} from "lucide-react";

export default function NFTMarketplaceStudio() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const queryClient = useQueryClient();

  // Fetch NFT data
  const { data: nftData } = useQuery({
    queryKey: ["/api/nft/marketplace"],
    enabled: true
  });

  const { data: userNFTs } = useQuery({
    queryKey: ["/api/nft/user-collection"],
    enabled: true
  });

  const mockNFTs = [
    {
      id: 1,
      title: "Midnight Symphony #001",
      artist: "BeatMaster Pro",
      price: 2.5,
      currency: "ETH",
      image: "/placeholder-nft.jpg",
      category: "Music",
      likes: 342,
      views: 1547,
      isAuction: false,
      rarity: "Rare",
      blockchain: "Ethereum"
    },
    {
      id: 2,
      title: "Digital Dreams Collection",
      artist: "VisualArt Creator",
      price: 1.8,
      currency: "ETH",
      image: "/placeholder-nft.jpg",
      category: "Visual Art",
      likes: 189,
      views: 892,
      isAuction: true,
      rarity: "Epic",
      blockchain: "Polygon"
    },
    {
      id: 3,
      title: "Studio Session Live Recording",
      artist: "Producer X",
      price: 0.75,
      currency: "ETH",
      image: "/placeholder-nft.jpg",
      category: "Audio",
      likes: 256,
      views: 1234,
      isAuction: false,
      rarity: "Common",
      blockchain: "Ethereum"
    }
  ];

  const mockUserCollection = [
    {
      id: 1,
      title: "My Beat #001",
      price: 1.2,
      currency: "ETH",
      status: "Listed",
      earnings: 3.6,
      views: 2341
    },
    {
      id: 2,
      title: "Remix Bundle",
      price: 0.8,
      currency: "ETH",
      status: "Sold",
      earnings: 2.4,
      views: 1876
    }
  ];

  const categories = [
    { id: "all", name: "All Categories", count: 1250 },
    { id: "music", name: "Music", count: 547 },
    { id: "visual", name: "Visual Art", count: 324 },
    { id: "audio", name: "Audio", count: 189 },
    { id: "video", name: "Video", count: 156 },
    { id: "collectibles", name: "Collectibles", count: 34 }
  ];

  const topArtists = [
    { name: "BeatMaster Pro", sales: 45.7, volume: "234 ETH" },
    { name: "VisualArt Creator", sales: 32.1, volume: "187 ETH" },
    { name: "Producer X", sales: 28.9, volume: "156 ETH" }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "border-gray-500 text-gray-400";
      case "Rare": return "border-blue-500 text-blue-400";
      case "Epic": return "border-purple-500 text-purple-400";
      case "Legendary": return "border-yellow-500 text-yellow-400";
      default: return "border-gray-500 text-gray-400";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Music": return <Music className="w-4 h-4" />;
      case "Visual Art": return <Image className="w-4 h-4" />;
      case "Audio": return <Music className="w-4 h-4" />;
      case "Video": return <Video className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-pink-900 text-white">
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
              <h1 className="text-3xl font-bold">NFT Marketplace Studio</h1>
              <p className="text-white/60">Create, buy, and sell digital art and music NFTs</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              Market Active
            </Badge>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Upload className="w-4 h-4 mr-2" />
              Create NFT
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-purple-500/30">
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-purple-600">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-purple-600">
              <Upload className="w-4 h-4 mr-2" />
              Create NFT
            </TabsTrigger>
            <TabsTrigger value="collection" className="data-[state=active]:bg-purple-600">
              <User className="w-4 h-4 mr-2" />
              My Collection
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Search</label>
                    <Input
                      placeholder="Search NFTs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-black/50 border-purple-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Categories</label>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category.id} className="flex items-center justify-between">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="category"
                              checked={selectedCategory === category.id}
                              onChange={() => setSelectedCategory(category.id)}
                              className="mr-2 accent-purple-500" 
                            />
                            <span className="text-sm">{category.name}</span>
                          </label>
                          <span className="text-xs text-white/60">{category.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price Range (ETH)</label>
                    <div className="flex space-x-2">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        className="bg-black/50 border-purple-500/30" 
                      />
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        className="bg-black/50 border-purple-500/30" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Blockchain</label>
                    <select className="w-full bg-black/50 border border-purple-500/30 rounded px-3 py-2">
                      <option>All Chains</option>
                      <option>Ethereum</option>
                      <option>Polygon</option>
                      <option>Solana</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* NFT Grid */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockNFTs.map(nft => (
                  <Card key={nft.id} className="bg-black/40 border-purple-500/30 hover:border-purple-400/50 transition-colors overflow-hidden">
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        {getCategoryIcon(nft.category)}
                        <span className="ml-2 text-sm">{nft.category} NFT</span>
                      </div>
                      
                      {nft.isAuction && (
                        <Badge className="absolute top-2 right-2 bg-red-600">
                          <Clock className="w-3 h-3 mr-1" />
                          Auction
                        </Badge>
                      )}
                      
                      <Badge 
                        variant="outline" 
                        className={`absolute top-2 left-2 ${getRarityColor(nft.rarity)}`}
                      >
                        {nft.rarity}
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-1">{nft.title}</h3>
                      <p className="text-sm text-white/60 mb-2">by {nft.artist}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {nft.views}
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {nft.likes}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {nft.blockchain}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold flex items-center">
                            <Coins className="w-4 h-4 mr-1 text-yellow-400" />
                            {nft.price} {nft.currency}
                          </p>
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          {nft.isAuction ? "Bid" : "Buy"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Create NFT Tab */}
          <TabsContent value="create">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Create New NFT</CardTitle>
                <CardDescription>Upload and mint your digital artwork or music</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload File</label>
                      <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                        <p className="text-white/60">Drag and drop your file here, or click to browse</p>
                        <p className="text-xs text-white/40 mt-2">Supports: JPG, PNG, GIF, MP3, MP4, WAV</p>
                        <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                          Choose File
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Preview</label>
                      <div className="aspect-square bg-black/30 rounded-lg flex items-center justify-center">
                        <p className="text-white/40">File preview will appear here</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <Input 
                        placeholder="Enter NFT name"
                        className="bg-black/50 border-purple-500/30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea 
                        placeholder="Describe your NFT..."
                        rows={4}
                        className="w-full bg-black/50 border border-purple-500/30 rounded px-3 py-2 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select className="w-full bg-black/50 border border-purple-500/30 rounded px-3 py-2">
                          <option>Music</option>
                          <option>Visual Art</option>
                          <option>Audio</option>
                          <option>Video</option>
                          <option>Collectibles</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Blockchain</label>
                        <select className="w-full bg-black/50 border border-purple-500/30 rounded px-3 py-2">
                          <option>Ethereum</option>
                          <option>Polygon</option>
                          <option>Solana</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Price (ETH)</label>
                        <Input 
                          type="number"
                          placeholder="0.00"
                          className="bg-black/50 border-purple-500/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Royalty (%)</label>
                        <Input 
                          type="number"
                          placeholder="10"
                          className="bg-black/50 border-purple-500/30"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="accent-purple-500" />
                      <label className="text-sm">Enable auction (optional)</label>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Mint NFT
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Collection Tab */}
          <TabsContent value="collection">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">My NFTs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockUserCollection.map(nft => (
                        <div key={nft.id} className="bg-black/30 p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                              <Music className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">{nft.title}</h4>
                              <p className="text-sm text-white/60">{nft.price} {nft.currency}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <Badge 
                              variant="outline" 
                              className={`mb-2 ${
                                nft.status === 'Listed' 
                                  ? 'border-green-500 text-green-400' 
                                  : 'border-blue-500 text-blue-400'
                              }`}
                            >
                              {nft.status}
                            </Badge>
                            <p className="text-sm text-white/60">
                              Earned: {nft.earnings} ETH
                            </p>
                            <p className="text-xs text-white/40">
                              {nft.views} views
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Collection Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-black/30 p-3 rounded text-center">
                    <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold">6.0 ETH</p>
                    <p className="text-sm text-white/60">Total Earnings</p>
                  </div>

                  <div className="bg-black/30 p-3 rounded text-center">
                    <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-white/60">NFTs Created</p>
                  </div>

                  <div className="bg-black/30 p-3 rounded text-center">
                    <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold">4,217</p>
                    <p className="text-sm text-white/60">Total Views</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Market Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-black/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Top Performing Categories</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Music NFTs</span>
                          <span className="text-sm text-green-400">+23.4%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Visual Art</span>
                          <span className="text-sm text-green-400">+18.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Audio</span>
                          <span className="text-sm text-green-400">+15.7%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Average Prices</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Music</span>
                          <span className="text-sm">1.2 ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Visual Art</span>
                          <span className="text-sm">2.1 ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Audio</span>
                          <span className="text-sm">0.8 ETH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Top Artists</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topArtists.map((artist, index) => (
                      <div key={artist.name} className="bg-black/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                              {index + 1}
                            </div>
                            <span className="font-medium">{artist.name}</span>
                          </div>
                          <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                            <Crown className="w-3 h-3 mr-1" />
                            Top
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-white/60">Sales</p>
                            <p className="font-medium">${artist.sales}K</p>
                          </div>
                          <div>
                            <p className="text-white/60">Volume</p>
                            <p className="font-medium">{artist.volume}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}