'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Heart, 
  Briefcase, 
  Globe, 
  BookOpen, 
  Headphones, 
  ArrowRight,
  LayoutGrid
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
    href: '/books?category=cat_003',
    count: '12 เล่ม',
    icon: Sparkles,
    iconBg: 'bg-emerald-50 text-emerald-600',
    iconColor: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-300 hover:shadow-emerald-500/10'
  },
  {
    id: 'family',
    name: 'ครอบครัว & ความรัก',
    subtitle: 'ชีวิตคู่ และการเลี้ยงลูก',
    href: '/books?category=cat_001',
    count: '8 เล่ม',
    icon: Heart,
    iconBg: 'bg-rose-50 text-rose-600',
    iconColor: 'text-rose-600',
    hoverBorder: 'hover:border-rose-300 hover:shadow-rose-500/10'
  },
  {
    id: 'work',
    name: 'การงาน & พัฒนาตน',
    subtitle: 'อิทธิบาท 4 ภาวะผู้นำ',
    href: '/books?category=cat_002',
    count: '10 เล่ม',
    icon: Briefcase,
    iconBg: 'bg-amber-50 text-amber-700',
    iconColor: 'text-amber-700',
    hoverBorder: 'hover:border-amber-300 hover:shadow-amber-500/10'
  },
  {
    id: 'civ',
    name: 'อารยธรรมโลก',
    subtitle: 'ประวัติศาสตร์และอารยธรรม',
    href: '/books?category=cat_world_civ',
    count: '20+ เล่ม',
    icon: Globe,
    iconBg: 'bg-sky-50 text-sky-600',
    iconColor: 'text-sky-600',
    hoverBorder: 'hover:border-sky-300 hover:shadow-sky-500/10'
  },
  {
    id: 'blessing',
    name: 'มงคลชีวิต & คำสอน',
    subtitle: '38 มงคล สู่ความเจริญ',
    href: '/books?category=cat_006',
    count: '14 เล่ม',
    icon: BookOpen,
    iconBg: 'bg-purple-50 text-purple-600',
    iconColor: 'text-purple-600',
    hoverBorder: 'hover:border-purple-300 hover:shadow-purple-500/10'
  },
  {
    id: 'audio',
    name: 'เสียง & พอดแคสต์',
    subtitle: 'ฟังข้อคิดยามเช้า-ค่ำ',
    href: '/audios',
    count: 'พอดแคสต์',
    icon: Headphones,
    iconBg: 'bg-indigo-50 text-indigo-600',
    iconColor: 'text-indigo-600',
    hoverBorder: 'hover:border-indigo-300 hover:shadow-indigo-500/10'
  }
];

export default function CategorySection() {
  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center font-bold">
            <LayoutGrid size={17} />
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
          className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group py-1 px-2.5 rounded-lg hover:bg-amber-50 transition-colors"
        >
          <span>ดูหมวดหมู่ทั้งหมด</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 6 Category Cards Grid */}
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
                {/* Icon Container & Count Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${cat.iconBg}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                    {cat.count}
                  </span>
                </div>

                {/* Name & Subtitle */}
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5 leading-relaxed">
                  {cat.subtitle}
                </p>
              </div>

              {/* Bottom Arrow Indicator */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-gray-600 group-hover:text-amber-700 transition-colors">
                <span>เข้าสู่หมวด</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
