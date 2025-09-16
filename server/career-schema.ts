import { pgTable, text, integer, timestamp, jsonb, decimal, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Artist Profile Table
export const artistProfiles = pgTable('artist_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  genre: text('genre').notNull(),
  stage: text('stage').notNull(), // 'emerging', 'rising', 'established', 'mainstream'
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  spotifyId: text('spotify_id'),
  instagramHandle: text('instagram_handle'),
  tiktokHandle: text('tiktok_handle'),
  youtubeChannelId: text('youtube_channel_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Social Media Metrics Table
export const socialMetrics = pgTable('social_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').references(() => artistProfiles.id),
  platform: text('platform').notNull(), // 'instagram', 'tiktok', 'youtube', 'spotify', 'twitter'
  followers: integer('followers').default(0),
  engagement: decimal('engagement', { precision: 5, scale: 2 }),
  growth: decimal('growth', { precision: 5, scale: 2 }),
  postsThisWeek: integer('posts_this_week').default(0),
  reach: integer('reach'),
  impressions: integer('impressions'),
  saves: integer('saves'),
  shares: integer('shares'),
  comments: integer('comments'),
  likes: integer('likes'),
  views: integer('views'),
  watchTime: integer('watch_time'), // in minutes
  monthlyListeners: integer('monthly_listeners'),
  streams: integer('streams'),
  saves: integer('saves'),
  playlistAdds: integer('playlist_adds'),
  optimalPostingTimes: jsonb('optimal_posting_times'), // array of time strings
  trendingHashtags: jsonb('trending_hashtags'), // array of hashtags
  contentPerformance: jsonb('content_performance'), // object with content type performance
  recordedAt: timestamp('recorded_at').defaultNow(),
});

// Revenue Streams Table
export const revenueStreams = pgTable('revenue_streams', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').references(() => artistProfiles.id),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'streaming', 'sales', 'live', 'merch', 'sync', 'other'
  amount: decimal('amount', { precision: 10, scale: 2 }),
  percentage: decimal('percentage', { precision: 5, scale: 2 }),
  growth: decimal('growth', { precision: 5, scale: 2 }),
  platforms: jsonb('platforms'), // array of platform names
  monthlyTrend: jsonb('monthly_trend'), // array of monthly amounts
  nextPayment: timestamp('next_payment'),
  projectedMonthly: decimal('projected_monthly', { precision: 10, scale: 2 }),
  recordedAt: timestamp('recorded_at').defaultNow(),
});

// AI Agents Table
export const aiAgents = pgTable('ai_agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').references(() => artistProfiles.id),
  name: text('name').notNull(),
  role: text('role').notNull(),
  type: text('type').notNull(), // 'marketing', 'revenue', 'collaboration', 'content'
  color: text('color').notNull(),
  performance: decimal('performance', { precision: 5, scale: 2 }),
  revenue: decimal('revenue', { precision: 10, scale: 2 }),
  tasks: jsonb('tasks'), // array of current tasks
  activeProjects: integer('active_projects').default(0),
  completedTasks: integer('completed_tasks').default(0),
  lastActivity: timestamp('last_activity'),
  aiInsights: jsonb('ai_insights'), // array of AI-generated insights
  nextActions: jsonb('next_actions'), // array of recommended actions
  settings: jsonb('settings'), // agent configuration
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Career Milestones Table
export const careerMilestones = pgTable('career_milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').references(() => artistProfiles.id),
  title: text('title').notNull(),
  progress: decimal('progress', { precision: 5, scale: 2 }),
  current: decimal('current', { precision: 10, scale: 2 }),
  target: decimal('target', { precision: 10, scale: 2 }),
  reward: text('reward'),
  deadline: timestamp('deadline'),
  category: text('category').notNull(), // 'growth', 'revenue', 'creative', 'networking', 'business'
  description: text('description'),
  difficulty: text('difficulty').notNull(), // 'easy', 'medium', 'hard', 'expert'
  completionBonus: text('completion_bonus'),
  currentTrend: text('current_trend'),
  estimatedCompletion: text('estimated_completion'),
  platformBreakdown: jsonb('platform_breakdown'),
  tracksCompleted: jsonb('tracks_completed'),
  revenueSources: jsonb('revenue_sources'),
  completedCollabs: jsonb('completed_collabs'),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// AI Recommendations Table
export const aiRecommendations = pgTable('ai_recommendations', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').references(() => artistProfiles.id),
  agentId: uuid('agent_id').references(() => aiAgents.id),
  title: text('title').notNull(),
  type: text('type').notNull(), // 'marketing', 'revenue', 'collaboration', 'content', 'distribution'
  priority: text('priority').notNull(), // 'low', 'medium', 'high', 'critical'
  description: text('description').notNull(),
  expectedROI: text('expected_roi'),
  timeframe: text('timeframe'),
  automated: boolean('automated').default(false),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  dataPoints: jsonb('data_points'), // array of data sources used
  actionItems: jsonb('action_items'), // array of specific actions
  status: text('status').notNull().default('pending'), // 'pending', 'in_progress', 'completed', 'cancelled'
  executedAt: timestamp('executed_at'),
  results: jsonb('results'), // execution results
  createdAt: timestamp('created_at').defaultNow(),
});

// Market Intelligence Table
export const marketIntelligence = pgTable('market_intelligence', {
  id: uuid('id').primaryKey().defaultRandom(),
  genre: text('genre').notNull(),
  metric: text('metric').notNull(), // 'average_streams', 'engagement_rate', 'follower_growth', etc.
  value: decimal('value', { precision: 10, scale: 2 }),
  percentile25: decimal('percentile_25', { precision: 10, scale: 2 }),
  percentile50: decimal('percentile_50', { precision: 10, scale: 2 }),
  percentile75: decimal('percentile_75', { precision: 10, scale: 2 }),
  percentile90: decimal('percentile_90', { precision: 10, scale: 2 }),
  recordedAt: timestamp('recorded_at').defaultNow(),
});

// Competitor Analysis Table
export const competitorAnalysis = pgTable('competitor_analysis', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').references(() => artistProfiles.id),
  competitorName: text('competitor_name').notNull(),
  competitorGenre: text('competitor_genre'),
  similarity: decimal('similarity', { precision: 5, scale: 2 }), // 0-1 score
  followers: integer('followers'),
  engagement: decimal('engagement', { precision: 5, scale: 2 }),
  monthlyStreams: integer('monthly_streams'),
  growthRate: decimal('growth_rate', { precision: 5, scale: 2 }),
  topTracks: jsonb('top_tracks'),
  strategies: jsonb('strategies'), // successful strategies identified
  threats: jsonb('threats'), // competitive threats
  opportunities: jsonb('opportunities'), // opportunities to exploit
  recordedAt: timestamp('recorded_at').defaultNow(),
});

// Predictive Analytics Table
export const predictiveAnalytics = pgTable('predictive_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').references(() => artistProfiles.id),
  predictionType: text('prediction_type').notNull(), // 'follower_growth', 'revenue', 'engagement', 'streams'
  timeframe: text('timeframe').notNull(), // '1_week', '1_month', '3_months', '6_months', '1_year'
  predictedValue: decimal('predicted_value', { precision: 10, scale: 2 }),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  factors: jsonb('factors'), // factors influencing the prediction
  historicalData: jsonb('historical_data'), // data used for prediction
  modelAccuracy: decimal('model_accuracy', { precision: 5, scale: 2 }),
  predictedAt: timestamp('predicted_at').defaultNow(),
  actualValue: decimal('actual_value', { precision: 10, scale: 2 }),
  actualRecordedAt: timestamp('actual_recorded_at'),
});

// Relations
export const artistProfilesRelations = relations(artistProfiles, ({ many }) => ({
  socialMetrics: many(socialMetrics),
  revenueStreams: many(revenueStreams),
  aiAgents: many(aiAgents),
  careerMilestones: many(careerMilestones),
  aiRecommendations: many(aiRecommendations),
  competitorAnalysis: many(competitorAnalysis),
  predictiveAnalytics: many(predictiveAnalytics),
}));

export const socialMetricsRelations = relations(socialMetrics, ({ one }) => ({
  artist: one(artistProfiles, {
    fields: [socialMetrics.artistId],
    references: [artistProfiles.id],
  }),
}));

export const revenueStreamsRelations = relations(revenueStreams, ({ one }) => ({
  artist: one(artistProfiles, {
    fields: [revenueStreams.artistId],
    references: [artistProfiles.id],
  }),
}));

export const aiAgentsRelations = relations(aiAgents, ({ one, many }) => ({
  artist: one(artistProfiles, {
    fields: [aiAgents.artistId],
    references: [artistProfiles.id],
  }),
  recommendations: many(aiRecommendations),
}));

export const careerMilestonesRelations = relations(careerMilestones, ({ one }) => ({
  artist: one(artistProfiles, {
    fields: [careerMilestones.artistId],
    references: [artistProfiles.id],
  }),
}));

export const aiRecommendationsRelations = relations(aiRecommendations, ({ one }) => ({
  artist: one(artistProfiles, {
    fields: [aiRecommendations.artistId],
    references: [artistProfiles.id],
  }),
  agent: one(aiAgents, {
    fields: [aiRecommendations.agentId],
    references: [aiAgents.id],
  }),
}));

export const competitorAnalysisRelations = relations(competitorAnalysis, ({ one }) => ({
  artist: one(artistProfiles, {
    fields: [competitorAnalysis.artistId],
    references: [artistProfiles.id],
  }),
}));

export const predictiveAnalyticsRelations = relations(predictiveAnalytics, ({ one }) => ({
  artist: one(artistProfiles, {
    fields: [predictiveAnalytics.artistId],
    references: [predictiveAnalytics.artistId],
  }),
}));

// Types
export type ArtistProfile = typeof artistProfiles.$inferSelect;
export type NewArtistProfile = typeof artistProfiles.$inferInsert;

export type SocialMetric = typeof socialMetrics.$inferSelect;
export type NewSocialMetric = typeof socialMetrics.$inferInsert;

export type RevenueStream = typeof revenueStreams.$inferSelect;
export type NewRevenueStream = typeof revenueStreams.$inferInsert;

export type AIAgent = typeof aiAgents.$inferSelect;
export type NewAIAgent = typeof aiAgents.$inferInsert;

export type CareerMilestone = typeof careerMilestones.$inferSelect;
export type NewCareerMilestone = typeof careerMilestones.$inferInsert;

export type AIRecommendation = typeof aiRecommendations.$inferSelect;
export type NewAIRecommendation = typeof aiRecommendations.$inferInsert;

export type MarketIntelligence = typeof marketIntelligence.$inferSelect;
export type NewMarketIntelligence = typeof marketIntelligence.$inferInsert;

export type CompetitorAnalysis = typeof competitorAnalysis.$inferSelect;
export type NewCompetitorAnalysis = typeof competitorAnalysis.$inferInsert;

export type PredictiveAnalytic = typeof predictiveAnalytics.$inferSelect;
export type NewPredictiveAnalytic = typeof predictiveAnalytics.$inferInsert;