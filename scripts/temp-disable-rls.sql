-- 临时禁用 RLS 来测试问题
-- 仅用于调试，不要在生产环境使用

-- 禁用 gifts 表的 RLS
ALTER TABLE public.gifts DISABLE ROW LEVEL SECURITY;

-- 验证
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'gifts';

-- 应该显示 rowsecurity = false
