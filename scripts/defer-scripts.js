// 性能优化：给主题渲染出的所有 <script src="..."> 加 defer。
// 原来 utils.js / main.js / local-search.js 在 </body> 前同步加载，
// 浏览器要等 3 个 JS + 181KB CSS 全部下载执行完才渲染，
// 视觉上表现为"进入网页卡一下"。加 defer 后页面先渲染，JS 后台加载。
hexo.extend.filter.register('after_render:html', function (html) {
  // 匹配 <script src="..."> （不带 defer/async 的），在 > 前插入 defer
  return html.replace(
    /<script\s+([^>]*?src="[^"]*")\s*>/g,
    function (match, attrs) {
      if (attrs.indexOf('defer') !== -1 || attrs.indexOf('async') !== -1) return match;
      return '<script ' + attrs + ' defer>';
    }
  );
});
