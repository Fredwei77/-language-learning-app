import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileContent } from "@/components/profile-content"
import { BookOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// 强制动态渲染
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: recentProgress } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("*")
    .eq("user_id", user.id)
    .order("check_in_date", { ascending: false })
    .limit(30)

  const { data: redemptions } = await supabase
    .from("gift_redemptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">个人中心</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <ProfileContent 
          user={user} 
          profile={profile} 
          recentProgress={recentProgress || []} 
          checkIns={checkIns || []}
          redemptions={redemptions || []}
        />
      </main>
    </div>
  )
}
