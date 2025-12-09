# Netlify 环境变量配置

## 🔧 需要在 Netlify 中添加的环境变量

### 访问 Netlify Dashboard

1. 登录：https://app.netlify.com
2. 选择你的网站：good2study
3. 进入：**Site settings** → **Environment variables**

### 添加以下环境变量

点击 **"Add a variable"** 或 **"Add environment variables"**

#### 微信公众号配置

```
Key: WECHAT_APP_ID
Value: wx5d73e796a1ab4ab8
```

```
Key: WECHAT_APP_SECRET
Value: 7565dcea12dc94faa54d0b7411077840
```

```
Key: WECHAT_TOKEN
Value: good2study_wechat_2024
```

```
Key: NEXT_PUBLIC_WECHAT_NAME
Value: 忆迈AI智能文化
```

#### 网站 URL（如果还没有）

```
Key: NEXT_PUBLIC_SITE_URL
Value: https://good2study.netlify.app
```

### ⚠️ 重要提示

1. **不要**在变量名前后添加空格
2. **不要**在值前后添加引号
3. 确保每个变量都保存成功

### 保存后

点击 **"Save"** 按钮

### 验证配置

在环境变量列表中应该看到：
- ✅ WECHAT_APP_ID
- ✅ WECHAT_APP_SECRET
- ✅ WECHAT_TOKEN
- ✅ NEXT_PUBLIC_WECHAT_NAME
- ✅ NEXT_PUBLIC_SITE_URL

## 📸 配置截图示例

你的配置应该类似这样：

```
Environment variables
┌────────────────────────────────────────────────┐
│ WECHAT_APP_ID                                  │
│ wx5d73e796a1ab4ab8                             │
├────────────────────────────────────────────────┤
│ WECHAT_APP_SECRET                              │
│ 7565dcea12dc94faa54d0b7411077840               │
├────────────────────────────────────────────────┤
│ WECHAT_TOKEN                                   │
│ good2study_wechat_2024                         │
├────────────────────────────────────────────────┤
│ NEXT_PUBLIC_WECHAT_NAME                        │
│ 忆迈AI智能文化                                  │
├────────────────────────────────────────────────┤
│ NEXT_PUBLIC_SITE_URL                           │
│ https://good2study.netlify.app                 │
└────────────────────────────────────────────────┘
```

## ✅ 完成后

配置完成后，告诉我：
```
✅ Netlify 环境变量配置完成
```

然后我会触发部署。

---

**需要帮助？** 随时问我！
