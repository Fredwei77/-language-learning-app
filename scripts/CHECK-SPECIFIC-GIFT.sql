-- 检查具体商品的数据
SELECT 
  id,
  name_zh,
  name_en,
  coins,
  stock,
  image_url,
  category,
  is_active,
  created_at,
  updated_at,
  -- 检查每个字段的类型
  pg_typeof(id) as id_type,
  pg_typeof(image_url) as image_url_type,
  -- 检查是否有隐藏字符
  length(image_url) as image_url_length,
  image_url IS NULL as image_url_is_null
FROM public.gifts
WHERE id = 'effba13c-1364-4103-96ad-f41653e07245'::uuid;

-- 如果上面查询失败，尝试查看所有商品
SELECT * FROM public.gifts LIMIT 5;
