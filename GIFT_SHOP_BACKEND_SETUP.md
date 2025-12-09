# 🎁 Gift Shop 后端和数据存储系统

## 📋 系统概述

已成功创建完整的商品管理系统，包括：
- 数据库表结构
- API 接口
- 图片上传功能
- 管理后台页面
- 前端商城集成

## 🗄️ 数据库设计

### 1. Gifts 表

```sql
CREATE TABLE gifts (
  id UUID PRIMARY KEY,
  name_zh TEXT NOT NULL,           -- 中文名称
  name_en TEXT NOT NULL,           -- 英文名称
  description_zh TEXT NOT NULL,    -- 中文描述
  description_en TEXT NOT NULL,    -- 英文描述
  coins INTEGER NOT NULL,          -- 金币价格
  image_url TEXT,                  -- 图片URL
  category TEXT NOT NULL,          -- 分类: physical/digital/privilege
  stock INTEGER NOT NULL,          -- 库存
  is_active BOOLEAN DEFAULT true,  -- 是否激活
  created_at TIMESTAMPTZ,          -- 创建时间
  updated_at TIMESTAMPTZ,          -- 更新时间
  created_by UUID                  -- 创建者
);
```

### 2. Profiles 表更新

```sql
ALTER TABLE profiles 
ADD COLUMN is_admin BOOLEAN DEFAULT false;
```

### 3. Storage Bucket

- **Bucket名称**: `gift-images`
- **公开访问**: 是
- **用途**: 存储商品图片

## 🔌 API 接口

### 1. GET /api/gifts
获取商品列表

**Query Parameters:**
- `category` (optional): `all` | `physical` | `digital` | `privilege`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name_zh": "实体英语字典",
      "name_en": "Oxford English Dictionary",
      "description_zh": "牛津高阶英语词典第10版",
      "description_en": "Oxford Advanced Learner's Dictionary 10th Edition",
      "coins": 2000,
      "image_url": "https://...",
      "category": "physical",
      "stock": 50,
      "is_active": true,
      "created_at": "2024-01-26T..."
    }
  ]
}
```

### 2. POST /api/gifts
创建新商品（仅管理员）

**Request Body:**
```json
{
  "name_zh": "商品中文名",
  "name_en": "Product Name",
  "description_zh": "中文描述",
  "description_en": "English Description",
  "coins": 1000,
  "image_url": "https://...",
  "category": "physical",
  "stock": 100
}
```

**Response:**
```json
{
  "data": { /* 创建的商品对象 */ }
}
```

### 3. GET /api/gifts/[id]
获取单个商品

**Response:**
```json
{
  "data": { /* 商品对象 */ }
}
```

### 4. PUT /api/gifts/[id]
更新商品（仅管理员）

**Request Body:**
```json
{
  "name_zh": "更新的名称",
  "coins": 1500,
  "stock": 80,
  "is_active": false
}
```

### 5. DELETE /api/gifts/[id]
删除商品（仅管理员）

**Response:**
```json
{
  "success": true
}
```

### 6. POST /api/gifts/upload
上传商品图片（仅管理员）

**Request:**
- Content-Type: `multipart/form-data`
- Field: `file`

**Validation:**
- 文件类型: JPG, PNG, WebP, GIF
- 最大大小: 5MB

**Response:**
```json
{
  "data": {
    "path": "1234567890-abc123.jpg",
    "url": "https://your-project.supabase.co/storage/v1/object/public/gift-images/..."
  }
}
```

### 7. DELETE /api/gifts/upload
删除图片（仅管理员）

**Query Parameters:**
- `path`: 图片路径

## 🎨 管理后台

### 访问地址
```
/admin/gifts
```

### 功能特性

#### 1. 商品列表
- ✅ 显示所有商品
- ✅ 卡片式布局
- ✅ 显示图片/图标
- ✅ 显示状态（激活/停用）
- ✅ 显示分类、价格、库存

#### 2. 添加商品
- ✅ 图片上传（拖拽或点击）
- ✅ 中英文名称
- ✅ 中英文描述
- ✅ 金币价格
- ✅ 库存数量
- ✅ 商品分类
- ✅ 激活状态

#### 3. 编辑商品
- ✅ 修改所有字段
- ✅ 更换图片
- ✅ 更新库存
- ✅ 切换状态

#### 4. 删除商品
- ✅ 确认对话框
- ✅ 级联删除

### 权限控制

只有 `is_admin = true` 的用户可以：
- 访问管理后台
- 创建/编辑/删除商品
- 上传/删除图片

## 🖼️ 图片管理

### 上传流程

1. **选择文件**
   - 支持格式: JPG, PNG, WebP, GIF
   - 最大大小: 5MB

2. **自动处理**
   - 生成唯一文件名
   - 上传到 Supabase Storage
   - 返回公共 URL

3. **显示预览**
   - 实时预览上传的图片
   - 可删除重新上传

### 存储结构

```
gift-images/
├── 1706234567890-abc123.jpg
├── 1706234567891-def456.png
└── 1706234567892-ghi789.webp
```

### 访问URL

```
https://your-project.supabase.co/storage/v1/object/public/gift-images/filename.jpg
```

## 🛒 商城集成

### 更新内容

1. **从数据库加载商品**
   ```typescript
   const response = await fetch("/api/gifts?category=all")
   const result = await response.json()
   setGifts(result.data)
   ```

2. **支持图片显示**
   ```typescript
   {gift.image_url ? (
     <img src={gift.image_url} alt={giftName} />
   ) : (
     <div className="icon-placeholder">...</div>
   )}
   ```

3. **国际化支持**
   ```typescript
   const giftName = locale === "zh" ? gift.name_zh : gift.name_en
   const giftDescription = locale === "zh" ? gift.description_zh : gift.description_en
   ```

## 🔐 安全性

### Row Level Security (RLS)

#### 查看权限
```sql
-- 所有人可以查看激活的商品
CREATE POLICY "Anyone can view active gifts"
  ON gifts FOR SELECT
  USING (is_active = true);
```

#### 管理权限
```sql
-- 只有管理员可以管理商品
CREATE POLICY "Admins can manage gifts"
  ON gifts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
```

### Storage 权限

```sql
-- 所有人可以查看图片
CREATE POLICY "Anyone can view gift images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gift-images');

-- 只有管理员可以上传/删除图片
CREATE POLICY "Admins can upload gift images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gift-images' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
```

## 📁 文件结构

```
project/
├── supabase/
│   └── migrations/
│       └── 20240126_create_gifts_table.sql
├── app/
│   ├── api/
│   │   └── gifts/
│   │       ├── route.ts              # 商品列表/创建
│   │       ├── [id]/
│   │       │   └── route.ts          # 单个商品操作
│   │       └── upload/
│   │           └── route.ts          # 图片上传
│   ├── admin/
│   │   └── gifts/
│   │       └── page.tsx              # 管理后台
│   └── shop/
│       └── page.tsx                  # 商城页面（已更新）
└── lib/
    └── coins-system.ts               # 原有系统（保留兼容）
```

## 🚀 部署步骤

### 1. 运行数据库迁移

```bash
# 使用 Supabase CLI
supabase db push

# 或者在 Supabase Dashboard 中执行 SQL
```

### 2. 设置管理员

```sql
-- 在 Supabase SQL Editor 中执行
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-admin@email.com';
```

### 3. 创建 Storage Bucket

在 Supabase Dashboard:
1. 进入 Storage
2. 创建新 bucket: `gift-images`
3. 设置为 Public
4. 应用 RLS 策略

### 4. 测试功能

1. 访问 `/admin/gifts`
2. 添加测试商品
3. 上传图片
4. 访问 `/shop` 查看效果

## 💡 使用指南

### 管理员操作

#### 添加商品

1. 访问 `/admin/gifts`
2. 点击"添加商品"
3. 填写表单：
   - 上传图片（可选）
   - 输入中英文名称
   - 输入中英文描述
   - 设置金币价格
   - 设置库存数量
   - 选择分类
   - 选择状态
4. 点击"创建商品"

#### 编辑商品

1. 在商品卡片上点击"编辑"
2. 修改需要更新的字段
3. 点击"更新商品"

#### 删除商品

1. 在商品卡片上点击"删除"
2. 确认删除操作

### 用户操作

1. 访问 `/shop`
2. 浏览商品
3. 点击"立即兑换"
4. 确认兑换

## 🎯 功能特性

### ✅ 已实现

- [x] 数据库表结构
- [x] API 接口（CRUD）
- [x] 图片上传功能
- [x] 管理后台页面
- [x] 权限控制（RLS）
- [x] 国际化支持
- [x] 图片预览
- [x] 表单验证
- [x] 错误处理
- [x] 响应式设计

### 🔄 可扩展功能

- [ ] 批量导入商品
- [ ] 商品分类管理
- [ ] 销售统计
- [ ] 库存预警
- [ ] 图片裁剪/压缩
- [ ] 商品搜索
- [ ] 商品排序
- [ ] 商品标签

## 🐛 故障排除

### 问题1: 无法访问管理后台

**原因**: 用户不是管理员

**解决**:
```sql
UPDATE profiles SET is_admin = true WHERE id = 'user-uuid';
```

### 问题2: 图片上传失败

**原因**: Storage bucket 未创建或权限不足

**解决**:
1. 检查 bucket 是否存在
2. 检查 RLS 策略
3. 检查用户是否为管理员

### 问题3: 商品不显示

**原因**: `is_active = false`

**解决**:
在管理后台将商品状态改为"激活"

## 📊 数据示例

### 创建示例商品

```sql
INSERT INTO gifts (
  name_zh, name_en, 
  description_zh, description_en,
  coins, category, stock, is_active
) VALUES
  ('实体英语字典', 'Oxford English Dictionary',
   '牛津高阶英语词典第10版', 'Oxford Advanced Learner''s Dictionary 10th Edition',
   2000, 'physical', 50, true),
  ('AI学习会员', 'AI Learning Membership',
   '30天无限次AI对话学习', '30-day unlimited AI conversation learning',
   800, 'digital', 999, true),
  ('专属学习徽章', 'Exclusive Learning Badge',
   '展示在个人资料的成就徽章', 'Achievement badge displayed on profile',
   200, 'digital', 999, true);
```

## 🎉 总结

成功创建了完整的商品管理系统，包括：

1. **数据库层** - 完整的表结构和权限控制
2. **API层** - RESTful API 接口
3. **存储层** - Supabase Storage 图片管理
4. **管理层** - 功能完整的管理后台
5. **展示层** - 集成到商城页面

系统支持：
- ✅ 商品CRUD操作
- ✅ 图片上传管理
- ✅ 权限控制
- ✅ 国际化
- ✅ 响应式设计

---

**创建时间**: 2024年11月26日
**状态**: ✅ 已完成
**文档版本**: 1.0
