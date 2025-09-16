import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from './monitoring';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  preferences: UserPreferences;
  consent: ConsentData;
}

export interface UserPreferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  dataAnalytics: boolean;
  theme: 'light' | 'dark';
  language: string;
}

export interface ConsentData {
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  marketingConsent: boolean;
  dataProcessingConsent: boolean;
  consentDate: Date;
  consentVersion: string;
}

export interface AuditLogEntry {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  details?: Record<string, any>;
  success: boolean;
  errorMessage?: string;
}

class SecurityManager {
  private readonly encryptionKey: string;
  private readonly jwtSecret: string;
  private readonly saltRounds = 12;

  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    this.jwtSecret = process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';

    if (this.encryptionKey === 'default-key-change-in-production') {
      logger.warn('Using default encryption key - change in production!');
    }
  }

  // Password hashing
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // JWT token management
  generateAccessToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'access'
      },
      this.jwtSecret,
      { expiresIn: '1h' }
    );
  }

  generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        type: 'refresh'
      },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      logger.error('Token verification failed', { error: error.message });
      return null;
    }
  }

  // Data encryption/decryption
  encryptData(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  decryptData(encryptedData: string): string {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // GDPR compliance - data anonymization
  anonymizeUserData(user: User): Partial<User> {
    return {
      ...user,
      email: this.hashEmailForAnonymization(user.email),
      name: `User_${user.id.slice(0, 8)}`,
      preferences: {
        ...user.preferences,
        emailNotifications: false,
        marketingEmails: false
      }
    };
  }

  private hashEmailForAnonymization(email: string): string {
    return crypto.createHash('sha256').update(email).digest('hex').slice(0, 16) + '@anonymized.com';
  }

  // Audit logging
  logAuditEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const auditEntry: AuditLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    logger.info('Audit Log Entry', {
      auditId: auditEntry.id,
      userId: auditEntry.userId,
      action: auditEntry.action,
      resource: auditEntry.resource,
      success: auditEntry.success,
      ipAddress: auditEntry.ipAddress,
      timestamp: auditEntry.timestamp
    });

    // In production, this would be stored in a secure audit database
    this.storeAuditEntry(auditEntry);
  }

  private storeAuditEntry(entry: AuditLogEntry): void {
    // Implementation would store in audit database
    // For now, just log that it would be stored
    console.log('Audit entry would be stored:', entry.id);
  }

  // Rate limiting data structure
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const key = `${identifier}:${Math.floor(now / windowMs)}`;

    const current = this.rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > current.resetTime) {
      current.count = 1;
      current.resetTime = now + windowMs;
    } else {
      current.count++;
    }

    this.rateLimitStore.set(key, current);

    // Clean up old entries
    for (const [k, v] of this.rateLimitStore.entries()) {
      if (now > v.resetTime) {
        this.rateLimitStore.delete(k);
      }
    }

    return current.count <= maxRequests;
  }

  // Security headers middleware
  getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }

  // Input validation and sanitization
  sanitizeInput(input: string): string {
    // Basic XSS prevention
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  validatePassword(password: string): { valid: boolean; errors: string[] } {
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
}

// Privacy and consent management
export class PrivacyManager {
  private securityManager: SecurityManager;

  constructor(securityManager: SecurityManager) {
    this.securityManager = securityManager;
  }

  // GDPR - Right to be forgotten
  async deleteUserData(userId: string): Promise<void> {
    // In a real implementation, this would:
    // 1. Anonymize user data instead of deleting
    // 2. Log the deletion request
    // 3. Notify relevant systems
    // 4. Schedule actual deletion after retention period

    this.securityManager.logAuditEntry({
      userId,
      action: 'DATA_DELETION_REQUEST',
      resource: 'user',
      resourceId: userId,
      ipAddress: 'system',
      userAgent: 'GDPR Compliance',
      success: true,
      details: { reason: 'Right to be forgotten' }
    });

    logger.info('User data deletion requested', { userId });
  }

  // GDPR - Data portability
  async exportUserData(userId: string): Promise<any> {
    // In a real implementation, this would gather all user data
    const exportData = {
      userId,
      exportDate: new Date().toISOString(),
      data: {
        profile: {},
        projects: [],
        activity: [],
        preferences: {}
      }
    };

    this.securityManager.logAuditEntry({
      userId,
      action: 'DATA_EXPORT',
      resource: 'user',
      resourceId: userId,
      ipAddress: 'system',
      userAgent: 'GDPR Compliance',
      success: true,
      details: { exportType: 'portability' }
    });

    return exportData;
  }

  // CCPA - Opt-out of sale
  async optOutOfDataSale(userId: string): Promise<void> {
    this.securityManager.logAuditEntry({
      userId,
      action: 'OPT_OUT_DATA_SALE',
      resource: 'user',
      resourceId: userId,
      ipAddress: 'system',
      userAgent: 'CCPA Compliance',
      success: true,
      details: { regulation: 'CCPA' }
    });

    logger.info('User opted out of data sale', { userId });
  }

  // Consent management
  validateConsent(consent: ConsentData): boolean {
    const requiredConsents = ['termsAccepted', 'privacyPolicyAccepted'];
    return requiredConsents.every(key => consent[key as keyof ConsentData]);
  }

  updateConsent(userId: string, consent: Partial<ConsentData>): void {
    this.securityManager.logAuditEntry({
      userId,
      action: 'CONSENT_UPDATE',
      resource: 'user',
      resourceId: userId,
      ipAddress: 'system',
      userAgent: 'Consent Management',
      success: true,
      details: consent
    });
  }
}

// Export singleton instances
export const securityManager = new SecurityManager();
export const privacyManager = new PrivacyManager(securityManager);