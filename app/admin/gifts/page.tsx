"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Edit, Trash2, Upload, X, Package, Zap, Award, ArrowLeft, Search, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import Image from "next/image"

interface Gift {
  id: string
  name_zh: string
  name_en: string
  description_zh: string
  description_en: string
  coins: number
  image_url: string | null
  category: "physical" | "digital" | "privilege"
  stock: number
  is_active: boolean
  created_at: string
}

export default function AdminGiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showLowStock, setShowLowStock] = useState(false)
  const [selectedGifts, setSelectedGifts] = useState<string[]>([])
  const [stats, setStats] = useState<any>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name_zh: "",
    name_en: "",
    description_zh: "",
    description_en: "",
    coins: "",
    image_url: "",
    category: "physical" as "physical" | "digital" | "privilege",
    stock: "",
    is_active: true,
  })

  useEffect(() => {
    checkAdmin()
    fetchGifts()
    fetchStats()
  }, [])

  useEffect(() => {
    fetchGifts()
  }, [searchQuery, showLowStock])

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
      setIsAdmin(data?.is_admin || false)
    }
    setLoading(false)
  }

  const fetchGifts = async () => {
    try {
      let url = "/api/gifts?category=all&showAll=true"
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`
      if (showLowStock) url += `&lowStock=true`
      
      const response = await fetch(url)
      const result = await response.json()
      if (result.data) {
        setGifts(result.data)
      } else {
        setGifts([])
      }
    } catch (error) {
      console.error("Error fetching gifts:", error)
      setGifts([])
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/gifts/stats")
      const result = await response.json()
      if (result.data) {
        setStats(result.data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/gifts/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.data) {
        setFormData((prev) => ({ ...prev, image_url: result.data.url }))
        setImagePreview(result.data.url)
        toast({ title: "图片上传成功" })
      } else {
        toast({ title: "上传失败", description: result.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "上传失败", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingGift ? `/api/gifts/${editingGift.id}` : "/api/gifts"
    const method = editingGift ? "PUT" : "POST"

    try {
      // 构建提交数据，确保数值类型正确
      const submitData: any = {
        name_zh: formData.name_zh,
        name_en: formData.name_en,
        description_zh: formData.description_zh,
        description_en: formData.description_en,
        coins: parseInt(formData.coins) || 0,
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        is_active: formData.is_active,
      }

      // 只在有有效图片 URL 时添加
      if (formData.image_url && formData.image_url.trim() !== "" && formData.image_url !== "undefined") {
        submitData.image_url = formData.image_url
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (response.ok) {
        toast({ title: editingGift ? "更新成功" : "创建成功" })
        setShowDialog(false)
        resetForm()
        fetchGifts()
      } else {
        toast({ title: "操作失败", description: result.error, variant: "destructive" })
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast({ title: "操作失败", variant: "destructive" })
    }
  }

  const handleEdit = (gift: Gift) => {
    setEditingGift(gift)
    setFormData({
      name_zh: gift.name_zh,
      name_en: gift.name_en,
      description_zh: gift.description_zh,
      description_en: gift.description_en,
      coins: gift.coins.toString(),
      image_url: gift.image_url || "",
      category: gift.category,
      stock: gift.stock.toString(),
      is_active: gift.is_active,
    })
    setImagePreview(gift.image_url)
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个商品吗？")) return

    try {
      const response = await fetch(`/api/gifts/${id}`, { method: "DELETE" })

      if (response.ok) {
        toast({ title: "删除成功" })
        fetchGifts()
      } else {
        toast({ title: "删除失败", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "删除失败", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({
      name_zh: "",
      name_en: "",
      description_zh: "",
      description_en: "",
      coins: "",
      image_url: "",
      category: "physical",
      stock: "",
      is_active: true,
    })
    setEditingGift(null)
    setImagePreview(null)
  }

  const handleBatchAction = async (action: "activate" | "deactivate") => {
    if (selectedGifts.length === 0) {
      toast({ title: "请先选择商品", variant: "destructive" })
      return
    }

    try {
      const response = await fetch("/api/gifts/batch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedGifts, action })
      })

      const result = await response.json()

      if (response.ok) {
        toast({ title: result.message })
        setSelectedGifts([])
        fetchGifts()
        fetchStats()
      } else {
        toast({ title: "操作失败", description: result.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "操作失败", variant: "destructive" })
    }
  }

  const toggleGiftSelection = (id: string) => {
    setSelectedGifts(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    )
  }

  const toggleAllSelection = () => {
    if (selectedGifts.length === gifts.length) {
      setSelectedGifts([])
    } else {
      setSelectedGifts(gifts.map(g => g.id))
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "physical":
        return <Package className="h-4 w-4" />
      case "digital":
        return <Zap className="h-4 w-4" />
      case "privilege":
        return <Award className="h-4 w-4" />
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
          <h1 className="text-2xl font-bold">商品管理</h1>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              添加商品
            </Button>
            <Button variant="outline" asChild>
              <Link href="/shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回商城
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {/* 统计面板 */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">商品总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalGifts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">激活商品</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeGifts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">低库存预警</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.lowStockGifts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">已选择</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{selectedGifts.length}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索商品名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={showLowStock ? "default" : "outline"}
                  onClick={() => setShowLowStock(!showLowStock)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  低库存
                </Button>
                {selectedGifts.length > 0 && (
                  <>
                    <Button variant="outline" onClick={() => handleBatchAction("activate")}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      批量上架
                    </Button>
                    <Button variant="outline" onClick={() => handleBatchAction("deactivate")}>
                      <XCircle className="h-4 w-4 mr-2" />
                      批量下架
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 批量选择 */}
        {gifts.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <Checkbox
              checked={selectedGifts.length === gifts.length}
              onCheckedChange={toggleAllSelection}
            />
            <span className="text-sm text-muted-foreground">
              全选 ({selectedGifts.length}/{gifts.length})
            </span>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gifts.map((gift) => (
            <Card key={gift.id} className={selectedGifts.includes(gift.id) ? "ring-2 ring-primary" : ""}>
              <div
                className={`relative h-48 flex items-center justify-center ${
                  gift.category === "physical"
                    ? "bg-gradient-to-br from-blue-400 to-blue-600"
                    : gift.category === "digital"
                    ? "bg-gradient-to-br from-purple-400 to-purple-600"
                    : "bg-gradient-to-br from-orange-400 to-orange-600"
                }`}
              >
                {gift.image_url ? (
                  <Image src={gift.image_url} alt={gift.name_zh} fill className="object-cover" />
                ) : (
                  <div className="text-white">{getCategoryIcon(gift.category)}</div>
                )}
                <div className="absolute top-3 left-3">
                  <Checkbox
                    checked={selectedGifts.includes(gift.id)}
                    onCheckedChange={() => toggleGiftSelection(gift.id)}
                    className="bg-white"
                  />
                </div>
                <Badge className="absolute top-3 right-3" variant={gift.is_active ? "default" : "secondary"}>
                  {gift.is_active ? "激活" : "停用"}
                </Badge>
                {gift.stock <= 10 && (
                  <Badge className="absolute bottom-3 right-3" variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    低库存
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{gift.name_zh}</span>
                  {getCategoryIcon(gift.category)}
                </CardTitle>
                <CardDescription>{gift.name_en}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{gift.description_zh}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">{gift.coins} 金币</span>
                  <span className={`text-sm font-medium ${gift.stock <= 10 ? "text-red-600" : "text-muted-foreground"}`}>
                    库存: {gift.stock}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(gift)}>
                    <Edit className="h-4 w-4 mr-1" />
                    编辑
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(gift.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    删除
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGift ? "编辑商品" : "添加商品"}</DialogTitle>
            <DialogDescription>填写商品信息，带 * 的为必填项</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 图片上传 */}
            <div className="space-y-2">
              <Label>商品图片</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => {
                        setImagePreview(null)
                        setFormData((prev) => ({ ...prev, image_url: "" }))
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label htmlFor="image-upload">
                    <Button type="button" variant="outline" disabled={uploading} asChild>
                      <span>
                        {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        {uploading ? "上传中..." : "上传图片"}
                      </span>
                    </Button>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">支持 JPG, PNG, WebP, GIF (最大 5MB)</p>
                </div>
              </div>
            </div>

            {/* 中文名称 */}
            <div className="space-y-2">
              <Label htmlFor="name_zh">中文名称 *</Label>
              <Input
                id="name_zh"
                value={formData.name_zh}
                onChange={(e) => setFormData({ ...formData, name_zh: e.target.value })}
                required
              />
            </div>

            {/* 英文名称 */}
            <div className="space-y-2">
              <Label htmlFor="name_en">英文名称 *</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                required
              />
            </div>

            {/* 中文描述 */}
            <div className="space-y-2">
              <Label htmlFor="description_zh">中文描述 *</Label>
              <Textarea
                id="description_zh"
                value={formData.description_zh}
                onChange={(e) => setFormData({ ...formData, description_zh: e.target.value })}
                required
                rows={3}
              />
            </div>

            {/* 英文描述 */}
            <div className="space-y-2">
              <Label htmlFor="description_en">英文描述 *</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 金币价格 */}
              <div className="space-y-2">
                <Label htmlFor="coins">金币价格 *</Label>
                <Input
                  id="coins"
                  type="number"
                  min="1"
                  value={formData.coins}
                  onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                  required
                />
              </div>

              {/* 库存 */}
              <div className="space-y-2">
                <Label htmlFor="stock">库存 *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* 分类 */}
            <div className="space-y-2">
              <Label htmlFor="category">商品分类 *</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">实物商品</SelectItem>
                  <SelectItem value="digital">虚拟商品</SelectItem>
                  <SelectItem value="privilege">特权服务</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 状态 */}
            <div className="space-y-2">
              <Label htmlFor="is_active">商品状态</Label>
              <Select
                value={formData.is_active ? "true" : "false"}
                onValueChange={(value) => setFormData({ ...formData, is_active: value === "true" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">激活</SelectItem>
                  <SelectItem value="false">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingGift ? "更新商品" : "创建商品"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDialog(false)
                  resetForm()
                }}
              >
                取消
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
