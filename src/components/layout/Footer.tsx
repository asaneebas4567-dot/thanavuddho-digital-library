import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TiktokIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-white/20 backdrop-blur-xl border-t border-white/40 pt-12 pb-16 sm:pb-20 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 bg-sky-500 text-white rounded-xl flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform border border-sky-200/60">
                ถ
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                Thanavuddho <span className="text-sky-600 font-extrabold">Library</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm mb-6">
              รวบรวมองค์ความรู้และผลงานของ พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) เพื่อการศึกษาและพัฒนาจิตใจ
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/ThanavuddhoStory" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" title="Facebook">
                <FacebookIcon size={20} />
              </a>
              <a href="https://www.tiktok.com/@thanavuddhostory" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors" title="TikTok">
                <TiktokIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-600">
                <Mail size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-600">
                <Phone size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">คลังสื่อการเรียนรู้</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/books" className="hover:text-sky-600">หนังสือธรรมะดิจิทัล</Link></li>
              <li><Link href="/audios" className="hover:text-sky-600">หนังสือเสียง & Podcast</Link></li>
              <li><Link href="/videos" className="hover:text-sky-600">วิดีโอเทศนา (พร้อม Timestamps)</Link></li>
              <li><Link href="/articles" className="hover:text-sky-600">บทความธรรมะสร้างปัญญา</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">ระบบและนวัตกรรม</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/quiz" className="hover:text-sky-600 font-semibold text-sky-700">เกมมิฟิเคชัน & Quiz 4 ระดับ</Link></li>
              <li><Link href="/search" className="hover:text-sky-600">ระบบค้นหาอัจฉริยะ (Smart Search)</Link></li>
              <li><Link href="/chatbot" className="hover:text-sky-600">ผู้ช่วยธรรมะ AI (AI Chatbot)</Link></li>
              <li><Link href="/dashboard" className="hover:text-sky-600">ระบบยืม-คืนสื่อดิจิทัล (Digital Loan)</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">สมาชิกและข้อมูลส่วนตัว</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/dashboard" className="hover:text-sky-600">แดชบอร์ดผู้ใช้งาน</Link></li>
              <li><Link href="/dashboard" className="hover:text-sky-600">รายการสื่อที่ยืมอยู่</Link></li>
              <li><Link href="/quiz" className="hover:text-sky-600">เหรียญรางวัล & วุฒิบัตรดิจิทัล</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Thanavuddho Digital Library. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
