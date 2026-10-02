# 最简单的上线步骤

这份文档只保留最省心的一条路径：

**GitHub Desktop 发布代码 → Cloudflare Pages 自动部署**

不需要先学习 Git 命令，也不需要写服务器代码。

## 第一步：安装 GitHub Desktop

下载并安装：

https://desktop.github.com/

安装后打开 GitHub Desktop，使用你的 GitHub 账号登录：

```text
lzpqr
```

如果浏览器要求登录或授权，按页面提示完成即可。

## 第二步：把本地项目加入 GitHub Desktop

在 GitHub Desktop 中：

1. 点击顶部菜单 `File`。
2. 选择 `Add local repository`。
3. 选择这个目录：

```text
H:\ai\codex\web
```

4. 点击 `Add repository`。

项目已经包含 Git 仓库和远程地址，GitHub Desktop 应该会自动识别：

```text
origin: https://github.com/lzpqr/hardwarebase-blog.git
```

## 第三步：发布到 GitHub

如果 GitHub Desktop 顶部出现 `Changes`，说明还有本次更新尚未提交：

1. 在 Summary 中填写 `更新部署说明`。
2. 点击 `Commit to main`。
3. 然后继续下面的推送步骤。

如果 GitHub Desktop 显示 `Publish branch`：

1. 点击 `Publish branch`。
2. 确认仓库名称为 `hardwarebase-blog`。
3. 确认分支为 `main`。
4. 等待上传完成。

如果已经检测到远程仓库，则点击：

```text
Push origin
```

上传完成后，打开下面地址确认文件已经出现：

https://github.com/lzpqr/hardwarebase-blog

看到 `README.md`、`source`、`package.json` 等文件，就表示发布成功。

## 第四步：先确认 GitHub 已经收到新配置

打开下面的 GitHub 文件页面：

https://github.com/lzpqr/hardwarebase-blog/blob/main/wrangler.toml

文件内容必须包含：

```toml
[assets]
directory = "./public"
not_found_handling = "404-page"
```

如果页面仍然显示：

```toml
pages_build_output_dir = "public"
```

说明 GitHub Desktop 还没有把本地修改推送成功。此时 Cloudflare 重试多少次都会继续失败。

回到 GitHub Desktop：

1. 选择本地仓库 `H:\ai\codex\web`。
2. 确认 Changes 中包含 `wrangler.toml`。
3. Summary 填写 `fix: use Workers static assets and enforce LF`。
4. 点击 `Commit to main`。
5. 点击 `Push origin`。
6. 等待推送完成后，刷新上面的 GitHub 文件页面，确认配置已经变成 `[assets]`。

## 第五步：修改当前 Cloudflare 项目

当前 Cloudflare 统一入口创建的是 Workers 构建环境。项目已经配置为使用 Workers 静态资源部署，不需要改用 Pages 命令。

回到刚才的 Cloudflare 项目，进入：

```text
Settings → Builds & deployments
```

填写以下配置：

| 配置项 | 填写内容 |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Build output directory | `public`（如果页面要求填写） |
| Root directory | 留空或填 `/` |
| Environment variable | `NODE_VERSION=22.14.0` |

`wrangler.toml` 已经包含：

```toml
[assets]
directory = "./public"
not_found_handling = "404-page"
```

所以 `npx wrangler deploy` 会把 `public` 目录作为静态网站部署，不需要额外的 Worker 代码。

不要使用：

```text
npx wrangler pages deploy public --project-name=hardwarebase-blog
```

当前 Cloudflare 构建令牌没有 Pages 部署权限，这个命令会出现 `Authentication error [code: 10000]`。

保存设置后点击：

```text
Retry deployment
```

## 第六步：部署已经成功

Cloudflare 会自动下载依赖、构建博客并发布网站。

Cloudflare 已经完成首次部署，当前正式网址是：

```text
https://hardwarebase.top
```

打开网址并检查：

- 首页能否正常打开
- 文章能否正常阅读
- 分类、标签和关于页面是否正常
- 手机端是否正常
- 浅色和深色模式是否正常
- 搜索是否可以打开

## 第七步：提交正式网址配置

本地 `_config.yml` 已经更新为：

```yaml
url: https://hardwarebase.top
```

现在打开 GitHub Desktop：

1. 检查 Changes 中是否包含 `_config.yml`、`wrangler.toml`、`.gitattributes` 和部署文档。
2. Summary 填写 `config: set production URL and Cloudflare deployment`。
3. 点击 `Commit to main`。
4. 点击 `Push origin`。
5. 等待 Cloudflare 自动重新部署。

部署完成后打开：

https://hardwarebase.top
## 如果遇到问题

### GitHub Desktop 找不到项目

重新选择这个目录：

```text
H:\ai\codex\web
```

### GitHub Desktop 提示登录

使用 GitHub 账号 `lzpqr` 登录，并在浏览器中完成授权。

### Cloudflare 看不到仓库

回到 GitHub 授权页面，允许 Cloudflare 访问你的 GitHub 仓库。

### Cloudflare 报 Missing entry-point

确认 `wrangler.toml` 包含：

```toml
[assets]
directory = "./public"
not_found_handling = "404-page"
```

确认 Deploy command 是：

```text
npx wrangler deploy
```

### Cloudflare 报 Authentication error code 10000

不要使用 Pages 部署命令。当前构建环境应使用：

```text
npx wrangler deploy
```

然后点击 `Retry deployment`。

### 构建仍然失败

复制 Cloudflare 日志最后 30 行发给我，不要发送密码或 API Token。
## 安全提醒

不要把以下内容发给任何人：

- GitHub 密码
- GitHub 验证码
- GitHub Token
- Cloudflare 密码
- Cloudflare API Token

当前正式网址：https://hardwarebase.top