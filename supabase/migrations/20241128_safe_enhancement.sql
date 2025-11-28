-- 安全的商品订单系统增强迁移脚本
-- 创建日期: 2024-11-28
-- 说明: 安全地为商品和订单系统添加索引和优化

-- ============================================
-- 1. 确保 gifts 表存在
-- ============================================

CREATE TABLE IF NOT EXISTS gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_zh TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_zh TEXT,
    description_en TEXT,
    coins INTEGER NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('physical', 'digital', 'privilege')),
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. 为 gifts 表添加索引
-- ============================================

-- 商品名称搜索索引
CREATE INDEX IF NOT EXISTS idx_gifts_name_zh ON gifts USING gin(to_tsvector('simple', name_zh));
CREATE INDEX IF NOT EXISTS idx_gifts_name_en ON gifts USING gin(to_tsvector('simple', name_en));

-- 商品状态索引
CREATE INDEX IF NOT EXISTS idx_gifts_is_active ON gifts(is_active);

-- 商品分类索引
CREATE INDEX IF NOT EXISTS idx_gifts_category ON gifts(category);

-- 库存索引
CREATE INDEX IF NOT EXISTS idx_gifts_stock ON gifts(stock);

-- 创建时间索引
CREATE INDEX IF NOT EXISTS idx_gifts_created_at ON gifts(created_at DESC);

-- ============================================
-- 3. 为 gift_redemptions 表添加索引
-- ============================================

-- 只在表存在时添加索引
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gift_redemptions') THEN
        -- 用户ID索引
        CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON gift_redemptions(user_id);
        
        -- 商品ID索引
        CREATE INDEX IF NOT EXISTS idx_redemptions_gift_id ON gift_redemptions(gift_id);
        
        -- 订单状态索引
        CREATE INDEX IF NOT EXISTS idx_redemptions_status ON gift_redemptions(status);
        
        -- 创建时间索引
        CREATE INDEX IF NOT EXISTS idx_redemptions_created_at ON gift_redemptions(created_at DESC);
        
        -- 商品名称搜索索引
        CREATE INDEX IF NOT EXISTS idx_redemptions_gift_name ON gift_redemptions USING gin(to_tsvector('simple', gift_name));
        
        -- 复合索引：用户ID + 状态
        CREATE INDEX IF NOT EXISTS idx_redemptions_user_status ON gift_redemptions(user_id, status);
        
        -- 复合索引：状态 + 创建时间
        CREATE INDEX IF NOT EXISTS idx_redemptions_status_created ON gift_redemptions(status, created_at DESC);
        
        RAISE NOTICE '✅ gift_redemptions 表索引创建成功';
    ELSE
        RAISE NOTICE '⚠️  gift_redemptions 表不存在，跳过索引创建';
    END IF;
END $$;

-- ============================================
-- 4. 添加注释
-- ============================================

COMMENT ON TABLE gifts IS '商品表';
COMMENT ON COLUMN gifts.name_zh IS '商品中文名称';
COMMENT ON COLUMN gifts.name_en IS '商品英文名称';
COMMENT ON COLUMN gifts.coins IS '金币价格';
COMMENT ON COLUMN gifts.stock IS '库存数量';
COMMENT ON COLUMN gifts.is_active IS '是否激活';

-- ============================================
-- 5. 性能优化
-- ============================================

-- 分析表以更新统计信息
ANALYZE gifts;

DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gift_redemptions') THEN
        ANALYZE gift_redemptions;
    END IF;
END $$;

-- ============================================
-- 6. 验证脚本
-- ============================================

DO $$
DECLARE
    gifts_index_count INTEGER;
    redemptions_index_count INTEGER;
BEGIN
    -- 统计 gifts 表的索引数量
    SELECT COUNT(*) INTO gifts_index_count
    FROM pg_indexes
    WHERE tablename = 'gifts'
    AND indexname LIKE 'idx_%';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ gifts 表已创建 % 个索引', gifts_index_count;
    
    -- 统计 gift_redemptions 表的索引数量（如果存在）
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gift_redemptions') THEN
        SELECT COUNT(*) INTO redemptions_index_count
        FROM pg_indexes
        WHERE tablename = 'gift_redemptions'
        AND indexname LIKE 'idx_%';
        
        RAISE NOTICE '✅ gift_redemptions 表已创建 % 个索引', redemptions_index_count;
    END IF;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '🎉 迁移脚本执行成功！';
    RAISE NOTICE '========================================';
END $$;
