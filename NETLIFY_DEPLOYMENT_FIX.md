# Netlify 部署修复指南

## 问题总结

部署失败的原因：
1. ✅ **已修复** - Next.js 15 动态路由参数类型变更（`params` 现在是 Promise）
2. ✅ **已修复** - 环境变量验证在构建时过于严格
3. ✅ **已修复** - 某些页面在构建时尝试访问 Supabase

## 已完成的修复

### 1. 动态路由参数修复
修改了 `app/api/gifts/[id]/route.ts`，将所有路由处理器的 params 改为 Promise 类型：

```typescript
// 修改前
export async function GET(request: Request, { params }: { params: { id: string } })

// 修改后
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // ...
}
```

### 2. 环境变量验证修复
修改了 `lib/env.ts`，允许构建时缺少环境变量：

```typescript
// 使用 .default("") 而不是强制要求
const envSchema = z.object({
  OPENROUTER_API_KEY: z.string().default(""),
  NEXT_PUBLIC_SUPABASE_URL: z.string().default(""),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default(""),
  STRIPE_SECRET_KEY: z.string().default(""),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
})
```

### 3. Stripe 和 Supabase 客户端修复
- `lib/stripe.ts` - 添加了默认占位符
- `lib/supabase/server.ts` - 添加了空字符串回退

### 4. 动态渲染配置
为需要数据库访问的页面添加了动态渲染配置：
- `app/admin/layout.tsx` - 新建，强制 admin 路由动态渲染
- `app/profile/page.tsx` - 添加 `dynamic = "force-dynamic"`
- `app/leaderboard/page.tsx` - 添加 `dynamic = "force-dynamic"`

## 下一步：在 Netlify 配置环境变量

虽然现在可以构建成功，但要让应用正常运行，你需要在 Netlify 添加环境变量：

### 方法 1：通过 Netlify UI

1. 登录 Netlify
2. 进入你的项目
3. 点击 **Site settings** → **Build & deploy** → **Environment**
4. 点击 **Add a variable** 添加以下变量：

```
OPENROUTER_API_KEY=你的_OpenRouter_API_密钥
NEXT_PUBLIC_SUPABASE_URL=你的_Supabase_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_Supabase_匿名密钥
STRIPE_SECRET_KEY=你的_Stripe_密钥
NEXT_PUBLIC_APP_URL=https://你的域名.netlify.app
```

5. 保存后重新部署

### 方法 2：通过 Netlify CLI

```bash
netlify env:set OPENROUTER_API_KEY "你的密钥"
netlify env:set NEXT_PUBLIC_SUPABASE_URL "你的URL"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "你的密钥"
netlify env:set STRIPE_SECRET_KEY "你的密钥"
netlify env:set NEXT_PUBLIC_APP_URL "https://你的域名.netlify.app"
```

## 环境变量获取位置

### OPENROUTER_API_KEY
- 访问：https://openrouter.ai/keys
- 注册并创建 API Key

### Supabase 变量
- 访问：https://supabase.com/dashboard
- 进入你的项目
- Settings → API
- 复制 URL 和 anon/public key

### STRIPE_SECRET_KEY
- 访问：https://dashboard.stripe.com/test/apikeys
- 复制 Secret key（以 `sk_test_` 开头）

## 验证部署

1. 提交并推送代码到 Git
2. Netlify 会自动触发新的部署
3. 构建应该会成功
4. 检查部署日志确认没有错误

## 本地测试

确保你的 `.env.local` 文件包含所有必需的环境变量：

```env
OPENROUTER_API_KEY=sk-or-v1-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

运行构建测试：
```bash
npm run build
```

## 故障排除

### 如果构建仍然失败
1. 检查 Netlify 构建日志中的具体错误
2. 确认所有环境变量都已正确设置
3. 检查环境变量名称是否完全匹配（区分大小写）

### 如果运行时出错
1. 检查浏览器控制台的错误信息
2. 确认 Supabase 和 Stripe 配置正确
3. 检查 API 密钥是否有效

## 构建结果

```
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages (25/25)
✓ Finalizing page optimization

Route (app)
├ ○ /                    (静态)
├ ƒ /admin/gifts         (动态)
├ ƒ /profile             (动态)
├ ƒ /leaderboard         (动态)
└ ƒ /api/*               (API 路由)
```

## 总结

✅ 代码已修复，可以在没有环境变量的情况下构建
✅ TypeScript 类型错误已解决
✅ 动态路由参数已更新为 Promise 类型
✅ 需要数据库的页面已配置为动态渲染
✅ 本地构建测试通过

⚠️ 需要在 Netlify 添加环境变量才能让应用正常运行
