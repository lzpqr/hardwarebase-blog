const fs = require('fs');
const s = fs.readFileSync('H:/ai/codex/web/source/vendor/fontawesome/css/all.min.css', 'utf8');

// Split into top-level rules. The file is minified: `.sel{...}` blocks
// may be separated by no whitespace, so we track depth and remember the
// position just before the first `{` of each top-level block.
const top = [];
let depth = 0, start = 0;
for (let i = 0; i < s.length; i++) {
  const c = s[i];
  if (c === '{') {
    if (depth === 0) start = i;
    depth++;
  } else if (c === '}') {
    depth--;
    if (depth === 0) {
      // start points to the opening brace; back up to the previous
      // top-level block's closing brace (or 0).
      let j = start;
      while (j > 0 && s[j - 1] !== '}') j--;
      const selStart = j === 0 ? 0 : j; // selector begins right after the previous '}'
      top.push(s.slice(selStart, i + 1));
    }
  }
}
console.log('top-level rules:', top.length);

function selOf(rule) {
  // strip a leading previous block's trailing '}' if the slice included it
  let r = rule;
  const firstOpen = r.indexOf('{');
  return r.slice(0, firstOpen).trim();
}
function bodyOf(rule) {
  const firstOpen = rule.indexOf('{');
  const lastClose = rule.lastIndexOf('}');
  return rule.slice(firstOpen + 1, lastClose);
}

const isBase = r => {
  const sel = selOf(r);
  return sel.startsWith(':root') || sel.startsWith('@font-face') ||
         sel.startsWith('.fa,') || sel.startsWith('svg') ||
         sel.startsWith('html') || sel.startsWith('body') ||
         sel.startsWith('*') || sel === '.fa' ||
         /@supports|@media|@keyframes/.test(sel);
};
const isGlyph = r => /^\.[a-z0-9-]+:before\{content/.test(r.trim());

console.log('base rules:', top.filter(isBase).length);
console.log('glyph rules:', top.filter(isGlyph).length);
const other = top.filter(r => !isBase(r) && !isGlyph(r));
console.log('other rules:', other.length);
other.slice(0, 15).forEach(r => console.log('  ?', r.slice(0, 100)));

// Dump the base rules so we can review them.
const baseBlock = top.filter(isBase);
fs.writeFileSync('H:/ai/codex/web/_fa-base.css', baseBlock.join('\n'));
console.log('base bytes:', baseBlock.join('\n').length);
