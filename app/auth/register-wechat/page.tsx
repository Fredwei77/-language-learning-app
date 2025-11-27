"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Lock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { WechatQRRegister } from "@/components/wechat-qr-register"

export default function RegisterWechatPage() {
  const [step, setStep] = useState<"form" | "qrcode">("form")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [loading, setLoading] = useState(false)
  const [qrData, setQrData] = useState<{
    sceneId: string
    qrCodeUrl: string
    expiresIn: number
  } | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "两次输入的密码不一致",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "密码太短",
        description: "密码至少需要6个字符",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register-wechat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nickname: nickname || email.split("@")[0],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "注册失败",
          description: data.error || "请稍后重试",
          variant: "destructive",
        })
        return
      }

      // 显示二维码
      setQrData({
        sceneId: data.data.sceneId,
        qrCodeUrl: data.data.qrCodeUrl,
        expiresIn: data.data.expiresIn,
      })
      setStep("qrcode")
    } catch (error) {
      toast({
        title: "注册失败",
        description: "发生未知错误",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 显示二维码页面
  if (step === "qrcode" && qrData) {
    return (
      <WechatQRRegister
        sceneId={qrData.sceneId}
        qrCodeUrl={qrData.qrCodeUrl}
        email={email}
        expiresIn={qrData.expiresIn}
      />
    )
  }

  // 显示注册表单
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">微信注册</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回首页
              </Link>
            </Button>
          </div>
          <CardDescription>填写信息后扫码关注公众号完成注册</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">昵称（可选）</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nickname"
                  type="text"
                  placeholder="您的昵称"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="至少6个字符"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成二维码...
                </>
              ) : (
                "下一步：扫码关注"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm space-y-2">
            <div>
              <span className="text-muted-foreground">已有账号？</span>{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                立即登录
              </Link>
            </div>
            <div>
              <Link href="/auth/register" className="text-muted-foreground hover:text-primary">
                使用邮箱注册
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
