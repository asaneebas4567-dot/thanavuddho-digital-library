'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserLearningState {
  isLoggedIn: boolean;
  userEmail: string;
  userName: string;
  userPicture: string;
  availablePoints: number;
  todayPoints: number;
  dailyLearningPoints: number; // 0..100 (daily casual learning cap)
  dailyLearningCap: number; // 100
  remainingDailyQuota: number; // 100 - dailyLearningPoints
  isDailyCapReached: boolean;
  chaptersReadToday: number;
  articlesReadToday: number;
  videoMinutesToday: number;
  audioMinutesToday: number;
  quizzesCompletedToday: number;
  recentTransactions: Array<{
    id: string;
    type: string;
    points: number;
    title: string;
    timestamp: string;
  }>;
}

export function useLearningPoints() {
  const [learningState, setLearningState] = useState<UserLearningState>({
    isLoggedIn: false,
    userEmail: '',
    userName: 'ผู้ศึกษาธรรม',
    userPicture: '',
    availablePoints: 0,
    todayPoints: 0,
    dailyLearningPoints: 0,
    dailyLearningCap: 100,
    remainingDailyQuota: 100,
    isDailyCapReached: false,
    chaptersReadToday: 0,
    articlesReadToday: 0,
    videoMinutesToday: 0,
    audioMinutesToday: 0,
    quizzesCompletedToday: 0,
    recentTransactions: []
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user & points from server or LocalStorage
  const refreshPoints = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      // 1. Get logged in user from localStorage
      let email = '';
      let name = 'ผู้ศึกษาธรรม';
      let picture = '';

      const savedUserStr = localStorage.getItem('thanavuddho_auth_user') || localStorage.getItem('dhamma_auth_user');
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          email = parsed.email || '';
          name = parsed.name || 'ผู้ศึกษาธรรม';
          picture = parsed.picture || '';
        } catch {}
      }

      // Default fallback email for guest if none logged in
      if (!email) {
        email = 'guest_reader@thanavuddho.library';
      }

      // 2. Fetch from server API
      const res = await fetch(`/api/points?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const videoMins = Math.floor((data.today?.videoSeconds || 0) / 60);
          const audioMins = Math.floor((data.today?.audioSeconds || 0) / 60);

          const dailyLearning = data.today?.dailyLearningPoints ?? 0;
          const dailyCap = data.today?.dailyLearningCap ?? 100;
          const remainingQuota = Math.max(0, dailyCap - dailyLearning);
          const isCapReached = dailyLearning >= dailyCap;

          setLearningState({
            isLoggedIn: Boolean(savedUserStr),
            userEmail: email,
            userName: data.user?.name || name,
            userPicture: data.user?.picture || picture,
            availablePoints: data.user?.points || 0,
            todayPoints: data.today?.pointsEarnedToday || 0,
            dailyLearningPoints: dailyLearning,
            dailyLearningCap: dailyCap,
            remainingDailyQuota: remainingQuota,
            isDailyCapReached: isCapReached,
            chaptersReadToday: data.today?.chaptersRead?.length || 0,
            articlesReadToday: data.today?.articlesRead?.length || 0,
            videoMinutesToday: videoMins,
            audioMinutesToday: audioMins,
            quizzesCompletedToday: data.today?.quizzesCompleted?.length || 0,
            recentTransactions: data.recentHistory || []
          });

          // Sync localStorage reward points
          localStorage.setItem('dhamma_reward_points', (data.user?.points || 0).toString());
        }
      } else {
        // Fallback local storage
        const localPoints = parseInt(localStorage.getItem('dhamma_reward_points') || '0', 10);
        setLearningState(prev => ({
          ...prev,
          availablePoints: localPoints
        }));
      }
    } catch (err) {
      console.error('Failed to fetch learning points:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPoints();

    // Listen to global point update events
    const handlePointsUpdated = () => {
      refreshPoints();
    };

    window.addEventListener('dhamma_points_updated', handlePointsUpdated);
    window.addEventListener('storage', handlePointsUpdated);

    return () => {
      window.removeEventListener('dhamma_points_updated', handlePointsUpdated);
      window.removeEventListener('storage', handlePointsUpdated);
    };
  }, [refreshPoints]);

  // Earn points action
  const recordEarn = useCallback(async (params: {
    type: 
      | 'read_chapter' 
      | 'read_book_finish' 
      | 'read_article' 
      | 'watch_video' 
      | 'listen_podcast' 
      | 'quiz_chapter' 
      | 'quiz_book_finish';
    sourceId?: string;
    chapterIndex?: number;
    chapterTitle?: string;
    chapterPageCount?: number;
    durationSeconds?: number;
  }) => {
    if (typeof window === 'undefined') return null;

    let email = learningState.userEmail;
    if (!email) {
      const savedUserStr = localStorage.getItem('thanavuddho_auth_user') || localStorage.getItem('dhamma_auth_user');
      if (savedUserStr) {
        try {
          email = JSON.parse(savedUserStr).email;
        } catch {}
      }
    }
    if (!email) email = 'guest_reader@thanavuddho.library';

    try {
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ...params
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.pointsEarned > 0) {
          window.dispatchEvent(new Event('dhamma_points_updated'));
        }
        return result;
      }
    } catch (err) {
      console.error('Error reporting earn points:', err);
    }
    return null;
  }, [learningState.userEmail]);

  return {
    ...learningState,
    isLoading,
    refreshPoints,
    recordEarn
  };
}

