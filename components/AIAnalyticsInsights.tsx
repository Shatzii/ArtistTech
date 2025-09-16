import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
  Users,
  BarChart3,
  Zap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface AnalyticsInsight {
  id: string;
  type: 'performance' | 'opportunity' | 'warning' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  category: string;
  data: any;
  timestamp: Date;
  actionable: boolean;
  autoExecute?: boolean;
}

interface PredictiveInsight {
  id: string;
  prediction: string;
  probability: number;
  timeframe: string;
  basedOn: string[];
  recommendation: string;
}

interface AIAnalyticsInsightsProps {
  metrics: any[];
  alerts: any[];
  trends: any[];
}

export const AIAnalyticsInsights: React.FC<AIAnalyticsInsightsProps> = ({
  metrics,
  alerts,
  trends
}) => {
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [predictions, setPredictions] = useState<PredictiveInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (metrics.length > 0) {
      generateInsights();
      generatePredictions();
    }
  }, [metrics, alerts, trends]);

  const generateInsights = async () => {
    setIsAnalyzing(true);

    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newInsights: AnalyticsInsight[] = [];

      // Performance insights
      const avgEngagement = metrics.reduce((sum, m) => sum + m.engagement, 0) / metrics.length;
      if (avgEngagement > 8) {
        newInsights.push({
          id: 'perf_high_engagement',
          type: 'performance',
          title: 'Exceptional Engagement Performance',
          description: `Your content is performing ${((avgEngagement - 5) / 5 * 100).toFixed(0)}% above average with ${avgEngagement.toFixed(1)}% engagement rate.`,
          confidence: 95,
          impact: 'high',
          category: 'Performance',
          data: { avgEngagement },
          timestamp: new Date(),
          actionable: false
        });
      }

      // Trend-based insights
      const recentTrends = trends.filter(t => t.confidence > 70);
      if (recentTrends.length > 0) {
        const topTrend = recentTrends[0];
        newInsights.push({
          id: 'trend_opportunity',
          type: 'opportunity',
          title: 'Trending Content Opportunity',
          description: `${topTrend.name} is trending ${topTrend.direction === 'up' ? 'upward' : 'downward'} with ${Math.abs(topTrend.velocity).toFixed(1)}% velocity.`,
          confidence: topTrend.confidence,
          impact: 'high',
          category: 'Content Strategy',
          data: topTrend,
          timestamp: new Date(),
          actionable: true
        });
      }

      // Alert-based insights
      const criticalAlerts = alerts.filter(a => a.severity === 'error' || a.severity === 'warning');
      if (criticalAlerts.length > 2) {
        newInsights.push({
          id: 'alert_cluster',
          type: 'warning',
          title: 'Multiple Performance Issues Detected',
          description: `${criticalAlerts.length} critical alerts require immediate attention. Review system performance and content strategy.`,
          confidence: 90,
          impact: 'high',
          category: 'System Health',
          data: { alertCount: criticalAlerts.length },
          timestamp: new Date(),
          actionable: true
        });
      }

      // Platform-specific insights
      const platformPerformance = analyzePlatformPerformance();
      Object.entries(platformPerformance).forEach(([platform, data]: [string, any]) => {
        if (data.growth > 15) {
          newInsights.push({
            id: `platform_growth_${platform}`,
            type: 'performance',
            title: `${platform} Growth Surge`,
            description: `${platform} is experiencing ${data.growth.toFixed(1)}% growth. Capitalize on this momentum.`,
            confidence: 85,
            impact: 'medium',
            category: 'Platform Performance',
            data: { platform, ...data },
            timestamp: new Date(),
            actionable: true
          });
        }
      });

      // Content timing insights
      const optimalPostingTimes = analyzeOptimalPostingTimes();
      if (optimalPostingTimes.length > 0) {
        newInsights.push({
          id: 'timing_optimization',
          type: 'recommendation',
          title: 'Optimal Posting Schedule',
          description: `Best performance at: ${optimalPostingTimes.join(', ')}. Consider scheduling content during these times.`,
          confidence: 78,
          impact: 'medium',
          category: 'Content Strategy',
          data: { optimalTimes: optimalPostingTimes },
          timestamp: new Date(),
          actionable: true,
          autoExecute: true
        });
      }

      setInsights(newInsights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePredictions = async () => {
    const newPredictions: PredictiveInsight[] = [];

    // Growth prediction
    const growthTrend = calculateGrowthTrend();
    if (growthTrend.confidence > 70) {
      newPredictions.push({
        id: 'growth_prediction',
        prediction: `Expected ${growthTrend.direction} growth of ${Math.abs(growthTrend.velocity).toFixed(1)}% over next 30 days`,
        probability: growthTrend.confidence,
        timeframe: '30 days',
        basedOn: ['Historical performance', 'Current trends', 'Market analysis'],
        recommendation: growthTrend.direction === 'up'
          ? 'Maintain current strategy and increase content frequency'
          : 'Review content strategy and engagement tactics'
      });
    }

    // Engagement prediction
    const engagementPrediction = predictEngagement();
    if (engagementPrediction.probability > 75) {
      newPredictions.push({
        id: 'engagement_prediction',
        prediction: `Engagement rate will ${engagementPrediction.direction} to ${engagementPrediction.target.toFixed(1)}%`,
        probability: engagementPrediction.probability,
        timeframe: '7 days',
        basedOn: ['Recent performance', 'Content analysis', 'Audience behavior'],
        recommendation: engagementPrediction.direction === 'increase'
          ? 'Focus on interactive content and community engagement'
          : 'Experiment with new content formats and posting strategies'
      });
    }

    // Revenue prediction
    const revenuePrediction = predictRevenue();
    if (revenuePrediction.probability > 80) {
      newPredictions.push({
        id: 'revenue_prediction',
        prediction: `Revenue projection: $${revenuePrediction.amount.toLocaleString()} for next month`,
        probability: revenuePrediction.probability,
        timeframe: '30 days',
        basedOn: ['Current revenue streams', 'Growth trends', 'Market conditions'],
        recommendation: 'Optimize high-performing revenue streams and diversify income sources'
      });
    }

    setPredictions(newPredictions);
  };

  const analyzePlatformPerformance = () => {
    const platformStats: Record<string, any> = {};

    metrics.forEach(metric => {
      if (!platformStats[metric.platform]) {
        platformStats[metric.platform] = {
          totalEngagement: 0,
          totalFollowers: 0,
          count: 0,
          growth: 0
        };
      }

      const stats = platformStats[metric.platform];
      stats.totalEngagement += metric.engagement;
      stats.totalFollowers += metric.followers;
      stats.count += 1;
    });

    // Calculate growth rates
    Object.keys(platformStats).forEach(platform => {
      const stats = platformStats[platform];
      const avgEngagement = stats.totalEngagement / stats.count;

      // Simple growth calculation based on recent vs older data
      const midPoint = Math.floor(metrics.length / 2);
      const recentMetrics = metrics.slice(-midPoint);
      const olderMetrics = metrics.slice(0, midPoint);

      if (olderMetrics.length > 0) {
        const recentAvg = recentMetrics.reduce((sum, m) => sum + m.engagement, 0) / recentMetrics.length;
        const olderAvg = olderMetrics.reduce((sum, m) => sum + m.engagement, 0) / olderMetrics.length;

        stats.growth = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
      }
    });

    return platformStats;
  };

  const analyzeOptimalPostingTimes = (): string[] => {
    const hourlyPerformance: Record<number, number[]> = {};

    metrics.forEach(metric => {
      const hour = new Date(metric.timestamp).getHours();
      if (!hourlyPerformance[hour]) {
        hourlyPerformance[hour] = [];
      }
      hourlyPerformance[hour].push(metric.engagement);
    });

    // Find top performing hours
    const avgPerformance = Object.entries(hourlyPerformance)
      .map(([hour, engagements]) => ({
        hour: parseInt(hour),
        avgEngagement: engagements.reduce((sum, eng) => sum + eng, 0) / engagements.length
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement);

    return avgPerformance.slice(0, 3).map(item => `${item.hour}:00`);
  };

  const calculateGrowthTrend = () => {
    if (metrics.length < 5) return { direction: 'stable', velocity: 0, confidence: 0 };

    const recent = metrics.slice(-5);
    const older = metrics.slice(-10, -5);

    const recentAvg = recent.reduce((sum, m) => sum + m.engagement, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.engagement, 0) / older.length;

    const velocity = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
    const direction = velocity > 2 ? 'up' : velocity < -2 ? 'down' : 'stable';
    const confidence = Math.min(Math.abs(velocity) * 10, 95);

    return { direction, velocity, confidence };
  };

  const predictEngagement = () => {
    const currentAvg = metrics.slice(-7).reduce((sum, m) => sum + m.engagement, 0) / 7;
    const trend = calculateGrowthTrend();

    const target = currentAvg * (1 + trend.velocity / 100);
    const direction = target > currentAvg ? 'increase' : 'decrease';
    const probability = Math.min(Math.abs(trend.velocity) * 15, 90);

    return { direction, target, probability };
  };

  const predictRevenue = () => {
    const recentRevenue = metrics.slice(-7).reduce((sum, m) => sum + m.revenue, 0);
    const weeklyAvg = recentRevenue / 7;
    const monthlyProjection = weeklyAvg * 4.3; // Average weeks per month

    // Add growth factor
    const growthTrend = calculateGrowthTrend();
    const adjustedProjection = monthlyProjection * (1 + growthTrend.velocity / 100 / 12); // Monthly growth

    return {
      amount: Math.round(adjustedProjection),
      probability: Math.min(growthTrend.confidence + 10, 95)
    };
  };

  const executeInsight = async (insight: AnalyticsInsight) => {
    // Simulate executing an insight
    console.log('Executing insight:', insight.title);

    // Update insight status
    setInsights(prev =>
      prev.map(i =>
        i.id === insight.id ? { ...i, actionable: false } : i
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" />
            AI-Powered Analytics
            {isAnalyzing && (
              <Badge variant="secondary" className="ml-2">
                Analyzing...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Real-time AI analysis of your performance data, trends, and opportunities.
            Insights update automatically as new data becomes available.
          </p>
        </CardContent>
      </Card>

      {/* Key Insights */}
      {insights.length > 0 && (
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            AI Insights ({insights.length})
          </h3>

          {insights.map((insight) => (
            <Card key={insight.id} className={`border-l-4 ${
              insight.type === 'performance' ? 'border-l-green-500' :
              insight.type === 'opportunity' ? 'border-l-blue-500' :
              insight.type === 'warning' ? 'border-l-red-500' :
              insight.type === 'recommendation' ? 'border-l-purple-500' :
              'border-l-gray-500'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={
                        insight.impact === 'high' ? 'destructive' :
                        insight.impact === 'medium' ? 'default' :
                        'secondary'
                      }>
                        {insight.impact} impact
                      </Badge>
                      <Badge variant="outline">
                        {insight.confidence}% confidence
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {insight.category}
                      </span>
                    </div>

                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(insight.timestamp).toLocaleString()}
                      </span>
                      {insight.type === 'trend' && (
                        <span className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Real-time trend
                        </span>
                      )}
                    </div>
                  </div>

                  {insight.actionable && (
                    <Button
                      size="sm"
                      onClick={() => executeInsight(insight)}
                      className="ml-4"
                    >
                      {insight.autoExecute ? (
                        <>
                          <Zap className="h-3 w-3 mr-1" />
                          Auto-Execute
                        </>
                      ) : (
                        <>
                          <Target className="h-3 w-3 mr-1" />
                          Take Action
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Predictive Analytics */}
      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-indigo-500" />
              Predictive Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{prediction.prediction}</h4>
                      <p className="text-sm text-gray-600 mb-2">{prediction.recommendation}</p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {prediction.probability}% probability
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {prediction.timeframe}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 mb-1">Based on:</div>
                        <div className="flex flex-wrap gap-1">
                          {prediction.basedOn.map((factor, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 text-right">
                      <div className="text-2xl font-bold text-indigo-600 mb-1">
                        {prediction.probability}%
                      </div>
                      <Progress value={prediction.probability} className="w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-orange-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Performance Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Analyze Audience Insights
            </Button>
            <Button variant="outline" className="justify-start">
              <Target className="h-4 w-4 mr-2" />
              Optimize Content Strategy
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Analytics Data
            </Button>
            <Button variant="outline" className="justify-start">
              <Brain className="h-4 w-4 mr-2" />
              Run AI Analysis
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertCircle className="h-4 w-4 mr-2" />
              Set up Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalyticsInsights;