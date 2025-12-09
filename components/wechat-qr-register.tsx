"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle, RefreshCw, Clock, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface WechatQRRegisterProps {
  sceneId: string
  qrCodeUrl: string
  email: string
  expiresIn: number
}

export function WechatQRRegister({ sceneId, qrCodeUrl, email, expiresIn }: WechatQRRegisterProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"waiting" | "completed" | "expired" | "error">("waiting")
  const [countdown, setCountdown] = useState(expiresIn)
  const [message, setMessage] = useState("")

  // 轮询检查注册状态
  useEffect(() => {
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/auth/check-registration?sceneId=${sceneId}`)
        const data = await response.json()

        if (data.status === "completed") {
          setStatus("completed")
          setMessage("注册成功！正在跳转...")
          clearInterval(checkInterval)

          // 3秒后跳转到登录页
          setTimeout(() => {
            router.push("/auth/login?registered=true")
          }, 3000)
        } else if (data.status === "expired") {
          setStatus("expired")
          setMessage("二维码已过期，请重新注册")
          clearInterval(checkInterval)
        }
      } catch (error) {
        console.error("检查注册状态失败:", error)
      }
    }, 2000) // 每2秒检查一次

    return () => clearInterval(checkInterval)
  }, [sceneId, router])

  // 倒计时
  useEffect(() => {
    if (countdown <= 0) {
      setStatus("expired")
      setMessage("二维码已过期")
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setStatus("expired")
          setMessage("二维码已过期")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleRefresh = () => {
    router.push("/auth/register")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">关注公众号完成注册</CardTitle>
          <CardDescription>
            请使用微信扫描下方二维码关注公众号，关注后将自动完成注册
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 状态显示 */}
          {status === "waiting" && (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                等待扫码关注...
              </AlertDescription>
            </Alert>
          )}

          {status === "completed" && (
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {status === "expired" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* 二维码 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {status === "expired" ? (
                <div className="w-64 h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <XCircle className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500">二维码已过期</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-64 h-64 bg-white p-4 rounded-lg shadow-lg">
                  <Image
                    src={qrCodeUrl}
                    alt="微信公众号二维码"
                    width={256}
                    height={256}
                    className="w-full h-full"
                    unoptimized
                  />
                  {status === "waiting" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg">
                      <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 倒计时 */}
            {status === "waiting" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>二维码有效期：{formatTime(countdown)}</span>
              </div>
            )}

            {/* 公众号名称 */}
            <div className="text-center">
              <p className="text-sm font-medium">忆迈AI智能文化</p>
              <p className="text-xs text-muted-foreground">YiMai AI</p>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-medium">操作步骤：</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>打开微信，点击右上角 "+" 号</li>
                  <li>选择"扫一扫"</li>
                  <li>扫描上方二维码</li>
                  <li>点击"关注公众号"</li>
                  <li>关注成功后自动完成注册</li>
                </ol>
              </div>
            </div>
          </div>

          {/* 注册信息 */}
          <div className="text-center text-sm text-muted-foreground">
            <p>注册邮箱：{email}</p>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            {status === "expired" && (
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                重新注册
              </Button>
            )}
            {status === "waiting" && (
              <Button variant="outline" onClick={handleRefresh} className="w-full">
                返回注册
              </Button>
            )}
          </div>

          {/* 提示信息 */}
          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>• 关注后将收到注册成功通知</p>
            <p>• 可以随时取消关注，不影响账号使用</p>
            <p>• 关注后可接收学习提醒和更新通知</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
