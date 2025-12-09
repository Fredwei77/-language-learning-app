# 🌍 国际化实现指南

## 概述

实现了完整的中英文双语支持，包括全局语言切换和特定模块的语言切换功能。

---

## 📁 文件结构

```
lib/i18n/
├── config.ts                 # 语言配置
├── index.ts                  # 导出文件
└── translations/
    ├── zh.ts                 # 中文翻译
    └── en.ts                 # 英文翻译

hooks/
└── use-locale.ts             # 语言 Hook

components/
└── language-switcher.tsx     # 语言切换器
```

---

## 🔧 核心功能

### 1. 语言配置

**文件**: `lib/i18n/config.ts`

```typescript
export const locales = ["zh", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "zh"
```

### 2. 翻译文件

**中文**: `lib/i18n/translations/zh.ts`  
**英文**: `lib/i18n/translations/en.ts`

包含以下模块的翻译：
- ✅ 通用文本（common）
- ✅ 导航栏（nav）
- ✅ 首页（home）
- ✅ 词典（dictionary）
- ✅ AI对话（aiChat）
- ✅ 发音评测（pronunciation）
- ✅ 金币系统（coins）
- ✅ 礼物商城（shop）
- ✅ 个人中心（profile）
- ✅ 认证（auth）
- ✅ 支付（payment）
- ✅ 错误信息（errors）

### 3. useLocale Hook

**文件**: `hooks/use-locale.ts`

```typescript
const { locale, t } = useLocale()

// 使用翻译
<h1>{t.home.title}</h1>
<p>{t.home.subtitle}</p>
```

### 4. 语言切换器

**文件**: `components/language-switcher.tsx`

- 下拉菜单选择语言
- 自动保存到 localStorage
- 触发全局语言切换事件

---

## 🎯 使用方法

### 在组件中使用

```typescript
"use client"

import { useLocale } from "@/hooks/use-locale"

export function MyComponent() {
  const { locale, t } = useLocale()

  return (
    <div>
      <h1>{t.common.loading}</h1>
      <p>{t.home.title}</p>
      <button>{t.common.save}</button>
    </div>
  )
}
```

### 添加语言切换器

```typescript
import { LanguageSwitcher } from "@/components/language-switcher"

<LanguageSwitcher />
```

---

## 📝 已更新的组件

### 全局组件
- ✅ `components/home/site-header.tsx` - 添加语言切换器
- ✅ `components/home/hero-section.tsx` - 使用翻译

### 待更新的组件
以下组件需要添加国际化支持：

1. **`components/home/features-grid.tsx`**
   - 功能卡片标题和描述

2. **`components/home/cta-section.tsx`**
   - CTA 文本

3. **`components/ai-chat-interface.tsx`**
   - AI 对话界面文本

4. **`components/dictionary-search.tsx`**
   - 词典搜索界面

5. **`components/pronunciation-practice.tsx`**
   - 发音评测界面
   - **需要添加练习文本的语言切换**

6. **`app/coins/page.tsx`**
   - 金币页面文本

7. **`components/profile-content.tsx`**
   - 个人中心文本

---

## 🎨 发音模块语言切换

### 需求
发音模块需要支持：
- 中文练习文本
- 英文练习文本
- 语言切换按钮

### 实现方案

```typescript
// 在 pronunciation-practice.tsx 中添加

const [practiceLanguage, setPracticeLanguage] = useState<"zh" | "en">("en")

// 练习材料（双语）
const practiceItemsZh = [
  {
    text: "你好，今天天气真好。",
    pinyin: "nǐ hǎo, jīn tiān tiān qì zhēn hǎo.",
    translation: "Hello, the weather is really nice today.",
  },
  // ...
]

const practiceItemsEn = [
  {
    text: "Hello, how are you today?",
    phonetic: "/həˈləʊ haʊ ɑː juː təˈdeɪ/",
    translation: "你好，你今天怎么样？",
  },
  // ...
]

// 语言切换 UI
<Tabs value={practiceLanguage} onValueChange={setPracticeLanguage}>
  <TabsList>
    <TabsTrigger value="en">English</TabsTrigger>
    <TabsTrigger value="zh">中文</TabsTrigger>
  </TabsList>
</Tabs>
```

---

## 🔄 语言切换流程

```
用户点击语言切换器
    ↓
选择新语言
    ↓
保存到 localStorage
    ↓
触发 localeChange 事件
    ↓
所有组件监听事件
    ↓
更新显示文本
    ↓
完成 ✅
```

---

## 📊 翻译覆盖率

| 模块 | 中文 | 英文 | 状态 |
|-----|------|------|------|
| 通用文本 | ✅ | ✅ | 完成 |
| 导航栏 | ✅ | ✅ | 完成 |
| 首页 | ✅ | ✅ | 完成 |
| 词典 | ✅ | ✅ | 完成 |
| AI对话 | ✅ | ✅ | 完成 |
| 发音评测 | ✅ | ✅ | 完成 |
| 金币系统 | ✅ | ✅ | 完成 |
| 礼物商城 | ✅ | ✅ | 完成 |
| 个人中心 | ✅ | ✅ | 完成 |
| 认证 | ✅ | ✅ | 完成 |
| 支付 | ✅ | ✅ | 完成 |
| 错误信息 | ✅ | ✅ | 完成 |

---

## 🎯 下一步实现

### 1. 更新 FeaturesGrid 组件

```typescript
"use client"

import { useLocale } from "@/hooks/use-locale"

export function FeaturesGrid() {
  const { t } = useLocale()
  
  return (
    <section>
      <h2>{t.home.features.title}</h2>
      <p>{t.home.features.subtitle}</p>
      {/* ... */}
    </section>
  )
}
```

### 2. 更新 AI Chat 组件

```typescript
const { t } = useLocale()

<CardTitle>{t.aiChat.title}</CardTitle>
<CardDescription>{t.aiChat.subtitle}</CardDescription>
```

### 3. 添加发音练习语言切换

```typescript
const [practiceLanguage, setPracticeLanguage] = useState<"zh" | "en">("en")

<div className="flex items-center gap-2">
  <Languages className="h-4 w-4" />
  <Tabs value={practiceLanguage} onValueChange={setPracticeLanguage}>
    <TabsList>
      <TabsTrigger value="en">English</TabsTrigger>
      <TabsTrigger value="zh">中文</TabsTrigger>
    </TabsList>
  </Tabs>
</div>
```

---

## 💡 最佳实践

### 1. 翻译键命名
```typescript
// ✅ 推荐：层级清晰
t.home.features.title

// ❌ 避免：扁平结构
t.homeFeaturesTitle
```

### 2. 组件使用
```typescript
// ✅ 推荐：使用 Hook
const { t } = useLocale()

// ❌ 避免：直接导入
import { zh } from "@/lib/i18n/translations/zh"
```

### 3. 默认语言
```typescript
// ✅ 推荐：提供默认值
const locale = stored || defaultLocale

// ❌ 避免：假设语言存在
const locale = stored
```

---

## 🧪 测试

### 测试语言切换
1. 访问 http://localhost:3000
2. 点击右上角的语言切换器（地球图标）
3. 选择 "English"
4. 检查页面文本是否切换为英文
5. 刷新页面，语言应该保持

### 测试发音模块
1. 访问 `/pronunciation`
2. 查看语言切换选项
3. 切换到中文练习
4. 测试中文发音评测

---

## 📚 添加新翻译

### 步骤 1: 添加中文翻译
编辑 `lib/i18n/translations/zh.ts`：

```typescript
export const zh = {
  // ...
  myNewModule: {
    title: "我的新模块",
    description: "描述文本",
  },
}
```

### 步骤 2: 添加英文翻译
编辑 `lib/i18n/translations/en.ts`：

```typescript
export const en: Translations = {
  // ...
  myNewModule: {
    title: "My New Module",
    description: "Description text",
  },
}
```

### 步骤 3: 在组件中使用
```typescript
const { t } = useLocale()
<h1>{t.myNewModule.title}</h1>
```

---

## 🎉 完成状态

### 已实现
- ✅ 国际化配置
- ✅ 中英文翻译文件
- ✅ useLocale Hook
- ✅ 语言切换器组件
- ✅ 首页国际化
- ✅ 导航栏国际化

### 待实现
- ⚠️ 其他页面组件国际化
- ⚠️ 发音模块语言切换
- ⚠️ AI 对话模块国际化
- ⚠️ 词典模块国际化

---

## 📖 相关资源

- [Next.js i18n](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [React i18next](https://react.i18next.com/)
- [Format.js](https://formatjs.io/)

---

**国际化基础框架已完成！** 🌍

下一步：逐步更新其他组件使用翻译系统。
