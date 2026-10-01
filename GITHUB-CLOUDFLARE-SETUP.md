# GitHub 与 Cloudflare Pages 部署清单

这份清单用于把当前博客从本地项目发布到 GitHub，再由 Cloudflare Pages 自动构建和部署。

## 一、准备账号

需要：

1. GitHub 账号
2. Cloudflare 账号
3. 可用的 Node.js 22.14.0
4. Git 命令行或 GitHub Desktop

当前项目已经初始化 Git 仓库，分支为 `main`，但本机尚未安装正式的 Git 命令行。

## 二、在 GitHub 创建仓库

1. 登录 GitHub。
2. 打开 `https://github.com/new`。
3. 仓库名称建议填写：

```text
hardwarebase-blog
```

4. 仓库可见性选择 Public 或 Private。
5. 不要勾选初始化 README、`.gitignore` 或 License，因为本地项目已经包含这些文件。
6. 创建仓库后，复制仓库地址，例如：

```text
https://github.com/你的用户名/hardwarebase-blog.git
```

## 三、把本地项目推送到 GitHub

如果使用 Git 命令行，在当前项目目录执行：

```bash
git remote add origin https://github.com/你的用户名/hardwarebase-blog.git
git push -u origin main
```

如果 `origin` 已经存在，先检查：

```bash
git remote -v
```

需要修改远程地址时：

```bash
git remote set-url origin https://github.com/你的用户名/hardwarebase-blog.git
```

如果使用 GitHub Desktop：

1. 打开 GitHub Desktop。
2. 选择 Add Existing Repository。
3. 选择当前项目目录。
4. 点击 Publish repository。
5. 选择仓库名称和是否公开。
6. 发布后确认 `main` 分支已经推送。

推送前确认没有提交密钥、Token 或私人文件。

## 四、连接 Cloudflare Pages

1. 登录 Cloudflare。
2. 进入 Workers & Pages。
3. 点击 Create Application。
4. 选择 Pages。
5. 选择 Connect to Git。
6. 授权 Cloudflare 访问 GitHub。
7. 选择 `hardwarebase-blog` 仓库。
8. 开始配置构建。

填写以下参数：

| 配置项 | 值 |
| --- | --- |
| Project name | `hardwarebase-blog` |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `public` |
| Framework preset | Hexo 或 None |

添加环境变量：

```text
NODE_VERSION=22.14.0
```

项目中的 `wrangler.toml` 已经把输出目录设置为 `public`，但仍建议在 Cloudflare 界面再次确认。

## 五、首次部署

保存并开始部署。等待构建完成后，Cloudflare 会提供一个类似下面的地址：

```text
https://hardwarebase-blog.pages.dev
```

打开首页、文章页、分类页、标签页和关于页，确认：

- 页面可以正常打开
- 图片和图标能够显示
- 浅色和深色模式可以切换
- 搜索可以打开
- RSS 和 Sitemap 可以访问

## 六、部署后修改正式网址

把 `_config.yml` 中的：

```yaml
url: https://example.com
```

改成 Cloudflare 地址或自定义域名，例如：

```yaml
url: https://hardwarebase-blog.pages.dev
```

然后提交并推送：

```bash
git add _config.yml
git commit -m "config: 更新正式网址"
git push
```

Cloudflare Pages 会自动重新构建。

## 七、绑定自定义域名

1. 在 Cloudflare Pages 项目中打开 Custom domains。
2. 选择 Add custom domain。
3. 输入已经购买的域名，例如 `blog.example.com`。
4. 按提示配置 DNS。
5. 等待 HTTPS 证书生效。
6. 再次修改 `_config.yml` 中的 `url`。
7. 重新提交并部署。

## 八、以后发布文章

```bash
npm run check
git add source/_posts
git add source/img
git commit -m "post: 新增文章"
git push
```

推送后 Cloudflare Pages 会自动构建和发布。

## 九、不要提交的内容

- GitHub Token
- Cloudflare API Token
- Waline 服务端密钥
- 数据库密码
- `.env` 和 `.env.*`
- 个人隐私数据
- 私密文章和图片

## 十、如果部署失败

先检查：

1. Build command 是否为 `npm run build`。
2. Build output directory 是否为 `public`。
3. Node.js 版本是否为 `22.14.0`。
4. 本地 `npm run check` 是否通过。
5. GitHub Actions 的 Build check 是否通过。
6. Cloudflare 构建日志中是否出现依赖安装失败。

如果 Cloudflare 无法访问依赖源，可以先在本地的 `package-lock.json` 中确认依赖来源，再决定是否更换 npm 镜像或改用 Vercel 作为备选平台。