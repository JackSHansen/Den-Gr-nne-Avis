"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authService } from "../lib/services/authService";
import { tokenStorage } from "../lib/storage";
import { AuthResponse, AuthUser, LoginCredentials } from "../lib/types";

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  refreshAuthToken: () => Promise<string | null>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const storedToken = tokenStorage.getAccessToken();
      const storedRefreshToken = tokenStorage.getRefreshToken();
      const storedUser = tokenStorage.getUser();

      if (storedToken) {
        setToken(storedToken);
        setRefreshTokenState(storedRefreshToken);
        setUser(storedUser);

        try {
          await authService.verify(storedToken);
        } catch {
          if (storedRefreshToken) {
            try {
              const refreshRes = await authService.refresh(storedRefreshToken);
              if (isMounted && refreshRes.accessToken) {
                setToken(refreshRes.accessToken);
              }
            } catch {
              if (isMounted) {
                tokenStorage.clearAuth();
                setToken(null);
                setRefreshTokenState(null);
                setUser(null);
              }
            }
          } else {
            if (isMounted) {
              tokenStorage.clearAuth();
              setToken(null);
              setRefreshTokenState(null);
              setUser(null);
            }
          }
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.login(credentials);
        setUser(response.user);
        setToken(response.accessToken);
        setRefreshTokenState(response.refreshToken);
        return response;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Der opstod en fejl under login";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    setRefreshTokenState(null);
    setError(null);
  }, []);

  const verifyToken = useCallback(async (): Promise<boolean> => {
    try {
      const currentToken = token || tokenStorage.getAccessToken();
      if (!currentToken) return false;
      await authService.verify(currentToken);
      return true;
    } catch {
      return false;
    }
  }, [token]);

  const refreshAuthToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await authService.refresh();
      if (res.accessToken) {
        setToken(res.accessToken);
        return res.accessToken;
      }
      return null;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isAuthenticated = Boolean(token && user);

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    verifyToken,
    refreshAuthToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
