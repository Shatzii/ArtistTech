import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from './db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin' | 'enterprise';
  mfaEnabled: boolean;
  lastLogin?: Date;
}

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Password validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Generate JWT tokens
export function generateAccessToken(user: AuthenticatedUser): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function generateRefreshToken(user: AuthenticatedUser): string {
  return jwt.sign(
    {
      userId: user.id,
      type: 'refresh'
    },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
}

// Verify JWT tokens
export function verifyAccessToken(token: string): AuthenticatedUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type !== 'access') return null;

    return {
      id: decoded.userId,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
      mfaEnabled: decoded.mfaEnabled || false,
      lastLogin: decoded.lastLogin
    };
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as any;
    if (decoded.type !== 'refresh') return null;
    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'No authentication token provided',
      code: 'AUTH_TOKEN_MISSING'
    });
  }

  const token = authHeader.substring(7);
  const user = verifyAccessToken(token);

  if (!user) {
    return res.status(401).json({
      error: 'Invalid or expired token',
      code: 'AUTH_TOKEN_INVALID'
    });
  }

  (req as any).user = user;
  next();
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const user = (req as any).user;
    if (user.role !== 'admin' && user.role !== 'enterprise') {
      return res.status(403).json({
        error: 'Admin access required',
        code: 'AUTH_INSUFFICIENT_PERMISSIONS'
      });
    }
    next();
  });
}

export function requireEnterpriseAuth(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const user = (req as any).user;
    if (user.role !== 'enterprise') {
      return res.status(403).json({
        error: 'Enterprise access required',
        code: 'AUTH_ENTERPRISE_REQUIRED'
      });
    }
    next();
  });
}

// User registration
export async function registerUser(email: string, username: string, password: string, role: 'user' | 'admin' | 'enterprise' = 'user') {
  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
  }

  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser.length > 0) {
    throw new Error('User with this email already exists');
  }

  const existingUsername = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (existingUsername.length > 0) {
    throw new Error('Username already taken');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const newUser = await db.insert(users).values({
    email,
    username,
    passwordHash: hashedPassword,
    role,
    mfaEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  return newUser[0];
}

// User login
export async function loginUser(email: string, password: string) {
  // Find user
  const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (userResult.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = userResult[0];

  // Verify password
  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await db.update(users)
    .set({ lastLogin: new Date(), updatedAt: new Date() })
    .where(eq(users.id, user.id));

  const authenticatedUser: AuthenticatedUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role as 'user' | 'admin' | 'enterprise',
    mfaEnabled: user.mfaEnabled || false,
    lastLogin: user.lastLogin || undefined
  };

  // Generate tokens
  const accessToken = generateAccessToken(authenticatedUser);
  const refreshToken = generateRefreshToken(authenticatedUser);

  return {
    user: authenticatedUser,
    accessToken,
    refreshToken
  };
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string) {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new Error('Invalid refresh token');
  }

  // Get user from database
  const userResult = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
  if (userResult.length === 0) {
    throw new Error('User not found');
  }

  const user = userResult[0];
  const authenticatedUser: AuthenticatedUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role as 'user' | 'admin' | 'enterprise',
    mfaEnabled: user.mfaEnabled || false,
    lastLogin: user.lastLogin || undefined
  };

  const newAccessToken = generateAccessToken(authenticatedUser);
  const newRefreshToken = generateRefreshToken(authenticatedUser);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}

// Get current user profile
export async function getCurrentUser(userId: string) {
  const userResult = await db.select({
    id: users.id,
    email: users.email,
    username: users.username,
    role: users.role,
    mfaEnabled: users.mfaEnabled,
    createdAt: users.createdAt,
    lastLogin: users.lastLogin
  }).from(users).where(eq(users.id, userId)).limit(1);

  if (userResult.length === 0) {
    throw new Error('User not found');
  }

  return userResult[0];
}