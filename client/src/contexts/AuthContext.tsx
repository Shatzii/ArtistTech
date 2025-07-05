import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // For demo purposes, use demo credentials
      const demoUser = {
        id: '1',
        email: 'user@artisttech.com',
        username: 'demo_user',
        role: 'user' as const,
        isAuthenticated: true
      };
      
      setUser(demoUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Demo authentication
      if ((email === 'user@artisttech.com' && password === 'demo123') || 
          (email === 'admin@artisttech.com' && password === 'admin2024!')) {
        
        const userData = {
          id: email === 'admin@artisttech.com' ? '2' : '1',
          email,
          username: email === 'admin@artisttech.com' ? 'admin' : 'demo_user',
          role: email === 'admin@artisttech.com' ? 'admin' as const : 'user' as const,
          isAuthenticated: true
        };
        
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user?.isAuthenticated,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}