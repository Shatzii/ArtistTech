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
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("/api/auth/login", "POST", data);
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
        // Set default authorization header
        (globalThis as any).authToken = response.token;
      }
      
      return response;
    },
    onSuccess: () => {
      // Refetch user data after successful login
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest("/api/auth/register", "POST", data);
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
        (globalThis as any).authToken = response.token;
      }
      
      return response;
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