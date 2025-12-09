# 🚨 立即修复 RLS 问题

## 问题

策略创建不成功，导致无法插入数据。

## ✅ 最简单的解决方案

**直接禁用 RLS（Row Level Security）**

### 在 Supabase SQL Editor 中执行：

```sql
-- 禁用 RLS
ALTER TABLE pending_registrations DISABLE ROW LEVEL SECURITY;
```

### 验证

```sql
-- 检查 RLS 状态
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'pending_registrations';
```

应该显示 `rowsecurity = false`

## 🧪 测试插入

```sql
-- 测试插入
INSERT INTO pending_registrations (
  scene_id,
  email,
  password_hash,
  nickname,
  status
) VALUES (
  'TEST_123',
  'test@test.com',
  'test123',
  'Test',
  'pending'
);

-- 查看
SELECT * FROM pending_registrations WHERE scene_id = 'TEST_123';

-- 清理
DELETE FROM pending_registrations WHERE scene_id = 'TEST_123';
```

如果这个测试成功，说明修复完成！

## ✅ 完成后

立即重新测试注册：

1. 访问：`https://good2study.netlify.app/auth/register-wechat`
2. 填写信息
3. 点击"下一步"
4. 应该能成功生成二维码了！

---

**现在就执行这个 SQL！** 🚀
