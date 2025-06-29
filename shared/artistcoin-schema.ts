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

// ArtistCoin Wallet System
export const artistCoinWallets = pgTable("artistcoin_wallets", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  balance: decimal("balance", { precision: 18, scale: 8 }).default("0.00000000"),
  totalEarned: decimal("total_earned", { precision: 18, scale: 8 }).default("0.00000000"),
  loginStreak: integer("login_streak").default(0),
  lastLoginReward: timestamp("last_login_reward"),
  profitShareTier: integer("profit_share_tier").default(0), // 0=none, 1=10%, 2=5%
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ArtistCoin Transactions
export const artistCoinTransactions = pgTable("artistcoin_transactions", {
  id: varchar("id").primaryKey(),
  fromWalletId: varchar("from_wallet_id"),
  toWalletId: varchar("to_wallet_id"),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  type: varchar("type").notNull(), // 'login_reward', 'engagement_reward', 'profit_share', 'transfer'
  description: text("description"),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Profit Share Distribution
export const profitShares = pgTable("profit_shares", {
  id: varchar("id").primaryKey(),
  walletId: varchar("wallet_id").notNull(),
  tier: integer("tier").notNull(), // 1=10%, 2=5%
  sharePercentage: decimal("share_percentage", { precision: 5, scale: 2 }).notNull(),
  eligibleFrom: timestamp("eligible_from").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Social Media Platform Connections
export const socialConnections = pgTable("social_connections", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  platform: varchar("platform").notNull(), // 'tiktok', 'instagram', 'twitter', 'youtube', 'spotify'
  platformUserId: varchar("platform_user_id").notNull(),
  platformUsername: varchar("platform_username"),
  accessToken: text("access_token"), // encrypted
  refreshToken: text("refresh_token"), // encrypted
  tokenExpiry: timestamp("token_expiry"),
  isActive: boolean("is_active").default(true),
  lastSync: timestamp("last_sync"),
  followerCount: integer("follower_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Unified Social Media Feed
export const socialFeedItems = pgTable("social_feed_items", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  platform: varchar("platform").notNull(),
  platformPostId: varchar("platform_post_id").notNull(),
  content: text("content"),
  mediaUrls: jsonb("media_urls"), // array of image/video URLs
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  views: integer("views").default(0),
  originalTimestamp: timestamp("original_timestamp"),
  syncedAt: timestamp("synced_at").defaultNow(),
  isVisible: boolean("is_visible").default(true),
});

// User Activity Tracking for Rewards
export const userActivity = pgTable("user_activity", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id"),
  activityType: varchar("activity_type").notNull(), // 'login', 'content_view', 'engagement', 'creation'
  duration: integer("duration"), // in seconds
  metadata: jsonb("metadata"),
  rewardEarned: decimal("reward_earned", { precision: 18, scale: 8 }).default("0.00000000"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Platform Statistics for Rewards Calculation
export const platformStats = pgTable("platform_stats", {
  id: varchar("id").primaryKey(),
  totalUsers: integer("total_users").default(0),
  activeUsers: integer("active_users").default(0),
  totalRevenueUsd: decimal("total_revenue_usd", { precision: 18, scale: 2 }).default("0.00"),
  profitSharePool: decimal("profit_share_pool", { precision: 18, scale: 8 }).default("0.00000000"),
  lastCalculated: timestamp("last_calculated").defaultNow(),
});

// Indexes for performance
export const artistCoinIndexes = [
  index("idx_artistcoin_wallets_user_id").on(artistCoinWallets.userId),
  index("idx_artistcoin_transactions_wallet").on(artistCoinTransactions.fromWalletId, artistCoinTransactions.toWalletId),
  index("idx_social_connections_user_platform").on(socialConnections.userId, socialConnections.platform),
  index("idx_social_feed_user_platform").on(socialFeedItems.userId, socialFeedItems.platform),
  index("idx_user_activity_user_type").on(userActivity.userId, userActivity.activityType),
];

// Types
export type ArtistCoinWallet = typeof artistCoinWallets.$inferSelect;
export type InsertArtistCoinWallet = typeof artistCoinWallets.$inferInsert;
export type ArtistCoinTransaction = typeof artistCoinTransactions.$inferSelect;
export type InsertArtistCoinTransaction = typeof artistCoinTransactions.$inferInsert;
export type SocialConnection = typeof socialConnections.$inferSelect;
export type InsertSocialConnection = typeof socialConnections.$inferInsert;
export type SocialFeedItem = typeof socialFeedItems.$inferSelect;
export type InsertSocialFeedItem = typeof socialFeedItems.$inferInsert;
export type UserActivity = typeof userActivity.$inferSelect;
export type InsertUserActivity = typeof userActivity.$inferInsert;

// Zod schemas
export const insertArtistCoinWalletSchema = createInsertSchema(artistCoinWallets);
export const insertArtistCoinTransactionSchema = createInsertSchema(artistCoinTransactions);
export const insertSocialConnectionSchema = createInsertSchema(socialConnections);
export const insertSocialFeedItemSchema = createInsertSchema(socialFeedItems);
export const insertUserActivitySchema = createInsertSchema(userActivity);