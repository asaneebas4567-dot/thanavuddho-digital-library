-- ==============================================================================
-- THANAVUDDHO DIGITAL LIBRARY: ENTERPRISE DATABASE SCHEMA & SEED DATA
-- Database Engine: PostgreSQL / Supabase
-- Architecture: 5 Integrated Systems (Digital Library, Database Management,
--               Media Storage, Member System, Points & Gamification Rewards)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. SYSTEM 1 & 2: DIGITAL LIBRARY & DATABASE MANAGEMENT (CONTENT ENTITIES)
-- ==============================================================================

-- Table: authors (ข้อมูลผู้แต่ง / พระวิทยากร)
CREATE TABLE IF NOT EXISTS public.authors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) DEFAULT 'พระราชาคณะ / ผู้บรรยายธรรม',
    monastic_title VARCHAR(255) DEFAULT 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    biography TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: categories (หมวดหมู่สื่อและธรรมะ)
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(50) PRIMARY KEY,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'BookOpen',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: books (คลังหนังสือดิจิทัล)
CREATE TABLE IF NOT EXISTS public.books (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id VARCHAR(50) REFERENCES public.authors(id) ON DELETE SET NULL,
    category_id VARCHAR(50) REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    cover_image_url TEXT,
    pdf_storage_path TEXT, -- เส้นทางไฟล์ใน Supabase Storage Bucket 'library-pdfs'
    reader_url TEXT,
    page_count INT DEFAULT 0,
    publication_year INT DEFAULT 2567,
    language VARCHAR(10) DEFAULT 'th',
    is_copyright BOOLEAN DEFAULT TRUE,
    copyright_notice VARCHAR(255) DEFAULT 'ได้รับอนุญาตเผยแพร่ถูกต้องตามธรรมวินัยและลิขสิทธิ์ศูนย์เผยแผ่',
    publisher VARCHAR(255) DEFAULT 'มูลนิธิธรรมะคุ้มครองโลก',
    view_count INT DEFAULT 0,
    read_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: articles (บทความธรรมะ)
CREATE TABLE IF NOT EXISTS public.articles (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id VARCHAR(50) REFERENCES public.authors(id) ON DELETE SET NULL,
    category_id VARCHAR(50) REFERENCES public.categories(id) ON DELETE SET NULL,
    summary TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    reading_time_minutes INT DEFAULT 5,
    view_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: videos (คลังสื่อธรรมบรรยายและวิดีโอ)
CREATE TABLE IF NOT EXISTS public.videos (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    youtube_id VARCHAR(50),
    video_storage_path TEXT,
    description TEXT,
    duration VARCHAR(50),
    duration_seconds INT DEFAULT 0,
    category_id VARCHAR(50) REFERENCES public.categories(id) ON DELETE SET NULL,
    thumbnail_url TEXT,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: podcasts (พอดแคสต์และหนังสือเสียง Audiobooks)
CREATE TABLE IF NOT EXISTS public.podcasts (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    host VARCHAR(255) DEFAULT 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    description TEXT,
    cover_image_url TEXT,
    audio_url TEXT,
    duration VARCHAR(50),
    total_episodes INT DEFAULT 1,
    category_id VARCHAR(50) REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 3. SYSTEM 3: MEDIA UPLOAD & STORAGE TRACKING
-- ==============================================================================

-- Table: media_files (บันทึกข้อมูลและพิกัดไฟล์ทั้งหมดใน Supabase Storage)
CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    bucket_name VARCHAR(100) NOT NULL, -- เช่น 'library-pdfs', 'book-covers', 'audio-tracks'
    storage_path TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size_bytes BIGINT,
    entity_type VARCHAR(50), -- 'book', 'article', 'video', 'podcast'
    entity_id VARCHAR(100),
    uploaded_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 4. SYSTEM 4: MEMBER SYSTEM (AUTHENTICATION & USER PROFILES)
-- ==============================================================================

-- Table: profiles (ข้อมูลสมาชิกห้องสมุด เชื่อมต่อ Supabase Auth / Google OAuth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- ตรงกับ auth.users.id ใน Supabase
    member_card_id VARCHAR(50) UNIQUE NOT NULL, -- เช่น 69001, 69002
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
    age_range VARCHAR(50),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Table: loans (ระบบยืม-คืนสื่อดิจิทัลและหนังสือ)
CREATE TABLE IF NOT EXISTS public.loans (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    media_id VARCHAR(100) NOT NULL,
    media_type VARCHAR(50) NOT NULL CHECK (media_type IN ('book', 'audiobook', 'video')),
    media_title VARCHAR(255) NOT NULL,
    media_cover TEXT,
    borrowed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    returned_at TIMESTAMP WITH TIME ZONE,
    renewal_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue'))
);

-- ==============================================================================
-- 5. SYSTEM 5: POINT & REWARD SYSTEM (GAMIFICATION & MOTIVATION)
-- ==============================================================================

-- Table: user_points (ยอดคะแนนสะสมและโควตารายวัน)
CREATE TABLE IF NOT EXISTS public.user_points (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    available_points INT DEFAULT 0 CHECK (available_points >= 0),
    total_earned INT DEFAULT 0,
    daily_learning_points INT DEFAULT 0, -- โควตาการเรียนรู้สบายๆ (เพดาน 100 P/วัน)
    daily_cap INT DEFAULT 100,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: point_transactions (ประวัติธุรกรรมแต้ม ละเอียด ป้องกันการทุจริต)
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    activity_type VARCHAR(50) NOT NULL, -- 'read_chapter', 'read_book_finish', 'read_article', 'watch_video', 'listen_podcast', 'quest_completed', 'reward_redeem'
    points INT NOT NULL, -- ค่าบวก (ได้รับ) หรือ ค่าลบ (ใช้แลกรางวัล)
    title VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: book_read_progress (บันทึกความคืบหน้าการอ่าน ป้องกันกดข้ามหน้าเพื่อปั๊มแต้ม)
CREATE TABLE IF NOT EXISTS public.book_read_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id VARCHAR(100) NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    current_page INT DEFAULT 1,
    total_pages INT DEFAULT 1,
    chapters_read INT DEFAULT 0,
    is_finished BOOLEAN DEFAULT FALSE,
    points_awarded INT DEFAULT 0,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (user_email, book_id)
);

-- Table: reward_items (ตารางรายการของรางวัลที่เปิดให้แลก)
CREATE TABLE IF NOT EXISTS public.reward_items (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'books', 'souvenirs', 'amulets', 'audio_digital'
    points_required INT NOT NULL CHECK (points_required > 0),
    stock INT DEFAULT 0,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: reward_redemptions (รายการขอแลกของรางวัล)
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
    id VARCHAR(100) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    reward_id VARCHAR(50) REFERENCES public.reward_items(id) ON DELETE RESTRICT,
    reward_title VARCHAR(255) NOT NULL,
    points_spent INT NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'shipping', 'completed', 'cancelled')),
    tracking_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 6. INDEXES FOR HIGH-PERFORMANCE SEARCH & RETRIEVAL
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_loans_user ON public.loans(user_email, status);
CREATE INDEX IF NOT EXISTS idx_point_tx_user ON public.point_transactions(user_email);
CREATE INDEX IF NOT EXISTS idx_read_progress_user ON public.book_read_progress(user_email, book_id);

-- ==============================================================================
-- 7. SEED DATA (ข้อมูลตั้งต้นจริงของพระครูปลัดสุวัฒนโพธิคุณ)
-- ==============================================================================

-- 7.1 Author
INSERT INTO public.authors (id, name, title, monastic_title, biography, avatar_url)
VALUES (
    'author_001',
    'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    'ประธานศูนย์เผยแผ่ธรรมะเพื่อประชาชน',
    'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ, M.D., Ph.D.)',
    'พระมหาเถระผู้ทรงภูมิรู้ทั้งทางโลกและทางธรรม สำเร็จการศึกษาแพทยศาสตรบัณฑิต จุฬาลงกรณ์มหาวิทยาลัย และปริญญาเอกด้านพุทธศาสตร์จากมหาวิทยาลัยโตเกียว ประเทศญี่ปุ่น อุทิศตนเผยแผ่พระพุทธศาสนาและพัฒนาปัญญาให้ประชาชน',
    '/images/author-somchai.jpg'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 7.2 Categories
INSERT INTO public.categories (id, name_th, name_en, slug, description, icon, display_order)
VALUES
    ('c1', 'มงคลชีวิต 38 ประการ', '38 Blessings of Life', 'mongkol-38', 'หลักธรรมนำชีวิตสู่ความเจริญก้าวหน้าสูงสุด 38 ประการ', 'Sparkles', 1),
    ('c2', 'ธรรมะพัฒนาตนเอง & จิตใจ', 'Self-Development', 'self-development', 'ศิลปะการบริหารใจ การจัดการความเครียด และความสุขในชีวิต', 'Heart', 2),
    ('c3', 'สมาธิและปัญญาบริสุทธิ์', 'Meditation & Wisdom', 'meditation', 'ศาสตร์การทำใจหยุดนิ่ง เข้าถึงความสุขอันแท้จริงภายใน', 'Sun', 3),
    ('c4', 'ธรรมะเพื่อครอบครัวและการทำงาน', 'Work & Family', 'work-family', 'การประยุกต์ธรรมะในชีวิตประจำวัน ที่ทำงาน และความสัมพันธ์', 'Briefcase', 4)
ON CONFLICT (id) DO UPDATE SET name_th = EXCLUDED.name_th;

-- 7.3 Real Books Seed Data
INSERT INTO public.books (id, title, author_id, category_id, description, cover_image_url, pdf_storage_path, reader_url, page_count, publication_year, is_copyright, status, featured)
VALUES
    (
        'book_mongkol_chiwit_124',
        'มงคลชีวิต 38 ประการ (ฉบับสมบูรณ์)',
        'author_001',
        'c1',
        'แผนที่ชีวิตสู่ความเจริญก้าวหน้าทั้งทางโลกและทางธรรม ถ่ายทอดมงคลชีวิตครบทั้ง 38 ประการอย่างลึกซึ้ง เข้าใจง่าย และนำไปปฏิบัติได้จริง',
        '/images/books/mongkol38-cover.jpg',
        'library-pdfs/mongkol_38_complete.pdf',
        '/reader/book_mongkol_chiwit_124',
        450,
        2567,
        TRUE,
        'published',
        TRUE
    ),
    (
        'book_อย่ามโน',
        'อย่ามโน',
        'author_001',
        'c2',
        'หนังสือธรรมะข้อคิดเตือนสติ ชวนมองโลกตามความเป็นจริง หลุดพ้นจากความคิดปรุงแต่งที่สร้างทุกข์ สู่ใจที่สงบและรู้เท่าทันสถานการณ์',
        '/images/books/อย่ามโน.jpg',
        'library-pdfs/ya_mano.pdf',
        'https://drive.google.com/file/d/10qPuIeb6qDu_yBvy5hfW2NVz90CTL4Bw/preview',
        80,
        2567,
        TRUE,
        'published',
        TRUE
    ),
    (
        'book_สมดุลเท่ากับดี',
        'สมดุลเท่ากับดี',
        'author_001',
        'c2',
        'ศาสตร์แห่งความพอดีในวิถีชีวิตยุคใหม่ เมื่อร่างกายและจิตใจประสานสอดคล้อง ความสำเร็จย่อมตามมาอย่างยั่งยืน',
        '/images/books/สมดุลเท่ากับดี.jpg',
        'library-pdfs/somdul_tao_kub_dee.pdf',
        'https://drive.google.com/file/d/1nrKJA-8NwHpJ2URJ-ey0b-QV8Fgt7EvN/preview',
        132,
        2567,
        TRUE,
        'published',
        TRUE
    ),
    (
        'book_tam_jai_hai_prom_buak',
        'ทำใจให้พร้อมบวก',
        'author_001',
        'c2',
        'เปลี่ยนอุปสรรคและแรงเสียดทานในชีวิตให้กลายเป็นพลังบวก ด้วยธรรมะปรับใจเพื่อรับมือกับทุกความท้าทาย',
        '/images/books/tam-jai-hai-prom-buak.jpg',
        'library-pdfs/tam_jai_hai_prom_buak.pdf',
        '/reader/book_tam_jai_hai_prom_buak',
        110,
        2567,
        TRUE,
        'published',
        TRUE
    ),
    (
        'book_ตามหลวงพี่ไปโกอินเตอร์',
        'ตามหลวงพี่ไปโกอินเตอร์',
        'author_001',
        'c4',
        'บันทึกการเดินทางและมุมมองการเผยแผ่พระพุทธศาสนาในระดับสากล เปิดโลกทัศน์ชาวพุทธยุคไร้พรมแดน',
        '/images/books/ตามหลวงพี่ไปโกอินเตอร์.jpg',
        'library-pdfs/follow_monk_international.pdf',
        'https://drive.google.com/file/d/1PE-59asHvaOuxrdxNy2qNzKmgZRdeIoE/preview',
        61,
        2567,
        TRUE,
        'published',
        FALSE
    )
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 7.4 Reward Items Seed Data
INSERT INTO public.reward_items (id, title, category, points_required, stock, description, image_url)
VALUES
    ('rew-01', 'หนังสือมงคลชีวิต 38 ประการ (ฉบับพิมพ์รูปเล่มปกแข็ง)', 'books', 1000, 50, 'หนังสือรูปเล่มจริงปกแข็งพิมพ์ 4 สี กระดาษถนอมสายตา จัดส่งฟรีถึงบ้าน', '/images/rewards/book-mongkol.jpg'),
    ('rew-02', 'หนังสือธรรมะพร้อมลายเซ็นและคำอวยพรจากพระอาจารย์', 'books', 2000, 20, 'หนังสือรุ่นพิเศษพร้อมลายเซ็นและคติธรรมมงคลเฉพาะบุคคล', '/images/rewards/signed-book.jpg'),
    ('rew-03', 'เข็มกลัดที่ระลึกกัลยาณมิตร & ของที่ระลึกธรรมบรรณาการ', 'souvenirs', 3000, 30, 'ของที่ระลึกสั่งทำพิเศษสำหรับผู้บำเพ็ญปัญญาบารมีในห้องสมุดดิจิทัล', '/images/rewards/pin.jpg'),
    ('rew-04', 'กรอบภาพธรรมะมงคลที่ระลึกพิเศษพร้อมบทเจริญพุทธมนต์', 'souvenirs', 4000, 10, 'ภาพศิลป์ธรรมะมงคลพร้อมกรอบทองหรูหราทรงคุณค่า', '/images/rewards/special-frame.jpg')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES FOR ACADEMIC BEST PRACTICES
-- ==============================================================================
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- 8.1 Books are readable by all (Public Read)
CREATE POLICY "Public can view published books" 
ON public.books FOR SELECT USING (status = 'published');

-- 8.2 Profiles: users can only read/edit their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 8.3 Points & Loans: users can only view their own records
CREATE POLICY "Users view own points" 
ON public.user_points FOR SELECT USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users view own loans" 
ON public.loans FOR SELECT USING (auth.jwt() ->> 'email' = user_email);

