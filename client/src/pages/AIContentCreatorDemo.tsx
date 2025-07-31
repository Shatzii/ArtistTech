import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Bot, TrendingUp, Calendar, Zap, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface AIContentStatus {
  status: string;
  aiEngine: string;
  brandVoices: number;
  contentCalendars: number;
  socialStrategies: number;
  templates: number;
  timestamp: string;
}

interface GeneratedContent {
  id: string;
  type: string;
  platform: string;
  title: string;
  content: string;
  hashtags: string[];
  mediaDescription: string;
  optimizationScore: number;
  engagementPrediction: number;
  suggestedPostTime: string;
  variations: string[];
}

export default function AIContentCreatorDemo() {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [contentType, setContentType] = useState('social_post');
  const [topic, setTopic] = useState('new music release');
  const queryClient = useQueryClient();

  // Get AI Content Creator status
  const { data: status, isLoading: statusLoading } = useQuery<AIContentStatus>({
    queryKey: ['/api/content/status'],
  });

  // Test content generation
  const generateContentMutation = useMutation({
    mutationFn: async (params: { type: string; platform: string; topic: string }) => {
      const response = await fetch('/api/content/test-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/status'] });
    },
  });

  const handleGenerateContent = () => {
    generateContentMutation.mutate({
      type: contentType,
      platform: selectedPlatform,
      topic: topic,
    });
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  ];

  const contentTypes = [
    { id: 'social_post', name: 'Social Media Post' },
    { id: 'story', name: 'Story Content' },
    { id: 'reel', name: 'Reel/Short Video' },
    { id: 'caption', name: 'Caption Only' },
    { id: 'hashtag_strategy', name: 'Hashtag Strategy' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Bot className="h-8 w-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">AI Content Creator</h1>
            <Sparkles className="h-8 w-8 text-cyan-400" />
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Revolutionary self-hosted AI engine for creating viral social media content across all platforms
          </p>
        </div>

        {/* Status Dashboard */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              AI Engine Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusLoading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading AI status...
              </div>
            ) : status ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{status.aiEngine}</div>
                  <div className="text-sm text-slate-400">Engine Status</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{status.templates}</div>
                  <div className="text-sm text-slate-400">Content Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{status.brandVoices}</div>
                  <div className="text-sm text-slate-400">Brand Voices</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{status.contentCalendars}</div>
                  <div className="text-sm text-slate-400">Active Calendars</div>
                </div>
              </div>
            ) : (
              <div className="text-red-400">Failed to load AI status</div>
            )}
          </CardContent>
        </Card>

        {/* Content Generation Interface */}
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="generate" className="text-white data-[state=active]:bg-cyan-600">
              Generate Content
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-white data-[state=active]:bg-cyan-600">
              Content Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-cyan-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Content Generator</CardTitle>
                <CardDescription className="text-slate-400">
                  Create AI-powered content for any platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Platform</label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {platforms.map((platform) => (
                          <SelectItem key={platform.id} value={platform.id} className="text-white">
                            {platform.icon} {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Content Type</label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {contentTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id} className="text-white">
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Topic</label>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter your topic..."
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGenerateContent}
                  disabled={generateContentMutation.isPending}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                >
                  {generateContentMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>

                {/* Generated Content Display */}
                {generateContentMutation.data && (
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        Generated Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-cyan-600 text-white">
                            {generateContentMutation.data.platform}
                          </Badge>
                          <Badge variant="outline" className="border-slate-500 text-slate-300">
                            {generateContentMutation.data.type}
                          </Badge>
                        </div>
                        
                        {generateContentMutation.data.title && (
                          <div>
                            <label className="text-sm font-medium text-white">Title:</label>
                            <p className="text-slate-200 mt-1">{generateContentMutation.data.title}</p>
                          </div>
                        )}

                        <div>
                          <label className="text-sm font-medium text-white">Content:</label>
                          <Textarea
                            value={generateContentMutation.data.content}
                            readOnly
                            className="mt-1 bg-slate-600 border-slate-500 text-white"
                            rows={4}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-white">Hashtags:</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {generateContentMutation.data.hashtags.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="border-cyan-500 text-cyan-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Optimization Score:</span>
                            <span className="ml-2 text-green-400 font-semibold">
                              {generateContentMutation.data.optimizationScore}%
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Predicted Engagement:</span>
                            <span className="ml-2 text-blue-400 font-semibold">
                              {generateContentMutation.data.engagementPrediction}/5
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {generateContentMutation.error && (
                  <Card className="bg-red-900/20 border-red-500">
                    <CardContent className="pt-6">
                      <p className="text-red-400">
                        Error: {generateContentMutation.error.message}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                  Content Calendar (Coming Soon)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  AI-powered content calendar with automated scheduling and theme generation will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Content Analytics (Coming Soon)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Advanced analytics and performance tracking for your AI-generated content will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">AI Content Creator Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 bg-slate-700/50 rounded-lg">
                <Bot className="h-6 w-6 text-cyan-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white">Self-Hosted AI</h3>
                  <p className="text-sm text-slate-400">No external dependencies, all processing local</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-700/50 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white">Multi-Platform Support</h3>
                  <p className="text-sm text-slate-400">Optimized content for all major social platforms</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-700/50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white">Trend Analysis</h3>
                  <p className="text-sm text-slate-400">Real-time trend integration for viral content</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}