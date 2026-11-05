'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LoanProvider } from '@/context/LoanContext';
import AiChatWidget from '@/components/chatbot/AiChatWidget';
import BottomNav from '@/components/layout/BottomNav';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LoanProvider>
        {children}
        <AiChatWidget />
        <BottomNav />
      </LoanProvider>
    </AuthProvider>
  );
}
