# Git 推送指南

## 方案 1：推送到现有仓库（如果 Netlify 已连接）

如果你的 Netlify 项目已经连接到一个 Git 仓库，你需要找到那个仓库地址。

### 查找 Netlify 连接的仓库

1. 登录 Netlify: https://app.netlify.com
2. 进入你的项目
3. 点击 **Site settings** → **Build & deploy** → **Continuous deployment**
4. 查看 **Repository** 部分，会显示连接的 Git 仓库地址

### 推送到该仓库

找到仓库地址后，在命令行运行：

```bash
# 添加远程仓库（替换为你的实际地址）
git remote add origin https://github.com/Fredwei77/你的仓库名.git

# 推送代码
git push -u origin main
```

如果推送失败，可能需要先拉取远程代码：
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 方案 2：创建新的 GitHub 仓库并推送

### 步骤 1：在 GitHub 创建新仓库

1. 访问：https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `language-learning-app` （或其他名称）
   - **Description**: 粤语学习应用
   - **Public** 或 **Private**（选择一个）
   - ⚠️ **不要**勾选 "Add a README file"
   - ⚠️ **不要**勾选 "Add .gitignore"
   - ⚠️ **不要**勾选 "Choose a license"
3. 点击 **Create repository**

### 步骤 2：推送代码到新仓库

创建仓库后，GitHub 会显示推送命令。在命令行运行：

```bash
# 添加远程仓库（替换为你的实际地址）
git remote add origin https://github.com/Fredwei77/language-learning-app.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤 3：连接 Netlify 到新仓库

1. 登录 Netlify
2. 进入你的项目
3. 点击 **Site settings** → **Build & deploy** → **Continuous deployment**
4. 点击 **Link repository**
5. 选择 GitHub
6. 选择你刚创建的仓库
7. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
8. 点击 **Save**

---

## 方案 3：使用 Netlify Drop（最简单）

如果不想使用 Git，可以直接拖拽部署：

### 步骤 1：构建项目

```bash
npm run build
```

### 步骤 2：部署到 Netlify

1. 访问：https://app.netlify.com/drop
2. 将 `.next` 文件夹拖拽到页面上
3. 等待上传完成

⚠️ 注意：这种方式不会自动部署，每次更新都需要手动上传。

---

## 推荐方案

**推荐使用方案 2**：创建新的 GitHub 仓库并连接到 Netlify。

这样的好处：
- ✅ 代码有版本控制
- ✅ 每次推送自动部署
- ✅ 可以回滚到之前的版本
- ✅ 团队协作更方便

---

## 常见问题

### Q: 推送时要求输入用户名和密码？

GitHub 已经不支持密码认证，需要使用 Personal Access Token (PAT)：

1. 访问：https://github.com/settings/tokens
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 勾选 `repo` 权限
4. 点击 **Generate token**
5. 复制生成的 token（只显示一次！）
6. 推送时，用户名输入你的 GitHub 用户名，密码输入这个 token

### Q: 推送被拒绝（rejected）？

可能是远程仓库有内容，运行：
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Q: 如何查看当前的远程仓库？

```bash
git remote -v
```

### Q: 如何更改远程仓库地址？

```bash
git remote set-url origin https://github.com/Fredwei77/新仓库名.git
```

---

## 下一步

选择一个方案后，告诉我你遇到的任何问题，我会帮你解决！
