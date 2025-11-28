"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Coins, Loader2, Search, Download, ShoppingCart, Gift, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Transaction {
  id: string
  user_id: string
  amount: number
  type: "purchase" | "earn" | "spend"
  description: string | null
  reference_id: string | null
  created_at: string
  profiles: {
    display_name: string | null
    email: string
  }
}

interface Stats {
  totalTransactions: number
  purchaseCount: number
  earnCount: number
  spendCount: number
  totalPurchase: number
  totalEarn: number
  totalSpend: number
  todayTransactions: number
  weekTransactions: number
  todayPurchaseAmount: number
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [exporting, setExporting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTransactions()
    fetchStats()
  }, [typeFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      let url = "/api/admin/transactions?limit=100"
      if (typeFilter !== "all") url += `&type=${typeFilter}`
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (response.ok) {
        setTransactions(result.data || [])
      } else {
        toast({
          title: "加载失败",
          description: result.error || "无法加载交易记录",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/transactions/stats")
      const result = await response.json()
      if (response.ok) {
        setStats(result.data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const url = typeFilter === "all" 
        ? "/api/admin/transactions/export" 
        : `/api/admin/transactions/export?type=${typeFilter}`
      
      const response = await fetch(url)
      
      if (response.ok) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = downloadUrl
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(downloadUrl)
        document.body.removeChild(a)
        toast({ title: "导出成功" })
      } else {
        toast({ title: "导出失败", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "导出失败", variant: "destructive" })
    } finally {
      setExporting(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <ShoppingCart className="h-4 w-4" />
      case "earn":
        return <TrendingUp className="h-4 w-4" />
      case "spend":
        return <Gift className="h-4 w-4" />
      default:
        return <Coins className="h-4 w-4" />
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "purchase":
        return "default"
      case "earn":
        return "secondary"
      case "spend":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      purchase: "购买",
      earn: "获得",
      spend: "消费"
    }
    return typeMap[type] || type
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6" />
            <h1 className="text-xl font-bold">金币交易记录</h1>
          </div>
          <Link href="/admin">
            <Button variant="outline">返回管理后台</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        {/* 统计面板 */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">交易总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTransactions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">购买金币</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+{stats.totalPurchase}</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.purchaseCount}笔交易</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">获得金币</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">+{stats.totalEarn}</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.earnCount}笔交易</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">消费金币</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">-{stats.totalSpend}</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.spendCount}笔交易</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">今日购买</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.todayPurchaseAmount}</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.todayTransactions}笔交易</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 筛选和搜索 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>交易筛选</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handleExport} variant="outline" size="sm" disabled={exporting}>
                  {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  导出CSV
                </Button>
                <Button onClick={fetchTransactions} variant="outline" size="sm">
                  刷新
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={typeFilter} onValueChange={setTypeFilter}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="purchase">购买</TabsTrigger>
                <TabsTrigger value="earn">获得</TabsTrigger>
                <TabsTrigger value="spend">消费</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索用户名或邮箱..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 交易列表 */}
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Coins className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>暂无交易记录</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>金币数量</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead>参考ID</TableHead>
                      <TableHead>时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.profiles.display_name || "未设置"}
                        </TableCell>
                        <TableCell>{transaction.profiles.email}</TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-1 font-semibold ${
                            transaction.amount > 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            <Coins className="h-4 w-4" />
                            {transaction.amount > 0 ? "+" : ""}{transaction.amount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeBadgeVariant(transaction.type)} className="gap-1">
                            {getTypeIcon(transaction.type)}
                            {getTypeText(transaction.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {transaction.description || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {transaction.reference_id ? transaction.reference_id.slice(0, 8) + "..." : "-"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(transaction.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
