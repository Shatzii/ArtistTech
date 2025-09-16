import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  TrendingUp,
  Target,
  Award,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Zap,
  BookOpen,
  Trophy,
  Star,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { AIAnalyticsInsights } from './AIAnalyticsInsights';

interface CareerMetrics {
  followers: number;
  engagement: number;
  revenue: number;
  contentQuality: number;
  brandValue: number;
  growthRate: number;
  platformDiversity: number;
  audienceRetention: number;
}

interface CareerGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: Date;
  category: 'growth' | 'revenue' | 'engagement' | 'brand';
  priority: 'high' | 'medium' | 'low';
  progress: number;
}

interface CareerRecommendation {
  id: string;
  type: 'content' | 'strategy' | 'networking' | 'monetization' | 'skill';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  timeframe: string;
  actionable: boolean;
}

interface AICareerManagerProps {
  userId: string;
  metrics: CareerMetrics;
  goals: CareerGoal[];
  recommendations: CareerRecommendation[];
  analyticsData: any[];
}

export const AICareerManager: React.FC<AICareerManagerProps> = ({
  userId,
  metrics,
  goals,
  recommendations,
  analyticsData
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [careerScore, setCareerScore] = useState(0);
  const [careerLevel, setCareerLevel] = useState('');
  const [nextMilestone, setNextMilestone] = useState('');

  useEffect(() => {
    calculateCareerScore();
    determineCareerLevel();
  }, [metrics]);

  const calculateCareerScore = () => {
    // Weighted calculation of career score
    const weights = {
      followers: 0.15,
      engagement: 0.25,
      revenue: 0.20,
      contentQuality: 0.15,
      brandValue: 0.10,
      growthRate: 0.10,
      platformDiversity: 0.03,
      audienceRetention: 0.02
    };

    const score = Object.entries(weights).reduce((total, [key, weight]) => {
      return total + (metrics[key as keyof CareerMetrics] * weight);
    }, 0);

    setCareerScore(Math.min(Math.round(score), 100));
  };

  const determineCareerLevel = () => {
    if (careerScore >= 90) {
      setCareerLevel('Elite Artist');
      setNextMilestone('Maintain excellence and expand globally');
    } else if (careerScore >= 75) {
      setCareerLevel('Professional Artist');
      setNextMilestone('Reach 90+ career score');
    } else if (careerScore >= 60) {
      setCareerLevel('Established Creator');
      setNextMilestone('Reach 75+ career score');
    } else if (careerScore >= 40) {
      setCareerLevel('Growing Artist');
      setNextMilestone('Reach 60+ career score');
    } else if (careerScore >= 20) {
      setCareerLevel('Emerging Artist');
      setNextMilestone('Reach 40+ career score');
    } else {
      setCareerLevel('Aspiring Artist');
      setNextMilestone('Reach 20+ career score');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-blue-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatMetric = (value: number, type: string) => {
    switch (type) {
      case 'followers':
        return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
      case 'revenue':
        return `$${value.toLocaleString()}`;
      case 'engagement':
      case 'contentQuality':
      case 'brandValue':
      case 'growthRate':
      case 'platformDiversity':
      case 'audienceRetention':
        return `${value.toFixed(1)}%`;
      default:
        return value.toString();
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'followers': return <Users className="h-4 w-4" />;
      case 'engagement': return <TrendingUp className="h-4 w-4" />;
      case 'revenue': return <DollarSign className="h-4 w-4" />;
      case 'contentQuality': return <Star className="h-4 w-4" />;
      case 'brandValue': return <Award className="h-4 w-4" />;
      case 'growthRate': return <ArrowUp className="h-4 w-4" />;
      case 'platformDiversity': return <BarChart3 className="h-4 w-4" />;
      case 'audienceRetention': return <Clock className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (current: number, target: number) => {
    const diff = current - target;
    if (Math.abs(diff) < 1) return <Minus className="h-4 w-4 text-gray-500" />;
    if (diff > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    return <ArrowDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Career Overview Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-2xl">
                <User className="h-6 w-6 mr-2 text-purple-600" />
                AI Career Manager
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Your personalized career development dashboard
              </p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(careerScore)}`}>
                {careerScore}
              </div>
              <div className="text-sm text-gray-500">Career Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">{careerLevel}</div>
              <div className="text-sm text-gray-500">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{nextMilestone}</div>
              <div className="text-sm text-gray-500">Next Milestone</div>
            </div>
            <div className="text-center">
              <Progress value={careerScore} className="w-full" />
              <div className="text-sm text-gray-500 mt-1">Progress to Elite</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(metrics).map(([key, value]) => (
              <Card key={key}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{formatMetric(value, key)}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {getMetricIcon(key)}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={value} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Career Progress Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Career Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-500">{careerScore}/100</span>
                </div>
                <Progress value={careerScore} className="h-3" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {metrics.followers >= 10000 ? '✓' : '○'}
                    </div>
                    <div className="text-xs text-gray-500">10K Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {metrics.engagement >= 75 ? '✓' : '○'}
                    </div>
                    <div className="text-xs text-gray-500">75% Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">
                      {metrics.revenue >= 5000 ? '✓' : '○'}
                    </div>
                    <div className="text-xs text-gray-500">$5K Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">
                      {metrics.brandValue >= 80 ? '✓' : '○'}
                    </div>
                    <div className="text-xs text-gray-500">80% Brand Value</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Career Goals</h3>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </div>

          <div className="grid gap-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={
                          goal.priority === 'high' ? 'destructive' :
                          goal.priority === 'medium' ? 'default' :
                          'secondary'
                        }>
                          {goal.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {goal.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="font-medium mb-1">{goal.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>

                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{goal.current}/{goal.target}</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {goal.progress.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      {getTrendIcon(goal.current, goal.target)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <AIAnalyticsInsights
            metrics={analyticsData}
            alerts={[]} // Would be populated from real-time alerts
            trends={[]} // Would be populated from trend analysis
          />
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Recommendations</h3>
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={
                          rec.impact === 'high' ? 'destructive' :
                          rec.impact === 'medium' ? 'default' :
                          'secondary'
                        }>
                          {rec.impact} impact
                        </Badge>
                        <Badge variant="outline">
                          {rec.effort} effort
                        </Badge>
                        <Badge variant="outline">
                          {rec.timeframe}
                        </Badge>
                      </div>

                      <h4 className="font-medium mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 capitalize">
                          {rec.type}
                        </span>
                        {rec.actionable && (
                          <Badge variant="outline" className="text-xs">
                            Actionable
                          </Badge>
                        )}
                      </div>
                    </div>

                    {rec.actionable && (
                      <Button size="sm" className="ml-4">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AICareerManager;