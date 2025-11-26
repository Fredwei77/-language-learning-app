// 验证 Supabase 连接的脚本
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function verifySupabase() {
  console.log('🔍 验证 Supabase 配置...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 环境变量未配置')
    console.log('请检查 .env.local 文件')
    process.exit(1)
  }

  console.log('✅ 环境变量已配置')
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`)

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 测试连接
    console.log('🔌 测试数据库连接...')
    const { data, error } = await supabase.from('profiles').select('count').limit(1)

    if (error) {
      if (error.message.includes('relation "public.profiles" does not exist')) {
        console.log('⚠️  profiles 表不存在')
        console.log('\n📋 请按照以下步骤创建数据库表：')
        console.log('1. 访问 Supabase Dashboard: https://supabase.com/dashboard')
        console.log('2. 选择你的项目')
        console.log('3. 进入 SQL Editor')
        console.log('4. 点击 "New query"')
        console.log('5. 复制 supabase-setup.sql 文件的内容')
        console.log('6. 粘贴并点击 "Run"\n')
        process.exit(1)
      } else {
        throw error
      }
    }

    console.log('✅ 数据库连接成功！')
    console.log('✅ profiles 表已存在\n')

    // 检查其他表
    const tables = ['coin_transactions', 'gift_redemptions', 'learning_progress', 'check_ins']
    console.log('🔍 检查其他表...')

    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').limit(1)
      if (error) {
        console.log(`⚠️  ${table} 表不存在`)
      } else {
        console.log(`✅ ${table} 表已存在`)
      }
    }

    console.log('\n🎉 Supabase 配置验证完成！')
    console.log('💡 现在可以运行: npm run build')
  } catch (error) {
    console.error('❌ 连接失败:', error.message)
    console.log('\n请检查：')
    console.log('1. Supabase URL 是否正确')
    console.log('2. Anon Key 是否正确')
    console.log('3. 网络连接是否正常')
    console.log('4. Supabase 项目是否已暂停（免费版长期不用会暂停）')
    process.exit(1)
  }
}

verifySupabase()
