"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

// 禁用静态生成，使用动态渲染
export const dynamic = 'force-dynamic'

function ConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const error = searchParams.get("error")
    
    if (error) {
      setStatus("error")
      setMessage(decodeURIComponent(error))
    } else {
      // 如果没有错误，说明验证成功
      setStatus("success")
      setMessage("邮箱验证成功！")
      
      // 3秒后自动跳转到登录页
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "验证中..."}
            {status === "success" && "验证成功！"}
            {status === "error" && "验证失败"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "正在验证您的邮箱..."}
            {status === "success" && "您的邮箱已成功验证"}
            {status === "error" && message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                3秒后自动跳转到登录页面...
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/login">立即登录</Link>
              </Button>
            </div>
          )}
          
          {status === "error" && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  邮箱验证失败，可能的原因：
                </p>
                <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                  <li>验证链接已过期</li>
                  <li>验证链接已被使用</li>
                  <li>验证链接无效</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/auth/register">重新注册</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/auth/login">返回登录</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            </div>
            <CardTitle className="text-2xl">加载中...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  )
}
