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
      const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token');
      
      // Always provide user data (anonymous if no token)
      const response = await fetch('/api/auth/user', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id || 'anonymous',
          email: userData.email || 'anonymous@artisttech.com',
          username: userData.username || userData.email?.split('@')[0] || 'anonymous',
          role: userData.role || 'user',
          isAuthenticated: userData.id !== 'anonymous'
        });
      } else {
        // Set anonymous user if request fails
        setUser({
          id: 'anonymous',
          email: 'anonymous@artisttech.com',
          username: 'anonymous',
          role: 'user',
          isAuthenticated: false
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Set anonymous user on error
      setUser({
        id: 'anonymous',
        email: 'anonymous@artisttech.com',
        username: 'anonymous',
        role: 'user',
        isAuthenticated: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('auth_token', data.token); // Also store with the key used by queryClient
        setUser({
          ...data.user,
          isAuthenticated: true
        });
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
    localStorage.removeItem('auth_token');
    // Set anonymous user instead of null
    setUser({
      id: 'anonymous',
      email: 'anonymous@artisttech.com',
      username: 'anonymous',
      role: 'user',
      isAuthenticated: false
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: user?.isAuthenticated || false,
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