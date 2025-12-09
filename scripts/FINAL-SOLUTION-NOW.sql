-- ============================================
-- 最终解决方案 - 完全重建 gifts 系统
-- ============================================

-- 1. 删除所有相关对象
DROP TABLE IF EXISTS public.gifts CASCADE;
DROP FUNCTION IF EXISTS update_gifts_updated_at() CASCADE;

-- 2. 创建 gifts 表（简化版，无 created_by）
CREATE TABLE public.gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT NOT NULL,
  description_en TEXT NOT NULL,
  coins INTEGER NOT NULL CHECK (coins > 0),
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('physical', 'digital', 'privilege')),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX idx_gifts_category ON public.gifts(category);
CREATE INDEX idx_gifts_is_active ON public.gifts(is_active);
CREATE INDEX idx_gifts_created_at ON public.gifts(created_at DESC);

-- 4. 禁用 RLS（简化调试）
ALTER TABLE public.gifts DISABLE ROW LEVEL SECURITY;

-- 5. 创建更新触发器
CREATE OR REPLACE FUNCTION update_gifts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gifts_updated_at
BEFORE UPDATE ON public.gifts
FOR EACH ROW
EXECUTE FUNCTION update_gifts_updated_at();

-- 6. 插入测试数据
INSERT INTO public.gifts (
  name_zh, name_en, description_zh, description_en, 
  coins, category, stock, is_active
) VALUES 
(
  '金色童书',
  'Little Golden Books',
  'Richard Scarry 理查德·斯凯瑞，1919年6月出生于美国波士顿中产家庭。经典儿童读物系列。',
  'Richard Scarry was born in Boston, Massachusetts in 1919. Classic children''s books series.',
  1000,
  'physical',
  5,
  true
);

-- 7. 验证
SELECT 
  '✅ 表创建成功' as status,
  id, name_zh, coins, stock
FROM public.gifts;

SELECT 
  '✅ RLS状态' as status,
  tablename,
  rowsecurity as "RLS已禁用(应为false)"
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'gifts';
