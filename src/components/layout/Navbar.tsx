'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  Bot, 
  Home,
  BookOpen,
  Sparkles,
  Headphones,
  Video,
  FileText,
  Trophy,
  Award,
  Gift,
  LogIn,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import { useLoan } from '@/context/LoanContext';
import { useLearningPoints } from '@/lib/useLearningPoints';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { activeLoanCount } = useLoan();
  const { availablePoints } = useLearningPoints();
  const { user, isAuthenticated, logout } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const navLinks = [
    { 
      label: 'หน้าแรก', 
      href: '/', 
      icon: Home,
      iconColor: 'text-amber-200 group-hover:text-amber-100',
      activeIconColor: 'text-amber-500'
    },
    { 
      label: 'หนังสือ', 
      href: '/books', 
      icon: BookOpen,
      iconColor: 'text-sky-200 group-hover:text-white',
      activeIconColor: 'text-sky-600'
    },
    { 
      label: 'Podcast', 
      href: '/audios', 
      icon: Headphones,
      iconColor: 'text-purple-200 group-hover:text-purple-100',
      activeIconColor: 'text-purple-600'
    },
    { 
      label: 'วิดีโอ', 
      href: '/videos', 
      icon: Video,
      iconColor: 'text-rose-200 group-hover:text-rose-100',
      activeIconColor: 'text-rose-600'
    },
    { 
      label: 'บทความ', 
      href: '/articles', 
      icon: FileText,
      iconColor: 'text-emerald-200 group-hover:text-emerald-100',
      activeIconColor: 'text-emerald-600'
    },
    { 
      label: 'แบบทดสอบ XP', 
      href: '/quiz', 
      icon: Trophy,
      iconColor: 'text-sky-100 group-hover:text-white',
      activeIconColor: 'text-sky-600'
    },
    { 
      label: 'ร้านรางวัล', 
      href: '/rewards', 
      icon: Gift,
      iconColor: 'text-sky-100 group-hover:text-white',
      activeIconColor: 'text-sky-600'
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#079FE8] via-[#068fd1] to-[#073B65] shadow-md transition-colors select-none text-white">
      
      {/* 1. Top Bar: Logo, Centered Search, and User Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2.5 pb-2.5 sm:pt-3 sm:pb-3">
        <div className="flex items-center justify-between gap-3 sm:gap-5">
          
          {/* Left: Brand Identity (Logo + Thanavuddho Library) */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white text-[#079FE8] rounded-xl flex items-center justify-center font-black text-lg sm:text-xl shadow-sm group-hover:scale-105 transition-transform border border-white/80">
              ถ
            </div>
            <div className="block">
              <span className="font-extrabold text-sm sm:text-base md:text-lg text-white tracking-tight block leading-tight">
                Thanavuddho <span className="text-sky-200 font-black">Library</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-white/90 font-medium block">
                พระครูปลัดสุวัฒนโพธิคุณ
              </span>
            </div>
          </Link>

          {/* Center: Search Bar (Clean White Pill with soft border) */}
          <div className="flex-1 max-w-xl mx-1 sm:mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="ค้นหาหนังสือ, บทความ, พอดแคสต์, วิดีโอ..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-white text-[#243447] placeholder-slate-400 pl-4 pr-10 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#079FE8] transition-all border border-[#DCEAF3]"
              />
              <button 
                type="submit"
                aria-label="ค้นหา"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#079FE8] hover:text-[#073B65] transition-colors cursor-pointer p-1"
              >
                <Search size={17} />
              </button>
            </form>
          </div>

          {/* Right: AI Quick Pill & User Shelf & Mobile Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">

            {/* Live Rewards Points Quick Pill (Gold Coin & Accent Gold Number) */}
            <Link 
              href="/rewards" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#073B65] bg-white hover:bg-[#FDF6E9] shadow-xs transition-all cursor-pointer border border-[#DCEAF3] active:scale-95"
              title="ร้านแลกของรางวัลธรรมะ (Thanavuddho Learning Points)"
            >
              <span className="text-sm">🪙</span>
              <span className="font-mono text-[#D9A441] font-extrabold" suppressHydrationWarning>
                {mounted ? availablePoints.toLocaleString() : '0'}
              </span>
              <span className="text-[10px] text-[#64748B]">P</span>
            </Link>

            {/* AI Assistant Quick Pill */}
            <Link 
              href="/chatbot" 
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#073B65] bg-white hover:bg-sky-50 hover:text-[#079FE8] transition-all shadow-xs cursor-pointer border border-[#DCEAF3] active:scale-95"
            >
              <Bot size={14} className="text-[#079FE8]" />
              <span>ถาม AI ธรรมะ</span>
            </Link>

            {/* Admin Management Quick Pill (for Admins only) */}
            {mounted && isAuthenticated && user && (user.role === 'admin' || user.email === 'asaneebas4567@gmail.com' || user.email === 'thanavuddho.dhamma@gmail.com') && (
              <Link 
                href="/admin/database" 
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 transition-all shadow-xs cursor-pointer border border-emerald-400/80 active:scale-95"
                title="ศูนย์จัดการฐานข้อมูล (สิทธิ์ระดับ Admin)"
              >
                <ShieldCheck size={14} className="text-emerald-200" />
                <span>แอดมิน (DB)</span>
              </Link>
            )}

            {/* User Profile or Login CTA */}
            {mounted && isAuthenticated && user ? (
              <Link 
                href="/dashboard" 
                className="relative flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 transition-all cursor-pointer text-xs font-bold active:scale-95"
                title={`เข้าสู่ระบบแล้ว: ${user.name} (คลิกดูชั้นหนังสือ / ออกจากระบบ)`}
              >
                <div className="w-6 h-6 rounded-full bg-white text-sky-700 font-bold text-[11px] flex items-center justify-center overflow-hidden border border-white/40">
                  {user.picture ? (
                    <Image src={user.picture} alt={user.name} width={24} height={24} className="object-cover" unoptimized />
                  ) : (
                    <span>{user.name?.slice(0, 1).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <span className="max-w-[70px] sm:max-w-[90px] truncate hidden sm:inline">{user.name}</span>
                {activeLoanCount > 0 && (
                  <span className="bg-white text-sky-700 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {activeLoanCount}
                  </span>
                )}
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 hover:bg-white/25 transition-all cursor-pointer border border-white/25 active:scale-95"
                title="เข้าสู่ระบบ / สมัครสมาชิก"
              >
                <LogIn size={14} />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
              aria-label="เมนูหลัก"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* 2. Sub-Nav Bar (Deep Navy with high-contrast active tabs) */}
      <div className="hidden lg:block border-t border-white/15 bg-[#073B65]/90 backdrop-blur-md shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 py-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-white text-[#073B65] shadow-md ring-2 ring-white/60 scale-[1.03]'
                      : 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/15 hover:border-white/40 shadow-xs'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-[#079FE8]' : 'text-white/80 group-hover:text-white'} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white text-slate-900 border-b border-sky-200 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-3 rounded-2xl text-xs font-bold text-center border transition-all flex items-center justify-center gap-2 shadow-xs ${
                    active
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white border-sky-500 shadow-md'
                      : 'bg-stone-50 text-slate-800 border-slate-200/90 hover:bg-sky-50 hover:text-sky-700'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-white' : 'text-sky-600'} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <div className="flex gap-2">
              <Link
                href="/chatbot"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Bot size={15} /> ถาม AI ธรรมะ
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 text-slate-800 font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <User size={15} /> ชั้นหนังสือ ({activeLoanCount})
              </Link>
            </div>

            {mounted && isAuthenticated && user && (user.role === 'admin' || user.email === 'asaneebas4567@gmail.com' || user.email === 'thanavuddho.dhamma@gmail.com') && (
              <Link
                href="/admin/database"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldCheck size={16} /> ศูนย์จัดการฐานข้อมูล (Admin Database)
              </Link>
            )}

            {mounted && isAuthenticated && user ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                    {user.picture ? (
                      <Image src={user.picture} alt={user.name} width={28} height={28} className="object-cover" unoptimized />
                    ) : (
                      <span>{user.name?.slice(0, 1) || 'U'}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[150px]">{user.name}</span>
                    <span className="text-[10px] text-amber-700">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-md"
              >
                <LogIn size={15} /> เข้าสู่ระบบ / สมัครสมาชิก
              </Link>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
