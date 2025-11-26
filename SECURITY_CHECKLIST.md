# 安全检查清单 ✅

## 推送前必查项目

### ✅ 已完成

1. **✅ .gitignore 已更新**
   - 已添加 `.env*` 保护所有环境变量文件
   - 已添加 `.next/` 排除构建文件
   - 已添加 `node_modules/` 排除依赖

2. **✅ .env.local 未被跟踪**
   - 文件包含真实的 API 密钥
   - 已被 .gitignore 保护
   - 不会被推送到 Git

3. **✅ 敏感信息检查**
   - ✅ OPENROUTER_API_KEY - 在 .env.local（已保护）
   - ✅ STRIPE_SECRET_KEY - 在 .env.local（已保护）
   - ✅ NEXT_PUBLIC_SUPABASE_URL - 在 .env.local（已保护）
   - ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY - 在 .env.local（已保护）

### 📋 推送前最后检查

运行以下命令确认没有敏感文件被跟踪：

```bash
# 检查将要提交的文件
git status

# 确认 .env.local 不在列表中
git ls-files | grep -E "\.env"

# 应该只看到 .env.example，不应该有 .env.local
```

### 🔒 已保护的文件

以下文件已被 .gitignore 保护，不会被推送：

- `.env.local` - 包含所有真实的 API 密钥
- `.next/` - 构建文件（可能包含编译后的环境变量）
- `node_modules/` - 依赖包
- `.vscode/` - IDE 配置

### ✅ 可以安全推送的文件

- `.env.example` - 只包含示例值，没有真实密钥
- 所有源代码文件
- 配置文件（next.config.mjs, tsconfig.json 等）
- 文档文件

## 推送到 Git

现在可以安全地推送代码了：

```bash
# 查看远程仓库（如果有）
git remote -v

# 如果没有远程仓库，添加一个
git remote add origin https://github.com/Fredwei77/你的仓库名.git

# 推送代码
git push -u origin master
```

## Netlify 环境变量配置

推送后，记得在 Netlify 添加环境变量：

1. 登录 Netlify: https://app.netlify.com
2. 进入你的项目
3. **Site settings** → **Build & deploy** → **Environment**
4. 添加以下变量（从 .env.local 复制值）：

```
OPENROUTER_API_KEY=sk-or-v1-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=https://你的域名.netlify.app
```

## 紧急情况：如果密钥已泄露

如果不小心推送了包含密钥的文件：

### 1. 立即撤销所有密钥

- **OpenRouter**: https://openrouter.ai/keys - 删除并重新生成
- **Stripe**: https://dashboard.stripe.com/test/apikeys - 撤销并创建新的
- **Supabase**: https://supabase.com/dashboard - 重置 API 密钥

### 2. 从 Git 历史中删除敏感文件

```bash
# 从 Git 历史中完全删除文件
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送（会重写历史）
git push origin --force --all
```

### 3. 更新所有密钥

在 `.env.local` 和 Netlify 中更新为新的密钥。

## 最佳实践

1. **永远不要**在代码中硬编码密钥
2. **永远不要**提交 `.env.local` 文件
3. **定期检查** Git 状态，确保没有意外添加敏感文件
4. **使用** `.env.example` 作为模板，不包含真实值
5. **定期轮换**密钥，特别是在团队成员变动时

## 验证安全性

运行以下命令验证：

```bash
# 检查 .env.local 是否被忽略
git check-ignore .env.local
# 应该输出: .env.local

# 检查已跟踪的文件中是否有环境变量
git ls-files | xargs grep -l "sk-or-v1\|sk_test_" 2>/dev/null
# 应该没有输出（或只有 .env.example）
```

---

✅ **安全检查完成！现在可以安全地推送代码了。**
