-- 修复 pending_registrations 表的 RLS 策略
-- 允许匿名用户插入记录

-- 启用 RLS
ALTER TABLE pending_registrations ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果有）
DROP POLICY IF EXISTS "Allow anonymous insert" ON pending_registrations;
DROP POLICY IF EXISTS "Allow public insert" ON pending_registrations;
DROP POLICY IF EXISTS "Allow service role all" ON pending_registrations;

-- 创建新策略：允许所有人插入
CREATE POLICY "Allow anonymous insert"
ON pending_registrations
FOR INSERT
TO anon
WITH CHECK (true);

-- 创建策略：允许所有人查询自己的记录
CREATE POLICY "Allow select own records"
ON pending_registrations
FOR SELECT
TO anon
USING (true);

-- 创建策略：允许所有人更新自己的记录
CREATE POLICY "Allow update own records"
ON pending_registrations
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- 验证策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'pending_registrations';
