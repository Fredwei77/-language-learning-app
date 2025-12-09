import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sceneId = searchParams.get('sceneId')

    if (!sceneId) {
      return NextResponse.json(
        { error: '缺少场景值参数' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 查询注册状态
    const { data, error } = await supabase
      .from('pending_registrations')
      .select('status, email, completed_at, expires_at')
      .eq('scene_id', sceneId)
      .single()

    if (error || !data) {
      return NextResponse.json({
        status: 'not_found',
        message: '注册记录不存在',
      })
    }

    // 检查是否过期
    if (new Date(data.expires_at) < new Date() && data.status === 'pending') {
      // 更新为过期状态
      await supabase
        .from('pending_registrations')
        .update({ status: 'expired' })
        .eq('scene_id', sceneId)

      return NextResponse.json({
        status: 'expired',
        message: '注册已过期，请重新注册',
      })
    }

    return NextResponse.json({
      status: data.status,
      email: data.email,
      completedAt: data.completed_at,
      expiresAt: data.expires_at,
    })
  } catch (error) {
    console.error('检查注册状态失败:', error)
    return NextResponse.json(
      { error: '查询失败' },
      { status: 500 }
    )
  }
}
