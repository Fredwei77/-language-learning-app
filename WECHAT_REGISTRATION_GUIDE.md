# 微信公众号注册验证实现指南

## 功能概述

用户注册时不需要邮箱验证，而是通过扫描微信公众号二维码并关注后自动完成注册。

## 技术架构

### 流程图

```
用户填写注册信息
    ↓
生成临时注册码
    ↓
显示公众号二维码（带参数）
    ↓
用户扫码关注公众号
    ↓
微信服务器推送关注事件
    ↓
后端接收事件并验证参数
    ↓
自动完成用户注册
    ↓
推送注册成功消息
    ↓
前端轮询检测注册状态
    ↓
自动登录并跳转
```

## 前置要求

### 1. 微信公众号

需要一个**已认证的服务号**（订阅号不支持生成带参数二维码）

- 登录：https://mp.weixin.qq.com
- 类型：服务号（已认证）
- 权限：生成带参数二维码、接收事件推送

### 2. 获取公众号配置信息

在微信公众平台获取：

```
AppID: wx1234567890abcdef
AppSecret: 1234567890abcdef1234567890abcdef
```

位置：设置与开发 → 基本配置 → 开发者ID

### 3. 配置服务器

在微信公众平台配置服务器地址：

```
URL: https://your-domain.com/api/wechat/callback
Token: 自定义（如：your_token_123）
EncodingAESKey: 随机生成或自定义
消息加解密方式: 明文模式（开发）或安全模式（生产）
```

位置：设置与开发 → 基本配置 → 服务器配置

## 数据库设计

### 临时注册表 (pending_registrations)

```sql
CREATE TABLE pending_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scene_id VARCHAR(64) UNIQUE NOT NULL,  -- 场景值（二维码参数）
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  nickname VARCHAR(100),
  wechat_openid VARCHAR(100),  -- 关注后获取
  status VARCHAR(20) DEFAULT 'pending',  -- pending, completed, expired
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 minutes',
  completed_at TIMESTAMP
);

-- 索引
CREATE INDEX idx_scene_id ON pending_registrations(scene_id);
CREATE INDEX idx_status ON pending_registrations(status);
CREATE INDEX idx_expires_at ON pending_registrations(expires_at);
```

### 用户表添加字段

```sql
ALTER TABLE users ADD COLUMN wechat_openid VARCHAR(100) UNIQUE;
CREATE INDEX idx_wechat_openid ON users(wechat_openid);
```

## 环境变量配置

在 `.env.local` 和 Netlify 环境变量中添加：

```env
# 微信公众号配置
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef
WECHAT_TOKEN=your_token_123
WECHAT_ENCODING_AES_KEY=your_aes_key_here

# 公众号二维码（可选，如果有固定的）
NEXT_PUBLIC_WECHAT_QR_URL=https://your-qr-code-url.jpg
```

## 实现步骤

### 步骤 1: 安装依赖

```bash
npm install crypto-js qrcode
npm install --save-dev @types/qrcode
```

### 步骤 2: 创建微信 API 工具

文件：`lib/wechat/api.ts`

### 步骤 3: 创建注册 API

文件：`app/api/auth/register-wechat/route.ts`

### 步骤 4: 创建微信回调 API

文件：`app/api/wechat/callback/route.ts`

### 步骤 5: 创建注册状态检查 API

文件：`app/api/auth/check-registration/route.ts`

### 步骤 6: 更新注册页面

文件：`app/auth/register/page.tsx`

### 步骤 7: 创建二维码显示组件

文件：`components/wechat-qr-register.tsx`

## 安全考虑

### 1. 场景值加密

使用加密的场景值防止伪造：

```typescript
const sceneId = crypto.randomBytes(16).toString('hex')
```

### 2. 时效性

- 临时注册记录 30 分钟过期
- 定期清理过期记录

### 3. 防重放攻击

- 每个场景值只能使用一次
- 验证时间戳

### 4. 签名验证

验证微信服务器推送的消息签名：

```typescript
const signature = sha1([token, timestamp, nonce].sort().join(''))
```

## 用户体验优化

### 1. 轮询检测

前端每 2 秒检查一次注册状态：

```typescript
const checkInterval = setInterval(async () => {
  const status = await checkRegistrationStatus(sceneId)
  if (status === 'completed') {
    clearInterval(checkInterval)
    // 自动登录
  }
}, 2000)
```

### 2. 超时处理

30 分钟后自动停止轮询并提示用户重新注册

### 3. 加载状态

显示友好的等待界面和进度提示

### 4. 错误处理

- 二维码加载失败
- 网络超时
- 关注失败

## 测试流程

### 开发环境测试

1. **使用微信开发者工具**
   - 下载：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   - 模拟关注事件

2. **使用测试号**
   - 申请测试号：https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login
   - 配置测试服务器

### 生产环境测试

1. 使用真实公众号
2. 配置生产服务器地址
3. 完整流程测试

## 常见问题

### Q1: 二维码不显示？

**原因：**
- AppID 或 AppSecret 错误
- 网络问题
- 公众号未认证

**解决：**
- 检查环境变量
- 查看 API 返回错误
- 确认公众号类型

### Q2: 关注后没有反应？

**原因：**
- 服务器地址配置错误
- 回调接口未正确处理
- 签名验证失败

**解决：**
- 检查微信公众平台的服务器配置
- 查看服务器日志
- 验证 Token 是否正确

### Q3: 注册超时？

**原因：**
- 用户未关注
- 网络延迟
- 数据库问题

**解决：**
- 提示用户确认已关注
- 增加超时时间
- 检查数据库连接

## 成本估算

### 微信公众号

- **服务号认证费：** ¥300/年
- **API 调用：** 免费（有限额）
- **带参数二维码：** 免费（临时二维码 100,000 个/天）

### 服务器

- **Netlify Functions：** 免费额度足够
- **Supabase：** 免费额度足够

## 替代方案

如果无法使用服务号，可以考虑：

### 方案 1: 固定二维码 + 关键词

1. 用户扫描固定二维码关注
2. 发送注册码（如：REG123456）
3. 公众号返回确认链接
4. 点击链接完成注册

### 方案 2: 微信登录

使用微信开放平台的网页授权登录

### 方案 3: 保留邮箱验证

作为备选方案，同时支持两种验证方式

## 优势

1. **用户体验好** - 无需切换应用查看邮件
2. **转化率高** - 流程简单，一步完成
3. **获取粉丝** - 同时增加公众号关注
4. **推送能力** - 后续可以推送学习提醒

## 劣势

1. **需要认证服务号** - 有年费成本
2. **依赖微信生态** - 非微信用户无法使用
3. **开发复杂度** - 需要对接微信 API

## 建议

### 混合方案

同时支持两种验证方式：

1. **微信验证**（推荐）- 快速便捷
2. **邮箱验证**（备选）- 兼容性好

让用户自己选择验证方式。

## 下一步

1. 申请或准备微信服务号
2. 获取 AppID 和 AppSecret
3. 配置服务器地址
4. 实现代码
5. 测试流程
6. 上线部署

---

**预计开发时间：** 2-3 天  
**难度：** ⭐⭐⭐⭐☆（较复杂）  
**推荐度：** ⭐⭐⭐⭐☆（推荐，但需要服务号）
