-- ============================================
-- 最终完整修复脚本
-- 按顺序执行，不会报错
-- ============================================

-- ============================================
-- 第一部分：修复 Storage
-- ============================================

-- 1. 删除所有 gift-images 相关的旧策略
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
    DROP POLICY IF EXISTS "gift_images_public_access" ON storage.objects;
    DROP POLICY IF EXISTS "gift_images_authenticated_upload" ON storage.objects;
    DROP POLICY IF EXISTS "gift_images_authenticated_update" ON storage.objects;
    DROP POLICY IF EXISTS "gift_images_authenticated_delete" ON storage.objects;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 2. 创建或更新 gift-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gift-images',
  'gift-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 3. 创建新的 Storage 策略
CREATE POLICY "gift_images_public_access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gift-images');

CREATE POLICY "gift_images_authenticated_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gift-images');

CREATE POLICY "gift_images_authenticated_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gift-images')
WITH CHECK (bucket_id = 'gift-images');

CREATE POLICY "gift_images_authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gift-images');

-- ============================================
-- 第二部分：修复 gifts 表
-- ============================================

-- 4. 删除旧的 gifts 表（如果存在）
DROP TABLE IF EXISTS public.gifts CASCADE;

-- 5. 创建新的 gifts 表
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

-- 6. 创建索引
CREATE INDEX idx_gifts_category ON public.gifts(category);
CREATE INDEX idx_gifts_is_active ON public.gifts(is_active);
CREATE INDEX idx_gifts_created_at ON public.gifts(created_at DESC);

-- 7. 启用 RLS
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- 8. 创建 gifts 表的 RLS 策略
CREATE POLICY "public_read_active"
ON public.gifts FOR SELECT
USING (is_active = true);

CREATE POLICY "authenticated_read_all"
ON public.gifts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_insert"
ON public.gifts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update"
ON public.gifts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_delete"
ON public.gifts FOR DELETE
TO authenticated
USING (true);

-- 9. 创建更新时间触发器
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

-- 10. 插入测试数据
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
  '金色童书',
  'Little Golden Books',
  'Richard Scarry 理查德·斯凯瑞，1919年6月出生于美国波士顿中产家庭，他父亲是一家百货商店的老板。',
  'Richard Scarry was born in Boston, Massachusetts in 1919. Classic children''s books series.',
  1000,
  'physical',
  5,
  true
);

-- ============================================
-- 验证结果
-- ============================================

-- 验证 Storage bucket
SELECT 
  '✅ Storage Bucket' as "检查项",
  id,
  name,
  public as "是否公开",
  file_size_limit as "文件大小限制"
FROM storage.buckets
WHERE id = 'gift-images';

-- 验证 Storage 策略
SELECT 
  '✅ Storage 策略' as "检查项",
  policyname as "策略名称",
  cmd as "操作"
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND policyname LIKE '%gift_images%'
ORDER BY policyname;

-- 验证 gifts 表
SELECT 
  '✅ gifts 表' as "检查项",
  table_name as "表名",
  table_schema as "架构"
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'gifts';

-- 验证 gifts 策略
SELECT 
  '✅ gifts 策略' as "检查项",
  policyname as "策略名称",
  cmd as "操作"
FROM pg_policies
WHERE tablename = 'gifts'
  AND schemaname = 'public'
ORDER BY policyname;

-- 验证测试数据
SELECT 
  '✅ 测试数据' as "检查项",
  id,
  name_zh as "商品名称",
  coins as "金币",
  stock as "库存",
  is_active as "是否激活"
FROM public.gifts;

-- ============================================
-- 完成！
-- ============================================
SELECT '🎉 所有修复完成！现在可以使用商品系统了。' as "状态";
