// Helper: minify public/css/index.css in place, and also emit index.min.css
// (csso). Wired into hexo package.json "postgenerate" so it runs on every
// generate. The in-place rewrite matters because the theme's cdn.js forces
// the HTML to link /css/index.css regardless of config overrides.
const csso = require('csso');
const fs = require('fs');
const src = fs.readFileSync('public/css/index.css', 'utf8');
const out = csso.minify(src);
fs.writeFileSync('public/css/index.min.css', out.css);
fs.writeFileSync('public/css/index.css', out.css);
console.log('css minified: ' + src.length + ' -> ' + out.css.length + ' bytes');
