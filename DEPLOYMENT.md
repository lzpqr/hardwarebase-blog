# 部署说明

当前项目生成的是纯静态网站，部署时只需要构建命令和静态输出目录，不需要服务器或数据库。

GitHub 仓库创建、Cloudflare Pages 连接和自定义域名的逐步操作，请优先查看 GITHUB-CLOUDFLARE-SETUP.md。

- 构建命令：`npm run build`
- 输出目录：`public`
- 推荐 Node.js：`22.14.0`
- 首选平台：Cloudflare Pages
- 备选平台：Vercel

## 一、部署前检查

1. 确认域名。当前 `_config.yml` 中的网址是占位符：

```yaml
url: https://example.com
```

绑定真实域名后，请改成实际网址，例如：

```yaml
url: https://blog.example.com
```

修改后重新执行：

```bash
npm run clean
npm run build
```

2. 确认没有把密钥提交到 Git 仓库。

3. 确认 `npm run build` 可以在本地成功执行。

## 二、Cloudflare Pages 部署

### 1. 上传代码到 Git 仓库

把项目推送到 GitHub、GitLab 或其他支持的 Git 平台。不要上传 `node_modules/` 和 `public/`。

### 2. 在 Cloudflare Pages 中创建项目

登录 Cloudflare，进入 Pages，选择连接 Git 仓库，然后填写：

| 设置 | 值 |
| --- | --- |
| Framework preset | Hexo 或 None |
| Build command | `npm run build` |
| Build output directory | `public` |
| Node version | `22.14.0` |

如果平台没有自动识别 Node.js 版本，可以添加环境变量：

```text
NODE_VERSION=22.14.0
```

### 3. 首次部署

保存设置并开始部署。构建成功后，Cloudflare 会提供一个临时网站地址。

### 4. 绑定自定义域名

1. 在 Cloudflare Pages 项目的 Custom domains 中添加域名。
2. 根据提示修改域名 DNS 记录。
3. 等待 HTTPS 证书签发。
4. 将 `_config.yml` 中的 `url` 改成正式域名。
5. 重新部署一次，让 canonical、RSS 和 Sitemap 使用新域名。

## 三、Vercel 部署

1. 登录 Vercel，导入 Git 仓库。
2. Framework Preset 选择 `Other`。
3. Build Command 填 `npm run build`。
4. Output Directory 填 `public`。
5. 设置 Node.js 版本为 `22.x`。
6. 部署完成后，在 Domains 中绑定自定义域名。

Vercel 与 Cloudflare Pages 只需要选择一个作为主平台，避免多个平台重复部署造成混乱。

## 四、GitHub Pages 备选方案

如果以后决定使用 GitHub Pages，需要额外完成以下工作：

1. 安装 `hexo-deployer-git` 或编写 GitHub Actions 构建流程。
2. 如果使用项目仓库，例如 `https://username.github.io/blog/`，需要正确设置 `url` 和根路径。
3. 将 `_config.yml` 的 `url` 修改为 GitHub Pages 地址。
4. 每次发布前执行构建并部署 `public/` 内容。

由于当前首选 Cloudflare Pages，项目暂时没有安装 GitHub Pages 部署插件。

## 五、评论系统接入

默认不显示评论区，只有配置服务端地址后才会启用。

推荐使用 Waline：

1. 按照 Waline 官方文档部署服务端。
2. 取得服务端地址。
3. 在 `_config.butterfly.yml` 中填写：

```yaml
comments:
  use: Waline

waline:
  serverURL: https://你的-waline-服务地址
```

4. 重新构建并检查文章页。
5. 没有可用服务端时，保持 `comments.use:` 为空，避免显示错误的评论区。

不要将数据库密码、服务端密钥等敏感信息写入仓库。

## 六、访问统计

项目默认关闭访问统计，也不会主动接入第三方追踪。

如果需要统计，建议选择：

- Umami：界面简洁，可以自行部署
- Cloudflare Web Analytics：如果已经使用 Cloudflare
- 百度统计：适合主要面向中文搜索引擎的站点

无论选择哪一种，都应先确认隐私政策、数据存储位置和中国大陆访问情况。

## 七、图片存储

文章较少时，可以把图片放在文章对应的资源目录中。

文章数量增加后，建议使用：

- Cloudflare R2
- 腾讯云 COS
- 阿里云 OSS
- 七牛云 Kodo

搭配 PicGo 上传，可以减少 Git 仓库体积。

## 八、发布流程

每次发布文章推荐执行：

```bash
npm run clean
npm run build
```

确认本地预览正常后，再提交 Git：

```bash
git add .
git commit -m "post: 新增文章"
git push
```

如果使用 Cloudflare Pages 或 Vercel 的 Git 集成，推送后会自动部署。

## 九、绝不能提交到仓库的内容

- GitHub Token
- Cloudflare API Token
- Waline 服务端密钥
- 数据库密码
- `.env` 和 `.env.*`
- 个人隐私数据
- 未经确认的私密文章和图片

构建产物 `public/` 和依赖目录 `node_modules/` 已在 `.gitignore` 中排除。