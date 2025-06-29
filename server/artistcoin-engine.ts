import { WebSocketServer, WebSocket } from 'ws';
import { nanoid } from 'nanoid';

interface ArtistCoinConfig {
  loginReward: number;
  engagementReward: number;
  creationReward: number;
  profitShareTier1: number; // 10% for first 100k users
  profitShareTier2: number; // 5% for first 1M users
  tier1Limit: number;
  tier2Limit: number;
}

interface UserSession {
  userId: string;
  sessionId: string;
  loginTime: Date;
  lastActivity: Date;
  activityScore: number;
  rewardsEarned: number;
}

interface SocialPlatform {
  id: string;
  name: string;
  apiEndpoint: string;
  authRequired: boolean;
  rateLimitPerHour: number;
}

interface SocialMediaFeed {
  platform: string;
  posts: SocialPost[];
  lastSync: Date;
  nextSync: Date;
}

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  mediaUrls: string[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: Date;
  isVisible: boolean;
}

export class ArtistCoinEngine {
  private coinWSS?: WebSocketServer;
  private activeSessions: Map<string, UserSession> = new Map();
  private socialFeeds: Map<string, SocialMediaFeed[]> = new Map();
  private coinConfig: ArtistCoinConfig;
  private profitSharePool: number = 0;
  private totalUsersRegistered: number = 0;

  private supportedPlatforms: SocialPlatform[] = [
    {
      id: 'tiktok',
      name: 'TikTok',
      apiEndpoint: 'https://open-api.tiktok.com',
      authRequired: true,
      rateLimitPerHour: 1000
    },
    {
      id: 'instagram',
      name: 'Instagram',
      apiEndpoint: 'https://graph.instagram.com',
      authRequired: true,
      rateLimitPerHour: 200
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      apiEndpoint: 'https://api.twitter.com/2',
      authRequired: true,
      rateLimitPerHour: 300
    },
    {
      id: 'youtube',
      name: 'YouTube',
      apiEndpoint: 'https://www.googleapis.com/youtube/v3',
      authRequired: true,
      rateLimitPerHour: 10000
    },
    {
      id: 'spotify',
      name: 'Spotify',
      apiEndpoint: 'https://api.spotify.com/v1',
      authRequired: true,
      rateLimitPerHour: 1000
    },
    {
      id: 'soundcloud',
      name: 'SoundCloud',
      apiEndpoint: 'https://api.soundcloud.com',
      authRequired: true,
      rateLimitPerHour: 15000
    }
  ];

  constructor() {
    this.coinConfig = {
      loginReward: 10, // 10 ArtistCoins per day
      engagementReward: 0.1, // 0.1 per minute of activity
      creationReward: 50, // 50 coins per content creation
      profitShareTier1: 10, // 10% profit share
      profitShareTier2: 5, // 5% profit share
      tier1Limit: 100000,
      tier2Limit: 1000000
    };

    this.initializeEngine();
  }

  private async initializeEngine() {
    console.log('🪙 Initializing ArtistCoin Engine...');
    await this.setupCoinServer();
    await this.initializeProfitSharing();
    this.startRewardDistribution();
    console.log('💰 ArtistCoin Engine initialized - Crypto rewards active');
  }

  private setupCoinServer() {
    try {
      this.coinWSS = new WebSocketServer({ port: 8120 });
      console.log('🪙 ArtistCoin server started on port 8120');

      this.coinWSS.on('connection', (ws: WebSocket) => {
        ws.on('message', (data: Buffer) => {
          try {
            const message = JSON.parse(data.toString());
            this.handleCoinMessage(ws, message);
          } catch (error) {
            console.error('Error parsing coin message:', error);
          }
        });

        ws.on('close', () => {
          // Handle session cleanup
        });
      });
    } catch (error) {
      console.error('Failed to start ArtistCoin server:', error);
    }
  }

  private async initializeProfitSharing() {
    console.log('📊 Initializing profit sharing system...');
    
    // Calculate current profit share distribution
    const tier1Users = Math.min(this.totalUsersRegistered, this.coinConfig.tier1Limit);
    const tier2Users = Math.min(
      Math.max(this.totalUsersRegistered - this.coinConfig.tier1Limit, 0),
      this.coinConfig.tier2Limit
    );

    console.log(`💎 Profit sharing active:`);
    console.log(`   Tier 1 (10%): ${tier1Users.toLocaleString()} / ${this.coinConfig.tier1Limit.toLocaleString()} users`);
    console.log(`   Tier 2 (5%): ${tier2Users.toLocaleString()} / ${this.coinConfig.tier2Limit.toLocaleString()} users`);
  }

  private startRewardDistribution() {
    // Distribute login rewards every minute
    setInterval(() => {
      this.distributeActiveRewards();
    }, 60000);

    // Calculate and distribute profit shares daily
    setInterval(() => {
      this.distributeProfitShares();
    }, 24 * 60 * 60 * 1000);
  }

  private handleCoinMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'start_session':
        this.handleStartSession(ws, message);
        break;
      case 'log_activity':
        this.handleLogActivity(ws, message);
        break;
      case 'connect_social':
        this.handleConnectSocial(ws, message);
        break;
      case 'sync_social_feed':
        this.handleSyncSocialFeed(ws, message);
        break;
      case 'create_content':
        this.handleCreateContent(ws, message);
        break;
      case 'get_wallet_balance':
        this.handleGetWalletBalance(ws, message);
        break;
      case 'get_profit_share_status':
        this.handleGetProfitShareStatus(ws, message);
        break;
      default:
        console.log('Unknown coin message type:', message.type);
    }
  }

  private async handleStartSession(ws: WebSocket, message: any) {
    const { userId } = message;
    const sessionId = nanoid();

    const session: UserSession = {
      userId,
      sessionId,
      loginTime: new Date(),
      lastActivity: new Date(),
      activityScore: 0,
      rewardsEarned: 0
    };

    this.activeSessions.set(sessionId, session);

    // Award login reward
    const loginReward = await this.awardLoginReward(userId);

    ws.send(JSON.stringify({
      type: 'session_started',
      sessionId,
      loginReward,
      message: `Welcome! You earned ${loginReward} ArtistCoins for logging in today! 🪙`
    }));
  }

  private async handleLogActivity(ws: WebSocket, message: any) {
    const { sessionId, activityType, duration } = message;
    const session = this.activeSessions.get(sessionId);

    if (!session) return;

    session.lastActivity = new Date();
    session.activityScore += duration || 1;

    // Calculate engagement reward
    const engagementReward = (duration || 1) * this.coinConfig.engagementReward;
    session.rewardsEarned += engagementReward;

    await this.addToWallet(session.userId, engagementReward, 'engagement_reward');

    ws.send(JSON.stringify({
      type: 'activity_logged',
      reward: engagementReward,
      totalSessionRewards: session.rewardsEarned
    }));
  }

  private async handleConnectSocial(ws: WebSocket, message: any) {
    const { userId, platform, authCode } = message;

    try {
      // Simulate OAuth flow - in production, this would handle real OAuth
      const connection = await this.createSocialConnection(userId, platform, authCode);
      
      ws.send(JSON.stringify({
        type: 'social_connected',
        platform,
        success: true,
        followerCount: connection.followerCount,
        message: `${platform} connected successfully! 📱`
      }));

      // Award connection bonus
      await this.addToWallet(userId, 25, 'social_connection');

    } catch (error) {
      ws.send(JSON.stringify({
        type: 'social_connection_error',
        platform,
        error: 'Failed to connect social media account'
      }));
    }
  }

  private async handleSyncSocialFeed(ws: WebSocket, message: any) {
    const { userId } = message;

    try {
      const feeds = await this.syncAllSocialFeeds(userId);
      
      ws.send(JSON.stringify({
        type: 'social_feeds_synced',
        feeds: feeds.map(feed => ({
          platform: feed.platform,
          postCount: feed.posts.length,
          lastSync: feed.lastSync
        }))
      }));

    } catch (error) {
      ws.send(JSON.stringify({
        type: 'sync_error',
        error: 'Failed to sync social media feeds'
      }));
    }
  }

  private async handleCreateContent(ws: WebSocket, message: any) {
    const { userId, contentType } = message;

    // Award creation reward
    const creationReward = this.coinConfig.creationReward;
    await this.addToWallet(userId, creationReward, 'creation_reward');

    ws.send(JSON.stringify({
      type: 'content_created',
      reward: creationReward,
      message: `Great work! You earned ${creationReward} ArtistCoins for creating content! 🎨`
    }));
  }

  private async handleGetWalletBalance(ws: WebSocket, message: any) {
    const { userId } = message;
    const balance = await this.getWalletBalance(userId);
    const profitShareStatus = await this.getProfitShareStatus(userId);

    ws.send(JSON.stringify({
      type: 'wallet_balance',
      balance,
      profitShareStatus
    }));
  }

  private async handleGetProfitShareStatus(ws: WebSocket, message: any) {
    const { userId } = message;
    const status = await this.getProfitShareStatus(userId);

    ws.send(JSON.stringify({
      type: 'profit_share_status',
      ...status
    }));
  }

  private async awardLoginReward(userId: string): Promise<number> {
    // Check if user already got login reward today
    const today = new Date().toDateString();
    // In production, check database for last login reward date
    
    const reward = this.coinConfig.loginReward;
    await this.addToWallet(userId, reward, 'login_reward');
    return reward;
  }

  private async addToWallet(userId: string, amount: number, type: string) {
    // In production, this would update the database
    console.log(`💰 Adding ${amount} ArtistCoins to user ${userId} for ${type}`);
  }

  private async getWalletBalance(userId: string): Promise<number> {
    // In production, fetch from database
    return Math.floor(Math.random() * 1000) + 100; // Mock balance
  }

  private async getProfitShareStatus(userId: string) {
    const userRegistrationNumber = Math.floor(Math.random() * 150000) + 1;
    
    let tier = 0;
    let sharePercentage = 0;
    
    if (userRegistrationNumber <= this.coinConfig.tier1Limit) {
      tier = 1;
      sharePercentage = this.coinConfig.profitShareTier1;
    } else if (userRegistrationNumber <= this.coinConfig.tier2Limit) {
      tier = 2;
      sharePercentage = this.coinConfig.profitShareTier2;
    }

    return {
      eligible: tier > 0,
      tier,
      sharePercentage,
      registrationNumber: userRegistrationNumber,
      monthlyProfitShare: tier > 0 ? Math.floor(Math.random() * 500) + 100 : 0
    };
  }

  private async createSocialConnection(userId: string, platform: string, authCode: string) {
    // Simulate social media connection
    return {
      platform,
      connected: true,
      followerCount: Math.floor(Math.random() * 10000) + 100
    };
  }

  private async syncAllSocialFeeds(userId: string): Promise<SocialMediaFeed[]> {
    const feeds: SocialMediaFeed[] = [];

    for (const platform of this.supportedPlatforms) {
      const posts = await this.fetchPlatformPosts(userId, platform.id);
      feeds.push({
        platform: platform.id,
        posts,
        lastSync: new Date(),
        nextSync: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      });
    }

    this.socialFeeds.set(userId, feeds);
    return feeds;
  }

  private async fetchPlatformPosts(userId: string, platform: string): Promise<SocialPost[]> {
    // Simulate fetching posts from each platform
    const posts: SocialPost[] = [];
    const postCount = Math.floor(Math.random() * 10) + 5;

    for (let i = 0; i < postCount; i++) {
      posts.push({
        id: nanoid(),
        platform,
        content: `Sample ${platform} post content #${i + 1}`,
        mediaUrls: [`https://example.com/${platform}/media${i}.jpg`],
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 5000),
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        isVisible: true
      });
    }

    return posts;
  }

  private distributeActiveRewards() {
    for (const [sessionId, session] of this.activeSessions) {
      const timeSinceLastActivity = Date.now() - session.lastActivity.getTime();
      
      // Only reward if user was active in last 5 minutes
      if (timeSinceLastActivity < 5 * 60 * 1000) {
        const reward = this.coinConfig.engagementReward;
        session.rewardsEarned += reward;
        this.addToWallet(session.userId, reward, 'activity_reward');
      }
    }
  }

  private async distributeProfitShares() {
    console.log('💎 Distributing daily profit shares...');
    
    // Calculate total platform revenue (mock)
    const dailyRevenue = Math.floor(Math.random() * 100000) + 50000;
    this.profitSharePool = dailyRevenue * 0.15; // 15% of revenue goes to profit sharing

    console.log(`📈 Daily revenue: $${dailyRevenue.toLocaleString()}`);
    console.log(`💰 Profit share pool: $${this.profitSharePool.toLocaleString()}`);
  }

  async getSocialMediaFeed(userId: string): Promise<SocialMediaFeed[]> {
    return this.socialFeeds.get(userId) || [];
  }

  async getActiveUserStats() {
    return {
      activeSessions: this.activeSessions.size,
      totalRewardsDistributed: Array.from(this.activeSessions.values())
        .reduce((sum, session) => sum + session.rewardsEarned, 0),
      profitSharePool: this.profitSharePool,
      supportedPlatforms: this.supportedPlatforms.length
    };
  }

  getEngineStatus() {
    return {
      status: 'active',
      activeSessions: this.activeSessions.size,
      supportedPlatforms: this.supportedPlatforms.map(p => p.name),
      profitSharePool: this.profitSharePool,
      coinConfig: this.coinConfig
    };
  }
}

export const artistCoinEngine = new ArtistCoinEngine();