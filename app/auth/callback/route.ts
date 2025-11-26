import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/"

  if (code) {
    const supabase = await createClient()
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        )
      }

      // 成功验证，重定向到目标页面
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } catch (error) {
      console.error("Auth callback exception:", error)
      return NextResponse.redirect(
        new URL("/auth/login?error=verification_failed", requestUrl.origin)
      )
    }
  }

  // 没有 code，重定向到登录页
  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin))
}
