"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Package, ShoppingBag, Coins, TrendingUp, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DashboardStats {
  users: {
    total: number
    today: number
    week: number
  }
  gifts: {
    total: number
    active: number
    lowStock: number
  }
  redemptions: {
    total: number
    pending: number
    today: number
  }
  transactions: {
    total: number
    todayPurchase: number
    totalCoins: number
  }
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/")
      return
    }

    const { data } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    
    if (!data?.is_admin) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    setIsAdmin(true)
    fetchAllStats()
  }

  const fetchAllStats = async () => {
    try {
      const [usersRes, giftsRes, redemptionsRes, transactionsRes] = await Promise.all([
        fetch("/api/admin/users/stats"),
        fetch("/api/gifts/stats"),
        fetch("/api/admin/redemptions/stats"),
        fetch("/api/admin/transactions/stats")
      ])

      const [usersData, giftsData, redemptionsData, transactionsData] = await Promise.all([
        usersRes.json(),
        giftsRes.json(),
        redemptionsRes.json(),
        transactionsRes.json()
      ])

      setStats({
        users: {
          total: usersData.data?.totalUsers || 0,
          today: usersData.data?.todayUsers || 0,
          week: usersData.data?.weekUsers || 0
        },
        gifts: {
          total: giftsData.data?.totalGifts || 0,
          active: giftsData.data?.activeGifts || 0,
          lowStock: giftsData.data?.lowStockGifts || 0
        },
        redemptions: {
          total: redemptionsData.data?.totalOrders || 0,
          pending: redemptionsData.data?.pendingOrders || 0,
          today: redemptionsData.data?.todayOrders || 0
        },
        transactions: {
          total: transactionsData.data?.totalTransactions || 0,
          todayPurchase: transactionsData.data?.todayPurchaseAmount || 0,
          totalCoins: usersData.data?.totalCoins || 0
        }
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">无权访问</h1>
        <p className="text-muted-foreground">您需要管理员权限才能访问此页面</p>
        <Button asChild>
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">管理后台</h1>
          <Button variant="outline" asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {/* 概览统计 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">数据概览</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">用户总数</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  今日新增 {stats?.users.today || 0} 人
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">商品总数</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.gifts.total || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  激活 {stats?.gifts.active || 0} 个
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">订单总数</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.redemptions.total || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  待处理 {stats?.redemptions.pending || 0} 个
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">金币交易</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.transactions.total || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  今日购买 {stats?.transactions.todayPurchase || 0} 币
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 管理功能入口 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">管理功能</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/users">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>用户管理</CardTitle>
                      <CardDescription>管理注册用户和权限</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">总用户数</span>
                    <span className="font-semibold">{stats?.users.total || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">本周新增</span>
                    <span className="font-semibold text-green-600">+{stats?.users.week || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/gifts">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>商品管理</CardTitle>
                      <CardDescription>管理商品和库存</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">商品总数</span>
                    <span className="font-semibold">{stats?.gifts.total || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">低库存</span>
                    <span className="font-semibold text-orange-600">{stats?.gifts.lowStock || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/redemptions">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>订单管理</CardTitle>
                      <CardDescription>处理兑换订单</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">订单总数</span>
                    <span className="font-semibold">{stats?.redemptions.total || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">待处理</span>
                    <span className="font-semibold text-orange-600">{stats?.redemptions.pending || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/transactions">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Coins className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle>交易记录</CardTitle>
                      <CardDescription>查看金币交易明细</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">交易总数</span>
                    <span className="font-semibold">{stats?.transactions.total || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">系统总金币</span>
                    <span className="font-semibold text-orange-600">{stats?.transactions.totalCoins || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* 快速操作 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">快速操作</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto py-4">
              <Link href="/admin/gifts">
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-6 w-6" />
                  <span>添加商品</span>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4">
              <Link href="/admin/redemptions">
                <div className="flex flex-col items-center gap-2">
                  <ShoppingBag className="h-6 w-6" />
                  <span>处理订单</span>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4">
              <Link href="/admin/users">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-6 w-6" />
                  <span>查看用户</span>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4">
              <Link href="/admin/transactions">
                <div className="flex flex-col items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>交易统计</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
