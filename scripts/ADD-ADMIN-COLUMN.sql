-- ============================================
-- 添加 is_admin 列并设置管理员
-- ============================================

-- 步骤1: 添加 is_admin 列到 profiles 表
ALTER TABLE profiles 
ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- 步骤2: 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com';

-- 步骤3: 添加用户到 profiles（如果不存在）
INSERT INTO profiles (id, email, display_name)
SELECT id, email, split_part(email, '@', 1)
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO NOTHING;

-- 步骤4: 设置管理员
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 步骤5: 查看结果
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
-- is_admin: true
-- ============================================
