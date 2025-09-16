import { pgTable, text, integer, timestamp, boolean, jsonb, decimal, uuid, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Artist/Creator Profile Table
export const artists = pgTable('artists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  genre: varchar('genre', { length: 100 }),
  stage: varchar('stage', { length: 50 }).default('emerging'), // emerging, rising, established, superstar
  bio: text('bio'),
  profileImage: text('profile_image'),
  location: varchar('location', { length: 255 }),
  website: text('website'),
  spotifyId: varchar('spotify_id', { length: 255 }),
  instagramHandle: varchar('instagram_handle', { length: 255 }),
  tiktokHandle: varchar('tiktok_handle', { length: 255 }),
  youtubeChannelId: varchar('youtube_channel_id', { length: 255 }),
  twitterHandle: varchar('twitter_handle', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('artists_user_id_idx').on(table.userId),
  genreIdx: index('artists_genre_idx').on(table.genre),
  stageIdx: index('artists_stage_idx').on(table.stage),
}));

// Social Media Metrics Table
export const socialMetrics = pgTable('social_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  platform: varchar('platform', { length: 50 }).notNull(), // instagram, tiktok, youtube, spotify, twitter
  followers: integer('followers').default(0),
  following: integer('following').default(0),
  posts: integer('posts').default(0),
  engagement: decimal('engagement', { precision: 5, scale: 2 }), // engagement rate percentage
  avgLikes: integer('avg_likes').default(0),
  avgComments: integer('avg_comments').default(0),
  avgShares: integer('avg_shares').default(0),
  avgViews: integer('avg_views').default(0),
  reach: integer('reach').default(0),
  impressions: integer('impressions').default(0),
  profileVisits: integer('profile_visits').default(0),
  websiteClicks: integer('website_clicks').default(0),
  topPerformingContent: jsonb('top_performing_content'), // array of content IDs
  optimalPostingTimes: jsonb('optimal_posting_times'), // array of time slots
  trendingHashtags: jsonb('trending_hashtags'), // array of hashtags
  competitorAnalysis: jsonb('competitor_analysis'), // competitor data
  growthRate: decimal('growth_rate', { precision: 5, scale: 2 }), // weekly growth rate
  lastUpdated: timestamp('last_updated').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  artistPlatformIdx: index('social_metrics_artist_platform_idx').on(table.artistId, table.platform),
  platformIdx: index('social_metrics_platform_idx').on(table.platform),
  lastUpdatedIdx: index('social_metrics_last_updated_idx').on(table.lastUpdated),
}));

// Career Milestones Table
export const careerMilestones = pgTable('career_milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(), // growth, revenue, creative, networking
  currentValue: integer('current_value').default(0),
  targetValue: integer('target_value').notNull(),
  progress: decimal('progress', { precision: 5, scale: 2 }).default('0'), // percentage
  reward: jsonb('reward'), // reward details
  deadline: timestamp('deadline'),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  difficulty: varchar('difficulty', { length: 20 }).default('medium'), // easy, medium, hard, expert
  priority: varchar('priority', { length: 20 }).default('medium'), // low, medium, high
  currentTrend: varchar('current_trend', { length: 255 }),
  estimatedCompletion: varchar('estimated_completion', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  artistIdIdx: index('career_milestones_artist_id_idx').on(table.artistId),
  categoryIdx: index('career_milestones_category_idx').on(table.category),
  completedIdx: index('career_milestones_completed_idx').on(table.completed),
  deadlineIdx: index('career_milestones_deadline_idx').on(table.deadline),
}));

// Revenue Streams Table
export const revenueStreams = pgTable('revenue_streams', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // streaming, beat_sales, live_shows, merchandise, sync, brand_deals
  platform: varchar('platform', { length: 100 }),
  amount: decimal('amount', { precision: 10, scale: 2 }).default('0'),
  percentage: decimal('percentage', { precision: 5, scale: 2 }), // percentage of total revenue
  growth: decimal('growth', { precision: 5, scale: 2 }), // growth rate
  monthlyTrend: jsonb('monthly_trend'), // last 12 months data
  nextPayment: timestamp('next_payment'),
  projectedMonthly: decimal('projected_monthly', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('USD'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  artistIdIdx: index('revenue_streams_artist_id_idx').on(table.artistId),
  typeIdx: index('revenue_streams_type_idx').on(table.type),
  activeIdx: index('revenue_streams_active_idx').on(table.active),
}));

// AI Insights and Recommendations Table
export const aiInsights = pgTable('ai_insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // marketing, revenue, collaboration, content, distribution
  priority: varchar('priority', { length: 20 }).default('medium'), // low, medium, high
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  expectedROI: varchar('expected_roi', { length: 255 }),
  timeframe: varchar('timeframe', { length: 50 }), // immediate, this_week, this_month, this_quarter
  automated: boolean('automated').default(false),
  confidence: decimal('confidence', { precision: 5, scale: 2 }), // AI confidence score
  dataPoints: jsonb('data_points'), // supporting data
  actionItems: jsonb('action_items'), // steps to implement
  status: varchar('status', { length: 20 }).default('pending'), // pending, in_progress, completed, dismissed
  executedAt: timestamp('executed_at'),
  result: jsonb('result'), // execution results
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  artistIdIdx: index('ai_insights_artist_id_idx').on(table.artistId),
  typeIdx: index('ai_insights_type_idx').on(table.type),
  priorityIdx: index('ai_insights_priority_idx').on(table.priority),
  statusIdx: index('ai_insights_status_idx').on(table.status),
  createdAtIdx: index('ai_insights_created_at_idx').on(table.createdAt),
}));

// AI Agents Table
export const aiAgents = pgTable('ai_agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  color: varchar('color', { length: 7 }).default('#3B82F6'), // hex color
  performance: decimal('performance', { precision: 5, scale: 2 }).default('75'), // performance score
  revenue: decimal('revenue', { precision: 10, scale: 2 }).default('0'),
  tasks: jsonb('tasks'), // current tasks
  activeProjects: integer('active_projects').default(0),
  completedTasks: integer('completed_tasks').default(0),
  lastActivity: timestamp('last_activity'),
  aiInsights: jsonb('ai_insights'), // AI-generated insights
  nextActions: jsonb('next_actions'), // recommended next steps
  configuration: jsonb('configuration'), // agent settings
  enabled: boolean('enabled').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  artistIdIdx: index('ai_agents_artist_id_idx').on(table.artistId),
  enabledIdx: index('ai_agents_enabled_idx').on(table.enabled),
  lastActivityIdx: index('ai_agents_last_activity_idx').on(table.lastActivity),
}));

// Content Performance Table
export const contentPerformance = pgTable('content_performance', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  platform: varchar('platform', { length: 50 }).notNull(),
  contentId: varchar('content_id', { length: 255 }).notNull(), // platform-specific content ID
  contentType: varchar('content_type', { length: 50 }), // post, reel, video, story, etc.
  title: varchar('title', { length: 255 }),
  description: text('description'),
  postedAt: timestamp('posted_at').notNull(),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  shares: integer('shares').default(0),
  views: integer('views').default(0),
  reach: integer('reach').default(0),
  impressions: integer('impressions').default(0),
  saves: integer('saves').default(0),
  engagement: decimal('engagement', { precision: 5, scale: 2 }),
  hashtags: jsonb('hashtags'),
  mentions: jsonb('mentions'),
  aiScore: decimal('ai_score', { precision: 5, scale: 2 }), // AI performance prediction
  sentiment: varchar('sentiment', { length: 20 }), // positive, negative, neutral
  trending: boolean('trending').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  artistIdIdx: index('content_performance_artist_id_idx').on(table.artistId),
  platformIdx: index('content_performance_platform_idx').on(table.platform),
  postedAtIdx: index('content_performance_posted_at_idx').on(table.postedAt),
  contentTypeIdx: index('content_performance_content_type_idx').on(table.contentType),
  aiScoreIdx: index('content_performance_ai_score_idx').on(table.aiScore),
}));

// Predictive Analytics Table
export const predictiveAnalytics = pgTable('predictive_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  metric: varchar('metric', { length: 100 }).notNull(), // followers, revenue, streams, engagement
  platform: varchar('platform', { length: 50 }),
  currentValue: decimal('current_value', { precision: 10, scale: 2 }),
  predictedValue: decimal('predicted_value', { precision: 10, scale: 2 }),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  timeframe: varchar('timeframe', { length: 20 }), // 1_week, 1_month, 3_months, 6_months, 1_year
  trend: varchar('trend', { length: 20 }), // increasing, decreasing, stable
  growthRate: decimal('growth_rate', { precision: 5, scale: 2 }),
  factors: jsonb('factors'), // influencing factors
  recommendations: jsonb('recommendations'), // AI recommendations
  lastUpdated: timestamp('last_updated').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  artistIdIdx: index('predictive_analytics_artist_id_idx').on(table.artistId),
  metricIdx: index('predictive_analytics_metric_idx').on(table.metric),
  platformIdx: index('predictive_analytics_platform_idx').on(table.platform),
  timeframeIdx: index('predictive_analytics_timeframe_idx').on(table.timeframe),
}));

// Automated Workflows Table
export const automatedWorkflows = pgTable('automated_workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  artistId: uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // content_scheduling, social_media, revenue_tracking
  enabled: boolean('enabled').default(true),
  schedule: jsonb('schedule'), // cron schedule or time-based triggers
  conditions: jsonb('conditions'), // trigger conditions
  actions: jsonb('actions'), // automated actions
  lastExecuted: timestamp('last_executed'),
  nextExecution: timestamp('next_execution'),
  successCount: integer('success_count').default(0),
  failureCount: integer('failure_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  artistIdIdx: index('automated_workflows_artist_id_idx').on(table.artistId),
  typeIdx: index('automated_workflows_type_idx').on(table.type),
  enabledIdx: index('automated_workflows_enabled_idx').on(table.enabled),
  nextExecutionIdx: index('automated_workflows_next_execution_idx').on(table.nextExecution),
}));

// Relations
export const artistsRelations = relations(artists, ({ many }) => ({
  socialMetrics: many(socialMetrics),
  careerMilestones: many(careerMilestones),
  revenueStreams: many(revenueStreams),
  aiInsights: many(aiInsights),
  aiAgents: many(aiAgents),
  contentPerformance: many(contentPerformance),
  predictiveAnalytics: many(predictiveAnalytics),
  automatedWorkflows: many(automatedWorkflows),
}));

export const socialMetricsRelations = relations(socialMetrics, ({ one }) => ({
  artist: one(artists, {
    fields: [socialMetrics.artistId],
    references: [artists.id],
  }),
}));

export const careerMilestonesRelations = relations(careerMilestones, ({ one }) => ({
  artist: one(artists, {
    fields: [careerMilestones.artistId],
    references: [artists.id],
  }),
}));

export const revenueStreamsRelations = relations(revenueStreams, ({ one }) => ({
  artist: one(artists, {
    fields: [revenueStreams.artistId],
    references: [artists.id],
  }),
}));

export const aiInsightsRelations = relations(aiInsights, ({ one }) => ({
  artist: one(artists, {
    fields: [aiInsights.artistId],
    references: [artists.id],
  }),
}));

export const aiAgentsRelations = relations(aiAgents, ({ one }) => ({
  artist: one(artists, {
    fields: [aiAgents.artistId],
    references: [artists.id],
  }),
}));

export const contentPerformanceRelations = relations(contentPerformance, ({ one }) => ({
  artist: one(artists, {
    fields: [contentPerformance.artistId],
    references: [artists.id],
  }),
}));

export const predictiveAnalyticsRelations = relations(predictiveAnalytics, ({ one }) => ({
  artist: one(artists, {
    fields: [predictiveAnalytics.artistId],
    references: [artists.id],
  }),
}));

export const automatedWorkflowsRelations = relations(automatedWorkflows, ({ one }) => ({
  artist: one(artists, {
    fields: [automatedWorkflows.artistId],
    references: [artists.id],
  }),
}));

// Types
export type Artist = typeof artists.$inferSelect;
export type NewArtist = typeof artists.$inferInsert;

export type SocialMetric = typeof socialMetrics.$inferSelect;
export type NewSocialMetric = typeof socialMetrics.$inferInsert;

export type CareerMilestone = typeof careerMilestones.$inferSelect;
export type NewCareerMilestone = typeof careerMilestones.$inferInsert;

export type RevenueStream = typeof revenueStreams.$inferSelect;
export type NewRevenueStream = typeof revenueStreams.$inferInsert;

export type AIInsight = typeof aiInsights.$inferSelect;
export type NewAIInsight = typeof aiInsights.$inferInsert;

export type AIAgent = typeof aiAgents.$inferSelect;
export type NewAIAgent = typeof aiAgents.$inferInsert;

export type ContentPerformance = typeof contentPerformance.$inferSelect;
export type NewContentPerformance = typeof contentPerformance.$inferInsert;

export type PredictiveAnalytic = typeof predictiveAnalytics.$inferSelect;
export type NewPredictiveAnalytic = typeof predictiveAnalytics.$inferInsert;

export type AutomatedWorkflow = typeof automatedWorkflows.$inferSelect;
export type NewAutomatedWorkflow = typeof automatedWorkflows.$inferInsert;