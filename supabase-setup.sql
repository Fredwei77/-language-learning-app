-- ============================================
-- Supabase 数据库表创建脚本
-- 在 Supabase Dashboard > SQL Editor 中执行此脚本
-- ============================================

-- 1. 确保 profiles 表存在并有必要的字段
-- 如果表已存在，只添加缺失的列
DO $$ 
BEGIN
    -- 检查 profiles 表是否存在
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        CREATE TABLE profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT,
            display_name TEXT,
            avatar_url TEXT,
            coins INTEGER DEFAULT 0,
            total_study_time INTEGER DEFAULT 0,
            streak_days INTEGER DEFAULT 0,
            last_check_in TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- 添加缺失的列（如果不存在）
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'coins') THEN
            ALTER TABLE profiles ADD COLUMN coins INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_study_time') THEN
            ALTER TABLE profiles ADD COLUMN total_study_time INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'streak_days') THEN
            ALTER TABLE profiles ADD COLUMN streak_days INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_check_in') THEN
            ALTER TABLE profiles ADD COLUMN last_check_in TIMESTAMP WITH TIME ZONE;
        END IF;
    END IF;
END $$;

-- 2. 创建 coin_transactions 表（金币交易记录）
CREATE TABLE IF NOT EXISTS coin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earn', 'spend', 'purchase')),
    description TEXT,
    reference_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_created_at ON coin_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_type ON coin_transactions(type);

-- 3. 创建 gift_redemptions 表（礼物兑换记录）
CREATE TABLE IF NOT EXISTS gift_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    gift_id TEXT NOT NULL,
    gift_name TEXT NOT NULL,
    coins_spent INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_gift_redemptions_user_id ON gift_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_gift_redemptions_status ON gift_redemptions(status);
CREATE INDEX IF NOT EXISTS idx_gift_redemptions_created_at ON gift_redemptions(created_at);

-- 4. 确保 learning_progress 表存在
CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_type TEXT NOT NULL,
    lesson_id TEXT,
    progress INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_module_type ON learning_progress(module_type);
CREATE INDEX IF NOT EXISTS idx_learning_progress_created_at ON learning_progress(created_at);

-- 5. 确保 check_ins 表存在
CREATE TABLE IF NOT EXISTS check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    coins_earned INTEGER DEFAULT 10,
    streak_bonus INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, check_in_date)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON check_ins(check_in_date);

-- ============================================
-- Row Level Security (RLS) 策略
-- ============================================

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- profiles 表策略
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- coin_transactions 表策略
DROP POLICY IF EXISTS "Users can view own transactions" ON coin_transactions;
CREATE POLICY "Users can view own transactions" ON coin_transactions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own transactions" ON coin_transactions;
CREATE POLICY "Users can insert own transactions" ON coin_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- gift_redemptions 表策略
DROP POLICY IF EXISTS "Users can view own redemptions" ON gift_redemptions;
CREATE POLICY "Users can view own redemptions" ON gift_redemptions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own redemptions" ON gift_redemptions;
CREATE POLICY "Users can insert own redemptions" ON gift_redemptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- learning_progress 表策略
DROP POLICY IF EXISTS "Users can view own progress" ON learning_progress;
CREATE POLICY "Users can view own progress" ON learning_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON learning_progress;
CREATE POLICY "Users can insert own progress" ON learning_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON learning_progress;
CREATE POLICY "Users can update own progress" ON learning_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- check_ins 表策略
DROP POLICY IF EXISTS "Users can view own check-ins" ON check_ins;
CREATE POLICY "Users can view own check-ins" ON check_ins
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own check-ins" ON check_ins;
CREATE POLICY "Users can insert own check-ins" ON check_ins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 触发器：自动更新 updated_at 字段
-- ============================================

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 profiles 表添加触发器
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为 gift_redemptions 表添加触发器
DROP TRIGGER IF EXISTS update_gift_redemptions_updated_at ON gift_redemptions;
CREATE TRIGGER update_gift_redemptions_updated_at
    BEFORE UPDATE ON gift_redemptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 完成提示
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '✅ 数据库表创建完成！';
    RAISE NOTICE '📊 已创建的表：';
    RAISE NOTICE '  - profiles (用户资料)';
    RAISE NOTICE '  - coin_transactions (金币交易)';
    RAISE NOTICE '  - gift_redemptions (礼物兑换)';
    RAISE NOTICE '  - learning_progress (学习进度)';
    RAISE NOTICE '  - check_ins (签到记录)';
    RAISE NOTICE '🔒 已启用 Row Level Security';
    RAISE NOTICE '✨ 可以开始使用应用了！';
END $$;
