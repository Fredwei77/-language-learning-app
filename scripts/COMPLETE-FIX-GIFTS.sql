-- ============================================
-- 完整修复 gifts 商品系统
-- 一次性解决所有问题
-- ============================================

-- 步骤1: 删除并重建 gifts 表
-- ============================================
DROP TABLE IF EXISTS public.gifts CASCADE;

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
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 步骤2: 创建索引
-- ============================================
CREATE INDEX idx_gifts_category ON public.gifts(category);
CREATE INDEX idx_gifts_is_active ON public.gifts(is_active);
CREATE INDEX idx_gifts_created_at ON public.gifts(created_at DESC);

-- 步骤3: 启用 RLS
-- ============================================
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- 步骤4: 创建 RLS 策略（简化版）
-- ============================================

-- 所有人可以查看激活的商品
CREATE POLICY "public_read_active"
ON public.gifts FOR SELECT
USING (is_active = true);

-- 认证用户可以查看所有商品
CREATE POLICY "authenticated_read_all"
ON public.gifts FOR SELECT
TO authenticated
USING (true);

-- 认证用户可以插入商品
CREATE POLICY "authenticated_insert"
ON public.gifts FOR INSERT
TO authenticated
WITH CHECK (true);

-- 认证用户可以更新商品
CREATE POLICY "authenticated_update"
ON public.gifts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 认证用户可以删除商品
CREATE POLICY "authenticated_delete"
ON public.gifts FOR DELETE
TO authenticated
USING (true);

-- 步骤5: 创建更新时间触发器
-- ============================================
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

-- 步骤6: 插入测试数据
-- ============================================
INSERT INTO public.gifts (
  name_zh, 
  name_en, 
  description_zh, 
  description_en, 
  coins, 
  category, 
  stock,
  is_active
) VALUES 
(
  '测试商品',
  'Test Product',
  '这是一个测试商品，用于验证系统功能。',
  'This is a test product for system verification.',
  100,
  'digital',
  999,
  true
);

-- 步骤7: 验证结果
-- ============================================
SELECT 
  '✅ gifts 表创建成功！' as status,
  COUNT(*) as "商品数量"
FROM public.gifts;

SELECT 
  '✅ RLS 策略列表' as status,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'gifts'
  AND schemaname = 'public'
ORDER BY policyname;

SELECT 
  '✅ 测试数据' as status,
  id,
  name_zh,
  coins,
  stock,
  is_active
FROM public.gifts;

-- ============================================
-- 完成！现在可以正常使用商品系统了
-- ============================================
