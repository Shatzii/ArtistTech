import { logger } from './monitoring';
import { SocialMetrics, ContentItem } from './social-media-integration';
import { machineLearningEngine } from './machine-learning-engine';
import WebSocket from 'ws';
import { EventEmitter } from 'events';

// Real-time Analytics Types
export interface RealTimeMetrics {
  timestamp: Date;
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  views: number;
  revenue: number;
  growth: number;
}

export interface StreamingData {
  id: string;
  type: 'metric' | 'event' | 'alert' | 'trend';
  data: any;
  timestamp: Date;
  source: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface RealTimeAlert {
  id: string;
  type: 'performance' | 'opportunity' | 'risk' | 'milestone';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  data: any;
  timestamp: Date;
  acknowledged: boolean;
  actions: AlertAction[];
}

export interface AlertAction {
  id: string;
  label: string;
  type: 'execute' | 'investigate' | 'dismiss';
  payload: any;
}

export interface LiveTrend {
  id: string;
  name: string;
  category: string;
  direction: 'up' | 'down' | 'stable';
  velocity: number;
  confidence: number;
  data: number[];
  timestamps: Date[];
  prediction: number;
  timeframe: string;
}

export interface RealTimeDashboard {
  metrics: RealTimeMetrics[];
  alerts: RealTimeAlert[];
  trends: LiveTrend[];
  performance: PerformanceSnapshot;
  recommendations: RealTimeRecommendation[];
  lastUpdated: Date;
}

export interface PerformanceSnapshot {
  overallScore: number;
  growthRate: number;
  engagementRate: number;
  revenueGrowth: number;
  audienceGrowth: number;
  contentPerformance: number;
  trendAlignment: number;
}

export interface RealTimeRecommendation {
  id: string;
  type: 'content' | 'timing' | 'platform' | 'strategy';
  title: string;
  description: string;
  confidence: number;
  expectedImpact: number;
  actionRequired: boolean;
  autoExecute: boolean;
  timestamp: Date;
}

// Real-time Data Streamer
export class RealTimeDataStreamer extends EventEmitter {
  private streams: Map<string, StreamConnection> = new Map();
  private subscribers: Map<string, StreamSubscriber[]> = new Map();
  private dataBuffer: StreamingData[] = [];
  private bufferSize = 1000;
  private wss: WebSocket.Server | null = null;
  private wsClients: Set<WebSocket> = new Set();

  constructor() {
    super();
    this.initializeStreams();
    this.startDataCollection();
  }

  private initializeStreams(): void {
    // Initialize streams for each platform
    const platforms = ['instagram', 'tiktok', 'youtube', 'spotify'];

    for (const platform of platforms) {
      this.streams.set(platform, {
        id: platform,
        active: true,
        lastUpdate: new Date(),
        errorCount: 0,
        reconnectAttempts: 0
      });
    }
  }

  private async startDataCollection(): Promise<void> {
    // Start collecting data from all platforms
    setInterval(async () => {
      await this.collectRealTimeData();
    }, 30000); // Collect every 30 seconds

    // Process buffered data
    setInterval(() => {
      this.processBufferedData();
    }, 5000); // Process every 5 seconds
  }

  private async collectRealTimeData(): Promise<void> {
    for (const [platformId, stream] of this.streams) {
      if (!stream.active) continue;

      try {
        const data = await this.fetchPlatformData(platformId);
        if (data) {
          this.bufferData({
            id: `stream_${Date.now()}_${platformId}`,
            type: 'metric',
            data,
            timestamp: new Date(),
            source: platformId,
            priority: 'medium'
          });
        }
        stream.lastUpdate = new Date();
        stream.errorCount = 0;
      } catch (error) {
        logger.error(`Failed to collect data from ${platformId}:`, error);
        stream.errorCount++;
        if (stream.errorCount > 5) {
          stream.active = false;
          this.attemptReconnect(platformId);
        }
      }
    }
  }

  private async fetchPlatformData(platform: string): Promise<RealTimeMetrics | null> {
    // Simulate real-time data fetching
    // In production, this would connect to actual APIs
    const baseMetrics = {
      timestamp: new Date(),
      platform,
      followers: Math.floor(Math.random() * 10000) + 50000,
      engagement: Math.random() * 10,
      reach: Math.floor(Math.random() * 50000) + 10000,
      impressions: Math.floor(Math.random() * 100000) + 50000,
      likes: Math.floor(Math.random() * 1000) + 500,
      comments: Math.floor(Math.random() * 100) + 50,
      shares: Math.floor(Math.random() * 50) + 10,
      saves: Math.floor(Math.random() * 200) + 20,
      clicks: Math.floor(Math.random() * 500) + 100,
      views: Math.floor(Math.random() * 10000) + 5000,
      revenue: Math.random() * 1000,
      growth: (Math.random() - 0.5) * 10
    };

    return baseMetrics;
  }

  public bufferData(data: StreamingData): void {
    this.dataBuffer.push(data);

    // Maintain buffer size
    if (this.dataBuffer.length > this.bufferSize) {
      this.dataBuffer = this.dataBuffer.slice(-this.bufferSize);
    }

    // Notify subscribers
    this.notifySubscribers(data);
  }

  private processBufferedData(): void {
    if (this.dataBuffer.length === 0) return;

    // Process data in batches
    const batch = this.dataBuffer.splice(0, 50);
    this.analyzeBatchData(batch);
  }

  private async analyzeBatchData(batch: StreamingData[]): Promise<void> {
    // Analyze trends and generate insights
    const trends = await this.detectTrends(batch);
    const alerts = await this.generateAlerts(batch);
    const recommendations = await this.generateRecommendations(batch);

    // Emit analyzed data
    for (const trend of trends) {
      this.bufferData({
        id: `trend_${Date.now()}`,
        type: 'trend',
        data: trend,
        timestamp: new Date(),
        source: 'analytics',
        priority: 'medium'
      });
    }

    for (const alert of alerts) {
      this.bufferData({
        id: `alert_${Date.now()}`,
        type: 'alert',
        data: alert,
        timestamp: new Date(),
        source: 'analytics',
        priority: alert.severity === 'error' ? 'high' : 'medium'
      });
    }
  }

  private async detectTrends(data: StreamingData[]): Promise<LiveTrend[]> {
    const trends: LiveTrend[] = [];

    // Group data by platform
    const platformData = new Map<string, StreamingData[]>();
    for (const item of data) {
      if (!platformData.has(item.source)) {
        platformData.set(item.source, []);
      }
      platformData.get(item.source)!.push(item);
    }

    // Analyze trends for each platform
    for (const [platform, platformItems] of platformData) {
      const engagementTrend = this.calculateTrend(platformItems.map(item => item.data.engagement));
      const followerTrend = this.calculateTrend(platformItems.map(item => item.data.followers));

      if (Math.abs(engagementTrend.velocity) > 5) {
        trends.push({
          id: `engagement_${platform}_${Date.now()}`,
          name: `${platform} Engagement`,
          category: 'engagement',
          direction: engagementTrend.velocity > 0 ? 'up' : 'down',
          velocity: Math.abs(engagementTrend.velocity),
          confidence: engagementTrend.confidence,
          data: platformItems.map(item => item.data.engagement),
          timestamps: platformItems.map(item => item.timestamp),
          prediction: engagementTrend.prediction,
          timeframe: '1h'
        });
      }

      if (Math.abs(followerTrend.velocity) > 2) {
        trends.push({
          id: `followers_${platform}_${Date.now()}`,
          name: `${platform} Followers`,
          category: 'growth',
          direction: followerTrend.velocity > 0 ? 'up' : 'down',
          velocity: Math.abs(followerTrend.velocity),
          confidence: followerTrend.confidence,
          data: platformItems.map(item => item.data.followers),
          timestamps: platformItems.map(item => item.timestamp),
          prediction: followerTrend.prediction,
          timeframe: '1h'
        });
      }
    }

    return trends;
  }

  private calculateTrend(values: number[]): { velocity: number; confidence: number; prediction: number } {
    if (values.length < 3) return { velocity: 0, confidence: 0, prediction: values[values.length - 1] || 0 };

    const recent = values.slice(-5);
    const slope = this.calculateSlope(recent);
    const volatility = this.calculateVolatility(recent);

    return {
      velocity: slope * 100, // Convert to percentage
      confidence: Math.max(0, 100 - volatility * 10),
      prediction: recent[recent.length - 1] + slope
    };
  }

  private calculateSlope(values: number[]): number {
    const n = values.length;
    if (n < 2) return 0;

    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, idx) => sum + val * idx, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private calculateVolatility(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private async generateAlerts(data: StreamingData[]): Promise<RealTimeAlert[]> {
    const alerts: RealTimeAlert[] = [];

    // Check for performance drops
    const recentData = data.slice(-10);
    for (const item of recentData) {
      if (item.data.engagement < 2) {
        alerts.push({
          id: `alert_${Date.now()}`,
          type: 'performance',
          title: 'Low Engagement Alert',
          message: `Engagement rate dropped below 2% on ${item.source}`,
          severity: 'warning',
          data: item.data,
          timestamp: new Date(),
          acknowledged: false,
          actions: [
            {
              id: 'investigate_content',
              label: 'Investigate Content',
              type: 'investigate',
              payload: { platform: item.source, metric: 'engagement' }
            },
            {
              id: 'optimize_posting',
              label: 'Optimize Posting Strategy',
              type: 'execute',
              payload: { action: 'optimize_schedule', platform: item.source }
            }
          ]
        });
      }

      // Check for viral opportunities
      if (item.data.views > 50000 && item.data.engagement > 8) {
        alerts.push({
          id: `viral_${Date.now()}`,
          type: 'opportunity',
          title: 'Viral Content Opportunity',
          message: `Content performing exceptionally well on ${item.source}`,
          severity: 'success',
          data: item.data,
          timestamp: new Date(),
          acknowledged: false,
          actions: [
            {
              id: 'amplify_content',
              label: 'Amplify Content',
              type: 'execute',
              payload: { action: 'boost_post', platform: item.source }
            }
          ]
        });
      }
    }

    return alerts;
  }

  private async generateRecommendations(data: StreamingData[]): Promise<RealTimeRecommendation[]> {
    const recommendations: RealTimeRecommendation[] = [];

    // Analyze platform performance
    const platformPerformance = this.analyzePlatformPerformance(data);

    // Generate timing recommendations
    const bestPostingTimes = await this.analyzeBestPostingTimes(data);
    if (bestPostingTimes.length > 0) {
      recommendations.push({
        id: `timing_${Date.now()}`,
        type: 'timing',
        title: 'Optimal Posting Times Identified',
        description: `Best performance at: ${bestPostingTimes.join(', ')}`,
        confidence: 85,
        expectedImpact: 15,
        actionRequired: false,
        autoExecute: true,
        timestamp: new Date()
      });
    }

    // Generate content recommendations
    const topPerformingContent = this.identifyTopContent(data);
    if (topPerformingContent.length > 0) {
      recommendations.push({
        id: `content_${Date.now()}`,
        type: 'content',
        title: 'Content Strategy Insight',
        description: `Focus on ${topPerformingContent.join(', ')} content types`,
        confidence: 78,
        expectedImpact: 20,
        actionRequired: true,
        autoExecute: false,
        timestamp: new Date()
      });
    }

    return recommendations;
  }

  private analyzePlatformPerformance(data: StreamingData[]): Map<string, any> {
    const performance = new Map<string, any>();

    for (const item of data) {
      if (!performance.has(item.source)) {
        performance.set(item.source, {
          totalEngagement: 0,
          totalViews: 0,
          count: 0
        });
      }

      const platform = performance.get(item.source);
      platform.totalEngagement += item.data.engagement;
      platform.totalViews += item.data.views;
      platform.count++;
    }

    return performance;
  }

  private async analyzeBestPostingTimes(data: StreamingData[]): Promise<string[]> {
    // Analyze when content performs best
    const hourlyPerformance = new Map<number, number[]>();

    for (const item of data) {
      const hour = item.timestamp.getHours();
      if (!hourlyPerformance.has(hour)) {
        hourlyPerformance.set(hour, []);
      }
      hourlyPerformance.get(hour)!.push(item.data.engagement);
    }

    // Find top performing hours
    const avgPerformance = Array.from(hourlyPerformance.entries())
      .map(([hour, engagements]) => ({
        hour,
        avgEngagement: engagements.reduce((sum, eng) => sum + eng, 0) / engagements.length
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement);

    return avgPerformance.slice(0, 3).map(item => `${item.hour}:00`);
  }

  private identifyTopContent(data: StreamingData[]): string[] {
    // Identify best performing content types
    const contentTypes = ['video', 'image', 'carousel', 'reel', 'story'];

    const performance = contentTypes.map(type => ({
      type,
      avgEngagement: Math.random() * 10 // Simulate analysis
    })).sort((a, b) => b.avgEngagement - a.avgEngagement);

    return performance.slice(0, 2).map(item => item.type);
  }

  private async attemptReconnect(platformId: string): Promise<void> {
    const stream = this.streams.get(platformId);
    if (!stream) return;

    stream.reconnectAttempts++;
    logger.info(`Attempting to reconnect to ${platformId} (attempt ${stream.reconnectAttempts})`);

    // Simulate reconnection logic
    setTimeout(() => {
      stream.active = true;
      stream.errorCount = 0;
      logger.info(`Successfully reconnected to ${platformId}`);
    }, 5000);
  }

  // Public methods for subscribers
  subscribe(eventType: string, callback: (data: StreamingData) => void): string {
    const subscriberId = `sub_${Date.now()}_${Math.random()}`;

    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }

    this.subscribers.get(eventType)!.push({
      id: subscriberId,
      callback
    });

    return subscriberId;
  }

  unsubscribe(subscriberId: string): void {
    for (const [eventType, subs] of this.subscribers) {
      const index = subs.findIndex(sub => sub.id === subscriberId);
      if (index !== -1) {
        subs.splice(index, 1);
        break;
      }
    }
  }

  private notifySubscribers(data: StreamingData): void {
    const subscribers = this.subscribers.get(data.type) || [];
    for (const subscriber of subscribers) {
      try {
        subscriber.callback(data);
      } catch (error) {
        logger.error('Subscriber callback error:', error);
      }
    }

    // Broadcast to WebSocket clients
    this.broadcastToWSClients(data);
  }

  // WebSocket server management
  public startWebSocketServer(port: number = 8080): void {
    this.wss = new WebSocket.Server({ port });

    this.wss.on('connection', (ws: WebSocket, request) => {
      logger.info('New WebSocket connection for real-time analytics');
      this.wsClients.add(ws);

      // Send initial dashboard data
      this.sendToWSClient(ws, {
        type: 'INITIAL_DATA',
        data: realTimeAnalyticsProcessor.getDashboard(),
        timestamp: new Date()
      });

      ws.on('message', (message: string) => {
        try {
          const event = JSON.parse(message.toString());
          this.handleWSMessage(ws, event);
        } catch (error) {
          logger.error('Failed to parse WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        logger.info('WebSocket connection closed');
        this.wsClients.delete(ws);
      });

      ws.on('error', (error) => {
        logger.error('WebSocket error:', error);
        this.wsClients.delete(ws);
      });
    });

    logger.info(`Real-time analytics WebSocket server started on port ${port}`);
  }

  private handleWSMessage(ws: WebSocket, event: any): void {
    switch (event.type) {
      case 'SUBSCRIBE':
        // Handle subscription requests
        if (event.streamType) {
          const subscriberId = this.subscribe(event.streamType, (data) => {
            this.sendToWSClient(ws, {
              type: 'STREAM_DATA',
              streamType: event.streamType,
              data,
              timestamp: new Date()
            });
          });

          this.sendToWSClient(ws, {
            type: 'SUBSCRIBED',
            streamType: event.streamType,
            subscriberId,
            timestamp: new Date()
          });
        }
        break;

      case 'UNSUBSCRIBE':
        if (event.subscriberId) {
          this.unsubscribe(event.subscriberId);
          this.sendToWSClient(ws, {
            type: 'UNSUBSCRIBED',
            subscriberId: event.subscriberId,
            timestamp: new Date()
          });
        }
        break;

      case 'GET_DASHBOARD':
        this.sendToWSClient(ws, {
          type: 'DASHBOARD_DATA',
          data: realTimeAnalyticsProcessor.getDashboard(),
          timestamp: new Date()
        });
        break;

      case 'ACKNOWLEDGE_ALERT':
        if (event.alertId) {
          const success = realTimeAnalyticsProcessor.acknowledgeAlert(event.alertId);
          this.sendToWSClient(ws, {
            type: 'ALERT_ACKNOWLEDGED',
            alertId: event.alertId,
            success,
            timestamp: new Date()
          });
        }
        break;
    }
  }

  private sendToWSClient(ws: WebSocket, data: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(data));
      } catch (error) {
        logger.error('Failed to send data to WebSocket client:', error);
        this.wsClients.delete(ws);
      }
    }
  }

  private broadcastToWSClients(data: StreamingData): void {
    // Only broadcast high-priority data to avoid overwhelming clients
    if (data.priority === 'high' || data.priority === 'critical') {
      this.wsClients.forEach(ws => {
        this.sendToWSClient(ws, {
          type: 'BROADCAST',
          data,
          timestamp: new Date()
        });
      });
    }
  }

  public stopWebSocketServer(): void {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
      this.wsClients.clear();
      logger.info('Real-time analytics WebSocket server stopped');
    }
  }

  public getWebSocketStatus(): any {
    return {
      isRunning: this.wss !== null,
      connectedClients: this.wsClients.size,
      port: this.wss?.options.port || null
    };
  }

  getStreamStatus(): Map<string, StreamConnection> {
    return new Map(this.streams);
  }

  getBufferedData(): StreamingData[] {
    return [...this.dataBuffer];
  }

  // Start broadcasting dashboard updates
  public startDashboardBroadcast(): void {
    setInterval(() => {
      const dashboard = realTimeAnalyticsProcessor.getDashboard();

      this.wsClients.forEach(ws => {
        this.sendToWSClient(ws, {
          type: 'DASHBOARD_UPDATE',
          data: dashboard,
          timestamp: new Date()
        });
      });
    }, 10000); // Broadcast every 10 seconds
  }
}

interface StreamConnection {
  id: string;
  active: boolean;
  lastUpdate: Date;
  errorCount: number;
  reconnectAttempts: number;
}

interface StreamSubscriber {
  id: string;
  callback: (data: StreamingData) => void;
}

// Real-time Analytics Processor
export class RealTimeAnalyticsProcessor {
  private streamer: RealTimeDataStreamer;
  private dashboard: RealTimeDashboard;
  private alertQueue: RealTimeAlert[] = [];
  private recommendationQueue: RealTimeRecommendation[] = [];

  constructor() {
    this.streamer = new RealTimeDataStreamer();
    this.dashboard = {
      metrics: [],
      alerts: [],
      trends: [],
      performance: {
        overallScore: 0,
        growthRate: 0,
        engagementRate: 0,
        revenueGrowth: 0,
        audienceGrowth: 0,
        contentPerformance: 0,
        trendAlignment: 0
      },
      recommendations: [],
      lastUpdated: new Date()
    };

    this.initializeProcessor();
  }

  private initializeProcessor(): void {
    // Subscribe to streaming data
    this.streamer.subscribe('metric', (data) => this.processMetricData(data));
    this.streamer.subscribe('trend', (data) => this.processTrendData(data));
    this.streamer.subscribe('alert', (data) => this.processAlertData(data));

    // Start dashboard updates
    setInterval(() => this.updateDashboard(), 10000); // Update every 10 seconds
  }

  private processMetricData(data: StreamingData): void {
    // Add to metrics
    this.dashboard.metrics.push(data.data);

    // Keep only recent metrics (last 100)
    if (this.dashboard.metrics.length > 100) {
      this.dashboard.metrics = this.dashboard.metrics.slice(-100);
    }

    // Update performance snapshot
    this.updatePerformanceSnapshot();
  }

  private processTrendData(data: StreamingData): void {
    // Add to trends
    this.dashboard.trends.push(data.data);

    // Keep only recent trends (last 20)
    if (this.dashboard.trends.length > 20) {
      this.dashboard.trends = this.dashboard.trends.slice(-20);
    }
  }

  private processAlertData(data: StreamingData): void {
    // Add to alerts
    this.alertQueue.push(data.data);

    // Keep only recent alerts (last 50)
    if (this.alertQueue.length > 50) {
      this.alertQueue = this.alertQueue.slice(-50);
    }

    // Update dashboard alerts
    this.dashboard.alerts = this.alertQueue.filter(alert => !alert.acknowledged);
  }

  private updatePerformanceSnapshot(): void {
    const recentMetrics = this.dashboard.metrics.slice(-20);

    if (recentMetrics.length === 0) return;

    const avgEngagement = recentMetrics.reduce((sum, m) => sum + m.engagement, 0) / recentMetrics.length;
    const avgGrowth = recentMetrics.reduce((sum, m) => sum + m.growth, 0) / recentMetrics.length;
    const totalRevenue = recentMetrics.reduce((sum, m) => sum + m.revenue, 0);
    const avgRevenueGrowth = recentMetrics.length > 1 ?
      (recentMetrics[recentMetrics.length - 1].revenue - recentMetrics[0].revenue) / recentMetrics[0].revenue * 100 : 0;

    this.dashboard.performance = {
      overallScore: this.calculateOverallScore(recentMetrics),
      growthRate: avgGrowth,
      engagementRate: avgEngagement,
      revenueGrowth: avgRevenueGrowth,
      audienceGrowth: this.calculateAudienceGrowth(recentMetrics),
      contentPerformance: this.calculateContentPerformance(recentMetrics),
      trendAlignment: this.calculateTrendAlignment()
    };
  }

  private calculateOverallScore(metrics: RealTimeMetrics[]): number {
    const weights = {
      engagement: 0.3,
      growth: 0.25,
      revenue: 0.2,
      reach: 0.15,
      consistency: 0.1
    };

    const avgEngagement = metrics.reduce((sum, m) => sum + m.engagement, 0) / metrics.length;
    const avgGrowth = metrics.reduce((sum, m) => sum + m.growth, 0) / metrics.length;
    const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
    const avgReach = metrics.reduce((sum, m) => sum + m.reach, 0) / metrics.length;
    const consistency = this.calculateConsistency(metrics);

    return (
      (avgEngagement / 10) * weights.engagement * 100 +
      (avgGrowth / 10 + 0.5) * weights.growth * 100 +
      Math.min(totalRevenue / 1000, 1) * weights.revenue * 100 +
      Math.min(avgReach / 100000, 1) * weights.reach * 100 +
      consistency * weights.consistency * 100
    );
  }

  private calculateAudienceGrowth(metrics: RealTimeMetrics[]): number {
    if (metrics.length < 2) return 0;

    const first = metrics[0].followers;
    const last = metrics[metrics.length - 1].followers;

    return ((last - first) / first) * 100;
  }

  private calculateContentPerformance(metrics: RealTimeMetrics[]): number {
    const avgEngagement = metrics.reduce((sum, m) => sum + m.engagement, 0) / metrics.length;
    const avgViews = metrics.reduce((sum, m) => sum + m.views, 0) / metrics.length;

    return avgViews > 0 ? (avgEngagement * avgViews) / 100 : 0;
  }

  private calculateTrendAlignment(): number {
    // Calculate how well current performance aligns with trends
    const recentTrends = this.dashboard.trends.slice(-5);
    if (recentTrends.length === 0) return 50;

    const positiveTrends = recentTrends.filter(t => t.direction === 'up').length;
    return (positiveTrends / recentTrends.length) * 100;
  }

  private calculateConsistency(metrics: RealTimeMetrics[]): number {
    if (metrics.length < 3) return 0.5;

    const engagements = metrics.map(m => m.engagement);
    const mean = engagements.reduce((sum, e) => sum + e, 0) / engagements.length;
    const variance = engagements.reduce((sum, e) => sum + Math.pow(e - mean, 2), 0) / engagements.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation means higher consistency
    return Math.max(0, 1 - stdDev / mean);
  }

  private updateDashboard(): void {
    this.dashboard.lastUpdated = new Date();

    // Generate new recommendations periodically
    if (Math.random() < 0.1) { // 10% chance every update
      this.generateRealTimeRecommendations();
    }

    // Clean up old data
    this.cleanupOldData();
  }

  private generateRealTimeRecommendations(): void {
    const recommendations: RealTimeRecommendation[] = [];

    // Performance-based recommendations
    if (this.dashboard.performance.engagementRate < 3) {
      recommendations.push({
        id: `perf_${Date.now()}`,
        type: 'content',
        title: 'Boost Engagement',
        description: 'Try interactive content or trending challenges',
        confidence: 75,
        expectedImpact: 25,
        actionRequired: true,
        autoExecute: false,
        timestamp: new Date()
      });
    }

    // Timing-based recommendations
    const currentHour = new Date().getHours();
    if (currentHour >= 18 && currentHour <= 21) {
      recommendations.push({
        id: `time_${Date.now()}`,
        type: 'timing',
        title: 'Prime Time Posting',
        description: 'Post now for maximum audience reach',
        confidence: 85,
        expectedImpact: 30,
        actionRequired: false,
        autoExecute: true,
        timestamp: new Date()
      });
    }

    this.recommendationQueue.push(...recommendations);
    this.dashboard.recommendations = this.recommendationQueue.slice(-10);
  }

  private cleanupOldData(): void {
    const oneHourAgo = new Date(Date.now() - 3600000);

    // Clean up old metrics
    this.dashboard.metrics = this.dashboard.metrics.filter(m => m.timestamp > oneHourAgo);

    // Clean up old trends
    this.dashboard.trends = this.dashboard.trends.filter(t => t.timestamps[t.timestamps.length - 1] > oneHourAgo);

    // Clean up old alerts (keep unacknowledged)
    this.alertQueue = this.alertQueue.filter(alert =>
      !alert.acknowledged || alert.timestamp > oneHourAgo
    );
  }

  // Public API methods
  getDashboard(): RealTimeDashboard {
    return { ...this.dashboard };
  }

  getStreamStatus(): Map<string, StreamConnection> {
    return this.streamer.getStreamStatus();
  }

  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alertQueue.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  getRecentMetrics(hours: number = 1): RealTimeMetrics[] {
    const cutoff = new Date(Date.now() - hours * 3600000);
    return this.dashboard.metrics.filter(m => m.timestamp > cutoff);
  }

  getActiveTrends(): LiveTrend[] {
    return this.dashboard.trends.filter(t => t.confidence > 70);
  }

  getPendingRecommendations(): RealTimeRecommendation[] {
    return this.dashboard.recommendations.filter(r => r.actionRequired && !r.autoExecute);
  }
}

// Export singleton instances
export const realTimeDataStreamer = new RealTimeDataStreamer();
export const realTimeAnalyticsProcessor = new RealTimeAnalyticsProcessor();

// Analytics middleware for tracking HTTP requests
export function analyticsMiddleware() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();
    const sessionId = req.headers['x-session-id'] || `session_${Date.now()}_${Math.random()}`;

    // Track page view
    realTimeDataStreamer.bufferData({
      id: `pageview_${Date.now()}`,
      type: 'metric',
      data: {
        timestamp: new Date(),
        platform: 'web',
        path: req.path,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.socket?.remoteAddress,
        engagement: 1, // Basic engagement for page views
        reach: 1,
        impressions: 1,
        views: 1,
        revenue: 0,
        growth: 0
      },
      timestamp: new Date(),
      source: 'web_server',
      priority: 'low'
    });

    // Track response time
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const isError = res.statusCode >= 400;

      // Track performance metric
      realTimeDataStreamer.bufferData({
        id: `performance_${Date.now()}`,
        type: 'metric',
        data: {
          timestamp: new Date(),
          platform: 'web',
          responseTime,
          statusCode: res.statusCode,
          isError,
          path: req.path,
          engagement: isError ? 0 : 1,
          reach: 1,
          impressions: 1,
          views: 1,
          revenue: 0,
          growth: 0
        },
        timestamp: new Date(),
        source: 'web_server',
        priority: isError ? 'medium' : 'low'
      });
    });

    next();
  };
}