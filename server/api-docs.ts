import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

const router = express.Router();

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Artist Tech API',
    version,
    description: 'Enterprise-grade API for the Artist Tech platform',
    contact: {
      name: 'Artist Tech Support',
      email: 'support@artisttech.com'
    },
    license: {
      name: 'Proprietary',
      url: 'https://artisttech.com/license'
    }
  },
  servers: [
    {
      url: 'https://api.artisttech.com/v1',
      description: 'Production server'
    },
    {
      url: 'https://staging-api.artisttech.com/v1',
      description: 'Staging server'
    },
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique user identifier'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          firstName: {
            type: 'string',
            description: 'User first name'
          },
          lastName: {
            type: 'string',
            description: 'User last name'
          },
          role: {
            type: 'string',
            enum: ['user', 'artist', 'admin'],
            description: 'User role'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Account creation timestamp'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        },
        required: ['id', 'email', 'firstName', 'lastName', 'role']
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message'
          },
          errorId: {
            type: 'string',
            description: 'Unique error identifier for tracking'
          },
          details: {
            type: 'object',
            description: 'Additional error details'
          }
        },
        required: ['error']
      },
      Pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            minimum: 1,
            default: 1,
            description: 'Current page number'
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20,
            description: 'Number of items per page'
          },
          total: {
            type: 'integer',
            description: 'Total number of items'
          },
          totalPages: {
            type: 'integer',
            description: 'Total number of pages'
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

// Swagger options
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./server/routes/*.ts', './server/routes/**/*.ts'] // Paths to files containing OpenAPI definitions
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Custom Swagger UI options
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestDuration: true,
    syntaxHighlight: {
      activate: true,
      theme: 'arta'
    },
    tryItOutEnabled: true,
    requestInterceptor: (req: any) => {
      // Add any custom request interceptors here
      return req;
    },
    responseInterceptor: (res: any) => {
      // Add any custom response interceptors here
      return res;
    }
  },
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #2c3e50 }
  `,
  customSiteTitle: 'Artist Tech API Documentation',
  customfavIcon: '/favicon.ico'
};

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Serve raw OpenAPI JSON
router.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Serve raw OpenAPI YAML
router.get('/yaml', (req, res) => {
  const yaml = require('js-yaml');
  res.setHeader('Content-Type', 'application/yaml');
  res.send(yaml.dump(swaggerSpec));
});

// API versioning middleware
export function apiVersion(version: string) {
  return (req: express.Request, res: express.Response, next: express.Function) => {
    res.setHeader('X-API-Version', version);
    res.setHeader('X-API-Deprecation', version === 'v1' ? 'false' : 'true');

    // Log API version usage
    console.log(`API ${version} request: ${req.method} ${req.path}`);

    next();
  };
}

// API key authentication middleware
export function authenticateApiKey(req: express.Request, res: express.Response, next: express.Function) {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required',
      message: 'Please provide an X-API-Key header'
    });
  }

  // In a real implementation, validate against a database of API keys
  // For now, we'll use a simple validation
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];

  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }

  // Attach API key info to request
  (req as any).apiKey = {
    key: apiKey,
    // In a real implementation, you'd look up permissions, rate limits, etc.
    permissions: ['read', 'write'],
    rateLimit: 1000 // requests per hour
  };

  next();
}

// Enhanced rate limiting for API endpoints
export function apiRateLimit(options: {
  windowMs?: number;
  maxRequests?: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return (req: express.Request, res: express.Response, next: express.Function) => {
    // Implementation would integrate with your existing rate limiting system
    // This is a placeholder for the actual rate limiting logic

    const identifier = req.ip + (req.headers['x-api-key'] || '');

    // Check rate limit (placeholder logic)
    const isAllowed = true; // Replace with actual rate limit check

    if (!isAllowed) {
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + windowMs).toISOString());
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));

      return res.status(429).json({
        error: 'API rate limit exceeded',
        message: `Too many requests. Try again in ${Math.ceil(windowMs / 1000)} seconds.`,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (maxRequests - 1).toString()); // Placeholder
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + windowMs).toISOString());

    next();
  };
}

// Request logging middleware for APIs
export function apiLogging(req: express.Request, res: express.Response, next: express.Function) {
  const startTime = Date.now();

  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);

  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);

    originalSend.call(this, data);
  };

  next();
}

// API response formatting middleware
export function apiResponseFormatter(req: express.Request, res: express.Response, next: express.Function) {
  // Add common response headers
  res.setHeader('X-API-Response-Time', new Date().toISOString());
  res.setHeader('X-API-Request-ID', req.headers['x-request-id'] || generateRequestId());

  // Extend response object with helper methods
  const originalJson = res.json;
  res.json = function(data) {
    const formattedResponse = {
      success: res.statusCode < 400,
      data: res.statusCode < 400 ? data : undefined,
      error: res.statusCode >= 400 ? data : undefined,
      timestamp: new Date().toISOString(),
      requestId: res.getHeader('X-API-Request-ID')
    };

    return originalJson.call(this, formattedResponse);
  };

  next();
}

function generateRequestId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Health check endpoint for API
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version,
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'operational',
    version,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    endpoints: {
      docs: '/api/docs',
      health: '/api/health',
      status: '/api/status'
    }
  });
});

export default router;