// Force Butterfly to use the minified CSS in the final theme config.
// The theme's cdn.js `before_generate` filter rebuilds themeConfig.asset
// via Object.assign and hard-codes main_css to css/index.css, which
// clobbers the `asset.main_css` value from _config.butterfly.yml.
// Hexo runs filter handlers in ascending priority (lower number first).
// The theme's cdn.js handler uses default priority; registering at
// Infinity makes this run strictly after it, so the clobber is undone.
hexo.extend.filter.register('before_generate', function () {
  const themeConfig = this.theme.config
  if (themeConfig && themeConfig.asset) {
    themeConfig.asset.main_css = 'css/index.min.css'
  }
}, { priority: Infinity })

// Dev-server CSS minify (watcher) intentionally removed: the production
// pipeline (postgenerate -> minify-css.js) already writes a minified
// public/css/index.css in place, so the served file is already small.
// A live watcher that rewrites index.css can confuse hexo's file-watcher
// and is not needed on this local setup.
