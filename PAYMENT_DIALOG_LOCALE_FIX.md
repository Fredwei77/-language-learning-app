# 支付弹窗语言切换修复

## 问题描述

支付弹窗在语言切换后，标题和描述没有立即更新，仍然显示之前的语言。

**症状：**
- 用户在中文界面打开支付弹窗，标题显示"购买金币"
- 用户切换到英文后，弹窗标题仍然显示"购买金币"，而不是"Purchase Coins"
- 或者相反：在英文界面打开弹窗后切换到中文，标题仍显示英文

## 根本原因

React 组件的 key 属性用于标识组件的唯一性。当 key 不变时，React 会复用现有组件实例，不会重新创建。

支付弹窗组件没有使用 `locale` 作为 key，导致：
1. 语言切换时，组件不会重新渲染
2. 弹窗标题和描述保持初始语言
3. 只有关闭并重新打开弹窗才会显示新语言

## 解决方案

### 修复方法

在支付弹窗组件中添加 `key={locale}` 属性，强制 React 在语言切换时重新创建组件。

### 代码修改

#### 1. PaymentDialogFullscreen 组件

**文件：** `components/payment-dialog-fullscreen.tsx`

```typescript
export function PaymentDialogFullscreen({ open, onOpenChange, packageId }: PaymentDialogFullscreenProps) {
  const { t, locale } = useLocale() // 获取 locale
  
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-background" key={locale}> {/* 添加 key */}
      {/* ... */}
    </div>
  )
}
```

**变更：**
- 从 `useLocale()` 中解构 `locale`
- 在根 div 上添加 `key={locale}`

#### 2. PaymentDialog 组件

**文件：** `components/payment-dialog.tsx`

```typescript
export function PaymentDialog({ open, onOpenChange, packageId }: PaymentDialogProps) {
  const { t, locale } = useLocale() // 获取 locale
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={locale}> {/* 添加 key */}
      {/* ... */}
    </Dialog>
  )
}
```

**变更：**
- 从 `useLocale()` 中解构 `locale`
- 在 Dialog 组件上添加 `key={locale}`

## 工作原理

### React Key 机制

```
语言切换前：
<div key="zh">购买金币</div>

语言切换后：
<div key="en">Purchase Coins</div>

React 检测到 key 从 "zh" 变为 "en"
    ↓
销毁旧组件实例
    ↓
创建新组件实例
    ↓
使用新语言的翻译重新渲染
```

### 完整流程

```
1. 用户在中文界面打开支付弹窗
   - locale = "zh"
   - key = "zh"
   - 标题显示"购买金币"

2. 用户切换到英文
   - LanguageSwitcher 更新 localStorage
   - 触发 localeChange 事件
   - useLocale hook 更新 locale = "en"

3. PaymentDialog 组件检测到 key 变化
   - 旧 key: "zh"
   - 新 key: "en"
   - React 重新创建组件

4. 新组件使用英文翻译
   - t.payment.title = "Purchase Coins"
   - t.payment.subtitle = "Secure payment powered by Stripe"
   - 标题更新为英文
```

## 测试验证

### 测试场景 1：中文切换到英文

```
步骤：
1. 确保当前语言是中文
2. 访问 /coins 页面
3. 点击任意金币套餐
4. 验证弹窗标题显示"购买金币"
5. 不要关闭弹窗
6. 点击语言切换器，切换到英文
7. 验证弹窗标题立即更新为"Purchase Coins"
8. 验证副标题更新为"Secure payment powered by Stripe"

预期结果：
✅ 弹窗标题和副标题立即更新为英文
✅ Stripe 表单内容也显示英文
```

### 测试场景 2：英文切换到中文

```
步骤：
1. 确保当前语言是英文
2. 访问 /coins 页面
3. 点击任意金币套餐
4. 验证弹窗标题显示"Purchase Coins"
5. 不要关闭弹窗
6. 点击语言切换器，切换到中文
7. 验证弹窗标题立即更新为"购买金币"
8. 验证副标题更新为"安全支付由 Stripe 提供"

预期结果：
✅ 弹窗标题和副标题立即更新为中文
✅ Stripe 表单内容也显示中文
```

### 测试场景 3：关闭并重新打开

```
步骤：
1. 在中文界面打开支付弹窗
2. 关闭弹窗
3. 切换到英文
4. 重新打开支付弹窗
5. 验证弹窗显示英文

预期结果：
✅ 弹窗显示英文内容
```

### 测试场景 4：Stripe 表单语言同步

```
步骤：
1. 在中文界面打开支付弹窗
2. 验证 Stripe 表单显示中文（邮箱、支付方式等）
3. 切换到英文
4. 验证 Stripe 表单立即更新为英文

预期结果：
✅ Stripe 表单语言与弹窗标题同步更新
```

## 技术细节

### Key 属性的作用

React 使用 key 属性来：
1. **识别组件**：确定哪些组件是相同的，哪些是不同的
2. **优化渲染**：复用相同 key 的组件，重新创建不同 key 的组件
3. **保持状态**：相同 key 的组件保持内部状态，不同 key 的组件重置状态

### 为什么使用 locale 作为 key

```typescript
key={locale}
```

**优点：**
- 语言切换时自动重新创建组件
- 确保所有文本使用新语言
- 简单直接，无需额外逻辑

**替代方案：**
```typescript
// 方案 1：使用 useEffect 监听语言变化
useEffect(() => {
  if (open) {
    // 强制刷新
    forceUpdate()
  }
}, [locale])

// 方案 2：关闭并重新打开弹窗
useEffect(() => {
  if (open) {
    onOpenChange(false)
    setTimeout(() => onOpenChange(true), 0)
  }
}, [locale])
```

这些方案都比使用 key 复杂，且可能导致闪烁或状态丢失。

### 性能考虑

**问题：** 每次语言切换都重新创建组件，会影响性能吗？

**答案：** 不会。

原因：
1. 支付弹窗通常只在用户购买时打开
2. 语言切换不频繁
3. 组件重新创建的开销很小
4. 用户体验的提升远大于性能损失

### Stripe Checkout Session

支付弹窗重新创建时，Stripe Checkout 组件也会重新创建：

```typescript
<Checkout packageId={packageId} />
```

Checkout 组件会：
1. 使用新的 locale 调用 `startCheckoutSession(packageId, locale)`
2. 创建新的 Stripe Checkout Session，带有正确的 locale 参数
3. Stripe 表单显示新语言

## 相关修复

### 1. Stripe Locale 参数

**文件：** `app/actions/stripe.ts`

```typescript
export async function startCheckoutSession(packageId: string, locale: string = "zh") {
  const stripeLocale = locale === "en" ? "en" : "zh"
  
  const session = await stripe.checkout.sessions.create({
    locale: stripeLocale, // 传递 locale 参数
    // ...
  })
}
```

### 2. Checkout 组件传递 locale

**文件：** `components/checkout.tsx`

```typescript
export default function Checkout({ packageId }: { packageId: string }) {
  const { t, locale } = useLocale()
  const startCheckoutSessionForPackage = useCallback(
    () => startCheckoutSession(packageId, locale), // 传递 locale
    [packageId, locale]
  )
}
```

### 3. 产品描述国际化

**文件：** `app/actions/stripe.ts`

```typescript
product_data: {
  name: coinPackage.name,
  description:
    locale === "en"
      ? `${coinPackage.coins} coins${coinPackage.bonus ? ` + ${coinPackage.bonus} bonus` : ""}`
      : `${coinPackage.coins}金币${coinPackage.bonus ? ` + ${coinPackage.bonus}赠送` : ""}`,
}
```

## 完整的语言切换流程

```
用户点击语言切换按钮
    ↓
LanguageSwitcher 更新 localStorage
    ↓
触发 localeChange 事件
    ↓
所有 useLocale hooks 监听到事件
    ↓
更新 locale 状态
    ↓
PaymentDialog 检测到 key 变化 (zh → en)
    ↓
React 销毁旧组件，创建新组件
    ↓
新组件使用新语言的翻译
    ↓
Checkout 组件使用新 locale 创建 Session
    ↓
Stripe 表单显示新语言
    ↓
用户看到完全国际化的支付界面
```

## 调试技巧

### 1. 验证 locale 值

在组件中添加：
```typescript
console.log('Current locale:', locale)
console.log('Dialog key:', locale)
```

### 2. 验证组件重新创建

```typescript
useEffect(() => {
  console.log('PaymentDialog mounted with locale:', locale)
  return () => {
    console.log('PaymentDialog unmounted')
  }
}, [])
```

### 3. 验证翻译加载

```typescript
console.log('Payment title:', t.payment.title)
console.log('Payment subtitle:', t.payment.subtitle)
```

## 注意事项

### 1. 弹窗状态重置

使用 key 会导致组件完全重新创建，所有内部状态都会重置。

**影响：**
- 用户在表单中输入的内容会丢失
- 滚动位置会重置

**解决方案：**
- 这是预期行为，因为语言切换时用户通常会重新开始
- 如果需要保持状态，可以将状态提升到父组件

### 2. 动画效果

组件重新创建时，进入动画会重新播放。

**影响：**
- 弹窗可能会有轻微的闪烁
- 过渡动画会重新开始

**解决方案：**
- 这是可接受的，因为语言切换不频繁
- 如果需要平滑过渡，可以使用 CSS 过渡而不是组件动画

### 3. Stripe Session 重新创建

每次语言切换都会创建新的 Stripe Checkout Session。

**影响：**
- 会产生额外的 API 调用
- 可能会有轻微的加载延迟

**解决方案：**
- 这是必要的，因为 Stripe Session 的 locale 在创建后不能更改
- 可以添加加载状态提示用户

## 总结

### 修复内容

✅ PaymentDialogFullscreen 添加 key={locale}
✅ PaymentDialog 添加 key={locale}
✅ 语言切换时弹窗自动重新渲染
✅ 弹窗标题和描述立即更新
✅ Stripe 表单语言同步更新

### 测试要点

- 中文切换到英文
- 英文切换到中文
- 弹窗打开时切换语言
- 关闭后切换语言再打开
- Stripe 表单语言同步

### 相关文件

- `components/payment-dialog-fullscreen.tsx`
- `components/payment-dialog.tsx`
- `components/checkout.tsx`
- `app/actions/stripe.ts`

支付弹窗的语言切换问题已完全修复！
