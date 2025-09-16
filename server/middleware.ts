import { Request, Response, NextFunction } from 'express';
import { securityManager, SecurityManager } from './security';
import { logger } from './monitoring';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Authentication middleware
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    securityManager.logAuditEntry({
      action: 'AUTH_FAILED',
      resource: 'authentication',
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || '',
      success: false,
      errorMessage: 'No token provided'
    });
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = securityManager.verifyToken(token);
  if (!decoded) {
    securityManager.logAuditEntry({
      action: 'AUTH_FAILED',
      resource: 'authentication',
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || '',
      success: false,
      errorMessage: 'Invalid token'
    });
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  (req as AuthenticatedRequest).user = {
    id: decoded.userId,
    email: decoded.email,
    role: decoded.role
  };

  securityManager.logAuditEntry({
    userId: decoded.userId,
    action: 'AUTH_SUCCESS',
    resource: 'authentication',
    ipAddress: req.ip || 'unknown',
    userAgent: req.get('User-Agent') || '',
    success: true
  });

  next();
}

// Role-based authorization middleware
export function requireRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (user.role !== requiredRole && user.role !== 'admin') {
      securityManager.logAuditEntry({
        userId: user.id,
        action: 'AUTHORIZATION_FAILED',
        resource: 'authorization',
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || '',
        success: false,
        errorMessage: `Insufficient permissions. Required: ${requiredRole}, Has: ${user.role}`
      });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Rate limiting middleware
export function rateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.ip || 'unknown';
    const allowed = securityManager.checkRateLimit(identifier, maxRequests, windowMs);

    if (!allowed) {
      securityManager.logAuditEntry({
        action: 'RATE_LIMIT_EXCEEDED',
        resource: 'rate_limit',
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || '',
        success: false,
        details: { maxRequests, windowMs }
      });

      logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path });
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    next();
  };
}

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  const headers = securityManager.getSecurityHeaders();

  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  next();
}

// Input validation middleware
export function validateInput(req: Request, res: Response, next: NextFunction) {
  // Sanitize string inputs
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return securityManager.sanitizeInput(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  next();
}

// CORS middleware with security
export function secureCors(allowedOrigins: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (allowedOrigins.includes(origin) || allowedOrigins.length === 0) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  };
}

// Audit logging middleware
export function auditLog(action: string, resource: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    res.send = function(data: any) {
      const isError = res.statusCode >= 400;
      const authReq = req as AuthenticatedRequest;

      securityManager.logAuditEntry({
        userId: authReq.user?.id,
        action,
        resource,
        resourceId: req.params.id,
        ipAddress: req.ip || req.socket?.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || '',
        success: !isError,
        details: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          userAgent: req.get('User-Agent')
        }
      });

      return originalSend.call(this, data);
    };

    next();
  };
}

// GDPR compliance middleware
export function gdprCompliance(req: Request, res: Response, next: NextFunction) {
  // Add GDPR-specific headers
  res.setHeader('X-GDPR-Compliant', 'true');
  res.setHeader('X-Data-Processing', 'GDPR Article 6(1)(b)');

  // Log data processing activities
  const authReq = req as AuthenticatedRequest;
  if (authReq.user) {
    securityManager.logAuditEntry({
      userId: authReq.user.id,
      action: 'DATA_PROCESSING',
      resource: 'gdpr_compliance',
      ipAddress: req.ip || req.socket?.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || '',
      success: true,
      details: {
        processingPurpose: 'Service provision',
        legalBasis: 'Contract performance',
        dataCategories: ['personal', 'usage']
      }
    });
  }

  next();
}

// Error handling middleware with security
export function secureErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log the error securely (don't expose sensitive information)
  const errorId = Date.now().toString();
  logger.error('Application error', {
    errorId,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip || req.socket?.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent')
  });

  // Don't expose internal error details to client
  const isDevelopment = process.env.NODE_ENV === 'development';
  const clientError = {
    error: 'Internal server error',
    errorId: isDevelopment ? errorId : undefined,
    message: isDevelopment ? err.message : 'Something went wrong'
  };

  res.status(err.status || 500).json(clientError);
}

// Request size limiting
export function requestSizeLimit(maxSize: string = '10mb') {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');

    if (contentLength > parseSize(maxSize)) {
      securityManager.logAuditEntry({
        action: 'REQUEST_SIZE_EXCEEDED',
        resource: 'request_size',
        ipAddress: req.ip || req.socket?.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || '',
        success: false,
        details: { contentLength, maxSize }
      });

      return res.status(413).json({ error: 'Request entity too large' });
    }

    next();
  };
}

function parseSize(size: string): number {
  const units: { [key: string]: number } = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };

  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
  if (!match) return 10 * 1024 * 1024; // Default 10MB

  const value = parseFloat(match[1]);
  const unit = match[2] || 'b';

  return value * units[unit];
}