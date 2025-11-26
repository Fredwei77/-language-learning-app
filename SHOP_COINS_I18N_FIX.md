# Gift Shop 和 Coins 页面国际化修复

## 修复完成 ✅

已成功修复 Gift Shop 页面、购买金币页面和支付相关组件的国际化问题。

## 修复内容

### 1. 翻译文件更新

#### `lib/i18n/translations/zh.ts` 和 `en.ts`

**Coins 页面翻译扩展：**
- 添加了页面标题和导航文本
- 添加了统计数据标签（当前金币、连续签到、学习时长、交易记录）
- 添加了金币余额卡片文本
- 添加了购买金币套餐相关文本
- 添加了交易历史记录相关文本
- 添加了如何赚取金币的说明文本

**Payment 支付翻译扩展：**
- 添加了支付功能未配置提示
- 添加了 Stripe 配置指南文本
- 添加了获取 API 密钥链接文本

### 2. 组件更新

#### `components/checkout.tsx`
- 导入并使用 `useLocale` hook
- 将支付功能未配置提示改为使用翻译
- 将配置指南文本改为使用翻译

#### `components/payment-dialog.tsx`
- 导入并使用 `useLocale` hook
- 将对话框标题和副标题改为使用翻译

#### `components/payment-dialog-fullscreen.tsx`
- 导入并使用 `useLocale` hook
- 将全屏对话框标题和副标题改为使用翻译
- 将关闭按钮的 sr-only 文本改为使用翻译

#### `app/coins/page.tsx`
- 导入并使用 `useLocale` hook
- 更新页面标题和导航按钮文本
- 更新金币余额卡片的所有文本
- 更新统计数据标签
- 更新购买金币套餐的标题和描述
- 更新"最受欢迎"和"赠送"徽章文本
- 更新"如何免费获得金币"部分的所有文本
- 更新交易历史记录部分的所有文本

### 3. 已修复的页面

✅ **Gift Shop 页面** (`app/shop/page.tsx`)
- 已经使用了 `useLocale` hook
- 所有文本都已使用翻译变量

✅ **Coins 页面** (`app/coins/page.tsx`)
- 所有硬编码的中文文本已替换为翻译变量
- 包括：标题、统计数据、购买套餐、赚取方式、交易记录等

✅ **支付组件**
- `checkout.tsx` - 配置提示已国际化
- `payment-dialog.tsx` - 对话框标题已国际化
- `payment-dialog-fullscreen.tsx` - 全屏对话框已国际化

## 翻译覆盖范围

### 中文 (zh)
- 我的金币
- 我的金币余额
- 继续学习或购买金币，获取更多奖励！
- 开始练习赚金币
- 浏览礼物商城
- 去兑换
- 返回首页
- 当前金币
- 连续签到
- 学习时长
- 交易记录
- 购买金币
- 选择金币套餐，立即充值
- 最受欢迎
- 赠送
- 如何免费获得金币？
- 每日签到
- 口语练习
- 完成课程
- 金币记录
- 查看你的金币获取和消费历史
- 暂无金币记录
- 开始练习或签到来获得第一笔金币吧！
- 获得金币
- 消费金币
- 购买金币
- 支付功能未配置
- 请在 .env.local 文件中添加 Stripe 配置
- 查看配置指南
- 获取 Stripe API 密钥

### 英文 (en)
- My Coins
- My Coin Balance
- Keep learning or purchase coins to get more rewards!
- Start Practice to Earn Coins
- Browse Gift Shop
- Redeem
- Back to Home
- Current Coins
- Streak Days
- Study Time
- Transactions
- Purchase Coins
- Choose a coin package and recharge now
- Most Popular
- Bonus
- How to Earn Free Coins?
- Daily Check-in
- Speaking Practice
- Complete Lessons
- Transaction History
- View your coin earning and spending history
- No transaction records yet
- Start practicing or check in to earn your first coins!
- Earned Coins
- Spent Coins
- Purchased Coins
- Payment feature not configured
- Please add Stripe configuration in .env.local file
- View configuration guide
- Get Stripe API Key

## 测试建议

1. **切换语言测试**
   - 访问 `/coins` 页面
   - 切换语言开关
   - 验证所有文本是否正确切换

2. **购买流程测试**
   - 点击购买金币套餐
   - 检查支付对话框标题和描述
   - 验证 Stripe 配置提示（如果未配置）

3. **交易记录测试**
   - 查看交易历史记录
   - 验证交易类型标签是否正确翻译

4. **统计数据测试**
   - 检查统计卡片的标签
   - 验证单位（天、分钟）是否正确翻译

## 注意事项

- 所有组件都已正确导入 `useLocale` hook
- 翻译变量都遵循现有的命名规范
- 保持了原有的 UI 布局和样式
- 没有破坏任何现有功能

## 相关文件

- `lib/i18n/translations/zh.ts` - 中文翻译
- `lib/i18n/translations/en.ts` - 英文翻译
- `app/coins/page.tsx` - 金币页面
- `components/checkout.tsx` - 支付组件
- `components/payment-dialog.tsx` - 支付对话框
- `components/payment-dialog-fullscreen.tsx` - 全屏支付对话框
- `app/shop/page.tsx` - 礼物商城页面（已完成）
