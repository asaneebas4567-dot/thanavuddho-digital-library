'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bot, 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  BookOpen, 
  Video, 
  Headphones, 
  Radio, 
  ExternalLink, 
  RotateCcw,
  Maximize2,
  ChevronDown
} from 'lucide-react';
import { sampleBotQuestions } from '@/data/multimediaAndGamificationData';
import { generateAiDhammaAnswer } from '@/lib/chatbotAiEngine';
import { ChatMessage, DhammaCitation } from '@/types';

export default function AiChatWidget() {
  const pathname = usePathname();
  if (
    pathname?.startsWith('/videos') ||
    pathname?.startsWith('/chatbot') ||
    pathname?.startsWith('/reader') ||
    pathname?.startsWith('/admin')
  ) {
    return null;
  }
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: 'เจริญพร ขอต้อนรับสู่ **ผู้ช่วยธรรมะอัจฉริยะ (Thanavuddho AI)** อาตมภาพและระบบปัญญาประดิษฐ์ยินดีช่วยตอบคำถามหลักธรรม แนะนำหนังสือ ข้อคิดธรรมะ และคลิปวิดีโอเทศนาตามที่ท่านต้องการ ท่านสนใจศึกษาเรื่องใดเป็นพิเศษหรือไม่?',
      timestamp: 'เมื่อสักครู่'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateAiDhammaAnswer(q, updatedHistory);
      const botMsg: ChatMessage = {
        id: `msg-b-${Date.now()}`,
        sender: 'assistant',
        content: response.answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        evidenceLevel: response.evidenceLevel,
        evidenceBadgeText: response.evidenceBadgeText,
        categoryBadge: response.categoryBadge
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      // Fallback
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Launcher Button (Compact, Elegant, Non-intrusive) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-4 sm:right-7 z-40 group flex items-center bg-gradient-to-tr from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white p-3 sm:p-3.5 rounded-full shadow-xl shadow-sky-950/20 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
          title="ถามคำถามธรรมะกับ Thanavuddho AI"
        >
          <div className="relative flex items-center justify-center">
            <Bot size={22} className="text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white"></span>
          </div>
          {/* Subtle expand on hover */}
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-bold transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
            ถาม AI ธรรมะ
          </span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-6 right-3 sm:right-7 z-50 w-[94vw] sm:w-[400px] h-[520px] max-h-[76vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white p-4 px-5 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5 leading-tight">
                  ผู้ช่วยธรรมะอัจฉริยะ (Thanavuddho AI)
                </h3>
                <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  ระบบเชื่อมโยงคลังความรู้แบบเรียลไทม์
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link 
                href="/chatbot" 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="ขยายเป็นหน้าต่างเต็ม"
              >
                <Maximize2 size={16} />
              </Link>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="ย่อหน้าต่าง"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-sky-50/70 border-b border-sky-100 p-2.5 px-4 overflow-x-auto no-scrollbar shrink-0 flex gap-2">
            {sampleBotQuestions.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-medium bg-white hover:bg-sky-100 text-sky-900 border border-sky-200/80 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                {prompt.length > 25 ? prompt.slice(0, 25) + '...' : prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages List */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/40">
            {messages.map(msg => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-br-xs shadow-sm shadow-sky-600/20'
                    : 'bg-white text-gray-800 rounded-bl-xs border border-gray-100 shadow-xs'
                }`}>
                  {msg.evidenceBadgeText && (
                    <div className={`mb-2 text-[10px] font-bold px-2 py-1 rounded-lg leading-tight ${
                      msg.evidenceLevel === 'direct_verified' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80' :
                      msg.evidenceLevel === 'general_dhamma' ? 'bg-sky-50 text-sky-900 border border-sky-200/80' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {msg.evidenceBadgeText}
                    </div>
                  )}
                  <div className="whitespace-pre-line">
                    {msg.content}
                  </div>

                  {/* Attached Citations & Media Links */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
                        🎬 สื่อการเรียนรู้และวิดีโอที่เกี่ยวข้อง:
                      </span>
                      {msg.citations.map((c, cIdx) => {
                        const isExt = c.link.startsWith('http://') || c.link.startsWith('https://');
                        const isVid = c.type === 'video';
                        const linkClasses = `flex flex-col gap-1 p-2 rounded-xl text-xs font-semibold transition-colors border ${
                          isVid ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200/70' :
                          c.type === 'audiobook' || c.type === 'podcast' ? 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200/70' :
                          'bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-200/60'
                        }`;

                        const linkContent = (
                          <>
                            <div className="flex items-center gap-2">
                              {isVid ? <Video size={13} className="text-rose-600 shrink-0" /> :
                               c.type === 'audiobook' || c.type === 'podcast' ? <Headphones size={13} className="text-purple-600 shrink-0" /> :
                               <BookOpen size={13} className="text-sky-700 shrink-0" />}
                              <span className="truncate flex-1 font-bold">{c.title}</span>
                              {c.timestamp_formatted && (
                                <span className="text-[10px] bg-rose-200/80 text-rose-900 px-1.5 py-0.2 rounded font-bold shrink-0">
                                  {c.timestamp_formatted}
                                </span>
                              )}
                              <ExternalLink size={11} className="ml-auto shrink-0 opacity-60" />
                            </div>
                            {c.relevanceReason && (
                              <p className="text-[10px] text-rose-700 font-normal leading-tight pl-5">
                                💡 {c.relevanceReason}
                              </p>
                            )}
                          </>
                        );

                        if (isExt) {
                          return (
                            <a
                              key={cIdx}
                              href={c.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={linkClasses}
                            >
                              {linkContent}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={cIdx}
                            href={c.link}
                            onClick={() => setIsOpen(false)}
                            className={linkClasses}
                          >
                            {linkContent}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-white p-3 rounded-2xl w-28 border border-gray-100 shadow-xs">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span>กำลังคิด...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="พิมพ์ถามธรรมะ (เช่น อิทธิบาท 4, สมาธิ)..."
                className="flex-grow bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none py-1.5"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:hover:bg-sky-600 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
            <div className="text-[10px] text-gray-400 text-center mt-1.5">
              ข้อมูลอ้างอิงจากคลังธรรมะของ พระครูปลัดสุวัฒนโพธิคุณ
            </div>
          </div>

        </div>
      )}
    </>
  );
}
