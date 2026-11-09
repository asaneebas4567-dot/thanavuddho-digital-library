-- ==============================================================================
-- SYSTEM 6: QUALITY ASSESSMENT & SURVEY FEEDBACK SYSTEM (EVALUATION & DATA TESTING)
-- Database Engine: PostgreSQL / Supabase
-- Integration: Linked with public.profiles, public.point_transactions
-- Purpose: Google Forms Evaluation Import, Satisfaction Analytics & 200 Points Awarding
-- ==============================================================================

-- 1. Table: survey_questions (ชุดข้อคำถามประเมินคุณภาพเว็บไซต์และสื่อดิจิทัล)
CREATE TABLE IF NOT EXISTS public.survey_questions (
    id VARCHAR(50) PRIMARY KEY, -- เช่น 'q_book_search', 'q_web_ui'
    category VARCHAR(50) NOT NULL CHECK (category IN ('website', 'books', 'video', 'podcast', 'article', 'general')),
    category_title_th VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'rating' CHECK (question_type IN ('rating', 'text', 'choice')),
    scale_min INT DEFAULT 1,
    scale_max INT DEFAULT 5,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Table: survey_responses (การส่งแบบประเมินรายบุคคล เชื่อมต่อสมาชิกและ Google Forms)
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id VARCHAR(100) PRIMARY KEY, -- เช่น 'resp_69001_179391000'
    form_response_id VARCHAR(100) UNIQUE NOT NULL, -- Token รหัสอ้างอิงจาก Google Forms (ป้องกันนำเข้าซ้ำ)
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- เชื่อมกับตารางสมาชิก (NULL หากเป็นบุคคลทั่วไป)
    respondent_email VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL, -- วันที่และเวลาที่ส่งแบบประเมินจาก Google Forms
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'verified', 'rejected')),
    points_awarded BOOLEAN DEFAULT FALSE, -- ได้รับแต้ม 200 แล้วหรือไม่
    points_awarded_at TIMESTAMP WITH TIME ZONE,
    is_test BOOLEAN DEFAULT FALSE, -- ตัวคั่นแยกระหว่าง 'ข้อมูลทดสอบ' และ 'ข้อมูลผู้ใช้งานจริง'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Table: survey_answers (คำตอบรายข้อ เชื่อมโยง response_id และ question_id)
CREATE TABLE IF NOT EXISTS public.survey_answers (
    id VARCHAR(100) PRIMARY KEY, -- เช่น 'ans_resp1_q1'
    response_id VARCHAR(100) NOT NULL REFERENCES public.survey_responses(id) ON DELETE CASCADE,
    question_id VARCHAR(50) NOT NULL REFERENCES public.survey_questions(id) ON DELETE CASCADE,
    rating_value NUMERIC(3,1) CHECK (rating_value >= 1 AND rating_value <= 5), -- คะแนนความพึงพอใจ 1-5 (Likert Scale)
    text_value TEXT, -- ข้อความข้อเสนอแนะ หรือคำอธิบายเพิ่มเติม
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (response_id, question_id) -- ป้องกันการบันทึกคำตอบซ้ำในข้อเดียวกันต่อหนึ่งรอบการส่ง
);

-- ==============================================================================
-- 4. INDEXES & ANTI-DUPLICATE CONSTRAINTS (ระดับฐานข้อมูล)
-- ==============================================================================

-- ดัชนีค้นหาอีเมลและรหัสส่งฟอร์มเพื่อป้องกันข้อมูลซ้ำ
CREATE INDEX IF NOT EXISTS idx_survey_responses_email ON public.survey_responses (respondent_email);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user ON public.survey_responses (user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_is_test ON public.survey_responses (is_test);
CREATE INDEX IF NOT EXISTS idx_survey_answers_response ON public.survey_answers (response_id);
CREATE INDEX IF NOT EXISTS idx_survey_answers_question ON public.survey_answers (question_id);

-- กฎความปลอดภัยระดับฐานข้อมูล: ป้องกันสมาชิกหนึ่งคนได้รับคะแนนแบบประเมิน 'website_survey' เกิน 1 ครั้งอย่างเด็ดขาด
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_survey_reward
ON public.point_transactions (user_email, activity_type)
WHERE activity_type = 'website_survey';

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_answers ENABLE ROW LEVEL SECURITY;

-- 5.1 survey_questions: บุคคลทั่วไปและสมาชิกสามารถอ่านชุดคำถามได้
DROP POLICY IF EXISTS "Public can view active survey questions" ON public.survey_questions;
CREATE POLICY "Public can view active survey questions"
    ON public.survey_questions FOR SELECT
    USING (is_active = true);

-- 5.2 survey_responses: ผู้ส่งสามารถเพิ่มข้อมูลการประเมินได้
DROP POLICY IF EXISTS "Users can insert survey responses" ON public.survey_responses;
CREATE POLICY "Users can insert survey responses"
    ON public.survey_responses FOR INSERT
    WITH CHECK (true);

-- สมาชิกสามารถดูเฉพาะผลการประเมินของตนเอง
DROP POLICY IF EXISTS "Users can view own survey responses" ON public.survey_responses;
CREATE POLICY "Users can view own survey responses"
    ON public.survey_responses FOR SELECT
    USING (auth.jwt() ->> 'email' = respondent_email);

-- แอดมินสามารถดูและจัดการข้อมูลแบบประเมินทั้งหมด
DROP POLICY IF EXISTS "Admins can manage all survey responses" ON public.survey_responses;
CREATE POLICY "Admins can manage all survey responses"
    ON public.survey_responses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 5.3 survey_answers: ผู้ส่งสามารถเพิ่มคำตอบได้
DROP POLICY IF EXISTS "Users can insert survey answers" ON public.survey_answers;
CREATE POLICY "Users can insert survey answers"
    ON public.survey_answers FOR INSERT
    WITH CHECK (true);

-- แอดมินสามารถดูและจัดการคำตอบทั้งหมด
DROP POLICY IF EXISTS "Admins can manage all survey answers" ON public.survey_answers;
CREATE POLICY "Admins can manage all survey answers"
    ON public.survey_answers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- ==============================================================================
-- 6. SEED DATA: มาตรฐานชุดคำถามประเมินคุณภาพเว็บไซต์และหนังสือดิจิทัล
-- ==============================================================================

INSERT INTO public.survey_questions (id, category, categoryTitleTh, questionText, questionType, scaleMin, scaleMax, displayOrder)
VALUES
    ('q_book_search', 'books', 'หนังสือดิจิทัล & E-Books', 'ความสะดวกรวดเร็วในการค้นหาและเข้าถึงหนังสือธรรมะที่ต้องการ', 'rating', 1, 5, 1),
    ('q_book_reader', 'books', 'หนังสือดิจิทัล & E-Books', 'คุณภาพความคมชัดของไฟล์ PDF และความลื่นไหลในการเปิดอ่านหนังสือ (Flipbook)', 'rating', 1, 5, 2),
    ('q_web_design', 'website', 'ระบบเว็บไซต์ & สถาปัตยกรรมสารสนเทศ', 'ความสวยงาม ทันสมัย และความง่ายในการใช้งานหน้าตาเว็บไซต์ (UI/UX)', 'rating', 1, 5, 3),
    ('q_media_video', 'video', 'สื่อวิดีโอธรรมบรรยาย', 'คุณภาพความคมชัดของวิดีโอและความสะดวกของระบบบทถอดเสียง (Transcript)', 'rating', 1, 5, 4),
    ('q_media_podcast', 'podcast', 'พอดแคสต์ & หนังสือเสียง', 'คุณภาพเสียงบรรยายและความมีประโยชน์ของรายการพอดแคสต์ธรรมะ', 'rating', 1, 5, 5),
    ('q_articles_knowledge', 'article', 'คลังบทความธรรมะ', 'ความน่าสนใจ ความถูกต้อง และคุณค่าของบทความธรรมะในการนำไปใช้ในชีวิตจริง', 'rating', 1, 5, 6),
    ('q_gamification_rewards', 'website', 'ระบบแต้มสะสมและสิทธิประโยชน์', 'ความสนุกและความพึงพอใจต่อระบบสะสมแต้มบุญปัญญาและของรางวัล', 'rating', 1, 5, 7),
    ('q_overall_recommendation', 'general', 'ภาพรวม & ข้อเสนอแนะ', 'ข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุงและพัฒนาห้องสมุดดิจิทัล Thanavuddho Library', 'text', NULL, NULL, 8)
ON CONFLICT (id) DO UPDATE SET
    questionText = EXCLUDED.questionText,
    categoryTitleTh = EXCLUDED.categoryTitleTh,
    displayOrder = EXCLUDED.displayOrder;

