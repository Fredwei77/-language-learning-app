# GitHub Desktop 使用指南 - 图文教程

## 当前状态

✅ GitHub Desktop 已安装
✅ 已识别到仓库：`Fredwei77/language-learning-app`
✅ 代码已准备好推送

## 步骤 1：添加现有仓库到 GitHub Desktop

根据你的截图，你需要点击：

**"Add an Existing Repository from your local drive..."**
（添加本地驱动器上的现有仓库）

### 详细步骤：

1. 点击 **"Add an Existing Repository from your local drive..."** 按钮
2. 在弹出的窗口中：
   - **Local path**: 浏览并选择你的项目文件夹
     ```
     C:\Users\user\Desktop\languagelearningapp1
     ```
   - 点击 **"Add Repository"**（添加仓库）

### 如果提示 "This directory does not appear to be a Git repository"

点击 **"create a repository"** 或返回，因为我们已经初始化了 Git。

---

## 步骤 2：查看更改

添加仓库后，GitHub Desktop 会显示：

- **左侧面板**：显示所有已更改的文件
- **右侧面板**：显示文件的具体更改内容
- **底部**：提交信息区域

你应该能看到所有已提交的文件。

---

## 步骤 3：登录 GitHub 账号

如果还没有登录：

1. 点击顶部菜单 **File** → **Options** (或 **Preferences**)
2. 选择 **Accounts** 标签
3. 点击 **Sign in** 登录 GitHub
4. 在浏览器中完成授权

---

## 步骤 4：发布仓库到 GitHub

### 方法 A：如果仓库已存在

1. 点击顶部的 **Repository** 菜单
2. 选择 **Repository settings...**
3. 在 **Remote** 部分，确认远程仓库地址：
   ```
   https://github.com/Fredwei77/language-learning-app.git
   ```
4. 点击顶部的 **Push origin** 按钮（或按 `Ctrl+P`）

### 方法 B：如果是新仓库

1. 点击顶部中间的 **Publish repository** 按钮
2. 在弹出窗口中：
   - **Name**: `language-learning-app`
   - **Description**: 粤语学习应用
   - 取消勾选 **"Keep this code private"**（如果想公开）
   - ⚠️ **不要**勾选 "Keep this code private" 如果你想要公开仓库
3. 点击 **Publish repository**

---

## 步骤 5：推送代码

发布后，你会看到：

1. 顶部显示 **"Push origin"** 或 **"Fetch origin"**
2. 点击 **"Push origin"** 推送所有提交
3. 等待推送完成（可能需要几分钟）

### 推送进度

你会看到进度条显示：
```
Pushing to Fredwei77/language-learning-app
Uploading objects: 100% (xxx/xxx)
```

---

## 步骤 6：验证推送成功

推送完成后：

1. 在 GitHub Desktop 中，你会看到 **"Last fetched just now"**
2. 访问浏览器：https://github.com/Fredwei77/language-learning-app
3. 确认所有文件都已上传

---

## 常见问题

### Q: 提示 "Authentication failed"

**解决**：
1. 点击 **File** → **Options** → **Accounts**
2. 点击 **Sign out**，然后重新 **Sign in**
3. 在浏览器中完成授权

### Q: 提示 "Repository not found"

**解决**：
1. 确认仓库已在 GitHub 上创建
2. 访问：https://github.com/new 创建仓库
3. 仓库名必须是：`language-learning-app`

### Q: 推送很慢或卡住

**原因**：文件太多或网络问题

**解决**：
- 等待完成（首次推送会比较慢）
- 检查网络连接
- 如果一直卡住，重启 GitHub Desktop

### Q: 看不到 "Publish repository" 按钮

**原因**：仓库可能已经关联了远程仓库

**解决**：
1. 点击顶部的 **Repository** → **Repository settings**
2. 检查 **Remote** 设置
3. 如果正确，直接点击 **Push origin**

---

## 图解步骤

### 1. 添加仓库
```
[Add an Existing Repository] 按钮
    ↓
选择文件夹: C:\Users\user\Desktop\languagelearningapp1
    ↓
[Add Repository] 按钮
```

### 2. 发布/推送
```
[Publish repository] 或 [Push origin] 按钮
    ↓
等待上传完成
    ↓
✅ 推送成功
```

### 3. 验证
```
访问 GitHub 网站
    ↓
https://github.com/Fredwei77/language-learning-app
    ↓
✅ 看到所有文件
```

---

## 下一步：连接 Netlify

推送成功后，需要：

1. 登录 Netlify: https://app.netlify.com
2. 连接 GitHub 仓库
3. 配置环境变量
4. 部署网站

详见 `READY_TO_PUSH.md` 文件。

---

## 需要帮助？

如果遇到问题，请告诉我：
1. 你看到的错误信息
2. 当前在哪个步骤
3. 截图（如果可能）

我会帮你解决！
