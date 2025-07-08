import { Request, Response, NextFunction } from 'express';

interface DemoUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: 'user' | 'admin';
}

// Demo users for authentication
const DEMO_USERS: DemoUser[] = [
  {
    id: '1',
    email: 'user@artisttech.com',
    username: 'demo_user',
    name: 'Demo User',
    role: 'user'
  },
  {
    id: '2', 
    email: 'admin@artisttech.com',
    username: 'admin_user',
    name: 'Admin User',
    role: 'admin'
  }
];

const DEMO_PASSWORDS: Record<string, string> = {
  'user@artisttech.com': 'demo123',
  'admin@artisttech.com': 'admin2024!'
};

export function authenticateUser(email: string, password: string): DemoUser | null {
  // Check demo credentials
  if (DEMO_PASSWORDS[email] === password) {
    const user = DEMO_USERS.find(u => u.email === email);
    return user || null;
  }
  return null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authentication token provided' });
  }
  
  const token = authHeader.substring(7);
  
  // For demo purposes, decode the token (in production, use proper JWT verification)
  try {
    const userData = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = DEMO_USERS.find(u => u.email === userData.email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token format' });
  }
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
}