import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'AccountHolder' | 'Operator' | 'Beneficiary';
  organizationId: string;
  tenantId: string;
  isActive: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthenticatedUser;
    accessToken: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  organizationId: string;
  tenantId: string;
  iat?: number;
  exp?: number;
}
