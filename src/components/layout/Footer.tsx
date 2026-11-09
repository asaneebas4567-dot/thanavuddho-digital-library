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
    <footer className="bg-white border-t border-[#DCEAF3] pt-12 pb-16 sm:pb-20 mt-auto relative z-10 text-[#243447]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 bg-[#079FE8] text-white rounded-xl flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform border border-white/80">
                ถ
              </div>
              <span className="font-extrabold text-xl text-[#073B65] tracking-tight">
                Thanavuddho <span className="text-[#079FE8] font-black">Library</span>
              </span>
            </Link>
            <p className="text-[#64748B] text-sm mb-6 leading-relaxed">
              รวบรวมองค์ความรู้และผลงานของ พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) เพื่อการศึกษาและพัฒนาจิตใจ
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/ThanavuddhoStory" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" title="Facebook">
                <FacebookIcon size={20} />
              </a>
              <a href="https://www.tiktok.com/@thanavuddhostory" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors" title="TikTok">
                <TiktokIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#079FE8]">
                <Mail size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#079FE8]">
                <Phone size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-[#073B65] mb-4">คลังสื่อการเรียนรู้</h3>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li><Link href="/books" className="hover:text-[#079FE8] transition-colors">หนังสือธรรมะดิจิทัล</Link></li>
              <li><Link href="/audios" className="hover:text-[#079FE8] transition-colors">หนังสือเสียง & Podcast</Link></li>
              <li><Link href="/videos" className="hover:text-[#079FE8] transition-colors">วิดีโอเทศนา (พร้อม Timestamps)</Link></li>
              <li><Link href="/articles" className="hover:text-[#079FE8] transition-colors">ข้อคิดธรรมะสร้างปัญญา</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-[#073B65] mb-4">ระบบและนวัตกรรม</h3>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li><Link href="/quiz" className="hover:text-[#079FE8] transition-colors">แบบทดสอบ XP & เกียรติบัตร</Link></li>
              <li><Link href="/rewards" className="hover:text-[#079FE8] transition-colors">ร้านแลกของรางวัลธรรมะ</Link></li>
              <li><Link href="/chatbot" className="hover:text-[#079FE8] transition-colors">AI ธรรมะถามตอบอัจฉริยะ</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#079FE8] transition-colors">ชั้นหนังสือส่วนบุคคล</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[#073B65] mb-4">ติดต่อและการใช้งาน</h3>
            <p className="text-sm text-[#64748B] mb-2">
              เปิดอ่านออนไลน์ฟรีเพื่อการศึกษาและเผยแผ่พระพุทธศาสนา
            </p>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Thanavuddho Digital Library. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
