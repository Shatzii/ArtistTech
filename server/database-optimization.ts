import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { eq, and, or, sql } from 'drizzle-orm';
import { logger } from './monitoring';

// Database optimization interface
interface QueryMetrics {
  query: string;
  executionTime: number;
  timestamp: number;
  slow: boolean;
}

// Database connection pool interface
interface ConnectionPool {
  acquire(): Promise<any>;
  release(connection: any): void;
  getStats(): PoolStats;
}

interface PoolStats {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
}

// Database optimization class
export class DatabaseOptimizer {
  private db: DrizzleD1Database;
  private queryMetrics: QueryMetrics[] = [];
  private connectionPool: ConnectionPool | null = null;
  private queryCache: Map<string, { result: any; expiresAt: number }> = new Map();

  constructor(db: DrizzleD1Database) {
    this.db = db;

    // Clean query cache every 10 minutes
    setInterval(() => {
      this.cleanQueryCache();
    }, 600000);
  }

  // Set connection pool
  public setConnectionPool(pool: ConnectionPool): void {
    this.connectionPool = pool;
  }

  // Optimized query execution with metrics
  public async executeOptimizedQuery<T>(
    queryFn: () => Promise<T>,
    queryDescription: string = 'unknown'
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await queryFn();
      const executionTime = Date.now() - startTime;

      // Record metrics
      this.recordQueryMetrics(queryDescription, executionTime);

      // Log slow queries
      if (executionTime > 200) {
        logger.warn('Slow database query detected', {
          query: queryDescription,
          executionTime,
          timestamp: new Date().toISOString()
        });
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      logger.error('Database query error', {
        query: queryDescription,
        executionTime,
        error: error.message
      });
      throw error;
    }
  }

  // Cached query execution
  public async executeCachedQuery<T>(
    queryFn: () => Promise<T>,
    cacheKey: string,
    ttlSeconds: number = 300
  ): Promise<T> {
    // Check cache first
    const cached = this.queryCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      logger.debug('Cache hit for query', { cacheKey });
      return cached.result;
    }

    // Execute query
    const result = await this.executeOptimizedQuery(queryFn, `cached:${cacheKey}`);

    // Cache result
    this.queryCache.set(cacheKey, {
      result,
      expiresAt: Date.now() + (ttlSeconds * 1000)
    });

    return result;
  }

  // Batch query execution
  public async executeBatchQueries<T>(
    queries: Array<() => Promise<T>>,
    batchSize: number = 5
  ): Promise<T[]> {
    const results: T[] = [];

    for (let i = 0; i < queries.length; i += batchSize) {
      const batch = queries.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(query => this.executeOptimizedQuery(query, `batch:${i}`))
      );
      results.push(...batchResults);

      // Small delay between batches to prevent overwhelming the database
      if (i + batchSize < queries.length) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    return results;
  }

  // Query optimization suggestions
  public async analyzeQueryPerformance(): Promise<{
    slowQueries: QueryMetrics[];
    recommendations: string[];
    cacheStats: { hits: number; misses: number; hitRate: number };
  }> {
    const slowQueries = this.queryMetrics.filter(q => q.slow);

    const recommendations: string[] = [];

    if (slowQueries.length > 0) {
      recommendations.push('Consider adding database indexes for frequently queried columns');
      recommendations.push('Implement query result caching for expensive operations');
      recommendations.push('Use batch queries for multiple similar operations');
    }

    // Calculate cache stats
    const cacheHits = Array.from(this.queryCache.values()).filter(
      entry => Date.now() < entry.expiresAt
    ).length;
    const totalCacheEntries = this.queryCache.size;
    const cacheMisses = totalCacheEntries - cacheHits;
    const hitRate = totalCacheEntries > 0 ? (cacheHits / totalCacheEntries) * 100 : 0;

    return {
      slowQueries: slowQueries.slice(-10), // Last 10 slow queries
      recommendations,
      cacheStats: {
        hits: cacheHits,
        misses: cacheMisses,
        hitRate
      }
    };
  }

  // Database health check
  public async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    metrics: {
      connectionPool: PoolStats | null;
      queryMetrics: {
        totalQueries: number;
        slowQueries: number;
        averageExecutionTime: number;
      };
    };
  }> {
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Check connection pool
    const poolStats = this.connectionPool?.getStats() || null;

    if (poolStats && poolStats.waitingRequests > 10) {
      status = 'warning';
    }

    // Check query metrics
    const totalQueries = this.queryMetrics.length;
    const slowQueries = this.queryMetrics.filter(q => q.slow).length;
    const averageExecutionTime = totalQueries > 0
      ? this.queryMetrics.reduce((sum, q) => sum + q.executionTime, 0) / totalQueries
      : 0;

    if (slowQueries > totalQueries * 0.1) { // More than 10% slow queries
      status = 'warning';
    }

    if (averageExecutionTime > 500) { // Average > 500ms
      status = 'critical';
    }

    return {
      status,
      metrics: {
        connectionPool: poolStats,
        queryMetrics: {
          totalQueries,
          slowQueries,
          averageExecutionTime
        }
      }
    };
  }

  // Index optimization suggestions
  public async suggestIndexes(): Promise<string[]> {
    // This would analyze query patterns and suggest indexes
    // For now, return generic suggestions
    return [
      'Consider adding indexes on frequently filtered columns',
      'Use composite indexes for queries with multiple WHERE conditions',
      'Monitor index usage with database query analyzer',
      'Remove unused indexes to improve write performance'
    ];
  }

  // Connection pool implementation
  public createConnectionPool(maxConnections: number = 10): ConnectionPool {
    const pool: any[] = [];
    let waitingQueue: Array<(connection: any) => void> = [];

    const acquire = (): Promise<any> => {
      return new Promise((resolve) => {
        const available = pool.find(conn => !conn.inUse);

        if (available) {
          available.inUse = true;
          resolve(available);
        } else if (pool.length < maxConnections) {
          const connection = { id: Date.now(), inUse: true };
          pool.push(connection);
          resolve(connection);
        } else {
          waitingQueue.push(resolve);
        }
      });
    };

    const release = (connection: any): void => {
      connection.inUse = false;

      if (waitingQueue.length > 0) {
        const resolve = waitingQueue.shift();
        connection.inUse = true;
        resolve(connection);
      }
    };

    const getStats = (): PoolStats => {
      const activeConnections = pool.filter(conn => conn.inUse).length;
      const idleConnections = pool.length - activeConnections;

      return {
        totalConnections: pool.length,
        activeConnections,
        idleConnections,
        waitingRequests: waitingQueue.length
      };
    };

    const connectionPool: ConnectionPool = {
      acquire,
      release,
      getStats
    };

    this.connectionPool = connectionPool;
    return connectionPool;
  }

  private recordQueryMetrics(query: string, executionTime: number): void {
    const metrics: QueryMetrics = {
      query,
      executionTime,
      timestamp: Date.now(),
      slow: executionTime > 200
    };

    this.queryMetrics.push(metrics);

    // Keep only last 1000 metrics
    if (this.queryMetrics.length > 1000) {
      this.queryMetrics.shift();
    }
  }

  private cleanQueryCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.queryCache.entries()) {
      if (now > entry.expiresAt) {
        this.queryCache.delete(key);
      }
    }
  }
}

// Database optimization middleware
export function databaseOptimizationMiddleware(dbOptimizer: DatabaseOptimizer) {
  return async (req: any, res: any, next: any) => {
    // Add database optimization methods to request
    req.dbOptimizer = dbOptimizer;

    // Track database operations for this request
    const originalSend = res.send;
    res.send = function(data: any) {
      // Log database performance for this request
      if (req.dbOperations) {
        logger.debug('Request database operations', {
          url: req.url,
          method: req.method,
          operations: req.dbOperations.length,
          totalTime: req.dbOperations.reduce((sum: number, op: any) => sum + op.time, 0)
        });
      }

      originalSend.call(this, data);
    };

    next();
  };
}