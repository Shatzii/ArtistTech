import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, Users, Trophy, Share, Play, Upload,
  Clock, Eye, Heart, MessageCircle, Music, Video,
  Zap, Star, Crown, Flame, Sparkles, Target
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ViralChallengeCreator() {
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [challengeType, setChallengeType] = useState("dance");
  const [duration, setDuration] = useState("7");
  const [prizePool, setPrizePool] = useState("1000");
  const [demoVideo, setDemoVideo] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const challengeTypes = [
    { id: "dance", name: "Dance Challenge", icon: Music, color: "bg-pink-500", examples: "TikTok dance trends" },
    { id: "remix", name: "Music Remix", icon: Music, color: "bg-purple-500", examples: "Remix competitions" },
    { id: "duet", name: "Duet Challenge", icon: Users, color: "bg-blue-500", examples: "Collaborative content" },
    { id: "cover", name: "Cover Song", icon: Music, color: "bg-green-500", examples: "Artist covers" },
    { id: "freestyle", name: "Freestyle Rap", icon: Music, color: "bg-orange-500", examples: "Rap battles" },
    { id: "talent", name: "Talent Show", icon: Star, color: "bg-yellow-500", examples: "Show your skills" }
  ];

  const platforms = [
    { id: "tiktok", name: "TikTok", users: "1.5B", engagement: "Very High" },
    { id: "instagram", name: "Instagram", users: "2B", engagement: "High" },
    { id: "youtube", name: "YouTube Shorts", users: "2.7B", engagement: "High" },
    { id: "twitter", name: "Twitter/X", users: "450M", engagement: "Medium" }
  ];

  const viralFactors = [
    { name: "Trending Audio", value: 95, color: "bg-green-500" },
    { name: "Easy to Copy", value: 88, color: "bg-blue-500" },
    { name: "Visual Appeal", value: 92, color: "bg-purple-500" },
    { name: "Hashtag Potential", value: 85, color: "bg-yellow-500" },
    { name: "Prize Incentive", value: 78, color: "bg-orange-500" }
  ];

  const { data: trendingChallenges } = useQuery({
    queryKey: ["/api/viral/trending-challenges"],
    enabled: true
  });

  const createChallengeMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('hashtag', data.hashtag);
      formData.append('type', data.type);
      formData.append('duration', data.duration);
      formData.append('prizePool', data.prizePool);
      if (data.demoVideo) {
        formData.append('demoVideo', data.demoVideo);
      }

      const response = await fetch('/api/viral/create-challenge', {
        method: 'POST',
        body: formData
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/viral/challenges"] });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setDemoVideo(file);
    }
  };

  const handleCreateChallenge = async () => {
    if (!challengeTitle || !challengeDescription || !hashtag) return;

    setIsCreating(true);
    try {
      await createChallengeMutation.mutateAsync({
        title: challengeTitle,
        description: challengeDescription,
        hashtag: hashtag.startsWith('#') ? hashtag : `#${hashtag}`,
        type: challengeType,
        duration,
        prizePool,
        demoVideo
      });
    } catch (error) {
      console.error('Challenge creation failed:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const generateHashtag = () => {
    const words = challengeTitle.split(' ').filter(word => word.length > 2);
    const suggestion = words.slice(0, 2).join('') + 'Challenge';
    setHashtag(`#${suggestion}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-pink-400" />
              <h1 className="text-3xl font-bold text-white">Viral Challenge Creator</h1>
              <Badge className="bg-gradient-to-r from-pink-400 to-purple-500 text-white">
                VIRAL ENGINE
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-white border-white/30">
              <Flame className="w-4 h-4 mr-1" />
              10M+ Participants
            </Badge>
            <Badge variant="outline" className="text-white border-white/30">
              <Trophy className="w-4 h-4 mr-1" />
              $500K+ in Prizes
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenge Creation Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                  Challenge Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Challenge Title</label>
                  <Input
                    placeholder="e.g., Ultimate Dance Battle 2025"
                    value={challengeTitle}
                    onChange={(e) => setChallengeTitle(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Describe your challenge, rules, and what participants need to do..."
                    value={challengeDescription}
                    onChange={(e) => setChallengeDescription(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Hashtag</label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="#YourChallenge"
                        value={hashtag}
                        onChange={(e) => setHashtag(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Button
                        onClick={generateHashtag}
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-700"
                      >
                        <Zap className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Duration (Days)</label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">1 Week</SelectItem>
                        <SelectItem value="14">2 Weeks</SelectItem>
                        <SelectItem value="30">1 Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Challenge Type */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Challenge Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {challengeTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        challengeType === type.id
                          ? 'border-pink-500 bg-pink-500/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => setChallengeType(type.id)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${type.color}`}>
                          <type.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-white text-sm">{type.name}</span>
                      </div>
                      <p className="text-xs text-gray-400">{type.examples}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prize & Demo Video */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Prize Pool & Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Prize Pool (ArtistCoins)</label>
                    <Select value={prizePool} onValueChange={setPrizePool}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500">500 AC ($50)</SelectItem>
                        <SelectItem value="1000">1,000 AC ($100)</SelectItem>
                        <SelectItem value="5000">5,000 AC ($500)</SelectItem>
                        <SelectItem value="10000">10,000 AC ($1,000)</SelectItem>
                        <SelectItem value="50000">50,000 AC ($5,000)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Demo Video</label>
                    <div 
                      className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-gray-500"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {demoVideo ? (
                        <div>
                          <Video className="w-6 h-6 text-green-400 mx-auto mb-1" />
                          <p className="text-green-400 text-xs">{demoVideo.name}</p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-gray-400 text-xs">Upload demo</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCreateChallenge}
                  disabled={!challengeTitle || !challengeDescription || !hashtag || isCreating}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 text-lg"
                >
                  {isCreating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Creating Challenge...
                    </>
                  ) : (
                    <>
                      <Flame className="w-5 h-5 mr-2" />
                      Launch Viral Challenge
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analytics & Insights */}
          <div className="space-y-6">
            {/* Viral Potential */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Viral Potential</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {viralFactors.map((factor, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">{factor.name}</span>
                      <span className="text-white">{factor.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${factor.color} transition-all duration-500`}
                        style={{ width: `${factor.value}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="text-green-400 text-sm font-medium">Viral Score: 87%</div>
                  <div className="text-green-300 text-xs">High probability of going viral</div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Reach */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Platform Reach</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div>
                      <div className="text-white text-sm font-medium">{platform.name}</div>
                      <div className="text-xs text-gray-400">{platform.users} users</div>
                    </div>
                    <Badge className={`${
                      platform.engagement === 'Very High' ? 'bg-green-600' :
                      platform.engagement === 'High' ? 'bg-blue-600' : 'bg-yellow-600'
                    }`}>
                      {platform.engagement}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Challenges */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: "#DanceRevolution", participants: "2.3M", trending: "+45%" },
                  { name: "#RemixMadness", participants: "1.8M", trending: "+32%" },
                  { name: "#TalentShowdown", participants: "1.2M", trending: "+28%" },
                  { name: "#FreestyleFriday", participants: "980K", trending: "+19%" }
                ].map((challenge, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded text-xs">
                    <div className="text-white">{challenge.name}</div>
                    <div className="text-gray-400">{challenge.participants}</div>
                    <div className="text-green-400">{challenge.trending}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Impact Prediction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded">
                    <div className="text-blue-400 text-lg font-bold">2.5M</div>
                    <div className="text-blue-300 text-xs">Est. Views</div>
                  </div>
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded">
                    <div className="text-green-400 text-lg font-bold">450K</div>
                    <div className="text-green-300 text-xs">Participants</div>
                  </div>
                  <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded">
                    <div className="text-purple-400 text-lg font-bold">15.8M</div>
                    <div className="text-purple-300 text-xs">Reach</div>
                  </div>
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded">
                    <div className="text-yellow-400 text-lg font-bold">72h</div>
                    <div className="text-yellow-300 text-xs">Peak Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}