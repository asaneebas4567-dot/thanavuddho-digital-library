import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ChevronLeft, 
  Tag, 
  BookText, 
  Eye, 
  Share2, 
  Headphones, 
  Sparkles, 
  BookOpen,
  Clock,
  CheckCircle2,
  Bookmark,
  Quote,
  Video,
  ExternalLink,
  Bot,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { dhamma as articles, categories } from '@/data/mockData';
import { getArticleTheme } from '@/lib/articleThemeData';
import ArticleReadingTracker from '@/components/articles/ArticleReadingTracker';

export default async function ArticleReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = articles.find(a => a.id === id);
  
  if (!article) {
    notFound();
  }

  const category = categories.find(c => article.category_ids[0] === c.id);
  const theme = getArticleTheme(article.id, article.title, article.tags || []);

  // Related articles in the same category or recommendations
  const relatedArticles = articles
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50/70 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      {/* Real-time reading progress & points tracker */}
      <ArticleReadingTracker articleId={article.id} articleTitle={article.title} />

      <div className="max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
        
        {/* 1. Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link 
            href="/articles" 
            className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-sky-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-2xs transition-colors"
          >
            <ChevronLeft className="mr-1 w-4 h-4" />
            กลับไปหน้ารวมข้อคิดธรรมะ
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/chatbot"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-colors shadow-2xs"
            >
              <Bot size={14} className="text-sky-600" />
              <span>ถาม AI เพิ่มเติม</span>
            </Link>

            <Link
              href="/audios"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition-colors shadow-2xs"
            >
              <Headphones size={14} className="text-purple-600" />
              <span>ฟังเสียงพอดแคสต์</span>
            </Link>
          </div>
        </div>
        
        {/* 2. Main Article Container */}
        <article className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden">
          
          {/* Header Thematic Art Banner with Stickers */}
          <div className={`relative bg-gradient-to-br ${theme.bgGradient} p-6 sm:p-12 border-b border-slate-100 overflow-hidden`}>
            {/* Soft decorative ambient glow circles */}
            <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-white/40 blur-2xl pointer-events-none" />
            <div className="absolute left-1/3 top-0 w-32 h-32 rounded-full bg-white/30 blur-xl pointer-events-none" />

            <div className="relative z-10">
              {/* Category, Read Time, and Sticker Pill */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
                <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border shadow-2xs backdrop-blur-md ${theme.badgeBg}`}>
                  <Tag className="w-3 h-3 mr-1.5" />
                  {category?.name || theme.badgeText}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/85 text-slate-700 shadow-2xs border border-white">
                  <Clock size={13} className="text-slate-500" />
                  อ่านประมาณ {theme.readingMinutes} นาที
                </span>

                <span className="inline-flex items-center text-xs font-medium text-slate-500 ml-auto">
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  {(article.view_count || 145).toLocaleString()} ครั้ง
                </span>
              </div>

              {/* Dhamma Sticker Icon & Title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white shadow-lg border-2 border-white/90 flex items-center justify-center text-4xl sm:text-5xl shrink-0 rotate-2 hover:rotate-0 transition-transform">
                  <span>{theme.stickerEmoji}</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-slate-500 mb-1">
                    <Sparkles size={13} className="text-amber-500" />
                    <span>แก่นธรรม: {theme.stickerTitle}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                    {article.title}
                  </h1>
                </div>
              </div>

              {/* Author & Source Info */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                    ถ
                  </div>
                  <span className="font-bold text-slate-800">
                    พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ M.D., Ph.D.)
                  </span>
                </div>
                {article.source_type && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/80 text-slate-600 border border-slate-200 text-[11px]">
                    <BookText size={11} className="mr-1" />
                    ที่มา: {article.source_type === 'video' ? 'ถอดความจากธรรมบรรยาย YouTube' : article.source_type}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-12 space-y-8">
            
            {/* Description Lead */}
            {article.description && (
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium bg-amber-50/50 p-5 rounded-2xl border-l-4 border-amber-500">
                {article.description}
              </p>
            )}

            {/* 3. Dhamma Featured Pull-Quote Sticker Card */}
            {theme.featuredQuote && (
              <div className="relative rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-100/30 p-6 sm:p-7 border border-amber-200/80 shadow-xs overflow-hidden">
                <Quote className="absolute right-4 bottom-2 w-20 h-20 text-amber-500/15 pointer-events-none" />
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white mb-2 shadow-2xs">
                    ⭐ สัจธรรมคำสอนประจำบท
                  </span>
                  <p className="text-base sm:text-xl font-bold text-slate-800 italic leading-relaxed mb-2">
                    "{theme.featuredQuote}"
                  </p>
                  <span className="text-xs font-semibold text-slate-500 block">
                    — {theme.quoteAuthor}
                  </span>
                </div>
              </div>
            )}

            {/* 4. Three Pillars of Dhamma Stickers Grid (แก่นธรรม 3 ประการ) */}
            {theme.keyStickers && theme.keyStickers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  แนวทางปฏิบัติสำคัญจากข้อคิดธรรมะนี้
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {theme.keyStickers.map((stk, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-sky-300 transition-all shadow-2xs"
                    >
                      <div className="text-2xl mb-2">{stk.emoji}</div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 mb-1">{stk.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{stk.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Main Content Paragraphs with Styled Headings & Text */}
            <div className="space-y-5 text-slate-800 text-sm sm:text-base leading-relaxed pt-4 border-t border-slate-100">
              {article.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                
                // Highlight major section headers
                const isHeading = trimmed.startsWith('บทสรุป') || 
                  trimmed.startsWith('สรุป') || 
                  trimmed.startsWith('1.') || 
                  trimmed.startsWith('2.') || 
                  trimmed.startsWith('3.') || 
                  trimmed.startsWith('4.') || 
                  trimmed.startsWith('๑.') || 
                  trimmed.startsWith('๒.') || 
                  trimmed.startsWith('๓.') || 
                  trimmed.startsWith('ประเด็น');

                if (isHeading) {
                  return (
                    <div key={index} className="pt-4 pb-1">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 p-3 bg-sky-50/80 border-l-4 border-sky-500 rounded-r-xl">
                        <span className="text-xl">📌</span>
                        <span>{trimmed}</span>
                      </h3>
                    </div>
                  );
                }

                // Sub-bullet or link lines
                if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
                  return (
                    <div key={index} className="pt-2">
                      <a 
                        href={trimmed} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold transition-colors"
                      >
                        <Video size={15} />
                        <span>รับชมคลิปวิดีโอเทศนาต้นฉบับบน YouTube &rarr;</span>
                      </a>
                    </div>
                  );
                }

                return (
                  <p key={index} className="indent-6 sm:indent-8 text-justify font-normal text-slate-700 leading-loose">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* 6. Tags Section */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 block mb-2">คำสำคัญที่เกี่ยวข้อง:</span>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Dhamma Reflection Summary Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/90 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
                  🌿
                </div>
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5 mb-1">
                    ข้อคิดสะกิดใจเพื่อนำไปปรับใช้
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                    การศึกษาธรรมะแท้จริงแล้วมิใช่เพียงเพื่อความรอบรู้หรือการจดจำ แต่คือการนำ **"สติ"** และ **"ปัญญา"** ไปฝึกขัดเกลากาย วาจา ใจ เพื่อให้เราสามารถรับมือกับทุกคลื่นลมในชีวิตได้อย่างสงบและมั่นคง
                  </p>
                </div>
              </div>
            </div>

          </div>
        </article>

        {/* 8. Next Step: Test Knowledge with XP Quiz */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0">
              🏆
            </div>
            <div>
              <h4 className="font-black text-base sm:text-lg">ศึกษาจบแล้ว? มาทำแบบทดสอบวัดระดับปัญญากัน</h4>
              <p className="text-xs text-amber-100 mt-1">
                ตอบคำถามจากหลักธรรมข้อนี้เพื่อสะสมแต้ม XP เลเวลอัป และปลดล็อกเหรียญรางวัล
              </p>
            </div>
          </div>
          <Link
            href="/quiz"
            className="px-6 py-3 rounded-2xl bg-white text-amber-900 font-black text-xs sm:text-sm hover:bg-amber-50 shadow-md transition-all active:scale-95 shrink-0"
          >
            ทำแบบทดสอบ XP ปัญญาธรรม &rarr;
          </Link>
        </div>

        {/* 9. Related Articles Shelf */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>ข้อคิดธรรมะอื่น ๆ ที่น่าสนใจ</span>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  แนะนำ
                </span>
              </h3>
              <Link href="/articles" className="text-xs font-bold text-sky-600 hover:underline">
                ดูทั้งหมด &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map(rel => {
                const relTheme = getArticleTheme(rel.id, rel.title, rel.tags || []);
                return (
                  <Link
                    key={rel.id}
                    href={`/articles/${rel.id}`}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all group flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{relTheme.stickerEmoji}</span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {relTheme.stickerTitle}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-sky-600 line-clamp-2 leading-snug mb-2 flex-grow">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] font-bold text-sky-600 mt-auto inline-flex items-center gap-1">
                      อ่านต่อ <ArrowRight size={12} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
