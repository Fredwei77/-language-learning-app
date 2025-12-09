# 部署指南

## 部署前检查清单

在部署之前，请确保：

- ✅ 所有功能模块已测试通过
- ✅ OpenRouter API密钥已准备好
- ✅ 了解Vercel的使用限制和定价
- ✅ 准备好自定义域名（可选）

## 详细部署步骤

### 步骤1：准备OpenRouter API密钥

1. 访问 https://openrouter.ai/
2. 创建账号或登录
3. 前往 API Keys 页面: https://openrouter.ai/keys
4. 点击 "Create Key" 创建新密钥
5. 复制并保存密钥（只显示一次）

### 步骤2：通过v0部署到Vercel（最简单）

1. 在v0界面，找到右上角的 **"发布"** 按钮
2. 点击 "发布"，系统会自动：
   - 创建Vercel项目
   - 连接GitHub仓库（如需要）
   - 开始构建和部署

3. 等待部署完成（通常2-3分钟）
4. 部署成功后，你会获得一个 `.vercel.app` 域名

### 步骤3：配置环境变量

部署完成后，需要添加环境变量：

1. 在v0侧边栏点击 "Vars" 或前往Vercel Dashboard
2. 找到你的项目
3. 进入 "Settings" → "Environment Variables"
4. 添加以下变量：

\`\`\`
变量名: OPENROUTER_API_KEY
值: 你的OpenRouter API密钥
环境: Production, Preview, Development（全选）
\`\`\`

5. 添加可选变量（推荐）：

\`\`\`
变量名: NEXT_PUBLIC_APP_URL
值: https://your-project.vercel.app
环境: Production, Preview, Development（全选）
\`\`\`

### 步骤4：重新部署以应用环境变量

1. 返回 "Deployments" 页面
2. 点击最新部署右侧的三个点
3. 选择 "Redeploy"
4. 等待重新部署完成

### 步骤5：测试部署

访问你的网站，测试以下功能：

- [ ] 主页加载正常
- [ ] 智能词典可以查询单词
- [ ] AI对话可以正常聊天
- [ ] 课文模块显示内容
- [ ] 粤语学习功能正常
- [ ] 发音评测可以录音和评分
- [ ] 金币系统正常工作
- [ ] 商城可以浏览和兑换

## 自定义域名配置（可选）

1. 在Vercel项目的 "Settings" → "Domains"
2. 点击 "Add Domain"
3. 输入你的域名（如 `learn.yourdomain.com`）
4. 按照提示在你的DNS提供商处添加记录：
   - 类型: CNAME
   - 名称: learn（或你的子域名）
   - 值: cname.vercel-dns.com
5. 等待DNS传播（通常5-10分钟）
6. Vercel会自动配置SSL证书

## 性能优化建议

### 1. 启用Vercel Analytics

\`\`\`typescript
// app/layout.tsx 已集成
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

### 2. 配置缓存策略

API路由已配置合理的缓存，但你可以根据需要调整：

\`\`\`typescript
// app/api/dictionary/route.ts
export const runtime = 'edge' // 使用Edge Runtime提升性能
export const dynamic = 'force-dynamic' // 根据需求调整
\`\`\`

### 3. 图片优化

项目已启用 `images.unoptimized = true`，如果使用自己的图片，建议：
- 使用WebP格式
- 压缩图片大小
- 使用Next.js Image组件

## 监控和维护

### 查看部署日志

1. 进入Vercel Dashboard
2. 选择你的项目
3. 点击 "Deployments" 查看构建日志
4. 点击具体部署查看详细日志

### 监控API使用量

1. 定期查看OpenRouter Dashboard
2. 监控API调用次数和费用
3. 设置使用量告警

### 更新部署

当你在v0中修改代码后：
1. v0会自动推送更新到GitHub
2. Vercel会自动检测并部署新版本
3. 或手动触发重新部署

## 故障排查

### 问题1：API调用失败
**症状**: 词典、AI对话等功能无响应
**解决**:
- 检查环境变量是否正确配置
- 确认OpenRouter API密钥有效
- 查看Vercel函数日志

### 问题2：页面加载很慢
**症状**: 首次加载时间过长
**解决**:
- 检查网络连接
- 使用Vercel Analytics查看性能指标
- 考虑启用CDN加速

### 问题3：语音功能不工作
**症状**: 发音和录音功能无效
**解决**:
- 确保使用HTTPS访问（Vercel自动提供）
- 检查浏览器是否支持Web Speech API
- 授予麦克风权限

### 问题4：构建失败
**症状**: 部署时构建出错
**解决**:
- 查看构建日志中的错误信息
- 检查 TypeScript 错误（已配置忽略）
- 确保所有依赖正确安装

## 成本估算

### Vercel费用
- **Hobby计划**: 免费
  - 100GB带宽/月
  - 无限部署
  - 自动SSL
  - 足够个人使用

- **Pro计划**: $20/月
  - 1TB带宽
  - 更多并发构建
  - 团队协作功能

### OpenRouter费用
- 按使用量付费
- GPT-3.5-turbo: ~$0.002/1K tokens
- GPT-4: ~$0.03/1K tokens
- 建议设置月度预算限制

## 备份和恢复

### 代码备份
- GitHub自动备份所有代码
- 可以通过v0下载完整项目

### 用户数据备份
目前金币等数据存储在浏览器本地，建议：
- 定期导出用户数据
- 考虑添加云端同步功能
- 使用数据库持久化存储

## 后续改进建议

1. **添加用户认证系统** - 使用Supabase或Auth.js
2. **云端数据同步** - 存储学习进度和金币
3. **支付集成** - 使用Stripe实现金币购买
4. **更多课程内容** - 扩展教材库
5. **移动端优化** - 添加PWA支持
6. **社交功能** - 学习打卡、排行榜

## 技术支持

如遇到部署问题：
1. 查看Vercel文档: https://vercel.com/docs
2. OpenRouter文档: https://openrouter.ai/docs
3. Vercel支持: https://vercel.com/help
4. 在v0中重新生成或修复代码

---

祝部署顺利！如有任何问题，欢迎随时咨询。
