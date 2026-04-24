import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import type { AuthResponse } from '../../types/auth';

const mockAuthResponse: AuthResponse = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  tokenType: 'Bearer',
  expiresInSeconds: 3600,
  user: {
    userId: 'usr_abc',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'CUSTOMER',
  },
};

function AuthConsumer() {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <div data-testid="authenticated">{String(isAuthenticated)}</div>
      <div data-testid="user">{user ? user.email : 'none'}</div>
    </div>
  );
}

function LoginButton() {
  const { login } = useAuth();
  const [err, setErr] = React.useState('');
  return (
    <>
      <button onClick={() => login('john@example.com', 'password123').catch(e => setErr(e.message))}>
        Login
      </button>
      <div data-testid="error">{err}</div>
    </>
  );
}

function LogoutButton() {
  const { logout } = useAuth();
  return <button onClick={() => logout()}>Logout</button>;
}

function renderWithAuth(ui: React.ReactElement, initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    api.clearTokens();
    vi.clearAllMocks();
  });

  afterEach(() => {
    api.clearTokens();
  });

  it('starts unauthenticated when no token in localStorage', async () => {
    renderWithAuth(<AuthConsumer />);
    expect(await screen.findByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });

  it('restores user from localStorage on mount', async () => {
    api.storeTokens(mockAuthResponse);
    renderWithAuth(<AuthConsumer />);
    expect(await screen.findByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('john@example.com');
  });

  it('login sets authenticated user', async () => {
    vi.spyOn(api.authApi, 'login').mockResolvedValueOnce(mockAuthResponse);
    renderWithAuth(
      <>
        <AuthConsumer />
        <LoginButton />
      </>
    );

    await screen.findByTestId('authenticated');

    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    expect(await screen.findByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('john@example.com');
  });

  it('logout clears user and tokens', async () => {
    api.storeTokens(mockAuthResponse);
    renderWithAuth(
      <>
        <AuthConsumer />
        <LogoutButton />
      </>
    );

    expect(await screen.findByTestId('authenticated')).toHaveTextContent('true');

    await act(async () => {
      fireEvent.click(screen.getByText('Logout'));
    });

    expect(await screen.findByTestId('authenticated')).toHaveTextContent('false');
    expect(api.getAccessToken()).toBeNull();
  });

  it('login propagates errors from authApi', async () => {
    vi.spyOn(api.authApi, 'login').mockRejectedValueOnce(new Error('Invalid credentials'));

    renderWithAuth(
      <>
        <AuthConsumer />
        <LoginButton />
      </>
    );

    await screen.findByTestId('authenticated');

    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
    });
  });
});
