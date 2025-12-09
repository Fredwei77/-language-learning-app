-- 创建临时注册表
CREATE TABLE IF NOT EXISTS pending_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scene_id VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  nickname VARCHAR(100),
  wechat_openid VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 minutes',
  completed_at TIMESTAMP,
  
  CONSTRAINT check_status CHECK (status IN ('pending', 'completed', 'expired', 'failed'))
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_pending_scene_id ON pending_registrations(scene_id);
CREATE INDEX IF NOT EXISTS idx_pending_status ON pending_registrations(status);
CREATE INDEX IF NOT EXISTS idx_pending_expires_at ON pending_registrations(expires_at);
CREATE INDEX IF NOT EXISTS idx_pending_wechat_openid ON pending_registrations(wechat_openid);

-- 用户表添加微信 openid 字段
ALTER TABLE users ADD COLUMN IF NOT EXISTS wechat_openid VARCHAR(100) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_users_wechat_openid ON users(wechat_openid);

-- 添加注释
COMMENT ON TABLE pending_registrations IS '临时注册表，用于微信公众号注册验证';
COMMENT ON COLUMN pending_registrations.scene_id IS '二维码场景值';
COMMENT ON COLUMN pending_registrations.wechat_openid IS '微信用户 OpenID';
COMMENT ON COLUMN pending_registrations.status IS '状态：pending-等待中, completed-已完成, expired-已过期, failed-失败';

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

-- 创建定时任务（需要 pg_cron 扩展）
-- 每小时清理一次过期记录
-- SELECT cron.schedule('clean-expired-registrations', '0 * * * *', 'SELECT clean_expired_registrations()');
