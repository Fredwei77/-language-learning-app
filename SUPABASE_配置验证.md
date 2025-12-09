# Supabase 配置验证清单

## 当前配置状态

根据截图，你已经配置了：
- ✅ Site URL: `https://good2study.netlify.app`
- ⚠️ Redirect URL: `https://good2study.netlify.app/` （需要补充）

## 需要添加的 Redirect URL

请在 Supabase Dashboard 的 **Redirect URLs** 部分添加以下 URL：

### 必须添加（重要！）

```
https://good2study.netlify.app/auth/callback
```

这个是邮件验证链接的回调地址，必须添加！

### 可选添加（推荐）

```
http://localhost:3000/auth/callback
```

这个用于本地开发测试。

## 完整配置应该是这样

### Site URL
```
https://good2study.netlify.app
```

### Redirect URLs（应该有2-3个）
```
https://good2study.netlify.app/
https://good2study.netlify.app/auth/callback
http://localhost:3000/auth/callback (可选)
```

## 如何添加

1. 在 Supabase Dashboard 的 **URL Configuration** 页面
2. 找到 **Redirect URLs** 部分
3. 点击 **Add URL** 按钮
4. 输入：`https://good2study.netlify.app/auth/callback`
5. 点击 **Save changes** 保存

## 验证配置

配置完成后，你的 Redirect URLs 列表应该显示：

```
✓ https://good2study.netlify.app/
✓ https://good2study.netlify.app/auth/callback
```

## 保存后等待

- 点击页面底部的 **Save changes** 按钮
- 等待 10-30 秒让配置生效

## 下一步

配置完成后，就可以测试注册功能了！
