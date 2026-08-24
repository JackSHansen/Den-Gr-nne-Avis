import { STORAGE_KEYS } from "./config";
import { AuthResponse, AuthUser } from "./types";

const isBrowser = typeof window !== "undefined";

export const tokenStorage = {
  getAccessToken(): string | null {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  },

  setAccessToken(token: string): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } catch (e) {
      console.error("Failed to save access token in localStorage", e);
    }
  },

  removeAccessToken(): void {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (e) {
      console.error("Failed to remove access token from localStorage", e);
    }
  },

  getRefreshToken(): string | null {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  },

  setRefreshToken(token: string): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (e) {
      console.error("Failed to save refresh token in localStorage", e);
    }
  },

  removeRefreshToken(): void {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (e) {
      console.error("Failed to remove refresh token from localStorage", e);
    }
  },

  getUser(): AuthUser | null {
    if (!isBrowser) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser(user: AuthUser): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save user in localStorage", e);
    }
  },

  removeUser(): void {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } catch (e) {
      console.error("Failed to remove user from localStorage", e);
    }
  },

  setAuth(data: AuthResponse): void {
    if (!isBrowser) return;
    this.setAccessToken(data.accessToken);
    this.setRefreshToken(data.refreshToken);
    this.setUser(data.user);
  },

  clearAuth(): void {
    if (!isBrowser) return;
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
  },
};
