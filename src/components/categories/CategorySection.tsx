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
  cardBg: string;
  badgeStyle: string;
  actionText: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'mind',
    name: 'สมาธิ & จิตสงบ',
    subtitle: 'ฝึกใจ วางใจให้ผ่องใส',
    href: '/books?category=cat_meditation',
    count: '7 เล่ม',
    icon: Sparkles,
    iconBg: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20',
    iconColor: 'text-emerald-600',
    cardBg: 'bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border-emerald-200/90 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/15',
    badgeStyle: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
    actionText: 'text-emerald-700'
  },
  {
    id: 'family',
    name: 'ครอบครัว & ความรัก',
    subtitle: 'ชีวิตคู่ และการเลี้ยงลูก',
    href: '/books?category=cat_family',
    count: '6 เล่ม',
    icon: Heart,
    iconBg: 'bg-rose-500 text-white shadow-md shadow-rose-500/20',
    iconColor: 'text-rose-600',
    cardBg: 'bg-gradient-to-br from-rose-50/90 via-pink-50/50 to-white border-rose-200/90 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-500/15',
    badgeStyle: 'bg-rose-100/80 text-rose-800 border-rose-200',
    actionText: 'text-rose-700'
  },
  {
    id: 'work',
    name: 'การงาน & พัฒนาตน',
    subtitle: 'อิทธิบาท 4 ภาวะผู้นำ',
    href: '/books?category=cat_self_dev',
    count: '10 เล่ม',
    icon: Briefcase,
    iconBg: 'bg-sky-500 text-white shadow-md shadow-sky-500/20',
    iconColor: 'text-sky-600',
    cardBg: 'bg-gradient-to-br from-sky-50/90 via-blue-50/50 to-white border-sky-200/90 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/15',
    badgeStyle: 'bg-sky-100/80 text-sky-800 border-sky-200',
    actionText: 'text-[#079FE8]'
  },
  {
    id: 'lifestyle',
    name: 'การดำเนินชีวิต & ทันโลก',
    subtitle: 'ทันโลกทันธรรม ปรับใช้ในชีวิต',
    href: '/books?category=cat_lifestyle',
    count: '6 เล่ม',
    icon: Sun,
    iconBg: 'bg-amber-500 text-white shadow-md shadow-amber-500/20',
    iconColor: 'text-amber-600',
    cardBg: 'bg-gradient-to-br from-amber-50/90 via-yellow-50/50 to-white border-amber-200/90 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/15',
    badgeStyle: 'bg-amber-100/80 text-amber-800 border-amber-200',
    actionText: 'text-amber-700'
  },
  {
    id: 'civ',
    name: 'อารยธรรมโลก',
    subtitle: 'ประวัติศาสตร์และอารยธรรม',
    href: '/books?category=cat_world_civ',
    count: '31 เล่ม',
    icon: Globe,
    iconBg: 'bg-[#073B65] text-white shadow-md shadow-[#073B65]/20',
    iconColor: 'text-[#073B65]',
    cardBg: 'bg-gradient-to-br from-indigo-50/90 via-cyan-50/50 to-white border-indigo-200/90 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/15',
    badgeStyle: 'bg-indigo-100/80 text-indigo-800 border-indigo-200',
    actionText: 'text-[#073B65]'
  },
  {
    id: 'blessing',
    name: 'มงคลชีวิต & คำสอน',
    subtitle: '38 มงคล สู่ความเจริญ',
    href: '/books?category=cat_dharma',
    count: '5 เล่ม',
    icon: BookOpen,
    iconBg: 'bg-purple-500 text-white shadow-md shadow-purple-500/20',
    iconColor: 'text-purple-600',
    cardBg: 'bg-gradient-to-br from-purple-50/90 via-fuchsia-50/50 to-white border-purple-200/90 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/15',
    badgeStyle: 'bg-purple-100/80 text-purple-800 border-purple-200',
    actionText: 'text-purple-700'
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

      {/* 6 Category Cards Grid (Aligned 100% to Real Book Categories with Vibrant Themed Gradients) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className={`group relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 ${cat.cardBg}`}
            >
              <div>
                {/* Icon Container & Accurate Count Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-115 group-hover:rotate-3 duration-300 ${cat.iconBg}`}>
                    <Icon size={19} />
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shadow-2xs ${cat.badgeStyle}`}>
                    {cat.count}
                  </span>
                </div>

                {/* Name & Subtitle */}
                <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 group-hover:text-[#079FE8] transition-colors line-clamp-1 tracking-tight">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-600 font-reading line-clamp-1 mt-0.5 leading-relaxed font-medium">
                  {cat.subtitle}
                </p>
              </div>

              {/* Bottom Arrow Indicator */}
              <div className="mt-3.5 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-slate-600 group-hover:text-[#079FE8] transition-colors">
                <span className={cat.actionText}>เข้าสู่หมวด</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
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
