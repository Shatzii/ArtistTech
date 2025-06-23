import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  email: string;
  name: string;
  userType: 'admin' | 'teacher' | 'student';
  subscriptionTier: string;
  subscriptionStatus: string;
  profileImageUrl?: string;
  emailVerified: boolean;
  createdAt: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  userType: 'admin' | 'teacher' | 'student';
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem("auth_token"), // Only run query if token exists
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      const result = await response.json();
      
      // Store token in localStorage
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
        // Set default authorization header
        (globalThis as any).authToken = result.token;
      }
      
      return result;
    },
    onSuccess: () => {
      // Refetch user data after successful login
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      const result = await response.json();
      
      // Store token in localStorage
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
        (globalThis as any).authToken = result.token;
      }
      
      return result;
    },
    onSuccess: () => {
      // Refetch user data after successful registration
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const logout = () => {
    localStorage.removeItem("auth_token");
    delete (globalThis as any).authToken;
    queryClient.clear();
    // Redirect to login page
    window.location.href = "/auth";
  };

  // Initialize auth token from localStorage on app start
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("auth_token");
    if (token && !(globalThis as any).authToken) {
      (globalThis as any).authToken = token;
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isAdmin: user?.userType === 'admin',
    isTeacher: user?.userType === 'teacher',
    isStudent: user?.userType === 'student',
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}