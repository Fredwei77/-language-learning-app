# 🔧 设置管理员权限 - 详细步骤

## 📋 前提条件

1. ✅ 已注册账号（邮箱：`107251567@qq.com`）
2. ✅ 已验证邮箱（或已禁用邮箱验证）
3. ✅ 可以访问 Supabase Dashboard

---

## 🚀 步骤1: 打开 Supabase Dashboard

### 1.1 访问 Supabase
打开浏览器，访问：
```
https://supabase.com/dashboard
```

### 1.2 登录账号
使用你的 Supabase 账号登录

### 1.3 选择项目
在项目列表中，选择你的语言学习项目

---

## 🔍 步骤2: 打开 SQL Editor

### 2.1 找到 SQL Editor
在左侧菜单栏中，找到并点击：
```
📊 SQL Editor
```

### 2.2 创建新查询
点击右上角的：
```
+ New query
```

---

## 📝 步骤3: 执行 SQL 命令

### 3.1 复制以下 SQL 命令

```sql
-- 步骤1: 验证邮箱（如果还没验证）
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = '107251567@qq.com';

-- 步骤2: 设置管理员权限
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 步骤3: 验证设置是否成功
SELECT 
  id,
  email,
  display_name,
  is_admin,
  coins,
  created_at
FROM profiles
WHERE email = '107251567@qq.com';
```

### 3.2 粘贴到 SQL Editor
将上面的 SQL 命令粘贴到 SQL Editor 的输入框中

### 3.3 执行命令
点击右下角的：
```
▶ Run
```
或按快捷键：`Ctrl + Enter` (Windows) / `Cmd + Enter` (Mac)

---

## ✅ 步骤4: 验证结果

### 4.1 查看执行结果
在 SQL Editor 下方的 "Results" 标签页中，你应该看到：

```
email: 107251567@qq.com
is_admin: true  ✅
```

### 4.2 如果看到 `is_admin: true`
恭喜！设置成功！

### 4.3 如果看到错误
请查看下面的"故障排除"部分

---

## 🎯 步骤5: 测试管理员权限

### 5.1 登录系统
访问：
```
http://localhost:3000/auth/login
```

输入：
- 邮箱：`107251567@qq.com`
- 密码：你的密码

### 5.2 访问管理后台
登录成功后，访问：
```
http://localhost:3000/admin/gifts
```

### 5.3 验证访问权限
如果能看到商品管理页面，说明管理员权限设置成功！✅

---

## 🐛 故障排除

### 问题1: 找不到 profiles 表

**错误信息：**
```
relation "profiles" does not exist
```

**解决方法：**
1. 检查是否已运行数据库迁移
2. 执行 `supabase-setup.sql` 中的所有命令
3. 或执行以下命令创建 profiles 表：

```sql
-- 创建 profiles 表（如果不存在）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  coins INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 添加 is_admin 字段（如果表已存在但没有此字段）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
```

---

### 问题2: 用户不在 profiles 表中

**错误信息：**
查询结果为空

**解决方法：**
手动插入用户到 profiles 表：

```sql
-- 从 auth.users 获取用户信息并插入到 profiles
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'nickname', split_part(email, '@', 1)) as display_name,
  false as is_admin
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO NOTHING;

-- 然后设置管理员权限
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';
```

---

### 问题3: 无法执行 UPDATE 命令

**错误信息：**
```
permission denied
```

**解决方法：**
1. 确保你使用的是项目的 service_role key（在 SQL Editor 中自动使用）
2. 或在 Supabase Dashboard → Settings → API 中检查权限

---

## 📊 完整的一键设置脚本

如果你想一次性完成所有设置，复制以下完整脚本：

```sql
-- ============================================
-- 完整的管理员设置脚本
-- ============================================

-- 1. 确保 profiles 表存在
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  coins INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 添加 is_admin 字段（如果不存在）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 3. 验证邮箱
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = '107251567@qq.com';

-- 4. 确保用户在 profiles 表中
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'nickname', split_part(email, '@', 1)),
  false
FROM auth.users
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- 5. 设置管理员权限
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 6. 验证结果
SELECT 
  p.id,
  p.email,
  p.display_name,
  p.is_admin,
  p.coins,
  u.email_confirmed_at,
  p.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = '107251567@qq.com';
```

---

## 🎯 预期结果

执行完成后，你应该看到类似这样的结果：

```
┌──────────────────────────────────────┬───────────────────┬──────────────┬──────────┬───────┬─────────────────────┬─────────────────────┐
│ id                                   │ email             │ display_name │ is_admin │ coins │ email_confirmed_at  │ created_at          │
├──────────────────────────────────────┼───────────────────┼──────────────┼──────────┼───────┼─────────────────────┼─────────────────────┤
│ xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx │ 107251567@qq.com  │ 107251567    │ true ✅  │ 0     │ 2024-11-26 ...      │ 2024-11-26 ...      │
└──────────────────────────────────────┴───────────────────┴──────────────┴──────────┴───────┴─────────────────────┴─────────────────────┘
```

关键字段：
- ✅ `is_admin: true` - 管理员权限已设置
- ✅ `email_confirmed_at: 有值` - 邮箱已验证

---

## 🎉 完成！

现在你可以：
1. ✅ 登录系统
2. ✅ 访问管理后台
3. ✅ 添加和管理商品
4. ✅ 上传商品图片

---

## 📚 相关文档

- `LOGIN_QUICK_FIX.md` - 登录问题修复
- `AUTH_SETUP_GUIDE.md` - 认证系统指南
- `GIFT_SHOP_QUICK_START.md` - 商品管理快速开始

---

**需要帮助？** 查看故障排除部分或联系技术支持。
