# 🔐 认证和权限设置指南

## 📋 系统概述

已创建完整的认证和权限管理系统，包括：
- 登录页面
- 注册页面
- 中间件保护
- 管理员权限控制
- 自动重定向

## 🎯 快速开始

### 1. 注册新账号

访问注册页面：
```
http://localhost:3000/auth/register
```

填写信息：
- 昵称（可选）
- 邮箱
- 密码（至少6个字符）
- 确认密码

### 2. 设置管理员权限

#### 方法A: 使用 SQL（推荐）

在 Supabase SQL Editor 中执行：

```sql
-- 通过邮箱设置管理员
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

#### 方法B: 使用脚本

```bash
# 在 Supabase Dashboard 执行
# scripts/set-admin.sql
```

### 3. 登录账号

访问登录页面：
```
http://localhost:3000/auth/login
```

输入邮箱和密码登录。

### 4. 访问管理后台

登录后访问：
```
http://localhost:3000/admin/gifts
```

## 📁 创建的文件

```
✅ app/auth/login/page.tsx          # 登录页面
✅ app/auth/register/page.tsx       # 注册页面
✅ middleware.ts                     # 路由保护中间件
✅ scripts/set-admin.sql            # 管理员设置脚本
✅ components/user-nav.tsx          # 用户导航（已有）
```

## 🔒 权限系统

### 路由保护

#### 公开路由
- `/` - 首页
- `/shop` - 商城
- `/dictionary` - 词典
- `/textbooks` - 课文
- `/cantonese` - 粤语
- `/pronunciation` - 发音

#### 需要登录
- `/profile` - 个人中心
- `/progress` - 学习统计
- `/coins` - 金币页面

#### 需要管理员权限
- `/admin/*` - 所有管理后台页面

### 中间件功能

```typescript
// middleware.ts 自动处理：

1. 未登录访问管理后台 → 重定向到登录页
2. 非管理员访问管理后台 → 重定向到首页
3. 未登录访问受保护页面 → 重定向到登录页
4. 已登录访问登录/注册页 → 重定向到首页
```

## 🎨 登录页面功能

### 特性
- ✅ 邮箱密码登录
- ✅ 表单验证
- ✅ 加载状态
- ✅ 错误提示
- ✅ 自动重定向
- ✅ 响应式设计
- ✅ 美观的渐变背景

### 重定向逻辑

```typescript
// 登录成功后：
- 如果有 redirect 参数 → 跳转到指定页面
- 否则 → 跳转到首页

// 示例：
/auth/login?redirect=/admin/gifts
// 登录后自动跳转到 /admin/gifts
```

## 📝 注册页面功能

### 特性
- ✅ 邮箱注册
- ✅ 昵称设置（可选）
- ✅ 密码强度验证
- ✅ 密码确认
- ✅ 表单验证
- ✅ 加载状态
- ✅ 错误提示

### 验证规则

```typescript
- 邮箱：必须是有效的邮箱格式
- 密码：至少6个字符
- 确认密码：必须与密码一致
- 昵称：可选，默认使用邮箱前缀
```

## 🔐 安全特性

### 1. 密码安全
- Supabase 自动加密存储
- 最小长度要求
- 密码确认验证

### 2. 会话管理
- 自动刷新 token
- 安全的 cookie 存储
- 自动过期处理

### 3. 权限验证
- 数据库级别的 RLS
- 中间件级别的路由保护
- API 级别的权限检查

## 🎯 用户流程

### 新用户注册流程

```
1. 访问 /auth/register
2. 填写注册表单
3. 提交注册
4. 检查邮箱验证（如果启用）
5. 访问 /auth/login
6. 登录账号
7. 开始使用
```

### 管理员设置流程

```
1. 注册普通账号
2. 在 Supabase 中设置 is_admin = true
3. 登录账号
4. 访问 /admin/gifts
5. 开始管理商品
```

## 🛠️ 管理员操作

### 查看所有管理员

```sql
SELECT id, email, display_name, is_admin, created_at
FROM profiles
WHERE is_admin = true;
```

### 添加管理员

```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'new-admin@example.com';
```

### 移除管理员

```sql
UPDATE profiles 
SET is_admin = false 
WHERE email = 'old-admin@example.com';
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

## 🎨 UI 组件

### 用户导航

```typescript
// components/user-nav.tsx

未登录状态：
- [登录] 按钮
- [注册] 按钮

已登录状态：
- 金币显示
- 用户头像
- 下拉菜单：
  - 个人中心
  - 学习统计
  - 排行榜
  - 退出登录
```

### 登录表单

```typescript
// app/auth/login/page.tsx

- 邮箱输入框（带图标）
- 密码输入框（带图标）
- 登录按钮（带加载状态）
- 注册链接
- 忘记密码链接
- 返回首页按钮
```

## 🔄 重定向规则

### 自动重定向

```typescript
// 未登录访问受保护页面
/admin/gifts → /auth/login?redirect=/admin/gifts

// 登录成功后
/auth/login?redirect=/admin/gifts → /admin/gifts

// 已登录访问登录页
/auth/login → /

// 非管理员访问管理后台
/admin/gifts → /?error=unauthorized
```

## 🐛 故障排除

### 问题1: 无法登录

**可能原因：**
- 邮箱或密码错误
- 账号未验证（如果启用邮箱验证）
- 网络问题

**解决方法：**
1. 检查邮箱和密码是否正确
2. 检查 Supabase 控制台的用户列表
3. 重置密码

### 问题2: 登录后仍显示"无权访问"

**可能原因：**
- 账号不是管理员

**解决方法：**
```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

### 问题3: 注册后无法登录

**可能原因：**
- 需要邮箱验证

**解决方法：**
1. 检查邮箱中的验证链接
2. 或在 Supabase 控制台手动验证用户

### 问题4: 中间件不工作

**可能原因：**
- middleware.ts 配置错误
- Supabase 环境变量未设置

**解决方法：**
1. 检查 `.env.local` 文件
2. 确保有以下变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

## 📊 数据库查询

### 查看用户信息

```sql
SELECT 
  id,
  email,
  display_name,
  is_admin,
  coins,
  created_at
FROM profiles
WHERE email = 'user@example.com';
```

### 查看登录历史

```sql
SELECT 
  user_id,
  created_at,
  ip_address
FROM auth.audit_log_entries
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC
LIMIT 10;
```

## 🎯 最佳实践

### 1. 密码管理
- 使用强密码
- 定期更换密码
- 不要共享账号

### 2. 管理员权限
- 只给必要的人管理员权限
- 定期审查管理员列表
- 记录管理员操作

### 3. 安全建议
- 启用邮箱验证
- 使用 HTTPS
- 定期备份数据
- 监控异常登录

## 🔧 配置选项

### Supabase Auth 设置

在 Supabase Dashboard → Authentication → Settings:

```
✅ Enable Email Confirmations（启用邮箱验证）
✅ Enable Email Change Confirmations
✅ Secure Password Change
⚙️ Minimum Password Length: 6
⚙️ Session Timeout: 7 days
```

### 自定义邮件模板

在 Supabase Dashboard → Authentication → Email Templates:

- Confirm Signup（注册确认）
- Reset Password（重置密码）
- Change Email（更改邮箱）

## 📱 响应式设计

### 移动端
- 全屏表单
- 大按钮
- 清晰的输入框

### 桌面端
- 居中卡片
- 美观的渐变背景
- 合适的间距

## 🎉 完成清单

- [x] 创建登录页面
- [x] 创建注册页面
- [x] 配置中间件
- [x] 添加路由保护
- [x] 更新用户导航
- [x] 创建管理员脚本
- [x] 编写文档

## 📚 相关文档

- `GIFT_SHOP_BACKEND_SETUP.md` - 商品管理系统
- `GIFT_SHOP_QUICK_START.md` - 快速开始指南
- `supabase-setup.sql` - 数据库设置

## 🚀 下一步

1. 注册测试账号
2. 设置管理员权限
3. 登录并访问管理后台
4. 开始添加商品

---

**创建时间**: 2024年11月26日
**状态**: ✅ 已完成
**版本**: 1.0
