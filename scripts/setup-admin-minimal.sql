-- ============================================
-- 最简版：设置管理员权限
-- 用户邮箱: 107251567@qq.com
-- ============================================

-- 方案1: 如果 profiles 表已存在且用户已在表中
-- ============================================

UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 验证结果
SELECT email, is_admin, coins 
FROM profiles 
WHERE email = '107251567@qq.com';

-- ============================================
-- 如果上面的命令返回空结果，说明用户不在 profiles 表中
-- 请执行下面的完整版本
-- ============================================

-- 方案2: 完整版（如果方案1失败）
-- ============================================

-- 2.1 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = '107251567@qq.com';

-- 2.2 添加用户到 profiles 表
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

-- 2.3 验证结果
SELECT 
  email as "邮箱",
  display_name as "昵称",
  is_admin as "管理员",
  coins as "金币"
FROM profiles
WHERE email = '107251567@qq.com';

-- ============================================
-- 预期结果：
-- 邮箱: 107251567@qq.com
-- 管理员: true
-- 
-- 如果看到 is_admin = true，说明设置成功！
-- ============================================
