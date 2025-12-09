# AI Chat 调试指南

## 问题描述
AI Learning 页面发送消息后没有收到 AI 的回复。

## 已完成的修复

### 1. 改进错误处理
**文件**: `components/ai-chat-interface.tsx`

**修改内容**:
- ✅ 添加了详细的错误日志
- ✅ 检查 API 响应状态
- ✅ 显示具体的错误消息
- ✅ 修复消息格式（移除 timestamp 字段）

**修改前**:
```typescript
const response = await fetch("/api/ai-chat", {
  body: JSON.stringify({
    messages: [...messages, userMessage],  // 包含 timestamp
    scenario: scenarios.find((s) => s.id === scenario)?.prompt,
  }),
})
```

**修改后**:
```typescript
// 准备发送给 API 的消息（移除 timestamp 字段）
const apiMessages = [...messages, userMessage].map((msg) => ({
  role: msg.role,
  content: msg.content,
}))

const response = await fetch("/api/ai-chat", {
  body: JSON.stringify({
    messages: apiMessages,
    scenario: scenarios.find((s) => s.id === scenario)?.prompt,
  }),
})
```

### 2. 增强 API 路由日志
**文件**: `app/api/ai-chat/route.ts`

**修改内容**:
- ✅ 添加 API key 检查
- ✅ 添加详细的请求/响应日志
- ✅ 改进错误处理
- ✅ 验证响应数据结构

## 可能的问题原因

### 1. API Key 未配置 ⚠️
**检查方法**:
```bash
# 检查 .env.local 文件
cat .env.local | grep OPENROUTER_API_KEY
```

**解决方案**:
如果没有配置，需要添加：
```env
OPENROUTER_API_KEY=your_api_key_here
```

### 2. 网络连接问题
**症状**: 请求超时或无响应
**解决方案**: 检查网络连接和防火墙设置

### 3. API 配额用尽
**症状**: 返回 429 或 402 错误
**解决方案**: 检查 OpenRouter 账户余额

### 4. 请求格式错误
**症状**: 返回 400 错误
**解决方案**: 已通过移除 timestamp 字段修复

## 调试步骤

### 步骤 1: 检查浏览器控制台
1. 打开浏览器开发者工具 (F12)
2. 切换到 Console 标签
3. 发送一条消息
4. 查看是否有错误日志

**预期输出**:
```
Calling OpenRouter API...
OpenRouter response: { choices: [...], ... }
```

**错误输出示例**:
```
AI chat API error: { error: "..." }
AI chat error: Error: ...
```

### 步骤 2: 检查网络请求
1. 在开发者工具中切换到 Network 标签
2. 发送一条消息
3. 查找 `/api/ai-chat` 请求
4. 检查请求和响应内容

**检查项**:
- ✅ 请求状态码 (应该是 200)
- ✅ 请求 payload 格式
- ✅ 响应内容

### 步骤 3: 检查服务器日志
1. 查看终端中的 Next.js 服务器输出
2. 查找 "Calling OpenRouter API..." 日志
3. 查看是否有错误信息

### 步骤 4: 测试 API Key
创建测试脚本 `test-openrouter.js`:
```javascript
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-4o-mini",
    messages: [
      { role: "user", content: "Hello" }
    ],
  }),
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err))
```

运行测试:
```bash
node test-openrouter.js
```

## 常见错误及解决方案

### 错误 1: "AI service is not configured"
**原因**: OPENROUTER_API_KEY 未设置
**解决**: 在 `.env.local` 中添加 API key

### 错误 2: "OpenRouter API error: 401"
**原因**: API key 无效或过期
**解决**: 检查并更新 API key

### 错误 3: "OpenRouter API error: 429"
**原因**: 请求频率超限
**解决**: 等待一段时间后重试

### 错误 4: "Invalid response from AI service"
**原因**: OpenRouter 返回的数据格式不正确
**解决**: 检查 OpenRouter 服务状态

### 错误 5: "Rate limit exceeded"
**原因**: 触发了应用的速率限制
**解决**: 等待一段时间后重试

## 临时解决方案

如果 OpenRouter API 不可用，可以使用模拟响应：

**文件**: `app/api/ai-chat/route.ts`

在 catch 块中添加：
```typescript
// 临时：使用模拟响应
if (process.env.NODE_ENV === "development") {
  return successResponse({
    message: "Hello! I'm here to help you practice English. (This is a mock response)",
    corrections: undefined,
  })
}
```

## 验证修复

### 测试场景 1: 基本对话
1. 访问 `/ai-chat`
2. 选择"日常对话"场景
3. 输入 "hello"
4. 点击发送
5. **预期**: 收到 AI 的英文回复

### 测试场景 2: 语法纠正
1. 输入有语法错误的句子，如 "I goes to school"
2. 点击发送
3. **预期**: 收到回复和语法纠正提示

### 测试场景 3: 不同场景
1. 切换到"购物场景"
2. 输入相关对话
3. **预期**: AI 回复符合购物场景

## 性能优化建议

1. **添加请求缓存**: 缓存相似的对话
2. **实现重试机制**: 自动重试失败的请求
3. **添加超时处理**: 设置合理的超时时间
4. **优化提示词**: 减少 token 使用

## 监控和日志

### 添加监控
```typescript
// 记录 API 调用统计
const logApiCall = (status: string, duration: number) => {
  console.log(`[AI Chat] ${status} - ${duration}ms`)
}
```

### 错误追踪
考虑集成错误追踪服务（如 Sentry）来监控生产环境的错误。

## 相关文档

- [OpenRouter API 文档](https://openrouter.ai/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Rate Limiting 实现](./lib/rate-limit.ts)

## 总结

### 已修复
- ✅ 消息格式问题（移除 timestamp）
- ✅ 错误处理和日志
- ✅ API 响应验证

### 待确认
- ⏳ OPENROUTER_API_KEY 是否正确配置
- ⏳ OpenRouter 服务是否正常
- ⏳ 网络连接是否正常

### 下一步
1. 检查浏览器控制台的错误信息
2. 确认 API key 配置
3. 测试 OpenRouter API 连接
4. 根据错误信息进一步调试
