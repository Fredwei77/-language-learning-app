-- 创建礼物商品表
CREATE TABLE IF NOT EXISTS gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT NOT NULL,
  description_en TEXT NOT NULL,
  coins INTEGER NOT NULL CHECK (coins > 0),
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('physical', 'digital', 'privilege')),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 创建索引
CREATE INDEX idx_gifts_category ON gifts(category);
CREATE INDEX idx_gifts_is_active ON gifts(is_active);
CREATE INDEX idx_gifts_created_at ON gifts(created_at DESC);

-- 启用 RLS
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看激活的商品
CREATE POLICY "Anyone can view active gifts"
  ON gifts FOR SELECT
  USING (is_active = true);

-- 管理员可以管理所有商品（需要在 profiles 表中添加 is_admin 字段）
CREATE POLICY "Admins can manage gifts"
  ON gifts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 更新 profiles 表，添加管理员字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gifts_updated_at
  BEFORE UPDATE ON gifts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建存储桶用于存储商品图片
INSERT INTO storage.buckets (id, name, public)
VALUES ('gift-images', 'gift-images', true)
ON CONFLICT (id) DO NOTHING;

-- 设置存储桶策略
CREATE POLICY "Anyone can view gift images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gift-images');

CREATE POLICY "Admins can upload gift images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gift-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update gift images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'gift-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete gift images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gift-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
