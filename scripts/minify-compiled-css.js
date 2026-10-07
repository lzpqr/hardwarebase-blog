// Minify the theme-compiled CSS at render time so BOTH `hexo generate` and
// `hexo server` emit the small version. Butterfly compiles source/css/index.styl
// to CSS through the stylus pipeline; we hook `stylus:renderer` to wrap the
// final render so the emitted CSS is already minified. This covers the dev
// server path that the `postgenerate` npm hook (minify-css.js) cannot reach.
'use strict'

const csso = require('csso')

hexo.extend.filter.register('stylus:renderer', function (style) {
  // Preserve the theme's existing behavior by returning the same style object,
  // but replace its .render so the compiled CSS is minified before being written.
  const originalRender = style.render.bind(style)
  style.render = function (cb) {
    originalRender(function (err, css) {
      if (err || !css) return cb && cb(err)
      try {
        const minified = csso.minify(css, { target: 'ie9' }).css
        return cb && cb(null, minified)
      } catch (e) {
        // Fall back to the unminified CSS rather than break the build.
        return cb && cb(null, css)
      }
    })
  }
  return style
})
