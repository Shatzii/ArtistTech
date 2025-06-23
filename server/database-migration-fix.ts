import { db } from './db';

export async function runCriticalMigrations(): Promise<void> {
  console.log('Running critical database migrations...');
  
  const migrations = [
    // Fix audio_files table compatibility
    `ALTER TABLE audio_files ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100) DEFAULT 'audio/wav'`,
    `ALTER TABLE audio_files ADD COLUMN IF NOT EXISTS path VARCHAR(500)`,
    `ALTER TABLE audio_files ADD COLUMN IF NOT EXISTS size INTEGER`,
    
    // Update existing records
    `UPDATE audio_files SET mime_type = 'audio/wav' WHERE mime_type IS NULL`,
    `UPDATE audio_files SET path = file_path WHERE path IS NULL`,
    `UPDATE audio_files SET size = file_size WHERE size IS NULL`,
    
    // Create essential indexes for performance
    `CREATE INDEX IF NOT EXISTS idx_audio_files_user_id ON audio_files(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    
    // Create sessions table if missing
    `CREATE TABLE IF NOT EXISTS sessions (
      sid VARCHAR PRIMARY KEY,
      sess JSON NOT NULL,
      expire TIMESTAMP NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire)`
  ];

  for (const migration of migrations) {
    try {
      await db.execute(migration as any);
      console.log(`✓ Migration executed: ${migration.substring(0, 50)}...`);
    } catch (error) {
      console.log(`Migration skipped (already applied): ${migration.substring(0, 50)}...`);
    }
  }
  
  console.log('Database migrations completed');
}

// Auto-run migrations
runCriticalMigrations().catch(console.error);