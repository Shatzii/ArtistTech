import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { 
  Bot, Target, TrendingUp, Users, MessageSquare, 
  Lightbulb, BarChart3, Calendar, Award, Zap,
  Instagram, Youtube, Twitter, Music, CheckCircle,
  Clock, ArrowRight, Sparkles, Brain, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface CoachingSession {
  session_id: string;
  initial_strategy: any;
  created_at: string;
}

interface CoachingResponse {
  advice: string;
  action_steps: string[];
  expected_timeline: string;
  success_indicators: string[];
  additional_resources: string[];
}

export default function SocialMediaStrategyCoach() {
  const [currentSession, setCurrentSession] = useState<CoachingSession | null>(null);
  const [question, setQuestion] = useState("");
  const [lastResponse, setLastResponse] = useState<CoachingResponse | null>(null);
  const [setupForm, setSetupForm] = useState({
    goals: [''],
    currentFollowers: '',
    engagementRate: '',
    postingFrequency: 'weekly',
    topPlatforms: ['instagram'],
    challenges: ['']
  });
  const { toast } = useToast();

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500' },
    { id: 'tiktok', name: 'TikTok', icon: Music, color: 'from-black to-red-500' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'from-blue-400 to-blue-600' },
  ];

  // Start coaching session
  const startSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('/api/strategy-coach/start-session', 'POST', {
        goals: data.goals.filter((g: string) => g.trim()),
        currentMetrics: {
          followers: parseInt(data.currentFollowers) || 0,
          engagement_rate: parseFloat(data.engagementRate) || 0,
          posting_frequency: data.postingFrequency,
          top_platforms: data.topPlatforms
        },
        challenges: data.challenges.filter((c: string) => c.trim())
      });
      return response;
    },
    onSuccess: (data: any) => {
      setCurrentSession(data);
      toast({
        title: "Coaching Session Started!",
        description: "Your personalized strategy analysis is ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Session Failed",
        description: error.message || "Failed to start coaching session",
        variant: "destructive",
      });
    }
  });

  // Ask coaching question
  const askQuestionMutation = useMutation({
    mutationFn: async (data: { question: string; session_id: string }) => {
      const response = await apiRequest('/api/strategy-coach/ask', 'POST', data);
      return response;
    },
    onSuccess: (data: any) => {
      setLastResponse(data.coaching_response);
      toast({
        title: "Strategy Advice Ready",
        description: "Your personalized coaching response is here!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Coaching Failed",
        description: error.message || "Failed to get coaching advice",
        variant: "destructive",
      });
    }
  });

  // Get coaching resources
  const { data: resources } = useQuery({
    queryKey: ['/api/strategy-coach/resources'],
    enabled: true
  });

  const handleStartSession = () => {
    if (setupForm.goals.filter(g => g.trim()).length === 0) {
      toast({
        title: "Goals Required",
        description: "Please add at least one goal for your social media strategy",
        variant: "destructive",
      });
      return;
    }
    startSessionMutation.mutate(setupForm);
  };

  const handleAskQuestion = () => {
    if (!question.trim() || !currentSession) return;
    
    askQuestionMutation.mutate({
      question: question.trim(),
      session_id: currentSession.session_id
    });
    setQuestion("");
  };

  const addGoal = () => {
    setSetupForm(prev => ({ ...prev, goals: [...prev.goals, ''] }));
  };

  const updateGoal = (index: number, value: string) => {
    setSetupForm(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => i === index ? value : goal)
    }));
  };

  const addChallenge = () => {
    setSetupForm(prev => ({ ...prev, challenges: [...prev.challenges, ''] }));
  };

  const updateChallenge = (index: number, value: string) => {
    setSetupForm(prev => ({
      ...prev,
      challenges: prev.challenges.map((challenge, i) => i === index ? value : challenge)
    }));
  };

  const togglePlatform = (platformId: string) => {
    setSetupForm(prev => ({
      ...prev,
      topPlatforms: prev.topPlatforms.includes(platformId) 
        ? prev.topPlatforms.filter(id => id !== platformId)
        : [...prev.topPlatforms, platformId]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Social Media Strategy Coaching Bot
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Bot className="w-5 h-5" />
            AI-powered personalized coaching for music industry creators
          </p>
        </div>

        {!currentSession ? (
          /* Session Setup */
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Strategy Assessment Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Goals */}
                <div>
                  <label className="block text-sm font-medium mb-3">Your Social Media Goals</label>
                  {setupForm.goals.map((goal, index) => (
                    <div key={index} className="mb-2">
                      <Input
                        value={goal}
                        onChange={(e) => updateGoal(index, e.target.value)}
                        placeholder="e.g., Grow Instagram to 10K followers, Increase streaming numbers..."
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  ))}
                  <Button onClick={addGoal} variant="outline" size="sm" className="mt-2">
                    + Add Goal
                  </Button>
                </div>

                {/* Current Metrics */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Followers</label>
                    <Input
                      type="number"
                      value={setupForm.currentFollowers}
                      onChange={(e) => setSetupForm(prev => ({ ...prev, currentFollowers: e.target.value }))}
                      placeholder="0"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Engagement Rate (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={setupForm.engagementRate}
                      onChange={(e) => setSetupForm(prev => ({ ...prev, engagementRate: e.target.value }))}
                      placeholder="0.0"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Posting Frequency</label>
                    <select
                      value={setupForm.postingFrequency}
                      onChange={(e) => setSetupForm(prev => ({ ...prev, postingFrequency: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="irregular">Irregular</option>
                    </select>
                  </div>
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Primary Platforms</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          setupForm.topPlatforms.includes(platform.id)
                            ? 'border-blue-400 bg-blue-400/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <platform.icon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">{platform.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div>
                  <label className="block text-sm font-medium mb-3">Current Challenges</label>
                  {setupForm.challenges.map((challenge, index) => (
                    <div key={index} className="mb-2">
                      <Input
                        value={challenge}
                        onChange={(e) => updateChallenge(index, e.target.value)}
                        placeholder="e.g., Low engagement, Content creation burnout, Not getting discovered..."
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  ))}
                  <Button onClick={addChallenge} variant="outline" size="sm" className="mt-2">
                    + Add Challenge
                  </Button>
                </div>

                <Button
                  onClick={handleStartSession}
                  disabled={startSessionMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 hover:from-blue-400 hover:to-purple-400"
                >
                  {startSessionMutation.isPending ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Your Strategy...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5 mr-2" />
                      Start Coaching Session
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Active Coaching Session */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ask Question */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    Ask Your Strategy Coach
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask anything about your social media strategy... e.g., 'How can I increase my engagement on Instagram?' or 'What content should I post to grow my audience?'"
                    rows={3}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Button
                    onClick={handleAskQuestion}
                    disabled={!question.trim() || askQuestionMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {askQuestionMutation.isPending ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Getting Advice...
                      </>
                    ) : (
                      <>
                        <Bot className="w-4 h-4 mr-2" />
                        Get Coaching Advice
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Latest Response */}
              {lastResponse && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Personalized Strategy Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-200 leading-relaxed">{lastResponse.advice}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Action Steps
                      </h4>
                      <ul className="space-y-2">
                        {lastResponse.action_steps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-400" />
                          Expected Timeline
                        </h4>
                        <p className="text-slate-400">{lastResponse.expected_timeline}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          Success Indicators
                        </h4>
                        <ul className="text-slate-400 text-sm space-y-1">
                          {lastResponse.success_indicators.map((indicator, index) => (
                            <li key={index}>• {indicator}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Strategy Overview */}
            <div className="space-y-6">
              {/* Initial Strategy */}
              {currentSession.initial_strategy && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-400" />
                      Your Strategy Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Growth Projections */}
                    {currentSession.initial_strategy.growth_projections && (
                      <div>
                        <h4 className="font-semibold mb-2">Growth Projections</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>30 Days:</span>
                            <span className="text-green-400">
                              {currentSession.initial_strategy.growth_projections.projected_30_days?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>90 Days:</span>
                            <span className="text-green-400">
                              {currentSession.initial_strategy.growth_projections.projected_90_days?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>1 Year:</span>
                            <span className="text-green-400">
                              {currentSession.initial_strategy.growth_projections.projected_365_days?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Items */}
                    {currentSession.initial_strategy.action_items && (
                      <div>
                        <h4 className="font-semibold mb-2">Priority Action Items</h4>
                        <ul className="space-y-1 text-sm">
                          {currentSession.initial_strategy.action_items.slice(0, 4).map((item: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <Badge variant="outline" className="mt-0.5 text-xs">{index + 1}</Badge>
                              <span className="text-slate-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setQuestion("How can I improve my engagement rate?")}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Improve Engagement
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setQuestion("What content should I post this week?")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Content Planning
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setQuestion("How do I collaborate with other artists?")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Collaboration Tips
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setQuestion("How can I monetize my social media?")}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Monetization Strategy
                  </Button>
                </CardContent>
              </Card>

              {/* Resources */}
              {resources && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle>Strategy Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        📱 Content Templates
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        📈 Growth Hacks
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        📊 Analytics Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}