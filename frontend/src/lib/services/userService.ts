import { apiClient } from "../apiClient";
import { ENDPOINTS } from "../config";
import {
  CreateUserInput,
  MessageResponse,
  UpdateUserInput,
  User,
  UserDetail,
  UserSummary,
} from "../types";

export const userService = {
  async getAll(): Promise<UserSummary[]> {
    return apiClient.get<UserSummary[]>(ENDPOINTS.USERS.BASE);
  },

  async getById(id: number | string): Promise<UserDetail> {
    return apiClient.get<UserDetail>(ENDPOINTS.USERS.BY_ID(id));
  },

  async create(data: CreateUserInput): Promise<User> {
    return apiClient.post<User>(ENDPOINTS.USERS.BASE, data);
  },

  async update(id: number | string, data: UpdateUserInput): Promise<User> {
    return apiClient.put<User>(ENDPOINTS.USERS.BY_ID(id), data);
  },

  async delete(id: number | string): Promise<MessageResponse> {
    return apiClient.delete<MessageResponse>(ENDPOINTS.USERS.BY_ID(id));
  },
};
