-- ============================================
-- 创建 gifts 商品表
-- ============================================

-- 步骤1: 创建 gifts 表
-- ============================================
CREATE TABLE IF NOT EXISTS public.gifts (
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
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 步骤2: 创建索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_gifts_category ON public.gifts(category);
CREATE INDEX IF NOT EXISTS idx_gifts_is_active ON public.gifts(is_active);
CREATE INDEX IF NOT EXISTS idx_gifts_created_at ON public.gifts(created_at DESC);

-- 步骤3: 启用 RLS
-- ============================================
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- 步骤4: 删除旧策略（如果存在）
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active gifts" ON public.gifts;
DROP POLICY IF EXISTS "Admins can manage gifts" ON public.gifts;

-- 步骤5: 创建新策略
-- ============================================

-- 所有人可以查看激活的商品
CREATE POLICY "Anyone can view active gifts"
ON public.gifts FOR SELECT
USING (is_active = true);

-- 管理员可以查看所有商品
CREATE POLICY "Admins can view all gifts"
ON public.gifts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 管理员可以插入商品
CREATE POLICY "Admins can insert gifts"
ON public.gifts FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 管理员可以更新商品
CREATE POLICY "Admins can update gifts"
ON public.gifts FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 管理员可以删除商品
CREATE POLICY "Admins can delete gifts"
ON public.gifts FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 步骤6: 创建更新时间触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_gifts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_gifts_updated_at ON public.gifts;
CREATE TRIGGER update_gifts_updated_at
BEFORE UPDATE ON public.gifts
FOR EACH ROW
EXECUTE FUNCTION update_gifts_updated_at();

-- 步骤7: 验证表是否创建成功
-- ============================================
SELECT 
  '✅ gifts 表创建成功！' as status,
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'gifts';

-- 验证策略
SELECT 
  '✅ 策略列表' as status,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'gifts'
  AND schemaname = 'public'
ORDER BY policyname;

-- ============================================
-- 预期结果：
-- 1. 应该看到 gifts 表已创建
-- 2. 应该看到 5 个策略
-- ============================================
