import Redis from 'ioredis';
import { logger } from './monitoring';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  ttl: number; // Default TTL in seconds
  keyPrefix: string;
}

export class CacheManager {
  private redis: Redis;
  private config: CacheConfig;
  private isConnected: boolean = false;

  constructor(config: CacheConfig) {
    this.config = config;
    this.redis = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db || 0,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.redis.on('connect', () => {
      this.isConnected = true;
      logger.info('Redis cache connected');
    });

    this.redis.on('error', (error) => {
      this.isConnected = false;
      logger.error('Redis cache error', { error: error.message });
    });

    this.redis.on('close', () => {
      this.isConnected = false;
      logger.warn('Redis cache connection closed');
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.redis.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.redis.disconnect();
    }
  }

  private getKey(key: string): string {
    return `${this.config.keyPrefix}:${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected) {
        return null;
      }

      const cached = await this.redis.get(this.getKey(key));
      if (!cached) {
        return null;
      }

      const parsed = JSON.parse(cached);
      logger.debug('Cache hit', { key });
      return parsed;
    } catch (error) {
      logger.error('Cache get error', { key, error: error.message });
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      if (!this.isConnected) {
        return;
      }

      const serialized = JSON.stringify(value);
      const expiry = ttl || this.config.ttl;

      await this.redis.setex(this.getKey(key), expiry, serialized);
      logger.debug('Cache set', { key, ttl: expiry });
    } catch (error) {
      logger.error('Cache set error', { key, error: error.message });
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (!this.isConnected) {
        return;
      }

      await this.redis.del(this.getKey(key));
      logger.debug('Cache delete', { key });
    } catch (error) {
      logger.error('Cache delete error', { key, error: error.message });
    }
  }

  async clear(pattern?: string): Promise<void> {
    try {
      if (!this.isConnected) {
        return;
      }

      if (pattern) {
        const keys = await this.redis.keys(`${this.config.keyPrefix}:${pattern}`);
        if (keys.length > 0) {
          await this.redis.del(...keys);
          logger.debug('Cache clear pattern', { pattern, deleted: keys.length });
        }
      } else {
        const keys = await this.redis.keys(`${this.config.keyPrefix}:*`);
        if (keys.length > 0) {
          await this.redis.del(...keys);
          logger.debug('Cache clear all', { deleted: keys.length });
        }
      }
    } catch (error) {
      logger.error('Cache clear error', { error: error.message });
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      const exists = await this.redis.exists(this.getKey(key));
      return exists === 1;
    } catch (error) {
      logger.error('Cache exists error', { key, error: error.message });
      return false;
    }
  }

  async getTTL(key: string): Promise<number> {
    try {
      if (!this.isConnected) {
        return -1;
      }

      return await this.redis.ttl(this.getKey(key));
    } catch (error) {
      logger.error('Cache TTL error', { key, error: error.message });
      return -1;
    }
  }

  // Advanced caching methods
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    let cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetcher();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  async invalidateUserCache(userId: string): Promise<void> {
    await this.clear(`user:${userId}:*`);
  }

  async invalidateProjectCache(projectId: string): Promise<void> {
    await this.clear(`project:${projectId}:*`);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.redis.ping();
      return true;
    } catch (error) {
      logger.error('Cache health check failed', { error: error.message });
      return false;
    }
  }

  // Statistics
  async getStats(): Promise<{
    connected: boolean;
    dbSize: number;
    info: any;
  }> {
    try {
      const info = await this.redis.info();
      const dbSize = await this.redis.dbsize();

      return {
        connected: this.isConnected,
        dbSize,
        info: this.parseRedisInfo(info)
      };
    } catch (error) {
      logger.error('Cache stats error', { error: error.message });
      return {
        connected: false,
        dbSize: 0,
        info: null
      };
    }
  }

  private parseRedisInfo(info: string): any {
    const lines = info.split('\n');
    const parsed: any = {};

    lines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        parsed[key] = value;
      }
    });

    return parsed;
  }
}

// Database query result cache
export class QueryCache {
  private cache: CacheManager;

  constructor(cache: CacheManager) {
    this.cache = cache;
  }

  async cacheQuery<T>(
    queryKey: string,
    query: () => Promise<T>,
    ttl: number = 300 // 5 minutes default
  ): Promise<T> {
    return this.cache.getOrSet(`query:${queryKey}`, query, ttl);
  }

  async invalidateQuery(pattern: string): Promise<void> {
    await this.cache.clear(`query:${pattern}`);
  }
}

// API response cache
export class ApiCache {
  private cache: CacheManager;

  constructor(cache: CacheManager) {
    this.cache = cache;
  }

  async cacheResponse<T>(
    method: string,
    path: string,
    params: any,
    response: T,
    ttl: number = 300
  ): Promise<void> {
    const key = `${method}:${path}:${JSON.stringify(params)}`;
    await this.cache.set(key, response, ttl);
  }

  async getCachedResponse<T>(
    method: string,
    path: string,
    params: any
  ): Promise<T | null> {
    const key = `${method}:${path}:${JSON.stringify(params)}`;
    return this.cache.get<T>(key);
  }

  async invalidateEndpoint(method: string, path: string): Promise<void> {
    await this.cache.clear(`${method}:${path}:*`);
  }
}

// Session cache for authentication
export class SessionCache {
  private cache: CacheManager;

  constructor(cache: CacheManager) {
    this.cache = cache;
  }

  async storeSession(sessionId: string, sessionData: any, ttl: number = 3600): Promise<void> {
    await this.cache.set(`session:${sessionId}`, sessionData, ttl);
  }

  async getSession(sessionId: string): Promise<any | null> {
    return this.cache.get(`session:${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.cache.delete(`session:${sessionId}`);
  }

  async extendSession(sessionId: string, ttl: number = 3600): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      await this.storeSession(sessionId, session, ttl);
    }
  }
}

// Rate limiting cache
export class RateLimitCache {
  private cache: CacheManager;

  constructor(cache: CacheManager) {
    this.cache = cache;
  }

  async checkLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): Promise<boolean> {
    const key = `ratelimit:${identifier}`;
    const windowSeconds = Math.floor(windowMs / 1000);

    try {
      const current = await this.cache.get<number[]>(key) || [];
      const now = Date.now();

      // Remove expired requests
      const validRequests = current.filter(time => now - time < windowMs);

      if (validRequests.length >= maxRequests) {
        return false;
      }

      // Add current request
      validRequests.push(now);
      await this.cache.set(key, validRequests, windowSeconds);

      return true;
    } catch (error) {
      logger.error('Rate limit check error', { identifier, error: error.message });
      return true; // Allow request on error
    }
  }

  async getRemainingRequests(identifier: string, windowMs: number): Promise<number> {
    const key = `ratelimit:${identifier}`;
    const current = await this.cache.get<number[]>(key) || [];
    const now = Date.now();

    const validRequests = current.filter(time => now - time < windowMs);
    return Math.max(0, 100 - validRequests.length); // Assuming 100 max requests
  }
}

// Global cache instance
let globalCache: CacheManager | null = null;

export function initializeCache(config?: Partial<CacheConfig>): CacheManager {
  if (globalCache) {
    return globalCache;
  }

  const defaultConfig: CacheConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    ttl: 300, // 5 minutes
    keyPrefix: 'artisttech'
  };

  const finalConfig = { ...defaultConfig, ...config };
  globalCache = new CacheManager(finalConfig);

  return globalCache;
}

export function getCache(): CacheManager | null {
  return globalCache;
}

// Cache middleware for Express
export function cacheMiddleware(ttl?: number) {
  return async (req: any, res: any, next: any) => {
    if (!globalCache) {
      return next();
    }

    const apiCache = new ApiCache(globalCache);
    const key = `${req.method}:${req.path}:${JSON.stringify(req.query)}`;

    // Try to get cached response
    const cached = await apiCache.getCachedResponse(req.method, req.path, req.query);
    if (cached) {
      return res.json(cached);
    }

    // Intercept response
    const originalJson = res.json;
    res.json = function(data: any) {
      // Cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        apiCache.cacheResponse(req.method, req.path, req.query, data, ttl);
      }

      return originalJson.call(this, data);
    };

    next();
  };
}