-- ============================================
-- 修复 Storage RLS 策略
-- 解决 "new row violates row-level security policy" 错误
-- ============================================

-- 步骤1: 删除所有现有的 storage.objects 策略
-- ============================================
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own uploads" ON storage.objects;

-- 步骤2: 创建新的策略（更宽松的权限）
-- ============================================

-- 允许所有人查看 gift-images 中的图片
CREATE POLICY "gift_images_public_access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gift-images');

-- 允许所有认证用户上传到 gift-images
CREATE POLICY "gift_images_authenticated_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gift-images');

-- 允许所有认证用户更新 gift-images 中的文件
CREATE POLICY "gift_images_authenticated_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gift-images')
WITH CHECK (bucket_id = 'gift-images');

-- 允许所有认证用户删除 gift-images 中的文件
CREATE POLICY "gift_images_authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gift-images');

-- 步骤3: 验证策略是否创建成功
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%gift_images%'
ORDER BY policyname;

-- ============================================
-- 预期结果：应该看到 4 个策略
-- 1. gift_images_public_access (SELECT)
-- 2. gift_images_authenticated_upload (INSERT)
-- 3. gift_images_authenticated_update (UPDATE)
-- 4. gift_images_authenticated_delete (DELETE)
-- ============================================
