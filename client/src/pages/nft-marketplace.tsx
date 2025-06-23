import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Heart, 
  Share2, 
  TrendingUp, 
  Eye, 
  ShoppingCart,
  Wallet,
  Upload,
  Star,
  Users,
  Calendar,
  DollarSign
} from "lucide-react";

interface NFTItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  currency: string;
  image: string;
  likes: number;
  views: number;
  category: string;
  tags: string[];
  description: string;
  isLiked: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  createdAt: string;
}

interface Artist {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  followers: number;
  totalSales: number;
}

export default function NFTMarketplace() {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data - in production, this would come from your blockchain API
  useEffect(() => {
    const mockNFTs: NFTItem[] = [
      {
        id: "1",
        title: "Digital Dreams #001",
        artist: "CryptoArtist",
        price: 2.5,
        currency: "ETH",
        image: "/api/placeholder/300/300",
        likes: 142,
        views: 1250,
        category: "art",
        tags: ["digital", "abstract", "dreams"],
        description: "A mesmerizing digital artwork exploring the realm of dreams and consciousness.",
        isLiked: false,
        rarity: "rare",
        createdAt: "2024-01-15"
      },
      {
        id: "2",
        title: "Synthwave Sunset",
        artist: "NeonCreator",
        price: 1.8,
        currency: "ETH",
        image: "/api/placeholder/300/300",
        likes: 89,
        views: 892,
        category: "art",
        tags: ["synthwave", "sunset", "neon"],
        description: "Retro-futuristic artwork capturing the essence of synthwave aesthetics.",
        isLiked: true,
        rarity: "uncommon",
        createdAt: "2024-01-10"
      },
      {
        id: "3",
        title: "Beat Machine #42",
        artist: "AudioVisual",
        price: 3.2,
        currency: "ETH",
        image: "/api/placeholder/300/300",
        likes: 203,
        views: 1890,
        category: "music",
        tags: ["music", "beats", "machine"],
        description: "Interactive music NFT with generative beat patterns.",
        isLiked: false,
        rarity: "legendary",
        createdAt: "2024-01-20"
      }
    ];
    setNfts(mockNFTs);
  }, []);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "art", name: "Digital Art" },
    { id: "music", name: "Music" },
    { id: "video", name: "Video" },
    { id: "3d", name: "3D Models" },
    { id: "photography", name: "Photography" }
  ];

  const rarityColors = {
    common: "bg-gray-500",
    uncommon: "bg-green-500",
    rare: "bg-blue-500",
    legendary: "bg-purple-500"
  };

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || nft.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (nftId: string) => {
    setNfts(nfts.map(nft => 
      nft.id === nftId 
        ? { ...nft, isLiked: !nft.isLiked, likes: nft.isLiked ? nft.likes - 1 : nft.likes + 1 }
        : nft
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                ProStudio NFT Marketplace
              </h1>
              <Badge variant="secondary" className="bg-purple-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                Hot
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" className="hidden sm:flex">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Create NFT
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Create New NFT</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Enter NFT title" className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe your NFT" className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (ETH)</Label>
                      <Input id="price" type="number" step="0.01" placeholder="0.00" className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload & Mint NFT
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-1 items-center space-x-4 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search NFTs, artists, collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 focus:border-purple-500"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="explore" className="space-y-6">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New Drops</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            {/* Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Volume</p>
                      <p className="text-2xl font-bold">2,847 ETH</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active Artists</p>
                      <p className="text-2xl font-bold">1,234</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Collections</p>
                      <p className="text-2xl font-bold">567</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">24h Sales</p>
                      <p className="text-2xl font-bold">89</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNFTs.map((nft) => (
                <Card key={nft.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors overflow-hidden group">
                  <div className="relative">
                    <img 
                      src={nft.image} 
                      alt={nft.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className={`${rarityColors[nft.rarity]} text-white`}>
                        {nft.rarity}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-black/50 hover:bg-black/70 text-white h-8 w-8 p-0"
                        onClick={() => toggleLike(nft.id)}
                      >
                        <Heart className={`w-4 h-4 ${nft.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-black/50 hover:bg-black/70 text-white h-8 w-8 p-0"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg truncate">{nft.title}</h3>
                        <p className="text-sm text-gray-400">by {nft.artist}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {nft.likes}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {nft.views}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(nft.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Current Price</p>
                          <p className="font-bold text-lg">
                            {nft.price} {nft.currency}
                          </p>
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Buy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trending NFTs</h3>
              <p className="text-gray-400">Discover the hottest NFTs right now</p>
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">New Drops</h3>
              <p className="text-gray-400">Fresh NFTs from top artists</p>
            </div>
          </TabsContent>

          <TabsContent value="following">
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Following</h3>
              <p className="text-gray-400">NFTs from artists you follow</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}