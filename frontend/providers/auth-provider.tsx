"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User, LoginCredentials, RegisterData, AuthTokens } from "@/types";
import { apiClient } from "@/lib/api-client";
import { STORAGE_KEYS } from "@/lib/constants";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get<{ data: User }>("/auth/me");
      setUser(response.data);
    } catch {
      apiClient.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post<{ data: AuthTokens & { user: User } }>(
      "/auth/login",
      credentials,
    );
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
    localStorage.setItem(
      STORAGE_KEYS.REFRESH_TOKEN,
      response.data.refreshToken,
    );
    setUser(response.data.user);
  };

  const register = async (data: RegisterData) => {
    const response = await apiClient.post<{ data: AuthTokens & { user: User } }>(
      "/auth/register",
      data,
    );
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
    localStorage.setItem(
      STORAGE_KEYS.REFRESH_TOKEN,
      response.data.refreshToken,
    );
    setUser(response.data.user);
  };

  const logout = () => {
    apiClient.clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
