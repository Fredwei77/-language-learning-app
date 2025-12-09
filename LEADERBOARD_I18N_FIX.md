# Leaderboard 页面国际化完整修复

## 修复完成 ✅

已成功修复 Leaderboard (排行榜) 页面的所有国际化问题。

## 问题描述

Leaderboard 页面在切换到英文后，所有文本仍然显示中文，包括：
- 页面标题"排行榜"
- 卡片标题"学习排行榜"
- 副标题"看看谁是学习之星"
- 标签页："金币"、"连续"、"时长"
- 用户标识："我"
- 默认用户名："学习者"
- 时间格式："小时"、"分钟"、"天"

## 技术挑战

原始页面是**服务器组件**（Server Component），不能直接使用客户端 hooks（如 `useLocale`）。

## 解决方案

采用**服务器组件 + 客户端组件**的混合架构：

1. **服务器组件**（`app/leaderboard/page.tsx`）
   - 负责数据获取（从 Supabase 获取排行榜数据）
   - 获取当前用户信息
   - 将数据传递给客户端组件

2. **客户端组件**（`components/leaderboard-client.tsx`）
   - 使用 `useLocale` hook 获取翻译
   - 负责所有 UI 渲染和国际化显示
   - 处理用户交互

## 修复内容

### 1. 翻译文件更新

#### 中文翻译 (`lib/i18n/translations/zh.ts`)

```typescript
leaderboard: {
  title: "排行榜",
  pageTitle: "学习排行榜",
  subtitle: "看看谁是学习之星",
  backHome: "返回首页",
  tabs: {
    coins: "金币",
    streak: "连续",
    time: "时长",
  },
  me: "我",
  learner: "学习者",
  days: "天",
  hours: "小时",
  minutes: "分钟",
  formatTime: {
    hoursMinutes: "{hours}小时{minutes}分",
    minutesOnly: "{minutes}分钟",
  },
}
```

#### 英文翻译 (`lib/i18n/translations/en.ts`)

```typescript
leaderboard: {
  title: "Leaderboard",
  pageTitle: "Learning Leaderboard",
  subtitle: "See who's the learning star",
  backHome: "Back to Home",
  tabs: {
    coins: "Coins",
    streak: "Streak",
    time: "Time",
  },
  me: "Me",
  learner: "Learner",
  days: "days",
  hours: "hours",
  minutes: "minutes",
  formatTime: {
    hoursMinutes: "{hours}h {minutes}m",
    minutesOnly: "{minutes} minutes",
  },
}
```

### 2. 创建客户端组件

**文件：`components/leaderboard-client.tsx`**

主要功能：
- 接收服务器组件传递的数据作为 props
- 使用 `useLocale` hook 获取翻译
- 渲染完整的排行榜 UI
- 处理时间格式化（支持国际化）

**关键代码：**

```typescript
export function LeaderboardClient({ 
  coinsData, 
  streakData, 
  timeData, 
  currentUserId 
}: LeaderboardClientProps) {
  const { t } = useLocale()
  
  // 时间格式化函数
  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return t.leaderboard.formatTime.hoursMinutes
        .replace("{hours}", String(hours))
        .replace("{minutes}", String(minutes))
    }
    return t.leaderboard.formatTime.minutesOnly
      .replace("{minutes}", String(minutes))
  }
  
  // ... UI 渲染
}
```

### 3. 更新服务器组件

**文件：`app/leaderboard/page.tsx`**

简化为只负责数据获取：

```typescript
export default async function LeaderboardPage() {
  const supabase = await createClient()
  
  // 获取用户和数据
  const { data: { user } } = await supabase.auth.getUser()
  const [coinsLeaderboard, streakLeaderboard, timeLeaderboard] = await Promise.all([
    // ... 数据查询
  ])
  
  // 传递给客户端组件
  return (
    <LeaderboardClient
      coinsData={coinsLeaderboard.data || []}
      streakData={streakLeaderboard.data || []}
      timeData={timeLeaderboard.data || []}
      currentUserId={user?.id}
    />
  )
}
```

## 修复效果

### 中文界面
- 页面标题：排行榜
- 卡片标题：学习排行榜
- 副标题：看看谁是学习之星
- 标签页：金币、连续、时长
- 用户标识：我
- 时间格式：2小时30分、45分钟
- 连续天数：5天

### 英文界面
- 页面标题：Leaderboard
- 卡片标题：Learning Leaderboard
- 副标题：See who's the learning star
- 标签页：Coins, Streak, Time
- 用户标识：Me
- 时间格式：2h 30m、45 minutes
- 连续天数：5days

## 架构优势

### 服务器组件 + 客户端组件模式

**优点：**
1. **性能优化**
   - 数据获取在服务器端完成，减少客户端请求
   - 初始 HTML 包含数据，提升首屏加载速度

2. **安全性**
   - Supabase 密钥和数据库查询在服务器端执行
   - 客户端不暴露敏感信息

3. **国际化支持**
   - 客户端组件可以使用 React hooks
   - 支持实时语言切换

4. **代码分离**
   - 数据逻辑和 UI 逻辑清晰分离
   - 易于维护和测试

### 数据流

```
Server Component (page.tsx)
    ↓ 获取数据
Supabase Database
    ↓ 传递 props
Client Component (leaderboard-client.tsx)
    ↓ 使用 useLocale
Translations (zh.ts / en.ts)
    ↓ 渲染
UI (国际化显示)
```

## 时间格式化

### 模板字符串方式

使用占位符 `{hours}` 和 `{minutes}`，支持不同语言的格式：

**中文：**
- 有小时：`2小时30分`
- 仅分钟：`45分钟`

**英文：**
- 有小时：`2h 30m`
- 仅分钟：`45 minutes`

### 实现代码

```typescript
const formatStudyTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return t.leaderboard.formatTime.hoursMinutes
      .replace("{hours}", String(hours))
      .replace("{minutes}", String(minutes))
  }
  return t.leaderboard.formatTime.minutesOnly
    .replace("{minutes}", String(minutes))
}
```

## 翻译覆盖范围

✅ 页面标题
✅ 卡片标题和副标题
✅ 返回首页按钮
✅ 三个标签页（金币、连续、时长）
✅ 用户标识徽章
✅ 默认用户名
✅ 时间单位（小时、分钟、天）
✅ 时间格式化模板

## 测试建议

1. **中文测试**
   - 访问 `/leaderboard` 页面
   - 验证所有文本显示为中文
   - 检查时间格式：`2小时30分`
   - 检查连续天数：`5天`

2. **英文测试**
   - 切换语言到英文
   - 访问 `/leaderboard` 页面
   - 验证所有文本显示为英文
   - 检查时间格式：`2h 30m`
   - 检查连续天数：`5days`

3. **标签页切换测试**
   - 切换不同标签页（金币、连续、时长）
   - 验证标签文本和数据显示正确

4. **用户标识测试**
   - 登录后查看排行榜
   - 验证当前用户显示"我"或"Me"徽章

5. **实时切换测试**
   - 在页面上切换语言
   - 验证所有文本立即更新

## 相关文件

- `lib/i18n/translations/zh.ts` - 中文翻译
- `lib/i18n/translations/en.ts` - 英文翻译
- `app/leaderboard/page.tsx` - 服务器组件（数据获取）
- `components/leaderboard-client.tsx` - 客户端组件（UI 渲染）

## 技术要点

### Next.js 13+ App Router

- **服务器组件**：默认是服务器组件，可以直接访问数据库
- **客户端组件**：使用 `"use client"` 指令，可以使用 React hooks
- **Props 传递**：服务器组件可以将数据作为 props 传递给客户端组件

### TypeScript 类型安全

定义了 `Profile` 接口和 `LeaderboardClientProps` 接口，确保类型安全：

```typescript
interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  coins: number
  streak_days: number
  total_study_time: number
}

interface LeaderboardClientProps {
  coinsData: Profile[]
  streakData: Profile[]
  timeData: Profile[]
  currentUserId: string | undefined
}
```

## 注意事项

1. **数据传递**
   - 服务器组件传递给客户端组件的数据必须是可序列化的
   - 不能传递函数、Date 对象等

2. **性能考虑**
   - 排行榜数据限制为 50 条，避免传递过多数据
   - 客户端组件只负责渲染，不进行数据获取

3. **用户体验**
   - 当前用户在排行榜中会高亮显示
   - 前三名有特殊的视觉效果（金、银、铜）

## 完成状态

✅ 服务器组件数据获取
✅ 客户端组件 UI 渲染
✅ 完整的国际化支持
✅ 时间格式化国际化
✅ 用户标识国际化
✅ 标签页国际化
✅ 类型安全

所有 Leaderboard 页面的国际化问题已完全修复！
