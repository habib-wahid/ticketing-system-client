import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import App from '../../App';
import * as api from '../../services/api';
import type { AuthResponse } from '../../types/auth';

const mockAuthResponse: AuthResponse = {
  accessToken: 'test-token',
  refreshToken: 'test-refresh',
  tokenType: 'Bearer',
  expiresInSeconds: 3600,
  user: {
    userId: 'usr_test',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'CUSTOMER',
  },
};

function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Ticketing App Routing', () => {
  beforeEach(() => api.clearTokens());
  afterEach(() => api.clearTokens());

  it('renders the login page on /login route', async () => {
    renderApp('/login');
    expect(await screen.findByText('WELCOME BACK')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@orchida-soft.com')).toBeInTheDocument();
  });

  it('renders the register page on /register route', async () => {
    renderApp('/register');
    expect(await screen.findByText('CREATE ACCOUNT')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
  });

  it('redirects unauthenticated user from / to /login', async () => {
    renderApp('/');
    // Should land on login page
    expect(await screen.findByText('WELCOME BACK')).toBeInTheDocument();
  });

  it('renders home page when authenticated', async () => {
    api.storeTokens(mockAuthResponse);
    // Mock fetch for the tickets API call that Home makes
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        data: { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10, last: true, first: true },
      }), { status: 200 })
    ));

    renderApp('/');
    // With auth, the home page renders (TicketList renders even when empty)
    expect(await screen.findByText('Pending')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
