# 硬件Base

一个使用 Hexo 和 Butterfly 搭建的中文个人博客。

- 站点名称：硬件Base
- 作者：哲普
- 站点定位：记录，思考，应用
- 默认语言：简体中文
- 默认时区：Asia/Shanghai

## 技术方案

- Hexo 7
- Butterfly 5
- npm
- Markdown
- Node.js 22 LTS
- Cloudflare Pages 首选部署，Vercel 备选
- 本地搜索、RSS、Sitemap、字数统计、阅读时间
- Font Awesome 已本地化，普通页面不依赖外部图标 CDN

## 本地运行

先安装 Node.js 22.x，然后在本目录执行：

```bash
npm install
npm run server
```

默认预览地址通常是：

```text
http://localhost:4000
```

生成静态文件：

```bash
npm run clean
npm run build
```

构建结果位于 `public/` 目录。

## 常用脚本

| 命令 | 作用 |
| --- | --- |
| `npm run server` | 启动本地预览 |
| `npm run clean` | 清理缓存和构建结果 |
| `npm run build` | 生成生产环境静态文件 |
| `npm run check` | 清理、重新构建并检查本地链接 |
| `npm run verify` | 检查已构建页面的必要文件和本地链接 |
| `npm run deploy` | Hexo 部署命令，当前未配置远程目标 |

## 目录说明

```text
_config.yml                 Hexo 主配置
_config.butterfly.yml       Butterfly 主题覆盖配置
package.json                项目依赖和命令
package-lock.json           锁定依赖版本
source/_posts/              博客文章
source/about/               关于页面
source/categories/          分类页面
source/tags/                标签页面
source/css/custom.css       中文阅读和视觉补充样式
source/img/                 头像、图标和图片占位
source/vendor/fontawesome/  本地图标字体
DEPLOYMENT.md               部署说明
GITHUB-CLOUDFLARE-SETUP.md  GitHub 与 Cloudflare Pages 操作清单
CONTENT-GUIDE.md            写作与内容维护说明`n网站维护指南.md             网站长期更新与维护说明`ntemplates/文章模板.docx         Word 格式文章写作模板`ntemplates/文章模板.md           Markdown 在线发布模板
tools/verify-build.mjs      构建结果与本地链接检查
wrangler.toml               Cloudflare Pages 项目配置
.node-version               Cloudflare 使用的 Node.js 版本
.github/workflows/           GitHub 构建检查
source/_headers              Cloudflare 安全响应头
source/_redirects            Cloudflare 永久跳转规则
public/                     构建后的静态网站，不提交到 Git
```

## 当前内容

项目内当前包含：

1. 欢迎来到硬件Base
2. 我的长期写作计划
3. 硬件设计开发流程：从需求分析到量产导入
4. 硬件设计开发流程：需求分析篇

这些文章可以继续修改或按需要调整。

## 发布前需要修改

1. 当前正式网址已设置为 `https://hardwarebase.top`。
2. 在 `_config.butterfly.yml` 中替换头像或保留当前电路板风格头像。
3. 在 `source/about/index.md` 中补充个人介绍。
4. 在 `_config.butterfly.yml` 中配置 Waline 后再启用评论。
5. 根据实际需要决定是否启用访问统计。

评论和统计默认关闭，不会向第三方发送数据。

## 安全和隐私

- 不要把 GitHub Token、Cloudflare Token、邮箱密码或其他密钥写入仓库。
- `.env`、`.env.*`、构建产物和依赖目录已经加入 `.gitignore`。
- 邮箱是公开联系方式，发布前请确认是否愿意公开。
- 当前正式网址为 `https://hardwarebase.top`。

更详细的操作请查看 `DEPLOYMENT.md`、`GITHUB-CLOUDFLARE-SETUP.md`、`CONTENT-GUIDE.md` 和 `网站维护指南.md`。