import Image from 'next/image';
import Link from 'next/link';
import { Audio } from '@/types';
import { Headphones, Play, Clock, Eye } from 'lucide-react';

interface AudioCardProps {
  audio: Audio;
}

export default function AudioCard({ audio }: AudioCardProps) {
  return (
    <div className="group flex flex-col sm:flex-row bg-white rounded-2xl shadow-sm hover:shadow-xl border border-border/40 hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <div className="relative w-full sm:w-48 aspect-square sm:aspect-auto sm:h-full overflow-hidden bg-surface flex-shrink-0">
        {audio.thumbnail ? (
          <Image
            src={audio.thumbnail}
            alt={audio.title}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <Headphones className="w-12 h-12 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
          <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center scale-90 group-hover:scale-110 transition-transform shadow-lg text-primary">
            <Play className="w-5 h-5 ml-1" />
          </button>
        </div>
        <div className="absolute bottom-2 right-2 z-20 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {audio.duration}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/audios/${audio.id}`}>
          <h3 className="font-bold text-foreground text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {audio.title}
          </h3>
        </Link>
        <p className="text-foreground/60 text-sm mb-4 line-clamp-2">
          {audio.description}
        </p>
        
        {/* Mock Audio Player Bar */}
        <div className="mt-auto">
          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden mb-2">
            <div className="h-full bg-primary/20 w-0 group-hover:w-1/3 transition-all duration-1000 ease-out"></div>
          </div>
          <div className="flex items-center justify-between text-xs text-foreground/50 font-medium">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-foreground/40" />
              <span>{audio.view_count.toLocaleString()} ครั้ง</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
