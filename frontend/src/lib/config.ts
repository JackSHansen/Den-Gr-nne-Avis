export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    VERIFY: "/auth/verify",
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id: number | string) => `/users/${id}`,
  },
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id: number | string) => `/categories/${id}`,
  },
  PRODUCTS: {
    BASE: "/products",
    BY_SLUG: (slug: string) => `/products/${encodeURIComponent(slug)}`,
    BY_CATEGORY: (slug: string) =>
      `/products/category/${encodeURIComponent(slug)}`,
    BY_ID: (id: number | string) => `/products/${id}`,
  },
  COMMENTS: {
    BASE: "/comments",
    BY_PRODUCT_ID: (productId: number | string) => `/comments/${productId}`,
    BY_ID: (id: number | string) => `/comments/${id}`,
  },
  NEWSLETTERS: {
    BASE: "/newsletters",
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "green_news_access_token",
  REFRESH_TOKEN: "green_news_refresh_token",
  AUTH_USER: "green_news_auth_user",
} as const;
