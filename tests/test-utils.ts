import { createServer } from 'http';
import express from 'express';
import {
  createHealthCheck,
  createMetricsEndpoint,
  createAlertsEndpoint
} from '../server/monitoring';

export function createTestServer() {
  const app = express();
  app.use(express.json());

  // Add test routes
  app.get('/api/health', createHealthCheck(null));
  app.get('/api/metrics', createMetricsEndpoint());
  app.get('/api/alerts', createAlertsEndpoint());

  // Mock API endpoints for testing
  app.get('/api/studio/status', (req, res) => {
    res.json({
      music_studio: 'online',
      dj_studio: 'online',
      video_studio: 'online',
      social_media: 'online'
    });
  });

  app.get('/api/user/profile', (req, res) => {
    res.json({
      id: 'test-user',
      name: 'Test User',
      email: 'test@example.com'
    });
  });

  const server = createServer(app);

  return {
    ...server,
    inject: (options: any) => {
      return new Promise((resolve) => {
        const req = require('http').request({
          hostname: 'localhost',
          port: 0, // Will be set by server.listen
          method: options.method,
          path: options.url,
          headers: options.headers || {}
        }, (res: any) => {
          let body = '';
          res.on('data', (chunk: any) => body += chunk);
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body
            });
          });
        });

        if (options.payload) {
          req.write(JSON.stringify(options.payload));
        }
        req.end();
      });
    }
  };
}

export function createMockDatabase() {
  return {
    execute: vi.fn().mockResolvedValue({ rows: [] }),
    query: vi.fn().mockResolvedValue({ rows: [] }),
    connect: vi.fn().mockResolvedValue({}),
    end: vi.fn().mockResolvedValue({})
  };
}

export function createMockWebSocket() {
  return {
    send: vi.fn(),
    close: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
  };
}

export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateTestData(type: string, count: number = 1) {
  const testData: any = {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    },
    project: {
      id: 'test-project-id',
      name: 'Test Project',
      description: 'A test project',
      userId: 'test-user-id'
    },
    audioFile: {
      id: 'test-audio-id',
      filename: 'test-audio.mp3',
      path: '/uploads/test-audio.mp3',
      size: 1024000,
      mimeType: 'audio/mpeg'
    }
  };

  if (count === 1) {
    return testData[type];
  }

  return Array.from({ length: count }, (_, i) => ({
    ...testData[type],
    id: `${testData[type].id}-${i}`
  }));
}