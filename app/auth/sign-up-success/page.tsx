import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-10 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BookOpen className="h-7 w-7" />
            </div>
            <span className="text-2xl font-bold">智学语言</span>
          </div>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">注册成功！</CardTitle>
              <CardDescription className="text-base">请查收您的邮箱以验证账号</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <Mail className="h-6 w-6 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">验证邮件已发送</p>
                  <p className="text-sm text-muted-foreground">我们已向您的邮箱发送了验证链接，请点击链接完成注册。</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button asChild className="w-full h-11">
                  <Link href="/auth/login">前往登录</Link>
                </Button>
                <Button variant="outline" asChild className="w-full h-11 bg-transparent">
                  <Link href="/">返回首页</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
