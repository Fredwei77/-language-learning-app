-- ============================================
-- 修复 created_by 字段
-- 允许 NULL 值，避免 UUID 错误
-- ============================================

-- 步骤1: 修改 created_by 字段为可空
-- ============================================
ALTER TABLE public.gifts 
ALTER COLUMN created_by DROP NOT NULL;

-- 步骤2: 清理无效的 created_by 数据
-- ============================================
UPDATE public.gifts
SET created_by = NULL
WHERE created_by::text = 'undefined' 
   OR created_by IS NULL;

-- 步骤3: 验证修改
-- ============================================
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'gifts'
  AND column_name = 'created_by';

-- 步骤4: 检查数据
-- ============================================
SELECT 
  id,
  name_zh,
  created_by,
  CASE 
    WHEN created_by IS NULL THEN '✅ NULL (正常)'
    ELSE '✅ 有值'
  END as status
FROM public.gifts
ORDER BY created_at DESC;

-- ============================================
-- 完成！现在 created_by 可以为 NULL
-- ============================================
