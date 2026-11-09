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

  // Combine user-created book quizzes with system quizzes
  const allQuizzes = useMemo(() => {
    const custom = getCustomBookQuizzes();
    return [...custom, ...quizzes];
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
          user_name: 'ศิษย์ผู้มีศรัทธาในพระธรรม',
          exam_title: 'การประมวลความรู้มหาบัณฑิตธรรมศึกษาดิจิทัล',
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
    <div className="min-h-screen bg-[#F0F8FD]/40 py-10 pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Hero (Deep Navy to Primary Blue) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#073B65] via-[#0B4E85] to-[#079FE8] text-white p-8 sm:p-12 mb-10 shadow-xl shadow-sky-950/10">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-bold border border-white/20 mb-3">
              <Trophy size={14} className="text-[#D9A441]" /> ระบบเกมมิฟิเคชัน & แบบทดสอบความรู้ (Gamification & Quiz)
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              ทดสอบปัญญาธรรม <span className="text-sky-200">4 ระดับสู่ความรู้แจ้ง</span>
            </h1>
            <p className="text-sky-100/90 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              วัดระดับความเข้าใจ สะสมคะแนน XP ปลดล็อกเหรียญตราเกียรติยศ และรับใบประกาศนียบัตร "มหาบัณฑิตธรรมศึกษาดิจิทัล" ครอบคลุมตั้งแต่รายบทจนถึงภาพรวมทั้งหมด
            </p>

            {/* User Gamification Stats Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9A441] to-[#B88328] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  ⚡
                </div>
                <div>
                  <div className="text-[11px] text-sky-200">คะแนนสะสม (Total XP)</div>
                  <div className="text-lg font-black text-[#D9A441]">{userXP.toLocaleString()} XP</div>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  🏅
                </div>
                <div>
                  <div className="text-[11px] text-sky-200">เหรียญที่ปลดล็อก</div>
                  <div className="text-lg font-black text-white">
                    {badges.filter(b => b.earned).length} / {badges.length} เหรียญ
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  📜
                </div>
                <div>
                  <div className="text-[11px] text-sky-200">วุฒิบัตรดิจิทัล</div>
                  <div className="text-lg font-black text-white">
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
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs sm:text-sm font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ข้อก่อนหน้า
                  </button>

                  {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(i => Math.min(activeQuiz.questions.length - 1, i + 1))}
                      className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 cursor-pointer"
                    >
                      ข้อถัดไป
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
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
                        <Sparkles size={16} /> ได้รับ +{activeQuiz.xp_reward} XP
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
        <div className="flex items-center gap-2 sm:gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: 'ทั้งหมด (4 ระดับ)', icon: Layers },
            { id: 'chapter', label: 'ระดับ 1: จบในบท (Chapter)', icon: BookOpen },
            { id: 'book', label: 'ระดับ 2: จบ 1 เล่ม (Book)', icon: HelpCircle },
            { id: 'category', label: 'ระดับ 3: จบในหมวด (Category)', icon: Trophy },
            { id: 'comprehensive', label: 'ระดับ 4: จบทั้งหมด (Grand Exam)', icon: GraduationCap },
          ].map(lvl => {
            const Icon = lvl.icon;
            const isActive = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#073B65] text-white shadow-md shadow-[#073B65]/20' 
                    : 'bg-white border border-[#DCEAF3] text-[#243447] hover:border-[#079FE8]'
                }`}
              >
                <Icon size={16} />
                <span>{lvl.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quiz Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredQuizzes.map(quiz => {
            const isLevel4 = quiz.level === 'comprehensive';
            return (
              <div 
                key={quiz.id}
                className={`bg-white rounded-3xl border p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all ${
                  isLevel4 ? 'border-sky-400 ring-2 ring-sky-500/20 bg-gradient-to-b from-white to-sky-50/30' : 'border-gray-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      quiz.level === 'chapter' ? 'bg-blue-50 text-blue-800' :
                      quiz.level === 'book' ? 'bg-purple-50 text-purple-800' :
                      quiz.level === 'category' ? 'bg-rose-50 text-rose-800' :
                      'bg-sky-600 text-white font-bold'
                    }`}>
                      {quiz.level_label}
                    </span>

                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <Sparkles size={12} /> +{quiz.xp_reward} XP
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                    {quiz.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {quiz.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-gray-400 space-x-3">
                    <span>{quiz.questions.length} คำถาม</span>
                    <span>จำกัดเวลา {quiz.time_limit_minutes} นาที</span>
                    <span>เกณฑ์ผ่าน {quiz.passing_score}%</span>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all shadow-sm shadow-sky-600/20 cursor-pointer"
                  >
                    <span>เริ่มทำข้อสอบ</span>
                    <ArrowRight size={14} />
                  </button>
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
