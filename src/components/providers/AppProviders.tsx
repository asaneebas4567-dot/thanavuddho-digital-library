'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LoanProvider } from '@/context/LoanContext';
import { PodcastPlayerProvider } from '@/context/PodcastPlayerContext';
import SurveyMascotWidget from '@/components/survey/SurveyMascotWidget';
import GlobalPodcastPlayer from '@/components/podcast/GlobalPodcastPlayer';
import BottomNav from '@/components/layout/BottomNav';
import FlyingCoinAnimation from '@/components/common/FlyingCoinAnimation';
import GlobalDailyLoginModal from '@/components/gamification/GlobalDailyLoginModal';
import WelcomeModalPopup from '@/components/home/WelcomeModalPopup';
import NewMemberWelcomeModal from '@/components/auth/NewMemberWelcomeModal';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LoanProvider>
        <PodcastPlayerProvider>
          {children}
          <SurveyMascotWidget />
          <GlobalPodcastPlayer />
          <BottomNav />
          <FlyingCoinAnimation />
          <GlobalDailyLoginModal />
          <WelcomeModalPopup />
          <NewMemberWelcomeModal />
        </PodcastPlayerProvider>
      </LoanProvider>
    </AuthProvider>
  );
}
