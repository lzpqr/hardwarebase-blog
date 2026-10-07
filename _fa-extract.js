const fs = require('fs');
const s = fs.readFileSync('H:/ai/codex/web/source/vendor/fontawesome/css/all.min.css', 'utf8');
const names = new Set(['adjust','archive','arrows-alt-h','arrow-up','bars','book-open','bullhorn','calendar-alt','chart-line','chevron-left','chevron-right','circle-arrow-left','circle-exclamation','circle-user','clock','cog','envelope','file-word','folder-open','history','home','inbox','layer-group','list-check','list-ul','pulse','search','shake','spinner','square-arrow-up-right','stream','tags','thumbs-up','times','user']);
// Also grab common modifiers and fa-solid base so the font + base classes still apply.
const re = /^\.fa-[a-z0-9-]+[ :{&()=^,;:0-9a-zA-Z'"\\.[\]-]+\{/gm;
const blocks = new Map();
let m;
while (m = re.exec(s)) {
  const name = m[0].match(/^\.fa-([a-z0-9-]+)/)[1];
  if (!blocks.has(name)) blocks.set(name, m[0]);
}
let out = [];
// Keep :root vars, @font-face, fa base class, solid/regular/brand font-family classes
const baseRe = /(^|[{;]|\}\s)(\.fa-solid(?:[ ,{:;]|$)|\.fa-regular(?:[ ,{:;]|$)|\.fa-brands(?:[ ,{:;]|$)|@font-face[^\{]*\{[^}]*\}|:root\{[^}]*\}|\.fa\b[^\{]*\{[^}]*\})/g;
// Simpler: hand-pick with targeted regexes
const fontFace = s.match(/@font-face\{[^}]*fa-regular[^}]*\}/g) || [];
const solidFace  = s.match(/@font-face\{[^}]*fa-solid[^}]*\}/g) || [];
const rootVars   = s.match(/:root\{[^}]*\}/g) || [];
const faBase     = s.match(/\.fa\{[^}]*\}/g) || [];
const fontVars   = s.match(/\.(fa-solid|fa-regular|fa-brands)\{[^}]*\}/g) || [];
const usedBlocks = [...blocks.values()].filter(b => {
  const name = b.match(/^\.fa-([a-z0-9-]+)/)[1];
  return names.has(name);
});
out.push(...rootVars, ...fontFace, ...solidFace, ...faBase, ...fontVars, ...usedBlocks);
fs.writeFileSync('H:/ai/codex/web/_fa-test.css', out.join('\n'));
console.log('raw subset:', fs.statSync('H:/ai/codex/web/_fa-test.css').size, 'bytes');
const csso = require('csso');
const r = csso.minify(out.join('\n'));
fs.writeFileSync('H:/ai/codex/web/_fa-test-min.css', r.css);
console.log('csso-minified:', r.css.length, 'bytes');
console.log('preview:', r.css.slice(0, 400));
