# ⚡ 登录问题快速修复

## 🎯 问题
登录时显示：**"Email not confirmed"**

## ✅ 解决方案（选一个）

### 方案A: 手动验证（30秒）⭐ 推荐

#### 步骤1: 打开 Supabase
访问：https://supabase.com/dashboard

#### 步骤2: 进入 SQL Editor
左侧菜单 → SQL Editor → New Query

#### 步骤3: 执行验证命令
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = '107251567@qq.com';
```

#### 步骤4: 重新登录
访问：http://localhost:3000/auth/login

**完成！✅**

---

### 方案B: 禁用验证（1分钟）⭐⭐ 最简单

#### 步骤1: 打开设置
Supabase Dashboard → Authentication → Settings

#### 步骤2: 关闭邮箱验证
找到 "Email Confirmations"
关闭 "Enable email confirmations" 开关

#### 步骤3: 保存
点击 Save 按钮

#### 步骤4: 重新注册或登录
所有用户现在无需验证即可登录

**完成！✅**

---

## 🔍 验证是否成功

执行以下 SQL 查看状态：

```sql
SELECT 
  email,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ 未验证'
    ELSE '✅ 已验证'
  END as status
FROM auth.users
WHERE email = '107251567@qq.com';
```

应该显示：**✅ 已验证**

---

## 💡 推荐

- **开发环境**: 使用方案B（禁用验证）
- **生产环境**: 配置邮件服务

---

## 🆘 还是不行？

1. 清除浏览器缓存
2. 重新打开浏览器
3. 检查密码是否正确
4. 查看 `LOGIN_FIX_GUIDE.md` 获取详细帮助

---

**立即执行方案A的命令**：

```sql
UPDATE auth.users SET email_confirmed_at = NOW(), confirmed_at = NOW() WHERE email = '107251567@qq.com';
```

然后登录！🚀
