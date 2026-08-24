import { apiClient } from "../apiClient";
import { ENDPOINTS } from "../config";
import { tokenStorage } from "../storage";
import {
  AuthResponse,
  LoginCredentials,
  RefreshTokenResponse,
  VerifyResponse,
} from "../types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    tokenStorage.setAuth(data);
    return data;
  },

  async refresh(providedRefreshToken?: string): Promise<RefreshTokenResponse> {
    const refreshToken = providedRefreshToken || tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const data = await apiClient.post<RefreshTokenResponse>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
      { token: null },
    );

    if (data.accessToken) {
      tokenStorage.setAccessToken(data.accessToken);
    }
    return data;
  },

  async verify(token?: string): Promise<VerifyResponse> {
    return apiClient.get<VerifyResponse>(ENDPOINTS.AUTH.VERIFY, { token });
  },

  logout(): void {
    tokenStorage.clearAuth();
  },
};
