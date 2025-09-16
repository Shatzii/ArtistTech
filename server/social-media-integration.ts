import axios, { AxiosInstance } from 'axios';
import { logger } from './monitoring';

// Social Media API Client Interface
interface SocialMediaClient {
  getProfile(handle: string): Promise<SocialProfile>;
  getMetrics(handle: string): Promise<SocialMetrics>;
  getContent(handle: string, limit?: number): Promise<ContentItem[]>;
  getAnalytics(handle: string, timeframe?: string): Promise<AnalyticsData>;
}

// Social Media Data Types
export interface SocialProfile {
  handle: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  profileImage: string;
  verified: boolean;
  platform: string;
}

export interface SocialMetrics {
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  avgLikes: number;
  avgComments: number;
  avgShares: number;
  avgViews: number;
  reach: number;
  impressions: number;
  profileVisits: number;
  websiteClicks: number;
  growthRate: number;
  lastUpdated: Date;
}

export interface ContentItem {
  id: string;
  type: 'post' | 'reel' | 'video' | 'story';
  title?: string;
  description?: string;
  postedAt: Date;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  reach: number;
  impressions: number;
  saves: number;
  hashtags: string[];
  mentions: string[];
  mediaUrls: string[];
  engagement: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  trending: boolean;
}

export interface AnalyticsData {
  timeframe: string;
  totalViews: number;
  totalEngagement: number;
  topPerformingContent: ContentItem[];
  audienceDemographics: {
    age: { [key: string]: number };
    gender: { [key: string]: number };
    location: { [key: string]: number };
  };
  optimalPostingTimes: string[];
  trendingHashtags: string[];
  competitorAnalysis: {
    competitors: string[];
    avgEngagement: number;
    avgGrowth: number;
  };
}

// Instagram API Client
export class InstagramClient implements SocialMediaClient {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: 'https://graph.instagram.com',
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getProfile(handle: string): Promise<SocialProfile> {
    try {
      // Note: Instagram Basic Display API requires user ID, not handle
      // This is a simplified implementation
      const response = await this.client.get(`/me?fields=id,username,biography,followers_count,follows_count,media_count,profile_picture_url`);

      return {
        handle: response.data.username,
        name: response.data.username,
        bio: response.data.biography || '',
        followers: response.data.followers_count || 0,
        following: response.data.follows_count || 0,
        posts: response.data.media_count || 0,
        profileImage: response.data.profile_picture_url || '',
        verified: false, // Instagram API doesn't provide this
        platform: 'instagram'
      };
    } catch (error) {
      logger.error('Instagram API error:', error);
      throw new Error('Failed to fetch Instagram profile');
    }
  }

  async getMetrics(handle: string): Promise<SocialMetrics> {
    try {
      const profile = await this.getProfile(handle);
      const content = await this.getContent(handle, 20);

      // Calculate metrics from content
      const totalLikes = content.reduce((sum, item) => sum + item.likes, 0);
      const totalComments = content.reduce((sum, item) => sum + item.comments, 0);
      const totalViews = content.reduce((sum, item) => sum + item.views, 0);
      const totalEngagement = content.reduce((sum, item) => sum + item.engagement, 0);

      return {
        followers: profile.followers,
        following: profile.following,
        posts: profile.posts,
        engagement: content.length > 0 ? totalEngagement / content.length : 0,
        avgLikes: content.length > 0 ? totalLikes / content.length : 0,
        avgComments: content.length > 0 ? totalComments / content.length : 0,
        avgShares: 0, // Instagram API doesn't provide shares
        avgViews: content.length > 0 ? totalViews / content.length : 0,
        reach: 0, // Would need Business API
        impressions: 0, // Would need Business API
        profileVisits: 0, // Would need Business API
        websiteClicks: 0, // Would need Business API
        growthRate: 0, // Would need historical data
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('Instagram metrics error:', error);
      throw error;
    }
  }

  async getContent(handle: string, limit: number = 10): Promise<ContentItem[]> {
    try {
      const response = await this.client.get(`/me/media?fields=id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count&limit=${limit}`);

      return response.data.data.map((item: any) => ({
        id: item.id,
        type: item.media_type === 'VIDEO' ? 'video' : item.media_type === 'CAROUSEL_ALBUM' ? 'post' : 'post',
        description: item.caption || '',
        postedAt: new Date(item.timestamp),
        likes: item.like_count || 0,
        comments: item.comments_count || 0,
        shares: 0, // Instagram API doesn't provide shares
        views: 0, // Would need video insights
        reach: 0,
        impressions: 0,
        saves: 0,
        hashtags: this.extractHashtags(item.caption || ''),
        mentions: this.extractMentions(item.caption || ''),
        mediaUrls: item.media_url ? [item.media_url] : [],
        engagement: this.calculateEngagement(item.like_count || 0, item.comments_count || 0, 0),
        sentiment: 'neutral', // Would need NLP analysis
        trending: false
      }));
    } catch (error) {
      logger.error('Instagram content error:', error);
      throw error;
    }
  }

  async getAnalytics(handle: string, timeframe: string = '30d'): Promise<AnalyticsData> {
    // Instagram Basic Display API doesn't provide analytics
    // This would require Instagram Business API
    return {
      timeframe,
      totalViews: 0,
      totalEngagement: 0,
      topPerformingContent: [],
      audienceDemographics: { age: {}, gender: {}, location: {} },
      optimalPostingTimes: [],
      trendingHashtags: [],
      competitorAnalysis: { competitors: [], avgEngagement: 0, avgGrowth: 0 }
    };
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
  }

  private extractMentions(text: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(mention => mention.slice(1)) : [];
  }

  private calculateEngagement(likes: number, comments: number, shares: number): number {
    const totalInteractions = likes + comments + shares;
    return totalInteractions > 0 ? (totalInteractions / 100) * 100 : 0; // Simplified calculation
  }
}

// TikTok API Client
export class TikTokClient implements SocialMediaClient {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: 'https://open-api.tiktok.com',
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getProfile(handle: string): Promise<SocialProfile> {
    try {
      // TikTok API requires user ID, not handle
      // This is a simplified implementation
      const response = await this.client.get('/user/info/');

      return {
        handle,
        name: response.data?.display_name || handle,
        bio: response.data?.bio_description || '',
        followers: response.data?.follower_count || 0,
        following: response.data?.following_count || 0,
        posts: response.data?.video_count || 0,
        profileImage: response.data?.avatar_url || '',
        verified: response.data?.is_verified || false,
        platform: 'tiktok'
      };
    } catch (error) {
      logger.error('TikTok API error:', error);
      throw new Error('Failed to fetch TikTok profile');
    }
  }

  async getMetrics(handle: string): Promise<SocialMetrics> {
    try {
      const profile = await this.getProfile(handle);
      const content = await this.getContent(handle, 20);

      const totalLikes = content.reduce((sum, item) => sum + item.likes, 0);
      const totalComments = content.reduce((sum, item) => sum + item.comments, 0);
      const totalShares = content.reduce((sum, item) => sum + item.shares, 0);
      const totalViews = content.reduce((sum, item) => sum + item.views, 0);
      const totalEngagement = content.reduce((sum, item) => sum + item.engagement, 0);

      return {
        followers: profile.followers,
        following: profile.following,
        posts: profile.posts,
        engagement: content.length > 0 ? totalEngagement / content.length : 0,
        avgLikes: content.length > 0 ? totalLikes / content.length : 0,
        avgComments: content.length > 0 ? totalComments / content.length : 0,
        avgShares: content.length > 0 ? totalShares / content.length : 0,
        avgViews: content.length > 0 ? totalViews / content.length : 0,
        reach: 0,
        impressions: 0,
        profileVisits: 0,
        websiteClicks: 0,
        growthRate: 0,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('TikTok metrics error:', error);
      throw error;
    }
  }

  async getContent(handle: string, limit: number = 10): Promise<ContentItem[]> {
    try {
      const response = await this.client.get('/user/videos/');

      return response.data?.videos?.slice(0, limit).map((item: any) => ({
        id: item.id,
        type: 'video',
        description: item.desc || '',
        postedAt: new Date(item.create_time * 1000),
        likes: item.stats?.digg_count || 0,
        comments: item.stats?.comment_count || 0,
        shares: item.stats?.share_count || 0,
        views: item.stats?.play_count || 0,
        reach: 0,
        impressions: 0,
        saves: 0,
        hashtags: this.extractHashtags(item.desc || ''),
        mentions: this.extractMentions(item.desc || ''),
        mediaUrls: [item.video?.play_addr || ''],
        engagement: this.calculateEngagement(
          item.stats?.digg_count || 0,
          item.stats?.comment_count || 0,
          item.stats?.share_count || 0
        ),
        sentiment: 'neutral',
        trending: false
      })) || [];
    } catch (error) {
      logger.error('TikTok content error:', error);
      throw error;
    }
  }

  async getAnalytics(handle: string, timeframe: string = '30d'): Promise<AnalyticsData> {
    // TikTok API analytics would require Research API or Creator Fund access
    return {
      timeframe,
      totalViews: 0,
      totalEngagement: 0,
      topPerformingContent: [],
      audienceDemographics: { age: {}, gender: {}, location: {} },
      optimalPostingTimes: [],
      trendingHashtags: [],
      competitorAnalysis: { competitors: [], avgEngagement: 0, avgGrowth: 0 }
    };
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
  }

  private extractMentions(text: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(mention => mention.slice(1)) : [];
  }

  private calculateEngagement(likes: number, comments: number, shares: number): number {
    const totalInteractions = likes + comments + shares;
    return totalInteractions > 0 ? (totalInteractions / 100) * 100 : 0;
  }
}

// YouTube API Client
export class YouTubeClient implements SocialMediaClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      timeout: 10000,
      params: {
        key: apiKey
      }
    });
  }

  async getProfile(channelId: string): Promise<SocialProfile> {
    try {
      const response = await this.client.get('/channels', {
        params: {
          part: 'snippet,statistics',
          id: channelId
        }
      });

      const channel = response.data.items[0];
      if (!channel) throw new Error('Channel not found');

      return {
        handle: channel.snippet.customUrl || channel.snippet.title,
        name: channel.snippet.title,
        bio: channel.snippet.description,
        followers: parseInt(channel.statistics.subscriberCount) || 0,
        following: 0, // YouTube doesn't provide following count
        posts: parseInt(channel.statistics.videoCount) || 0,
        profileImage: channel.snippet.thumbnails.default.url,
        verified: false, // Would need additional API call
        platform: 'youtube'
      };
    } catch (error) {
      logger.error('YouTube API error:', error);
      throw new Error('Failed to fetch YouTube profile');
    }
  }

  async getMetrics(channelId: string): Promise<SocialMetrics> {
    try {
      const profile = await this.getProfile(channelId);
      const content = await this.getContent(channelId, 20);

      const totalLikes = content.reduce((sum, item) => sum + item.likes, 0);
      const totalComments = content.reduce((sum, item) => sum + item.comments, 0);
      const totalViews = content.reduce((sum, item) => sum + item.views, 0);
      const totalEngagement = content.reduce((sum, item) => sum + item.engagement, 0);

      return {
        followers: profile.followers,
        following: 0,
        posts: profile.posts,
        engagement: content.length > 0 ? totalEngagement / content.length : 0,
        avgLikes: content.length > 0 ? totalLikes / content.length : 0,
        avgComments: content.length > 0 ? totalComments / content.length : 0,
        avgShares: 0,
        avgViews: content.length > 0 ? totalViews / content.length : 0,
        reach: 0,
        impressions: 0,
        profileVisits: 0,
        websiteClicks: 0,
        growthRate: 0,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('YouTube metrics error:', error);
      throw error;
    }
  }

  async getContent(channelId: string, limit: number = 10): Promise<ContentItem[]> {
    try {
      const response = await this.client.get('/search', {
        params: {
          part: 'snippet',
          channelId: channelId,
          order: 'date',
          type: 'video',
          maxResults: limit
        }
      });

      const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');

      if (!videoIds) return [];

      const statsResponse = await this.client.get('/videos', {
        params: {
          part: 'statistics',
          id: videoIds
        }
      });

      return response.data.items.map((item: any, index: number) => {
        const stats = statsResponse.data.items[index]?.statistics || {};

        return {
          id: item.id.videoId,
          type: 'video',
          title: item.snippet.title,
          description: item.snippet.description,
          postedAt: new Date(item.snippet.publishedAt),
          likes: parseInt(stats.likeCount) || 0,
          comments: parseInt(stats.commentCount) || 0,
          shares: 0,
          views: parseInt(stats.viewCount) || 0,
          reach: 0,
          impressions: 0,
          saves: 0,
          hashtags: this.extractHashtags(item.snippet.title + ' ' + item.snippet.description),
          mentions: [],
          mediaUrls: [`https://www.youtube.com/watch?v=${item.id.videoId}`],
          engagement: this.calculateEngagement(
            parseInt(stats.likeCount) || 0,
            parseInt(stats.commentCount) || 0,
            0
          ),
          sentiment: 'neutral',
          trending: false
        };
      });
    } catch (error) {
      logger.error('YouTube content error:', error);
      throw error;
    }
  }

  async getAnalytics(channelId: string, timeframe: string = '30d'): Promise<AnalyticsData> {
    // YouTube Analytics API requires OAuth and separate setup
    return {
      timeframe,
      totalViews: 0,
      totalEngagement: 0,
      topPerformingContent: [],
      audienceDemographics: { age: {}, gender: {}, location: {} },
      optimalPostingTimes: [],
      trendingHashtags: [],
      competitorAnalysis: { competitors: [], avgEngagement: 0, avgGrowth: 0 }
    };
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
  }

  private calculateEngagement(likes: number, comments: number, shares: number): number {
    const totalInteractions = likes + comments + shares;
    return totalInteractions > 0 ? (totalInteractions / 100) * 100 : 0;
  }
}

// Spotify API Client
export class SpotifyClient implements SocialMediaClient {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getProfile(artistId: string): Promise<SocialProfile> {
    try {
      const response = await this.client.get(`/artists/${artistId}`);

      return {
        handle: response.data.id,
        name: response.data.name,
        bio: '', // Spotify doesn't provide bio
        followers: response.data.followers?.total || 0,
        following: 0,
        posts: 0, // Artists don't have posts on Spotify
        profileImage: response.data.images?.[0]?.url || '',
        verified: false,
        platform: 'spotify'
      };
    } catch (error) {
      logger.error('Spotify API error:', error);
      throw new Error('Failed to fetch Spotify profile');
    }
  }

  async getMetrics(artistId: string): Promise<SocialMetrics> {
    try {
      const profile = await this.getProfile(artistId);

      // Get top tracks for engagement metrics
      const tracksResponse = await this.client.get(`/artists/${artistId}/top-tracks`, {
        params: { market: 'US' }
      });

      const tracks = tracksResponse.data.tracks || [];
      const totalPopularity = tracks.reduce((sum: number, track: any) => sum + track.popularity, 0);

      return {
        followers: profile.followers,
        following: 0,
        posts: 0,
        engagement: tracks.length > 0 ? totalPopularity / tracks.length : 0,
        avgLikes: 0,
        avgComments: 0,
        avgShares: 0,
        avgViews: tracks.length > 0 ? totalPopularity / tracks.length : 0,
        reach: 0,
        impressions: 0,
        profileVisits: 0,
        websiteClicks: 0,
        growthRate: 0,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('Spotify metrics error:', error);
      throw error;
    }
  }

  async getContent(artistId: string, limit: number = 10): Promise<ContentItem[]> {
    try {
      const response = await this.client.get(`/artists/${artistId}/albums`, {
        params: {
          limit,
          include_groups: 'album,single'
        }
      });

      return response.data.items.map((album: any) => ({
        id: album.id,
        type: album.album_type === 'single' ? 'post' : 'post',
        title: album.name,
        description: album.name,
        postedAt: new Date(album.release_date),
        likes: 0,
        comments: 0,
        shares: 0,
        views: album.popularity || 0,
        reach: 0,
        impressions: 0,
        saves: 0,
        hashtags: [],
        mentions: [],
        mediaUrls: [album.images?.[0]?.url || ''],
        engagement: album.popularity || 0,
        sentiment: 'neutral',
        trending: false
      }));
    } catch (error) {
      logger.error('Spotify content error:', error);
      throw error;
    }
  }

  async getAnalytics(artistId: string, timeframe: string = '30d'): Promise<AnalyticsData> {
    // Spotify Analytics requires Spotify for Artists access
    return {
      timeframe,
      totalViews: 0,
      totalEngagement: 0,
      topPerformingContent: [],
      audienceDemographics: { age: {}, gender: {}, location: {} },
      optimalPostingTimes: [],
      trendingHashtags: [],
      competitorAnalysis: { competitors: [], avgEngagement: 0, avgGrowth: 0 }
    };
  }
}

// Social Media Integration Manager
export class SocialMediaIntegration {
  private clients: Map<string, SocialMediaClient> = new Map();

  constructor(config: {
    instagramToken?: string;
    tiktokToken?: string;
    youtubeApiKey?: string;
    spotifyToken?: string;
  }) {
    if (config.instagramToken) {
      this.clients.set('instagram', new InstagramClient(config.instagramToken));
    }
    if (config.tiktokToken) {
      this.clients.set('tiktok', new TikTokClient(config.tiktokToken));
    }
    if (config.youtubeApiKey) {
      this.clients.set('youtube', new YouTubeClient(config.youtubeApiKey));
    }
    if (config.spotifyToken) {
      this.clients.set('spotify', new SpotifyClient(config.spotifyToken));
    }
  }

  async getProfile(platform: string, handle: string): Promise<SocialProfile> {
    const client = this.clients.get(platform);
    if (!client) {
      throw new Error(`No client configured for platform: ${platform}`);
    }
    return client.getProfile(handle);
  }

  async getMetrics(platform: string, handle: string): Promise<SocialMetrics> {
    const client = this.clients.get(platform);
    if (!client) {
      throw new Error(`No client configured for platform: ${platform}`);
    }
    return client.getMetrics(handle);
  }

  async getContent(platform: string, handle: string, limit?: number): Promise<ContentItem[]> {
    const client = this.clients.get(platform);
    if (!client) {
      throw new Error(`No client configured for platform: ${platform}`);
    }
    return client.getContent(handle, limit);
  }

  async getAnalytics(platform: string, handle: string, timeframe?: string): Promise<AnalyticsData> {
    const client = this.clients.get(platform);
    if (!client) {
      throw new Error(`No client configured for platform: ${platform}`);
    }
    return client.getAnalytics(handle, timeframe);
  }

  async getAllMetrics(handles: { [platform: string]: string }): Promise<{ [platform: string]: SocialMetrics }> {
    const results: { [platform: string]: SocialMetrics } = {};

    for (const [platform, handle] of Object.entries(handles)) {
      try {
        results[platform] = await this.getMetrics(platform, handle);
      } catch (error) {
        logger.error(`Failed to get metrics for ${platform}:`, error);
        results[platform] = {
          followers: 0,
          following: 0,
          posts: 0,
          engagement: 0,
          avgLikes: 0,
          avgComments: 0,
          avgShares: 0,
          avgViews: 0,
          reach: 0,
          impressions: 0,
          profileVisits: 0,
          websiteClicks: 0,
          growthRate: 0,
          lastUpdated: new Date()
        };
      }
    }

    return results;
  }

  getAvailablePlatforms(): string[] {
    return Array.from(this.clients.keys());
  }
}

// Export singleton instance (would be configured with actual API keys)
export const socialMediaIntegration = new SocialMediaIntegration({
  instagramToken: process.env.INSTAGRAM_ACCESS_TOKEN,
  tiktokToken: process.env.TIKTOK_ACCESS_TOKEN,
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  spotifyToken: process.env.SPOTIFY_ACCESS_TOKEN
});