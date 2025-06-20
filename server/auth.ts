import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'prostudio-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    userType: 'teacher' | 'student' | 'admin';
    schoolId?: number;
  };
}

export const generateToken = (userId: number, email: string, userType: string) => {
  return jwt.sign(
    { userId, email, userType },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const registerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'teacher' | 'student';
  schoolName?: string;
  studentCount?: string;
}) => {
  const { email, password, firstName, lastName, userType, schoolName } = userData;

  // Check if user already exists
  const existingTeacher = await storage.getTeachers().then(teachers => 
    teachers.find(t => t.email === email)
  );
  const existingStudent = await storage.getStudents().then(students => 
    students.find(s => s.email === email)
  );

  if (existingTeacher || existingStudent) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(password);
  const name = `${firstName} ${lastName}`;

  if (userType === 'teacher') {
    const teacher = await storage.createTeacher({
      name,
      email,
      password: hashedPassword,
      subject: 'Music',
      schoolName: schoolName || '',
      phoneNumber: null,
      bio: null
    });

    return {
      user: teacher,
      token: generateToken(teacher.id, teacher.email, 'teacher')
    };
  } else {
    const student = await storage.createStudent({
      name,
      email,
      password: hashedPassword,
      gradeLevel: 'High School',
      parentEmail: null,
      phoneNumber: null,
      enrollmentDate: new Date()
    });

    return {
      user: student,
      token: generateToken(student.id, student.email, 'student')
    };
  }
};

export const loginUser = async (email: string, password: string) => {
  // Demo admin login
  if (email === 'admin@prostudio.ai' && password === 'ProStudio2025!') {
    return {
      user: {
        id: 1,
        email: email,
        name: 'ProStudio Admin',
        userType: 'admin' as const,
        profileImageUrl: null
      },
      token: generateToken(1, email, 'admin')
    };
  }

  // Demo teacher login
  if (email === 'teacher@prostudio.ai' && password === 'Teacher2025!') {
    return {
      user: {
        id: 2,
        email: email,
        name: 'Demo Teacher',
        userType: 'teacher' as const,
        profileImageUrl: null
      },
      token: generateToken(2, email, 'teacher')
    };
  }

  // Check teachers first
  const teachers = await storage.getTeachers();
  const teacher = teachers.find(t => t.email === email);
  
  if (teacher && teacher.password && await verifyPassword(password, teacher.password)) {
    return {
      user: teacher,
      token: generateToken(teacher.id, teacher.email, 'teacher')
    };
  }

  // Check students
  const students = await storage.getStudents();
  const student = students.find(s => s.email === email);
  
  if (student && student.password && await verifyPassword(password, student.password)) {
    return {
      user: student,
      token: generateToken(student.id, student.email, 'student')
    };
  }

  throw new Error('Invalid email or password');
};