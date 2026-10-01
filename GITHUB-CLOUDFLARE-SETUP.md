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

## 第四步：打开 Cloudflare Pages

登录：

https://dash.cloudflare.com/

然后依次操作：

1. 进入 `Workers & Pages`。
2. 点击 `Create application`。
3. 选择 `Pages`。
4. 点击 `Connect to Git`。
5. 授权 Cloudflare 访问 GitHub。
6. 选择仓库：

```text
lzpqr/hardwarebase-blog
```

7. 点击 `Begin setup`。

## 第五步：填写构建配置

按照下面填写，不需要修改其他高级选项：

| 配置项 | 填写内容 |
| --- | --- |
| Project name | `hardwarebase-blog` |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `public` |
| Framework preset | `Hexo` 或 `None` |

在环境变量中添加：

```text
NODE_VERSION=22.14.0
```

然后点击：

```text
Save and Deploy
```

## 第六步：等待部署完成

Cloudflare 会自动下载依赖、构建博客并发布网站。

首次构建通常需要几分钟。部署成功后，会出现一个类似下面的网址：

```text
https://hardwarebase-blog.pages.dev
```

打开这个网址，检查：

- 首页能否正常打开
- 文章能否正常阅读
- 分类、标签和关于页面是否正常
- 手机端是否正常
- 浅色和深色模式是否正常
- 搜索是否可以打开

## 第七步：把正式网址告诉我

把 Cloudflare 提供的 `*.pages.dev` 地址发给我。

我会继续：

1. 更新 `_config.yml` 中的正式网址。
2. 重新执行构建检查。
3. 提交修改。
4. 告诉你在 GitHub Desktop 中如何推送最后的更新。
5. 再检查 Cloudflare 是否完成部署。

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

### Cloudflare 构建失败

复制 Cloudflare 构建日志中的错误信息发给我。不要自行修改构建命令，当前正确配置是：

```text
命令：npm run build
输出目录：public
Node.js：22.14.0
```

## 安全提醒

不要把以下内容发给任何人：

- GitHub 密码
- GitHub 验证码
- GitHub Token
- Cloudflare 密码
- Cloudflare API Token

只需要把 Cloudflare 最终生成的 `*.pages.dev` 网站地址发给我。