-- 添加沪语学习功能的数据库迁移
-- 执行日期: 2024-12-01

-- ============================================
-- 第一部分: 创建沪语词汇表
-- ============================================

CREATE TABLE IF NOT EXISTS shanghainese_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shanghainese TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  ipa TEXT,
  chinese TEXT NOT NULL,
  english TEXT NOT NULL,
  audio_url TEXT,
  category TEXT NOT NULL,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  usage TEXT,
  example TEXT,
  cultural_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_shanghainese_vocabulary_category 
ON shanghainese_vocabulary(category);

CREATE INDEX IF NOT EXISTS idx_shanghainese_vocabulary_difficulty 
ON shanghainese_vocabulary(difficulty);

CREATE INDEX IF NOT EXISTS idx_shanghainese_vocabulary_shanghainese 
ON shanghainese_vocabulary(shanghainese);

-- ============================================
-- 第二部分: 创建沪语课程表
-- ============================================

CREATE TABLE IF NOT EXISTS shanghainese_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_number INTEGER NOT NULL UNIQUE,
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description TEXT,
  content JSONB,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  objectives TEXT[],
  vocabulary_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_shanghainese_lessons_number 
ON shanghainese_lessons(lesson_number);

CREATE INDEX IF NOT EXISTS idx_shanghainese_lessons_difficulty 
ON shanghainese_lessons(difficulty);

-- ============================================
-- 第三部分: 创建沪语学习进度表
-- ============================================

CREATE TABLE IF NOT EXISTS shanghainese_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES shanghainese_lessons(id) ON DELETE CASCADE,
  vocabulary_id UUID REFERENCES shanghainese_vocabulary(id) ON DELETE CASCADE,
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
  last_practiced TIMESTAMPTZ,
  practice_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vocabulary_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_shanghainese_progress_user_id 
ON shanghainese_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_shanghainese_progress_lesson_id 
ON shanghainese_progress(lesson_id);

CREATE INDEX IF NOT EXISTS idx_shanghainese_progress_vocabulary_id 
ON shanghainese_progress(vocabulary_id);

-- ============================================
-- 第四部分: 启用RLS (行级安全)
-- ============================================

ALTER TABLE shanghainese_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE shanghainese_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE shanghainese_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 第五部分: 创建RLS策略
-- ============================================

-- 词汇表策略：所有认证用户可以查看
DROP POLICY IF EXISTS "Anyone can view vocabulary" ON shanghainese_vocabulary;
CREATE POLICY "Anyone can view vocabulary"
ON shanghainese_vocabulary FOR SELECT
TO authenticated
USING (true);

-- 管理员可以管理词汇
DROP POLICY IF EXISTS "Admins can manage vocabulary" ON shanghainese_vocabulary;
CREATE POLICY "Admins can manage vocabulary"
ON shanghainese_vocabulary FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 课程表策略：所有认证用户可以查看
DROP POLICY IF EXISTS "Anyone can view lessons" ON shanghainese_lessons;
CREATE POLICY "Anyone can view lessons"
ON shanghainese_lessons FOR SELECT
TO authenticated
USING (true);

-- 管理员可以管理课程
DROP POLICY IF EXISTS "Admins can manage lessons" ON shanghainese_lessons;
CREATE POLICY "Admins can manage lessons"
ON shanghainese_lessons FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 进度表策略：用户只能查看和管理自己的进度
DROP POLICY IF EXISTS "Users can view own progress" ON shanghainese_progress;
CREATE POLICY "Users can view own progress"
ON shanghainese_progress FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON shanghainese_progress;
CREATE POLICY "Users can insert own progress"
ON shanghainese_progress FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON shanghainese_progress;
CREATE POLICY "Users can update own progress"
ON shanghainese_progress FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own progress" ON shanghainese_progress;
CREATE POLICY "Users can delete own progress"
ON shanghainese_progress FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 管理员可以查看所有进度
DROP POLICY IF EXISTS "Admins can view all progress" ON shanghainese_progress;
CREATE POLICY "Admins can view all progress"
ON shanghainese_progress FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- ============================================
-- 第六部分: 插入初始数据
-- ============================================

-- 插入问候语词汇
INSERT INTO shanghainese_vocabulary (shanghainese, pinyin, ipa, chinese, english, category, difficulty, usage, example)
VALUES
  ('侬好', 'nóng hǎo', '/noŋ˩˧ hɔ˩˧/', '你好', 'Hello', 'greeting', 1, '最常用的问候语，适用于任何场合', '侬好！今朝天气老好额。'),
  ('早晨好', 'zǎo chén hǎo', '/tsɔ˩˧ ʦʰən˩˧ hɔ˩˧/', '早上好', 'Good morning', 'greeting', 1, '早上见面时的问候', '早晨好！吃饭了伐？'),
  ('夜快好', 'yè kuài hǎo', '/jɑ˩˧ kʰuɛ˩˧ hɔ˩˧/', '晚上好', 'Good evening', 'greeting', 1, '晚上见面时的问候', '夜快好！侬回来了？'),
  ('再会', 'zài huì', '/tsɛ˩˧ ɦuɛ˩˧/', '再见', 'Goodbye', 'greeting', 1, '告别时使用', '再会！明朝见！'),
  ('谢谢侬', 'xiè xiè nóng', '/ʑia˩˧ ʑia˩˧ noŋ˩˧/', '谢谢你', 'Thank you', 'greeting', 1, '表达感谢', '谢谢侬帮我忙！')
ON CONFLICT DO NOTHING;

-- 插入家庭称谓词汇
INSERT INTO shanghainese_vocabulary (shanghainese, pinyin, ipa, chinese, english, category, difficulty, usage, example)
VALUES
  ('阿爸', 'ā bà', '/ɑ˥ bɑ˩˧/', '爸爸', 'Father', 'family', 1, '称呼父亲', '阿爸回来了。'),
  ('阿妈', 'ā mā', '/ɑ˥ mɑ˥/', '妈妈', 'Mother', 'family', 1, '称呼母亲', '阿妈烧菜老好吃额。'),
  ('阿哥', 'ā gē', '/ɑ˥ ku˥/', '哥哥', 'Elder brother', 'family', 1, '称呼哥哥', '阿哥带我去公园。'),
  ('小弟', 'xiǎo dì', '/ɕiɔ˩˧ di˩˧/', '弟弟', 'Younger brother', 'family', 1, '称呼弟弟', '小弟还在读书。')
ON CONFLICT DO NOTHING;

-- 插入食物词汇
INSERT INTO shanghainese_vocabulary (shanghainese, pinyin, ipa, chinese, english, category, difficulty, usage, example, cultural_note)
VALUES
  ('小笼包', 'xiǎo lóng bāo', '/ɕiɔ˩˧ loŋ˩˧ pɔ˥/', '小笼包', 'Steamed soup dumplings', 'food', 1, '上海最著名的小吃', '我要吃小笼包。', '南翔小笼包最为有名，皮薄汁多'),
  ('生煎馒头', 'shēng jiān mán tou', '/sən˥ tɕiɛ˥ mɛ˩˧ dɤ˩˧/', '生煎包', 'Pan-fried buns', 'food', 1, '上海特色早餐', '早饭吃生煎馒头。', '底部金黄酥脆，上面松软多汁'),
  ('粢饭团', 'cí fàn tuán', '/tsɿ˩˧ vɛ˩˧ duɛ˩˧/', '饭团', 'Rice ball', 'food', 1, '传统上海早餐', '买只粢饭团。', '糯米包油条、榨菜、肉松等')
ON CONFLICT DO NOTHING;

-- ============================================
-- 第七部分: 创建更新时间触发器
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_shanghainese_vocabulary_updated_at ON shanghainese_vocabulary;
CREATE TRIGGER update_shanghainese_vocabulary_updated_at
  BEFORE UPDATE ON shanghainese_vocabulary
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shanghainese_lessons_updated_at ON shanghainese_lessons;
CREATE TRIGGER update_shanghainese_lessons_updated_at
  BEFORE UPDATE ON shanghainese_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shanghainese_progress_updated_at ON shanghainese_progress;
CREATE TRIGGER update_shanghainese_progress_updated_at
  BEFORE UPDATE ON shanghainese_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 完成提示
-- ============================================

DO $$
DECLARE
  vocab_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO vocab_count FROM shanghainese_vocabulary;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Shanghainese Learning Module Setup Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - shanghainese_vocabulary';
  RAISE NOTICE '  - shanghainese_lessons';
  RAISE NOTICE '  - shanghainese_progress';
  RAISE NOTICE '';
  RAISE NOTICE 'Initial vocabulary: % words', vocab_count;
  RAISE NOTICE '';
  RAISE NOTICE 'RLS policies configured';
  RAISE NOTICE 'Triggers created';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Add more vocabulary data';
  RAISE NOTICE '  2. Create lesson content';
  RAISE NOTICE '  3. Test the learning interface';
  RAISE NOTICE '========================================';
END $$;
