import express from 'express';
import { Request, Response } from 'express';
import { rateLimit } from './middleware';
import { logger } from './monitoring';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  version: string;
  requestId: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  requestId: string;
}

// API versioning middleware
export function apiVersion(version: string) {
  return (req: Request, res: Response, next: any) => {
    (req as any).apiVersion = version;
    res.setHeader('X-API-Version', version);
    next();
  };
}

// Response formatting middleware
export function formatResponse(req: Request, res: Response, next: any) {
  const originalJson = res.json;
  const requestId = generateRequestId();

  res.json = function(data: any) {
    const apiVersion = (req as any).apiVersion || 'v1';
    const response: APIResponse = {
      success: !data.error,
      data: data.error ? undefined : data,
      error: data.error,
      message: data.message,
      timestamp: new Date().toISOString(),
      version: apiVersion,
      requestId
    };

    return originalJson.call(this, response);
  };

  (req as any).requestId = requestId;
  next();
};

// Request ID generation
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Pagination helper
export function createPagination(page: number = 1, limit: number = 10, total: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

// API documentation generator
export class APIDocumentation {
  private endpoints: any[] = [];

  addEndpoint(method: string, path: string, config: {
    description: string;
    parameters?: any[];
    responses?: any;
    tags?: string[];
    deprecated?: boolean;
  }) {
    this.endpoints.push({
      method: method.toUpperCase(),
      path,
      ...config
    });
  }

  generateOpenAPISpec() {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: 'Artist Tech API',
        version: '1.0.0',
        description: 'Professional music production and content creation platform API'
      },
      servers: [
        {
          url: 'https://api.artisttech.com/v1',
          description: 'Production server'
        },
        {
          url: 'https://staging-api.artisttech.com/v1',
          description: 'Staging server'
        }
      ],
      paths: this.generatePaths(),
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: this.generateSchemas()
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    };

    return spec;
  }

  private generatePaths() {
    const paths: any = {};

    this.endpoints.forEach(endpoint => {
      if (!paths[endpoint.path]) {
        paths[endpoint.path] = {};
      }

      paths[endpoint.path][endpoint.method.toLowerCase()] = {
        summary: endpoint.description,
        tags: endpoint.tags || ['General'],
        deprecated: endpoint.deprecated || false,
        parameters: endpoint.parameters || [],
        responses: endpoint.responses || {
          '200': {
            description: 'Successful response'
          },
          '400': {
            description: 'Bad request'
          },
          '401': {
            description: 'Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      };
    });

    return paths;
  }

  private generateSchemas() {
    return {
      APIResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          error: { type: 'string' },
          message: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          version: { type: 'string' },
          requestId: { type: 'string' }
        }
      },
      PaginatedResponse: {
        allOf: [
          { $ref: '#/components/schemas/APIResponse' },
          {
            type: 'object',
            properties: {
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'integer' },
                  limit: { type: 'integer' },
                  total: { type: 'integer' },
                  totalPages: { type: 'integer' },
                  hasNext: { type: 'boolean' },
                  hasPrev: { type: 'boolean' }
                }
              }
            }
          }
        ]
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    };
  }

  generateMarkdownDocs() {
    let docs = '# Artist Tech API Documentation\n\n';
    docs += '## Overview\n\n';
    docs += 'This API provides access to the Artist Tech platform\'s music production and content creation features.\n\n';

    const groupedEndpoints = this.endpoints.reduce((groups: any, endpoint) => {
      const tag = endpoint.tags?.[0] || 'General';
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(endpoint);
      return groups;
    }, {});

    Object.keys(groupedEndpoints).forEach(tag => {
      docs += `## ${tag}\n\n`;
      groupedEndpoints[tag].forEach((endpoint: any) => {
        docs += `### ${endpoint.method} ${endpoint.path}\n\n`;
        docs += `${endpoint.description}\n\n`;

        if (endpoint.parameters && endpoint.parameters.length > 0) {
          docs += '**Parameters:**\n\n';
          endpoint.parameters.forEach((param: any) => {
            docs += `- \`${param.name}\` (${param.in}): ${param.description}\n`;
          });
          docs += '\n';
        }

        docs += '**Responses:**\n\n';
        Object.keys(endpoint.responses || {}).forEach(code => {
          docs += `- \`${code}\`: ${endpoint.responses[code].description}\n`;
        });
        docs += '\n---\n\n';
      });
    });

    return docs;
  }
}

// Rate limiting configurations
export const rateLimitConfigs = {
  // General API endpoints
  general: rateLimit(1000, 60 * 60 * 1000), // 1000 requests per hour

  // Authentication endpoints
  auth: rateLimit(10, 15 * 60 * 1000), // 10 requests per 15 minutes

  // File upload endpoints
  upload: rateLimit(100, 60 * 60 * 1000), // 100 uploads per hour

  // AI processing endpoints
  ai: rateLimit(50, 60 * 60 * 1000), // 50 AI requests per hour

  // Admin endpoints
  admin: rateLimit(100, 60 * 60 * 1000), // 100 admin requests per hour
};

// API versioning router
export function createVersionedRouter(version: string) {
  const router = express.Router();
  router.use(apiVersion(version));
  router.use(formatResponse);
  return router;
}

// Error handling for API
export function handleAPIError(error: any, req: Request, res: Response) {
  const requestId = (req as any).requestId || generateRequestId();

  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip
  });

  const apiError: APIError = {
    code: error.code || 'INTERNAL_ERROR',
    message: error.message || 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    requestId
  };

  const statusCode = error.statusCode || error.status || 500;
  res.status(statusCode).json(apiError);
}

// Request validation middleware
export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const apiError: APIError = {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.details.map((detail: any) => detail.message),
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      };
      return res.status(400).json(apiError);
    }
    next();
  };
}

// API analytics middleware
export function apiAnalytics(req: Request, res: Response, next: any) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const requestId = (req as any).requestId;

    logger.info('API Request Completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  });

  next();
}

// Export singleton API documentation instance
export const apiDocs = new APIDocumentation();