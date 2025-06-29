import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, Send, Clock, TrendingUp, Eye, Heart, Share, 
  Calendar as CalendarIcon, Settings, BarChart3, Target,
  Twitter, Music, Video, Image, Hash, AtSign, MapPin
} from 'lucide-react';
import { format } from 'date-fns';

export default function SocialMediaDeployment() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const [tiktokData, setTiktokData] = useState({
    videoUrl: '',
    title: '',
    description: '',
    hashtags: [],
    music: '',
    effects: [],
    privacy: 'public',
    allowComments: true,
    allowDuet: true,
    allowStitch: true
  });

  const [twitterData, setTwitterData] = useState({
    content: '',
    mediaUrls: [],
    type: 'tweet',
    hashtags: [],
    mentions: [],
    location: ''
  });

  const [campaignData, setCampaignData] = useState({
    name: '',
    contentId: '',
    platforms: ['tiktok', 'twitter'],
    budget: 0,
    goals: {
      views: 10000,
      engagement: 1000,
      followers: 100
    }
  });

  // Fetch deployment status
  const { data: deploymentStatus } = useQuery({
    queryKey: ['/api/social-deploy/status'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // TikTok deployment mutation
  const tiktokMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/social-deploy/tiktok', data),
    onSuccess: (data) => {
      toast({
        title: "TikTok Deployment Success",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/social-deploy/status'] });
    },
    onError: (error: any) => {
      toast({
        title: "TikTok Deployment Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Twitter deployment mutation
  const twitterMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/social-deploy/twitter', data),
    onSuccess: (data) => {
      toast({
        title: "Twitter Deployment Success",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/social-deploy/status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Twitter Deployment Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Campaign creation mutation
  const campaignMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/social-deploy/campaign', data),
    onSuccess: (data) => {
      toast({
        title: "Campaign Created",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/social-deploy/status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Campaign Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleTikTokDeploy = () => {
    const deployData = {
      ...tiktokData,
      scheduledTime: selectedDate?.toISOString()
    };
    tiktokMutation.mutate(deployData);
  };

  const handleTwitterDeploy = () => {
    const deployData = {
      ...twitterData,
      scheduledTime: selectedDate?.toISOString()
    };
    twitterMutation.mutate(deployData);
  };

  const handleCampaignCreate = () => {
    campaignMutation.mutate(campaignData);
  };

  const addHashtag = (platform: 'tiktok' | 'twitter', hashtag: string) => {
    if (platform === 'tiktok') {
      setTiktokData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtag]
      }));
    } else {
      setTwitterData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtag]
      }));
    }
  };

  const removeHashtag = (platform: 'tiktok' | 'twitter', index: number) => {
    if (platform === 'tiktok') {
      setTiktokData(prev => ({
        ...prev,
        hashtags: prev.hashtags.filter((_, i) => i !== index)
      }));
    } else {
      setTwitterData(prev => ({
        ...prev,
        hashtags: prev.hashtags.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Social Media Deployment Center
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Deploy your content to TikTok, Twitter, and beyond with AI optimization
          </p>
          
          {/* Platform Status */}
          {deploymentStatus && (
            <div className="flex justify-center gap-4 mb-6">
              <Badge variant="outline" className="bg-green-500/20 border-green-400 text-green-300">
                🎵 TikTok Connected
              </Badge>
              <Badge variant="outline" className="bg-blue-500/20 border-blue-400 text-blue-300">
                🐦 Twitter Connected
              </Badge>
              <Badge variant="outline" className="bg-purple-500/20 border-purple-400 text-purple-300">
                📸 Instagram Ready
              </Badge>
              <Badge variant="outline" className="bg-red-500/20 border-red-400 text-red-300">
                📺 YouTube Ready
              </Badge>
            </div>
          )}
        </div>

        <Tabs defaultValue="tiktok" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="tiktok" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              TikTok
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-2">
              <Twitter className="w-4 h-4" />
              Twitter
            </TabsTrigger>
            <TabsTrigger value="campaign" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Campaign
            </TabsTrigger>
          </TabsList>

          {/* TikTok Deployment */}
          <TabsContent value="tiktok">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-400" />
                  TikTok Deployment
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Upload and optimize your video for TikTok's algorithm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Upload */}
                <div className="space-y-2">
                  <Label className="text-white">Video URL</Label>
                  <Input
                    placeholder="Enter video URL or upload path"
                    value={tiktokData.videoUrl}
                    onChange={(e) => setTiktokData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                {/* Title and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Title</Label>
                    <Input
                      placeholder="Catchy TikTok title"
                      value={tiktokData.title}
                      onChange={(e) => setTiktokData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Music Track</Label>
                    <Input
                      placeholder="Background music or sound"
                      value={tiktokData.music}
                      onChange={(e) => setTiktokData(prev => ({ ...prev, music: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Description</Label>
                  <Textarea
                    placeholder="Write an engaging description with trending keywords..."
                    value={tiktokData.description}
                    onChange={(e) => setTiktokData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                  />
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <Label className="text-white">Hashtags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tiktokData.hashtags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="cursor-pointer bg-purple-500/20 text-purple-300"
                        onClick={() => removeHashtag('tiktok', index)}
                      >
                        #{tag} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add hashtag (without #)"
                      className="bg-gray-800 border-gray-600 text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          addHashtag('tiktok', target.value);
                          target.value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500 text-purple-300"
                      onClick={() => {
                        // Auto-suggest trending hashtags
                        const trending = ['fyp', 'viral', 'music', 'artist', 'newmusic'];
                        trending.forEach(tag => addHashtag('tiktok', tag));
                      }}
                    >
                      Add Trending
                    </Button>
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Privacy</Label>
                    <Select 
                      value={tiktokData.privacy} 
                      onValueChange={(value) => setTiktokData(prev => ({ ...prev, privacy: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={tiktokData.allowComments}
                      onCheckedChange={(checked) => setTiktokData(prev => ({ ...prev, allowComments: checked }))}
                    />
                    <Label className="text-white">Comments</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={tiktokData.allowDuet}
                      onCheckedChange={(checked) => setTiktokData(prev => ({ ...prev, allowDuet: checked }))}
                    />
                    <Label className="text-white">Duets</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={tiktokData.allowStitch}
                      onCheckedChange={(checked) => setTiktokData(prev => ({ ...prev, allowStitch: checked }))}
                    />
                    <Label className="text-white">Stitch</Label>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <Label className="text-white">Schedule Post (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Deploy Button */}
                <Button
                  onClick={handleTikTokDeploy}
                  disabled={tiktokMutation.isPending || !tiktokData.videoUrl}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {tiktokMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deploying...
                    </div>
                  ) : selectedDate ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Schedule for TikTok
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Deploy to TikTok Now
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Twitter Deployment */}
          <TabsContent value="twitter">
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  Twitter Deployment
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Create optimized tweets and threads for maximum engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tweet Content */}
                <div className="space-y-2">
                  <Label className="text-white">Tweet Content</Label>
                  <Textarea
                    placeholder="What's happening? Share your music, thoughts, or updates..."
                    value={twitterData.content}
                    onChange={(e) => setTwitterData(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white min-h-[120px]"
                    maxLength={280}
                  />
                  <div className="text-right text-sm text-gray-400">
                    {twitterData.content.length}/280 characters
                  </div>
                </div>

                {/* Media URLs */}
                <div className="space-y-2">
                  <Label className="text-white">Media URLs (Images/Videos)</Label>
                  <Input
                    placeholder="Add media URLs (comma separated)"
                    className="bg-gray-800 border-gray-600 text-white"
                    onChange={(e) => setTwitterData(prev => ({ 
                      ...prev, 
                      mediaUrls: e.target.value.split(',').map(url => url.trim()).filter(Boolean)
                    }))}
                  />
                </div>

                {/* Tweet Type and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Tweet Type</Label>
                    <Select 
                      value={twitterData.type} 
                      onValueChange={(value) => setTwitterData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tweet">Tweet</SelectItem>
                        <SelectItem value="thread">Thread</SelectItem>
                        <SelectItem value="retweet">Retweet</SelectItem>
                        <SelectItem value="quote">Quote Tweet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Location (Optional)</Label>
                    <Input
                      placeholder="Add location"
                      value={twitterData.location}
                      onChange={(e) => setTwitterData(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <Label className="text-white">Hashtags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {twitterData.hashtags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="cursor-pointer bg-blue-500/20 text-blue-300"
                        onClick={() => removeHashtag('twitter', index)}
                      >
                        #{tag} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add hashtag (without #)"
                      className="bg-gray-800 border-gray-600 text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          addHashtag('twitter', target.value);
                          target.value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-300"
                      onClick={() => {
                        const trending = ['music', 'newmusic', 'artist', 'indie', 'songwriter'];
                        trending.forEach(tag => addHashtag('twitter', tag));
                      }}
                    >
                      Add Music Tags
                    </Button>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <Label className="text-white">Schedule Tweet (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Deploy Button */}
                <Button
                  onClick={handleTwitterDeploy}
                  disabled={twitterMutation.isPending || !twitterData.content}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {twitterMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Posting...
                    </div>
                  ) : selectedDate ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Schedule Tweet
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Post to Twitter Now
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cross-Platform Campaign */}
          <TabsContent value="campaign">
            <Card className="bg-black/40 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Cross-Platform Campaign
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Launch coordinated campaigns across multiple platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Campaign Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Campaign Name</Label>
                    <Input
                      placeholder="Enter campaign name"
                      value={campaignData.name}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Content ID</Label>
                    <Input
                      placeholder="Content or release ID"
                      value={campaignData.contentId}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, contentId: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                {/* Platform Selection */}
                <div className="space-y-2">
                  <Label className="text-white">Target Platforms</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['tiktok', 'twitter', 'instagram', 'youtube'].map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Switch
                          checked={campaignData.platforms.includes(platform)}
                          onCheckedChange={(checked) => {
                            setCampaignData(prev => ({
                              ...prev,
                              platforms: checked 
                                ? [...prev.platforms, platform]
                                : prev.platforms.filter(p => p !== platform)
                            }));
                          }}
                        />
                        <Label className="text-white capitalize">{platform}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <Label className="text-white">Budget (USD)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={campaignData.budget}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                {/* Goals */}
                <div className="space-y-4">
                  <Label className="text-white">Campaign Goals</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Target Views</Label>
                      <Input
                        type="number"
                        value={campaignData.goals.views}
                        onChange={(e) => setCampaignData(prev => ({
                          ...prev,
                          goals: { ...prev.goals, views: parseInt(e.target.value) || 0 }
                        }))}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300">Target Engagement</Label>
                      <Input
                        type="number"
                        value={campaignData.goals.engagement}
                        onChange={(e) => setCampaignData(prev => ({
                          ...prev,
                          goals: { ...prev.goals, engagement: parseInt(e.target.value) || 0 }
                        }))}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300">New Followers</Label>
                      <Input
                        type="number"
                        value={campaignData.goals.followers}
                        onChange={(e) => setCampaignData(prev => ({
                          ...prev,
                          goals: { ...prev.goals, followers: parseInt(e.target.value) || 0 }
                        }))}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Create Campaign Button */}
                <Button
                  onClick={handleCampaignCreate}
                  disabled={campaignMutation.isPending || !campaignData.name || !campaignData.contentId}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {campaignMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Campaign...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Create Cross-Platform Campaign
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Dashboard */}
        {deploymentStatus && (
          <Card className="mt-8 bg-black/40 border-gray-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                Deployment Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {deploymentStatus.status?.tiktokDeployments || 0}
                  </div>
                  <div className="text-sm text-gray-400">TikTok Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {deploymentStatus.status?.twitterDeployments || 0}
                  </div>
                  <div className="text-sm text-gray-400">Twitter Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {deploymentStatus.status?.activeCampaigns || 0}
                  </div>
                  <div className="text-sm text-gray-400">Active Campaigns</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {deploymentStatus.status?.scheduledPosts || 0}
                  </div>
                  <div className="text-sm text-gray-400">Scheduled Posts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}