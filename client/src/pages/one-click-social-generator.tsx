import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { 
  Wand2, Share2, Download, Copy, Instagram, Twitter, 
  Youtube, Music, Sparkles, Zap, TrendingUp, Clock,
  Eye, Heart, MessageCircle, Repeat2, Play, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface GeneratedContent {
  platform: string;
  content: {
    caption: string;
    hashtags: string[];
    hooks: string[];
    engagement_prediction: number;
    optimal_posting_time: string;
    trending_score: number;
  };
  visual_suggestions: {
    style: string;
    colors: string[];
    elements: string[];
  };
  performance_prediction: {
    expected_views: number;
    expected_engagement: number;
    viral_potential: number;
  };
}

export default function OneClickSocialGenerator() {
  const [prompt, setPrompt] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'tiktok', 'youtube']);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500' },
    { id: 'tiktok', name: 'TikTok', icon: Music, color: 'from-black to-red-500' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'from-blue-400 to-blue-600' },
  ];

  const generateContentMutation = useMutation({
    mutationFn: async (data: { prompt: string; platforms: string[] }) => {
      console.log('Starting content generation:', data);
      try {
        const response = await apiRequest('/api/social/one-click-generate', 'POST', data);
        console.log('API Response:', response);
        return response;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    onSuccess: (data: any) => {
      console.log('Generation successful, setting content:', data.content);
      setGeneratedContent(data.content || []);
      setGenerationProgress(100);
      toast({
        title: "Content Generated Successfully!",
        description: `Created content for ${data.content?.length || 0} platforms`,
      });
    },
    onError: (error: any) => {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
      setGenerationProgress(0);
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what content you want to create",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Select platforms",
        description: "Choose at least one platform to generate content for",
        variant: "destructive",
      });
      return;
    }

    setGenerationProgress(0);
    setGeneratedContent([]);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    generateContentMutation.mutate({
      prompt: prompt.trim(),
      platforms: selectedPlatforms
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
    });
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            One-Click Social Media Generator
          </h1>
          <p className="text-slate-400 text-lg">
            AI-powered content creation for all major platforms in seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-yellow-400" />
                  Content Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">What do you want to create?</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A tutorial about music production tips for beginners, or behind-the-scenes of my latest song creation..."
                    rows={4}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Select Platforms</label>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedPlatforms.includes(platform.id)
                            ? 'border-yellow-400 bg-yellow-400/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <platform.icon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">{platform.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={generateContentMutation.isPending}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 hover:from-yellow-400 hover:to-orange-400"
                >
                  {generateContentMutation.isPending ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>

                {/* Progress Bar */}
                {generateContentMutation.isPending && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating content...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generated Content */}
          <div className="lg:col-span-2">
            {generatedContent.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Share2 className="w-6 h-6 text-green-400" />
                  Generated Content
                </h2>

                <Tabs defaultValue={generatedContent[0]?.platform} className="w-full">
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-slate-800">
                    {generatedContent.map((content) => {
                      const platform = platforms.find(p => p.id === content.platform);
                      return (
                        <TabsTrigger 
                          key={content.platform} 
                          value={content.platform}
                          className="flex items-center gap-2"
                        >
                          {platform && <platform.icon className="w-4 h-4" />}
                          {platform?.name}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {generatedContent.map((content) => (
                    <TabsContent key={content.platform} value={content.platform}>
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {platforms.find(p => p.id === content.platform)?.icon && (
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${platforms.find(p => p.id === content.platform)?.color}`}>
                                  {(() => {
                                    const Icon = platforms.find(p => p.id === content.platform)!.icon;
                                    return <Icon className="w-5 h-5 text-white" />;
                                  })()}
                                </div>
                              )}
                              {platforms.find(p => p.id === content.platform)?.name} Content
                            </div>
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {content.content.trending_score}% Viral Score
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Caption */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">Caption</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(content.content.caption)}
                                className="text-xs"
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                              <p className="text-slate-200 leading-relaxed">{content.content.caption}</p>
                            </div>
                          </div>

                          {/* Hashtags */}
                          <div>
                            <h4 className="font-medium mb-3">Trending Hashtags</h4>
                            <div className="flex flex-wrap gap-2">
                              {content.content.hashtags.map((hashtag, index) => (
                                <Badge key={index} variant="outline" className="border-blue-400 text-blue-400">
                                  {hashtag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Hooks */}
                          <div>
                            <h4 className="font-medium mb-3">Attention Hooks</h4>
                            <div className="grid gap-2">
                              {content.content.hooks.map((hook, index) => (
                                <div key={index} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                                  <p className="text-yellow-400 font-medium">"{hook}"</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Performance Predictions */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">Performance Prediction</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2 text-sm">
                                    <Eye className="w-4 h-4" />
                                    Expected Views
                                  </span>
                                  <span className="font-bold text-green-400">
                                    {content.performance_prediction.expected_views.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2 text-sm">
                                    <Heart className="w-4 h-4" />
                                    Engagement Rate
                                  </span>
                                  <span className="font-bold text-pink-400">
                                    {content.performance_prediction.expected_engagement}%
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2 text-sm">
                                    <Sparkles className="w-4 h-4" />
                                    Viral Potential
                                  </span>
                                  <span className="font-bold text-purple-400">
                                    {content.performance_prediction.viral_potential}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3">Optimal Timing</h4>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm">Best Time to Post</span>
                                </div>
                                <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                                  <p className="font-bold text-blue-400">{content.content.optimal_posting_time}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-green-400" />
                                  <span className="text-sm">Engagement Boost: +{content.content.engagement_prediction}%</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Visual Suggestions */}
                          <div>
                            <h4 className="font-medium mb-3">Visual Design Suggestions</h4>
                            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                              <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-slate-400 mb-2">Style</p>
                                  <p className="text-yellow-400">{content.visual_suggestions.style}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-400 mb-2">Color Palette</p>
                                  <div className="flex gap-1">
                                    {content.visual_suggestions.colors.map((color, index) => (
                                      <div 
                                        key={index}
                                        className="w-6 h-6 rounded-full border border-slate-500"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-400 mb-2">Elements</p>
                                  <div className="flex flex-wrap gap-1">
                                    {content.visual_suggestions.elements.map((element, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {element}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4 border-t border-slate-700">
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => copyToClipboard(`${content.content.caption}\n\n${content.content.hashtags.join(' ')}`)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy All
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                            <Button 
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Post Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ) : (
              <Card className="bg-slate-800/30 border-slate-700 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mb-6">
                    <Wand2 className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-400">Ready to Generate Content</h3>
                  <p className="text-slate-500 mb-6 max-w-md">
                    Enter your content idea and select platforms to generate AI-powered social media content optimized for maximum engagement.
                  </p>
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Multi-Platform
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      AI Optimized
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Instant Results
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}