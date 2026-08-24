import { apiClient } from "../apiClient";
import { ENDPOINTS } from "../config";
import { Category } from "../types";

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return apiClient.get<Category[]>(ENDPOINTS.CATEGORIES.BASE);
  },

  async getById(id: number | string): Promise<Category> {
    return apiClient.get<Category>(ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};
