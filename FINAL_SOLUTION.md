# 🎯 最终解决方案

## 问题诊断

根据错误信息：`column "is_admin" of relation "profiles" does not exist`

**根本原因：** `profiles` 表不存在或结构不完整

## ✅ 解决方案

### 方案1: 简单版（推荐）⭐⭐⭐

使用 `scripts/SIMPLE-CREATE-TABLE.sql`

**这个脚本会：**
1. 创建 profiles 表（包含所有必要的列）
2. 验证邮箱
3. 添加用户并设置为管理员

**执行步骤：**
1. 打开 Supabase SQL Editor
2. 复制以下内容：

```sql
-- 1. 创建 profiles 表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  coins INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com';

-- 3. 添加用户并设置为管理员
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT 
  id,
  email,
  split_part(email, '@', 1),
  true
FROM auth.users
WHERE email = '107251567@qq.com';

-- 4. 查看结果
SELECT 
  email,
  display_name,
  is_admin,
  coins
FROM profiles
WHERE email = '107251567@qq.com';
```

3. 点击 Run 执行
4. 查看结果

---

### 方案2: 完整版（包含 RLS 策略）

使用 `scripts/ULTIMATE-FIX.sql`

**额外功能：**
- ✅ 创建索引
- ✅ 启用行级安全（RLS）
- ✅ 创建安全策略

---

## 🔍 如果表已存在

如果你已经有 profiles 表，但缺少 is_admin 列：

```sql
-- 只添加 is_admin 列
ALTER TABLE profiles 
ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- 设置管理员
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 验证
SELECT email, is_admin FROM profiles WHERE email = '107251567@qq.com';
```

---

## 🐛 如果需要重建表

如果表结构有问题，需要重建：

```sql
-- ⚠️ 警告：这会删除所有 profiles 数据！

-- 1. 删除旧表
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. 创建新表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  coins INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 添加用户
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT id, email, split_part(email, '@', 1), true
FROM auth.users
WHERE email = '107251567@qq.com';
```

---

## ✅ 验证成功

执行后应该看到：

```
email: 107251567@qq.com
display_name: 107251567
is_admin: true
coins: 0
```

---

## 🎯 测试登录

1. 访问：http://localhost:3000/auth/login
2. 输入邮箱：`107251567@qq.com`
3. 输入密码
4. 登录成功后访问：http://localhost:3000/admin/gifts
5. 应该能看到商品管理页面

---

## 📊 检查表结构

验证表是否正确创建：

```sql
-- 查看表结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

预期结果应该包含：
- id (uuid)
- email (text)
- display_name (text)
- avatar_url (text)
- coins (integer)
- is_admin (boolean) ✅
- created_at (timestamp)
- updated_at (timestamp)

---

## 🎉 完成

现在你应该可以：
- ✅ 登录系统
- ✅ 访问管理后台
- ✅ 添加商品
- ✅ 上传图片

---

## 📚 相关文件

- `scripts/SIMPLE-CREATE-TABLE.sql` - 简单版（推荐）
- `scripts/ULTIMATE-FIX.sql` - 完整版（包含 RLS）
- `ADMIN_SETUP_TROUBLESHOOTING.md` - 故障排除指南

---

**立即执行 `SIMPLE-CREATE-TABLE.sql` 中的脚本！** 🚀
