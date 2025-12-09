import { NextRequest, NextResponse } from 'next/server'
import { verifySignature, parseXML, buildXMLResponse } from '@/lib/wechat/api'
import { createClient } from '@/lib/supabase/server'

// 禁用 body 解析，我们需要原始文本
export const runtime = 'nodejs'

/**
 * GET 请求：微信服务器验证
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const signature = searchParams.get('signature') || ''
  const timestamp = searchParams.get('timestamp') || ''
  const nonce = searchParams.get('nonce') || ''
  const echostr = searchParams.get('echostr') || ''

  // 验证签名
  if (verifySignature(signature, timestamp, nonce)) {
    // 验证成功，返回 echostr
    return new NextResponse(echostr)
  }

  return new NextResponse('Invalid signature', { status: 403 })
}

/**
 * POST 请求：接收微信推送的消息和事件
 */
export async function POST(request: NextRequest) {
  try {
    // 验证签名
    const searchParams = request.nextUrl.searchParams
    const signature = searchParams.get('signature') || ''
    const timestamp = searchParams.get('timestamp') || ''
    const nonce = searchParams.get('nonce') || ''

    if (!verifySignature(signature, timestamp, nonce)) {
      return new NextResponse('Invalid signature', { status: 403 })
    }

    // 获取 XML 消息体
    const body = await request.text()
    const message = parseXML(body)

    console.log('收到微信消息:', message)

    // 处理不同类型的消息
    if (message.MsgType === 'event') {
      return await handleEvent(message)
    }

    // 默认回复
    return new NextResponse(
      buildXMLResponse(
        message.FromUserName,
        message.ToUserName,
        '感谢关注！'
      ),
      {
        headers: { 'Content-Type': 'application/xml' },
      }
    )
  } catch (error) {
    console.error('处理微信消息失败:', error)
    return new NextResponse('success', { status: 200 })
  }
}

/**
 * 处理事件消息
 */
async function handleEvent(message: Record<string, string>) {
  const eventType = message.Event
  const openid = message.FromUserName
  const toUser = message.ToUserName

  // 处理关注事件
  if (eventType === 'subscribe') {
    // 检查是否是扫码关注（带参数）
    if (message.EventKey) {
      // EventKey 格式：qrscene_REG_xxx 或 REG_xxx
      const sceneId = message.EventKey.replace('qrscene_', '')
      
      console.log('扫码关注，场景值:', sceneId)

      // 处理注册
      const result = await handleRegistration(sceneId, openid)

      if (result.success) {
        return new NextResponse(
          buildXMLResponse(
            openid,
            toUser,
            `🎉 注册成功！\n\n欢迎加入忆迈AI智能文化学习平台！\n\n你的账号已激活，现在可以返回网页登录了。\n\n祝你学习愉快！`
          ),
          {
            headers: { 'Content-Type': 'application/xml' },
          }
        )
      } else {
        return new NextResponse(
          buildXMLResponse(
            openid,
            toUser,
            `❌ 注册失败\n\n${result.error}\n\n请返回网页重新注册或联系客服。`
          ),
          {
            headers: { 'Content-Type': 'application/xml' },
          }
        )
      }
    }

    // 普通关注
    return new NextResponse(
      buildXMLResponse(
        openid,
        toUser,
        `👋 欢迎关注忆迈AI智能文化！\n\n这里有丰富的语言学习资源，包括：\n• 粤语学习\n• 发音练习\n• AI 智能对话\n• 学习进度追踪\n\n访问我们的网站开始学习吧！\nhttps://good2study.netlify.app`
      ),
      {
        headers: { 'Content-Type': 'application/xml' },
      }
    )
  }

  // 已关注用户扫描二维码
  if (eventType === 'SCAN') {
    const sceneId = message.EventKey
    console.log('已关注用户扫码，场景值:', sceneId)

    const result = await handleRegistration(sceneId, openid)

    if (result.success) {
      return new NextResponse(
        buildXMLResponse(
          openid,
          toUser,
          `🎉 注册成功！\n\n你的账号已激活，现在可以返回网页登录了。`
        ),
        {
          headers: { 'Content-Type': 'application/xml' },
        }
      )
    } else {
      return new NextResponse(
        buildXMLResponse(
          openid,
          toUser,
          `❌ 注册失败：${result.error}`
        ),
        {
          headers: { 'Content-Type': 'application/xml' },
        }
      )
    }
  }

  // 默认回复
  return new NextResponse('success', { status: 200 })
}

/**
 * 处理注册逻辑
 */
async function handleRegistration(sceneId: string, openid: string) {
  try {
    const supabase = await createClient()

    // 查找临时注册记录
    const { data: pending, error: findError } = await supabase
      .from('pending_registrations')
      .select('*')
      .eq('scene_id', sceneId)
      .eq('status', 'pending')
      .single()

    if (findError || !pending) {
      return {
        success: false,
        error: '注册记录不存在或已过期，请重新注册',
      }
    }

    // 检查是否过期
    if (new Date(pending.expires_at) < new Date()) {
      await supabase
        .from('pending_registrations')
        .update({ status: 'expired' })
        .eq('id', pending.id)

      return {
        success: false,
        error: '注册已过期，请重新注册',
      }
    }

    // 创建用户账号（使用原始密码）
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: pending.email,
      password: pending.password_hash, // 这里存的是原始密码
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://good2study.netlify.app'}/auth/callback`,
        data: {
          nickname: pending.nickname,
          wechat_openid: openid,
        },
      },
    })

    if (authError) {
      console.error('创建用户失败:', authError)
      return {
        success: false,
        error: '创建账号失败，请稍后重试',
      }
    }

    // 更新临时注册记录
    await supabase
      .from('pending_registrations')
      .update({
        status: 'completed',
        wechat_openid: openid,
        completed_at: new Date().toISOString(),
      })
      .eq('id', pending.id)

    // wechat_openid 已经通过 signUp 的 metadata 保存了
    // Supabase Auth 会自动存储在 auth.users.raw_user_meta_data 中

    return {
      success: true,
      userId: authData.user?.id,
    }
  } catch (error) {
    console.error('注册处理失败:', error)
    return {
      success: false,
      error: '系统错误，请稍后重试',
    }
  }
}
