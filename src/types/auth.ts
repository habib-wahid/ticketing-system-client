export type UserRole = 'CUSTOMER' | 'AGENT' | 'ADMIN';

export interface AuthUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
