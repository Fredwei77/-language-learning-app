# Cookie 横幅调试指南

## 问题
Cookie 同意横幅在首次访问时没有显示。

## 可能的原因

### 1. localStorage 中已存在同意记录
如果之前测试时已经点击过"接受"或"拒绝"，localStorage 中会保存记录，导致横幅不再显示。

### 2. 浏览器缓存
组件可能被缓存，需要硬刷新。

## 解决方案

### 方法 1: 使用开发调试按钮（推荐）
1. 刷新页面
2. 在右下角应该看到一个灰色的 "Reset Cookie Consent" 按钮
3. 点击该按钮
4. Cookie 横幅应该立即显示

### 方法 2: 手动清除 localStorage
1. 打开浏览器开发者工具（F12）
2. 切换到 "Application" 或 "存储" 标签
3. 在左侧找到 "Local Storage"
4. 展开并选择 `http://localhost:3000`
5. 找到 `cookie-consent` 键
6. 右键点击并选择 "Delete" 或 "删除"
7. 刷新页面

### 方法 3: 使用控制台命令
1. 打开浏览器开发者工具（F12）
2. 切换到 "Console" 标签
3. 输入以下命令并按回车：
```javascript
localStorage.removeItem('cookie-consent')
location.reload()
```

### 方法 4: 使用隐私模式
1. 打开浏览器的隐私/无痕模式
2. 访问 `http://localhost:3000`
3. Cookie 横幅应该显示（因为没有 localStorage 数据）

## 验证步骤

### 1. 检查控制台日志
打开浏览器控制台，应该看到以下日志之一：

**如果横幅应该显示**:
```
Cookie consent check: null
No consent found, showing banner in 1 second...
Showing cookie banner now
```

**如果横幅不应该显示**:
```
Cookie consent check: {"necessary":true,"analytics":true,"marketing":true}
Consent already exists, not showing banner
```

### 2. 检查 DOM
1. 打开开发者工具
2. 切换到 "Elements" 或 "元素" 标签
3. 搜索 "cookie" 或 "Cookie"
4. 应该能找到 Cookie 横幅的 HTML 元素

### 3. 测试完整流程
1. 清除 localStorage（使用上述任一方法）
2. 刷新页面
3. 等待 1 秒
4. Cookie 横幅应该从底部弹出
5. 点击"全部接受"
6. 横幅消失
7. 刷新页面
8. 横幅不再显示（因为已保存同意）

## 功能特性

### 显示时机
- 首次访问网站
- localStorage 中没有 `cookie-consent` 键
- 延迟 1 秒后显示（避免闪烁）

### 不显示时机
- localStorage 中已有 `cookie-consent` 键
- 用户已经做出选择（接受/拒绝/自定义）

### 开发模式特性
- 右下角显示 "Reset Cookie Consent" 按钮
- 点击可立即重置并显示横幅
- 仅在开发环境显示（生产环境不显示）

## 常见问题

### Q: 为什么我看不到横幅？
A: 检查以下几点：
1. 打开控制台查看日志
2. 检查 localStorage 是否有 `cookie-consent` 键
3. 确认页面已完全加载
4. 等待至少 1 秒

### Q: 如何在生产环境测试？
A: 
1. 使用浏览器的隐私模式
2. 或手动清除 localStorage
3. 生产环境不会显示调试按钮

### Q: 横幅显示但无法点击？
A: 检查 z-index 是否被其他元素覆盖

### Q: 如何修改延迟时间？
A: 在 `components/cookie-consent.tsx` 中修改：
```typescript
setTimeout(() => setShowBanner(true), 1000) // 1000 = 1秒
```

## 调试代码

### 当前实现
```typescript
useEffect(() => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
  console.log("Cookie consent check:", consent)
  if (!consent) {
    console.log("No consent found, showing banner in 1 second...")
    setTimeout(() => {
      console.log("Showing cookie banner now")
      setShowBanner(true)
    }, 1000)
  } else {
    console.log("Consent already exists, not showing banner")
  }
}, [])
```

### 开发调试按钮
```typescript
if (!showBanner) {
  if (process.env.NODE_ENV === "development") {
    return (
      <button
        onClick={() => {
          localStorage.removeItem(COOKIE_CONSENT_KEY)
          setShowBanner(true)
        }}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-3 py-2 rounded text-xs opacity-50 hover:opacity-100"
      >
        Reset Cookie Consent
      </button>
    )
  }
  return null
}
```

## 测试清单

- [ ] 清除 localStorage
- [ ] 刷新页面
- [ ] 等待 1 秒
- [ ] 横幅显示
- [ ] 点击"全部接受"
- [ ] 横幅消失
- [ ] 刷新页面
- [ ] 横幅不再显示
- [ ] 点击调试按钮
- [ ] 横幅重新显示
- [ ] 点击"自定义"
- [ ] 切换开关
- [ ] 保存偏好
- [ ] 横幅消失

## 样式检查

### 横幅位置
- 固定在底部
- z-index: 50
- 带有半透明黑色遮罩

### 响应式
- 移动端：全宽
- 桌面端：最大宽度 4xl
- 居中显示

### 动画
- 无特殊动画
- 简单的显示/隐藏

## 下一步

如果横幅仍然不显示：
1. 检查浏览器控制台的错误
2. 确认所有依赖组件已正确导入
3. 检查 CSS 是否正确加载
4. 尝试在不同浏览器测试

## 总结

Cookie 横幅组件已添加调试功能：
- ✅ 控制台日志
- ✅ 开发模式调试按钮
- ✅ 清晰的状态管理

现在刷新页面，应该能看到：
1. 控制台日志显示状态
2. 右下角的调试按钮（开发模式）
3. 点击调试按钮可重置并显示横幅
