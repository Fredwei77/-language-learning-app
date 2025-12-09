-- 临时禁用 RLS 来排查问题
-- 这是最后的测试手段

-- 禁用 gifts 表的 RLS
ALTER TABLE public.gifts DISABLE ROW LEVEL SECURITY;

-- 验证
SELECT 
  tablename,
  rowsecurity as "RLS已禁用"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'gifts';

-- 应该显示 rowsecurity = false

-- 测试完成后，记得重新启用：
-- ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
