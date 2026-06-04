import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../types/auth';

export const API_BASE_URL = 'http://localhost:8080';

/** Resolves a relative file path from the API (e.g. /api/files/...) to a full URL. */
export function resolveAttachmentUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

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

  const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
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

  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    // Let the browser set Content-Type (with boundary) for multipart requests
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

import type { PagedResponse, Ticket } from '../types/ticket';
import type {
  ComplaintCategoryResponse,
  ComplaintCategoryCreateRequest,
  ComplaintCategoryUpdateRequest,
} from '../types/category';

export const categoryApi = {
  async findAll(page: number = 0, size: number = 20, name?: string): Promise<PagedResponse<ComplaintCategoryResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (name) {
      params.append('name', name);
    }
    const json = await apiClient<any>(`/api/complaint-categories?${params.toString()}`);

    // Safely extract data in case structure is different
    const pagedData = json?.data || json;
    return {
      content: pagedData?.content || [],
      totalElements: pagedData?.totalElements || 0,
      totalPages: pagedData?.totalPages || 0,
      number: pagedData?.number || 0,
      size: pagedData?.size || 0,
      last: pagedData?.last || true,
      first: pagedData?.first || true,
    };
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

export const userApi = {
  async search(query: string): Promise<AuthUser[]> {
    const json = await apiClient<ApiResponse<AuthUser[]>>(`/api/users/search?name=${encodeURIComponent(query)}`);
    return json.data;
  },
};

export const ticketApi = {
  async delete(ticketId: string): Promise<void> {
    await apiClient<ApiResponse<void>>(`/api/tickets/${ticketId}`, {
      method: 'DELETE',
    });
  },

  async findMyTickets(params: {
    page?: number;
    size?: number;
    categoryId?: string;
    priority?: string;
    status?: string;
    createdBy?: string;
    assignedTo?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PagedResponse<Ticket>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const json = await apiClient<ApiResponse<PagedResponse<Ticket>>>(`/api/tickets/user?${searchParams.toString()}`);
    return json.data;
  },
};
