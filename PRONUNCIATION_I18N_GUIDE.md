# 发音评测组件国际化指南

## 概述

已创建带语言切换功能的发音评测组件 `PronunciationPracticeI18n`，支持中英文切换，提供完整的发音评测功能。

## 文件结构

```
components/
  ├── pronunciation-practice-i18n.tsx  # 新的国际化发音评测组件
  └── pronunciation-practice.tsx       # 原有组件（保留）

app/pronunciation/
  └── page.tsx                         # 更新为使用国际化组件

lib/i18n/translations/
  ├── en.ts                           # 英文翻译（已更新）
  └── zh.ts                           # 中文翻译（已更新）
```

## 主要功能

### 1. 语言切换
- 页面右上角集成 `LanguageSwitcher` 组件
- 支持中英文实时切换
- 所有文本内容自动适配当前语言

### 2. 发音评测核心功能
- 🎤 实时语音识别
- 📊 AI智能评分（准确度、流畅度、发音）
- 💬 详细反馈和改进建议
- 🔊 标准发音示范播放

### 3. 金币奖励系统
- ⏱️ 练习时长追踪
- 🎯 每日目标：30分钟获得100金币
- 💰 实时显示金币余额
- 🎉 完成目标时金币爆炸动画

### 4. 练习材料
- 多难度等级（简单、中等、困难）
- 多场景分类（问候、日常、学术等）
- 包含音标和中文翻译
- 支持循环练习

## 使用方法

### 基础使用

```tsx
import { PronunciationPracticeI18n } from "@/components/pronunciation-practice-i18n"

export default function MyPage() {
  return <PronunciationPracticeI18n />
}
```

### 在页面中使用（带导航）

```tsx
"use client"

import { PronunciationPracticeI18n } from "@/components/pronunciation-practice-i18n"
import { useLocale } from "@/hooks/use-locale"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PronunciationPage() {
  const { t } = useLocale()

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1>{t.pronunciation.title}</h1>
          <Button asChild>
            <Link href="/">{t.common.back}</Link>
          </Button>
        </div>
      </header>
      <main>
        <PronunciationPracticeI18n />
      </main>
    </div>
  )
}
```

## 翻译键值

### 新增的翻译键

```typescript
pronunciation: {
  // 基础信息
  title: "发音评测" / "Pronunciation Assessment"
  aiPowered: "AI驱动的实时发音分析..." / "AI-powered real-time..."
  
  // 进度相关
  practiceProgress: "今日口语练习进度" / "Today's Speaking Practice Progress"
  minutes: "分钟" / "minutes"
  completedToday: "今日已完成！获得" / "Completed today! Earned"
  needMore: "还需" / "Need"
  canEarn: "分钟可获得" / "more minutes to earn"
  
  // 操作按钮
  startRecording: "开始录音" / "Start Recording"
  stopRecording: "停止录音" / "Stop Recording"
  listenDemo: "听示范" / "Listen Demo"
  nextQuestion: "下一题" / "Next"
  retryPractice: "重新练习" / "Retry"
  
  // 评测相关
  recording: "正在录音..." / "Recording..."
  evaluating: "AI正在评测中..." / "AI is evaluating..."
  yourResult: "你的发音识别结果：" / "Your pronunciation recognition result:"
  evaluationResult: "评测结果" / "Evaluation Result"
  overallScore: "综合得分" / "Overall Score"
  
  // 指导信息
  coinReward: "金币奖励" / "Coin Reward"
  dailyTask: "每日任务" / "Daily Task"
  dailyTaskDesc: "完成30分钟..." / "Complete 30 minutes..."
  practiceTips: "练习提示" / "Practice Tips"
  scoringCriteria: "评分标准" / "Scoring Criteria"
  practiceSuggestions: "练习建议" / "Practice Suggestions"
  
  // 难度等级
  difficulty: {
    easy: "简单" / "Easy"
    medium: "中等" / "Medium"
    hard: "困难" / "Hard"
  }
}
```

## 组件特性

### 1. 响应式设计
- 移动端优化布局
- 平板和桌面端多列布局
- 自适应卡片和按钮尺寸

### 2. 用户体验
- 实时反馈和状态提示
- 加载动画和过渡效果
- 清晰的视觉层次
- 直观的操作流程

### 3. 权限管理
- 自动检测麦克风权限
- 友好的权限请求提示
- 权限被拒时的错误提示

### 4. 性能优化
- 使用 useRef 管理语音识别实例
- 防止不必要的重渲染
- 及时清理定时器和事件监听

## 浏览器兼容性

### 语音识别支持
- ✅ Chrome/Edge (推荐)
- ✅ Safari (iOS 14.5+)
- ⚠️ Firefox (需要额外配置)
- ❌ IE (不支持)

### 语音合成支持
- ✅ 所有现代浏览器
- ✅ 移动端浏览器

## 自定义练习材料

可以通过修改 `practiceItems` 数组来添加自定义练习内容：

```typescript
const practiceItems: PracticeItem[] = [
  {
    id: "custom-1",
    text: "Your English sentence here",
    phonetic: "/phonetic transcription/",
    translation: "中文翻译",
    difficulty: "easy" | "medium" | "hard",
    category: "your-category",
  },
  // 添加更多...
]
```

## API 端点

组件依赖以下 API 端点：

```
POST /api/pronunciation
Body: {
  original: string,  // 原始文本
  spoken: string     // 识别的语音文本
}

Response: {
  result: {
    score: number,           // 综合得分 0-100
    accuracy: number,        // 准确度 0-100
    fluency: number,         // 流畅度 0-100
    pronunciation: number,   // 发音 0-100
    feedback: string[],      // 正面反馈
    improvements: string[]   // 改进建议
  }
}
```

## 金币系统集成

组件集成了金币奖励系统：

- 自动追踪练习时长
- 达到30分钟自动奖励100金币
- 显示每日进度和剩余时��
- 完成时触发金币爆炸动画

## 最佳实践

### 1. 用户引导
- 首次使用时提供操作说明
- 展示评分标准和练习建议
- 提供示范发音功能

### 2. 反馈机制
- 实时显示录音状态
- 清晰的评测进度提示
- 详细的评分和改进建议

### 3. 激励机制
- 显示练习进度
- 金币奖励可视化
- 难度分级和成就感

## 故障排除

### 麦克风无法使用
1. 检查浏览器权限设置
2. 确保使用 HTTPS 连接
3. 检查设备麦克风是否正常

### 语音识别不准确
1. 确保环境安静
2. 清晰发音，语速适中
3. 检查麦克风质量
4. 尝试更换浏览器

### 语言切换不生效
1. 检查 localStorage 是否可用
2. 确保 useLocale hook 正常工作
3. 查看浏览器控制台错误

## 未来改进方向

1. **更多语言支持**
   - 添加其他语言的发音评测
   - 支持方言和口音识别

2. **高级功能**
   - 录音回放功能
   - 发音对比可视化
   - 历史记录和进度追踪

3. **社交功能**
   - 分享评测结果
   - 好友排行榜
   - 挑战模式

4. **AI 增强**
   - 更精准的发音分析
   - 个性化练习推荐
   - 智能纠音建议

## 相关文档

- [国际化实现指南](./I18N_IMPLEMENTATION.md)
- [金币系统文档](./lib/coins-system.ts)
- [语言切换组件](./components/language-switcher.tsx)

## 访问地址

开发环境：http://localhost:3000/pronunciation
生产环境：https://your-domain.com/pronunciation
