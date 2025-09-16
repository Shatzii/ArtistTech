import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './database-schema';

// Database migration for AI Career Manager
export async function createCareerManagerTables(db: any) {
  // Create artists table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS artists (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      genre VARCHAR(100),
      stage VARCHAR(50) DEFAULT 'emerging',
      bio TEXT,
      profile_image TEXT,
      location VARCHAR(255),
      website TEXT,
      spotify_id VARCHAR(255),
      instagram_handle VARCHAR(255),
      tiktok_handle VARCHAR(255),
      youtube_channel_id VARCHAR(255),
      twitter_handle VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for artists table
  await db.run(sql`CREATE INDEX IF NOT EXISTS artists_user_id_idx ON artists(user_id);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS artists_genre_idx ON artists(genre);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS artists_stage_idx ON artists(stage);`);

  // Create social_metrics table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS social_metrics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
      platform VARCHAR(50) NOT NULL,
      followers INTEGER DEFAULT 0,
      following INTEGER DEFAULT 0,
      posts INTEGER DEFAULT 0,
      engagement DECIMAL(5,2),
      avg_likes INTEGER DEFAULT 0,
      avg_comments INTEGER DEFAULT 0,
      avg_shares INTEGER DEFAULT 0,
      avg_views INTEGER DEFAULT 0,
      reach INTEGER DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      profile_visits INTEGER DEFAULT 0,
      website_clicks INTEGER DEFAULT 0,
      top_performing_content JSONB,
      optimal_posting_times JSONB,
      trending_hashtags JSONB,
      competitor_analysis JSONB,
      growth_rate DECIMAL(5,2),
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for social_metrics table
  await db.run(sql`CREATE INDEX IF NOT EXISTS social_metrics_artist_platform_idx ON social_metrics(artist_id, platform);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS social_metrics_platform_idx ON social_metrics(platform);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS social_metrics_last_updated_idx ON social_metrics(last_updated);`);

  // Create career_milestones table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS career_milestones (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(50) NOT NULL,
      current_value INTEGER DEFAULT 0,
      target_value INTEGER NOT NULL,
      progress DECIMAL(5,2) DEFAULT 0,
      reward JSONB,
      deadline TIMESTAMP,
      completed BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMP,
      difficulty VARCHAR(20) DEFAULT 'medium',
      priority VARCHAR(20) DEFAULT 'medium',
      current_trend VARCHAR(255),
      estimated_completion VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for career_milestones table
  await db.run(sql`CREATE INDEX IF NOT EXISTS career_milestones_artist_id_idx ON career_milestones(artist_id);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS career_milestones_category_idx ON career_milestones(category);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS career_milestones_completed_idx ON career_milestones(completed);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS career_milestones_deadline_idx ON career_milestones(deadline);`);

  // Create revenue_streams table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS revenue_streams (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      platform VARCHAR(100),
      amount DECIMAL(10,2) DEFAULT 0,
      percentage DECIMAL(5,2),
      growth DECIMAL(5,2),
      monthly_trend JSONB,
      next_payment TIMESTAMP,
      projected_monthly DECIMAL(10,2),
      currency VARCHAR(3) DEFAULT 'USD',
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for revenue_streams table
  await db.run(sql`CREATE INDEX IF NOT EXISTS revenue_streams_artist_id_idx ON revenue_streams(artist_id);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS revenue_streams_type_idx ON revenue_streams(type);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS revenue_streams_active_idx ON revenue_streams(active);`);

  // Create ai_insights table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS ai_insights (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      priority VARCHAR(20) DEFAULT 'medium',
      title VARCHAR(255) NOT NULL,
      description TEXT,
      expected_roi VARCHAR(255),
      timeframe VARCHAR(50),
      automated BOOLEAN DEFAULT FALSE,
      confidence DECIMAL(5,2),
      data_points JSONB,
      action_items JSONB,
      status VARCHAR(20) DEFAULT 'pending',
      executed_at TIMESTAMP,
      result JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for ai_insights table
  await db.run(sql`CREATE INDEX IF NOT EXISTS ai_insights_artist_id_idx ON ai_insights(artist_id);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS ai_insights_type_idx ON ai_insights(type);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS ai_insights_priority_idx ON ai_insights(priority);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS ai_insights_status_idx ON ai_insights(status);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS ai_insights_created_at_idx ON ai_insights(created_at);`);

  // Create ai_agents table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS ai_agents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      color VARCHAR(7) DEFAULT '#3B82F6',
      performance DECIMAL(5,2) DEFAULT 75,
      revenue DECIMAL(10,2) DEFAULT 0,
      tasks JSONB,
      active_projects INTEGER DEFAULT 0,
      completed_tasks INTEGER DEFAULT 0,
      last_activity TIMESTAMP,
      ai_insights JSONB,
      next_actions JSONB,
      configuration JSONB,
      enabled BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for ai_agents table
  await db.run(sql`CREATE INDEX IF NOT EXISTS ai_agents_artist_id_idx ON ai_agents(artist_id);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS ai_agents_enabled_idx ON ai_agents(enabled);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS ai_agents_last_activity_idx ON ai_agents(last_activity);`);

  // Create content_performance table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS content_performance (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
      platform VARCHAR(50) NOT NULL,
      content_id VARCHAR(255) NOT NULL,
      content_type VARCHAR(50),
      title VARCHAR(255),
      description TEXT,
      posted_at TIMESTAMP NOT NULL,
      likes INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      shares INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      reach INTEGER DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      saves INTEGER DEFAULT 0,
      engagement DECIMAL(5,2),
      hashtags JSONB,
      mentions JSONB,
      ai_score DECIMAL(5,2),
      sentiment VARCHAR(20),
      trending BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for content_performance table
  await db.run(sql`CREATE INDEX IF NOT EXISTS content_performance_artist_id_idx ON content_performance(artist_id);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS content_performance_platform_idx ON content_performance(platform);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS content_performance_posted_at_idx ON content_performance(posted_at);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS content_performance_content_type_idx ON content_performance(content_type);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS content_performance_ai_score_idx ON content_performance(ai_score);`);

  // Create predictive_analytics table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS predictive_analytics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
      metric VARCHAR(100) NOT NULL,
      platform VARCHAR(50),
      current_value DECIMAL(10,2),
      predicted_value DECIMAL(10,2),
      confidence DECIMAL(5,2),
      timeframe VARCHAR(20),
      trend VARCHAR(20),
      growth_rate DECIMAL(5,2),
      factors JSONB,
      recommendations JSONB,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for predictive_analytics table
  await db.run(sql`CREATE INDEX IF NOT EXISTS predictive_analytics_artist_id_idx ON predictive_analytics(artist_id);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS predictive_analytics_metric_idx ON predictive_analytics(metric);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS predictive_analytics_platform_idx ON predictive_analytics(platform);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS predictive_analytics_timeframe_idx ON predictive_analytics(timeframe);`);

  // Create automated_workflows table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS automated_workflows (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      type VARCHAR(50) NOT NULL,
      enabled BOOLEAN DEFAULT TRUE,
      schedule JSONB,
      conditions JSONB,
      actions JSONB,
      last_executed TIMESTAMP,
      next_execution TIMESTAMP,
      success_count INTEGER DEFAULT 0,
      failure_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for automated_workflows table
  await db.run(sql`CREATE INDEX IF NOT EXISTS automated_workflows_artist_id_idx ON automated_workflows(artist_id);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS automated_workflows_type_idx ON automated_workflows(type);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS automated_workflows_enabled_idx ON automated_workflows(enabled);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS automated_workflows_next_execution_idx ON automated_workflows(next_execution);`);

  console.log('✅ Career Manager database tables created successfully');
}

// Seed data for development
export async function seedCareerManagerData(db: any) {
  // Insert sample artist
  const artistResult = await db.run(sql`
    INSERT INTO artists (user_id, name, email, genre, stage, bio, location, spotify_id, instagram_handle, tiktok_handle, youtube_channel_id)
    VALUES (
      gen_random_uuid(),
      'Alex Martinez',
      'alex@artisttech.com',
      'Electronic/Pop',
      'rising',
      'Rising electronic artist blending pop melodies with cutting-edge production',
      'Los Angeles, CA',
      'alex_martinez_official',
      '@alexmartinezmusic',
      '@alexmartinez',
      'UC1234567890'
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `);

  if (artistResult.results && artistResult.results.length > 0) {
    const artistId = artistResult.results[0].id;

    // Insert sample social metrics
    await db.run(sql`
      INSERT INTO social_metrics (artist_id, platform, followers, engagement, avg_likes, avg_comments, avg_views, growth_rate)
      VALUES
        (${artistId}, 'instagram', 18500, 8.5, 1200, 85, 8500, 12.5),
        (${artistId}, 'tiktok', 15200, 9.2, 2500, 180, 45000, 18.3),
        (${artistId}, 'youtube', 7800, 7.8, 450, 65, 12000, 8.9),
        (${artistId}, 'spotify', 12500, 6.2, 800, 45, 25000, 15.7)
      ON CONFLICT DO NOTHING;
    `);

    // Insert sample career milestones
    await db.run(sql`
      INSERT INTO career_milestones (artist_id, title, description, category, current_value, target_value, progress, priority, difficulty)
      VALUES
        (${artistId}, '50K Total Followers', 'Reach 50,000 combined followers across all platforms', 'growth', 41500, 50000, 83.0, 'high', 'medium'),
        (${artistId}, '100K Monthly Streams', 'Achieve 100,000 monthly streams across all platforms', 'revenue', 65000, 100000, 65.0, 'high', 'hard'),
        (${artistId}, 'First Major Sync Deal', 'Secure first sync licensing deal for TV/film', 'business', 0, 1, 0.0, 'high', 'expert')
      ON CONFLICT DO NOTHING;
    `);

    // Insert sample revenue streams
    await db.run(sql`
      INSERT INTO revenue_streams (artist_id, name, type, platform, amount, percentage, growth, projected_monthly)
      VALUES
        (${artistId}, 'Streaming Royalties', 'streaming', 'Multiple', 2100.00, 45.0, 15.5, 2800.00),
        (${artistId}, 'Beat Sales & Licensing', 'beat_sales', 'BeatStars', 1500.00, 32.0, 22.3, 2100.00),
        (${artistId}, 'Live Performances', 'live_shows', 'Local Venues', 800.00, 17.0, 8.9, 950.00),
        (${artistId}, 'Merchandise', 'merchandise', 'Online Store', 300.00, 6.0, 35.2, 450.00)
      ON CONFLICT DO NOTHING;
    `);

    // Insert sample AI agents
    await db.run(sql`
      INSERT INTO ai_agents (artist_id, name, role, color, performance, revenue, active_projects, completed_tasks)
      VALUES
        (${artistId}, 'Marketing Maven', 'Social Media & Brand Growth', '#3B82F6', 87.5, 1200.00, 3, 45),
        (${artistId}, 'Revenue Optimizer', 'Monetization & Earnings', '#10B981', 92.3, 1800.00, 2, 38),
        (${artistId}, 'Collaboration Conductor', 'Artist Partnerships', '#8B5CF6', 78.9, 950.00, 1, 22),
        (${artistId}, 'Content Creator', 'Video & Social Content', '#F59E0B', 85.6, 750.00, 4, 67)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Career Manager sample data seeded successfully');
  }
}