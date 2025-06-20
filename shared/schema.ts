import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
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

// Educational system tables
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  profileImageUrl: text("profile_image_url"),
  bio: text("bio"),
  specialization: text("specialization"), // piano, guitar, vocals, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  age: integer("age"),
  parentEmail: text("parent_email"),
  level: text("level").notNull().default("beginner"), // beginner, intermediate, advanced
  instrument: text("instrument"), // preferred instrument
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  teacherId: integer("teacher_id").notNull(),
  studentId: integer("student_id").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull().default(30), // minutes
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, cancelled
  recordingPath: text("recording_path"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const voiceCommands = pgTable("voice_commands", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  command: text("command").notNull(),
  recognized: text("recognized"),
  confidence: integer("confidence"), // 0-100
  executed: boolean("executed").default(false),
  result: text("result"),
});

export const lessonRecordings = pgTable("lesson_recordings", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  type: text("type").notNull(), // video, audio, screen
  path: text("path").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  size: integer("size").notNull(),
  metadata: jsonb("metadata"), // resolution, fps, etc.
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  instrument: text("instrument").notNull(),
  audioPath: text("audio_path"),
  sheetMusicPath: text("sheet_music_path"),
  instructions: text("instructions"),
  voiceCommands: text("voice_commands").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentProgress = pgTable("student_progress", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  exerciseId: integer("exercise_id").notNull(),
  completed: boolean("completed").default(false),
  score: integer("score"), // 0-100
  attempts: integer("attempts").default(0),
  timeSpent: integer("time_spent"), // minutes
  lastAttempt: timestamp("last_attempt"),
  feedback: text("feedback"),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  senderId: integer("sender_id").notNull(),
  senderType: text("sender_type").notNull(), // teacher, student
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  type: text("type").default("text"), // text, emoji, voice_note
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

// Insert schemas for educational system
export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true,
});

export const insertVoiceCommandSchema = createInsertSchema(voiceCommands).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Type exports
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertAudioFile = z.infer<typeof insertAudioFileSchema>;
export type AudioFile = typeof audioFiles.$inferSelect;
export type InsertVideoFile = z.infer<typeof insertVideoFileSchema>;
export type VideoFile = typeof videoFiles.$inferSelect;

export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type VoiceCommand = typeof voiceCommands.$inferSelect;
export type InsertVoiceCommand = z.infer<typeof insertVoiceCommandSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type LessonRecording = typeof lessonRecordings.$inferSelect;
export type StudentProgress = typeof studentProgress.$inferSelect;

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

// Live streaming and classroom tables
export const classrooms = pgTable("classrooms", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  teacherId: integer("teacher_id").references(() => teachers.id).notNull(),
  description: text("description"),
  maxStudents: integer("max_students").default(20),
  isActive: boolean("is_active").default(false),
  streamUrl: text("stream_url"),
  chatEnabled: boolean("chat_enabled").default(true),
  shareEnabled: boolean("share_enabled").default(true),
  currentTopic: text("current_topic"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classroomSessions = pgTable("classroom_sessions", {
  id: serial("id").primaryKey(),
  classroomId: text("classroom_id").references(() => classrooms.id).notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  topic: text("topic"),
  recording: text("recording"),
  attendees: integer("attendees").default(0),
  sessionData: jsonb("session_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentEnrollments = pgTable("student_enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  classroomId: text("classroom_id").references(() => classrooms.id).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  status: text("status").default("active"),
});

export const liveClassParticipants = pgTable("live_class_participants", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => classroomSessions.id).notNull(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  leftAt: timestamp("left_at"),
  isActive: boolean("is_active").default(true),
});

export const sharedContent = pgTable("shared_content", {
  id: serial("id").primaryKey(),
  classroomId: text("classroom_id").references(() => classrooms.id).notNull(),
  userId: text("user_id").notNull(),
  userType: text("user_type").notNull(), // 'teacher' or 'student'
  contentType: text("content_type").notNull(), // 'audio', 'project', 'composition'
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url"),
  projectData: jsonb("project_data"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSessions = pgTable("user_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  userType: text("user_type").notNull(), // 'teacher' or 'student'
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema types for live streaming
export const insertClassroomSchema = createInsertSchema(classrooms);
export const insertSessionSchema = createInsertSchema(classroomSessions);
export const insertSharedContentSchema = createInsertSchema(sharedContent);

export type Classroom = typeof classrooms.$inferSelect;
export type InsertClassroom = z.infer<typeof insertClassroomSchema>;
export type ClassroomSession = typeof classroomSessions.$inferSelect;
export type InsertClassroomSession = z.infer<typeof insertSessionSchema>;
export type SharedContent = typeof sharedContent.$inferSelect;
export type InsertSharedContent = z.infer<typeof insertSharedContentSchema>;
export type StudentEnrollment = typeof studentEnrollments.$inferSelect;
export type LiveClassParticipant = typeof liveClassParticipants.$inferSelect;
