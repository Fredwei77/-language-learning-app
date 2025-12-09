# 🚀 快速参考指南

## 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm start                # 启动生产服务器

# 测试
npm test                 # 运行测试
npm run test:ui          # 测试 UI 界面
npm run test:coverage    # 测试覆盖率

# 代码质量
npm run lint             # 代码检查

# 工具
node scripts/verify-supabase.js  # 验证 Supabase 配置
```

---

## 环境变量

```bash
# 必需
OPENROUTER_API_KEY=              # AI 功能
NEXT_PUBLIC_SUPABASE_URL=        # 数据库
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # 数据库
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # 支付
STRIPE_SECRET_KEY=               # 支付
STRIPE_WEBHOOK_SECRET=           # 支付回调

# 可选
NEXT_PUBLIC_APP_URL=             # 应用 URL
UPSTASH_REDIS_REST_URL=          # Rate Limiting
UPSTASH_REDIS_REST_TOKEN=        # Rate Limiting
```

---

## 项目结构

```
app/
├── actions/          # Server Actions
├── api/              # API 路由
├── (pages)/          # 页面
└── ...

components/
├── home/             # 首页组件
├── ui/               # UI 组件
└── ...

lib/
├── api-utils.ts      # API 工具
├── rate-limit.ts     # 速率限制
├── validations.ts    # 数据验证
├── performance.ts    # 性能监控
└── ...
```

---

## 关键文件

| 文件 | 用途 |
|-----|------|
| `lib/env.ts` | 环境变量验证 |
| `lib/api-utils.ts` | API 错误处理 |
| `lib/rate-limit.ts` | 速率限制 |
| `lib/validations.ts` | 数据验证 |
| `lib/performance.ts` | 性能监控 |
| `app/actions/coins.ts` | 金币 Server Actions |
| `next.config.mjs` | PWA 配置 |
| `vitest.config.ts` | 测试配置 |

---

## API 路由

| 路由 | 方法 | 用途 |
|-----|------|------|
| `/api/ai-chat` | POST | AI 对话 |
| `/api/dictionary` | POST | 词典查询 |
| `/api/pronunciation` | POST | 发音评测 |
| `/api/coins/balance` | GET | 金币余额 |
| `/api/coins/practice` | POST | 练习时长 |
| `/api/coins/redeem` | POST | 兑换礼物 |
| `/api/webhooks/stripe` | POST | Stripe 回调 |

---

## Server Actions

```typescript
import { 
  addPracticeTimeAction,
  redeemGiftAction,
  getCoinsBalanceAction 
} from "@/app/actions/coins"

// 使用示例
const result = await addPracticeTimeAction(1800)
```

---

## 测试

```typescript
// 单元测试
import { describe, it, expect } from "vitest"

describe("MyFunction", () => {
  it("should work", () => {
    expect(myFunction()).toBe(expected)
  })
})
```

---

## 性能监控

```typescript
import { 
  initPerformanceMonitoring,
  measurePerformance 
} from "@/lib/performance"

// 初始化
useEffect(() => {
  initPerformanceMonitoring()
}, [])

// 测量性能
const result = measurePerformance("taskName", () => {
  return doSomething()
})
```

---

## 常见问题

### Q: 构建失败？
```bash
# 清理缓存
rm -rf .next
npm run build
```

### Q: 环境变量不生效？
```bash
# 重启开发服务器
# Ctrl+C 然后
npm run dev
```

### Q: 测试失败？
```bash
# 更新快照
npm test -- -u
```

---

## 文档索引

| 文档 | 内容 |
|-----|------|
| `QUICK_SETUP.md` | 快速设置 |
| `MIGRATION_GUIDE.md` | 数据库迁移 |
| `FIXES_SUMMARY.md` | 修复总结 |
| `OPTIMIZATION_SUMMARY.md` | 优化总结 |
| `ADVANCED_OPTIMIZATIONS.md` | 高级优化 |
| `PROJECT_STATUS.md` | 项目状态 |
| `PAYMENT_*.md` | 支付相关 |

---

## 快速链接

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [OpenRouter](https://openrouter.ai)
- [Vercel](https://vercel.com)

---

**保存此文件以便快速参考！** 📌
