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

// Users table with enterprise features
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
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

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAudioFileSchema = createInsertSchema(audioFiles).omit({
  id: true,
  createdAt: true,
});

export const insertVideoFileSchema = createInsertSchema(videoFiles).omit({
  id: true,
  createdAt: true,
});

export const insertAiGenerationSchema = createInsertSchema(aiGenerations).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// CMS validation schemas
export const insertCmsSettingSchema = createInsertSchema(cmsSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCmsPageSchema = createInsertSchema(cmsPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCmsFeatureSchema = createInsertSchema(cmsFeatures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCmsMediaSchema = createInsertSchema(cmsMedia).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCmsNavigationSchema = createInsertSchema(cmsNavigation).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

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