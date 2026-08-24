import { apiClient } from "../apiClient";
import { ENDPOINTS } from "../config";
import {
  Comment,
  CommentWithUser,
  CreateCommentInput,
  MessageResponse,
} from "../types";

export const commentService = {
  async getByProductId(
    productId: number | string,
  ): Promise<CommentWithUser[]> {
    return apiClient.get<CommentWithUser[]>(
      ENDPOINTS.COMMENTS.BY_PRODUCT_ID(productId),
    );
  },

  async create(data: CreateCommentInput, token?: string): Promise<Comment> {
    return apiClient.post<Comment>(ENDPOINTS.COMMENTS.BASE, data, { token });
  },

  async delete(
    id: number | string,
    token?: string,
  ): Promise<MessageResponse> {
    return apiClient.delete<MessageResponse>(
      ENDPOINTS.COMMENTS.BY_ID(id),
      undefined,
      { token },
    );
  },
};
