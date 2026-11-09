'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Headphones, 
  Video, 
  BookText, 
  Award, 
  User,
  Gift
} from 'lucide-react';
import { useLoan } from '@/context/LoanContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { activeLoanCount } = useLoan();

  const navItems = [
    {
      label: 'หน้าแรก',
      href: '/',
      icon: Home,
      color: 'text-sky-600',
      activeColor: 'text-sky-700',
      pillColor: 'bg-sky-600',
      exact: true,
    },
    {
      label: 'ห้องสมุด',
      href: '/books',
      icon: BookOpen,
      color: 'text-sky-600',
      activeColor: 'text-sky-700',
      pillColor: 'bg-sky-600',
    },
    {
      label: 'เสียง & Podcast',
      href: '/audios',
      icon: Headphones,
      color: 'text-purple-600',
      activeColor: 'text-purple-700',
      pillColor: 'bg-purple-600',
    },
    {
      label: 'วิดีโอเทศนา',
      href: '/videos',
      icon: Video,
      color: 'text-rose-600',
      activeColor: 'text-rose-700',
      pillColor: 'bg-rose-600',
    },
    {
      label: 'บทความ',
      href: '/articles',
      icon: BookText,
      color: 'text-emerald-600',
      activeColor: 'text-emerald-700',
      pillColor: 'bg-emerald-600',
    },
    {
      label: 'แบบทดสอบ',
      href: '/quiz',
      icon: Award,
      color: 'text-sky-700',
      activeColor: 'text-sky-800',
      pillColor: 'bg-sky-600',
      badge: 'XP',
    },
    {
      label: 'ร้านรางวัล',
      href: '/rewards',
      icon: Gift,
      color: 'text-sky-600',
      activeColor: 'text-sky-700',
      pillColor: 'bg-sky-600',
      badge: 'Shop',
    },
    {
      label: 'ยืม-คืน',
      href: '/dashboard',
      icon: User,
      color: 'text-blue-600',
      activeColor: 'text-blue-700',
      pillColor: 'bg-blue-600',
      count: activeLoanCount,
    },
  ];

  const isItemActive = (href: string, exact?: boolean) => {
    if (exact || href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav 
      aria-label="เมนูหลักแถบล่าง (Mobile Navigation Bar)"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-6px_25px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-2xl mx-auto px-1 sm:px-4">
        <div className="flex items-center justify-around h-16 sm:h-[68px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 px-0.5 transition-all group select-none ${
                  active ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {/* Active Indicator Top Pill */}
                {active && (
                  <span className={`absolute top-0 w-8 sm:w-10 h-1 ${item.pillColor} rounded-b-full shadow-xs animate-in fade-in duration-200`}></span>
                )}

                {/* Icon Container with Badge */}
                <div className="relative mb-0.5">
                  <div
                    className={`p-1 rounded-xl transition-transform duration-200 ${
                      active ? 'scale-110' : 'group-hover:scale-105 opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    <Icon size={21} className={item.color} />
                  </div>

                  {/* Loan Count Badge */}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1 -right-2 bg-sky-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                      {item.count}
                    </span>
                  )}

                  {/* XP Badge */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[8px] font-bold px-1 py-0.2 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Text Label */}
                <span
                  className={`text-[10px] sm:text-[11px] leading-tight text-center truncate max-w-full tracking-tight ${
                    active ? 'font-bold text-gray-900' : 'font-medium text-gray-600'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
