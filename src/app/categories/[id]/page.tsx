import { categories, books, videos, dhamma as articles } from '@/data/mockData';
import persistentBooks from '@/data/persistentBooks.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag, BookOpen, PlayCircle, BookText } from 'lucide-react';
import BookCard from '@/components/books/BookCard';
import VideoCard from '@/components/videos/VideoCard';
import ArticleCard from '@/components/articles/ArticleCard';

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = categories.find(c => c.id === id);

  if (!category) {
    notFound();
  }

  const aliasMap: Record<string, string[]> = {
    'cat_meditation': ['cat_meditation', 'cat_003', 'c1'],
    'cat_family': ['cat_family', 'cat_005', 'c5'],
    'cat_self_dev': ['cat_self_dev', 'cat_002', 'cat_004', 'c2'],
    'cat_lifestyle': ['cat_lifestyle', 'cat_001', 'c4'],
    'cat_world_civ': ['cat_world_civ'],
    'cat_dharma': ['cat_dharma', 'cat_006', 'c6'],
    'cat_001': ['cat_001', 'cat_lifestyle', 'c4'],
    'cat_002': ['cat_002', 'cat_self_dev', 'c2'],
    'cat_003': ['cat_003', 'cat_meditation', 'c1'],
    'cat_004': ['cat_004', 'cat_self_dev'],
    'cat_005': ['cat_005', 'cat_family', 'c5'],
    'cat_006': ['cat_006', 'cat_dharma', 'c6'],
  };

  const allowedIds = aliasMap[id] || [id];

  const allMergedBooks = [
    ...(persistentBooks as any[]),
    ...books
  ];

  // Deduplicate books by id
  const seenBookIds = new Set<string>();
  const isExcluded = (b: any) => {
    if (!b) return true;
    if (b.is_external_store) return true;
    const t = b.title || '';
    if (t.includes('เลี้ยงลูกสไตล์สุข') || b.id?.includes('liang_look_style_sook')) return true;
    if (t.includes('24 ชม') || b.id?.includes('24_chom')) return true;
    if (t.includes('ขัดเกลาความคิด') || b.id?.includes('khad_klao')) return true;
    if (t.includes('ตัวเราไม่ธรรมดา') || b.id?.includes('tua_rao')) return true;
    return false;
  };

  const categoryBooks = allMergedBooks.filter(b => {
    if (isExcluded(b)) return false;
    if (seenBookIds.has(b.id)) return false;
    const matches = allowedIds.includes(b.category_id) || b.category_ids?.some((cid: string) => allowedIds.includes(cid));
    if (matches) seenBookIds.add(b.id);
    return matches;
  });

  const categoryVideos = videos.filter(v => 
    v.category_ids?.some((cid: string) => allowedIds.includes(cid))
  );
  const categoryArticles = articles.filter(a => 
    a.category_ids?.some((cid: string) => allowedIds.includes(cid))
  );

  const totalContent = categoryBooks.length + categoryVideos.length + categoryArticles.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border/40 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/categories" className="inline-flex items-center text-sm font-medium text-foreground/60 hover:text-primary transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> กลับไปหมวดหมู่ทั้งหมด
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-8 h-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">{category.name}</h1>
          </div>
          <p className="text-foreground/70 text-lg sm:text-xl max-w-3xl leading-relaxed mb-8 font-medium">
            {category.description}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-4 py-2 bg-surface rounded-lg font-medium text-foreground border border-border/40">เนื้อหาทั้งหมด <span className="text-primary font-bold ml-1">{totalContent}</span></span>
            {categoryBooks.length > 0 && <span className="px-4 py-2 bg-surface rounded-lg font-medium text-foreground border border-border/40 flex items-center"><BookOpen className="w-4 h-4 mr-2 text-primary"/>หนังสือ <span className="font-bold ml-2">{categoryBooks.length}</span></span>}
            {categoryVideos.length > 0 && <span className="px-4 py-2 bg-surface rounded-lg font-medium text-foreground border border-border/40 flex items-center"><PlayCircle className="w-4 h-4 mr-2 text-accent"/>วิดีโอ <span className="font-bold ml-2">{categoryVideos.length}</span></span>}
            {categoryArticles.length > 0 && <span className="px-4 py-2 bg-surface rounded-lg font-medium text-foreground border border-border/40 flex items-center"><BookText className="w-4 h-4 mr-2 text-accent"/>บทความ <span className="font-bold ml-2">{categoryArticles.length}</span></span>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Books Section */}
        {categoryBooks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
              <h2 className="text-2xl font-extrabold text-foreground flex items-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                หนังสือ
              </h2>
              <Link href="/books" className="text-primary font-semibold text-sm hover:underline">ดูหนังสือทั้งหมด</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryBooks.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </section>
        )}

        {/* Videos Section */}
        {categoryVideos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
              <h2 className="text-2xl font-extrabold text-foreground flex items-center">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mr-3">
                  <PlayCircle className="w-5 h-5 text-accent" />
                </div>
                วิดีโอ
              </h2>
              <Link href="/videos" className="text-accent font-semibold text-sm hover:underline">ดูวิดีโอทั้งหมด</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryVideos.map(video => <VideoCard key={video.id} video={video} />)}
            </div>
          </section>
        )}


        {/* Articles Section */}
        {categoryArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
              <h2 className="text-2xl font-extrabold text-foreground flex items-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                  <BookText className="w-5 h-5 text-primary" />
                </div>
                บทความธรรมะ
              </h2>
              <Link href="/articles" className="text-primary font-semibold text-sm hover:underline">ดูบทความทั้งหมด</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categoryArticles.map(article => <ArticleCard key={article.id} article={article} />)}
            </div>
          </section>
        )}

        {totalContent === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="w-10 h-10 text-foreground/20" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">ยังไม่มีเนื้อหาในหมวดหมู่นี้</h3>
            <p className="text-foreground/60 text-lg">เนื้อหากำลังอยู่ในระหว่างการจัดทำและจะนำมาเผยแพร่ในเร็วๆ นี้</p>
          </div>
        )}

      </div>
    </div>
  );
}
