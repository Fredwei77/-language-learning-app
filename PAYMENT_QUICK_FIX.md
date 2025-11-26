# 💳 支付问题快速修复

## 🔴 问题
访问 `/coins` 页面时出现错误：
```
Runtime TypeError: Cannot read properties of undefined (reading 'match')
```

## ✅ 原因
缺少 Stripe Publishable Key 环境变量

## 🚀 快速修复步骤

### 1. 获取 Stripe Publishable Key

访问 https://dashboard.stripe.com/test/apikeys

找到 **Publishable key**（以 `pk_test_` 开头）

### 2. 更新 `.env.local`

打开 `.env.local` 文件，找到这一行：

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_
```

将 `pk_test_` 替换为你的完整 Publishable Key，例如：

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SXG0rPyLPASs4oMxxxxxxxxxxxxx
```

### 3. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
npm run dev
```

### 4. 测试

访问 http://localhost:3000/coins

点击任意金币套餐，应该能看到支付窗口

---

## 📋 完整的 Stripe 配置

你的 `.env.local` 应该包含以下 Stripe 相关配置：

```bash
# Stripe 配置
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx  # ⚠️ 必需
STRIPE_SECRET_KEY=sk_test_xxxxx                    # ✅ 已配置
STRIPE_WEBHOOK_SECRET=whsec_xxxxx                  # 可选（生产环境需要）
```

---

## 🧪 测试支付

使用 Stripe 测试卡：

- **卡号**: `4242 4242 4242 4242`
- **过期日期**: 任何未来日期（如 `12/34`）
- **CVC**: 任何 3 位数字（如 `123`）
- **邮编**: 任何 5 位数字（如 `12345`）

---

## ✨ 已完成的改进

1. ✅ 添加了环境变量检查
2. ✅ 改进了错误提示
3. ✅ 创建了 Webhook 处理器
4. ✅ 更新了配置文档

---

## 📚 详细文档

查看 `PAYMENT_FIX_GUIDE.md` 获取完整的配置指南和故障排除。

---

*快速修复完成后，记得重启开发服务器！*
