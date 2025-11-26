# 最终修复方案

## 执行步骤

### 1. 在 Supabase SQL Editor 中执行

```sql
-- 删除并重建 gifts 表
DROP TABLE IF EXISTS public.gifts CASCADE;

CREATE TABLE public.gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT NOT NULL,
  description_en TEXT NOT NULL,
  coins INTEGER NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 禁用 RLS
ALTER TABLE public.gifts DISABLE ROW LEVEL SECURITY;

-- 插入测试数据
INSERT INTO public.gifts (name_zh, name_en, description_zh, description_en, coins, category, stock)
VALUES ('测试商品', 'Test', '测试', 'Test', 100, 'digital', 10);
```

### 2. 重启开发服务器

```bash
npm run dev
```

### 3. 测试

访问 http://localhost:3000/admin/gifts 并尝试编辑商品。

## 如果还是失败

问题在于 Supabase 环境配置。请检查 `.env.local` 文件中的：
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

确保这两个值正确无误。
