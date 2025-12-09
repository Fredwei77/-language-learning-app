-- ============================================
-- 快速修复：直接设置管理员
-- ============================================

-- 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com';

-- 添加用户（如果不存在）
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT id, email, split_part(email, '@', 1), false
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO NOTHING;

-- 设置管理员
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 查看结果
SELECT email, is_admin, coins FROM profiles WHERE email = '107251567@qq.com';
