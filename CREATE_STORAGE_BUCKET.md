# 🗂️ 创建 Storage Bucket - 图片上传修复

## 🐛 问题

上传商品图片时显示：**"Bucket not found"**（存储桶未找到）

## 🎯 原因

Supabase Storage 中还没有创建 `gift-images` 存储桶。

## ✅ 解决方案

### 方法1: 在 Supabase Dashboard 中创建（推荐）⭐

#### 步骤1: 打开 Storage
1. 访问 Supabase Dashboard
2. 选择你的项目
3. 点击左侧菜单的 **Storage**

#### 步骤2: 创建新 Bucket
1. 点击 **"New bucket"** 按钮
2. 填写信息：
   - **Name**: `gift-images`
   - **Public bucket**: ✅ 勾选（允许公开访问）
   - **File size limit**: 5242880 (5MB)
   - **Allowed MIME types**: `image/*`

#### 步骤3: 保存
点击 **"Create bucket"** 按钮

#### 步骤4: 设置策略（可选）
如果需要更细粒度的控制，可以在 Policies 标签页设置访问策略。

---

### 方法2: 使用 SQL 创建

在 Supabase SQL Editor 中执行：

```sql
-- 创建 storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gift-images',
  'gift-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 设置公开访问策略
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gift-images');

-- 允许认证用户上传
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gift-images' 
  AND auth.role() = 'authenticated'
);

-- 允许用户删除自己上传的文件
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gift-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 🔍 验证 Bucket 是否创建成功

### 方法1: 在 Dashboard 中查看
Storage → Buckets → 应该看到 `gift-images`

### 方法2: 使用 SQL 查询
```sql
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets
WHERE id = 'gift-images';
```

预期结果：
```
id: gift-images
name: gift-images
public: true
file_size_limit: 5242880
```

---

## 🎨 Bucket 配置

### 推荐设置
- **Name**: `gift-images`
- **Public**: ✅ 是（允许公开访问图片）
- **File size limit**: 5MB (5242880 bytes)
- **Allowed MIME types**: 
  - image/jpeg
  - image/jpg
  - image/png
  - image/webp
  - image/gif

---

## 🔐 安全策略

### 公开读取
所有人都可以查看图片（用于商城展示）

### 认证上传
只有登录用户可以上传图片

### 管理员控制
在 API 层面，只有管理员可以通过 `/api/gifts/upload` 上传

---

## 🧪 测试上传

创建 bucket 后：

1. 访问管理后台：http://localhost:3000/admin/gifts
2. 点击"添加商品"
3. 点击"上传图片"
4. 选择一张图片
5. 应该成功上传并显示预览

---

## 🐛 常见问题

### Q: 创建 bucket 后仍然失败？
A: 
1. 刷新页面
2. 检查 bucket 名称是否为 `gift-images`
3. 确认 public 选项已勾选

### Q: 图片上传成功但无法显示？
A:
1. 检查 bucket 是否设置为 public
2. 检查图片 URL 是否正确
3. 查看浏览器控制台的错误信息

### Q: 如何删除 bucket？
A:
1. Storage → Buckets
2. 点击 bucket 右侧的 "..."
3. 选择 "Delete bucket"

---

## 📚 相关文档

- `GIFT_SHOP_BACKEND_SETUP.md` - 商品系统完整指南
- `supabase/migrations/20240126_create_gifts_table.sql` - 包含 bucket 创建的 SQL

---

## 🎉 完成

创建 bucket 后，你就可以：
- ✅ 上传商品图片
- ✅ 图片自动存储在 Supabase
- ✅ 获得公开访问 URL
- ✅ 在商城中展示图片

---

**立即在 Supabase Dashboard 中创建 `gift-images` bucket！** 🚀
