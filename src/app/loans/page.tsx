'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoansPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F0F8FD]/50 flex flex-col items-center justify-center p-4">
      <Loader2 className="w-8 h-8 text-[#079FE8] animate-spin mb-3" />
      <p className="text-sm font-semibold text-[#073B65]">กำลังไปยังหน้าผู้ใช้งาน (ชั้นหนังสือส่วนบุคคล)...</p>
    </div>
  );
}
