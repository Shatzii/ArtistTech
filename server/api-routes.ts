import express from 'express';
import { apiDocs, createVersionedRouter, handleAPIError, apiAnalytics, rateLimitConfigs } from './api-management';
import { authenticateToken, requireRole } from './middleware';

// Create API documentation endpoints
export function createAPIDocumentationRoutes() {
  const router = express.Router();

  // OpenAPI specification endpoint
  router.get('/openapi.json', (req, res) => {
    const spec = apiDocs.generateOpenAPISpec();
    res.setHeader('Content-Type', 'application/json');
    res.json(spec);
  });

  // Markdown documentation endpoint
  router.get('/docs.md', (req, res) => {
    const docs = apiDocs.generateMarkdownDocs();
    res.setHeader('Content-Type', 'text/markdown');
    res.send(docs);
  });

  // API documentation UI endpoint
  router.get('/docs', (req, res) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Artist Tech API Documentation</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.7.2/swagger-ui.css" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.7.2/swagger-ui-bundle.js"></script>
    <script>
        window.onload = () => {
            window.ui = SwaggerUIBundle({
                url: '/api/docs/openapi.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.presets.standalone
                ]
            });
        };
    </script>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });

  return router;
}

// Create v1 API routes
export function createV1APIRoutes() {
  const v1Router = createVersionedRouter('v1');

  // Apply global middleware
  v1Router.use(apiAnalytics);
  v1Router.use(rateLimitConfigs.general);

  // Register API endpoints with documentation
  apiDocs.addEndpoint('GET', '/health', {
    description: 'Get API health status',
    tags: ['System'],
    responses: {
      '200': {
        description: 'API is healthy',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/APIResponse' }
          }
        }
      }
    }
  });

  apiDocs.addEndpoint('GET', '/users', {
    description: 'Get users list (admin only)',
    tags: ['Users'],
    parameters: [
      {
        name: 'page',
        in: 'query',
        description: 'Page number',
        schema: { type: 'integer', default: 1 }
      },
      {
        name: 'limit',
        in: 'query',
        description: 'Items per page',
        schema: { type: 'integer', default: 10 }
      }
    ],
    responses: {
      '200': {
        description: 'Users retrieved successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PaginatedResponse' }
          }
        }
      },
      '401': {
        description: 'Unauthorized'
      },
      '403': {
        description: 'Forbidden - Admin access required'
      }
    }
  });

  apiDocs.addEndpoint('GET', '/users/{id}', {
    description: 'Get user by ID',
    tags: ['Users'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'User ID',
        schema: { type: 'string' }
      }
    ],
    responses: {
      '200': {
        description: 'User retrieved successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/APIResponse' }
          }
        }
      },
      '404': {
        description: 'User not found'
      }
    }
  });

  apiDocs.addEndpoint('GET', '/projects', {
    description: 'Get user projects',
    tags: ['Projects'],
    parameters: [
      {
        name: 'page',
        in: 'query',
        description: 'Page number',
        schema: { type: 'integer', default: 1 }
      },
      {
        name: 'limit',
        in: 'query',
        description: 'Items per page',
        schema: { type: 'integer', default: 10 }
      }
    ],
    responses: {
      '200': {
        description: 'Projects retrieved successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PaginatedResponse' }
          }
        }
      }
    }
  });

  apiDocs.addEndpoint('POST', '/projects', {
    description: 'Create new project',
    tags: ['Projects'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name'],
            properties: {
              name: { type: 'string', description: 'Project name' },
              description: { type: 'string', description: 'Project description' }
            }
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'Project created successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/APIResponse' }
          }
        }
      },
      '400': {
        description: 'Invalid request data'
      }
    }
  });

  apiDocs.addEndpoint('GET', '/studio/status', {
    description: 'Get studio status and availability',
    tags: ['Studio'],
    responses: {
      '200': {
        description: 'Studio status retrieved successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/APIResponse' }
          }
        }
      }
    }
  });

  apiDocs.addEndpoint('POST', '/ai/process', {
    description: 'Process content with AI engines',
    tags: ['AI'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['type', 'content'],
            properties: {
              type: { type: 'string', enum: ['music', 'video', 'text'], description: 'Content type' },
              content: { type: 'string', description: 'Content to process' },
              options: { type: 'object', description: 'Processing options' }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'AI processing completed successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/APIResponse' }
          }
        }
      },
      '429': {
        description: 'Rate limit exceeded'
      }
    }
  });

  // Health check endpoint
  v1Router.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      message: 'API v1 is operational',
      timestamp: new Date().toISOString()
    });
  });

  // Users endpoints
  v1Router.get('/users', authenticateToken, requireRole('admin'), (req, res) => {
    // Mock users data - in real implementation, this would query the database
    const users = [
      { id: '1', email: 'user1@example.com', name: 'User 1', role: 'user' },
      { id: '2', email: 'user2@example.com', name: 'User 2', role: 'user' }
    ];

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const total = users.length;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    res.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1
      }
    });
  });

  v1Router.get('/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    // Mock user data - in real implementation, this would query the database
    if (id === '1') {
      res.json({
        id: '1',
        email: 'user1@example.com',
        name: 'User 1',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  // Projects endpoints
  v1Router.get('/projects', authenticateToken, (req, res) => {
    // Mock projects data
    const projects = [
      { id: '1', name: 'My First Track', description: 'Electronic music project', userId: '1' },
      { id: '2', name: 'Video Project', description: 'Music video production', userId: '1' }
    ];

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const total = projects.length;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    res.json({
      projects: paginatedProjects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1
      }
    });
  });

  v1Router.post('/projects', authenticateToken, (req, res) => {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Mock project creation
    const newProject = {
      id: Date.now().toString(),
      name,
      description: description || '',
      userId: (req as any).user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Project created successfully',
      project: newProject
    });
  });

  // Studio endpoints
  v1Router.get('/studio/status', (req, res) => {
    res.json({
      music_studio: 'online',
      dj_studio: 'online',
      video_studio: 'online',
      social_media: 'online',
      ai_engines: '19/19 online',
      last_updated: new Date().toISOString()
    });
  });

  // AI processing endpoint with rate limiting
  v1Router.post('/ai/process', authenticateToken, rateLimitConfigs.ai, (req, res) => {
    const { type, content, options } = req.body;

    if (!type || !content) {
      return res.status(400).json({ error: 'Type and content are required' });
    }

    // Mock AI processing - in real implementation, this would call actual AI engines
    setTimeout(() => {
      res.json({
        message: 'AI processing completed',
        result: {
          type,
          processed_content: `Processed ${type} content: ${content.substring(0, 50)}...`,
          confidence: 0.95,
          processing_time: Math.random() * 2 + 1
        }
      });
    }, Math.random() * 2000 + 1000); // Simulate processing time
  });

  // Error handling
  v1Router.use((error: any, req: express.Request, res: express.Response, next: any) => {
    handleAPIError(error, req, res);
  });

  return v1Router;
}