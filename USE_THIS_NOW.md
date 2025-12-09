# ⚡ 立即使用这个脚本

## 🎯 当前状态

✅ profiles 表已存在
⏭️ 需要添加用户并设置管理员

## 🚀 立即执行

在 Supabase SQL Editor 中复制粘贴以下内容：

```sql
-- 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com';

-- 添加用户（如果不存在）
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT id, email, split_part(email, '@', 1), false
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO NOTHING;

-- 设置管理员
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 查看结果
SELECT email, is_admin, coins FROM profiles WHERE email = '107251567@qq.com';
```

## ✅ 预期结果

```
email: 107251567@qq.com
is_admin: true
coins: 0
```

## 🎉 完成后

1. 访问：http://localhost:3000/auth/login
2. 登录账号
3. 访问：http://localhost:3000/admin/gifts

---

**这个脚本已经考虑了表已存在的情况！** ✅
