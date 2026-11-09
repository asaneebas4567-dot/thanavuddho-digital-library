export type SurveyCategory = 'website' | 'books' | 'video' | 'podcast' | 'article' | 'general';

export interface SurveyQuestion {
  id: string; // e.g. 'q_web_ui', 'q_book_reader'
  category: SurveyCategory;
  categoryTitleTh: string;
  questionText: string;
  questionType: 'rating' | 'text' | 'choice';
  scaleMin?: number; // 1
  scaleMax?: number; // 5
  displayOrder: number;
  isActive: boolean;
}

export interface SurveyAnswer {
  id: string;
  responseId: string;
  questionId: string;
  ratingValue?: number; // 1 to 5
  textValue?: string;
  createdAt: string;
}

export interface SurveyResponse {
  id: string; // e.g. 'resp_1793910000000_abc12'
  formResponseId: string; // Token from Google Forms (Timestamp + Email) for deduplication
  userId?: string | null; // FK to profiles (persistentUsers), null if non-member
  respondentEmail: string;
  memberCardId?: string | null; // e.g. '69001'
  userName?: string | null;
  submittedAt: string; // ISO 8601 or from Google Forms
  status: 'completed' | 'verified' | 'rejected';
  pointsAwarded: boolean; // True if 200 points have been successfully granted
  pointsAwardedAt?: string | null;
  pointTransactionId?: string | null;
  isTest: boolean; // Flag to isolate test data from real evaluations
  averageRating?: number; // Calculated overall rating (1-5)
  feedbackComment?: string | null;
  answers?: SurveyAnswer[];
  createdAt: string;
}

export interface CategorySatisfactionStat {
  category: SurveyCategory;
  nameTh: string;
  avgRating: number;
  totalRatingsCount: number;
  distribution: {
    5: number; // ดีเยี่ยม
    4: number; // ดี
    3: number; // ปานกลาง
    2: number; // พอใช้
    1: number; // ปรับปรุง
  };
}

export interface SurveyAnalytics {
  totalResponses: number;
  realResponsesCount: number;
  testResponsesCount: number;
  verifiedMembersCount: number;
  pointsAwardedCount: number;
  overallSatisfactionAverage: number; // e.g. 4.78
  categoryStats: Record<SurveyCategory, CategorySatisfactionStat>;
  questionStats: Array<{
    questionId: string;
    questionText: string;
    category: SurveyCategory;
    categoryTitleTh: string;
    avgRating: number;
    count: number;
  }>;
  recentFeedback: Array<{
    id: string;
    email: string;
    userName?: string;
    memberCardId?: string;
    comment: string;
    submittedAt: string;
    isTest: boolean;
  }>;
}

