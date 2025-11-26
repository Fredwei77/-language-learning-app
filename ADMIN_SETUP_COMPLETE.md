# ✅ 管理员权限设置 - 完整指南

## 🎯 目标

为邮箱 `107251567@qq.com` 设置管理员权限

---

## 🚀 最快方法（30秒）

### 1. 打开 Supabase SQL Editor

访问：https://supabase.com/dashboard
- 登录账号
- 选择项目
- 点击左侧 "SQL Editor"
- 点击 "New query"

### 2. 复制粘贴以下命令

```sql
-- 一键设置管理员
UPDATE auth.users 
SET email_confirmed_at = NOW(), confirmed_at = NOW()
WHERE email = '107251567@qq.com';

INSERT INTO profiles (id, email, display_name, is_admin)
SELECT id, email, split_part(email, '@', 1), false
FROM auth.users 
WHERE email = '107251567@qq.com'
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

UPDATE profiles 
SET is_admin = true 
WHERE email = '107251567@qq.com';

-- 验证结果
SELECT 
  email,
  is_admin as "管理员权限",
  coins as "金币"
FROM profiles 
WHERE email = '107251567@qq.com';
```

### 3. 点击 Run 执行

### 4. 查看结果

应该显示：
```
email: 107251567@qq.com
管理员权限: true ✅
金币: 0
```

---

## 📁 创建的文件

### SQL 脚本（3个）
1. ✅ `scripts/setup-admin-107251567.sql` - 你的专用脚本
2. ✅ `scripts/setup-admin-template.sql` - 通用模板
3. ✅ `scripts/set-admin.sql` - 基础脚本

### 文档（3个）
1. ✅ `SETUP_ADMIN_STEP_BY_STEP.md` - 详细步骤指南
2. ✅ `ADMIN_SETUP_VISUAL_GUIDE.md` - 可视化指南
3. ✅ `ADMIN_SETUP_COMPLETE.md` - 本文档

---

## 🎯 验证设置

### 方法1: SQL 查询

```sql
SELECT email, is_admin, coins 
FROM profiles 
WHERE email = '107251567@qq.com';
```

预期结果：`is_admin: true`

### 方法2: 登录测试

1. 访问：`http://localhost:3000/auth/login`
2. 登录账号
3. 访问：`http://localhost:3000/admin/gifts`
4. 应该能看到商品管理页面

---

## 🐛 故障排除

### 问题1: "relation profiles does not exist"

**解决**：执行完整的数据库迁移

```sql
-- 创建 profiles 表
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
```

### 问题2: 查询结果为空

**原因**：用户不在 profiles 表中

**解决**：
```sql
INSERT INTO profiles (id, email, display_name, is_admin)
SELECT id, email, split_part(email, '@', 1), true
FROM auth.users 
WHERE email = '107251567@qq.com';
```

### 问题3: 登录后仍显示"无权访问"

**解决**：
1. 退出登录
2. 清除浏览器缓存（Ctrl+Shift+Delete）
3. 重新登录

---

## 📊 管理员管理

### 查看所有管理员

```sql
SELECT 
  email,
  display_name,
  is_admin,
  coins,
  created_at
FROM profiles
WHERE is_admin = true
ORDER BY created_at DESC;
```

### 添加更多管理员

```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'another-admin@example.com';
```

### 移除管理员权限

```sql
UPDATE profiles 
SET is_admin = false 
WHERE email = 'user@example.com';
```

### 批量设置管理员

```sql
UPDATE profiles 
SET is_admin = true 
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
);
```

---

## 🎁 完成后你可以

### 访问管理后台
```
http://localhost:3000/admin/gifts
```

### 管理商品
- ✅ 添加新商品
- ✅ 编辑商品信息
- ✅ 删除商品
- ✅ 上传商品图片
- ✅ 管理库存
- ✅ 设置价格

---

## 📚 相关文档

### 认证系统
- `AUTH_SETUP_GUIDE.md` - 认证系统完整指南
- `LOGIN_FIX_GUIDE.md` - 登录问题修复
- `AUTH_QUICK_SETUP.md` - 快速设置

### 商品管理
- `GIFT_SHOP_BACKEND_SETUP.md` - 商品系统完整指南
- `GIFT_SHOP_QUICK_START.md` - 快速开始

### 数据库
- `supabase-setup.sql` - 数据库初始化
- `supabase/migrations/20240126_create_gifts_table.sql` - 商品表迁移

---

## 🎯 下一步

1. ✅ 设置管理员权限（当前步骤）
2. ⏭️ 登录系统
3. ⏭️ 访问管理后台
4. ⏭️ 添加第一个商品
5. ⏭️ 上传商品图片

---

## 💡 最佳实践

### 安全建议
1. 不要给太多人管理员权限
2. 定期审查管理员列表
3. 使用强密码
4. 定期更换密码

### 管理建议
1. 记录管理员操作
2. 定期备份数据
3. 监控异常活动
4. 保持系统更新

---

## 🎉 总结

你现在已经：
- ✅ 了解如何设置管理员权限
- ✅ 获得了专用的 SQL 脚本
- ✅ 知道如何验证设置
- ✅ 掌握了故障排除方法

**准备好开始管理商品了吗？** 🚀

---

## 🆘 需要帮助？

### 查看详细文档
- `SETUP_ADMIN_STEP_BY_STEP.md` - 逐步指南
- `ADMIN_SETUP_VISUAL_GUIDE.md` - 可视化指南

### 使用专用脚本
- `scripts/setup-admin-107251567.sql` - 一键执行

### 常见问题
查看故障排除部分或相关文档

---

**立即执行，30秒完成设置！** ⚡
