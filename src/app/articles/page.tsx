import { dhamma as articles } from '@/data/mockData';
import ArticlesClient from './ArticlesClient';

export const metadata = {
  title: 'ข้อคิดธรรมะสร้างปัญญา | Thanavuddho Digital Library',
  description: 'คลังข้อคิดธรรมะและมรดกธรรมคำสอน โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ M.D., Ph.D.)',
};

export default function ArticlesPage() {
  return <ArticlesClient initialArticles={articles} />;
}
