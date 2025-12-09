# 🚀 Gift Shop 快速开始指南

## 📋 快速设置（5分钟）

### 1. 运行数据库迁移

在 Supabase SQL Editor 中执行：

```sql
-- 复制 supabase/migrations/20240126_create_gifts_table.sql 的内容
-- 粘贴并执行
```

### 2. 设置管理员权限

```sql
-- 将你的账号设置为管理员
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

### 3. 访问管理后台

```
http://localhost:3000/admin/gifts
```

### 4. 添加第一个商品

1. 点击"添加商品"
2. 填写表单
3. 上传图片（可选）
4. 点击"创建商品"

### 5. 查看商城

```
http://localhost:3000/shop
```

## 📁 创建的文件

```
✅ supabase/migrations/20240126_create_gifts_table.sql
✅ app/api/gifts/route.ts
✅ app/api/gifts/[id]/route.ts
✅ app/api/gifts/upload/route.ts
✅ app/admin/gifts/page.tsx
✅ app/shop/page.tsx (已更新)
```

## 🎯 核心功能

### 管理后台 (`/admin/gifts`)
- ✅ 添加商品
- ✅ 编辑商品
- ✅ 删除商品
- ✅ 上传图片
- ✅ 管理库存

### 商城页面 (`/shop`)
- ✅ 显示商品列表
- ✅ 支持图片显示
- ✅ 国际化（中英文）
- ✅ 分类筛选
- ✅ 兑换功能

## 🔑 API 端点

```
GET    /api/gifts              # 获取商品列表
POST   /api/gifts              # 创建商品（管理员）
GET    /api/gifts/[id]         # 获取单个商品
PUT    /api/gifts/[id]         # 更新商品（管理员）
DELETE /api/gifts/[id]         # 删除商品（管理员）
POST   /api/gifts/upload       # 上传图片（管理员）
DELETE /api/gifts/upload       # 删除图片（管理员）
```

## 💡 使用示例

### 添加商品

```typescript
const response = await fetch("/api/gifts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name_zh: "实体英语字典",
    name_en: "Oxford English Dictionary",
    description_zh: "牛津高阶英语词典第10版",
    description_en: "Oxford Advanced Learner's Dictionary 10th Edition",
    coins: 2000,
    category: "physical",
    stock: 50
  })
})
```

### 上传图片

```typescript
const formData = new FormData()
formData.append("file", file)

const response = await fetch("/api/gifts/upload", {
  method: "POST",
  body: formData
})

const { data } = await response.json()
// data.url - 图片的公共URL
```

## 🎨 商品分类

- **physical** - 实物商品（蓝色）
- **digital** - 虚拟商品（紫色）
- **privilege** - 特权服务（橙色）

## 📸 图片要求

- **格式**: JPG, PNG, WebP, GIF
- **大小**: 最大 5MB
- **推荐尺寸**: 600x400px

## 🔐 权限说明

### 管理员可以：
- ✅ 访问管理后台
- ✅ 创建/编辑/删除商品
- ✅ 上传/删除图片

### 普通用户可以：
- ✅ 查看商品列表
- ✅ 兑换商品

## 🐛 常见问题

### Q: 无法访问管理后台？
A: 确保你的账号设置了 `is_admin = true`

### Q: 图片上传失败？
A: 检查 Supabase Storage 中是否创建了 `gift-images` bucket

### Q: 商品不显示？
A: 确保商品的 `is_active = true`

## 📚 完整文档

查看 `GIFT_SHOP_BACKEND_SETUP.md` 了解详细信息。

---

**状态**: ✅ 已完成
**时间**: 2024年11月26日
