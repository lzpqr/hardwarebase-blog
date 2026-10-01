# 内容维护指南

这份文档说明如何在硬件Base中新增文章、修改页面和维护内容。

## 一、写一篇新文章

推荐使用英文 slug 创建文件，然后在正文中填写中文标题。

```bash
npx hexo new post "my-new-article"
```

创建后，文章会出现在：

```text
source/_posts/
```

打开新文件，先填写完整的 Front Matter。

## 二、推荐的 Front Matter

```yaml
---
title: 我的中文标题
date: 2026-10-01 21:30:00
categories:
  - 硬件
tags:
  - 设备
  - 实践
description: 用一两句话说明文章写了什么，方便首页摘要和搜索引擎展示。
permalink: posts/my-new-article/
cover:
mathjax: false
---
```

字段说明：

| 字段 | 用途 |
| --- | --- |
| `title` | 文章的正式中文标题 |
| `date` | 发布时间，使用 `YYYY-MM-DD HH:mm:ss` |
| `categories` | 主分类，建议每篇使用一个主分类 |
| `tags` | 关键词，可以写多个 |
| `description` | 首页摘要和 SEO 描述 |
| `permalink` | 永久链接，建议使用稳定、简短、可读的英文 slug |
| `cover` | 文章封面，没有时保持为空 |
| `mathjax` | 只有需要数学公式的文章才设为 `true` |

## 三、permalink 规则

发布后不要随意修改 `permalink`，否则旧链接可能失效。

推荐格式：

```text
posts/english-topic-name/
```

例如：

```yaml
permalink: posts/mechanical-keyboard-switch-guide/
```

不要在链接中使用：

- 中文标题
- 空格
- 下划线
- 日期加随机数字
- 会随标题改变的内容

如果文章主题发生变化，优先保留旧链接，并在文中说明。

## 四、分类和标签

分类用于表示文章的主要归属，标签用于串联更细的主题。

可以理解为：

- 分类回答“这篇文章主要属于哪里”
- 标签回答“这篇文章还涉及什么”

建议：

- 每篇文章使用一个主分类。
- 标签控制在 2 到 5 个。
- 不要为了凑标签而添加无关词汇。
- 同类主题尽量复用已有标签。

## 五、图片写法

正文中的图片必须写 alt 文本：

```markdown
![机械键盘轴体结构示意图](/img/example-keyboard.svg)
```

如果使用文章资源目录，可以把图片放在文章同名资源目录中，然后使用相对路径。

建议：

- 图片文件名使用英文和短横线。
- 不要使用“截图1.png”这类无法理解的名称。
- 图片压缩后再上传。
- 图片很多时改用对象存储，不要把大量原图放进 Git 仓库。

## 六、数学公式

需要在文章中使用公式时，在 Front Matter 中加入：

```yaml
mathjax: true
```

行内公式：

```markdown
当电压为 $5V$ 时，电流为 $0.05A$。
```

块级公式：

```markdown
$$
I = \frac{U}{R}
$$
```

只有需要的文章才开启数学公式，避免普通文章加载额外脚本。

## 七、代码块

使用三个反引号并标注语言：

````markdown
```js
const value = 1;
```
````

常用语言标识：

- `js`
- `ts`
- `bash`
- `json`
- `yaml`
- `python`
- `text`

不要在代码块中使用中文全角符号代替代码符号。

## 八、草稿和发布

创建草稿：

```bash
npx hexo new draft "draft-name"
```

预览草稿：

```bash
npx hexo server --draft
```

发布草稿：

```bash
npx hexo publish draft "draft-name"
```

## 九、修改首页和关于页

首页内容主要由以下文件控制：

- `_config.yml`：站点名称、简介、作者和网址
- `_config.butterfly.yml`：首页布局、侧栏、菜单和主题颜色
- 最新文章列表：自动根据文章发布日期生成

关于页位置：

```text
source/about/index.md
```

修改个人介绍、联系方式和站点定位时，直接编辑这个文件。

## 十、修改站点信息

站点主配置位于：

```text
_config.yml
```

常见修改：

- `title`：站点名称
- `subtitle`：首页副标题
- `description`：站点说明和 SEO 描述
- `keywords`：搜索关键词
- `author`：作者名称
- `url`：正式域名
- `per_page`：每页文章数量

主题配置位于：

```text
_config.butterfly.yml
```

常见修改：

- `menu`：顶部导航
- `social`：社交和邮箱链接
- `avatar`：头像
- `theme_color`：主色调
- `search`：本地搜索
- `comments`：评论系统
- `aside`：侧栏内容
- `font`：字号和字体

## 十一、备份

文章是博客最重要的内容。推荐把以下目录和文件提交到 Git：

```text
source/_posts/
source/about/
source/categories/
source/tags/
source/img/
source/css/
_config.yml
_config.butterfly.yml
package.json
package-lock.json
README.md
DEPLOYMENT.md
CONTENT-GUIDE.md
```

可以忽略：

```text
node_modules/
public/
.deploy_git/
.hexo/
db.json
.env
```

建议定期执行：

```bash
git add .
git commit -m "content: 更新文章"
git push
```

如果还没有远程仓库，至少把 `source/_posts/` 和 `source/img/` 复制到移动硬盘或云盘。

## 十二、发布前检查

每篇文章发布前检查：

1. 标题和摘要是否完整。
2. 是否有正确的分类和标签。
3. permalink 是否稳定且可读。
4. 图片是否有 alt 文本。
5. 外链是否可以访问。
6. 事实、数字和引用是否准确。
7. 手机预览是否没有横向滚动。
8. 代码块和表格是否正常显示。
9. 是否包含密码、Token、私密地址或个人隐私。
10. 是否需要设置 `mathjax: true`。

## 十三、重建网站

修改配置或文章后执行：

```bash
npm run clean
npm run build
```

本地预览：

```bash
npm run server
```

部署平台会根据 Git 更新自动重新构建。