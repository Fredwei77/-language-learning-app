-- ============================================
-- 创建 gift-images Storage Bucket
-- 用于商品图片上传
-- ============================================

-- 步骤1: 创建 bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gift-images',
  'gift-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 步骤2: 设置访问策略
-- ============================================

-- 允许所有人查看图片（公开访问）
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gift-images');

-- 允许认证用户上传图片
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gift-images' 
  AND auth.role() = 'authenticated'
);

-- 允许认证用户更新图片
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gift-images' 
  AND auth.role() = 'authenticated'
);

-- 允许认证用户删除图片
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gift-images' 
  AND auth.role() = 'authenticated'
);

-- 步骤3: 验证创建结果
-- ============================================
SELECT 
  '✅ Bucket 创建成功！' as status,
  id,
  name,
  public as "是否公开",
  file_size_limit as "文件大小限制(bytes)",
  allowed_mime_types as "允许的文件类型",
  created_at as "创建时间"
FROM storage.buckets
WHERE id = 'gift-images';

-- ============================================
-- 预期结果：
-- ✅ Bucket 创建成功！
-- id: gift-images
-- 是否公开: true
-- 文件大小限制: 5242880 (5MB)
-- 允许的文件类型: {image/jpeg, image/jpg, image/png, image/webp, image/gif}
-- ============================================
