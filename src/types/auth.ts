import { LoanRecord } from '@/types';

export interface UserSession {
  id: string;
  memberCardId?: string;
  email: string;
  name: string;
  phone?: string;
  ageRange?: string;
  picture: string;
  email_verified: boolean;
  points: number;
  role?: 'admin' | 'member';
  loans: LoanRecord[];
  boundType?: 'email_and_phone' | 'email' | 'google';
  passwordHash?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface GoogleJwtPayload {
  iss?: string;
  sub: string;
  azp?: string;
  aud?: string;
  iat?: number;
  exp?: number;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}
