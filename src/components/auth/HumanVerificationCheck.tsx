'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Lock, Sparkles, UserCheck } from 'lucide-react';

interface HumanVerificationCheckProps {
  onVerified: (isVerified: boolean) => void;
  isVerified: boolean;
}

export default function HumanVerificationCheck({ onVerified, isVerified }: HumanVerificationCheckProps) {
  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [targetPos, setTargetPos] = useState(75); // target percentage
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'failed'>('idle');
  const [humanScore, setHumanScore] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartTimeRef = useRef<number>(0);

  // Initialize randomized target position
  const resetChallenge = () => {
    const randomTarget = Math.floor(Math.random() * 35) + 55; // 55% - 90%
    setTargetPos(randomTarget);
    setSliderPos(0);
    setStatus('idle');
    onVerified(false);
  };

  useEffect(() => {
    resetChallenge();
  }, []);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isVerified || status === 'success' || !trackRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const offsetX = e.clientX - trackRect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / trackRect.width) * 100));
    setSliderPos(percentage);

    const diff = Math.abs(percentage - targetPos);
    if (diff <= 12) {
      setStatus('checking');
      setTimeout(() => {
        setStatus('success');
        setSliderPos(targetPos);
        onVerified(true);
      }, 300);
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isVerified || status === 'success') return;
    setIsDragging(true);
    dragStartTimeRef.current = Date.now();
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || isVerified || !trackRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offsetX = clientX - trackRect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / trackRect.width) * 100));

    setSliderPos(percentage);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const timeTaken = Date.now() - dragStartTimeRef.current;
    const diff = Math.abs(sliderPos - targetPos);

    setStatus('checking');

    setTimeout(() => {
      // Humans land within 10% tolerance
      if (diff <= 10 && timeTaken >= 120) {
        setStatus('success');
        setSliderPos(targetPos);
        onVerified(true);
      } else {
        setStatus('failed');
        setTimeout(() => {
          setSliderPos(0);
          setStatus('idle');
        }, 700);
      }
    }, 300);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, sliderPos]);

  return (
    <div className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-4 shadow-2xs select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
            isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-[#009fe3]'
          }`}>
            <ShieldCheck size={16} />
          </div>
          <span className="text-xs font-bold text-slate-800">
            ระบบตรวจสอบความปลอดภัย (Anti-AI & Bot Protection)
          </span>
        </div>

        {isVerified ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 size={13} /> ผ่านการตรวจสอบ
          </span>
        ) : (
          <button
            onClick={resetChallenge}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            title="รีเซ็ตการทดสอบ"
          >
            <RefreshCw size={13} />
          </button>
        )}
      </div>

      {isVerified ? (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <UserCheck size={18} className="text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">ยืนยันแล้ว: คุณคือผู้ใช้งานที่เป็นมนุษย์จริง</p>
            <p className="text-[10px] text-emerald-600">พร้อมดำเนินการเชื่อมต่อบัญชี Google Email</p>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs text-slate-600 mb-2.5 flex items-center justify-between">
            <span>👉 เลื่อนปุ่มไปให้ตรงกับ <strong>"เป้าหมายล็อก"</strong> เพื่อพิสูจน์ความเป็นมนุษย์:</span>
            {status === 'failed' && (
              <span className="text-[11px] font-bold text-rose-600">ไม่ตรงตำแหน่ง ลองใหม่อีกครั้ง</span>
            )}
            {status === 'checking' && (
              <span className="text-[11px] font-bold text-sky-600">กำลังวิเคราะห์พฤติกรรม...</span>
            )}
          </p>

          {/* Interactive Slider Track */}
          <div 
            ref={trackRef} 
            onClick={handleTrackClick}
            className="relative h-11 bg-slate-200/90 rounded-xl overflow-hidden shadow-inner flex items-center px-1 cursor-pointer"
          >
            {/* Progress Fill */}
            <div 
              className={`absolute left-0 top-0 bottom-0 transition-all ${
                status === 'success' ? 'bg-emerald-400/50' : 'bg-[#009fe3]/25'
              }`}
              style={{ width: `${sliderPos}%` }}
            />

            {/* Target Drop Zone */}
            <div 
              className="absolute top-1 bottom-1 w-10 rounded-lg border-2 border-dashed border-amber-500 bg-amber-400/20 flex items-center justify-center pointer-events-none"
              style={{ left: `calc(${targetPos}% - 20px)` }}
            >
              <Lock size={12} className="text-amber-700 animate-pulse" />
            </div>

            {/* Draggable Thumb */}
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              className={`absolute top-1 bottom-1 w-9 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md transition-transform duration-75 ${
                status === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#009fe3] hover:bg-[#008ec9] text-white active:scale-95'
              }`}
              style={{ left: `clamp(4px, calc(${sliderPos}% - 18px), calc(100% - 40px))`, minWidth: '36px' }}
            >
              {status === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <span className="text-xs font-black">❯❯</span>
              )}
            </div>

            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-500 pointer-events-none">
              {sliderPos === 0 ? 'ลากหรือคลิกปุ่มนี้ไปใส่ในช่องเป้าหมาย' : ''}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>🛡️ ป้องกันระบบจากการใช้งานโดยบอทและ AI อัตโนมัติ</span>
            <span>ความคลาดเคลื่อน ±10%</span>
          </div>
        </div>
      )}
    </div>
  );
}
