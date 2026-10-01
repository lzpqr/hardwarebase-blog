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

## 第四步：修改当前 Cloudflare 项目

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

## 第五步：等待部署完成

Cloudflare 会自动下载依赖、构建博客并发布网站。

首次构建通常需要几分钟。部署成功后，会出现一个类似下面的网址：

```text
https://hardwarebase-blog.<你的-workers-子域>.workers.dev
```

打开网址并检查：

- 首页能否正常打开
- 文章能否正常阅读
- 分类、标签和关于页面是否正常
- 手机端是否正常
- 浅色和深色模式是否正常
- 搜索是否可以打开

## 第六步：把正式网址告诉我

把 Cloudflare 生成的 `*.workers.dev` 地址发给我。

我会继续：

1. 更新 `_config.yml` 中的正式网址。
2. 重新执行构建检查。
3. 告诉你需要在 GitHub Desktop 中提交和推送的文件。
4. 再检查 Cloudflare 是否完成部署。
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

只需要把 Cloudflare 最终生成的 `*.pages.dev` 网站地址发给我。