-- ============================================
-- 最终版：一键设置管理员
-- 用户邮箱: 107251567@qq.com
-- ============================================
-- 
-- 直接复制粘贴这整个文件到 Supabase SQL Editor
-- 然后点击 Run 执行
-- 
-- ============================================

-- 1. 确保表和列存在
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  coins INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com'
  AND email_confirmed_at IS NULL;

-- 3. 添加用户并设置管理员
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT 
  id,
  email,
  split_part(email, '@', 1),
  true
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO UPDATE 
SET is_admin = true;

-- 4. 验证结果
SELECT 
  '✅ 完成' as "状态",
  email as "邮箱",
  is_admin as "管理员",
  coins as "金币"
FROM profiles
WHERE email = '107251567@qq.com';

-- ============================================
-- 预期结果：
-- 状态: ✅ 完成
-- 邮箱: 107251567@qq.com
-- 管理员: true
-- 金币: 0
-- 
-- 现在可以登录了！
-- http://localhost:3000/auth/login
-- ============================================
