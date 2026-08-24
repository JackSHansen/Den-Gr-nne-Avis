import { apiClient } from "../apiClient";
import { ENDPOINTS } from "../config";
import {
  CreateProductInput,
  MessageResponse,
  Product,
  ProductSummary,
  UpdateProductInput,
} from "../types";

export const productService = {
  async getAll(): Promise<Product[]> {
    return apiClient.get<Product[]>(ENDPOINTS.PRODUCTS.BASE);
  },

  async getBySlug(slug: string): Promise<Product> {
    return apiClient.get<Product>(ENDPOINTS.PRODUCTS.BY_SLUG(slug));
  },

  async getByCategorySlug(categorySlug: string): Promise<ProductSummary[]> {
    return apiClient.get<ProductSummary[]>(
      ENDPOINTS.PRODUCTS.BY_CATEGORY(categorySlug),
    );
  },

  async create(data: CreateProductInput, token?: string): Promise<Product> {
    return apiClient.post<Product>(ENDPOINTS.PRODUCTS.BASE, data, { token });
  },

  async update(
    id: number | string,
    data: UpdateProductInput,
    token?: string,
  ): Promise<Product> {
    return apiClient.put<Product>(ENDPOINTS.PRODUCTS.BY_ID(id), data, {
      token,
    });
  },

  async delete(
    id: number | string,
    token?: string,
  ): Promise<MessageResponse> {
    return apiClient.delete<MessageResponse>(
      ENDPOINTS.PRODUCTS.BY_ID(id),
      undefined,
      { token },
    );
  },
};
