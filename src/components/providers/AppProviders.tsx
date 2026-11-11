'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LoanProvider } from '@/context/LoanContext';
import { PodcastPlayerProvider } from '@/context/PodcastPlayerContext';
import AiChatWidget from '@/components/chatbot/AiChatWidget';
import SurveyMascotWidget from '@/components/survey/SurveyMascotWidget';
import GlobalPodcastPlayer from '@/components/podcast/GlobalPodcastPlayer';
import BottomNav from '@/components/layout/BottomNav';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LoanProvider>
        <PodcastPlayerProvider>
          {children}
          <AiChatWidget />
          <SurveyMascotWidget />
          <GlobalPodcastPlayer />
          <BottomNav />
        </PodcastPlayerProvider>
      </LoanProvider>
    </AuthProvider>
  );
}
