import { z } from "zod"

// ============================================
// AI Chat 验证
// ============================================

export const aiChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1, "消息内容不能为空").max(2000, "消息内容过长"),
  timestamp: z.date().optional(),
})

export const aiChatRequestSchema = z.object({
  messages: z.array(aiChatMessageSchema).min(1, "至少需要一条消息"),
  scenario: z.string().optional(),
})

export type AiChatRequest = z.infer<typeof aiChatRequestSchema>

// ============================================
// Dictionary 验证
// ============================================

export const dictionaryRequestSchema = z.object({
  word: z.string().min(1, "查询词语不能为空").max(100, "查询词语过长"),
  language: z.enum(["english", "chinese", "cantonese"]),
})

export type DictionaryRequest = z.infer<typeof dictionaryRequestSchema>

// ============================================
// Pronunciation 验证
// ============================================

export const pronunciationRequestSchema = z.object({
  original: z.string().min(1, "原文不能为空").max(500, "原文过长"),
  spoken: z.string().min(1, "朗读内容不能为空").max(500, "朗读内容过长"),
})

export type PronunciationRequest = z.infer<typeof pronunciationRequestSchema>

// ============================================
// Coins 验证
// ============================================

export const practiceTimeRequestSchema = z.object({
  seconds: z.number().int().min(1, "练习时长必须大于0").max(7200, "单次练习时长不能超过2小时"),
})

export type PracticeTimeRequest = z.infer<typeof practiceTimeRequestSchema>

export const redeemGiftRequestSchema = z.object({
  giftId: z.string().min(1, "礼物ID不能为空"),
  giftName: z.string().min(1, "礼物名称不能为空"),
  giftCoins: z.number().int().min(1, "金币数量必须大于0").max(100000, "金币数量异常"),
})

export type RedeemGiftRequest = z.infer<typeof redeemGiftRequestSchema>

// ============================================
// Profile 验证
// ============================================

export const updateProfileSchema = z.object({
  display_name: z.string().min(1, "昵称不能为空").max(50, "昵称过长").optional(),
  avatar_url: z.string().url("头像URL格式不正确").optional(),
})

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>

// ============================================
// Check-in 验证
// ============================================

export const checkInRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式不正确").optional(),
})

export type CheckInRequest = z.infer<typeof checkInRequestSchema>

// ============================================
// 通用验证函数
// ============================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("密码至少需要8个字符")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("密码需要包含至少一个大写字母")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("密码需要包含至少一个小写字母")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("密码需要包含至少一个数字")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function sanitizeInput(input: string): string {
  // 移除潜在的 XSS 攻击字符
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim()
}
