export interface User {
  id: number;
  firstname: string;
  lastname: string;
  address: string;
  zipcode: number;
  city: string;
  email: string;
  password?: string;
  hasNewsletter: boolean;
  hasNotification: boolean;
  refreshToken?: string;
  isActive: boolean;
}

export interface UserSummary {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface UserDetail {
  id: number;
  firstname: string;
  lastname: string;
  address: string;
  zipcode: number;
  city: string;
  email: string;
  hasNewsletter: boolean;
  hasNotification: boolean;
  isActive: boolean;
}

export interface CreateUserInput {
  firstname?: string;
  lastname?: string;
  address?: string;
  zipcode?: number;
  city?: string;
  email: string;
  password: string;
  hasNewsletter?: boolean;
  hasNotification?: boolean;
  refreshToken?: string;
  isActive?: boolean;
}

export interface UpdateUserInput {
  firstname?: string;
  lastname?: string;
  address?: string;
  zipcode?: number;
  city?: string;
  email?: string;
  password?: string;
  hasNewsletter?: boolean;
  hasNotification?: boolean;
  refreshToken?: string;
  isActive?: boolean | string | number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  created_at: string | Date;
  image: string;
  description: string;
  price: number | string;
  slug: string;
  categoryId: number;
  userId: number;
  category?: Category;
  user?: UserSummary;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  price: number | string;
}

export interface CreateProductInput {
  name: string;
  image: string;
  description: string;
  price: number;
  categoryId: number;
}

export interface UpdateProductInput {
  name?: string;
  image?: string;
  description?: string;
  price?: number;
  categoryId?: number;
}

export interface CommentUser {
  firstname: string;
  lastname: string;
  email: string;
}

export interface Comment {
  id: number;
  comment: string;
  userId: number;
  productId: number;
}

export interface CommentWithUser {
  id: number;
  comment: string;
  user: CommentUser;
}

export interface CreateCommentInput {
  comment: string;
  productId: number;
}

export interface Newsletter {
  id: number;
  email: string;
}

export interface CreateNewsletterInput {
  email: string;
}

export interface DeleteNewsletterInput {
  email: string;
}

export interface AuthUser {
  id: number;
  firstname: string;
  lastname: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface VerifyResponse {
  userId: number;
}

export interface MessageResponse {
  message: string;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  [key: string]: unknown;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
  params?: Record<string, string | number | boolean | undefined | null>;
}
