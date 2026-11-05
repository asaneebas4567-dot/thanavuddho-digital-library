import { categories } from '@/data/mockData';
import Link from 'next/link';
import { Tag } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border/40 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl text-primary shadow-sm mb-6">
            <Tag className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-4">หมวดหมู่ทั้งหมด</h1>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto font-medium">
            เลือกศึกษาธรรมะและผลงานตามหมวดหมู่ที่คุณสนใจ
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/categories/${cat.id}`} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl p-8 border border-border/40 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col items-start"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>
              
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <Tag className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors relative z-10 mb-3">
                {cat.name}
              </h3>
              
              <p className="text-sm text-foreground/60 line-clamp-3 leading-relaxed relative z-10 font-medium">
                {cat.description}
              </p>
              
              <div className="mt-auto pt-6 w-full flex items-center text-primary text-sm font-semibold relative z-10">
                 ดูเนื้อหาทั้งหมด <span className="ml-2 transform group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
