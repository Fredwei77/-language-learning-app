-- ============================================
-- 简化 gifts 表的 RLS 策略
-- 临时使用更宽松的策略来排查问题
-- ============================================

-- 步骤1: 删除所有现有策略
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active gifts" ON public.gifts;
DROP POLICY IF EXISTS "Admins can view all gifts" ON public.gifts;
DROP POLICY IF EXISTS "Admins can insert gifts" ON public.gifts;
DROP POLICY IF EXISTS "Admins can update gifts" ON public.gifts;
DROP POLICY IF EXISTS "Admins can delete gifts" ON public.gifts;
DROP POLICY IF EXISTS "Admins can manage gifts" ON public.gifts;

-- 步骤2: 创建简单的策略
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

-- 认证用户可以插入商品（临时）
CREATE POLICY "authenticated_insert"
ON public.gifts FOR INSERT
TO authenticated
WITH CHECK (true);

-- 认证用户可以更新商品（临时）
CREATE POLICY "authenticated_update"
ON public.gifts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 认证用户可以删除商品（临时）
CREATE POLICY "authenticated_delete"
ON public.gifts FOR DELETE
TO authenticated
USING (true);

-- 步骤3: 验证策略
-- ============================================
SELECT 
  '✅ 策略列表' as status,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'gifts'
  AND schemaname = 'public'
ORDER BY policyname;

-- ============================================
-- 注意：这些是临时的宽松策略
-- 排查问题后，应该恢复更严格的管理员检查
-- ============================================
