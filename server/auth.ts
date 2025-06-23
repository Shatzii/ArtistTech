import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { insertUserSchema, loginUserSchema, type User } from "../shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "prostudio-dev-secret-2025";
const SALT_ROUNDS = 12;

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    userType: 'admin' | 'teacher' | 'student';
    name: string;
  };
}

export const generateToken = (user: User) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      userType: user.userType,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = verifyToken(token) as any;
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Fetch current user data from database
    const user = await storage.getUser(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      userType: user.userType as 'admin' | 'teacher' | 'student',
      name: user.name
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
  userType: 'admin' | 'teacher' | 'student';
}) => {
  // Validate input
  const validatedData = insertUserSchema.parse(userData);
  
  // Check if user already exists
  const existingUser = await storage.getUserByEmail(validatedData.email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const passwordHash = await hashPassword(validatedData.password);

  // Create user
  const newUser = await storage.createUser({
    email: validatedData.email,
    passwordHash,
    name: validatedData.name,
    userType: validatedData.userType,
    isActive: true,
    emailVerified: true, // Auto-verify for demo
    subscriptionTier: validatedData.userType === 'admin' ? 'enterprise' : 'free',
    subscriptionStatus: 'active'
  });

  // Create corresponding teacher/student record if needed
  if (validatedData.userType === 'teacher') {
    await storage.createTeacher({
      userId: newUser.id,
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      specialization: 'general'
    });
  } else if (validatedData.userType === 'student') {
    await storage.createStudent({
      userId: newUser.id,
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      level: 'beginner'
    });
  }

  // Generate token
  const token = generateToken(newUser);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      userType: newUser.userType,
      subscriptionTier: newUser.subscriptionTier
    },
    token
  };
};

export const loginUser = async (email: string, password: string) => {
  // Validate input
  const validatedData = loginUserSchema.parse({ email, password });

  // Find user
  const user = await storage.getUserByEmail(validatedData.email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isValidPassword = await verifyPassword(validatedData.password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      subscriptionTier: user.subscriptionTier
    },
    token
  };
};

// Demo accounts seeder
export const seedDemoAccounts = async () => {
  try {
    // Check if demo accounts already exist
    const adminExists = await storage.getUserByEmail("admin@prostudio.ai");
    const teacherExists = await storage.getUserByEmail("teacher@prostudio.ai");

    if (!adminExists) {
      await registerUser({
        email: "admin@prostudio.ai",
        password: "ProStudio2025!",
        name: "Admin User",
        userType: "admin"
      });
      console.log("✓ Demo admin account created");
    }

    if (!teacherExists) {
      await registerUser({
        email: "teacher@prostudio.ai", 
        password: "Teacher2025!",
        name: "Sarah Johnson",
        userType: "teacher"
      });
      console.log("✓ Demo teacher account created");
    }

    // Create demo student
    const studentExists = await storage.getUserByEmail("student@prostudio.ai");
    if (!studentExists) {
      await registerUser({
        email: "student@prostudio.ai",
        password: "Student2025!",
        name: "Emma Wilson",
        userType: "student"
      });
      console.log("✓ Demo student account created");
    }

  } catch (error) {
    console.log("Demo accounts already exist or error occurred:", error.message);
  }
};