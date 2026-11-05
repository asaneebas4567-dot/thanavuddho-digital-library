import Link from 'next/link';
import { Dhamma } from '@/types';
import { BookText, Eye, Tag, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { categories } from '@/data/mockData';
import { getArticleTheme } from '@/lib/articleThemeData';

interface ArticleCardProps {
  article: Dhamma;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const articleCategory = categories.find(c => article.category_ids[0] === c.id);
  const theme = getArticleTheme(article.id, article.title, article.tags || []);

  return (
    <Link 
      href={`/articles/${article.id}`} 
      className="group flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-200/90 hover:border-sky-300 transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      {/* 1. Thematic Visual Art Banner with Dhamma Sticker */}
      <div className={`relative h-44 sm:h-48 w-full bg-gradient-to-br ${theme.bgGradient} p-5 flex flex-col justify-between overflow-hidden border-b border-slate-100`}>
        {/* Decorative background glow circles */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/40 blur-xl pointer-events-none" />
        <div className="absolute right-12 top-2 w-20 h-20 rounded-full bg-white/30 blur-lg pointer-events-none" />

        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 relative z-10">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-2xs backdrop-blur-md ${theme.badgeBg}`}>
            <Tag className="w-3 h-3 mr-1.5" />
            {articleCategory?.name || theme.badgeText}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/80 text-slate-700 shadow-2xs backdrop-blur-xs">
            <Clock size={12} className="text-slate-500" />
            ~{theme.readingMinutes} นาที
          </span>
        </div>

        {/* Center/Bottom: Large Dhamma Sticker Badge */}
        <div className="flex items-end justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-white/80 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <span>{theme.stickerEmoji}</span>
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 block">
                แก่นธรรมประจำบท
              </span>
              <span className="text-sm font-black text-slate-800 drop-shadow-2xs">
                {theme.stickerTitle}
              </span>
            </div>
          </div>

          {article.source_type && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 text-slate-600 border border-slate-200/80 shadow-2xs">
              <BookText className="w-3 h-3 mr-1" />
              {article.source_type === 'video' ? 'ถอดจากวิดีโอ' : article.source_type}
            </span>
          )}
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-snug mb-2.5 group-hover:text-sky-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3 flex-grow font-normal">
          {article.description || article.content.substring(0, 140) + '...'}
        </p>

        {/* Tags Row */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {article.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Card Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
          <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>อ่านบทความเต็ม</span>
            <ArrowRight size={14} />
          </span>

          <div className="flex items-center gap-1 text-slate-400 font-medium text-[11px]">
            <Eye className="w-3.5 h-3.5" />
            <span>{(article.view_count || 120).toLocaleString()} อ่าน</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
