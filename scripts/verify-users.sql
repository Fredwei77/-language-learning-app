-- 用户验证脚本
-- 在 Supabase SQL Editor 中执行

-- ============================================
-- 方案1: 验证特定用户（推荐）
-- ============================================

-- 验证单个用户（替换邮箱）
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = '107251567@qq.com';

-- 验证多个用户
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email IN (
  '107251567@qq.com',
  'another-user@example.com'
);

-- ============================================
-- 方案2: 验证所有未验证用户（开发环境）
-- ============================================

UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- ============================================
-- 查询命令
-- ============================================

-- 查看所有未验证的用户
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '未验证'
    ELSE '已验证'
  END as status
FROM auth.users
ORDER BY created_at DESC;

-- 查看特定用户的验证状态
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users
WHERE email = '107251567@qq.com';

-- 统计验证情况
SELECT 
  COUNT(*) as total_users,
  COUNT(email_confirmed_at) as verified_users,
  COUNT(*) - COUNT(email_confirmed_at) as unverified_users
FROM auth.users;

-- ============================================
-- 重置用户密码（如果需要）
-- ============================================

-- 注意：这会触发密码重置邮件
-- 如果邮件服务未配置，用户将无法收到邮件
-- 建议在 Supabase Dashboard 中手动重置密码

-- ============================================
-- 删除测试用户（谨慎使用）
-- ============================================

-- 删除特定测试用户
-- DELETE FROM auth.users WHERE email = 'test@example.com';

-- ============================================
-- 禁用邮箱验证（推荐在开发环境）
-- ============================================

-- 这个设置需要在 Supabase Dashboard 中操作：
-- Authentication → Settings → Email Confirmations
-- 关闭 "Enable email confirmations"
