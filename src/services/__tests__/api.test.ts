import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, authApi, storeTokens, clearTokens, getAccessToken, getRefreshToken } from '../../services/api';
import type { AuthResponse } from '../../types/auth';

const mockAuthResponse: AuthResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  tokenType: 'Bearer',
  expiresInSeconds: 3600,
  user: {
    userId: 'usr_123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'CUSTOMER',
  },
};

describe('Token helpers', () => {
  beforeEach(() => clearTokens());
  afterEach(() => clearTokens());

  it('stores and retrieves tokens', () => {
    storeTokens(mockAuthResponse);
    expect(getAccessToken()).toBe('mock-access-token');
    expect(getRefreshToken()).toBe('mock-refresh-token');
  });

  it('clearTokens removes all stored data', () => {
    storeTokens(mockAuthResponse);
    clearTokens();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});

describe('apiClient', () => {
  beforeEach(() => {
    clearTokens();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearTokens();
  });

  it('attaches Authorization header when token is present', async () => {
    storeTokens(mockAuthResponse);
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: 'ok' }), { status: 200 })
    );

    await apiClient('/api/test');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-access-token',
        }),
      })
    );
  });

  it('does not attach Authorization header when no token', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: 'ok' }), { status: 200 })
    );

    await apiClient('/api/test');

    const callHeaders = mockFetch.mock.calls[0][1]?.headers as Record<string, string>;
    expect(callHeaders?.Authorization).toBeUndefined();
  });

  it('retries with new token on 401 and successful refresh', async () => {
    storeTokens(mockAuthResponse);
    const mockFetch = vi.mocked(fetch);

    // First call → 401
    mockFetch.mockResolvedValueOnce(new Response('', { status: 401 }));
    // Refresh call → success
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { ...mockAuthResponse, accessToken: 'new-access-token' } }), { status: 200 })
    );
    // Retry call → success
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );

    const result = await apiClient('/api/protected');
    expect(result).toEqual({ success: true });
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('clears tokens and throws on failed refresh after 401', async () => {
    storeTokens(mockAuthResponse);
    const mockFetch = vi.mocked(fetch);

    // Original call → 401
    mockFetch.mockResolvedValueOnce(new Response('', { status: 401 }));
    // Refresh → also fails
    mockFetch.mockResolvedValueOnce(new Response('', { status: 401 }));

    // Suppress jsdom navigation error
    vi.stubGlobal('location', { href: '' });

    await expect(apiClient('/api/protected')).rejects.toThrow();
    expect(getAccessToken()).toBeNull();
  });

  it('throws on non-ok response with error message from body', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 400 })
    );

    await expect(apiClient('/api/auth/login', { method: 'POST' })).rejects.toThrow('Invalid credentials');
  });
});

describe('authApi', () => {
  beforeEach(() => {
    clearTokens();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearTokens();
  });

  it('authApi.login stores tokens and returns user', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockAuthResponse }), { status: 200 })
    );

    const result = await authApi.login({ email: 'test@example.com', password: 'password123' });

    expect(result.user.email).toBe('test@example.com');
    expect(getAccessToken()).toBe('mock-access-token');
  });

  it('authApi.register stores tokens and returns user', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: mockAuthResponse }), { status: 200 })
    );

    const result = await authApi.register({
      email: 'new@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    });

    expect(result.user.firstName).toBe('Test');
    expect(getAccessToken()).toBe('mock-access-token');
  });
});
