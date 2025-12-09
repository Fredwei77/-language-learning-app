-- ============================================
-- 一键设置管理员权限
-- 用户邮箱: 107251567@qq.com
-- ============================================
-- 
-- 使用方法：
-- 1. 打开 Supabase Dashboard
-- 2. 进入 SQL Editor
-- 3. 复制粘贴此文件的全部内容
-- 4. 点击 Run 执行
--
-- ============================================

-- 步骤1: 确保 profiles 表存在并有 is_admin 字段
-- ============================================

-- 创建 profiles 表（如果不存在）
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

-- 添加 is_admin 字段（如果不存在）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 步骤2: 验证用户邮箱
-- ============================================

UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email = '107251567@qq.com';

-- 步骤3: 确保用户在 profiles 表中
-- ============================================

INSERT INTO profiles (id, email, display_name, coins, is_admin)
SELECT 
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'nickname',
    u.raw_user_meta_data->>'display_name',
    split_part(u.email, '@', 1)
  ) as display_name,
  0 as coins,
  false as is_admin
FROM auth.users u
WHERE u.email = '107251567@qq.com'
ON CONFLICT (id) DO UPDATE 
SET 
  email = EXCLUDED.email,
  display_name = COALESCE(profiles.display_name, EXCLUDED.display_name);

-- 步骤4: 设置管理员权限
-- ============================================

UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 步骤5: 验证设置结果
-- ============================================

SELECT 
  '✅ 设置完成！' as status,
  p.id,
  p.email,
  p.display_name,
  p.is_admin as "管理员权限",
  p.coins as "金币",
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ 已验证'
    ELSE '❌ 未验证'
  END as "邮箱状态",
  p.created_at as "创建时间"
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = '107251567@qq.com';

-- ============================================
-- 执行完成后，你应该看到：
-- 
-- status: ✅ 设置完成！
-- 管理员权限: true
-- 邮箱状态: ✅ 已验证
--
-- 现在可以登录并访问管理后台了！
-- http://localhost:3000/admin/gifts
-- ============================================
