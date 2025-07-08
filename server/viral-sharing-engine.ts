
import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';

interface SongShare {
  id: string;
  songId: string;
  originalSharerId: string;
  shareUrl: string;
  platform: string;
  timestamp: Date;
  trackingCode: string;
  parentShareId?: string; // For tracking share chains
  metadata: {
    songTitle: string;
    artist: string;
    originalUploader: string;
  };
}

interface ShareStats {
  shareId: string;
  clicks: number;
  conversions: number;
  secondaryShares: number;
  totalReach: number;
  earnings: number;
  viralScore: number;
  lastUpdate: Date;
}

interface ViralBonus {
  id: string;
  shareId: string;
  userId: string;
  bonusType: 'viral_threshold' | 'mega_viral' | 'legendary_viral';
  threshold: number;
  bonus: number;
  awarded: boolean;
  timestamp: Date;
}

interface ShareChain {
  originalShareId: string;
  shares: SongShare[];
  totalReach: number;
  totalEarnings: number;
  chainLength: number;
  viralLevel: 'normal' | 'viral' | 'mega_viral' | 'legendary';
}

interface PlatformMetrics {
  platform: string;
  totalShares: number;
  totalClicks: number;
  conversionRate: number;
  averageEarnings: number;
  topPerformers: string[];
}

export class ViralSharingEngine extends EventEmitter {
  private sharingWSS?: WebSocketServer;
  private songShares: Map<string, SongShare> = new Map();
  private shareStats: Map<string, ShareStats> = new Map();
  private shareChains: Map<string, ShareChain> = new Map();
  private viralBonuses: Map<string, ViralBonus[]> = new Map();
  private platformMetrics: Map<string, PlatformMetrics> = new Map();
  private userShares: Map<string, string[]> = new Map(); // userId -> shareIds

  constructor() {
    super();
    this.initializeViralSharing();
  }

  private async initializeViralSharing() {
    console.log('🔥 Initializing Viral Song Sharing Engine...');
    
    this.setupSharingWebSocket();
    this.initializePlatformMetrics();
    this.startViralTracking();
    this.setupRewardCalculation();
    
    console.log('🎵 Viral Sharing Engine ready - Track every share, reward every viral moment!');
  }

  private setupSharingWebSocket() {
    this.sharingWSS = new WebSocketServer({ port: 8210 });
    
    this.sharingWSS.on('connection', (ws: WebSocket) => {
      console.log('📱 New user connected to viral sharing system');
      
      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleSharingAction(ws, data);
        } catch (error) {
          console.error('Error handling sharing action:', error);
        }
      });
    });
  }

  private initializePlatformMetrics() {
    const platforms = ['tiktok', 'instagram', 'twitter', 'facebook', 'youtube', 'whatsapp', 'telegram'];
    
    platforms.forEach(platform => {
      this.platformMetrics.set(platform, {
        platform,
        totalShares: 0,
        totalClicks: 0,
        conversionRate: 0,
        averageEarnings: 0,
        topPerformers: []
      });
    });
  }

  private startViralTracking() {
    // Check for viral milestones every 30 seconds
    setInterval(() => {
      this.checkViralMilestones();
    }, 30000);

    // Update share statistics every minute
    setInterval(() => {
      this.updateShareStatistics();
    }, 60000);

    // Calculate daily rewards
    setInterval(() => {
      this.calculateDailyRewards();
    }, 24 * 60 * 60 * 1000);
  }

  private setupRewardCalculation() {
    // Base rewards per action
    this.rewardRates = {
      share: 5, // 5 AC per share
      click: 1, // 1 AC per click on your share
      conversion: 10, // 10 AC when someone follows/subscribes from your share
      secondary_share: 15, // 15 AC when someone shares from your share
      viral_bonus_1k: 100, // 100 AC bonus at 1K clicks
      viral_bonus_10k: 500, // 500 AC bonus at 10K clicks
      viral_bonus_100k: 2500, // 2500 AC bonus at 100K clicks
      viral_bonus_1m: 10000 // 10K AC bonus at 1M clicks
    };
  }

  async createSongShare(data: {
    songId: string;
    userId: string;
    platform: string;
    songTitle: string;
    artist: string;
    originalUploader: string;
    parentShareId?: string;
  }): Promise<SongShare> {
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const trackingCode = this.generateTrackingCode();
    
    const songShare: SongShare = {
      id: shareId,
      songId: data.songId,
      originalSharerId: data.userId,
      shareUrl: `https://artisttech.io/song/${data.songId}?share=${trackingCode}`,
      platform: data.platform,
      timestamp: new Date(),
      trackingCode,
      parentShareId: data.parentShareId,
      metadata: {
        songTitle: data.songTitle,
        artist: data.artist,
        originalUploader: data.originalUploader
      }
    };

    // Store the share
    this.songShares.set(shareId, songShare);
    
    // Initialize stats
    this.shareStats.set(shareId, {
      shareId,
      clicks: 0,
      conversions: 0,
      secondaryShares: 0,
      totalReach: 0,
      earnings: 0,
      viralScore: 0,
      lastUpdate: new Date()
    });

    // Track user shares
    if (!this.userShares.has(data.userId)) {
      this.userShares.set(data.userId, []);
    }
    this.userShares.get(data.userId)!.push(shareId);

    // Update share chain
    if (data.parentShareId) {
      this.updateShareChain(shareId, data.parentShareId);
    } else {
      // Create new share chain
      this.shareChains.set(shareId, {
        originalShareId: shareId,
        shares: [songShare],
        totalReach: 0,
        totalEarnings: 0,
        chainLength: 1,
        viralLevel: 'normal'
      });
    }

    // Reward the sharer
    await this.rewardUser(data.userId, this.rewardRates.share, 'share_created');

    console.log(`📤 Share created: ${songShare.metadata.songTitle} by ${data.userId} on ${data.platform}`);
    return songShare;
  }

  async trackShareClick(trackingCode: string, clickData: {
    userId?: string;
    userAgent: string;
    referrer: string;
    location: string;
  }): Promise<void> {
    const share = this.findShareByTrackingCode(trackingCode);
    if (!share) return;

    const stats = this.shareStats.get(share.id);
    if (!stats) return;

    // Update click count
    stats.clicks++;
    stats.totalReach++;
    stats.lastUpdate = new Date();

    // Reward the original sharer
    await this.rewardUser(share.originalSharerId, this.rewardRates.click, 'share_click');
    stats.earnings += this.rewardRates.click;

    // Update platform metrics
    this.updatePlatformMetrics(share.platform, 'click');

    // Check for viral milestones
    this.checkShareViralMilestone(share.id, stats.clicks);

    console.log(`👆 Click tracked: ${share.metadata.songTitle} (${stats.clicks} total clicks)`);
  }

  async trackConversion(trackingCode: string, conversionType: 'follow' | 'subscribe' | 'purchase'): Promise<void> {
    const share = this.findShareByTrackingCode(trackingCode);
    if (!share) return;

    const stats = this.shareStats.get(share.id);
    if (!stats) return;

    stats.conversions++;
    stats.lastUpdate = new Date();

    // Reward the sharer with conversion bonus
    await this.rewardUser(share.originalSharerId, this.rewardRates.conversion, `conversion_${conversionType}`);
    stats.earnings += this.rewardRates.conversion;

    // Update platform metrics
    this.updatePlatformMetrics(share.platform, 'conversion');

    console.log(`💰 Conversion tracked: ${conversionType} from ${share.metadata.songTitle}`);
  }

  async trackSecondaryShare(originalTrackingCode: string, newShareData: {
    userId: string;
    platform: string;
  }): Promise<SongShare> {
    const originalShare = this.findShareByTrackingCode(originalTrackingCode);
    if (!originalShare) throw new Error('Original share not found');

    // Create secondary share
    const secondaryShare = await this.createSongShare({
      songId: originalShare.songId,
      userId: newShareData.userId,
      platform: newShareData.platform,
      songTitle: originalShare.metadata.songTitle,
      artist: originalShare.metadata.artist,
      originalUploader: originalShare.metadata.originalUploader,
      parentShareId: originalShare.id
    });

    // Update original share stats
    const originalStats = this.shareStats.get(originalShare.id);
    if (originalStats) {
      originalStats.secondaryShares++;
      originalStats.totalReach += 10; // Estimated reach multiplier
      originalStats.lastUpdate = new Date();

      // Reward original sharer for secondary share
      await this.rewardUser(originalShare.originalSharerId, this.rewardRates.secondary_share, 'secondary_share');
      originalStats.earnings += this.rewardRates.secondary_share;
    }

    console.log(`🔄 Secondary share created: ${originalShare.metadata.songTitle}`);
    return secondaryShare;
  }

  private updateShareChain(newShareId: string, parentShareId: string) {
    const newShare = this.songShares.get(newShareId);
    if (!newShare) return;

    // Find the original share chain
    let chainKey = parentShareId;
    for (const [key, chain] of this.shareChains.entries()) {
      if (chain.shares.some(share => share.id === parentShareId)) {
        chainKey = key;
        break;
      }
    }

    const chain = this.shareChains.get(chainKey);
    if (chain) {
      chain.shares.push(newShare);
      chain.chainLength++;
      chain.totalReach += 10; // Base reach for new share

      // Update viral level based on chain length
      if (chain.chainLength >= 100) chain.viralLevel = 'legendary';
      else if (chain.chainLength >= 50) chain.viralLevel = 'mega_viral';
      else if (chain.chainLength >= 10) chain.viralLevel = 'viral';
    }
  }

  private checkShareViralMilestone(shareId: string, clicks: number) {
    const milestones = [
      { threshold: 1000, bonus: this.rewardRates.viral_bonus_1k, type: 'viral_threshold' },
      { threshold: 10000, bonus: this.rewardRates.viral_bonus_10k, type: 'mega_viral' },
      { threshold: 100000, bonus: this.rewardRates.viral_bonus_100k, type: 'mega_viral' },
      { threshold: 1000000, bonus: this.rewardRates.viral_bonus_1m, type: 'legendary_viral' }
    ];

    const share = this.songShares.get(shareId);
    if (!share) return;

    for (const milestone of milestones) {
      if (clicks >= milestone.threshold) {
        const existingBonuses = this.viralBonuses.get(shareId) || [];
        const alreadyAwarded = existingBonuses.some(bonus => 
          bonus.threshold === milestone.threshold && bonus.awarded
        );

        if (!alreadyAwarded) {
          const viralBonus: ViralBonus = {
            id: `bonus_${Date.now()}_${shareId}`,
            shareId,
            userId: share.originalSharerId,
            bonusType: milestone.type as any,
            threshold: milestone.threshold,
            bonus: milestone.bonus,
            awarded: true,
            timestamp: new Date()
          };

          if (!this.viralBonuses.has(shareId)) {
            this.viralBonuses.set(shareId, []);
          }
          this.viralBonuses.get(shareId)!.push(viralBonus);

          // Award the bonus
          this.rewardUser(share.originalSharerId, milestone.bonus, `viral_bonus_${milestone.threshold}`);

          // Broadcast viral achievement
          this.broadcastViralAchievement(share, milestone.threshold, milestone.bonus);

          console.log(`🔥 VIRAL MILESTONE: ${share.metadata.songTitle} hit ${milestone.threshold} clicks! Bonus: ${milestone.bonus} AC`);
        }
      }
    }
  }

  private checkViralMilestones() {
    // Check all active shares for viral milestones
    for (const [shareId, stats] of this.shareStats.entries()) {
      this.checkShareViralMilestone(shareId, stats.clicks);
    }
  }

  private updateShareStatistics() {
    // Update viral scores and platform metrics
    for (const [shareId, stats] of this.shareStats.entries()) {
      const share = this.songShares.get(shareId);
      if (!share) continue;

      // Calculate viral score based on engagement
      const ageInHours = (Date.now() - share.timestamp.getTime()) / (1000 * 60 * 60);
      const clicksPerHour = stats.clicks / Math.max(ageInHours, 1);
      const conversionRate = stats.clicks > 0 ? stats.conversions / stats.clicks : 0;
      const shareRate = stats.clicks > 0 ? stats.secondaryShares / stats.clicks : 0;

      stats.viralScore = (clicksPerHour * 10) + (conversionRate * 100) + (shareRate * 200);
    }
  }

  private calculateDailyRewards() {
    // Calculate and distribute daily performance bonuses
    const topShares = Array.from(this.shareStats.entries())
      .sort(([,a], [,b]) => b.viralScore - a.viralScore)
      .slice(0, 10);

    topShares.forEach(([shareId, stats], index) => {
      const share = this.songShares.get(shareId);
      if (share) {
        const bonus = Math.floor((11 - index) * 50); // 500 AC for #1, 450 for #2, etc.
        this.rewardUser(share.originalSharerId, bonus, `daily_top_${index + 1}`);
      }
    });
  }

  private updatePlatformMetrics(platform: string, action: 'share' | 'click' | 'conversion') {
    const metrics = this.platformMetrics.get(platform);
    if (!metrics) return;

    switch (action) {
      case 'share':
        metrics.totalShares++;
        break;
      case 'click':
        metrics.totalClicks++;
        break;
      case 'conversion':
        // Update conversion rate
        metrics.conversionRate = metrics.totalClicks > 0 ? 
          (metrics.conversionRate * metrics.totalClicks + 1) / (metrics.totalClicks + 1) : 1;
        break;
    }
  }

  private findShareByTrackingCode(trackingCode: string): SongShare | undefined {
    for (const share of this.songShares.values()) {
      if (share.trackingCode === trackingCode) {
        return share;
      }
    }
    return undefined;
  }

  private generateTrackingCode(): string {
    return Math.random().toString(36).substr(2, 12).toUpperCase();
  }

  private async rewardUser(userId: string, amount: number, reason: string) {
    // This would integrate with your existing ArtistCoin system
    console.log(`💰 Rewarding ${userId}: ${amount} AC for ${reason}`);
    
    // Broadcast reward to user
    this.broadcastToUser(userId, {
      type: 'reward_earned',
      amount,
      reason,
      timestamp: new Date()
    });
  }

  private broadcastViralAchievement(share: SongShare, milestone: number, bonus: number) {
    const achievement = {
      type: 'viral_achievement',
      shareId: share.id,
      songTitle: share.metadata.songTitle,
      artist: share.metadata.artist,
      milestone,
      bonus,
      userId: share.originalSharerId,
      timestamp: new Date()
    };

    // Broadcast to all connected users
    if (this.sharingWSS) {
      this.sharingWSS.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(achievement));
        }
      });
    }
  }

  private broadcastToUser(userId: string, data: any) {
    if (this.sharingWSS) {
      this.sharingWSS.clients.forEach(client => {
        // In a real implementation, you'd track which client belongs to which user
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ ...data, userId }));
        }
      });
    }
  }

  private handleSharingAction(ws: WebSocket, data: any) {
    switch (data.type) {
      case 'create_share':
        this.handleCreateShare(ws, data);
        break;
      case 'track_click':
        this.handleTrackClick(ws, data);
        break;
      case 'track_conversion':
        this.handleTrackConversion(ws, data);
        break;
      case 'create_secondary_share':
        this.handleSecondaryShare(ws, data);
        break;
      case 'get_user_shares':
        this.handleGetUserShares(ws, data);
        break;
      case 'get_share_stats':
        this.handleGetShareStats(ws, data);
        break;
    }
  }

  private async handleCreateShare(ws: WebSocket, data: any) {
    try {
      const share = await this.createSongShare(data);
      ws.send(JSON.stringify({
        type: 'share_created',
        share,
        shareUrl: share.shareUrl
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to create share: ${error}`
      }));
    }
  }

  private async handleTrackClick(ws: WebSocket, data: any) {
    await this.trackShareClick(data.trackingCode, data.clickData);
    ws.send(JSON.stringify({
      type: 'click_tracked',
      trackingCode: data.trackingCode
    }));
  }

  private async handleTrackConversion(ws: WebSocket, data: any) {
    await this.trackConversion(data.trackingCode, data.conversionType);
    ws.send(JSON.stringify({
      type: 'conversion_tracked',
      trackingCode: data.trackingCode,
      conversionType: data.conversionType
    }));
  }

  private async handleSecondaryShare(ws: WebSocket, data: any) {
    try {
      const secondaryShare = await this.trackSecondaryShare(data.originalTrackingCode, data.newShareData);
      ws.send(JSON.stringify({
        type: 'secondary_share_created',
        share: secondaryShare
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to create secondary share: ${error}`
      }));
    }
  }

  private handleGetUserShares(ws: WebSocket, data: any) {
    const userShareIds = this.userShares.get(data.userId) || [];
    const userShares = userShareIds.map(shareId => {
      const share = this.songShares.get(shareId);
      const stats = this.shareStats.get(shareId);
      return { share, stats };
    }).filter(item => item.share && item.stats);

    ws.send(JSON.stringify({
      type: 'user_shares',
      shares: userShares
    }));
  }

  private handleGetShareStats(ws: WebSocket, data: any) {
    const stats = this.shareStats.get(data.shareId);
    const share = this.songShares.get(data.shareId);
    const bonuses = this.viralBonuses.get(data.shareId) || [];

    ws.send(JSON.stringify({
      type: 'share_stats',
      share,
      stats,
      bonuses
    }));
  }

  // Public API methods
  getUserShares(userId: string) {
    const userShareIds = this.userShares.get(userId) || [];
    return userShareIds.map(shareId => ({
      share: this.songShares.get(shareId),
      stats: this.shareStats.get(shareId)
    })).filter(item => item.share && item.stats);
  }

  getTopPerformingShares(limit: number = 10) {
    return Array.from(this.shareStats.entries())
      .map(([shareId, stats]) => ({
        share: this.songShares.get(shareId),
        stats
      }))
      .filter(item => item.share)
      .sort((a, b) => b.stats.viralScore - a.stats.viralScore)
      .slice(0, limit);
  }

  getShareChain(shareId: string) {
    return this.shareChains.get(shareId);
  }

  getPlatformMetrics() {
    return Array.from(this.platformMetrics.values());
  }

  getEngineStatus() {
    return {
      engine: 'Viral Song Sharing Engine',
      version: '1.0.0',
      totalShares: this.songShares.size,
      totalEarnings: Array.from(this.shareStats.values())
        .reduce((sum, stats) => sum + stats.earnings, 0),
      totalClicks: Array.from(this.shareStats.values())
        .reduce((sum, stats) => sum + stats.clicks, 0),
      activeChains: this.shareChains.size,
      viralBonuses: Array.from(this.viralBonuses.values())
        .reduce((sum, bonuses) => sum + bonuses.length, 0),
      features: [
        'Multi-Level Share Tracking',
        'Viral Milestone Bonuses',
        'Real-Time Click Analytics',
        'Platform Performance Metrics',
        'Share Chain Visualization',
        'Automatic Reward Distribution',
        'Secondary Share Rewards',
        'Daily Top Performer Bonuses'
      ]
    };
  }
}

export const viralSharingEngine = new ViralSharingEngine();
