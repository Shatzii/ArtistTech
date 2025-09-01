CREATE TABLE "ai_generations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_generations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"engine" varchar(100) NOT NULL,
	"prompt" text NOT NULL,
	"parameters" jsonb,
	"output_path" varchar(500),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"error" text,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "analytics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "analytics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"event" varchar(100) NOT NULL,
	"data" jsonb,
	"timestamp" timestamp DEFAULT now(),
	"session_id" varchar(255),
	"ip_address" varchar(45)
);
--> statement-breakpoint
CREATE TABLE "artist_earnings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "artist_earnings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"artist_id" integer NOT NULL,
	"earning_type" varchar(50) NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"source_user_id" integer,
	"source_content_id" integer,
	"transaction_hash" varchar(255),
	"payout_status" varchar(50) DEFAULT 'pending' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"processed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "artist_houses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "artist_houses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"capacity" integer,
	"amenities" jsonb DEFAULT '[]',
	"pricing" jsonb DEFAULT '{}',
	"availability" jsonb DEFAULT '{}',
	"manager_id" integer,
	"status" varchar(50) DEFAULT 'planning',
	"images" jsonb DEFAULT '[]',
	"virtual_tour_url" varchar(500),
	"booking_instructions" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "atp_transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "atp_transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"source" varchar(100) NOT NULL,
	"description" text,
	"related_id" integer,
	"related_type" varchar(50),
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cms_features" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cms_features_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"is_enabled" boolean DEFAULT true,
	"config" jsonb,
	"requirements" jsonb,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cms_features_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "cms_media" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cms_media_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"filename" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"file_path" varchar(500) NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"width" integer,
	"height" integer,
	"alt" text,
	"caption" text,
	"uploaded_by" integer,
	"is_public" boolean DEFAULT true,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cms_navigation" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cms_navigation_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"label" varchar(255) NOT NULL,
	"url" varchar(500) NOT NULL,
	"icon" varchar(100),
	"parent_id" integer,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"target" varchar(20) DEFAULT '_self',
	"css_class" varchar(200),
	"permissions" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cms_pages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cms_pages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text,
	"meta_description" text,
	"meta_keywords" text,
	"featured_image" varchar(500),
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"template" varchar(100) DEFAULT 'default',
	"seo_data" jsonb,
	"is_home_page" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cms_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cms_settings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cms_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" varchar(100) NOT NULL,
	"value" text,
	"type" varchar(50) DEFAULT 'text' NOT NULL,
	"category" varchar(100) DEFAULT 'general' NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cms_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "collaboration_sharing" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "collaboration_sharing_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_id" integer NOT NULL,
	"primary_artist_id" integer NOT NULL,
	"collaborator_id" integer NOT NULL,
	"share_percentage" numeric(5, 2) NOT NULL,
	"role_type" varchar(50) NOT NULL,
	"contribution_description" text,
	"total_earnings" numeric(18, 8) DEFAULT '0' NOT NULL,
	"paid_out" numeric(18, 8) DEFAULT '0' NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"agreement_hash" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "collaborations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "collaborations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_id" integer NOT NULL,
	"owner_id" integer NOT NULL,
	"collaborator_id" integer NOT NULL,
	"permissions" varchar(50) DEFAULT 'view' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "creative_currency" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "creative_currency_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"balance" numeric(18, 8) DEFAULT '0' NOT NULL,
	"total_earned" numeric(18, 8) DEFAULT '0' NOT NULL,
	"total_spent" numeric(18, 8) DEFAULT '0' NOT NULL,
	"staking_amount" numeric(18, 8) DEFAULT '0' NOT NULL,
	"staking_rewards" numeric(18, 8) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "creative_nfts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "creative_nfts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"creator_id" integer NOT NULL,
	"owner_id" integer NOT NULL,
	"content_id" integer,
	"token_id" varchar(255) NOT NULL,
	"contract_address" varchar(255),
	"title" varchar(255) NOT NULL,
	"description" text,
	"image_url" varchar(500),
	"audio_url" varchar(500),
	"video_url" varchar(500),
	"metadata" jsonb,
	"rarity" varchar(50) DEFAULT 'common' NOT NULL,
	"total_supply" integer DEFAULT 1 NOT NULL,
	"current_supply" integer DEFAULT 1 NOT NULL,
	"royalty_percentage" numeric(5, 2) DEFAULT '10' NOT NULL,
	"mint_price" numeric(18, 8),
	"floor_price" numeric(18, 8),
	"last_sale_price" numeric(18, 8),
	"trading_volume" numeric(18, 8) DEFAULT '0' NOT NULL,
	"is_listed" boolean DEFAULT false,
	"listing_price" numeric(18, 8),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "creative_nfts_token_id_unique" UNIQUE("token_id")
);
--> statement-breakpoint
CREATE TABLE "creative_staking" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "creative_staking_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"staking_type" varchar(50) NOT NULL,
	"staked_amount" numeric(18, 8) NOT NULL,
	"target_id" integer,
	"lock_period" integer NOT NULL,
	"expected_return" numeric(5, 2) NOT NULL,
	"current_rewards" numeric(18, 8) DEFAULT '0' NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"auto_renew" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "creator_fund" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "creator_fund_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"recipient_id" integer NOT NULL,
	"fund_type" varchar(50) NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"criteria" text,
	"project_description" text,
	"milestones" jsonb,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"approved_by" integer,
	"disbursed_amount" numeric(18, 8) DEFAULT '0' NOT NULL,
	"completion_percentage" numeric(5, 2) DEFAULT '0' NOT NULL,
	"application_date" timestamp DEFAULT now(),
	"approval_date" timestamp,
	"completion_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "currency_transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "currency_transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"from_user_id" integer,
	"to_user_id" integer,
	"transaction_type" varchar(50) NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"fee" numeric(18, 8) DEFAULT '0' NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"reference" varchar(255),
	"metadata" jsonb,
	"blockchain_tx_hash" varchar(255),
	"gas_used" numeric(18, 8),
	"created_at" timestamp DEFAULT now(),
	"confirmed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "fan_crew_memberships" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "fan_crew_memberships_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"crew_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"contribution_amount" numeric(10, 2) DEFAULT '0',
	"role" varchar(50) DEFAULT 'member',
	"joined_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "fan_crews" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "fan_crews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text,
	"leader_id" integer NOT NULL,
	"target_artist_id" integer,
	"funding_goal" numeric(10, 2) NOT NULL,
	"current_funding" numeric(10, 2) DEFAULT '0',
	"show_threshold" numeric(10, 2),
	"status" varchar(50) DEFAULT 'forming',
	"target_date" timestamp,
	"venue_booked" boolean DEFAULT false,
	"member_count" integer DEFAULT 1,
	"profit_share_percentage" numeric(5, 2) DEFAULT '10',
	"tags" jsonb DEFAULT '[]',
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gigs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gigs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"poster_id" integer NOT NULL,
	"show_id" integer,
	"role" varchar(50) NOT NULL,
	"skills_required" jsonb DEFAULT '[]',
	"payment_amount" numeric(8, 2),
	"payment_type" varchar(20) DEFAULT 'fiat',
	"location" varchar(255),
	"start_date" timestamp,
	"end_date" timestamp,
	"status" varchar(50) DEFAULT 'open',
	"assigned_to_id" integer,
	"applicant_count" integer DEFAULT 0,
	"is_remote" boolean DEFAULT false,
	"urgency" varchar(20) DEFAULT 'normal',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "global_stats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "global_stats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"metric" varchar(100) NOT NULL,
	"value" numeric(15, 2) NOT NULL,
	"metadata" jsonb DEFAULT '{}',
	"last_updated" timestamp DEFAULT now(),
	CONSTRAINT "global_stats_metric_unique" UNIQUE("metric")
);
--> statement-breakpoint
CREATE TABLE "governance_voting" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "governance_voting_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"proposal_id" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"proposal_type" varchar(50) NOT NULL,
	"proposer_id" integer NOT NULL,
	"voting_power" numeric(18, 8) NOT NULL,
	"options" jsonb NOT NULL,
	"current_votes" jsonb DEFAULT '{}' NOT NULL,
	"total_votes" numeric(18, 8) DEFAULT '0' NOT NULL,
	"required_quorum" numeric(18, 8) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp NOT NULL,
	"execution_date" timestamp,
	CONSTRAINT "governance_voting_proposal_id_unique" UNIQUE("proposal_id")
);
--> statement-breakpoint
CREATE TABLE "learning_progress" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "learning_progress_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"skill" varchar(100) NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"progress" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"mastery_score" numeric(5, 2),
	"last_practiced" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "listening_rewards" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "listening_rewards_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"content_id" integer NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"artist_id" integer NOT NULL,
	"listening_duration" integer NOT NULL,
	"quality_score" numeric(5, 2) NOT NULL,
	"reward_amount" numeric(18, 8) NOT NULL,
	"artist_earning" numeric(18, 8) NOT NULL,
	"platform_share" numeric(18, 8) NOT NULL,
	"bonus_multiplier" numeric(3, 2) DEFAULT '1.0' NOT NULL,
	"device_type" varchar(50),
	"location" varchar(100),
	"session_id" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "marketplace_listing" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "marketplace_listing_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"seller_id" integer NOT NULL,
	"item_type" varchar(50) NOT NULL,
	"item_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(18, 8) NOT NULL,
	"currency" varchar(20) DEFAULT 'ARTIST' NOT NULL,
	"category" varchar(50),
	"tags" jsonb,
	"image_url" varchar(500),
	"preview_url" varchar(500),
	"downloads" integer DEFAULT 0 NOT NULL,
	"rating" numeric(3, 2),
	"rating_count" integer DEFAULT 0 NOT NULL,
	"is_exclusive" boolean DEFAULT false,
	"license_type" varchar(50) DEFAULT 'standard' NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"listed_at" timestamp DEFAULT now(),
	"sold_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "marketplace_purchases" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "marketplace_purchases_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"buyer_id" integer NOT NULL,
	"seller_id" integer NOT NULL,
	"listing_id" integer NOT NULL,
	"item_type" varchar(50) NOT NULL,
	"item_id" integer NOT NULL,
	"price" numeric(18, 8) NOT NULL,
	"currency" varchar(20) NOT NULL,
	"platform_fee" numeric(18, 8) NOT NULL,
	"royalty_fee" numeric(18, 8) DEFAULT '0' NOT NULL,
	"license_granted" varchar(50) NOT NULL,
	"download_url" varchar(500),
	"transaction_hash" varchar(255),
	"purchased_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "midi_presets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "midi_presets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"controller_type" varchar(100) NOT NULL,
	"mapping" jsonb NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shows" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shows_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text,
	"artist_id" integer NOT NULL,
	"fan_crew_id" integer,
	"venue_id" integer,
	"custom_venue" varchar(255),
	"show_date" timestamp NOT NULL,
	"door_time" timestamp,
	"show_time" timestamp,
	"end_time" timestamp,
	"ticket_price" numeric(8, 2),
	"capacity" integer,
	"sold_tickets" integer DEFAULT 0,
	"total_revenue" numeric(10, 2) DEFAULT '0',
	"artist_payout" numeric(10, 2) DEFAULT '0',
	"crew_payout" numeric(10, 2) DEFAULT '0',
	"status" varchar(50) DEFAULT 'planned',
	"playlist" jsonb DEFAULT '[]',
	"live_voting" boolean DEFAULT false,
	"stream_url" varchar(500),
	"recording_url" varchar(500),
	"city" varchar(100),
	"country" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "chat_messages" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "classroom_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "exercises" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lesson_recordings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lessons" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "student_enrollments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "student_progress" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "shared_content" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "classrooms" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "live_class_participants" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "students" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "voice_commands" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "teachers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "chat_messages" CASCADE;--> statement-breakpoint
DROP TABLE "classroom_sessions" CASCADE;--> statement-breakpoint
DROP TABLE "exercises" CASCADE;--> statement-breakpoint
DROP TABLE "lesson_recordings" CASCADE;--> statement-breakpoint
DROP TABLE "lessons" CASCADE;--> statement-breakpoint
DROP TABLE "student_enrollments" CASCADE;--> statement-breakpoint
DROP TABLE "student_progress" CASCADE;--> statement-breakpoint
DROP TABLE "shared_content" CASCADE;--> statement-breakpoint
DROP TABLE "classrooms" CASCADE;--> statement-breakpoint
DROP TABLE "live_class_participants" CASCADE;--> statement-breakpoint
DROP TABLE "students" CASCADE;--> statement-breakpoint
DROP TABLE "user_sessions" CASCADE;--> statement-breakpoint
DROP TABLE "voice_commands" CASCADE;--> statement-breakpoint
DROP TABLE "teachers" CASCADE;--> statement-breakpoint
DROP INDEX "idx_sessions_expire";--> statement-breakpoint
DROP INDEX "idx_users_email";--> statement-breakpoint
ALTER TABLE "audio_files" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "audio_files" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "audio_files_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "audio_files" ALTER COLUMN "original_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "audio_files" ALTER COLUMN "path" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "audio_files" ALTER COLUMN "path" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "audio_files" ALTER COLUMN "duration" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "audio_files" ALTER COLUMN "key" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "audio_files" ALTER COLUMN "mime_type" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "audio_files" ALTER COLUMN "mime_type" SET DEFAULT 'audio/wav';--> statement-breakpoint
ALTER TABLE "audio_files" ALTER COLUMN "size" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "audio_files" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "type" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "video_files" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "video_files" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "video_files_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "video_files" ALTER COLUMN "original_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "video_files" ALTER COLUMN "duration" SET DATA TYPE numeric(10, 3);--> statement-breakpoint
ALTER TABLE "video_files" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "sess" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_type" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_type" SET DEFAULT 'student';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "profile_image_url" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "subscription_tier" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "subscription_status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "subscription_status" SET DEFAULT 'inactive';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "audio_files" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "audio_files" ADD COLUMN "filename" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "audio_files" ADD COLUMN "file_path" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "audio_files" ADD COLUMN "file_size" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "audio_files" ADD COLUMN "genre" varchar(100);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "thumbnail" varchar(500);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "is_public" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "video_files" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "video_files" ADD COLUMN "filename" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "video_files" ADD COLUMN "file_path" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "video_files" ADD COLUMN "file_size" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "video_files" ADD COLUMN "resolution" varchar(20);--> statement-breakpoint
ALTER TABLE "video_files" ADD COLUMN "fps" integer;--> statement-breakpoint
ALTER TABLE "video_files" ADD COLUMN "codec" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "school_id" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "license_key" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "max_students" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "billing_email" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "whitelabel_config" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "roles" jsonb DEFAULT '["fan"]';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "skills" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "availability" jsonb DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "atp_balance" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "atc_balance" numeric(18, 8) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "total_atp_earned" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "founding_member" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "founding_nft_id" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "influence_score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "creator_rank" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "fan_crews_joined" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "shows_booked" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gigs_completed" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_earnings" ADD CONSTRAINT "artist_earnings_artist_id_users_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_earnings" ADD CONSTRAINT "artist_earnings_source_user_id_users_id_fk" FOREIGN KEY ("source_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_houses" ADD CONSTRAINT "artist_houses_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "atp_transactions" ADD CONSTRAINT "atp_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_media" ADD CONSTRAINT "cms_media_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_sharing" ADD CONSTRAINT "collaboration_sharing_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_sharing" ADD CONSTRAINT "collaboration_sharing_primary_artist_id_users_id_fk" FOREIGN KEY ("primary_artist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_sharing" ADD CONSTRAINT "collaboration_sharing_collaborator_id_users_id_fk" FOREIGN KEY ("collaborator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_collaborator_id_users_id_fk" FOREIGN KEY ("collaborator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creative_currency" ADD CONSTRAINT "creative_currency_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creative_nfts" ADD CONSTRAINT "creative_nfts_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creative_nfts" ADD CONSTRAINT "creative_nfts_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creative_staking" ADD CONSTRAINT "creative_staking_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_fund" ADD CONSTRAINT "creator_fund_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_fund" ADD CONSTRAINT "creator_fund_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "currency_transactions" ADD CONSTRAINT "currency_transactions_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "currency_transactions" ADD CONSTRAINT "currency_transactions_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_crew_memberships" ADD CONSTRAINT "fan_crew_memberships_crew_id_fan_crews_id_fk" FOREIGN KEY ("crew_id") REFERENCES "public"."fan_crews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_crew_memberships" ADD CONSTRAINT "fan_crew_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_crews" ADD CONSTRAINT "fan_crews_leader_id_users_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_crews" ADD CONSTRAINT "fan_crews_target_artist_id_users_id_fk" FOREIGN KEY ("target_artist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gigs" ADD CONSTRAINT "gigs_poster_id_users_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gigs" ADD CONSTRAINT "gigs_show_id_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gigs" ADD CONSTRAINT "gigs_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "governance_voting" ADD CONSTRAINT "governance_voting_proposer_id_users_id_fk" FOREIGN KEY ("proposer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listening_rewards" ADD CONSTRAINT "listening_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listening_rewards" ADD CONSTRAINT "listening_rewards_artist_id_users_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_listing" ADD CONSTRAINT "marketplace_listing_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_purchases" ADD CONSTRAINT "marketplace_purchases_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_purchases" ADD CONSTRAINT "marketplace_purchases_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_purchases" ADD CONSTRAINT "marketplace_purchases_listing_id_marketplace_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."marketplace_listing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "midi_presets" ADD CONSTRAINT "midi_presets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shows" ADD CONSTRAINT "shows_artist_id_users_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shows" ADD CONSTRAINT "shows_fan_crew_id_fan_crews_id_fk" FOREIGN KEY ("fan_crew_id") REFERENCES "public"."fan_crews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shows" ADD CONSTRAINT "shows_venue_id_artist_houses_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."artist_houses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audio_files" ADD CONSTRAINT "audio_files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_files" ADD CONSTRAINT "video_files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
ALTER TABLE "audio_files" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "video_files" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "video_files" DROP COLUMN "path";--> statement-breakpoint
ALTER TABLE "video_files" DROP COLUMN "width";--> statement-breakpoint
ALTER TABLE "video_files" DROP COLUMN "height";--> statement-breakpoint
ALTER TABLE "video_files" DROP COLUMN "mime_type";--> statement-breakpoint
ALTER TABLE "video_files" DROP COLUMN "size";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password_hash";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_active";