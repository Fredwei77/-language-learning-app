# 修复邮箱验证问题

## 问题
登录时显示 "Email not confirmed" 错误。

## 解决方案

### 方案1: 禁用邮箱验证（开发环境推荐）

1. 访问 Supabase Dashboard
2. 进入 Authentication → Settings
3. 找到 "Email Confirmations" 部分
4. **关闭** "Enable email confirmations"
5. 保存设置

现在用户注册后可以直接登录，无需验证邮箱。

### 方案2: 手动验证已注册的用户

在 Supabase SQL Editor 中执行：

```sql
-- 查看未验证的用户
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email_confirmed_at IS NULL;

-- 手动验证特定用户
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = '107251567@qq.com';

-- 验证所有用户（开发环境）
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

### 方案3: 配置邮件服务（生产环境推荐）

1. 在 Supabase Dashboard → Settings → Auth
2. 配置 SMTP 设置
3. 或使用 Supabase 的邮件服务
4. 用户注册后会收到验证邮件

## 快速修复（立即可用）

执行以下 SQL 验证你的账号：

```sql
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = '107251567@qq.com';
```

然后重新登录即可。
