'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import DailyLoginStreakModal from './DailyLoginStreakModal';

/**
 * GlobalDailyLoginModal
 * Handles automated daily check-in popup, midnight rollover detection,
 * and global event listener ('open_daily_login_modal').
 */
export default function GlobalDailyLoginModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getLocalDateString = useCallback(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  const checkAndTriggerDailyModal = useCallback((forceOpen = false) => {
    if (typeof window === 'undefined') return;

    // Do not auto-popup inside full-screen reader pages
    if (!forceOpen && pathname && pathname.startsWith('/reader')) {
      return;
    }

    const today = getLocalDateString();
    const lastClaimDate = localStorage.getItem('dhamma_daily_login_last_date');
    const dismissedKey = `dhamma_daily_login_dismissed_${today}`;
    const wasDismissedThisSession = sessionStorage.getItem(dismissedKey);

    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // If user has not claimed today's login reward and has not dismissed it in this browser session
    if (lastClaimDate !== today && !wasDismissedThisSession) {
      // Gentle 1.2 second delay so the page loads smoothly before showing reward modal
      const delayTimer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(delayTimer);
    }
  }, [pathname, getLocalDateString]);

  // 1. Initial check on mount & route change
  useEffect(() => {
    const cleanup = checkAndTriggerDailyModal();
    return () => {
      if (cleanup) cleanup();
    };
  }, [checkAndTriggerDailyModal]);

  // 2. Midnight Rollover Listener (Triggers when the clock turns 00:00:00 into the new day)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scheduleMidnightCheck = () => {
      const now = new Date();
      // Calculate milliseconds until next midnight (00:00:01)
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
      const msUntilMidnight = nextMidnight.getTime() - now.getTime();

      timerRef.current = setTimeout(() => {
        // Midnight has arrived! Check and trigger daily login for the new day
        checkAndTriggerDailyModal(false);
        scheduleMidnightCheck();
      }, msUntilMidnight);
    };

    scheduleMidnightCheck();

    // 3. Tab Visibility Change (e.g. user leaves tab open overnight and returns in the morning)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndTriggerDailyModal(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 4. Global Event to open modal from anywhere (Navbar, Dashboard, Rewards)
    const handleOpenEvent = () => {
      setIsOpen(true);
    };
    window.addEventListener('open_daily_login_modal', handleOpenEvent);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('open_daily_login_modal', handleOpenEvent);
    };
  }, [checkAndTriggerDailyModal]);

  const handleClose = () => {
    setIsOpen(false);
    const today = getLocalDateString();
    sessionStorage.setItem(`dhamma_daily_login_dismissed_${today}`, 'true');
  };

  return (
    <DailyLoginStreakModal 
      isOpen={isOpen} 
      onClose={handleClose} 
    />
  );
}
