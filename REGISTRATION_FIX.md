# 注册邮箱验证修复指南

## 问题描述
用户注册后收到的邮箱验证链接无法访问，显示 "ERR_CONNECTION_REFUSED" 错误。

## 问题原因
1. 缺少邮件确认回调路由 (`/auth/callback`)
2. 注册时没有设置正确的 `emailRedirectTo` 参数
3. Supabase 邮件模板中的重定向 URL 配置不正确

## 解决方案

### 1. 创建了邮件确认回调路由
**文件：** `app/auth/callback/route.ts`

这个路由处理 Supabase 邮件中的验证链接，将验证码交换为会话。

### 2. 创建了确认结果页面
**文件：** `app/auth/confirm/page.tsx`

显示验证成功或失败的友好界面。

### 3. 更新了注册逻辑
**文件：** `app/auth/register/page.tsx`

添加了 `emailRedirectTo` 参数，确保验证链接指向正确的回调地址。

## Supabase 配置步骤

### 步骤 1: 配置重定向 URL

1. 登录 Supabase Dashboard
2. 进入你的项目
3. 点击左侧菜单 **Authentication** → **URL Configuration**
4. 在 **Redirect URLs** 中添加以下 URL：

**本地开发：**
```
http://localhost:3000/auth/callback
http://localhost:3000/auth/confirm
```

**生产环境（替换为你的域名）：**
```
https://your-domain.netlify.app/auth/callback
https://your-domain.netlify.app/auth/confirm
```

5. 点击 **Save** 保存

### 步骤 2: 配置邮件模板（可选）

1. 在 Supabase Dashboard 中
2. 点击 **Authentication** → **Email Templates**
3. 选择 **Confirm signup** 模板
4. 确保模板中包含正确的确认链接：

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

默认模板通常已经正确配置，不需要修改。

### 步骤 3: 配置站点 URL

1. 在 **Authentication** → **URL Configuration** 中
2. 设置 **Site URL**：

**本地开发：**
```
http://localhost:3000
```

**生产环境：**
```
https://your-domain.netlify.app
```

## 注册流程说明

### 用户注册流程

1. **用户填写注册表单**
   - 输入邮箱、密码等信息
   - 点击"注册"按钮

2. **系统创建账号**
   - 调用 Supabase `signUp` API
   - 设置 `emailRedirectTo` 为 `/auth/callback`

3. **发送验证邮件**
   - Supabase 自动发送验证邮件
   - 邮件包含验证链接

4. **用户点击邮件链接**
   - 链接格式：`https://your-domain.netlify.app/auth/callback?code=xxx`
   - 浏览器打开回调页面

5. **验证邮箱**
   - `/auth/callback` 路由处理验证
   - 将验证码交换为会话
   - 重定向到首页或登录页

6. **完成注册**
   - 用户可以登录使用

## 测试步骤

### 本地测试

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问注册页面**
   ```
   http://localhost:3000/auth/register
   ```

3. **填写注册信息**
   - 使用真实邮箱地址
   - 设置密码（至少6个字符）

4. **检查邮箱**
   - 打开邮箱查收验证邮件
   - 点击验证链接

5. **验证结果**
   - 应该看到"验证成功"页面
   - 3秒后自动跳转到登录页

### 生产环境测试

1. **部署到 Netlify**
   ```bash
   git add -A
   git commit -m "修复注册邮箱验证"
   git push origin main
   ```

2. **等待部署完成**
   - 在 Netlify Dashboard 查看部署状态

3. **配置 Supabase**
   - 按照上面的步骤配置重定向 URL
   - 使用生产环境域名

4. **测试注册**
   - 访问 `https://your-domain.netlify.app/auth/register`
   - 完成注册流程
   - 验证邮件链接

## 故障排除

### 问题 1: 仍然显示 "ERR_CONNECTION_REFUSED"

**原因：** Supabase 重定向 URL 配置不正确

**解决方案：**
1. 检查 Supabase Dashboard 中的 Redirect URLs
2. 确保包含 `/auth/callback` 路径
3. 确保域名正确（包括 https://）
4. 保存后等待几分钟生效

### 问题 2: 验证链接显示 "Invalid or expired link"

**原因：** 验证链接已过期或已使用

**解决方案：**
1. 重新注册一个新账号
2. 或在 Supabase Dashboard 中手动验证用户邮箱：
   - Authentication → Users
   - 找到用户
   - 点击 "..." → Confirm email

### 问题 3: 点击验证链接后显示 404

**原因：** 回调路由未正确部署

**解决方案：**
1. 确认 `app/auth/callback/route.ts` 文件存在
2. 重新部署应用
3. 清除浏览器缓存

### 问题 4: 验证成功但无法登录

**原因：** 会话未正确创建

**解决方案：**
1. 检查浏览器 Console 是否有错误
2. 尝试手动登录
3. 检查 Supabase 环境变量是否正确

## 环境变量检查

确保以下环境变量已正确配置：

**本地开发 (`.env.local`)：**
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Netlify 环境变量：**
1. Netlify Dashboard → Site settings → Environment variables
2. 添加相同的环境变量
3. 重新部署

## 开发模式下的注意事项

### 使用真实邮箱
开发时建议使用真实邮箱地址，因为需要接收验证邮件。

### 邮件发送限制
Supabase 免费版有邮件发送限制：
- 每小时最多发送 4 封邮件
- 如果超限，等待一小时后重试

### 测试邮箱
可以使用以下测试邮箱服务：
- [Mailtrap](https://mailtrap.io/) - 邮件测试工具
- [Temp Mail](https://temp-mail.org/) - 临时邮箱

## 禁用邮箱验证（仅开发环境）

如果在开发环境想跳过邮箱验证：

1. Supabase Dashboard
2. Authentication → Settings
3. 找到 **Email Auth**
4. 关闭 **Enable email confirmations**

⚠️ **警告：** 生产环境不要禁用邮箱验证！

## 相关文件

- `app/auth/callback/route.ts` - 邮件验证回调路由
- `app/auth/confirm/page.tsx` - 验证结果页面
- `app/auth/register/page.tsx` - 注册页面
- `app/auth/login/page.tsx` - 登录页面

## 更新日志

**2024-11-26**
- ✅ 创建邮件验证回调路由
- ✅ 创建验证结果页面
- ✅ 更新注册逻辑添加 emailRedirectTo
- ✅ 添加错误处理和用户反馈

## 下一步

1. 部署代码到 Netlify
2. 配置 Supabase 重定向 URL
3. 测试完整注册流程
4. 如有问题参考故障排除部分
