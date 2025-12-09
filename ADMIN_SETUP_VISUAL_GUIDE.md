# 🎯 管理员设置 - 可视化指南

## 📍 你在这里

```
✅ 已注册账号 (107251567@qq.com)
✅ 已验证邮箱
👉 正在设置管理员权限  ← 你在这里
⏳ 访问管理后台
```

---

## 🚀 3步完成设置

### 步骤 1️⃣: 打开 Supabase

```
🌐 访问: https://supabase.com/dashboard
🔐 登录你的账号
📂 选择你的项目
```

---

### 步骤 2️⃣: 打开 SQL Editor

```
左侧菜单
  ↓
📊 SQL Editor
  ↓
➕ New query
```

---

### 步骤 3️⃣: 执行 SQL

#### 方法A: 使用专用脚本（推荐）⭐

复制 `scripts/setup-admin-107251567.sql` 的全部内容

或直接复制以下内容：

```sql
-- 一键设置脚本
UPDATE auth.users 
SET email_confirmed_at = NOW(), confirmed_at = NOW()
WHERE email = '107251567@qq.com';

INSERT INTO profiles (id, email, display_name, is_admin)
SELECT id, email, split_part(email, '@', 1), false
FROM auth.users WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

UPDATE profiles SET is_admin = true WHERE email = '107251567@qq.com';

SELECT email, is_admin, coins FROM profiles WHERE email = '107251567@qq.com';
```

#### 方法B: 简单命令

如果 profiles 表已存在且用户已在表中：

```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';
```

---

## ✅ 验证结果

### 执行后应该看到：

```
┌───────────────────┬──────────┬───────┐
│ email             │ is_admin │ coins │
├───────────────────┼──────────┼───────┤
│ 107251567@qq.com  │ true ✅  │ 0     │
└───────────────────┴──────────┴───────┘
```

### 关键指标：
- ✅ `is_admin: true` - 成功！
- ❌ `is_admin: false` - 需要重新执行
- ❌ 查询结果为空 - 用户不在 profiles 表中

---

## 🎯 测试访问

### 1. 登录系统
```
http://localhost:3000/auth/login
```

输入：
- 📧 邮箱: `107251567@qq.com`
- 🔒 密码: 你的密码

### 2. 访问管理后台
```
http://localhost:3000/admin/gifts
```

### 3. 预期结果
- ✅ 能看到商品管理页面
- ✅ 能点击"添加商品"按钮
- ✅ 能上传图片

---

## 🐛 常见问题

### ❌ 问题1: "relation profiles does not exist"

**原因**: profiles 表不存在

**解决**: 执行完整脚本（方法A）

---

### ❌ 问题2: 查询结果为空

**原因**: 用户不在 profiles 表中

**解决**: 执行以下命令

```sql
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT id, email, split_part(email, '@', 1), true
FROM auth.users WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO UPDATE SET is_admin = true;
```

---

### ❌ 问题3: 仍显示"无权访问"

**原因**: 
1. 未重新登录
2. 浏览器缓存

**解决**:
1. 退出登录
2. 清除浏览器缓存
3. 重新登录

---

## 📊 完整流程图

```
开始
  ↓
打开 Supabase Dashboard
  ↓
进入 SQL Editor
  ↓
复制 SQL 脚本
  ↓
粘贴到编辑器
  ↓
点击 Run 执行
  ↓
查看结果
  ↓
is_admin = true? ──→ 否 ──→ 检查错误信息
  ↓ 是                        ↓
登录系统                    查看故障排除
  ↓                           ↓
访问 /admin/gifts            重新执行
  ↓                           ↓
能访问? ──→ 否 ──→ 清除缓存重新登录
  ↓ 是
✅ 完成！
```

---

## 🎁 快捷方式

### 一键复制命令

**完整版**（推荐）：
```sql
UPDATE auth.users SET email_confirmed_at = NOW(), confirmed_at = NOW() WHERE email = '107251567@qq.com';
INSERT INTO profiles (id, email, display_name, is_admin) SELECT id, email, split_part(email, '@', 1), false FROM auth.users WHERE email = '107251567@qq.com' ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
UPDATE profiles SET is_admin = true WHERE email = '107251567@qq.com';
SELECT email, is_admin FROM profiles WHERE email = '107251567@qq.com';
```

**简化版**（如果表已存在）：
```sql
UPDATE profiles SET is_admin = true WHERE email = '107251567@qq.com';
SELECT email, is_admin FROM profiles WHERE email = '107251567@qq.com';
```

---

## 📚 相关文件

- 📄 `scripts/setup-admin-107251567.sql` - 你的专用脚本
- 📄 `scripts/setup-admin-template.sql` - 通用模板
- 📄 `SETUP_ADMIN_STEP_BY_STEP.md` - 详细步骤
- 📄 `scripts/set-admin.sql` - 基础脚本

---

## 🎉 完成后

你将拥有：
- ✅ 管理员权限
- ✅ 访问管理后台
- ✅ 添加商品功能
- ✅ 上传图片功能
- ✅ 管理库存功能

---

## 💡 提示

1. **保存脚本**: 将 SQL 脚本保存到本地，方便以后使用
2. **添加更多管理员**: 修改邮箱地址重新执行
3. **定期检查**: 定期查看管理员列表

---

## 🆘 需要帮助？

查看详细文档：
- `SETUP_ADMIN_STEP_BY_STEP.md` - 完整步骤
- `AUTH_SETUP_GUIDE.md` - 认证系统指南
- `LOGIN_FIX_GUIDE.md` - 登录问题修复

---

**准备好了吗？开始执行吧！** 🚀
