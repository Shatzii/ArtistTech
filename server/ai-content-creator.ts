import OpenAI from "openai";
import { WebSocketServer, WebSocket } from "ws";
import fs from "fs";
import path from "path";

interface ContentRequest {
  type: 'social_post' | 'blog_article' | 'email' | 'press_release' | 'lyrics' | 'bio';
  platform?: string;
  style: string;
  tone: string;
  length: 'short' | 'medium' | 'long';
  keywords: string[];
  targetAudience: string;
  callToAction?: string;
  context: any;
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
  variations: ContentVariation[];
}

interface ContentVariation {
  id: string;
  content: string;
  score: number;
  audience: string;
}

interface ContentCalendar {
  artistId: string;
  month: string;
  posts: ScheduledPost[];
  themes: string[];
  campaigns: string[];
}

interface ScheduledPost {
  id: string;
  content: GeneratedContent;
  scheduledDate: Date;
  platform: string;
  status: 'draft' | 'scheduled' | 'published';
  performance?: PostPerformance;
}

interface PostPerformance {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  clickThroughRate: number;
  engagementRate: number;
}

interface BrandVoice {
  artistId: string;
  tone: string[];
  style: string[];
  keywords: string[];
  avoidWords: string[];
  brandPersonality: string;
  communicationStyle: string;
}

interface SocialMediaStrategy {
  artistId: string;
  platforms: PlatformStrategy[];
  contentMix: ContentMix;
  postingSchedule: PostingSchedule;
  audienceSegments: AudienceSegment[];
  seasonalCampaigns: SeasonalCampaign[];
}

interface PlatformStrategy {
  platform: string;
  contentTypes: string[];
  postFrequency: string;
  optimalTimes: string[];
  hashtagStrategy: string[];
  engagementTactics: string[];
}

interface ContentMix {
  promotional: number; // percentage
  educational: number;
  entertainment: number;
  behindScenes: number;
  userGenerated: number;
}

interface PostingSchedule {
  daily: TimeSlot[];
  weekly: WeeklySchedule;
  monthly: MonthlyThemes;
}

interface TimeSlot {
  time: string;
  platform: string;
  contentType: string;
}

interface WeeklySchedule {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

interface MonthlyThemes {
  [key: string]: string;
}

interface AudienceSegment {
  name: string;
  demographics: any;
  interests: string[];
  platforms: string[];
  contentPreferences: string[];
}

interface SeasonalCampaign {
  name: string;
  startDate: Date;
  endDate: Date;
  theme: string;
  contentTypes: string[];
  platforms: string[];
}

export class AIContentCreator {
  private openai: OpenAI;
  private contentWSS?: WebSocketServer;
  private brandVoices: Map<string, BrandVoice> = new Map();
  private contentCalendars: Map<string, ContentCalendar> = new Map();
  private socialStrategies: Map<string, SocialMediaStrategy> = new Map();
  private contentTemplates: Map<string, any> = new Map();
  private trendsData: Map<string, any> = new Map();

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.initializeCreator();
  }

  private async initializeCreator() {
    this.setupContentServer();
    await this.loadContentTemplates();
    await this.initializeTrendTracking();
    this.startContentGeneration();
    console.log("AI Content Creator initialized");
  }

  private setupContentServer() {
    this.contentWSS = new WebSocketServer({ port: 8087, path: '/content' });
    
    this.contentWSS.on('connection', (ws: WebSocket) => {
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleContentMessage(ws, message);
        } catch (error) {
          console.error('Content WebSocket error:', error);
        }
      });
    });

    console.log("AI content server started on port 8087");
  }

  private async loadContentTemplates() {
    const templates = {
      instagram: {
        music_release: {
          caption: "🎵 New music alert! {artistName} just dropped '{trackTitle}' and it's everything we hoped for and more 🔥\n\n{description}\n\nWhat's your favorite lyric? Drop it in the comments! 👇\n\n{hashtags}",
          hashtags: ["#NewMusic", "#NowPlaying", "{genre}", "{artistName}"],
          mediaDescription: "Album artwork with artist name and track title, vibrant colors matching the music mood"
        },
        behind_scenes: {
          caption: "Studio vibes with {artistName} 🎧 Nothing beats watching the magic happen behind the scenes ✨\n\n{process_description}\n\n{hashtags}",
          hashtags: ["#BehindTheScenes", "#StudioLife", "#MusicMaking", "{artistName}"],
          mediaDescription: "Candid studio photo or short video showing the creative process"
        },
        fan_engagement: {
          caption: "Our fans are absolutely incredible! 🙌 The love and support you show means everything to us\n\n{fan_highlight}\n\nTag a friend who needs to hear this! 👯‍♀️\n\n{hashtags}",
          hashtags: ["#FanLove", "#Community", "#MusicFamily", "{artistName}"],
          mediaDescription: "Fan art, covers, or user-generated content featuring the artist's music"
        }
      },
      tiktok: {
        trend_participation: {
          caption: "POV: {artistName} {trend_action} 🎤✨ {hashtags}",
          hashtags: ["{trending_hashtag}", "#fyp", "#music", "{artistName}"],
          concept: "Participate in trending audio or challenge while incorporating artist's brand"
        },
        music_preview: {
          caption: "This part hits different every time 🔥 Full song out now! {hashtags}",
          hashtags: ["#MusicPreview", "#NewMusic", "{genre}", "{artistName}"],
          concept: "15-30 second clip of the most engaging part of a new song"
        }
      },
      twitter: {
        music_announcement: {
          tweet: "🚨 NEW MUSIC ALERT 🚨\n\n{artistName} - {trackTitle}\n\nOut now on all platforms 🎵\n\n{streaming_links}\n\n{hashtags}",
          hashtags: ["#NewMusic", "{artistName}", "{genre}"]
        },
        thought_leadership: {
          tweet: "{music_industry_insight}\n\nWhat do you think? 🤔\n\n{hashtags}",
          hashtags: ["#MusicIndustry", "#ArtistLife", "{topic}"]
        }
      },
      youtube: {
        music_video: {
          title: "{artistName} - {trackTitle} (Official Music Video)",
          description: "Stream/Download '{trackTitle}': {links}\n\nDirected by: {director}\nProduced by: {producer}\n\n{song_description}\n\nLyrics:\n{lyrics_preview}\n\nConnect with {artistName}:\n{social_links}"
        },
        behind_scenes: {
          title: "Making of '{trackTitle}' - Behind the Scenes with {artistName}",
          description: "Go behind the scenes of {artistName}'s latest music video '{trackTitle}'. See the creative process, director's vision, and exclusive footage from the shoot.\n\n{production_details}"
        }
      }
    };

    this.contentTemplates = new Map(Object.entries(templates));
  }

  private async initializeTrendTracking() {
    // Initialize trending topics and hashtags tracking
    const trends = {
      music: ["#NewMusicFriday", "#MusicProducer", "#IndieMusic", "#StudioLife"],
      general: ["#MondayMotivation", "#ThrowbackThursday", "#WeekendVibes", "#OOTD"],
      seasonal: this.getSeasonalTrends(),
      platform_specific: {
        tiktok: ["#fyp", "#viral", "#trend", "#music"],
        instagram: ["#instamusic", "#artistlife", "#newpost", "#follow"],
        twitter: ["#MusicTwitter", "#NowPlaying", "#MusicNews", "#ArtistSpotlight"]
      }
    };

    this.trendsData = new Map(Object.entries(trends));
  }

  private getSeasonalTrends(): any {
    const month = new Date().getMonth();
    const seasonalTrends: any = {
      0: ["#NewYearNewMusic", "#2024Goals", "#FreshStart"], // January
      1: ["#LoveMusic", "#ValentinesDay", "#MusicIsLove"], // February
      2: ["#SpringVibes", "#NewBeginnings", "#MarchMadness"], // March
      3: ["#SpringMusic", "#EasterVibes", "#AprilShowers"], // April
      4: ["#MayFlowers", "#SpringConcerts", "#OutdoorMusic"], // May
      5: ["#SummerSolstice", "#SummerTour", "#FestivalSeason"], // June
      6: ["#SummerHits", "#VacationVibes", "#SummerPlaylist"], // July
      7: ["#SummerNights", "#ConcertSeason", "#VacationMode"], // August
      8: ["#BackToSchool", "#AutumnVibes", "#NewChapter"], // September
      9: ["#FallMusic", "#HalloweenVibes", "#AutumnLeaves"], // October
      10: ["#Thanksgiving", "#Grateful", "#FamilyTime"], // November
      11: ["#HolidayMusic", "#YearEndReflection", "#ChristmasVibes"] // December
    };

    return seasonalTrends[month] || ["#Music", "#Artist", "#NewContent"];
  }

  private startContentGeneration() {
    // Automated content generation every 6 hours
    setInterval(() => {
      this.generateScheduledContent();
    }, 21600000);
  }

  async createBrandVoice(artistId: string, artistInfo: any): Promise<BrandVoice> {
    const prompt = `
Analyze this artist's information and create a comprehensive brand voice guide.

Artist Info: ${JSON.stringify(artistInfo)}

Create a brand voice that includes:
1. Tone characteristics (casual, professional, edgy, warm, etc.)
2. Communication style preferences
3. Key vocabulary and phrases to use
4. Words and phrases to avoid
5. Brand personality description
6. Target audience communication approach

Make it authentic and distinctive for this specific artist.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a brand strategist specializing in music artists. Create authentic, distinctive brand voices that resonate with target audiences."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500
      });

      const brandData = JSON.parse(response.choices[0].message.content || '{}');
      
      const brandVoice: BrandVoice = {
        artistId,
        tone: brandData.tone || ['casual', 'authentic'],
        style: brandData.style || ['conversational', 'engaging'],
        keywords: brandData.keywords || ['music', 'create', 'inspire'],
        avoidWords: brandData.avoidWords || ['perfect', 'amazing', 'incredible'],
        brandPersonality: brandData.brandPersonality || 'Authentic and relatable',
        communicationStyle: brandData.communicationStyle || 'Direct but warm'
      };

      this.brandVoices.set(artistId, brandVoice);
      return brandVoice;
    } catch (error) {
      console.error('Error creating brand voice:', error);
      return this.getDefaultBrandVoice(artistId);
    }
  }

  async generateContent(request: ContentRequest): Promise<GeneratedContent> {
    const brandVoice = this.brandVoices.get(request.context.artistId);
    const currentTrends = this.getCurrentTrends(request.platform);
    
    const prompt = `
Create ${request.type} content for ${request.platform || 'general use'}.

Requirements:
- Style: ${request.style}
- Tone: ${request.tone}
- Length: ${request.length}
- Target Audience: ${request.targetAudience}
- Keywords: ${request.keywords.join(', ')}
- Call to Action: ${request.callToAction || 'Engage with content'}

Brand Voice Guidelines:
${brandVoice ? JSON.stringify(brandVoice) : 'Be authentic and engaging'}

Current Trends:
${currentTrends.join(', ')}

Context:
${JSON.stringify(request.context)}

Create compelling, platform-optimized content that:
1. Matches the brand voice
2. Incorporates relevant trends
3. Drives engagement
4. Includes strategic hashtags
5. Has strong visual descriptions

Provide multiple variations and optimization suggestions.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert content creator specializing in music industry social media. Create engaging, authentic content that drives real engagement and builds artist brands."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000
      });

      const generated = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: request.type,
        platform: request.platform || 'general',
        title: generated.title || '',
        content: generated.content,
        hashtags: generated.hashtags || [],
        mediaDescription: generated.mediaDescription || '',
        optimizationScore: generated.optimizationScore || 85,
        engagementPrediction: generated.engagementPrediction || 4.2,
        suggestedPostTime: generated.suggestedPostTime || 'Evening',
        variations: generated.variations || []
      };
    } catch (error) {
      console.error('Error generating content:', error);
      return this.getFallbackContent(request);
    }
  }

  async createContentCalendar(artistId: string, month: string, goals: string[]): Promise<ContentCalendar> {
    const brandVoice = this.brandVoices.get(artistId);
    const socialStrategy = this.socialStrategies.get(artistId);
    
    const prompt = `
Create a comprehensive content calendar for ${month}.

Artist Brand Voice: ${brandVoice ? JSON.stringify(brandVoice) : 'Professional and engaging'}
Social Strategy: ${socialStrategy ? JSON.stringify(socialStrategy) : 'Balanced content mix'}
Goals: ${goals.join(', ')}

Generate:
1. Daily post schedule with optimal timing
2. Content themes for each week
3. Platform-specific content types
4. Seasonal/trending topic integration
5. Campaign alignment
6. Engagement strategies

Include 30 days of scheduled content with variety and strategic timing.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a social media strategist specializing in music artists. Create comprehensive, actionable content calendars that drive engagement and achieve business goals."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 3000
      });

      const calendarData = JSON.parse(response.choices[0].message.content || '{}');
      
      const calendar: ContentCalendar = {
        artistId,
        month,
        posts: this.generateScheduledPosts(calendarData.posts || []),
        themes: calendarData.themes || ['Music', 'Behind the Scenes', 'Fan Engagement'],
        campaigns: calendarData.campaigns || []
      };

      this.contentCalendars.set(`${artistId}_${month}`, calendar);
      return calendar;
    } catch (error) {
      console.error('Error creating content calendar:', error);
      return this.getDefaultContentCalendar(artistId, month);
    }
  }

  async optimizeContent(content: GeneratedContent, performanceData: PostPerformance): Promise<GeneratedContent> {
    const prompt = `
Optimize this content based on performance data:

Original Content: ${JSON.stringify(content)}
Performance Data: ${JSON.stringify(performanceData)}

Analyze what worked and what didn't, then provide:
1. Improved content variations
2. Better hashtag strategies
3. Optimal posting times
4. Engagement improvement suggestions
5. Updated optimization score

Focus on actionable improvements that will boost engagement.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a content optimization expert. Analyze performance data and provide specific, actionable improvements for better engagement."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500
      });

      const optimized = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        ...content,
        content: optimized.content || content.content,
        hashtags: optimized.hashtags || content.hashtags,
        optimizationScore: optimized.optimizationScore || content.optimizationScore + 5,
        engagementPrediction: optimized.engagementPrediction || content.engagementPrediction + 0.5,
        variations: optimized.variations || content.variations
      };
    } catch (error) {
      console.error('Error optimizing content:', error);
      return content;
    }
  }

  private getCurrentTrends(platform?: string): string[] {
    const musicTrends = this.trendsData.get('music') || [];
    const generalTrends = this.trendsData.get('general') || [];
    const seasonalTrends = this.getSeasonalTrends();
    
    let platformTrends: string[] = [];
    if (platform) {
      const platformData = this.trendsData.get('platform_specific') as any;
      platformTrends = platformData?.[platform] || [];
    }

    return [...musicTrends, ...generalTrends, ...seasonalTrends, ...platformTrends];
  }

  private generateScheduledPosts(postsData: any[]): ScheduledPost[] {
    return postsData.map((post, index) => ({
      id: `post_${index}`,
      content: {
        id: `content_${index}`,
        type: post.type || 'social_post',
        platform: post.platform || 'instagram',
        title: post.title || '',
        content: post.content || '',
        hashtags: post.hashtags || [],
        mediaDescription: post.mediaDescription || '',
        optimizationScore: 85,
        engagementPrediction: 4.2,
        suggestedPostTime: post.suggestedPostTime || 'Evening',
        variations: []
      },
      scheduledDate: new Date(post.scheduledDate),
      platform: post.platform || 'instagram',
      status: 'draft' as const
    }));
  }

  private async generateScheduledContent() {
    // Generate content for active calendars
    for (const [key, calendar] of this.contentCalendars) {
      const today = new Date();
      const todaysPosts = calendar.posts.filter(post => 
        post.scheduledDate.toDateString() === today.toDateString() && 
        post.status === 'draft'
      );

      for (const post of todaysPosts) {
        // Generate actual content for scheduled posts
        const request: ContentRequest = {
          type: 'social_post',
          platform: post.platform,
          style: 'engaging',
          tone: 'authentic',
          length: 'medium',
          keywords: ['music', 'artist'],
          targetAudience: 'music fans',
          context: { artistId: calendar.artistId }
        };

        const generatedContent = await this.generateContent(request);
        post.content = generatedContent;
        post.status = 'scheduled';
      }
    }
  }

  private handleContentMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'generate_content':
        this.generateContent(message.request)
          .then(content => {
            ws.send(JSON.stringify({
              type: 'content_generated',
              content
            }));
          });
        break;

      case 'create_brand_voice':
        this.createBrandVoice(message.artistId, message.artistInfo)
          .then(brandVoice => {
            ws.send(JSON.stringify({
              type: 'brand_voice_created',
              brandVoice
            }));
          });
        break;

      case 'create_calendar':
        this.createContentCalendar(message.artistId, message.month, message.goals)
          .then(calendar => {
            ws.send(JSON.stringify({
              type: 'calendar_created',
              calendar
            }));
          });
        break;

      case 'optimize_content':
        this.optimizeContent(message.content, message.performanceData)
          .then(optimized => {
            ws.send(JSON.stringify({
              type: 'content_optimized',
              content: optimized
            }));
          });
        break;
    }
  }

  // Helper methods
  private getDefaultBrandVoice(artistId: string): BrandVoice {
    return {
      artistId,
      tone: ['authentic', 'engaging'],
      style: ['conversational', 'inspiring'],
      keywords: ['music', 'create', 'inspire', 'connect'],
      avoidWords: ['perfect', 'amazing', 'incredible'],
      brandPersonality: 'Authentic and relatable artist who connects with fans',
      communicationStyle: 'Direct but warm, inspiring but humble'
    };
  }

  private getFallbackContent(request: ContentRequest): GeneratedContent {
    return {
      id: `fallback_${Date.now()}`,
      type: request.type,
      platform: request.platform || 'general',
      title: 'New Music Update',
      content: 'Exciting things happening in the studio! Stay tuned for more updates.',
      hashtags: ['#music', '#artist', '#newmusic'],
      mediaDescription: 'Artist in studio or creative space',
      optimizationScore: 75,
      engagementPrediction: 3.5,
      suggestedPostTime: 'Evening',
      variations: []
    };
  }

  private getDefaultContentCalendar(artistId: string, month: string): ContentCalendar {
    return {
      artistId,
      month,
      posts: [],
      themes: ['Music Updates', 'Behind the Scenes', 'Fan Engagement'],
      campaigns: []
    };
  }

  getCreatorStatus() {
    return {
      brandVoices: this.brandVoices.size,
      contentCalendars: this.contentCalendars.size,
      socialStrategies: this.socialStrategies.size,
      templates: this.contentTemplates.size,
      status: 'active'
    };
  }
}

export const aiContentCreator = new AIContentCreator();