import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '../types/auth';
import { authApi, clearTokens, getAccessToken, getStoredUser, updateStoredUser } from '../services/api';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  updateUser: (updated: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Hydrate from localStorage on mount
  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authResponse = await authApi.login({ email, password });
    setUser(authResponse.user);
    navigate('/');
  }, [navigate]);

  const register = useCallback(async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    const authResponse = await authApi.register({ email, password, firstName, lastName });
    setUser(authResponse.user);
    navigate('/');
  }, [navigate]);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const updateUser = useCallback((updated: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updated };
      updateStoredUser(next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
