-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "audio_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"original_name" text NOT NULL,
	"path" text NOT NULL,
	"duration" integer,
	"bpm" integer,
	"key" text,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"sender_type" text NOT NULL,
	"message" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"type" text DEFAULT 'text'
);
--> statement-breakpoint
CREATE TABLE "classroom_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"classroom_id" text NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"topic" text,
	"recording" text,
	"attendees" integer DEFAULT 0,
	"session_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"difficulty" text NOT NULL,
	"instrument" text NOT NULL,
	"audio_path" text,
	"sheet_music_path" text,
	"instructions" text,
	"voice_commands" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_recordings" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"type" text NOT NULL,
	"path" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"size" integer NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"teacher_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"duration" integer DEFAULT 30 NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"recording_path" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"classroom_id" text NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE "student_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"exercise_id" integer NOT NULL,
	"completed" boolean DEFAULT false,
	"score" integer,
	"attempts" integer DEFAULT 0,
	"time_spent" integer,
	"last_attempt" timestamp,
	"feedback" text
);
--> statement-breakpoint
CREATE TABLE "shared_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"classroom_id" text NOT NULL,
	"user_id" text NOT NULL,
	"user_type" text NOT NULL,
	"content_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_url" text,
	"project_data" jsonb,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"teacher_id" integer NOT NULL,
	"description" text,
	"max_students" integer DEFAULT 20,
	"is_active" boolean DEFAULT false,
	"stream_url" text,
	"chat_enabled" boolean DEFAULT true,
	"share_enabled" boolean DEFAULT true,
	"current_topic" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "live_class_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"left_at" timestamp,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"age" integer,
	"parent_email" text,
	"level" text DEFAULT 'beginner' NOT NULL,
	"instrument" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "students_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"user_type" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"original_name" text NOT NULL,
	"path" text NOT NULL,
	"duration" integer,
	"width" integer,
	"height" integer,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_commands" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"timestamp" timestamp NOT NULL,
	"command" text NOT NULL,
	"recognized" text,
	"confidence" integer,
	"executed" boolean DEFAULT false,
	"result" text
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" json NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"profile_image_url" text,
	"bio" text,
	"specialization" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "teachers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"user_type" text NOT NULL,
	"profile_image_url" text,
	"is_active" boolean DEFAULT true,
	"email_verified" boolean DEFAULT false,
	"subscription_tier" text DEFAULT 'free',
	"subscription_status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"password" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "classroom_sessions" ADD CONSTRAINT "classroom_sessions_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_content" ADD CONSTRAINT "shared_content_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_class_participants" ADD CONSTRAINT "live_class_participants_session_id_classroom_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."classroom_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_class_participants" ADD CONSTRAINT "live_class_participants_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_sessions_expire" ON "sessions" USING btree ("expire" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email" text_ops);
*/