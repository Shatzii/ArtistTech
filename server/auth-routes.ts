import { Router } from 'express';
import { z } from 'zod';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  requireAuth,
  requireAdminAuth,
  requireEnterpriseAuth
} from '../auth.js';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  name: z.string().min(1).max(255),
  role: z.enum(['user', 'admin', 'enterprise']).optional().default('user')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1)
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(
      validatedData.email,
      validatedData.username,
      validatedData.password,
      validatedData.role
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.message.includes('already exists')) {
      return res.status(409).json({
        error: 'User already exists',
        code: 'USER_EXISTS'
      });
    }

    if (error.message.includes('validation failed')) {
      return res.status(400).json({
        error: 'Password validation failed',
        code: 'INVALID_PASSWORD',
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const result = await loginUser(email, password);

    res.json({
      message: 'Login successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        name: result.user.name,
        role: result.user.role,
        mfaEnabled: result.user.mfaEnabled,
        lastLogin: result.user.lastLogin
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.message.includes('Invalid email or password')) {
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    res.status(500).json({
      error: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
});

// Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    const result = await refreshAccessToken(refreshToken);

    res.json({
      message: 'Token refreshed successfully',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);

    res.status(401).json({
      error: 'Invalid refresh token',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
});

// Get current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const userProfile = await getCurrentUser(user.id);

    res.json({
      user: userProfile
    });
  } catch (error: any) {
    console.error('Get user profile error:', error);

    res.status(500).json({
      error: 'Failed to get user profile',
      code: 'PROFILE_ERROR'
    });
  }
});

// Logout (client-side token removal, but we can log the event)
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;

    // In a production system, you might want to:
    // 1. Add the token to a blacklist
    // 2. Log the logout event
    // 3. Update user's last activity

    console.log(`User ${user.email} logged out`);

    res.json({
      message: 'Logout successful'
    });
  } catch (error: any) {
    console.error('Logout error:', error);

    res.status(500).json({
      error: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

// Change password
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const schema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8)
    });

    const { currentPassword, newPassword } = schema.parse(req.body);
    const user = (req as any).user;

    // Verify current password
    const currentUser = await loginUser(user.email, currentPassword);

    // Validate new password
    const { validatePassword } = await import('../auth.js');
    const passwordValidation = validatePassword(newPassword);

    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: 'New password validation failed',
        code: 'INVALID_NEW_PASSWORD',
        details: passwordValidation.errors
      });
    }

    // Update password in database
    const { hashPassword } = await import('../auth.js');
    const { db } = await import('../db.js');
    const { users } = await import('../../shared/schema.js');
    const { eq } = await import('drizzle-orm');

    const hashedPassword = await hashPassword(newPassword);

    await db.update(users)
      .set({
        passwordHash: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    console.error('Change password error:', error);

    if (error.message.includes('Invalid email or password')) {
      return res.status(400).json({
        error: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    res.status(500).json({
      error: 'Password change failed',
      code: 'PASSWORD_CHANGE_ERROR'
    });
  }
});

// Admin routes
router.get('/admin/users', requireAdminAuth, async (req, res) => {
  try {
    const { db } = await import('../db.js');
    const { users } = await import('../../shared/schema.js');

    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      username: users.username,
      name: users.name,
      role: users.role,
      mfaEnabled: users.mfaEnabled,
      lastLogin: users.lastLogin,
      createdAt: users.createdAt
    }).from(users);

    res.json({
      users: allUsers
    });
  } catch (error: any) {
    console.error('Get users error:', error);

    res.status(500).json({
      error: 'Failed to get users',
      code: 'GET_USERS_ERROR'
    });
  }
});

// Enterprise routes
router.get('/enterprise/stats', requireEnterpriseAuth, async (req, res) => {
  try {
    const { db } = await import('../db.js');
    const { users } = await import('../../shared/schema.js');

    const userCount = await db.$count(users);
    const adminCount = await db.$count(users, eq(users.role, 'admin'));
    const enterpriseCount = await db.$count(users, eq(users.role, 'enterprise'));

    res.json({
      stats: {
        totalUsers: userCount,
        adminUsers: adminCount,
        enterpriseUsers: enterpriseCount,
        regularUsers: userCount - adminCount - enterpriseCount
      }
    });
  } catch (error: any) {
    console.error('Get enterprise stats error:', error);

    res.status(500).json({
      error: 'Failed to get enterprise stats',
      code: 'ENTERPRISE_STATS_ERROR'
    });
  }
});

export default router;