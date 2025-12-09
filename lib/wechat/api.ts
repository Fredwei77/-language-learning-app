/**
 * 微信公众号 API 工具
 */

import crypto from 'crypto'

// 微信 API 配置
const WECHAT_CONFIG = {
  appId: process.env.WECHAT_APP_ID || '',
  appSecret: process.env.WECHAT_APP_SECRET || '',
  token: process.env.WECHAT_TOKEN || '',
}

// Access Token 缓存
let accessTokenCache: { token: string; expiresAt: number } | null = null

/**
 * 获取 Access Token
 */
export async function getAccessToken(): Promise<string> {
  // 检查缓存
  if (accessTokenCache && accessTokenCache.expiresAt > Date.now()) {
    return accessTokenCache.token
  }

  // 请求新的 token
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_CONFIG.appId}&secret=${WECHAT_CONFIG.appSecret}`
  
  const response = await fetch(url)
  const data = await response.json()

  if (data.errcode) {
    throw new Error(`获取 Access Token 失败: ${data.errmsg}`)
  }

  // 缓存 token（提前 5 分钟过期）
  accessTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  }

  return data.access_token
}

/**
 * 生成带参数的临时二维码
 * @param sceneId 场景值（最多64个字符）
 * @param expireSeconds 过期时间（秒），最大2592000（30天）
 */
export async function createTempQRCode(sceneId: string, expireSeconds: number = 1800) {
  const accessToken = await getAccessToken()
  const url = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      expire_seconds: expireSeconds,
      action_name: 'QR_STR_SCENE',
      action_info: {
        scene: {
          scene_str: sceneId,
        },
      },
    }),
  })

  const data = await response.json()

  if (data.errcode) {
    throw new Error(`创建二维码失败: ${data.errmsg}`)
  }

  return {
    ticket: data.ticket,
    expireSeconds: data.expire_seconds,
    url: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(data.ticket)}`,
  }
}

/**
 * 发送客服消息
 */
export async function sendCustomMessage(openid: string, content: string) {
  const accessToken = await getAccessToken()
  const url = `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      touser: openid,
      msgtype: 'text',
      text: {
        content,
      },
    }),
  })

  const data = await response.json()

  if (data.errcode && data.errcode !== 0) {
    throw new Error(`发送消息失败: ${data.errmsg}`)
  }

  return data
}

/**
 * 验证微信服务器签名
 */
export function verifySignature(signature: string, timestamp: string, nonce: string): boolean {
  const token = WECHAT_CONFIG.token
  const arr = [token, timestamp, nonce].sort()
  const str = arr.join('')
  const sha1 = crypto.createHash('sha1')
  sha1.update(str)
  const result = sha1.digest('hex')
  return result === signature
}

/**
 * 解析微信 XML 消息
 */
export function parseXML(xml: string): Record<string, string> {
  const result: Record<string, string> = {}
  const regex = /<(\w+)><!\[CDATA\[(.*?)\]\]><\/\1>/g
  let match

  while ((match = regex.exec(xml)) !== null) {
    result[match[1]] = match[2]
  }

  // 也处理非 CDATA 的标签
  const simpleRegex = /<(\w+)>([^<]+)<\/\1>/g
  while ((match = simpleRegex.exec(xml)) !== null) {
    if (!result[match[1]]) {
      result[match[1]] = match[2]
    }
  }

  return result
}

/**
 * 生成 XML 响应
 */
export function buildXMLResponse(toUser: string, fromUser: string, content: string): string {
  const timestamp = Math.floor(Date.now() / 1000)
  return `
    <xml>
      <ToUserName><![CDATA[${toUser}]]></ToUserName>
      <FromUserName><![CDATA[${fromUser}]]></FromUserName>
      <CreateTime>${timestamp}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
    </xml>
  `.trim()
}

/**
 * 生成场景值（用于二维码参数）
 */
export function generateSceneId(): string {
  return `REG_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
}

/**
 * 获取用户信息
 */
export async function getUserInfo(openid: string) {
  const accessToken = await getAccessToken()
  const url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${accessToken}&openid=${openid}&lang=zh_CN`

  const response = await fetch(url)
  const data = await response.json()

  if (data.errcode) {
    throw new Error(`获取用户信息失败: ${data.errmsg}`)
  }

  return {
    openid: data.openid,
    nickname: data.nickname,
    sex: data.sex,
    province: data.province,
    city: data.city,
    country: data.country,
    headimgurl: data.headimgurl,
    subscribe: data.subscribe,
    subscribeTime: data.subscribe_time,
  }
}
