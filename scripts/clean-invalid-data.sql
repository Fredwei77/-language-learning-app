-- 清理 gifts 表中的无效数据

-- 1. 清理 image_url 字段
UPDATE public.gifts
SET image_url = NULL
WHERE image_url = 'undefined' 
   OR image_url = 'null'
   OR image_url = ''
   OR image_url IS NULL;

-- 2. 清理 created_by 字段  
UPDATE public.gifts
SET created_by = NULL
WHERE created_by IS NULL
   OR created_by::text = 'undefined'
   OR created_by::text = 'null';

-- 3. 验证清理结果
SELECT 
  id,
  name_zh,
  image_url,
  created_by,
  CASE 
    WHEN image_url IS NULL THEN '✅ image_url 正常'
    ELSE '✅ image_url 有值: ' || image_url
  END as image_status,
  CASE 
    WHEN created_by IS NULL THEN '✅ created_by 正常'
    ELSE '✅ created_by 有值'
  END as created_by_status
FROM public.gifts
ORDER BY created_at DESC;
