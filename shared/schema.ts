import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'daw', 'dj', 'video'
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const audioFiles = pgTable("audio_files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  originalName: text("original_name").notNull(),
  path: text("path").notNull(),
  duration: integer("duration"), // in milliseconds
  bpm: integer("bpm"),
  key: text("key"),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const videoFiles = pgTable("video_files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  originalName: text("original_name").notNull(),
  path: text("path").notNull(),
  duration: integer("duration"), // in milliseconds
  width: integer("width"),
  height: integer("height"),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertAudioFile = z.infer<typeof insertAudioFileSchema>;
export type AudioFile = typeof audioFiles.$inferSelect;
export type InsertVideoFile = z.infer<typeof insertVideoFileSchema>;
export type VideoFile = typeof videoFiles.$inferSelect;

// Project data schemas
export const trackSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['audio', 'midi', 'video']),
  volume: z.number().min(0).max(1),
  muted: z.boolean(),
  solo: z.boolean(),
  clips: z.array(z.object({
    id: z.string(),
    fileId: z.number().optional(),
    start: z.number(),
    end: z.number(),
    offset: z.number().default(0),
    volume: z.number().min(0).max(1).default(1),
  })),
});

export const dawProjectDataSchema = z.object({
  bpm: z.number().min(60).max(200).default(120),
  tracks: z.array(trackSchema),
  masterVolume: z.number().min(0).max(1).default(1),
  effects: z.array(z.object({
    id: z.string(),
    type: z.string(),
    enabled: z.boolean(),
    parameters: z.record(z.number()),
  })),
});

export const djProjectDataSchema = z.object({
  deckA: z.object({
    fileId: z.number().optional(),
    bpm: z.number().optional(),
    position: z.number().default(0),
    volume: z.number().min(0).max(1).default(1),
    eqHigh: z.number().min(0).max(1).default(0.5),
    eqMid: z.number().min(0).max(1).default(0.5),
    eqLow: z.number().min(0).max(1).default(0.5),
  }),
  deckB: z.object({
    fileId: z.number().optional(),
    bpm: z.number().optional(),
    position: z.number().default(0),
    volume: z.number().min(0).max(1).default(1),
    eqHigh: z.number().min(0).max(1).default(0.5),
    eqMid: z.number().min(0).max(1).default(0.5),
    eqLow: z.number().min(0).max(1).default(0.5),
  }),
  crossfader: z.number().min(0).max(1).default(0.5),
  masterVolume: z.number().min(0).max(1).default(1),
});

export const videoProjectDataSchema = z.object({
  timeline: z.array(z.object({
    id: z.string(),
    type: z.enum(['video', 'audio']),
    fileId: z.number(),
    start: z.number(),
    end: z.number(),
    track: z.number(),
  })),
  resolution: z.object({
    width: z.number(),
    height: z.number(),
  }).default({ width: 1920, height: 1080 }),
  framerate: z.number().default(30),
});

export type Track = z.infer<typeof trackSchema>;
export type DAWProjectData = z.infer<typeof dawProjectDataSchema>;
export type DJProjectData = z.infer<typeof djProjectDataSchema>;
export type VideoProjectData = z.infer<typeof videoProjectDataSchema>;
