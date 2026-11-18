'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Heart, 
  Briefcase, 
  Globe, 
  BookOpen, 
  Video, 
  ArrowRight,
  LayoutGrid,
  Sun,
  Radio
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  href: string;
  count: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'mind',
    name: 'สมาธิ & จิตสงบ',
    subtitle: 'ฝึกใจ วางใจให้ผ่องใส',
    href: '/books?category=cat_meditation',
    count: '7 เล่ม',
    icon: Sparkles,
    iconBg: 'bg-emerald-50 text-emerald-600',
    iconColor: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-300 hover:shadow-emerald-500/10'
  },
  {
    id: 'family',
    name: 'ครอบครัว & ความรัก',
    subtitle: 'ชีวิตคู่ และการเลี้ยงลูก',
    href: '/books?category=cat_family',
    count: '6 เล่ม',
    icon: Heart,
    iconBg: 'bg-rose-50 text-rose-600',
    iconColor: 'text-rose-600',
    hoverBorder: 'hover:border-rose-300 hover:shadow-rose-500/10'
  },
  {
    id: 'work',
    name: 'การงาน & พัฒนาตน',
    subtitle: 'อิทธิบาท 4 ภาวะผู้นำ',
    href: '/books?category=cat_self_dev',
    count: '10 เล่ม',
    icon: Briefcase,
    iconBg: 'bg-sky-50 text-[#079FE8]',
    iconColor: 'text-[#079FE8]',
    hoverBorder: 'hover:border-sky-300 hover:shadow-sky-500/10'
  },
  {
    id: 'lifestyle',
    name: 'การดำเนินชีวิต & ทันโลก',
    subtitle: 'ทันโลกทันธรรม ปรับใช้ในชีวิต',
    href: '/books?category=cat_lifestyle',
    count: '6 เล่ม',
    icon: Sun,
    iconBg: 'bg-blue-50 text-blue-600',
    iconColor: 'text-blue-600',
    hoverBorder: 'hover:border-blue-300 hover:shadow-blue-500/10'
  },
  {
    id: 'civ',
    name: 'อารยธรรมโลก',
    subtitle: 'ประวัติศาสตร์และอารยธรรม',
    href: '/books?category=cat_world_civ',
    count: '31 เล่ม',
    icon: Globe,
    iconBg: 'bg-cyan-50 text-[#073B65]',
    iconColor: 'text-[#073B65]',
    hoverBorder: 'hover:border-cyan-300 hover:shadow-cyan-500/10'
  },
  {
    id: 'blessing',
    name: 'มงคลชีวิต & คำสอน',
    subtitle: '38 มงคล สู่ความเจริญ',
    href: '/books?category=cat_dharma',
    count: '5 เล่ม',
    icon: BookOpen,
    iconBg: 'bg-purple-50 text-purple-600',
    iconColor: 'text-purple-600',
    hoverBorder: 'hover:border-purple-300 hover:shadow-purple-500/10'
  }
];

export default function CategorySection() {
  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-100/90 text-[#073B65] border border-sky-200/70 flex items-center justify-center font-bold shadow-2xs">
            <LayoutGrid size={17} className="text-[#079FE8]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              หมวดหมู่ธรรมะ & สื่อการเรียนรู้
            </h3>
            <p className="text-xs text-gray-500">
              เลือกอ่านและศึกษาธรรมะตามหัวข้อที่คุณสนใจ
            </p>
          </div>
        </div>

        <Link
          href="/categories"
          className="text-xs font-bold text-[#079FE8] hover:text-[#073B65] flex items-center gap-1 group py-1 px-2.5 rounded-lg hover:bg-sky-50 transition-colors"
        >
          <span>ดูหมวดหมู่ทั้งหมด</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 6 Category Cards Grid (Aligned 100% to Real Book Categories) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className={`group flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200/80 hover:shadow-md transition-all duration-200 cursor-pointer ${cat.hoverBorder}`}
            >
              <div>
                {/* Icon Container & Accurate Count Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${cat.iconBg}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                    {cat.count}
                  </span>
                </div>

                {/* Name & Subtitle */}
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#079FE8] transition-colors line-clamp-1">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5 leading-relaxed">
                  {cat.subtitle}
                </p>
              </div>

              {/* Bottom Arrow Indicator */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-gray-600 group-hover:text-[#079FE8] transition-colors">
                <span>เข้าสู่หมวด</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dedicated Multimedia Quick Access Bar */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <span className="text-gray-500 font-medium flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#079FE8]" />
          <span>สื่อธรรมะมัลติมีเดียยอดนิยม:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/videos"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#073B65] font-bold border border-sky-200/70 transition-all cursor-pointer group"
          >
            <Video size={14} className="text-[#079FE8] group-hover:scale-110 transition-transform" />
            <span>คลังวิดีโอธรรมะจับใจ (100 คลิป)</span>
            <ArrowRight size={12} className="text-[#079FE8] group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/podcasts"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold border border-indigo-200/70 transition-all cursor-pointer group"
          >
            <Radio size={14} className="text-indigo-600 group-hover:scale-110 transition-transform" />
            <span>พอดแคสต์เสียงธรรม (40 ตอน)</span>
            <ArrowRight size={12} className="text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
