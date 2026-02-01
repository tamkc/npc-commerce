"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User, AuthTokens } from "@/types";
import { adminApi } from "@/lib/admin/api-client";
import { STORAGE_KEYS } from "@/lib/constants";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        : null;
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await adminApi.get<{ data: User }>("/auth/me");
      setUser(response.data);
    } catch {
      adminApi.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const response = await adminApi.post<{
      data: AuthTokens & { user: User };
    }>("/auth/login", { email, password });
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
    localStorage.setItem(
      STORAGE_KEYS.REFRESH_TOKEN,
      response.data.refreshToken,
    );
    setUser(response.data.user);
  };

  const logout = () => {
    adminApi.clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
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
