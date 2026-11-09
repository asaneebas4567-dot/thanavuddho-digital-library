'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  User, 
  Mail,
  Phone,
  Calendar,
  LogOut, 
  BookMarked,
  KeyRound,
  Sparkles,
  Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

declare global {
  interface Window {
    google?: any;
  }
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const { 
    user, 
    isAuthenticated, 
    loginWithGoogleCredential,
    loginWithCredentials,
    registerMember,
    logout 
  } = useAuth();

  // Tab State: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAgeRange, setRegAgeRange] = useState('18-25 ปี');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Google GSI
  const [googleClientId, setGoogleClientId] = useState<string>(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
  );
  const [showConfigModal, setShowConfigModal] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Load custom client ID if present
  useEffect(() => {
    try {
      const savedClientId = localStorage.getItem('thanavuddho_custom_google_client_id');
      if (savedClientId) {
        setGoogleClientId(savedClientId);
      }
    } catch {}
  }, []);

  // Initialize Google Identity Services SDK
  useEffect(() => {
    if (!googleClientId || isAuthenticated) return;
    let isMounted = true;

    const initGsi = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;

      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId.trim(),
          callback: async (response: any) => {
            if (!isMounted) return;
            if (response.credential) {
              setIsSubmitting(true);
              setAuthError(null);
              const res = await loginWithGoogleCredential(response.credential);
              setIsSubmitting(false);

              if (res.success) {
                setAuthSuccess('เข้าสู่ระบบสำเร็จ กำลังพาไปยังหน้าของท่าน...');
                setTimeout(() => {
                  router.push(redirectUrl);
                }, 1200);
              } else {
                setAuthError(res.message);
              }
            }
          },
          auto_select: false,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            shape: 'pill',
            text: 'signin_with',
            logo_alignment: 'left',
            width: 280,
          });
        }
      } catch (err: any) {
        console.error('Google GSI error:', err);
      }
    };

    if (!document.getElementById('google-gsi-client')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (isMounted) initGsi();
      };
      document.body.appendChild(script);
    } else {
      initGsi();
    }

    return () => {
      isMounted = false;
    };
  }, [googleClientId, isAuthenticated]);

  // Handle Member Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!loginIdentifier.trim()) {
      setAuthError('กรุณากรอกอีเมลหรือเบอร์โทรศัพท์');
      return;
    }
    if (!loginPassword) {
      setAuthError('กรุณากรอกรหัสผ่าน');
      return;
    }

    setIsSubmitting(true);
    const res = await loginWithCredentials(loginIdentifier.trim(), loginPassword);
    setIsSubmitting(false);

    if (res.success) {
      setAuthSuccess('เข้าสู่ระบบสำเร็จ กำลังพาไปยังหน้าของท่าน...');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    } else {
      setAuthError(res.message);
    }
  };

  // Handle Member Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!regName.trim()) {
      setAuthError('กรุณากรอกชื่อ-นามสกุล หรือนามเรียก');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setAuthError('กรุณากรอกอีเมลที่ถูกต้อง');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setIsSubmitting(true);
    const res = await registerMember({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      ageRange: regAgeRange,
      password: regPassword,
    });
    setIsSubmitting(false);

    if (res.success) {
      setAuthSuccess('สมัครสมาชิกสำเร็จ! บัญชีของท่านถูกสร้างเรียบร้อยแล้ว');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1200);
    } else {
      setAuthError(res.message);
    }
  };

  const handleSaveCustomClientId = (newId: string) => {
    const trimmed = newId.trim();
    setGoogleClientId(trimmed);
    try {
      localStorage.setItem('thanavuddho_custom_google_client_id', trimmed);
    } catch {}
    setShowConfigModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-lg w-full">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>กลับหน้าหลักห้องสมุด</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 overflow-hidden relative">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md mb-3">
              ฐ
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ระบบสมาชิกห้องสมุดดิจิทัล
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              ฐานข้อมูลสมาชิกจริง ผูกบัญชีด้วยอีเมลและเบอร์โทรศัพท์ เพื่อบันทึกประวัติการยืม-คืน
            </p>
          </div>

          {/* Already Logged In State */}
          {isAuthenticated && user ? (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/90">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-13 h-13 rounded-full overflow-hidden bg-slate-200 relative shrink-0 border-2 border-sky-500 shadow-xs">
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-sky-600 text-white flex items-center justify-center font-black">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-slate-900 text-sm truncate">{user.name}</h3>
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-600 truncate">{user.email}</p>
                    {user.phone && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone size={10} /> {user.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sky-200/60 text-xs text-slate-700">
                  <div className="bg-white/90 p-2 rounded-xl border border-sky-200/50">
                    <span className="text-[10px] text-slate-400 block">เลขบัตรสมาชิก</span>
                    <span className="font-mono font-bold text-sky-900">{user.memberCardId || `MB-${user.id.slice(-6)}`}</span>
                  </div>
                  <div className="bg-white/90 p-2 rounded-xl border border-sky-200/50">
                    <span className="text-[10px] text-slate-400 block">ช่วงอายุ / แต้มสะสม</span>
                    <span className="font-bold text-slate-800">{user.ageRange || 'ทั่วไป'} • 🪙 {user.points} แต้ม</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href={redirectUrl}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all text-center"
                >
                  <BookMarked size={14} />
                  <span>ไปที่ชั้นหนังสือ</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Alert Status */}
              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle size={15} className="text-rose-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* Tabs: Sign In / Register */}
              <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setAuthError(null); }}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  เข้าสู่ระบบสมาชิก
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setAuthError(null); }}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  สมัครสมาชิกใหม่ (ผูกอีเมล/เบอร์)
                </button>
              </div>

              {/* TAB 1: LOGIN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      อีเมล หรือ เบอร์โทรศัพท์
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User size={15} />
                      </div>
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="กรอกอีเมล หรือ เบอร์โทร 10 หลัก"
                        required
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      รหัสผ่าน
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock size={15} />
                      </div>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="กรอกรหัสผ่านของท่าน"
                        required
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                  </button>
                </form>
              )}

              {/* TAB 2: REGISTER FORM */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ชื่อ-นามสกุล หรือ นามเรียก <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User size={15} />
                      </div>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="เช่น สมชาย ใจดี"
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      อีเมล (สำหรับผูกบัญชีหลัก) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail size={15} />
                      </div>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        เบอร์โทรศัพท์ (ผูกบัญชี)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone size={15} />
                        </div>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="เช่น 0812345678"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ช่วงอายุ <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Calendar size={15} />
                        </div>
                        <select
                          value={regAgeRange}
                          onChange={(e) => setRegAgeRange(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900 bg-white"
                        >
                          <option value="ต่ำกว่า 18 ปี">ต่ำกว่า 18 ปี</option>
                          <option value="18-25 ปี">18-25 ปี (มหาวิทยาลัย)</option>
                          <option value="26-40 ปี">26-40 ปี (วัยทำงาน)</option>
                          <option value="41-60 ปี">41-60 ปี</option>
                          <option value="60 ปีขึ้นไป">60 ปีขึ้นไป</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        รหัสผ่าน <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock size={15} />
                        </div>
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="อย่างน้อย 6 ตัวอักษร"
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ยืนยันรหัสผ่าน <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock size={15} />
                        </div>
                        <input
                          type="password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="พิมพ์รหัสผ่านซ้ำอีกครั้ง"
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 mt-1"
                  >
                    {isSubmitting ? 'กำลังบันทึกข้อมูลสมาชิก...' : 'ยืนยันการสมัครสมาชิก'}
                  </button>
                </form>
              )}

              {/* Divider for Google Sign In */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-400 font-bold">หรือ</span>
                </div>
              </div>

              {/* Google Sign In Area */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Sparkles size={12} className="text-sky-600" />
                    <span>เข้าสู่ระบบด้วย Google Account</span>
                  </span>
                  <button
                    onClick={() => setShowConfigModal(true)}
                    className="text-[10px] font-bold text-sky-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Settings size={10} />
                    <span>ตั้งค่า Client ID</span>
                  </button>
                </div>

                <div className="flex justify-center min-h-[44px] items-center">
                  {!googleClientId ? (
                    <button
                      onClick={() => setShowConfigModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      <KeyRound size={12} className="text-sky-600" />
                      <span>ใส่ Google OAuth Client ID เพื่อเชื่อมต่อ</span>
                    </button>
                  ) : (
                    <div ref={googleBtnRef} className="flex justify-center" />
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>ฐานข้อมูลจัดเก็บจริงบนเซิร์ฟเวอร์</span>
            <span className="font-mono">มาตรฐานปริญญานิพนธ์</span>
          </div>

        </div>

        {/* Google Client ID Modal */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                ตั้งค่า Google OAuth Client ID
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                ท่านสามารถนำ Client ID จาก Google Cloud Console มาใส่เพื่อเปิดใช้งานปุ่ม Google Sign-in แบบเชื่อมต่อจริงได้ทันที
              </p>
              <input
                type="text"
                defaultValue={googleClientId}
                placeholder="xxxxxx.apps.googleusercontent.com"
                id="modal-client-id"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 mb-4 font-mono text-slate-900"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('modal-client-id') as HTMLInputElement;
                    if (el) handleSaveCustomClientId(el.value);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
                >
                  บันทึก Client ID
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">กำลังโหลดหน้าระบบสมาชิก...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
