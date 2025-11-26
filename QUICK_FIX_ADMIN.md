# ⚡ 管理员设置 - 快速修复

## 🎯 立即执行（复制粘贴）

在 Supabase SQL Editor 中执行以下命令：

```sql
-- 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = '107251567@qq.com';

-- 添加到 profiles 表并设置管理员
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT 
  id, 
  email, 
  split_part(email, '@', 1),
  true
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO UPDATE 
SET is_admin = true;

-- 验证结果
SELECT 
  email as "邮箱",
  is_admin as "管理员",
  coins as "金币"
FROM profiles
WHERE email = '107251567@qq.com';
```

## ✅ 预期结果

```
邮箱: 107251567@qq.com
管理员: true ✅
金币: 0
```

## 🎉 完成！

现在可以：
1. 登录：http://localhost:3000/auth/login
2. 访问管理后台：http://localhost:3000/admin/gifts

---

## 🐛 如果还有问题

查看 `SQL_ERROR_FIX.md` 获取详细的故障排除指南。

---

**这个脚本已经修复了之前的错误！** ✅
