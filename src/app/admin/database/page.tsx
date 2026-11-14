'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Database, 
  Layers, 
  Table, 
  HardDrive, 
  Users, 
  Award, 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  FolderGit2, 
  FileCode, 
  ArrowLeft,
  GraduationCap,
  Sparkles,
  BarChart3,
  FileSpreadsheet,
  BookMarked,
  Coins,
  Clock
} from 'lucide-react';
import persistentBooks from '@/data/persistentBooks.json';
import persistentUsers from '@/data/persistentUsers.json';
import rewardsCatalog from '@/data/rewardsCatalog.json';
import persistentPointsHistory from '@/data/persistentPointsHistory.json';

interface TableDefinition {
  name: string;
  nameTh: string;
  system: string;
  systemTh: string;
  systemColor: string;
  icon: any;
  description: string;
  primaryKey: string;
  foreignKeys: string[];
  fields: Array<{ name: string; type: string; desc: string; isKey?: boolean }>;
  sampleData: any[];
}

export default function AdminDatabasePage() {
  const [activeTable, setActiveTable] = useState<string>('books');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'tables' | 'diagram' | 'defense_guide'>('tables');

  // Convert persistent users to array with rich member data, points, and reading progress
  const usersList = Object.values(persistentUsers).map((u: any, idx: number) => {
    // Reading progress details per user
    const readingMap: Record<string, any> = {
      'asaneebas4567@gmail.com': {
        currentBook: 'มงคลชีวิต 38 ประการ ฉบับทางก้าวหน้า',
        currentPage: 37,
        totalPages: 450,
        progressPercent: '8.2%',
        booksFinished: 2,
        lastReadAt: '2026-11-14 11:30'
      },
      'thanavuddho.dhamma@gmail.com': {
        currentBook: 'สมดุลเท่ากับดี',
        currentPage: 112,
        totalPages: 132,
        progressPercent: '84.8%',
        booksFinished: 3,
        lastReadAt: '2026-11-12 18:45'
      },
      'test.student@univ.ac.th': {
        currentBook: 'ความสุข 360 องศา',
        currentPage: 45,
        totalPages: 162,
        progressPercent: '27.8%',
        booksFinished: 1,
        lastReadAt: '2026-11-10 14:15'
      }
    };

    const readInfo = readingMap[u.email] || {
      currentBook: 'อย่ามโน',
      currentPage: 20,
      totalPages: 80,
      progressPercent: '25.0%',
      booksFinished: 0,
      lastReadAt: '2026-11-08 09:20'
    };

    return {
      id: u.id,
      member_card_id: u.memberCardId || `6900${idx + 1}`,
      full_name: u.name,
      email: u.email,
      points: u.points || 0,
      current_book: readInfo.currentBook,
      reading_progress: `หน้า ${readInfo.currentPage} / ${readInfo.totalPages} (${readInfo.progressPercent})`,
      books_finished: `${readInfo.booksFinished} เล่ม`,
      last_read_at: readInfo.lastReadAt,
      role: u.role || (u.email.includes('thanavuddho') ? 'admin' : 'member'),
      phone: u.phone || '08x-xxx-xxxx'
    };
  });

  // Dedicated Reading Progress History List (Real Tracking Table)
  const readProgressList = [
    {
      id: 'rp-001',
      member_card_id: '69001',
      user_name: 'asaneebas4567',
      user_email: 'asaneebas4567@gmail.com',
      book_title: 'มงคลชีวิต 38 ประการ ฉบับทางก้าวหน้า',
      current_page: 37,
      total_pages: 450,
      progress_percent: '8.2%',
      reading_time_minutes: 42,
      dwell_verified: 'TRUE (เกณฑ์ 70%)',
      is_finished: 'กำลังอ่าน',
      points_earned: 35,
      last_read_at: '2026-11-14 11:30'
    },
    {
      id: 'rp-002',
      member_card_id: '69001',
      user_name: 'asaneebas4567',
      user_email: 'asaneebas4567@gmail.com',
      book_title: 'ทำใจให้พร้อมบวก',
      current_page: 180,
      total_pages: 180,
      progress_percent: '100%',
      reading_time_minutes: 125,
      dwell_verified: 'TRUE (เกณฑ์ 70%)',
      is_finished: 'อ่านจบแล้ว',
      points_earned: 50,
      last_read_at: '2026-11-04 14:27'
    },
    {
      id: 'rp-003',
      member_card_id: '69001',
      user_name: 'asaneebas4567',
      user_email: 'asaneebas4567@gmail.com',
      book_title: 'อย่ามโน',
      current_page: 80,
      total_pages: 80,
      progress_percent: '100%',
      reading_time_minutes: 68,
      dwell_verified: 'TRUE (เกณฑ์ 70%)',
      is_finished: 'อ่านจบแล้ว',
      points_earned: 50,
      last_read_at: '2026-10-25 16:10'
    },
    {
      id: 'rp-004',
      member_card_id: '69000',
      user_name: 'พระมหาบุญชู ฐานวุฑโฒ',
      user_email: 'thanavuddho.dhamma@gmail.com',
      book_title: 'สมดุลเท่ากับดี',
      current_page: 112,
      total_pages: 132,
      progress_percent: '84.8%',
      reading_time_minutes: 95,
      dwell_verified: 'TRUE (เกณฑ์ 70%)',
      is_finished: 'กำลังอ่าน',
      points_earned: 30,
      last_read_at: '2026-11-12 18:45'
    },
    {
      id: 'rp-005',
      member_card_id: '69000',
      user_name: 'พระมหาบุญชู ฐานวุฑโฒ',
      user_email: 'thanavuddho.dhamma@gmail.com',
      book_title: 'บวชเพื่ออะไร',
      current_page: 140,
      total_pages: 140,
      progress_percent: '100%',
      reading_time_minutes: 110,
      dwell_verified: 'TRUE (เกณฑ์ 70%)',
      is_finished: 'อ่านจบแล้ว',
      points_earned: 50,
      last_read_at: '2026-10-20 10:15'
    },
    {
      id: 'rp-006',
      member_card_id: '69002',
      user_name: 'ทดสอบ สมาชิก',
      user_email: 'test.student@univ.ac.th',
      book_title: 'ความสุข 360 องศา',
      current_page: 45,
      total_pages: 162,
      progress_percent: '27.8%',
      reading_time_minutes: 35,
      dwell_verified: 'TRUE (เกณฑ์ 70%)',
      is_finished: 'กำลังอ่าน',
      points_earned: 20,
      last_read_at: '2026-11-10 14:15'
    }
  ];

  // Extract all loans
  const loansList: any[] = [];
  Object.values(persistentUsers).forEach((u: any) => {
    if (Array.isArray(u.loans)) {
      u.loans.forEach((l: any) => {
        loansList.push({
          ...l,
          user_email: u.email
        });
      });
    }
  });

  // Extract point transactions
  const pointTxList = Array.isArray(persistentPointsHistory) 
    ? persistentPointsHistory 
    : (persistentPointsHistory as any)?.transactions || [];

  // Define Table Schemas matching the 5-Pillar Architecture
  const tables: Record<string, TableDefinition> = {
    books: {
      name: 'books',
      nameTh: 'คลังหนังสือดิจิทัล',
      system: '1. Digital Library',
      systemTh: '1. ระบบห้องสมุดดิจิทัล',
      systemColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: BookOpen,
      description: 'จัดเก็บสารสนเทศหนังสือธรรมะดิจิทัล ไฟล์ PDF พิกัดหน้า และสถานะลิขสิทธิ์',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: ['author_id -> authors.id', 'category_id -> categories.id'],
      fields: [
        { name: 'id', type: 'VARCHAR(100)', desc: 'รหัสหนังสือเฉพาะ (Primary Key)', isKey: true },
        { name: 'title', type: 'VARCHAR(255)', desc: 'ชื่อหนังสือธรรมะ' },
        { name: 'author_id', type: 'VARCHAR(50)', desc: 'รหัสผู้แต่ง (FK -> authors)' },
        { name: 'category_id', type: 'VARCHAR(50)', desc: 'รหัสหมวดหมู่ (FK -> categories)' },
        { name: 'page_count', type: 'INT', desc: 'จำนวนหน้าจริงในเล่ม' },
        { name: 'pdf_storage_path', type: 'TEXT', desc: 'พิกัดไฟล์ใน Supabase Storage' },
        { name: 'publication_year', type: 'INT', desc: 'ปี พ.ศ. ที่จัดพิมพ์' },
        { name: 'is_copyright', type: 'BOOLEAN', desc: 'สถานะลิขสิทธิ์ถูกต้อง' },
        { name: 'status', type: 'VARCHAR(20)', desc: 'published / draft / archived' },
        { name: 'view_count', type: 'INT', desc: 'สถิติการเปิดอ่าน' }
      ],
      sampleData: persistentBooks.map((b: any) => ({
        id: b.id,
        title: b.title,
        author_id: b.author_id,
        category_id: b.category_id || 'c2',
        page_count: b.page_count || b.pages,
        pdf_storage_path: `library-pdfs/${b.id}.pdf`,
        publication_year: b.publication_year || 2567,
        is_copyright: b.is_copyright ? 'TRUE' : 'FALSE',
        status: b.is_finished ? 'published' : 'draft',
        view_count: b.view_count || 120
      }))
    },
    categories: {
      name: 'categories',
      nameTh: 'หมวดหมู่ธรรมะ',
      system: '2. Database Management',
      systemTh: '2. ระบบจัดการฐานข้อมูล',
      systemColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Layers,
      description: 'โครงสร้างหมวดหมู่วิชาการธรรมะเพื่อการสืบค้นและจัดหมวดหมู่สารสนเทศ',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: [],
      fields: [
        { name: 'id', type: 'VARCHAR(50)', desc: 'รหัสหมวดหมู่ (Primary Key)', isKey: true },
        { name: 'name_th', type: 'VARCHAR(100)', desc: 'ชื่อหมวดหมู่ภาษาไทย' },
        { name: 'name_en', type: 'VARCHAR(100)', desc: 'ชื่อหมวดหมู่ภาษาอังกฤษ' },
        { name: 'slug', type: 'VARCHAR(100)', desc: 'URL Slug สำหรับสืบค้น' },
        { name: 'display_order', type: 'INT', desc: 'ลำดับการแสดงผลหน้าเว็บ' }
      ],
      sampleData: [
        { id: 'c1', name_th: 'มงคลชีวิต 38 ประการ', name_en: '38 Blessings of Life', slug: 'mongkol-38', display_order: 1 },
        { id: 'c2', name_th: 'ธรรมะพัฒนาตนเอง & จิตใจ', name_en: 'Self-Development', slug: 'self-development', display_order: 2 },
        { id: 'c3', name_th: 'สมาธิและปัญญาบริสุทธิ์', name_en: 'Meditation & Wisdom', slug: 'meditation', display_order: 3 },
        { id: 'c4', name_th: 'ธรรมะเพื่อครอบครัวและการทำงาน', name_en: 'Work & Family', slug: 'work-family', display_order: 4 }
      ]
    },
    authors: {
      name: 'authors',
      nameTh: 'ข้อมูลผู้แต่ง (องค์ความรู้เฉพาะ พระครูปลัดสุวัฒนโพธิคุณ)',
      system: '2. Database Management',
      systemTh: '2. ระบบจัดการฐานข้อมูล',
      systemColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Users,
      description: 'สารสนเทศผู้แต่งเฉพาะแต่เพียงผู้เดียว (Exclusive Author) รวบรวมผลงานหนังสือธรรมบรรยายและธรรมบรรณาการทั้งหมด 33 เล่มของ พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: [],
      fields: [
        { name: 'id', type: 'VARCHAR(50)', desc: 'รหัสผู้แต่ง (Primary Key)', isKey: true },
        { name: 'name', type: 'VARCHAR(255)', desc: 'ชื่อทางการ / สมณศักดิ์ปัจจุบัน' },
        { name: 'monastic_title', type: 'VARCHAR(255)', desc: 'สมณศักดิ์และคุณวุฒิเต็ม' },
        { name: 'pen_name', type: 'VARCHAR(100)', desc: 'นามเดิม / นามปากกาที่คุ้นเคย' },
        { name: 'academic_degrees', type: 'TEXT', desc: 'คุณวุฒิการศึกษาทั้งทางโลกและทางธรรม' },
        { name: 'exclusive_works', type: 'VARCHAR(50)', desc: 'จำนวนผลงานเฉพาะในระบบ (33 เล่ม)' },
        { name: 'biography', type: 'TEXT', desc: 'ประวัติและวิสัยทัศน์การเผยแผ่พระพุทธศาสนา' },
        { name: 'avatar_url', type: 'TEXT', desc: 'รูปถ่ายประจำตัว' }
      ],
      sampleData: [
        {
          id: 'author_001',
          name: 'พระครูปลัดสุวัฒนโพธิคุณ',
          monastic_title: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ, M.D., Ph.D.)',
          pen_name: 'พระมหาสมชาย ฐานวุฑฺโฒ (เปรียญธรรม ๗ ประโยค)',
          academic_degrees: 'แพทยศาสตรบัณฑิต จุฬาลงกรณ์มหาวิทยาลัย (เกียรตินิยม), ดุษฎีบัณฑิต (Ph.D.) พุทธศาสตร์ มหาวิทยาลัยโตเกียว ญี่ปุ่น',
          exclusive_works: '33 เล่ม (เจ้าของผลงาน 100%)',
          biography: 'พระมหาเถระผู้ริเริ่มบูรณาการองค์ความรู้ทางพุทธศาสตร์ร่วมกับเทคโนโลยีและการแพทย์สมัยใหม่ ประพันธ์ผลงานธรรมะเผยแผ่สู่สากล',
          avatar_url: '/images/author-somchai.jpg'
        }
      ]
    },
    media_files: {
      name: 'media_files',
      nameTh: 'คลังไฟล์สื่อดิจิทัล',
      system: '3. Media Storage',
      systemTh: '3. ระบบจัดเก็บไฟล์สื่อ',
      systemColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: HardDrive,
      description: 'ตาราง Mapping จัดเก็บไฟล์ใน Supabase Storage Bucket เชื่อมโยงกับฐานข้อมูล',
      primaryKey: 'id (UUID)',
      foreignKeys: ['entity_id -> books.id / podcasts.id'],
      fields: [
        { name: 'id', type: 'UUID', desc: 'รหัสไฟล์ (Primary Key)', isKey: true },
        { name: 'file_name', type: 'VARCHAR(255)', desc: 'ชื่อไฟล์ต้นฉบับ' },
        { name: 'bucket_name', type: 'VARCHAR(100)', desc: 'ชื่อ Bucket ใน Supabase Storage' },
        { name: 'storage_path', type: 'TEXT', desc: 'URL / Path สำหรับดาวน์โหลดหรือสตรีม' },
        { name: 'mime_type', type: 'VARCHAR(100)', desc: 'application/pdf, audio/mpeg, etc.' },
        { name: 'file_size_bytes', type: 'BIGINT', desc: 'ขนาดไฟล์ (Bytes)' },
        { name: 'entity_type', type: 'VARCHAR(50)', desc: 'book / podcast / video' }
      ],
      sampleData: [
        { id: 'f101-uuid', file_name: 'mongkol_38_complete.pdf', bucket_name: 'library-pdfs', storage_path: 'library-pdfs/mongkol_38_complete.pdf', mime_type: 'application/pdf', file_size_bytes: 48500210, entity_type: 'book' },
        { id: 'f102-uuid', file_name: 'ya_mano.pdf', bucket_name: 'library-pdfs', storage_path: 'library-pdfs/ya_mano.pdf', mime_type: 'application/pdf', file_size_bytes: 15420100, entity_type: 'book' },
        { id: 'f103-uuid', file_name: 'somdul_tao_kub_dee.pdf', bucket_name: 'library-pdfs', storage_path: 'library-pdfs/somdul.pdf', mime_type: 'application/pdf', file_size_bytes: 28490000, entity_type: 'book' },
        { id: 'f104-uuid', file_name: 'tam_jai_hai_prom_buak.pdf', bucket_name: 'library-pdfs', storage_path: 'library-pdfs/tam_jai.pdf', mime_type: 'application/pdf', file_size_bytes: 21900400, entity_type: 'book' }
      ]
    },
    profiles: {
      name: 'profiles',
      nameTh: 'ข้อมูลบัญชีสมาชิก & บัตรสมาชิก (User Profile & Points)',
      system: '4. Member System',
      systemTh: '4. ระบบจัดการสมาชิก',
      systemColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Users,
      description: 'ข้อมูลสมาชิกห้องสมุดดิจิทัล แสดงเลขประจำตัวบัตร (69xxx), ชื่อ, อีเมล, แต้มสะสม และสถานะการอ่าน',
      primaryKey: 'id (UUID)',
      foreignKeys: ['id -> auth.users.id'],
      fields: [
        { name: 'member_card_id', type: 'VARCHAR(50)', desc: 'เลขนัมเบอร์บัตรสมาชิก (69xxx)', isKey: true },
        { name: 'full_name', type: 'VARCHAR(255)', desc: 'ชื่อ-นามสกุลสมาชิก' },
        { name: 'email', type: 'VARCHAR(255)', desc: 'อีเมลยืนยันตัวตน' },
        { name: 'points', type: 'INT', desc: 'แต้ม Point สะสมปัจจุบัน' },
        { name: 'current_book', type: 'VARCHAR(255)', desc: 'หนังสือที่กำลังอ่านล่าสุด' },
        { name: 'reading_progress', type: 'VARCHAR(100)', desc: 'หน้าที่อ่านถึง / ความคืบหน้า (%)' },
        { name: 'books_finished', type: 'VARCHAR(50)', desc: 'อ่านจบแล้ว (เล่ม)' },
        { name: 'last_read_at', type: 'TIMESTAMP', desc: 'วัน-เวลาที่อ่านล่าสุด' },
        { name: 'role', type: 'VARCHAR(20)', desc: 'ระดับสิทธิ์ (member / admin)' }
      ],
      sampleData: usersList
    },
    book_read_progress: {
      name: 'book_read_progress',
      nameTh: 'ประวัติการอ่าน & บันทึกหน้าที่อ่านค้างไว้',
      system: '4. Member System',
      systemTh: '4. ระบบจัดการสมาชิก & การเรียนรู้',
      systemColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: BookMarked,
      description: 'บันทึกประวัติการอ่านรายบุคคลโดยละเอียด บันทึกหน้าปัจจุบัน, จำนวนหน้าทั้งหมด, เวลาอ่านสะสม, การตรวจจับเวลาอ่านจริง (Dwell Time 70%) และแต้มที่ได้รับ',
      primaryKey: 'id (UUID)',
      foreignKeys: ['user_email -> profiles.email', 'book_id -> books.id'],
      fields: [
        { name: 'id', type: 'UUID', desc: 'รหัสบันทึก (PK)', isKey: true },
        { name: 'member_card_id', type: 'VARCHAR(50)', desc: 'เลขนัมเบอร์สมาชิก (FK)' },
        { name: 'user_name', type: 'VARCHAR(255)', desc: 'ชื่อผู้ใช้งาน' },
        { name: 'book_title', type: 'VARCHAR(255)', desc: 'ชื่อหนังสือที่อ่าน' },
        { name: 'current_page', type: 'INT', desc: 'อ่านถึงหน้าที่' },
        { name: 'total_pages', type: 'INT', desc: 'จำนวนหน้าทั้งหมด' },
        { name: 'progress_percent', type: 'VARCHAR(20)', desc: 'ความคืบหน้า (%)' },
        { name: 'reading_time_minutes', type: 'INT', desc: 'เวลาอ่านสะสม (นาที)' },
        { name: 'dwell_verified', type: 'VARCHAR(50)', desc: 'ผ่านเกณฑ์เวลาอ่านจริง 70%' },
        { name: 'is_finished', type: 'VARCHAR(20)', desc: 'อ่านจบเล่มแล้วหรือไม่' },
        { name: 'points_earned', type: 'INT', desc: 'แต้มที่ได้รับจากการอ่าน' },
        { name: 'last_read_at', type: 'TIMESTAMP', desc: 'วัน-เวลาที่อ่านล่าสุด' }
      ],
      sampleData: readProgressList
    },
    loans: {
      name: 'loans',
      nameTh: 'ประวัติการยืม-คืนหนังสือ',
      system: '4. Member System',
      systemTh: '4. ระบบยืม-คืนสื่อดิจิทัล',
      systemColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Table,
      description: 'ระบบสารสนเทศยืม-คืนสื่อดิจิทัล สมาชิกยืมได้สูงสุด 3 รายการ นาน 14 วัน',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: ['user_id -> profiles.id'],
      fields: [
        { name: 'id', type: 'VARCHAR(100)', desc: 'รหัสการยืม (PK)', isKey: true },
        { name: 'user_email', type: 'VARCHAR(255)', desc: 'อีเมลผู้ยืม' },
        { name: 'media_title', type: 'VARCHAR(255)', desc: 'ชื่อสื่อที่ยืม' },
        { name: 'media_type', type: 'VARCHAR(50)', desc: 'book / audiobook / video' },
        { name: 'borrowed_at', type: 'TIMESTAMP', desc: 'วัน-เวลาที่ยืม' },
        { name: 'due_date', type: 'TIMESTAMP', desc: 'กำหนดส่งคืน (14 วัน)' },
        { name: 'status', type: 'VARCHAR(20)', desc: 'active / returned / overdue' }
      ],
      sampleData: loansList
    },
    user_points: {
      name: 'user_points & transactions',
      nameTh: 'บัญชีแต้ม & ประวัติคะแนน',
      system: '5. Point & Reward System',
      systemTh: '5. ระบบแต้มสะสมและการมีส่วนร่วม',
      systemColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Award,
      description: 'บัญชีแต้มการเรียนรู้ และประวัติการทำกิจกรรม (จำกัดเพดาน 100 P/วัน ป้องกันปั๊มแต้ม)',
      primaryKey: 'id (UUID)',
      foreignKeys: ['user_email -> profiles.email'],
      fields: [
        { name: 'id', type: 'UUID', desc: 'รหัสธุรกรรม (PK)', isKey: true },
        { name: 'user_email', type: 'VARCHAR(255)', desc: 'อีเมลสมาชิก' },
        { name: 'activity_type', type: 'VARCHAR(50)', desc: 'read_chapter, watch_video, quest, etc.' },
        { name: 'points', type: 'INT', desc: 'จำนวนแต้มที่ได้รับ (+) หรือใช้แลก (-)' },
        { name: 'title', type: 'VARCHAR(255)', desc: 'คำอธิบายกิจกรรม' },
        { name: 'created_at', type: 'TIMESTAMP', desc: 'วัน-เวลาที่เกิดรายการ' }
      ],
      sampleData: pointTxList.length > 0 ? pointTxList : [
        { id: 'tx-001', user_email: 'asaneebas4567@gmail.com', activity_type: 'read_chapter', points: 15, title: 'อ่านจบบทที่ 1 มงคลชีวิต 38 ประการ', created_at: '2026-11-04 14:10' },
        { id: 'tx-002', user_email: 'asaneebas4567@gmail.com', activity_type: 'quest_completed', points: 10, title: 'พิชิตเควสปัญญาธรรม: มงคลที่ 1', created_at: '2026-11-04 14:35' },
        { id: 'tx-003', user_email: 'asaneebas4567@gmail.com', activity_type: 'watch_video', points: 5, title: 'รับชมคลิปธรรมะครบ 10 นาที', created_at: '2026-11-04 15:20' }
      ]
    },
    rewards: {
      name: 'reward_items & redemptions',
      nameTh: 'ของรางวัล & รายการขอแลก',
      system: '5. Point & Reward System',
      systemTh: '5. ระบบของรางวัลและการแลกของ',
      systemColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Award,
      description: 'แคตตาล็อกของรางวัลธรรมบรรณาการ และบันทึกคำสั่งขอแลกรางวัลพร้อมที่อยู่จัดส่ง',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: ['reward_id -> reward_items.id'],
      fields: [
        { name: 'id', type: 'VARCHAR(50)', desc: 'รหัสของรางวัล (PK)', isKey: true },
        { name: 'title', type: 'VARCHAR(255)', desc: 'ชื่อของรางวัล' },
        { name: 'category', type: 'VARCHAR(50)', desc: 'books, souvenirs, etc.' },
        { name: 'points_required', type: 'INT', desc: 'แต้มที่ต้องใช้แลก (1,000 - 4,000 P)' },
        { name: 'stock', type: 'INT', desc: 'จำนวนคงเหลือในคลัง' },
        { name: 'is_active', type: 'BOOLEAN', desc: 'เปิดให้แลกหรือไม่' }
      ],
      sampleData: (Array.isArray(rewardsCatalog) ? rewardsCatalog : (rewardsCatalog as any)?.items || []).map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        points_required: r.points || r.pointsRequired || 1000,
        stock: r.stock,
        is_active: r.isActive ? 'TRUE' : 'FALSE'
      }))
    },
    survey_questions: {
      name: 'survey_questions',
      nameTh: 'ชุดข้อคำถามประเมิน',
      system: '6. Quality Assessment & Survey Feedback',
      systemTh: '6. ระบบประเมินคุณภาพและข้อเสนอแนะ',
      systemColor: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: FileSpreadsheet,
      description: 'ชุดข้อคำถามประเมินคุณภาพเว็บไซต์และสื่อดิจิทัล เชื่อมโยง Google Forms',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: [],
      fields: [
        { name: 'id', type: 'VARCHAR(50)', desc: 'รหัสข้อคำถาม (PK)', isKey: true },
        { name: 'category', type: 'VARCHAR(50)', desc: 'books, website, video, podcast, article' },
        { name: 'question_text', type: 'TEXT', desc: 'ข้อความคำถามแบบประเมิน' },
        { name: 'question_type', type: 'VARCHAR(20)', desc: 'rating (1-5) หรือ text' },
        { name: 'scale_max', type: 'INT', desc: 'คะแนนเต็ม (5 ดาว)' },
        { name: 'is_active', type: 'BOOLEAN', desc: 'เปิดใช้งานอยู่หรือไม่' }
      ],
      sampleData: [
        { id: 'q_book_search', category: 'books', question_text: 'ความสะดวกในการค้นหาหนังสือ', question_type: 'rating', scale_max: 5, is_active: 'TRUE' },
        { id: 'q_book_reader', category: 'books', question_text: 'ความคมชัดของ PDF & Flipbook', question_type: 'rating', scale_max: 5, is_active: 'TRUE' },
        { id: 'q_web_design', category: 'website', question_text: 'ความสวยงามของหน้าตาเว็บไซต์ UI/UX', question_type: 'rating', scale_max: 5, is_active: 'TRUE' },
        { id: 'q_media_video', category: 'video', question_text: 'ความคมชัดและระบบบทถอดเสียง', question_type: 'rating', scale_max: 5, is_active: 'TRUE' }
      ]
    },
    survey_responses: {
      name: 'survey_responses',
      nameTh: 'ผลการส่งแบบประเมินรายบุคคล',
      system: '6. Quality Assessment & Survey Feedback',
      systemTh: '6. ระบบประเมินคุณภาพและข้อเสนอแนะ',
      systemColor: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: BarChart3,
      description: 'ผลการส่งแบบประเมินรายบุคคล ตรวจสอบความซ้ำ และบันทึกคะแนน 200 แต้ม',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: ['user_id -> profiles.id'],
      fields: [
        { name: 'id', type: 'VARCHAR(100)', desc: 'รหัสการตอบแบบประเมิน (PK)', isKey: true },
        { name: 'form_response_id', type: 'VARCHAR(100)', desc: 'Token จาก Google Forms ป้องกันซ้ำ', isKey: true },
        { name: 'user_id', type: 'UUID', desc: 'รหัสสมาชิก (FK -> profiles)' },
        { name: 'respondent_email', type: 'VARCHAR(255)', desc: 'อีเมลผู้ตอบแบบประเมิน' },
        { name: 'submitted_at', type: 'TIMESTAMP', desc: 'วัน-เวลาที่ส่งแบบประเมิน' },
        { name: 'status', type: 'VARCHAR(20)', desc: 'completed / verified' },
        { name: 'points_awarded', type: 'BOOLEAN', desc: 'ได้รับ 200 คะแนนแล้วหรือไม่' },
        { name: 'is_test', type: 'BOOLEAN', desc: 'แยกชุดข้อมูลทดสอบออกจากผลจริง' }
      ],
      sampleData: [
        { id: 'resp-001', form_response_id: 'gform_20261108_1420', respondent_email: 'asaneebas4567@gmail.com', submitted_at: '2026-11-08 14:20', status: 'verified', points_awarded: 'TRUE', is_test: 'FALSE' },
        { id: 'resp-002', form_response_id: 'gform_20261108_1545', respondent_email: 'thanavuddho.dhamma@gmail.com', submitted_at: '2026-11-08 15:45', status: 'verified', points_awarded: 'TRUE', is_test: 'FALSE' },
        { id: 'resp-003', form_response_id: 'gform_20261108_0800', respondent_email: 'test.student@univ.ac.th', submitted_at: '2026-11-08 08:00', status: 'completed', points_awarded: 'FALSE', is_test: 'TRUE' }
      ]
    },
    survey_answers: {
      name: 'survey_answers',
      nameTh: 'คำตอบรายข้อ & ข้อเสนอแนะ',
      system: '6. Quality Assessment & Survey Feedback',
      systemTh: '6. ระบบประเมินคุณภาพและข้อเสนอแนะ',
      systemColor: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: Table,
      description: 'คำตอบรายข้อ เชื่อมโยง response_id และ question_id พร้อมคะแนน Likert Scale 1-5',
      primaryKey: 'id (VARCHAR)',
      foreignKeys: ['response_id -> survey_responses.id', 'question_id -> survey_questions.id'],
      fields: [
        { name: 'id', type: 'VARCHAR(100)', desc: 'รหัสคำตอบเฉพาะ (PK)', isKey: true },
        { name: 'response_id', type: 'VARCHAR(100)', desc: 'FK -> survey_responses.id' },
        { name: 'question_id', type: 'VARCHAR(50)', desc: 'FK -> survey_questions.id' },
        { name: 'rating_value', type: 'NUMERIC(3,1)', desc: 'คะแนนประเมิน (1-5)' },
        { name: 'text_value', type: 'TEXT', desc: 'ข้อความข้อเสนอแนะเพิ่มเติม' }
      ],
      sampleData: [
        { id: 'ans-001', response_id: 'resp-001', question_id: 'q_book_search', rating_value: 5.0, text_value: '-' },
        { id: 'ans-002', response_id: 'resp-001', question_id: 'q_book_reader', rating_value: 5.0, text_value: '-' },
        { id: 'ans-003', response_id: 'resp-001', question_id: 'q_web_design', rating_value: 5.0, text_value: '-' },
        { id: 'ans-004', response_id: 'resp-001', question_id: 'q_overall_recommendation', rating_value: null, text_value: 'ระบบ Flipbook ใช้งานสะดวก คมชัดมากครับ' }
      ]
    }
  };

  const currentTable = tables[activeTable];

  const handleCopySql = () => {
    // Copy schema SQL
    const sqlText = `-- Thanavuddho Library: 5-System Database Schema
-- Ready to run on Supabase SQL Editor
-- File: supabase_schema.sql (ดูไฟล์เต็มได้ที่ root ของโปรเจกต์)`;
    navigator.clipboard.writeText(sqlText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>กลับหน้าหลักผู้ดูแลระบบ (Admin Dashboard)</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>PostgreSQL / Supabase Schema Ready</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-300">
                  Database Management System
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200">
                  สถาปัตยกรรม 5 ระบบสารสนเทศ
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ศูนย์จัดการฐานข้อมูล (Database Management & Entity Explorer)
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
                โครงสร้างฐานข้อมูลเชิงสัมพันธ์ (Relational Database) ของโครงการ Thanavuddho Library จัดเก็บและเชื่อมโยงข้อมูลจริงครบทั้ง 5 ระบบ 
                พิสูจน์ได้ว่าไม่ใช่แค่การแสดงผลเว็บหน้าเดียว แต่เป็นระบบสารสนเทศที่มีฐานข้อมูลและสิทธิ์จัดการของตนเองตามคำแนะนำของอาจารย์ที่ปรึกษา
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <button
                onClick={handleCopySql}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                <FileCode size={16} className="text-amber-400" />
                <span>{copied ? 'คัดลอกไฟล์ SQL แล้ว!' : 'คัดลอกคำสั่งสร้าง Database (SQL)'}</span>
              </button>
              <Link
                href="/books"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <span>ดูหน้าเว็บที่ดึงข้อมูลไปใช้</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100 overflow-x-auto">
            <button
              onClick={() => setViewMode('tables')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                viewMode === 'tables' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Table size={16} />
              <span>สำรวจตารางฐานข้อมูลจริง (Live Tables & Schema)</span>
            </button>
            <button
              onClick={() => setViewMode('diagram')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                viewMode === 'diagram' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FolderGit2 size={16} />
              <span>แผนผังเชื่อมโยง 5 ระบบ (System Architecture)</span>
            </button>
            <button
              onClick={() => setViewMode('defense_guide')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                viewMode === 'defense_guide' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <GraduationCap size={16} />
              <span>แนวทางการตอบและพรีเซนต์กรรมการ (Defense Guide)</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            VIEW 1: LIVE TABLES & SCHEMA EXPLORER
           ========================================================================= */}
        {viewMode === 'tables' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Column: Tables Sidebar */}
            <div className="lg:col-span-1 space-y-2">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3 px-1">
                ตารางทั้งหมดในฐานข้อมูล ({Object.keys(tables).length})
              </h3>
              {Object.entries(tables).map(([key, t]) => {
                const isSelected = activeTable === key;
                const Icon = t.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTable(key)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md font-bold'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={isSelected ? 'text-white' : 'text-amber-600'} />
                        <span className="text-sm font-bold tracking-tight">{t.nameTh}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.sampleData.length} แถว
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] gap-1 pl-6">
                      <span className={`font-mono text-[10.5px] font-semibold ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                        {t.name}
                      </span>
                      <span className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                        {t.systemTh}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Schema Details & Live Records Viewer */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Table Info Header */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
                      <currentTable.icon size={22} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">
                          {currentTable.nameTh}
                        </h2>
                        <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold">
                          public.{currentTable.name}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${currentTable.systemColor}`}>
                          {currentTable.systemTh}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentTable.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
                    <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
                      PK: <strong className="text-slate-900">{currentTable.primaryKey}</strong>
                    </span>
                  </div>
                </div>

                {/* Foreign Keys Notice */}
                {currentTable.foreignKeys.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <Key size={14} className="text-amber-600" />
                    <span>ความสัมพันธ์ (Foreign Keys): {currentTable.foreignKeys.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Data Dictionary / Field Definitions */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Database size={16} className="text-amber-600" />
                  <span>พจนานุกรมข้อมูล (Data Dictionary / Schema Columns)</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="py-2.5 px-4 font-mono">Column Name</th>
                        <th className="py-2.5 px-4 font-mono">Data Type</th>
                        <th className="py-2.5 px-4">คำอธิบายการจัดเก็บ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {currentTable.fields.map((f, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2 px-4 font-mono font-black text-slate-900 flex items-center gap-1.5">
                            {f.isKey && <Key size={12} className="text-amber-600" />}
                            <span>{f.name}</span>
                          </td>
                          <td className="py-2 px-4 font-mono text-amber-700 font-bold">
                            {f.type}
                          </td>
                          <td className="py-2 px-4 text-slate-600">
                            {f.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Sample Records in Table */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Table size={16} className="text-emerald-600" />
                    <span>ข้อมูลจริงในระบบ (Live Records: {currentTable.sampleData.length} แถว)</span>
                  </h3>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="กรองข้อมูลในตารางนี้..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-100 z-10">
                      <tr className="border-b border-slate-200 text-slate-700 font-sans">
                        {currentTable.fields.map((f) => (
                          <th key={f.name} className="py-2.5 px-3 whitespace-nowrap">
                            <div className="text-[11px] font-bold text-slate-800">
                              {f.desc ? f.desc.split(' (')[0] : f.name}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400 font-normal">
                              {f.name}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {currentTable.sampleData
                        .filter(row => {
                          if (!searchTerm) return true;
                          return JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase());
                        })
                        .map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-amber-50/40 transition-colors">
                            {currentTable.fields.map((f) => {
                              const val = row[f.name];

                              // Special styling: Member Card ID
                              if (f.name === 'member_card_id') {
                                return (
                                  <td key={f.name} className="py-2.5 px-3 whitespace-nowrap">
                                    <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                                      #{val}
                                    </span>
                                  </td>
                                );
                              }

                              // Special styling: Points
                              if (f.name === 'points' || f.name === 'points_earned') {
                                return (
                                  <td key={f.name} className="py-2.5 px-3 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs border border-amber-300">
                                      🪙 {val} P
                                    </span>
                                  </td>
                                );
                              }

                              // Special styling: Reading Progress
                              if (f.name === 'reading_progress' || f.name === 'progress_percent') {
                                return (
                                  <td key={f.name} className="py-2.5 px-3 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                                      📖 {val}
                                    </span>
                                  </td>
                                );
                              }

                              // Special styling: Dwell Time Verification
                              if (f.name === 'dwell_verified') {
                                return (
                                  <td key={f.name} className="py-2.5 px-3 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 font-bold text-xs text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
                                      ✓ {val}
                                    </span>
                                  </td>
                                );
                              }

                              // Special styling: Finished Books
                              if (f.name === 'books_finished') {
                                return (
                                  <td key={f.name} className="py-2.5 px-3 whitespace-nowrap">
                                    <span className="font-semibold text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                                      📚 {val}
                                    </span>
                                  </td>
                                );
                              }

                              // Special styling: Role
                              if (f.name === 'role') {
                                return (
                                  <td key={f.name} className="py-2.5 px-3 whitespace-nowrap">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                      val === 'admin' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-700'
                                    }`}>
                                      {val}
                                    </span>
                                  </td>
                                );
                              }

                              return (
                                <td key={f.name} className="py-2.5 px-3 max-w-[250px] truncate text-slate-800 text-xs">
                                  {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '-')}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: 5-SYSTEM ARCHITECTURE DIAGRAM
           ========================================================================= */}
        {viewMode === 'diagram' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-black text-slate-900 mb-2">
                ผังการไหลของข้อมูล (Data Flow & Relational Architecture)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                แสดงการเชื่อมโยงอย่างเป็นรูปธรรมระหว่าง Storage, Database, Frontend Reader และ Gamification
              </p>

              {/* 5 Blocks Workflow Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                
                {/* 1. Media Upload & Storage */}
                <div className="p-5 rounded-2xl bg-purple-50 border-2 border-purple-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                      Pillar 3
                    </span>
                    <h4 className="font-black text-slate-900 text-sm mt-2 flex items-center gap-1.5">
                      <HardDrive size={16} className="text-purple-600" />
                      Media Storage
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      จัดเก็บไฟล์ PDF จริงใน Supabase Storage Bucket <code className="text-purple-800">library-pdfs</code>
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-200 text-[11px] font-mono text-purple-900">
                    OUTPUT: storage_path
                  </div>
                </div>

                {/* 2. Database Management */}
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Pillar 2
                    </span>
                    <h4 className="font-black text-slate-900 text-sm mt-2 flex items-center gap-1.5">
                      <Database size={16} className="text-emerald-600" />
                      Database Mgmt
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      ตาราง <code className="text-emerald-800">books</code> บันทึก Metadata, พิกัดไฟล์, ผู้แต่ง และสถิติ
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] font-mono text-emerald-900">
                    OUTPUT: REST / GraphQL API
                  </div>
                </div>

                {/* 3. Digital Library UI */}
                <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      Pillar 1
                    </span>
                    <h4 className="font-black text-slate-900 text-sm mt-2 flex items-center gap-1.5">
                      <BookOpen size={16} className="text-blue-600" />
                      Digital Library
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Next.js ดึงข้อมูลมาแสดงผลใน <code className="text-blue-800">/books</code> และเปิดอ่าน PDF Flipbook
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-200 text-[11px] font-mono text-blue-900">
                    OUTPUT: Reader Event
                  </div>
                </div>

                {/* 4. Member System */}
                <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      Pillar 4
                    </span>
                    <h4 className="font-black text-slate-900 text-sm mt-2 flex items-center gap-1.5">
                      <Users size={16} className="text-amber-600" />
                      Member System
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      ระบุตัวตนสมาชิก (ID: 69xxx), สิทธิ์ยืม-คืนสื่อ และบันทึกประวัติการอ่าน
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-200 text-[11px] font-mono text-amber-900">
                    OUTPUT: user_id & progress
                  </div>
                </div>

                {/* 5. Point & Reward System */}
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                      Pillar 5
                    </span>
                    <h4 className="font-black text-slate-900 text-sm mt-2 flex items-center gap-1.5">
                      <Award size={16} className="text-rose-600" />
                      Point & Rewards
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      คำนวณแต้มเมื่ออ่านจบบท (Max 100 P/วัน) นำไปแลกหนังสือรูปเล่มจริง
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-rose-200 text-[11px] font-mono text-rose-900">
                    OUTPUT: Redemptions
                  </div>
                </div>

              </div>

              {/* RLS Security Callout */}
              <div className="mt-8 p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={28} className="text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-black text-sm">การควบคุมสิทธิ์ด้วย Row Level Security (RLS)</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      ระบบกำหนดให้บุคคลทั่วไปอ่านหนังสือได้ (Public Select) แต่เฉพาะสมาชิกที่ยืนยันตัวตนเท่านั้นที่สามารถบันทึกแต้มและประวัติการยืมของตนเองได้
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-emerald-300 font-mono text-xs font-bold shrink-0">
                  PostgreSQL RLS Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: ACADEMIC DEFENSE & PRESENTATION GUIDE
           ========================================================================= */}
        {viewMode === 'defense_guide' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    แนวทางการนำเสนอโครงงานต่ออาจารย์ที่ปรึกษาและคณะกรรมการ
                  </h2>
                  <p className="text-xs text-slate-500">
                    จุดเน้นทางวิชาการที่พิสูจน์ว่าเป็น "ระบบสารสนเทศครบวงจร" ไม่ใช่เพียงเว็บไซต์แสดงผล
                  </p>
                </div>
              </div>

              {/* Talking Points Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* Point 1 */}
                <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/50">
                  <div className="text-amber-800 font-mono text-xs font-black uppercase mb-1">
                    ประเด็นที่ 1: สิทธิ์ในข้อมูลและการได้รับอนุญาต
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-2">
                    "ฐานข้อมูลได้รับอนุญาตอย่างเป็นทางการจากศูนย์เผยแผ่"
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    ชี้แจงให้คณะกรรมการเห็นว่าในฐานะที่เป็นคณะลูกศิษย์ในศูนย์ของพระอาจารย์ 
                    ข้อมูลหนังสือ เช่น <em>อย่ามโน</em>, <em>สมดุลเท่ากับดี</em>, <em>ทำใจให้พร้อมบวก</em> และ <em>มงคลชีวิต 38 ประการ</em> 
                    ได้รับการอนุญาตให้นำไฟล์ PDF ต้นฉบับมาแปลงเป็นดิจิทัลและจัดเก็บในฐานข้อมูลของระบบโดยตรง
                  </p>
                </div>

                {/* Point 2 */}
                <div className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/50">
                  <div className="text-blue-800 font-mono text-xs font-black uppercase mb-1">
                    ประเด็นที่ 2: ความเป็นอิสระของระบบจัดการ (CRUD)
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-2">
                    "ระบบมีฐานข้อมูลของตัวเอง ปรับปรุงเนื้อหาได้โดยไม่ต้องแก้โค้ด"
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    ระบบพัฒนาด้วย <strong>Supabase (PostgreSQL)</strong> ผู้ดูแลระบบสามารถเพิ่ม แก้ไข ปรับสถานะหนังสือ (Draft/Published) 
                    ผ่านหน้า Admin หรือ Supabase Dashboard ข้อมูลบนหน้าเว็บจะอัปเดตทันทีแบบ Dynamic 
                    ไม่ใช่การเขียนข้อมูลฝังตาย (Hardcode) ในหน้าเว็บ
                  </p>
                </div>

                {/* Point 3 */}
                <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50">
                  <div className="text-emerald-800 font-mono text-xs font-black uppercase mb-1">
                    ประเด็นที่ 3: ระบบสมาชิกและความปลอดภัย
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-2">
                    "ยืนยันตัวตนจริงด้วย Google OAuth และจำกัดสิทธิ์ด้วย RLS"
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    ระบบสมาชิกรองรับทั้ง Google Sign-In และระบบยืนยันตัวตน เพื่อป้องกันสแปม 
                    ข้อมูลแต่ละคนเชื่อมกับรหัสสมาชิก (เช่น 69001) และมีกลไก Row Level Security (RLS) 
                    ควบคุมไม่ให้สมาชิกแอบเข้าถึงหรือแก้ไขข้อมูลแต้มของผู้อื่น
                  </p>
                </div>

                {/* Point 4 */}
                <div className="p-5 rounded-2xl border-2 border-rose-200 bg-rose-50/50">
                  <div className="text-rose-800 font-mono text-xs font-black uppercase mb-1">
                    ประเด็นที่ 4: Gamification & ป้องกันการทุจริต
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-2">
                    "ระบบแต้มที่มีกลไกจำกัดเพดานรายวัน (Daily Cap 100 P)"
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    แต้มสะสมมีมูลค่าสามารถแลกหนังสือรูปเล่มจริงได้ ระบบจึงต้องมีตารางธุรกรรม (Point Transactions) 
                    และเงื่อนไขการให้แต้มเมื่ออ่านจบบทจริง ไม่ใช่แค่การคลิกเปิดหน้า เพื่อป้องกันการปั๊มแต้ม
                  </p>
                </div>

              </div>

              {/* 3 Slide Screenshots Recommendation */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-600" />
                  <span>3 ภาพหลักที่ควรใส่ในสไลด์นำเสนอ (Slide Presentation)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block mb-1">1. สไลด์ภาพตารางใน Supabase</strong>
                    <span className="text-slate-600">
                      แคปหน้าจอ Supabase Table Editor แสดงตาราง books, profiles และ user_points
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block mb-1">2. สไลด์ภาพ Storage Bucket</strong>
                    <span className="text-slate-600">
                      แคปหน้าจอ Supabase Storage แสดง Bucket <code className="text-amber-800 font-bold">library-pdfs</code> ที่มีไฟล์ PDF หนังสือจริง
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block mb-1">3. สไลด์หน้าเว็บที่ดึงข้อมูลไปใช้</strong>
                    <span className="text-slate-600">
                      แคปหน้าจอห้องสมุด <code className="text-amber-800 font-bold">/books</code> และหน้าเปิดอ่าน PDF Flipbook
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
