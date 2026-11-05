'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoanRecord, MediaType } from '@/types';
import { initialLoans } from '@/data/multimediaAndGamificationData';
import { useAuth } from './AuthContext';

interface LoanContextType {
  loans: LoanRecord[];
  borrowMedia: (item: { id: string; title: string; type: MediaType; cover: string }) => { success: boolean; message: string };
  returnMedia: (loanId: string) => void;
  renewMedia: (loanId: string) => { success: boolean; message: string };
  isMediaBorrowed: (mediaId: string) => boolean;
  activeLoanCount: number;
  maxLoans: number;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export function LoanProvider({ children }: { children: React.ReactNode }) {
  const { user, syncUserLoans } = useAuth();
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const maxLoans = 3;

  // Load from user session or localStorage on mount/user change
  useEffect(() => {
    if (user) {
      if (Array.isArray(user.loans)) {
        setLoans(user.loans);
      } else {
        setLoans([]);
      }
    } else {
      try {
        const saved = localStorage.getItem('thanavuddho_loans');
        if (saved) {
          setLoans(JSON.parse(saved));
        } else {
          setLoans([]);
        }
      } catch {
        setLoans([]);
      }
    }
  }, [user?.email]);

  // Save to localStorage & sync with server if logged in
  const saveLoans = (newLoans: LoanRecord[]) => {
    setLoans(newLoans);
    try {
      localStorage.setItem('thanavuddho_loans', JSON.stringify(newLoans));
    } catch {}

    if (user) {
      syncUserLoans(newLoans).catch(() => {});
    }
  };

  const activeLoans = loans.filter(l => l.status === 'active');

  const isMediaBorrowed = (mediaId: string) => {
    return activeLoans.some(l => l.media_id === mediaId);
  };

  const borrowMedia = (item: { id: string; title: string; type: MediaType; cover: string }) => {
    if (activeLoans.length >= maxLoans) {
      return { 
        success: false, 
        message: `คุณยืมสื่อครบโควตาสูงสุดแล้ว (${maxLoans} รายการ) กรุณาคืนสื่อที่ยืมอยู่ก่อน` 
      };
    }

    if (isMediaBorrowed(item.id)) {
      return { 
        success: false, 
        message: 'คุณได้ยืมสื่อชิ้นนี้ไว้แล้ว สามารถเปิดอ่าน/ฟังได้ทันที' 
      };
    }

    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

    const newLoan: LoanRecord = {
      id: `loan-${Date.now()}`,
      user_id: user ? user.id : 'guest',
      media_id: item.id,
      media_type: item.type,
      media_title: item.title,
      media_cover: item.cover,
      borrowed_at: now.toISOString(),
      due_date: dueDate.toISOString(),
      returned_at: null,
      renewal_count: 0,
      status: 'active'
    };

    saveLoans([newLoan, ...loans]);
    return { 
      success: true, 
      message: `ยืมสื่อสำเร็จ! กำหนดคืนภายในวันที่ ${dueDate.toLocaleDateString('th-TH')}` 
    };
  };

  const returnMedia = (loanId: string) => {
    const updated = loans.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          status: 'returned' as const,
          returned_at: new Date().toISOString()
        };
      }
      return l;
    });
    saveLoans(updated);
  };

  const renewMedia = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return { success: false, message: 'ไม่พบรายการยืม' };
    if (loan.renewal_count >= 1) {
      return { success: false, message: 'สามารถต่ออายุการยืมได้สูงสุด 1 ครั้งเท่านั้น' };
    }

    const currentDue = new Date(loan.due_date);
    currentDue.setDate(currentDue.getDate() + 7); // +7 days

    const updated = loans.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          due_date: currentDue.toISOString(),
          renewal_count: l.renewal_count + 1
        };
      }
      return l;
    });
    saveLoans(updated);
    return { success: true, message: `ต่ออายุการยืมสำเร็จ! กำหนดคืนใหม่คือ ${currentDue.toLocaleDateString('th-TH')}` };
  };

  return (
    <LoanContext.Provider value={{
      loans,
      borrowMedia,
      returnMedia,
      renewMedia,
      isMediaBorrowed,
      activeLoanCount: activeLoans.length,
      maxLoans
    }}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoan() {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
}
