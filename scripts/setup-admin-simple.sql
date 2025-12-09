-- ============================================
-- 简化版：设置管理员权限
-- 用户邮箱: 107251567@qq.com
-- ============================================
-- 
-- 这个脚本分步执行，更安全可靠
-- 
-- ============================================

-- 第1步: 验证邮箱（如果需要）
-- ============================================

DO $$ 
BEGIN
  -- 只更新未验证的邮箱
  UPDATE auth.users 
  SET email_confirmed_at = NOW()
  WHERE email = '107251567@qq.com'
    AND email_confirmed_at IS NULL;
  
  RAISE NOTICE '✅ 步骤1完成：邮箱验证';
END $$;

-- 第2步: 确保用户在 profiles 表中
-- ============================================

DO $$ 
DECLARE
  user_id UUID;
  user_email TEXT;
  user_nickname TEXT;
BEGIN
  -- 获取用户信息
  SELECT id, email, 
         COALESCE(raw_user_meta_data->>'nickname', split_part(email, '@', 1))
  INTO user_id, user_email, user_nickname
  FROM auth.users
  WHERE email = '107251567@qq.com';

  -- 插入或更新 profiles
  INSERT INTO profiles (id, email, display_name, coins, is_admin)
  VALUES (user_id, user_email, user_nickname, 0, false)
  ON CONFLICT (id) DO UPDATE 
  SET email = EXCLUDED.email;

  RAISE NOTICE '✅ 步骤2完成：用户已在 profiles 表中';
END $$;

-- 第3步: 设置管理员权限
-- ============================================

DO $$ 
BEGIN
  UPDATE profiles 
  SET is_admin = true 
  WHERE email = '107251567@qq.com';

  RAISE NOTICE '✅ 步骤3完成：管理员权限已设置';
END $$;

-- 第4步: 验证结果
-- ============================================

SELECT 
  '✅ 全部完成！' as "状态",
  email as "邮箱",
  display_name as "昵称",
  CASE 
    WHEN is_admin THEN '✅ 是'
    ELSE '❌ 否'
  END as "管理员",
  coins as "金币"
FROM profiles
WHERE email = '107251567@qq.com';

-- ============================================
-- 预期结果：
-- 状态: ✅ 全部完成！
-- 邮箱: 107251567@qq.com
-- 管理员: ✅ 是
-- 
-- 现在可以登录并访问管理后台了！
-- http://localhost:3000/admin/gifts
-- ============================================
