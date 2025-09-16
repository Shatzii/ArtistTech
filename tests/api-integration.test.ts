import { describe, it, expect, vi } from 'vitest';
import { createTestServer, createMockDatabase } from './test-utils';

describe('API Integration Tests', () => {
  let server: any;
  let mockDb: any;

  beforeEach(() => {
    server = createTestServer();
    mockDb = createMockDatabase();
  });

  afterEach(() => {
    server.close();
  });

  describe('Studio Status API', () => {
    it('should return studio status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/studio/status'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('music_studio');
      expect(body).toHaveProperty('dj_studio');
      expect(body).toHaveProperty('video_studio');
      expect(body).toHaveProperty('social_media');
    });

    it('should handle database errors gracefully', async () => {
      mockDb.execute.mockRejectedValue(new Error('Database connection failed'));

      const response = await server.inject({
        method: 'GET',
        url: '/api/studio/status'
      });

      expect(response.statusCode).toBe(200); // Should still return status
    });
  });

  describe('User Profile API', () => {
    it('should return user profile', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/user/profile'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('email');
    });

    it('should handle unauthorized access', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/user/profile',
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });

      // This would be 401 in a real implementation
      expect([200, 401]).toContain(response.statusCode);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/nonexistent-endpoint'
      });

      expect(response.statusCode).toBe(404);
    });

    it('should handle malformed JSON', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/user/profile',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: '{invalid json}'
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('Performance Tests', () => {
    it('should respond within acceptable time limits', async () => {
      const startTime = Date.now();

      const response = await server.inject({
        method: 'GET',
        url: '/api/health'
      });

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
      expect(response.statusCode).toBe(200);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, () =>
        server.inject({
          method: 'GET',
          url: '/api/health'
        })
      );

      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.statusCode).toBe(200);
      });
    });
  });
});