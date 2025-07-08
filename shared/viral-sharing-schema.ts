
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Song Shares Table
export const songShares = pgTable("song_shares", {
  id: varchar("id").primaryKey(),
  songId: varchar("song_id").notNull(),
  originalSharerId: varchar("original_sharer_id").notNull(),
  shareUrl: text("share_url").notNull(),
  platform: varchar("platform").notNull(),
  trackingCode: varchar("tracking_code").notNull().unique(),
  parentShareId: varchar("parent_share_id"),
  metadata: jsonb("metadata").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Share Statistics Table
export const shareStats = pgTable("share_stats", {
  id: varchar("id").primaryKey(),
  shareId: varchar("share_id").notNull(),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  secondaryShares: integer("secondary_shares").default(0),
  totalReach: integer("total_reach").default(0),
  earnings: decimal("earnings", { precision: 18, scale: 8 }).default("0.00000000"),
  viralScore: decimal("viral_score", { precision: 10, scale: 2 }).default("0.00"),
  lastUpdate: timestamp("last_update").defaultNow(),
});

// Viral Bonuses Table
export const viralBonuses = pgTable("viral_bonuses", {
  id: varchar("id").primaryKey(),
  shareId: varchar("share_id").notNull(),
  userId: varchar("user_id").notNull(),
  bonusType: varchar("bonus_type").notNull(),
  threshold: integer("threshold").notNull(),
  bonus: decimal("bonus", { precision: 18, scale: 8 }).notNull(),
  awarded: boolean("awarded").default(false),
  awardedAt: timestamp("awarded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Share Chain Tracking
export const shareChains = pgTable("share_chains", {
  id: varchar("id").primaryKey(),
  originalShareId: varchar("original_share_id").notNull(),
  chainLength: integer("chain_length").default(1),
  totalReach: integer("total_reach").default(0),
  totalEarnings: decimal("total_earnings", { precision: 18, scale: 8 }).default("0.00000000"),
  viralLevel: varchar("viral_level").default("normal"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Click Tracking for detailed analytics
export const shareClicks = pgTable("share_clicks", {
  id: varchar("id").primaryKey(),
  shareId: varchar("share_id").notNull(),
  trackingCode: varchar("tracking_code").notNull(),
  userId: varchar("user_id"), // Optional, for logged-in users
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  location: varchar("location"),
  ipAddress: varchar("ip_address"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Conversion Tracking
export const shareConversions = pgTable("share_conversions", {
  id: varchar("id").primaryKey(),
  shareId: varchar("share_id").notNull(),
  trackingCode: varchar("tracking_code").notNull(),
  userId: varchar("user_id"),
  conversionType: varchar("conversion_type").notNull(), // 'follow', 'subscribe', 'purchase'
  value: decimal("value", { precision: 18, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Platform Performance Metrics
export const platformMetrics = pgTable("platform_metrics", {
  id: varchar("id").primaryKey(),
  platform: varchar("platform").notNull(),
  totalShares: integer("total_shares").default(0),
  totalClicks: integer("total_clicks").default(0),
  totalConversions: integer("total_conversions").default(0),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 4 }).default("0.0000"),
  averageEarnings: decimal("average_earnings", { precision: 18, scale: 8 }).default("0.00000000"),
  topPerformers: jsonb("top_performers"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Daily Share Performance Summary
export const dailySharePerformance = pgTable("daily_share_performance", {
  id: varchar("id").primaryKey(),
  shareId: varchar("share_id").notNull(),
  date: timestamp("date").notNull(),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  earnings: decimal("earnings", { precision: 18, scale: 8 }).default("0.00000000"),
  viralScore: decimal("viral_score", { precision: 10, scale: 2 }).default("0.00"),
  rank: integer("rank"), // Daily ranking
});

// User Share Analytics
export const userShareAnalytics = pgTable("user_share_analytics", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  totalShares: integer("total_shares").default(0),
  totalClicks: integer("total_clicks").default(0),
  totalEarnings: decimal("total_earnings", { precision: 18, scale: 8 }).default("0.00000000"),
  bestPerformingShareId: varchar("best_performing_share_id"),
  averageViralScore: decimal("average_viral_score", { precision: 10, scale: 2 }).default("0.00"),
  viralBonusesEarned: integer("viral_bonuses_earned").default(0),
  lastShareDate: timestamp("last_share_date"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Indexes for performance
export const viralSharingIndexes = [
  index("idx_song_shares_sharer").on(songShares.originalSharerId),
  index("idx_song_shares_song").on(songShares.songId),
  index("idx_song_shares_tracking").on(songShares.trackingCode),
  index("idx_song_shares_parent").on(songShares.parentShareId),
  index("idx_share_stats_share").on(shareStats.shareId),
  index("idx_viral_bonuses_share").on(viralBonuses.shareId),
  index("idx_viral_bonuses_user").on(viralBonuses.userId),
  index("idx_share_clicks_share").on(shareClicks.shareId),
  index("idx_share_clicks_tracking").on(shareClicks.trackingCode),
  index("idx_share_conversions_share").on(shareConversions.shareId),
  index("idx_platform_metrics_platform").on(platformMetrics.platform),
  index("idx_daily_performance_share_date").on(dailySharePerformance.shareId, dailySharePerformance.date),
  index("idx_user_analytics_user").on(userShareAnalytics.userId),
];

// Types
export type SongShare = typeof songShares.$inferSelect;
export type InsertSongShare = typeof songShares.$inferInsert;
export type ShareStats = typeof shareStats.$inferSelect;
export type InsertShareStats = typeof shareStats.$inferInsert;
export type ViralBonus = typeof viralBonuses.$inferSelect;
export type InsertViralBonus = typeof viralBonuses.$inferInsert;
export type ShareChain = typeof shareChains.$inferSelect;
export type InsertShareChain = typeof shareChains.$inferInsert;
export type ShareClick = typeof shareClicks.$inferSelect;
export type InsertShareClick = typeof shareClicks.$inferInsert;
export type ShareConversion = typeof shareConversions.$inferSelect;
export type InsertShareConversion = typeof shareConversions.$inferInsert;
export type PlatformMetrics = typeof platformMetrics.$inferSelect;
export type InsertPlatformMetrics = typeof platformMetrics.$inferInsert;

// Zod schemas
export const insertSongShareSchema = createInsertSchema(songShares);
export const insertShareStatsSchema = createInsertSchema(shareStats);
export const insertViralBonusSchema = createInsertSchema(viralBonuses);
export const insertShareChainSchema = createInsertSchema(shareChains);
export const insertShareClickSchema = createInsertSchema(shareClicks);
export const insertShareConversionSchema = createInsertSchema(shareConversions);
export const insertPlatformMetricsSchema = createInsertSchema(platformMetrics);
