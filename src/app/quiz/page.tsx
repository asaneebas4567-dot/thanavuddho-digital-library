'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Trophy, 
  BookOpen, 
  Layers, 
  GraduationCap, 
  RotateCcw, 
  ChevronRight, 
  Download, 
  Share2, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { quizzes, initialBadges } from '@/data/multimediaAndGamificationData';
import { getCustomBookQuizzes } from '@/data/bookCustomData';
import { endOfBookComprehensiveExams } from '@/data/bookComprehensiveExams';
import { useLearningPoints } from '@/lib/useLearningPoints';
import { triggerFlyingCoins } from '@/components/common/FlyingCoinAnimation';
import { Quiz, QuizQuestion, QuizLevel, Badge, DhammaCertificate } from '@/types';

function QuizGamificationContent() {
  const searchParams = useSearchParams();
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | 'all'>('all');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [userXP, setUserXP] = useState(720);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);
  const [certificate, setCertificate] = useState<DhammaCertificate | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const { recordEarn, availablePoints } = useLearningPoints();

  // Helper for Colorful Thematic Stickers & Emotion Styling (Article Card Style)
  const getQuizTheme = (quiz: Quiz) => {
    const title = quiz.title.toLowerCase();
    
    if (quiz.level === 'comprehensive' || title.includes('ท้ายเล่ม')) {
      if (title.includes('มงคลชีวิต')) {
        return {
          stickerEmoji: '👑',
          stickerTitle: 'มงคล 38 ประการ',
          emotionTag: '✨ ก้าวหน้า & มงคลสูงสุด',
          bgGradient: 'from-amber-500/25 via-orange-400/20 to-amber-100/40',
          borderAccent: 'border-amber-300 hover:border-amber-500 hover:shadow-amber-500/15',
          badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
          badgeTextColor: 'text-amber-950',
          actionBtnGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/30',
          xpColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black',
        };
      }
      if (title.includes('พร้อมบวก') || title.includes('ทำใจ')) {
        return {
          stickerEmoji: '💖',
          stickerTitle: 'ใจพร้อมบวก',
          emotionTag: '🌸 คิดบวก & เบิกบานใจ',
          bgGradient: 'from-pink-500/25 via-rose-400/20 to-pink-100/40',
          borderAccent: 'border-rose-300 hover:border-rose-500 hover:shadow-rose-500/15',
          badgeBg: 'bg-rose-100 text-rose-950 border-rose-300',
          badgeTextColor: 'text-rose-950',
          actionBtnGradient: 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 shadow-rose-500/30',
          xpColor: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black',
        };
      }
      if (title.includes('อย่ามโน')) {
        return {
          stickerEmoji: '🧠',
          stickerTitle: 'รู้ทันจิต & สติ',
          emotionTag: '💡 ตื่นรู้ & คลายกังวล',
          bgGradient: 'from-purple-500/25 via-indigo-400/20 to-purple-100/40',
          borderAccent: 'border-purple-300 hover:border-purple-500 hover:shadow-purple-500/15',
          badgeBg: 'bg-purple-100 text-purple-950 border-purple-300',
          badgeTextColor: 'text-purple-950',
          actionBtnGradient: 'bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-700 hover:from-purple-700 hover:to-indigo-600 shadow-purple-500/30',
          xpColor: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black',
        };
      }
      if (title.includes('สมดุล')) {
        return {
          stickerEmoji: '⚖️',
          stickerTitle: 'สมดุลเท่ากับดี',
          emotionTag: '🌿 ชีวิตสมดุล & สายกลาง',
          bgGradient: 'from-emerald-500/25 via-teal-400/20 to-emerald-100/40',
          borderAccent: 'border-emerald-300 hover:border-emerald-500 hover:shadow-emerald-500/15',
          badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          badgeTextColor: 'text-emerald-950',
          actionBtnGradient: 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 hover:from-emerald-700 hover:to-teal-600 shadow-emerald-500/30',
          xpColor: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black',
        };
      }
      if (title.includes('สุข')) {
        return {
          stickerEmoji: '🤝',
          stickerTitle: 'เขาก็สุข เราก็สุข',
          emotionTag: '🕊️ เมตตาจิต & สันติภาพ',
          bgGradient: 'from-sky-500/25 via-cyan-400/20 to-sky-100/40',
          borderAccent: 'border-sky-300 hover:border-sky-500 hover:shadow-sky-500/15',
          badgeBg: 'bg-sky-100 text-sky-950 border-sky-300',
          badgeTextColor: 'text-sky-950',
          actionBtnGradient: 'bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-700 hover:from-sky-700 hover:to-cyan-600 shadow-sky-500/30',
          xpColor: 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-black',
        };
      }
      return {
        stickerEmoji: '🏆',
        stickerTitle: 'ประมวลปัญญาธรรม',
        emotionTag: '⭐ ยอดปัญญา & ความสำเร็จ',
        bgGradient: 'from-amber-500/25 via-orange-400/20 to-yellow-100/40',
        borderAccent: 'border-amber-300 hover:border-amber-500 hover:shadow-amber-500/15',
        badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
        badgeTextColor: 'text-amber-950',
        actionBtnGradient: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/30',
        xpColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black',
      };
    }

    if (quiz.level === 'chapter') {
      return {
        stickerEmoji: '💡',
        stickerTitle: 'จุดประกายสติรายบท',
        emotionTag: '🧘 สมาธิ & สติปัญญา',
        bgGradient: 'from-teal-500/25 via-emerald-400/20 to-teal-100/40',
        borderAccent: 'border-teal-300 hover:border-teal-500 hover:shadow-teal-500/15',
        badgeBg: 'bg-teal-100 text-teal-950 border-teal-300',
        badgeTextColor: 'text-teal-950',
        actionBtnGradient: 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-teal-500/30',
        xpColor: 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black',
      };
    }

    if (quiz.level === 'book') {
      return {
        stickerEmoji: '📘',
        stickerTitle: 'ปัญญารอบรู้ทั้งเล่ม',
        emotionTag: '📚 เข้าใจชีวิต & สัจธรรม',
        bgGradient: 'from-blue-500/25 via-sky-400/20 to-indigo-100/40',
        borderAccent: 'border-blue-300 hover:border-blue-500 hover:shadow-blue-500/15',
        badgeBg: 'bg-blue-100 text-blue-950 border-blue-300',
        badgeTextColor: 'text-blue-950',
        actionBtnGradient: 'bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 hover:from-blue-700 hover:to-sky-600 shadow-blue-500/30',
        xpColor: 'bg-gradient-to-r from-blue-600 to-sky-600 text-white font-black',
      };
    }

    return {
      stickerEmoji: '🌸',
      stickerTitle: 'เชี่ยวชาญหมวดธรรม',
      emotionTag: '💖 ลึกซึ้ง & มีปัญญา',
      bgGradient: 'from-purple-500/25 via-violet-400/20 to-pink-100/40',
      borderAccent: 'border-purple-300 hover:border-purple-500 hover:shadow-purple-500/15',
      badgeBg: 'bg-purple-100 text-purple-950 border-purple-300',
      badgeTextColor: 'text-purple-950',
      actionBtnGradient: 'bg-gradient-to-r from-purple-600 via-violet-500 to-purple-700 hover:from-purple-700 hover:to-violet-600 shadow-purple-500/30',
      xpColor: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white font-black',
    };
  };

  // Combine End-of-Book Comprehensive Exams (500 P), custom book quizzes, and system quizzes
  const allQuizzes = useMemo(() => {
    const custom = getCustomBookQuizzes();
    return [...endOfBookComprehensiveExams, ...custom, ...quizzes];
  }, []);

  // Filter quizzes by level
  const filteredQuizzes = selectedLevel === 'all' 
    ? allQuizzes 
    : allQuizzes.filter(q => q.level === selectedLevel);

  // Timer countdown
  useEffect(() => {
    if (!activeQuiz || isSubmitted) return;
    if (timeLeftSeconds <= 0) {
      if (timeLeftSeconds === 0 && Object.keys(selectedAnswers).length > 0) {
        handleSubmitQuiz();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, isSubmitted, timeLeftSeconds]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setTimeLeftSeconds(quiz.time_limit_minutes * 60);
    setEarnedBadge(null);
    setCertificate(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if bookId or quizId passed via URL query parameter
  useEffect(() => {
    const bookParam = searchParams.get('book');
    const quizIdParam = searchParams.get('quizId');
    if (!activeQuiz) {
      if (bookParam) {
        const found = allQuizzes.find(q => q.target_id === bookParam || q.id === `quiz-custom-${bookParam}`);
        if (found) {
          handleStartQuiz(found);
        }
      } else if (quizIdParam) {
        const found = allQuizzes.find(q => q.id === quizIdParam);
        if (found) {
          handleStartQuiz(found);
        }
      }
    }
  }, [searchParams, allQuizzes]);

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;

    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_index) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / activeQuiz.questions.length) * 100);
    setUserScore(scorePercent);
    setIsSubmitted(true);

    // If passed
    if (scorePercent >= activeQuiz.passing_score) {
      setUserXP(prev => prev + activeQuiz.xp_reward);

      // Trigger visual flying coin animation into Navbar balance
      triggerFlyingCoins({ count: 20, sound: true });

      // Record points into database
      recordEarn({
        type: activeQuiz.level === 'comprehensive' ? 'quiz_book_finish' : 'quiz_chapter',
        sourceId: activeQuiz.id,
        chapterTitle: activeQuiz.title,
        customPoints: activeQuiz.xp_reward,
        customTitle: activeQuiz.title,
        customDetail: `ผ่านเกณฑ์การทดสอบ ${scorePercent}% ได้รับ +${activeQuiz.xp_reward} P`
      });

      // Unlock badge if available
      if (activeQuiz.badge_id) {
        const foundBadge = badges.find(b => b.id === activeQuiz.badge_id);
        if (foundBadge && !foundBadge.earned) {
          const updatedBadges = badges.map(b => b.id === activeQuiz.badge_id ? { ...b, earned: true, earned_date: 'วันนี้' } : b);
          setBadges(updatedBadges);
          setEarnedBadge(foundBadge);
        }
      }

      // If Level 4 (Grand Exam), grant certificate!
      if (activeQuiz.level === 'comprehensive') {
        const newCert: DhammaCertificate = {
          id: `cert-${Date.now()}`,
          user_name: 'ผู้ศึกษาพระธรรม',
          exam_title: 'การประมวลความรู้ธรรมศึกษาดิจิทัล',
          score: scorePercent,
          total_questions: activeQuiz.questions.length,
          issued_at: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
          certificate_code: `THANA-DL-${Math.floor(100000 + Math.random() * 900000)}`,
          status: scorePercent >= 90 ? 'honors' : 'pass'
        };
        setCertificate(newCert);
      }
    }
  };

  const currentQ: QuizQuestion | undefined = activeQuiz?.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#F0F8FD]/40 py-6 sm:py-8 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Hero (Ultra-Compact, High-Contrast & Clear) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#073B65] via-[#0B4E85] to-[#079FE8] text-white p-4 sm:p-6 mb-4 shadow-lg shadow-sky-950/10">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-yellow-300 text-[10px] sm:text-[11px] font-bold border border-white/30 mb-1.5">
              <Trophy size={12} className="text-[#D9A441]" /> ระบบแบบทดสอบความรู้และสะสมคะแนน
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight mb-1 text-white">
              ทดสอบปัญญาธรรม <span className="text-yellow-300">4 ระดับความเข้าใจ</span>
            </h1>
            <p className="text-white font-medium text-xs sm:text-[13px] leading-relaxed mb-3 max-w-2xl drop-shadow-xs">
              วัดระดับความเข้าใจ สะสมแต้มคะแนน ปลดล็อกเหรียญตรา และรับใบประกาศนียบัตรประมวลความรู้ธรรมศึกษา ครอบคลุมตั้งแต่แบบทดสอบรายบทจนถึงภาพรวมท้ายเล่ม
            </p>

            {/* User Gamification Stats Bar - Compact Inline Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/40 flex items-center gap-2 shadow-xs">
                <span className="text-sm">⚡</span>
                <div>
                  <div className="text-[9px] text-white/90 uppercase font-bold tracking-wider">คะแนนสะสม</div>
                  <div className="text-sm sm:text-base font-black text-amber-300 leading-tight">{userXP.toLocaleString()} แต้ม</div>
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/40 flex items-center gap-2 shadow-xs">
                <span className="text-sm">🏅</span>
                <div>
                  <div className="text-[9px] text-white/90 uppercase font-bold tracking-wider">เหรียญที่ปลดล็อก</div>
                  <div className="text-sm sm:text-base font-black text-white leading-tight">
                    {badges.filter(b => b.earned).length} / {badges.length} เหรียญ
                  </div>
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/40 flex items-center gap-2 shadow-xs">
                <span className="text-sm">📜</span>
                <div>
                  <div className="text-[9px] text-white/90 uppercase font-bold tracking-wider">วุฒิบัตรดิจิทัล</div>
                  <div className="text-sm sm:text-base font-black text-white leading-tight">
                    {certificate ? 'พร้อมรับรอง' : 'สอบ Level 4 เพื่อรับ'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Quiz Runner Modal / Box */}
        {activeQuiz && (
          <div className="bg-white rounded-3xl border border-sky-200 shadow-xl p-6 sm:p-10 mb-12 animate-in fade-in slide-in-from-top-4 ring-4 ring-sky-500/10">
            
            {/* Quiz Top Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4 mb-6">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-800">
                  {activeQuiz.level_label}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                  {activeQuiz.title}
                </h2>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {!isSubmitted && (
                  <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold ${
                    timeLeftSeconds < 60 ? 'bg-rose-50 text-rose-700 animate-pulse' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Clock size={16} />
                    <span>
                      {Math.floor(timeLeftSeconds / 60)}:{String(timeLeftSeconds % 60).padStart(2, '0')}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold cursor-pointer"
                >
                  ออกจากการสอบ
                </button>
              </div>
            </div>

            {/* Quiz Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-400 font-medium mb-2">
                <span>ข้อที่ {currentQuestionIndex + 1} จาก {activeQuiz.questions.length} ข้อ</span>
                <span>ตอบแล้ว {Object.keys(selectedAnswers).length} ข้อ</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            {currentQ && !isSubmitted && (
              <div className="mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                  {currentQuestionIndex + 1}. {currentQ.question}
                </h3>

                <div className="space-y-3">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-sky-50 border-sky-500 text-sky-950 font-semibold shadow-sm ring-2 ring-sky-500/20' 
                            : 'bg-white border-gray-200 hover:border-sky-300 hover:bg-gray-50/50 text-gray-700'
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ml-4 ${
                          isSelected ? 'border-sky-600 bg-sky-600 text-white' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check size={14} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Question Stepper Buttons */}
                <div className="flex items-center justify-between gap-2 mt-6 pt-5 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs sm:text-sm font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  >
                    ข้อก่อนหน้า
                  </button>

                  {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(i => Math.min(activeQuiz.questions.length - 1, i + 1))}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 cursor-pointer shrink-0"
                    >
                      ข้อถัดไป
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-4 sm:px-7 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 cursor-pointer shrink-0"
                    >
                      ส่งคำตอบและตรวจผล
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Submission Result Screen with Detailed Explanation */}
            {isSubmitted && (
              <div className="space-y-8 animate-in fade-in">
                
                {/* Result Hero Banner */}
                <div className={`p-8 rounded-3xl text-center border ${
                  userScore >= activeQuiz.passing_score 
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                    : 'bg-sky-50/70 border-sky-200 text-sky-950'
                }`}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-md bg-white">
                    {userScore >= activeQuiz.passing_score ? '🎉' : '📖'}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">
                    {userScore >= activeQuiz.passing_score ? 'ยินดีด้วย! ท่านผ่านการทดสอบ' : 'ยังไม่ผ่านเกณฑ์ พยายามอีกนิดนะ!'}
                  </h3>
                  <p className="text-sm opacity-90 max-w-md mx-auto mb-6">
                    ท่านทำคะแนนได้ <span className="font-bold text-lg">{userScore}%</span> (เกณฑ์ผ่าน {activeQuiz.passing_score}%)
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {userScore >= activeQuiz.passing_score && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm">
                        <Sparkles size={16} /> ได้รับ +{activeQuiz.xp_reward} แต้ม
                      </span>
                    )}

                    {certificate && (
                      <button
                        onClick={() => setShowCertificateModal(true)}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                      >
                        <GraduationCap size={16} />
                        เปิดดูใบประกาศนียบัตรดิจิทัล
                      </button>
                    )}

                    <button
                      onClick={() => handleStartQuiz(activeQuiz)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 cursor-pointer"
                    >
                      <RotateCcw size={14} /> ทำแบบทดสอบอีกครั้ง
                    </button>
                  </div>
                </div>

                {/* Question-by-Question Review with Explanations */}
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    เฉลยคำตอบพร้อมคำอธิบายหลักธรรมเชิงลึก
                  </h4>

                  <div className="space-y-6">
                    {activeQuiz.questions.map((q, idx) => {
                      const userChoice = selectedAnswers[idx];
                      const isCorrect = userChoice === q.correct_index;
                      return (
                        <div key={q.id} className={`p-6 rounded-2xl border ${
                          isCorrect ? 'bg-emerald-50/30 border-emerald-200' : 'bg-rose-50/30 border-rose-200'
                        }`}>
                          <div className="flex items-start gap-3 mb-3">
                            <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold bg-white shadow-xs">
                              {idx + 1}
                            </span>
                            <h5 className="font-bold text-gray-900 text-base leading-snug">
                              {q.question}
                            </h5>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 ml-10">
                            {q.options.map((opt, oIdx) => {
                              const isCorrectOpt = oIdx === q.correct_index;
                              const isUserOpt = oIdx === userChoice;
                              return (
                                <div key={oIdx} className={`p-3 rounded-xl text-xs font-medium border ${
                                  isCorrectOpt 
                                    ? 'bg-emerald-100/70 border-emerald-400 text-emerald-950 font-bold' 
                                    : isUserOpt 
                                    ? 'bg-rose-100/70 border-rose-300 text-rose-900' 
                                    : 'bg-white border-gray-200 text-gray-600'
                                }`}>
                                  {isCorrectOpt && '✓ '}
                                  {isUserOpt && !isCorrectOpt && '✗ '}
                                  {opt}
                                </div>
                              );
                            })}
                          </div>

                          <div className="ml-10 p-3.5 rounded-xl bg-white border border-gray-100 text-xs text-gray-700 leading-relaxed shadow-xs">
                            <span className="font-bold text-sky-800 block mb-1">💡 คำอธิบายหลักธรรม:</span>
                            {q.explanation}
                            {q.source_ref && (
                              <div className="mt-2 text-[11px] text-gray-400">
                                แหล่งอ้างอิง: {q.source_ref}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* Level Navigation Tabs (4 ระดับ) */}
        <div className="flex items-center gap-2 sm:gap-2.5 mb-4 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'ทั้งหมด', icon: Layers },
            { id: 'comprehensive', label: '🎓 ข้อสอบท้ายเล่ม 500 แต้ม (End-of-Book)', icon: GraduationCap },
            { id: 'chapter', label: 'ระดับ 1: จบในบท (Chapter)', icon: BookOpen },
            { id: 'book', label: 'ระดับ 2: จบ 1 เล่ม (Book)', icon: HelpCircle },
            { id: 'category', label: 'ระดับ 3: จบในหมวด (Category)', icon: Trophy },
          ].map(lvl => {
            const Icon = lvl.icon;
            const isActive = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#073B65] text-white shadow-md shadow-[#073B65]/20' 
                    : 'bg-white border border-[#DCEAF3] text-[#243447] hover:border-[#079FE8]'
                }`}
              >
                <Icon size={15} />
                <span>{lvl.label}</span>
              </button>
            );
          })}
        </div>

        {/* End-of-Book Exam Standards & Status Guide (Compact) */}
        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-white border border-sky-200/80 shadow-2xs text-xs sm:text-[13px] text-slate-700 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-[#073B65]">
            <GraduationCap className="w-4 h-4 text-[#079FE8]" />
            <span>ข้อสอบประมวลความรู้ท้ายเล่ม (500 คะแนน)</span>
          </div>
          <div className="text-slate-600 text-xs leading-relaxed space-y-0.5">
            <p>
              • <strong>ไม่มีการเด้งขัดจังหวะขณะอ่าน:</strong> ผู้เรียนสามารถศึกษาเนื้อหาและเข้ามาทำข้อสอบวัดผลได้ที่หน้านี้โดยตรง
            </p>
            <p>
              • <strong>เล่มที่มีข้อสอบท้ายเล่ม:</strong> มงคลชีวิต 38 ประการ, ทำใจให้พร้อมบวก, อย่ามโน, สมดุลเท่ากับดี และ เขาก็สุข เราก็สุข
            </p>
          </div>
        </div>

        {/* Quiz Cards Grid - Colorful Cards with Thematic Emotion Stickers & Gradients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {filteredQuizzes.map(quiz => {
            const theme = getQuizTheme(quiz);
            return (
              <div 
                key={quiz.id}
                className={`group flex flex-col bg-white rounded-3xl border ${theme.borderAccent} shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1`}
              >
                {/* 1. Thematic Visual Art Banner with Dhamma Sticker & Emotions */}
                <div className={`relative h-28 sm:h-32 w-full bg-gradient-to-br ${theme.bgGradient} p-4 sm:p-5 flex flex-col justify-between overflow-hidden border-b border-slate-100/90`}>
                  {/* Decorative background glow circles */}
                  <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/40 blur-lg pointer-events-none" />
                  <div className="absolute right-10 top-1 w-16 h-16 rounded-full bg-white/30 blur-md pointer-events-none" />

                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs backdrop-blur-md ${theme.badgeBg}`}>
                      {quiz.level_label}
                    </span>

                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black shadow-sm ${theme.xpColor}`}>
                      <Sparkles size={12} className="fill-white" /> +{quiz.xp_reward} แต้ม
                    </span>
                  </div>

                  {/* Center/Bottom: Large Dhamma Sticker Badge with Emotion Tag */}
                  <div className="flex items-end justify-between relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-white shadow-md border border-white/80 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0">
                        <span>{theme.stickerEmoji}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 block">
                          {theme.stickerTitle}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-slate-800 drop-shadow-2xs">
                          {theme.emotionTag}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Card Content Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug mb-1.5 line-clamp-2">
                      {quiz.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal line-clamp-2">
                      {quiz.description}
                    </p>
                  </div>

                  {/* 3. Footer with Question Specs & Action Button */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium flex flex-wrap items-center gap-2">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">{quiz.questions.length} คำถาม</span>
                      <span>•</span>
                      <span>จำกัด {quiz.time_limit_minutes} นาที</span>
                      <span>•</span>
                      <span>ผ่าน {quiz.passing_score}%</span>
                    </div>

                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl ${theme.actionBtnGradient} text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer`}
                    >
                      <span>เริ่มทำข้อสอบ</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges Collection Showcase */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 mb-12">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="text-sky-600" size={24} />
                คลังเหรียญตราเกียรติยศ (Badges Collection)
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                เหรียญตราแสดงความเชี่ยวชาญจากการผ่านแบบทดสอบแต่ละระดับ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map(badge => (
              <div 
                key={badge.id}
                className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  badge.earned 
                    ? 'bg-sky-50/50 border-sky-200 shadow-sm' 
                    : 'bg-gray-50/60 border-gray-200 opacity-50'
                }`}
              >
                <div>
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-3xl mb-4 mx-auto ring-4 ring-sky-100">
                    {badge.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{badge.description}</p>
                </div>

                <div className="w-full pt-3 border-t border-gray-100">
                  {badge.earned ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <ShieldCheck size={13} /> ปลดล็อกแล้ว ({badge.earned_date})
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-gray-400">
                      ยังไม่ปลดล็อก
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Modal */}
        {showCertificateModal && certificate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative border-8 border-sky-100 animate-in zoom-in-95">
              
              <button
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 text-sm font-bold"
              >
                ✕ ปิด
              </button>

              {/* Certificate Canvas Mock */}
              <div className="border-4 border-sky-600/30 p-8 rounded-2xl text-center relative bg-gradient-to-b from-sky-50/30 via-white to-sky-50/20">
                <div className="w-16 h-16 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg ring-4 ring-sky-200">
                  ธรรม
                </div>

                <span className="text-xs uppercase tracking-widest text-sky-800 font-bold block mb-1">
                  THANAVUDDHO DIGITAL LIBRARY
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                  วุฒิบัตรธรรมศึกษาดิจิทัล
                </h2>
                <p className="text-xs text-gray-500 mb-6">
                  Certificate of Digital Dhamma Mastery
                </p>

                <p className="text-xs text-gray-600 mb-2">ขอมอบวุฒิบัตรฉบับนี้ให้แก่</p>
                <div className="text-2xl font-bold text-sky-900 border-b-2 border-sky-400 inline-block px-8 pb-1 mb-4 font-serif">
                  {certificate.user_name}
                </div>

                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
                  ได้ผ่านการประเมินความรู้ความเข้าใจหลักธรรมคำสอนของพระสัมมาสัมพุทธเจ้าและพระครูปลัดสุวัฒนโพธิคุณ ครบถ้วนทุกหมวดหมู่ ด้วยผลคะแนน <span className="font-bold text-sky-700">{certificate.score}%</span>
                </p>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-6 border-t border-sky-200/80">
                  <div className="text-left">
                    <div>รหัสอ้างอิง: <span className="font-mono font-bold text-gray-700">{certificate.certificate_code}</span></div>
                    <div>วันที่อนุมัติ: {certificate.issued_at}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sky-800">พระครูปลัดสุวัฒนโพธิคุณ</div>
                    <div className="text-[10px] text-gray-400">ประธานอำนวยการวิทยาทาน</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => alert('ดาวน์โหลดใบประกาศนียบัตรสำเร็จ (จำลองไฟล์ PDF)')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Download size={14} /> ดาวน์โหลดใบประกาศ (PDF)
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function QuizGamificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    }>
      <QuizGamificationContent />
    </Suspense>
  );
}
