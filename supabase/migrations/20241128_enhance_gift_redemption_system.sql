-- 商品订单系统增强迁移脚本
-- 创建日期: 2024-11-28
-- 说明: 为商品和订单系统添加索引和优化查询性能

-- ============================================
-- 0. 检查并创建必要的表
-- ============================================

-- 创建 gifts 表（如果不存在）
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
-- 1. 为gifts表添加索引
-- ============================================

-- 为商品名称添加索引，优化搜索性能
CREATE INDEX IF NOT EXISTS idx_gifts_name_zh ON gifts USING gin(to_tsvector('simple', name_zh));
CREATE INDEX IF NOT EXISTS idx_gifts_name_en ON gifts USING gin(to_tsvector('simple', name_en));

-- 为商品状态添加索引，优化筛选
CREATE INDEX IF NOT EXISTS idx_gifts_is_active ON gifts(is_active);

-- 为商品分类添加索引
CREATE INDEX IF NOT EXISTS idx_gifts_category ON gifts(category);

-- 为库存添加索引，优化低库存查询
CREATE INDEX IF NOT EXISTS idx_gifts_stock ON gifts(stock);

-- 为创建时间添加索引
CREATE INDEX IF NOT EXISTS idx_gifts_created_at ON gifts(created_at DESC);

-- ============================================
-- 2. 为gift_redemptions表添加索引
-- ============================================

-- 为用户ID添加索引
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON gift_redemptions(user_id);

-- 为商品ID添加索引
CREATE INDEX IF NOT EXISTS idx_redemptions_gift_id ON gift_redemptions(gift_id);

-- 为订单状态添加索引
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON gift_redemptions(status);

-- 为创建时间添加索引
CREATE INDEX IF NOT EXISTS idx_redemptions_created_at ON gift_redemptions(created_at DESC);

-- 为商品名称添加索引，优化搜索
CREATE INDEX IF NOT EXISTS idx_redemptions_gift_name ON gift_redemptions USING gin(to_tsvector('simple', gift_name));

-- 复合索引：用户ID + 状态
CREATE INDEX IF NOT EXISTS idx_redemptions_user_status ON gift_redemptions(user_id, status);

-- 复合索引：状态 + 创建时间
CREATE INDEX IF NOT EXISTS idx_redemptions_status_created ON gift_redemptions(status, created_at DESC);

-- ============================================
-- 3. 添加统计视图（可选）
-- ============================================

-- 商品统计视图（只在gifts表有数据时创建）
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gifts') THEN
        CREATE OR REPLACE VIEW gift_statistics AS
        SELECT 
            COUNT(*) as total_gifts,
            COUNT(*) FILTER (WHERE is_active = true) as active_gifts,
            COUNT(*) FILTER (WHERE stock <= 10 AND is_active = true) as low_stock_gifts,
            COUNT(*) FILTER (WHERE category = 'physical') as physical_gifts,
            COUNT(*) FILTER (WHERE category = 'digital') as digital_gifts,
            COUNT(*) FILTER (WHERE category = 'privilege') as privilege_gifts
        FROM gifts;
    END IF;
END $$;

-- 订单统计视图（只在gift_redemptions表有数据时创建）
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gift_redemptions') THEN
        CREATE OR REPLACE VIEW redemption_statistics AS
        SELECT 
            COUNT(*) as total_orders,
            COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
            COUNT(*) FILTER (WHERE status = 'processing') as processing_orders,
            COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
            COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders,
            COALESCE(SUM(coins_spent) FILTER (WHERE status != 'cancelled'), 0) as total_coins_spent,
            COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_orders,
            COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as week_orders
        FROM gift_redemptions;
    END IF;
END $$;

-- ============================================
-- 4. 添加触发器：自动更新库存
-- ============================================

-- 创建函数：订单完成时减少库存
CREATE OR REPLACE FUNCTION update_gift_stock_on_redemption()
RETURNS TRIGGER AS $$
BEGIN
    -- 当订单状态从非completed变为completed时，减少库存
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE gifts 
        SET stock = GREATEST(stock - 1, 0)
        WHERE id = NEW.gift_id;
    END IF;
    
    -- 当订单从completed变为cancelled时，增加库存
    IF NEW.status = 'cancelled' AND OLD.status = 'completed' THEN
        UPDATE gifts 
        SET stock = stock + 1
        WHERE id = NEW.gift_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器（只在gift_redemptions表存在时）
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gift_redemptions') THEN
        DROP TRIGGER IF EXISTS trigger_update_gift_stock ON gift_redemptions;
        CREATE TRIGGER trigger_update_gift_stock
            AFTER UPDATE OF status ON gift_redemptions
            FOR EACH ROW
            EXECUTE FUNCTION update_gift_stock_on_redemption();
    END IF;
END $$;

-- ============================================
-- 5. 添加注释
-- ============================================

COMMENT ON INDEX idx_gifts_name_zh IS '商品中文名称全文搜索索引';
COMMENT ON INDEX idx_gifts_name_en IS '商品英文名称全文搜索索引';
COMMENT ON INDEX idx_gifts_is_active IS '商品激活状态索引';
COMMENT ON INDEX idx_gifts_category IS '商品分类索引';
COMMENT ON INDEX idx_gifts_stock IS '商品库存索引';
COMMENT ON INDEX idx_redemptions_user_id IS '订单用户ID索引';
COMMENT ON INDEX idx_redemptions_status IS '订单状态索引';
COMMENT ON INDEX idx_redemptions_created_at IS '订单创建时间索引';

COMMENT ON VIEW gift_statistics IS '商品统计视图';
COMMENT ON VIEW redemption_statistics IS '订单统计视图';

-- ============================================
-- 6. 性能优化建议
-- ============================================

-- 分析表以更新统计信息
ANALYZE gifts;
ANALYZE gift_redemptions;

-- ============================================
-- 7. 验证脚本
-- ============================================

-- 验证索引是否创建成功
DO $$
DECLARE
    index_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes
    WHERE tablename IN ('gifts', 'gift_redemptions')
    AND indexname LIKE 'idx_%';
    
    RAISE NOTICE '已创建 % 个索引', index_count;
END $$;

-- 验证视图是否创建成功
DO $$
DECLARE
    view_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_count
    FROM pg_views
    WHERE viewname IN ('gift_statistics', 'redemption_statistics');
    
    RAISE NOTICE '已创建 % 个视图', view_count;
END $$;

-- ============================================
-- 完成
-- ============================================

-- 输出完成信息
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '商品订单系统增强迁移完成！';
    RAISE NOTICE '========================================';
    RAISE NOTICE '已添加功能：';
    RAISE NOTICE '1. ✅ 商品和订单表索引优化';
    RAISE NOTICE '2. ✅ 统计视图创建';
    RAISE NOTICE '3. ✅ 自动库存更新触发器';
    RAISE NOTICE '4. ✅ 性能优化';
    RAISE NOTICE '========================================';
END $$;
