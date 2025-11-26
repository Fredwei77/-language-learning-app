# 🚀 认证系统快速设置（3分钟）

## 步骤 1: 注册账号

访问：`http://localhost:3000/auth/register`

填写：
- 邮箱：`admin@example.com`
- 密码：`password123`（至少6个字符）
- 确认密码：`password123`

点击"注册"

## 步骤 2: 设置管理员权限

在 Supabase SQL Editor 中执行：

```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@example.com';
```

## 步骤 3: 登录

访问：`http://localhost:3000/auth/login`

输入：
- 邮箱：`admin@example.com`
- 密码：`password123`

点击"登录"

## 步骤 4: 访问管理后台

访问：`http://localhost:3000/admin/gifts`

现在你可以：
- ✅ 添加商品
- ✅ 上传图片
- ✅ 管理库存

## 🎯 完成！

你现在拥有完整的管理员权限，可以开始管理商品了。

---

## 📝 快速命令

### 查看管理员
```sql
SELECT email, is_admin FROM profiles WHERE is_admin = true;
```

### 添加更多管理员
```sql
UPDATE profiles SET is_admin = true WHERE email = 'another-admin@example.com';
```

### 移除管理员
```sql
UPDATE profiles SET is_admin = false WHERE email = 'user@example.com';
```

---

**提示**: 如果遇到问题，查看 `AUTH_SETUP_GUIDE.md` 获取详细说明。
