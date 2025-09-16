import winston from 'winston';
import express from 'express';
import { Request, Response } from 'express';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    database: 'connected' | 'disconnected';
    ai_engines: string;
    websockets: 'active' | 'inactive';
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu: {
      usage: number;
      cores: number;
    };
  };
  version: string;
  environment: string;
}

interface MetricsData {
  timestamp: string;
  requests: {
    total: number;
    per_minute: number;
    per_hour: number;
    errors: number;
    avg_response_time: number;
  };
  database: {
    connections: number;
    query_count: number;
    avg_query_time: number;
    slow_queries: number;
  };
  ai_engines: {
    active: number;
    total: number;
    avg_processing_time: number;
    queue_length: number;
  };
  websockets: {
    active_connections: number;
    messages_per_second: number;
    errors: number;
  };
}

// Configure Winston logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'artisttech' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// If we're not in production then log to the console with a simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Request logging middleware
export function requestLogger(req: Request, res: Response, next: any) {
  const start = Date.now();
  const { method, url, ip } = req;

  // Log when response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    logger.info('Request completed', {
      method,
      url,
      statusCode,
      duration,
      ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  });

  next();
}

// Error logging middleware
export function errorLogger(err: any, req: Request, res: Response, next: any) {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  next(err);
}

// Health check endpoint
export function createHealthCheck(databaseConnection: any): (req: Request, res: Response) => void {
  return async (req: Request, res: Response) => {
    try {
      const healthStatus: HealthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          database: 'disconnected',
          ai_engines: '0/19 online',
          websockets: 'inactive',
          memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
          },
          cpu: {
            usage: Math.round(process.cpuUsage().user / 1000000),
            cores: require('os').cpus().length
          }
        },
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      };

      // Check database connection
      try {
        if (databaseConnection) {
          await databaseConnection.execute('SELECT 1');
          healthStatus.services.database = 'connected';
        }
      } catch (dbError) {
        healthStatus.status = 'degraded';
        logger.error('Database health check failed', { error: dbError });
      }

      // Check AI engines (simplified check)
      try {
        // This would be replaced with actual AI engine health checks
        healthStatus.services.ai_engines = '19/19 online';
      } catch (aiError) {
        healthStatus.status = 'degraded';
        logger.error('AI engines health check failed', { error: aiError });
      }

      // Check WebSocket status
      try {
        // This would be replaced with actual WebSocket server checks
        healthStatus.services.websockets = 'active';
      } catch (wsError) {
        healthStatus.status = 'degraded';
        logger.error('WebSocket health check failed', { error: wsError });
      }

      const statusCode = healthStatus.status === 'healthy' ? 200 :
                        healthStatus.status === 'degraded' ? 206 : 503;

      res.status(statusCode).json(healthStatus);

    } catch (error) {
      logger.error('Health check failed', { error });
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      });
    }
  };
}

// Metrics collection
class MetricsCollector {
  private metrics: MetricsData;
  private requestCount: number = 0;
  private errorCount: number = 0;
  private responseTimes: number[] = [];
  private lastReset: Date;

  constructor() {
    this.lastReset = new Date();
    this.metrics = this.initializeMetrics();
  }

  private initializeMetrics(): MetricsData {
    return {
      timestamp: new Date().toISOString(),
      requests: {
        total: 0,
        per_minute: 0,
        per_hour: 0,
        errors: 0,
        avg_response_time: 0
      },
      database: {
        connections: 0,
        query_count: 0,
        avg_query_time: 0,
        slow_queries: 0
      },
      ai_engines: {
        active: 19,
        total: 19,
        avg_processing_time: 0,
        queue_length: 0
      },
      websockets: {
        active_connections: 0,
        messages_per_second: 0,
        errors: 0
      }
    };
  }

  recordRequest(responseTime: number, isError: boolean = false) {
    this.requestCount++;
    this.responseTimes.push(responseTime);
    if (isError) this.errorCount++;

    // Keep only last 100 response times for averaging
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
  }

  getMetrics(): MetricsData {
    const now = new Date();
    const minutesElapsed = (now.getTime() - this.lastReset.getTime()) / (1000 * 60);

    this.metrics.timestamp = now.toISOString();
    this.metrics.requests.total = this.requestCount;
    this.metrics.requests.per_minute = Math.round(this.requestCount / Math.max(minutesElapsed, 1));
    this.metrics.requests.per_hour = Math.round(this.requestCount / Math.max(minutesElapsed / 60, 1));
    this.metrics.requests.errors = this.errorCount;
    this.metrics.requests.avg_response_time = this.responseTimes.length > 0
      ? Math.round(this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length)
      : 0;

    return { ...this.metrics };
  }

  reset() {
    this.requestCount = 0;
    this.errorCount = 0;
    this.responseTimes = [];
    this.lastReset = new Date();
  }
}

export const metricsCollector = new MetricsCollector();

// Metrics endpoint
export function createMetricsEndpoint(): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    const metrics = metricsCollector.getMetrics();
    res.json(metrics);
  };
}

// Performance monitoring middleware
export function performanceMonitor(req: Request, res: Response, next: any) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const responseTime = Number(end - start) / 1000000; // Convert to milliseconds
    const isError = res.statusCode >= 400;

    metricsCollector.recordRequest(responseTime, isError);

    // Log slow requests
    if (responseTime > 1000) { // More than 1 second
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        responseTime,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString()
      });
    }
  });

  next();
}

// Alert system (basic implementation)
export class AlertSystem {
  private alerts: any[] = [];

  addAlert(type: 'error' | 'warning' | 'info', message: string, details?: any) {
    const alert = {
      id: Date.now().toString(),
      type,
      message,
      details,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };

    this.alerts.push(alert);

    // Log the alert
    logger.log(type, `Alert: ${message}`, { alertId: alert.id, details });

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }

    return alert;
  }

  getAlerts(limit: number = 50) {
    return this.alerts.slice(-limit);
  }

  acknowledgeAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedAt = new Date().toISOString();
    }
    return alert;
  }
}

export const alertSystem = new AlertSystem();

// Alert endpoint
export function createAlertsEndpoint(): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    const { action, alertId } = req.query;

    if (action === 'acknowledge' && alertId) {
      const alert = alertSystem.acknowledgeAlert(alertId as string);
      return res.json({ success: true, alert });
    }

    const alerts = alertSystem.getAlerts();
    res.json({ alerts });
  };
}