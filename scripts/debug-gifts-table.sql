-- 检查 gifts 表的完整结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'gifts'
ORDER BY ordinal_position;

-- 检查现有数据
SELECT 
  id,
  name_zh,
  image_url,
  created_by,
  CASE 
    WHEN created_by IS NULL THEN '⚠️ created_by 是 NULL'
    WHEN created_by::text = 'undefined' THEN '❌ created_by 是字符串 undefined'
    ELSE '✅ created_by 正常'
  END as created_by_status,
  CASE 
    WHEN image_url IS NULL THEN '✅ image_url 是 NULL'
    WHEN image_url = 'undefined' THEN '❌ image_url 是字符串 undefined'
    WHEN image_url = '' THEN '⚠️ image_url 是空字符串'
    ELSE '✅ image_url 正常'
  END as image_url_status
FROM public.gifts
ORDER BY created_at DESC
LIMIT 5;
