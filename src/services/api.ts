import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

const BASE_URL = 'http://localhost:8080';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'auth_user',
} as const;

// ── Token helpers ──────────────────────────────────────────────

export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function storeTokens(authResponse: AuthResponse): void {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authResponse.accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authResponse.refreshToken);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authResponse.user));
}

export function clearTokens(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ── Refresh logic (single in-flight promise to avoid races) ───

let refreshPromise: Promise<AuthResponse> | null = null;

async function refreshAccessToken(): Promise<AuthResponse> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error('Session expired');
  }

  const json = await res.json();
  const authResponse: AuthResponse = json.data;
  storeTokens(authResponse);
  return authResponse;
}

// ── Generic API client ────────────────────────────────────────

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If 401, attempt a single token refresh and retry
  if (response.status === 401 && token) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }
      const newAuth = await refreshPromise;
      refreshPromise = null;

      headers['Authorization'] = `Bearer ${newAuth.accessToken}`;
      response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch {
      refreshPromise = null;
      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json();
}

// ── Auth-specific API calls ───────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = {
  async login(request: LoginRequest): Promise<AuthResponse> {
    const json = await apiClient<ApiResponse<AuthResponse>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    storeTokens(json.data);
    return json.data;
  },

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const json = await apiClient<ApiResponse<AuthResponse>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    storeTokens(json.data);
    return json.data;
  },
};

// ── Category API calls ────────────────────────────────────────

import type {
  ComplaintCategoryResponse,
  ComplaintCategoryCreateRequest,
  ComplaintCategoryUpdateRequest,
} from '../types/category';

export const categoryApi = {
  async findAll(): Promise<ComplaintCategoryResponse[]> {
    const json = await apiClient<ApiResponse<ComplaintCategoryResponse[]>>('/api/complaint-categories');
    return json.data;
  },

  async findById(id: string): Promise<ComplaintCategoryResponse> {
    const json = await apiClient<ApiResponse<ComplaintCategoryResponse>>(`/api/complaint-categories/${id}`);
    return json.data;
  },

  async create(request: ComplaintCategoryCreateRequest): Promise<ComplaintCategoryResponse> {
    const json = await apiClient<ApiResponse<ComplaintCategoryResponse>>('/api/complaint-categories', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return json.data;
  },

  async update(id: string, request: ComplaintCategoryUpdateRequest): Promise<ComplaintCategoryResponse> {
    const json = await apiClient<ApiResponse<ComplaintCategoryResponse>>(`/api/complaint-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    return json.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient<ApiResponse<void>>(`/api/complaint-categories/${id}`, {
      method: 'DELETE',
    });
  },
};
