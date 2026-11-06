'use client';

import React, { useState, useMemo } from 'react';
import { Search, Clock, Copy, Check, Sparkles, Quote, Volume2, Play } from 'lucide-react';
import { TranscriptSegment } from '@/types';

interface TranscriptViewerProps {
  transcript?: TranscriptSegment[] | string;
  currentTime?: number; // current playback time in seconds
  onSeek?: (seconds: number) => void;
  title?: string;
  authorName?: string;
}

export default function TranscriptViewer({
  transcript,
  currentTime = 0,
  onSeek,
  title = 'สื่อธรรมบรรยาย',
  authorName = 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)'
}: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Normalize transcript data into TranscriptSegment[]
  const segments: TranscriptSegment[] = useMemo(() => {
    if (!transcript) return [];
    if (typeof transcript === 'string') {
      // Split by paragraphs
      const lines = transcript.split('\n').filter(l => l.trim().length > 0);
      return lines.map((line, idx) => ({
        time: idx * 30,
        timestamp: `${String(Math.floor((idx * 30) / 60)).padStart(2, '0')}:${String((idx * 30) % 60).padStart(2, '0')}`,
        speaker: authorName,
        text: line.trim()
      }));
    }
    return transcript;
  }, [transcript, authorName]);

  // Filter segments based on search
  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return segments;
    const q = searchQuery.toLowerCase();
    return segments.filter(
      s => s.text.toLowerCase().includes(q) || (s.speaker && s.speaker.toLowerCase().includes(q))
    );
  }, [segments, searchQuery]);

  const handleCopyQuote = (seg: TranscriptSegment, index: number) => {
    const citation = `"${seg.text}"\n— ${seg.speaker || authorName} [ช่วงเวลา ${seg.timestamp}] จากรายการ "${title}" (Thanavuddho Digital Library)`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(() => {});
  };

  if (!transcript || segments.length === 0) {
    return (
      <div className="p-6 text-center rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
        <Sparkles size={24} className="mx-auto text-amber-400 mb-2 opacity-60" />
        <p className="text-sm font-semibold">กำลังจัดทำบทถอดเสียง (Transcript)</p>
        <p className="text-xs text-zinc-500 mt-1">
          ระบบสารสนเทศกำลังทำการแปลงเสียงบรรยายธรรมเป็นตัวอักษรเพื่อการค้นคว้าทางวิชาการ
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header & Search */}
      <div className="p-3 sm:p-4 border-b border-white/10 bg-slate-950/40">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
              <Quote size={15} />
            </span>
            <h3 className="font-bold text-xs sm:text-sm text-slate-100">
              บทถอดเสียงบรรยายธรรม (Transcript)
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400 px-2 py-0.5 rounded-full bg-white/5">
            {segments.length} ท่อนข้อความ
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาคำศัพท์หรือประโยคในบทบรรยาย..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 transition-colors"
          />
        </div>
      </div>

      {/* Segments List */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 max-h-[380px] sm:max-h-[460px] scrollbar-thin scrollbar-thumb-white/10">
        {filteredSegments.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500">
            ไม่พบข้อความที่ตรงกับ &ldquo;{searchQuery}&rdquo;
          </div>
        ) : (
          filteredSegments.map((seg, idx) => {
            const isActive = currentTime >= seg.time && (idx === filteredSegments.length - 1 || currentTime < (filteredSegments[idx + 1]?.time || Infinity));

            return (
              <div
                key={idx}
                className={`group p-2.5 sm:p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/40 shadow-sm text-white'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 text-zinc-300'
                }`}
              >
                {/* Top Row: Timestamp & Speaker */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <button
                    onClick={() => onSeek && onSeek(seg.time)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold font-mono transition-colors cursor-pointer"
                    title="คลิกเพื่อกระโดดไปเล่นที่วินาทีนี้"
                  >
                    <Play size={10} className="fill-amber-300" />
                    <span>{seg.timestamp}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {seg.speaker && (
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {seg.speaker}
                      </span>
                    )}
                    <button
                      onClick={() => handleCopyQuote(seg, idx)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                      title="คัดลอกข้อความพร้อมรูปแบบอ้างอิงวิชาการ"
                    >
                      {copiedIndex === idx ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Body Text */}
                <p className="text-xs sm:text-[13px] leading-relaxed select-text">
                  {seg.text}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-white/5 bg-slate-950/20 flex items-center justify-between text-[10px] text-zinc-500 px-3">
        <span>💡 คลิกเวลาเพื่อกระโดดไปฟัง/ชมท่อนนั้น</span>
        <span>วางเมาส์เพื่อกดก๊อปปี้อ้างอิง</span>
      </div>
    </div>
  );
}
