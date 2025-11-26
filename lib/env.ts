import { z } from "zod"

// 在构建时允许缺少某些环境变量，运行时再验证
const envSchema = z.object({
  OPENROUTER_API_KEY: z.string().default(""),
  NEXT_PUBLIC_SUPABASE_URL: z.string().default(""),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default(""),
  STRIPE_SECRET_KEY: z.string().default(""),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
})

export const env = envSchema.parse({
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
})
