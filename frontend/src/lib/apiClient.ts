import { API_BASE_URL } from "./config";
import { tokenStorage } from "./storage";
import { ApiErrorResponse, RequestOptions } from "./types";

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data?: ApiErrorResponse | unknown;

  constructor(
    message: string,
    status: number,
    statusText: string,
    data?: ApiErrorResponse | unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  const isAbsolute =
    endpoint.startsWith("http://") || endpoint.startsWith("https://");
  const normalizedBase = API_BASE_URL.replace(/\/+$/, "");
  const normalizedPath = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  let urlString = isAbsolute ? endpoint : `${normalizedBase}${normalizedPath}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      urlString += (urlString.includes("?") ? "&" : "?") + queryString;
    }
  }

  return urlString;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, token, params, headers = {}, ...restOptions } = options;

  const url = buildUrl(endpoint, params);

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  const effectiveToken =
    token !== undefined ? token : tokenStorage.getAccessToken();
  if (effectiveToken && !requestHeaders["Authorization"]) {
    requestHeaders["Authorization"] = `Bearer ${effectiveToken}`;
  }

  let requestBody: BodyInit | undefined;
  if (body !== undefined && body !== null) {
    if (
      typeof body === "object" &&
      !(body instanceof FormData) &&
      !(body instanceof Blob)
    ) {
      if (!requestHeaders["Content-Type"]) {
        requestHeaders["Content-Type"] = "application/json";
      }
      requestBody = JSON.stringify(body);
    } else {
      requestBody = body as BodyInit;
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
    body: requestBody,
  });

  if (response.status === 204) {
    return {} as T;
  }

  let data: unknown;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;

    if (data && typeof data === "object") {
      if ("message" in data && typeof data.message === "string") {
        errorMessage = data.message;
      } else if ("error" in data && typeof data.error === "string") {
        errorMessage = data.error;
      }
    } else if (typeof data === "string" && data.trim().length > 0) {
      errorMessage = data;
    }

    throw new ApiError(
      errorMessage,
      response.status,
      response.statusText,
      data,
    );
  }

  return data as T;
}

export const apiClient = {
  request,

  get<T>(endpoint: string, options?: Omit<RequestOptions, "body">): Promise<T> {
    return request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body">,
  ): Promise<T> {
    return request<T>(endpoint, { ...options, method: "POST", body });
  },

  put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body">,
  ): Promise<T> {
    return request<T>(endpoint, { ...options, method: "PUT", body });
  },

  delete<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body">,
  ): Promise<T> {
    return request<T>(endpoint, { ...options, method: "DELETE", body });
  },
};
