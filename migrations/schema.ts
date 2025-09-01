import { pgTable, serial, text, integer, timestamp, foreignKey, jsonb, boolean, unique, index, varchar, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const audioFiles = pgTable("audio_files", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	originalName: text("original_name").notNull(),
	path: text().notNull(),
	duration: integer(),
	bpm: integer(),
	key: text(),
	mimeType: text("mime_type").notNull(),
	size: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
	id: serial().primaryKey().notNull(),
	lessonId: integer("lesson_id").notNull(),
	senderId: integer("sender_id").notNull(),
	senderType: text("sender_type").notNull(),
	message: text().notNull(),
	timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
	type: text().default('text'),
});

export const classroomSessions = pgTable("classroom_sessions", {
	id: serial().primaryKey().notNull(),
	classroomId: text("classroom_id").notNull(),
	startTime: timestamp("start_time", { mode: 'string' }).defaultNow().notNull(),
	endTime: timestamp("end_time", { mode: 'string' }),
	topic: text(),
	recording: text(),
	attendees: integer().default(0),
	sessionData: jsonb("session_data"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.classroomId],
			foreignColumns: [classrooms.id],
			name: "classroom_sessions_classroom_id_classrooms_id_fk"
		}),
]);

export const exercises = pgTable("exercises", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	difficulty: text().notNull(),
	instrument: text().notNull(),
	audioPath: text("audio_path"),
	sheetMusicPath: text("sheet_music_path"),
	instructions: text(),
	voiceCommands: text("voice_commands").array(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const lessonRecordings = pgTable("lesson_recordings", {
	id: serial().primaryKey().notNull(),
	lessonId: integer("lesson_id").notNull(),
	type: text().notNull(),
	path: text().notNull(),
	startTime: timestamp("start_time", { mode: 'string' }).notNull(),
	endTime: timestamp("end_time", { mode: 'string' }),
	size: integer().notNull(),
	metadata: jsonb(),
});

export const lessons = pgTable("lessons", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	teacherId: integer("teacher_id").notNull(),
	studentId: integer("student_id").notNull(),
	scheduledAt: timestamp("scheduled_at", { mode: 'string' }).notNull(),
	duration: integer().default(30).notNull(),
	status: text().default('scheduled').notNull(),
	recordingPath: text("recording_path"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	type: text().notNull(),
	data: jsonb().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const studentEnrollments = pgTable("student_enrollments", {
	id: serial().primaryKey().notNull(),
	studentId: integer("student_id").notNull(),
	classroomId: text("classroom_id").notNull(),
	enrolledAt: timestamp("enrolled_at", { mode: 'string' }).defaultNow().notNull(),
	status: text().default('active'),
}, (table) => [
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "student_enrollments_student_id_students_id_fk"
		}),
	foreignKey({
			columns: [table.classroomId],
			foreignColumns: [classrooms.id],
			name: "student_enrollments_classroom_id_classrooms_id_fk"
		}),
]);

export const studentProgress = pgTable("student_progress", {
	id: serial().primaryKey().notNull(),
	studentId: integer("student_id").notNull(),
	exerciseId: integer("exercise_id").notNull(),
	completed: boolean().default(false),
	score: integer(),
	attempts: integer().default(0),
	timeSpent: integer("time_spent"),
	lastAttempt: timestamp("last_attempt", { mode: 'string' }),
	feedback: text(),
});

export const sharedContent = pgTable("shared_content", {
	id: serial().primaryKey().notNull(),
	classroomId: text("classroom_id").notNull(),
	userId: text("user_id").notNull(),
	userType: text("user_type").notNull(),
	contentType: text("content_type").notNull(),
	title: text().notNull(),
	description: text(),
	fileUrl: text("file_url"),
	projectData: jsonb("project_data"),
	isPublic: boolean("is_public").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.classroomId],
			foreignColumns: [classrooms.id],
			name: "shared_content_classroom_id_classrooms_id_fk"
		}),
]);

export const classrooms = pgTable("classrooms", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	teacherId: integer("teacher_id").notNull(),
	description: text(),
	maxStudents: integer("max_students").default(20),
	isActive: boolean("is_active").default(false),
	streamUrl: text("stream_url"),
	chatEnabled: boolean("chat_enabled").default(true),
	shareEnabled: boolean("share_enabled").default(true),
	currentTopic: text("current_topic"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.teacherId],
			foreignColumns: [teachers.id],
			name: "classrooms_teacher_id_teachers_id_fk"
		}),
]);

export const liveClassParticipants = pgTable("live_class_participants", {
	id: serial().primaryKey().notNull(),
	sessionId: integer("session_id").notNull(),
	studentId: integer("student_id").notNull(),
	joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow().notNull(),
	leftAt: timestamp("left_at", { mode: 'string' }),
	isActive: boolean("is_active").default(true),
}, (table) => [
	foreignKey({
			columns: [table.sessionId],
			foreignColumns: [classroomSessions.id],
			name: "live_class_participants_session_id_classroom_sessions_id_fk"
		}),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "live_class_participants_student_id_students_id_fk"
		}),
]);

export const students = pgTable("students", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	age: integer(),
	parentEmail: text("parent_email"),
	level: text().default('beginner').notNull(),
	instrument: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	userId: integer("user_id").notNull(),
	passwordHash: text("password_hash").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "students_user_id_users_id_fk"
		}),
	unique("students_email_unique").on(table.email),
]);

export const userSessions = pgTable("user_sessions", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	userType: text("user_type").notNull(),
	token: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const videoFiles = pgTable("video_files", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	originalName: text("original_name").notNull(),
	path: text().notNull(),
	duration: integer(),
	width: integer(),
	height: integer(),
	mimeType: text("mime_type").notNull(),
	size: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const voiceCommands = pgTable("voice_commands", {
	id: serial().primaryKey().notNull(),
	lessonId: integer("lesson_id").notNull(),
	timestamp: timestamp({ mode: 'string' }).notNull(),
	command: text().notNull(),
	recognized: text(),
	confidence: integer(),
	executed: boolean().default(false),
	result: text(),
});

export const sessions = pgTable("sessions", {
	sid: varchar().primaryKey().notNull(),
	sess: json().notNull(),
	expire: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("idx_sessions_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const teachers = pgTable("teachers", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	profileImageUrl: text("profile_image_url"),
	bio: text(),
	specialization: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	userId: integer("user_id").notNull(),
	passwordHash: text("password_hash").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "teachers_user_id_users_id_fk"
		}),
	unique("teachers_email_unique").on(table.email),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	name: text().notNull(),
	userType: text("user_type").notNull(),
	profileImageUrl: text("profile_image_url"),
	isActive: boolean("is_active").default(true),
	emailVerified: boolean("email_verified").default(false),
	subscriptionTier: text("subscription_tier").default('free'),
	subscriptionStatus: text("subscription_status").default('active'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	password: varchar({ length: 255 }),
}, (table) => [
	index("idx_users_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	unique("users_email_unique").on(table.email),
]);
