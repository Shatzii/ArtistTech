import { Request, Response, NextFunction } from 'express';
import { logger } from './monitoring';

// Performance metrics interface
interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: number;
  activeConnections: number;
  databaseQueryTime?: number;
  cacheHitRate?: number;
}

// Cache interface
interface CacheEntry {
  data: any;
  expiresAt: number;
  hits: number;
}

// Performance monitoring class
export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private cache: Map<string, CacheEntry> = new Map();
  private startTime: number = Date.now();

  constructor() {
    // Start collecting system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);

    // Clean expired cache entries every 5 minutes
    setInterval(() => {
      this.cleanExpiredCache();
    }, 300000);
  }

  // Collect system performance metrics
  private collectSystemMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const metrics: PerformanceMetrics = {
      responseTime: 0, // Will be set by middleware
      memoryUsage: memUsage,
      cpuUsage: cpuUsage.user + cpuUsage.system,
      activeConnections: 0, // Will be tracked by middleware
    };

    this.metrics.push(metrics);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }

    // Log performance warnings
    if (memUsage.heapUsed > memUsage.heapTotal * 0.8) {
      logger.warn('High memory usage detected', {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        percentage: (memUsage.heapUsed / memUsage.heapTotal * 100).toFixed(2)
      });
    }
  }

  // Performance monitoring middleware
  public performanceMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();

      // Track response time
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;

        // Log slow requests
        if (responseTime > 1000) {
          logger.warn('Slow request detected', {
            method: req.method,
            url: req.url,
            responseTime,
            statusCode: res.statusCode
          });
        }

        // Update metrics
        const latestMetrics = this.metrics[this.metrics.length - 1];
        if (latestMetrics) {
          latestMetrics.responseTime = responseTime;
        }
      });

      next();
    };
  }

  // Cache methods
  public set(key: string, data: any, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, {
      data,
      expiresAt,
      hits: 0
    });
  }

  public get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry.data;
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  // Cache statistics
  public getCacheStats() {
    const totalEntries = this.cache.size;
    const totalHits = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.hits, 0);
    const expiredEntries = Array.from(this.cache.values()).filter(entry => Date.now() > entry.expiresAt).length;

    return {
      totalEntries,
      totalHits,
      expiredEntries,
      hitRate: totalEntries > 0 ? (totalHits / (totalEntries + totalHits)) * 100 : 0
    };
  }

  // Database query optimization
  public async optimizeDatabaseQuery(query: string, params: any[] = []): Promise<any> {
    const startTime = Date.now();

    try {
      // Here you would execute the query
      // For now, we'll just simulate and measure
      const result = await this.simulateQuery(query, params);
      const queryTime = Date.now() - startTime;

      // Log slow queries
      if (queryTime > 100) {
        logger.warn('Slow database query detected', {
          query: query.substring(0, 100) + '...',
          queryTime,
          paramsCount: params.length
        });
      }

      return result;
    } catch (error) {
      logger.error('Database query error', { query, error: error.message });
      throw error;
    }
  }

  private async simulateQuery(query: string, params: any[]): Promise<any> {
    // Simulate database query with some delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ rows: [], rowCount: 0 });
      }, Math.random() * 50); // Random delay up to 50ms
    });
  }

  // Connection pooling simulation
  private connectionPool: any[] = [];
  private maxConnections: number = 10;

  public async getConnection(): Promise<any> {
    if (this.connectionPool.length < this.maxConnections) {
      const connection = { id: Date.now(), active: true };
      this.connectionPool.push(connection);
      return connection;
    }

    // Wait for available connection
    return new Promise((resolve) => {
      const checkPool = () => {
        const available = this.connectionPool.find(conn => !conn.active);
        if (available) {
          available.active = true;
          resolve(available);
        } else {
          setTimeout(checkPool, 100);
        }
      };
      checkPool();
    });
  }

  public releaseConnection(connection: any): void {
    connection.active = false;
  }

  // Get performance report
  public getPerformanceReport() {
    const uptime = Date.now() - this.startTime;
    const avgResponseTime = this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / this.metrics.length;
    const cacheStats = this.getCacheStats();

    return {
      uptime,
      averageResponseTime: avgResponseTime || 0,
      memoryUsage: process.memoryUsage(),
      cacheStats,
      totalRequests: this.metrics.length,
      systemHealth: this.getSystemHealth()
    };
  }

  private getSystemHealth(): 'healthy' | 'warning' | 'critical' {
    const memUsage = process.memoryUsage();
    const memPercentage = memUsage.heapUsed / memUsage.heapTotal;

    if (memPercentage > 0.9) return 'critical';
    if (memPercentage > 0.8) return 'warning';
    return 'healthy';
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Performance optimization middleware
export function performanceOptimization() {
  return performanceMonitor.performanceMiddleware();
}

// Cache middleware
export function cacheMiddleware(ttlSeconds: number = 300) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.method}:${req.url}`;
    const cached = performanceMonitor.get(key);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    res.setHeader('X-Cache', 'MISS');

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      performanceMonitor.set(key, data, ttlSeconds);
      return originalJson.call(this, data);
    };

    next();
  };
}