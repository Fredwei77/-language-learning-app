-- ============================================
-- 修复版：一键设置管理员权限
-- 用户邮箱: 107251567@qq.com
-- ============================================

-- 步骤1: 验证用户邮箱（修复版）
-- ============================================

UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = '107251567@qq.com'
  AND email_confirmed_at IS NULL;

-- 步骤2: 确保 profiles 表存在
-- ============================================

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

-- 步骤3: 确保用户在 profiles 表中
-- ============================================

INSERT INTO profiles (id, email, display_name, coins, is_admin, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'nickname',
    u.raw_user_meta_data->>'display_name',
    split_part(u.email, '@', 1)
  ) as display_name,
  0 as coins,
  false as is_admin,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users u
WHERE u.email = '107251567@qq.com'
ON CONFLICT (id) DO UPDATE 
SET 
  email = EXCLUDED.email,
  display_name = COALESCE(profiles.display_name, EXCLUDED.display_name),
  updated_at = NOW();

-- 步骤4: 设置管理员权限
-- ============================================

UPDATE profiles 
SET 
  is_admin = true,
  updated_at = NOW()
WHERE email = '107251567@qq.com';

-- 步骤5: 验证设置结果
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
  END as "邮箱状态",
  p.created_at as "创建时间"
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = '107251567@qq.com';

-- ============================================
-- 如果上面的查询显示：
-- 管理员: true
-- 邮箱状态: ✅ 已验证
-- 
-- 说明设置成功！现在可以登录了。
-- ============================================
