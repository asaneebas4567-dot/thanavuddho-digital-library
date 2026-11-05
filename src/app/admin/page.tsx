import Link from 'next/link';
import { Users, BookOpen, Video, Eye, Plus, Edit, Trash2, Database } from 'lucide-react';
import { books, users } from '@/lib/mock-data';

export default function AdminDashboard() {
  const stats = [
    { label: 'หนังสือทั้งหมด', value: books.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'วิดีโอธรรมเทศนา', value: '15', icon: Video, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'ผู้ใช้งานระบบ', value: users.length, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'จำนวนการเข้าชม', value: '12,540', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ผู้ดูแลระบบ</h1>
            <p className="mt-2 text-gray-600">จัดการข้อมูลและเนื้อหาในห้องสมุดดิจิทัล</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/admin/database"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-5 py-2.5 rounded-xl font-bold hover:from-emerald-500 hover:to-teal-600 transition-all shadow-md active:scale-95 text-sm border border-emerald-500/40"
            >
              <Database size={18} className="text-emerald-200" />
              <span>ศูนย์จัดการฐานข้อมูล (Database) 🗄️</span>
            </Link>
            <Link
              href="/admin/rewards"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 py-2.5 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all shadow-md active:scale-95 text-sm"
            >
              <Plus size={18} />
              <span>จัดการของรางวัล & คำสั่งแลก 🎁</span>
            </Link>
            <Link
              href="/admin/videos"
              className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-rose-500 hover:to-red-500 transition-all shadow-md active:scale-95 text-sm"
            >
              <Video size={18} />
              <span>คลังวิดีโอ & Fallback 🎬</span>
            </Link>
            <Link
              href="/admin/quests"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 px-5 py-2.5 rounded-xl font-black hover:from-amber-400 hover:to-yellow-400 transition-all shadow-md active:scale-95 text-sm"
            >
              <Plus size={18} />
              <span>จัดการ Quest & Easter Eggs 🧭</span>
            </Link>
            <Link
              href="/admin/import-pdf"
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-red-700 hover:to-rose-700 transition-all shadow-md active:scale-95 text-sm"
            >
              <Plus size={18} />
              <span>นำเข้า PDF & สกัดปกอัตโนมัติ</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Management Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">จัดการหนังสือล่าสุด</h2>
            <div className="flex gap-2">
              <select className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500">
                <option>ทั้งหมด</option>
                <option>หนังสือ</option>
                <option>บทความ</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-sm text-gray-500">
                  <th className="px-6 py-4 font-medium">ชื่อหนังสือ</th>
                  <th className="px-6 py-4 font-medium">หมวดหมู่</th>
                  <th className="px-6 py-4 font-medium">สถานะ</th>
                  <th className="px-6 py-4 font-medium">ยอดอ่าน</th>
                  <th className="px-6 py-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {books.map((book) => (
                  <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-gray-500">หนังสือธรรมะ</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {book.status === 'published' ? 'เผยแพร่' : 'แบบร่าง'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{book.read_count.toLocaleString()}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="แก้ไข">
                        <Edit size={18} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="ลบ">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 text-center">
            <button className="text-amber-600 font-medium text-sm hover:text-amber-700 transition-colors">
              ดูข้อมูลทั้งหมด
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
