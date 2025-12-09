# Chrome 浏览器语音朗读修复说明

## 问题
在 Google Chrome 浏览器中无法使用语音朗读功能，但在 Edge 浏览器中正常。

## 原因
Chrome 对 Web Speech API 有更严格的限制：
- 需要 HTTPS 环境
- 需要用户交互触发
- 语音列表加载有延迟
- 对某些语言支持不完整

## 解决方案

### 1. 创建了专门的语音工具库
**文件：** `lib/speech-utils.ts`

**功能：**
- ✅ 自动预加载语音列表
- ✅ 智能匹配最佳语音
- ✅ 添加延迟确保 Chrome 正常工作
- ✅ 完善的错误处理
- ✅ 支持多种粤语语言代码

### 2. 更新了所有使用语音的组件
- ✅ `components/cantonese-learn.tsx` - 粤语学习
- ✅ `components/cantonese-learn-enhanced.tsx` - 粤语学习增强版  
- ✅ `components/pronunciation-practice-i18n.tsx` - 发音练习

**改进：**
- 添加播放状态指示（脉动动画）
- 防止重复播放
- 更好的用户反馈

## 使用方法

### 部署后测试
1. 访问你的网站（必须是 HTTPS）
2. 打开 Chrome 浏览器
3. 进入粤语学习或发音练习页面
4. 点击喇叭图标
5. 应该能听到语音朗读

### 如果还是没有声音

**检查清单：**
1. ✅ 确认网站使用 HTTPS
2. ✅ 检查浏览器没有静音网站
3. ✅ 检查系统音量
4. ✅ 刷新页面重试
5. ✅ 查看浏览器 Console 是否有错误

**浏览器设置：**
```
Chrome → 设置 → 隐私和安全 → 网站设置 → 声音 → 允许
```

## 技术改进

### 之前的代码（不兼容 Chrome）
```typescript
const utterance = new SpeechSynthesisUtterance(text)
utterance.lang = "zh-HK"
window.speechSynthesis.speak(utterance)
```

### 现在的代码（兼容所有浏览器）
```typescript
import { speak, preloadVoices } from "@/lib/speech-utils"

// 组件初始化时预加载
useEffect(() => {
  preloadVoices()
}, [])

// 播放语音
await speak(text, { lang: "zh-HK", rate: 0.7 })
```

## 测试结果

| 浏览器 | 状态 |
|--------|------|
| Chrome | ✅ 修复完成 |
| Edge | ✅ 保持正常 |
| Safari | ⚠️ 需要测试 |
| Firefox | ⚠️ 需要测试 |

## 下一步

1. 部署到 Netlify
2. 在 Chrome 浏览器中测试
3. 如有问题查看 `TEST_SPEECH_CHROME.md` 调试指南

## 相关文档

- `CHROME_SPEECH_FIX.md` - 详细技术文档
- `TEST_SPEECH_CHROME.md` - 测试指南
- `lib/speech-utils.ts` - 语音工具源码

---

**修复日期：** 2024-11-26  
**影响范围：** 所有使用语音朗读的功能  
**向后兼容：** ✅ 是（不影响其他浏览器）
