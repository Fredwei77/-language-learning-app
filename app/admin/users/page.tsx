"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Users, Loader2, Search, Crown, Coins, TrendingUp, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface User {
  id: string
  email: string
  display_name: string | null
  coins: number
  is_admin: boolean
  total_study_time: number
  streak_days: number
  created_at: string
}

interface Stats {
  totalUsers: number
  adminUsers: number
  todayUsers: number
  weekUsers: number
  totalCoins: number
  activeUsers: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editCoins, setEditCoins] = useState("")
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      let url = "/api/admin/users?limit=50"
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (response.ok) {
        setUsers(result.data || [])
      } else {
        toast({
          title: "加载失败",
          description: result.error || "无法加载用户列表",
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
      const response = await fetch("/api/admin/users/stats")
      const result = await response.json()
      if (response.ok) {
        setStats(result.data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditCoins(user.coins.toString())
    setShowEditDialog(true)
  }

  const handleUpdateCoins = async () => {
    if (!editingUser) return

    setUpdating(true)
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser.id,
          coins: parseInt(editCoins)
        })
      })

      if (response.ok) {
        toast({ title: "更新成功" })
        setShowEditDialog(false)
        fetchUsers()
        fetchStats()
      } else {
        const result = await response.json()
        toast({
          title: "更新失败",
          description: result.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "更新失败",
        variant: "destructive"
      })
    } finally {
      setUpdating(false)
    }
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
            <Users className="h-6 w-6" />
            <h1 className="text-xl font-bold">用户管理</h1>
          </div>
          <Link href="/admin">
            <Button variant="outline">返回管理后台</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        {/* 统计面板 */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">用户总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">管理员</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.adminUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">今日新增</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.todayUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">本周新增</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.weekUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">总金币</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.totalCoins}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">活跃用户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-600">{stats.activeUsers}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 搜索 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索用户邮箱或名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={fetchUsers} variant="outline">
                刷新
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 用户列表 */}
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>暂无用户数据</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户名</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>金币</TableHead>
                      <TableHead>学习时长</TableHead>
                      <TableHead>连续天数</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead>注册时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.display_name || "未设置"}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-orange-600 font-semibold">
                            <Coins className="h-4 w-4" />
                            {user.coins}
                          </div>
                        </TableCell>
                        <TableCell>{Math.floor(user.total_study_time / 60)}分钟</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            {user.streak_days}天
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.is_admin ? (
                            <Badge variant="default" className="gap-1">
                              <Crown className="h-3 w-3" />
                              管理员
                            </Badge>
                          ) : (
                            <Badge variant="secondary">普通用户</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(user.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            编辑金币
                          </Button>
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

      {/* 编辑对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑用户金币</DialogTitle>
            <DialogDescription>
              修改 {editingUser?.display_name || editingUser?.email} 的金币数量
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>当前金币</Label>
              <div className="text-2xl font-bold text-orange-600">
                {editingUser?.coins}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coins">新金币数量</Label>
              <Input
                id="coins"
                type="number"
                value={editCoins}
                onChange={(e) => setEditCoins(e.target.value)}
                placeholder="输入新的金币数量"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleUpdateCoins}
              disabled={updating}
              className="flex-1"
            >
              {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              确认更新
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={updating}
            >
              取消
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
