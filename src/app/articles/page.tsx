import { dhamma as articles } from '@/data/mockData';
import ArticlesClient from './ArticlesClient';

export const metadata = {
  title: 'บทความธรรมะสร้างปัญญา | Thanavuddho Digital Library',
  description: 'คลังบทความและมรดกธรรมคำสอน โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ M.D., Ph.D.)',
};

export default function ArticlesPage() {
  return <ArticlesClient initialArticles={articles} />;
}
