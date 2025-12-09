# 🚀 快速设置指南

## 当前状态
✅ 依赖已安装  
⚠️ 需要配置环境变量  
⚠️ 需要设置 Supabase 数据库  

---

## 步骤 1: 配置环境变量

打开 `.env.local` 文件，填写以下信息：

### 1.1 OpenRouter API Key
1. 访问 https://openrouter.ai/keys
2. 注册/登录账号
3. 创建新的 API Key
4. 复制 Key 到 `OPENROUTER_API_KEY=` 后面

### 1.2 Supabase 配置
1. 访问 https://supabase.com/dashboard
2. 创建新项目或选择现有项目
3. 进入 **Settings** > **API**
4. 复制以下信息：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL=`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY=`

### 1.3 Stripe 配置
1. 访问 https://dashboard.stripe.com/test/apikeys
2. 注册/登录账号
3. 复制 **Secret key** (以 `sk_test_` 开头)
4. 粘贴到 `STRIPE_SECRET_KEY=` 后面

### 1.4 应用 URL（可选）
本地开发保持默认值即可：
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 步骤 2: 设置 Supabase 数据库

### 方法 1: 使用 SQL 编辑器（推荐）

1. 打开 Supabase Dashboard
2. 进入 **SQL Editor**
3. 点击 **New query**
4. 复制 `supabase-setup.sql` 文件的全部内容
5. 粘贴到编辑器
6. 点击 **Run** 执行

### 方法 2: 手动创建表

参考 `MIGRATION_GUIDE.md` 中的表结构，逐个创建。

---

## 步骤 3: 验证设置

### 3.1 检查环境变量
```bash
# 确保所有必需的变量都已填写
cat .env.local
```

### 3.2 验证构建
```bash
npm run build
```

如果构建成功，说明环境变量配置正确！

### 3.3 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

---

## 步骤 4: 测试功能

### 4.1 用户注册/登录
1. 访问 `/auth/sign-up` 注册新账号
2. 检查邮箱确认邮件
3. 登录账号

### 4.2 测试金币系统
1. 进入个人资料页面
2. 点击"每日签到"按钮
3. 检查金币是否增加

### 4.3 测试 AI 功能
1. 进入 AI 对话页面
2. 发送一条消息
3. 检查是否收到回复

---

## 常见问题

### Q: 构建时提示环境变量错误
**A:** 确保 `.env.local` 文件中所有必需的变量都已填写，且没有多余的空格。

### Q: Supabase 连接失败
**A:** 检查：
1. URL 格式是否正确（应该是 `https://xxx.supabase.co`）
2. Anon Key 是否完整复制
3. 项目是否已暂停（免费版长期不用会暂停）

### Q: OpenRouter API 调用失败
**A:** 检查：
1. API Key 是否有效
2. 账户是否有余额
3. 网络连接是否正常

### Q: 数据库表创建失败
**A:** 
1. 确保使用的是 Supabase 的 SQL Editor
2. 检查是否有权限执行 SQL
3. 查看错误信息，可能是表已存在

---

## 下一步

设置完成后，你可以：

1. 📚 阅读 `MIGRATION_GUIDE.md` 了解数据库结构
2. 🔧 查看 `FIXES_SUMMARY.md` 了解所有改进
3. 💻 开始开发新功能
4. 🧪 添加测试用例

---

## 需要帮助？

如果遇到问题：
1. 检查浏览器控制台的错误信息
2. 查看服务器终端的日志
3. 确认所有环境变量都已正确配置
4. 验证 Supabase 数据库表已创建

祝开发顺利！🎉
