# 🎯 复制这个脚本立即执行

## 问题
`is_admin` 列不存在于 profiles 表中

## 解决方案
复制以下内容到 Supabase SQL Editor 并执行：

```sql
-- 添加 is_admin 列
ALTER TABLE profiles 
ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com';

-- 添加用户
INSERT INTO profiles (id, email, display_name)
SELECT id, email, split_part(email, '@', 1)
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

## 预期结果
```
email: 107251567@qq.com
is_admin: true
coins: 0
```

## 完成！
现在登录：http://localhost:3000/auth/login
