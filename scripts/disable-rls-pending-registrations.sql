-- 最简单的解决方案：禁用 RLS
-- 这样任何人都可以插入、查询、更新记录

-- 禁用 RLS
ALTER TABLE pending_registrations DISABLE ROW LEVEL SECURITY;

-- 验证 RLS 状态
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'pending_registrations';

-- 应该显示 rowsecurity = false
