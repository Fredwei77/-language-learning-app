"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Package, Loader2, MapPin, Phone, User, Mail, Coins, Search, Download, CheckCircle2, Clock, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Redemption {
  id: string
  gift_id: string
  gift_name: string
  coins_spent: number
  status: string
  shipping_address: {
    name: string
    phone: string
    address: string
    notes?: string
  } | null
  created_at: string
  profiles: {
    display_name: string
    email: string
  }
}

export default function AdminRedemptionsPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [stats, setStats] = useState<any>(null)
  const [exporting, setExporting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRedemptions()
    fetchStats()
  }, [statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRedemptions()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchRedemptions = async () => {
    setLoading(true)
    try {
      const url = statusFilter === "all" 
        ? "/api/admin/redemptions" 
        : `/api/admin/redemptions?status=${statusFilter}`
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (response.ok) {
        setRedemptions(result.data || [])
      } else {
        toast({
          title: "加载失败",
          description: result.error || "无法加载兑换记录",
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

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id)
    try {
      const response = await fetch(`/api/redemptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "更新成功",
          description: "订单状态已更新",
        })
        fetchRedemptions()
      } else {
        const result = await response.json()
        toast({
          title: "更新失败",
          description: result.error || "无法更新订单状态",
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
      setUpdating(null)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "待处理",
      processing: "处理中",
      completed: "已完成",
      cancelled: "已取消",
    }
    return statusMap[status] || status
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/redemptions/stats")
      const result = await response.json()
      if (response.ok) {
        setStats(result.data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleBatchUpdate = async (newStatus: string) => {
    if (selectedOrders.length === 0) {
      toast({ title: "请先选择订单", variant: "destructive" })
      return
    }

    try {
      const response = await fetch("/api/admin/redemptions/batch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedOrders, status: newStatus })
      })

      const result = await response.json()

      if (response.ok) {
        toast({ title: result.message })
        setSelectedOrders([])
        fetchRedemptions()
        fetchStats()
      } else {
        toast({ title: "操作失败", description: result.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "操作失败", variant: "destructive" })
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const url = statusFilter === "all" 
        ? "/api/admin/redemptions/export" 
        : `/api/admin/redemptions/export?status=${statusFilter}`
      
      const response = await fetch(url)
      
      if (response.ok) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = downloadUrl
        a.download = `redemptions_${new Date().toISOString().split('T')[0]}.csv`
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

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    )
  }

  const toggleAllSelection = () => {
    if (selectedOrders.length === filteredRedemptions.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredRedemptions.map(r => r.id))
    }
  }

  const filteredRedemptions = redemptions.filter(r => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      r.gift_name.toLowerCase().includes(query) ||
      r.profiles.display_name?.toLowerCase().includes(query) ||
      r.profiles.email?.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <h1 className="text-xl font-bold">兑换订单管理</h1>
          </div>
          <Link href="/admin">
            <Button variant="outline">返回管理后台</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        {/* 统计面板 */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">订单总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">待处理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">处理中</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.processingOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">已完成</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">今日订单</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">总金币消耗</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.totalCoinsSpent}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>订单筛选</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handleExport} variant="outline" size="sm" disabled={exporting}>
                  {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  导出CSV
                </Button>
                <Button onClick={fetchRedemptions} variant="outline" size="sm">
                  刷新
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="pending">待处理</TabsTrigger>
                <TabsTrigger value="processing">处理中</TabsTrigger>
                <TabsTrigger value="completed">已完成</TabsTrigger>
                <TabsTrigger value="cancelled">已取消</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索订单号、商品名称、用户..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {selectedOrders.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBatchUpdate("processing")}>
                    <Clock className="h-4 w-4 mr-2" />
                    批量处理中
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBatchUpdate("completed")}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    批量完成
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBatchUpdate("cancelled")}>
                    <XCircle className="h-4 w-4 mr-2" />
                    批量取消
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredRedemptions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>暂无兑换记录</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 批量选择 */}
            <div className="mb-4 flex items-center gap-2">
              <Checkbox
                checked={selectedOrders.length === filteredRedemptions.length}
                onCheckedChange={toggleAllSelection}
              />
              <span className="text-sm text-muted-foreground">
                全选 ({selectedOrders.length}/{filteredRedemptions.length})
              </span>
            </div>

            <div className="space-y-4">
              {filteredRedemptions.map((redemption) => (
                <Card key={redemption.id} className={selectedOrders.includes(redemption.id) ? "ring-2 ring-primary" : ""}>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedOrders.includes(redemption.id)}
                          onCheckedChange={() => toggleOrderSelection(redemption.id)}
                        />
                        <div className="flex-1">
                          {/* 订单信息 */}
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg mb-1">{redemption.gift_name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  订单号: {redemption.id.slice(0, 8)}...
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(redemption.created_at).toLocaleString("zh-CN")}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-orange-600 font-semibold">
                                <Coins className="h-5 w-5" />
                                <span>{redemption.coins_spent}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{redemption.profiles.display_name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{redemption.profiles.email}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Badge variant={getStatusBadgeVariant(redemption.status)}>
                                {getStatusText(redemption.status)}
                              </Badge>
                              <Select
                                value={redemption.status}
                                onValueChange={(value) => updateStatus(redemption.id, value)}
                                disabled={updating === redemption.id}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">待处理</SelectItem>
                                  <SelectItem value="processing">处理中</SelectItem>
                                  <SelectItem value="completed">已完成</SelectItem>
                                  <SelectItem value="cancelled">已取消</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                    {/* 收货信息 */}
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold mb-3">收货信息</h4>
                      {redemption.shipping_address ? (
                        <>
                          <div className="flex items-start gap-2 text-sm">
                            <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                              <span className="text-muted-foreground">收货人: </span>
                              <span className="font-medium">{redemption.shipping_address.name}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <span>{redemption.shipping_address.phone}</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <span>{redemption.shipping_address.address}</span>
                          </div>
                          {redemption.shipping_address.notes && (
                            <div className="text-sm pt-2 border-t">
                              <span className="text-muted-foreground">备注: </span>
                              <span>{redemption.shipping_address.notes}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">无收货信息</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
