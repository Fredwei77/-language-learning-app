# 🔧 管理员设置故障排除

## 🎯 最新问题和解决方案

### 问题1: "column is_admin does not exist"

**错误信息：**
```
关于"profiles"的列"is_admin"不存在
```

**原因：** profiles 表缺少 is_admin 列

**解决方案：** 使用 `scripts/FINAL-SETUP-ADMIN.sql`

这个脚本会：
1. ✅ 创建 profiles 表（如果不存在）
2. ✅ 包含 is_admin 列
3. ✅ 验证邮箱
4. ✅ 设置管理员权限

---

### 问题2: "column confirmed_at cannot be updated"

**错误信息：**
```
列 "confirmed_at" 只能更新为默认值
```

**原因：** confirmed_at 是自动管理的字段

**解决方案：** 只更新 email_confirmed_at
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = '107251567@qq.com';
```

---

## 🚀 推荐解决方案

### 方案A: 使用最终版脚本（强烈推荐）⭐⭐⭐

文件：`scripts/FINAL-SETUP-ADMIN.sql`

**优点：**
- ✅ 一键执行
- ✅ 自动创建表和列
- ✅ 处理所有边界情况
- ✅ 最简单可靠

**使用方法：**
1. 打开 Supabase SQL Editor
2. 复制 `FINAL-SETUP-ADMIN.sql` 的全部内容
3. 粘贴到编辑器
4. 点击 Run
5. 查看结果

---

### 方案B: 分步执行（如果方案A失败）

文件：`scripts/setup-admin-step-by-step.sql`

**优点：**
- ✅ 可以看到每步的结果
- ✅ 容易定位问题
- ✅ 适合调试

**使用方法：**
按顺序执行每个步骤，查看每步的结果

---

### 方案C: 完整修复版（最全面）

文件：`scripts/setup-admin-complete-fix.sql`

**优点：**
- ✅ 包含详细的检查
- ✅ 使用 DO 块处理条件
- ✅ 提供详细的反馈

---

## 📊 验证步骤

### 1. 检查 profiles 表是否存在

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'profiles';
```

**预期结果：** 应该返回 `profiles`

---

### 2. 检查 is_admin 列是否存在

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'profiles' 
  AND column_name = 'is_admin';
```

**预期结果：** 应该返回 `is_admin | boolean`

---

### 3. 检查用户是否在 profiles 表中

```sql
SELECT email, is_admin 
FROM profiles 
WHERE email = '107251567@qq.com';
```

**预期结果：** 应该返回用户信息

---

### 4. 检查邮箱是否已验证

```sql
SELECT email, email_confirmed_at 
FROM auth.users 
WHERE email = '107251567@qq.com';
```

**预期结果：** `email_confirmed_at` 应该有值

---

## 🔍 常见错误及解决

### 错误A: "relation profiles does not exist"

**解决：**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  coins INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 错误B: "column is_admin does not exist"

**解决：**
```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
```

---

### 错误C: "duplicate key value"

**解决：** 用户已存在，使用 UPDATE
```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';
```

---

### 错误D: 查询返回空结果

**原因：** 用户不在 profiles 表中

**解决：**
```sql
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT id, email, split_part(email, '@', 1), true
FROM auth.users
WHERE email = '107251567@qq.com';
```

---

## 🎯 完整的诊断脚本

```sql
-- 诊断脚本：检查所有状态

-- 1. 检查 profiles 表
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'profiles'
    ) THEN '✅ profiles 表存在'
    ELSE '❌ profiles 表不存在'
  END as table_status;

-- 2. 检查 is_admin 列
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'is_admin'
    ) THEN '✅ is_admin 列存在'
    ELSE '❌ is_admin 列不存在'
  END as column_status;

-- 3. 检查用户在 auth.users
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM auth.users WHERE email = '107251567@qq.com'
    ) THEN '✅ 用户在 auth.users 中'
    ELSE '❌ 用户不在 auth.users 中'
  END as user_status;

-- 4. 检查用户在 profiles
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM profiles WHERE email = '107251567@qq.com'
    ) THEN '✅ 用户在 profiles 中'
    ELSE '❌ 用户不在 profiles 中'
  END as profile_status;

-- 5. 检查邮箱验证状态
SELECT 
  email,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ 已验证'
    ELSE '❌ 未验证'
  END as email_status
FROM auth.users
WHERE email = '107251567@qq.com';

-- 6. 检查管理员状态（如果用户在 profiles 中）
SELECT 
  email,
  CASE 
    WHEN is_admin THEN '✅ 是管理员'
    ELSE '❌ 不是管理员'
  END as admin_status
FROM profiles
WHERE email = '107251567@qq.com';
```

---

## 📝 推荐执行顺序

### 第1步: 运行诊断脚本
复制上面的诊断脚本，查看当前状态

### 第2步: 根据诊断结果选择方案
- 如果所有检查都通过 → 直接设置管理员
- 如果有检查失败 → 使用 FINAL-SETUP-ADMIN.sql

### 第3步: 执行修复脚本
使用 `scripts/FINAL-SETUP-ADMIN.sql`

### 第4步: 验证结果
```sql
SELECT email, is_admin FROM profiles WHERE email = '107251567@qq.com';
```

### 第5步: 测试登录
1. 访问 http://localhost:3000/auth/login
2. 登录账号
3. 访问 http://localhost:3000/admin/gifts

---

## 🎉 成功标志

当你看到以下结果时，说明设置成功：

```
✅ profiles 表存在
✅ is_admin 列存在
✅ 用户在 auth.users 中
✅ 用户在 profiles 中
✅ 邮箱已验证
✅ 是管理员
```

---

## 📚 相关文件

- `scripts/FINAL-SETUP-ADMIN.sql` - 最终版（推荐）
- `scripts/setup-admin-step-by-step.sql` - 分步版
- `scripts/setup-admin-complete-fix.sql` - 完整版
- `SQL_ERROR_FIX.md` - 错误修复指南

---

## 🆘 还是不行？

如果以上方法都不行，请：

1. 截图错误信息
2. 运行诊断脚本并截图结果
3. 查看 Supabase Dashboard → Database → Tables
4. 确认 profiles 表的结构

---

**建议：直接使用 `scripts/FINAL-SETUP-ADMIN.sql`，这是最可靠的方案！** ✅
