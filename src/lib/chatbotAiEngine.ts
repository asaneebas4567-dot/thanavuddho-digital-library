/**
 * ระบบประมวลผลคำตอบผู้ช่วยธรรมะอัจฉริยะ (Thanavuddho Dhamma AI Advisor Engine)
 * ประสานงานระบบสืบค้น 3 ระดับ (Multi-Tier Retrieval) และระบบจริยธรรมชีวิต (Ethics Guardrail)
 * ยึดหลัก: ตอบจากหลักฐานจริง ไม่คาดเดา และระบุระดับความน่าเชื่อถืออย่างชัดเจน
 */

import type { GroundedAnswerResult, DhammaEvidenceLevel } from './dhammaSynthesisEngine';
import { DhammaCitation, ChatMessage } from '@/types';

export type { DhammaEvidenceLevel };

export interface BotResponseResult extends GroundedAnswerResult {}

/**
 * ฟังก์ชันสร้างคำตอบหลัก (เรียกผ่าน /api/chat ฝั่ง Server หรือประมวลผลด้วย Grounded Synthesis Engine โดยตรง)
 */
export async function generateAiDhammaAnswer(
  query: string,
  history: ChatMessage[] = []
): Promise<BotResponseResult> {
  const cleanQ = (query || '').trim();
  if (!cleanQ) {
    return {
      answerText: 'เจริญพร กรุณาระบุคำถามหรือหัวข้อธรรมะที่ท่านสนใจ เพื่อให้ระบบสืบค้นคำสอนที่ตรงประเด็นจากคลังข้อมูล',
      citations: [],
      evidenceLevel: 'unverified_or_no_evidence',
      evidenceBadgeText: '⚪ ยังไม่พบคำสอนหรือข้อมูลที่ยืนยันได้ในระบบ'
    };
  }

  // 1. ลองเรียกผ่าน Server API Route /api/chat ก่อน หากทำงานในสภาพแวดล้อม Browser
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cleanQ, history })
      });

      if (res.ok) {
        const data = await res.json();
        return {
          answerText: data.answerText,
          citations: data.citations || [],
          categoryBadge: data.categoryBadge || 'คำแนะนำหลักธรรม',
          evidenceLevel: data.evidenceLevel || 'unverified_or_no_evidence',
          evidenceBadgeText: data.evidenceBadgeText || '⚪ ยังไม่พบคำสอนหรือข้อมูลที่ยืนยันได้ในระบบ',
          matchedCount: data.matchedCount || (data.citations || []).length,
          sourceContextTitle: data.sourceContextTitle,
          isLiveWebSearch: data.isLiveWebSearch,
          situation: data.situation,
          missingAspectNotice: data.missingAspectNotice
        };
      }
    } catch {
      // หากเครือข่ายขัดข้อง ให้ประมวลผลผ่าน Grounded Engine โดยตรง
    }
  }

  // 2. Direct Grounded Synthesis (Server / Local Fallback)
  const { synthesizeGroundedDhammaAnswer } = await import('./dhammaSynthesisEngine');
  return await synthesizeGroundedDhammaAnswer(cleanQ, history);
}
