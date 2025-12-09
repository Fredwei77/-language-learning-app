-- 修复 gifts 表中的 'undefined' 图片 URL
-- 将字符串 'undefined' 替换为 NULL

UPDATE public.gifts
SET image_url = NULL
WHERE image_url = 'undefined' 
   OR image_url = '' 
   OR image_url = 'null';

-- 验证修复结果
SELECT 
  id,
  name_zh,
  image_url,
  CASE 
    WHEN image_url IS NULL THEN '✅ NULL (正常)'
    WHEN image_url = '' THEN '⚠️ 空字符串'
    WHEN image_url = 'undefined' THEN '❌ 仍有问题'
    ELSE '✅ 有图片'
  END as status
FROM public.gifts
ORDER BY created_at DESC;
