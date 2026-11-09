'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  Video, 
  Headphones, 
  ExternalLink, 
  RotateCcw, 
  MessageSquare, 
  ArrowLeft,
  Lightbulb,
  Check,
  Copy,
  Search,
  BookMarked,
  FileText,
  Award,
  Clock,
  Compass,
  ArrowRight,
  Play
} from 'lucide-react';
import { generateAiDhammaAnswer } from '@/lib/chatbotAiEngine';
import { ChatMessage, DhammaCitation } from '@/types';

interface ExtendedChatMessage extends ChatMessage {
  categoryBadge?: string;
  matchedCount?: number;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: `เจริญพร ขอต้อนรับสู่ **ระบบผู้ช่วยอัจฉริยะ (Thanavuddho AI Assistant)** 🙏
      
อาตมภาพและระบบปัญญาประดิษฐ์ยินดีช่วยตอบคำถามหลักธรรม แนะนำข้อคิดเตือนใจ และ **ค้นหาเนื้อหาทุกประเภทในคลังดิจิทัลของห้องสมุด** ให้ท่านทันที:

- 📚 **ค้นหาหนังสือธรรมะ** (มากกว่า 56 เล่ม พร้อมเปิดอ่านฉบับเต็ม)
- 📝 **ค้นหาข้อคิดธรรมะ** สร้างปัญญาและเสริมกำลังใจ
- 🎧 **ค้นหาเสียงบรรยาย & พอดแคสต์** สำหรับฟังระหว่างวัน
- 🎬 **ค้นหาวิดีโอเทศนา** พร้อมหมุดเวลาประเด็นสำคัญ
- 💡 **สอบถามแนวทางแก้ปัญหาชีวิต** การทำงาน ครอบครัว และการทำสมาธิ

ท่านสามารถพิมพ์คำถามหรือคลิกเลือกหัวข้อแนะนำด้านล่างนี้ได้เลย`,
      timestamp: 'เมื่อสักครู่',
      categoryBadge: 'ยินดีต้อนรับ'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: '🌿 นิยาม 5 อธิบายอิทธิบาท 4 อย่างไร?', query: 'นิยาม 5 ช่วยอธิบายอิทธิบาท 4 ได้อย่างไร' },
    { label: '🎬 ยมทูตในนรกมีอายุขัยไหม?', query: 'ยมทูตในนรก มีอายุขัยไหม' },
    { label: '🩺 ถอดเครื่องช่วยหายใจ บาปไหม?', query: 'ถ้าผู้ป่วยระยะสุดท้ายไม่มีทางรักษาและสมองตาย การยุติเครื่องช่วยหายใจถือเป็นบาปหรือไม่' },
    { label: '🌿 นิยาม 5 ได้อะไร?', query: 'นิยาม 5 ได้อะไร' },
    { label: '🧘 วิธีนั่งสมาธิเมื่อใจฟุ้งซ่าน', query: 'เริ่มต้นนั่งสมาธิอย่างไรเมื่อรู้สึกฟุ้งซ่านมาก' },
    { label: '🕊️ รับมือความสูญเสียคนรัก', query: 'วิธีทำใจเมื่อต้องสูญเสียคนรักกะทันหันตามหลักพุทธวิธี' },
    { label: '📚 หนังสือมงคลชีวิต 38 ประการ', query: 'มงคลชีวิต 38 ประการ มีอะไรบ้าง และอยู่ในหนังสือเล่มไหน' },
    { label: '💼 อิทธิบาท 4 กับความก้าวหน้า', query: 'อิทธิบาท 4 มีอะไรบ้าง และนำมาใช้กับการทำงานอย่างไร' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || isTyping) return;

    const userMsg: ExtendedChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateAiDhammaAnswer(q, newHistory);

      const botMsg: ExtendedChatMessage = {
        id: `msg-b-${Date.now()}`,
        sender: 'assistant',
        content: response.answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        categoryBadge: response.categoryBadge,
        evidenceLevel: response.evidenceLevel,
        evidenceBadgeText: response.evidenceBadgeText,
        matchedCount: response.matchedCount
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat generation error:', err);
      const fallbackMsg: ExtendedChatMessage = {
        id: `msg-b-err-${Date.now()}`,
        sender: 'assistant',
        content: 'ขออภัย เกิดข้อผิดพลาดในการประมวลผลคำตอบ กรุณาลองส่งคำถามใหม่อีกครั้ง',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidenceLevel: 'unverified_or_no_evidence',
        evidenceBadgeText: '⚪ ยังไม่พบคำสอนหรือข้อมูลที่ยืนยันได้ในระบบ'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        content: 'เริ่มการสนทนาใหม่แล้ว เจริญพร พิมพ์คำถามธรรมะหรือระบุหัวข้อที่ท่านต้องการค้นหาในห้องสมุดได้เลยครับ',
        timestamp: 'เมื่อสักครู่',
        categoryBadge: 'เริ่มใหม่'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-3 sm:py-6 px-2 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto h-[82vh] sm:h-[86vh] flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-sky-700 via-[#009fe3] to-sky-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md z-10">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="กลับหน้าหลัก"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 text-white shadow-sm shrink-0">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                ผู้ช่วยอัจฉริยะ (Thanavuddho AI)
                <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI Search & Chat
                </span>
              </h1>
              <p className="text-[11px] text-white/85 hidden sm:block">
                ค้นหาและตอบคำถามเชื่อมโยงคลังหนังสือธรรมะ, วิดีโอเทศนา, เสียงบรรยาย และข้อคิดธรรมะ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              title="ระบบค้นหาเต็มรูปแบบ"
            >
              <Search size={13} />
              <span>Smart Search</span>
            </Link>

            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
              title="ล้างการสนทนา"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">ล้างประวัติ</span>
            </button>
          </div>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="bg-sky-50/80 border-b border-sky-100 p-2.5 px-4 overflow-x-auto no-scrollbar shrink-0 flex items-center gap-2 select-none">
          <span className="text-[11px] font-black text-sky-900 shrink-0 flex items-center gap-1">
            <Lightbulb size={13} className="text-sky-500" /> ค้นหาด่วน:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="text-xs font-semibold bg-white hover:bg-sky-100 text-slate-700 hover:text-sky-900 border border-slate-200/80 hover:border-sky-300 px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer shrink-0 shadow-2xs hover:scale-[1.02] active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-6 bg-slate-50/40">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Category Badge & Sender Name for Assistant */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center gap-2 mb-1.5 px-2">
                  <div className="w-5 h-5 rounded-md bg-[#009fe3] text-white flex items-center justify-center font-black text-[10px]">
                    ถ
                  </div>
                  <span className="text-xs font-bold text-slate-800">Thanavuddho AI</span>
                  {msg.categoryBadge && (
                    <span className="text-[10px] bg-sky-100 text-sky-800 border border-sky-300/80 px-2 py-0.2 rounded-full font-bold">
                      {msg.categoryBadge}
                    </span>
                  )}
                </div>
              )}

              <div className={`max-w-[92%] sm:max-w-[85%] rounded-3xl p-5 text-sm leading-relaxed transition-all ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-sky-600 to-[#009fe3] text-white rounded-br-xs shadow-md shadow-sky-600/20'
                  : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
              }`}>
                {/* Evidence Level Badge */}
                {msg.sender === 'assistant' && msg.evidenceBadgeText && (
                  <div className={`mb-3.5 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                    msg.evidenceLevel === 'direct_verified' 
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200/90 shadow-2xs' 
                      : msg.evidenceLevel === 'general_dhamma'
                      ? 'bg-sky-50 text-sky-900 border-sky-200/90 shadow-2xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      msg.evidenceLevel === 'direct_verified' ? 'bg-emerald-500' :
                      msg.evidenceLevel === 'general_dhamma' ? 'bg-sky-500' : 'bg-slate-400'
                    }`} />
                    <span>{msg.evidenceBadgeText}</span>
                  </div>
                )}

                {/* Content */}
                <div className="whitespace-pre-line text-slate-800 font-normal leading-relaxed">
                  {msg.content}
                </div>

                {/* Rich Citations & Web Content Matches */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles size={14} className="text-sky-500" />
                        หลักฐานและสื่อการเรียนรู้ที่ตรวจสอบแล้ว ({msg.citations.length} รายการ):
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.citations.map((c, cIdx) => {
                        const isBook = c.type === 'book';
                        const isVideo = c.type === 'video';
                        const isAudio = c.type === 'audiobook' || c.type === 'podcast' || c.type === 'audio';
                        const isQuiz = c.type === 'quiz';
                        const isExternal = c.link.startsWith('http://') || c.link.startsWith('https://');

                        return (
                          <div
                            key={cIdx}
                            className="group flex flex-col justify-between p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200/80 hover:border-sky-300 transition-all shadow-2xs hover:shadow-xs"
                          >
                            <div className="flex gap-3 items-start">
                              {/* Media Icon or Thumbnail */}
                              <div className={`rounded-xl overflow-hidden bg-slate-200 shrink-0 relative flex items-center justify-center border border-black/5 shadow-2xs ${isVideo ? 'w-20 h-14' : 'w-12 h-14'}`}>
                                {c.cover ? (
                                  <>
                                    <Image
                                      src={c.cover}
                                      alt={c.title}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform"
                                      unoptimized
                                    />
                                    {isVideo && (
                                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                        <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                                          <Play size={10} className="fill-current ml-0.5" />
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="w-full h-full bg-slate-800 text-white flex items-center justify-center">
                                    {isVideo ? <Video size={18} className="text-rose-400" /> :
                                     isAudio ? <Headphones size={18} className="text-purple-400" /> :
                                     isQuiz ? <Award size={18} className="text-sky-400" /> :
                                     <BookOpen size={18} className="text-sky-300" />}
                                  </div>
                                )}
                              </div>

                              {/* Details */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase leading-none ${
                                    isBook ? 'bg-sky-100 text-sky-800' :
                                    isVideo ? 'bg-rose-100 text-rose-800 border border-rose-200/80 font-bold' :
                                    isAudio ? 'bg-purple-100 text-purple-800' :
                                    isQuiz ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {isBook ? 'หนังสือธรรมะ' :
                                     isVideo ? 'วิดีโอเทศนา (YouTube)' :
                                     isAudio ? 'เสียงบรรยาย' :
                                     isQuiz ? 'แบบทดสอบ' : 'ข้อคิดธรรมะ / คำสอน'}
                                  </span>

                                  {c.timestamp_formatted && (
                                    <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5">
                                      <Clock size={10} /> {c.timestamp_formatted}
                                    </span>
                                  )}

                                  {c.page_number && (
                                    <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                                      หน้า {c.page_number}
                                    </span>
                                  )}
                                </div>

                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug">
                                  {c.title}
                                </h4>

                                {c.relevanceReason && (
                                  <div className="mt-2 p-2 rounded-xl bg-rose-50 border border-rose-200/70 text-[11px] text-rose-900 leading-relaxed">
                                    <span className="font-extrabold text-rose-800">💡 ความเกี่ยวข้อง:</span> {c.relevanceReason}
                                  </div>
                                )}

                                {c.unverifiedContentNotice && (
                                  <div className="mt-1.5 px-2 py-1 rounded-lg bg-amber-50/90 border border-amber-200/70 text-[10px] text-amber-800 font-medium">
                                    ⚠️ {c.unverifiedContentNotice}
                                  </div>
                                )}

                                {c.quote && (
                                  <div className="mt-2 p-2 rounded-lg bg-sky-50/80 border-l-2 border-sky-400 text-[11px] text-slate-700 italic leading-relaxed">
                                    &ldquo;{c.quote}&rdquo;
                                  </div>
                                )}

                                {!c.quote && c.snippet && (
                                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                                    {c.snippet}
                                  </p>
                                )}

                                {!c.quote && !c.snippet && c.description && (
                                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                    {c.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between">
                              {isExternal ? (
                                <a
                                  href={c.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold transition-all hover:underline ${
                                    isVideo ? 'text-rose-600 hover:text-rose-800' : 'text-sky-700 hover:text-sky-900'
                                  }`}
                                >
                                  {isVideo && <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />}
                                  <span>{c.actionText || (isVideo ? '▶️ รับชมบน YouTube' : 'เปิดแหล่งต้นทาง')}</span>
                                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                </a>
                              ) : (
                                <Link
                                  href={c.link}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 group-hover:text-sky-900 transition-colors hover:underline"
                                >
                                  <span>{c.actionText || 'เปิดอ่าน / ดูเนื้อหา'}</span>
                                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                              )}
                              
                              <ExternalLink size={11} className="text-slate-400" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Assistant Footer Actions (Copy, Feedback) */}
                {msg.sender === 'assistant' && (
                  <div className="mt-3 pt-2 flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Compass size={11} /> อ้างอิงคำสอนและคลังสื่อของ พระครูปลัดสุวัฒนโพธิคุณ
                    </span>

                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 text-slate-500 hover:text-sky-700 transition-colors cursor-pointer p-1"
                      title="คัดลอกคำตอบ"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={12} className="text-emerald-600" />
                          <span className="text-emerald-600 font-bold">คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>คัดลอก</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-2 font-medium">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-xs text-slate-500 bg-white p-4 rounded-2xl w-48 border border-slate-200/80 shadow-xs">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-[#009fe3] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="font-semibold text-slate-600">AI กำลังค้นหาคำตอบ...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-2 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-500/15 transition-all shadow-inner">
            <Search size={18} className="text-slate-400 shrink-0" />
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ถามคำถามธรรมะ หรือค้นหาหนังสือ, วิดีโอ, พอดแคสต์ ในเว็บไซต์... (กด Enter เพื่อส่ง)"
              className="flex-grow bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none py-1.5 font-medium"
            />
            
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#009fe3] hover:bg-sky-600 disabled:opacity-40 disabled:hover:bg-[#009fe3] text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-sm shadow-sky-600/20 active:scale-95"
            >
              <span>ถาม / ค้นหา</span>
              <Send size={13} />
            </button>
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-2 mt-2">
            <span>💡 ตัวอย่าง: <em>"หาหนังสือเรื่องความสุข", "วิธีทำสมาธิ", "อิทธิบาท 4", "พอดแคสต์คลายเครียด"</em></span>
            <span className="hidden sm:inline">เชื่อมต่อฐานข้อมูลหนังสือ 56+ เล่ม, วิดีโอ และเสียงบรรยาย</span>
          </div>
        </div>

      </div>
    </div>
  );
}
