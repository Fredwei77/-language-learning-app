-- 设置管理员权限脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- 方法1: 通过邮箱设置管理员
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- 方法2: 通过用户ID设置管理员
UPDATE profiles 
SET is_admin = true 
WHERE id = 'user-uuid-here';

-- 查看所有管理员
SELECT id, email, display_name, is_admin, created_at
FROM profiles
WHERE is_admin = true;

-- 查看特定用户的管理员状态
SELECT id, email, display_name, is_admin
FROM profiles
WHERE email = 'your-email@example.com';

-- 移除管理员权限
UPDATE profiles 
SET is_admin = false 
WHERE email = 'user-email@example.com';
