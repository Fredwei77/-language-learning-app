# Chrome 语音测试指南

## 快速测试步骤

### 1. 本地测试

```bash
# 启动开发服务器
npm run dev
```

访问以下页面测试语音功能：

1. **粤语学习页面**
   - URL: `http://localhost:3000/cantonese`
   - 测试：点击任意短语旁边的喇叭图标
   - 预期：听到粤语朗读

2. **发音练习页面**
   - URL: `http://localhost:3000/pronunciation`
   - 测试：点击"听示范"按钮
   - 预期：听到英语朗读

### 2. 部署后测试

访问你的 Netlify 网站：
- `https://your-site.netlify.app/cantonese`
- `https://your-site.netlify.app/pronunciation`

## 浏览器测试矩阵

| 浏览器 | 版本 | 状态 | 备注 |
|--------|------|------|------|
| Chrome | 最新 | ✅ 应该正常 | 主要修复目标 |
| Edge | 最新 | ✅ 已验证正常 | 原本就能用 |
| Safari | 最新 | ⚠️ 需测试 | 可能需要用户授权 |
| Firefox | 最新 | ⚠️ 需测试 | 支持有限 |

## 调试技巧

### 打开 Chrome 开发者工具

1. 按 `F12` 或右键 → 检查
2. 切换到 Console 标签
3. 点击语音按钮
4. 查看是否有错误信息

### 常见错误和解决方案

#### 错误 1: "Speech synthesis not supported"
```
原因：浏览器不支持 Web Speech API
解决：更新浏览器到最新版本
```

#### 错误 2: "not-allowed"
```
原因：用户拒绝了权限或网站被静音
解决：
1. 检查地址栏右侧的图标
2. 允许声音权限
3. 取消网站静音
```

#### 错误 3: 没有错误但没有声音
```
原因：系统没有对应语言的语音包
解决：
1. Windows: 设置 → 语音 → 添加语音
2. Mac: 系统偏好设置 → 辅助功能 → 语音
3. 或者代码会自动降级到其他语音
```

## 手动测试代码

在浏览器 Console 中运行：

```javascript
// 测试基本语音功能
const utterance = new SpeechSynthesisUtterance('你好')
utterance.lang = 'zh-HK'
speechSynthesis.speak(utterance)

// 查看可用语音列表
speechSynthesis.getVoices().forEach(voice => {
  console.log(voice.name, voice.lang)
})

// 查找粤语语音
const cantoneseVoices = speechSynthesis.getVoices().filter(v => 
  v.lang.includes('HK') || v.lang.includes('yue')
)
console.log('粤语语音:', cantoneseVoices)
```

## 性能测试

### 测试语音加载时间

```javascript
console.time('voice-load')
const voices = await preloadVoices()
console.timeEnd('voice-load')
console.log('加载了', voices.length, '个语音')
```

### 测试播放延迟

```javascript
console.time('speak')
await speak('测试', { lang: 'zh-HK' })
console.timeEnd('speak')
```

## 预期结果

### Chrome 浏览器（修复后）

✅ 点击语音按钮后 1-2 秒内开始播放
✅ 按钮显示脉动动画表示正在播放
✅ 播放期间按钮被禁用
✅ 播放完成后按钮恢复正常

### 如果仍然有问题

1. **清除浏览器缓存**
   ```
   Chrome → 设置 → 隐私和安全 → 清除浏览数据
   选择"缓存的图片和文件"
   ```

2. **检查网站权限**
   ```
   地址栏左侧锁图标 → 网站设置 → 声音 → 允许
   ```

3. **重启浏览器**
   ```
   完全关闭 Chrome 后重新打开
   ```

4. **检查系统音量**
   ```
   确保系统音量不是静音
   确保浏览器标签页没有被静音
   ```

## 报告问题

如果测试后仍然有问题，请提供以下信息：

1. 浏览器版本：`chrome://version`
2. 操作系统版本
3. Console 中的错误信息（截图）
4. 可用语音列表：
   ```javascript
   console.log(speechSynthesis.getVoices())
   ```

## 成功标准

- ✅ Chrome 浏览器能正常播放语音
- ✅ Edge 浏览器仍然正常工作
- ✅ 没有 Console 错误
- ✅ 用户体验流畅（无明显延迟）
- ✅ 按钮状态正确显示
