import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextRequest } from "next/server"
import { ApiError } from "./api-utils"

// 如果没有配置 Upstash，使用内存存储（仅用于开发）
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

// 内存存储（开发环境备用）
class MemoryStore {
  private store = new Map<string, { count: number; reset: number }>()

  async limit(identifier: string, limit: number, window: number) {
    const now = Date.now()
    const key = identifier
    const data = this.store.get(key)

    if (!data || now > data.reset) {
      this.store.set(key, { count: 1, reset: now + window })
      return { success: true, limit, remaining: limit - 1, reset: now + window }
    }

    if (data.count >= limit) {
      return { success: false, limit, remaining: 0, reset: data.reset }
    }

    data.count++
    return { success: true, limit, remaining: limit - data.count, reset: data.reset }
  }
}

const memoryStore = new MemoryStore()

// 不同的速率限制配置
export const rateLimiters = {
  // AI 对话：每分钟 10 次
  aiChat: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 m"),
        analytics: true,
        prefix: "ratelimit:ai-chat",
      })
    : null,

  // 词典查询：每分钟 30 次
  dictionary: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, "1 m"),
        analytics: true,
        prefix: "ratelimit:dictionary",
      })
    : null,

  // 发音评测：每分钟 20 次
  pronunciation: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "1 m"),
        analytics: true,
        prefix: "ratelimit:pronunciation",
      })
    : null,

  // 金币操作：每分钟 60 次
  coins: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, "1 m"),
        analytics: true,
        prefix: "ratelimit:coins",
      })
    : null,

  // 签到：每天 1 次
  checkIn: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(1, "1 d"),
        analytics: true,
        prefix: "ratelimit:check-in",
      })
    : null,
}

// 获取客户端标识符
export function getIdentifier(request: NextRequest, userId?: string): string {
  // 优先使用用户 ID
  if (userId) {
    return `user:${userId}`
  }

  // 使用 IP 地址
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  return `ip:${ip}`
}

// 速率限制检查
export async function checkRateLimit(
  request: NextRequest,
  limiterName: keyof typeof rateLimiters,
  userId?: string,
): Promise<void> {
  const limiter = rateLimiters[limiterName]
  const identifier = getIdentifier(request, userId)

  // 如果没有配置 Redis，使用内存存储
  if (!limiter) {
    const limits = {
      aiChat: { limit: 10, window: 60000 },
      dictionary: { limit: 30, window: 60000 },
      pronunciation: { limit: 20, window: 60000 },
      coins: { limit: 60, window: 60000 },
      checkIn: { limit: 1, window: 86400000 },
    }

    const config = limits[limiterName]
    const result = await memoryStore.limit(identifier, config.limit, config.window)

    if (!result.success) {
      throw new ApiError(429, "请求过于频繁，请稍后再试", "RATE_LIMIT_EXCEEDED")
    }
    return
  }

  // 使用 Upstash Redis
  const { success, limit, remaining, reset } = await limiter.limit(identifier)

  if (!success) {
    const resetDate = new Date(reset)
    throw new ApiError(
      429,
      `请求过于频繁，请在 ${resetDate.toLocaleTimeString("zh-CN")} 后重试`,
      "RATE_LIMIT_EXCEEDED",
    )
  }

  // 在开发环境显示剩余次数
  if (process.env.NODE_ENV === "development") {
    console.log(`Rate limit: ${remaining}/${limit} remaining`)
  }
}
