-- ============================================
-- 仅设置管理员权限（表已存在）
-- 用户邮箱: 107251567@qq.com
-- ============================================
-- 
-- 使用此脚本当 profiles 表已经存在时
-- 
-- ============================================

-- 步骤1: 验证邮箱
-- ============================================

UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com'
  AND email_confirmed_at IS NULL;

-- 步骤2: 检查用户是否在 profiles 表中
-- ============================================

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM profiles WHERE email = '107251567@qq.com')
    THEN '✅ 用户已在 profiles 表中'
    ELSE '❌ 用户不在 profiles 表中'
  END as status;

-- 步骤3: 添加用户到 profiles 表（如果不存在）
-- ============================================

INSERT INTO profiles (id, email, display_name, is_admin, coins)
SELECT 
  id,
  email,
  COALESCE(
    raw_user_meta_data->>'nickname',
    split_part(email, '@', 1)
  ),
  false,
  0
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO NOTHING;

-- 步骤4: 设置管理员权限
-- ============================================

UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 步骤5: 验证结果
-- ============================================

SELECT 
  '✅ 完成！' as "状态",
  email as "邮箱",
  display_name as "昵称",
  is_admin as "管理员",
  coins as "金币"
FROM profiles
WHERE email = '107251567@qq.com';

-- ============================================
-- 预期结果：
-- 状态: ✅ 完成！
-- 邮箱: 107251567@qq.com
-- 管理员: true
-- 
-- 现在可以登录了！
-- http://localhost:3000/auth/login
-- ============================================
