# Chrome 浏览器语音朗读修复指南

## 问题描述
在 Google Chrome 浏览器中无法使用语音朗读功能，但在 Edge 浏览器中正常工作。

## 原因分析

### Chrome 的限制
1. **HTTPS 要求**：Chrome 要求在 HTTPS 环境下才能使用 Web Speech API
2. **用户交互要求**：必须在用户点击等交互后才能播放语音
3. **语音加载延迟**：Chrome 需要等待语音列表加载完成
4. **语言支持**：对某些语言（如粤语 zh-HK）的支持可能不完整

### Edge 更宽松
Edge 浏览器对这些限制更宽松，因此能正常工作。

## 解决方案

### 1. 创建了跨浏览器语音工具 (`lib/speech-utils.ts`)

**主要功能：**
- ✅ 预加载语音列表（解决 Chrome 延迟问题）
- ✅ 智能语音匹配（自动查找最佳语音）
- ✅ 错误处理和重试机制
- ✅ 添加延迟确保 Chrome 正常工作
- ✅ 支持多种粤语语言代码

**核心改进：**
```typescript
// 旧代码（不兼容 Chrome）
const utterance = new SpeechSynthesisUtterance(text)
utterance.lang = "zh-HK"
window.speechSynthesis.speak(utterance)

// 新代码（兼容所有浏览器）
await speak(text, { lang: "zh-HK", rate: 0.7 })
```

### 2. 更新了所有语音组件

**已更新的组件：**
- ✅ `components/cantonese-learn.tsx` - 粤语学习
- ✅ `components/cantonese-learn-enhanced.tsx` - 粤语学习增强版
- ✅ `components/pronunciation-practice-i18n.tsx` - 发音练习

**改进内容：**
- 添加了语音预加载
- 添加了播放状态指示
- 防止重复播放
- 更好的错误处理

## 使用说明

### 对于用户

1. **确保使用 HTTPS**
   - 部署的网站必须使用 HTTPS
   - 本地开发使用 `localhost` 也可以

2. **检查浏览器设置**
   - Chrome 设置 → 隐私和安全 → 网站设置 → 更多权限 → 声音
   - 确保网站没有被静音

3. **首次使用**
   - 点击语音按钮后，Chrome 可能需要几秒钟加载语音
   - 如果没有声音，刷新页面重试

4. **如果仍然无法使用**
   - 检查系统音量
   - 检查浏览器是否静音
   - 尝试其他语音（如果粤语不可用，会自动降级到普通话）

### 对于开发者

**在其他组件中使用语音：**

```typescript
import { speak, preloadVoices } from "@/lib/speech-utils"
import { useEffect, useState } from "react"

function MyComponent() {
  const [isPlaying, setIsPlaying] = useState(false)

  // 预加载语音列表
  useEffect(() => {
    preloadVoices()
  }, [])

  const handleSpeak = async (text: string) => {
    if (isPlaying) return
    
    try {
      setIsPlaying(true)
      await speak(text, { 
        lang: "zh-HK",  // 或 "en-US"
        rate: 0.7,      // 语速
        pitch: 1,       // 音调
        volume: 1       // 音量
      })
    } catch (error) {
      console.error("Speech error:", error)
    } finally {
      setIsPlaying(false)
    }
  }

  return (
    <Button 
      onClick={() => handleSpeak("你好")}
      disabled={isPlaying}
    >
      <Volume2 className={isPlaying ? 'animate-pulse' : ''} />
      播放
    </Button>
  )
}
```

## 技术细节

### 语音查找优先级

1. 完全匹配语言代码（如 `zh-HK`）
2. 匹配语言前缀（如 `zh`）
3. 粤语特殊处理：
   - `zh-HK` (香港粤语)
   - `yue-HK` (粤语)
   - `zh-TW` (台湾国语，作为备选)
   - 名称包含 "cantonese" 或 "hong kong"

### Chrome 特殊处理

```typescript
// 添加 100ms 延迟确保 Chrome 准备就绪
setTimeout(() => {
  window.speechSynthesis.speak(utterance)
}, 100)

// 预加载语音列表
window.speechSynthesis.onvoiceschanged = () => {
  const voices = window.speechSynthesis.getVoices()
  // 语音列表已加载
}
```

## 测试清单

- [x] Chrome 浏览器 HTTPS 环境
- [x] Chrome 浏览器本地开发环境
- [x] Edge 浏览器（确保没有破坏原有功能）
- [x] Safari 浏览器
- [x] Firefox 浏览器
- [x] 移动端 Chrome
- [x] 移动端 Safari

## 部署后验证

1. 访问部署的网站（确保是 HTTPS）
2. 打开 Chrome 浏览器
3. 进入粤语学习页面
4. 点击任意语音按钮
5. 应该能听到语音朗读

## 故障排除

### 问题：点击后没有声音

**解决方案：**
1. 打开 Chrome 开发者工具（F12）
2. 查看 Console 是否有错误
3. 检查网络是否正常
4. 尝试刷新页面

### 问题：语音很慢或很快

**解决方案：**
调整 `rate` 参数：
```typescript
await speak(text, { lang: "zh-HK", rate: 0.5 }) // 更慢
await speak(text, { lang: "zh-HK", rate: 1.0 }) // 正常速度
```

### 问题：找不到粤语语音

**解决方案：**
1. 检查系统是否安装了粤语语音包
2. Windows: 设置 → 时间和语言 → 语音 → 添加语音
3. Mac: 系统偏好设置 → 辅助功能 → 语音内容
4. 如果没有粤语，代码会自动降级到其他中文语音

## 相关文件

- `lib/speech-utils.ts` - 语音工具库
- `components/cantonese-learn.tsx` - 粤语学习组件
- `components/cantonese-learn-enhanced.tsx` - 粤语学习增强组件
- `components/pronunciation-practice-i18n.tsx` - 发音练习组件

## 更新日志

**2024-11-26**
- ✅ 创建跨浏览器语音工具
- ✅ 修复 Chrome 兼容性问题
- ✅ 添加语音预加载
- ✅ 改进错误处理
- ✅ 添加播放状态指示

## 下一步优化

1. 添加语音下载进度提示
2. 支持离线语音包
3. 添加语音质量选择
4. 支持更多语言和方言
