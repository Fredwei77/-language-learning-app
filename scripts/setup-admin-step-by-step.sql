-- ============================================
-- 分步执行版：设置管理员权限
-- 用户邮箱: 107251567@qq.com
-- ============================================
-- 
-- 请按顺序执行每个步骤
-- 如果某个步骤出错，查看错误信息后继续下一步
-- 
-- ============================================

-- ============================================
-- 步骤1: 创建 profiles 表
-- ============================================
-- 如果表已存在，会显示 "relation already exists"，这是正常的

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  coins INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 步骤2: 添加 is_admin 列
-- ============================================
-- 如果列已存在，会显示错误，这是正常的，继续下一步

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- ============================================
-- 步骤3: 验证邮箱
-- ============================================

UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com'
  AND email_confirmed_at IS NULL;

-- 查看结果
SELECT 
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ 已验证'
    ELSE '❌ 未验证'
  END as status
FROM auth.users
WHERE email = '107251567@qq.com';

-- ============================================
-- 步骤4: 添加用户到 profiles 表
-- ============================================

INSERT INTO profiles (id, email, display_name, is_admin)
SELECT 
  id,
  email,
  split_part(email, '@', 1),
  false
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO NOTHING;

-- 查看结果
SELECT 
  email,
  display_name,
  is_admin
FROM profiles
WHERE email = '107251567@qq.com';

-- ============================================
-- 步骤5: 设置管理员权限
-- ============================================

UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- ============================================
-- 步骤6: 最终验证
-- ============================================

SELECT 
  '✅ 全部完成！' as status,
  email as "邮箱",
  display_name as "昵称",
  is_admin as "管理员",
  coins as "金币"
FROM profiles
WHERE email = '107251567@qq.com';

-- ============================================
-- 预期结果：
-- status: ✅ 全部完成！
-- 邮箱: 107251567@qq.com
-- 管理员: true
-- 
-- 如果看到 is_admin = true，说明设置成功！
-- 现在可以登录并访问管理后台了。
-- ============================================
