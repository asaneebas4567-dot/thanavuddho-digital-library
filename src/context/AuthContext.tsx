'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '@/types/auth';
import { LoanRecord } from '@/types';

interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  ageRange?: string;
  password?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHumanVerified: boolean;
  setIsHumanVerified: (v: boolean) => void;
  loginWithGoogleCredential: (credential: string) => Promise<{ success: boolean; message: string }>;
  loginWithCredentials: (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
  registerMember: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUserPoints: (delta: number) => Promise<void>;
  syncUserLoans: (loans: LoanRecord[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'thanavuddho_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  // Load user session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: UserSession = JSON.parse(saved);
        setUser(parsed);

        // Fetch fresh data from server
        fetch(`/api/user/sync?email=${encodeURIComponent(parsed.email)}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      console.error('Failed to load user session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login with Email/Phone + Password
  const loginWithCredentials = async (identifier: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        return { success: true, message: data.message || 'เข้าสู่ระบบสำเร็จ' };
      } else {
        return { success: false, message: data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' };
    } finally {
      setIsLoading(false);
    }
  };

  // Register New Member
  const registerMember = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (resData.success && resData.user) {
        setUser(resData.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resData.user));
        return { success: true, message: resData.message || 'ลงทะเบียนสมาชิกสำเร็จ' };
      } else {
        return { success: false, message: resData.message || 'การลงทะเบียนล้มเหลว' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' };
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google verified token
  const loginWithGoogleCredential = async (credential: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/google/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        return { success: true, message: data.message || 'เข้าสู่ระบบสำเร็จ' };
      } else {
        return { success: false, message: data.message || 'การตรวจสอบบัญชีล้มเหลว' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsHumanVerified(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Update points
  const updateUserPoints = async (delta: number) => {
    if (!user) return;
    const newPoints = Math.max(0, user.points + delta);
    const updated = { ...user, points: newPoints };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    try {
      await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, loans: user.loans, pointsDelta: delta }),
      });
    } catch (e) {
      console.error('Failed to sync points to server:', e);
    }
  };

  // Sync loans
  const syncUserLoans = async (loans: LoanRecord[]) => {
    if (!user) return;
    const updated = { ...user, loans };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    try {
      await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, loans }),
      });
    } catch (e) {
      console.error('Failed to sync loans to server:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user && user.email),
        isLoading,
        isHumanVerified,
        setIsHumanVerified,
        loginWithGoogleCredential,
        loginWithCredentials,
        registerMember,
        logout,
        updateUserPoints,
        syncUserLoans,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
