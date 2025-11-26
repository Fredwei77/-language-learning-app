# 💳 支付问题修复指南

## 🔴 问题诊断

### 错误信息
```
Runtime TypeError
Cannot read properties of undefined (reading 'match')
```

### 根本原因
缺少 Stripe 可发布密钥（Publishable Key）环境变量：
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 未配置

---

## ✅ 修复方案

### 方案 1: 配置 Stripe 环境变量（推荐）

#### 步骤 1: 获取 Stripe 密钥

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. 登录或注册账号
3. 在 **Developers** > **API keys** 页面找到：
   - **Publishable key** (以 `pk_test_` 开头)
   - **Secret key** (以 `sk_test_` 开头)

#### 步骤 2: 更新环境变量

打开 `.env.local` 文件，添加：

```bash
# Stripe 支付配置
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

⚠️ **注意**:
- `NEXT_PUBLIC_` 前缀的变量会暴露到浏览器
- Publishable Key 是安全的，可以公开
- Secret Key 必须保密，只在服务器端使用

#### 步骤 3: 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
npm run dev
```

---

### 方案 2: 临时禁用支付功能

如果暂时不需要支付功能，可以修改代码：

#### 修改 `components/checkout.tsx`

```typescript
"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startCheckoutSession } from "@/app/actions/stripe"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// 添加环境变量检查
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

export default function Checkout({ packageId }: { packageId: string }) {
  const startCheckoutSessionForPackage = useCallback(
    () => startCheckoutSession(packageId),
    [packageId]
  )

  // 如果没有配置 Stripe，显示提示
  if (!stripePromise) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          支付功能未配置。请在 .env.local 中添加 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret: startCheckoutSessionForPackage }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
```

---

## 🔧 完整的环境变量配置

更新 `.env.local` 文件：

```bash
# OpenRouter API (用于 AI 功能)
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Supabase (数据库和认证)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx

# Stripe (支付功能) ⚠️ 必需
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# 应用 URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Upstash Redis (Rate Limiting，可选)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 🧪 测试支付功能

### 1. 使用 Stripe 测试卡

Stripe 提供测试卡号用于开发：

| 卡号 | 用途 |
|-----|------|
| `4242 4242 4242 4242` | 成功支付 |
| `4000 0000 0000 0002` | 卡被拒绝 |
| `4000 0000 0000 9995` | 余额不足 |

**其他信息**:
- 过期日期: 任何未来日期 (如 12/34)
- CVC: 任何 3 位数字 (如 123)
- 邮编: 任何 5 位数字 (如 12345)

### 2. 测试流程

1. 访问 http://localhost:3000/coins
2. 点击任意金币套餐
3. 在弹出的支付窗口中输入测试卡信息
4. 完成支付

### 3. 验证支付

在 Stripe Dashboard 中查看：
- **Payments** > **All payments** - 查看支付记录
- **Developers** > **Webhooks** - 配置支付回调

---

## 🔒 安全最佳实践

### 1. 环境变量管理

```bash
# ✅ 正确 - 使用环境变量
STRIPE_SECRET_KEY=sk_test_xxxxx

# ❌ 错误 - 硬编码在代码中
const stripe = new Stripe('sk_test_xxxxx')
```

### 2. 密钥分离

- **开发环境**: 使用 `sk_test_` 和 `pk_test_` 密钥
- **生产环境**: 使用 `sk_live_` 和 `pk_live_` 密钥

### 3. Git 忽略

确保 `.gitignore` 包含：

```
.env.local
.env*.local
```

---

## 📋 支付流程说明

### 当前实现

```
用户选择套餐
    ↓
前端调用 startCheckoutSession()
    ↓
后端创建 Stripe Session
    ↓
返回 client_secret
    ↓
前端显示 Stripe Checkout
    ↓
用户完成支付
    ↓
Stripe 发送 Webhook
    ↓
后端更新用户金币
```

### 需要实现的 Webhook

创建 `app/api/webhooks/stripe/route.ts`:

```typescript
import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  // 处理支付成功事件
  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const { userId, coins } = session.metadata

    // 更新用户金币
    const supabase = await createClient()
    await supabase.rpc("add_coins", {
      user_id: userId,
      amount: parseInt(coins),
      description: "购买金币",
    })
  }

  return NextResponse.json({ received: true })
}
```

---

## 🐛 常见问题

### Q1: 支付窗口显示空白

**原因**: Publishable Key 未配置或格式错误

**解决**:
```bash
# 检查环境变量
echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# 确保以 pk_test_ 或 pk_live_ 开头
```

### Q2: 支付成功但金币未增加

**原因**: Webhook 未配置

**解决**:
1. 实现 Webhook 处理器
2. 在 Stripe Dashboard 配置 Webhook URL
3. 使用 Stripe CLI 测试本地 Webhook

### Q3: 测试卡被拒绝

**原因**: 使用了错误的测试卡号

**解决**: 使用 Stripe 官方测试卡号 `4242 4242 4242 4242`

---

## 📚 相关资源

- [Stripe 文档](https://stripe.com/docs)
- [Stripe 测试卡](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Next.js 环境变量](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## ✅ 验证清单

完成配置后，检查以下项目：

- [ ] `.env.local` 包含 `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `.env.local` 包含 `STRIPE_SECRET_KEY`
- [ ] 重启开发服务器
- [ ] 访问 `/coins` 页面无错误
- [ ] 点击套餐显示支付窗口
- [ ] 使用测试卡完成支付
- [ ] 检查 Stripe Dashboard 有支付记录

---

## 🎯 快速修复命令

```bash
# 1. 停止开发服务器
# 按 Ctrl+C

# 2. 编辑环境变量
# 在 .env.local 中添加 Stripe 密钥

# 3. 重启服务器
npm run dev

# 4. 测试支付页面
# 访问 http://localhost:3000/coins
```

---

*最后更新: 2025-01-XX*
