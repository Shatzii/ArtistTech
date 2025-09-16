import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for NextAuth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table with enterprise features and new role system
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default('user'), // user, admin, enterprise
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: varchar("mfa_secret", { length: 255 }),
  lastLogin: timestamp("last_login"),
  name: varchar("name", { length: 255 }).notNull(),
  userType: varchar("user_type", { length: 50 }).notNull().default('student'),
  subscriptionTier: varchar("subscription_tier", { length: 50 }).notNull().default('free'),
  subscriptionStatus: varchar("subscription_status", { length: 50 }).notNull().default('inactive'),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Enterprise features
  schoolId: varchar("school_id", { length: 100 }),
  licenseKey: varchar("license_key", { length: 255 }),
  maxStudents: integer("max_students").default(1),
  billingEmail: varchar("billing_email", { length: 255 }),
  whitelabelConfig: jsonb("whitelabel_config"),
  // New ArtistTech Role System
  roles: jsonb("roles").default('["fan"]'), // Artist, Fan, DJ, Engineer, Lighting Tech, Videographer, Road Manager, Promoter
  skills: jsonb("skills").default('[]'), // User's professional skills
  availability: jsonb("availability").default('{}'), // Scheduling availability
  bio: text("bio"),
  location: varchar("location", { length: 255 }),
  // ATP/ATC Integration
  atpBalance: integer("atp_balance").default(0), // ArtistTech Points (non-crypto)
  atcBalance: decimal("atc_balance", { precision: 18, scale: 8 }).default('0'), // ArtistCoin Token
  totalAtpEarned: integer("total_atp_earned").default(0),
  foundingMember: boolean("founding_member").default(false),
  foundingNftId: varchar("founding_nft_id", { length: 100 }),
  // Engagement & Ranking
  influenceScore: integer("influence_score").default(0),
  creatorRank: integer("creator_rank").default(0),
  fanCrewsJoined: integer("fan_crews_joined").default(0),
  showsBooked: integer("shows_booked").default(0),
  gigsCompleted: integer("gigs_completed").default(0),
});

// Projects table for multimedia creation
export const projects = pgTable("projects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'music', 'video', 'dj', 'lesson'
  description: text("description"),
  data: jsonb("data").notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audio files management
export const audioFiles = pgTable("audio_files", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  fileSize: integer("file_size").notNull(),
  duration: varchar("duration", { length: 20 }), // Changed to varchar for compatibility
  bpm: integer("bpm"),
  key: varchar("key", { length: 10 }),
  genre: varchar("genre", { length: 100 }),
  mimeType: varchar("mime_type", { length: 100 }).notNull().default('audio/wav'), // Added missing field
  path: varchar("path", { length: 500 }).notNull().default(''), // Added missing field for backward compatibility
  size: integer("size").notNull().default(0), // Added missing field
  createdAt: timestamp("created_at").defaultNow(),
});

// Video files management
export const videoFiles = pgTable("video_files", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  fileSize: integer("file_size").notNull(),
  duration: decimal("duration", { precision: 10, scale: 3 }),
  resolution: varchar("resolution", { length: 20 }),
  fps: integer("fps"),
  codec: varchar("codec", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI generation history
export const aiGenerations = pgTable("ai_generations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  engine: varchar("engine", { length: 100 }).notNull(), // 'neural_audio', 'video_ai', etc.
  prompt: text("prompt").notNull(),
  parameters: jsonb("parameters"),
  outputPath: varchar("output_path", { length: 500 }),
  status: varchar("status", { length: 50 }).notNull().default('pending'),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Learning progress for adaptive AI
export const learningProgress = pgTable("learning_progress", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  skill: varchar("skill", { length: 100 }).notNull(),
  level: integer("level").notNull().default(1),
  progress: decimal("progress", { precision: 5, scale: 2 }).notNull().default('0.00'),
  masteryScore: decimal("mastery_score", { precision: 5, scale: 2 }),
  lastPracticed: timestamp("last_practiced"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// MIDI controller presets
export const midiPresets = pgTable("midi_presets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  controllerType: varchar("controller_type", { length: 100 }).notNull(),
  mapping: jsonb("mapping").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Collaboration and sharing
export const collaborations = pgTable("collaborations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  collaboratorId: integer("collaborator_id").references(() => users.id).notNull(),
  permissions: varchar("permissions", { length: 50 }).notNull().default('view'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics for business insights
export const analytics = pgTable("analytics", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  event: varchar("event", { length: 100 }).notNull(),
  data: jsonb("data"),
  timestamp: timestamp("timestamp").defaultNow(),
  sessionId: varchar("session_id", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
});

// CMS Settings for site configuration
export const cmsSettings = pgTable("cms_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 50 }).notNull().default('text'), // 'text', 'image', 'json', 'boolean'
  category: varchar("category", { length: 100 }).notNull().default('general'),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CMS Pages for dynamic content management
export const cmsPages = pgTable("cms_pages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  featuredImage: varchar("featured_image", { length: 500 }),
  status: varchar("status", { length: 50 }).notNull().default('draft'), // 'draft', 'published', 'archived'
  template: varchar("template", { length: 100 }).default('default'),
  seoData: jsonb("seo_data"),
  isHomePage: boolean("is_home_page").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CMS Features for toggling site functionality
export const cmsFeatures = pgTable("cms_features", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // 'studio', 'ai', 'business', 'education'
  isEnabled: boolean("is_enabled").default(true),
  config: jsonb("config"), // Feature-specific configuration
  requirements: jsonb("requirements"), // Dependencies, subscription tiers, etc.
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CMS Media for managing uploaded assets
export const cmsMedia = pgTable("cms_media", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  width: integer("width"),
  height: integer("height"),
  alt: text("alt"),
  caption: text("caption"),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  isPublic: boolean("is_public").default(true),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CMS Navigation for dynamic menu management
export const cmsNavigation = pgTable("cms_navigation", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  label: varchar("label", { length: 255 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  target: varchar("target", { length: 20 }).default('_self'), // '_self', '_blank'
  cssClass: varchar("css_class", { length: 200 }),
  permissions: jsonb("permissions"), // User roles/permissions required
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fan Crews table for show funding
export const fanCrews = pgTable("fan_crews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  leaderId: integer("leader_id").references(() => users.id).notNull(),
  targetArtistId: integer("target_artist_id").references(() => users.id),
  fundingGoal: decimal("funding_goal", { precision: 10, scale: 2 }).notNull(),
  currentFunding: decimal("current_funding", { precision: 10, scale: 2 }).default('0'),
  showThreshold: decimal("show_threshold", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).default('forming'), // forming, funding, booked, completed
  targetDate: timestamp("target_date"),
  venueBooked: boolean("venue_booked").default(false),
  memberCount: integer("member_count").default(1),
  profitSharePercentage: decimal("profit_share_percentage", { precision: 5, scale: 2 }).default('10'),
  tags: jsonb("tags").default('[]'),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fan Crew Memberships table
export const fanCrewMemberships = pgTable("fan_crew_memberships", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  crewId: integer("crew_id").references(() => fanCrews.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contributionAmount: decimal("contribution_amount", { precision: 10, scale: 2 }).default('0'),
  role: varchar("role", { length: 50 }).default('member'), // leader, co-leader, member
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Shows table for events and concerts
export const shows = pgTable("shows", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  artistId: integer("artist_id").references(() => users.id).notNull(),
  fanCrewId: integer("fan_crew_id").references(() => fanCrews.id),
  venueId: integer("venue_id").references(() => artistHouses.id),
  customVenue: varchar("custom_venue", { length: 255 }),
  showDate: timestamp("show_date").notNull(),
  doorTime: timestamp("door_time"),
  showTime: timestamp("show_time"),
  endTime: timestamp("end_time"),
  ticketPrice: decimal("ticket_price", { precision: 8, scale: 2 }),
  capacity: integer("capacity"),
  soldTickets: integer("sold_tickets").default(0),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default('0'),
  artistPayout: decimal("artist_payout", { precision: 10, scale: 2 }).default('0'),
  crewPayout: decimal("crew_payout", { precision: 10, scale: 2 }).default('0'),
  status: varchar("status", { length: 50 }).default('planned'), // planned, confirmed, live, completed, cancelled
  playlist: jsonb("playlist").default('[]'),
  liveVoting: boolean("live_voting").default(false),
  streamUrl: varchar("stream_url", { length: 500 }),
  recordingUrl: varchar("recording_url", { length: 500 }),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Artist Houses table for global venues
export const artistHouses = pgTable("artist_houses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  capacity: integer("capacity"),
  amenities: jsonb("amenities").default('[]'), // studio, lodging, cafe, streaming_terrace
  pricing: jsonb("pricing").default('{}'), // different rates for different spaces
  availability: jsonb("availability").default('{}'),
  managerId: integer("manager_id").references(() => users.id),
  status: varchar("status", { length: 50 }).default('planning'), // planning, construction, active, maintenance
  images: jsonb("images").default('[]'),
  virtualTourUrl: varchar("virtual_tour_url", { length: 500 }),
  bookingInstructions: text("booking_instructions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gigs table for role-based work opportunities
export const gigs = pgTable("gigs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  posterId: integer("poster_id").references(() => users.id).notNull(),
  showId: integer("show_id").references(() => shows.id),
  role: varchar("role", { length: 50 }).notNull(), // DJ, Engineer, Lighting Tech, etc.
  skillsRequired: jsonb("skills_required").default('[]'),
  paymentAmount: decimal("payment_amount", { precision: 8, scale: 2 }),
  paymentType: varchar("payment_type", { length: 20 }).default('fiat'), // fiat, atp, atc
  location: varchar("location", { length: 255 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: varchar("status", { length: 50 }).default('open'), // open, assigned, in_progress, completed, cancelled
  assignedToId: integer("assigned_to_id").references(() => users.id),
  applicantCount: integer("applicant_count").default(0),
  isRemote: boolean("is_remote").default(false),
  urgency: varchar("urgency", { length: 20 }).default('normal'), // low, normal, high, urgent
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ATP Transactions table for tracking point earnings
export const atpTransactions = pgTable("atp_transactions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // earned, spent, transferred
  source: varchar("source", { length: 100 }).notNull(), // watching, commenting, voting, creating, gig_completion
  description: text("description"),
  relatedId: integer("related_id"), // ID of related content, show, gig, etc.
  relatedType: varchar("related_type", { length: 50 }), // content, show, gig, crew
  metadata: jsonb("metadata").default('{}'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Global Stats table for dashboard metrics
export const globalStats = pgTable("global_stats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  metric: varchar("metric", { length: 100 }).notNull().unique(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  metadata: jsonb("metadata").default('{}'),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const insertProjectSchema = createInsertSchema(projects);

export const insertAudioFileSchema = createInsertSchema(audioFiles);

export const insertVideoFileSchema = createInsertSchema(videoFiles);

export const insertAiGenerationSchema = createInsertSchema(aiGenerations);

// CMS validation schemas
export const insertCmsSettingSchema = createInsertSchema(cmsSettings);

export const insertCmsPageSchema = createInsertSchema(cmsPages);

export const insertCmsFeatureSchema = createInsertSchema(cmsFeatures);

export const insertCmsMediaSchema = createInsertSchema(cmsMedia);

export const insertCmsNavigationSchema = createInsertSchema(cmsNavigation);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type AudioFile = typeof audioFiles.$inferSelect;
export type InsertAudioFile = z.infer<typeof insertAudioFileSchema>;

export type VideoFile = typeof videoFiles.$inferSelect;
export type InsertVideoFile = z.infer<typeof insertVideoFileSchema>;

export type AiGeneration = typeof aiGenerations.$inferSelect;
export type InsertAiGeneration = z.infer<typeof insertAiGenerationSchema>;

export type LearningProgress = typeof learningProgress.$inferSelect;
export type MidiPreset = typeof midiPresets.$inferSelect;
export type Collaboration = typeof collaborations.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;

// CMS Types
export type CmsSetting = typeof cmsSettings.$inferSelect;
export type InsertCmsSetting = z.infer<typeof insertCmsSettingSchema>;

export type CmsPage = typeof cmsPages.$inferSelect;
export type InsertCmsPage = z.infer<typeof insertCmsPageSchema>;

export type CmsFeature = typeof cmsFeatures.$inferSelect;
export type InsertCmsFeature = z.infer<typeof insertCmsFeatureSchema>;

export type CmsMedia = typeof cmsMedia.$inferSelect;
export type InsertCmsMedia = z.infer<typeof insertCmsMediaSchema>;

export type CmsNavigation = typeof cmsNavigation.$inferSelect;
export type InsertCmsNavigation = z.infer<typeof insertCmsNavigationSchema>;

// New ArtistTech Types
export type FanCrew = typeof fanCrews.$inferSelect;
export type InsertFanCrew = typeof fanCrews.$inferInsert;

export type FanCrewMembership = typeof fanCrewMemberships.$inferSelect;
export type InsertFanCrewMembership = typeof fanCrewMemberships.$inferInsert;

export type Show = typeof shows.$inferSelect;
export type InsertShow = typeof shows.$inferInsert;

export type ArtistHouse = typeof artistHouses.$inferSelect;
export type InsertArtistHouse = typeof artistHouses.$inferInsert;

export type Gig = typeof gigs.$inferSelect;
export type InsertGig = typeof gigs.$inferInsert;

export type AtpTransaction = typeof atpTransactions.$inferSelect;
export type InsertAtpTransaction = typeof atpTransactions.$inferInsert;

export type GlobalStat = typeof globalStats.$inferSelect;
export type InsertGlobalStat = typeof globalStats.$inferInsert;

// ARTIST TECH CREATIVE ECONOMY SYSTEM
// Revolutionary cryptocurrency and creative rewards platform

// Creative Currency System (ARTIST tokens)
export const creativeCurrency = pgTable("creative_currency", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  balance: decimal("balance", { precision: 18, scale: 8 }).notNull().default('0'),
  totalEarned: decimal("total_earned", { precision: 18, scale: 8 }).notNull().default('0'),
  totalSpent: decimal("total_spent", { precision: 18, scale: 8 }).notNull().default('0'),
  stakingAmount: decimal("staking_amount", { precision: 18, scale: 8 }).notNull().default('0'),
  stakingRewards: decimal("staking_rewards", { precision: 18, scale: 8 }).notNull().default('0'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Listening Rewards & Engagement Mining
export const listeningRewards = pgTable("listening_rewards", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contentId: integer("content_id").notNull(), // References projects, audio, or video
  contentType: varchar("content_type", { length: 50 }).notNull(), // 'audio', 'video', 'project'
  artistId: integer("artist_id").references(() => users.id).notNull(),
  listeningDuration: integer("listening_duration").notNull(), // in seconds
  qualityScore: decimal("quality_score", { precision: 5, scale: 2 }).notNull(), // 0-100 engagement quality
  rewardAmount: decimal("reward_amount", { precision: 18, scale: 8 }).notNull(),
  artistEarning: decimal("artist_earning", { precision: 18, scale: 8 }).notNull(),
  platformShare: decimal("platform_share", { precision: 18, scale: 8 }).notNull(),
  bonusMultiplier: decimal("bonus_multiplier", { precision: 3, scale: 2 }).notNull().default('1.0'),
  deviceType: varchar("device_type", { length: 50 }),
  location: varchar("location", { length: 100 }),
  sessionId: varchar("session_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Artist Revenue Streams
export const artistEarnings = pgTable("artist_earnings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  artistId: integer("artist_id").references(() => users.id).notNull(),
  earningType: varchar("earning_type", { length: 50 }).notNull(), // 'streaming', 'tips', 'nft', 'collaboration', 'royalties'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  sourceUserId: integer("source_user_id").references(() => users.id),
  sourceContentId: integer("source_content_id"),
  transactionHash: varchar("transaction_hash", { length: 255 }),
  payoutStatus: varchar("payout_status", { length: 50 }).notNull().default('pending'),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Creative Staking & Governance
export const creativeStaking = pgTable("creative_staking", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  stakingType: varchar("staking_type", { length: 50 }).notNull(), // 'artist', 'content', 'platform', 'governance'
  stakedAmount: decimal("staked_amount", { precision: 18, scale: 8 }).notNull(),
  targetId: integer("target_id"), // Artist or content being staked on
  lockPeriod: integer("lock_period").notNull(), // in days
  expectedReturn: decimal("expected_return", { precision: 5, scale: 2 }).notNull(),
  currentRewards: decimal("current_rewards", { precision: 18, scale: 8 }).notNull().default('0'),
  status: varchar("status", { length: 50 }).notNull().default('active'),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  autoRenew: boolean("auto_renew").default(false),
});

// NFT & Digital Collectibles
export const creativeNFTs = pgTable("creative_nfts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  contentId: integer("content_id"), // References original content
  tokenId: varchar("token_id", { length: 255 }).unique().notNull(),
  contractAddress: varchar("contract_address", { length: 255 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  audioUrl: varchar("audio_url", { length: 500 }),
  videoUrl: varchar("video_url", { length: 500 }),
  metadata: jsonb("metadata"),
  rarity: varchar("rarity", { length: 50 }).notNull().default('common'), // common, rare, epic, legendary
  totalSupply: integer("total_supply").notNull().default(1),
  currentSupply: integer("current_supply").notNull().default(1),
  royaltyPercentage: decimal("royalty_percentage", { precision: 5, scale: 2 }).notNull().default('10'),
  mintPrice: decimal("mint_price", { precision: 18, scale: 8 }),
  floorPrice: decimal("floor_price", { precision: 18, scale: 8 }),
  lastSalePrice: decimal("last_sale_price", { precision: 18, scale: 8 }),
  tradingVolume: decimal("trading_volume", { precision: 18, scale: 8 }).notNull().default('0'),
  isListed: boolean("is_listed").default(false),
  listingPrice: decimal("listing_price", { precision: 18, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Creator Fund & Grants
export const creatorFund = pgTable("creator_fund", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  recipientId: integer("recipient_id").references(() => users.id).notNull(),
  fundType: varchar("fund_type", { length: 50 }).notNull(), // 'grant', 'advance', 'prize', 'bonus'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  criteria: text("criteria"),
  projectDescription: text("project_description"),
  milestones: jsonb("milestones"),
  status: varchar("status", { length: 50 }).notNull().default('pending'), // pending, approved, disbursed, completed
  approvedBy: integer("approved_by").references(() => users.id),
  disbursedAmount: decimal("disbursed_amount", { precision: 18, scale: 8 }).notNull().default('0'),
  completionPercentage: decimal("completion_percentage", { precision: 5, scale: 2 }).notNull().default('0'),
  applicationDate: timestamp("application_date").defaultNow(),
  approvalDate: timestamp("approval_date"),
  completionDate: timestamp("completion_date"),
});

// Collaboration Revenue Sharing
export const collaborationSharing = pgTable("collaboration_sharing", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  primaryArtistId: integer("primary_artist_id").references(() => users.id).notNull(),
  collaboratorId: integer("collaborator_id").references(() => users.id).notNull(),
  sharePercentage: decimal("share_percentage", { precision: 5, scale: 2 }).notNull(),
  roleType: varchar("role_type", { length: 50 }).notNull(), // 'vocalist', 'producer', 'mixer', 'songwriter', 'featured'
  contributionDescription: text("contribution_description"),
  totalEarnings: decimal("total_earnings", { precision: 18, scale: 8 }).notNull().default('0'),
  paidOut: decimal("paid_out", { precision: 18, scale: 8 }).notNull().default('0'),
  status: varchar("status", { length: 50 }).notNull().default('active'),
  agreementHash: varchar("agreement_hash", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Platform Governance & Voting
export const governanceVoting = pgTable("governance_voting", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  proposalId: varchar("proposal_id", { length: 100 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  proposalType: varchar("proposal_type", { length: 50 }).notNull(), // 'feature', 'economic', 'governance', 'emergency'
  proposerId: integer("proposer_id").references(() => users.id).notNull(),
  votingPower: decimal("voting_power", { precision: 18, scale: 8 }).notNull(),
  options: jsonb("options").notNull(),
  currentVotes: jsonb("current_votes").notNull().default('{}'),
  totalVotes: decimal("total_votes", { precision: 18, scale: 8 }).notNull().default('0'),
  requiredQuorum: decimal("required_quorum", { precision: 18, scale: 8 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default('active'), // active, passed, failed, executed
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date").notNull(),
  executionDate: timestamp("execution_date"),
});

// Transaction History
export const currencyTransactions = pgTable("currency_transactions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fromUserId: integer("from_user_id").references(() => users.id),
  toUserId: integer("to_user_id").references(() => users.id),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // 'listening_reward', 'tip', 'purchase', 'staking', 'withdrawal'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  fee: decimal("fee", { precision: 18, scale: 8 }).notNull().default('0'),
  status: varchar("status", { length: 50 }).notNull().default('pending'), // pending, confirmed, failed, refunded
  reference: varchar("reference", { length: 255 }), // External transaction reference
  metadata: jsonb("metadata"),
  blockchainTxHash: varchar("blockchain_tx_hash", { length: 255 }),
  gasUsed: decimal("gas_used", { precision: 18, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
});

// Marketplace & Trading
export const marketplaceListing = pgTable("marketplace_listing", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sellerId: integer("seller_id").references(() => users.id).notNull(),
  itemType: varchar("item_type", { length: 50 }).notNull(), // 'nft', 'beat', 'sample', 'preset', 'service'
  itemId: integer("item_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 20 }).notNull().default('ARTIST'),
  category: varchar("category", { length: 50 }),
  tags: jsonb("tags"),
  imageUrl: varchar("image_url", { length: 500 }),
  previewUrl: varchar("preview_url", { length: 500 }),
  downloads: integer("downloads").notNull().default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  ratingCount: integer("rating_count").notNull().default(0),
  isExclusive: boolean("is_exclusive").default(false),
  licenseType: varchar("license_type", { length: 50 }).notNull().default('standard'),
  status: varchar("status", { length: 50 }).notNull().default('active'), // active, sold, removed, suspended
  listedAt: timestamp("listed_at").defaultNow(),
  soldAt: timestamp("sold_at"),
});

// Purchase History
export const marketplacePurchases = pgTable("marketplace_purchases", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  sellerId: integer("seller_id").references(() => users.id).notNull(),
  listingId: integer("listing_id").references(() => marketplaceListing.id).notNull(),
  itemType: varchar("item_type", { length: 50 }).notNull(),
  itemId: integer("item_id").notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 20 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 18, scale: 8 }).notNull(),
  royaltyFee: decimal("royalty_fee", { precision: 18, scale: 8 }).notNull().default('0'),
  licenseGranted: varchar("license_granted", { length: 50 }).notNull(),
  downloadUrl: varchar("download_url", { length: 500 }),
  transactionHash: varchar("transaction_hash", { length: 255 }),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

// Creative Economy Schema Validation
export const insertCreativeCurrencySchema = createInsertSchema(creativeCurrency);

export const insertListeningRewardSchema = createInsertSchema(listeningRewards);

export const insertArtistEarningSchema = createInsertSchema(artistEarnings);

export const insertCreativeNFTSchema = createInsertSchema(creativeNFTs);

export const insertMarketplaceListingSchema = createInsertSchema(marketplaceListing);

// Creative Economy Types
export type CreativeCurrency = typeof creativeCurrency.$inferSelect;
export type InsertCreativeCurrency = z.infer<typeof insertCreativeCurrencySchema>;

export type ListeningReward = typeof listeningRewards.$inferSelect;
export type InsertListeningReward = z.infer<typeof insertListeningRewardSchema>;

export type ArtistEarning = typeof artistEarnings.$inferSelect;
export type InsertArtistEarning = z.infer<typeof insertArtistEarningSchema>;

export type CreativeNFT = typeof creativeNFTs.$inferSelect;
export type InsertCreativeNFT = z.infer<typeof insertCreativeNFTSchema>;

export type CreativeStaking = typeof creativeStaking.$inferSelect;
export type CreatorFund = typeof creatorFund.$inferSelect;
export type CollaborationSharing = typeof collaborationSharing.$inferSelect;
export type GovernanceVoting = typeof governanceVoting.$inferSelect;
export type CurrencyTransaction = typeof currencyTransactions.$inferSelect;
export type MarketplaceListing = typeof marketplaceListing.$inferSelect;
export type InsertMarketplaceListing = z.infer<typeof insertMarketplaceListingSchema>;
export type MarketplacePurchase = typeof marketplacePurchases.$inferSelect;