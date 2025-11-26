-- ============================================
-- 最终修复：添加列并设置管理员
-- 用户邮箱: 107251567@qq.com
-- ============================================

-- 步骤1: 添加 is_admin 列（如果不存在）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    RAISE NOTICE '✅ 已添加 is_admin 列';
  ELSE
    RAISE NOTICE '✅ is_admin 列已存在';
  END IF;
END $$;

-- 步骤2: 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com'
  AND email_confirmed_at IS NULL;

-- 步骤3: 添加用户到 profiles（如果不存在）
INSERT INTO profiles (id, email, display_name)
SELECT 
  id,
  email,
  COALESCE(
    raw_user_meta_data->>'nickname',
    split_part(email, '@', 1)
  )
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO NOTHING;

-- 步骤4: 设置管理员
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 步骤5: 验证结果
SELECT 
  '✅ 完成！' as status,
  email,
  display_name,
  is_admin,
  coins
FROM profiles
WHERE email = '107251567@qq.com';

-- ============================================
-- 预期结果：
-- status: ✅ 完成！
-- email: 107251567@qq.com
-- is_admin: true
-- 
-- 现在可以登录了！
-- ============================================
