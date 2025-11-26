# Stripe 支付表单语言修复

## 问题描述

在购买金币页面，点击购买后弹出的 Stripe 支付表单内容（如"支付方式"、"银行卡信息"、"持卡人姓名"、"支付"按钮等）始终显示中文，即使用户切换到英文界面也不会改变。

## 根本原因

Stripe Embedded Checkout 组件的语言是由创建 Checkout Session 时传递的 `locale` 参数决定的。之前的实现没有传递这个参数，导致 Stripe 使用默认语言（中文）。

## 修复方案

### 1. 更新 Stripe Action (`app/actions/stripe.ts`)

**修改内容：**
- 为 `startCheckoutSession` 函数添加 `locale` 参数（默认值为 "zh"）
- 将用户的语言偏好映射到 Stripe 支持的 locale 格式
- 在创建 Checkout Session 时传递 `locale` 参数
- 根据语言动态生成产品描述文本

**代码变更：**
```typescript
// 之前
export async function startCheckoutSession(packageId: string) {
  // ...
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    // 没有 locale 参数
    line_items: [
      {
        price_data: {
          // ...
          product_data: {
            name: coinPackage.name,
            description: `${coinPackage.coins}金币${coinPackage.bonus ? ` + ${coinPackage.bonus}赠送` : ""}`,
          },
        },
      },
    ],
    // ...
  })
}

// 之后
export async function startCheckoutSession(packageId: string, locale: string = "zh") {
  // ...
  const stripeLocale = locale === "en" ? "en" : "zh"
  
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    locale: stripeLocale as any, // 添加 locale 参数
    line_items: [
      {
        price_data: {
          // ...
          product_data: {
            name: coinPackage.name,
            description:
              locale === "en"
                ? `${coinPackage.coins} coins${coinPackage.bonus ? ` + ${coinPackage.bonus} bonus` : ""}`
                : `${coinPackage.coins}金币${coinPackage.bonus ? ` + ${coinPackage.bonus}赠送` : ""}`,
          },
        },
      },
    ],
    // ...
  })
}
```

### 2. 更新 Checkout 组件 (`components/checkout.tsx`)

**修改内容：**
- 从 `useLocale` hook 中获取当前语言
- 在调用 `startCheckoutSession` 时传递语言参数

**代码变更：**
```typescript
// 之前
export default function Checkout({ packageId }: { packageId: string }) {
  const { t } = useLocale()
  const startCheckoutSessionForPackage = useCallback(
    () => startCheckoutSession(packageId), 
    [packageId]
  )
}

// 之后
export default function Checkout({ packageId }: { packageId: string }) {
  const { t, locale } = useLocale()
  const startCheckoutSessionForPackage = useCallback(
    () => startCheckoutSession(packageId, locale), 
    [packageId, locale]
  )
}
```

## Stripe 支持的语言

Stripe Checkout 支持以下语言代码：
- `zh` - 简体中文
- `zh-HK` - 繁体中文（香港）
- `zh-TW` - 繁体中文（台湾）
- `en` - 英语
- `auto` - 自动检测（根据浏览器语言）

我们的实现将：
- `en` → Stripe 的 `en`
- `zh` → Stripe 的 `zh`

## 修复效果

### 中文界面
当用户选择中文时，Stripe 支付表单将显示：
- 支付方式
- 银行卡信息
- 持卡人姓名
- 国家或地区
- 支付（按钮）
- 产品描述：`100金币 + 10赠送`

### 英文界面
当用户选择英文时，Stripe 支付表单将显示：
- Payment method
- Card information
- Cardholder name
- Country or region
- Pay（按钮）
- 产品描述：`100 coins + 10 bonus`

## 测试步骤

1. **中文测试**
   - 确保语言设置为中文
   - 访问 `/coins` 页面
   - 点击任意金币套餐
   - 验证支付表单显示中文

2. **英文测试**
   - 切换语言到英文
   - 访问 `/coins` 页面
   - 点击任意金币套餐
   - 验证支付表单显示英文

3. **语言切换测试**
   - 打开支付对话框（中文）
   - 关闭对话框
   - 切换到英文
   - 重新打开支付对话框
   - 验证表单语言已更新为英文

## 技术细节

### Stripe Locale 参数
Stripe 的 `locale` 参数控制：
- 表单字段标签
- 按钮文本
- 错误消息
- 占位符文本
- 国家/地区选择器

### 动态产品描述
产品描述也根据语言动态生成：
- 中文：`100金币 + 10赠送`
- 英文：`100 coins + 10 bonus`

### 依赖关系
- `useLocale` hook 提供当前语言状态
- `startCheckoutSession` 接收语言参数
- Stripe API 根据 locale 渲染表单

## 相关文件

- `app/actions/stripe.ts` - Stripe session 创建逻辑
- `components/checkout.tsx` - 支付组件
- `hooks/use-locale.ts` - 语言状态管理

## 注意事项

1. **缓存问题**
   - Stripe Checkout Session 创建后，locale 不能更改
   - 用户切换语言后需要重新打开支付对话框才能看到新语言

2. **浏览器兼容性**
   - Stripe Embedded Checkout 需要现代浏览器支持
   - 确保用户浏览器支持 iframe 和 JavaScript

3. **测试模式**
   - 在测试模式下，所有 Stripe 功能都可用
   - 使用测试卡号进行测试：4242 4242 4242 4242

## 参考文档

- [Stripe Checkout Session API](https://stripe.com/docs/api/checkout/sessions/create)
- [Stripe Supported Locales](https://stripe.com/docs/js/appendix/supported_locales)
- [Stripe Embedded Checkout](https://stripe.com/docs/payments/checkout/embedded)
