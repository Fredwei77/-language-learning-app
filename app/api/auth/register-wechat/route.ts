import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createTempQRCode, generateSceneId } from '@/lib/wechat/api'

export async function POST(request: NextRequest) {
  try {
    const { email, password, nickname } = await request.json()

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要6个字符' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 检查邮箱是否已在 Supabase Auth 中注册
    // 注意：我们不能直接查询 auth.users，所以跳过这个检查
    // Supabase Auth 的 signUp 会自动处理重复邮箱的情况

    // 生成场景值
    const sceneId = generateSceneId()

    // 创建临时注册记录（保存原始密码，因为 Supabase Auth 需要）
    const { error: insertError } = await supabase
      .from('pending_registrations')
      .insert({
        scene_id: sceneId,
        email,
        password_hash: password, // 保存原始密码
        nickname: nickname || email.split('@')[0],
        status: 'pending',
      })

    if (insertError) {
      console.error('创建临时注册记录失败:', insertError)
      return NextResponse.json(
        { error: '创建注册记录失败' },
        { status: 500 }
      )
    }

    // 生成二维码
    const qrCode = await createTempQRCode(sceneId, 1800) // 30分钟有效期

    return NextResponse.json({
      success: true,
      data: {
        sceneId,
        qrCodeUrl: qrCode.url,
        expiresIn: qrCode.expireSeconds,
      },
    })
  } catch (error) {
    console.error('注册失败:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}
