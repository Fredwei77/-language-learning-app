-- ============================================
-- 管理员设置脚本模板
-- ============================================
-- 
-- 使用方法：
-- 1. 将 'YOUR_EMAIL_HERE' 替换为实际邮箱
-- 2. 打开 Supabase Dashboard → SQL Editor
-- 3. 复制粘贴修改后的内容
-- 4. 点击 Run 执行
--
-- ============================================

-- 🔧 配置区域 - 修改这里的邮箱
-- ============================================
DO $$ 
DECLARE
  target_email TEXT := 'YOUR_EMAIL_HERE';  -- ⚠️ 修改为你的邮箱
BEGIN
  -- 验证邮箱
  UPDATE auth.users 
  SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    confirmed_at = COALESCE(confirmed_at, NOW())
  WHERE email = target_email;

  -- 确保用户在 profiles 表中
  INSERT INTO profiles (id, email, display_name, coins, is_admin)
  SELECT 
    u.id,
    u.email,
    COALESCE(
      u.raw_user_meta_data->>'nickname',
      split_part(u.email, '@', 1)
    ),
    0,
    false
  FROM auth.users u
  WHERE u.email = target_email
  ON CONFLICT (id) DO UPDATE 
  SET email = EXCLUDED.email;

  -- 设置管理员权限
  UPDATE profiles 
  SET is_admin = true 
  WHERE email = target_email;

  -- 显示结果
  RAISE NOTICE '✅ 管理员设置完成！邮箱: %', target_email;
END $$;

-- 验证结果
SELECT 
  '✅ 设置完成' as status,
  email,
  display_name,
  is_admin,
  coins,
  created_at
FROM profiles
WHERE email = 'YOUR_EMAIL_HERE';  -- ⚠️ 修改为你的邮箱

-- ============================================
-- 批量设置多个管理员
-- ============================================

-- 取消下面的注释并修改邮箱列表
/*
UPDATE profiles 
SET is_admin = true 
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
);
*/

-- ============================================
-- 查看所有管理员
-- ============================================

SELECT 
  email,
  display_name,
  is_admin,
  coins,
  created_at
FROM profiles
WHERE is_admin = true
ORDER BY created_at DESC;
