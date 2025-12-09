-- 简化版微信注册表创建脚本
-- 只创建必要的表，不依赖 users 表

-- 创建临时注册表
CREATE TABLE IF NOT EXISTS pending_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  nickname VARCHAR(100),
  wechat_openid VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 minutes',
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT check_status CHECK (status IN ('pending', 'completed', 'expired', 'failed'))
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_pending_scene_id ON pending_registrations(scene_id);
CREATE INDEX IF NOT EXISTS idx_pending_status ON pending_registrations(status);
CREATE INDEX IF NOT EXISTS idx_pending_expires_at ON pending_registrations(expires_at);
CREATE INDEX IF NOT EXISTS idx_pending_wechat_openid ON pending_registrations(wechat_openid);

-- 添加注释
COMMENT ON TABLE pending_registrations IS '临时注册表，用于微信公众号注册验证';
COMMENT ON COLUMN pending_registrations.scene_id IS '二维码场景值';
COMMENT ON COLUMN pending_registrations.wechat_openid IS '微信用户 OpenID';
COMMENT ON COLUMN pending_registrations.status IS '状态：pending-等待中, completed-已完成, expired-已过期, failed-失败';

-- 检查并添加 wechat_openid 字段到 auth.users 的 raw_user_meta_data
-- Supabase Auth 使用 auth.users 表，我们将 wechat_openid 存储在 metadata 中
-- 不需要修改表结构

-- 创建清理过期记录的函数
CREATE OR REPLACE FUNCTION clean_expired_registrations()
RETURNS void AS $$
BEGIN
  UPDATE pending_registrations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 验证表创建成功
SELECT 'pending_registrations 表创建成功' AS message;
