import { categories, books, videos, audios, dhamma as articles } from '@/data/mockData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag, BookOpen, PlayCircle, Headphones, BookText } from 'lucide-react';
import BookCard from '@/components/books/BookCard';
import VideoCard from '@/components/videos/VideoCard';
import AudioCard from '@/components/audios/AudioCard';
import ArticleCard from '@/components/articles/ArticleCard';

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = categories.find(c => c.id === id);

  if (!category) {
    notFound();
  }

  const categoryBooks = books.filter(b => b.category_ids?.includes(id));
  const categoryVideos = videos.filter(v => v.category_ids?.includes(id));
  const categoryAudios = audios.filter(a => a.category_ids?.includes(id));
  const categoryArticles = articles.filter(a => a.category_ids?.includes(id));

  const totalContent = categoryBooks.length + categoryVideos.length + categoryAudios.length + categoryArticles.length;

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
            {categoryAudios.length > 0 && <span className="px-4 py-2 bg-surface rounded-lg font-medium text-foreground border border-border/40 flex items-center"><Headphones className="w-4 h-4 mr-2 text-primary"/>เสียง <span className="font-bold ml-2">{categoryAudios.length}</span></span>}
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

        {/* Audios Section */}
        {categoryAudios.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
              <h2 className="text-2xl font-extrabold text-foreground flex items-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                  <Headphones className="w-5 h-5 text-primary" />
                </div>
                เสียงธรรมะ
              </h2>
              <Link href="/audios" className="text-primary font-semibold text-sm hover:underline">ดูเสียงทั้งหมด</Link>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {categoryAudios.map(audio => <AudioCard key={audio.id} audio={audio} />)}
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
