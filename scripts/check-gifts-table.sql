-- 检查 gifts 表结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'gifts'
ORDER BY ordinal_position;

-- 检查是否有问题数据
SELECT 
  id,
  name_zh,
  image_url,
  CASE 
    WHEN image_url = 'undefined' THEN '❌ 有问题'
    WHEN image_url IS NULL THEN '✅ NULL'
    WHEN image_url = '' THEN '⚠️ 空字符串'
    ELSE '✅ 正常'
  END as status
FROM public.gifts;
