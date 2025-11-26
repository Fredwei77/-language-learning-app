-- ============================================
-- 简单版：创建表并设置管理员
-- 用户邮箱: 107251567@qq.com
-- ============================================

-- 1. 创建 profiles 表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
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
WHERE email = '107251567@qq.com';

-- 3. 添加用户并设置为管理员
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT 
  id,
  email,
  split_part(email, '@', 1),
  true
FROM auth.users
WHERE email = '107251567@qq.com';

-- 4. 查看结果
SELECT 
  email,
  display_name,
  is_admin,
  coins
FROM profiles
WHERE email = '107251567@qq.com';

-- ============================================
-- 预期结果：
-- email: 107251567@qq.com
-- display_name: 107251567
-- is_admin: true
-- coins: 0
-- ============================================
