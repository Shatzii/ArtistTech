import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTestServer } from './test-utils';
import { monitoring, alertSystem } from '../server/monitoring';

describe('Monitoring System', () => {
  let server: any;

  beforeEach(() => {
    server = createTestServer();
  });

  afterEach(() => {
    server.close();
  });

  describe('Health Check Endpoint', () => {
    it('should return healthy status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/health'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('healthy');
      expect(body.services).toBeDefined();
      expect(body.timestamp).toBeDefined();
    });

    it('should include all required service checks', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/health'
      });

      const body = JSON.parse(response.body);
      expect(body.services).toHaveProperty('database');
      expect(body.services).toHaveProperty('ai_engines');
      expect(body.services).toHaveProperty('websockets');
      expect(body.services).toHaveProperty('memory');
      expect(body.services).toHaveProperty('cpu');
    });
  });

  describe('Metrics Endpoint', () => {
    it('should return metrics data', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/metrics'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.requests).toBeDefined();
      expect(body.database).toBeDefined();
      expect(body.ai_engines).toBeDefined();
      expect(body.websockets).toBeDefined();
    });

    it('should track request metrics', async () => {
      // Make some test requests
      await server.inject({ method: 'GET', url: '/api/health' });
      await server.inject({ method: 'GET', url: '/api/health' });

      const response = await server.inject({
        method: 'GET',
        url: '/api/metrics'
      });

      const body = JSON.parse(response.body);
      expect(body.requests.total).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Alert System', () => {
    it('should create and retrieve alerts', () => {
      const alert = alertSystem.addAlert('warning', 'Test alert message');
      expect(alert.type).toBe('warning');
      expect(alert.message).toBe('Test alert message');
      expect(alert.acknowledged).toBe(false);

      const alerts = alertSystem.getAlerts();
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].message).toBe('Test alert message');
    });

    it('should acknowledge alerts', () => {
      const alert = alertSystem.addAlert('error', 'Test error');
      const alertId = alert.id;

      const acknowledgedAlert = alertSystem.acknowledgeAlert(alertId);
      expect(acknowledgedAlert?.acknowledged).toBe(true);
    });
  });

  describe('Logger', () => {
    it('should log messages at different levels', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      monitoring.logger.info('Test info message');
      monitoring.logger.error('Test error message');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});