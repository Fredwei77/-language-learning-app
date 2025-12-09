# 🔧 SQL 脚本错误修复指南

## 🐛 遇到的错误

```
错误: 无法在 SQL 查询中, ERROR: 42803: 列 "confirmed_at" 只能更新为默认值
详情: "confirmed_at" 列是由 auth.users 表生成的
```

## 🎯 问题原因

`auth.users` 表中的 `confirmed_at` 字段是由 Supabase 自动管理的，不能手动设置。

## ✅ 解决方案

### 方案1: 使用最简版脚本（推荐）⭐

使用 `scripts/setup-admin-minimal.sql`

#### 步骤1: 先尝试简单命令

```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

SELECT email, is_admin FROM profiles WHERE email = '107251567@qq.com';
```

#### 步骤2: 如果返回空结果，执行完整版

```sql
-- 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = '107251567@qq.com';

-- 添加到 profiles 表
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT id, email, split_part(email, '@', 1), true
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO UPDATE SET is_admin = true;

-- 验证
SELECT email, is_admin FROM profiles WHERE email = '107251567@qq.com';
```

---

### 方案2: 使用修复版脚本

使用 `scripts/setup-admin-107251567-fixed.sql`

这个脚本已经修复了 `confirmed_at` 的问题。

---

### 方案3: 使用简化版脚本

使用 `scripts/setup-admin-simple.sql`

这个脚本使用 DO 块，更安全可靠。

---

## 📊 验证设置

### 检查用户是否在 profiles 表中

```sql
SELECT 
  p.email,
  p.is_admin,
  u.email_confirmed_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = '107251567@qq.com';
```

### 检查用户是否在 auth.users 表中

```sql
SELECT 
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = '107251567@qq.com';
```

---

## 🎯 推荐执行顺序

### 第1步: 检查用户状态

```sql
-- 检查用户是否存在
SELECT email, email_confirmed_at 
FROM auth.users 
WHERE email = '107251567@qq.com';

-- 检查是否在 profiles 表中
SELECT email, is_admin 
FROM profiles 
WHERE email = '107251567@qq.com';
```

### 第2步: 根据结果选择方案

#### 情况A: 用户在 profiles 表中
```sql
-- 直接设置管理员
UPDATE profiles SET is_admin = true WHERE email = '107251567@qq.com';
```

#### 情况B: 用户不在 profiles 表中
```sql
-- 添加用户并设置管理员
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT id, email, split_part(email, '@', 1), true
FROM auth.users WHERE email = '107251567@qq.com';
```

#### 情况C: 邮箱未验证
```sql
-- 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com' 
  AND email_confirmed_at IS NULL;
```

---

## 🔍 常见错误及解决

### 错误1: "relation profiles does not exist"

**原因**: profiles 表不存在

**解决**:
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE,
  display_name TEXT,
  coins INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 错误2: "duplicate key value violates unique constraint"

**原因**: 用户已在 profiles 表中

**解决**: 使用 UPDATE 而不是 INSERT
```sql
UPDATE profiles SET is_admin = true WHERE email = '107251567@qq.com';
```

### 错误3: "column confirmed_at cannot be updated"

**原因**: 尝试手动设置 confirmed_at

**解决**: 只设置 email_confirmed_at
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com';
```

---

## 📝 完整的安全脚本

```sql
-- 步骤1: 验证邮箱（如果需要）
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = '107251567@qq.com'
  AND email_confirmed_at IS NULL;

-- 步骤2: 添加到 profiles 表（如果需要）
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'nickname', split_part(email, '@', 1)),
  false
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO NOTHING;

-- 步骤3: 设置管理员权限
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 步骤4: 验证结果
SELECT 
  email,
  display_name,
  is_admin,
  coins
FROM profiles
WHERE email = '107251567@qq.com';
```

---

## ✅ 验证成功

执行后应该看到：

```
email: 107251567@qq.com
display_name: 107251567
is_admin: true ✅
coins: 0
```

---

## 🎉 完成后

1. 退出 Supabase Dashboard
2. 访问 http://localhost:3000/auth/login
3. 登录账号
4. 访问 http://localhost:3000/admin/gifts
5. 应该能看到管理后台

---

## 📚 相关文件

- `scripts/setup-admin-minimal.sql` - 最简版（推荐）
- `scripts/setup-admin-simple.sql` - 简化版
- `scripts/setup-admin-107251567-fixed.sql` - 修复版

---

**建议**: 使用 `setup-admin-minimal.sql` 中的方案2（完整版）
