import { apiClient } from "../apiClient";
import { ENDPOINTS } from "../config";
import {
  CreateNewsletterInput,
  DeleteNewsletterInput,
  MessageResponse,
  Newsletter,
} from "../types";

export const newsletterService = {
  async getAll(): Promise<Newsletter[]> {
    return apiClient.get<Newsletter[]>(ENDPOINTS.NEWSLETTERS.BASE);
  },

  async subscribe(
    data: CreateNewsletterInput,
    token?: string,
  ): Promise<Newsletter> {
    return apiClient.post<Newsletter>(ENDPOINTS.NEWSLETTERS.BASE, data, {
      token,
    });
  },

  async unsubscribe(
    data: DeleteNewsletterInput,
    token?: string,
  ): Promise<MessageResponse> {
    return apiClient.delete<MessageResponse>(
      ENDPOINTS.NEWSLETTERS.BASE,
      data,
      { token },
    );
  },
};
