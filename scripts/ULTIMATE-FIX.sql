-- ============================================
-- 终极修复版：创建表并设置管理员
-- 用户邮箱: 107251567@qq.com
-- ============================================
-- 
-- 这个脚本会从零开始创建所有需要的内容
-- 
-- ============================================

-- 步骤1: 删除旧表（如果存在问题）
-- ============================================
-- 注意：这会删除所有 profiles 数据！
-- 如果你有重要数据，请先备份

-- DROP TABLE IF EXISTS profiles CASCADE;

-- 步骤2: 创建 profiles 表
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  coins INTEGER DEFAULT 0 NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 步骤3: 创建索引
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- 步骤4: 启用 RLS（行级安全）
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 步骤5: 创建 RLS 策略
-- ============================================

-- 用户可以查看自己的 profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 用户可以更新自己的 profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 管理员可以查看所有 profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 步骤6: 验证邮箱
-- ============================================

UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com'
  AND email_confirmed_at IS NULL;

-- 步骤7: 插入用户到 profiles 表并设置为管理员
-- ============================================

INSERT INTO profiles (id, email, display_name, coins, is_admin, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'nickname',
    split_part(u.email, '@', 1)
  ) as display_name,
  0 as coins,
  true as is_admin,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users u
WHERE u.email = '107251567@qq.com';

-- 步骤8: 验证结果
-- ============================================

SELECT 
  '✅ 设置完成！' as "状态",
  p.email as "邮箱",
  p.display_name as "昵称",
  p.is_admin as "管理员",
  p.coins as "金币",
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ 已验证'
    ELSE '❌ 未验证'
  END as "邮箱状态"
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = '107251567@qq.com';

-- ============================================
-- 预期结果：
-- 状态: ✅ 设置完成！
-- 邮箱: 107251567@qq.com
-- 管理员: true
-- 邮箱状态: ✅ 已验证
-- 
-- 现在可以登录并访问管理后台了！
-- http://localhost:3000/auth/login
-- http://localhost:3000/admin/gifts
-- ============================================
