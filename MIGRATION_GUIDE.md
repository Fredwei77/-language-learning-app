# 金币系统迁移指南

## 概述
金币系统已从 localStorage 迁移到 Supabase 数据库，提供更安全、可靠的数据存储。

## 数据库表结构

确保 Supabase 中已创建以下表：

### 1. profiles 表
```sql
-- 已存在，需要确保有以下字段
coins INTEGER DEFAULT 0
total_study_time INTEGER DEFAULT 0
streak_days INTEGER DEFAULT 0
last_check_in TIMESTAMP
```

### 2. coin_transactions 表
```sql
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'spend', 'purchase')),
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX idx_coin_transactions_created_at ON coin_transactions(created_at);
```

### 3. gift_redemptions 表
```sql
CREATE TABLE gift_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  gift_id TEXT NOT NULL,
  gift_name TEXT NOT NULL,
  coins_spent INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gift_redemptions_user_id ON gift_redemptions(user_id);
CREATE INDEX idx_gift_redemptions_status ON gift_redemptions(status);
```

### 4. learning_progress 表
```sql
-- 已存在，需要确保有以下字段
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
module_type TEXT NOT NULL
lesson_id TEXT
progress INTEGER DEFAULT 0
score INTEGER DEFAULT 0
time_spent INTEGER DEFAULT 0
completed_at TIMESTAMP
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

## API 端点

### 获取金币余额
```typescript
GET /api/coins/balance
返回: { total, dailyPracticeTime, earnedToday, history }
```

### 记录练习时长
```typescript
POST /api/coins/practice
Body: { seconds: number }
返回: { earnedCoins, canExplode, totalCoins, dailyPracticeTime }
```

### 兑换礼物
```typescript
POST /api/coins/redeem
Body: { giftId, giftName, giftCoins }
返回: { success, message, remainingCoins }
```

## 代码迁移

### 旧代码（localStorage）
```typescript
import { getUserCoins, addPracticeTime, redeemGift } from "@/lib/coins-system"

// 获取金币
const coins = getUserCoins()

// 添加练习时长
const result = addPracticeTime(30)

// 兑换礼物
const result = redeemGift(giftId)
```

### 新代码（数据库）
```typescript
import { getUserCoinsFromDB, addPracticeTimeDB, redeemGiftDB } from "@/lib/coins-system"

// 获取金币
const coins = await getUserCoinsFromDB()

// 添加练习时长
const result = await addPracticeTimeDB(30)

// 兑换礼物
const result = await redeemGiftDB(giftId, giftName, giftCoins)
```

## 注意事项

1. **认证要求**：所有 API 端点都需要用户登录
2. **错误处理**：所有函数都可能返回 null，需要处理错误情况
3. **向后兼容**：旧的 localStorage 函数仍然保留，但已标记为 @deprecated
4. **数据迁移**：现有 localStorage 数据不会自动迁移，用户需要重新开始

## 环境变量

确保 `.env.local` 文件包含所有必需的环境变量（参考 `.env.example`）：

```bash
OPENROUTER_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_APP_URL=
```

## 测试清单

- [ ] 用户登录后可以查看金币余额
- [ ] 完成30分钟练习可以获得100金币
- [ ] 金币交易记录正确保存
- [ ] 礼物兑换功能正常工作
- [ ] 金币不足时无法兑换
- [ ] 多设备数据同步正常
